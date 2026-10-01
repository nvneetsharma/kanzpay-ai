const app = document.querySelector('#app');
const toast = document.querySelector('#toast');

const state = {
  role: null,
  view: 'home',
  sellerStep: 0,
  invoice: null,
  receipt: null,
  buyer: null,
  sources: [],
  catalogue: []
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
  return `<div class="particle-field">${Array.from({ length: 34 }, (_, index) => `<i style="--i:${index};--x:${(index * 29) % 100}%;--y:${(index * 47) % 100}%;--d:${2.6 + (index % 5) * .45}s"></i>`).join('')}</div>`;
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
    <p class="home-lead">Kanzpay moves the right benefits, rewards and payment choices into the moment they matter.</p>
    <div class="role-cards">
      <button class="role-card buyer-card" data-action="role" data-role="buyer"><span class="card-kicker">FOR BUYERS · 01</span><strong>Bring your<br><em>good with you.</em></strong><small>Tap. Approve. Keep more.</small><span class="card-arrow">↗</span></button>
      <button class="role-card seller-card" data-action="role" data-role="seller"><span class="card-kicker">FOR SELLERS · 02</span><strong>Run your store<br><em>with intelligence.</em></strong><small>One assistant. Every signal.</small><span class="card-arrow">↗</span></button>
    </div><button class="story-link" data-action="story"><span class="story-icon">✦</span> See how the value layer flows</button>
  </section><section class="home-art"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
    <div class="golden-orb"><span>Au</span><small>24K<br>VALUE</small></div><div class="art-label label-top">FLOWING INTELLIGENCE <i></i></div><div class="art-label label-bottom">1 mg Gold · starts here <i></i></div>
    <div class="art-card card-float"><span>YOUR VALUE TODAY</span><strong>AED 6.00</strong><small>saved before checkout</small><i>+66 points</i></div>
  </section></main>`;
}

function buyerDashboard() {
  const buyer = state.buyer || { name: 'Maya Khan', points: 1840, goldMinor: 1260 };
  return shell(`<main class="dashboard"><div class="dashboard-hero buyer-hero"><div class="dashboard-heading"><span class="eyebrow">BUYER COCKPIT · GOOD MORNING</span><h1>${esc(buyer.name.split(' ')[0])}, your value<br><em>is already moving.</em></h1><p>One tap at the counter. Every eligible benefit in view.</p></div><div class="gold-balance"><span class="gold-coin">Au</span><div><small>YOUR GOLD BALANCE</small><strong>${(buyer.goldMinor / 1000).toFixed(3)} mg</strong><em>+0.066 this month</em></div></div></div>
    <div class="dashboard-nav"><button class="active">Overview</button><button data-action="buyer-savings">Value map</button><button>Receipts</button><button>Profile</button></div>
    <section class="metric-grid"><article class="metric-card metric-gold"><small>REWARDS BALANCE</small><strong>${buyer.points.toLocaleString()}</strong><span>points · +12% this month</span><i>◎</i></article><article class="metric-card metric-save"><small>SAVED THIS MONTH</small><strong>AED 42.80</strong><span>across 8 transactions</span><i>⌁</i></article><article class="metric-card metric-insight"><small>VALUE SOURCES</small><strong>04 <b>active</b></strong><span>2 more opportunities nearby</span><i>✦</i></article></section>
    <section class="feature-grid"><article class="feature-card tap-card"><div><span class="eyebrow">AT THE COUNTER</span><h2>Tap a<br><em>K-Tag.</em></h2><p>Your approved memberships, rewards and preferred instruments arrive before the bill.</p><button class="gold-button" data-action="checkout">Try Luma Market <span>↗</span></button></div><div class="tap-visual"><div class="tap-ring"></div><span class="ktag">K<span>•</span></span><small>LUMA MARKET</small></div></article><article class="value-card"><span class="eyebrow">THE VALUE MAP</span><h2>What can<br><em>find you?</em></h2><div class="source-row"><span>✦</span><div><b>Memberships</b><small>Fazaa member · ready</small></div><strong>− AED 4.20</strong></div><div class="source-row"><span>◇</span><div><b>Card-linked offers</b><small>Visa Signature · ready</small></div><strong>− AED 1.80</strong></div><button class="text-button" data-action="buyer-savings">Open value map →</button></article></section>
    <section class="ask-bar"><span class="assistant-orb">K</span><div><b>K-Assistant</b><small>Luma Market has a better price waiting at the counter.</small></div><button data-action="checkout">View it ↗</button></section></main>`, { eyebrow: 'BUYER · PERSONAL VALUE COCKPIT' });
}

function buyerSavings() {
  const sources = state.sources.length ? state.sources : [
    { id: 'cards', icon: '◇', label: 'Cards & BIN offers', benefit: 'Find issuer discounts before you pay.', status: 'discoverable' },
    { id: 'memberships', icon: '✦', label: 'Memberships', benefit: 'Apply member pricing automatically.', status: 'connected' },
    { id: 'rewards', icon: '◎', label: 'Reward programmes', benefit: 'Use points and keep balances together.', status: 'connected' },
    { id: 'email', icon: '✉', label: 'Email offers', benefit: 'Find vouchers and promo codes.', status: 'locked' }
  ];
  return shell(`<main class="map-page"><div class="page-heading"><span class="eyebrow">K-ASSISTANT · VALUE MAP</span><h1>Your value,<br><em>in one view.</em></h1><p>You choose what Kanzpay can look for. Nothing moves without your approval.</p></div><div class="map-total"><span>DISCOVERED VALUE</span><strong>AED 6.60</strong><small>ready across your connected sources</small></div><section class="source-list">${sources.map((source) => `<button class="source-item ${source.status}" data-action="source" data-source="${esc(source.id)}"><span class="source-icon">${source.icon}</span><div><b>${esc(source.label)}</b><small>${esc(source.benefit)}</small></div><strong>${source.status === 'connected' ? 'Connected' : source.status === 'locked' ? 'Locked' : 'Connect'} <span>→</span></strong></button>`).join('')}</section><button class="quiet-button" data-action="back">← Back to cockpit</button></main>`, { eyebrow: 'BUYER · VALUE MAP', back: true });
}

function checkout() {
  if (!state.invoice) return shell(`<main class="checkout"><section class="checkout-visual"><div class="checkout-glass"><span class="eyebrow">LUMA MARKET · K-TAG</span><div class="checkout-orb">K</div><div class="scan-line"></div><h2>Bring your value<br><em>to the counter.</em></h2><p>Approve the signals you want to share. The seller sees only what helps price your basket.</p></div></section><section class="checkout-panel"><span class="eyebrow">STEP 01 · TAP</span><h1>A better price<br><em>is waiting.</em></h1><div class="trust-list"><span>✦ Membership pricing</span><span>◇ Card-linked offers</span><span>◎ Reward points</span><span>⌁ Safer payment rails</span></div><button class="gold-button wide" data-action="create-invoice">Tap Luma K-Tag <span>↗</span></button><button class="quiet-button" data-action="back">← Back to cockpit</button></section></main>`, { eyebrow: 'BUYER · INVOICE REVIEW', back: true });
  const invoice = state.invoice;
  return shell(`<main class="checkout"><section class="checkout-visual invoice-visual"><div class="invoice-glass"><span class="eyebrow">INVOICE READY · #${esc(invoice.reference || '1048')}</span><h2>Review the<br><em>good part.</em></h2><div class="invoice-preview"><div><span>Basket</span><b>${money(invoice.grossMinor)}</b></div><div class="discount"><span>Fazaa member</span><b>− ${money(420)}</b></div><div class="discount"><span>Visa BIN offer</span><b>− ${money(180)}</b></div><div class="invoice-total"><span>Final amount</span><strong>${money(invoice.payableMinor)}</strong></div></div></div></section><section class="checkout-panel"><span class="eyebrow">STEP 02 · APPROVE</span><h1>Good value,<br><em>before pay.</em></h1><div class="reward-panel"><small>YOU GET BACK</small><strong>+${invoice.pointsEarned}</strong><span>points · ${money(invoice.goldEarnedMinor)} Gold</span><i>Balance after: ${invoice.pointsAfterPurchase.toLocaleString()} points</i></div><div class="rail-note"><span>●</span><div><b>Recommended rail · ${esc(invoice.selectedRail?.name || 'Aani')}</b><small>Safe, instant account-to-account · no fee</small></div></div><button class="gold-button wide" data-action="approve">Approve & pay <span>↗</span></button><button class="quiet-button" data-action="stop">Stop · don’t pay</button></section></main>`, { eyebrow: 'BUYER · APPROVE INVOICE', back: true });
}

