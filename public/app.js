// KanzPay PWA — journey flows per spec: buyer & seller, NFC/QR transport, gold glass UI
const app = document.querySelector('#app');
const toastEl = document.querySelector('#toast');

const state = {
  role: null, theme: document.documentElement.dataset.theme || 'dark',
  name: 'Navneet Sharma', mobile: '+971 50 123 4567', email: '',
  account: null, invoice: null, bestValue: null,
  stores: [], vault: null, expenses: null,
  dash: null, alerts: null, customers: null, imported: null,
  cardProfile: 'Professional', cardTemplate: 'aurum',
  kycStep: 0, kaceProgress: 0, sellerTab: 'focus'
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

/* ---------- chrome ---------- */
const logoImg = () => `<img class="logo" src="${state.theme === 'dark' ? '/assets/kanzpay-logo-dark.png' : '/assets/kanzpay-logo.png'}" alt="KanzPay" style="height:30px" />`;
const topbar = (o = {}) => `<header class="topbar">${o.back ? `<button class="icon-btn" data-go="${o.back}" aria-label="Back">←</button>` : logoImg()}<span class="grow"></span>${o.bell ? `<button class="icon-btn" data-go="${state.role === 'seller' ? 'seller-dash' : 'cockpit'}" aria-label="Hub">◈</button>` : ''}<button class="icon-btn" data-action="theme" aria-label="Theme">${state.theme === 'dark' ? '☀' : '☾'}</button></header>`;
const BUYER_TABS = [['cockpit', '⌂', 'Cockpit'], ['vault', '◆', 'Vault'], ['buyer-start', '◉', 'Pay'], ['card', '▣', 'Card'], ['stores', '✦', 'Stores']];
const SELLER_TABS = [['seller-dash', '⌂', 'Today'], ['seller-share', '▤', 'Invoice'], ['seller-alerts', '◈', 'Alerts'], ['seller-customers', '☺', 'People'], ['seller-insights', '↗', 'Intel']];
const tabbar = () => `<div class="tabbar"><nav>${(state.role === 'seller' ? SELLER_TABS : BUYER_TABS).map(([r, i, l]) => `<button class="${route() === r ? 'on' : ''}" data-go="${r}"><span class="tico">${i}</span>${l}</button>`).join('')}</nav></div>`;
const screen = (inner, nav = true) => `<div class="screen${nav ? '' : ' no-nav'}">${inner}</div>${nav ? tabbar() : ''}`;

/* ---------- welcome ---------- */
function welcome() {
  const dark = state.theme === 'dark';
  return `<div class="screen no-nav">
    <div style="position:absolute;inset:0;background:url('/assets/scene-skyline.png') center/cover;opacity:${dark ? '.8' : '.35'}"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(0deg,var(--bg) 8%,transparent 55%)"></div>
    <div class="body" style="position:relative;z-index:1;justify-content:flex-end;padding-top:60px">
      <img src="/assets/kanzpay-mark-dark.png" style="width:76px;align-self:center" class="floaty" alt="" />
      <div class="glass" style="padding:24px;text-align:center">
        <img src="${dark ? '/assets/kanzpay-logo-dark.png' : '/assets/kanzpay-logo.png'}" style="height:44px" alt="KanzPay" />
        <h1 class="hero" style="margin:16px 0 8px">Everyday life<br/>rewards you.</h1>
        <p class="muted">Pay · Earn Gold · Save More · Discover · Live Better</p>
        <div style="display:grid;gap:10px;margin-top:20px">
          <button class="cta-gold" data-go-role="buyer"><span>I'm a Buyer</span><span class="arr">→</span></button>
          <button class="cta-pill" data-go-role="seller" style="justify-content:center">I'm a Seller →</button>
          <button class="cta-ghost" data-action="install">⤓ Get the app — tap, NFC & more</button>
        </div>
      </div>
      <p class="tiny" style="text-align:center">Sandbox preview · no real money moves</p>
    </div>
  </div>`;
}

/* ---------- buyer journey: tap → otp → gold → vault → cockpit ---------- */
function buyerStart() {
  return screen(`${topbar({ back: 'welcome' })}
    <div class="body">
      <div><span class="eyebrow">STEP 1 · START</span><h1 class="hero">Tap or scan to<br/>start your journey</h1></div>
      <div class="card-hero" style="background-image:url('/assets/scene-tap-nfc.png');min-height:220px">
        <div class="nfc-ring"><div class="nfc-tag"><img src="/assets/kanzpay-mark.png" alt="" /></div></div>
      </div>
      <div style="display:grid;gap:9px">
        <button class="cta-gold" data-action="start-nfc"><span>Tap the K-Tag</span><span class="arr">◉</span></button>
        <button class="cta-pill" data-action="start-qr" style="justify-content:center">⌗ Scan QR instead</button>
      </div>
      <div class="glass" style="padding:16px">
        <p class="tiny">EXISTING USER?</p>
        <div class="field" style="margin-top:8px"><input id="existing-mobile" inputmode="tel" placeholder="Mobile number" /></div>
        <button class="cta-outline" style="margin-top:10px" data-action="existing-user">Continue with mobile →</button>
      </div>
      <p class="tiny" style="text-align:center">Invoice shared with you? It opens right into your vault.</p>
    </div>`, false);
}

function buyerOtp() {
  return screen(`${topbar({ back: 'buyer-start' })}
    <div class="body">
      <div><span class="eyebrow">STEP 2 · VERIFY</span><h1 class="hero">Two small codes.</h1><p class="muted">We sent one to your mobile, one to your email.</p></div>
      <div class="glass" style="padding:20px">
        <div class="field"><span>Mobile</span><input id="otp-mobile" inputmode="tel" value="${esc(state.mobile)}" /></div>
        <div class="field" style="margin-top:10px"><span>Email</span><input id="otp-email" inputmode="email" value="${esc(state.email || 'navneet@oxy.tech')}" /></div>
        <p class="tiny" style="margin:14px 0 8px">MOBILE OTP — sandbox code 4271</p>
        <div class="otp-boxes"><b>4</b><b>2</b><b>7</b><b>1</b></div>
        <p class="tiny" style="margin:14px 0 8px">EMAIL OTP — sandbox code 9038</p>
        <div class="otp-boxes"><b>9</b><b>0</b><b>3</b><b>8</b></div>
      </div>
      <button class="cta-gold" data-action="verify-otp"><span>Verify both</span><span class="arr">→</span></button>
    </div>`, false);
}

function buyerGold() {
  return screen(`${topbar()}
    <div class="body" style="text-align:center">
      <div class="card-hero" style="background-image:url('/assets/scene-gold-reward.png');min-height:230px;justify-content:center">
        <div class="gold-coin-hero"><div><b>1</b><small>MG GOLD</small></div></div>
      </div>
      <div><h1 class="hero">Congratulations!</h1><p class="muted">1 mg Gold cashback is on its way.<br/>Earn more. Save more.</p></div>
      <div class="glass" style="padding:16px;text-align:left">
        <b style="font-size:13.5px">Next: build your Value Vault</b>
        <p class="tiny" style="margin-top:6px">Memberships · reward points · promocodes · vouchers — gathered in one place, approved by you.</p>
      </div>
      <button class="cta-gold" data-action="build-vault"><span>Build my Value Vault</span><span class="arr">→</span></button>
      <button class="cta-ghost" data-go="account">Create my account</button>
    </div>`, false);
}

function cockpit() {
  const mods = [
    ['vault', '◆', 'My Value Vault', 'Memberships · points · codes', ''],
    ['card', '▣', 'My Visiting Card', 'Profiles · templates · share', ''],
    ['friends', '☺', 'Earn with friends', 'Send · receive · repeat', ''],
    ['gold', 'Au', 'My Gold Vault', 'Weight · buy · gift · redeem', ''],
    ['expenses', '▦', 'My Expenses', 'Category charts · patterns', ''],
    ['instruments', '◇', 'Payment Intelligence', 'Best instrument per bill', '••']
  ];
  return screen(`${topbar({ bell: true })}
    <div class="body">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="avatar">${esc(state.name[0])}</div>
        <div><p class="tiny">YOUR COCKPIT</p><h2 class="sect">${esc(state.name)}</h2></div>
        <span class="grow"></span><span class="chip">1 mg Gold</span>
      </div>
      <div class="grid2">
        ${mods.map(([r, i, t, d, tag]) => `<button class="card-tile" style="min-height:120px" data-go="${r}"><span class="glyph" style="font-weight:${i === 'Au' ? '900' : '400'}">${i}</span><b>${t}</b><small>${d}</small>${tag ? `<span class="chip">${tag}</span>` : ''}</button>`).join('')}
      </div>
      <div class="share-banner" style="display:flex;align-items:center;gap:12px">
        <div style="flex:1"><b>All set to earn more</b><p style="font-size:11px;opacity:.85;margin-top:4px">Value + wealth building, together.</p></div>
        <button class="cta-mini" data-go="stores" style="background:rgba(255,255,255,.9);color:#5c3b0c">Find stores →</button>
      </div>
    </div>`);
}

function vault() {
  const sections = state.vault?.sections || [];
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">MY VALUE VAULT</span><h1 class="hero">Your value,<br/>kept.</h1><p class="muted">Take permission for email, SMS & apps — we collect the benefit signals you approve.</p></div>
      <div class="vault-door">
        ${sections.map((s) => `<div class="vault-row ${s.status === 'grey' ? 'grey' : ''}">
          <span class="vault-icon">${s.icon}</span>
          <div><b style="font-size:13px">${esc(s.label)}</b><small class="tiny" style="display:block">${s.items.length ? esc(s.items[0].value) : 'Not connected'}</small></div>
          ${s.status === 'connected' ? '<span class="chip">✓</span>' : s.status === 'grey' ? '<span class="tiny">grey lane</span>' : `<button class="cta-mini" data-action="vault-connect" data-id="${s.id}">Connect</button>`}
        </div>`).join('')}
        <p class="tiny" style="margin-top:12px">Connected values save with history, validity & encrypted credentials. Grey lanes show what you're missing.</p>
      </div>
      <div class="glass" style="padding:16px">
        <div class="check-row"><span class="tick">✓</span><span style="flex:1">QR codes stored in vault</span></div>
        <div class="check-row" style="margin-top:7px"><span class="tick">✓</span><span style="flex:1">Redirection links open the source app</span></div>
      </div>
    </div>`);
}

function friends() {
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">EARN WITH FRIENDS</span><h1 class="hero">Value shared<br/>is value doubled.</h1></div>
      <div class="share-banner"><b style="font-size:16px">Invite a friend → both earn Gold</b><p style="font-size:11.5px;opacity:.85;margin-top:6px">When they tap their first K-Tag, you each receive 1 mg.</p></div>
      <div class="card-hero" style="background-image:url('/assets/scene-card-exchange.png');min-height:150px">
        <div><b style="color:#fff">Share a link, tap phones, or send a QR</b></div>
      </div>
      <div class="glass" style="padding:16px">
        <div class="field"><span>Friend's mobile</span><input id="friend-mobile" inputmode="tel" placeholder="+971…" /></div>
        <div class="grid3" style="margin-top:10px">
          <button class="cta-pill" data-action="friend-wa" style="justify-content:center">WhatsApp</button>
          <button class="cta-pill" data-action="friend-sms" style="justify-content:center">SMS</button>
          <button class="cta-pill" data-action="friend-mail" style="justify-content:center">Email</button>
        </div>
      </div>
      <button class="cta-gold" data-action="friend-send"><span>Send invite</span><span class="arr">→</span></button>
    </div>`);
}

