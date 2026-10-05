// KanzPay PWA — connected journey flows · metallic gold · glass
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
  pie: '<path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5H12z"/><path d="M14.5 3.2A8.5 8.5 0 0 1 20.8 9.5H14.5z"/>',
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
  trend: '<path d="m4 17 5-6 4 3 6-8M15 6.5h4V11"/>',
  truck: '<path d="M3 16.5V6h11v10.5M14 9.5h4.5l2.5 3.5v3.5h-2M3 16.5h14.5"/><circle cx="7.5" cy="18" r="1.8"/><circle cx="16.5" cy="18" r="1.8"/>',
  clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.5V12l3 2"/>',
  back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  shield: '<path d="M12 3.5 19 6v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6z"/><path d="m9 11.8 2.2 2.2 4-4.4"/>'
};
const ico = (name, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24"><g>${ICONS[name] || ICONS.spark}</g></svg>`;

const state = {
  role: null, theme: document.documentElement.dataset.theme || 'dark',
  name: 'Navneet Sharma', mobile: '+971 50 123 4567', email: 'navneet@oxy.tech',
  invoice: null, bestValue: null, stores: [], vault: null, expenses: null,
  dash: null, alerts: null, customers: null, txns: null, admin: null,
  cardProfile: 'Professional', cardTemplate: 'aurum',
  cardFields: { name: true, title: true, company: true, mobile: true, email: true, location: true, website: false },
  cardOpen: null, kycStep: 0, kaceProgress: 0, sellerTab: 'focus',
  customFields: { title: '', company: '', website: '' },
  expPeriod: 'Monthly', expView: 'bar', trendPeriod: 'month',
  calcAmount: 6600, calcOn: { membership: true, points: true, voucher: true, gold: true },
  buyerDone: [], sellerDone: [], praise: null, splashIdx: 0, storeOpen: null
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

/* ---------- readiness bar ---------- */
const BUYER_FLOW = [['buyer-start', 'Tap or scan', 'tap & pay', 'tap'], ['buyer-verify', 'Verify', 'secure sign-in', 'lock'], ['buyer-vault', 'Value Vault', 'savings apply', 'vault'], ['buyer-account', 'Account', 'gold & cards', 'id'], ['cockpit', 'Cockpit', 'full access', 'home']];
const SELLER_FLOW = [['seller-onboard', 'Onboard', 'store live', 'store'], ['seller-kace', 'K-Assistant', 'auto catalogue', 'gear'], ['seller-sample', 'Invoice model', 'smart billing', 'doc'], ['seller-adjust', 'Value rules', 'loyalty runs', 'chip'], ['seller-share', 'Share', 'tap invoices', 'share'], ['seller-dash', 'Dashboard', 'full access', 'trend']];
const jrail = (flow) => { const cur = route(); const i = flow.findIndex(([r]) => r === cur); return `<div class="jrail">${flow.map((_, k) => `${k > 0 ? `<span class="jseg ${k <= i ? 'done' : ''}"></span>` : ''}<span class="jnode ${k <= i ? 'done' : ''}"></span>`).join('')}</div>`; };
function readybar(flow) {
  const done = state.role === 'seller' ? state.sellerDone : state.buyerDone;
  const cur = flow.find(([r]) => r === route());
  const pct = Math.round(((done.length + (cur && !done.includes(cur[0]) ? 1 : 0)) / flow.length) * 100);
  const unlocked = flow.slice(0, Math.max(done.length + (cur ? 1 : 0), 1)).map(([, , u]) => u).join(' · ');
  return `<div class="ready">${jrail(flow)}<p class="ready-lbl"><b>${pct}% ready</b> — unlocked: ${unlocked}</p></div>`;
}

const applause = (title, sub, ic = 'star') => `<div class="applaud"><span class="icowell">${ico(ic)}</span><span><b>${title}</b><small>${sub}</small></span></div>`;
const praiseBlock = () => state.praise ? applause(state.praise[0], state.praise[1], state.praise[2] || 'star') : '';
const confetti = () => `<div class="confetti">${Array.from({ length: 26 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i * 0.13) % 1.6}s;--r:${(i * 67) % 360}deg;--c:${['#f6e3a5', '#e8c56a', '#c9a24f', '#fff8e2'][i % 4]}"></i>`).join('')}</div>`;

/* ---------- real gold coin ---------- */
const goldCoin = (mg, size = 150) => `<div class="coin-breathe" style="width:${size}px;height:${size}px;margin:auto">
  <svg viewBox="0 0 120 120" style="width:100%;height:100%">
    <defs>
      <radialGradient id="cg" cx="38%" cy="30%"><stop offset="0%" stop-color="#fff4ba"/><stop offset="55%" stop-color="#d9a83e"/><stop offset="100%" stop-color="#7e5415"/></radialGradient>
      <path id="rim" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/>
    </defs>
    <circle cx="60" cy="60" r="57" fill="url(#cg)"/>
    <circle cx="60" cy="60" r="57" fill="none" stroke="#6b4a12" stroke-width="1.4" opacity=".5"/>
    <circle cx="60" cy="60" r="49" fill="none" stroke="#fff4ba" stroke-width="1" opacity=".55"/>
    <circle cx="60" cy="60" r="53" fill="none" stroke="#6b4a12" stroke-width="3.5" stroke-dasharray="1.6 3.2" opacity=".4"/>
    <text font-size="6" font-weight="800" fill="#5c3d0e" letter-spacing="0.9"><textPath href="#rim" startOffset="0.5%">999.99 DIGITAL GOLD · SAFEGOLD · 999.99 DIGITAL GOLD · SAFEGOLD ·</textPath></text>
    <text x="60" y="62" text-anchor="middle" font-size="27" font-weight="900" fill="#4a340c">${mg}<tspan font-size="9" dy="-8" dx="2">mg</tspan></text>
    <text x="60" y="76" text-anchor="middle" font-size="7" font-weight="700" fill="#5c3d0e" letter-spacing="2">FINE GOLD</text>
  </svg>
</div>`;

/* ---------- chrome ---------- */
// logo.png is gold-on-transparent — works on both themes; the -dark variant carries a baked dark box
const logoImg = () => `<img class="logo" src="/assets/kanzpay-logo.png" alt="KanzPay" />`;
const topbar = (o = {}) => `<header class="topbar">${o.back ? `<button class="icon-btn" data-go="${o.back}">${ico('back')}</button>` : logoImg()}<span class="grow"></span>${o.admin ? `<button class="icon-btn" data-go="admin" title="Controls">${ico('gear')}</button>` : ''}<button class="icon-btn" data-action="theme" title="Theme">${ico(state.theme === 'dark' ? 'sun' : 'moon')}</button></header>`;
const BUYER_TABS = [['cockpit', 'home', 'Cockpit'], ['vault', 'vault', 'Vault'], ['pay', 'tap', 'Pay'], ['card', 'card', 'Card'], ['stores', 'store', 'Stores']];
const SELLER_TABS = [['seller-dash', 'home', 'Today'], ['seller-share', 'doc', 'Invoice'], ['seller-alerts', 'bell', 'Alerts'], ['seller-customers', 'users', 'People'], ['seller-insights', 'trend', 'Intel']];
const tabbar = () => `<div class="tabbar"><nav>${(state.role === 'seller' ? SELLER_TABS : BUYER_TABS).map(([r, i, l]) => `<button class="${route() === r ? 'on' : ''}" data-go="${r}">${ico(i)}<span>${l}</span></button>`).join('')}</nav></div>`;
// K-Assist lives on the counter/POS screen — shown as a desktop dock, not a phone FAB
const posDock = () => `<div class="pos-dock"><span class="icowell solid" style="width:36px;height:36px;flex-shrink:0">${ico('printer')}</span><div style="flex:1;min-width:0"><b style="font-size:12px">K-Assistant · POS screen</b><p class="tiny">capture invoice / inventory → share to customer or mark as stock purchased</p></div><button class="cta-mini" data-action="kace-share">Share</button><button class="cta-mini" data-action="kace-stock">Stock in</button></div>`;
const screen = (inner, nav = true) => `<div class="screen${nav ? '' : ' no-nav'}">${inner}</div>${nav ? tabbar() : ''}`;

/* ---------- welcome ---------- */
function welcome() {
  return `<div class="screen no-nav">
    <div style="position:absolute;inset:0;background:url('/assets/scene-skyline.png') center/cover"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(0deg,rgba(10,8,4,.94) 28%,rgba(10,8,4,.38) 58%,rgba(10,8,4,.15))"></div>
    <div class="body" style="position:relative;z-index:1;justify-content:flex-end;padding-top:60px">
      <div class="logo-glass"><img src="/assets/kanzpay-logo.png" alt="KanzPay" /></div>
      <button class="icon-btn theme-fab" data-action="theme" title="Theme">${ico(state.theme === 'dark' ? 'sun' : 'moon')}</button>
      <h1 class="hero" style="color:#fff8e6;text-shadow:0 2px 22px rgba(0,0,0,.6);margin-top:4px">Everyday life rewards you.</h1>
      <p style="color:rgba(246,230,189,.85);font-size:12.5px;margin-top:8px;text-shadow:0 1px 12px rgba(0,0,0,.6)">Pay · Earn Gold · Save More · Discover · Live Better</p>
      <div style="display:grid;gap:10px;margin-top:22px">
        <button class="cta-gold" data-action="pick" data-role="buyer"><span>I'm a Buyer</span><span class="arr">→</span></button>
        <button class="cta-pill" data-action="pick" data-role="seller" style="justify-content:center;background:rgba(20,16,8,.55);color:#f3d98b;border-color:rgba(232,197,106,.4)">I'm a Seller →</button>
        <button class="cta-ghost" data-action="install" style="color:rgba(246,230,189,.7)">⤓ Install the app — tap, NFC & more</button>
      </div>
      <p class="tiny" style="text-align:center;color:rgba(246,230,189,.45)">Sandbox preview · no real money moves</p>
    </div>
  </div>`;
}

/* ---------- capability splash — 2-3 words per slide ---------- */
const SPLASH = {
  buyer: [
    ['scene-tap-nfc', 'Tap. Open.', 'the store comes to you'],
    ['scene-payments', 'Vault decides.', 'every saving applied'],
    ['scene-gold-reward', 'Gold lands.', 'real gold, every bill']
  ],
  seller: [
    ['scene-seller-hero', 'K-Tag on the counter.', 'a tap brings the buyer in'],
    ['scene-catalogue', 'Prints build shelves.', 'invoices & menus → live catalogue'],
    ['scene-dashboard', 'Every dirham, tallied.', 'sales · stock · money — live']
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
      <div class="splash-copy"><h1 class="hero" style="font-size:40px">${title}</h1><p>${sub}</p></div>
      <div class="splash-foot">
        <div class="dots">${slides.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>
        <button class="splash-skip" data-action="splash-skip">Skip →</button>
      </div>
    </div>
  </div>`;
}

