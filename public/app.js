const app = document.querySelector('#app');
const toast = document.querySelector('#toast');

const state = {
  role: null, view: 'welcome', buyerStep: 0, sellerStep: 0,
  name: '', mobile: '', email: '', account: null, sources: [],
  permissions: {}, invoice: null, receipt: null, tour: 0
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
const post = async (path, payload = {}) => {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
};
const getSources = async () => {
  const result = await fetch('/api/savings-map').then((response) => response.json());
  state.sources = result.discovered || [];
};

function shell(content, options = {}) {
  const { dark = false, back = true } = options;
  return `<div class="fresh-shell ${dark ? 'fresh-dark' : ''}">
    <header class="fresh-nav">
      <button class="brand" data-action="home"><img src="/assets/kanzpay-mark.png" alt="" /><span>Kanzpay</span></button>
      <div class="nav-path"><span class="path-light"></span><span>${state.role ? esc(state.role) : 'your value journey'}</span></div>
      ${back ? '<button class="icon-button" data-action="back" aria-label="Go back">←</button>' : '<span class="nav-spacer"></span>'}
    </header>
    ${content}
    <footer class="fresh-footer">Built with <b>♥</b> in UAE <b>🇦🇪</b> by OXY Technologies, ADGM, Abu Dhabi.</footer>
  </div>`;
}

function welcome() {
  return `<main class="hero-screen">
    <div class="hero-image"></div><div class="hero-shade"></div>
    <div class="hero-copy"><span class="brand-stamp">KANZPAY · 24K VALUE LAYER</span>
      <h1>Make more<br /><em>from every payment.</em></h1>
      <p>Tap once. See the better price. Keep the good that comes back.</p>
      <div class="hero-actions"><button class="primary-cta" data-action="role" data-role="buyer">I’m a buyer <span>→</span></button><button class="glass-cta" data-action="role" data-role="seller">I’m a seller <span>→</span></button></div>
      <button class="tour-link" data-action="tour"><span class="play">▶</span> Watch the 15-second story</button>
    </div>
    <div class="hero-coin"><strong>1</strong><small>mg Gold</small><i></i></div>
    <div class="gold-thread thread-one"></div><div class="gold-thread thread-two"></div>
  </main>`;
}

const tourScenes = [
  ['scene-welcome.png', 'Start', '1 mg Gold begins your journey.'],
  ['scene-tap.png', 'Tap', 'Your approved value travels to the seller.'],
  ['scene-payments.png', 'Save', 'Kanzpay finds the better way to pay.'],
  ['scene-counter.jpg', 'Earn', 'The good comes back as points and Gold.'],
  ['scene-dashboard.png', 'See', 'One calm cockpit for your money life.']
];

function tour() {
  const scene = tourScenes[state.tour];
  return `<main class="tour-screen"><div class="tour-art" style="background-image:url('/assets/${scene[0]}')"></div><div class="tour-overlay"></div>
    <div class="tour-top"><span>THE KANZPAY STORY</span><button data-action="tour-exit">Skip</button></div>
    <div class="tour-bottom"><div class="tour-count">0${state.tour + 1} <i>/ 05</i></div><h1>${scene[1]}</h1><p>${scene[2]}</p><div class="tour-dots">${tourScenes.map((_, index) => `<i class="${index === state.tour ? 'active' : ''}"></i>`).join('')}</div></div>
  </main>`;
}

function roleStart() {
  const isBuyer = state.role === 'buyer';
  return shell(`<main class="scene-page"><div class="scene-panel ${isBuyer ? 'buyer-panel' : 'seller-panel'}"></div><div class="scene-copy">
    <span class="eyebrow">STEP 01 · ${isBuyer ? 'BUYER' : 'SELLER'}</span><h1>${isBuyer ? 'Start lighter.' : 'Grow smarter.'}</h1>
    <p>${isBuyer ? 'Tap a K-Tag and let your value travel with you.' : 'Let every invoice, order and customer come back stronger.'}</p>
    <div class="journey-line"><i class="active"></i><b></b><i></i><b></b><i></i><b></b><i></i></div>
    <button class="primary-cta" data-action="next-role">${isBuyer ? 'Tap or scan' : 'Start onboarding'} <span>→</span></button><button class="quiet-cta" data-action="home">Choose another path</button>
  </div></main>`);
}

function verifyForm() {
  return `<div class="short-form"><label><span>Your name</span><input id="name" value="${esc(state.name)}" placeholder="Name" /></label><div class="two-inputs"><label><span>Mobile</span><input id="mobile" value="${esc(state.mobile)}" placeholder="+971" /></label><label><span>Email</span><input id="email" value="${esc(state.email)}" placeholder="you@email.com" /></label></div><button class="soft-cta" data-action="verify-user">Send two OTPs <span>↗</span></button></div>`;
}

function buyerFlow() {
  const steps = [
    ['Tap', 'Find value at the counter', 'Tap the seller K-Tag. Your approved benefit signals stay yours.', 'scene-tap.png', 'tap-start'],
    ['Verify', 'Make it yours', 'Mobile and email. Two small steps to open your Gold vault.', 'scene-family.png', 'verify'],
    ['Rewards', 'Bring points together', 'Connect a reward programme and keep the useful signal in one place.', 'scene-community.png', 'reward'],
    ['Offers', 'Let value find you', 'Memberships, vouchers and promo codes become easier to use.', 'scene-counter.jpg', 'offers'],
    ['Pay', 'Choose the better route', 'Kanzpay compares eligible instruments before you approve.', 'scene-payments.png', 'payment'],
    ['Account', 'Open your vault', 'Create your account and keep every saving, receipt and Gold moment together.', 'scene-dashboard.png', 'account']
  ];
  const [label, title, copy, image, action] = steps[state.buyerStep];
  return shell(`<main class="flow-page"><div class="flow-visual" style="background-image:url('/assets/${image}')"><div class="visual-glow"></div><span class="visual-tag">${label}</span><div class="visual-coin">${state.buyerStep === 5 ? '1 mg' : '✦'}</div></div>
    <div class="flow-copy"><div class="progress-row"><span>BUYER JOURNEY</span><b>${state.buyerStep + 1} / 6</b></div><div class="progress-bar"><i style="width:${((state.buyerStep + 1) / 6) * 100}%"></i></div><h1>${title}</h1><p>${copy}</p>
      ${action === 'verify' ? verifyForm() : ''}<div class="flow-actions">${action !== 'verify' ? `<button class="primary-cta" data-action="buyer-action" data-kind="${action}">${action === 'tap-start' ? 'Tap K-Tag' : action === 'account' ? 'Create account' : 'Connect now'} <span>→</span></button>` : ''}
      ${state.buyerStep > 0 ? '<button class="quiet-cta" data-action="buyer-back">Back</button>' : '<button class="quiet-cta" data-action="dashboard">I’ll do this later</button>'}</div>
      <div class="mini-path">${steps.map((_, index) => `<i class="${index < state.buyerStep ? 'done' : index === state.buyerStep ? 'active' : ''}"></i>`).join('')}</div>
    </div></main>`);
}

function sourceSheet(kind) {
  const source = state.sources.find((item) => item.id === kind) || { label: kind, benefit: 'Find more value before you pay.' };
  return `<div class="permission-sheet"><div class="sheet-orb">${source.icon || '✦'}</div><span class="eyebrow">ONE PERMISSION</span><h2>${esc(source.label)}</h2><p>${esc(source.benefit)}</p><div class="permission-list"><span>✓ Read-only</span><span>✓ You choose</span><span>✓ Revoke anytime</span></div><button class="primary-cta" data-action="approve-source" data-source="${esc(kind)}">Allow ${esc(source.label)} <span>→</span></button><button class="quiet-cta" data-action="decline-source">Not now</button></div>`;
}

function buyerDashboard() {
  return shell(`<main class="cockpit"><div class="cockpit-hero" style="background-image:url('/assets/scene-dashboard.png')"><div class="hero-shade"></div><div class="cockpit-welcome"><span class="eyebrow">GOOD MORNING, ${esc((state.name || 'MAYA').split(' ')[0]).toUpperCase()}</span><h1>Your value<br /><em>is moving.</em></h1><p>One tap to save. One life to enjoy.</p></div><div class="gold-balance"><strong>1</strong><span>mg<br />processing</span></div></div>
    <div class="gold-path"><i class="active"></i><b></b><i class="active"></i><b></b><i></i><b></b><i></i><span>account</span><span>connect</span><span>earn</span><span>grow</span></div>
    <div class="cockpit-grid"><button class="life-card card-tap" data-action="checkout"><span class="card-icon">⌁</span><small>AT THE COUNTER</small><strong>Tap<br />to save</strong><em>Try a guided checkout →</em></button><button class="life-card card-gold" data-action="buyer-flow"><span class="card-icon">✦</span><small>GOLD VAULT</small><strong>Keep<br />the good</strong><em>1 mg processing</em></button><button class="life-card card-rewards" data-action="savings"><span class="card-icon">◎</span><small>VALUE MAP</small><strong>Find<br />more</strong><em>${state.sources.filter((item) => item.status === 'connected').length} connected · ${state.sources.filter((item) => item.status === 'locked').length} waiting</em></button><button class="life-card card-spend" data-action="receipt"><span class="card-icon">▦</span><small>YOUR LIFE</small><strong>See<br />clearly</strong><em>Receipts · patterns · limits</em></button></div>
    <div class="ask-strip"><span class="ask-avatar">K</span><div><strong>K-assistant</strong><small>What should we make more valuable today?</small></div><button data-action="savings">Ask →</button></div></main>`);
}

function sellerForm() {
  return `<div class="short-form"><label><span>Business name</span><input id="business" value="Luma Market" /></label><div class="two-inputs"><label><span>Type</span><input value="Retail" /></label><label><span>Location</span><input value="Dubai" /></label></div><div class="permission-list"><span>✓ K-Assistant</span><span>✓ K-Tag</span><span>✓ Invoice share</span></div></div>`;
}

function sellerFlow() {
  const steps = [['Start', 'Open your business', 'Install K-Assistant. Add your business identity once.', 'scene-seller.png', 'seller-start'], ['Value', 'Price with care', 'Accept rewards, memberships, vouchers and preferred payment routes.', 'scene-payments.png', 'seller-rules'], ['Invoice', 'Send before print', 'Build the invoice from the buyer tap, then share it.', 'scene-counter.jpg', 'seller-invoice'], ['Run', 'See the whole store', 'Orders, catalogue, inventory, finance and customer intelligence.', 'scene-cockpit.png', 'seller-dashboard']];
  const [label, title, copy, image, action] = steps[state.sellerStep];
  return shell(`<main class="flow-page seller-flow"><div class="flow-visual" style="background-image:url('/assets/${image}')"><div class="visual-glow"></div><span class="visual-tag">${label}</span><div class="visual-coin">K</div></div><div class="flow-copy"><div class="progress-row"><span>SELLER JOURNEY</span><b>${state.sellerStep + 1} / 4</b></div><div class="progress-bar"><i style="width:${((state.sellerStep + 1) / 4) * 100}%"></i></div><h1>${title}</h1><p>${copy}</p>${state.sellerStep === 0 ? sellerForm() : ''}<button class="primary-cta" data-action="seller-action" data-kind="${action}">${state.sellerStep === 0 ? 'Start onboarding' : state.sellerStep === 3 ? 'Open cockpit' : 'Continue'} <span>→</span></button>${state.sellerStep > 0 ? '<button class="quiet-cta" data-action="seller-back">Back</button>' : '<button class="quiet-cta" data-action="home">Not now</button>'}</div></main>`);
}

function checkout() {
  const invoice = state.invoice;
  return shell(`<main class="checkout-page"><div class="checkout-art" style="background-image:url('/assets/scene-counter.jpg')"><div class="hero-shade"></div><span class="checkout-badge">LUMA MARKET · K-TAG</span><div class="tap-pulse">⌁</div><div class="checkout-caption"><span>YOUR BENEFITS</span><strong>Arrived before<br />the bill.</strong></div></div><div class="checkout-sheet">${invoice ? `<div class="invoice-head"><div><span class="eyebrow">READY TO REVIEW</span><h1>Better<br /><em>before pay.</em></h1></div><span class="invoice-no">#1048</span></div><div class="invoice-lines"><div><span>Basket</span><b>${money(invoice.grossMinor)}</b></div><div class="saving-line"><span>Fazaa member</span><b>− ${money(420)}</b></div><div class="saving-line"><span>Visa BIN offer</span><b>− ${money(180)}</b></div><div class="total-line"><span>Final amount</span><strong>${money(invoice.payableMinor)}</strong></div></div><div class="reward-result"><span>YOU GET BACK</span><div><strong>+${invoice.pointsEarned}</strong><small>points</small><b>→ ${invoice.pointsAfterPurchase} total</b></div><i>+${(invoice.goldEarnedMinor / 1000).toFixed(3)} mg Gold</i></div><div class="checkout-actions"><button class="primary-cta" data-action="approve">Approve & pay <span>→</span></button><button class="quiet-cta" data-action="stop">Stop</button></div>` : `<div class="checkout-empty"><span class="tap-icon">⌁</span><span class="eyebrow">TAP THE K-TAG</span><h1>Bring your<br /><em>value with you.</em></h1><p>The seller gets the benefit signals you approve. Nothing more.</p><button class="primary-cta" data-action="create-invoice">Tap Luma K-Tag <span>→</span></button><button class="quiet-cta" data-action="dashboard">Back to cockpit</button></div>`}</div></main>`);
}

function sellerDashboard() {
  return shell(`<main class="seller-cockpit"><div class="seller-cover" style="background-image:url('/assets/scene-seller.png')"><div class="hero-shade"></div><div><span class="eyebrow">LUMA MARKET · K-ASSISTANT</span><h1>Good morning.<br /><em>Let’s run it well.</em></h1></div><div class="seller-live"><i></i> K-Tag live</div></div><div class="seller-tabs"><button class="active">Today</button><button>Orders</button><button data-action="catalogue">Catalogue</button><button>Intelligence</button></div><div class="seller-metrics"><article><small>TO ACTION</small><strong>04</strong><span>orders waiting</span></article><article><small>VALUE</small><strong>AED 8.4k</strong><span>today · +12.8%</span></article><article><small>STOCK</small><strong>86%</strong><span>healthy shelf</span></article></div><div class="seller-columns"><div class="seller-list"><h2>Today</h2><div class="seller-row"><i class="status-live"></i><span><b>#1048 · Maya</b><small>Invoice waiting for approval</small></span><strong>AED 66</strong></div><div class="seller-row"><i class="status-done"></i><span><b>#1047 · Sarah</b><small>Paid · receipt matched</small></span><strong>AED 128</strong></div><div class="seller-row"><i class="status-warn"></i><span><b>Granola cup</b><small>Low stock · 4 left</small></span><strong>Restock</strong></div></div><div class="seller-scene" style="background-image:url('/assets/scene-cockpit.png')"><span>K-assistant</span><strong>Your store<br />is learning.</strong></div></div></main>`);
}

function receipt() {
  return shell(`<main class="receipt-page"><div class="receipt-visual" style="background-image:url('/assets/scene-home.jpg')"><div class="hero-shade"></div><div class="receipt-check">✓</div><span>PAYMENT COMPLETE</span><h1>Good<br /><em>choice.</em></h1></div><div class="receipt-card"><div><span>Luma Market</span><b>AED 66.00</b></div><div class="receipt-stats"><span><b>− AED 6</b><small>saved</small></span><span><b>+66</b><small>points</small></span><span><b>+0.066</b><small>mg Gold</small></span></div><p>Your receipt is ready. Your spending picture just got clearer.</p><button class="primary-cta" data-action="dashboard">Back to cockpit <span>→</span></button></div></main>`);
}

function sourceMap() {
  return `<main class="source-map"><div class="map-head"><span class="eyebrow">K-ASSISTANT · VALUE MAP</span><h1>Find<br /><em>more value.</em></h1><p>One source at a time. You stay in control.</p></div><div class="source-cards">${state.sources.map((source) => `<button class="source-tile ${source.status}" data-action="source" data-source="${esc(source.id)}"><span>${source.icon}</span><div><b>${esc(source.label)}</b><small>${esc(source.benefit)}</small></div><strong>${source.status === 'connected' ? '✓' : source.status === 'locked' ? 'Lost' : 'Open'}</strong></button>`).join('')}</div><button class="quiet-cta" data-action="dashboard">Back to cockpit</button></main>`;
}

function catalogue() {
  return `<main class="catalogue-page"><div class="catalogue-head"><span class="eyebrow">LUMA MARKET · SHELF</span><h1>Ready<br /><em>to share.</em></h1><button class="primary-cta" data-action="dashboard">Business cockpit <span>→</span></button></div><div class="catalogue-tiles"><article style="background-image:url('/assets/catalogue-coffee.svg')"><b>Ethiopian cold brew</b><span>AED 24 · 18 left</span></article><article style="background-image:url('/assets/catalogue-granola.svg')"><b>Granola cup</b><span>AED 18 · 4 left</span></article><article style="background-image:url('/assets/catalogue-water.svg')"><b>Still water</b><span>AED 5 · 148 left</span></article></div></main>`;
}

function render() {
  if (state.view === 'welcome') app.innerHTML = welcome();
  else if (state.view === 'tour') app.innerHTML = tour();
  else if (state.view === 'role-start') app.innerHTML = roleStart();
  else if (state.view === 'buyer-flow') app.innerHTML = buyerFlow();
  else if (state.view === 'seller-flow') app.innerHTML = sellerFlow();
  else if (state.view === 'buyer-dashboard') app.innerHTML = buyerDashboard();
  else if (state.view === 'seller-dashboard') app.innerHTML = sellerDashboard();
  else if (state.view === 'checkout') app.innerHTML = checkout();
  else if (state.view === 'receipt') app.innerHTML = receipt();
  else if (state.view === 'savings') app.innerHTML = shell(sourceMap());
  else if (state.view === 'catalogue') app.innerHTML = shell(catalogue());
  else app.innerHTML = welcome();
}

let tourTimer;
document.addEventListener('click', async (event) => {
  const element = event.target.closest('[data-action]');
  if (!element) return;
  const action = element.dataset.action;
  if (action === 'home') { state.view = 'welcome'; state.role = null; render(); return; }
  if (action === 'tour') {
    state.view = 'tour'; state.tour = 0; render(); clearInterval(tourTimer);
    tourTimer = setInterval(() => { if (state.view !== 'tour') return clearInterval(tourTimer); state.tour += 1; if (state.tour > 4) { clearInterval(tourTimer); state.view = 'welcome'; state.tour = 0; } render(); }, 3000);
    return;
  }
  if (action === 'tour-exit') { clearInterval(tourTimer); state.view = 'welcome'; render(); return; }
  if (action === 'role') { state.role = element.dataset.role; state.view = 'role-start'; render(); return; }
  if (action === 'next-role') { state.view = state.role === 'buyer' ? 'buyer-flow' : 'seller-flow'; render(); return; }
  if (action === 'back') { state.view = state.role === 'buyer' ? 'buyer-flow' : state.role === 'seller' ? 'seller-flow' : 'welcome'; render(); return; }
  if (action === 'buyer-back') { state.buyerStep = Math.max(0, state.buyerStep - 1); render(); return; }
  if (action === 'seller-back') { state.sellerStep = Math.max(0, state.sellerStep - 1); render(); return; }
  if (action === 'buyer-flow') { state.view = 'buyer-flow'; render(); return; }
  if (action === 'dashboard') { state.view = state.role === 'seller' ? 'seller-dashboard' : 'buyer-dashboard'; render(); return; }
  if (action === 'checkout') { state.view = 'checkout'; render(); return; }
  if (action === 'receipt') { state.view = 'receipt'; render(); return; }
  if (action === 'savings') { await getSources(); state.view = 'savings'; render(); return; }
  if (action === 'catalogue') { state.view = 'catalogue'; render(); return; }
  if (action === 'verify-user') {
    state.name = document.querySelector('#name')?.value.trim() || 'Maya Khan';
    state.mobile = document.querySelector('#mobile')?.value.trim() || '+971 50 000 0000';
    state.email = document.querySelector('#email')?.value.trim() || 'maya@example.com';
    const account = await post('/api/account/create', { name: state.name, mobile: state.mobile, email: state.email });
    state.account = account;
    if (account.error) return notify(account.error, 'error');
    notify('Two OTPs approved. Your Gold vault is opening.', 'success'); state.buyerStep += 1; render(); return;
  }
  if (action === 'buyer-action') {
    const kind = element.dataset.kind;
    if (kind === 'tap-start') { state.view = 'checkout'; render(); return; }
    if (kind === 'account') { state.buyerStep = 1; render(); return; }
    await getSources();
    const source = { reward: 'rewards', offers: 'memberships', payment: 'cards' }[kind];
    if (source) { await post('/api/savings-map/connect', { sourceId: source }); state.permissions[source] = 'approved'; state.buyerStep += 1; notify('Approved. I’ll look for value now.', 'success'); render(); }
    return;
  }
  if (action === 'create-invoice') {
    const exchange = await post('/api/tap/exchange', { kTag: 'K-LUMA-001', buyerId: state.account?.id || 'buyer-maya', capabilities: ['memberships', 'rewards', 'promocodes', 'vouchers', 'cards', 'accounts'] });
    if (exchange.error) return notify(exchange.error, 'error');
    state.invoice = await post('/api/invoice/create'); state.view = 'checkout'; render(); return;
  }
  if (action === 'approve') { state.receipt = await post('/api/checkout/approve'); if (state.receipt.error) return notify(state.receipt.error, 'error'); state.view = 'receipt'; notify('Approved. Gold is on its way.', 'success'); render(); return; }
  if (action === 'stop') { await post('/api/checkout/stop'); notify('Stopped. Nothing was paid.'); state.invoice = null; render(); return; }
  if (action === 'seller-action') {
    if (state.sellerStep === 0) { const business = document.querySelector('#business')?.value || 'Luma Market'; await post('/api/onboarding/permission', { role: 'seller', id: 'business-account', enabled: true, metadata: { business } }); }
    if (state.sellerStep === 3) state.view = 'seller-dashboard'; else state.sellerStep += 1;
    notify(state.sellerStep === 1 ? 'K-Assistant is ready.' : 'Good move. Your store is getting clearer.', 'success'); render(); return;
  }
  if (action === 'source') {
    const id = element.dataset.source;
    if (element.classList.contains('locked')) return notify('This source needs its official provider connection first.');
    const sheet = document.createElement('div'); sheet.innerHTML = sourceSheet(id); document.body.append(sheet.firstElementChild); return;
  }
  if (action === 'decline-source') { document.querySelector('.permission-sheet')?.remove(); notify('No problem. This opportunity stays visible.'); return; }
  if (action === 'approve-source') {
    const id = element.dataset.source;
    if (id === 'notifications' && 'Notification' in window) await Notification.requestPermission();
    if (id === 'cards' && navigator.mediaDevices?.getUserMedia) { try { const stream = await navigator.mediaDevices.getUserMedia({ video: true }); stream.getTracks().forEach((track) => track.stop()); } catch { notify('Camera permission was not granted.'); } }
    const result = await post('/api/savings-map/connect', { sourceId: id }); document.querySelector('.permission-sheet')?.remove();
    if (result.error) return notify(result.error, 'error');
    await getSources(); render(); notify('Connected. I’ll search for savings.', 'success');
  }
});

getSources().catch(() => {});
render();