function gold() {
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">MY GOLD VAULT</span><h1 class="hero">Wealth in<br/>milligrams.</h1></div>
      <div class="vault-door" style="text-align:center;padding-top:24px">
        <div class="gold-coin-hero"><div><b>13.5</b><small>MG GOLD</small></div></div>
        <b style="display:block;font-size:16px">≈ AED 9.45 today</b>
        <p class="tiny" style="margin-top:4px">Weight locked at purchase value · ±0.5 g precision</p>
      </div>
      <div class="grid2">
        <button class="card-tile" data-action="gold-buy"><span class="glyph">＋</span><b>Buy gold</b><small>from AED 5</small></button>
        <button class="card-tile" data-action="gold-sell"><span class="glyph">−</span><b>Sell gold</b><small>instant AED</small></button>
        <button class="card-tile" data-action="gold-gift"><span class="glyph">♡</span><b>Gift card</b><small>send as gold</small></button>
        <button class="card-tile" data-action="gold-pay"><span class="glyph">◉</span><b>Pay with gold</b><small>at any K-Tag</small></button>
      </div>
      <p class="tiny" style="text-align:center">Redeem · deliver physical gold · spend at stores.</p>
    </div>`);
}

function expenses() {
  const ex = state.expenses;
  const cats = ex?.categories || [];
  const colors = ['#e8c56a', '#caa14f', '#a97a2e', '#8a6420', '#f3d98b'];
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">MY EXPENSES</span><h1 class="hero">Where it<br/>goes.</h1></div>
      <div class="seg"><button class="on">Monthly</button><button>Weekly</button><button>Yearly</button></div>
      <div class="glass" style="padding:18px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px"><p class="tiny">SPEND TREND</p><b class="gold-text">${money0(ex?.totalMinor || 0)}</b></div>
        <div class="bar-chart">${(ex?.trend || []).map((v) => `<i style="height:${v}%"></i>`).join('')}</div>
      </div>
      ${cats.map((c, i) => `<div class="card-list"><div class="bubble" style="background:${colors[i % colors.length]};color:#3a2a08">${c.icon}</div><div class="main"><b>${esc(c.label)}</b><small>${c.pct}% of month</small></div><span class="end">${money0(c.minor)}</span></div>`).join('')}
      <div class="vault-door"><b style="font-size:13px">◆ Lifestyle intelligence</b><p class="muted" style="margin-top:8px">${esc(ex?.lifestyle?.note || '')}</p><p class="tiny" style="margin-top:6px">${esc(ex?.lifestyle?.insight || '')}</p></div>
    </div>`);
}

