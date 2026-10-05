import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicRoot = join(root, 'public');
const port = Number(process.env.PORT ?? 3000);

const state = {
  buyer: {
    name: 'Maya Khan',
    profile: 'Adult buyer',
    points: 1840,
    goldMinor: 1260,
    floorMinor: 50000,
    salaryDay: 28
  },
  seller: {
    id: 'seller-luma-market',
    name: 'Luma Market',
    location: 'Dubai Marina',
    rulesVersion: 'v12'
  },
  catalogue: [
    { id: 'sku-coffee', barcode: '6291100002201', name: 'Ethiopian cold brew', category: 'Cafe', priceMinor: 2400, stock: 18, daysStock: 2, image: '/assets/catalogue-coffee.svg' },
    { id: 'sku-granola', barcode: '6291100000101', name: 'Granola cup', category: 'Grocery', priceMinor: 1800, stock: 4, daysStock: 1, image: '/assets/catalogue-granola.svg' },
    { id: 'sku-water', barcode: '6291100000018', name: 'Still water 500ml', category: 'Grocery', priceMinor: 500, stock: 148, daysStock: 12, image: '/assets/catalogue-water.svg' }
  ],
  basket: {
    id: 'basket-1048',
    reference: 'LM-1048',
    currency: 'AED',
    items: [
      { id: 'coffee', name: 'Ethiopian cold brew', category: 'Cafe', quantity: 1, unitMinor: 2400 },
      { id: 'granola', name: 'Granola cup', category: 'Grocery', quantity: 2, unitMinor: 1800 },
      { id: 'membership', name: 'Luma membership', category: 'Membership', quantity: 1, unitMinor: 1200 }
    ]
  },
  entitlements: [
    { id: 'fazaa', name: 'Fazaa member', evidence: 'Tier A', detail: 'Merchant verified', status: 'ready', valueMinor: 420 },
    { id: 'visa', name: 'Visa Signature', evidence: 'Tier B', detail: 'BIN offer probe', status: 'ready', valueMinor: 180 },
    { id: 'newsletter', name: 'Luma newsletter code', evidence: 'Tier C', detail: 'Candidate from email', status: 'possible', valueMinor: 300 }
  ],
  rails: [
    { id: 'aani', name: 'Aani', detail: 'Instant account-to-account', balanceMinor: 184000, safe: true, feeMinor: 0 },
    { id: 'jaywan', name: 'Jaywan debit', detail: 'Domestic debit rail', balanceMinor: 62000, safe: true, feeMinor: 0 },
    { id: 'visa', name: 'Visa Signature', detail: 'Card-linked offer active', balanceMinor: 42000, safe: false, feeMinor: 250 }
  ],
  session: null,
  onboarding: {
    waitlist: [],
    role: null,
    permissions: {},
    qr: null,
    account: null,
    exchange: null
  },
  savingsSources: [
    { id: 'cards', label: 'Cards & BIN offers', icon: '◇', benefit: 'Find issuer discounts before you pay.', status: 'discoverable', expectedMinor: 180 },
    { id: 'memberships', label: 'Memberships', icon: '✦', benefit: 'Apply member pricing automatically.', status: 'discoverable', expectedMinor: 420 },
    { id: 'rewards', label: 'Reward programmes', icon: '◎', benefit: 'Use points and keep balances together.', status: 'discoverable', expectedMinor: 240 },
    { id: 'email', label: 'Email offers', icon: '✉', benefit: 'Find vouchers and promo codes.', status: 'locked', expectedMinor: 160 },
    { id: 'sms', label: 'SMS offers', icon: '◌', benefit: 'Read time-limited merchant offers.', status: 'locked', expectedMinor: 90 },
    { id: 'notifications', label: 'App notifications', icon: '⌁', benefit: 'Catch offers from installed apps.', status: 'locked', expectedMinor: 110 }
  ],
  cards: [],
  cardCounter: 0,
  alerts: [
    { id: 'al-stock-1', type: 'inventory', severity: 'warn', title: 'Granola cup low', detail: '4 units left · ~1 day of stock', action: 'Restock' },
    { id: 'al-stock-2', type: 'inventory', severity: 'info', title: 'Still water overstock', detail: '148 units · 12 days of cover', action: 'Bundle offer' },
    { id: 'al-pay-1', type: 'payable', severity: 'warn', title: 'Supplier payable due', detail: 'Al Ain Dairy · AED 1,240 in 2 days', action: 'Schedule' },
    { id: 'al-pay-2', type: 'receivable', severity: 'good', title: 'Receivable cleared', detail: 'Catering partner paid AED 3,800', action: 'View' },
    { id: 'al-biz-1', type: 'business', severity: 'good', title: 'Sales up 18%', detail: 'Beverages led the week · Fri peak 2pm', action: 'Insights' },
    { id: 'al-biz-2', type: 'business', severity: 'warn', title: 'Order #1048 pending', detail: 'Buyer approval waiting 14 min', action: 'Nudge' }
  ],
  offers: [
    { id: 'of-brew', store: 'The Brew House', distanceM: 280, rating: 4.8, item: 'Cafe Latte', priceMinor: 2400, offer: 'Earn 20 mg Gold', category: 'Food', image: '/assets/scene-coffee.png', perks: ['20% OFF', '50 points', '2 mg Gold'] },
    { id: 'of-croissant', store: 'The Brew House', distanceM: 280, rating: 4.8, item: 'Butter Croissant', priceMinor: 1800, offer: 'Membership price', category: 'Food', image: '/assets/scene-catalogue.png', perks: ['Membership', '12 points'] },
    { id: 'of-iced', store: 'Kona Roast', distanceM: 640, rating: 4.6, item: 'Iced Coffee', priceMinor: 2200, offer: '2 mg Gold', category: 'Food', image: '/assets/scene-coffee.png', perks: ['2 mg Gold'] }
  ],
  expenses: {
    month: 'October', totalMinor: 124000, deltaPct: 9,
    categories: [
      { label: 'Food & Dining', minor: 47120, pct: 38, icon: '☕' },
      { label: 'Shopping', minor: 27280, pct: 22, icon: '🛍' },
      { label: 'Others', minor: 17360, pct: 14, icon: '◈' },
      { label: 'Transport', minor: 14880, pct: 12, icon: '➤' },
      { label: 'Bills', minor: 17360, pct: 14, icon: '⚡' }
    ],
    trend: [22, 34, 18, 42, 30, 55, 38, 47, 26, 60, 33, 44],
    lifestyle: { profile: 'Mindful urbanite', note: 'AED 30 coffee fits your lifestyle. AED 5 karak is a find — 3 spots near you.', insight: 'Coffee at AED 30 is normal for you. Dining above AED 90 flags as costly.' }
  },
  sellerInsights: {
    salesMinor: 284000, salesDeltaPct: 18, orders: 84, ordersDeltaPct: 18, customers: 62, customersDeltaPct: 15,
    trend: [12, 22, 18, 30, 42, 26, 55, 38, 60, 33, 44, 28],
    categories: [
      { label: 'Beverages', pct: 38, items: 62 },
      { label: 'Food', pct: 32, items: 46 },
      { label: 'Desserts', pct: 18, items: 18 },
      { label: 'Others', pct: 12, items: 42 }
    ],
    pl: { revenueMinor: 284000, cogsMinor: 159000, grossMinor: 125000, expensesMinor: 61500, netMinor: 63500 },
    expenseHeads: [
      { head: 'Rent', minor: 28000 }, { head: 'Staff', minor: 18500 },
      { head: 'Supplies', minor: 9800 }, { head: 'Utilities', minor: 5200 }
    ],
    topProducts: [
      { name: 'Cappuccino', priceMinor: 1800, tag: 'Popular' },
      { name: 'Club Sandwich', priceMinor: 3200, tag: '' },
      { name: 'Cold Coffee', priceMinor: 2200, tag: '' }
    ]
  },
  customers: [
    { id: 'cu-sarah', name: 'Sarah Ahmed', segment: 'Top Customer', visits: 12, spentMinor: 48000, goldMg: 2.4 },
    { id: 'cu-rohan', name: 'Rohan Mehta', segment: 'Regular', visits: 6, spentMinor: 11000, goldMg: 1.1 },
    { id: 'cu-fatima', name: 'Fatima Khan', segment: 'New Customer', visits: 1, spentMinor: 3600, goldMg: 0.2 }
  ],
  stores: [
    { id: 'st-brew', name: 'The Brew House', kind: 'Café', distanceM: 280, rating: 4.8, live: true, offers: ['20% member price', '2 mg Gold'], image: '/assets/scene-coffee.png' },
    { id: 'st-luma', name: 'Luma Market', kind: 'Grocery', distanceM: 450, rating: 4.6, live: true, offers: ['Membership price', '12 points'], image: '/assets/scene-catalogue.png' },
    { id: 'st-kona', name: 'Kona Roast', kind: 'Café', distanceM: 640, rating: 4.6, live: false, offers: ['Stamp card'], image: '/assets/scene-coffee.png' },
    { id: 'st-date', name: 'Date & Grain', kind: 'Bakery', distanceM: 900, rating: 4.9, live: true, offers: ['Free gift on AED 50'], image: '/assets/scene-catalogue.png' }
  ],
  vault: [
    { id: 'memberships', label: 'My Memberships', icon: '◆', status: 'connected', items: [{ name: 'Brew House Club', value: '20% member price', valid: 'Dec 2026' }], expectedMinor: 480 },
    { id: 'rewards', label: 'My Reward Points', icon: '✦', status: 'connected', items: [{ name: 'KanzPay Points', value: '2,480 pts', valid: 'No expiry' }], expectedMinor: 240 },
    { id: 'promocodes', label: 'My Promocodes', icon: '⌗', status: 'discoverable', items: [{ name: 'KANZ10', value: '10% off', valid: 'Nov 2026' }], expectedMinor: 300 },
    { id: 'vouchers', label: 'My Vouchers & Coupons', icon: '▤', status: 'grey', items: [], expectedMinor: 160 }
  ],
  sellerDashboard: {
    focus: {
      commission: { pendingMinor: 12400, paidMinor: 84200 },
      tickets: [{ kind: 'Complaint', text: 'Cold coffee served late', status: 'open' }, { kind: 'Query', text: 'Do you take gold?', status: 'open' }, { kind: 'Rating', text: '★ 4.8 this week', status: 'good' }],
      rewards: { repeatPct: 34, goldPctOfBill: 2, rules: '200 AED = 100 pts; 1,000 AED = 5 mg Gold' },
      trends: { valuePct: 18, volumePct: 12 },
      customers: { walkins: 62, avgTicketMinor: 4600, repeatPct: 34 }
    }
  },
  adminSettings: {
    buyer: {
      shareVaultOnTap: true, shareLocation: true, shareExpenses: true,
      allowLifestyleIntel: true, autoApplyMembership: true, autoApplyPoints: false,
      goldFloorMinor: 500, notifications: true, dataSync: true
    },
    seller: {
      autoCatalogueFromInvoice: true, autoCatalogueFromMenu: true, autoCatalogueFromInventory: true,
      inventoryAlerts: true, payableAlerts: true, receivableAlerts: true, businessAlerts: true,
      allowPointsRewards: true, allowGoldRewards: true, maxDiscountPct: 30,
      kaceEnabled: true, shareInvoicesBeforePrint: true, dataSync: true
    }
  },
  ssoTokens: [],
  transactions: [
    { id: 'txn-8f3a', store: 'The Brew House', amountMinor: 6600, savedMinor: 1750, goldMg: 2, points: 120, status: 'SETTLED', at: 'Today, 09:41' },
    { id: 'txn-7c2b', store: 'Luma Market', amountMinor: 12400, savedMinor: 800, goldMg: 1.4, points: 88, status: 'SETTLED', at: 'Yesterday, 18:02' },
    { id: 'txn-5e9c', store: 'The Brew House', amountMinor: 2400, savedMinor: 480, goldMg: 0.8, points: 36, status: 'SETTLED', at: 'Tue, 08:15' },
    { id: 'txn-2d4f', store: 'Kona Roast', amountMinor: 4400, savedMinor: 0, goldMg: 0, points: 0, status: 'STOPPED', at: 'Sun, 11:26' }
  ],
  plSnapshots: [],
  audit: []
};

