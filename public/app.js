// KanzPay PWA — buyer & seller journeys, NFC/QR transport, gold glass UI
const app = document.querySelector('#app');
const toastEl = document.querySelector('#toast');

const state = {
  role: null, theme: document.documentElement.dataset.theme || 'dark',
  name: 'Navneet Sharma', mobile: '+971 50 123 4567',
  account: null, invoice: null, bestValue: null, offers: [], expenses: null,
  insights: null, alerts: null, customers: null, cards: [],
  cardProfile: 'Professional', cardTemplate: 'aurum',
  imported: null, vaultSignals: ['memberships', 'rewards', 'promocodes', 'vouchers', 'cards', 'accounts'],
  kaceProgress: 0
};

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
const money = (minor) => `AED ${(Number(minor || 0) / 100).toFixed(2)}`;
const moneyShort = (minor) => `AED ${(Number(minor || 0) / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
const go = (route) => { location.hash = `#/${route}`; };
const toast = (msg, kind = '') => { toastEl.textContent = msg; toastEl.className = `toast show ${kind}`; clearTimeout(toast.t); toast.t = setTimeout(() => { toastEl.className = 'toast'; }, 2800); };

async function api(path, payload, method) {
  try {
    const res = await fetch(path, payload ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) } : { method: method || 'GET' });
    return await res.json();
  } catch {
    return { error: 'offline', offline: true };
  }
}

/* ---------- shared chrome ---------- */
const logoImg = () => `<img class="logo" src="${state.theme === 'dark' ? '/assets/kanzpay-logo-dark.png' : '/assets/kanzpay-logo.png'}" alt="KanzPay" />`;
function topbar(opts = {}) {
  return `<header class="topbar">
    ${opts.back ? `<button class="icon-btn" data-go="${opts.back}" aria-label="Back">←</button>` : logoImg()}
    <span class="grow"></span>
    ${opts.bell ? `<button class="icon-btn" data-go="${state.role === 'seller' ? 'seller-alerts' : 'buyer-cockpit'}" aria-label="Alerts">◈</button>` : ''}
    <button class="icon-btn" data-action="theme" aria-label="Theme">${state.theme === 'dark' ? '☀' : '☾'}</button>
  </header>`;
}
const BUYER_TABS = [['buyer-home', '⌂', 'Home'], ['offers', '✦', 'Offers'], ['buyer-tap', '◉', 'Pay'], ['buyer-card', '▣', 'Card'], ['buyer-cockpit', '◈', 'Life']];
const SELLER_TABS = [['seller-today', '⌂', 'Today'], ['seller-catalogue', '▦', 'Catalogue'], ['seller-alerts', '◈', 'Alerts'], ['seller-customers', '☺', 'People'], ['seller-insights', '↗', 'Intel']];
function tabbar() {
  const tabs = state.role === 'seller' ? SELLER_TABS : BUYER_TABS;
  const cur = route();
  return `<div class="tabbar"><nav>${tabs.map(([r, i, l]) => `<button class="${cur === r ? 'on' : ''}" data-go="${r}"><span class="tico">${i}</span>${l}</button>`).join('')}</nav></div>`;
}
const screen = (inner, { nav = true } = {}) => `<div class="screen${nav ? '' : ' no-nav'}">${inner}</div>${nav ? tabbar() : ''}`;

/* ---------- screens ---------- */
function welcome() {
  const dark = state.theme === 'dark';
  return `<div class="screen no-nav">
    <div style="position:absolute;inset:0;background:url('/assets/scene-skyline.png') center/cover;opacity:${dark ? '.8' : '.35'}"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(0deg,var(--bg) 8%,transparent 55%)"></div>
    <div class="body" style="position:relative;z-index:1;justify-content:flex-end;padding-top:60px">
      <img src="/assets/kanzpay-mark-dark.png" style="width:76px;align-self:center" class="floaty" alt="" />
      <div class="glass" style="padding:24px;text-align:center">
        <img src="${dark ? '/assets/kanzpay-logo-dark.png' : '/assets/kanzpay-logo.png'}" style="height:46px" alt="KanzPay" />
        <h1 class="hero" style="margin:16px 0 8px">Everyday life<br/><span class="gold-text">rewards you.</span></h1>
        <p class="muted">Pay · Earn Gold · Save More · Discover · Live Better</p>
        <div style="display:grid;gap:10px;margin-top:20px">
          <button class="cta-gold" data-go="journey"><span>Continue in Web</span><span class="arr">→</span></button>
          <button class="cta-pill" data-action="install" style="justify-content:center">⤓ Get the KanzPay App <span class="tiny">· tap, NFC & more</span></button>
          <button class="cta-ghost" data-go="seller-onboard">I'm a Seller →</button>
        </div>
      </div>
      <p class="tiny" style="text-align:center">Sandbox preview · no real money moves</p>
    </div>
  </div>`;
}