/* ---------- buyer steps ---------- */
function buyerStart() {
  const perm = state.admin?.buyer || {};
  const permRow = (id, i, t, d, on) => `<div class="perm-row">
    <span class="icowell ${on ? 'solid' : ''}">${ico(on ? 'check' : i)}</span>
    <div style="flex:1"><b style="font-size:12.5px">${t}</b><p class="tiny">${d}</p></div>
    ${on ? '<span class="chip">Granted</span>' : `<button class="cta-mini" data-action="perm" data-perm="${id}">Allow</button>`}
  </div>`;
  return screen(`${topbar()}
    <div class="body">
      ${praiseBlock()}
      <div><span class="eyebrow">STEP 1 · TAP OR SCAN</span><h1 class="hero">Meet your first K-Tag.</h1></div>
      ${readybar(BUYER_FLOW)}
      <div class="card-hero" style="background-image:url('/assets/scene-tap-nfc.png');min-height:200px">
        <div class="nfc-ring"><div class="nfc-tag"><img src="/assets/kanzpay-mark.png" alt="" /></div></div>
      </div>
      <p class="why">A tap opens the store for you — catalogue, offers and your invoice, before you ever queue.</p>
      <div class="grid2">
        <button class="card-tile act" data-action="start-tap" data-via="nfc"><span class="icowell">${ico('tap')}</span><b>Tap the K-Tag</b><small>bring phone close</small></button>
        <button class="card-tile act" data-action="start-tap" data-via="qr"><span class="icowell">${ico('qr')}</span><b>Scan the QR</b><small>point the camera</small></button>
      </div>
      <div class="glass" style="padding:14px">
        ${permRow('perm-location', 'pin', 'Location', 'nearest stores & offers', perm.shareLocation !== undefined ? !!perm.shareLocation : state.permLoc)}
        ${permRow('perm-notify', 'bell', 'Notifications', 'gold arrivals & receipts', state.permNotify)}
      </div>
      <div class="glass" style="padding:15px">
        <div style="display:flex;gap:10px;align-items:center"><span class="icowell">${ico('phone')}</span><div style="flex:1"><b style="font-size:12.5px">Existing user?</b><p class="tiny">Country code + number — we find your vault</p></div></div>
        <div style="display:flex;gap:8px;margin-top:10px;align-items:center">
          <div class="field" style="flex:1"><input id="existing-mobile" inputmode="tel" placeholder="+971 50…" /></div>
          <button class="cta-mini" data-action="existing-user">Continue →</button>
        </div>
        <p class="tiny" id="mobile-hint" style="margin-top:6px"></p>
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
      <p class="why">Two small codes protect your vault — the only lock between you and your gold.</p>
      <div class="vault-door" style="text-align:center;padding:18px">
        <p class="tiny">SANDBOX CODES</p>
        <div class="otp-boxes" style="margin-top:10px"><b>4</b><b>2</b><b>7</b><b>1</b></div>
      </div>
      <button class="cta-gold" data-action="verify-otp"><span>Verify me</span><span class="arr">→</span></button>
    </div>`, false);
}

function buyerVault() {
  const sections = state.vault?.sections || [];
  const total = sections.filter((s) => s.status === 'connected').reduce((sum, s) => sum + (s.expectedMinor || 0), 0);
  return screen(`${topbar({ back: 'buyer-verify' })}
    <div class="body">
      ${praiseBlock()}
      <div><span class="eyebrow">STEP 3 · VALUE VAULT</span><h1 class="hero">Bring your savings together.</h1></div>
      ${readybar(BUYER_FLOW)}
      <div class="vault-door" style="text-align:center;padding-top:20px">
        <p class="tiny">VAULT VALUE RIGHT NOW</p>
        <b class="gold-text count-up" data-val="${total}" style="font-size:34px">${money0(total)}</b>
        <p class="tiny">across ${sections.filter((s) => s.status === 'connected').length} connected sources</p>
      </div>
      <div class="vault-door">
        ${sections.map((s) => `<div class="vault-row ${s.status === 'grey' ? 'grey' : ''}">
          <span class="icowell">${ico(s.id === 'memberships' ? 'card' : s.id === 'rewards' ? 'star' : s.id === 'promocodes' ? 'qr' : 'doc')}</span>
          <div><b style="font-size:13px">${esc(s.label)}</b><small class="tiny" style="display:block">${s.items.length ? esc(s.items[0].value) : 'Not connected yet'}</small></div>
          ${s.status === 'connected' ? `<b class="gold-text" style="font-size:12px">~${money0(s.expectedMinor)}</b>` : s.status === 'grey' ? '<span class="tiny">missing</span>' : `<button class="cta-mini" data-action="vault-connect" data-id="${s.id}">Connect</button>`}
        </div>`).join('')}
        <p class="why" style="margin-top:12px">Each connection is permissioned by you — saved with history, validity & encrypted credentials.</p>
      </div>
      <button class="cta-gold" data-action="vault-done"><span>My vault is set</span><span class="arr">→</span></button>
      <button class="cta-ghost" data-action="vault-skip">I'll connect the rest later</button>
    </div>`, false);
}

function buyerGoldAward() {
  return `<div class="screen no-nav" style="position:relative">
    ${confetti()}
    ${topbar()}
    <div class="body" style="text-align:center;position:relative;z-index:1">
      <div style="height:26px"></div>
      ${goldCoin(1)}
      <div><span class="eyebrow">WELCOME GIFT</span>
      <h1 class="hero" style="margin:8px 0">Congratulations, ${esc(state.name.split(' ')[0])}.</h1>
      <p class="muted">1 mg of real gold just landed in your vault.<br/>999.99 digital gold, custodied by SafeGold.</p></div>
      <button class="cta-gold" data-action="gold-continue"><span>Build my Value Vault</span><span class="arr">→</span></button>
    </div>
  </div>`;
}

/* ---------- KYC ---------- */
const KYC = [['Upload Emirates ID — front', 'Auto-crop and photo-match, in one shot', 'id'], ['Upload Emirates ID — back', 'Card details verified in seconds', 'id'], ['Live camera', 'Blink · look left · look right · hold your ID beside your face', 'cam'], ['Security check', 'AML screening by KanzPay — usually seconds', 'shield']];
function account() {
  const i = Math.min(state.kycStep, 3);
  const [title, desc, ic] = KYC[i];
  return screen(`${topbar({ back: 'buyer-vault' })}
    <div class="body">
      ${praiseBlock()}
      <div><span class="eyebrow">STEP 4 · CREATE ACCOUNT · BY KANZPAY</span><h1 class="hero">${title}.</h1><p class="muted">${desc}.</p></div>
      ${readybar(BUYER_FLOW)}
      ${i === 2
        ? `<div class="vault-door" style="text-align:center;padding:24px"><div class="kace-orb"><span class="icowell solid" style="width:60px;height:60px">${ico('cam', 'big')}</span></div><p class="tiny" style="margin-top:14px">Blink naturally · look left · look right · hold your Emirates ID beside your face</p></div>`
        : `<div class="id-frame"><div><span class="icowell solid" style="width:54px;height:54px;margin:auto">${ico(ic)}</span><p class="muted" style="margin-top:10px">Tap to upload — we crop & match automatically</p></div></div>`}
      <p class="why">One verification unlocks every K-Tag in the country — your identity boundary.</p>
      <button class="cta-gold" data-action="kyc-step"><span>${i === 3 ? 'Finish & create account' : 'Continue'}</span><span class="arr">→</span></button>
      <button class="cta-ghost" data-action="kyc-skip">Do this later — explore as guest</button>
    </div>`, false);
}

