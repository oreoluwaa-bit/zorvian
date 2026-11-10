import { useState, useSyncExternalStore } from "react";
import { Activity, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, ArrowRight, Bell, Bot, CheckCircle2, ChevronDown, CircleHelp, CreditCard, Download, Filter, Globe2, LayoutDashboard, Menu, Plus, Search, Send, Settings, ShieldCheck, Sparkles, Wallet, X } from "lucide-react";

type Page = "Overview" | "Wallet" | "Transfers" | "Exchange" | "AI assistant" | "Activity" | "Settings";
const pages: { label: Page; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard }, { label: "Wallet", icon: Wallet },
  { label: "Transfers", icon: Send }, { label: "Exchange", icon: ArrowLeftRight },
  { label: "AI assistant", icon: Bot }, { label: "Activity", icon: Activity }
];

export default function App() {
  const {wallets,transactions}=useDemoState();
  const [showLanding, setShowLanding] = useState(true);
  const [page, setPage] = useState<Page>("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (next: Page) => { setPage(next); setMenuOpen(false); };
  if (showLanding) return <LandingPage onEnter={() => setShowLanding(false)} />;
  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Globe2 size={21}/></div><span>zorvian<span className="brand-period">.</span></span><button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={19}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="main-nav" aria-label="Main navigation">{pages.map(({label,icon:Icon}) => <button key={label} className={`nav-item ${page===label?"active":""}`} onClick={() => go(label)}><Icon size={18}/><span>{label}</span>{label==="AI assistant"&&<span className="nav-new">AI</span>}</button>)}</nav>
      <div className="sidebar-bottom"><button className={`nav-item ${page==="Settings"?"active":""}`} onClick={() => go("Settings")}><Settings size={18}/><span>Settings</span></button><button className="nav-item" onClick={() => go("Activity")}><CircleHelp size={18}/><span>Help & support</span></button><div className="profile-card"><div className="avatar">ZD</div><div className="profile-copy"><strong>Zorvian Demo</strong><span>Prototype account</span></div><ChevronDown size={16}/></div></div>
    </aside>
    {menuOpen&&<button className="scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={21}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div><div className="topbar-actions"><span className="environment-pill"><span/>Demo environment</span><button className="icon-button notification-button" aria-label="Notifications"><Bell size={19}/><i/></button><div className="top-avatar">ZD</div></div></header>
      <div className="content">
        <div className="welcome-row"><div><div className="eyebrow">YOUR FINANCIAL WORKSPACE</div><h1>{page==="Overview"?"Good morning":page}</h1><p className="page-subtitle">{page==="Overview"?"Here’s your financial snapshot at a glance.":description(page)}</p></div><button className="primary-button" onClick={() => go("Transfers")}><Plus size={17}/> New transfer</button></div>
        <div className="demo-notice"><ShieldCheck size={17}/><span><strong>Prototype mode.</strong> All balances and activity are fictional. No real transactions can be made.</span></div>
        {page==="Overview"?<>
          <section className="balance-grid">
            <article className="balance-card"><div className="card-topline"><span>Total portfolio value</span><Wallet size={17}/></div><div className="balance-amount">₦2,450,000<span>.00</span></div><div className="balance-foot"><span className="positive"><ArrowUpRight size={15}/>8.4%</span><span>illustrative monthly change</span></div><div className="balance-decoration decoration-one"/><div className="balance-decoration decoration-two"/></article>
            <Metric title="NGN wallet balance" value={formatDemoMoney(wallets.find(w=>w.code==="NGN")!.balance,"NGN")} caption="Current fictional naira balance" icon={<Wallet size={18}/>} tone="violet"/>
            <Metric title="Monthly movement" value="₦629,500" caption="Illustrative activity total" icon={<ArrowLeftRight size={18}/>} tone="blue"/>
          </section>
          <section className="section-grid">
            <article className="panel"><div className="panel-heading"><div><h2>Your wallets</h2><p>Balances across currencies</p></div><button className="text-button" onClick={() => go("Wallet")}>View all <ArrowUpRight size={15}/></button></div><div className="wallet-list">{wallets.map(w=><WalletRow key={w.code} flag={w.flag} currency={w.name} code={w.code} amount={formatDemoMoney(w.balance,w.code)}/>) }</div><button className="outline-button full-button" onClick={() => go("Wallet")}><Plus size={16}/> Explore wallets</button></article>
            <article className="panel assistant-panel"><div className="assistant-orb"><Sparkles size={22}/></div><div className="assistant-tag"><span/> ZORVIAN INTELLIGENCE</div><h2>Your finances, in conversation.</h2><p>Ask questions, explore currency options, and understand your activity with an AI assistant.</p><button className="assistant-button" onClick={() => go("AI assistant")}>Explore AI assistant <ArrowUpRight size={16}/></button><div className="assistant-glow"/></article>
          </section>
          <section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Your latest demo transactions</p></div><button className="text-button" onClick={() => go("Activity")}>View activity <ArrowUpRight size={15}/></button></div><div className="activity-list">{transactions.slice(0,3).map(item=><ActivityRow key={item.id} icon={item.type==="exchange"?<ArrowLeftRight size={17}/>:item.incoming?<ArrowDownLeft size={17}/>:<ArrowUpRight size={17}/>} title={item.title} detail={item.date+" · "+item.id} amount={item.amount} incoming={item.incoming}/>)}</div></section>
        </>:page==="AI assistant"?<AssistantWorkspace/>:page==="Wallet"?<WalletWorkspace/>:page==="Transfers"?<TransfersWorkspace/>:page==="Exchange"?<ExchangeWorkspace/>:page==="Activity"?<ActivityWorkspace/>:<section className="panel placeholder-panel"><div className="placeholder-icon">{page==="AI assistant"?<Bot size={25}/>:page==="Transfers"?<Send size={25}/>:page==="Exchange"?<ArrowLeftRight size={25}/>:page==="Wallet"?<Wallet size={25}/>:<CreditCard size={25}/>}</div><span className="eyebrow">UPCOMING BUILD MILESTONE</span><h2>{page} workspace</h2><p>This area is included in the Zorvian product plan. We’ll implement and test it in a dedicated milestone. No live financial services are connected.</p><button className="outline-button" onClick={() => go("Overview")}>Back to overview</button></section>}
        <footer className="footer"><span>© 2026 Zorvian · Product prototype</span><span><ShieldCheck size={14}/> Built with security in mind</span></footer>
      </div>
    </main>
  </div>;
}

function LandingPage({onEnter}:{onEnter:()=>void}) {
 return <div className="landing-page"><header className="landing-nav"><a className="landing-brand" href="#home"><span className="landing-brand-icon"><Globe2 size={20}/></span>zorvian<span>.</span></a><nav><a href="#features">Why Zorvian</a><a href="#security">Security</a></nav><button className="landing-signin" onClick={onEnter}>Explore demo <ArrowRight size={16}/></button></header>
 <main id="home"><section className="landing-hero"><div className="landing-hero-copy"><div className="landing-kicker"><span/> THE NEXT CHAPTER OF AFRICAN FINANCE</div><h1>Money should move as <em>freely</em> as you do.</h1><p className="landing-lede">A smarter way to move, exchange and manage money across borders. One connected financial experience, designed with Africa in mind.</p><div className="landing-actions"><button className="landing-primary" onClick={onEnter}>Explore the experience <ArrowRight size={17}/></button><a className="landing-secondary" href="#features">Discover Zorvian ↓</a></div><div className="landing-proof"><div className="proof-avatars"><span>₦</span><span>$</span><span>GH</span></div><div><strong>Built for a connected Africa</strong><small>One experience. Multiple currencies.</small></div></div></div>
 <div className="landing-visual"><div className="visual-glow"/><div className="visual-card"><div className="visual-card-top"><strong>◉ zorvian.</strong><span>DEMO PREVIEW</span></div><div className="visual-card-label">YOUR MONEY, IN MOTION</div><div className="visual-card-total">₦ 2,450,000<span>.00</span></div><div className="visual-card-change"><ArrowUpRight size={14}/> Illustrative portfolio</div><div className="visual-card-divider"/><small>AVAILABLE CURRENCIES</small><div className="currency-chips"><span>🇳🇬 NGN</span><span>🇺🇸 USD</span><span>🇬🇭 GHS</span></div></div><div className="floating-chip chip-transfer"><ArrowLeftRight size={17}/><span><strong>Cross-border</strong><small>Designed to connect</small></span><CheckCircle2 size={16}/></div><div className="floating-chip chip-ai"><Sparkles size={18}/><span><strong>Intelligence built in</strong><small>Finance, made clearer</small></span></div></div></section>
 <section className="landing-strip"><div><strong>Multi-currency by design</strong><span>Think beyond borders.</span></div><i/><div><strong>Intelligence, built in</strong><span>Make informed decisions.</span></div><i/><div><strong>Designed for Africa</strong><span>Connected financial experiences.</span></div></section>
 <section className="landing-features" id="features"><div className="landing-section-heading"><span className="landing-kicker">A BETTER WAY TO MANAGE MONEY</span><h2>One experience.<br/><em>More possibilities.</em></h2><p>From everyday money management to cross-border possibilities, Zorvian brings your financial world into one thoughtful space.</p></div><div className="feature-grid"><article><div className="feature-icon"><Wallet size={21}/></div><h3>Multi-currency wallets</h3><p>Keep your different currency experiences together in one clear view.</p></article><article><div className="feature-icon"><Globe2 size={21}/></div><h3>Move across borders</h3><p>Explore a simpler experience for sending and receiving money internationally.</p></article><article><div className="feature-icon"><Sparkles size={21}/></div><h3>Intelligence that helps</h3><p>Ask questions and make sense of your financial activity through conversation.</p></article></div></section>
 <section className="landing-security" id="security"><div className="security-icon"><ShieldCheck size={25}/></div><div><span className="landing-kicker">SECURITY IS A FOUNDATION</span><h2>Built with care. Designed for trust.</h2><p>Security, privacy and responsible financial infrastructure are core design priorities. This prototype uses fictional data and does not process real payments.</p></div><button className="landing-outline" onClick={onEnter}>View the prototype <ArrowRight size={16}/></button></section><footer className="landing-footer"><a className="landing-brand" href="#home">zorvian<span>.</span></a><span>© 2026 Zorvian · Product prototype</span><span>Designed for a connected Africa.</span></footer></main></div>;
}

type ChatMessage = { role: "assistant" | "user"; content: string };

function getAssistantReply(prompt: string) {
  const q = prompt.toLowerCase();
  if (q.includes("balance") || q.includes("wallet") || q.includes("portfolio")) {
    return "Your fictional demo portfolio is ₦2,450,000.00. The demo wallets show ₦1,820,500.00 in NGN, $420.00 in USD and GH₵2,150.00 in GHS. These are sample figures, not connected account balances.";
  }
  if (q.includes("exchange") || q.includes("convert") || q.includes("rate") || q.includes("usd") || q.includes("naira")) {
    return "I can help you explore a currency conversion. This prototype is not connected to a live foreign-exchange feed, so I won't present an invented rate as current. A later exchange screen will show an indicative demo quote, fees and the amount the recipient would receive before any confirmation.";
  }
  if (q.includes("transfer") || q.includes("send money") || q.includes("payment")) {
    return "I can guide you through a transfer request, including the recipient, destination currency, amount and any displayed fees. This is a prototype: no money can be sent. In a real product, I would show you the full details and require your explicit confirmation before a transfer could be submitted.";
  }
  if (q.includes("transaction") || q.includes("activity") || q.includes("spend")) {
    return "The latest fictional activity in this demo includes a ₦350,000 salary payment, a ₦45,000 transfer to Chidi and a $120 currency exchange. These entries are illustrative only and are not real transactions.";
  }
  if (q.includes("help") || q.includes("what can you do") || q.includes("features")) {
    return "I can help you understand the demo wallets and balances, explain how transfers could work, discuss currency conversion, and summarise the sample transaction activity. I cannot access bank accounts, fetch live exchange rates or move money in this prototype.";
  }
  return "I can help with your demo wallet balances, currency conversion concepts, transfers and transaction activity. Try one of the suggested questions below. Remember, Zorvian is currently a simulation and is not connected to real financial accounts.";
}

function AssistantWorkspace() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! I'm Zorvian Intelligence. I can help you explore your demo wallets, understand sample activity and learn how cross-border money movement could work. What would you like to know?" }
  ]);
  const [draft, setDraft] = useState("");
  const send = (value = draft) => {
    const prompt = value.trim();
    if (!prompt) return;
    setMessages(current => [...current, { role: "user", content: prompt }, { role: "assistant", content: getAssistantReply(prompt) }]);
    setDraft("");
  };
  const suggestions = ["What is my total balance?", "Explain currency exchange", "How would a transfer work?", "Summarise my recent activity"];
  return <section className="assistant-workspace">
    <div className="assistant-chat-heading">
      <div className="assistant-chat-identity"><div className="assistant-chat-avatar"><Sparkles size={19}/></div><div><h2>Zorvian Intelligence</h2><p><span/> Demo assistant · Ready to help</p></div></div>
      <span className="assistant-version">PROTOTYPE</span>
    </div>
    <div className="assistant-chat-notice"><ShieldCheck size={15}/><span>Demo assistant. It uses fictional account information and cannot access accounts or make payments.</span></div>
    <div className="assistant-messages" aria-live="polite">
      {messages.map((message,index) => <div className={`assistant-message ${message.role}`} key={index}>
        {message.role==="assistant"&&<div className="message-avatar"><Bot size={16}/></div>}
        <div className="message-bubble"><span className="message-author">{message.role==="assistant"?"Zorvian":"You"}</span><p>{message.content}</p></div>
      </div>)}
    </div>
    <div className="assistant-suggestions"><span>TRY ASKING</span><div>{suggestions.map(item=><button key={item} onClick={()=>send(item)}>{item}</button>)}</div></div>
    <form className="assistant-composer" onSubmit={event=>{event.preventDefault();send();}}>
      <input value={draft} onChange={event=>setDraft(event.target.value)} placeholder="Ask Zorvian about your finances..." aria-label="Message Zorvian Intelligence"/>
      <button type="submit" disabled={!draft.trim()} aria-label="Send message"><Send size={17}/></button>
    </form>
    <p className="assistant-disclaimer">Zorvian can make mistakes. Verify important financial information independently.</p>
  </section>;
}


