const K='kanzpay-phase2-v2';
const S=JSON.parse(localStorage.getItem(K)||'null')||{screen:'opening',role:'buyer',theme:'dark',buyer:{name:'Navneet',gold:12.6,points:1840,permissions:{identity:true,memberships:true,rewards:true,address:false,payment:false},profiles:['Personal','Professional'],selected:'Personal',expenses:[30,42,95]},seller:{business:'Luma Market',system:'Mac',catalogue:[['Ethiopian Cold Brew',24,18],['Granola Cup',18,4],['Still Water 500ml',5,148],['Cappuccino',18,32]],gold:248}};
const A=document.querySelector('#app');let installPrompt=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e});
const save=()=>localStorage.setItem(K,JSON.stringify(S));
const go=x=>{S.screen=x;save();render()};
const money=n=>'AED '+Number(n).toFixed(2);
const esc=x=>String(x).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function shell(x){return '<main class="pz"><header><button data-a="opening" class="brand"><img src="/assets/kanzpay-mark.png"> <span>KANZPAY<small>AI COMMERCE</small></span></button>'+(S.screen==='opening'?'':'<button data-a="back" class="back">‹</button>')+'<button data-a="theme" class="round">◐</button></header>'+x+'<div id="toast"></div></main>'}
function T(k,h,p){return '<div class="t"><small>'+k+'</small><h1>'+h+'</h1><p>'+p+'</p></div>'}
function C(k,x){return '<section class="c"><small>'+k+'</small>'+x+'</section>'}
function P(t,a){return '<button class="p" data-a="'+a+'">'+t+' <b>›</b></button>'}
function D(t,a){return '<button class="d" data-a="'+a+'">'+t+'</button>'}
function row(a,b,c){return '<div class="row"><span><b>'+esc(a)+'</b><small>'+esc(b)+'</small></span><strong>'+esc(c||'')+'</strong></div>'}
function tile(i,h,p,a){return '<button class="tile" data-a="'+a+'"><i>'+i+'</i><b>'+h+'</b><small>'+p+'</small><em>›</em></button>'}
function buyerCockpit(){return T('MY KANZPAY','Your Cockpit','Six things that matter to your everyday value.')+'<div class="tiles">'+tile('◈','My Value Vault','Benefits & permissions','vault')+tile('◎','My Visiting Card','Relationships & identity','card')+tile('✦','Earn with Friends','Invite & grow together','friends')+tile('◆','My Gold Vault','Build & use Gold','gold')+tile('▥','My Expenses','Know your spending','expenses')+tile('◉','Payment Intelligence','Choose smarter payments','payment')+'</div>'+D('Complete my account','account')}