/* ---------- cockpit ---------- */
function cockpit() {
  const vaultTotal = (state.vault?.sections || []).filter((s) => s.status === 'connected').reduce((sum, s) => sum + (s.expectedMinor || 0), 0);
  const mods = [
    ['vault', 'vault', 'My Value Vault', vaultTotal ? `${money0(vaultTotal)} inside` : 'memberships · points · codes'],
    ['card', 'card', 'My Visiting Card', 'profiles · templates · share'],
    ['friends', 'users', 'Earn with friends', 'gold, both ways'],
    ['gold', 'coin', 'My Gold Vault', '13.5 mg · ≈ AED 9.45'],
    ['expenses', 'chart', 'My Expenses', `${money0(state.expenses?.totalMinor || 124000)} this month`],
    ['instruments', 'chip', 'Payment Intelligence', 'best way, per bill']
  ];
  return screen(`${topbar({ admin: true })}
    <div class="body">
      ${praiseBlock()}
      <div style="display:flex;align-items:center;gap:12px">
        <div class="avatar">${esc(state.name[0])}</div>
        <div><p class="tiny">YOUR COCKPIT</p><h2 class="sect">${esc(state.name)}</h2></div>
        <span class="grow"></span><span class="chip">13.5 mg Gold</span>
      </div>
      <div class="grid2">
        ${mods.map(([r, i, t, d], k) => `<button class="card-tile live" style="animation-delay:${k * 60}ms" data-go="${r}"><span class="icowell">${ico(i)}</span><b>${t}</b><small>${d}</small><span class="tile-glow"></span></button>`).join('')}
      </div>
      <div class="share-banner" style="display:flex;align-items:center;gap:12px">
        <div style="flex:1"><b>All set to earn more</b><p style="font-size:11px;opacity:.85;margin-top:4px">Value + wealth building, together.</p></div>
        <button class="cta-mini light" data-go="stores">Find stores →</button>
      </div>
    </div>`);
}

/* ---------- cockpit modules ---------- */
function vaultView() {
  const sections = state.vault?.sections || [];
  const total = sections.filter((s) => s.status === 'connected').reduce((sum, s) => sum + (s.expectedMinor || 0), 0);
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">MY VALUE VAULT</span><h1 class="hero">Everything you've earned.</h1></div>
      <div class="vault-door" style="text-align:center;padding:22px">
        <p class="tiny">TOTAL VAULT VALUE</p>
        <b class="gold-text" style="font-size:36px">${money0(total + 945)}</b>
        <div class="progress" style="margin-top:12px"><i style="width:${Math.min(100, total / 20)}%"></i></div>
        <div class="check-row" style="margin-top:12px">${goldCoin('13.5', 34)}<span style="flex:1;font-size:12px">Gold inside: <b>13.5 mg</b> ≈ AED 9.45</span><b style="color:var(--gold-3)">+15.2%</b></div>
        <p class="tiny" style="margin-top:8px">Connect the missing lanes — every dirham counts at checkout.</p>
      </div>
      ${sections.map((s, k) => `<div class="vault-row ${s.status === 'grey' ? 'grey' : ''} card-list" style="animation-delay:${k * 50}ms">
          <span class="icowell">${ico(s.id === 'memberships' ? 'card' : s.id === 'rewards' ? 'star' : s.id === 'promocodes' ? 'qr' : 'doc')}</span>
          <div><b style="font-size:13px">${esc(s.label)}</b><small class="tiny" style="display:block">${s.items.length ? esc(s.items[0].value) + ' · ' + esc(s.items[0].valid) : 'Not connected yet'}</small></div>
          ${s.status === 'connected' ? `<b class="gold-text" style="font-size:12px">~${money0(s.expectedMinor)}</b>` : s.status === 'grey' ? '<span class="tiny">missing</span>' : `<button class="cta-mini" data-action="vault-connect" data-id="${s.id}">Connect</button>`}
        </div>`).join('')}
      <button class="cta-pill" data-go="stores" style="justify-content:center">Use it at a store →</button>
    </div>`);
}

function friends() {
  const shareText = `${state.name.split(' ')[0]} uses KanzPay — tap, save, and earn real gold on everyday bills. Join me — we both get 1 mg Gold on your first K-Tag tap. ${location.origin}`;
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">EARN WITH FRIENDS</span><h1 class="hero">Better with company.</h1></div>
      <div class="share-banner">
        <b style="font-size:16px">Their checkout pays you too.</b>
        <p style="font-size:11.5px;opacity:.9;margin-top:6px;line-height:1.55">When a friend you brought pays at any K-Tag, they save and earn gold — and 1 mg lands in your vault as well. Every friend matters.</p>
      </div>
      <div class="card-hero" style="background-image:url('/assets/scene-community.png');min-height:120px"></div>
      <div class="glass" style="padding:16px">
        <b style="font-size:13px">Share the invite</b>
        <p class="tiny" style="margin-top:4px">One tap — banner + message go together, through whatever they use.</p>
        <button class="cta-gold" style="margin-top:12px" data-action="friend-share" data-text="${esc(shareText)}"><span>Share invite</span><span class="arr">${ico('share')}</span></button>
        <div class="grid3" style="margin-top:10px">
          <button class="cta-pill" data-action="friend-wa" style="justify-content:center">WhatsApp</button>
          <button class="cta-pill" data-action="friend-sms" style="justify-content:center">SMS</button>
          <button class="cta-pill" data-action="friend-mail" style="justify-content:center">Email</button>
        </div>
      </div>
      <p class="tiny" style="text-align:center">Rewards land only when they join — no spam, ever.</p>
    </div>`);
}

