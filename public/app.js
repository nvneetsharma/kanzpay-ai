const app = document.querySelector('#app');
const toast = document.querySelector('#toast');

const state = {
  role: null,
  step: 'welcome',
  email: '',
  name: '',
  persona: null,
  permissions: {},
  qr: null,
  waitlist: false,
  gold: { amount: 1, unit: 'mg', status: 'processing' }
};

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const notify = (message, kind = '') => {
  toast.className = `toast show ${kind}`;
  toast.textContent = message;
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.className = 'toast', 2800);
};
const post = async (path, payload = {}) => {
  const response = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  return response.json();
};
const pct = () => Math.max(0, Math.round((['welcome', 'waitlist', 'role', 'profile', 'connections', 'qr', 'ready'].indexOf(state.step) / 6) * 100));
const initials = () => (state.name || 'K').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

function chrome(content, { dark = false } = {}) {
  return `<div class="journey-shell ${dark ? 'journey-dark' : ''}">
    <header class="journey-header">
      <button class="wordmark" data-action="home"><img src="/assets/kanzpay-mark.png" alt="" /><span>Kanzpay</span></button>
      <div class="header-status"><span class="pulse"></span> private beta <span class="header-divider"></span>${pct()}% ready</div>
      <button class="quiet-button" data-action="help">Need help?</button>
    </header>
    <div class="journey-progress"><span style="width:${Math.max(6, pct())}%"></span></div>
    ${content}
    <footer class="journey-footer"><span>Built for a calmer, more rewarding money life.</span><span>Sandbox · no live money movement</span></footer>
  </div>`;
}

function welcome() {
  return chrome(`<section class="welcome-stage">
    <div class="welcome-copy">
      <div class="eyebrow"><span class="gold-dot"></span> a new way to move through money</div>
      <h1>Your money,<br /><em>with more back.</em></h1>
      <p class="lead">Kanzpay brings your accounts, rewards, memberships and everyday decisions into one intelligent, rewarding life.</p>
      <div class="welcome-actions"><button class="gold-button" data-action="waitlist">Join the waitlist <span>↗</span></button><button class="text-button" data-action="tour">Take the 60-second tour</button></div>
      <div class="trust-row"><span>✦</span><span>Private by design</span><span>·</span><span>UAE first</span><span>·</span><span>Human when it matters</span></div>
    </div>
    <div class="orb-scene" aria-hidden="true"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="gold-orb"><span>1</span><small>mg</small></div><div class="orb-caption">A little gold<br /><strong>to begin with.</strong></div><div class="ray ray-a"></div><div class="ray ray-b"></div><div class="ray ray-c"></div></div>
    <div class="welcome-note"><span class="note-icon">◌</span><span>Start with a profile. Grow into a richer picture of your money.</span></div>
  </section>`);
}

function waitlist() {
  return chrome(`<section class="center-stage">
    <div class="step-label">01 / 06 · Your first hello</div>
    <div class="mini-orb"><span>1</span><small>mg</small></div>
    <h1>Be among the first<br /><em>to get more back.</em></h1>
    <p class="lead narrow">Join the Kanzpay waitlist and we’ll start your Gold journey with <strong>1 mg of Gold</strong>—processing now, ready when you are.</p>
    <form class="waitlist-form" data-form="waitlist"><input name="email" type="email" placeholder="Your email address" value="${esc(state.email)}" required /><button class="gold-button" type="submit">Reserve my place <span>↗</span></button></form>
    <div class="role-hint">Joining as a <button data-action="choose-role">buyer or seller?</button> You can switch later.</div>
    <div class="privacy-line">No noise. No selling your data. Just your place in line.</div>
  </section>`);
}

