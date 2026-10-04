// KanzPay PWA — connected journey flows per spec · metallic gold · glass
const app = document.querySelector('#app');
const toastEl = document.querySelector('#toast');

/* ---------- thin metallic line icons ---------- */
const ICONS = {
  tap: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  qr: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><path d="M14 14h2.4v2.4H14zM17.5 17.5H20v2.5h-2.5z"/>',
  phone: '<rect x="7" y="3" width="10" height="18" rx="2.4"/><path d="M10.5 17.6h3"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.4"/><path d="m4 7 8 6 8-6"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2.4"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/><circle cx="12" cy="15" r="1.4"/>',
  vault: '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3.6v2.4M12 18v2.4M3.6 12h2.4M18 12h2.4"/>',
  card: '<rect x="3" y="5.5" width="18" height="13" rx="2.4"/><path d="M3 10h18M6.5 14.5h5"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5M15.5 5.2a3.4 3.4 0 0 1 0 6.2M17.5 15c1.9.7 3 2.2 3 4.5"/>',
  coin: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.5v9M9.2 9.6c0-1.2 1.2-2 2.8-2 1.7 0 2.8.8 2.8 2s-1 1.7-2.8 2.1-2.8.9-2.8 2.1 1.1 2 2.8 2c1.6 0 2.8-.8 2.8-2"/>',
  chart: '<path d="M4 20h16M7 16v-5M12 16V8M17 16v-8"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2.2"/><path d="M9 1.8v3M15 1.8v3M9 19.2v3M15 19.2v3M1.8 9h3M1.8 15h3M19.2 9h3M19.2 15h3"/>',
  store: '<path d="M4.5 9.5 6 4h12l1.5 5.5M4.5 9.5V20h15V9.5M4.5 9.5h15M9.5 20v-5h5v5"/>',
  doc: '<path d="M6 3.5h8.5L19 8v12.5H6z"/><path d="M14 3.5V8h5M9 12h6M9 15.5h6"/>',
  bell: '<path d="M6 16.5v-6a6 6 0 0 1 12 0v6l1.6 2H4.4zM10 21a2.2 2.2 0 0 0 4 0"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  star: '<path d="m12 3.8 2.4 5 5.5.7-4 3.9 1 5.5-4.9-2.7-4.9 2.7 1-5.5-4-3.9 5.5-.7z"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.3"/>',
  cam: '<rect x="3" y="7" width="13" height="12" rx="2.4"/><path d="m16 11 5-3v9l-5-3"/>',
  id: '<rect x="3" y="5" width="18" height="14" rx="2.4"/><circle cx="8.5" cy="11" r="2"/><path d="M5.8 16c.6-1.6 1.6-2.4 2.7-2.4s2.1.8 2.7 2.4M14 10h5M14 14h5"/>',
  share: '<circle cx="6" cy="12" r="2.4"/><circle cx="17" cy="6" r="2.4"/><circle cx="17" cy="18" r="2.4"/><path d="m8 10.8 6.6-3.6M8 13.2l6.6 3.6"/>',
  gift: '<rect x="4" y="9" width="16" height="4" rx="1.2"/><path d="M12 9v12M6 13v7h12v-7M12 9c-1.8 0-4-1-4-2.8 0-1.2 1-2.2 2.2-2.2C11.5 4 12 6 12 9zm0 0c1.8 0 4-1 4-2.8 0-1.2-1-2.2-2.2-2.2C12.5 4 12 6 12 9z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8"/>',
  home: '<path d="m4 11 8-7 8 7M6 9.5V20h12V9.5"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2.6"/><path d="M3 10h18M16 15h2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  printer: '<path d="M7 17H4.5v-8h15v8H17M7 13.5h10V20H7zM7 9V4h10v5"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.4 2.4M15.6 15.6 18 18M18 6l-2.4 2.4M8.4 15.6 6 18"/><circle cx="12" cy="12" r="2.6"/>',
  heart: '<path d="M12 20s-7.2-4.6-7.2-9.7A3.9 3.9 0 0 1 12 7.4a3.9 3.9 0 0 1 7.2 2.9C19.2 15.4 12 20 12 20z"/>',
  box: '<path d="m12 3 8 4v10l-8 4-8-4V7z"/><path d="m4 7 8 4 8-4M12 11v10"/>',
  trend: '<path d="m4 17 5-6 4 3 6-8M15 6.5h4V11"/>'
};
const ico = (name, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24"><g>${ICONS[name] || ICONS.spark}</g></svg>`;

const state = {
  role: null, theme: document.documentElement.dataset.theme || 'dark',
  name: 'Navneet Sharma', mobile: '+971 50 123 4567', email: 'navneet@oxy.tech',
  invoice: null, bestValue: null, stores: [], vault: null, expenses: null,
  dash: null, alerts: null, customers: null,
  cardProfile: 'Professional', cardTemplate: 'aurum',
  kycStep: 0, kaceProgress: 0, sellerTab: 'focus',
  buyerDone: [], sellerDone: [], praise: null, splashIdx: 0
};

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
const money = (m) => `AED ${(Number(m || 0) / 100).toFixed(2)}`;
const money0 = (m) => `AED ${(Number(m || 0) / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
const go = (r) => { location.hash = `#/${r}`; };
const toast = (msg, kind = '') => { toastEl.textContent = msg; toastEl.className = `toast show ${kind}`; clearTimeout(toast.t); toast.t = setTimeout(() => { toastEl.className = 'toast'; }, 2800); };
async function api(path, payload) {
  try {
    const res = await fetch(path, payload ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) } : undefined);
    return await res.json();
  } catch { return { error: 'offline' }; }
}

/* ---------- readiness bar: configuration progress ---------- */
const BUYER_FLOW = [['buyer-start', 'Tap or scan', 'tap & pay', 'tap'], ['buyer-verify', 'Verify', 'secure sign-in', 'lock'], ['buyer-vault', 'Value Vault', 'savings apply', 'vault'], ['buyer-account', 'Account', 'gold & cards', 'id'], ['cockpit', 'Cockpit', 'full access', 'home']];
const SELLER_FLOW = [['seller-onboard', 'Onboard', 'store live', 'store'], ['seller-kace', 'K-Assistant', 'auto catalogue', 'gear'], ['seller-sample', 'Invoice model', 'smart billing', 'doc'], ['seller-adjust', 'Value rules', 'loyalty runs', 'chip'], ['seller-share', 'Share', 'tap invoices', 'share'], ['seller-dash', 'Dashboard', 'full access', 'trend']];

const jrail = (flow) => { const cur = route(); const i = flow.findIndex(([r]) => r === cur); return `<div class="jrail">${flow.map((_, k) => `${k > 0 ? `<span class="jseg ${k <= i ? 'done' : ''}"></span>` : ''}<span class="jnode ${k <= i ? 'done' : ''}"></span>`).join('')}</div>`; };
function readybar(flow) {
  const done = state.role === 'seller' ? state.sellerDone : state.buyerDone;
  const pct = Math.round((done.length / flow.length) * 100);
  const unlocked = flow.slice(0, Math.max(done.length, 1)).map(([, , u]) => u).join(' · ');
  return `<div class="ready">${jrail(flow)}<p class="ready-lbl"><b>${pct}% ready</b> — ${done.length ? `unlocked: ${unlocked}` : 'finish setup to unlock everything'}</p></div>`;
}

