const app = document.querySelector('#app');
const toast = document.querySelector('#toast');

const state = {
  role: null,
  screen: 'home',
  buyer: null,
  seller: null,
  sources: [],
  catalogue: [],
  invoice: null,
  receipt: null,
  sellerStep: 0,
  buyerStep: 0,
  account: null,
  selectedModule: null,
  sellerInvoiceStatus: 'pending'
};

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
}[char]));
const money = (minor) => `AED ${(Number(minor || 0) / 100).toFixed(2)}`;
const notify = (message, kind = '') => {
  toast.textContent = message;
  toast.className = `toast show ${kind}`;
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => { toast.className = 'toast'; }, 2600);
};
const get = async (path) => (await fetch(path)).json();
const post = async (path, payload = {}) => {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
};

function particles() {
  return `<div class="particle-field">${Array.from({ length: 42 }, (_, index) => `<i style="--i:${index};--x:${(index * 29) % 100}%;--y:${(index * 47) % 100}%;--d:${2.6 + (index % 5) * .45}s"></i>`).join('')}</div>`;
}

function shell(content, options = {}) {
  const { back = false, eyebrow = 'KANZPAY · VALUE LAYER' } = options;
  return `<div class="app-shell ${state.role ? `${state.role}-mode` : ''}">${particles()}
    <header class="topbar">
      <button class="wordmark" data-action="home"><span class="mark">K</span><span>Kanzpay</span></button>
      <div class="topbar-center"><span class="signal-dot"></span>${eyebrow}</div>
      <div class="topbar-actions">
        <button class="role-pill ${state.role === 'buyer' ? 'selected' : ''}" data-action="role" data-role="buyer">Buyer</button>
        <button class="role-pill ${state.role === 'seller' ? 'selected' : ''}" data-action="role" data-role="seller">Seller</button>
        ${back ? '<button class="back-button" data-action="back">←</button>' : ''}
      </div>
    </header>${content}<footer class="footer">A calm, intelligent value layer · Built in the UAE</footer>
  </div>`;
}

function home() {
  return `<main class="home"><section class="home-copy">
    <div class="eyebrow">THE VALUE LAYER FOR EVERYDAY LIFE</div>
    <h1>More value.<br><em>Less effort.</em></h1>
    <p class="home-lead">Follow the journey exactly as mapped: buyers build a Value Vault, sellers run every transaction through K-Assistant.</p>
    <div class="role-cards">
      <button class="role-card buyer-card" data-action="role" data-role="buyer"><span class="card-kicker">BUYERS · JOURNEY 01</span><strong>Build your<br><em>Value Vault.</em></strong><small>Tap, connect, earn, redeem.</small><span class="card-arrow">↗</span></button>
      <button class="role-card seller-card" data-action="role" data-role="seller"><span class="card-kicker">SELLERS · JOURNEY 02</span><strong>Run your store<br><em>with intelligence.</em></strong><small>Install K-Assistant and grow.</small><span class="card-arrow">↗</span></button>
    </div>
    <button class="story-link" data-action="role" data-role="buyer"><span class="story-icon">✦</span> Start the buyer journey</button>
  </section><section class="home-art"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
    <div class="golden-orb"><span>Au</span><small>24K<br>VALUE</small></div><div class="art-label label-top">FLOWING INTELLIGENCE <i></i></div><div class="art-label label-bottom">1 mg Gold · starts here <i></i></div>
    <div class="art-card card-float"><span>VALUE VAULT</span><strong>AED 6.60</strong><small>discoverable savings</small><i>+66 points</i></div>
  </section></main>`;
}

function journeyHeader(step, total, title, copy) {
  return `<div class="journey-header"><div class="step-badge">${String(step).padStart(2, '0')} <span>/ ${String(total).padStart(2, '0')}</span></div><span class="eyebrow">${title}</span><p>${copy}</p></div>`;
}

function choiceCard(action, icon, title, copy, tag = '') {
  return `<button class="choice-card" data-action="${action}"><span class="choice-icon">${icon}</span><span><b>${title}</b><small>${copy}</small></span>${tag ? `<em>${tag}</em>` : '<strong>→</strong>'}</button>`;
}

function buyerStart() {
  return shell(`<main class="journey-page split-page"><section class="journey-art dark-art"><div class="golden-orb small-orb"><span>K</span><small>TAP OR<br>SCAN</small></div><div class="art-caption">YOUR VALUE JOURNEY<br><em>starts here.</em></div></section><section class="journey-panel">
    ${journeyHeader(1, 4, 'BUYER · START JOURNEY', 'Tap or scan to enter your Value Vault.')}
    <div class="form-card"><label>How do you want to start?</label>${choiceCard('buyer-tap', '⌁', 'Tap a K-Tag', 'Start instantly at a Kanzpay-ready seller.', 'TAP')} ${choiceCard('buyer-scan', '⌗', 'Scan a QR code', 'Open a seller or partner journey from camera.', 'SCAN')}</div>
    <button class="quiet-button" data-action="buyer-account">Already have an account? Sign in</button>
  </section></main>`, { eyebrow: 'BUYER · TAP OR SCAN', back: true });
}

