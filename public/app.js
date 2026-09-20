const app = document.querySelector('#app');
const title = document.querySelector('#page-title');
const toast = document.querySelector('#toast');
let data;

const money = (minor) => `AED ${(minor / 100).toFixed(2)}`;
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const post = async (path, payload = {}) => {
  const response = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  return response.json();
};
const notify = (message) => { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); };

function layout(view) {
  document.querySelectorAll('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
}

function buyerView() {
  const preview = data.preview;
  title.textContent = 'Good afternoon, Maya';
  app.innerHTML = `
    <section class="view">
      <div class="hero-grid">
        <article class="card hero-card">
          <div class="card-kicker">PACT is ready at Luma Market</div>
          <h2>Let your benefits do the work before you pay.</h2>
          <p>Scan the seller’s PACT tag to check verified entitlements, protect your cash floor, and choose the safest rail.</p>
          <div class="action-row"><button class="primary" id="scan">Scan a PACT tag <span>↗</span></button><button class="secondary" id="wallet">View wallet</button></div>
        </article>
        <article class="card metric-card">
          <div class="metric-head"><span>Your savings this month</span><span class="gold">+18.4%</span></div>
          <div><div class="metric-value">${money(3840)}</div><div class="metric-caption">Across 12 matched receipts</div></div>
          <div class="sparkline">${Array.from({ length: 7 }, () => '<i></i>').join('')}</div>
        </article>
      </div>
      <div class="section-head"><h3>Your verified entitlements</h3><button id="manage-wallet">Manage wallet ↗</button></div>
      <div class="cards-3">${data.entitlements.map((item) => `
        <article class="card entitlement"><span class="tag">${item.evidence} · ${item.status === 'ready' ? 'verified' : 'discovery'}</span>
          <h4>${esc(item.name)}</h4><p>${esc(item.detail)}</p><div class="value">${item.status === 'ready' ? `Up to ${money(item.valueMinor)}` : `Possible ${money(item.valueMinor)}`}</div>
        </article>`).join('')}</div>
      <div class="split">
        <article class="card"><div class="section-head"><h3>Protected money</h3><button id="edit-floor">Edit</button></div>
          <div class="metric-value">${money(data.buyer.floorMinor)}</div><div class="metric-caption">Cash floor · salary day ${data.buyer.salaryDay}</div>
          <div class="list"><div class="list-row"><span>Next standing obligation<small>Rent · 28 Sep</small></span><strong class="amount">${money(125000)}</strong></div><div class="list-row"><span>Available after floor<small>Aani balance</small></span><strong class="amount green">${money(data.rails[0].balanceMinor - data.buyer.floorMinor)}</strong></div></div>
        </article>
        <article class="card"><div class="section-head"><h3>Recent activity</h3><button data-view-link="insights">See all ↗</button></div>
          <div class="list"><div class="list-row"><span>Carrefour<small>Groceries · Today</small></span><strong class="amount">${money(7260)}</strong></div><div class="list-row"><span>Careem<small>Transport · Yesterday</small></span><strong class="amount">${money(4200)}</strong></div><div class="list-row"><span>Luma Market<small>Matched · 18 Sep</small></span><strong class="amount green">−${money(480)}</strong></div></div>
        </article>
      </div>
    </section>`;
  document.querySelector('#scan').onclick = openQuote;
  document.querySelector('#wallet').onclick = () => notify('Wallet view is ready for the next onboarding slice.');
  document.querySelector('#manage-wallet').onclick = () => notify('Consent and evidence management opens here.');
  document.querySelector('#edit-floor').onclick = () => notify('Sandbox setting: AED 500.00 cash floor.');
  document.querySelector('[data-view-link]').onclick = () => render('insights');
}

function quoteView(preview) {
  title.textContent = 'Review your PACT plan';
  app.innerHTML = `<section class="view">
    <div class="section-head"><h3><span class="muted">01</span> Quote ready · ${esc(preview.seller.name)}</h3><button id="back">← Back to home</button></div>
    <div class="quote">
      <article class="card">
        <div class="card-kicker">Sandbox-guaranteed net price</div><div class="quote-total">${money(preview.netMinor)}</div><div class="metric-caption">You pay after verified benefits</div>
        <div class="list" style="margin-top: 25px"><div class="quote-line"><span>Basket total</span><strong>${money(preview.grossMinor)}</strong></div><div class="quote-line"><span>Verified benefits · Tier A/B</span><strong class="green">−${money(preview.guaranteedMinor)}</strong></div><div class="quote-line"><span>Possible savings · Tier C</span><strong class="muted">${money(preview.possibleMinor)} <small>(not applied)</small></strong></div></div>
        <div class="callout" style="margin-top: 20px">The price is guaranteed only for the signed basket, evidence, and quote window shown here.</div>
        <div class="action-row"><button class="primary" id="approve">Approve & pay ${money(preview.netMinor)} ↗</button><button class="danger" id="stop">STOP</button></div>
      </article>
      <div class="view">
        <article class="card"><div class="section-head"><h3>Best rail selected</h3><span class="status">Safe</span></div>
          <div class="rail"><div class="rail-icon">A</div><div><strong>${esc(preview.selectedRail.name)}</strong><small>${esc(preview.selectedRail.detail)}</small></div><span class="check">●</span></div>
          <div class="quote-line"><span>Balance after payment</span><strong>${money(preview.selectedRail.balanceMinor - preview.netMinor)}</strong></div>
          <div class="quote-line"><span>Your cash floor</span><strong>${money(preview.floorMinor)}</strong></div>
        </article>
        <article class="card"><div class="section-head"><h3>What PACT considered</h3></div><div class="list">${preview.refusalReasons.map((reason) => `<div class="list-row"><span class="muted">${esc(reason)}</span></div>`).join('')}</div></article>
        <article class="card"><div class="section-head"><h3>Reward moment</h3></div><div class="metric-value gold">${preview.points.toLocaleString()} pts</div><div class="metric-caption">+ ${money(preview.goldMinor)} Gold vault allocation after settlement</div></article>
      </div>
    </div></section>`;
  document.querySelector('#back').onclick = () => render('buyer');
  document.querySelector('#approve').onclick = async () => resultView(await post('/api/checkout/approve'));
  document.querySelector('#stop').onclick = async () => { const result = await post('/api/checkout/stop'); notify(result.message); render('buyer'); };
}

function resultView(result) {
  title.textContent = 'Purchase settled';
  app.innerHTML = `<section class="view"><div class="empty-state card"><div class="card-kicker">04 · Reconciled</div><h2>${money(result.paidMinor)} paid safely</h2><p>Receipt ${esc(result.receipt.reference)} matched with ${(result.receipt.confidence * 100).toFixed(0)}% confidence.</p><div class="action-row" style="justify-content:center"><button class="primary" id="insights">View expense insight ↗</button><button class="secondary" id="home">Back home</button></div></div></section>`;
  document.querySelector('#insights').onclick = () => render('insights');
  document.querySelector('#home').onclick = () => render('buyer');
}

function sellerView() {
  title.textContent = 'Seller studio';
  app.innerHTML = `<section class="view"><div class="hero-grid"><article class="card hero-card"><div class="card-kicker">Luma Market · Seller studio</div><h2>Turn every invoice into a trusted checkout.</h2><p>Configure benefits, sign a basket manifest, and let PACT return a reconciliation-ready decision.</p><div class="action-row"><button class="primary" id="emit">Emit signed basket ↗</button><button class="secondary" id="rules">Review rules</button></div></article><article class="card metric-card"><div class="metric-head"><span>Today’s PACT volume</span><span class="green">+12.8%</span></div><div><div class="metric-value">AED 8,420</div><div class="metric-caption">31 itemised sessions · 98.2% matched</div></div><div class="sparkline">${Array.from({ length: 7 }, () => '<i></i>').join('')}</div></article></div>
  <div class="split"><article class="card"><div class="section-head"><h3>Offer grammar · ${esc(data.seller.rulesVersion)}</h3><button id="edit-rules">Edit ↗</button></div><div class="list"><div class="list-row"><span>Fazaa member<small>10% off · eligible cafe items</small></span><span class="status">Active</span></div><div class="list-row"><span>Visa Signature<small>AED 1.80 off · BIN verified</small></span><span class="status">Active</span></div><div class="list-row"><span>Newsletter code<small>Candidate only · never guaranteed</small></span><span class="status possible">Discovery</span></div></div></article><article class="card"><div class="section-head"><h3>Latest invoice</h3><button>Open register ↗</button></div><div class="metric-value">${money(data.preview.grossMinor)}</div><div class="metric-caption">LM-1048 · waiting for buyer decision</div><div class="callout" style="margin-top: 22px">Signed basket manifest includes ${data.basket.items.length} line items and VAT-ready categories.</div></article></div></section>`;
  document.querySelector('#emit').onclick = openQuote;
  document.querySelector('#rules').onclick = () => notify('Rule builder is available in the seller studio slice.');
  document.querySelector('#edit-rules').onclick = () => notify('Rules are versioned and signed before publication.');
}

function insightsView() {
  title.textContent = 'Expense insights';
  app.innerHTML = `<section class="view"><div class="hero-grid"><article class="card"><div class="card-kicker">Receipt-to-transaction matching</div><h2 style="font-size:26px;font-weight:450;letter-spacing:-.04em">Your spend is becoming legible.</h2><p class="muted">Line items are categorised from signed invoices and matched to sandbox transactions. Missing data stays unavailable—not zero.</p><div class="action-row"><button class="primary" id="reconcile">Run reconciliation ↗</button></div></article><article class="card metric-card"><div class="metric-head"><span>Matched this month</span><span class="green">98.2%</span></div><div><div class="metric-value">AED 3,840</div><div class="metric-caption">12 receipts · 0 unresolved anomalies</div></div><div class="sparkline">${Array.from({ length: 7 }, () => '<i></i>').join('')}</div></article></div><div class="section-head"><h3>Category view</h3><button>Change period ↗</button></div><article class="card table-card"><table><thead><tr><th>Category</th><th>Matched amount</th><th>Share</th><th>Signal</th></tr></thead><tbody><tr><td>Cafe</td><td>${money(2400)}</td><td>33%</td><td><span class="status">On plan</span></td></tr><tr><td>Grocery</td><td>${money(3600)}</td><td>50%</td><td><span class="status">On plan</span></td></tr><tr><td>Membership</td><td>${money(1200)}</td><td>17%</td><td><span class="status possible">Review</span></td></tr></tbody></table></article></section>`;
  document.querySelector('#reconcile').onclick = async () => { const result = await post('/api/reconcile'); notify(`Matched at ${(result.confidence * 100).toFixed(0)}% confidence.`); };
}

function auditView() {
  title.textContent = 'Audit trail';
  app.innerHTML = `<section class="view"><div class="section-head"><h3>Append-only sandbox events</h3><span class="status">No live providers</span></div><article class="card table-card"><table><thead><tr><th>Event</th><th>Quote</th><th>Time</th><th>Result</th></tr></thead><tbody>${(data.audit.length ? data.audit : [{ event: 'BOOTSTRAPPED', quoteId: '—', at: new Date().toISOString() }]).map((event) => `<tr><td>${esc(event.event)}</td><td>${esc(event.quoteId)}</td><td>${new Date(event.at).toLocaleTimeString()}</td><td><span class="status">Recorded</span></td></tr>`).join('')}</tbody></table></article><div class="callout">Every money-affecting decision is represented as an explicit event. Approval and STOP are server-side transitions, not UI-only flags.</div></section>`;
}

async function openQuote() {
  notify('Resolving signed basket and safe rail…');
  const preview = await post('/api/solver/preview');
  quoteView(preview);
}

async function render(view) {
  layout(view);
  if (!data) data = await (await fetch('/api/bootstrap')).json();
  if (view === 'buyer') buyerView();
  if (view === 'seller') sellerView();
  if (view === 'insights') insightsView();
  if (view === 'audit') auditView();
}

document.querySelectorAll('.nav-item').forEach((button) => button.addEventListener('click', () => render(button.dataset.view)));
render('buyer');