function role() {
  return chrome(`<section class="choice-stage">
    <div class="step-label">02 / 06 · Let’s make it yours</div>
    <h1>Which money life<br /><em>are we joining?</em></h1>
    <p class="lead narrow">I’ll tailor every question, connection and dashboard around the way you actually move.</p>
    <div class="role-grid">
      <button class="role-card ${state.role === 'buyer' ? 'selected' : ''}" data-role="buyer"><span class="role-icon buyer-icon">◒</span><span class="role-title">My money</span><span class="role-copy">Save more, earn Gold, understand every spend.</span><span class="role-arrow">↗</span></button>
      <button class="role-card ${state.role === 'seller' ? 'selected' : ''}" data-role="seller"><span class="role-icon seller-icon">⌁</span><span class="role-title">My business</span><span class="role-copy">Turn every order into a relationship worth keeping.</span><span class="role-arrow">↗</span></button>
    </div>
    <button class="back-link" data-action="back">← Back</button>
  </section>`);
}

const profileCopy = {
  buyer: {
    label: 'A little about you',
    title: 'Who should I be<br /><em>looking after?</em>',
    sub: 'Your answer changes the way I protect your money and surface opportunities. Nothing here is a box to fit into.',
    options: [['adult', 'Adult life', 'Everyday money, memberships and goals'], ['family', 'Household', 'Shared money, family plans and care'], ['employee', 'Work life', 'Salary cycles, reimbursements and benefits'], ['young', 'Young adult', 'A confident start with gentle guardrails']]
  },
  seller: {
    label: 'A little about your business',
    title: 'Tell me where your<br /><em>customers find you.</em>',
    sub: 'I’ll shape your workspace around the rhythm of your business—not force you into a generic dashboard.',
    options: [['grocery', 'Grocery', 'Stock, repeat baskets and daily volume'], ['cafe', 'Cafe / restaurant', 'Orders, tables, loyalty and busy periods'], ['services', 'Services', 'Appointments, invoices and payables'], ['education', 'Education / care', 'Plans, approvals and recurring collections']]
  }
};

function profile() {
  const copy = profileCopy[state.role];
  return chrome(`<section class="choice-stage">
    <div class="step-label">03 / 06 · ${copy.label}</div>
    <h1>${copy.title}</h1>
    <p class="lead narrow">${copy.sub}</p>
    <div class="profile-grid">${copy.options.map(([id, name, desc]) => `<button class="profile-card ${state.persona === id ? 'selected' : ''}" data-persona="${id}"><span class="radio">${state.persona === id ? '✓' : ''}</span><span><strong>${name}</strong><small>${desc}</small></span></button>`).join('')}</div>
    <div class="profile-fields"><label>Your name<input name="name" placeholder="${state.role === 'buyer' ? 'e.g. Maya Khan' : 'e.g. Luma Market'}" value="${esc(state.name)}" /></label><label>Where do you live?<select name="location"><option>United Arab Emirates</option><option>Saudi Arabia</option><option>Other</option></select></label></div>
    <button class="gold-button next-button ${state.persona ? '' : 'disabled'}" data-action="profile-next">Continue <span>↗</span></button>
    <button class="back-link" data-action="back">← Back</button>
  </section>`);
}

const connectionCopy = {
  buyer: [
    ['money', 'See your money clearly', 'Connect your bank accounts and cards so I can help you choose the safest way to pay—not just the first way.', 'Connect banks & cards', 'Balances, transactions, cash floor'],
    ['rewards', 'Bring your rewards with you', 'I can look for memberships and points you already have, with your permission. You stay in control.', 'Connect memberships & points', 'Fazaa · Esaad · airline points · issuer offers'],
    ['discovery', 'Never miss a better price', 'Promo codes and vouchers are optional. Add them now or let me discover candidates later.', 'Add promos & vouchers', 'Codes, vouchers, public offers']
  ],
  seller: [
    ['money', 'Let customers pay with confidence', 'Connect the bank and card rails you accept so I can show safe checkout paths and reconcile every settlement.', 'Connect bank & cards', 'Aani · Jaywan · Visa · Mastercard'],
    ['rewards', 'Turn loyalty into a reason to return', 'Tell me which memberships you accept and where your rewards points live. I’ll keep the rules clear for every customer.', 'Set up memberships & points', 'Accepted programmes · points API · rewards budget'],
    ['discovery', 'Make your offers discoverable', 'Issue promo codes and vouchers from one place, with guardrails for dates, stock and margin.', 'Create promos & vouchers', 'Codes, vouchers, gifts, exclusions']
  ]
};