function buyerCheckUser() {
  return shell(`<main class="journey-page split-page"><section class="journey-art gold-art"><div class="glass-phone"><span>WELCOME BACK</span><strong>Kanzpay<br><em>knows your value.</em></strong><small>Secure identity check</small></div></section><section class="journey-panel">
    ${journeyHeader(2, 4, 'BUYER · CHECK USER', 'Choose whether you are an existing user or building your Value Vault for the first time.')}
    <div class="form-card"><label>Are you an existing Kanzpay user?</label>${choiceCard('buyer-existing', '◈', 'Yes, continue', 'Use your saved Value Vault and connected benefits.')} ${choiceCard('buyer-new', '✦', 'No, build my vault', 'Start with a simple secure account setup.')}</div>
  </section></main>`, { eyebrow: 'BUYER · CHECK USER', back: true });
}

function buyerOtp() {
  return shell(`<main class="journey-page split-page"><section class="journey-art dark-art"><div class="otp-orbit">K<span>✦</span></div><div class="art-caption">ONE TIME<br><em>verification.</em></div></section><section class="journey-panel">
    ${journeyHeader(2, 4, 'BUYER · OTP VERIFY', 'We use a one-time code to protect your account and your value.')}
    <div class="form-card"><label>Email or mobile number</label><input class="text-input" value="maya@example.com"><label>Verification code</label><div class="otp-inputs"><input value="2"><input value="4"><input value="8"><input value="6"></div><button class="gold-button wide" data-action="buyer-vault">Verify and continue <span>↗</span></button><small class="helper">Sandbox demo: any four digits continue.</small></div>
  </section></main>`, { eyebrow: 'BUYER · OTP VERIFY', back: true });
}

function buyerVaultSetup() {
  return shell(`<main class="journey-page split-page"><section class="journey-art gold-art"><div class="vault-card"><span>YOUR VALUE VAULT</span><strong>1 mg<br><em>Gold credited.</em></strong><small>Earn more · Save more</small></div></section><section class="journey-panel">
    ${journeyHeader(2, 4, 'BUYER · BUILD MY VALUE VAULT', 'Choose the sources Kanzpay may check. You approve every connection.')}
    <div class="form-card"><label>Connect your value sources</label><div class="check-list">${['Memberships and discounts', 'Reward points', 'Promo codes', 'Vouchers and coupons', 'Cards and payment instruments', 'Accounts and preferred rails'].map((item, index) => `<label class="check-row"><input type="checkbox" checked><span>${item}</span><i>${index < 4 ? 'Ready' : 'Optional'}</i></label>`).join('')}</div><button class="gold-button wide" data-action="buyer-cockpit">Save my Value Vault <span>↗</span></button></div>
  </section></main>`, { eyebrow: 'BUYER · VALUE VAULT', back: true });
}

function buyerDashboard() {
  const buyer = state.buyer || { name: 'Maya Khan', points: 1840, goldMinor: 1260 };
  const modules = [
    ['buyer-module', '✦', 'My Value Vault', 'Memberships, reward points, promo codes and vouchers.'],
    ['buyer-card', '▣', 'My Visiting Card', 'Share your profile with a trusted contact.'],
    ['buyer-friends', '♧', 'Earn with friends', 'Invite, share and grow value together.'],
    ['buyer-gold', 'Au', 'My Gold Vault', 'Track gold weight and value earned.'],
    ['buyer-expenses', '⌁', 'My Expenses', 'See daily, weekly, monthly and yearly patterns.'],
    ['buyer-instruments', '◌', 'Payment intelligence', 'Choose the best rail for every purchase.']
  ];
  return shell(`<main class="dashboard"><div class="dashboard-hero buyer-hero"><div class="dashboard-heading"><span class="eyebrow">BUYER COCKPIT · VALUE VAULT</span><h1>${esc(buyer.name.split(' ')[0])}, your value<br><em>is already moving.</em></h1><p>All approved modules live in one calm, flowing cockpit.</p></div><div class="gold-balance"><span class="gold-coin">Au</span><div><small>MY GOLD VAULT</small><strong>${(buyer.goldMinor / 1000).toFixed(3)} mg</strong><em>+0.066 this month</em></div></div></div>
    <div class="dashboard-nav"><button class="active">Cockpit</button><button data-action="buyer-module">My Value Vault</button><button data-action="buyer-savings">Connections</button><button data-action="buyer-expenses">Expenses</button></div>
    <section class="metric-grid"><article class="metric-card metric-gold"><small>MY REWARD POINTS</small><strong>${buyer.points.toLocaleString()}</strong><span>points · +12% this month</span><i>◎</i></article><article class="metric-card metric-save"><small>VALUE FOUND</small><strong>AED 42.80</strong><span>across 8 transactions</span><i>⌁</i></article><article class="metric-card metric-insight"><small>GOLD WEIGHT</small><strong>${(buyer.goldMinor / 1000).toFixed(3)} <b>mg</b></strong><span>updated today</span><i>✦</i></article></section>
    <section class="cockpit-module-grid">${modules.map(([action, icon, title, copy]) => `<button class="module-card" data-action="${action}"><span class="module-icon">${icon}</span><span><b>${title}</b><small>${copy}</small></span><strong>→</strong></button>`).join('')}</section>
    <section class="feature-grid"><article class="feature-card tap-card"><div><span class="eyebrow">AT THE COUNTER</span><h2>Bring your<br><em>value with you.</em></h2><p>Tap a seller K-Tag and review every approved benefit before paying.</p><button class="gold-button" data-action="checkout">Try Luma Market <span>↗</span></button></div><div class="tap-visual"><div class="tap-ring"></div><span class="ktag">K<span>•</span></span><small>LUMA MARKET</small></div></article><article class="value-card"><span class="eyebrow">LIVE VALUE</span><h2>What can<br><em>find you?</em></h2><div class="source-row"><span>✦</span><div><b>Fazaa membership</b><small>Ready to apply</small></div><strong>− AED 4.20</strong></div><div class="source-row"><span>◇</span><div><b>Visa BIN offer</b><small>Ready to apply</small></div><strong>− AED 1.80</strong></div><button class="text-button" data-action="buyer-savings">Open value map →</button></article></section>
  </main>`, { eyebrow: 'BUYER · COCKPIT', back: true });
}