function receipt() {
  const result = state.receipt || {};
  return shell(`<main class="receipt-page"><div class="receipt-check">✓</div><span class="eyebrow">PAYMENT COMPLETE · RECEIPT MATCHED</span><h1>Good<br><em>choice.</em></h1><p class="receipt-lead">Your value came back before the transaction left the room.</p><section class="receipt-summary"><div><span>Luma Market · LM-1048</span><strong>${money(result.paidMinor || 6600)}</strong></div><div class="receipt-stats"><article><b>− AED 6.00</b><small>saved</small></article><article><b>+${result.rewards?.points || 66}</b><small>points</small></article><article><b>+0.066</b><small>mg Gold</small></article></div><p>Receipt reconciled automatically · confidence 98%</p></section><button class="gold-button" data-action="buyer-home">Back to buyer cockpit <span>↗</span></button></main>`, { eyebrow: 'BUYER · YOUR REWARD MOMENT' });
}

function sellerDashboard() {
  return shell(`<main class="seller-dashboard"><div class="seller-hero"><div class="seller-hero-copy"><span class="eyebrow">LUMA MARKET · K-ASSISTANT</span><h1>Good morning.<br><em>Let’s run it well.</em></h1><p>Every order, shelf and signal in one calm cockpit.</p></div><div class="live-pill"><i></i> K-Tag live</div><div class="seller-gold"><span class="gold-coin">K</span><small>VALUE RETURNED<br><strong>AED 8.4k</strong> · +12.8%</small></div></div><div class="dashboard-nav"><button class="active">Today</button><button>Orders</button><button data-action="catalogue">Catalogue</button><button>Intelligence</button></div><section class="seller-metrics"><article><small>TO ACTION</small><strong>04</strong><span>orders waiting</span></article><article><small>VALUE</small><strong>AED 8.4k</strong><span>today · +12.8%</span></article><article><small>STOCK</small><strong>86%</strong><span>healthy shelf</span></article><article><small>REPEAT CUSTOMERS</small><strong>38%</strong><span>this month</span></article></section><section class="seller-layout"><article class="seller-orders"><div class="section-title"><div><span class="eyebrow">FOCUS · TODAY</span><h2>Keep the line moving.</h2></div><button class="text-button">View all →</button></div><div class="order-row"><i class="status live"></i><div><b>#1048 · Maya Khan</b><small>Invoice waiting for approval · 2m ago</small></div><strong>AED 66</strong><button data-action="seller-invoice">Open</button></div><div class="order-row"><i class="status done"></i><div><b>#1047 · Sarah Ali</b><small>Paid · receipt matched</small></div><strong>AED 128</strong><button class="muted">Done</button></div><div class="order-row"><i class="status warn"></i><div><b>Granola cup</b><small>Low stock · 4 left</small></div><strong>Restock</strong><button data-action="catalogue">View</button></div></article><article class="seller-intelligence"><span class="eyebrow">INTELLIGENCE · K-ASSISTANT</span><h2>Your store<br><em>is learning.</em></h2><div class="insight-line"><span>✦</span><div><b>Repeat customers</b><small>+8% vs last period</small></div></div><div class="insight-line"><span>◇</span><div><b>Best value lever</b><small>Membership discounts</small></div></div><button class="dark-button" data-action="seller-rules">Tune reward rules ↗</button></article></section></main>`, { eyebrow: 'SELLER · ALL-STORE INTELLIGENCE' });
}

