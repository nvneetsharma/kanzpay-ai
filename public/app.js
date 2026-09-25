const app = document.querySelector('#app');
const toast = document.querySelector('#toast');

const state = {
  role: null,
  step: 'welcome',
  email: '',
  mobile: '',
  name: '',
  account: null,
  persona: null,
  permissions: {},
  qr: null,
  waitlist: false,
  gold: { amount: 1, unit: 'mg', status: 'processing' }
  ,tourIndex: 0
};

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const money = (minor) => `AED ${(minor / 100).toFixed(2)}`;
let tourTimer;
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
const pct = () => Math.max(0, Math.round((['welcome', 'waitlist', 'role', 'profile', 'connections', 'qr', 'ready', 'tap', 'invoice', 'dashboard'].indexOf(state.step) / 9) * 100));
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
    <footer class="journey-footer"><span>Built with <b>♥</b> in UAE <b>🇦🇪</b> by OXY Technologies, ADGM, Abu Dhabi.</span><span>Sandbox · no live money movement</span></footer>
  </div>`;
}

function welcome() {
  return chrome(`<section class="welcome-stage">
    <div class="welcome-copy">
      <div class="eyebrow"><span class="gold-dot"></span> a new way to move through money</div>
      <h1>Pay less.<br /><em>Earn Gold.</em></h1>
      <p class="lead">Your benefits do the searching. You make the final choice.</p>
      <div class="welcome-actions"><button class="gold-button" data-action="waitlist">Join free · Get 1 mg Gold <span>↗</span></button><button class="text-button" data-action="tour">Watch the 15-second story <span>◉</span></button></div>
      <div class="trust-row"><span>✦</span><span>Tap</span><span>→</span><span>Save</span><span>→</span><span>Earn</span></div>
    </div>
    <div class="orb-scene" aria-hidden="true"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="gold-orb"><span>1</span><small>mg</small></div><div class="orb-caption">A little gold<br /><strong>to begin with.</strong></div><div class="ray ray-a"></div><div class="ray ray-b"></div><div class="ray ray-c"></div></div>
    <div class="welcome-note"><span class="note-icon">◌</span><span>One tap. One clear next step.</span></div>
  </section>`);
}

const tourScenes = [
  { kicker: '01 · your start', title: 'Get Gold.', visual: '<div class="tour-coin">1<small>mg</small></div>', note: 'Your first 1 mg begins processing.' },
  { kicker: '02 · at the counter', title: 'Tap once.', visual: '<div class="tour-tap"><span>⌁</span><i></i><b>K·TAG</b></div>', note: 'Your approved benefits travel with you.' },
  { kicker: '03 · before pay', title: 'Save first.', visual: '<div class="tour-invoice"><span>− AED 6.00</span><b>AED 66.00</b></div>', note: 'Membership and card offers lower the bill.' },
  { kicker: '04 · after pay', title: 'Earn back.', visual: '<div class="tour-reward"><b>+66</b><small>points</small><i>+0.066 mg Gold</i></div>', note: 'Your points and Gold move into the vault.' },
  { kicker: '05 · every day', title: 'See more.', visual: '<div class="tour-cockpit"><i></i><i></i><i></i><i></i></div>', note: 'Receipts become a calmer money picture.' }
];

function tour() {
  const scene = tourScenes[state.tourIndex];
  return chrome(`<section class="tour-stage">
    <div class="tour-top"><span class="eyebrow"><span class="gold-dot"></span> Kanzpay in 15 seconds</span><button class="quiet-button" data-action="tour-exit">Skip story</button></div>
    <div class="tour-scene" data-tour-scene><div class="tour-copy"><span class="step-label">${scene.kicker}</span><h1>${scene.title}</h1><p>${scene.note}</p></div><div class="tour-visual">${scene.visual}</div></div>
    <div class="tour-line">${tourScenes.map((_, index) => `<span class="${index === state.tourIndex ? 'active' : index < state.tourIndex ? 'done' : ''}"></span>`).join('')}</div>
    <div class="tour-bottom"><span>Watch how value flows</span><button class="gold-button" data-action="tour-next">${state.tourIndex === tourScenes.length - 1 ? 'Join free · Get 1 mg Gold' : 'Next moment'} <span>↗</span></button></div>
  </section>`);
}

function waitlist() {
  return chrome(`<section class="center-stage">
    <div class="step-label">01 / 06 · Your first hello</div>
    <div class="mini-orb"><span>1</span><small>mg</small></div>
    <h1>Start with Gold.</h1>
    <p class="lead narrow">Create your account. Your first <strong>1 mg</strong> starts processing now.</p>
    <form class="waitlist-form account-form" data-form="waitlist"><input name="name" placeholder="Your name" value="${esc(state.name)}" required /><input name="mobile" type="tel" placeholder="Mobile number" value="${esc(state.mobile)}" required /><input name="email" type="email" placeholder="Email" value="${esc(state.email)}" required /><button class="gold-button" type="submit">Create account · Get Gold <span>↗</span></button></form>
    <div class="role-hint">Joining as a <button data-action="choose-role">buyer or seller?</button> You can switch later.</div>
    <div class="privacy-line">Your sandbox account starts with 1 mg Gold processing.</div>
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
    title: 'Your money<br /><em>in one view.</em>',
    sub: 'Choose the picture that feels closest.',
    options: [['adult', 'Adult life', 'Everyday money, memberships and goals'], ['family', 'Household', 'Shared money, family plans and care'], ['employee', 'Work life', 'Salary cycles, reimbursements and benefits'], ['young', 'Young adult', 'A confident start with gentle guardrails']]
  },
  seller: {
    label: 'A little about your business',
    title: 'Your business<br /><em>in one view.</em>',
    sub: 'Choose the rhythm that feels closest.',
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
    <div class="connection-layout"><div class="connection-copy"><h1>Choose your<br /><em>power.</em></h1><p class="lead">Each tap adds one useful layer. You can skip and return.</p><div class="permission-meter"><div class="meter-label"><span>${completed} of 3 connected</span><span>${Math.round(completed / 3 * 100)}%</span></div><div class="meter"><span style="width:${completed / 3 * 100}%"></span></div></div><div class="ai-note"><span class="ai-face">✦</span><span><strong>Nice choice.</strong><br />I’ll use only the signals you approve.</span></div></div><div class="connection-list">${items.map(([id, title, desc, cta, detail]) => `<button class="connection-card ${state.permissions[id] ? 'connected' : ''}" data-connection="${id}"><span class="connection-mark ${id}">${id === 'money' ? '◌' : id === 'rewards' ? '✦' : '⌁'}</span><span class="connection-main"><strong>${title}</strong><small>${desc}</small><em>${detail}</em></span><span class="connection-action">${state.permissions[id] ? 'Connected ✓' : cta + ' ↗'}</span></button>`).join('')}<button class="skip-link" data-action="connections-next">${completed === 3 ? 'Continue to your Universal QR ↗' : 'Skip for now'}</button></div></div>
  </section>`, { dark: true });
}

function qr() {
  return chrome(`<section class="qr-stage">
    <div class="step-label">05 / 06 · Your universal key</div>
    <div class="qr-layout"><div><h1>One QR.<br /><em>More of you.</em></h1><p class="lead narrow">Your Universal QR lets reward-identifying scanners recognise the benefits you’ve chosen to share—without handing over your accounts or passwords.</p><div class="qr-points"><div><span>01</span><strong>Private</strong><small>Only approved attributes are shared.</small></div><div><span>02</span><strong>Portable</strong><small>Works across participating reward journeys.</small></div><div><span>03</span><strong>Revocable</strong><small>Stop access whenever you want.</small></div></div><button class="gold-button" data-action="generate-qr">${state.qr ? 'Regenerate Universal QR' : 'Generate my Universal QR'} <span>↗</span></button>${state.qr ? '<button class="back-link" data-action="readiness">See my readiness ↗</button>' : ''}</div><div class="qr-card"><div class="qr-orbit"></div><div class="qr-code">${state.qr ? qrPattern() : '<span class="qr-lock">⌁</span>'}</div><div class="qr-caption">${state.qr ? `<strong>${esc(state.name || 'Your Kanzpay identity')}</strong><small>Ready to share · ${state.role === 'buyer' ? 'buyer benefits' : 'seller benefits'}</small>` : '<strong>Your QR is waiting</strong><small>Generate it when you’re ready</small>'}</div></div></div>
  </section>`);
}

function qrPattern() {
  return `<div class="qr-pattern">${Array.from({ length: 81 }, (_, index) => `<i class="${[0,1,2,8,9,10,70,71,72,78,79,80,4,5,6,13,14,15,67,68,69,76,77,78].includes(index) ? 'finder' : ''}"></i>`).join('')}</div>`;
}

function readiness() {
  const completed = Object.values(state.permissions).filter(Boolean).length;
  return chrome(`<section class="ready-stage">
    <div class="step-label">06 / 06 · Your Kanzpay readiness</div>
    <div class="ready-header"><div><h1>Ready to<br /><em>move more.</em></h1><p class="lead narrow">Your Gold, profile and approved powers in one calm view.</p></div><div class="ready-orb"><span>1</span><small>mg</small><em>processing</em></div></div>
    <div class="readiness-grid"><div class="readiness-list">${[
      ['Profile', 'Built around ' + (state.persona || 'your life'), true],
      ['Bank & card connections', completed > 0 ? 'Sandbox connections ready' : 'Connect when you’re ready', completed > 0],
      [state.role === 'buyer' ? 'Memberships & points' : 'Accepted rewards', completed > 1 ? 'Permission captured · review anytime' : 'Optional · not connected', completed > 1],
      ['Universal QR', state.qr ? 'Generated · revocable anytime' : 'Waiting for generation', Boolean(state.qr)],
      ['Account activation', 'Keeps your Gold Vault and payment preferences together', Boolean(state.account)]
    ].map(([name, desc, done], index) => `<div class="ready-row ${done ? 'done' : ''}"><span class="ready-index">${done ? '✓' : String(index + 1).padStart(2, '0')}</span><span><strong>${name}</strong><small>${desc}</small></span><span class="ready-state">${done ? 'Ready' : 'Open'}</span></div>`).join('')}</div><div class="ready-side"><div class="gold-panel"><span class="eyebrow">Your welcome Gold</span><div class="gold-amount">1 <small>mg</small></div><p>Your Gold is processing in the sandbox vault. Complete account activation and connect your benefits to make checkout more valuable.</p><button class="text-button" data-action="gold-info">How Gold works ↗</button></div><div class="ready-next"><span class="ai-face">✦</span><div><strong>Next, I’ll make your home feel like yours.</strong><small>Your ${state.role} dashboard is ready.</small></div><button class="gold-button" data-action="dashboard">Enter Kanzpay <span>↗</span></button></div></div></div>
  </section>`);
}

function checkout() {
  const stages = [
    ['01', 'See the whole basket', 'Kanzpay reads the seller’s signed items first, so you can see exactly what you are paying for before any benefit is considered.', 'Basket is verified'],
    ['02', 'Find what you already own', 'Your connected memberships, points and issuer offers are checked with permission. Tier C discoveries are shown as possibilities—not hidden in the price.', '2 verified benefits found'],
    ['03', 'Choose the calmest way to pay', 'PACT compares your safe rails, balance floor and fees together. It prefers the route least likely to decline or disturb an upcoming obligation.', 'Aani keeps your floor intact'],
    ['04', 'See the reward before you approve', 'You see list price, guaranteed savings, possible savings, points and Gold in one place. Nothing is charged until you say yes.', 'AED 6.60 Gold-eligible spend'],
  ];
  const step = state.checkoutStep || 0;
  const current = stages[step];
  return chrome(`<section class="checkout-stage">
    <div class="checkout-topline"><div class="step-label">Guided checkout · ${state.role === 'seller' ? 'seller preview' : 'buyer view'}</div><button class="back-link" data-action="dashboard">Exit to home</button></div>
    <div class="checkout-intro"><span class="k-orb">✦</span><div><p class="eyebrow">K-assistant is walking beside you</p><h1>Know what happens<br /><em>before you tap.</em></h1><p class="lead">This is not a payment button. It is a quiet conversation about what you can save, what stays protected and what you’ll earn.</p></div></div>
    <div class="checkout-progress">${stages.map((item, index) => `<button class="checkout-dot ${index < step ? 'done' : ''} ${index === step ? 'active' : ''}" data-checkout-step="${index}"><span>${index < step ? '✓' : item[0]}</span><small>${item[1]}</small></button>`).join('')}</div>
    <div class="checkout-card">
      <div class="checkout-card-copy"><span class="eyebrow">Step ${current[0]} · ${current[1]}</span><h2>${current[1]}</h2><p>${current[2]}</p><div class="intent-note"><span class="ai-face">✦</span><span><strong>Why I’m showing you this</strong><small>${step === 0 ? 'A clear basket is the beginning of a confident decision.' : step === 1 ? 'Your benefits should work for you, not become another list to maintain.' : step === 2 ? 'A failed payment at the counter is avoidable when we look at the whole picture.' : 'You should never have to guess what “approve” will do.'}</small></span></div><div class="checkout-actions">${step > 0 ? '<button class="soft-button" data-action="checkout-back">Back</button>' : ''}<button class="gold-button" data-action="checkout-next">${step === stages.length - 1 ? 'Show my exact decision ↗' : 'Show me how ↗'}</button></div></div>
      <div class="checkout-visual ${step === 2 ? 'rail-visual' : ''}">${step === 0 ? `<div class="receipt-visual"><div class="receipt-head"><span>Luma Market</span><b>#1048</b></div><div class="receipt-line"><span>Ethiopian cold brew</span><b>AED 24.00</b></div><div class="receipt-line"><span>Granola cup × 2</span><b>AED 36.00</b></div><div class="receipt-line"><span>Luma membership</span><b>AED 12.00</b></div><div class="receipt-total"><span>Basket total</span><strong>AED 72.00</strong></div><div class="verified-stamp">✓ seller signed</div></div>` : step === 1 ? `<div class="benefit-orbit"><span class="benefit-chip chip-a">Fazaa · AED 4.20</span><span class="benefit-chip chip-b">Visa · AED 1.80</span><span class="benefit-chip chip-c">Email code · possible</span><div class="benefit-core">2<small>verified<br />benefits</small></div></div>` : step === 2 ? `<div class="rail-choice"><div class="rail-choice-row selected"><span class="rail-logo">A</span><span><strong>Aani</strong><small>Balance AED 1,840 · floor protected</small></span><b>safe</b></div><div class="rail-choice-row"><span class="rail-logo muted-rail">J</span><span><strong>Jaywan debit</strong><small>Balance AED 620 · available</small></span><b>backup</b></div><div class="rail-foot">No decline path detected <span>✓</span></div></div>` : `<div class="decision-visual"><div class="price-line"><span>List price</span><b>AED 72.00</b></div><div class="price-line saving"><span>Guaranteed savings</span><b>− AED 6.00</b></div><div class="price-line possible"><span>Possible savings</span><b>up to AED 3.00</b></div><div class="decision-total"><span>You approve</span><strong>AED 66.00</strong><small>+ 66 points · + AED 0.66 Gold</small></div></div>`}</div>
    </div>
  </section>`, { dark: true });
}

function tapExchange() {
  const capabilities = ['reward-point identity', 'membership cards', 'promo codes & vouchers', 'eligible cards / BIN', 'safe payment accounts'];
  return chrome(`<section class="tap-stage">
    <div class="step-label">Tap exchange · seller K-Tag</div>
    <div class="tap-hero"><div class="tap-copy"><span class="eyebrow"><span class="gold-dot"></span> one tap, only what you approve</span><h1>Let your benefits<br /><em>arrive before the bill.</em></h1><p class="lead">Tap the seller’s K-Tag and Kanzpay shares your benefit identity—not passwords or raw account details. The seller can now price your invoice intelligently.</p><button class="gold-button" data-action="tap-now">Tap Luma K-Tag <span>↗</span></button><button class="back-link" data-action="dashboard">Back to cockpit</button></div><div class="tap-device"><div class="tag-wave"></div><div class="ktag">K<span>·</span>TAG<small>LUMA MARKET</small></div><div class="tap-phone"><span>⌁</span><strong>Tap to exchange</strong><small>Buyer-approved signals only</small></div></div></div>
    <div class="capability-row">${capabilities.map((item, index) => `<span style="--i:${index}">${item}</span>`).join('')}</div>
  </section>`, { dark: true });
}

function invoice() {
  const preview = state.invoicePreview || { grossMinor: 7200, guaranteedSavingsMinor: 600, possibleSavingsMinor: 300, payableMinor: 6600, pointsEarned: 66, pointsAfterPurchase: 1906, goldEarnedMinor: 66 };
  const money = (minor) => `AED ${(minor / 100).toFixed(2)}`;
  return chrome(`<section class="invoice-stage">
    <div class="invoice-head"><div><span class="eyebrow"><span class="green-dot"></span> invoice from Luma Market</span><h1>Your benefits made<br /><em>this bill smaller.</em></h1><p class="lead">Review the discount elements you approved during the tap. Nothing is paid until you choose.</p></div><div class="invoice-badge">#1048<small>buyer review</small></div></div>
    <div class="invoice-layout"><div class="invoice-paper"><div class="paper-top"><strong>Luma Market</strong><span>Signed invoice · #1048</span></div><div class="paper-items"><div><span>Ethiopian cold brew</span><b>AED 24.00</b></div><div><span>Granola cup × 2</span><b>AED 36.00</b></div><div><span>Luma membership</span><b>AED 12.00</b></div></div><div class="paper-benefits"><span>Applied from your tap</span><div><span>Fazaa membership</span><b>− AED 4.20</b></div><div><span>Visa BIN offer</span><b>− AED 1.80</b></div></div><div class="paper-total"><span>Final amount to pay</span><strong>${money(preview.payableMinor)}</strong></div></div><div class="invoice-side"><div class="points-card"><span class="card-label">Reward points</span><strong>+${preview.pointsEarned}</strong><small>${preview.pointsAfterPurchase} points after this checkout</small><div class="progress-line"><span style="width:72%"></span></div></div><div class="gold-card"><span class="card-label">Gold from this checkout</span><strong>+${(preview.goldEarnedMinor / 1000).toFixed(3)} mg</strong><small>Added after settlement · sandbox ledger</small></div><button class="gold-button" data-action="approve-invoice">Approve ${money(preview.payableMinor)} <span>↗</span></button><button class="soft-button full" data-action="stop-invoice">Stop and review later</button></div></div>
  </section>`, { dark: true });
}

function buyerDashboard() {
  return dashboardShell('buyer', `<div class="dash-hero buyer-hero"><div><span class="eyebrow">Good morning, ${esc(state.name || 'Maya')}</span><h1>Your money is<br /><em>starting to give back.</em></h1><p>Here’s the calm view of what’s moving, what’s protected and what’s earning. I’ll keep the next useful thing close.</p></div><div class="dash-orb"><div class="dash-gold">1 <small>mg</small></div><span>processing</span></div></div>
    <div class="today-strip"><span class="green-dot"></span><strong>Today’s gentle nudge</strong><span>Your welcome Gold is processing. Connect one more benefit to make your first guided checkout smarter.</span><button data-action="checkout">Try the guided checkout ↗</button></div>
    <div class="quick-actions"><button data-action="tap"><span>⌁</span><strong>Tap merchant K-Tag</strong><small>Use your benefit identity</small></button><button data-action="qr"><span>▦</span><strong>Show Universal QR</strong><small>Reward identity in one code</small></button><button><span>◌</span><strong>Open Gold Vault</strong><small>See processing and earned Gold</small></button></div>
    <div class="dash-grid top-cards"><article class="glass-card balance-card"><span class="card-label">Total balance</span><strong>AED 42,680<span class="verified">●</span></strong><small>Across 3 connected accounts</small><div class="balance-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article><article class="glass-card"><span class="card-label">Gold earned</span><strong class="gold-text">0.00 <small>mg</small></strong><small>1 mg processing · account active</small><button class="card-link" data-action="gold-info">View Gold journey ↗</button></article><article class="glass-card"><span class="card-label">Rewards found</span><strong>AED 384 <small>this month</small></strong><small>Across 7 memberships and offers</small><button class="card-link">Open rewards wallet ↗</button></article></div>
    <div class="dash-grid split-dash"><article class="glass-card"><div class="dash-section-head"><span>Spending rhythm</span><button>See trends ↗</button></div><div class="spend-chart"><div class="chart-y"><span>AED 4k</span><span>2k</span><span>0</span></div><div class="chart-bars">${['M','T','W','T','F','S','S'].map((day, i) => `<div><i style="height:${[46,70,34,82,62,52,38][i]}%"></i><small>${day}</small></div>`).join('')}</div></div><div class="chart-note"><span class="green-dot"></span> You’re spending 12% less than last week.</div></article><article class="glass-card"><div class="dash-section-head"><span>Coming up</span><button>Manage bills ↗</button></div><div class="bill-row"><span class="bill-icon">⌂</span><span><strong>Home rent</strong><small>Due in 8 days</small></span><b>AED 5,200</b></div><div class="bill-row"><span class="bill-icon">≋</span><span><strong>DEWA</strong><small>Auto-detected · 15 Oct</small></span><b>AED 386</b></div><div class="bill-row"><span class="bill-icon">◌</span><span><strong>Careem Plus</strong><small>Recurring · 19 Oct</small></span><b>AED 24</b></div></article></div>
    <div class="dash-grid split-dash"><article class="glass-card"><div class="dash-section-head"><span>Recent transactions</span><button>View all ↗</button></div><div class="transaction"><span class="merchant merchant-grocery">C</span><span><strong>Carrefour</strong><small>Groceries · matched receipt</small></span><b>AED 72.60</b></div><div class="transaction"><span class="merchant merchant-cafe">L</span><span><strong>Luma Market</strong><small>Membership benefit applied</small></span><b>AED 66.00</b></div><div class="transaction"><span class="merchant merchant-transport">C</span><span><strong>Careem</strong><small>Transport · Tuesday</small></span><b>AED 42.00</b></div></article><article class="glass-card reward-card"><span class="eyebrow">A thought from K-assistant</span><h3>“Your Luma membership could have saved you AED 18 more this month.”</h3><p>Let me keep looking for moments like this?</p><button class="gold-button">Yes, keep me ahead ↗</button></article></div>`);
}

function sellerDashboard() {
  return dashboardShell('seller', `<div class="dash-hero seller-hero"><div><span class="eyebrow">Luma Market · ${esc(state.persona || 'cafe')}</span><h1>Your business,<br /><em>in its best light.</em></h1><p>One view for the orders, stock, rewards and cash movement that keep today running.</p></div><div class="seller-status"><span class="green-dot"></span><strong>Ready to accept PACT</strong><small>Universal QR active · 3 rewards connected</small></div></div>
    <div class="today-strip seller-strip"><span class="gold-dot"></span><strong>Today’s growth move</strong><span>Receive a buyer tap, price the invoice and settle on the calmest rail.</span><button data-action="seller-tap">Open K-Tag inbox ↗</button></div>
    <div class="seller-rail"><span class="ktag-mini">K</span><div><strong>Luma K-Tag is live</strong><small>Ready for buyer identity exchange · 4 benefit categories accepted</small></div><button data-action="seller-tap">Simulate buyer tap ↗</button></div>
    <div class="dash-grid top-cards"><article class="glass-card"><span class="card-label">Today’s order value</span><strong>AED 8,420 <small class="positive">+12.8%</small></strong><small>vs AED 7,470 same day last week</small><div class="micro-spark"><i></i><i></i><i></i><i></i><i></i><i></i></div></article><article class="glass-card"><span class="card-label">Orders</span><strong>126 <small class="positive">+8.4%</small></strong><small>31 PACT-ready · 4 awaiting payment</small><button class="card-link">Open orders ↗</button></article><article class="glass-card"><span class="card-label">Stock health</span><strong class="gold-text">86<span>%</span></strong><small>2 low-stock SKUs · 1 stock-out risk</small><button class="card-link">Review inventory ↗</button></article></div>
    <div class="dash-grid split-dash"><article class="glass-card"><div class="dash-section-head"><span>Orders at a glance</span><button>Open order book ↗</button></div><div class="order-row"><span class="order-status live"></span><span><strong>#1048 · Maya Khan</strong><small>3 items · PACT quote ready</small></span><b>AED 66.00</b><span class="status-pill">Awaiting pay</span></div><div class="order-row"><span class="order-status done"></span><span><strong>#1047 · Sarah Ahmed</strong><small>5 items · receipt matched</small></span><b>AED 128.40</b><span class="status-pill done-pill">Complete</span></div><div class="order-row"><span class="order-status done"></span><span><strong>#1046 · Omar Ali</strong><small>2 items · Aani settled</small></span><b>AED 44.00</b><span class="status-pill done-pill">Complete</span></div></article><article class="glass-card"><div class="dash-section-head"><span>Stock intelligence</span><button>Catalogue ↗</button></div><div class="stock-row"><span class="stock-dot warn"></span><span><strong>Ethiopian cold brew</strong><small>SKU CB-220 · 2 days left</small></span><b>18 left</b></div><div class="stock-row"><span class="stock-dot danger-dot"></span><span><strong>Granola cup</strong><small>SKU GC-101 · stock-out risk</small></span><b>4 left</b></div><div class="stock-row"><span class="stock-dot good-dot"></span><span><strong>Still water 500ml</strong><small>SKU SW-018 · 12 days left</small></span><b>148 left</b></div></article></div>
    <div class="dash-grid split-dash"><article class="glass-card"><div class="dash-section-head"><span>Rewards issued</span><button>Manage rules ↗</button></div><div class="reward-stat"><strong>AED 384</strong><small>customer savings · this month</small><div class="progress-line"><span style="width:68%"></span></div><small>68% of your AED 560 rewards budget used</small></div></article><article class="glass-card reward-card seller-reward"><span class="eyebrow">K-assistant suggestion</span><h3>“Your Saturday breakfast basket is winning. Want a QR offer for slow Mondays?”</h3><button class="gold-button">Create an offer ↗</button></article></div>`);
}

function dashboardShell(role, content) {
  return `<div class="dashboard-frame"><header class="dash-nav"><button class="wordmark" data-action="home"><img src="/assets/kanzpay-mark.png" alt="" /><span>Kanzpay</span></button><div class="dash-nav-center"><button class="dash-nav-active">${role === 'buyer' ? 'My money' : 'My business'}</button><button>Rewards</button><button>Activity</button><button>Ask K</button></div><div class="dash-user"><div class="dash-qr" data-action="qr">⌁</div><div class="dash-avatar">${initials()}</div><button class="nav-menu">⋮</button></div></header><div class="dashboard-content">${content}</div><footer class="dash-footer"><span>Built with <b>♥</b> in UAE <b>🇦🇪</b> by OXY Technologies, ADGM, Abu Dhabi.</span><span data-action="ready">Readiness 80% · View</span></footer></div>`;
}

function render() {
  window.clearTimeout(tourTimer);
  if (state.step === 'welcome') app.innerHTML = welcome();
  if (state.step === 'tour') app.innerHTML = tour();
  if (state.step === 'waitlist') app.innerHTML = waitlist();
  if (state.step === 'role') app.innerHTML = role();
  if (state.step === 'profile') app.innerHTML = profile();
  if (state.step === 'connections') app.innerHTML = connections();
  if (state.step === 'qr') app.innerHTML = qr();
  if (state.step === 'ready') app.innerHTML = readiness();
  if (state.step === 'checkout') app.innerHTML = checkout();
  if (state.step === 'tap') app.innerHTML = tapExchange();
  if (state.step === 'invoice') app.innerHTML = invoice();
  if (state.step === 'dashboard') app.innerHTML = state.role === 'seller' ? sellerDashboard() : buyerDashboard();
  bind();
  if (state.step === 'tour') {
    tourTimer = window.setTimeout(() => {
      if (state.tourIndex < tourScenes.length - 1) {
        state.tourIndex += 1;
        render();
      } else {
        state.step = 'waitlist';
        state.tourIndex = 0;
        render();
      }
    }, 3000);
  }
}

async function joinWaitlist(form) {
  state.name = form.name.value;
  state.mobile = form.mobile.value;
  state.email = form.email.value;
  state.waitlist = true;
  await post('/api/waitlist', { email: state.email });
  const account = await post('/api/account/create', { name: state.name, mobile: state.mobile, email: state.email });
  state.account = account;
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
    if (action === 'tour') { state.tourIndex = 0; state.step = 'tour'; }
    if (action === 'tour-exit') state.step = 'welcome';
    if (action === 'tour-next') {
      if (state.tourIndex < tourScenes.length - 1) {
        state.tourIndex += 1;
      } else {
        state.step = 'waitlist';
        state.tourIndex = 0;
      }
    }
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
    if (action === 'tap' || action === 'seller-tap') state.step = 'tap';
    if (action === 'tap-now') {
      const result = await post('/api/tap/exchange', {
        kTag: 'KZ-KTAG-LUMA',
        buyerId: state.account?.id || 'buyer-sandbox',
        capabilities: ['reward-point identity', 'membership cards', 'promo codes & vouchers', 'eligible cards / BIN', 'safe payment accounts']
      });
      state.exchange = result.exchange;
      const invoiceResult = await post('/api/invoice/create');
      state.invoicePreview = invoiceResult;
      notify('Tap exchanged. Luma has your approved benefit signals.', 'success');
      state.step = 'invoice';
    }
    if (action === 'approve-invoice') {
      const preview = await post('/api/solver/preview');
      state.checkoutPreview = preview;
      const settled = await post('/api/checkout/approve');
      notify(`Paid ${money(settled.paidMinor)} · +${settled.rewards.points} points · Gold added.`, 'success');
      state.step = 'dashboard';
    }
    if (action === 'stop-invoice') {
      await post('/api/checkout/stop');
      notify('No payment was attempted. Your invoice stays available.', '');
      state.step = 'dashboard';
    }
    if (action === 'checkout') { state.checkoutStep = 0; state.step = 'checkout'; }
    if (action === 'checkout-next') {
      if (state.checkoutStep < 3) state.checkoutStep += 1;
      else {
        const preview = await post('/api/solver/preview');
        state.checkoutPreview = preview;
        notify(`Decision ready: AED ${(preview.netMinor / 100).toFixed(2)} with ${preview.points} points.`, 'success');
      }
    }
    if (action === 'checkout-back') state.checkoutStep = Math.max(0, (state.checkoutStep || 0) - 1);
    if (action === 'gold-info') notify('Gold is processing in the sandbox ledger. Account activation unlocks the reward vault journey.');
    if (action === 'qr') state.step = 'qr';
    if (action === 'ready') state.step = 'ready';
    if (action === 'readiness') state.step = 'ready';
    render();
  }));
  document.querySelectorAll('[data-role]').forEach((element) => element.addEventListener('click', () => { state.role = element.dataset.role; state.persona = null; state.step = 'profile'; render(); }));
  document.querySelectorAll('[data-persona]').forEach((element) => element.addEventListener('click', () => { state.persona = element.dataset.persona; render(); }));
  document.querySelectorAll('[data-connection]').forEach((element) => element.addEventListener('click', () => connect(element.dataset.connection)));
  document.querySelectorAll('[data-checkout-step]').forEach((element) => element.addEventListener('click', () => { state.checkoutStep = Number(element.dataset.checkoutStep); render(); }));
  document.querySelector('[data-form="waitlist"]')?.addEventListener('submit', (event) => { event.preventDefault(); joinWaitlist(event.currentTarget); });
}

render();