function buyerModule() {
  const module = state.selectedModule || 'My Value Vault';
  const rows = [
    ['My Memberships', 'Fazaa · Active', '− AED 4.20'],
    ['My Reward Points', '1 point / AED', '1,840 pts'],
    ['My Promocodes', '2 eligible codes', 'Review'],
    ['My Vouchers', '3 coupons saved', 'Review']
  ];
  return shell(`<main class="detail-page"><div class="page-heading"><span class="eyebrow">BUYER COCKPIT · ${module.toUpperCase()}</span><h1>Your value,<br><em>organized.</em></h1><p>Every connected program is visible, explainable and permissioned.</p></div><section class="detail-list">${rows.map(([name, status, value]) => `<article class="detail-row"><span class="module-icon">✦</span><div><b>${name}</b><small>${status}</small></div><strong>${value}</strong><button class="text-button">Open →</button></article>`).join('')}</section><button class="gold-button" data-action="buyer-home">Back to cockpit <span>↗</span></button></main>`, { eyebrow: 'BUYER · VALUE VAULT', back: true });
}

function buyerDetail(title, eyebrow, icon, copy, content) {
  return shell(`<main class="detail-page"><div class="detail-hero"><span class="module-icon">${icon}</span><span class="eyebrow">${eyebrow}</span><h1>${title}<br><em>in one view.</em></h1><p>${copy}</p></div><section class="detail-content">${content}</section><button class="gold-button" data-action="buyer-home">Back to cockpit <span>↗</span></button></main>`, { eyebrow, back: true });
}

function buyerSavings() {
  const sources = state.sources.length ? state.sources : [
    { id: 'cards', icon: '◇', label: 'Cards & BIN offers', benefit: 'Find issuer discounts before you pay.', status: 'discoverable' },
    { id: 'memberships', icon: '✦', label: 'Memberships', benefit: 'Apply member pricing automatically.', status: 'discoverable' },
    { id: 'rewards', icon: '◎', label: 'Reward programmes', benefit: 'Use points and keep balances together.', status: 'discoverable' },
    { id: 'email', icon: '✉', label: 'Email offers', benefit: 'Find vouchers and promo codes.', status: 'locked' }
  ];
  return shell(`<main class="map-page"><div class="page-heading"><span class="eyebrow">BUYER · VALUE VAULT CONNECTIONS</span><h1>Choose what<br><em>can help you.</em></h1><p>Icons stay faded until you connect a source. Nothing moves without your approval.</p></div><div class="map-total"><span>DISCOVERED VALUE</span><strong>AED 6.60</strong><small>ready across your approved sources</small></div><section class="source-list">${sources.map((source) => `<button class="source-item ${source.status}" data-action="source" data-source="${esc(source.id)}"><span class="source-icon">${source.icon}</span><div><b>${esc(source.label)}</b><small>${esc(source.benefit)}</small></div><strong>${source.status === 'connected' ? 'Connected' : source.status === 'locked' ? 'Locked' : 'Connect'} <span>→</span></strong></button>`).join('')}</section><button class="quiet-button" data-action="buyer-home">← Back to cockpit</button></main>`, { eyebrow: 'BUYER · VALUE VAULT', back: true });
}