function journey() {
  return screen(`${topbar({ back: 'welcome' })}
    <div class="body">
      <h1 class="hero">How will you<br/><span class="gold-text">use KanzPay?</span></h1>
      <button class="card-hero" style="background-image:url('/assets/scene-buyer-hero.png');width:100%;text-align:left;border:1px solid var(--stroke)" data-go-role="buyer">
        <div><span class="eyebrow">I'M A BUYER</span><h2 class="sect" style="color:#fff;margin:6px 0">Shop, pay, earn gold, save more</h2><span class="chip">Tap to start →</span></div>
      </button>
      <button class="card-hero" style="background-image:url('/assets/scene-seller-hero.png');width:100%;text-align:left;border:1px solid var(--stroke)" data-go-role="seller">
        <div><span class="eyebrow">I'M A SELLER</span><h2 class="sect" style="color:#fff;margin:6px 0">Grow my business with KanzPay</h2><span class="chip">Open store →</span></div>
      </button>
      <div class="glass" style="padding:18px;display:flex;gap:12px;align-items:center">
        <div class="bubble" style="width:40px;height:40px;border-radius:12px;background:var(--chip);display:grid;place-items:center">◌</div>
        <div style="flex:1"><b style="font-size:13px">Explore as Guest</b><p class="tiny">See what's possible first</p></div>
        <button class="cta-mini" data-go-role="buyer">Peek</button>
      </div>
    </div>`);
}

function buyerHome() {
  const cats = [['☕', 'Food'], ['🛍', 'Shopping'], ['⚡', 'Bills'], ['✈', 'Travel'], ['🅿', 'Parking'], ['⋯', 'More']];
  const offer = state.offers[0];
  return screen(`${topbar({ bell: true })}
    <div class="body">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="avatar">${esc(state.name[0])}</div>
        <div><p class="tiny">GOOD MORNING</p><h2 class="sect" style="font-style:normal;font-family:inherit">${esc(state.name.split(' ')[0])}</h2></div>
        <span class="grow" style="flex:1"></span><span class="chip">AED 18 available now</span>
      </div>
      <div class="card-banner" style="background-image:url('/assets/scene-skyline.png')">
        <div><span class="eyebrow" style="color:#f3d98b">A PERFECT DAY</span><h2 class="sect" style="color:#fff;margin:6px 0 10px">Great places near you</h2>
        <div class="glass" style="display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:14px"><span>🔍</span><span class="muted" style="font-size:12px">Search for anything…</span></div></div>
      </div>
      <div class="grid3">${cats.map(([i, l]) => `<button class="card-tile" data-go="offers"><span class="glyph">${i}</span><b>${l}</b></button>`).join('')}</div>
      ${offer ? `<button class="card-hero" style="background-image:url('${offer.image}');min-height:150px;width:100%;text-align:left;border:1px solid var(--stroke)" data-go="offers">
        <div><span class="chip">${offer.offer}</span><h2 class="sect" style="color:#fff;margin:8px 0 4px">${esc(offer.item)} · ${money(offer.priceMinor)}</h2><p class="tiny" style="color:#e8dcc0">${esc(offer.store)} · ${offer.distanceM}m · ★${offer.rating}</p></div>
      </button>` : ''}
      <button class="glass" style="padding:16px;display:flex;align-items:center;gap:12px;width:100%;color:var(--ink);text-align:left" data-go="buyer-tap">
        <span class="pulse-dot"></span><div style="flex:1"><b style="font-size:13px">At a store? Tap the K-Tag</b><p class="tiny">Share your Value Vault securely</p></div><span style="color:var(--gold-3)">→</span>
      </button>
    </div>`);
}

function offers() {
  return screen(`${topbar({ back: 'buyer-home' })}
    <div class="body">
      <div><span class="eyebrow">LOCATION INTELLIGENCE</span><h1 class="hero">Offers matched<br/><span class="gold-text">to you.</span></h1><p class="muted">Based on your interests, patterns & priorities · Dubai Marina</p></div>
      ${state.offers.map((o) => `<button class="card-list" style="width:100%;text-align:left;color:var(--ink);cursor:pointer" data-go="buyer-tap">
        <div class="bubble" style="background:url('${o.image}') center/cover;border-radius:14px"></div>
        <div class="main"><b>${esc(o.item)} · ${money(o.priceMinor)}</b><small>${esc(o.store)} · ${o.distanceM}m · ★${o.rating}</small>
        <div style="display:flex;gap:5px;margin-top:7px;flex-wrap:wrap">${o.perks.map((p) => `<span class="chip" style="font-size:8.5px;padding:3px 8px">${p}</span>`).join('')}</div></div>
        <span class="end">Tap<br/>→</span></button>`).join('')}
      <p class="tiny" style="text-align:center">Fewer, better matches — not a feed.</p>
    </div>`);
}