const applause = (title, sub, ic = 'star') => `<div class="applaud"><span class="icowell">${ico(ic)}</span><span><b>${title}</b><small>${sub}</small></span></div>`;
const praiseBlock = () => state.praise ? applause(state.praise[0], state.praise[1], state.praise[2] || 'star') : '';

/* ---------- chrome ---------- */
const logoImg = () => `<img class="logo" src="${state.theme === 'dark' ? '/assets/kanzpay-logo-dark.png' : '/assets/kanzpay-logo.png'}" alt="KanzPay" style="height:30px" />`;
const topbar = (o = {}) => `<header class="topbar">${o.back ? `<button class="icon-btn" data-go="${o.back}">←</button>` : logoImg()}<span class="grow"></span><button class="icon-btn" data-action="theme">${state.theme === 'dark' ? '☀' : '☾'}</button></header>`;
const BUYER_TABS = [['cockpit', 'home', 'Cockpit'], ['vault', 'vault', 'Vault'], ['buyer-start', 'tap', 'Pay'], ['card', 'card', 'Card'], ['stores', 'store', 'Stores']];
const SELLER_TABS = [['seller-dash', 'home', 'Today'], ['seller-share', 'doc', 'Invoice'], ['seller-alerts', 'bell', 'Alerts'], ['seller-customers', 'users', 'People'], ['seller-insights', 'trend', 'Intel']];
const tabbar = () => `<div class="tabbar"><nav>${(state.role === 'seller' ? SELLER_TABS : BUYER_TABS).map(([r, i, l]) => `<button class="${route() === r ? 'on' : ''}" data-go="${r}">${ico(i)}<span>${l}</span></button>`).join('')}</nav></div>`;
const screen = (inner, nav = true) => `<div class="screen${nav ? '' : ' no-nav'}">${inner}</div>${nav ? tabbar() : ''}`;

/* ---------- welcome ---------- */
function welcome() {
  const dark = state.theme === 'dark';
  return `<div class="screen no-nav">
    <div style="position:absolute;inset:0;background:url('/assets/scene-skyline.png') center/cover;opacity:${dark ? '.8' : '.35'}"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(0deg,var(--bg) 8%,transparent 55%)"></div>
    <div class="body" style="position:relative;z-index:1;justify-content:flex-end;padding-top:60px">
      <div class="glass" style="padding:24px;text-align:center">
        <img src="${dark ? '/assets/kanzpay-logo-dark.png' : '/assets/kanzpay-logo.png'}" style="height:42px" alt="KanzPay" />
        <h1 class="hero" style="margin:16px 0 8px">Everyday life rewards you.</h1>
        <p class="muted">Pay · Earn Gold · Save More · Discover · Live Better</p>
        <div style="display:grid;gap:10px;margin-top:20px">
          <button class="cta-gold" data-action="pick" data-role="buyer"><span>I'm a Buyer</span><span class="arr">→</span></button>
          <button class="cta-pill" data-action="pick" data-role="seller" style="justify-content:center">I'm a Seller →</button>
          <button class="cta-ghost" data-action="install">⤓ Get the app — tap, NFC & more</button>
        </div>
      </div>
      <p class="tiny" style="text-align:center">Sandbox preview · no real money moves</p>
    </div>
  </div>`;
}

/* ---------- capability splash (5–8s, per role) ---------- */
const SPLASH = {
  buyer: [
    ['scene-tap-nfc', 'One tap opens the store', 'catalogue · offers · your invoice — before you queue'],
    ['scene-payments', 'Your vault pays the smartest way', 'memberships, promocodes, points and gold — applied for you'],
    ['scene-gold-reward', 'Real gold lands on every bill', 'milligrams that grow into wealth']
  ],
  seller: [
    ['scene-seller-hero', "Customers tap — you're open", 'invoices, catalogue and offers reach their phone'],
    ['scene-catalogue', 'K-Assistant builds your catalogue', 'from invoices, menus and inventory — quietly'],
    ['scene-dashboard', 'Your whole business, one glance', 'trends · alerts · P&L · customers']
  ]
};
function splash() {
  const role = state.role === 'seller' ? 'seller' : 'buyer';
  const slides = SPLASH[role];
  const i = Math.min(state.splashIdx || 0, slides.length - 1);
  const [img, title, sub] = slides[i];
  return `<div class="screen no-nav splash" style="background-image:url('/assets/${img}.png')">
    <div class="splash-veil"></div>
    <div class="splash-body">
      <div class="splash-copy"><h1 class="hero">${title}.</h1><p>${sub}</p></div>
      <div class="splash-foot">
        <div class="dots">${slides.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>
        <button class="splash-skip" data-action="splash-skip">Skip intro →</button>
      </div>
    </div>
  </div>`;
}

/* ---------- buyer steps ---------- */
function buyerStart() {
  return screen(`${topbar()}
    <div class="body">
      ${praiseBlock()}
      <div><span class="eyebrow">STEP 1 · TAP OR SCAN</span><h1 class="hero">Meet your first K-Tag.</h1></div>
      ${readybar(BUYER_FLOW)}
      <div class="card-hero" style="background-image:url('/assets/scene-tap-nfc.png');min-height:210px">
        <div class="nfc-ring"><div class="nfc-tag"><img src="/assets/kanzpay-mark.png" alt="" /></div></div>
      </div>
      <p class="why">A tap opens the store for you — catalogue, offers and your invoice, before you ever queue.</p>
      <div style="display:grid;gap:9px">
        <button class="cta-gold" data-action="start-tap" data-via="nfc"><span>${ico('tap')} Tap the K-Tag</span><span class="arr">→</span></button>
        <button class="cta-pill" data-action="start-tap" data-via="qr" style="justify-content:center">${ico('qr')} Scan the QR instead</button>
      </div>
      <div class="glass" style="padding:15px">
        <div style="display:flex;gap:10px;align-items:center"><span class="icowell">${ico('phone')}</span><div style="flex:1"><b style="font-size:12.5px">Existing user?</b><p class="tiny">Mobile number finds your vault instantly</p></div></div>
        <div class="field" style="margin-top:10px"><input id="existing-mobile" inputmode="tel" placeholder="Mobile number" /></div>
      </div>
    </div>`, false);
}

function buyerVerify() {
  return screen(`${topbar({ back: 'buyer-start' })}
    <div class="body">
      ${praiseBlock()}
      <div><span class="eyebrow">STEP 2 · VERIFY</span><h1 class="hero">A quick hello, securely.</h1></div>
      ${readybar(BUYER_FLOW)}
      <div class="glass" style="padding:18px">
        <div class="check-row">${ico('phone')}<span style="flex:1">Mobile</span><input id="otp-mobile" inputmode="tel" value="${esc(state.mobile)}" style="background:none;border:none;color:var(--ink);text-align:right;width:130px;font-size:13px;outline:none"/></div>
        <div class="check-row" style="margin-top:7px">${ico('mail')}<span style="flex:1">Email</span><input id="otp-email" inputmode="email" value="${esc(state.email)}" style="background:none;border:none;color:var(--ink);text-align:right;width:160px;font-size:13px;outline:none"/></div>
      </div>
      <p class="why">Two small codes protect your vault — this is the only lock between you and your gold.</p>
      <div class="vault-door" style="text-align:center;padding:18px">
        <p class="tiny">SANDBOX CODES</p>
        <div class="otp-boxes" style="margin-top:10px"><b>4</b><b>2</b><b>7</b><b>1</b></div>
      </div>
      <button class="cta-gold" data-action="verify-otp"><span>Verify me</span><span class="arr">→</span></button>
    </div>`, false);
}