function instruments() {
  const steps = [['Membership price', 'applied at bill'], ['Promocode KANZ10', '10% held in vault'], ['Reward points', '2,480 available'], ['Gold redeem', '13.5 mg in vault'], ['Instrument choice', 'Aani · Jaywan · card offers']];
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">PAYMENT INTELLIGENCE</span><h1 class="hero">The best way<br/>to pay, per bill.</h1><p class="muted">We evaluate every instrument's offers & benefits — you approve the logic once.</p></div>
      ${steps.map(([t, d], i) => `<div class="instr-chip"><span class="step-num ${i < 3 ? 'done' : ''}">${i + 1}</span><div style="flex:1"><b style="font-size:13px">${t}</b><small class="tiny" style="display:block">${d}</small></div></div>`).join('')}
      <div class="glass" style="padding:16px">
        <b style="font-size:13px">Recommendation logic</b>
        <p class="tiny" style="margin-top:6px">Memberships → vouchers → points → gold → cheapest safe rail. Never overdraws your floor.</p>
        <button class="cta-gold" style="margin-top:12px" data-action="approve-logic"><span>Approve my logic</span><span class="arr">✓</span></button>
      </div>
      <p class="tiny" style="text-align:center">Value + wealth building status · all set to earn more</p>
    </div>`);
}

const KYC = [
  ['Upload Emirates ID — front', 'Crop & match your photo automatically', '⬆ Upload front'],
  ['Upload Emirates ID — back', 'We verify the card details', '⬆ Upload back'],
  ['Live camera check', 'Blink · look left · look right · hold ID beside your face', '◉ Start camera'],
  ['Security check', 'AML screening — usually seconds', '✓ Finish']
];
function account() {
  const i = Math.min(state.kycStep, 3);
  const [title, desc, cta] = KYC[i];
  return screen(`${topbar({ back: 'buyer-gold' })}
    <div class="body">
      <div><span class="eyebrow">STEP 4 · CREATE ACCOUNT</span><h1 class="hero">${title}</h1><p class="muted">${desc}</p></div>
      <div class="dots" style="justify-content:center">${KYC.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>
      ${i === 2
        ? `<div class="vault-door" style="text-align:center;padding:26px"><div class="kace-orb"><span style="font-size:40px">◉</span></div><p class="tiny" style="margin-top:14px">Blink naturally · look left · look right · hold your Emirates ID beside your face</p></div>`
        : `<div class="id-frame"><div><span style="font-size:30px">⬆</span><p class="muted" style="margin-top:8px">Document auto-crop & edit</p><p class="tiny">Photo is matched to your document</p></div></div>`}
      <button class="cta-gold" data-action="kyc-step"><span>${cta}</span><span class="arr">→</span></button>
      <button class="cta-ghost" data-action="kyc-skip">Do this later — explore as guest</button>
    </div>`, false);
}

function stores() {
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">NAVIGATION · DUBAI MARINA</span><h1 class="hero">Stores near you</h1><p class="muted">Sorted by your interests & patterns — not by ads.</p></div>
      ${state.stores.map((s) => `<button class="store-card" data-action="store-pick" data-id="${s.id}" style="text-align:left;color:var(--ink);cursor:pointer;width:100%">
        <span class="thumb" style="background-image:url('${s.image}')"></span>
        <span><b style="font-size:13.5px">${esc(s.name)}</b><small class="tiny" style="display:block;margin:3px 0">${esc(s.kind)} · ${s.distanceM}m · ★${s.rating} ${s.live ? '· <span style="color:var(--gold-3)">live catalogue</span>' : ''}</small>
        <span style="display:flex;gap:4px;flex-wrap:wrap">${s.offers.map((o) => `<span class="chip" style="font-size:8.5px;padding:3px 8px">${o}</span>`).join('')}</span></span>
        <span class="end">→</span>
      </button>`).join('')}
      <div class="glass" style="padding:14px;display:flex;gap:10px;align-items:center"><span class="pulse-dot"></span><p class="tiny" style="flex:1">Seller location opens in maps when you tap a K-Tag too.</p><button class="cta-mini" data-action="navigate">Navigate</button></div>
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
      <div><span class="eyebrow">INVOICE · PRINT-SHARED VIA K-ASSIST</span><h1 class="hero">Review before<br/>you pay.</h1></div>
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
      <div class="card-hero" style="background-image:url('/assets/scene-gold-reward.png');min-height:220px;justify-content:center"><h1 class="hero" style="color:#fff">Paid.<br/>Value kept.</h1></div>
      <div class="glass" style="padding:18px">
        <div style="display:flex;justify-content:space-around"><div><b class="gold-text" style="font-size:20px">+2 mg</b><p class="tiny">Gold earned</p></div><div><b class="gold-text" style="font-size:20px">+120</b><p class="tiny">points</p></div><div><b class="gold-text" style="font-size:20px">Food</b><p class="tiny">expense filed</p></div></div>
      </div>
      <button class="cta-gold" data-go="cockpit"><span>Back to cockpit</span><span class="arr">→</span></button>
      <button class="cta-pill" data-go="card" style="justify-content:center">▣ Share my visiting card</button>
    </div>`, false);
}