const buyer={
opening:()=>'<div class="opening"><div class="orb"><img src="/assets/kanzpay-mark.png"><i></i></div><span class="k">YOUR COMMERCE. YOUR VALUE.</span><h1>Life gets better<br>when value follows you.</h1><p>KanzPay connects memberships, rewards, Gold and smarter payments around what you do today.</p>'+P('Enter KanzPay','tap')+D('Seller / Business','sellerEntry')+'<small class="note">Add KanzPay to your Home Screen for the enhanced experience.</small></div>',
tap:()=>T('START HERE','Tap or Scan','Connect to a KanzPay business. Your Value Vault stays under your control.')+C('K-TAG READY','<div class="bigorb">K</div><center>Bring your phone near the seller K-Tag</center>'+P('Tap to connect','check')+D('Show my Dynamic QR','qr'))+C('ALTERNATIVE','<p>Already received a seller QR or invoice?</p>'+D('Scan / enter QR','qr')),
check:()=>T('WELCOME BACK','We know you.','Choose how you want to continue.')+C('KANZPAY ACCOUNT','<div class="identity"><b>N</b><span>Navneet Sharma<small>+971 54 946 1247</small></span></div>'+P('Continue','gold')+D('Use another number','mobile'))+C('NEW HERE?','<p>Create your KanzPay account and start building your Value Vault.</p>'+D('Create account','account')),
mobile:()=>T('VERIFY','Mobile OTP','A code has been sent to +971 54 946 1247.')+C('SECURITY CODE','<div class="otp">• • • • • •</div>'+P('Verify mobile','email')+D('Change number','check')),
email:()=>T('VERIFY','Email OTP','Confirm the email connected to your KanzPay identity.')+C('SECURITY CODE','<div class="otp">• • • • • •</div>'+P('Verify email','gold')+D('Back','mobile')),
gold:()=>T('WELCOME TO KANZPAY','Your first value is here.','Your account is ready and the first Gold reward is credited.')+C('YOUR FIRST GOLD','<div class="goldhero">1<small>mg GOLD</small></div>'+P('Continue to my day','invoice')),
invoice:()=>T('VALUE FOUND','Your invoice is here.','KanzPay understood the purchase and found the value attached to it.')+C('LUMA MARKET · INVOICE LM-1048','<div class="amount">AED 30.00</div><div class="benefit"><b>Potential value found</b><span>Membership · Rewards · Gold</span><strong>Save + earn more</strong></div>'+P('See my value','game')+D('Not now','cockpit')),
game:()=>T('YOUR VALUE ENGINE','Turn today into tomorrow.','See the outcome before you commit.')+C('TODAY','<div class="quad"><b>AED 30<small>purchase</small></b><b>AED 6<small>save</small></b><b>120<small>points</small></b><b>+2<small>mg Gold</small></b></div>'+P('Build my value','vault')),
vault:()=>T('MY VALUE VAULT','Everything valuable. One place.','Your memberships, cards and vouchers stay under your control.')+C('CONNECTED MEMBERSHIPS',row('Fazaa','Connected','10%')+D('Connect membership','permissions'))+C('CARDS',row('Visa Signature','•••• 4242','Connected')+D('Add a card','permissions'))+C('VOUCHERS',row('Luma AED 10','Available','AED 10')+P('Manage permissions','permissions')),
permissions:()=>T('YOUR CONTROL','Vault Permissions','KanzPay only uses what you allow.')+C('SHARING CONTROL',Object.entries(S.buyer.permissions).map(([k,v])=>'<div class="perm"><span>'+k+'</span><button class="sw '+(v?'on':'')+'" data-k="'+k+'"><i></i></button></div>').join('')+P('Save permissions','qr')),
qr:()=>T('YOUR PRESENCE','Dynamic QR','A secure way to identify yourself to a KanzPay business.')+C('SCAN ME','<div class="qr"><b>KANZ</b></div><center>Expires in 02:00 · Value signals only</center>'+D('Regenerate QR','qr')+P('Continue','cockpit')),
cockpit:()=>buyerCockpit(),
card:()=>T('MY IDENTITY','My Visiting Card','One identity. Different relationships.')+C('PROFILE','<div class="profiles">'+S.buyer.profiles.map(x=>'<button class="profile '+(x===S.buyer.selected?'sel':'')+'" data-profile="'+x+'">'+x+'</button>').join('')+'</div>'+P('Create a profile','profile'))+C('CARD PREVIEW','<div class="visit"><img src="/assets/kanzpay-mark.png"><b>Navneet Sharma</b><span>Founder · Oxy Technologies</span><small>'+S.buyer.selected+' profile</small></div>'+P('Share my card','share')+D('Open native app for NFC','install')),
friends:()=>T('TOGETHER IS MORE','Earn with Friends','Invite someone you trust. Both can benefit when the journey qualifies.')+C('YOUR INVITATION','<div class="friend">✦</div><h2>Share your KanzPay value.</h2><p>Your invitation starts in the PWA.</p>'+P('Share invitation','share')),
goldVault:()=>T('MY GOLD','Your Gold Vault','Gold earned through eligible commerce stays with you.')+C('BALANCE','<div class="goldbalance">'+S.buyer.gold.toFixed(2)+' <small>mg</small></div>'+P('Buy Gold','buy')+P('Sell Gold','sell')+D('Gift Gold','gift')+D('Pay with Gold','pay')+D('Redeem / physical Gold','redeem')),
expenses:()=>T('MY LIFE','My Expenses','See your spending as a pattern, not a punishment.')+C('THIS PERIOD','<div class="amount">'+money(S.buyer.expenses.reduce((a,b)=>a+b,0))+'</div>'+S.buyer.expenses.map((x,i)=>row('Expense '+(i+1),'Daily spending',money(x))).join('')+P('Add expense','expense')),
payment:()=>T('PAY SMARTER','Payment Intelligence','KanzPay evaluates the payment instruments you allow and surfaces the best available value.')+C('RECOMMENDED','<div class="recommend"><b>AED 24.00</b><span>Aani · approved</span><small>Best current value</small></div>'+P('Use recommendation','complete')+D('See my cards','vault')),
account:()=>T('BECOME A MEMBER','Create Account','Your account unlocks the full Value Vault and Gold journey.')+C('IDENTITY','<div class="form">Name · Navneet Sharma<br>Mobile · +971 54 946 1247<br>Email · navneetsharma@gmail.com</div>'+P('Continue to KYC','kycid')),
kycid:()=>T('SECURE YOUR VALUE','KYC','Verify your Emirates ID.')+C('EMIRATES ID','<div class="idbox">PLACE ID HERE</div>'+P('Capture Emirates ID','kyccamera')),
kyccamera:()=>T('LIVE CHECK','Identity Match','Follow the camera prompts.')+C('LIVE CAMERA','<div class="camera">FACE</div><p>Look straight · Blink · Look left · Look right</p>'+P('Complete verification','cockpit'))
};