function buyerVault() {
  const sections = state.vault?.sections || [];
  return screen(`${topbar({ back: 'buyer-verify' })}
    <div class="body">
      ${praiseBlock()}
      <div><span class="eyebrow">STEP 3 · VALUE VAULT</span><h1 class="hero">Bring your savings together.</h1></div>
      ${readybar(BUYER_FLOW)}
      <div class="vault-door">
        ${sections.map((s) => `<div class="vault-row ${s.status === 'grey' ? 'grey' : ''}">
          <span class="icowell">${ico(s.id === 'memberships' ? 'card' : s.id === 'rewards' ? 'star' : s.id === 'promocodes' ? 'qr' : 'doc')}</span>
          <div><b style="font-size:13px">${esc(s.label)}</b><small class="tiny" style="display:block">${s.items.length ? esc(s.items[0].value) : 'Not connected yet'}</small></div>
          ${s.status === 'connected' ? ico('check') : s.status === 'grey' ? '<span class="tiny">missing</span>' : `<button class="cta-mini" data-action="vault-connect" data-id="${s.id}">Connect</button>`}
        </div>`).join('')}
        <p class="why" style="margin-top:12px">Each connection is permissioned by you — saved with history, validity & encrypted credentials.</p>
      </div>
      <button class="cta-gold" data-action="vault-done"><span>My vault is set</span><span class="arr">→</span></button>
      <button class="cta-ghost" data-action="vault-skip">I'll connect the rest later</button>
    </div>`, false);
}

/* post-setup vault view (cockpit module — navigable, not a step) */
function vaultView() {
  const sections = state.vault?.sections || [];
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">MY VALUE VAULT</span><h1 class="hero">Everything you've earned.</h1></div>
      <div class="vault-door">
        ${sections.map((s) => `<div class="vault-row ${s.status === 'grey' ? 'grey' : ''}">
          <span class="icowell">${ico(s.id === 'memberships' ? 'card' : s.id === 'rewards' ? 'star' : s.id === 'promocodes' ? 'qr' : 'doc')}</span>
          <div><b style="font-size:13px">${esc(s.label)}</b><small class="tiny" style="display:block">${s.items.length ? esc(s.items[0].value) : 'Not connected yet'}</small></div>
          ${s.status === 'connected' ? ico('check') : s.status === 'grey' ? '<span class="tiny">missing</span>' : `<button class="cta-mini" data-action="vault-connect" data-id="${s.id}">Connect</button>`}
        </div>`).join('')}
        <p class="why" style="margin-top:12px">Each connection is permissioned by you — saved with history, validity & encrypted credentials.</p>
      </div>
      <button class="cta-pill" data-go="stores" style="justify-content:center">Use it at a store →</button>
    </div>`);
}

function buyerGoldAward() {
  return screen(`${topbar()}
    <div class="body" style="text-align:center">
      <div class="card-hero" style="background-image:url('/assets/scene-gold-reward.png');min-height:230px;justify-content:center">
        <div class="gold-coin-hero"><div><b>1</b><small>MG GOLD</small></div></div>
      </div>
      <div><h1 class="hero">First gold, on us.</h1><p class="muted">1 mg Gold cashback is yours.<br/>Earn more. Save more.</p></div>
      <button class="cta-gold" data-action="gold-continue"><span>Build my Value Vault</span><span class="arr">→</span></button>
    </div>`, false);
}

/* ---------- KYC ---------- */
const KYC = [['Upload Emirates ID — front', 'Auto-crop and photo-match, in one shot', 'id'], ['Upload Emirates ID — back', 'We verify card details in seconds', 'id'], ['Live camera', 'Blink · look left · look right · hold your ID beside your face', 'cam'], ['Security check', 'AML screening — usually seconds', 'lock']];
function account() {
  const i = Math.min(state.kycStep, 3);
  const [title, desc, ic] = KYC[i];
  return screen(`${topbar({ back: 'buyer-vault' })}
    <div class="body">
      ${praiseBlock()}
      <div><span class="eyebrow">STEP 4 · CREATE ACCOUNT</span><h1 class="hero">${title}.</h1><p class="muted">${desc}.</p></div>
      ${readybar(BUYER_FLOW)}
      ${i === 2
        ? `<div class="vault-door" style="text-align:center;padding:24px"><div class="kace-orb">${ico('cam', 'big')}</div><p class="tiny" style="margin-top:14px">Blink naturally · look left · look right · hold your Emirates ID beside your face</p></div>`
        : `<div class="id-frame"><div><span class="icowell solid" style="width:54px;height:54px;margin:auto">${ico(ic)}</span><p class="muted" style="margin-top:10px">Tap to upload — we crop & match automatically</p></div></div>`}
      <p class="why">This is your identity boundary — one verification unlocks every K-Tag in the country.</p>
      <button class="cta-gold" data-action="kyc-step"><span>${i === 3 ? 'Finish & create account' : 'Continue'}</span><span class="arr">→</span></button>
      <button class="cta-ghost" data-action="kyc-skip">Do this later — explore as guest</button>
    </div>`, false);
}

/* ---------- cockpit ---------- */
function cockpit() {
  const mods = [
    ['vault', 'vault', 'My Value Vault', 'memberships · points · codes'],
    ['card', 'card', 'My Visiting Card', 'profiles · templates · share'],
    ['friends', 'users', 'Earn with friends', 'send · receive · repeat'],
    ['gold', 'coin', 'My Gold Vault', 'weight · buy · gift · redeem'],
    ['expenses', 'chart', 'My Expenses', 'categories · patterns'],
    ['instruments', 'chip', 'Payment Intelligence', 'best way, per bill']
  ];
  return screen(`${topbar()}
    <div class="body">
      ${praiseBlock()}
      <div style="display:flex;align-items:center;gap:12px">
        <div class="avatar">${esc(state.name[0])}</div>
        <div><p class="tiny">YOUR COCKPIT</p><h2 class="sect">${esc(state.name)}</h2></div>
        <span class="grow"></span><span class="chip">1 mg Gold</span>
      </div>
      <div class="grid2">
        ${mods.map(([r, i, t, d]) => `<button class="card-tile" data-go="${r}"><span class="icowell">${ico(i)}</span><b>${t}</b><small>${d}</small></button>`).join('')}
      </div>
      <div class="share-banner" style="display:flex;align-items:center;gap:12px">
        <div style="flex:1"><b>All set to earn more</b><p style="font-size:11px;opacity:.85;margin-top:4px">Value + wealth building, together.</p></div>
        <button class="cta-mini" data-go="stores" style="background:rgba(255,255,255,.9);color:#5c3b0c">Find stores →</button>
      </div>
    </div>`);
}

/* ---------- cockpit modules ---------- */
function friends() {
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">EARN WITH FRIENDS</span><h1 class="hero">Better with company.</h1></div>
      <div class="share-banner"><b style="font-size:16px">Invite a friend → both earn Gold</b><p style="font-size:11.5px;opacity:.85;margin-top:6px">When they tap their first K-Tag, you each receive 1 mg.</p></div>
      <div class="card-hero" style="background-image:url('/assets/scene-card-exchange.png');min-height:140px">
        <div><b style="color:#fff">Share a link, tap phones, or send a QR</b></div>
      </div>
      <div class="glass" style="padding:16px">
        <div class="field"><span>Friend's mobile</span><input id="friend-mobile" inputmode="tel" placeholder="+971…" /></div>
        <div class="grid3" style="margin-top:10px">
          <button class="cta-pill" data-action="friend-send" style="justify-content:center">WhatsApp</button>
          <button class="cta-pill" data-action="friend-send" style="justify-content:center">SMS</button>
          <button class="cta-pill" data-action="friend-send" style="justify-content:center">Email</button>
        </div>
      </div>
      <p class="why">Rewards arrive only when they join — you both win, they never spam.</p>
      <button class="cta-gold" data-action="friend-send"><span>Send invite</span><span class="arr">→</span></button>
    </div>`);
}

