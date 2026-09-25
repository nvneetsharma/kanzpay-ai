# Kanzpay rebuild plan

## What the supplied flows mean

Kanzpay is not a banking dashboard. It is a guided value journey:

- A buyer taps a seller K-Tag, shares approved benefit signals, receives a priced invoice, reviews the savings and reward result, and approves payment.
- A seller starts with a K-Assistant, configures the value it can apply, sends an invoice before printing it, and then operates from four simple views: orders, catalogue, inventory/finance, and payment instruments.
- Account creation is the identity boundary. Kanzpay does not perform regulated KYC.
- Every source is optional and connected one at a time. Connected sources create usable savings signals; unavailable sources remain visible as missed opportunities.

## Delivery plan

### 1. Fresh visual shell

- Replace the old text-heavy prototype surface.
- Use the supplied human-life imagery as scene cards and backgrounds.
- Keep headings to two or three words.
- Use one primary action per screen.
- Add connected gold paths, breathing motion, coin/reward moments, and short appreciation feedback.
- Make the default experience light, spacious, and mobile-first.

### 2. Buyer journey

1. Tap or scan to start.
2. Verify mobile and email with simulated OTP.
3. Connect reward programmes and permissions one at a time.
4. Connect memberships, vouchers and offers.
5. Evaluate payment instruments and show the best route.
6. Create the account and reveal the Gold vault.
7. Tap a seller K-Tag, approve the exchange, review the invoice, then approve or stop.
8. Show saved amount, points earned, updated points, Gold, receipt and next useful action.

### 3. Seller journey

1. Start onboarding with business details and account creation.
2. Activate K-Assistant and configure accepted rewards, memberships, vouchers and payment routes.
3. Receive the buyer's approved signals and build the invoice before printing.
4. Push the invoice through K-Tag or mobile number.
5. Track paid, rejected, in-process and pending states.
6. Operate the store cockpit: orders, catalogue, inventory, finance and payment instruments.

### 4. Permission and integration boundary

The browser build can request camera and notification permission and can accept explicit file/import inputs. Bank, card, email, SMS, app-notification, membership and reward data require their official OAuth/API providers; the app will show the exact source, permission, connected result, provenance and locked opportunity instead of pretending OTP grants access.

### 5. Verification

- Exercise the buyer and seller journeys at a mobile viewport.
- Verify API, catalogue, source connection and invoice paths.
- Run the existing test suite plus focused flow checks.
- Push the rebuilt app to GitHub and verify the Vercel release.