function buyerTap() {
  return screen(`${topbar({ back: 'buyer-home' })}
    <div class="body">
      <div><span class="eyebrow">K-TAG · NFC / QR</span><h1 class="hero">Tap to connect</h1><p class="muted">Hold your phone near the seller K-Tag — or scan the QR.</p></div>
      <div class="card-hero" style="background-image:url('/assets/scene-tap-nfc.png');min-height:230px">
        <div class="nfc-ring"><div class="nfc-tag"><img src="/assets/kanzpay-mark.png" alt="" /></div></div>
      </div>
      <div class="glass" style="padding:16px">
        <p class="tiny" style="margin-bottom:10px">YOUR VALUE VAULT SHARES — APPROVED BY YOU</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap">${state.vaultSignals.map((s) => `<span class="chip">${s}</span>`).join('')}</div>
        <p class="tiny" style="margin-top:10px">Identity, invoice request, catalogue, location & rewards travel with the tap.</p>
      </div>
      <div style="display:grid;gap:10px">
        <button class="cta-gold" data-action="nfc-tap"><span>Tap the K-Tag now</span><span class="arr">◉</span></button>
        <button class="cta-outline" data-action="qr-scan">⌗ Scan QR instead</button>
        <button class="cta-ghost" data-action="manual">Enter manually</button>
      </div>
    </div>`);
}

async function doTap(via) {
  const ex = await api('/api/tap/exchange', { kTag: 'K-LUMA-001', buyerId: state.account?.id || 'buyer-navneet', capabilities: state.vaultSignals, via });
  if (ex.error && !ex.offline) return toast(ex.error, 'error');
  await api('/api/ktag/navigate', {});
  state.invoice = await api('/api/invoice/create');
  state.bestValue = await api('/api/intelligence/best-value', { amountMinor: state.invoice?.grossMinor || 3000 });
  go('buyer-best');
}

function buyerBest() {
  const bv = state.bestValue;
  const inv = state.invoice;
  const gross = bv?.grossMinor ?? inv?.grossMinor ?? 3000;
  const net = bv?.netMinor ?? gross;
  const lines = (bv?.options || []).filter((o) => o.applies);
  return screen(`${topbar({ back: 'buyer-tap' })}
    <div class="body">
      <div><span class="eyebrow">YOUR COFFEE, SMARTER</span><h1 class="hero">A better way<br/><span class="gold-text">to pay.</span></h1></div>
      <div class="card-hero" style="background-image:url('/assets/scene-coffee.png');min-height:140px">
        <div><b style="color:#fff">${esc(state.invoice?.seller?.name || 'The Brew House')}</b><p class="tiny" style="color:#e8dcc0">Café Latte · ${money(gross)}</p></div>
      </div>
      <div class="glass" style="padding:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <span class="chip">◆ BEST VALUE</span><b class="gold-text" style="font-size:18px">Save ${money(gross - net)}</b>
        </div>
        ${lines.map((o, i) => `<div class="check-row" style="margin-bottom:7px"><span class="tick">✓</span><span style="flex:1">${esc(o.label)}</span><b class="gold-text">−${money(o.savingMinor)}</b>${i === 0 ? ' <span class="chip" style="margin-left:6px">Best</span>' : ''}</div>`).join('')}
        <div class="check-row" style="background:var(--chip)"><span class="tick">★</span><span style="flex:1">Earn back</span><b>+${bv?.pointsEarned ?? 60} pts · +${bv?.goldEarnedMg ?? 2} mg Gold</b></div>
        <div style="display:flex;justify-content:space-between;margin-top:14px;padding-top:12px;border-top:1px dashed var(--stroke)"><span class="muted">Pay effectively</span><b style="font-size:20px">${money(net)}</b></div>
        <p class="tiny" style="margin-top:8px">${esc(bv?.reason || '')} ${bv?.recommendedRail ? `Via ${esc(bv.recommendedRail.name)}.` : ''}</p>
      </div>
      <button class="cta-gold" data-action="pay"><span>Use Best Value · ${money(net)}</span><span class="arr">→</span></button>
      <button class="cta-ghost" data-action="stop-pay">Stop — nothing is paid</button>
    </div>`);
}