function connections() {
  const items = connectionCopy[state.role];
  const completed = Object.values(state.permissions).filter(Boolean).length;
  return chrome(`<section class="connection-stage">
    <div class="step-label">04 / 06 · Your connections</div>
    <div class="connection-layout"><div class="connection-copy"><h1>Let’s connect the<br /><em>good stuff.</em></h1><p class="lead">I’ll explain every permission before I ask for it. You can skip anything and come back whenever you’re ready.</p><div class="permission-meter"><div class="meter-label"><span>${completed} of 3 connected</span><span>${Math.round(completed / 3 * 100)}%</span></div><div class="meter"><span style="width:${completed / 3 * 100}%"></span></div></div><div class="ai-note"><span class="ai-face">✦</span><span><strong>I’m your K-assistant.</strong><br />I’ll keep the useful things close and the complicated things in the background.</span></div></div><div class="connection-list">${items.map(([id, title, desc, cta, detail]) => `<button class="connection-card ${state.permissions[id] ? 'connected' : ''}" data-connection="${id}"><span class="connection-mark ${id}">${id === 'money' ? '◌' : id === 'rewards' ? '✦' : '⌁'}</span><span class="connection-main"><strong>${title}</strong><small>${desc}</small><em>${detail}</em></span><span class="connection-action">${state.permissions[id] ? 'Connected ✓' : cta + ' ↗'}</span></button>`).join('')}<button class="skip-link" data-action="connections-next">${completed === 3 ? 'Continue to your Universal QR ↗' : 'Skip for now'}</button></div></div>
  </section>`, { dark: true });
}

function qr() {
  return chrome(`<section class="qr-stage">
    <div class="step-label">05 / 06 · Your universal key</div>
    <div class="qr-layout"><div><h1>One QR.<br /><em>More of you.</em></h1><p class="lead narrow">Your Universal QR lets reward-identifying scanners recognise the benefits you’ve chosen to share—without handing over your accounts or passwords.</p><div class="qr-points"><div><span>01</span><strong>Private</strong><small>Only approved attributes are shared.</small></div><div><span>02</span><strong>Portable</strong><small>Works across participating reward journeys.</small></div><div><span>03</span><strong>Revocable</strong><small>Stop access whenever you want.</small></div></div><button class="gold-button" data-action="generate-qr">${state.qr ? 'Regenerate Universal QR' : 'Generate my Universal QR'} <span>↗</span></button></div><div class="qr-card"><div class="qr-orbit"></div><div class="qr-code">${state.qr ? qrPattern() : '<span class="qr-lock">⌁</span>'}</div><div class="qr-caption">${state.qr ? `<strong>${esc(state.name || 'Your Kanzpay identity')}</strong><small>Ready to share · ${state.role === 'buyer' ? 'buyer benefits' : 'seller benefits'}</small>` : '<strong>Your QR is waiting</strong><small>Generate it when you’re ready</small>'}</div></div></div>
  </section>`);
}

function qrPattern() {
  return `<div class="qr-pattern">${Array.from({ length: 81 }, (_, index) => `<i class="${[0,1,2,8,9,10,70,71,72,78,79,80,4,5,6,13,14,15,67,68,69,76,77,78].includes(index) ? 'finder' : ''}"></i>`).join('')}</div>`;
}