function gold() {
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">MY GOLD VAULT</span><h1 class="hero">Small weight. Real gold.</h1></div>
      <div class="vault-door" style="text-align:center;padding-top:24px">
        <div class="gold-coin-hero"><div><b>13.5</b><small>MG GOLD</small></div></div>
        <b style="display:block;font-size:16px">≈ AED 9.45 today</b>
        <p class="tiny" style="margin-top:4px">Weight locked at purchase value · ±0.5 g precision</p>
      </div>
      <div class="grid2">
        <button class="card-tile" data-action="gold-buy"><span class="icowell">${ico('plus')}</span><b>Buy gold</b><small>from AED 5</small></button>
        <button class="card-tile" data-action="gold-sell"><span class="icowell">${ico('minus')}</span><b>Sell gold</b><small>instant AED</small></button>
        <button class="card-tile" data-action="gold-gift"><span class="icowell">${ico('gift')}</span><b>Gift card</b><small>send as gold</small></button>
        <button class="card-tile" data-action="gold-pay"><span class="icowell">${ico('tap')}</span><b>Pay with gold</b><small>at any K-Tag</small></button>
      </div>
      <p class="tiny" style="text-align:center">Redeem · deliver physical gold · spend at stores.</p>
    </div>`);
}

function expenses() {
  const ex = state.expenses;
  const cats = ex?.categories || [];
  const colors = ['#e8c56a', '#caa14f', '#a97a2e', '#8a6420', '#f3d98b'];
  const catIcons = ['coin', 'card', 'spark', 'pin', 'doc'];
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">MY EXPENSES</span><h1 class="hero">Where your money went.</h1></div>
      <div class="seg"><button class="on">Monthly</button><button>Weekly</button><button>Yearly</button></div>
      <div class="glass" style="padding:18px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px"><p class="tiny">SPEND TREND</p><b class="gold-text">${money0(ex?.totalMinor || 0)}</b></div>
        <div class="bar-chart">${(ex?.trend || []).map((v) => `<i style="height:${v}%"></i>`).join('')}</div>
      </div>
      ${cats.map((c, i) => `<div class="card-list"><span class="icowell">${ico(catIcons[i % catIcons.length])}</span><div class="main"><b>${esc(c.label)}</b><small>${c.pct}% of month</small></div><span class="end">${money0(c.minor)}</span></div>`).join('')}
      <div class="vault-door"><div style="display:flex;gap:10px;align-items:center">${ico('spark')}<b style="font-size:13px">Lifestyle intelligence</b></div><p class="muted" style="margin-top:8px">${esc(ex?.lifestyle?.note || '')}</p><p class="tiny" style="margin-top:6px">${esc(ex?.lifestyle?.insight || '')}</p></div>
    </div>`);
}

function instruments() {
  const steps = [['Membership price', 'applied at bill'], ['Promocode KANZ10', '10% held in vault'], ['Reward points', '2,480 available'], ['Gold redeem', '13.5 mg in vault'], ['Instrument choice', 'Aani · Jaywan · card offers']];
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">PAYMENT INTELLIGENCE</span><h1 class="hero">Every bill, paid wisely.</h1>
      <p class="why" style="margin-top:10px">We evaluate every instrument's offers & benefits — you approve the logic once.</p></div>
      ${steps.map(([t, d], i) => `<div class="instr-chip"><span class="step-num ${i < 3 ? 'done' : ''}">${i + 1}</span><div style="flex:1"><b style="font-size:13px">${t}</b><small class="tiny" style="display:block">${d}</small></div></div>`).join('')}
      <div class="glass" style="padding:16px">
        <b style="font-size:13px">Recommendation logic</b>
        <p class="tiny" style="margin-top:6px">Memberships → vouchers → points → gold → cheapest safe rail. Never overdraws your floor.</p>
        <button class="cta-gold" style="margin-top:12px" data-action="approve-logic"><span>Approve my logic</span><span class="arr">✓</span></button>
      </div>
      <p class="tiny" style="text-align:center">Value + wealth building status · all set to earn more</p>
    </div>`);
}

/* ---------- stores & invoice ---------- */
function stores() {
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">NAVIGATION · DUBAI MARINA</span><h1 class="hero">Around you right now.</h1><p class="muted">Sorted by your interests & patterns — not by ads.</p></div>
      ${state.stores.map((s) => `<button class="store-card" data-action="store-pick" style="text-align:left;color:var(--ink);cursor:pointer;width:100%">
        <span class="thumb" style="background-image:url('${s.image}')"></span>
        <span><b style="font-size:13.5px">${esc(s.name)}</b><small class="tiny" style="display:block;margin:3px 0">${esc(s.kind)} · ${s.distanceM}m · ★${s.rating} ${s.live ? '· live catalogue' : ''}</small>
        <span style="display:flex;gap:4px;flex-wrap:wrap">${s.offers.map((o) => `<span class="chip" style="font-size:8.5px;padding:3px 8px">${o}</span>`).join('')}</span></span>
        <span class="end">→</span>
      </button>`).join('')}
      <div class="glass" style="padding:14px;display:flex;gap:10px;align-items:center"><span class="pulse-dot"></span><p class="tiny" style="flex:1">Seller location opens in maps when you tap a K-Tag too.</p><button class="cta-mini" data-action="navigate">${ico('pin')} Navigate</button></div>
    </div>`);
}

async function doTap(via) {
  const ex = await api('/api/tap/exchange', { kTag: 'K-BREW-001', buyerId: state.account?.id || 'buyer-navneet', capabilities: ['identity', 'invoice', 'catalogue', 'location', 'rewards'] });
  if (ex.error) return toast(ex.error, 'error');
  await api('/api/ktag/navigate', {});
  state.invoice = await api('/api/invoice/create');
  state.bestValue = await api('/api/intelligence/best-value', { amountMinor: state.invoice?.grossMinor || 3000 });
  go('invoice');
}

