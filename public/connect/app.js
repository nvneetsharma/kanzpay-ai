const KEY='kanzpay-phase2-v1';
const seed={
  theme:'dark', role:'buyer',
  buyer:{
    profile:{name:'Navneet Sharma',mobile:'+971 54 946 1247',email:'navneetsharma@gmail.com',preferences:{language:'English',notifications:true}},
    valueVault:{
      memberships:[{id:'fazaa',name:'Fazaa',status:'connected',value:'10%'}],
      cards:[{id:'visa',name:'Visa Signature',last4:'4242',status:'connected'}],
      vouchers:[{id:'luma',name:'Luma AED 10 Voucher',value:10,status:'available'}],
      permissions:{identity:true,memberships:true,rewards:true,address:false,paymentCredentials:false}
    },
    goldMg:12.6, points:1840,
    expenses:[
      {id:'e1',merchant:'Harbour Coffee',category:'Food',amount:30,date:'2026-10-04'},
      {id:'e2',merchant:'Careem',category:'Transport',amount:42,date:'2026-10-03'},
      {id:'e3',merchant:'Apple Store',category:'Shopping',amount:95,date:'2026-10-02'}
    ],
    history:[], savedOffers:[], cardProfiles:[{id:'professional',name:'Professional',mode:'Work'}]
  },
  seller:{
    business:{name:'Luma Market',type:'Cafe & Grocery',location:'Dubai Marina',vat:'100312345600003',mobile:'+971 50 123 4567',logo:'/assets/kanzpay-mark.png',system:'Mac'},
    catalogue:[
      {id:'sku1',name:'Ethiopian Cold Brew',category:'Beverages',price:24,stock:18},
      {id:'sku2',name:'Granola Cup',category:'Food',price:18,stock:4},
      {id:'sku3',name:'Still Water 500ml',category:'Grocery',price:5,stock:148},
      {id:'sku4',name:'Cappuccino',category:'Beverages',price:18,stock:32}
    ],
    inventory:{lowStockThreshold:8},
    invoices:[{id:'inv1',ref:'LM-1047',customer:'Sarah Ahmed',amount:84,status:'Paid',date:'2026-10-03'}],
    customers:[{id:'c1',name:'Sarah Ahmed',visits:12,spent:480,status:'Top Customer'},{id:'c2',name:'Rohan Mehta',visits:6,spent:210,status:'Regular'}],
    offers:[{id:'o1',name:'10% Membership Discount',type:'Discount',value:10,active:true},{id:'o2',name:'Gold Reward',type:'Gold',value:0.2,active:true}],
    rewards:{pointsPerAed:1,goldPercent:0.2,freeProductPoints:1000},
    gold:248,
    receivables:[{id:'r1',customer:'Corporate Account',amount:8420,due:'2026-09-30',status:'Overdue'}],
    payables:[{id:'p1',supplier:'Fresh Foods LLC',amount:5680,due:'2026-10-07',status:'Upcoming'}],
    expenses:[{id:'se1',name:'Rent',amount:8500,category:'Operations'},{id:'se2',name:'Supplies',amount:3200,category:'COGS'}],
    pnl:{revenue:68240,cogs:31200,operating:16400},
    history:[]
  }
};
let state=load();
let installPrompt=null;
const app=document.querySelector('#app');
const toastEl=document.querySelector('#toast');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;render()});
function load(){try{return {...seed,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return structuredClone(seed)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(window.__t);window.__t=setTimeout(()=>toastEl.classList.remove('show'),2400)}
function money(n){return 'AED '+Number(n).toLocaleString('en-AE',{minimumFractionDigits:2,maximumFractionDigits:2})}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function mark(){return '<img class="logo-mark" src="/assets/kanzpay-mark.png" alt="KanzPay">'}
function shell(content){return `<div class="ambient a1"></div><div class="ambient a2"></div><main class="shell">
<header class="topbar"><button class="brand" data-nav="home">${mark()}<span><b>KanzPay</b><small>AI COMMERCE</small></span></button>
<div class="controls"><button class="iconbtn" data-action="theme" title="Theme">☼</button><button class="mode ${state.role==='buyer'?'on':''}" data-role="buyer">Buyer</button><button class="mode ${state.role==='seller'?'on':''}" data-role="seller">Seller</button></div></header>${content}
<footer>Standalone PWA · Demo account · Data persists on this device</footer></main>`}
function hero(title,sub){return `<section class="hero"><div><div class="eyebrow">${state.role==='buyer'?'BUYER JOURNEY':'SELLER JOURNEY'}</div><h1>${title}</h1><p>${sub}</p></div><div class="hero-art">${mark()}<div class="orbit o1"></div><div class="orbit o2"></div></div></section>`}
function card(title,body,cls=''){return `<article class="glass ${cls}"><div class="card-title">${title}</div>${body}</article>`}
function action(label,act,cls='primary'){return `<button class="${cls}" data-action="${act}">${label}</button>`}
function buyerHome(){const b=state.buyer;return hero(`Good day, ${esc(b.profile.name.split(' ')[0])}.`,`KanzPay is ready to find value around what you are doing now — not another dashboard to manage.`)+`
<section class="featured"><div class="feature-copy"><span class="eyebrow">TODAY FOR YOU</span><h2>There may be more value in your next purchase.</h2><p>Membership, rewards, Gold and payment intelligence are already connected in your Value Vault.</p>${action('Find my best value','bestValue')}</div><div class="feature-visual"><div class="gold-orb"><span>${b.goldMg.toFixed(1)}<small>mg GOLD</small></span></div></div></section>
<div class="section-head"><h2>Your living cockpit</h2><span class="muted">Choose what you need now</span></div>
<div class="bento">
${bento('⌁','Tap & Pay','Connect to a seller and use your approved value.','tag')}
${bento('◇','Value Vault','Memberships, cards, vouchers and permissions.','vault')}
${bento('✦','My Gold','Buy, sell, redeem, gift or pay with Gold.','gold')}
${bento('▥','My Expenses','See your own spending rhythm.','expenses')}
${bento('◈','My Visiting Card','Switch relationship profiles and share.','card')}
${bento('◎','Earn with Friends','Share value with people you know.','friends')}
</div>
<div class="stats"><div><span>Gold</span><b>${b.goldMg.toFixed(1)} mg</b></div><div><span>Points</span><b>${b.points.toLocaleString()}</b></div><div><span>Vault items</span><b>${b.valueVault.memberships.length+b.valueVault.cards.length+b.valueVault.vouchers.length}</b></div></div>`}
function bento(icon,title,sub,view){return `<button class="bento-card" data-nav="${view}"><span class="big-icon">${icon}</span><b>${title}</b><small>${sub}</small><i>↗</i></button>`}
function sellerHome(){const s=state.seller;const rev=s.invoices.reduce((a,x)=>a+x.amount,0)+68240;const low=s.catalogue.filter(x=>x.stock<=s.inventory.lowStockThreshold).length;return hero(`Good day. ${esc(s.business.name)} is live.`,`K-Assistant has your catalogue, inventory, customer, reward and finance signals ready. Let it point you to what matters next.`)+`
<section class="featured seller"><div class="feature-copy"><span class="eyebrow">K-ASSISTANT</span><h2>I found ${low} stock item${low===1?'':'s'} and ${s.receivables.filter(x=>x.status==='Overdue').length} overdue receivable to review.</h2><p>Nothing is changed automatically. You decide what happens next.</p>${action('Show me what needs attention','assistant')}</div><div class="feature-visual"><div class="assistant-ring">K</div></div></section>
<div class="section-head"><h2>Business cockpit</h2><span class="muted">All stores · today</span></div>
<div class="bento">
${bento('⌁','K-Assistant','Priority actions, explanations and guided work.','assistant')}
${bento('▤','Catalogue','SKUs, prices, templates and publishing.','catalogue')}
${bento('▥','Inventory','Low/high stock and movement.','inventory')}
${bento('₹','Finance','Receivables, payables and P&L.','finance')}
${bento('✦','Offers & Rewards','Customer value and repeat behaviour.','offers')}
${bento('◈','Business Intelligence','Sales, customers and category trends.','business')}
</div>
<div class="stats"><div><span>Sales</span><b>${money(rev)}</b></div><div><span>Gold funded</span><b>${s.gold.toFixed(0)} mg</b></div><div><span>Customers</span><b>${s.customers.length}</b></div></div>`}
function bestValue(){return page('Your Smart Option','I found a better way for this purchase. The recommendation is based on your connected benefits and current transaction.',`
${card('Café Aurora · Current basket',`<div class="price">AED 30.00</div><div class="recommend"><b>Best value</b><span>Save AED 6.00</span><span>+120 points</span><span>+2 mg Gold</span></div>${action('Use Best Value','checkout')}${action('See other options','home','secondary')}`,'wide')}
${card('Why this is your option',`<p>Membership and rewards are guaranteed. A possible voucher is shown separately until evidence is confirmed.</p><div class="line"><span>Membership</span><b>− AED 4.20</b></div><div class="line"><span>Rewards</span><b>− AED 1.80</b></div><div class="line"><span>Payment rail</span><b>Aani</b></div>`)}
`)}
function tag(){return page('Tap to Connect','Hold your phone near the KanzPay K-Tag. You decide what is shared.',`
${card('Luma Market',`<div class="merchant"><div class="merchant-photo">☕</div><div><b>Specialty Coffee</b><small>Dubai Marina · 280m</small></div></div><div class="share-grid"><span>Identity <b>ON</b></span><span>Membership <b>ON</b></span><span>Rewards <b>ON</b></span><span>Gold <b>ON</b></span><span>Payment credentials <b>NEVER</b></span></div>${action('Approve & Connect','connectTag')}`,'wide')}
${card('Your Value Vault',`<p>Only the approved signals leave the vault. Payment credentials are never shared.</p>${action('Review permissions','vault','secondary')}`)}
`)}
function vault(){const v=state.buyer.valueVault;return page('My Value Vault','Your benefits live here. You stay in control of what KanzPay can use.',`
${card('Connected value',`<div class="list">${v.memberships.map(x=>row(x.name,x.value,'Connected')).join('')}${v.cards.map(x=>row(x.name,'•••• '+x.last4,'Card')).join('')}${v.vouchers.map(x=>row(x.name,money(x.value),'Available')).join('')}</div>${action('Add a voucher','addVoucher')}`,'wide')}
${card('Permissions',Object.entries(v.permissions).map(([k,val])=>`<div class="permission"><span>${pretty(k)}</span><button class="toggle ${val?'on':''}" data-toggle="${k}"><i></i></button></div>`).join(''))}
`)}
function gold(){const b=state.buyer;return page('My Gold Vault','Your Gold is a value balance, not just a number.',`
${card('Your Gold',`<div class="gold-number">${b.goldMg.toFixed(2)} <small>mg</small></div><p>Change since first purchase: <span class="gold">+4.8%</span></p><div class="gold-actions">${action('Buy Gold','buyGold')}${action('Sell Gold','sellGold')}${action('Gift Gold','giftGold')}${action('Pay with Gold','payGold')}${action('Redeem','redeemGold')}`,'wide')}
${card('Powered by your Gold journey',`<p>Every eligible purchase can add Gold. Your demo account keeps the balance across sessions.</p><div class="alert">Gold won this month: <b>+3.4 mg</b></div>`)}
`)}
function expenses(){const b=state.buyer;const total=b.expenses.reduce((a,x)=>a+x.amount,0);return page('My Expenses','See the rhythm of your own life — daily, weekly, monthly or yearly.',`
${card('This month',`<div class="price">${money(total)}</div><div class="bars">${b.expenses.map((x,i)=>`<i style="height:${30+i*18}px"></i>`).join('')}</div>${b.expenses.map(x=>row(x.merchant,x.category,money(x.amount))).join('')}`,'wide')}
${card('Your baseline',`<div class="insight"><b>Within your normal rhythm.</b><p>Food is your largest current category. No judgement — just your own pattern.</p></div>${action('Add an expense','addExpense','secondary')}`)}
`)}
function cardPage(){const profiles=state.buyer.cardProfiles;return page('Your Visiting Card','One master profile. Different relationships. You choose what someone receives.',`
${card('Choose a profile',`<div class="profiles">${profiles.map(x=>`<button class="profile ${x.id==='professional'?'selected':''}" data-profile="${x.id}">${x.name}<small>${x.mode}</small></button>`).join('')}${action('Create profile','createProfile','secondary')}</div>`,'wide')}
${card('Preview',`<div class="visiting"><img src="/assets/kanzpay-mark.png"><b>${esc(state.buyer.profile.name)}</b><span>Founder · Oxy Technologies</span><small>Abu Dhabi, UAE</small></div>${action('Share via QR','shareCard')}${action('Open in native app for NFC','install','secondary')}`)}
`)}
function friends(){return page('Earn with Friends','Share value with people you trust. KanzPay keeps the invitation simple.',`
${card('Your invitation',`<div class="invite-art">✦</div><h2>Let your friends earn with you.</h2><p>Send your personal link through WhatsApp, SMS or email.</p>${action('Share invitation','shareFriends')}`,'wide')}
${card('How it works',`<ol><li>Your friend opens your link.</li><li>They start in the PWA.</li><li>When eligible, both sides receive the configured benefit.</li></ol>`)}
`)}
function checkout(){return page('Your purchase, completed with value','This demo checkout changes your persistent Gold, points and expense history.',`
${card('Café Aurora · Invoice KA-1048',`<div class="price">AED 30.00</div><div class="recommend"><span>Membership − AED 4.20</span><span>Rewards − AED 1.80</span><span>Pay AED 24.00</span><span>Earn +120 points</span><span>Earn +2 mg Gold</span></div>${action('Approve & Complete','completePurchase')}${action('Stop — no payment','stopPurchase','secondary')}`,'wide')}
${card('Before you approve',`<p>You are approving this demo transaction only. No real payment is sent.</p><div class="alert">After approval: points +120, Gold +2 mg, expense +AED 24.</div>`)}
`)}
function catalogue(){const s=state.seller;return page('Your Catalogue, alive','K-Assistant can create and maintain the catalogue from invoices, menu uploads or inventory data.',`
${card('Catalogue',`<div class="catalogue">${s.catalogue.map(x=>`<div class="sku"><div><b>${esc(x.name)}</b><small>${esc(x.category)} · ${x.stock} units</small></div><strong>${money(x.price)}</strong></div>`).join('')}</div>${action('Add sample SKU','addSku')}`,'wide')}
${card('Catalogue intelligence',`<p>Competition price, menu templates and SKU movement are ready as the next intelligence layer.</p>${action('Run catalogue learning','learnCatalogue','secondary')}`)}
`)}
function inventory(){const s=state.seller;return page('Inventory before it becomes a problem','Low and high stock signals are persistent and derived from your catalogue.',`
${card('Stock health',`<div class="list">${s.catalogue.map(x=>row(x.name,x.stock+' units',x.stock<=s.inventory.lowStockThreshold?'REORDER':'HEALTHY')).join('')}</div>${action('Restock Granola Cup','restock')}`,'wide')}
${card('Rule',`<p>Low-stock threshold: <b>${s.inventory.lowStockThreshold}</b> units.</p>${action('Increase threshold','increaseThreshold','secondary')}`)}
`)}
function finance(){const s=state.seller;const net=s.pnl.revenue-s.pnl.cogs-s.pnl.operating;return page('Business Finance','Receivables, payables and P&L stay connected to the seller demo account.',`
${card('Receivables',`<div class="price">${money(s.receivables.reduce((a,x)=>a+x.amount,0))}</div>${s.receivables.map(x=>row(x.customer,x.status,money(x.amount))).join('')}${action('Mark receivable paid','payReceivable')}`)}
${card('Payables',`<div class="price">${money(s.payables.reduce((a,x)=>a+x.amount,0))}</div>${s.payables.map(x=>row(x.supplier,x.status,money(x.amount))).join('')}${action('Mark payable paid','payPayable','secondary')}`)}
${card('P&L',`<div class="price">${money(net)}</div><div class="line"><span>Revenue</span><b>${money(s.pnl.revenue)}</b></div><div class="line"><span>COGS</span><b>− ${money(s.pnl.cogs)}</b></div><div class="line"><span>Operating</span><b>− ${money(s.pnl.operating)}</b></div>`,'wide')}
`)}
function offers(){const s=state.seller;return page('Offers & Rewards','Seller-funded value creates a repeat-customer loop.',`
${card('Reward rules',`<div class="line"><span>Points / AED</span><b>${s.rewards.pointsPerAed}</b></div><div class="line"><span>Gold / AED</span><b>${s.rewards.goldPercent}%</b></div><div class="line"><span>Free product</span><b>${s.rewards.freeProductPoints} pts</b></div>${s.offers.map(x=>row(x.name,x.type,x.active?'ACTIVE':'OFF')).join('')}${action('Create sample offer','createOffer')}`,'wide')}
${card('Gold funded',`<div class="gold-number">${s.gold.toFixed(0)} <small>mg</small></div><p>Seller-funded Gold balance in the demo account.</p>${action('Fund 10 mg','fundGold','secondary')}`)}
`)}
function business(){const s=state.seller;return page('Business Intelligence','The system explains what changed across sales, customers and profitability.',`
${card('Sales trend',`<div class="price">+14%</div><div class="bars">${[42,58,64,53,82,90,76].map(h=>`<i style="height:${h}px"></i>`).join('')}</div>`,'wide')}
${card('Customers',`<div class="price">${s.customers.length}</div>${s.customers.map(x=>row(x.name,x.status,money(x.spent))).join('')}`)}
${card('K-Assistant explanation',`<div class="insight"><b>Margin is the thing to watch.</b><p>Revenue is up, but beverage discounts are reducing gross margin. Review offers before adding another discount.</p></div>`)}
`)}
function assistant(){const s=state.seller;const low=s.catalogue.filter(x=>x.stock<=s.inventory.lowStockThreshold);return page('K-Assistant','I found a few things worth your attention. Nothing changes unless you choose it.',`
${card('Priority queue',`${low.map(x=>row(x.name,'Inventory','REORDER')).join('')}${s.receivables.filter(x=>x.status==='Overdue').map(x=>row(x.customer,'Receivable',money(x.amount))).join('')}${row('Beverage margin','Business','REVIEW')}${row('Catalogue price checks','Catalogue','12 READY')}`,'wide')}
${card('One next step',`<div class="assistant-prompt">“Shall I restock the Granola Cup?”</div>${action('Yes — restock it','restock')}${action('Not now','home','secondary')}`)}
`)}
function page(title,sub,content){return `<section class="page-head"><button class="back" data-nav="home">← Home</button><div class="eyebrow">${state.role.toUpperCase()} · LIVE DEMO STATE</div><h1>${title}</h1><p>${sub}</p></section><section class="grid">${content}</section>`}
function row(a,b,c){return `<div class="line"><span><b>${esc(a)}</b><small>${esc(b)}</small></span><strong>${esc(c)}</strong></div>`}
function pretty(s){return s.replace(/([A-Z])/g,' $1').replace(/^./,x=>x.toUpperCase())}
function currentView(){return state.view||'home'}
function render(){let v=currentView(),content='';
if(v==='home')content=state.role==='buyer'?buyerHome():sellerHome();
else if(v==='bestValue')content=bestValue(); else if(v==='tag')content=tag(); else if(v==='vault')content=vault(); else if(v==='gold')content=gold(); else if(v==='expenses')content=expenses(); else if(v==='card')content=cardPage(); else if(v==='friends')content=friends(); else if(v==='checkout')content=checkout(); else if(v==='catalogue')content=catalogue(); else if(v==='inventory')content=inventory(); else if(v==='finance')content=finance(); else if(v==='offers')content=offers(); else if(v==='business')content=business(); else if(v==='assistant')content=assistant();
app.innerHTML=shell(content);bind();document.documentElement.dataset.theme=state.theme}
function bind(){
document.querySelectorAll('[data-role]').forEach(x=>x.onclick=()=>{state.role=x.dataset.role;state.view='home';save();render()});
document.querySelectorAll('[data-nav]').forEach(x=>x.onclick=()=>{state.view=x.dataset.nav;render()});
document.querySelectorAll('[data-action]').forEach(x=>x.onclick=()=>doAction(x.dataset.action));
document.querySelectorAll('[data-profile]').forEach(x=>x.onclick=()=>toast('Profile '+x.textContent+' selected for this preview.'));
document.querySelectorAll('[data-toggle]').forEach(x=>x.onclick=()=>{state.buyer.valueVault.permissions[x.dataset.toggle]=!state.buyer.valueVault.permissions[x.dataset.toggle];save();render()});
}
async function doAction(a){
if(a==='theme'){state.theme=state.theme==='dark'?'light':'dark';save();render();return}
if(a==='install'){if(installPrompt){await installPrompt.prompt();installPrompt=null}else toast('On iPhone: Share → Add to Home Screen. The PWA is already fully usable.');return}
if(a==='bestValue'||a==='tag'||a==='vault'||a==='gold'||a==='expenses'||a==='card'||a==='friends'||a==='catalogue'||a==='inventory'||a==='finance'||a==='offers'||a==='business'||a==='assistant'){state.view=a;render();return}
if(a==='connectTag'){state.buyer.valueVault.permissions.identity=true;state.buyer.history.push({type:'K-TAG',merchant:'Luma Market',date:new Date().toISOString()});save();toast('Connected. Only approved Value Vault signals were shared.');render();return}
if(a==='checkout'){state.view='checkout';render();return}
if(a==='completePurchase'){state.buyer.points+=120;state.buyer.goldMg+=2;state.buyer.expenses.push({id:'e'+Date.now(),merchant:'Café Aurora',category:'Food',amount:24,date:new Date().toISOString().slice(0,10)});state.buyer.history.push({id:'t'+Date.now(),type:'Purchase',merchant:'Café Aurora',amount:24,points:120,goldMg:2,date:new Date().toISOString()});save();toast('Completed. 120 points + 2 mg Gold + expense saved.');state.view='home';render();return}
if(a==='stopPurchase'){toast('Stopped. No payment and no balance changes.');state.view='home';render();return}
if(a==='addVoucher'){state.buyer.valueVault.vouchers.push({id:'v'+Date.now(),name:'Welcome AED 5 Voucher',value:5,status:'available'});save();toast('Voucher added to your Value Vault.');render();return}
if(a==='buyGold'){state.buyer.goldMg+=1;state.buyer.history.push({type:'Buy Gold',goldMg:1,date:new Date().toISOString()});save();toast('+1 mg Gold added to demo vault.');render();return}
if(a==='sellGold'){if(state.buyer.goldMg<1)return toast('Not enough Gold in demo vault.');state.buyer.goldMg-=1;state.buyer.history.push({type:'Sell Gold',goldMg:1,date:new Date().toISOString()});save();toast('1 mg Gold sold from demo vault.');render();return}
if(a==='giftGold'){if(state.buyer.goldMg<1)return toast('Not enough Gold in demo vault.');state.buyer.goldMg-=1;state.buyer.history.push({type:'Gift Gold',goldMg:1,date:new Date().toISOString()});save();toast('1 mg Gold gifted.');render();return}
if(a==='payGold'){if(state.buyer.goldMg<1)return toast('Not enough Gold in demo vault.');state.buyer.goldMg-=1;state.buyer.history.push({type:'Pay with Gold',goldMg:1,date:new Date().toISOString()});save();toast('1 mg Gold used for demo payment.');render();return}
if(a==='redeemGold'){toast('Redemption flow opened — delivery/redeem choice recorded next.');return}
if(a==='shareCard'){toast('Visiting Card share token created.');return}
if(a==='shareFriends'){toast('Invitation link prepared for WhatsApp/SMS/email.');return}
if(a==='createProfile'){state.buyer.cardProfiles.push({id:'p'+Date.now(),name:'Custom',mode:'Custom'});save();toast('Custom profile created.');render();return}
if(a==='addExpense'){state.buyer.expenses.push({id:'e'+Date.now(),merchant:'Demo Purchase',category:'Other',amount:20,date:new Date().toISOString().slice(0,10)});save();toast('Expense saved to persistent history.');render();return}
if(a==='addSku'){state.seller.catalogue.push({id:'sku'+Date.now(),name:'Demo Pastry',category:'Food',price:16,stock:24});save();toast('SKU added to persistent catalogue.');render();return}
if(a==='learnCatalogue'){toast('K-Assistant learning complete: catalogue signals refreshed.');return}
if(a==='restock'){const x=state.seller.catalogue.find(x=>x.name==='Granola Cup');if(x)x.stock+=20;state.seller.history.push({type:'Restock',sku:'Granola Cup',quantity:20,date:new Date().toISOString()});save();toast('20 Granola Cups added to persistent inventory.');render();return}
if(a==='increaseThreshold'){state.seller.inventory.lowStockThreshold+=2;save();toast('Low-stock threshold updated.');render();return}
if(a==='payReceivable'){if(state.seller.receivables[0])state.seller.receivables[0].status='Paid';save();toast('Receivable marked paid.');render();return}
if(a==='payPayable'){if(state.seller.payables[0])state.seller.payables[0].status='Paid';save();toast('Payable marked paid.');render();return}
if(a==='createOffer'){state.seller.offers.push({id:'o'+Date.now(),name:'Welcome Back Reward',type:'Points',value:50,active:true});save();toast('Offer created and persisted.');render();return}
if(a==='fundGold'){state.seller.gold+=10;save();toast('Seller Gold funding increased by 10 mg.');render();return}
}
render();