function readiness() {
  const completed = Object.values(state.permissions).filter(Boolean).length;
  return chrome(`<section class="ready-stage">
    <div class="step-label">06 / 06 · Your Kanzpay readiness</div>
    <div class="ready-header"><div><h1>You’re on your way<br /><em>to more back.</em></h1><p class="lead narrow">Here’s what’s ready, what’s processing, and the one thing that unlocks live Gold.</p></div><div class="ready-orb"><span>1</span><small>mg</small><em>processing</em></div></div>
    <div class="readiness-grid"><div class="readiness-list">${[
      ['Profile', 'Built around ' + (state.persona || 'your life'), true],
      ['Bank & card connections', completed > 0 ? 'Sandbox connections ready' : 'Connect when you’re ready', completed > 0],
      [state.role === 'buyer' ? 'Memberships & points' : 'Accepted rewards', completed > 1 ? 'Permission captured · review anytime' : 'Optional · not connected', completed > 1],
      ['Universal QR', state.qr ? 'Generated · revocable anytime' : 'Waiting for generation', Boolean(state.qr)],
      ['KYC', 'Unlocks live Gold when Kanzpay goes live', false]
    ].map(([name, desc, done], index) => `<div class="ready-row ${done ? 'done' : ''} ${name === 'KYC' ? 'locked' : ''}"><span class="ready-index">${done ? '✓' : String(index + 1).padStart(2, '0')}</span><span><strong>${name}</strong><small>${desc}</small></span><span class="ready-state">${done ? 'Ready' : name === 'KYC' ? 'Coming soon' : 'Open'}</span></div>`).join('')}</div><div class="ready-side"><div class="gold-panel"><span class="eyebrow">Your welcome Gold</span><div class="gold-amount">1 <small>mg</small></div><p>We’re keeping it safe in processing until your profile is complete and KYC is available.</p><button class="text-button" data-action="gold-info">How Gold works ↗</button></div><div class="ready-next"><span class="ai-face">✦</span><div><strong>Next, I’ll make your home feel like yours.</strong><small>Your ${state.role} dashboard is ready.</small></div><button class="gold-button" data-action="dashboard">Enter Kanzpay <span>↗</span></button></div></div></div>
  </section>`);
}

function buyerDashboard() {
  return dashboardShell('buyer', `<div class="dash-hero buyer-hero"><div><span class="eyebrow">Good morning, ${esc(state.name || 'Maya')}</span><h1>Your money is<br /><em>starting to give back.</em></h1><p>Here’s the calm view of what’s moving, what’s protected and what’s earning.</p></div><div class="dash-orb"><div class="dash-gold">1 <small>mg</small></div><span>processing</span></div></div>
    <div class="dash-grid top-cards"><article class="glass-card balance-card"><span class="card-label">Total balance</span><strong>AED 42,680<span class="verified">●</span></strong><small>Across 3 connected accounts</small><div class="balance-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article><article class="glass-card"><span class="card-label">Gold earned</span><strong class="gold-text">0.00 <small>mg</small></strong><small>1 mg processing · KYC pending</small><button class="card-link" data-action="gold-info">View Gold journey ↗</button></article><article class="glass-card"><span class="card-label">Rewards found</span><strong>AED 384 <small>this month</small></strong><small>Across 7 memberships and offers</small><button class="card-link">Open rewards wallet ↗</button></article></div>
    <div class="dash-grid split-dash"><article class="glass-card"><div class="dash-section-head"><span>Spending rhythm</span><button>See trends ↗</button></div><div class="spend-chart"><div class="chart-y"><span>AED 4k</span><span>2k</span><span>0</span></div><div class="chart-bars">${['M','T','W','T','F','S','S'].map((day, i) => `<div><i style="height:${[46,70,34,82,62,52,38][i]}%"></i><small>${day}</small></div>`).join('')}</div></div><div class="chart-note"><span class="green-dot"></span> You’re spending 12% less than last week.</div></article><article class="glass-card"><div class="dash-section-head"><span>Coming up</span><button>Manage bills ↗</button></div><div class="bill-row"><span class="bill-icon">⌂</span><span><strong>Home rent</strong><small>Due in 8 days</small></span><b>AED 5,200</b></div><div class="bill-row"><span class="bill-icon">≋</span><span><strong>DEWA</strong><small>Auto-detected · 15 Oct</small></span><b>AED 386</b></div><div class="bill-row"><span class="bill-icon">◌</span><span><strong>Careem Plus</strong><small>Recurring · 19 Oct</small></span><b>AED 24</b></div></article></div>
    <div class="dash-grid split-dash"><article class="glass-card"><div class="dash-section-head"><span>Recent transactions</span><button>View all ↗</button></div><div class="transaction"><span class="merchant merchant-grocery">C</span><span><strong>Carrefour</strong><small>Groceries · matched receipt</small></span><b>AED 72.60</b></div><div class="transaction"><span class="merchant merchant-cafe">L</span><span><strong>Luma Market</strong><small>Membership benefit applied</small></span><b>AED 66.00</b></div><div class="transaction"><span class="merchant merchant-transport">C</span><span><strong>Careem</strong><small>Transport · Tuesday</small></span><b>AED 42.00</b></div></article><article class="glass-card reward-card"><span class="eyebrow">A thought from K-assistant</span><h3>“Your Luma membership could have saved you AED 18 more this month.”</h3><p>Let me keep looking for moments like this?</p><button class="gold-button">Yes, keep me ahead ↗</button></article></div>`);
}