function invoice() {
  const bv = state.bestValue;
  const inv = state.invoice;
  const gross = bv?.grossMinor ?? inv?.grossMinor ?? 3000;
  const net = bv?.netMinor ?? gross;
  const lines = (bv?.options || []).filter((o) => o.applies);
  return screen(`${topbar({ back: 'stores' })}
    <div class="body">
      <div><span class="eyebrow">INVOICE · PRINT-SHARED VIA K-ASSIST</span><h1 class="hero">Look it over first.</h1></div>
      <div class="vault-door">
        <div style="display:flex;justify-content:space-between;align-items:center"><b>${esc(inv?.seller?.name || 'The Brew House')}</b><span class="chip">#${esc(inv?.reference || '1048')}</span></div>
        <div style="margin-top:12px">${(inv?.items || []).map((it) => `<div class="donut-row" style="margin-bottom:7px"><span style="flex:1">${it.quantity}× ${esc(it.name)}</span><b>${money(it.unitMinor * it.quantity)}</b></div>`).join('')}</div>
        <div style="border-top:1px dashed var(--stroke);padding-top:10px;margin-top:4px">${lines.map((o) => `<div class="donut-row" style="margin-bottom:5px"><span style="flex:1;color:var(--gold-3)">✓ ${esc(o.label)}</span><b class="gold-text">−${money(o.savingMinor)}</b></div>`).join('')}</div>
        <div style="display:flex;justify-content:space-between;margin-top:8px"><span class="muted">Pay effectively</span><b style="font-size:20px">${money(net)}</b></div>
        <p class="tiny" style="margin-top:6px">${esc(bv?.reason || '')}</p>
      </div>
      <button class="cta-gold" data-action="pay"><span>Approve & pay ${money(net)}</span><span class="arr">→</span></button>
      <button class="cta-ghost" data-action="stop-pay">Stop — nothing is paid</button>
    </div>`);
}

function success() {
  return screen(`${topbar()}
    <div class="body" style="text-align:center">
      <div class="card-hero" style="background-image:url('/assets/scene-gold-reward.png');min-height:220px;justify-content:center"><h1 class="hero" style="color:#fff">Done — and you earned.</h1></div>
      <div class="glass" style="padding:18px">
        <div style="display:flex;justify-content:space-around"><div><b class="gold-text" style="font-size:20px">+2 mg</b><p class="tiny">Gold earned</p></div><div><b class="gold-text" style="font-size:20px">+120</b><p class="tiny">points</p></div><div><b class="gold-text" style="font-size:20px">Food</b><p class="tiny">expense filed</p></div></div>
      </div>
      <button class="cta-gold" data-go="cockpit"><span>Back to cockpit</span><span class="arr">→</span></button>
      <button class="cta-pill" data-go="card" style="justify-content:center">${ico('card')} Share my visiting card</button>
    </div>`, false);
}

/* ---------- visiting card ---------- */
const PROFILES = ['Professional', 'Family', 'Friends', 'Colleagues', 'Neighbour', 'Custom'];
function card() {
  const tpl = state.cardTemplate;
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">MY VISITING CARD</span><h1 class="hero">One card, many faces.</h1>
      <p class="why" style="margin-top:10px">One data sheet feeds every profile — professional at work, warm with family.</p></div>
      <div class="card-face tpl-${tpl}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div><p class="tiny" style="letter-spacing:.2em">${state.cardProfile.toUpperCase()}</p><h2 class="sect" style="margin:6px 0 2px">${esc(state.name)}</h2><p class="tiny">Founder & CEO · Oxy Technologies<br/>Abu Dhabi, UAE</p></div>
          <img src="/assets/kanzpay-mark-dark.png" style="width:34px" alt="" />
        </div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end"><span class="tiny">${esc(state.mobile)}</span><div class="qr"></div></div>
      </div>
      <div class="vault-door">
        <p class="tiny" style="margin-bottom:10px">PROFILE — WHO'S RECEIVING</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap">${PROFILES.map((p) => `<button class="chip" style="cursor:pointer;${p === state.cardProfile ? 'background:var(--gold-grad);color:#453006' : ''}" data-profile="${p}">${p}</button>`).join('')}</div>
        <p class="tiny" style="margin:14px 0 8px">TEMPLATE</p>
        <div class="tpl-pick">
          <button class="tpl-a ${tpl === 'aurum' ? 'on' : ''}" data-tpl="aurum"><span>AURUM</span></button>
          <button class="tpl-p ${tpl === 'pearl' ? 'on' : ''}" data-tpl="pearl"><span>PEARL</span></button>
          <button class="tpl-o ${tpl === 'onyx' ? 'on' : ''}" data-tpl="onyx"><span>ONYX</span></button>
        </div>
      </div>
      <div class="grid2">
        <button class="cta-pill" data-action="share-nfc" style="justify-content:center">${ico('tap')} Share via Tap</button>
        <button class="cta-pill" data-action="share-qr" style="justify-content:center">${ico('qr')} Share QR</button>
      </div>
      <button class="cta-ghost" data-action="share-link">${ico('share')} Share link · they save your contact</button>
    </div>`);
}

/* ---------- seller journey ---------- */
function sellerOnboard() {
  return screen(`${topbar()}
    <div class="body">
      ${praiseBlock()}
      <div><span class="eyebrow">STEP 1 · ONBOARDING</span><h1 class="hero">Let's open your store.</h1></div>
      ${readybar(SELLER_FLOW)}
      <div class="card-hero" style="background-image:url('/assets/scene-seller-hero.png');min-height:160px">
        <div><span class="eyebrow" style="color:#f3d98b">K-ASSISTANT WAITS</span><h2 class="sect" style="color:#fff;margin-top:6px">Five quiet minutes, then it runs itself.</h2></div>
      </div>
      <div class="glass" style="padding:18px">
        <div class="field"><span>Business name</span><input id="biz" value="The Brew House" /></div>
        <div class="grid2" style="margin-top:10px"><div class="field"><span>Type</span><input value="Café · Restaurant" /></div><div class="field"><span>Location</span><input value="Dubai Marina" /></div></div>
      </div>
      <p class="why">Your name, type and location place you on the buyer map — that's how taps find you.</p>
      <button class="cta-gold" data-action="start-kace"><span>Install K-Assistant</span><span class="arr">→</span></button>
    </div>`, false);
}

function sellerKace() {
  const p = state.kaceProgress;
  const tasks = [['System identified — Mac', 20], ['Drivers aligned', 45], ['K-Tag registered', 70], ['Floating assistant live', 90]];
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">STEP 2 · K-ASSISTANT</span><h1 class="hero">Your assistant is moving in.</h1></div>
      ${readybar(SELLER_FLOW)}
      <div class="vault-door" style="text-align:center;padding:24px">
        <div class="kace-orb"><span class="icowell solid" style="width:64px;height:64px">${ico('gear','big')}</span></div>
        <p class="eyebrow" style="margin-top:14px">${p}%</p>
        <div class="progress" style="margin-top:10px"><i style="width:${p}%"></i></div>
      </div>
      ${tasks.map(([t, at]) => `<div class="check-row">${p >= at ? '<span class="tick">✓</span>' : '<span class="pulse-dot"></span>'}<span style="flex:1">${t}</span></div>`).join('')}
      <p class="why">Runs in the background — keep using your system while it learns.</p>
    </div>`, false);
}