function checkout() {
  if (!state.invoice) return shell(`<main class="checkout"><section class="checkout-visual"><div class="checkout-glass"><span class="eyebrow">LUMA MARKET · K-TAG</span><div class="checkout-orb">K</div><div class="scan-line"></div><h2>Tap.<br><em>Review. Decide.</em></h2><p>The seller sees only the approved signals that help price your basket.</p></div></section><section class="checkout-panel"><span class="eyebrow">BUYER · TAP K-TAG</span><h1>A better price<br><em>is waiting.</em></h1><div class="trust-list"><span>✦ Membership pricing</span><span>◇ Card-linked offers</span><span>◎ Reward points</span><span>⌁ Safer payment rails</span></div><button class="gold-button wide" data-action="create-invoice">Tap Luma K-Tag <span>↗</span></button><button class="quiet-button" data-action="buyer-home">← Back to cockpit</button></section></main>`, { eyebrow: 'BUYER · TAP', back: true });
  const invoice = state.invoice;
  return shell(`<main class="checkout"><section class="checkout-visual invoice-visual"><div class="invoice-glass"><span class="eyebrow">INVOICE READY · #${esc(invoice.reference || '1048')}</span><h2>Review the<br><em>good part.</em></h2><div class="invoice-preview"><div><span>Basket</span><b>${money(invoice.grossMinor)}</b></div><div class="discount"><span>Fazaa member</span><b>− ${money(420)}</b></div><div class="discount"><span>Visa BIN offer</span><b>− ${money(180)}</b></div><div class="invoice-total"><span>Final amount</span><strong>${money(invoice.payableMinor)}</strong></div></div></div></section><section class="checkout-panel"><span class="eyebrow">BUYER · APPROVE INVOICE</span><h1>Good value,<br><em>before pay.</em></h1><div class="reward-panel"><small>YOU GET BACK</small><strong>+${invoice.pointsEarned}</strong><span>points · ${money(invoice.goldEarnedMinor)} Gold</span><i>Balance after: ${invoice.pointsAfterPurchase.toLocaleString()} points</i></div><div class="rail-note"><span>●</span><div><b>Recommended rail · ${esc(invoice.selectedRail?.name || 'Aani')}</b><small>Safe, instant account-to-account · no fee</small></div></div><button class="gold-button wide" data-action="approve">Approve & pay <span>↗</span></button><button class="quiet-button" data-action="stop">Stop · don’t pay</button></section></main>`, { eyebrow: 'BUYER · APPROVE INVOICE', back: true });
}

function receipt() {
  const result = state.receipt || {};
  return shell(`<main class="receipt-page"><div class="receipt-check">✓</div><span class="eyebrow">PAYMENT COMPLETE · RECEIPT MATCHED</span><h1>Good<br><em>choice.</em></h1><p class="receipt-lead">Your value came back before the transaction left the room.</p><section class="receipt-summary"><div><span>Luma Market · LM-1048</span><strong>${money(result.paidMinor || 6600)}</strong></div><div class="receipt-stats"><article><b>− AED 6.00</b><small>saved</small></article><article><b>+${result.rewards?.points || 66}</b><small>points</small></article><article><b>+0.066</b><small>mg Gold</small></article></div><p>Receipt reconciled automatically · confidence 98%</p></section><button class="gold-button" data-action="buyer-home">Back to buyer cockpit <span>↗</span></button></main>`, { eyebrow: 'BUYER · RECONCILED RECEIPT' });
}

function sellerStart() {
  return shell(`<main class="journey-page split-page"><section class="journey-art gold-art"><div class="seller-logo-card"><span>K-ASSISTANT</span><strong>Luma<br><em>Market</em></strong><small>SELLER SETUP</small></div></section><section class="journey-panel">
    ${journeyHeader(1, 4, 'SELLER · START ONBOARDING', 'Install K-Assistant, choose your business type and make your store visible to value-seeking buyers.')}
    <div class="form-card"><label>Business details</label><div class="field-grid"><div><small>Business type</small><b>Retail & cafe</b></div><div><small>Location</small><b>Dubai Marina</b></div><div><small>Logo</small><b>Ready to add</b></div><div><small>K-Tag</small><b>K-LUMA-001</b></div></div><button class="gold-button wide" data-action="seller-install">Install K-Assistant <span>↗</span></button></div>
  </section></main>`, { eyebrow: 'SELLER · START ONBOARDING', back: true });
}