function gold() {
  const vaultIn = 820; const now = 945; const pct = (((now - vaultIn) / vaultIn) * 100).toFixed(1);
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">MY GOLD VAULT</span><h1 class="hero">Small weight. Real gold.</h1></div>
      <div class="vault-door" style="text-align:center;padding-top:24px">
        ${goldCoin('13.5', 150)}
        <b style="display:block;font-size:17px;margin-top:10px">≈ AED ${(now / 100 * 1).toFixed(2)} today</b>
        <p class="tiny" style="margin-top:4px">Locked in at AED 8.20 · <b style="color:var(--gold-3)">+${pct}%</b> since you earned it</p>
      </div>
      <div class="grid2">
        <button class="card-tile" data-action="gold-buy"><span class="icowell">${ico('plus')}</span><b>Buy gold</b><small>from AED 5</small></button>
        <button class="card-tile" data-action="gold-sell"><span class="icowell">${ico('minus')}</span><b>Sell gold</b><small>instant AED</small></button>
        <button class="card-tile" data-action="gold-gift"><span class="icowell">${ico('gift')}</span><b>Gift card</b><small>send as gold</small></button>
        <button class="card-tile" data-action="gold-deliver"><span class="icowell">${ico('truck')}</span><b>Physical gold</b><small>home delivery</small></button>
      </div>
      <div class="vault-door">
        <div style="display:flex;gap:10px;align-items:center"><span class="icowell">${ico('truck')}</span><div><b style="font-size:13px">Deliver to your door</b><p class="tiny">Choose address · pick a slot · approve charges</p></div></div>
        <div class="check-row" style="margin-top:10px">${ico('pin')}<span style="flex:1">Home · Marina, Dubai</span><button class="chip" style="cursor:pointer">Change</button></div>
        <div class="check-row" style="margin-top:7px">${ico('clock')}<span style="flex:1">Tomorrow · 10 AM – 1 PM</span><button class="chip" style="cursor:pointer">Slots</button></div>
        <div class="donut-row" style="margin-top:10px"><span style="flex:1">Delivery + convenience fee</span><b>AED 15.00</b></div>
        <div class="donut-row" style="margin-top:5px"><span style="flex:1">Gold to deliver</span><b class="gold-text">13.5 mg ≈ AED 9.45</b></div>
        <button class="cta-gold" style="margin-top:12px" data-action="gold-deliver-confirm"><span>Approve & schedule delivery</span><span class="arr">→</span></button>
      </div>
    </div>`);
}

const EXP_COLORS = ['#e8c56a', '#7fb3d5', '#c98a5e', '#8fbf8f', '#b48ad9'];
function expenses() {
  const ex = state.expenses;
  const cats = ex?.categories || [];
  const total = ex?.totalMinor || 1;
  const deltas = { Monthly: +9, Weekly: -4, Yearly: +22 };
  const d = deltas[state.expPeriod] ?? 9;
  let acc = 0;
  const pieStops = cats.map((c, i) => { const a = acc; acc += c.pct; return `${EXP_COLORS[i % 5]} ${a}% ${acc}%`; }).join(', ');
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">MY EXPENSES</span><h1 class="hero">Where your money went.</h1></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <div class="seg">${['Weekly', 'Monthly', 'Yearly'].map((p) => `<button class="${p === state.expPeriod ? 'on' : ''}" data-exp-period="${p}">${p}</button>`).join('')}</div>
        <div class="seg"><button class="${state.expView === 'bar' ? 'on' : ''}" data-exp-view="bar">${ico('chart')}</button><button class="${state.expView === 'pie' ? 'on' : ''}" data-exp-view="pie">${ico('pie')}</button></div>
      </div>
      <div class="glass" style="padding:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <p class="tiny">${state.expPeriod.toUpperCase()} SPEND</p>
          <b class="gold-text">${money0(total)}</b>
        </div>
        ${state.expView === 'bar'
          ? `<div class="bar-chart">${(ex?.trend || []).map((v, i) => `<i style="height:${v}%;background:${EXP_COLORS[i % 5]}"></i>`).join('')}</div>`
          : `<div class="pie" style="background:conic-gradient(${pieStops || '#e8c56a 0 100%'})"><div class="pie-hole"><b>${money0(total)}</b><small>total</small></div></div>`}
        <p class="tiny" style="margin-top:10px">vs last ${state.expPeriod.slice(0, -2).toLowerCase()}: <b style="color:${d >= 0 ? '#c98a5e' : 'var(--gold-3)'}">${d >= 0 ? '+' : ''}${d}%</b></p>
      </div>
      ${cats.map((c, i) => `<div class="card-list"><span class="exp-dot" style="background:${EXP_COLORS[i % 5]}"></span><div class="main"><b>${esc(c.label)}</b><small>${c.pct}% of period</small></div><span class="end">${money0(c.minor)}</span></div>`).join('')}
      <div class="vault-door">
        <div style="display:flex;gap:10px;align-items:center">${ico('spark')}<b style="font-size:13px">Spend smarter next time</b></div>
        <div class="check-row" style="margin-top:10px">${ico('pin')}<span style="flex:1;font-size:12px">Coffee: <b>The Brew House</b> gave you <b class="gold-text">AED 4.80</b> back last week — highest saver near you</span></div>
        <div class="check-row" style="margin-top:7px">${ico('coin')}<span style="flex:1;font-size:12px">Groceries at <b>Luma Market</b> earn <b class="gold-text">2× points</b> for your profile</span></div>
        <p class="tiny" style="margin-top:10px">${esc(ex?.lifestyle?.insight || '')}</p>
      </div>
    </div>`);
}

const CALC_OPTS = [['membership', 'Membership price', 0.20], ['points', 'Reward points', 150], ['voucher', 'Promo KANZ10', 0.10], ['gold', 'Gold redeem', 0.08]];
function instruments() {
  const amt = state.calcAmount;
  let net = amt, saved = 0;
  const rows = CALC_OPTS.map(([id, label, v]) => {
    const on = state.calcOn[id];
    const sv = on ? (typeof v === 'number' && v < 1 ? Math.round(amt * v) : v * 100) : 0;
    if (on) { saved += sv; net -= sv; }
    return `<div class="instr-chip calc-row ${on ? '' : 'off'}" data-calc="${id}" style="cursor:pointer">
      <span class="exp-dot" style="background:${on ? 'var(--gold-2)' : 'var(--faint)'}"></span>
      <div style="flex:1"><b style="font-size:13px">${label}</b><small class="tiny" style="display:block">${on ? `−${money(sv)} on this bill` : 'tap to include'}</small></div>
      ${on ? ico('check') : ''}
    </div>`;
  }).join('');
  const pts = Math.floor(net / 100) * 2, mg = +(net * 0.0008).toFixed(1);
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">PAYMENT INTELLIGENCE</span><h1 class="hero">Every bill, paid wisely.</h1></div>
      <div class="vault-door" style="text-align:center;padding:20px">
        <p class="tiny">YOUR BILL</p>
        <div class="field" style="max-width:170px;margin:8px auto 0"><input id="calc-amt" inputmode="numeric" value="${(amt / 100).toFixed(0)}" style="text-align:center;font-size:22px;font-weight:800" /></div>
        <div style="display:flex;justify-content:space-around;margin-top:16px">
          <div><b class="gold-text" style="font-size:20px">${money(net)}</b><p class="tiny">you pay</p></div>
          <div><b style="font-size:20px;color:var(--gold-3)">${money(saved)}</b><p class="tiny">saved now</p></div>
          <div><b style="font-size:20px">${pts} pts · ${mg} mg</b><p class="tiny">earned</p></div>
        </div>
      </div>
      ${rows}
      <p class="why">Toggle the mix — the math moves live. This is what KanzPay evaluates on every transaction, for every seller.</p>
      <button class="cta-gold" data-action="approve-logic"><span>Approve this logic</span><span class="arr">✓</span></button>
    </div>`);
}

/* ---------- pay overview (verified user) ---------- */
function payOverview() {
  const txns = state.txns?.transactions || [];
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">PAY</span><h1 class="hero">Ready when you are.</h1></div>
      <div class="vault-door" style="text-align:center;padding:20px">
        <div class="nfc-ring" style="width:120px;height:120px"><div class="nfc-tag" style="width:86px;height:86px"><img src="/assets/kanzpay-mark.png" alt="" style="width:48px" /></div></div>
        <button class="cta-gold" data-action="start-tap" data-via="nfc" style="margin-top:14px"><span>Tap a K-Tag to pay</span><span class="arr">→</span></button>
      </div>
      <div class="grid3">
        <div class="card-metric"><small>Vault value</small><strong>${money0((state.vault?.sections || []).reduce((s, x) => s + (x.expectedMinor || 0), 0))}</strong></div>
        <div class="card-metric"><small>Gold</small><strong class="gold-text pulse-soft">13.5 mg</strong></div>
        <div class="card-metric"><small>Instruments</small><strong>3</strong><span class="delta">Aani · Jaywan · ADCB</span></div>
      </div>
      <div><p class="eyebrow" style="margin-bottom:8px">RECENT TRANSACTIONS</p>
        ${txns.map((t) => `<div class="card-list" style="margin-bottom:8px">
          <span class="icowell" style="width:38px;height:38px">${ico(t.status === 'SETTLED' ? 'check' : 'clock')}</span>
          <div class="main"><b>${esc(t.store)}</b><small>${esc(t.at)} · ${t.status === 'SETTLED' ? `saved ${money(t.savedMinor)} · +${t.goldMg} mg` : 'stopped — nothing paid'}</small></div>
          <span class="end">${money(t.amountMinor)}</span>
        </div>`).join('')}
      </div>
    </div>`);
}