function buyerSuccess() {
  return screen(`${topbar()}
    <div class="body">
      <div class="card-hero" style="background-image:url('/assets/scene-gold-reward.png');min-height:240px;justify-content:center;text-align:center">
        <div><h1 class="hero" style="color:#fff">Payment<br/><span class="gold-text">successful.</span></h1></div>
      </div>
      <div class="glass" style="padding:20px;text-align:center">
        <p class="eyebrow">YOU EARNED</p>
        <div style="display:flex;justify-content:center;gap:22px;margin:14px 0">
          <div><div class="coin" style="width:54px;height:54px;font-size:18px;margin:auto">Au</div><b style="display:block;margin-top:8px">2 mg Gold</b></div>
          <div><div class="coin" style="width:54px;height:54px;font-size:18px;margin:auto;background:var(--gold-grad-deep);color:#fff">✦</div><b style="display:block;margin-top:8px">+120 points</b></div>
        </div>
        <div class="check-row" style="margin-top:8px"><span class="tick">✓</span><span style="flex:1">Add to my expenses · Food & Dining</span><b>${money(state.bestValue?.netMinor || 2400)}</b></div>
      </div>
      <div style="display:grid;gap:10px">
        <button class="cta-gold" data-go="buyer-cockpit"><span>See my life, smarter</span><span class="arr">→</span></button>
        <button class="cta-pill" data-go="buyer-card" style="justify-content:center">▣ Share my visiting card</button>
      </div>
    </div>`);
}

const PROFILES = ['Professional', 'Family', 'Friends', 'Colleagues', 'Neighbour', 'Custom'];
function buyerCard() {
  const tpl = state.cardTemplate;
  return screen(`${topbar({ back: 'buyer-home' })}
    <div class="body">
      <div><span class="eyebrow">YOUR VISITING CARD</span><h1 class="hero">One sheet,<br/><span class="gold-text">many faces.</span></h1><p class="muted">One data sheet feeds every profile. Pick who's receiving.</p></div>
      <div class="card-face tpl-${tpl}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div><p class="tiny" style="letter-spacing:.2em">${state.cardProfile.toUpperCase()}</p><h2 class="sect" style="font-style:normal;font-family:inherit;margin:6px 0 2px">${esc(state.name)}</h2><p class="tiny">Founder & CEO · Oxy Technologies<br/>Abu Dhabi, UAE</p></div>
          <img src="/assets/kanzpay-mark-dark.png" style="width:34px" alt="" />
        </div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end"><span class="tiny">${esc(state.mobile)}</span><div class="qr"></div></div>
      </div>
      <div class="glass" style="padding:16px">
        <p class="tiny" style="margin-bottom:10px">PROFILE</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap">${PROFILES.map((p) => `<button class="chip" style="cursor:pointer;${p === state.cardProfile ? 'background:var(--gold-grad);color:#453006' : ''}" data-profile="${p}">${p}</button>`).join('')}</div>
        <p class="tiny" style="margin:14px 0 8px">TEMPLATE</p>
        <div class="tpl-pick">
          <button class="tpl-a ${tpl === 'aurum' ? 'on' : ''}" data-tpl="aurum"><span>AURUM</span></button>
          <button class="tpl-p ${tpl === 'pearl' ? 'on' : ''}" data-tpl="pearl"><span>PEARL</span></button>
          <button class="tpl-o ${tpl === 'onyx' ? 'on' : ''}" data-tpl="onyx"><span>ONYX</span></button>
        </div>
      </div>
      <div class="card-hero" style="background-image:url('/assets/scene-card-exchange.png');min-height:130px">
        <div><b style="color:#fff">Tap phones to exchange</b><p class="tiny" style="color:#e8dcc0">NFC · QR · link — your choice</p></div>
      </div>
      <div class="grid2">
        <button class="cta-pill" data-action="share-nfc" style="justify-content:center">◉ Share via Tap</button>
        <button class="cta-pill" data-action="share-qr" style="justify-content:center">⌗ Share QR</button>
      </div>
      <button class="cta-ghost" data-action="share-link">⤴ Share link · Save contact</button>
    </div>`);
}