function sellerDashboard() {
  return dashboardShell('seller', `<div class="dash-hero seller-hero"><div><span class="eyebrow">Luma Market · ${esc(state.persona || 'cafe')}</span><h1>Your business,<br /><em>in its best light.</em></h1><p>One view for the orders, stock, rewards and cash movement that keep today running.</p></div><div class="seller-status"><span class="green-dot"></span><strong>Ready to accept PACT</strong><small>Universal QR active · 3 rewards connected</small></div></div>
    <div class="dash-grid top-cards"><article class="glass-card"><span class="card-label">Today’s order value</span><strong>AED 8,420 <small class="positive">+12.8%</small></strong><small>vs AED 7,470 same day last week</small><div class="micro-spark"><i></i><i></i><i></i><i></i><i></i><i></i></div></article><article class="glass-card"><span class="card-label">Orders</span><strong>126 <small class="positive">+8.4%</small></strong><small>31 PACT-ready · 4 awaiting payment</small><button class="card-link">Open orders ↗</button></article><article class="glass-card"><span class="card-label">Stock health</span><strong class="gold-text">86<span>%</span></strong><small>2 low-stock SKUs · 1 stock-out risk</small><button class="card-link">Review inventory ↗</button></article></div>
    <div class="dash-grid split-dash"><article class="glass-card"><div class="dash-section-head"><span>Orders at a glance</span><button>Open order book ↗</button></div><div class="order-row"><span class="order-status live"></span><span><strong>#1048 · Maya Khan</strong><small>3 items · PACT quote ready</small></span><b>AED 66.00</b><span class="status-pill">Awaiting pay</span></div><div class="order-row"><span class="order-status done"></span><span><strong>#1047 · Sarah Ahmed</strong><small>5 items · receipt matched</small></span><b>AED 128.40</b><span class="status-pill done-pill">Complete</span></div><div class="order-row"><span class="order-status done"></span><span><strong>#1046 · Omar Ali</strong><small>2 items · Aani settled</small></span><b>AED 44.00</b><span class="status-pill done-pill">Complete</span></div></article><article class="glass-card"><div class="dash-section-head"><span>Stock intelligence</span><button>Catalogue ↗</button></div><div class="stock-row"><span class="stock-dot warn"></span><span><strong>Ethiopian cold brew</strong><small>SKU CB-220 · 2 days left</small></span><b>18 left</b></div><div class="stock-row"><span class="stock-dot danger-dot"></span><span><strong>Granola cup</strong><small>SKU GC-101 · stock-out risk</small></span><b>4 left</b></div><div class="stock-row"><span class="stock-dot good-dot"></span><span><strong>Still water 500ml</strong><small>SKU SW-018 · 12 days left</small></span><b>148 left</b></div></article></div>
    <div class="dash-grid split-dash"><article class="glass-card"><div class="dash-section-head"><span>Rewards issued</span><button>Manage rules ↗</button></div><div class="reward-stat"><strong>AED 384</strong><small>customer savings · this month</small><div class="progress-line"><span style="width:68%"></span></div><small>68% of your AED 560 rewards budget used</small></div></article><article class="glass-card reward-card seller-reward"><span class="eyebrow">K-assistant suggestion</span><h3>“Your Saturday breakfast basket is winning. Want a QR offer for slow Mondays?”</h3><button class="gold-button">Create an offer ↗</button></article></div>`);
}