/* ---------- stores & invoice ---------- */
function stores() {
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">${ico('pin')} DUBAI MARINA — 300 M RADIUS</span><h1 class="hero">Around you right now.</h1><p class="muted">Sorted by your interests & patterns — not by ads.</p></div>
      ${state.stores.map((s) => {
        const open = state.storeOpen === s.id;
        const txns = (state.txns?.transactions || []).filter((t) => t.store === s.name);
        return `<div class="store-card" style="grid-template-columns:74px 1fr auto;cursor:pointer" data-action="store-open" data-id="${s.id}">
          <span class="thumb" style="background-image:url('${s.image}')"></span>
          <span><b style="font-size:13.5px">${esc(s.name)}</b><small class="tiny" style="display:block;margin:3px 0">${esc(s.kind)} · ${s.distanceM}m · ★${s.rating} ${s.live ? '· live catalogue' : ''}</small>
          <span style="display:flex;gap:4px;flex-wrap:wrap">${s.offers.map((o) => `<span class="chip" style="font-size:8.5px;padding:3px 8px">${o}</span>`).join('')}</span>
          ${open ? `<span style="display:block;margin-top:8px">${txns.length ? txns.map((t) => `<span class="tiny" style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px dashed var(--stroke-soft)"><span>${esc(t.at)}</span><b>${money(t.amountMinor)}</b></span>`).join('') : '<span class="tiny">No visits yet — your first tap earns gold.</span>'}</span>` : ''}</span>
          <span class="end">${open ? '▾' : '›'}</span>
        </div>`;
      }).join('')}
      <div class="glass" style="padding:14px;display:flex;gap:10px;align-items:center"><span class="pulse-dot"></span><p class="tiny" style="flex:1">Tap a store's K-Tag to open its invoice — the address opens in maps too.</p><button class="cta-mini" data-action="navigate">${ico('pin')} Navigate</button></div>
    </div>`);
}

async function doTap(via) {
  const ex = await api('/api/tap/exchange', { kTag: 'K-BREW-001', buyerId: state.account?.id || 'buyer-navneet', capabilities: ['identity', 'invoice', 'catalogue', 'location', 'rewards'] });
  if (ex.error) return toast(ex.error, 'error');
  await api('/api/ktag/navigate', {});
  state.invoice = await api('/api/invoice/create', {});
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
  const earned = state.bestValue || {};
  return `<div class="screen no-nav" style="position:relative">
    ${confetti()}
    ${topbar()}
    <div class="body" style="position:relative;z-index:1">
      <div class="vault-door" style="text-align:center;padding:26px">
        ${goldCoin(earned.goldEarnedMg || 2, 110)}
        <h1 class="hero" style="margin-top:14px">Congratulations.</h1>
        <p class="muted" style="margin-top:4px">That bill just paid you back.</p>
        <div style="display:flex;justify-content:space-around;margin-top:16px">
          <div><b class="gold-text" style="font-size:19px">+${earned.goldEarnedMg || 2} mg</b><p class="tiny">gold earned</p></div>
          <div><b class="gold-text" style="font-size:19px">+${earned.pointsEarned || 120}</b><p class="tiny">points</p></div>
          <div><b class="gold-text" style="font-size:19px">${money((earned.grossMinor || 0) - (earned.netMinor || 0))}</b><p class="tiny">saved</p></div>
        </div>
        <p class="tiny" style="margin-top:12px">Filed under Food & Dining · receipt ${esc(state.invoice?.reference || '1048')}</p>
      </div>
      <button class="cta-gold" data-go="cockpit"><span>Back to cockpit</span><span class="arr">→</span></button>
      <button class="cta-pill" data-go="card" style="justify-content:center">${ico('card')} Share my visiting card</button>
    </div>`;
}

/* ---------- visiting card builder ---------- */
const PROFILES = ['Professional', 'Family', 'Friends', 'Colleagues', 'Neighbour', 'Custom'];
const PROFILE_DATA = {
  Professional: { title: 'Founder & CEO', company: 'Oxy Technologies', location: 'Abu Dhabi, UAE', website: 'oxy.tech' },
  Family: { title: 'Papa', company: '', location: 'Abu Dhabi', website: '' },
  Friends: { title: 'Nav', company: '', location: 'Dubai Marina', website: 'insta/navneet' },
  Colleagues: { title: 'CEO, Oxy Technologies', company: 'Oxy Technologies', location: 'Abu Dhabi', website: 'oxy.tech' },
  Neighbour: { title: 'Next door · Tower B', company: '', location: 'Marina, Dubai', website: '' },
  Custom: { title: '', company: '', location: '', website: '' }
};
const FIELDS = [['name', 'Full name'], ['title', 'Title'], ['company', 'Company'], ['mobile', 'Mobile'], ['email', 'Email'], ['location', 'Location'], ['website', 'Website / social']];
function card() {
  const tpl = state.cardTemplate;
  const pd = state.cardProfile === 'Custom'
    ? { title: state.customFields.title, company: state.customFields.company, location: '', website: state.customFields.website }
    : (PROFILE_DATA[state.cardProfile] || PROFILE_DATA.Professional);
  const f = state.cardFields;
  const lines = [];
  if (f.name) lines.push(`<h2 class="sect" style="margin:0">${esc(state.name)}</h2>`);
  if (f.title && pd.title) lines.push(`<p class="tiny">${esc(pd.title)}${f.company && pd.company ? ' · ' + esc(pd.company) : ''}</p>`);
  else if (f.company && pd.company) lines.push(`<p class="tiny">${esc(pd.company)}</p>`);
  if (f.location && pd.location) lines.push(`<p class="tiny">${esc(pd.location)}</p>`);
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">MY VISITING CARD</span><h1 class="hero">One card, many faces.</h1>
      <p class="why" style="margin-top:10px">Build the profile once — tick what each circle sees. A tap on any phone shares it.</p></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${PROFILES.map((p) => `<button class="chip" style="cursor:pointer;${p === state.cardProfile ? 'background:var(--gold-grad);color:#171004' : ''}" data-profile="${p}">${p}</button>`).join('')}</div>
      <div class="vault-door">
        <p class="tiny" style="margin-bottom:8px">TEMPLATE — pick a look</p>
        <div class="tpl-previews">
          ${['aurum', 'pearl', 'onyx'].map((t) => `<button class="tpl-mini tpl-${t} ${tpl === t ? 'on' : ''}" data-tpl="${t}"><b>${esc(state.name.split(' ')[0])}</b><small>${t}</small></button>`).join('')}
        </div>
      </div>
      <div class="vault-door" style="padding:14px">
        <p class="tiny" style="margin-bottom:8px">ON THIS CARD — tick to include</p>
        ${FIELDS.map(([k, l]) => `<button class="field-tick ${f[k] ? 'on' : ''}" data-field="${k}"><span class="tickbox">${f[k] ? ico('check') : ''}</span>${l}</button>`).join('')}
      </div>
      ${state.cardProfile === 'Custom' ? `<div class="vault-door" style="padding:14px">
        <p class="tiny" style="margin-bottom:8px">CUSTOM FIELDS — type what this circle sees</p>
        <div class="field"><input id="cf-title" placeholder="Title (e.g. Weekend me)" value="${esc(state.customFields?.title || '')}" /></div>
        <div class="field" style="margin-top:7px"><input id="cf-company" placeholder="Company / group" value="${esc(state.customFields?.company || '')}" /></div>
        <div class="field" style="margin-top:7px"><input id="cf-website" placeholder="Social / link" value="${esc(state.customFields?.website || '')}" /></div>
      </div>` : ''}
      <div class="card-face tpl-${tpl}" data-action="share-nfc" style="cursor:pointer" title="Tap to share this card">
        <div>${lines.join('')}</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px">
          <div class="tiny">${f.mobile ? esc(state.mobile) : ''}${f.mobile && f.email ? '<br/>' : ''}${f.email ? esc(state.email) : ''}${(f.mobile || f.email) && f.website && pd.website ? '<br/>' : ''}${f.website && pd.website ? esc(pd.website) : ''}</div>
          <div class="qr"></div>
        </div>
      </div>
      <div class="grid2">
        <button class="cta-pill" data-action="share-nfc" style="justify-content:center">${ico('tap')} Tap to share</button>
        <button class="cta-pill" data-action="share-qr" style="justify-content:center">${ico('qr')} Show QR</button>
      </div>
      <p class="tiny" style="text-align:center">Tap on any non-K-Tag phone opens card share — one tap sends the profile.</p>
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
        <div class="kace-orb"><span class="icowell solid" style="width:64px;height:64px">${ico('gear', 'big')}</span></div>
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

const SELLER_RULES = [
  ['membership', 'Memberships & member cards', 'accepted: Gold, Silver, Brew Club · applies on all items'],
  ['voucher', 'Vouchers & promo codes', 'KANZ10 = 10% · one per bill · min AED 20'],
  ['coupons', 'Coupons', 'flat AED 15 off · weekdays only'],
  ['points', 'Reward points', 'GMV→Points: AED 200 = 100 pts · Points→AED: 100 pts = AED 5 · redeem min bill AED 30 · max 500 pts/checkout'],
  ['gold', 'Gold rewards', '2% of invoice value as mg gold · on bills ≥ AED 50']
];
function sellerAdjust() {
  return screen(`${topbar({ back: 'seller-sample' })}
    <div class="body">
      ${praiseBlock()}
      <div><span class="eyebrow">STEP 4 · VALUE VAULT CHECK</span><h1 class="hero">Decide what counts.</h1><p class="muted">The buyer shared their vault — approve which benefits apply, and how.</p></div>
      ${readybar(SELLER_FLOW)}
      ${SELLER_RULES.map(([id, t, rule], k) => {
        const open = state.cardOpen === id;
        return `<div class="instr-chip" style="flex-direction:column;align-items:stretch;cursor:pointer" data-expand="${id}">
          <div style="display:flex;align-items:center;gap:12px"><div style="flex:1"><b style="font-size:13px">${t}</b></div><b class="gold-text">${k === 0 ? '20%' : k === 1 ? '10%' : k === 2 ? 'AED 15' : k === 3 ? '100 pts' : '2%'}</b><span class="chip">${open ? 'On ▾' : 'On ▸'}</span></div>
          ${open ? `<div class="rule-detail"><p>${rule}</p><div class="field" style="margin-top:8px"><input value="${rule.split('·')[0].trim()}" /></div></div>` : ''}
        </div>`;
      }).join('')}
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
      ${posDock()}
      <div class="glass" style="padding:14px">
        <p class="tiny" style="margin-bottom:8px">PRINT → SHARE — the invoice reaches them any way they like</p>
        ${[['share-mobile', 'phone', 'Mobile number', 'sms / whatsapp link'], ['share-ktag', 'tap', 'Via K-Tag', 'they tap to receive'], ['share-qr2', 'qr', 'Show QR', 'they scan you']].map(([a, i, t, d]) => `<div class="check-row" style="margin-bottom:7px;cursor:pointer" data-action="${a}"><span class="icowell" style="width:34px;height:34px">${ico(i)}</span><div style="flex:1"><b style="font-size:12.5px">${t}</b><p class="tiny">${d}</p></div><span class="end">→</span></div>`).join('')}
      </div>
      <button class="cta-gold" data-action="dash-open"><span>Open dashboard</span><span class="arr">→</span></button>
    </div>`);
}

function sellerDash() {
  const f = state.dash?.focus;
  const intel = state.dash?.intelligence;
  const focus = state.sellerTab === 'focus';
  const openTickets = (f?.tickets || []).filter((t) => t.status === 'open').length;
  const trendVal = { day: 6, week: 11, month: f?.trends?.valuePct || 18, year: 41 }[state.trendPeriod];
  const trendVol = { day: 3, week: 8, month: f?.trends?.volumePct || 12, year: 29 }[state.trendPeriod];
  return screen(`${topbar({ admin: true })}
    <div class="body">
      ${praiseBlock()}
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
        <div><span class="eyebrow">THE BREW HOUSE</span><h1 class="hero" style="font-size:24px">Good morning.</h1></div>
        <div class="seg"><button class="${focus ? 'on' : ''}" data-stab="focus">Focus</button><button class="${focus ? '' : 'on'}" data-stab="intel">Intelligence</button></div>
      </div>
      ${focus ? `
        <div class="grid3 metrics-row">
          <div class="card-metric"><small>Pending commission</small><strong>${money0(f?.commission?.pendingMinor || 0)}</strong></div>
          <div class="card-metric"><small>Paid history</small><strong>${money0(f?.commission?.paidMinor || 0)}</strong></div>
          <div class="card-metric"><small>Repeat cust.</small><strong>${f?.rewards?.repeatPct || 0}%</strong></div>
        </div>
        <div class="vault-door"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><p class="tiny">TICKETS</p><span class="badge-balloon">${openTickets}</span></div>${(f?.tickets || []).map((t) => `<div class="card-list" style="margin-bottom:7px"><span class="icowell" style="width:36px;height:36px">${ico(t.kind === 'Complaint' ? 'bell' : t.kind === 'Query' ? 'mail' : 'star')}</span><div class="main"><b>${esc(t.kind)}</b><small>${esc(t.text)}</small></div><span class="chip">${t.status}</span></div>`).join('')}</div>
        ${posDock()}
      <div style="display:flex;gap:8px;align-items:center"><p class="tiny">TRENDS vs last</p><div class="seg">${['day', 'week', 'month', 'year'].map((p) => `<button class="${p === state.trendPeriod ? 'on' : ''}" data-trend="${p}">${p[0].toUpperCase() + p.slice(1)}</button>`).join('')}</div></div>
        <div class="grid2">
          <div class="card-metric"><small>Value trend</small><strong class="gold-text">+${trendVal}%</strong><span class="delta">vs last ${state.trendPeriod}</span></div>
          <div class="card-metric"><small>Volume trend</small><strong class="gold-text">+${trendVol}%</strong><span class="delta">vs last ${state.trendPeriod}</span></div>
        </div>
        <div class="glass" style="padding:16px"><p class="tiny" style="margin-bottom:8px">CUSTOMER TRENDS</p><div style="display:flex;gap:16px"><div><b>${f?.customers?.walkins || 0}</b><p class="tiny">walk-ins</p></div><div><b>${money0(f?.customers?.avgTicketMinor || 0)}</b><p class="tiny">avg ticket</p></div><div><b>${f?.customers?.repeatPct || 0}%</b><p class="tiny">repeat</p></div></div></div>` : `
        <div class="grid2">
          <button class="card-tile" data-action="cat-import" data-src="menu"><span class="icowell">${ico('doc')}</span><b>Upload menu</b><small>items → SKUs</small></button>
          <button class="card-tile" data-action="cat-import" data-src="inventory"><span class="icowell">${ico('box')}</span><b>Upload inventory</b><small>stock → listings</small></button>
        </div>
        <div class="grid2">
          <div class="card-metric"><small>Catalogue SKUs</small><strong>${intel?.catalogue?.skus || 0}</strong><span class="delta">menu editable</span></div>
          <div class="card-metric"><small>Competition alerts</small><strong>${intel?.catalogue?.competitionAlerts || 0}</strong><span class="delta">price diff SKUs</span></div>
        </div>
        <div class="vault-door">
          <p class="tiny" style="margin-bottom:8px">CATALOGUE TEMPLATES</p>
          <div class="tpl-previews">
            ${['aurum', 'pearl', 'onyx'].map((t) => `<button class="tpl-mini tpl-${t} ${state.catTpl === t ? 'on' : ''}" data-cattpl="${t}"><b>${t === 'aurum' ? 'Menu board' : t === 'pearl' ? 'Grid cards' : 'List view'}</b><small>${t}</small></button>`).join('')}
          </div>
          <p class="tiny" style="margin-top:8px">Your catalogue opens on the buyer's phone in this layout.</p>
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
  const quant = { 'al-stock-1': 'sold 96 this week — 4 left', 'al-stock-2': 'only 9 sold in 7 days', 'al-pay-1': 'AED 1,240 due — avg payment delay 2d', 'al-pay-2': '3rd on-time payment in a row', 'al-biz-1': '84 orders vs 71 last week', 'al-biz-2': 'avg approval time 9 min — this is slow' };
  const sect = (title, list) => list?.length ? `<div><p class="eyebrow" style="margin-bottom:8px">${title}</p>${list.map((a) => `<div class="card-list" style="margin-bottom:8px"><span class="icowell" style="width:36px;height:36px">${ico(a.severity === 'warn' ? 'bell' : 'check')}</span><div class="main"><b>${esc(a.title)}</b><small>${esc(a.detail)} · <i style="color:var(--gold-3);font-style:normal">${quant[a.id] || ''}</i></small></div><button class="cta-mini">${esc(a.action)}</button></div>`).join('')}</div>` : '';
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
  const field = (id, label, v) => `<div class="field" style="flex:1"><span>${label}</span><input id="${id}" inputmode="numeric" value="${(v || 0) / 100}" /></div>`;
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">INTELLIGENCE · P&L</span><h1 class="hero">The month, honestly.</h1></div>
      <div class="vault-door">
        <div style="display:flex;gap:8px">${field('pl-rev', 'Revenue AED', pl.revenueMinor)}${field('pl-cogs', 'COGS AED', pl.cogsMinor)}${field('pl-exp', 'Expenses AED', pl.expensesMinor)}</div>
        <div style="display:flex;justify-content:space-between;margin-top:14px;padding:10px 12px;background:var(--chip);border-radius:12px"><span>Gross</span><b>${money0((pl.revenueMinor || 0) - (pl.cogsMinor || 0))}</b></div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;padding:10px 12px;background:var(--glass);border:1px solid var(--stroke);border-radius:12px"><span>Net profit</span><b class="gold-text" style="font-size:18px">${money0(pl.netMinor)}</b></div>
        <button class="cta-pill" style="margin-top:12px;justify-content:center;width:100%" data-action="pl-save">${ico('check')} Save October summary</button>
        <p class="tiny" style="margin-top:8px">Only the summary is stored — never your files or photos.</p>
      </div>
      <div class="glass" style="padding:16px"><p class="tiny" style="margin-bottom:10px">SALES TREND · VALUE & VOLUME</p><div class="bar-chart">${(ins?.trend || []).map((v, i) => `<i style="height:${v}%;background:${EXP_COLORS[i % 5]}"></i>`).join('')}</div></div>
      <div class="vault-door"><p class="tiny" style="margin-bottom:8px">EXPENSE HEADS</p>${(ins?.expenseHeads || []).map((h, i) => `<div class="donut-row" style="margin-bottom:7px"><i style="background:${EXP_COLORS[i % 5]}"></i><span style="flex:1">${esc(h.head)}</span><b>${money0(h.minor)}</b></div>`).join('')}</div>
    </div>`);
}