/* ---------- visiting card ---------- */
const PROFILES = ['Professional', 'Family', 'Friends', 'Colleagues', 'Neighbour', 'Custom'];
function card() {
  const tpl = state.cardTemplate;
  return screen(`${topbar({ back: 'cockpit' })}
    <div class="body">
      <div><span class="eyebrow">MY VISITING CARD</span><h1 class="hero">One sheet.<br/>Every profile.</h1></div>
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
        <button class="cta-pill" data-action="share-nfc" style="justify-content:center">◉ Share via Tap</button>
        <button class="cta-pill" data-action="share-qr" style="justify-content:center">⌗ Share QR</button>
      </div>
      <button class="cta-ghost" data-action="share-link">⤴ Share link · they save your contact</button>
    </div>`);
}

/* ---------- seller journey ---------- */
function sellerOnboard() {
  const steps = [['Install K-Assistant', 'runs in the background'], ['Business basics', 'type · location · logo · pics'], ['Install K-Tag', 'your tap point'], ['Identify system', 'Mac · Windows · Linux · Android'], ['Drivers & patch', 'aligned automatically'], ['Floating K-Assistant', 'KanzPay logo on your screen']];
  return screen(`${topbar({ back: 'welcome' })}
    <div class="body">
      <div class="card-hero" style="background-image:url('/assets/scene-seller-hero.png');min-height:170px">
        <div><span class="eyebrow" style="color:#f3d98b">SELLER ONBOARDING</span><h2 class="sect" style="color:#fff;margin-top:6px">Open your store.</h2></div>
      </div>
      <div class="glass" style="padding:18px">
        <div class="field"><span>Business name</span><input id="biz" value="The Brew House" /></div>
        <div class="grid2" style="margin-top:10px"><div class="field"><span>Type</span><input value="Café · Restaurant" /></div><div class="field"><span>Location</span><input value="Dubai Marina" /></div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">${steps.map(([t, d], i) => `<div class="card-list"><span class="step-num ${i < 2 ? 'done' : ''}">${i + 1}</span><div class="main"><b>${t}</b><small>${d}</small></div>${i < 2 ? '<span class="end">✓</span>' : ''}</div>`).join('')}</div>
      <button class="cta-gold" data-action="start-kace"><span>Install K-Assistant</span><span class="arr">→</span></button>
    </div>`, false);
}