const seller={
sellerEntry:()=>T('KANZPAY BUSINESS','K-Assistant is ready.','Turn every invoice into a smarter customer relationship.')+C('SELLER ENTRY','<div class="bigorb">K</div>'+P('Start Business Setup','setup')),
setup:()=>T('BUSINESS SETUP','Tell us about your business.','Set it up once.')+C('BUSINESS','<div class="form">Business · Luma Market<br>Type · Cafe & Grocery<br>Location · Dubai Marina<br>VAT · 100312345600003</div>'+P('Continue','system')),
system:()=>T('K-ASSISTANT','Choose your system.','K-Assistant works alongside your existing environment.')+C('SYSTEM','<div class="systems">'+['Windows','Mac','Linux','Android'].map(x=>'<button class="system '+(S.seller.system===x?'sel':'')+'" data-system="'+x+'">'+x+'</button>').join('')+'</div>'+P('Install K-Assistant','rules')),
rules:()=>T('VALUE RULES','Reward Rules','You decide what value the business funds.')+C('YOUR RULES',row('GMV → Points','1 point / AED','ACTIVE')+row('Gold','0.2% of GMV','ACTIVE')+row('Free Product','1000 points','ACTIVE')+P('Save reward rules','assistant')),
assistant:()=>T('K-ASSISTANT','I am ready.','I see the business signals and wait for your instruction.')+C('FIRST SIGNAL','<div class="quote">“Granola Cup is below your stock threshold. Shall I prepare a restock?”</div>'+P('Yes — restock','inventory')+D('Show my business','sellerCockpit')),
sellerCockpit:()=>T('BUSINESS COCKPIT','Your business at a glance','K-Assistant keeps the important things close.')+'<div class="tiles">'+tile('⌁','K-Assistant','Priorities & guided work','assistant')+tile('▤','Catalogue','SKUs & pricing','catalogue')+tile('▥','Inventory','Stock & movement','inventory')+tile('₹','Finance','Receivables, payables, P&L','finance')+tile('✦','Offers & Rewards','Customer value','offers')+tile('◈','Business Intelligence','Trends & customers','intel')+'</div>',
catalogue:()=>T('SELLER INTELLIGENCE','Catalogue','Your menu and SKU layer.')+C('LIVE CATALOGUE',S.seller.catalogue.map(x=>row(x[0],'SKU · '+x[2]+' units',money(x[1]))).join('')+P('Add SKU','sku')),
inventory:()=>T('SELLER INTELLIGENCE','Inventory','Know what needs attention before the customer does.')+C('STOCK HEALTH',S.seller.catalogue.map(x=>row(x[0],x[2]+' units',x[2]<8?'REORDER':'HEALTHY')).join('')+P('Restock low item','restock')),
finance:()=>T('SELLER INTELLIGENCE','Finance','See the money moving through your business.')+C('RECEIVABLES',row('Corporate Account','Overdue',money(8420))+P('Mark paid','receivable'))+C('PAYABLES',row('Fresh Foods LLC','Upcoming',money(5680))+D('Mark paid','payable'))+C('P&L','<div class="amount">'+money(68240-31200-16400)+'</div>'+row('Revenue','',money(68240))+row('COGS','',money(31200))+row('Operating','',money(16400))),
offers:()=>T('SELLER INTELLIGENCE','Offers & Rewards','Turn the value you fund into repeat behaviour.')+C('ACTIVE OFFERS',row('10% Membership Discount','ACTIVE','10%')+row('Gold Reward','ACTIVE','0.2%')+P('Create offer','offer'))+C('GOLD FUND','<div class="goldbalance">'+S.seller.gold+' <small>mg</small></div>'+D('Fund 10 mg Gold','fund')),
intel:()=>T('SELLER INTELLIGENCE','Business Intelligence','K-Assistant turns activity into decisions.')+C('TODAY','<div class="quad"><b>+14%<small>sales</small></b><b>2<small>customers</small></b><b>12<small>visits</small></b><b>0.2%<small>Gold</small></b></div>')+C('K-ASSISTANT','<p>Margin is the next thing to watch. Review beverage discounts before adding another discount.</p>'),
invoiceSeller:()=>T('K-ASSISTANT','Invoice / Share Invoice','Turn an invoice into a KanzPay customer journey.')+C('INVOICE','<div class="amount">AED 84.00</div>'+row('Customer','Sarah Ahmed','Verified')+row('Reward','120 pts','Eligible')+row('Gold','0.2%','Eligible')+P('Share invoice to KanzPay','sellerFocus')),
sellerFocus:()=>T('SELLER FOCUS','What matters now','Keep the commercial relationship in view.')+C('TODAY','<div class="quad"><b>AED 68k<small>GMV</small></b><b>14%<small>growth</small></b><b>12<small>repeat visits</small></b><b>+0.2%<small>Gold</small></b></div>')+C('CUSTOMER VALUE',row('Repeat customers','Growing','+18%')+row('Average ticket','Stable','AED 42'))
};