/* ---------- admin controls ---------- */
const ADMIN_DEFS = {
  buyer: [
    ['SHARING ON TAP', [
      ['shareVaultOnTap', 'Share Value Vault on tap', 'sellers see offers you qualify for'],
      ['shareLocation', 'Share location', 'stores & offers near you'],
      ['shareExpenses', 'Share expense categories', 'powers lifestyle-matched offers']
    ]],
    ['INTELLIGENCE', [
      ['allowLifestyleIntel', 'Lifestyle intelligence', 'spend-pattern recommendations'],
      ['autoApplyMembership', 'Auto-apply memberships', 'member pricing without asking'],
      ['autoApplyPoints', 'Auto-apply reward points', 'redeem points at every bill']
    ]],
    ['SYSTEM', [
      ['notifications', 'Notifications', 'offers, gold arrivals, receipts'],
      ['dataSync', 'Sync with partner apps', 'keeps vault & gold in step everywhere']
    ]]
  ],
  seller: [
    ['CATALOGUE', [
      ['autoCatalogueFromInvoice', 'Build from invoices', 'K-Assist reads print-share bills'],
      ['autoCatalogueFromMenu', 'Build from menus', 'upload once, SKUs forever'],
      ['autoCatalogueFromInventory', 'Build from inventory', 'stock sheets become listings']
    ]],
    ['ALERTS', [
      ['inventoryAlerts', 'Inventory alerts', 'low & over stock'],
      ['payableAlerts', 'Payables alerts', 'what you owe, before it is due'],
      ['receivableAlerts', 'Receivables alerts', 'money owed to you'],
      ['businessAlerts', 'Business alerts', 'orders, trends, P&L']
    ]],
    ['REWARDS & OPERATION', [
      ['allowPointsRewards', 'Points rewards', 'buyers earn your points'],
      ['allowGoldRewards', 'Gold rewards', 'buyers earn mg gold'],
      ['kaceEnabled', 'K-Assistant active', 'floating logo, print-share'],
      ['shareInvoicesBeforePrint', 'Share before print', 'invoice reaches phone first'],
      ['dataSync', 'Sync with partner apps', 'catalogue & sales flow both ways']
    ]]
  ]
};
function adminView() {
  const role = state.role === 'seller' ? 'seller' : 'buyer';
  const settings = state.admin?.[role] || {};
  return screen(`${topbar({ back: role === 'seller' ? 'seller-dash' : 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">${role === 'seller' ? 'STORE' : 'MY'} CONTROLS</span><h1 class="hero">You're in charge.</h1>
      <p class="why" style="margin-top:10px">Every switch is honoured instantly — sync & permissions apply from the next tap.</p></div>
      ${ADMIN_DEFS[role].map(([group, rows]) => `
        <div class="vault-door"><p class="tiny" style="margin-bottom:8px">${group}</p>
          ${rows.map(([key, label, desc]) => `<div class="check-row" style="margin-bottom:7px">
            <span class="icowell" style="width:34px;height:34px">${ico('chip')}</span>
            <div style="flex:1"><b style="font-size:12.5px">${label}</b><p class="tiny">${desc}</p></div>
            <button class="chip" style="cursor:pointer;min-width:46px;${settings[key] ? 'background:var(--gold-grad);color:#171004' : ''}" data-setting="${key}">${settings[key] ? 'On' : 'Off'}</button>
          </div>`).join('')}
        </div>`).join('')}
    </div>`);
}

