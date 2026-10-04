# KanzPay PWA — API Connector Guide

How the existing KanzPay backend connects to this module so data flows both ways while the PWA runs its features for the user.

## 1. Model

This module is a **capability layer**, not a replacement backend. Your existing app stays the system of record; the PWA calls your APIs through the connectors below (or its own sandbox when you don't respond). Two integration styles, mix freely:

- **Pull** — the PWA calls your endpoints (vault, catalogue, invoices, customers).
- **Push** — your backend pushes events (invoice issued, payment settled, alert raised) and the PWA renders them.

All endpoints are JSON. Sandbox returns identical shapes, so your client code doesn't change when you go live.

## 2. SSO

`POST /api/sso/token` — exchange your authenticated user for a PWA session token.

```json
{ "externalUserId": "user-88231", "provider": "kanzpay", "scopes": ["profile:read","vault:read","pay:execute"] }
→ 201 { "token": "kzsso-…", "expiresInSec": 900, "issuedTo": "…" }
```

Recommended production flow (OAuth2-style):

1. Your app opens the PWA link with `?sso=<one-time-code>`.
2. PWA calls `POST /api/sso/token` with `externalUserId` + code; your backend validates and returns the token + refresh.
3. All subsequent API calls carry `Authorization: Bearer kzsso-…`.
4. Token expiry → silent re-issue via your IdP session (no re-login).

If no SSO is configured, the PWA runs in sandbox identity — journeys and features all still work.

## 3. Data sync

| Direction | Endpoint | Body / Returns |
|---|---|---|
| PWA → your app | `GET /api/sync/export` | Full state snapshot: `buyer`, `seller`, `vault`, `catalogue`, `cards`, `adminSettings`, `auditTail` |
| your app → PWA | `POST /api/sync/import` | `{ buyer?, vault?, catalogue?, sellerSettings?, buyerSettings? }` → `{ status: "APPLIED", applied: [...] }` |

Sync policy: call `import` after any mutation in your system (invoice created, points changed, SKU added). The PWA calls `export` before it computes best-value, so pricing always reflects your latest rules. `dataSync` admin toggle (both roles) gates this per user.

## 4. Feature endpoints (contract)

**Buyer journey**
- `POST /api/otp/send` `{ mobile?, email? }` → `SENT` (sandbox codes 4271/9038)
- `POST /api/otp/verify` → `VERIFIED` + `goldAward`
- `GET /api/vault` → sections with `connected | discoverable | grey`
- `POST /api/vault/connect` `{ id }`
- `POST /api/account/kyc` `{ step: emirates-id-front|emirates-id-back|live-camera|aml-check }` → `ACCOUNT_CREATED`
- `GET /api/stores` → geo-sorted stores + offers
- `POST /api/tap/exchange` `{ kTag, buyerId, capabilities[] }` — NFC/QR tap
- `POST /api/invoice/create` → priced invoice with applied discounts
- `POST /api/intelligence/best-value` `{ amountMinor }` → best membership/points/voucher/gold + recommended rail
- `POST /api/solver/preview` → quote (`AWAITING_APPROVAL`)
- `POST /api/checkout/approve` / `POST /api/checkout/stop` → settle or revoke
- `GET /api/intelligence/expenses` → categories, trend, lifestyle note
- `GET /api/offers/nearby` → location-based offers
- `POST /api/ktag/navigate` → store route

**Visiting cards**
- `POST /api/card/create` `{ name, profile, template, mobile, … }`
- `GET /api/cards`
- `POST /api/card/exchange` `{ via: nfc|qr }` → their card back

**Seller journey**
- `POST /api/seller/catalogue/import` `{ source: invoice|menu|inventory, items? }` → auto-catalogue
- `GET /api/seller/dashboard` → `focus` (commission, tickets, rewards, trends, customers) + `intelligence` (catalogue, inventory, finance, instruments)
- `GET /api/seller/insights` → P&L, expense heads, trend, top products
- `GET /api/seller/alerts` → `grouped: { inventory, payments, business }`
- `GET /api/seller/customers` → segments + rewards issued
- `POST /api/seller/offer/grant` `{ customerId, points, goldMg }`

**Admin / controls**
- `GET /api/admin/settings` → `{ buyer: {...}, seller: {...} }`
- `POST /api/admin/settings` `{ scope, settings }` — every toggle is honoured by the next API call

## 5. Field conventions

- Money is always integer **minor units** (fils): `AED 66.00` → `6600`.
- Gold weight in mg: `goldMg`; value in `goldMinor` (fils).
- Statuses are enums — don't invent new strings; extend via `payload` extras (ignored safely).

## 6. Webhooks (push)

When your backend produces an event, `POST /api/events { type, payload }` → `202 ACCEPTED`. Live today: `alert.raised` (lands in the seller alerts feed). Mapped by convention: `invoice.issued` → buyer review, `settlement.done` → success + gold credit, `vault.changed` → vault refresh. The PWA also reads `sync/export` on screen entry — near-real-time for testing either way.

## 7. Environment

- Preview: `https://kanzpay-pact-prototype-git-devin-gold-pwa-journeys-kanz-pay.vercel.app`
- Every endpoint also runs in-memory sandbox — develop against it with zero credentials.