function buyerCockpit() {
  const ex = state.expenses;
  const cats = ex?.categories || [];
  const colors = ['#e8c56a', '#caa14f', '#a97a2e', '#8a6420', '#f3d98b'];
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">YOUR LIFE, SMARTER</span><h1 class="hero">Expenses &<br/><span class="gold-text">intelligence.</span></h1></div>
      <div class="grid2">
        <div class="card-metric"><small>This month</small><strong>${moneyShort(ex?.totalMinor || 0)}</strong><span class="delta">+${ex?.deltaPct ?? 9}%</span></div>
        <div class="card-metric"><small>My Gold</small><strong class="gold-text">12.5 mg</strong><span class="delta">2,480 pts</span></div>
      </div>
      <div class="glass" style="padding:18px">
        <p class="tiny" style="margin-bottom:6px">SPEND TREND · ${esc(ex?.month || 'THIS MONTH')}</p>
        <div class="bar-chart">${(ex?.trend || []).map((v) => `<i style="height:${v}%"></i>`).join('')}</div>
      </div>
      <div class="glass" style="padding:18px">
        <p class="tiny" style="margin-bottom:12px">BY CATEGORY</p>
        ${cats.map((c, i) => `<div class="donut-row" style="margin-bottom:10px"><i style="background:${colors[i % colors.length]}"></i><span style="flex:1">${c.icon} ${esc(c.label)}</span><b>${moneyShort(c.minor)}</b><span class="tiny" style="width:34px;text-align:right">${c.pct}%</span></div>`).join('')}
      </div>
      <div class="glass" style="padding:18px;border-color:var(--stroke)">
        <div style="display:flex;gap:10px;align-items:center"><div class="avatar" style="width:36px;height:36px;font-size:13px">K</div><b style="font-size:13px">Lifestyle: ${esc(ex?.lifestyle?.profile || 'Learning')}</b></div>
        <p class="muted" style="margin-top:10px">${esc(ex?.lifestyle?.note || '')}</p>
        <p class="tiny" style="margin-top:8px">${esc(ex?.lifestyle?.insight || '')}</p>
      </div>
      <button class="cta-outline" data-go="buyer-card">▣ Share with friends — earn together</button>
    </div>`);
}

/* ---------- seller ---------- */
function sellerOnboard() {
  const steps = [['Save business details', 'You provide, we remember'], ['Install K-Tag & K-ACE', 'We detect & configure'], ['Learn your system', 'Invoices, menus, inventory'], ['Create catalogue', 'Automatically from your data'], ['Review & approve', 'You check, we confirm'], ['Publish & go live', 'Start receiving customers']];
  return screen(`${topbar({ back: 'journey' })}
    <div class="body">
      <div class="card-hero" style="background-image:url('/assets/scene-seller-hero.png');min-height:170px">
        <div><span class="eyebrow" style="color:#f3d98b">SELLER JOURNEY</span><h2 class="sect" style="color:#fff;margin-top:6px">You're almost live.</h2></div>
      </div>
      <div class="glass" style="padding:18px">
        <div class="field"><span>Business name</span><input id="biz" value="The Brew House" /></div>
        <div class="grid2" style="margin-top:10px"><div class="field"><span>Type</span><input value="Café · Restaurant" /></div><div class="field"><span>City</span><input value="Dubai Marina" /></div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">${steps.map(([t, d], i) => `<div class="card-list"><div class="bubble" style="font-size:13px;font-weight:800">${i + 1}</div><div class="main"><b>${t}</b><small>${d}</small></div>${i < 2 ? '<span class="end">✓</span>' : ''}</div>`).join('')}</div>
      <button class="cta-gold" data-action="start-kace"><span>Save & Go Live</span><span class="arr">→</span></button>
      <p class="tiny" style="text-align:center">Takes less than 5 minutes · AI powered, you stay in control</p>
    </div>`);
}

function sellerKace() {
  const p = state.kaceProgress;
  const tasks = [['Reading your invoices', 30], ['Identifying products & categories', 55], ['Learning pricing patterns', 78], ['Creating your catalogue…', 95]];
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">K-ACE IS LEARNING</span><h1 class="hero">Your system,<br/><span class="gold-text">understood.</span></h1></div>
      <div class="glass" style="padding:22px;text-align:center">
        <div class="nfc-ring"><div class="nfc-tag floaty"><img src="/assets/kanzpay-mark.png" alt=""/></div></div>
        <p class="eyebrow" style="margin-top:6px">VISION LEARNING MODE · ${p}%</p>
        <div class="progress" style="margin-top:10px"><i style="width:${p}%"></i></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">${tasks.map(([t, at]) => `<div class="check-row">${p >= at ? '<span class="tick">✓</span>' : `<span class="pulse-dot"></span>`}<span style="flex:1">${t}</span></div>`).join('')}</div>
      <p class="tiny" style="text-align:center">Usually a few minutes — you can keep using the app.</p>
    </div>`);
}

