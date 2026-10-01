const app = document.querySelector('#app');
const toast = document.querySelector('#toast');

const state = {
  role: null,
  view: 'welcome',
  buyerStep: 0,
  sellerStep: 0,
  buyer: null,
  seller: null,
  sources: [],
  catalogue: [],
  account: null,
  invoice: null,
  receipt: null,
  sellerInvoiceStatus: 'pending',
  selectedModule: 'value-vault'
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
const get = async (path) => (await fetch(path)).json();
const post = async (path, payload = {}) => {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
};

function ambient() {
  return `<div class="v1-ambient v1-ambient-a"></div><div class="v1-ambient v1-ambient-b"></div><div class="v1-particles">${Array.from({ length: 38 }, (_, index) => `<i style="--i:${index};--x:${(index * 31) % 100}%;--y:${(index * 53) % 100}%;--d:${3 + index % 5 * .6}s"></i>`).join('')}</div>`;
}

function shell(content, options = {}) {
  const { back = false, dark = true, progress = 0, label = 'KANZPAY REWARDS · GOLD V1.0' } = options;
  return `<div class="v1-shell ${dark ? 'v1-dark' : ''}">${ambient()}
    <header class="v1-nav">
      <button class="v1-brand" data-action="home"><span class="v1-brand-mark">K</span><span>Kanzpay <b>Rewards</b></span></button>
      <div class="v1-nav-center"><span class="v1-live-dot"></span>${label}</div>
      <div class="v1-nav-actions"><button class="v1-role ${state.role === 'buyer' ? 'active' : ''}" data-action="role" data-role="buyer">Buyer</button><button class="v1-role ${state.role === 'seller' ? 'active' : ''}" data-action="role" data-role="seller">Seller</button>${back ? '<button class="v1-back" data-action="back">←</button>' : ''}</div>
    </header>
    ${progress ? `<div class="v1-progress"><span style="width:${progress}%"></span></div>` : ''}
    ${content}
    <footer class="v1-footer"><span>Kanzpay Rewards Gold V1.0</span><span>Sandbox journey · no live payments</span></footer>
  </div>`;
}

function welcome() {
  return `<main class="v1-welcome"><section class="v1-welcome-copy"><span class="v1-kicker"><i></i> THE INTELLIGENT VALUE LAYER</span><h1>Every reward<br><em>has a moment.</em></h1><p>One golden layer that moves with you — from the first tap to the final receipt.</p><div class="v1-welcome-actions"><button class="v1-gold-button" data-action="role" data-role="buyer">Enter as buyer <span>↗</span></button><button class="v1-glass-button" data-action="role" data-role="seller">Enter as seller <span>↗</span></button></div><button class="v1-story-button" data-action="story">◉ <span>See the Kanzpay flow</span></button></section><section class="v1-hero-orb"><div class="v1-orbit v1-orbit-one"></div><div class="v1-orbit v1-orbit-two"></div><div class="v1-gold-sphere"><strong>Au</strong><small>24K<br>VALUE</small></div><div class="v1-float-card"><span>GOLD REWARD</span><strong>+1 mg</strong><small>starts with one moment</small></div><span class="v1-hero-note">FLOWING INTELLIGENCE</span></section></main>`;
}

function story() {
  return shell(`<main class="v1-story"><div class="v1-story-visual"><div class="v1-gold-sphere small"><strong>Au</strong><small>1 mg</small></div><div class="v1-story-line"></div></div><div class="v1-story-copy"><span class="v1-kicker"><i></i> THE KANZPAY STORY</span><h1>Tap.<br><em>Unlock.</em><br>Keep more.</h1><p>Build a Value Vault, connect only what you approve, and let Kanzpay surface the right value before every decision.</p><div class="v1-story-steps"><span><b>01</b> Connect</span><span><b>02</b> Discover</span><span><b>03</b> Earn</span><span><b>04</b> Grow</span></div><button class="v1-gold-button" data-action="role" data-role="buyer">Start the buyer journey <span>↗</span></button></div></main>`, { back: true, label: 'THE KANZPAY STORY' });
}

function journeyScreen(config) {
  const { role, step, total, eyebrow, title, copy, visual, body, primary, secondary, action, progress } = config;
  return shell(`<main class="v1-journey"><section class="v1-journey-visual ${visual.className || ''}">${visual.content}<div class="v1-visual-caption">${visual.caption || ''}</div></section><section class="v1-journey-copy"><div class="v1-step-line"><span>${String(step).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span><i>${role.toUpperCase()} JOURNEY</i></div><span class="v1-kicker"><i></i> ${eyebrow}</span><h1>${title}</h1><p class="v1-copy">${copy}</p>${body || ''}${primary ? `<button class="v1-gold-button wide" data-action="${action}">${primary} <span>↗</span></button>` : ''}${secondary ? `<button class="v1-text-button" data-action="${secondary.action}">${secondary.label}</button>` : ''}</section></main>`, { back: true, progress, label: `${role.toUpperCase()} · ${eyebrow}` });
}

function buyerStart() {
  return journeyScreen({ role: 'buyer', step: 1, total: 4, eyebrow: 'TAP OR SCAN TO START', title: 'Your value<br><em>starts here.</em>', copy: 'Tap the seller K-Tag or scan a QR code. Kanzpay opens the right journey without moving anything you have not approved.', visual: { className: 'v1-counter-scene', content: '<div class="v1-ktag-large">K<span>•</span><small>K-TAG</small></div><div class="v1-scan-ring"></div>', caption: 'LUMA MARKET<br><em>ready for value.</em>' }, body: '<div class="v1-choice-list"><button class="v1-choice" data-action="buyer-tap"><span>⌁</span><div><b>Tap a K-Tag</b><small>Start instantly at a Kanzpay-ready seller.</small></div><em>TAP</em></button><button class="v1-choice" data-action="buyer-scan"><span>⌗</span><div><b>Scan a URL / QR</b><small>Open a seller or partner journey from camera.</small></div><em>SCAN</em></button></div>', secondary: { label: 'Already have an account? Sign in', action: 'buyer-existing' }, progress: 25 });
}

function buyerCheck() {
  return journeyScreen({ role: 'buyer', step: 2, total: 4, eyebrow: 'CHECK USER', title: 'Do we know<br><em>your value?</em>', copy: 'Existing users continue with their Value Vault. New users begin with a secure two-step identity check.', visual: { className: 'v1-identity-scene', content: '<div class="v1-glass-portrait"><span>WELCOME BACK</span><strong>Kanzpay<br><em>knows your value.</em></strong><small>Secure identity boundary</small></div>', caption: 'ONE VAULT<br><em>many moments.</em>' }, body: '<div class="v1-choice-list"><button class="v1-choice" data-action="buyer-existing"><span>◈</span><div><b>Existing user</b><small>Use your saved Value Vault and connected permissions.</small></div><em>YES</em></button><button class="v1-choice" data-action="buyer-new"><span>✦</span><div><b>New user</b><small>Build your vault with mobile and email verification.</small></div><em>NEW</em></button></div>', progress: 50 });
}

function buyerOtp() {
  return journeyScreen({ role: 'buyer', step: 2, total: 4, eyebrow: 'VERIFY MOBILE + EMAIL', title: 'Make it<br><em>yours.</em>', copy: 'Two one-time codes open your sandbox Value Vault. In production, these are delivered through the approved provider.', visual: { className: 'v1-otp-scene', content: '<div class="v1-otp-orbit"><strong>K</strong><i>✦</i><i>Au</i></div>', caption: 'PRIVATE BY DESIGN<br><em>permission first.</em>' }, body: '<div class="v1-form-card"><label>Name<input id="buyer-name" value="Maya Khan"></label><label>Mobile<input id="buyer-mobile" value="+971 50 000 0000"></label><label>Email<input id="buyer-email" value="maya@example.com"></label><div class="v1-otp-row"><input value="2"><input value="4"><input value="8"><input value="6"></div><small>Sandbox demo: any four digits are accepted.</small></div>', primary: 'Verify and open vault', action: 'buyer-verify', progress: 50 });
}

function buyerVault() {
  const sources = [
    ['rewards', '◎', 'Reward points', 'Bring eligible balances together.'],
    ['memberships', '✦', 'Memberships', 'Apply member pricing at the right moment.'],
    ['promocodes', '◇', 'Promocodes', 'Find and compare merchant offers.'],
    ['vouchers', '▣', 'Vouchers & coupons', 'Keep expiring value visible.'],
    ['cards', '◌', 'Cards & BIN offers', 'Evaluate issuer benefits before pay.'],
    ['accounts', '⌁', 'Accounts & rails', 'Choose a safe payment route.']
  ];
  return journeyScreen({ role: 'buyer', step: 3, total: 4, eyebrow: 'BUILD MY VALUE VAULT', title: 'Let value<br><em>find you.</em>', copy: 'Choose one source at a time. Kanzpay shows the permission, provenance and opportunity before it connects.', visual: { className: 'v1-vault-scene', content: '<div class="v1-vault-stack"><span>VALUE VAULT</span><strong>1 mg<br><em>Gold credited.</em></strong><small>EARN MORE · SAVE MORE</small></div>', caption: 'YOUR SIGNALS<br><em>your control.</em>' }, body: `<div class="v1-source-grid">${sources.map(([id, icon, title, description]) => `<button class="v1-source-chip" data-action="connect-source" data-source="${id}"><span>${icon}</span><div><b>${title}</b><small>${description}</small></div><em>CONNECT</em></button>`).join('')}</div>`, primary: 'Save my Value Vault', action: 'buyer-account', progress: 75 });
}

function buyerAccount() {
  return journeyScreen({ role: 'buyer', step: 4, total: 4, eyebrow: 'CREATE ACCOUNT', title: 'Your Gold<br><em>vault awaits.</em>', copy: 'Create the account boundary that keeps your savings, receipts, Gold and permissions together.', visual: { className: 'v1-account-scene', content: '<div class="v1-gold-sphere small"><strong>Au</strong><small>VAULT</small></div><div class="v1-account-ring"></div>', caption: 'ACCOUNT CREATED<br><em>GOLD REWARD READY.</em>' }, body: '<div class="v1-form-card compact"><label>Full name<input id="account-name" value="Maya Khan"></label><label>Mobile<input id="account-mobile" value="+971 50 000 0000"></label><label>Email<input id="account-email" value="maya@example.com"></label><div class="v1-document-line"><span>▧</span><div><b>Emirates ID verification</b><small>Document crop, photo match and AML check.</small></div><em>READY</em></div></div>', primary: 'Create account & open cockpit', action: 'create-account', progress: 100 });
}

function buyerCockpit() {
  const buyer = state.buyer || { name: 'Maya Khan', points: 1840, goldMinor: 1260 };
  const modules = [
    ['value-vault', '✦', 'My Value Vault', 'Memberships · rewards · promocodes · vouchers'],
    ['visiting-card', '▣', 'My Visiting Card', 'Profile, modes, templates and share'],
    ['friends', '♧', 'Earn with friends', 'Another share + text link'],
    ['gold-vault', 'Au', 'My Gold Vault', 'Weight, value, buy, sell, gift'],
    ['expenses', '⌁', 'My Expenses', 'Daily · weekly · monthly · yearly'],
    ['payments', '◌', 'Payment intelligence', 'Evaluate instruments and ask approval']
  ];
  return shell(`<main class="v1-cockpit"><div class="v1-cockpit-hero"><div><span class="v1-kicker"><i></i> BUYER · COCKPIT</span><h1>${esc(buyer.name.split(' ')[0])}, your value<br><em>is already moving.</em></h1><p>All approved modules in one flowing Value Vault.</p></div><div class="v1-cockpit-orb"><span>Au</span><small>MY GOLD VAULT</small><strong>${(buyer.goldMinor / 1000).toFixed(3)} mg</strong></div></div><div class="v1-cockpit-tabs"><button class="active">Cockpit</button><button data-action="buyer-module">My Value Vault</button><button data-action="buyer-sources">Connections</button><button data-action="buyer-expenses">Expenses</button></div><section class="v1-metric-row"><article><small>MY REWARD POINTS</small><strong>${buyer.points.toLocaleString()}</strong><span>+12% this month</span></article><article><small>VALUE FOUND</small><strong>AED 42.80</strong><span>across 8 transactions</span></article><article><small>GOLD WEIGHT</small><strong>${(buyer.goldMinor / 1000).toFixed(3)} mg</strong><span>updated today</span></article></section><section class="v1-module-grid">${modules.map(([id, icon, title, copy]) => `<button class="v1-module-card" data-action="buyer-module" data-module="${id}"><span>${icon}</span><div><b>${title}</b><small>${copy}</small></div><strong>↗</strong></button>`).join('')}</section><section class="v1-counter-cta"><div><span class="v1-kicker"><i></i> AT THE COUNTER</span><h2>Tap a K-Tag.<br><em>Keep the good.</em></h2><p>See every approved saving before the bill.</p><button class="v1-gold-button" data-action="buyer-tap-flow">Tap Luma Market <span>↗</span></button></div><div class="v1-counter-token"><div class="v1-ktag-small">K<span>•</span></div><small>LUMA MARKET</small></div></section></main>`, { back: true, label: 'BUYER · VALUE VAULT' });
}

function buyerModule() {
  const module = state.selectedModule;
  const config = {
    'value-vault': ['MY VALUE VAULT', 'Everything useful,<br><em>in one view.</em>', 'Your connected programs stay visible, explainable and permissioned.', [['My Memberships', 'Fazaa · ready', '− AED 4.20'], ['My Reward Points', '1 point / AED', '1,840 pts'], ['My Promocodes', '2 eligible offers', 'Review'], ['My Vouchers', '3 coupons saved', 'Review']]],
    'visiting-card': ['MY VISITING CARD', 'Share the right<br><em>version of you.</em>', 'Choose a profile, mode and template before you share.', [['Default profile', 'Maya Khan · active', 'Edit'], ['Share channels', 'WhatsApp · SMS · email', 'Choose'], ['Card mode', 'Buyer profile', 'Switch'], ['Template', 'Gold line', 'Change']]],
    friends: ['EARN WITH FRIENDS', 'Value grows<br><em>together.</em>', 'Another share + text link makes a useful introduction.', [['Friends joined', '04 people', '+1 Gold'], ['Invite link', 'Ready to share', 'Copy'], ['Gift options', 'Physical · digital · gold', 'Open'], ['Rewards', 'Referral value', 'View']]],
    'gold-vault': ['MY GOLD VAULT', 'Weight you can<br><em>feel.</em>', 'Track how each purchase becomes fractional Gold.', [['Current weight', '1.260 mg', 'View'], ['Gold value', 'AED 126.00', 'Open'], ['Use Gold', 'Buy · sell · redeem · gift', 'Choose'], ['Last earn', 'LM-1048 · +0.066 mg', 'Receipt']]],
    expenses: ['MY EXPENSES', 'See the rhythm<br><em>of your life.</em>', 'Daily, weekly, monthly and yearly views make the pattern visible.', [['Today', 'AED 66.00', 'Open'], ['This week', 'AED 242.40', 'Open'], ['This month', 'AED 884.10', 'Open'], ['Year to date', 'AED 7,421.00', 'Open']]],
    payments: ['PAYMENT INTELLIGENCE', 'Choose the<br><em>better route.</em>', 'Kanzpay evaluates benefits and fees, then asks for your approval.', [['Aani', 'Safe · instant · no fee', 'Recommended'], ['Jaywan debit', 'Domestic debit rail', 'Compare'], ['Visa Signature', 'Offer active · fee applies', 'Review'], ['Approval', 'Required before recommendation', 'Set']]]
  }[module] || [];
  return shell(`<main class="v1-detail"><div class="v1-detail-hero"><span class="v1-kicker"><i></i> BUYER · ${config[0]}</span><h1>${config[1]}</h1><p>${config[2]}</p></div><section class="v1-detail-list">${config[3].map(([name, value, action]) => `<article><span class="v1-detail-icon">✦</span><div><b>${name}</b><small>${value}</small></div><strong>${action}</strong></article>`).join('')}</section><button class="v1-gold-button" data-action="buyer-cockpit">Back to cockpit <span>↗</span></button></main>`, { back: true, label: `BUYER · ${config[0]}` });
}

function buyerTap() {
  return shell(`<main class="v1-tap"><section class="v1-tap-visual"><div class="v1-ktag-large">K<span>•</span><small>K-TAG</small></div><div class="v1-tap-wave"></div><div class="v1-tap-phone"><span>⌁</span><div><b>Luma Market</b><small>Seller K-Tag detected · Dubai Marina</small></div><i>READY</i></div></section><section class="v1-tap-copy"><span class="v1-kicker"><i></i> BUYER · TAP K-TAG</span><h1>Share only<br><em>what helps.</em></h1><p>Review the capabilities that may be used to price your basket. You remain in control.</p><div class="v1-capability-list">${['Memberships', 'Reward points', 'Promocodes', 'Vouchers', 'Cards & BIN offers', 'Safe payment rails'].map((item) => `<span>✓ ${item}</span>`).join('')}</div><button class="v1-gold-button wide" data-action="create-invoice">Approve exchange & get invoice <span>↗</span></button><button class="v1-text-button" data-action="buyer-cockpit">Cancel</button></section></main>`, { back: true, label: 'BUYER · BENEFIT EXCHANGE' });
}

function buyerInvoice() {
  const invoice = state.invoice;
  if (!invoice) return buyerTap();
  return shell(`<main class="v1-invoice"><section class="v1-invoice-visual"><span class="v1-kicker"><i></i> INVOICE READY · ${esc(invoice.reference)}</span><h1>Review the<br><em>golden part.</em></h1><div class="v1-paper-invoice"><div><span>Basket</span><b>${money(invoice.grossMinor)}</b></div><div class="saving"><span>Fazaa member</span><b>− ${money(420)}</b></div><div class="saving"><span>Visa BIN offer</span><b>− ${money(180)}</b></div><div class="total"><span>Final amount</span><strong>${money(invoice.payableMinor)}</strong></div></div></section><section class="v1-invoice-copy"><span class="v1-kicker"><i></i> BUYER · APPROVE INVOICE</span><h2>Good value,<br><em>before pay.</em></h2><div class="v1-reward-result"><small>YOU GET BACK</small><strong>+${invoice.pointsEarned}</strong><span>points · ${money(invoice.goldEarnedMinor)} Gold</span><i>Balance after: ${invoice.pointsAfterPurchase.toLocaleString()} points</i></div><div class="v1-rail"><span>●</span><div><b>Recommended rail · ${esc(invoice.selectedRail?.name || 'Aani')}</b><small>Safe, instant account-to-account · no fee</small></div></div><button class="v1-gold-button wide" data-action="approve-invoice">Approve & pay <span>↗</span></button><button class="v1-text-button" data-action="stop-invoice">STOP · DON’T PAY</button></section></main>`, { back: true, label: 'BUYER · INVOICE REVIEW' });
}

function buyerReceipt() {
  const result = state.receipt || {};
  return shell(`<main class="v1-receipt"><div class="v1-receipt-coin">✓</div><span class="v1-kicker"><i></i> PAYMENT COMPLETE · RECEIPT RECONCILED</span><h1>Good<br><em>choice.</em></h1><p>Your value came back before the transaction left the room.</p><section class="v1-receipt-card"><div><span>Luma Market · LM-1048</span><strong>${money(result.paidMinor || 6600)}</strong></div><div class="v1-receipt-stats"><article><b>− AED 6.00</b><small>saved</small></article><article><b>+${result.rewards?.points || 66}</b><small>points</small></article><article><b>+0.066</b><small>mg Gold</small></article></div><small>Receipt matched automatically · confidence 98%</small></section><button class="v1-gold-button" data-action="buyer-cockpit">Back to cockpit <span>↗</span></button></main>`, { label: 'BUYER · RECONCILED RECEIPT' });
}

function sellerStart() {
  return journeyScreen({ role: 'seller', step: 1, total: 4, eyebrow: 'START ONBOARDING', title: 'Open your<br><em>business layer.</em>', copy: 'Install K-Assistant, choose your business type, add your store identity and connect a K-Tag.', visual: { className: 'v1-seller-scene', content: '<div class="v1-seller-card"><span>K-ASSISTANT</span><strong>Luma<br><em>Market</em></strong><small>SELLER SETUP</small></div>', caption: 'ONE STORE<br><em>many signals.</em>' }, body: '<div class="v1-form-card"><div class="v1-field-grid"><div><small>Business type</small><b>Retail & cafe</b></div><div><small>Location</small><b>Dubai Marina</b></div><div><small>Logo</small><b>Ready to add</b></div><div><small>K-Tag</small><b>K-LUMA-001</b></div></div></div>', primary: 'Install K-Assistant', action: 'seller-install', progress: 25 });
}

function sellerInstall() {
  return journeyScreen({ role: 'seller', step: 1, total: 4, eyebrow: 'K-ASSISTANT INSTALLATION', title: 'Intelligence<br><em>in the background.</em>', copy: 'Choose where K-Assistant runs, then connect the store K-Tag.', visual: { className: 'v1-assistant-scene', content: '<div class="v1-assistant-orbit"><strong>K</strong><i>✦</i><i>Au</i></div>', caption: 'K-ASSISTANT<br><em>ACTIVE.</em>' }, body: '<div class="v1-choice-list"><button class="v1-choice selected"><span>⌘</span><div><b>Mobile or desktop</b><small>Android, iOS, Mac or Windows.</small></div><em>SELECTED</em></button><button class="v1-choice"><span>⌗</span><div><b>Scan K-Tag</b><small>Connect your physical store identifier.</small></div><em>READY</em></button></div><div class="v1-success">K-Assistant installed in sandbox mode. Next: verify your business identity.</div>', primary: 'Verify business', action: 'seller-docs', progress: 35 });
}

function sellerDocs() {
  return journeyScreen({ role: 'seller', step: 1, total: 4, eyebrow: 'IDENTITY + DOCUMENT CHECK', title: 'Trust the<br><em>right documents.</em>', copy: 'Upload Emirates ID front and back, plus the commercial licence. The production camera guides crop, edit, photo match and AML checks.', visual: { className: 'v1-document-scene', content: '<div class="v1-document-card"><span>EMIRATES ID</span><strong>✓</strong><small>PHOTO MATCH<br>AML CHECK</small></div>', caption: 'VERIFIED<br><em>BUSINESS IDENTITY.</em>' }, body: `<div class="v1-upload-list">${['Emirates ID · front', 'Emirates ID · back', 'Commercial licence'].map((item) => `<div class="v1-upload-row"><span>▧</span><div><b>${item}</b><small>Camera or upload · crop and edit</small></div><em>UPLOADED</em></div>`).join('')}</div><div class="v1-success">Photo match and AML check passed for this sandbox journey.</div>`, primary: 'Set buyer value rules', action: 'seller-rules', progress: 50 });
}

function sellerRules() {
  return journeyScreen({ role: 'seller', step: 2, total: 4, eyebrow: 'VALUE RULES', title: 'Price with<br><em>care.</em>', copy: 'Set the value rules K-Assistant may apply before the invoice is printed or shared.', visual: { className: 'v1-rules-scene', content: '<div class="v1-rules-card"><span>STORE RULES</span><strong>12%<br><em>value back.</em></strong><small>VERSION 12 · ACTIVE</small></div>', caption: 'YOUR RULES<br><em>YOUR ADVANTAGE.</em>' }, body: '<div class="v1-rule-grid"><div><span>Membership discount</span><b>12%</b></div><div><span>Voucher / promo</span><b>Allowed</b></div><div><span>Reward points</span><b>1 / AED</b></div><div><span>Preferred instruments</span><b>Enabled</b></div><div><span>Points formula</span><b>GMV ÷ 100</b></div><div><span>Gold formula</span><b>GMV ÷ 1000</b></div></div>', primary: 'Generate invoice', action: 'seller-invoice', progress: 65 });
}

function sellerInvoice() {
  return journeyScreen({ role: 'seller', step: 3, total: 4, eyebrow: 'GENERATE + SHARE INVOICE', title: 'Send value<br><em>before print.</em>', copy: 'K-Assistant receives the approved buyer signals, applies your rules, and shares the invoice through the buyer’s chosen path.', visual: { className: 'v1-invoice-scene', content: '<div class="v1-seller-invoice"><span>INVOICE READY</span><strong>AED 66.00</strong><small>LM-1048 · MAYA KHAN</small><i>− AED 6.00 value applied</i></div>', caption: 'READY TO SHARE<br><em>BEFORE PAYMENT.</em>' }, body: '<div class="v1-share-grid"><button class="v1-share-card" data-action="seller-status"><span>⌁</span><b>Share via K-Assistant</b><small>Buyer receives it instantly.</small></button><button class="v1-share-card" data-action="seller-status"><span>▤</span><b>Print / QR share</b><small>Physical or scannable copy.</small></button></div>', primary: 'View invoice status', action: 'seller-status', progress: 80 });
}

function sellerStatus() {
  const statuses = [
    ['pending', 'Pending', 'Waiting for buyer approval', 'Check if buyer needs help to process'],
    ['paid', 'Paid', 'Buyer approved and settlement matched', 'Markbook'],
    ['rejected', 'Rejected', 'Buyer declined the invoice', 'Ask buyer reason'],
    ['process', 'In process', 'K-Assistant is checking next action', 'Check next process']
  ];
  return shell(`<main class="v1-status"><div class="v1-status-head"><span class="v1-kicker"><i></i> SELLER · VIEW STATUS OF INVOICE</span><h1>Every invoice,<br><em>clear at a glance.</em></h1><p>Use the status to decide the next store action.</p></div><section class="v1-status-grid">${statuses.map(([id, title, copy, action]) => `<button class="v1-status-card ${state.sellerInvoiceStatus === id ? 'active' : ''}" data-action="select-status" data-status="${id}"><i></i><div><b>${title}</b><small>${copy}</small></div><strong>${action} →</strong></button>`).join('')}</section><div class="v1-status-actions"><button class="v1-gold-button" data-action="seller-cockpit">Dashboard · all-store dropdown <span>↗</span></button><button class="v1-text-button" data-action="seller-status">Refresh status</button></div></main>`, { back: true, progress: 90, label: 'SELLER · INVOICE STATUS' });
}

function sellerCockpit() {
  return shell(`<main class="v1-seller-cockpit"><div class="v1-seller-hero"><div><span class="v1-kicker"><i></i> SELLER · DASHBOARD</span><h1>Good morning.<br><em>Let’s run it well.</em></h1><p>All-store dropdown, orders, catalogue, finance and intelligence.</p></div><div class="v1-k-tag-live"><i></i> K-Tag live</div><div class="v1-seller-value"><span>K</span><small>VALUE RETURNED</small><strong>AED 8.4k</strong><em>+12.8%</em></div></div><nav class="v1-seller-nav"><button class="active">All stores</button><button data-action="seller-orders">Orders</button><button data-action="seller-catalogue">Catalogue</button><button data-action="seller-finance">Finance</button><button data-action="seller-payments">Payment instruments</button><button data-action="seller-intelligence">Intelligence</button></nav><section class="v1-seller-metrics"><article><small>TO ACTION</small><strong>04</strong><span>orders waiting</span></article><article><small>VALUE</small><strong>AED 8.4k</strong><span>today · +12.8%</span></article><article><small>STOCK</small><strong>86%</strong><span>healthy shelf</span></article><article><small>REPEAT CUSTOMERS</small><strong>38%</strong><span>this month</span></article></section><section class="v1-seller-grid"><article class="v1-orders"><div class="v1-panel-head"><span class="v1-kicker"><i></i> TRANSACTION COMMISSION</span><button class="v1-text-button" data-action="seller-orders">View all →</button></div>${[['#1048 · Maya Khan', 'Pending buyer approval', 'AED 66', 'live'], ['#1047 · Sarah Ali', 'Paid · receipt matched', 'AED 128', 'done'], ['Granola cup', 'Low stock · 4 left', 'Restock', 'warn']].map(([name, copy, value, status]) => `<div class="v1-order-row"><i class="${status}"></i><div><b>${name}</b><small>${copy}</small></div><strong>${value}</strong><button data-action="${name.startsWith('#1048') ? 'seller-status' : 'seller-catalogue'}">Open</button></div>`).join('')}</article><article class="v1-intelligence"><span class="v1-kicker"><i></i> K-ASSISTANT</span><h2>Your store<br><em>is learning.</em></h2><div><b>Repeat customers</b><small>+8% vs last period</small></div><div><b>Best value lever</b><small>Membership discounts</small></div><button class="v1-gold-button" data-action="seller-rules">Tune rules ↗</button></article></section></main>`, { back: true, label: 'SELLER · ALL-STORE INTELLIGENCE' });
}

function sellerPanel(title, copy, rows) {
  return shell(`<main class="v1-panel-page"><span class="v1-kicker"><i></i> SELLER · ${title.toUpperCase()}</span><h1>Store signals,<br><em>ready to act.</em></h1><p>${copy}</p><section class="v1-panel-list">${rows.map(([name, description, value]) => `<article><span class="v1-panel-icon">✦</span><div><b>${name}</b><small>${description}</small></div><strong>${value}</strong><button class="v1-text-button">Open →</button></article>`).join('')}</section><button class="v1-gold-button" data-action="seller-cockpit">Back to cockpit <span>↗</span></button></main>`, { back: true, label: `SELLER · ${title}` });
}

function sellerCatalogue() {
  const items = state.catalogue.length ? state.catalogue : [
    { name: 'Ethiopian cold brew', priceMinor: 2400, stock: 18, daysStock: 2, image: '/assets/catalogue-coffee.svg' },
    { name: 'Granola cup', priceMinor: 1800, stock: 4, daysStock: 1, image: '/assets/catalogue-granola.svg' },
    { name: 'Still water 500ml', priceMinor: 500, stock: 148, daysStock: 12, image: '/assets/catalogue-water.svg' }
  ];
  return shell(`<main class="v1-catalogue"><div class="v1-catalogue-head"><div><span class="v1-kicker"><i></i> SELLER · CATALOGUE</span><h1>Edit the shelf.<br><em>Read the signal.</em></h1></div><button class="v1-gold-button" data-action="seller-cockpit">Business cockpit <span>↗</span></button></div><div class="v1-catalogue-toolbar"><span>Competition price SKU · menu templates · low stock list</span><button class="v1-text-button">Upload catalogue +</button></div><section class="v1-product-grid">${items.map((item) => `<article><img src="${esc(item.image)}" alt=""><div><b>${esc(item.name)}</b><small>AED ${(Number(item.priceMinor) / 100).toFixed(0)} · ${item.stock} left · ${item.daysStock || 2} days</small></div><button class="v1-text-button">Edit SKU</button></article>`).join('')}</section></main>`, { back: true, label: 'SELLER · CATALOGUE' });
}

function render() {
  const views = {
    welcome, story, 'buyer-start': buyerStart, 'buyer-check': buyerCheck, 'buyer-otp': buyerOtp, 'buyer-vault': buyerVault,
    'buyer-account': buyerAccount, 'buyer-cockpit': buyerCockpit, 'buyer-module': buyerModule, 'buyer-tap': buyerTap,
    'buyer-invoice': buyerInvoice, 'buyer-receipt': buyerReceipt, 'seller-start': sellerStart, 'seller-install': sellerInstall,
    'seller-docs': sellerDocs, 'seller-rules': sellerRules, 'seller-invoice': sellerInvoice, 'seller-status': sellerStatus,
    'seller-cockpit': sellerCockpit, 'seller-orders': () => sellerPanel('ORDERS', 'Pending requests, paid history, tickets and repeat-customer signals.', [['#1048 · Maya Khan', 'Pending buyer approval', 'AED 66'], ['#1047 · Sarah Ali', 'Paid · receipt matched', 'AED 128'], ['#1046 · Omar Hassan', 'Rejected · ask reason', 'AED 42']]),
    'seller-catalogue': sellerCatalogue, 'seller-finance': () => sellerPanel('FINANCE', 'Payables, receivables, P&L and balance sheet snapshots.', [['Payables vs receivables', 'AED 12.4k receivable · AED 3.1k payable', 'View'], ['P&L', 'Gross margin +18.4% this month', 'Open'], ['Balance sheet', 'Updated today at 09:42', 'View']]),
    'seller-payments': () => sellerPanel('PAYMENT INSTRUMENTS', 'Cards, accounts, settlement and payment cycles.', [['Cards', 'BIN-linked offers enabled', 'Enabled'], ['Account to account', 'Aani settlement live', 'Live'], ['Settlement', 'Next cycle Friday', 'View']]),
    'seller-intelligence': () => sellerPanel('INTELLIGENCE', 'Customer trends, ticket size and repeat-customer signals.', [['Customer trends', '+8% repeat customers vs last period', 'Open'], ['Walk-in / repeat', '38% repeat customers', 'View'], ['Average ticket size', 'AED 74.20 · +6.1%', 'View']])
  };
  app.innerHTML = (views[state.view] || welcome)();
}

async function loadBootstrap() {
  const result = await get('/api/bootstrap');
  state.buyer = result.buyer;
  state.seller = result.seller;
}
async function loadSources() {
  const result = await get('/api/savings-map');
  state.sources = result.discovered || [];
}
async function loadCatalogue() {
  const result = await get('/api/catalogue');
  state.catalogue = result.items || [];
}

document.addEventListener('click', async (event) => {
  const element = event.target.closest('[data-action]');
  if (!element) return;
  const action = element.dataset.action;
  if (action === 'home') { state.role = null; state.view = 'welcome'; render(); return; }
  if (action === 'story') { state.view = 'story'; render(); return; }
  if (action === 'role') { state.role = element.dataset.role; state.view = state.role === 'buyer' ? 'buyer-start' : 'seller-start'; render(); return; }
  if (action === 'back') { state.view = state.role === 'buyer' ? 'buyer-cockpit' : state.role === 'seller' ? 'seller-cockpit' : 'welcome'; render(); return; }
  if (action === 'buyer-tap' || action === 'buyer-scan') { state.view = 'buyer-check'; render(); return; }
  if (action === 'buyer-existing' || action === 'buyer-new') { state.view = 'buyer-otp'; render(); return; }
  if (action === 'buyer-verify') { const payload = { name: document.querySelector('#buyer-name')?.value || 'Maya Khan', mobile: document.querySelector('#buyer-mobile')?.value || '+971 50 000 0000', email: document.querySelector('#buyer-email')?.value || 'maya@example.com' }; state.account = await post('/api/account/create', payload); if (state.account.error) return notify(state.account.error, 'error'); state.view = 'buyer-vault'; notify('Identity verified. Build your Value Vault.', 'success'); render(); return; }
  if (action === 'connect-source') { await loadSources(); const source = state.sources.find((item) => item.id === element.dataset.source); if (source?.status === 'locked') return notify('This provider needs its official connection first.'); const result = await post('/api/savings-map/connect', { sourceId: element.dataset.source }); if (result.error) return notify(result.error, 'error'); notify('Permission approved. Value source connected.', 'success'); return; }
  if (action === 'buyer-account') { state.view = 'buyer-account'; render(); return; }
  if (action === 'create-account') { const payload = { name: document.querySelector('#account-name')?.value || 'Maya Khan', mobile: document.querySelector('#account-mobile')?.value || '+971 50 000 0000', email: document.querySelector('#account-email')?.value || 'maya@example.com' }; state.account = await post('/api/account/create', payload); if (state.account.error) return notify(state.account.error, 'error'); await loadBootstrap(); state.view = 'buyer-cockpit'; notify('Value Vault opened. 1 mg Gold is processing.', 'success'); render(); return; }
  if (action === 'buyer-cockpit') { state.role = 'buyer'; state.view = 'buyer-cockpit'; await loadBootstrap(); render(); return; }
  if (action === 'buyer-module') { state.selectedModule = element.dataset.module || 'value-vault'; state.view = 'buyer-module'; render(); return; }
  if (action === 'buyer-sources') { await loadSources(); state.view = 'buyer-vault'; render(); return; }
  if (action === 'buyer-expenses') { state.selectedModule = 'expenses'; state.view = 'buyer-module'; render(); return; }
  if (action === 'buyer-tap-flow') { state.view = 'buyer-tap'; render(); return; }
  if (action === 'create-invoice') { const exchange = await post('/api/tap/exchange', { kTag: 'K-LUMA-001', buyerId: state.account?.id || 'buyer-maya', capabilities: ['memberships', 'rewards', 'promocodes', 'vouchers', 'cards', 'accounts'] }); if (exchange.error) return notify(exchange.error, 'error'); state.invoice = await post('/api/invoice/create'); if (state.invoice.error) return notify(state.invoice.error, 'error'); state.view = 'buyer-invoice'; notify('Approved signals priced. Invoice ready.', 'success'); render(); return; }
  if (action === 'approve-invoice') { await post('/api/solver/preview'); state.receipt = await post('/api/checkout/approve'); if (state.receipt.error) return notify(state.receipt.error, 'error'); state.view = 'buyer-receipt'; notify('Payment approved. Gold is on its way.', 'success'); render(); return; }
  if (action === 'stop-invoice') { await post('/api/checkout/stop'); state.invoice = null; state.view = 'buyer-cockpit'; notify('Stopped. Nothing was paid.'); render(); return; }
  if (action === 'seller-install') { await post('/api/onboarding/permission', { role: 'seller', id: 'business-account', enabled: true }); state.view = 'seller-install'; render(); return; }
  if (action === 'seller-docs') { state.view = 'seller-docs'; render(); return; }
  if (action === 'seller-rules') { state.view = 'seller-rules'; render(); return; }
  if (action === 'seller-invoice') { state.view = 'seller-invoice'; render(); return; }
  if (action === 'seller-status') { state.view = 'seller-status'; render(); return; }
  if (action === 'select-status') { state.sellerInvoiceStatus = element.dataset.status; notify(`${element.dataset.status} status selected.`, 'success'); render(); return; }
  if (action === 'seller-cockpit') { state.role = 'seller'; state.view = 'seller-cockpit'; render(); return; }
  if (action === 'seller-orders') { state.view = 'seller-orders'; render(); return; }
  if (action === 'seller-catalogue') { await loadCatalogue(); state.view = 'seller-catalogue'; render(); return; }
  if (action === 'seller-finance') { state.view = 'seller-finance'; render(); return; }
  if (action === 'seller-payments') { state.view = 'seller-payments'; render(); return; }
  if (action === 'seller-intelligence') { state.view = 'seller-intelligence'; render(); }
});

await loadBootstrap();
render();