function sellerSample() {
  return screen(`${topbar({ back: 'seller-kace' })}
    <div class="body">
      ${praiseBlock()}
      <div><span class="eyebrow">STEP 3 · SAMPLE INVOICE</span><h1 class="hero">Show it one bill.</h1><p class="muted">Share one invoice — K-Assistant reads your shop details.</p></div>
      ${readybar(SELLER_FLOW)}
      <div class="vault-door">
        ${[['Shop name', 'The Brew House', true], ['Address', 'Marina Walk, Dubai', true], ['VAT No.', '1003 4488 2100 03', true], ['Mobile', '+971 4 555 0123', false]].map(([l, v, ok]) => `<div class="check-row" style="margin-bottom:7px">${ok ? '<span class="tick">✓</span>' : '<span class="step-num">!</span>'}<span style="flex:1"><b style="font-size:12.5px">${l}</b> · <span class="tiny">${v}</span></span>${ok ? '' : '<button class="cta-mini">Fix</button>'}</div>`).join('')}
      </div>
      <div class="glass" style="padding:16px">
        <p class="tiny" style="margin-bottom:8px">REWARD RULES — SET ONCE</p>
        <div class="check-row"><span class="tick">✓</span><span style="flex:1">AED 200 spent = 100 points</span></div>
        <div class="check-row" style="margin-top:7px"><span class="tick">✓</span><span style="flex:1">Points = discount AED · free-product milestones</span></div>
        <div class="check-row" style="margin-top:7px"><span class="tick">✓</span><span style="flex:1">AED 1,000 slab = 5 mg Gold</span></div>
      </div>
      <p class="why">These rules become your silent loyalty programme — every invoice honours them.</p>
      <button class="cta-gold" data-action="vault-check"><span>Looks right — continue</span><span class="arr">→</span></button>
    </div>`, false);
}

function sellerAdjust() {
  const rows = [['Membership discount', '20%', true], ['Voucher / promo value', '10%', true], ['Coupons value', 'AED 15', true], ['Reward points value', '100 pts = AED 5', true], ['Free gift', 'on AED 50+', false]];
  return screen(`${topbar({ back: 'seller-sample' })}
    <div class="body">
      ${praiseBlock()}
      <div><span class="eyebrow">STEP 4 · VALUE VAULT CHECK</span><h1 class="hero">Decide what counts.</h1><p class="muted">Buyer shared their vault — you approve which benefits apply.</p></div>
      ${readybar(SELLER_FLOW)}
      ${rows.map(([t, v, on]) => `<div class="instr-chip"><div style="flex:1"><b style="font-size:13px">${t}</b></div><b class="gold-text">${v}</b><button class="chip" style="cursor:pointer">${on ? 'On' : 'Add'}</button></div>`).join('')}
      <button class="cta-gold" data-action="gen-invoice"><span>Generate invoice</span><span class="arr">→</span></button>
    </div>`);
}

function sellerShare() {
  return screen(`${topbar({ back: 'seller-adjust' })}
    <div class="body">
      ${praiseBlock()}
      <div><span class="eyebrow">STEP 5 · SHARE THE INVOICE</span><h1 class="hero">The bill, in their hands.</h1></div>
      ${readybar(SELLER_FLOW)}
      <div class="vault-door">
        <div style="display:flex;justify-content:space-between"><b>Invoice #1048</b><b class="gold-text">${money(6600)}</b></div>
        <p class="tiny" style="margin-top:8px">Priced with buyer-approved signals · membership −AED 6 · voucher −AED 3</p>
      </div>
      <div class="grid2">
        <button class="card-tile" data-action="share-ktag"><span class="icowell">${ico('tap')}</span><b>Push via K-Tag</b><small>buyer taps to receive</small></button>
        <button class="card-tile" data-action="share-mobile"><span class="icowell">${ico('phone')}</span><b>To mobile number</b><small>sms / whatsapp link</small></button>
        <button class="card-tile" data-action="share-print"><span class="icowell">${ico('printer')}</span><b>Print (K-Assist)</b><small>QR on the receipt</small></button>
        <button class="card-tile" data-action="share-qr2"><span class="icowell">${ico('qr')}</span><b>Show QR</b><small>buyer scans you</small></button>
      </div>
      <button class="cta-gold" data-action="dash-open"><span>Open dashboard</span><span class="arr">→</span></button>
    </div>`);
}

function sellerDash() {
  const f = state.dash?.focus;
  const intel = state.dash?.intelligence;
  const focus = state.sellerTab === 'focus';
  return screen(`${topbar()}
    <div class="body">
      ${praiseBlock()}
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
        <div><span class="eyebrow">THE BREW HOUSE</span><h1 class="hero" style="font-size:24px">Good morning.</h1></div>
        <div class="seg"><button class="${focus ? 'on' : ''}" data-stab="focus">Focus</button><button class="${focus ? '' : 'on'}" data-stab="intel">Intelligence</button></div>
      </div>
      ${focus ? `
        <div class="grid3">
          <div class="card-metric"><small>Pending commission</small><strong>${money0(f?.commission?.pendingMinor || 0)}</strong></div>
          <div class="card-metric"><small>Paid history</small><strong>${money0(f?.commission?.paidMinor || 0)}</strong></div>
          <div class="card-metric"><small>Repeat cust.</small><strong>${f?.rewards?.repeatPct || 0}%</strong></div>
        </div>
        <div class="vault-door"><p class="tiny" style="margin-bottom:10px">TICKETS</p>${(f?.tickets || []).map((t) => `<div class="card-list" style="margin-bottom:7px"><span class="icowell" style="width:36px;height:36px">${ico(t.kind === 'Complaint' ? 'bell' : t.kind === 'Query' ? 'mail' : 'star')}</span><div class="main"><b>${esc(t.kind)}</b><small>${esc(t.text)}</small></div><span class="chip">${t.status}</span></div>`).join('')}</div>
        <div class="grid2">
          <div class="card-metric"><small>Value trend vs last</small><strong class="gold-text">+${f?.trends?.valuePct || 0}%</strong></div>
          <div class="card-metric"><small>Volume trend</small><strong class="gold-text">+${f?.trends?.volumePct || 0}%</strong></div>
        </div>
        <div class="glass" style="padding:16px"><p class="tiny" style="margin-bottom:8px">CUSTOMER TRENDS</p><div style="display:flex;gap:16px"><div><b>${f?.customers?.walkins || 0}</b><p class="tiny">walk-ins</p></div><div><b>${money0(f?.customers?.avgTicketMinor || 0)}</b><p class="tiny">avg ticket</p></div><div><b>${f?.customers?.repeatPct || 0}%</b><p class="tiny">repeat</p></div></div></div>` : `
        <div class="grid2">
          <div class="card-metric"><small>Catalogue SKUs</small><strong>${intel?.catalogue?.skus || 0}</strong><span class="delta">menu editable · ${intel?.catalogue?.templates || 0} templates</span></div>
          <div class="card-metric"><small>Competition alerts</small><strong>${intel?.catalogue?.competitionAlerts || 0}</strong><span class="delta">price diff SKUs</span></div>
        </div>
        <div class="vault-door"><p class="tiny" style="margin-bottom:10px">INVENTORY</p>
          ${(intel?.inventory?.low || []).map((i) => `<div class="check-row" style="margin-bottom:6px"><span class="step-num">!</span><span style="flex:1">${esc(i.name)}</span><b>${i.stock} left</b></div>`).join('')}
          ${(intel?.inventory?.over || []).map((i) => `<div class="check-row" style="margin-bottom:6px"><span class="tick">+</span><span style="flex:1">${esc(i.name)}</span><b>${i.daysStock}d cover</b></div>`).join('')}</div>
        <div class="vault-door"><p class="tiny" style="margin-bottom:10px">FINANCE</p>
          ${[['Payables', intel?.finance?.payablesMinor], ['Receivables', intel?.finance?.receivablesMinor], ['Net P&L', intel?.finance?.pl?.netMinor], ['Balance sheet', intel?.finance?.balanceSheetMinor]].map(([l, v]) => `<div class="donut-row" style="margin-bottom:7px"><span style="flex:1">${l}</span><b>${money0(v)}</b></div>`).join('')}</div>
        <div class="glass" style="padding:14px"><p class="tiny" style="margin-bottom:8px">PAYMENT INSTRUMENTS</p>${(intel?.instruments || []).map((i) => `<div class="instr-chip" style="margin-bottom:6px"><div style="flex:1"><b style="font-size:12.5px">${esc(i.name)}</b></div><span class="chip">${esc(i.status)}</span></div>`).join('')}</div>`}
    </div>`);
}