function sellerInstall() {
  return shell(`<main class="journey-page split-page"><section class="journey-art dark-art"><div class="assistant-orbit"><span>K</span><i>✦</i><i>Au</i></div><div class="art-caption">BACKGROUND<br><em>intelligence.</em></div></section><section class="journey-panel">
    ${journeyHeader(1, 4, 'SELLER · INSTALL K-ASSISTANT', 'Choose your device and let Kanzpay work quietly in the background.')}
    <div class="form-card"><label>Where should K-Assistant run?</label>${choiceCard('seller-docs', '⌘', 'Mobile or desktop', 'Android, iOS, Mac or Windows.', 'SELECTED')}${choiceCard('seller-docs', '⌗', 'Scan K-Tag', 'Connect your physical store identifier.', 'READY')}<div class="success-note">K-Assistant installed in sandbox mode. Next: verify your business.</div><button class="gold-button wide" data-action="seller-docs">Continue to verification <span>↗</span></button></div>
  </section></main>`, { eyebrow: 'SELLER · K-ASSISTANT', back: true });
}

function sellerDocs() {
  return shell(`<main class="journey-page split-page"><section class="journey-art gold-art"><div class="document-stack"><span>EMIRATES ID</span><strong>✓</strong><small>AML CHECK READY</small></div></section><section class="journey-panel">
    ${journeyHeader(1, 4, 'SELLER · VERIFY BUSINESS', 'Upload the required documents. In production, the camera guides cropping, editing and identity matching.')}
    <div class="form-card"><label>Required documents</label>${['Emirates ID · front', 'Emirates ID · back', 'Commercial licence'].map((item) => `<div class="upload-row"><span>▧</span><div><b>${item}</b><small>Camera or upload · document crop and edit</small></div><strong>Uploaded</strong></div>`).join('')}<div class="success-note">Photo match and AML check passed for this sandbox journey.</div><button class="gold-button wide" data-action="seller-rules">Continue to reward rules <span>↗</span></button></div>
  </section></main>`, { eyebrow: 'SELLER · DOCUMENT CHECK', back: true });
}

function sellerRules() {
  return shell(`<main class="journey-page split-page"><section class="journey-art gold-art"><div class="rules-card"><span>VALUE RULES</span><strong>12%<br><em>back to buyers.</em></strong><small>YOUR STORE · VERSION 12</small></div></section><section class="journey-panel">
    ${journeyHeader(2, 4, 'SELLER · SET VALUE RULES', 'Choose how membership discounts, vouchers, points and preferred payment instruments work.')}
    <div class="form-card"><label>Buyer value settings</label><div class="rule-grid large-rules"><span>Membership discounts <b>12%</b></span><span>Voucher / promo codes <b>Allowed</b></span><span>Reward points value <b>1 point / AED</b></span><span>Preferred instruments <b>Enabled</b></span><span>Gold earn rate <b>GMV AED ÷ 1000</b></span><span>Points earn rate <b>GMV AED ÷ 100</b></span></div><button class="gold-button wide" data-action="seller-invoice">Generate invoice <span>↗</span></button></div>
  </section></main>`, { eyebrow: 'SELLER · VALUE RULES', back: true });
}

function sellerInvoice() {
  return shell(`<main class="journey-page split-page"><section class="journey-art dark-art"><div class="invoice-sheet"><span>INVOICE READY</span><strong>AED 66.00</strong><small>LM-1048 · MAYA KHAN</small><i>− AED 6.00 value applied</i></div></section><section class="journey-panel">
    ${journeyHeader(2, 4, 'SELLER · SHARE INVOICE', 'Generate the buyer-ready invoice and share it through print, K-Assistant or QR.')}
    <div class="form-card"><div class="invoice-mini"><span>LM-1048 · MAYA KHAN</span><strong>AED 66.00</strong><small>Membership + card value applied</small></div>${choiceCard('seller-status', '⌁', 'Share via K-Assistant', 'Send the invoice to the buyer instantly.')} ${choiceCard('seller-status', '▤', 'Print or QR', 'Give the buyer a physical or scannable copy.')}</div>
  </section></main>`, { eyebrow: 'SELLER · INVOICE READY', back: true });
}

function sellerStatus() {
  const statuses = [['pending', 'Pending', 'Waiting for buyer approval'], ['paid', 'Paid', 'Buyer approved and settlement matched'], ['rejected', 'Rejected', 'Buyer chose not to continue'], ['process', 'In process', 'K-Assistant is checking the next action']];
  return shell(`<main class="status-page"><div class="page-heading"><span class="eyebrow">SELLER · VIEW STATUS OF INVOICE</span><h1>Every invoice,<br><em>clear at a glance.</em></h1><p>Use the status to decide whether to markbook, ask the buyer’s reason or check the next process.</p></div><div class="status-grid">${statuses.map(([id, title, copy]) => `<button class="status-card ${state.sellerInvoiceStatus === id ? 'active' : ''}" data-action="seller-status-select" data-status="${id}"><i></i><div><b>${title}</b><small>${copy}</small></div><strong>${id === 'paid' ? 'Open receipt →' : id === 'rejected' ? 'Ask why →' : 'View →'}</strong></button>`).join('')}</div><div class="status-actions"><button class="gold-button" data-action="seller-dashboard">Open business cockpit <span>↗</span></button><button class="quiet-button" data-action="seller-status">Refresh status</button></div></main>`, { eyebrow: 'SELLER · INVOICE STATUS', back: true });
}