function sellerCatalogue() {
  const items = state.imported?.imported || [];
  const cats = state.imported?.categories || ['Beverages', 'Food', 'Desserts'];
  return screen(`${topbar({ back: 'seller-onboard' })}
    <div class="body">
      <div><span class="eyebrow">YOUR CATALOGUE</span><h1 class="hero">Ready in<br/><span class="gold-text">minutes.</span></h1><p class="muted">${items.length || '—'} products auto-created · ${cats.length} categories</p></div>
      <div class="card-hero" style="background-image:url('/assets/scene-catalogue.png');min-height:150px">
        <div><span class="chip">AI BUILT</span><h2 class="sect" style="color:#fff;margin-top:6px">From your invoices & menu</h2></div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${cats.map((c) => `<span class="chip">${esc(c)}</span>`).join('')}</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${(items.length ? items : [{ name: 'Cappuccino', priceMinor: 1800, category: 'Beverages' }, { name: 'Club Sandwich', priceMinor: 3200, category: 'Food' }]).slice(0, 5).map((i) => `<div class="card-list"><div class="bubble">${i.category?.[0] || '·'}</div><div class="main"><b>${esc(i.name)}</b><small>${esc(i.category)}</small></div><span class="end">${money(i.priceMinor)}</span></div>`).join('')}
      </div>
      <div class="grid2">
        <button class="cta-pill" data-action="import-menu" style="justify-content:center">⤒ Import menu</button>
        <button class="cta-pill" data-action="import-inventory" style="justify-content:center">▦ Inventory</button>
      </div>
      <button class="cta-gold" data-go="seller-today"><span>Review & Publish</span><span class="arr">→</span></button>
    </div>`);
}

function sellerToday() {
  const s = state.insights;
  return screen(`${topbar({ bell: true })}
    <div class="body">
      <div><span class="eyebrow">YOUR BUSINESS TODAY</span><h1 class="hero">Good morning,<br/><span class="gold-text">Brew House.</span></h1></div>
      <div class="grid3">
        <div class="card-metric"><small>Sales</small><strong>${moneyShort(s?.salesMinor || 284000)}</strong><span class="delta">+${s?.salesDeltaPct || 18}%</span></div>
        <div class="card-metric"><small>Orders</small><strong>${s?.orders || 84}</strong><span class="delta">+${s?.ordersDeltaPct || 18}%</span></div>
        <div class="card-metric"><small>Guests</small><strong>${s?.customers || 62}</strong><span class="delta">+${s?.customersDeltaPct || 15}%</span></div>
      </div>
      <div class="glass" style="padding:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><p class="tiny">SALES TREND · AED</p><div class="seg"><button class="on">Day</button><button>Week</button></div></div>
        <div class="bar-chart">${(s?.trend || []).map((v) => `<i style="height:${v}%"></i>`).join('')}</div>
        <div class="tiny" style="display:flex;justify-content:space-between;margin-top:6px"><span>6am</span><span>10am</span><span>2pm</span><span>6pm</span><span>10pm</span></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${(s?.categories || []).map((c, i) => `<div class="card-list"><div class="bubble" style="background:${['#e8c56a', '#caa14f', '#a97a2e', '#8a6420'][i]};color:#3a2a08">${c.label[0]}</div><div class="main"><b>${esc(c.label)}</b><small>${c.items} items</small></div><span class="end">${c.pct}%</span></div>`).join('')}
      </div>
      <div class="card-list"><div class="bubble">⧗</div><div class="main"><b>Order #1048 pending</b><small>Buyer approval waiting — invoice shared via print-share</small></div><button class="cta-mini" data-action="nudge">Nudge</button></div>
    </div>`);
}

function sellerAlerts() {
  const g = state.alerts?.grouped || {};
  const sect = (title, icon, list) => list?.length ? `<div><p class="eyebrow" style="margin-bottom:8px">${icon} ${title}</p><div style="display:flex;flex-direction:column;gap:8px">${list.map((a) => `<div class="card-list"><div class="bubble" style="background:${a.severity === 'warn' ? 'linear-gradient(135deg,#e8b356,#a96a2e)' : a.severity === 'good' ? 'var(--gold-grad)' : 'var(--chip)'};color:#3a2a08;font-size:14px">${a.severity === 'warn' ? '!' : a.severity === 'good' ? '✓' : 'i'}</div><div class="main"><b>${esc(a.title)}</b><small>${esc(a.detail)}</small></div><button class="cta-mini">${esc(a.action)}</button></div>`).join('')}</div></div>` : '';
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">INTELLIGENT ALERTS</span><h1 class="hero">What needs<br/><span class="gold-text">you.</span></h1></div>
      ${sect('Inventory', '▦', g.inventory)}
      ${sect('Payments · payables & receivables', '◈', g.payments)}
      ${sect('Business', '↗', g.business)}
    </div>`);
}

function sellerCustomers() {
  const cs = state.customers?.customers || [];
  const rw = state.customers?.rewards || {};
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">YOUR CUSTOMERS</span><h1 class="hero">People who<br/><span class="gold-text">return.</span></h1></div>
      <div class="seg"><button class="on">All</button><button>Top</button><button>New</button><button>Needs attention</button></div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${cs.map((c) => `<div class="card-list"><div class="avatar">${esc(c.name[0])}</div><div class="main"><b>${esc(c.name)}</b><small>${c.visits} visits · ${moneyShort(c.spentMinor)}</small></div><div class="end"><span class="chip">${esc(c.segment)}</span><div class="tiny" style="margin-top:4px">${c.goldMg} mg gold</div></div></div>`).join('')}
      </div>
      <div class="glass" style="padding:18px">
        <p class="tiny" style="margin-bottom:10px">REWARDS & GOLD ISSUED</p>
        <div style="display:flex;gap:18px"><div><b class="gold-text" style="font-size:22px">${(rw.pointsIssued || 0).toLocaleString()}</b><p class="tiny">points · +${rw.pointsDeltaPct || 0}%</p></div><div><b class="gold-text" style="font-size:22px">${rw.goldIssuedMg || 0} mg</b><p class="tiny">gold · +${rw.goldDeltaPct || 0}%</p></div></div>
      </div>
      <button class="cta-gold" data-action="grant-offer"><span>Create offer for customers</span><span class="arr">✦</span></button>
    </div>`);
}