/* ---------- router ---------- */
const route = () => (location.hash || '#/welcome').slice(2) || 'welcome';
const markDone = (list, r) => { if (!list.includes(r)) list.push(r); };
function praise(msg, sub, ic, next) {
  state.praise = [msg, sub, ic];
  go(next);
  setTimeout(() => { state.praise = null; if (route() === next) render(); }, 5000);
}
async function render() {
  const r = route();
  // role is set only by explicit entry — 'admin' and neutral routes keep the current role
  if (r.startsWith('seller')) state.role = 'seller';
  else if (!['welcome', 'splash', 'admin'].includes(r) && !state.role) state.role = 'buyer';
  else if (!['welcome', 'splash', 'admin'].includes(r) && state.role !== 'seller') state.role = 'buyer';
  if (r === 'stores' && !state.stores.length) state.stores = (await api('/api/stores')).stores || [];
  if (r === 'stores' && !state.txns) state.txns = await api('/api/transactions');
  if (r === 'pay' && !state.txns) state.txns = await api('/api/transactions');
  if (r === 'pay' && !state.vault) state.vault = await api('/api/vault');
  if ((r === 'buyer-vault' || r === 'vault') && !state.vault) state.vault = await api('/api/vault');
  if (r === 'expenses' && !state.expenses) state.expenses = await api('/api/intelligence/expenses');
  if (r === 'seller-dash' && !state.dash) state.dash = await api('/api/seller/dashboard');
  if (r === 'seller-insights' && !state.insights) state.insights = await api('/api/seller/insights');
  if (r === 'seller-alerts' && !state.alerts) state.alerts = await api('/api/seller/alerts');
  if (r === 'seller-customers' && !state.customers) state.customers = await api('/api/seller/customers');
  if (r === 'admin' && !state.admin) state.admin = await api('/api/admin/settings');
  const views = {
    welcome, splash, 'buyer-start': buyerStart, 'buyer-verify': buyerVerify, 'buyer-vault': buyerVault, 'buyer-gold': buyerGoldAward,
    cockpit, vault: vaultView, friends, gold, expenses, instruments, pay: payOverview, 'buyer-account': account, stores, invoice, success, card,
    'seller-onboard': sellerOnboard, 'seller-kace': sellerKace, 'seller-sample': sellerSample,
    'seller-adjust': sellerAdjust, 'seller-share': sellerShare, 'seller-dash': sellerDash,
    'seller-alerts': sellerAlerts, 'seller-customers': sellerCustomers, 'seller-insights': sellerInsights,
    admin: adminView
  };
  app.innerHTML = (views[r] || welcome)();
  window.scrollTo(0, 0);
}

function endSplash() { clearInterval(state.splashTimer); go(state.role === 'seller' ? 'seller-onboard' : 'buyer-start'); }
function startSplash() {
  state.splashIdx = 0; go('splash');
  clearInterval(state.splashTimer);
  state.splashTimer = setInterval(() => {
    state.splashIdx += 1;
    if (state.splashIdx >= SPLASH[state.role === 'seller' ? 'seller' : 'buyer'].length) { endSplash(); return; }
    if (route() === 'splash') render();
  }, 2600);
}