function sellerDashboard() {
  return shell(`<main class="seller-dashboard"><div class="seller-hero"><div class="seller-hero-copy"><span class="eyebrow">SELLER · ALL-STORE COCKPIT</span><h1>Good morning.<br><em>Let’s run it well.</em></h1><p>Orders, catalogue, finance and payment intelligence in one dropdown-ready cockpit.</p></div><div class="live-pill"><i></i> K-Tag live</div><div class="seller-gold"><span class="gold-coin">K</span><small>VALUE RETURNED<br><strong>AED 8.4k</strong> · +12.8%</small></div></div><div class="dashboard-nav"><button class="active">All stores</button><button data-action="seller-orders">Orders</button><button data-action="catalogue">Catalogue</button><button data-action="seller-finance">Finance</button><button data-action="seller-instruments">Payments</button><button data-action="seller-intelligence">Intelligence</button></div><section class="seller-metrics"><article><small>TO ACTION</small><strong>04</strong><span>orders waiting</span></article><article><small>VALUE</small><strong>AED 8.4k</strong><span>today · +12.8%</span></article><article><small>STOCK</small><strong>86%</strong><span>healthy shelf</span></article><article><small>REPEAT CUSTOMERS</small><strong>38%</strong><span>this month</span></article></section><section class="seller-layout"><article class="seller-orders"><div class="section-title"><div><span class="eyebrow">FOCUS · TRANSACTIONS</span><h2>Keep the line moving.</h2></div><button class="text-button" data-action="seller-orders">View all →</button></div><div class="order-row"><i class="status live"></i><div><b>#1048 · Maya Khan</b><small>Invoice pending · 2m ago</small></div><strong>AED 66</strong><button data-action="seller-status">Open</button></div><div class="order-row"><i class="status done"></i><div><b>#1047 · Sarah Ali</b><small>Paid · receipt matched</small></div><strong>AED 128</strong><button class="muted">Done</button></div><div class="order-row"><i class="status warn"></i><div><b>Granola cup</b><small>Low stock · 4 left</small></div><strong>Restock</strong><button data-action="catalogue">View</button></div></article><article class="seller-intelligence"><span class="eyebrow">INTELLIGENCE · K-ASSISTANT</span><h2>Your store<br><em>is learning.</em></h2><div class="insight-line"><span>✦</span><div><b>Repeat customers</b><small>+8% vs last period</small></div></div><div class="insight-line"><span>◇</span><div><b>Best value lever</b><small>Membership discounts</small></div></div><button class="dark-button" data-action="seller-rules">Tune reward rules ↗</button></article></section></main>`, { eyebrow: 'SELLER · ALL-STORE INTELLIGENCE', back: true });
}

function sellerOrders() {
  return sellerPanel('ORDERS · TRANSACTION COMMISSION', 'Pending requests, paid history and tickets in one queue.', [
    ['#1048 · Maya Khan', 'Pending buyer approval', 'AED 66.00'],
    ['#1047 · Sarah Ali', 'Paid · receipt matched', 'AED 128.00'],
    ['#1046 · Omar Hassan', 'Rejected · ask buyer reason', 'AED 42.00']
  ]);
}

function sellerPanel(eyebrow, copy, rows) {
  return shell(`<main class="detail-page"><div class="page-heading"><span class="eyebrow">SELLER · ${eyebrow}</span><h1>Store signals,<br><em>ready to act.</em></h1><p>${copy}</p></div><section class="detail-list seller-list">${rows.map(([name, status, value]) => `<article class="detail-row"><span class="status live"></span><div><b>${name}</b><small>${status}</small></div><strong>${value}</strong><button class="text-button" data-action="seller-status">Open →</button></article>`).join('')}</section><button class="gold-button" data-action="seller-dashboard">Back to cockpit <span>↗</span></button></main>`, { eyebrow: `SELLER · ${eyebrow}`, back: true });
}

function catalogue() {
  const items = state.catalogue.length ? state.catalogue : [
    { name: 'Ethiopian cold brew', priceMinor: 2400, stock: 18, image: '/assets/catalogue-coffee.svg' },
    { name: 'Granola cup', priceMinor: 1800, stock: 4, image: '/assets/catalogue-granola.svg' },
    { name: 'Still water 500ml', priceMinor: 500, stock: 148, image: '/assets/catalogue-water.svg' }
  ];
  return shell(`<main class="catalogue-page"><div class="page-heading inline"><div><span class="eyebrow">SELLER · CATALOGUE</span><h1>Menu and<br><em>stock intelligence.</em></h1></div><button class="gold-button" data-action="seller-dashboard">Business cockpit ↗</button></div><div class="catalogue-tools"><span>Competition price SKU · Menu templates · Low stock list</span><button class="text-button">Upload catalogue +</button></div><div class="catalogue-grid">${items.map((item) => `<article class="product-card"><img src="${esc(item.image)}" alt=""><div><b>${esc(item.name)}</b><small>AED ${(Number(item.priceMinor) / 100).toFixed(0)} · ${item.stock} left · ${item.daysStock || 2} days</small></div><button class="edit-button">Edit SKU</button></article>`).join('')}</div></main>`, { eyebrow: 'SELLER · CATALOGUE', back: true });
}