function ActivityWorkspace(){
 const {transactions}=useDemoState();
 const [search,setSearch]=useState("");
 const [currency,setCurrency]=useState("all");
 const [type,setType]=useState("all");
 const [fromDate,setFromDate]=useState("");
 const [toDate,setToDate]=useState("");
 const [selected,setSelected]=useState<DemoTransaction|null>(null);
 const [dateNotice,setDateNotice]=useState("");
 const filtered=transactions.filter(item=>{
  const q=search.trim().toLowerCase();
  const matchesSearch=!q||[item.title,item.detail,item.id,item.currency].some(value=>value.toLowerCase().includes(q));
  const matchesCurrency=currency==="all"||item.currency===currency;
  const matchesType=type==="all"||item.type===type;
  const day=item.timestamp?item.timestamp.slice(0,10):"";
  const matchesFrom=!fromDate||(!!day&&day>=fromDate);
  const matchesTo=!toDate||(!!day&&day<=toDate);
  return matchesSearch&&matchesCurrency&&matchesType&&matchesFrom&&matchesTo;
 });
 const exportCsv=()=>{
  const headers=["Reference","Type","Title","Description","Amount","Currency","Date","Timestamp","Status","Direction"];
  const rows=filtered.map(item=>[item.id,item.type,item.title,item.detail,item.amount,item.currency,item.date,item.timestamp||"", "SIMULATED",item.incoming?"Incoming":"Outgoing"]);
  const escape=(value:string)=>'"'+String(value).replace(/"/g,'""')+'"';
  const csv=[headers,...rows].map(row=>row.map(value=>escape(String(value))).join(",")).join("\\r\
");
  const blob=new Blob(["\\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");link.href=url;link.download="zorvian-demo-transactions.csv";document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
 };
 const clearFilters=()=>{setSearch("");setCurrency("all");setType("all");setFromDate("");setToDate("");setDateNotice("");};
 return <section className="shared-activity-workspace">
  <div className="shared-activity-intro"><div><span className="eyebrow">YOUR DEMO LEDGER</span><h2>Every activity, in one place.</h2><p>Search, review and export your simulated wallet activity.</p></div><span className="wallet-demo-chip"><ShieldCheck size={14}/> Browser demo data</span></div>
  <div className="shared-activity-summary"><div><span>Total records</span><strong>{transactions.length}</strong></div><div><span>Matching records</span><strong>{filtered.length}</strong></div><div><span>Environment</span><strong>Simulation only</strong></div></div>
  <section className="transfer-history-panel shared-ledger-panel">
   <div className="panel-heading"><div><h2>Transaction history</h2><p>Filter and inspect your demo records</p></div><button className="primary-button activity-export-button" onClick={exportCsv} disabled={!filtered.length}><Download size={15}/> Export CSV</button></div>
   <div className="activity-filter-bar">
    <label className="activity-search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, reference or description" aria-label="Search transactions"/></label>
    <label><span>Currency</span><select value={currency} onChange={e=>setCurrency(e.target.value)}><option value="all">All currencies</option><option value="NGN">NGN</option><option value="USD">USD</option><option value="GHS">GHS</option></select></label>
    <label><span>Type</span><select value={type} onChange={e=>setType(e.target.value)}><option value="all">All types</option><option value="credit">Wallet credits</option><option value="transfer">Transfers</option><option value="exchange">Exchanges</option></select></label>
    <label><span>From date</span><input type="date" value={fromDate} onChange={e=>{setFromDate(e.target.value);setDateNotice("");}}/></label>
    <label><span>To date</span><input type="date" value={toDate} onChange={e=>{setToDate(e.target.value);setDateNotice("");}}/></label>
    <button className="outline-button activity-clear-button" onClick={clearFilters}><Filter size={14}/> Clear filters</button>
   </div>
   {(fromDate||toDate)&&transactions.some(item=>!item.timestamp)&&<p className="activity-date-note">Date filtering applies to records created with a precise timestamp. Older sample entries have display dates only and are excluded from date-filtered results.</p>}
   {dateNotice&&<p className="activity-date-note">{dateNotice}</p>}
   {filtered.length===0?<div className="shared-ledger-empty"><Activity size={25}/><strong>No matching activity</strong><span>Try changing your search or filters.</span></div>:<div className="activity-table-list">{filtered.map(item=><div className="activity-row" key={item.id}>
    <div className={"activity-icon "+(item.incoming?"incoming":"")}>{item.type==="exchange"?<ArrowLeftRight size={17}/>:item.incoming?<ArrowDownLeft size={17}/>:<ArrowUpRight size={17}/>}</div>
    <div className="activity-copy"><strong>{item.title}</strong><span>{item.detail} · {item.date} · {item.id}</span></div>
    <div className="shared-ledger-amount"><strong className={item.incoming?"incoming-text":""}>{item.amount}</strong><span>{item.currency} · SIMULATED</span></div>
    <button className="activity-view-button" onClick={()=>setSelected(item)} aria-label={"View details for "+item.title}><Search size={15}/> Details</button>
   </div>)}</div>}
   <div className="activity-results-footer">Showing {filtered.length} of {transactions.length} records · All entries are simulated</div>
  </section>
  <p className="transfer-disclaimer">This history is stored in this browser for the prototype. Clearing browser storage or using another browser/device may reset or separate the demo data. It is not a bank statement.</p>
  {selected&&<div className="wallet-modal-backdrop" onClick={()=>setSelected(null)}><section className="wallet-modal activity-detail-modal" role="dialog" aria-modal="true" aria-labelledby="activity-detail-title" onClick={e=>e.stopPropagation()}>
   <button type="button" className="wallet-modal-close" onClick={()=>setSelected(null)} aria-label="Close details"><X size={18}/></button>
   <div className="wallet-modal-icon"><Activity size={21}/></div><span className="eyebrow">TRANSACTION RECORD</span><h2 id="activity-detail-title">{selected.title}</h2>
   <div className="activity-detail-status">SIMULATED · NOT A REAL PAYMENT</div>
   <div className="transfer-review-rows">
    <div><span>Reference</span><strong>{selected.id}</strong></div><div><span>Type</span><strong>{selected.type}</strong></div><div><span>Description</span><strong>{selected.detail}</strong></div><div><span>Amount</span><strong>{selected.amount} {selected.currency}</strong></div><div><span>Date shown</span><strong>{selected.date}</strong></div><div><span>Precise timestamp</span><strong>{selected.timestamp?new Date(selected.timestamp).toLocaleString():"Not available for this seeded sample"}</strong></div><div><span>Fee information</span><strong>{selected.fee||(selected.type==="credit"?"Not applicable":"Not recorded")}</strong></div><div><span>Status</span><strong>SIMULATED</strong></div>
   </div>
   <div className="wallet-modal-actions"><button type="button" className="primary-button" onClick={()=>setSelected(null)}>Close details</button></div>
  </section></div>}
 </section>;
}

function description(page:Page){const copy:Record<Page,string>={Overview:"Here’s your financial snapshot at a glance.",Wallet:"Manage your multi-currency wallet experience.",Transfers:"Explore the cross-border transfer journey.",Exchange:"Preview currency conversion experiences.","AI assistant":"A conversational way to explore your finances.",Activity:"Review your transaction activity.",Settings:"Manage your profile and preferences."};return copy[page];}
function Metric({title,value,caption,icon,tone}:{title:string;value:string;caption:string;icon:React.ReactNode;tone:string}){return <article className="metric-card"><div className="metric-heading"><span>{title}</span><div className={`metric-icon ${tone}`}>{icon}</div></div><div className="metric-value">{value}</div><span className="metric-caption">{caption}</span></article>}
function WalletRow({flag,currency,code,amount}:{flag:string;currency:string;code:string;amount:string}){return <div className="wallet-row"><div className="currency-flag">{flag}</div><div className="wallet-currency"><strong>{currency}</strong><span>{code}</span></div><strong className="wallet-amount">{amount}</strong></div>}
function ActivityRow({icon,title,detail,amount,incoming=false}:{icon:React.ReactNode;title:string;detail:string;amount:string;incoming?:boolean}){return <div className="activity-row"><div className={`activity-icon ${incoming?"incoming":""}`}>{icon}</div><div className="activity-copy"><strong>{title}</strong><span>{detail}</span></div><strong className={`activity-amount ${incoming?"incoming-text":""}`}>{amount}</strong></div>}

type DemoWallet={code:"NGN"|"USD"|"GHS";name:string;flag:string;symbol:string;balance:number};
const startingWallets:DemoWallet[]=[
 {code:"NGN",name:"Nigerian Naira",flag:"🇳🇬",symbol:"₦",balance:1820500},
 {code:"USD",name:"US Dollar",flag:"🇺🇸",symbol:"$",balance:420},
 {code:"GHS",name:"Ghanaian Cedi",flag:"🇬🇭",symbol:"GH₵",balance:2150}
];

type DemoTransaction={id:string;type:"credit"|"transfer"|"exchange";title:string;detail:string;amount:string;currency:string;date:string;timestamp?:string;fee?:string;incoming:boolean};
type DemoState={wallets:DemoWallet[];transactions:DemoTransaction[]};
const initialDemoState:DemoState={wallets:startingWallets,transactions:[
 {id:"DEMO-1001",type:"credit",title:"Salary payment",detail:"Sample incoming payment",amount:"+₦350,000.00",currency:"NGN",date:"Today · 09:42 AM",incoming:true},
 {id:"DEMO-1002",type:"transfer",title:"Transfer to Chidi",detail:"Sample outgoing transfer",amount:"−₦45,000.00",currency:"NGN",date:"Yesterday · 04:18 PM",incoming:false},
 {id:"DEMO-1003",type:"exchange",title:"Currency exchange",detail:"Sample conversion activity",amount:"−$120.00",currency:"USD",date:"Nov 07 · 11:06 AM",incoming:false}
]};
const listeners=new Set<()=>void>();
let demoState:DemoState=(()=>{try{const saved=localStorage.getItem("zorvian-demo-ledger-v1");return saved?JSON.parse(saved) as DemoState:initialDemoState;}catch{return initialDemoState;}})();
function subscribeDemo(listener:()=>void){listeners.add(listener);return()=>listeners.delete(listener);}
function getDemoSnapshot(){return demoState;}
function updateDemoState(updater:(current:DemoState)=>DemoState){demoState=updater(demoState);try{localStorage.setItem("zorvian-demo-ledger-v1",JSON.stringify(demoState));}catch{}listeners.forEach(listener=>listener());}
function useDemoState(){return useSyncExternalStore(subscribeDemo,getDemoSnapshot,getDemoSnapshot);}
function formatDemoMoney(value:number,code:DemoWallet["code"]){const wallet=startingWallets.find(w=>w.code===code)!;return wallet.symbol+value.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});}