function dashboardShell(role, content) {
  return `<div class="dashboard-frame"><header class="dash-nav"><button class="wordmark" data-action="home"><img src="/assets/kanzpay-mark.png" alt="" /><span>Kanzpay</span></button><div class="dash-nav-center"><button class="dash-nav-active">${role === 'buyer' ? 'My money' : 'My business'}</button><button>Rewards</button><button>Activity</button><button>Ask K</button></div><div class="dash-user"><div class="dash-qr" data-action="qr">⌁</div><div class="dash-avatar">${initials()}</div><button class="nav-menu">⋮</button></div></header><div class="dashboard-content">${content}</div><footer class="dash-footer"><span>Private beta · sandbox data</span><span data-action="ready">Readiness 80% · View</span></footer></div>`;
}

function render() {
  if (state.step === 'welcome') app.innerHTML = welcome();
  if (state.step === 'waitlist') app.innerHTML = waitlist();
  if (state.step === 'role') app.innerHTML = role();
  if (state.step === 'profile') app.innerHTML = profile();
  if (state.step === 'connections') app.innerHTML = connections();
  if (state.step === 'qr') app.innerHTML = qr();
  if (state.step === 'ready') app.innerHTML = readiness();
  if (state.step === 'dashboard') app.innerHTML = state.role === 'seller' ? sellerDashboard() : buyerDashboard();
  bind();
}

async function joinWaitlist(form) {
  state.email = form.email.value;
  state.waitlist = true;
  await post('/api/waitlist', { email: state.email });
  notify('Your place is reserved. Your Gold is now processing.', 'success');
  state.step = 'role';
  render();
}

async function connect(id) {
  const item = connectionCopy[state.role].find(([key]) => key === id);
  const first = !state.permissions[id];
  if (first) {
    notify(`Permission preview: ${item[4]}`);
    const allowed = window.confirm(`${item[1]}\n\n${item[2]}\n\nContinue with the sandbox permission?`);
    if (!allowed) { notify('No problem. Your choice is saved privately.'); return; }
  }
  state.permissions[id] = !state.permissions[id];
  await post('/api/onboarding/permission', { role: state.role, id, enabled: state.permissions[id] });
  notify(state.permissions[id] ? `${item[1]} connected.` : `${item[1]} disconnected.`, state.permissions[id] ? 'success' : '');
  render();
}

function bind() {
  document.querySelectorAll('[data-action]').forEach((element) => element.addEventListener('click', async () => {
    const action = element.dataset.action;
    if (action === 'waitlist') state.step = 'waitlist';
    if (action === 'tour') { notify('I’ll take you one thoughtful step at a time.'); state.step = 'waitlist'; }
    if (action === 'choose-role') state.step = 'role';
    if (action === 'home') { state.step = 'welcome'; state.role = null; }
    if (action === 'help') notify('K-assistant is here. Nothing is permanent in this sandbox.');
    if (action === 'back') state.step = state.step === 'profile' ? 'role' : state.step === 'connections' ? 'profile' : state.step === 'qr' ? 'connections' : 'welcome';
    if (action === 'profile-next') {
      state.name = document.querySelector('input[name="name"]')?.value || state.name;
      if (!state.persona) return notify('Choose the profile that feels closest.');
      state.step = 'connections';
    }
    if (action === 'connections-next') state.step = 'qr';
    if (action === 'generate-qr') { state.qr = `KZ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`; await post('/api/onboarding/qr', { role: state.role, value: state.qr }); notify('Your Universal QR is ready to share.', 'success'); }
    if (action === 'dashboard') state.step = 'dashboard';
    if (action === 'gold-info') notify('Gold is processing in sandbox. KYC unlocks live use when Kanzpay launches.');
    if (action === 'qr') state.step = 'qr';
    if (action === 'ready') state.step = 'ready';
    render();
  }));
  document.querySelectorAll('[data-role]').forEach((element) => element.addEventListener('click', () => { state.role = element.dataset.role; state.persona = null; state.step = 'profile'; render(); }));
  document.querySelectorAll('[data-persona]').forEach((element) => element.addEventListener('click', () => { state.persona = element.dataset.persona; render(); }));
  document.querySelectorAll('[data-connection]').forEach((element) => element.addEventListener('click', () => connect(element.dataset.connection)));
  document.querySelector('[data-form="waitlist"]')?.addEventListener('submit', (event) => { event.preventDefault(); joinWaitlist(event.currentTarget); });
}

render();
