# Kanzpay PACT sandbox prototype

Fresh, sandbox-only vertical slice for the approved first journey:

```text
buyer account → tap seller K-Tag → approved benefit exchange → seller invoice
→ deterministic verified-benefit match → approve/STOP → mock settlement
→ Gold/points update → receipt reconciliation
```

## Run locally

Requires Node.js 22+.

```bash
npm run dev
```

Open `http://localhost:3000/`.

## API contract surface

- `GET /api/bootstrap` — sandbox buyer, seller, basket, entitlements, rails, and audit state.
- `POST /api/account/create` — creates a sandbox account; this is not KYC.
- `POST /api/tap/exchange` — records a buyer tap on a seller K-Tag and the buyer-approved capability signals.
- `POST /api/invoice/create` — creates a seller invoice from the exchanged signals and returns discounts, payable amount, points earned and post-purchase points.
- `POST /api/solver/preview` — creates an approval-bound quote.
- `POST /api/checkout/approve` — settles the active quote once.
- `POST /api/checkout/stop` — revokes the active quote without payment.
- `POST /api/reconcile` — returns deterministic receipt-to-transaction matching.

The demo deliberately has no live payment capability, raw payment credentials, or external provider secrets. Money is represented as integer minor units. Tier C evidence is displayed as possible savings and cannot affect the guaranteed price.

The tap exchange only carries derived/tokenized eligibility labels such as membership, reward identity, voucher/promo availability, card/BIN eligibility and safe payment-rail availability. It never carries PAN, CVV, bank credentials or payment secrets.

## Provider boundary

The current app is a local sandbox: OTPs, app/SMS/email permissions, BIN intelligence, reward balances, offer discovery, print-share ingestion, barcode matching and catalogue enrichment are fixtures, not live fetches. A production implementation must add separately authenticated provider adapters with explicit consent, source timestamps, revocation, rate limits and user review before any signal is shared with a seller or applied to an invoice.