function sellerFlow() {
  const steps = [
    ['01', 'Install K-Assistant.', 'Choose your business type, add your logo and let the assistant work in the background.', 'K-ASSISTANT', 'Start onboarding'],
    ['02', 'Set the value rules.', 'Membership discounts, voucher codes, reward points and preferred instruments — your rules, clearly applied.', 'VALUE RULES', 'Generate invoice'],
    ['03', 'Share the invoice.', 'K-Assistant builds the buyer-ready invoice from the tap and shares it before print.', 'INVOICE READY', 'Open cockpit']
  ];
  const [number, title, copy, label, cta] = steps[state.sellerStep];
  return shell(`<main class="onboarding"><section class="onboarding-art"><div class="art-stack"><div class="stack-card stack-back"></div><div class="stack-card stack-main"><span>${label}</span><strong>${state.sellerStep === 0 ? 'Luma<br><em>Market</em>' : state.sellerStep === 1 ? 'Rules<br><em>that return.</em>' : 'Invoice<br><em>ready.</em>'}</strong><small>K-ASSISTANT · ${number}</small></div><div class="stack-chip">✦</div></div></section><section class="onboarding-copy"><div class="step-badge">${number} <span>/ 03</span></div><span class="eyebrow">SELLER SETUP</span><h1>${title}</h1><p>${copy}</p>${state.sellerStep === 0 ? '<div class="setup-fields"><span>Business type <b>Retail & cafe</b></span><span>Location <b>Dubai Marina</b></span><span>Logo & K-Tag <b>Ready to add</b></span></div>' : state.sellerStep === 1 ? '<div class="rule-grid"><span>Membership discounts <b>12%</b></span><span>Reward points <b>1 point / AED</b></span><span>Preferred instruments <b>On</b></span><span>Voucher codes <b>Buyer-approved</b></span></div>' : '<div class="invoice-mini"><span>LM-1048 · MAYA KHAN</span><strong>AED 66.00</strong><small>− AED 6.00 guaranteed savings</small></div>'}<button class="gold-button wide" data-action="seller-next">${cta} <span>↗</span></button><button class="quiet-button" data-action="back">← Back</button><div class="step-line">${[0, 1, 2].map((item) => `<i class="${item <= state.sellerStep ? 'active' : ''}"></i>`).join('')}</div></section></main>`, { eyebrow: 'SELLER · K-ASSISTANT SETUP', back: true });
}