function sellerFinance() {
  return sellerPanel('FINANCE', 'Payables, receivables, P&L and balance sheet snapshots.', [
    ['Payables vs receivables', 'AED 12.4k receivable · AED 3.1k payable', 'View'],
    ['P&L', 'Gross margin +18.4% this month', 'Open'],
    ['Balance sheet', 'Updated today at 09:42', 'View']
  ]);
}

function sellerInstruments() {
  return sellerPanel('PAYMENT INSTRUMENTS', 'Accounts, settlement and cycle planning.', [
    ['Cards', 'BIN-linked offers enabled', 'Enabled'],
    ['Account to account', 'Aani settlement live', 'Live'],
    ['Settlement', 'Next cycle Friday', 'View']
  ]);
}

function sellerIntelligence() {
  return sellerPanel('INTELLIGENCE', 'Customer trends, ticket size and repeat-customer signals.', [
    ['Customer trends', '+8% repeat customers vs last period', 'Open'],
    ['Walk-in / repeat', '38% repeat customers', 'View'],
    ['Average ticket size', 'AED 74.20 · +6.1%', 'View']
  ]);
}

async function loadBootstrap() { const result = await get('/api/bootstrap'); state.buyer = result.buyer; state.seller = result.seller; }
async function loadSources() { const result = await get('/api/savings-map'); state.sources = result.discovered || []; }
async function loadCatalogue() { const result = await get('/api/catalogue'); state.catalogue = result.items || []; }
function render() {
  const views = {
    home, 'buyer-start': buyerStart, 'buyer-check': buyerCheckUser, 'buyer-otp': buyerOtp, 'buyer-vault': buyerVaultSetup,
    'buyer-dashboard': buyerDashboard, 'buyer-module': buyerModule, 'buyer-savings': buyerSavings, checkout, receipt,
    'buyer-card': () => buyerDetail('My Visiting Card', 'BUYER · VISITING CARD', '▣', 'Share your profile with a trusted contact.', '<div class="info-grid"><span>Profile approved</span><span>Share via WhatsApp, SMS or email</span><span>Choose a profile mode</span><span>Edit profile information</span></div>'),
    'buyer-friends': () => buyerDetail('Earn with friends', 'BUYER · FRIENDS', '♧', 'Share value with your circle and help them discover Kanzpay.', '<div class="info-grid"><span>Another share + text link</span><span>Friends joined: 04</span><span>Gold gift options</span><span>Redeem and deliver value</span></div>'),
    'buyer-gold': () => buyerDetail('My Gold Vault', 'BUYER · GOLD VAULT', 'Au', 'Track weight and the value of each purchase.', '<div class="vault-stat"><strong>1.260 mg</strong><small>Total gold weight</small></div><div class="info-grid"><span>Gold weight when purchased</span><span>Buy, sell, redeem or deliver</span><span>Physical, digital and gift gold</span></div>'),
    'buyer-expenses': () => buyerDetail('My Expenses', 'BUYER · EXPENSES', '⌁', 'See your spending pattern daily, weekly, monthly and yearly.', '<div class="expense-chart"><i style="height:44%"></i><i style="height:72%"></i><i style="height:58%"></i><i style="height:88%"></i><i style="height:64%"></i><i style="height:96%"></i><i style="height:76%"></i></div><div class="info-grid"><span>Daily</span><span>Weekly</span><span>Monthly</span><span>Yearly</span></div>'),
    'buyer-instruments': () => buyerDetail('Payment intelligence', 'BUYER · PAYMENT INSTRUMENTS', '◌', 'Kanzpay evaluates instruments and asks for approval before recommendation logic.', '<div class="info-grid"><span>Cards: Visa Signature</span><span>Accounts: Aani</span><span>Evaluate benefit and fee</span><span>Ask user approval</span></div>'),
    'seller-start': sellerStart, 'seller-install': sellerInstall, 'seller-docs': sellerDocs, 'seller-rules': sellerRules,
    'seller-invoice': sellerInvoice, 'seller-status': sellerStatus, 'seller-dashboard': sellerDashboard, 'seller-orders': sellerOrders,
    catalogue, 'seller-finance': sellerFinance, 'seller-instruments': sellerInstruments, 'seller-intelligence': sellerIntelligence
  };
  app.innerHTML = views[state.screen]();
}