function money(minor) {
  return `AED ${(minor / 100).toFixed(2)}`;
}

function json(res, status, payload) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function totalMinor() {
  return state.basket.items.reduce((sum, item) => sum + item.unitMinor * item.quantity, 0);
}

function buildPreview() {
  const grossMinor = totalMinor();
  const guaranteedMinor = state.entitlements
    .filter((item) => item.status === 'ready')
    .reduce((sum, item) => sum + item.valueMinor, 0);
  const possibleMinor = state.entitlements
    .filter((item) => item.status === 'possible')
    .reduce((sum, item) => sum + item.valueMinor, 0);
  const netMinor = grossMinor - guaranteedMinor;
  const rail = state.rails
    .filter((item) => item.safe)
    .sort((a, b) => a.feeMinor - b.feeMinor || b.balanceMinor - a.balanceMinor)[0];
  const points = Math.floor(netMinor / 100);
  const goldMinor = Math.min(500, Math.floor(netMinor * 0.01));
  return {
    quoteId: state.session?.quoteId ?? `quote-${randomUUID().slice(0, 8)}`,
    seller: state.seller,
    basket: state.basket,
    grossMinor,
    guaranteedMinor,
    possibleMinor,
    netMinor,
    points,
    goldMinor,
    selectedRail: rail,
    floorMinor: state.buyer.floorMinor,
    refusalReasons: [
      'Newsletter code is Tier C and cannot reduce the guaranteed price.',
      'Visa Signature carries a sandbox card-not-present fee and would reduce the net benefit.'
    ],
    evidence: state.entitlements
  };
}