function sellerInsights() {
  const s = state.insights;
  const pl = s?.pl || {};
  return screen(`${topbar()}
    <div class="body">
      <div><span class="eyebrow">BUSINESS INTELLIGENCE</span><h1 class="hero">Trends, P&L<br/><span class="gold-text">& foresight.</span></h1></div>
      <div class="glass" style="padding:18px">
        <p class="tiny" style="margin-bottom:10px">P&L · THIS MONTH</p>
        ${[['Revenue', pl.revenueMinor], ['Cost of goods', -pl.cogsMinor], ['Gross profit', pl.grossMinor], ['Expenses', -pl.expensesMinor], ['Net profit', pl.netMinor]].map(([l, v], i) => `<div class="donut-row" style="margin-bottom:9px;padding:${i === 4 ? '8px 10px' : '0'};${i === 4 ? 'background:var(--chip);border-radius:10px' : ''}"><span style="flex:1">${l}</span><b class="${i === 4 ? 'gold-text' : ''}">${moneyShort(v)}</b></div>`).join('')}
      </div>
      <div class="glass" style="padding:18px">
        <p class="tiny" style="margin-bottom:10px">EXPENSES BY HEAD</p>
        ${(s?.expenseHeads || []).map((h, i) => `<div class="donut-row" style="margin-bottom:8px"><i style="background:${['#e8c56a', '#caa14f', '#a97a2e', '#8a6420'][i]}"></i><span style="flex:1">${esc(h.head)}</span><b>${moneyShort(h.minor)}</b></div>`).join('')}
      </div>
      <div class="glass" style="padding:18px">
        <p class="tiny" style="margin-bottom:10px">TOP PRODUCTS</p>
        ${(s?.topProducts || []).map((p) => `<div class="card-list" style="margin-bottom:7px"><div class="bubble">◆</div><div class="main"><b>${esc(p.name)}</b><small>${p.tag ? esc(p.tag) : 'Steady'}</small></div><span class="end">${money(p.priceMinor)}</span></div>`).join('')}
      </div>
      <button class="cta-outline" data-go="seller-alerts">◈ View all alerts</button>
    </div>`);
}

/* ---------- router ---------- */
const route = () => (location.hash || '#/welcome').slice(2) || 'welcome';
async function render() {
  const r = route();
  if (r.startsWith('seller')) state.role = 'seller';
  if (r.startsWith('buyer') || r === 'offers' || r === 'journey') state.role = 'buyer';
  if (r === 'offers' && !state.offers.length) state.offers = (await api('/api/offers/nearby')).offers || [];
  if (r === 'buyer-cockpit' && !state.expenses) state.expenses = await api('/api/intelligence/expenses');
  if (['seller-today', 'seller-insights'].includes(r) && !state.insights) state.insights = await api('/api/seller/insights');
  if (r === 'seller-alerts' && !state.alerts) state.alerts = await api('/api/seller/alerts');
  if (r === 'seller-customers' && !state.customers) state.customers = await api('/api/seller/customers');
  const views = { welcome, journey, 'buyer-home': buyerHome, offers, 'buyer-tap': buyerTap, 'buyer-best': buyerBest, 'buyer-success': buyerSuccess, 'buyer-card': buyerCard, 'buyer-cockpit': buyerCockpit, 'seller-onboard': sellerOnboard, 'seller-kace': sellerKace, 'seller-catalogue': sellerCatalogue, 'seller-today': sellerToday, 'seller-alerts': sellerAlerts, 'seller-customers': sellerCustomers, 'seller-insights': sellerInsights };
  app.innerHTML = (views[r] || welcome)();
  window.scrollTo(0, 0);
}