function sellerAlerts() {
  const g = state.alerts?.grouped || {};
  const sect = (title, list) => list?.length ? `<div><p class="eyebrow" style="margin-bottom:8px">${title}</p>${list.map((a) => `<div class="card-list" style="margin-bottom:8px"><span class="icowell" style="width:36px;height:36px">${ico(a.severity === 'warn' ? 'bell' : 'check')}</span><div class="main"><b>${esc(a.title)}</b><small>${esc(a.detail)}</small></div><button class="cta-mini">${esc(a.action)}</button></div>`).join('')}</div>` : '';
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">ALERTS</span><h1 class="hero">Worth a glance.</h1></div>
      ${sect('Inventory', g.inventory)}
      ${sect('Payables & receivables', g.payments)}
      ${sect('Business', g.business)}
    </div>`);
}

function sellerCustomers() {
  const cs = state.customers?.customers || [];
  const rw = state.customers?.rewards || {};
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">CUSTOMERS</span><h1 class="hero">Your regulars.</h1></div>
      <div class="seg"><button class="on">All</button><button>Top</button><button>New</button><button>Needs attention</button></div>
      ${cs.map((c) => `<div class="card-list"><div class="avatar">${esc(c.name[0])}</div><div class="main"><b>${esc(c.name)}</b><small>${c.visits} visits · ${money0(c.spentMinor)}</small></div><div class="end"><span class="chip">${esc(c.segment)}</span><div class="tiny" style="margin-top:4px">${c.goldMg} mg</div></div></div>`).join('')}
      <div class="vault-door" style="display:flex;gap:18px;padding:16px"><div><b class="gold-text" style="font-size:20px">${(rw.pointsIssued || 0).toLocaleString()}</b><p class="tiny">points issued +${rw.pointsDeltaPct || 0}%</p></div><div><b class="gold-text" style="font-size:20px">${rw.goldIssuedMg || 0} mg</b><p class="tiny">gold issued +${rw.goldDeltaPct || 0}%</p></div></div>
      <button class="cta-gold" data-action="grant-offer"><span>Reward a customer — points & gold</span><span class="arr">✦</span></button>
    </div>`);
}