async function body(req) {
  let text = '';
  for await (const chunk of req) text += chunk;
  return text ? JSON.parse(text) : {};
}

async function api(req, res, pathname) {
  if (req.method === 'POST' && pathname === '/api/waitlist') {
    const payload = await body(req);
    if (!payload.email || !String(payload.email).includes('@')) {
      return json(res, 422, { error: 'A valid email is required.' });
    }
    const entry = {
      id: `wait-${randomUUID().slice(0, 8)}`,
      email: String(payload.email).trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      gold: { amount: 1, unit: 'mg', status: 'processing' }
    };
    state.onboarding.waitlist.push(entry);
    state.audit.push({ event: 'WAITLIST_JOINED', id: entry.id, at: entry.createdAt });
    return json(res, 201, entry);
  }

  if (req.method === 'POST' && pathname === '/api/account/create') {
    const payload = await body(req);
    if (!payload.name || !payload.mobile || !payload.email) {
      return json(res, 422, { error: 'Name, mobile and email are required.' });
    }
    state.onboarding.account = {
      id: `acct-${randomUUID().slice(0, 8)}`,
      name: String(payload.name).trim(),
      mobile: String(payload.mobile).trim(),
      email: String(payload.email).trim().toLowerCase(),
      status: 'ACTIVE_SANDBOX',
      createdAt: new Date().toISOString()
    };
    state.audit.push({ event: 'ACCOUNT_CREATED', id: state.onboarding.account.id, at: state.onboarding.account.createdAt });
    return json(res, 201, state.onboarding.account);
  }

  if (req.method === 'POST' && pathname === '/api/tap/exchange') {
    const payload = await body(req);
    if (!payload.kTag || !payload.buyerId || !Array.isArray(payload.capabilities)) {
      return json(res, 422, { error: 'K-Tag, buyer identity and approved capabilities are required.' });
    }
    state.onboarding.exchange = {
      id: `tap-${randomUUID().slice(0, 8)}`,
      kTag: String(payload.kTag),
      buyerId: String(payload.buyerId),
      capabilities: payload.capabilities.map((item) => String(item)),
      approvedAt: new Date().toISOString(),
      status: 'READY_FOR_INVOICE'
    };
    state.audit.push({
      event: 'BUYER_TAPPED_SELLER_KTAG',
      id: state.onboarding.exchange.id,
      capabilities: state.onboarding.exchange.capabilities,
      at: state.onboarding.exchange.approvedAt
    });
    return json(res, 201, {
      exchange: state.onboarding.exchange,
      seller: state.seller,
      message: 'Buyer-approved benefit and payment signals are ready for invoice pricing.'
    });
  }

  if (req.method === 'POST' && pathname === '/api/invoice/create') {
    if (!state.onboarding.exchange) {
      return json(res, 409, { error: 'Tap exchange must be completed before invoice creation.' });
    }
    const preview = buildPreview();
    const invoice = {
      id: `inv-${randomUUID().slice(0, 8)}`,
      reference: state.basket.reference,
      status: 'PENDING_BUYER_APPROVAL',
      seller: state.seller,
      items: state.basket.items,
      grossMinor: preview.grossMinor,
      discounts: preview.evidence.filter((item) => item.status === 'ready').map((item) => ({
        name: item.name,
        valueMinor: item.valueMinor,
        evidence: item.evidence
      })),
      guaranteedSavingsMinor: preview.guaranteedMinor,
      possibleSavingsMinor: preview.possibleMinor,
      payableMinor: preview.netMinor,
      pointsEarned: preview.points,
      pointsAfterPurchase: state.buyer.points + preview.points,
      goldEarnedMinor: preview.goldMinor,
      selectedRail: preview.selectedRail,
      exchangeId: state.onboarding.exchange.id
    };
    state.audit.push({ event: 'INVOICE_SHARED_TO_BUYER', id: invoice.id, at: new Date().toISOString() });
    return json(res, 201, invoice);
  }

  if (req.method === 'POST' && pathname === '/api/onboarding/permission') {
    const payload = await body(req);
    if (!['buyer', 'seller'].includes(payload.role) || !payload.id) {
      return json(res, 422, { error: 'Role and permission id are required.' });
    }
    state.onboarding.role = payload.role;
    state.onboarding.permissions[payload.id] = Boolean(payload.enabled);
    state.audit.push({
      event: payload.enabled ? 'PERMISSION_CONNECTED' : 'PERMISSION_REVOKED',
      role: payload.role,
      permission: payload.id,
      at: new Date().toISOString()
    });
    return json(res, 200, {
      role: payload.role,
      permissions: state.onboarding.permissions
    });
  }

  if (req.method === 'POST' && pathname === '/api/onboarding/qr') {
    const payload = await body(req);
    if (!payload.value || !['buyer', 'seller'].includes(payload.role)) {
      return json(res, 422, { error: 'Role and QR value are required.' });
    }
    state.onboarding.role = payload.role;
    state.onboarding.qr = {
      value: String(payload.value),
      status: 'ACTIVE',
      revocable: true,
      createdAt: new Date().toISOString()
    };
    state.audit.push({ event: 'UNIVERSAL_QR_CREATED', at: state.onboarding.qr.createdAt });
    return json(res, 201, state.onboarding.qr);
  }

  if (req.method === 'GET' && pathname === '/api/onboarding/readiness') {
    const permissions = Object.values(state.onboarding.permissions).filter(Boolean).length;
    return json(res, 200, {
      waitlist: state.onboarding.waitlist.length > 0,
      gold: { amount: 1, unit: 'mg', status: 'processing' },
      permissions,
      universalQr: state.onboarding.qr,
      account: state.onboarding.account,
      exchange: state.onboarding.exchange,
      accountCreation: { required: true, status: state.onboarding.account ? 'ACTIVE_SANDBOX' : 'NOT_STARTED' }
    });
  }

  if (req.method === 'GET' && pathname === '/api/bootstrap') {
    return json(res, 200, {
      mode: 'SANDBOX',
      buyer: state.buyer,
      seller: state.seller,
      basket: state.basket,
      entitlements: state.entitlements,
      rails: state.rails,
      preview: buildPreview(),
      audit: state.audit
    });
  }

  if (req.method === 'GET' && pathname === '/api/catalogue') {
    return json(res, 200, { seller: state.seller, items: state.catalogue });
  }

  if (req.method === 'GET' && pathname === '/api/savings-map') {
    const sources = state.savingsSources.map((source) => ({ ...source, status: source.status === 'connected' ? 'connected' : source.status }));
    return json(res, 200, {
      status: 'READY_TO_CONNECT',
      discovered: sources,
      connectedSavingsMinor: sources.filter((source) => source.status === 'connected').reduce((sum, source) => sum + source.expectedMinor, 0),
      lockedOpportunityMinor: sources.filter((source) => source.status === 'locked').reduce((sum, source) => sum + source.expectedMinor, 0)
    });
  }

  if (req.method === 'POST' && pathname === '/api/savings-map/connect') {
    const payload = await body(req);
    const source = state.savingsSources.find((candidate) => candidate.id === payload.sourceId);
    if (!source) return json(res, 404, { error: 'Savings source not found.' });
    source.status = 'connected';
    source.connectedAt = new Date().toISOString();
    state.audit.push({ event: 'SAVINGS_SOURCE_CONNECTED', source: source.id, at: source.connectedAt });
    return json(res, 200, { source, message: 'Source connected. Derived eligibility can now be checked.' });
  }

  if (req.method === 'POST' && pathname === '/api/catalogue/upload') {
    const payload = await body(req);
    const items = Array.isArray(payload.items) ? payload.items : [];
    const imported = items.filter((item) => item?.barcode && item?.name).map((item) => ({
      id: `sku-${randomUUID().slice(0, 8)}`,
      barcode: String(item.barcode),
      name: String(item.name),
      category: String(item.category || 'General'),
      priceMinor: Math.max(0, Number(item.priceMinor || 0)),
      stock: Math.max(0, Number(item.stock || 0)),
      daysStock: Math.max(0, Number(item.daysStock || 0)),
      image: String(item.image || '/assets/catalogue-water.svg')
    }));
    state.catalogue.push(...imported);
    state.audit.push({ event: 'CATALOGUE_IMPORTED', count: imported.length, at: new Date().toISOString() });
    return json(res, 201, { imported, total: state.catalogue.length });
  }

  if (req.method === 'PATCH' && pathname.startsWith('/api/catalogue/')) {
    const id = pathname.split('/').pop();
    const item = state.catalogue.find((candidate) => candidate.id === id);
    if (!item) return json(res, 404, { error: 'SKU not found.' });
    const payload = await body(req);
    for (const key of ['name', 'category', 'image']) {
      if (payload[key] !== undefined) item[key] = String(payload[key]);
    }
    for (const key of ['priceMinor', 'stock', 'daysStock']) {
      if (payload[key] !== undefined) item[key] = Math.max(0, Number(payload[key]));
    }
    return json(res, 200, item);
  }

  if (req.method === 'POST' && pathname === '/api/solver/preview') {
    const quoteId = `quote-${randomUUID().slice(0, 8)}`;
    state.session = { quoteId, status: 'AWAITING_APPROVAL', createdAt: new Date().toISOString() };
    const preview = buildPreview();
    state.audit.push({ event: 'PLAN_READY', quoteId, at: new Date().toISOString() });
    return json(res, 200, preview);
  }

  if (req.method === 'POST' && pathname === '/api/checkout/approve') {
    if (!state.session || state.session.status !== 'AWAITING_APPROVAL') {
      return json(res, 409, { error: 'No active quote awaiting approval.' });
    }
    const preview = buildPreview();
    state.session.status = 'SETTLED';
    state.buyer.points += preview.points;
    state.buyer.goldMinor += preview.goldMinor;
    state.audit.push({ event: 'APPROVED', quoteId: state.session.quoteId, at: new Date().toISOString() });
    state.audit.push({ event: 'SETTLED', quoteId: state.session.quoteId, at: new Date().toISOString() });
    return json(res, 200, {
      status: 'SETTLED',
      transactionId: `txn-${randomUUID().slice(0, 8)}`,
      quoteId: state.session.quoteId,
      paidMinor: preview.netMinor,
      rail: preview.selectedRail,
      rewards: {
        points: preview.points,
        pointsBalance: state.buyer.points,
        goldMinor: preview.goldMinor,
        goldBalanceMinor: state.buyer.goldMinor
      },
      receipt: { reference: state.basket.reference, matched: true, confidence: 0.98 }
    });
  }

  if (req.method === 'POST' && pathname === '/api/checkout/stop') {
    if (state.session && !['SETTLED', 'STOPPED'].includes(state.session.status)) {
      state.session.status = 'STOPPED';
      state.audit.push({ event: 'STOPPED', quoteId: state.session.quoteId, at: new Date().toISOString() });
    }
    return json(res, 200, { status: 'STOPPED', message: 'Quote revoked. No payment was attempted.' });
  }

  if (req.method === 'POST' && pathname === '/api/reconcile') {
    return json(res, 200, {
      status: 'MATCHED',
      confidence: 0.98,
      differences: [],
      categories: [
        { label: 'Cafe', minor: 2400, color: '#e0a83c' },
        { label: 'Grocery', minor: 3600, color: '#5f9f87' },
        { label: 'Membership', minor: 1200, color: '#8c7cf0' }
      ]
    });
  }

  // --- Journey: OTP, stores, vault, KYC ---
  if (req.method === 'POST' && pathname === '/api/otp/send') {
    const payload = await body(req);
    if (!payload.mobile && !payload.email) return json(res, 422, { error: 'Mobile or email required.' });
    state.audit.push({ event: 'OTP_SENT', mobile: payload.mobile, email: payload.email, at: new Date().toISOString() });
    return json(res, 200, { status: 'SENT', channels: [payload.mobile ? 'sms' : null, payload.email ? 'email' : null].filter(Boolean), expiresInSec: 120 });
  }

  if (req.method === 'POST' && pathname === '/api/otp/verify') {
    return json(res, 200, { status: 'VERIFIED', goldAward: { amount: 1, unit: 'mg', status: 'processing' }, message: 'Congratulations! 1 mg Gold cashback — earn more, save more.' });
  }

  if (req.method === 'GET' && pathname === '/api/stores') {
    return json(res, 200, { location: 'Dubai Marina', stores: state.stores });
  }

  if (req.method === 'GET' && pathname === '/api/vault') {
    return json(res, 200, { sections: state.vault });
  }

  if (req.method === 'POST' && pathname === '/api/vault/connect') {
    const payload = await body(req);
    const section = state.vault.find((s) => s.id === payload.id);
    if (!section) return json(res, 404, { error: 'Vault section not found.' });
    section.status = 'connected';
    if (!section.items.length) section.items.push({ name: `${section.label.replace('My ', '')} link`, value: `~${money(section.expectedMinor)} expected`, valid: 'Pending sync' });
    state.audit.push({ event: 'VAULT_SECTION_CONNECTED', id: section.id, at: new Date().toISOString() });
    return json(res, 200, section);
  }

  if (req.method === 'POST' && pathname === '/api/account/kyc') {
    const payload = await body(req);
    const steps = ['emirates-id-front', 'emirates-id-back', 'live-camera', 'aml-check'];
    const step = String(payload.step || '');
    if (!steps.includes(step)) return json(res, 422, { error: 'Unknown KYC step.' });
    state.audit.push({ event: 'KYC_STEP', step, at: new Date().toISOString() });
    const done = step === 'aml-check';
    if (done && !state.onboarding.account) {
      state.onboarding.account = { id: `acct-${randomUUID().slice(0, 8)}`, name: 'Navneet Sharma', status: 'ACTIVE_SANDBOX', createdAt: new Date().toISOString() };
    }
    return json(res, 200, { step, status: done ? 'ACCOUNT_CREATED' : 'STEP_OK', account: state.onboarding.account });
  }

  if (req.method === 'GET' && pathname === '/api/seller/dashboard') {
    const ins = state.sellerInsights;
    const f = state.sellerDashboard.focus;
    return json(res, 200, {
      focus: f,
      intelligence: {
        catalogue: { skus: state.catalogue.length, editableMenu: true, templates: 3, competitionAlerts: 2 },
        inventory: { low: state.catalogue.filter((i) => i.stock > 0 && i.stock <= 6).map((i) => ({ name: i.name, stock: i.stock })), over: state.catalogue.filter((i) => i.daysStock > 10).map((i) => ({ name: i.name, daysStock: i.daysStock })) },
        finance: { payablesMinor: 124000, receivablesMinor: 88000, pl: ins.pl, balanceSheetMinor: 421000 },
        instruments: [{ name: 'Account to Account (Aani)', status: 'active' }, { name: 'Cards', status: 'active' }, { name: 'Settlement T+1', status: 'scheduled' }],
        view: { cycle: 'monthly', plan: 'Growth' }
      }
    });
  }

  // --- Visiting cards ---
  if (req.method === 'POST' && pathname === '/api/card/create') {
    const payload = await body(req);
    if (!payload.name || !payload.profile) {
      return json(res, 422, { error: 'Name and profile are required.' });
    }
    const card = {
      id: `card-${++state.cardCounter}${randomUUID().slice(0, 4)}`,
      name: String(payload.name).trim(),
      title: String(payload.title || '').trim(),
      company: String(payload.company || '').trim(),
      location: String(payload.location || 'Abu Dhabi, UAE').trim(),
      mobile: String(payload.mobile || '').trim(),
      profile: String(payload.profile),
      template: String(payload.template || 'aurum'),
      createdAt: new Date().toISOString(),
      shared: 0
    };
    state.cards.push(card);
    state.audit.push({ event: 'VISITING_CARD_CREATED', id: card.id, profile: card.profile, at: card.createdAt });
    return json(res, 201, card);
  }

  if (req.method === 'GET' && pathname === '/api/cards') {
    return json(res, 200, { cards: state.cards });
  }

  if (req.method === 'POST' && pathname === '/api/card/exchange') {
    const payload = await body(req);
    const card = state.cards.find((item) => item.id === payload.cardId) || state.cards[0];
    if (!card) return json(res, 409, { error: 'Create a visiting card first.' });
    card.shared += 1;
    state.audit.push({ event: 'CARD_EXCHANGED', id: card.id, via: String(payload.via || 'nfc'), at: new Date().toISOString() });
    return json(res, 200, {
      status: 'EXCHANGED',
      via: payload.via === 'qr' ? 'qr' : 'nfc',
      card,
      received: { name: 'Rashid Al Mansoori', title: 'Founder, Marina Retail Group', profile: 'Professional' },
      message: 'Card exchanged. Their card arrived in your contacts.'
    });
  }

  // --- Buyer intelligence ---
  if (req.method === 'GET' && pathname === '/api/offers/nearby') {
    return json(res, 200, { location: 'Dubai Marina', offers: state.offers });
  }

  if (req.method === 'GET' && pathname === '/api/intelligence/expenses') {
    return json(res, 200, state.expenses);
  }

  if (req.method === 'POST' && pathname === '/api/intelligence/best-value') {
    const payload = await body(req);
    const grossMinor = Math.max(0, Number(payload.amountMinor || 3000));
    const options = [
      { id: 'bv-membership', label: 'Membership price', savingMinor: Math.round(grossMinor * 0.2), applies: true },
      { id: 'bv-points', label: 'Use 150 reward points', savingMinor: 300, applies: state.buyer.points >= 150 },
      { id: 'bv-voucher', label: 'Promo voucher KANZ10', savingMinor: Math.round(grossMinor * 0.1), applies: true },
      { id: 'bv-gold', label: 'Redeem Gold', savingMinor: Math.min(state.buyer.goldMinor, Math.round(grossMinor * 0.08)), applies: state.buyer.goldMinor > 0 }
    ];
    const best = options.filter((o) => o.applies).sort((a, b) => b.savingMinor - a.savingMinor)[0];
    const netMinor = grossMinor - (best?.savingMinor ?? 0);
    const rails = [...state.rails].sort((a, b) => a.feeMinor - b.feeMinor);
    return json(res, 200, {
      grossMinor,
      options,
      best,
      netMinor,
      effectiveMinor: netMinor,
      pointsEarned: Math.floor(netMinor / 100) * 2,
      goldEarnedMg: +(netMinor * 0.0008).toFixed(1),
      recommendedRail: rails[0],
      reason: 'Membership beats voucher this time. ADCB card adds 5% cashback.'
    });
  }

  // --- Seller intelligence ---
  if (req.method === 'GET' && pathname === '/api/seller/insights') {
    return json(res, 200, { store: state.seller, ...state.sellerInsights });
  }

  if (req.method === 'GET' && pathname === '/api/seller/alerts') {
    const grouped = {
      inventory: state.alerts.filter((a) => a.type === 'inventory'),
      payments: state.alerts.filter((a) => a.type === 'payable' || a.type === 'receivable'),
      business: state.alerts.filter((a) => a.type === 'business')
    };
    return json(res, 200, { alerts: state.alerts, grouped });
  }

  if (req.method === 'GET' && pathname === '/api/seller/customers') {
    return json(res, 200, {
      customers: state.customers,
      rewards: { pointsIssued: 12420, pointsDeltaPct: 18, goldIssuedMg: 248, goldDeltaPct: 22 }
    });
  }

  if (req.method === 'POST' && pathname === '/api/seller/offer/grant') {
    const payload = await body(req);
    const grant = {
      id: `grant-${randomUUID().slice(0, 8)}`,
      customerId: String(payload.customerId || ''),
      points: Math.max(0, Number(payload.points || 0)),
      goldMg: Math.max(0, Number(payload.goldMg || 0)),
      at: new Date().toISOString()
    };
    state.audit.push({ event: 'OFFER_GRANTED', ...grant });
    return json(res, 201, { status: 'GRANTED', grant });
  }

  if (req.method === 'POST' && pathname === '/api/seller/catalogue/import') {
    const payload = await body(req);
    const source = ['invoice', 'menu', 'inventory'].includes(payload.source) ? payload.source : 'invoice';
    const presets = {
      invoice: [
        { barcode: '6291100003310', name: 'Cappuccino', category: 'Beverages', priceMinor: 1800, stock: 999 },
        { barcode: '6291100003327', name: 'Club Sandwich', category: 'Food', priceMinor: 3200, stock: 60 },
        { barcode: '6291100003334', name: 'Cold Coffee', category: 'Beverages', priceMinor: 2200, stock: 80 }
      ],
      menu: [
        { barcode: '6291100004409', name: 'Butter Croissant', category: 'Food', priceMinor: 1800, stock: 40 },
        { barcode: '6291100004416', name: 'Date Cake', category: 'Desserts', priceMinor: 2100, stock: 18 }
      ],
      inventory: [
        { barcode: '6291100005508', name: 'Granola Cup XL', category: 'Grocery', priceMinor: 2100, stock: 24 }
      ]
    };
    const items = (Array.isArray(payload.items) && payload.items.length ? payload.items : presets[source])
      .filter((item) => item?.name)
      .map((item) => ({
        id: `sku-${randomUUID().slice(0, 8)}`,
        barcode: String(item.barcode || `6291${Math.floor(Math.random() * 1e7)}`),
        name: String(item.name),
        category: String(item.category || 'General'),
        priceMinor: Math.max(0, Number(item.priceMinor || 0)),
        stock: Math.max(0, Number(item.stock || 0)),
        daysStock: Math.max(0, Number(item.daysStock || Math.ceil(Number(item.stock || 0) / 6))),
        image: String(item.image || '/assets/scene-catalogue.png')
      }));
    state.catalogue.push(...items);
    state.audit.push({ event: 'CATALOGUE_AUTO_CREATED', source, count: items.length, at: new Date().toISOString() });
    return json(res, 201, { source, imported: items, total: state.catalogue.length, categories: [...new Set(state.catalogue.map((i) => i.category))] });
  }

  if (req.method === 'POST' && pathname === '/api/ktag/navigate') {
    return json(res, 200, {
      status: 'ROUTE_READY',
      destination: { name: state.seller.name, address: 'Marina Walk, Dubai Marina', distanceM: 280, walkMin: 4 },
      mapUrl: 'https://maps.google.com/?q=Dubai+Marina+Walk'
    });
  }

  // --- Admin & connector surface ---
  if (req.method === 'GET' && pathname === '/api/admin/settings') {
    return json(res, 200, state.adminSettings);
  }
  if (req.method === 'POST' && pathname === '/api/admin/settings') {
    const payload = await body(req);
    const scope = payload.scope === 'seller' ? 'seller' : 'buyer';
    state.adminSettings[scope] = { ...state.adminSettings[scope], ...(payload.settings || {}) };
    state.audit.push({ event: 'ADMIN_SETTINGS_UPDATED', scope, at: new Date().toISOString() });
    return json(res, 200, state.adminSettings[scope]);
  }
  if (req.method === 'POST' && pathname === '/api/sso/token') {
    const payload = await body(req);
    if (!payload.externalUserId || !payload.provider) return json(res, 422, { error: 'externalUserId and provider are required.' });
    const token = {
      token: `kzsso-${randomUUID()}`,
      issuedTo: String(payload.externalUserId),
      provider: String(payload.provider),
      scopes: Array.isArray(payload.scopes) && payload.scopes.length ? payload.scopes : ['profile:read', 'vault:read', 'pay:execute'],
      expiresInSec: 900,
      issuedAt: new Date().toISOString()
    };
    state.ssoTokens.push(token);
    state.audit.push({ event: 'SSO_TOKEN_ISSUED', provider: token.provider, at: token.issuedAt });
    return json(res, 201, token);
  }
  if (req.method === 'GET' && pathname === '/api/sync/export') {
    return json(res, 200, {
      exportedAt: new Date().toISOString(),
      buyer: state.buyer, seller: state.seller, vault: state.vault,
      catalogue: state.catalogue, cards: state.cards, adminSettings: state.adminSettings,
      auditTail: state.audit.slice(-50)
    });
  }
  if (req.method === 'POST' && pathname === '/api/sync/import') {
    const payload = await body(req);
    const applied = [];
    if (payload.buyer && typeof payload.buyer === 'object') { state.buyer = { ...state.buyer, ...payload.buyer }; applied.push('buyer'); }
    if (Array.isArray(payload.vault)) { for (const sec of payload.vault) { const s = state.vault.find((x) => x.id === sec.id); if (s) Object.assign(s, sec); } applied.push('vault'); }
    if (Array.isArray(payload.catalogue)) { state.catalogue.push(...payload.catalogue.filter((i) => i?.name)); applied.push('catalogue'); }
    if (payload.sellerSettings && typeof payload.sellerSettings === 'object') { state.adminSettings.seller = { ...state.adminSettings.seller, ...payload.sellerSettings }; applied.push('sellerSettings'); }
    if (payload.buyerSettings && typeof payload.buyerSettings === 'object') { state.adminSettings.buyer = { ...state.adminSettings.buyer, ...payload.buyerSettings }; applied.push('buyerSettings'); }
    if (!applied.length) return json(res, 422, { error: 'Nothing recognised to import.' });
    state.audit.push({ event: 'SYNC_IMPORT', applied, at: new Date().toISOString() });
    return json(res, 200, { status: 'APPLIED', applied });
  }

  if (req.method === 'GET' && pathname === '/api/transactions') {
    return json(res, 200, { transactions: state.transactions });
  }
  if (req.method === 'POST' && pathname === '/api/seller/pl/save') {
    const payload = await body(req);
    const snap = {
      id: `pl-${randomUUID().slice(0, 8)}`,
      month: String(payload.month || 'October 2026'),
      revenueMinor: Math.max(0, Number(payload.revenueMinor || 0)),
      cogsMinor: Math.max(0, Number(payload.cogsMinor || 0)),
      expensesMinor: Math.max(0, Number(payload.expensesMinor || 0)),
      netMinor: Math.max(0, Number(payload.revenueMinor || 0)) - Math.max(0, Number(payload.cogsMinor || 0)) - Math.max(0, Number(payload.expensesMinor || 0)),
      savedAt: new Date().toISOString()
    };
    state.plSnapshots = state.plSnapshots.filter((s) => s.month !== snap.month).concat(snap);
    state.sellerInsights.pl = { revenueMinor: snap.revenueMinor, cogsMinor: snap.cogsMinor, grossMinor: snap.revenueMinor - snap.cogsMinor, expensesMinor: snap.expensesMinor, netMinor: snap.netMinor };
    state.audit.push({ event: 'PL_SAVED', month: snap.month, at: snap.savedAt });
    return json(res, 201, { status: 'SAVED', snapshot: snap, count: state.plSnapshots.length });
  }

  if (req.method === 'POST' && pathname === '/api/events') {
    const payload = await body(req);
    if (!payload.type) return json(res, 422, { error: 'Event type is required.' });
    const type = String(payload.type);
    if (type === 'alert.raised' && payload.payload?.title) {
      state.alerts.push({ id: `al-${randomUUID().slice(0, 6)}`, type: payload.payload.kind || 'business', severity: payload.payload.severity || 'info', title: String(payload.payload.title), detail: String(payload.payload.detail || ''), action: String(payload.payload.action || 'View') });
    }
    state.audit.push({ event: 'EXTERNAL_EVENT', type, at: new Date().toISOString() });
    return json(res, 202, { status: 'ACCEPTED', type });
  }

  return json(res, 404, { error: 'Not found' });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  if (url.pathname.startsWith('/api/')) {
    try {
      await api(req, res, url.pathname);
    } catch {
      json(res, 400, { error: 'Invalid request.' });
    }
    return;
  }

  // SPA entry paths — buyer and seller each have their own landing URL
  const spaPaths = ['/', '/buyer', '/seller'];
  const requested = spaPaths.includes(url.pathname) ? 'index.html' : normalize(url.pathname).replace(/^[/\\]+/, '');
  const file = join(publicRoot, requested);
  if (!file.startsWith(publicRoot)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  try {
    const content = await readFile(file);
    const type = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    }[extname(file)] ?? 'application/octet-stream';
    res.writeHead(200, { 'content-type': `${type}; charset=utf-8` });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

export { api };

if (process.env.VERCEL !== '1') {
  server.listen(port, () => {
    console.log(`Kanzpay PACT sandbox listening on http://localhost:${port}`);
  });
}