function catalogue() {
  const items = state.catalogue.length ? state.catalogue : [
    { name: 'Ethiopian cold brew', priceMinor: 2400, stock: 18, image: '/assets/catalogue-coffee.svg' },
    { name: 'Granola cup', priceMinor: 1800, stock: 4, image: '/assets/catalogue-granola.svg' },
    { name: 'Still water 500ml', priceMinor: 500, stock: 148, image: '/assets/catalogue-water.svg' }
  ];
  return shell(`<main class="catalogue-page"><div class="page-heading inline"><div><span class="eyebrow">LUMA MARKET · CATALOGUE</span><h1>Ready<br><em>to share.</em></h1></div><button class="gold-button" data-action="seller-home">Business cockpit ↗</button></div><div class="catalogue-grid">${items.map((item) => `<article class="product-card"><img src="${esc(item.image)}" alt=""><div><b>${esc(item.name)}</b><small>AED ${(Number(item.priceMinor) / 100).toFixed(0)} · ${item.stock} left</small></div><button class="edit-button">Edit SKU</button></article>`).join('')}</div></main>`, { eyebrow: 'SELLER · EDITABLE MENU', back: true });
}

async function loadBootstrap() {
  const result = await get('/api/bootstrap');
  state.buyer = result.buyer;
}
async function loadSources() {
  const result = await get('/api/savings-map');
  state.sources = result.discovered || [];
}
async function loadCatalogue() {
  const result = await get('/api/catalogue');
  state.catalogue = result.items || [];
}
function render() {
  const views = { home, 'buyer-dashboard': buyerDashboard, 'buyer-savings': buyerSavings, checkout, receipt, 'seller-dashboard': sellerDashboard, 'seller-flow': sellerFlow, catalogue };
  app.innerHTML = views[state.view]();
}