let kaceTimer;
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-go],[data-action],[data-go-role],[data-profile],[data-tpl]');
  if (!el) return;
  if (el.dataset.go) { go(el.dataset.go); return; }
  if (el.dataset.goRole) { state.role = el.dataset.goRole; go(state.role === 'seller' ? 'seller-onboard' : 'buyer-home'); return; }
  if (el.dataset.profile) { state.cardProfile = el.dataset.profile; render(); return; }
  if (el.dataset.tpl) { state.cardTemplate = el.dataset.tpl; render(); return; }
  const a = el.dataset.action;
  if (a === 'theme') { state.theme = state.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = state.theme; localStorage.setItem('kz-theme', state.theme); render(); return; }
  if (a === 'install') { toast('On mobile: browser menu → Add to Home Screen. NFC & app features unlock on Android.'); return; }
  if (a === 'nfc-tap') { toast('◉ Waiting for K-Tag…'); if ('NDEFReader' in window) { try { const r = new NDEFReader(); await r.scan(); r.onreading = () => doTap('nfc'); return; } catch { /* fall through */ } } setTimeout(() => doTap('nfc'), 900); return; }
  if (a === 'qr-scan') { toast('⌗ Point camera at seller QR'); setTimeout(() => doTap('qr'), 1100); return; }
  if (a === 'manual') { doTap('manual'); return; }
  if (a === 'pay') { await api('/api/solver/preview'); const res = await api('/api/checkout/approve'); state.receipt = res; toast('Approved. Gold is on its way.', 'success'); go('buyer-success'); return; }
  if (a === 'stop-pay') { await api('/api/checkout/stop'); toast('Stopped. Nothing was paid.'); go('buyer-tap'); return; }
  if (a === 'share-nfc') { await api('/api/card/create', { name: state.name, profile: state.cardProfile, template: state.cardTemplate, title: 'Founder & CEO', company: 'Oxy Technologies', mobile: state.mobile }); const r = await api('/api/card/exchange', { via: 'nfc' }); toast(r.message || 'Card exchanged via tap.', 'success'); return; }
  if (a === 'share-qr') { await api('/api/card/create', { name: state.name, profile: state.cardProfile, template: state.cardTemplate, mobile: state.mobile }); const r = await api('/api/card/exchange', { via: 'qr' }); toast(r.message || 'Card exchanged via QR.', 'success'); return; }
  if (a === 'share-link') { try { await navigator.share?.({ title: 'My KanzPay card', text: `${state.name} · ${state.cardProfile}`, url: location.origin + '/#/buyer-card' }); } catch {} toast('Link ready to share.'); return; }
  if (a === 'start-kace') {
    const biz = document.querySelector('#biz')?.value || 'The Brew House';
    await api('/api/onboarding/permission', { role: 'seller', id: 'business-account', enabled: true, metadata: { business: biz } });
    go('seller-kace'); state.kaceProgress = 0;
    clearInterval(kaceTimer);
    kaceTimer = setInterval(async () => {
      state.kaceProgress = Math.min(100, state.kaceProgress + 7);
      if (route() === 'seller-kace') render();
      if (state.kaceProgress >= 100) { clearInterval(kaceTimer); state.imported = await api('/api/seller/catalogue/import', { source: 'invoice' }); toast('K-ACE built your catalogue.', 'success'); go('seller-catalogue'); }
    }, 420);
    return;
  }
  if (a === 'import-menu') { state.imported = await api('/api/seller/catalogue/import', { source: 'menu' }); toast('Menu imported into catalogue.', 'success'); render(); return; }
  if (a === 'import-inventory') { state.imported = await api('/api/seller/catalogue/import', { source: 'inventory' }); toast('Inventory synced.', 'success'); render(); return; }
  if (a === 'nudge') { toast('Reminder sent to buyer.'); return; }
  if (a === 'grant-offer') { await api('/api/seller/offer/grant', { customerId: 'cu-sarah', points: 200, goldMg: 2 }); toast('Offer sent: 200 pts + 2 mg Gold to Sarah.', 'success'); return; }
});

const urlTheme = new URLSearchParams(location.search).get('theme');
if (urlTheme === 'light' || urlTheme === 'dark') { state.theme = urlTheme; document.documentElement.dataset.theme = urlTheme; }
window.addEventListener('hashchange', render);
if (!location.hash) location.hash = '#/welcome';
render();