const walletActivity:Record<DemoWallet["code"],{title:string;detail:string;amount:string;incoming?:boolean}[]>={
 NGN:[{title:"Salary payment",detail:"Today · 09:42 AM",amount:"+₦350,000.00",incoming:true},{title:"Transfer to Chidi",detail:"Yesterday · 04:18 PM",amount:"−₦45,000.00"},{title:"Online purchase",detail:"Nov 08 · 01:12 PM",amount:"−₦18,500.00"}],
 USD:[{title:"Currency exchange",detail:"Nov 07 · 11:06 AM",amount:"+$120.00",incoming:true},{title:"Subscription",detail:"Nov 05 · 08:30 AM",amount:"−$15.00"}],
 GHS:[{title:"Demo wallet credit",detail:"Nov 06 · 10:15 AM",amount:"+GH₵500.00",incoming:true},{title:"Local payment",detail:"Nov 04 · 02:20 PM",amount:"−GH₵75.00"}]
};
function WalletWorkspace(){
 const {wallets,transactions}=useDemoState();
 const [selected,setSelected]=useState<DemoWallet["code"]>("NGN"),[addOpen,setAddOpen]=useState(false),[amount,setAmount]=useState(""),[notice,setNotice]=useState("");
 const active=wallets.find(w=>w.code===selected) ?? wallets[0];
 const money=active.symbol+active.balance.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
 const addFunds=(e:React.FormEvent)=>{e.preventDefault();const value=Number(amount);if(!Number.isFinite(value)||value<=0||value>100000000){setNotice("Enter a valid positive amount.");return;}updateDemoState(state=>({...state,wallets:state.wallets.map(w=>w.code===selected?{...w,balance:w.balance+value}:w),transactions:[{id:"CREDIT-"+Math.random().toString(36).slice(2,8).toUpperCase(),type:"credit",title:"Demo funds added",detail:"Manual prototype wallet credit",amount:"+"+formatDemoMoney(value,selected),currency:selected,date:new Date().toLocaleString(),timestamp:new Date().toISOString(),incoming:true},...state.transactions]}));setNotice("Demo funds added and recorded in shared activity. No real money was moved.");setAmount("");setAddOpen(false);};
 return <div className="wallet-workspace">
  <div className="wallet-workspace-intro"><div><span className="eyebrow">YOUR CURRENCY ACCOUNTS</span><h2>All your wallets, together.</h2><p>Explore sample balances and individual wallet activity.</p></div><span className="wallet-demo-chip"><ShieldCheck size={14}/> Fictional balances</span></div>
  <div className="wallet-card-grid">{wallets.map(w=><button key={w.code} className={"currency-wallet-card "+(selected===w.code?"selected":"")} onClick={()=>{setSelected(w.code);setNotice("");}}><span className="currency-wallet-flag">{w.flag}</span><span className="currency-wallet-code">{w.code}</span><span className="currency-wallet-name">{w.name}</span><strong>{w.symbol+w.balance.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><span className="currency-wallet-link">View wallet details <ArrowUpRight size={14}/></span></button>)}</div>
  <section className="wallet-detail-panel"><div className="wallet-detail-heading"><div><span className="eyebrow">WALLET DETAILS</span><h2>{active.flag} {active.name}</h2><p>{active.code} · Demo account</p></div><button className="primary-button wallet-add-button" onClick={()=>{setAddOpen(true);setNotice("");}}><Plus size={16}/> Add demo funds</button></div>
   <div className="wallet-detail-balance"><span>Available demo balance</span><strong>{money}</strong><small>Sample balance only · Not connected to a bank or payment provider</small></div>
   <div className="wallet-detail-activity"><div className="panel-heading"><div><h2>Wallet activity</h2><p>Illustrative entries for {active.code}</p></div><span className="wallet-activity-count">{walletActivity[selected].length} entries</span></div>
   {transactions.filter(t=>t.currency===selected).map((item,i)=><div className="activity-row" key={item.id}><div className={"activity-icon "+(item.incoming?"incoming":"")}>{item.incoming?<ArrowDownLeft size={17}/>:<ArrowUpRight size={17}/>}</div><div className="activity-copy"><strong>{item.title}</strong><span>{item.detail}</span></div><strong className={"activity-amount "+(item.incoming?"incoming-text":"")}>{item.amount}</strong></div>)}</div>
   {notice&&<div className="wallet-feedback"><CheckCircle2 size={16}/>{notice}</div>}
  </section>
  {addOpen&&<div className="wallet-modal-backdrop" onClick={()=>setAddOpen(false)}><form className="wallet-modal" onSubmit={addFunds} onClick={e=>e.stopPropagation()}><button type="button" className="wallet-modal-close" onClick={()=>setAddOpen(false)} aria-label="Close"><X size={18}/></button><div className="wallet-modal-icon"><Plus size={21}/></div><span className="eyebrow">PROTOTYPE ACTION</span><h2>Add demo funds</h2><p>This only increases the sample balance. No payment will be collected.</p><label htmlFor="demo-fund-amount">Amount ({active.code})</label><input id="demo-fund-amount" type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Enter amount"/><div className="wallet-modal-actions"><button type="button" className="outline-button" onClick={()=>setAddOpen(false)}>Cancel</button><button type="submit" className="primary-button">Add demo funds</button></div></form></div>}
 </div>;
}



type ExchangeCode="NGN"|"USD"|"GHS";
const demoRates:Record<ExchangeCode,Record<ExchangeCode,number>>={
 NGN:{NGN:1,USD:0.00065,GHS:0.0098},
 USD:{NGN:1538.46,USD:1,GHS:15.08},
 GHS:{NGN:102.04,USD:0.0663,GHS:1}
};
const exchangeSymbols:Record<ExchangeCode,string>={NGN:"₦",USD:"$",GHS:"GH₵"};
const exchangeBalances:Record<ExchangeCode,number>={NGN:1820500,USD:420,GHS:2150};
function ExchangeWorkspace(){
 const {wallets}=useDemoState();
 const [from,setFrom]=useState<ExchangeCode>("NGN");
 const [to,setTo]=useState<ExchangeCode>("USD");
 const [amount,setAmount]=useState("100000");
 const [review,setReview]=useState(false);
 const [records,setRecords]=useState<{id:string;from:string;to:string;date:string}[]>([]);
 const [notice,setNotice]=useState("");
 const source=Number(amount);
 const rate=demoRates[from][to];
 const fee=source*.005;
 const received=(source-fee)*rate;
 const currentBalances={NGN:wallets.find(w=>w.code==="NGN")!.balance,USD:wallets.find(w=>w.code==="USD")!.balance,GHS:wallets.find(w=>w.code==="GHS")!.balance};
 const valid=from!==to&&Number.isFinite(source)&&source>0&&source<=currentBalances[from];
 const money=(v:number,c:ExchangeCode)=>exchangeSymbols[c]+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
 const swap=()=>{setFrom(to);setTo(from);setReview(false);setNotice("");};
 const submit=(e:React.FormEvent)=>{e.preventDefault();setNotice("");if(!valid){setNotice(from===to?"Choose two different currencies.":source>currentBalances[from]?"Amount exceeds the illustrative source wallet balance.":"Enter a valid amount.");return;}setReview(true);};
 const confirm=()=>{const id="FX-"+Math.random().toString(36).slice(2,8).toUpperCase();const date=new Date().toLocaleString();setRecords(items=>[{id,from:money(source,from)+" "+from,to:money(received,to)+" "+to,date},...items]);updateDemoState(state=>({...state,wallets:state.wallets.map(w=>w.code===from?{...w,balance:w.balance-source}:w.code===to?{...w,balance:w.balance+received}:w),transactions:[{id,type:"exchange",title:"Converted "+from+" to "+to,detail:money(source,from)+" "+from+" → "+money(received,to)+" "+to+" (includes 0.5% demo fee)",amount:"−"+money(source,from),currency:from,date,timestamp:new Date().toISOString(),fee:money(fee,from),incoming:false},...state.transactions]}));setReview(false);setNotice("Demo conversion recorded. Both fictional wallet balances and shared activity have been updated.");};
 return <div className="exchange-workspace">
  <div className="exchange-intro"><div><span className="eyebrow">CURRENCY CONVERSION</span><h2>One world. Multiple currencies.</h2><p>Preview a conversion across the currencies in your demo wallets.</p></div><span className="wallet-demo-chip"><ShieldCheck size={14}/> Indicative demo rates</span></div>
  <div className="exchange-layout">
   <section className="exchange-converter-panel">
    <div className="exchange-panel-title"><div><h3>Currency converter</h3><p>Explore an illustrative conversion quote.</p></div><span className="exchange-live-tag"><i/> DEMO QUOTE</span></div>
    {review?<div className="exchange-review">
      <div className="transfer-review-banner"><ShieldCheck size={17}/> Review your conversion before confirming.</div>
      <div className="exchange-review-total"><span>You convert</span><strong>{money(source,from)} <small>{from}</small></strong></div>
      <div className="exchange-review-equals">↓</div>
      <div className="exchange-review-total receive"><span>Estimated demo amount</span><strong>{money(received,to)} <small>{to}</small></strong></div>
      <div className="transfer-review-rows"><div><span>Indicative rate</span><strong>1 {from} = {rate.toLocaleString("en-US",{maximumFractionDigits:6})} {to}</strong></div><div><span>Demo fee (0.5%)</span><strong>{money(fee,from)}</strong></div><div><span>Rate source</span><strong>Fixed prototype sample</strong></div></div>
      <div className="transfer-review-actions"><button className="outline-button" onClick={()=>setReview(false)}>Edit</button><button className="primary-button" onClick={confirm}><CheckCircle2 size={16}/> Confirm demo conversion</button></div>
      <p className="transfer-disclaimer">This updates only the fictional source and destination wallets and shared demo ledger. No real funds move and no live rate is used.</p>
    </div>:<form className="exchange-form" onSubmit={submit}>
      <div className="exchange-currency-box"><label htmlFor="exchange-from">You convert</label><div className="exchange-input-row"><input id="exchange-amount" aria-label="Amount to convert" type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/><select id="exchange-from" value={from} onChange={e=>setFrom(e.target.value as ExchangeCode)}><option value="NGN">🇳🇬 NGN</option><option value="USD">🇺🇸 USD</option><option value="GHS">🇬🇭 GHS</option></select></div><small>Demo balance: {money(currentBalances[from],from)}</small></div>
      <div className="exchange-swap-row"><span/><button type="button" onClick={swap} aria-label="Swap currencies"><ArrowLeftRight size={17}/></button><span/></div>
      <div className="exchange-currency-box receive-box"><label htmlFor="exchange-to">You receive (estimated)</label><div className="exchange-input-row"><strong>{Number.isFinite(source)&&source>0?money(Math.max(0,received),to):money(0,to)}</strong><select id="exchange-to" value={to} onChange={e=>setTo(e.target.value as ExchangeCode)}><option value="NGN">🇳🇬 NGN</option><option value="USD">🇺🇸 USD</option><option value="GHS">🇬🇭 GHS</option></select></div><small>Illustrative estimate only</small></div>
      <div className="exchange-quote-details"><div><span>Indicative demo rate</span><strong>1 {from} = {rate.toLocaleString("en-US",{maximumFractionDigits:6})} {to}</strong></div><div><span>Demo conversion fee</span><strong>0.5% · {money(Number.isFinite(source)&&source>0?fee:0,from)}</strong></div></div>
      {notice&&<div className="transfer-feedback">{notice}</div>}
      <button type="submit" className="primary-button exchange-submit">Review conversion <ArrowRight size={16}/></button>
    </form>}
   </section>
   <aside className="exchange-info-panel"><div className="transfer-side-icon"><Globe2 size={21}/></div><h3>Currency without borders</h3><p>Zorvian is designed to make multi-currency experiences easier to understand. This screen demonstrates how a clear conversion quote could work.</p><div className="exchange-info-stat"><span>Supported demo currencies</span><strong>NGN · USD · GHS</strong></div><div className="exchange-info-stat"><span>Quote type</span><strong>Fixed illustrative rates</strong></div><div className="exchange-info-warning"><ShieldCheck size={16}/><span>Not connected to a live FX provider. Actual rates and fees may differ.</span></div></aside>
  </div>
  {records.length>0&&<section className="transfer-history-panel"><div className="panel-heading"><div><h2>Demo exchange activity</h2><p>Simulated conversions recorded in this browser session</p></div><span className="wallet-activity-count">{records.length} records</span></div>{records.map(r=><div className="activity-row" key={r.id}><div className="activity-icon"><ArrowLeftRight size={17}/></div><div className="activity-copy"><strong>{r.from} → {r.to}</strong><span>{r.id} · {r.date}</span></div><span className="transfer-demo-status">SIMULATED</span></div>)}</section>}
 </div>;
}

type DemoTransfer = { id:string; recipient:string; destination:string; amount:string; currency:string; date:string };
function TransfersWorkspace(){
 const {wallets}=useDemoState();
 const [currency,setCurrency]=useState<"NGN"|"USD"|"GHS">("NGN");
 const [recipient,setRecipient]=useState("");
 const [destination,setDestination]=useState("");
 const [amount,setAmount]=useState("");
 const [note,setNote]=useState("");
 const [stage,setStage]=useState<"form"|"review">("form");
 const [error,setError]=useState("");
 const [completed,setCompleted]=useState<DemoTransfer[]>([]);
 const symbols={NGN:"₦",USD:"$",GHS:"GH₵"};
 const balances={NGN:wallets.find(w=>w.code==="NGN")!.balance,USD:wallets.find(w=>w.code==="USD")!.balance,GHS:wallets.find(w=>w.code==="GHS")!.balance};
 const formatted=(value:number)=>symbols[currency]+value.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
 const value=Number(amount);
 const valid=recipient.trim().length>=2&&destination.trim().length>=4&&Number.isFinite(value)&&value>0&&value<=balances[currency];
 const review=(e:React.FormEvent)=>{e.preventDefault();setError("");if(!valid){setError(value>balances[currency]?"The amount exceeds the illustrative available balance.":"Complete all fields and enter a valid amount.");return;}setStage("review");};
 const confirm=()=>{const id="ZDV-"+Math.random().toString(36).slice(2,8).toUpperCase();const date=new Date().toLocaleString();setCompleted(items=>[{id,recipient:recipient.trim(),destination:destination.trim(),amount:formatted(value),currency,date},...items]);updateDemoState(state=>({...state,wallets:state.wallets.map(w=>w.code===currency?{...w,balance:w.balance-value}:w),transactions:[{id,type:"transfer",title:"Transfer to "+recipient.trim(),detail:"To "+destination.trim()+(note.trim()?" · "+note.trim():""),amount:"−"+formatted(value),currency,date,timestamp:new Date().toISOString(),fee:symbols[currency]+"0.00",incoming:false},...state.transactions]}));setStage("form");setRecipient("");setDestination("");setAmount("");setNote("");setError("Demo transfer recorded in shared activity and deducted from the selected fictional wallet. No real money was sent.");};
 return <div className="transfer-workspace">
  <div className="transfer-intro"><div><span className="eyebrow">SEND MONEY</span><h2>Move money with clarity.</h2><p>Explore a transfer journey with a review step before simulated confirmation.</p></div><span className="wallet-demo-chip"><ShieldCheck size={14}/> Simulation only</span></div>
  <div className="transfer-layout">
   <section className="transfer-form-panel">
    <div className="transfer-step-heading"><span className="transfer-step-number">{stage==="form"?"1":"2"}</span><div><h3>{stage==="form"?"Transfer details":"Review transfer"}</h3><p>{stage==="form"?"Enter the recipient and amount.":"Check the details before recording this demo."}</p></div></div>
    {stage==="form"?<form onSubmit={review} className="transfer-form">
      <label htmlFor="transfer-currency">Send from</label><select id="transfer-currency" value={currency} onChange={e=>setCurrency(e.target.value as typeof currency)}><option value="NGN">🇳🇬 Nigerian Naira (NGN)</option><option value="USD">🇺🇸 US Dollar (USD)</option><option value="GHS">🇬🇭 Ghanaian Cedi (GHS)</option></select>
      <div className="transfer-available">Illustrative available balance <strong>{formatted(balances[currency])}</strong></div>
      <label htmlFor="transfer-recipient">Recipient name</label><input id="transfer-recipient" value={recipient} onChange={e=>setRecipient(e.target.value)} placeholder="e.g. Amara Okafor" required/>
      <label htmlFor="transfer-destination">Destination account / wallet</label><input id="transfer-destination" value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Enter demo account or wallet ID" required/>
      <label htmlFor="transfer-amount">Amount ({currency})</label><input id="transfer-amount" type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" required/>
      <label htmlFor="transfer-note">Note <span className="optional-label">Optional</span></label><input id="transfer-note" value={note} onChange={e=>setNote(e.target.value)} placeholder="What is this transfer for?"/>
      {error&&<div className="transfer-feedback"><CheckCircle2 size={15}/>{error}</div>}
      <button type="submit" className="primary-button transfer-submit">Review transfer <ArrowRight size={16}/></button>
    </form>:<div className="transfer-review">
      <div className="transfer-review-banner"><ShieldCheck size={18}/><span>Review carefully before confirming this simulated transfer.</span></div>
      <div className="transfer-review-amount">{formatted(value)}<small>{currency}</small></div>
      <div className="transfer-review-rows"><div><span>Recipient</span><strong>{recipient}</strong></div><div><span>Destination</span><strong>{destination}</strong></div><div><span>From wallet</span><strong>{currency}</strong></div><div><span>Note</span><strong>{note||"—"}</strong></div><div><span>Demo fee</span><strong>{symbols[currency]}0.00</strong></div></div>
      <div className="transfer-review-actions"><button className="outline-button" onClick={()=>setStage("form")}>Edit details</button><button className="primary-button" onClick={confirm}><CheckCircle2 size={16}/> Confirm demo transfer</button></div>
      <p className="transfer-disclaimer">This confirmation updates only the fictional wallet and shared demo ledger in this browser. No money is sent and no external account is contacted.</p>
    </div>}
   </section>
   <aside className="transfer-side-panel"><div className="transfer-side-icon"><Send size={21}/></div><h3>Designed for confident transfers</h3><p>A real transfer flow should clearly show the recipient, currency, amount, fees and final amount before asking for explicit confirmation.</p><div className="transfer-safety-point"><ShieldCheck size={16}/><span>Explicit confirmation before any real payment</span></div><div className="transfer-safety-point"><Globe2 size={16}/><span>Cross-border support planned for future integration</span></div></aside>
  </div>
  {completed.length>0&&<section className="transfer-history-panel"><div className="panel-heading"><div><h2>Demo transfer activity</h2><p>Records created in this browser session</p></div><span className="wallet-activity-count">{completed.length} records</span></div>{completed.map(item=><div className="activity-row" key={item.id}><div className="activity-icon"><ArrowUpRight size={17}/></div><div className="activity-copy"><strong>{item.recipient} · {item.amount}</strong><span>{item.id} · {item.date}</span></div><span className="transfer-demo-status">SIMULATED</span></div>)}</section>}
 </div>;
}