function sellerKace() {
  const p = state.kaceProgress;
  const tasks = [['System identified — Mac', 20], ['Drivers aligned', 45], ['K-Tag registered', 70], ['Floating assistant live', 90]];
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">K-ASSISTANT INSTALLING</span><h1 class="hero">Setting up<br/>quietly.</h1></div>
      <div class="vault-door" style="text-align:center;padding:26px">
        <div class="kace-orb"><img src="/assets/kanzpay-mark.png" style="width:56px" alt=""/></div>
        <p class="eyebrow" style="margin-top:14px">${p}%</p>
        <div class="progress" style="margin-top:10px"><i style="width:${p}%"></i></div>
      </div>
      ${tasks.map(([t, at]) => `<div class="check-row">${p >= at ? '<span class="tick">✓</span>' : '<span class="pulse-dot"></span>'}<span style="flex:1">${t}</span></div>`).join('')}
      <p class="tiny" style="text-align:center">Runs in the background — keep using your system.</p>
    </div>`, false);
}

function sellerSample() {
  return screen(`${topbar({ back: 'seller-onboard' })}
    <div class="body">
      <div><span class="eyebrow">SAMPLE INVOICE CHECK</span><h1 class="hero">Teach it<br/>your bill.</h1><p class="muted">Share one invoice — K-Assistant reads your shop details.</p></div>
      <div class="vault-door">
        ${[['Shop name', 'The Brew House', true], ['Address', 'Marina Walk, Dubai', true], ['VAT No.', '1003 4488 2100 03', true], ['Mobile', '+971 4 555 0123', false]].map(([l, v, ok]) => `<div class="check-row" style="margin-bottom:7px">${ok ? '<span class="tick">✓</span>' : '<span class="step-num">!</span>'}<span style="flex:1"><b style="font-size:12.5px">${l}</b> · <span class="tiny">${v}</span></span>${ok ? '' : '<button class="cta-mini">Fix</button>'}</div>`).join('')}
      </div>
      <div class="glass" style="padding:16px">
        <p class="tiny" style="margin-bottom:8px">REWARD RULES — SET ONCE</p>
        <div class="check-row"><span class="tick">✓</span><span style="flex:1">AED 200 spent = 100 points</span></div>
        <div class="check-row" style="margin-top:7px"><span class="tick">✓</span><span style="flex:1">Points = discount AED · free-product milestones</span></div>
        <div class="check-row" style="margin-top:7px"><span class="tick">✓</span><span style="flex:1">AED 1,000 slab = 5 mg Gold</span></div>
      </div>
      <button class="cta-gold" data-action="vault-check"><span>Looks right — continue</span><span class="arr">→</span></button>
    </div>`, false);
}

function sellerAdjust() {
  const rows = [['Membership discount', '20%', true], ['Voucher / promo value', '10%', true], ['Coupons value', 'AED 15', true], ['Reward points value', '100 pts = AED 5', true], ['Free gift', 'on AED 50+', false]];
  return screen(`${topbar({ back: 'seller-sample' })}
    <div class="body">
      <div><span class="eyebrow">K-ASSISTANT · VALUE VAULT CHECK</span><h1 class="hero">What buyers<br/>can apply.</h1><p class="muted">Buyer shared their vault — you approve which benefits apply.</p></div>
      ${rows.map(([t, v, on]) => `<div class="instr-chip"><div style="flex:1"><b style="font-size:13px">${t}</b></div><b class="gold-text">${v}</b><button class="chip" style="cursor:pointer">${on ? 'On' : 'Add'}</button></div>`).join('')}
      <button class="cta-gold" data-action="gen-invoice"><span>Generate invoice</span><span class="arr">→</span></button>
    </div>`, false);
}

function sellerShare() {
  return screen(`${topbar({ back: 'seller-adjust' })}
    <div class="body">
      <div><span class="eyebrow">SHARE THE INVOICE</span><h1 class="hero">Send before<br/>you print.</h1></div>
      <div class="vault-door">
        <div style="display:flex;justify-content:space-between"><b>Invoice #1048</b><b class="gold-text">${money(6600)}</b></div>
        <p class="tiny" style="margin-top:8px">Priced with buyer-approved signals · membership −AED 6 · voucher −AED 3</p>
      </div>
      <div class="grid2">
        <button class="card-tile" data-action="share-ktag" style="min-height:110px"><span class="glyph">◉</span><b>Push via K-Tag</b><small>buyer taps to receive</small></button>
        <button class="card-tile" data-action="share-mobile" style="min-height:110px"><span class="glyph">✆</span><b>To mobile number</b><small>sms / whatsapp link</small></button>
        <button class="card-tile" data-action="share-print" style="min-height:110px"><span class="glyph">▤</span><b>Print (K-Assist)</b><small>QR on the receipt</small></button>
        <button class="card-tile" data-action="share-qr2" style="min-height:110px"><span class="glyph">⌗</span><b>Show QR</b><small>buyer scans you</small></button>
      </div>
      <button class="cta-gold" data-go="seller-dash"><span>Open dashboard</span><span class="arr">→</span></button>
    </div>`);
}

function sellerDash() {
  const f = state.dash?.focus;
  const intel = state.dash?.intelligence;
  const focus = state.sellerTab === 'focus';
  return screen(`${topbar({ bell: true })}
    <div class="body">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div><span class="eyebrow">K-ASSISTANT · THE BREW HOUSE</span><h1 class="hero" style="font-size:26px">Today's picture</h1></div>
        <div class="seg"><button class="${focus ? 'on' : ''}" data-stab="focus">Focus</button><button class="${focus ? '' : 'on'}" data-stab="intel">Intelligence</button></div>
      </div>
      ${focus ? `
        <div class="grid3">
          <div class="card-metric"><small>Pending commission</small><strong>${money0(f?.commission?.pendingMinor || 0)}</strong></div>
          <div class="card-metric"><small>Paid history</small><strong>${money0(f?.commission?.paidMinor || 0)}</strong></div>
          <div class="card-metric"><small>Repeat cust.</small><strong>${f?.rewards?.repeatPct || 0}%</strong></div>
        </div>
        <div class="vault-door"><p class="tiny" style="margin-bottom:10px">TICKETS</p>${(f?.tickets || []).map((t) => `<div class="card-list" style="margin-bottom:7px"><div class="bubble" style="font-size:12px">${t.kind[0]}</div><div class="main"><b>${esc(t.kind)}</b><small>${esc(t.text)}</small></div><span class="chip">${t.status}</span></div>`).join('')}</div>
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
  const sect = (title, list) => list?.length ? `<div><p class="eyebrow" style="margin-bottom:8px">${title}</p>${list.map((a) => `<div class="card-list" style="margin-bottom:8px"><div class="bubble" style="background:${a.severity === 'warn' ? 'linear-gradient(135deg,#e8b356,#a96a2e)' : 'var(--gold-grad)'};color:#3a2a08;font-size:14px">${a.severity === 'warn' ? '!' : '✓'}</div><div class="main"><b>${esc(a.title)}</b><small>${esc(a.detail)}</small></div><button class="cta-mini">${esc(a.action)}</button></div>`).join('')}</div>` : '';
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">ALERTS</span><h1 class="hero">Needs your eye.</h1></div>
      ${sect('▦ Inventory', g.inventory)}
      ${sect('◈ Payables & receivables', g.payments)}
      ${sect('↗ Business', g.business)}
    </div>`);
}