const map={...buyer,...seller};
function render(){document.documentElement.dataset.theme=S.theme;A.innerHTML=shell('<div class="screen">'+(map[S.screen]||buyer.opening)()+'</div>');bind()}
function toast(t){const e=document.querySelector('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2000)}
function bind(){
 document.querySelectorAll('[data-a]').forEach(x=>x.onclick=()=>doit(x.dataset.a));
 document.querySelectorAll('[data-k]').forEach(x=>x.onclick=()=>{S.buyer.permissions[x.dataset.k]=!S.buyer.permissions[x.dataset.k];save();render()});
 document.querySelectorAll('[data-profile]').forEach(x=>x.onclick=()=>{S.buyer.selected=x.dataset.profile;save();render()});
 document.querySelectorAll('[data-system]').forEach(x=>x.onclick=()=>{S.seller.system=x.dataset.system;save();render()});
}
async function doit(a){
 if(a==='theme'){S.theme=S.theme==='dark'?'light':'dark';save();render();return}
 if(a==='back'){go(S.role==='seller'?'sellerCockpit':'cockpit');return}
 if(a==='install'){if(installPrompt){await installPrompt.prompt();installPrompt=null}else toast('iPhone: Share → Add to Home Screen');return}
 const n={tap:'tap',check:'check',mobile:'mobile',email:'email',gold:'gold',invoice:'invoice',game:'game',vault:'vault',permissions:'permissions',qr:'qr',cockpit:'cockpit',card:'card',friends:'friends',goldVault:'goldVault',gold:'gold',expenses:'expenses',payment:'payment',account:'account',kycid:'kycid',kyccamera:'kyccamera',sellerEntry:'sellerEntry',setup:'setup',system:'system',rules:'rules',assistant:'assistant',sellerCockpit:'sellerCockpit',catalogue:'catalogue',inventory:'inventory',finance:'finance',offers:'offers',intel:'intel',sellerFocus:'sellerFocus'};
 if(n[a]){S.role=['sellerEntry','setup','system','rules','assistant','sellerCockpit','catalogue','inventory','finance','offers','intel','sellerFocus','invoiceSeller'].includes(a)?'seller':'buyer';go(n[a]);return}
 if(a==='complete'){S.buyer.gold+=2;S.buyer.points+=120;S.buyer.expenses.push(24);save();go('cockpit');return}
 if(a==='buy'){S.buyer.gold+=1;save();render();return}
 if(a==='sell'||a==='gift'||a==='pay'){if(S.buyer.gold<1)return toast('Not enough Gold');S.buyer.gold-=1;save();render();return}
 if(a==='expense'){S.buyer.expenses.push(20);save();go('expenses');return}
 if(a==='profile'){const x='Profile '+(S.buyer.profiles.length+1);S.buyer.profiles.push(x);S.buyer.selected=x;save();render();return}
 if(a==='share'){if(navigator.share)await navigator.share({title:'KanzPay',text:'Connect with me on KanzPay',url:location.href}).catch(()=>{});else toast('Share link ready');return}
 if(a==='sku'){S.seller.catalogue.push(['Demo Pastry',16,24]);save();go('catalogue');return}
 if(a==='restock'){S.seller.catalogue[1][2]+=20;save();go('inventory');return}
 if(a==='receivable'||a==='payable'){toast('Payment state saved');return}
 if(a==='offer'){S.seller.offers=(S.seller.offers||0)+1;save();toast('Offer created');return}
 if(a==='fund'){S.seller.gold+=10;save();render();return}
 if(a==='sellerFocus'){go('sellerFocus');return}
}
render();