document.addEventListener('click', async (event) => {
  const element = event.target.closest('[data-action]');
  if (!element) return;
  const action = element.dataset.action;
  if (action === 'home') { state.role = null; state.view = 'home'; state.invoice = null; render(); return; }
  if (action === 'role') { state.role = element.dataset.role; state.view = state.role === 'buyer' ? 'buyer-dashboard' : 'seller-dashboard'; render(); return; }
  if (action === 'back') { state.view = state.role === 'buyer' ? 'buyer-dashboard' : state.role === 'seller' ? 'seller-dashboard' : 'home'; render(); return; }
  if (action === 'buyer-home') { state.view = 'buyer-dashboard'; state.invoice = null; await loadBootstrap(); render(); return; }
  if (action === 'seller-home') { state.view = 'seller-dashboard'; render(); return; }
  if (action === 'checkout') { state.role = 'buyer'; state.view = 'checkout'; state.invoice = null; render(); return; }
  if (action === 'buyer-savings') { state.role = 'buyer'; await loadSources(); state.view = 'buyer-savings'; render(); return; }
  if (action === 'create-invoice') {
    const exchange = await post('/api/tap/exchange', { kTag: 'K-LUMA-001', buyerId: 'buyer-maya', capabilities: ['memberships', 'rewards', 'promocodes', 'vouchers', 'cards', 'accounts'] });
    if (exchange.error) return notify(exchange.error, 'error');
    state.invoice = await post('/api/invoice/create');
    if (state.invoice.error) return notify(state.invoice.error, 'error');
    notify('Tap received. Your benefits are ready to review.', 'success'); render(); return;
  }
  if (action === 'approve') {
    const preview = await post('/api/solver/preview');
    if (preview.error) return notify(preview.error, 'error');
    state.receipt = await post('/api/checkout/approve');
    if (state.receipt.error) return notify(state.receipt.error, 'error');
    await loadBootstrap(); state.view = 'receipt'; notify('Approved. Gold is on its way.', 'success'); render(); return;
  }
  if (action === 'stop') { await post('/api/checkout/stop'); state.invoice = null; notify('Stopped. Nothing was paid.'); state.view = 'buyer-dashboard'; render(); return; }
  if (action === 'source') {
    if (element.classList.contains('locked')) return notify('This source needs its official provider connection first.');
    const result = await post('/api/savings-map/connect', { sourceId: element.dataset.source });
    if (result.error) return notify(result.error, 'error');
    await loadSources(); notify('Connected. I’ll search for savings.', 'success'); render(); return;
  }
  if (action === 'seller-next') {
    if (state.sellerStep === 0) await post('/api/onboarding/permission', { role: 'seller', id: 'business-account', enabled: true });
    if (state.sellerStep === 2) { state.view = 'seller-dashboard'; notify('K-Assistant is live. Your cockpit is ready.', 'success'); }
    else state.sellerStep += 1;
    render(); return;
  }
  if (action === 'seller-invoice') { state.role = 'buyer'; state.view = 'checkout'; state.invoice = null; render(); return; }
  if (action === 'seller-rules') { state.role = 'seller'; state.sellerStep = 1; state.view = 'seller-flow'; render(); return; }
  if (action === 'catalogue') { state.role = 'seller'; await loadCatalogue(); state.view = 'catalogue'; render(); }
});

await loadBootstrap();
render();