function sellerCustomers() {
  const cs = state.customers?.customers || [];
  const rw = state.customers?.rewards || {};
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">CUSTOMERS</span><h1 class="hero">People who return.</h1></div>
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
      <div><span class="eyebrow">INTELLIGENCE · P&L</span><h1 class="hero">The month's<br/>truth.</h1></div>
      <div class="vault-door">
        ${[['Revenue', pl.revenueMinor], ['Cost of goods', -(pl.cogsMinor || 0)], ['Gross profit', pl.grossMinor], ['Expenses', -(pl.expensesMinor || 0)], ['Net profit', pl.netMinor]].map(([l, v], i) => `<div class="donut-row" style="margin-bottom:8px;${i === 4 ? 'background:var(--chip);border-radius:10px;padding:8px 10px' : ''}"><span style="flex:1">${l}</span><b class="${i === 4 ? 'gold-text' : ''}">${money0(v)}</b></div>`).join('')}
      </div>
      <div class="glass" style="padding:16px"><p class="tiny" style="margin-bottom:10px">SALES TREND · VALUE & VOLUME</p><div class="bar-chart">${(ins?.trend || []).map((v) => `<i style="height:${v}%"></i>`).join('')}</div></div>
      <div class="vault-door"><p class="tiny" style="margin-bottom:8px">EXPENSE HEADS</p>${(ins?.expenseHeads || []).map((h, i) => `<div class="donut-row" style="margin-bottom:7px"><i style="background:${['#e8c56a', '#caa14f', '#a97a2e', '#8a6420'][i]}"></i><span style="flex:1">${esc(h.head)}</span><b>${money0(h.minor)}</b></div>`).join('')}</div>
    </div>`);
}

/* ---------- router ---------- */
const route = () => (location.hash || '#/welcome').slice(2) || 'welcome';
async function render() {
  const r = route();
  if (r.startsWith('seller')) state.role = 'seller';
  else if (r !== 'welcome') state.role = 'buyer';
  if (r === 'stores' && !state.stores.length) state.stores = (await api('/api/stores')).stores || [];
  if (r === 'vault' && !state.vault) state.vault = await api('/api/vault');
  if (r === 'expenses' && !state.expenses) state.expenses = await api('/api/intelligence/expenses');
  if (r === 'seller-dash' && !state.dash) state.dash = await api('/api/seller/dashboard');
  if (r === 'seller-insights' && !state.insights) state.insights = await api('/api/seller/insights');
  if (r === 'seller-alerts' && !state.alerts) state.alerts = await api('/api/seller/alerts');
  if (r === 'seller-customers' && !state.customers) state.customers = await api('/api/seller/customers');
  const views = {
    welcome, 'buyer-start': buyerStart, 'buyer-otp': buyerOtp, 'buyer-gold': buyerGold,
    cockpit, vault, friends, gold, expenses, instruments, account, stores, invoice, success, card,
    'seller-onboard': sellerOnboard, 'seller-kace': sellerKace, 'seller-sample': sellerSample,
    'seller-adjust': sellerAdjust, 'seller-share': sellerShare, 'seller-dash': sellerDash,
    'seller-alerts': sellerAlerts, 'seller-customers': sellerCustomers, 'seller-insights': sellerInsights
  };
  app.innerHTML = (views[r] || welcome)();
  window.scrollTo(0, 0);
}

let kaceTimer;
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-go],[data-action],[data-go-role],[data-profile],[data-tpl],[data-stab]');
  if (!el) return;
  if (el.dataset.go) { go(el.dataset.go); return; }
  if (el.dataset.goRole) { state.role = el.dataset.goRole; go(state.role === 'seller' ? 'seller-onboard' : 'buyer-start'); return; }
  if (el.dataset.profile) { state.cardProfile = el.dataset.profile; render(); return; }
  if (el.dataset.tpl) { state.cardTemplate = el.dataset.tpl; render(); return; }
  if (el.dataset.stab) { state.sellerTab = el.dataset.stab; render(); return; }
  const a = el.dataset.action;
  if (a === 'theme') { state.theme = state.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = state.theme; localStorage.setItem('kz-theme', state.theme); render(); return; }
  if (a === 'install') { toast('On mobile: browser menu → Add to Home Screen.'); return; }
  if (a === 'start-nfc') { toast('◉ Bring your phone to the K-Tag…'); if ('NDEFReader' in window) { try { const r = new NDEFReader(); await r.scan(); r.onreading = () => go('buyer-otp'); return; } catch {} } setTimeout(() => go('buyer-otp'), 900); return; }
  if (a === 'start-qr') { toast('⌗ Point camera at the QR'); setTimeout(() => go('buyer-otp'), 900); return; }
  if (a === 'existing-user') { state.mobile = document.querySelector('#existing-mobile')?.value || state.mobile; await api('/api/otp/send', { mobile: state.mobile }); go('buyer-otp'); return; }
  if (a === 'verify-otp') {
    state.mobile = document.querySelector('#otp-mobile')?.value || state.mobile;
    state.email = document.querySelector('#otp-email')?.value || state.email;
    const r = await api('/api/otp/verify', { mobile: state.mobile, email: state.email });
    if (r.error) return toast(r.error, 'error');
    go('buyer-gold'); return;
  }
  if (a === 'build-vault') { go('vault'); return; }
  if (a === 'vault-connect') { await api('/api/vault/connect', { id: el.dataset.id }); state.vault = await api('/api/vault'); toast('Connected — value found.', 'success'); render(); return; }
  if (a === 'kyc-step') { const step = ['emirates-id-front', 'emirates-id-back', 'live-camera', 'aml-check'][state.kycStep]; const r = await api('/api/account/kyc', { step }); if (state.kycStep === 3) { toast('Account created. Welcome to KanzPay.', 'success'); go('cockpit'); } else { state.kycStep += 1; render(); } return; }
  if (a === 'kyc-skip') { go('cockpit'); return; }
  if (a === 'store-pick') { toast('Opening live catalogue…'); doTap('store'); return; }
  if (a === 'navigate') { const r = await api('/api/ktag/navigate', {}); toast(`Route ready — ${r.destination?.walkMin || 4} min walk.`); return; }
  if (a === 'pay') { await api('/api/solver/preview'); const res = await api('/api/checkout/approve'); if (res.error) return toast(res.error, 'error'); toast('Approved. Gold on its way.', 'success'); go('success'); return; }
  if (a === 'stop-pay') { await api('/api/checkout/stop'); toast('Stopped. Nothing was paid.'); go('stores'); return; }
  if (a === 'approve-logic') { toast('Logic approved — every bill gets the best route.', 'success'); go('cockpit'); return; }
  if (a?.startsWith('gold-')) { toast({ 'gold-buy': 'Buy gold from AED 5 — coming to your vault.', 'gold-sell': 'Sell instantly to AED.', 'gold-gift': 'Send gold as a gift card.', 'gold-pay': 'Pay any K-Tag with gold.' }[a], 'success'); return; }
  if (a === 'friend-send' || a === 'friend-wa' || a === 'friend-sms' || a === 'friend-mail') { toast('Invite sent — you both earn 1 mg Gold on their first tap.', 'success'); return; }
  if (a === 'share-nfc' || a === 'share-qr') { await api('/api/card/create', { name: state.name, profile: state.cardProfile, template: state.cardTemplate, mobile: state.mobile }); const r = await api('/api/card/exchange', { via: a === 'share-nfc' ? 'nfc' : 'qr' }); toast(r.message || 'Card exchanged.', 'success'); return; }
  if (a === 'share-link') { try { await navigator.share?.({ title: 'My KanzPay card', text: `${state.name} · ${state.cardProfile}`, url: location.origin + '/#/card' }); } catch {} toast('Link ready to share.'); return; }
  if (a === 'start-kace') {
    go('seller-kace'); state.kaceProgress = 0; clearInterval(kaceTimer);
    kaceTimer = setInterval(async () => {
      state.kaceProgress = Math.min(100, state.kaceProgress + 9);
      if (route() === 'seller-kace') render();
      if (state.kaceProgress >= 100) { clearInterval(kaceTimer); toast('K-Assistant installed.', 'success'); go('seller-sample'); }
    }, 380);
    return;
  }
  if (a === 'vault-check') { go('seller-adjust'); return; }
  if (a === 'gen-invoice') { state.imported = await api('/api/seller/catalogue/import', { source: 'invoice' }); toast('Invoice generated & catalogue updated.', 'success'); go('seller-share'); return; }
  if (a?.startsWith('share-')) { toast({ 'share-ktag': 'Invoice pushed to the buyer\'s tap.', 'share-mobile': 'Invoice link sent by SMS.', 'share-print': 'Printing with K-Assist QR.', 'share-qr2': 'Show this QR to the buyer.' }[a] || 'Shared.', 'success'); return; }
  if (a === 'grant-offer') { await api('/api/seller/offer/grant', { customerId: 'cu-sarah', points: 200, goldMg: 2 }); toast('Sent: 200 pts + 2 mg Gold to Sarah.', 'success'); return; }
});

window.addEventListener('hashchange', render);
const urlTheme = new URLSearchParams(location.search).get('theme');
if (urlTheme === 'light' || urlTheme === 'dark') { state.theme = urlTheme; document.documentElement.dataset.theme = urlTheme; }
if (!location.hash) location.hash = '#/welcome';
render();
