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

  const requested = url.pathname === '/' ? 'index.html' : normalize(url.pathname).replace(/^[/\\]+/, '');
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