function sellerInsights() {
  const ins = state.insights;
  const pl = ins?.pl || {};
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">INTELLIGENCE · P&L</span><h1 class="hero">The month, honestly.</h1></div>
      <div class="vault-door">
        ${[['Revenue', pl.revenueMinor], ['Cost of goods', -(pl.cogsMinor || 0)], ['Gross profit', pl.grossMinor], ['Expenses', -(pl.expensesMinor || 0)], ['Net profit', pl.netMinor]].map(([l, v], i) => `<div class="donut-row" style="margin-bottom:8px;${i === 4 ? 'background:var(--chip);border-radius:10px;padding:8px 10px' : ''}"><span style="flex:1">${l}</span><b class="${i === 4 ? 'gold-text' : ''}">${money0(v)}</b></div>`).join('')}
      </div>
      <div class="glass" style="padding:16px"><p class="tiny" style="margin-bottom:10px">SALES TREND · VALUE & VOLUME</p><div class="bar-chart">${(ins?.trend || []).map((v) => `<i style="height:${v}%"></i>`).join('')}</div></div>
      <div class="vault-door"><p class="tiny" style="margin-bottom:8px">EXPENSE HEADS</p>${(ins?.expenseHeads || []).map((h, i) => `<div class="donut-row" style="margin-bottom:7px"><i style="background:${['#e8c56a', '#caa14f', '#a97a2e', '#8a6420'][i]}"></i><span style="flex:1">${esc(h.head)}</span><b>${money0(h.minor)}</b></div>`).join('')}</div>
    </div>`);
}

/* ---------- router ---------- */
const route = () => (location.hash || '#/welcome').slice(2) || 'welcome';
const markDone = (list, r) => { if (!list.includes(r)) list.push(r); };
function praise(msg, sub, ic, next) {
  state.praise = [msg, sub, ic];
  go(next);
  setTimeout(() => { state.praise = null; if (route() === next) render(); }, 3800);
}
async function render() {
  const r = route();
  if (r.startsWith('seller')) state.role = 'seller';
  else if (r !== 'welcome' && r !== 'splash') state.role = 'buyer';
  if (r === 'stores' && !state.stores.length) state.stores = (await api('/api/stores')).stores || [];
  if (r === 'buyer-vault' && !state.vault) state.vault = await api('/api/vault');
  if (r === 'expenses' && !state.expenses) state.expenses = await api('/api/intelligence/expenses');
  if (r === 'seller-dash' && !state.dash) state.dash = await api('/api/seller/dashboard');
  if (r === 'seller-insights' && !state.insights) state.insights = await api('/api/seller/insights');
  if (r === 'seller-alerts' && !state.alerts) state.alerts = await api('/api/seller/alerts');
  if (r === 'seller-customers' && !state.customers) state.customers = await api('/api/seller/customers');
  const views = {
    welcome, splash, 'buyer-start': buyerStart, 'buyer-verify': buyerVerify, 'buyer-vault': buyerVault, 'buyer-gold': buyerGoldAward,
    cockpit, vault: vaultView, friends, gold, expenses, instruments, 'buyer-account': account, stores, invoice, success, card,
    'seller-onboard': sellerOnboard, 'seller-kace': sellerKace, 'seller-sample': sellerSample,
    'seller-adjust': sellerAdjust, 'seller-share': sellerShare, 'seller-dash': sellerDash,
    'seller-alerts': sellerAlerts, 'seller-customers': sellerCustomers, 'seller-insights': sellerInsights
  };
  app.innerHTML = (views[r] || welcome)();
  window.scrollTo(0, 0);
}

function endSplash() { clearInterval(state.splashTimer); go(state.role === 'seller' ? 'seller-onboard' : 'buyer-start'); }
let kaceTimer;
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-go],[data-action],[data-profile],[data-tpl],[data-stab]');
  if (!el) return;
  if (el.dataset.go) { go(el.dataset.go); return; }
  if (el.dataset.profile) { state.cardProfile = el.dataset.profile; render(); return; }
  if (el.dataset.tpl) { state.cardTemplate = el.dataset.tpl; render(); return; }
  if (el.dataset.stab) { state.sellerTab = el.dataset.stab; render(); return; }
  const a = el.dataset.action;
  if (a === 'theme') { state.theme = state.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = state.theme; localStorage.setItem('kz-theme', state.theme); render(); return; }
  if (a === 'install') { toast('On mobile: browser menu → Add to Home Screen.'); return; }
  if (a === 'pick') {
    state.role = el.dataset.role; state.splashIdx = 0; go('splash');
    clearInterval(state.splashTimer);
    const slides = SPLASH[state.role === 'seller' ? 'seller' : 'buyer'];
    state.splashTimer = setInterval(() => {
      state.splashIdx += 1;
      if (state.splashIdx >= slides.length) { clearInterval(state.splashTimer); endSplash(); return; }
      if (route() === 'splash') render();
    }, 2400);
    return;
  }
  if (a === 'splash-skip') { endSplash(); return; }
  if (a === 'start-tap') {
    toast('◉ Bring your phone to the K-Tag…');
    if (el.dataset.via === 'nfc' && 'NDEFReader' in window) { try { const r = new NDEFReader(); await r.scan(); r.onreading = () => proceed(); return; } catch {} }
    setTimeout(proceed, 900);
    function proceed() { markDone(state.buyerDone, 'buyer-start'); state.mobile = document.querySelector('#existing-mobile')?.value || state.mobile; api('/api/otp/send', { mobile: state.mobile }); praise('The Brew House says hello', 'K-Tag read — this store knows you now.', 'tap', 'buyer-verify'); }
    return;
  }
  if (a === 'verify-otp') {
    state.mobile = document.querySelector('#otp-mobile')?.value || state.mobile;
    state.email = document.querySelector('#otp-email')?.value || state.email;
    const r = await api('/api/otp/verify', { mobile: state.mobile, email: state.email });
    if (r.error) return toast(r.error, 'error');
    markDone(state.buyerDone, 'buyer-start'); markDone(state.buyerDone, 'buyer-verify');
    go('buyer-gold'); return;
  }
  if (a === 'gold-continue') { go('buyer-vault'); return; }
  if (a === 'vault-connect') { await api('/api/vault/connect', { id: el.dataset.id }); state.vault = await api('/api/vault'); toast('Connected — value found.', 'success'); render(); return; }
  if (a === 'vault-done' || a === 'vault-skip') { markDone(state.buyerDone, 'buyer-vault'); praise('Vault secured', 'Every offer you own now works at checkout.', 'vault', 'buyer-account'); return; }
  if (a === 'kyc-step') { const step = ['emirates-id-front', 'emirates-id-back', 'live-camera', 'aml-check'][state.kycStep]; await api('/api/account/kyc', { step }); if (state.kycStep === 3) { markDone(state.buyerDone, 'buyer-account'); praise('Welcome to KanzPay', 'Your account is ready, '+state.name.split(' ')[0]+'.', 'home', 'cockpit'); } else { state.kycStep += 1; render(); } return; }
  if (a === 'kyc-skip') { go('cockpit'); return; }
  if (a === 'store-pick') { toast('Opening live catalogue…'); doTap('store'); return; }
  if (a === 'navigate') { const r = await api('/api/ktag/navigate', {}); toast(`Route ready — ${r.destination?.walkMin || 4} min walk.`); return; }
  if (a === 'pay') { await api('/api/solver/preview', {}); const res = await api('/api/checkout/approve', {}); if (res.error) return toast(res.error, 'error'); toast('Approved. Gold on its way.', 'success'); go('success'); return; }
  if (a === 'stop-pay') { await api('/api/checkout/stop', {}); toast('Stopped. Nothing was paid.'); go('stores'); return; }
  if (a === 'approve-logic') { toast('Logic approved — every bill gets the best route.', 'success'); go('cockpit'); return; }
  if (a?.startsWith('gold-')) { toast({ 'gold-buy': 'Buy gold from AED 5 — coming to your vault.', 'gold-sell': 'Sell instantly to AED.', 'gold-gift': 'Send gold as a gift card.', 'gold-pay': 'Pay any K-Tag with gold.' }[a], 'success'); return; }
  if (a === 'friend-send') { toast('Invite sent — you both earn 1 mg Gold on their first tap.', 'success'); return; }
  if (a === 'share-nfc' || a === 'share-qr') { await api('/api/card/create', { name: state.name, profile: state.cardProfile, template: state.cardTemplate, mobile: state.mobile }); const r = await api('/api/card/exchange', { via: a === 'share-nfc' ? 'nfc' : 'qr' }); toast(r.message || 'Card exchanged.', 'success'); return; }
  if (a === 'share-link') { try { await navigator.share?.({ title: 'My KanzPay card', text: `${state.name} · ${state.cardProfile}`, url: location.origin + '/#/card' }); } catch {} toast('Link ready to share.'); return; }
  if (a === 'start-kace') {
    markDone(state.sellerDone, 'seller-onboard'); go('seller-kace'); state.kaceProgress = 0; clearInterval(kaceTimer);
    kaceTimer = setInterval(async () => {
      state.kaceProgress = Math.min(100, state.kaceProgress + 9);
      if (route() === 'seller-kace') render();
      if (state.kaceProgress >= 100) { clearInterval(kaceTimer); markDone(state.sellerDone, 'seller-kace'); praise('K-Assistant is in', 'Quietly running — you\'ll notice it only when it helps.', 'gear', 'seller-sample'); }
    }, 380);
    return;
  }
  if (a === 'vault-check') { markDone(state.sellerDone, 'seller-sample'); praise('It knows your bill now', 'Name, address, VAT — all verified.', 'doc', 'seller-adjust'); return; }
  if (a === 'gen-invoice') { markDone(state.sellerDone, 'seller-adjust'); await api('/api/seller/catalogue/import', { source: 'invoice' }); praise('Invoice priced fairly', 'Customer benefits applied · catalogue grew by itself.', 'chip', 'seller-share'); return; }
  if (a === 'dash-open') { markDone(state.sellerDone, 'seller-share'); praise('You\'re on the map', 'The Brew House is discoverable from today.', 'home', 'seller-dash'); return; }
  if (a?.startsWith('share-')) { toast({ 'share-ktag': 'Invoice pushed to the buyer\'s tap.', 'share-mobile': 'Invoice link sent by SMS.', 'share-print': 'Printing with K-Assist QR.', 'share-qr2': 'Show this QR to the buyer.' }[a] || 'Shared.', 'success'); return; }
  if (a === 'grant-offer') { await api('/api/seller/offer/grant', { customerId: 'cu-sarah', points: 200, goldMg: 2 }); toast('Sent: 200 pts + 2 mg Gold to Sarah.', 'success'); return; }
});

window.addEventListener('hashchange', render);
const urlTheme = new URLSearchParams(location.search).get('theme');
if (urlTheme === 'light' || urlTheme === 'dark') { state.theme = urlTheme; document.documentElement.dataset.theme = urlTheme; }
if (!location.hash) location.hash = '#/welcome';
render();