document.addEventListener('click', async (event) => {
  const element = event.target.closest('[data-action]');
  if (!element) return;
  const action = element.dataset.action;
  if (action === 'home') { state.role = null; state.screen = 'home'; state.invoice = null; render(); return; }
  if (action === 'role') { state.role = element.dataset.role; state.screen = state.role === 'buyer' ? 'buyer-start' : 'seller-start'; render(); return; }
  if (action === 'back') { state.screen = state.role === 'buyer' ? (state.screen === 'buyer-dashboard' ? 'home' : 'buyer-dashboard') : state.role === 'seller' ? (state.screen === 'seller-dashboard' ? 'home' : 'seller-dashboard') : 'home'; render(); return; }
  if (action === 'buyer-tap' || action === 'buyer-scan') { state.screen = 'buyer-check'; render(); return; }
  if (action === 'buyer-existing') { state.screen = 'buyer-otp'; render(); return; }
  if (action === 'buyer-new') { state.screen = 'buyer-otp'; render(); return; }
  if (action === 'buyer-account') { state.screen = 'buyer-otp'; render(); return; }
  if (action === 'buyer-vault') { const result = await post('/api/account/create', { name: 'Maya Khan', mobile: '+971501234567', email: 'maya@example.com' }); if (result.error) return notify(result.error, 'error'); state.account = result; state.screen = 'buyer-vault'; render(); return; }
  if (action === 'buyer-cockpit' || action === 'buyer-home') { state.role = 'buyer'; state.screen = 'buyer-dashboard'; await loadBootstrap(); render(); return; }
  if (action === 'buyer-module') { state.selectedModule = 'My Value Vault'; state.screen = 'buyer-module'; render(); return; }
  if (['buyer-card', 'buyer-friends', 'buyer-gold', 'buyer-expenses', 'buyer-instruments'].includes(action)) { state.screen = action; render(); return; }
  if (action === 'buyer-savings') { state.role = 'buyer'; await loadSources(); state.screen = 'buyer-savings'; render(); return; }
  if (action === 'checkout') { state.role = 'buyer'; state.screen = 'checkout'; state.invoice = null; render(); return; }
  if (action === 'create-invoice') { const exchange = await post('/api/tap/exchange', { kTag: 'K-LUMA-001', buyerId: 'buyer-maya', capabilities: ['memberships', 'rewards', 'promocodes', 'vouchers', 'cards', 'accounts'] }); if (exchange.error) return notify(exchange.error, 'error'); state.invoice = await post('/api/invoice/create'); if (state.invoice.error) return notify(state.invoice.error, 'error'); notify('Tap received. Your invoice is ready.', 'success'); render(); return; }
  if (action === 'approve') { const preview = await post('/api/solver/preview'); if (preview.error) return notify(preview.error, 'error'); state.receipt = await post('/api/checkout/approve'); if (state.receipt.error) return notify(state.receipt.error, 'error'); await loadBootstrap(); state.screen = 'receipt'; notify('Approved. Gold is on its way.', 'success'); render(); return; }
  if (action === 'stop') { await post('/api/checkout/stop'); state.invoice = null; state.screen = 'buyer-dashboard'; notify('Stopped. Nothing was paid.'); render(); return; }
  if (action === 'source') { if (element.classList.contains('locked')) return notify('This source needs its official provider connection first.'); const result = await post('/api/savings-map/connect', { sourceId: element.dataset.source }); if (result.error) return notify(result.error, 'error'); await loadSources(); notify('Connected. I’ll search for savings.', 'success'); render(); return; }
  if (action === 'seller-install') { state.screen = 'seller-install'; render(); return; }
  if (action === 'seller-docs') { state.screen = 'seller-docs'; render(); return; }
  if (action === 'seller-rules') { state.screen = 'seller-rules'; render(); return; }
  if (action === 'seller-invoice') { state.screen = 'seller-invoice'; render(); return; }
  if (action === 'seller-status') { state.screen = 'seller-status'; render(); return; }
  if (action === 'seller-status-select') { state.sellerInvoiceStatus = element.dataset.status; notify(`${element.dataset.status} status selected.`, 'success'); render(); return; }
  if (action === 'seller-dashboard') { state.role = 'seller'; state.screen = 'seller-dashboard'; render(); return; }
  if (action === 'seller-orders') { state.screen = 'seller-orders'; render(); return; }
  if (action === 'catalogue') { state.role = 'seller'; await loadCatalogue(); state.screen = 'catalogue'; render(); return; }
  if (action === 'seller-finance') { state.screen = 'seller-finance'; render(); return; }
  if (action === 'seller-instruments') { state.screen = 'seller-instruments'; render(); return; }
  if (action === 'seller-intelligence') { state.screen = 'seller-intelligence'; render(); }
});

await loadBootstrap();
render();