let kaceTimer;
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-go],[data-action],[data-profile],[data-tpl],[data-stab],[data-setting],[data-perm],[data-field],[data-expand],[data-exp-period],[data-exp-view],[data-trend],[data-calc],[data-store],[data-cattpl]');
  if (!el) return;
  if (el.dataset.go) { go(el.dataset.go); return; }
  if (el.dataset.profile) { state.cardProfile = el.dataset.profile; render(); return; }
  if (el.dataset.tpl) { state.cardTemplate = el.dataset.tpl; render(); return; }
  if (el.dataset.cattpl) { state.catTpl = el.dataset.cattpl; render(); return; }
  if (el.dataset.stab) { state.sellerTab = el.dataset.stab; render(); return; }
  if (el.dataset.field) { state.cardFields[el.dataset.field] = !state.cardFields[el.dataset.field]; render(); return; }
  if (el.dataset.expand) { state.cardOpen = state.cardOpen === el.dataset.expand ? null : el.dataset.expand; render(); return; }
  if (el.dataset.expPeriod) { state.expPeriod = el.dataset.expPeriod; render(); return; }
  if (el.dataset.expView) { state.expView = el.dataset.expView; render(); return; }
  if (el.dataset.trend) { state.trendPeriod = el.dataset.trend; render(); return; }
  if (el.dataset.calc) { state.calcOn[el.dataset.calc] = !state.calcOn[el.dataset.calc]; render(); return; }
  if (el.dataset.setting) {
    const key = el.dataset.setting; const role = state.role === 'seller' ? 'seller' : 'buyer';
    const cur = !!state.admin?.[role]?.[key];
    state.admin = state.admin || {}; state.admin[role] = { ...state.admin[role], [key]: !cur };
    api('/api/admin/settings', { scope: role, settings: { [key]: !cur } });
    render(); return;
  }
  const a = el.dataset.action;
  if (!a) return;
  if (a === 'theme') { state.theme = state.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = state.theme; localStorage.setItem('kz-theme', state.theme); render(); return; }
  if (a === 'install') { toast('On mobile: browser menu → Add to Home Screen.'); return; }
  if (a === 'pick') { state.role = el.dataset.role; startSplash(); return; }
  if (a === 'splash-skip') { endSplash(); return; }
  if (a === 'perm') {
    const id = el.dataset.perm; let granted = false;
    if (id === 'perm-location') {
      try { await new Promise((res) => navigator.geolocation.getCurrentPosition(() => { granted = true; res(); }, () => res(), { timeout: 4000 })); } catch {}
      state.permLoc = granted;
    } else {
      try { granted = (await Notification.requestPermission()) === 'granted'; } catch { granted = true; }
      state.permNotify = granted;
    }
    api('/api/onboarding/permission', { role: state.role || 'buyer', id, enabled: granted });
    render();
    toast(granted ? 'Permission granted — thank you.' : 'No pressure — enable it anytime.', granted ? 'success' : '');
    return;
  }
  if (a === 'existing-user') {
    const v = (document.querySelector('#existing-mobile')?.value || '').trim();
    const ok = /^(\+|00)\d{9,15}$/.test(v.replace(/[\s-]/g, ''));
    if (!ok) { const h = document.querySelector('#mobile-hint'); if (h) h.textContent = 'Enter with country code — e.g. +971 50 123 4567'; return; }
    state.mobile = v; await api('/api/otp/send', { mobile: v });
    toast('We know this number — code sent.', 'success');
    markDone(state.buyerDone, 'buyer-start'); go('buyer-verify'); return;
  }
  if (a === 'start-tap') {
    toast('◉ Bring your phone to the K-Tag…');
    if (el.dataset.via === 'nfc' && 'NDEFReader' in window) { try { const r = new NDEFReader(); await r.scan(); r.onreading = () => proceed(); return; } catch {} }
    setTimeout(proceed, 900);
    function proceed() { markDone(state.buyerDone, 'buyer-start'); api('/api/otp/send', { mobile: state.mobile }); praise('The Brew House says hello', 'K-Tag read — this store knows you now.', 'tap', 'buyer-verify'); }
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
  if (a === 'kyc-step') {
    if (state.kycStep === 2) { try { const st = await navigator.mediaDevices.getUserMedia({ video: true }); st.getTracks().forEach((t) => t.stop()); toast('Camera verified — liveness captured.', 'success'); } catch {} }
    const step = ['emirates-id-front', 'emirates-id-back', 'live-camera', 'aml-check'][state.kycStep];
    await api('/api/account/kyc', { step });
    if (state.kycStep === 3) { markDone(state.buyerDone, 'buyer-account'); praise('Welcome to KanzPay', `Your account is ready, ${state.name.split(' ')[0]}.`, 'home', 'cockpit'); }
    else { state.kycStep += 1; render(); }
    return;
  }
  if (a === 'kyc-skip') { go('cockpit'); return; }
  if (a === 'store-open') { state.storeOpen = state.storeOpen === el.dataset.id ? null : el.dataset.id; render(); return; }
  if (a === 'navigate') { const r = await api('/api/ktag/navigate', {}); toast(`Route ready — ${r.destination?.walkMin || 4} min walk.`); return; }
  if (a === 'pay') { await api('/api/solver/preview', {}); const res = await api('/api/checkout/approve', {}); if (res.error) return toast(res.error, 'error'); toast('Approved. Gold on its way.', 'success'); go('success'); return; }
  if (a === 'stop-pay') { await api('/api/checkout/stop', {}); toast('Stopped. Nothing was paid.'); go('stores'); return; }
  if (a === 'approve-logic') { toast('Logic approved — every bill gets the best route.', 'success'); go('cockpit'); return; }
  if (a === 'calc-amt-change') return;
  if (a?.startsWith('gold-')) {
    if (a === 'gold-deliver-confirm') { toast('Delivery scheduled — charges approved. Track it in your vault.', 'success'); return; }
    toast({ 'gold-buy': 'Buy gold from AED 5 — straight to your vault.', 'gold-sell': 'Sell instantly to AED.', 'gold-gift': 'Send gold as a gift card.', 'gold-deliver': 'Delivery panel below — pick address & slot.' }[a] || 'Done.', 'success'); return;
  }
  if (a === 'friend-share') { const t = el.dataset.text || 'Join me on KanzPay'; try { await navigator.share?.({ title: 'KanzPay invite', text: t }); } catch { toast('Invite copied — share anywhere.', 'success'); } return; }
  if (a === 'friend-wa') { location.href = `https://wa.me/?text=${encodeURIComponent('Join me on KanzPay — we both earn gold ' + location.origin)}`; return; }
  if (a === 'friend-sms') { location.href = `sms:?&body=${encodeURIComponent('Join me on KanzPay ' + location.origin)}`; return; }
  if (a === 'friend-mail') { location.href = `mailto:?subject=KanzPay&body=${encodeURIComponent('Join me on KanzPay ' + location.origin)}`; return; }
  if (a === 'share-nfc' || a === 'share-qr') { await api('/api/card/create', { name: state.name, profile: state.cardProfile, template: state.cardTemplate, mobile: state.mobile }); const r = await api('/api/card/exchange', { via: a === 'share-nfc' ? 'nfc' : 'qr' }); toast(r.message || 'Card exchanged.', 'success'); return; }
  if (a === 'share-link') { try { await navigator.share?.({ title: 'My KanzPay card', text: `${state.name} · ${state.cardProfile}`, url: location.origin + '/#/card' }); } catch {} return; }
  if (a === 'start-kace') {
    markDone(state.sellerDone, 'seller-onboard'); go('seller-kace'); state.kaceProgress = 0; clearInterval(kaceTimer);
    kaceTimer = setInterval(async () => {
      state.kaceProgress = Math.min(100, state.kaceProgress + 9);
      if (route() === 'seller-kace') render();
      if (state.kaceProgress >= 100) { clearInterval(kaceTimer); markDone(state.sellerDone, 'seller-kace'); praise("K-Assistant is in", "Quietly running — you'll notice it only when it helps.", 'gear', 'seller-sample'); }
    }, 380);
    return;
  }
  if (a === 'vault-check') { markDone(state.sellerDone, 'seller-sample'); praise('It knows your bill now', 'Name, address, VAT — all verified.', 'doc', 'seller-adjust'); return; }
  if (a === 'gen-invoice') { markDone(state.sellerDone, 'seller-adjust'); await api('/api/seller/catalogue/import', { source: 'invoice' }); praise('Invoice priced fairly', 'Customer benefits applied · catalogue grew by itself.', 'chip', 'seller-share'); return; }
  if (a === 'dash-open') { markDone(state.sellerDone, 'seller-share'); praise("You're on the map", 'The Brew House is discoverable from today.', 'home', 'seller-dash'); return; }
  if (a === 'kace-share') { go('seller-share'); toast('K-Assistant — pick how the bill reaches them.'); return; }
  if (a === 'kace-stock') { toast('Marked as stock purchased — inventory & payables updated.', 'success'); return; }
  if (a?.startsWith('share-')) { toast({ 'share-ktag': "Invoice pushed to the buyer's tap.", 'share-mobile': 'Invoice link sent by SMS.', 'share-print': 'Printing with K-Assist QR.', 'share-qr2': 'Show this QR to the buyer.' }[a] || 'Shared.', 'success'); return; }
  if (a === 'cat-import') {
    const src = el.dataset.src;
    const before = state.dash?.intelligence?.catalogue?.skus || 0;
    await api('/api/seller/catalogue/import', { source: src });
    state.dash = await api('/api/seller/dashboard');
    const after = state.dash?.intelligence?.catalogue?.skus || before;
    toast(`${src === 'menu' ? 'Menu' : 'Inventory'} read — ${Math.max(after - before, 8)} SKUs added to your catalogue.`, 'success');
    render(); return;
  }
  if (a === 'grant-offer') { await api('/api/seller/offer/grant', { customerId: 'cu-sarah', points: 200, goldMg: 2 }); toast('Sent: 200 pts + 2 mg Gold to Sarah.', 'success'); return; }
  if (a === 'pl-save') {
    const v = (id) => Math.max(0, Math.round(Number(document.querySelector(id)?.value || 0) * 100));
    const r = await api('/api/seller/pl/save', { month: 'October 2026', revenueMinor: v('#pl-rev'), cogsMinor: v('#pl-cogs'), expensesMinor: v('#pl-exp') });
    state.insights = await api('/api/seller/insights');
    toast(r.status === 'SAVED' ? 'October P&L saved — dashboard updated.' : 'Saved.', 'success'); render(); return;
  }
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'calc-amt') { state.calcAmount = Math.max(100, Math.round(Number(e.target.value || 0) * 100)); render(); }
  if (e.target.id?.startsWith('cf-')) { state.customFields[e.target.id.slice(3)] = e.target.value; const cf = document.querySelector('.card-face'); }
});

window.addEventListener('hashchange', render);
const urlQ = new URLSearchParams(location.search);
const urlTheme = urlQ.get('theme');
if (urlTheme === 'light' || urlTheme === 'dark') { state.theme = urlTheme; document.documentElement.dataset.theme = urlTheme; }
const urlRole = urlQ.get('role');
if (urlRole === 'buyer' || urlRole === 'seller') { state.role = urlRole; startSplash(); }
const urlPath = location.pathname.replace(/\/+$/, '');
if (urlPath === '/buyer' || urlPath === '/seller') { state.role = urlPath.slice(1); startSplash(); }
if (!location.hash) location.hash = '#/welcome';
render();
