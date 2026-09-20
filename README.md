# Kanzpay PACT sandbox prototype

Fresh, sandbox-only vertical slice for the approved first journey:

```text
seller signed basket → buyer scan/tap → deterministic verified-benefit match
→ safe rail selection → approve/STOP → mock settlement → receipt reconciliation
```

## Run locally

Requires Node.js 22+.

```bash
npm run dev
```

Open `http://localhost:3000/`.

## API contract surface

- `GET /api/bootstrap` — sandbox buyer, seller, basket, entitlements, rails, and audit state.
- `POST /api/solver/preview` — creates an approval-bound quote.
- `POST /api/checkout/approve` — settles the active quote once.
- `POST /api/checkout/stop` — revokes the active quote without payment.
- `POST /api/reconcile` — returns deterministic receipt-to-transaction matching.

The demo deliberately has no live payment capability, raw payment credentials, or external provider secrets. Money is represented as integer minor units. Tier C evidence is displayed as possible savings and cannot affect the guaranteed price.
