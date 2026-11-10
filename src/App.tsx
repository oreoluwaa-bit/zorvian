import { useState } from "react";
import { Activity, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, ArrowRight, Bell, Bot, CheckCircle2, ChevronDown, CircleHelp, CreditCard, Globe2, LayoutDashboard, Menu, Plus, Send, Settings, ShieldCheck, Sparkles, Wallet, X } from "lucide-react";

type Page = "Overview" | "Wallet" | "Transfers" | "Exchange" | "AI assistant" | "Activity" | "Settings";
const pages: { label: Page; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard }, { label: "Wallet", icon: Wallet },
  { label: "Transfers", icon: Send }, { label: "Exchange", icon: ArrowLeftRight },
  { label: "AI assistant", icon: Bot }, { label: "Activity", icon: Activity }
];

export default function App() {
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
            <Metric title="Available balance" value="₦1,820,500" caption="Across your demo wallets" icon={<Wallet size={18}/>} tone="violet"/>
            <Metric title="Monthly movement" value="₦629,500" caption="Illustrative activity total" icon={<ArrowLeftRight size={18}/>} tone="blue"/>
          </section>
          <section className="section-grid">
            <article className="panel"><div className="panel-heading"><div><h2>Your wallets</h2><p>Balances across currencies</p></div><button className="text-button" onClick={() => go("Wallet")}>View all <ArrowUpRight size={15}/></button></div><div className="wallet-list"><WalletRow flag="🇳🇬" currency="Nigerian Naira" code="NGN" amount="₦1,820,500.00"/><WalletRow flag="🇺🇸" currency="US Dollar" code="USD" amount="$420.00"/><WalletRow flag="🇬🇭" currency="Ghanaian Cedi" code="GHS" amount="GH₵2,150.00"/></div><button className="outline-button full-button" onClick={() => go("Wallet")}><Plus size={16}/> Explore wallets</button></article>
            <article className="panel assistant-panel"><div className="assistant-orb"><Sparkles size={22}/></div><div className="assistant-tag"><span/> ZORVIAN INTELLIGENCE</div><h2>Your finances, in conversation.</h2><p>Ask questions, explore currency options, and understand your activity with an AI assistant.</p><button className="assistant-button" onClick={() => go("AI assistant")}>Explore AI assistant <ArrowUpRight size={16}/></button><div className="assistant-glow"/></article>
          </section>
          <section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Your latest demo transactions</p></div><button className="text-button" onClick={() => go("Activity")}>View activity <ArrowUpRight size={15}/></button></div><div className="activity-list"><ActivityRow icon={<ArrowDownLeft size={17}/>} title="Salary payment" detail="Today · 09:42 AM" amount="+₦350,000.00" incoming/><ActivityRow icon={<ArrowUpRight size={17}/>} title="Transfer to Chidi" detail="Yesterday · 04:18 PM" amount="−₦45,000.00"/><ActivityRow icon={<ArrowLeftRight size={17}/>} title="Currency exchange" detail="Nov 07 · 11:06 AM" amount="−$120.00"/></div></section>
        </>:page==="AI assistant"?<AssistantWorkspace/>:page==="Wallet"?<WalletWorkspace/>:page==="Transfers"?<TransfersWorkspace/>:<section className="panel placeholder-panel"><div className="placeholder-icon">{page==="AI assistant"?<Bot size={25}/>:page==="Transfers"?<Send size={25}/>:page==="Exchange"?<ArrowLeftRight size={25}/>:page==="Wallet"?<Wallet size={25}/>:<CreditCard size={25}/>}</div><span className="eyebrow">UPCOMING BUILD MILESTONE</span><h2>{page} workspace</h2><p>This area is included in the Zorvian product plan. We’ll implement and test it in a dedicated milestone. No live financial services are connected.</p><button className="outline-button" onClick={() => go("Overview")}>Back to overview</button></section>}
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
const walletActivity:Record<DemoWallet["code"],{title:string;detail:string;amount:string;incoming?:boolean}[]>={
 NGN:[{title:"Salary payment",detail:"Today · 09:42 AM",amount:"+₦350,000.00",incoming:true},{title:"Transfer to Chidi",detail:"Yesterday · 04:18 PM",amount:"−₦45,000.00"},{title:"Online purchase",detail:"Nov 08 · 01:12 PM",amount:"−₦18,500.00"}],
 USD:[{title:"Currency exchange",detail:"Nov 07 · 11:06 AM",amount:"+$120.00",incoming:true},{title:"Subscription",detail:"Nov 05 · 08:30 AM",amount:"−$15.00"}],
 GHS:[{title:"Demo wallet credit",detail:"Nov 06 · 10:15 AM",amount:"+GH₵500.00",incoming:true},{title:"Local payment",detail:"Nov 04 · 02:20 PM",amount:"−GH₵75.00"}]
};
function WalletWorkspace(){
 const [wallets,setWallets]=useState(startingWallets),[selected,setSelected]=useState<DemoWallet["code"]>("NGN"),[addOpen,setAddOpen]=useState(false),[amount,setAmount]=useState(""),[notice,setNotice]=useState("");
 const active=wallets.find(w=>w.code===selected)!;
 const money=active.symbol+active.balance.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
 const addFunds=(e:React.FormEvent)=>{e.preventDefault();const value=Number(amount);if(!Number.isFinite(value)||value<=0||value>100000000){setNotice("Enter a valid positive amount.");return;}setWallets(ws=>ws.map(w=>w.code===selected?{...w,balance:w.balance+value}:w));setNotice("Demo funds added. No real money was moved.");setAmount("");setAddOpen(false);};
 return <div className="wallet-workspace">
  <div className="wallet-workspace-intro"><div><span className="eyebrow">YOUR CURRENCY ACCOUNTS</span><h2>All your wallets, together.</h2><p>Explore sample balances and individual wallet activity.</p></div><span className="wallet-demo-chip"><ShieldCheck size={14}/> Fictional balances</span></div>
  <div className="wallet-card-grid">{wallets.map(w=><button key={w.code} className={"currency-wallet-card "+(selected===w.code?"selected":"")} onClick={()=>{setSelected(w.code);setNotice("");}}><span className="currency-wallet-flag">{w.flag}</span><span className="currency-wallet-code">{w.code}</span><span className="currency-wallet-name">{w.name}</span><strong>{w.symbol+w.balance.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><span className="currency-wallet-link">View wallet details <ArrowUpRight size={14}/></span></button>)}</div>
  <section className="wallet-detail-panel"><div className="wallet-detail-heading"><div><span className="eyebrow">WALLET DETAILS</span><h2>{active.flag} {active.name}</h2><p>{active.code} · Demo account</p></div><button className="primary-button wallet-add-button" onClick={()=>{setAddOpen(true);setNotice("");}}><Plus size={16}/> Add demo funds</button></div>
   <div className="wallet-detail-balance"><span>Available demo balance</span><strong>{money}</strong><small>Sample balance only · Not connected to a bank or payment provider</small></div>
   <div className="wallet-detail-activity"><div className="panel-heading"><div><h2>Wallet activity</h2><p>Illustrative entries for {active.code}</p></div><span className="wallet-activity-count">{walletActivity[selected].length} entries</span></div>
   {walletActivity[selected].map((item,i)=><div className="activity-row" key={i}><div className={"activity-icon "+(item.incoming?"incoming":"")}>{item.incoming?<ArrowDownLeft size={17}/>:<ArrowUpRight size={17}/>}</div><div className="activity-copy"><strong>{item.title}</strong><span>{item.detail}</span></div><strong className={"activity-amount "+(item.incoming?"incoming-text":"")}>{item.amount}</strong></div>)}</div>
   {notice&&<div className="wallet-feedback"><CheckCircle2 size={16}/>{notice}</div>}
  </section>
  {addOpen&&<div className="wallet-modal-backdrop" onClick={()=>setAddOpen(false)}><form className="wallet-modal" onSubmit={addFunds} onClick={e=>e.stopPropagation()}><button type="button" className="wallet-modal-close" onClick={()=>setAddOpen(false)} aria-label="Close"><X size={18}/></button><div className="wallet-modal-icon"><Plus size={21}/></div><span className="eyebrow">PROTOTYPE ACTION</span><h2>Add demo funds</h2><p>This only increases the sample balance. No payment will be collected.</p><label htmlFor="demo-fund-amount">Amount ({active.code})</label><input id="demo-fund-amount" type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Enter amount"/><div className="wallet-modal-actions"><button type="button" className="outline-button" onClick={()=>setAddOpen(false)}>Cancel</button><button type="submit" className="primary-button">Add demo funds</button></div></form></div>}
 </div>;
}


type DemoTransfer = { id:string; recipient:string; destination:string; amount:string; currency:string; date:string };
function TransfersWorkspace(){
 const [currency,setCurrency]=useState<"NGN"|"USD"|"GHS">("NGN");
 const [recipient,setRecipient]=useState("");
 const [destination,setDestination]=useState("");
 const [amount,setAmount]=useState("");
 const [note,setNote]=useState("");
 const [stage,setStage]=useState<"form"|"review">("form");
 const [error,setError]=useState("");
 const [completed,setCompleted]=useState<DemoTransfer[]>([]);
 const symbols={NGN:"₦",USD:"$",GHS:"GH₵"};
 const balances={NGN:1820500,USD:420,GHS:2150};
 const formatted=(value:number)=>symbols[currency]+value.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
 const value=Number(amount);
 const valid=recipient.trim().length>=2&&destination.trim().length>=4&&Number.isFinite(value)&&value>0&&value<=balances[currency];
 const review=(e:React.FormEvent)=>{e.preventDefault();setError("");if(!valid){setError(value>balances[currency]?"The amount exceeds the illustrative available balance.":"Complete all fields and enter a valid amount.");return;}setStage("review");};
 const confirm=()=>{const id="ZDV-"+Math.random().toString(36).slice(2,8).toUpperCase();setCompleted(items=>[{id,recipient:recipient.trim(),destination:destination.trim(),amount:formatted(value),currency,date:new Date().toLocaleString()},...items]);setStage("form");setRecipient("");setDestination("");setAmount("");setNote("");setError("Demo transfer recorded. No money was sent and wallet balances were not changed.");};
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
      <p className="transfer-disclaimer">This confirmation only creates a local demo record. No money is sent, no external account is contacted and no wallet balance is changed.</p>
    </div>}
   </section>
   <aside className="transfer-side-panel"><div className="transfer-side-icon"><Send size={21}/></div><h3>Designed for confident transfers</h3><p>A real transfer flow should clearly show the recipient, currency, amount, fees and final amount before asking for explicit confirmation.</p><div className="transfer-safety-point"><ShieldCheck size={16}/><span>Explicit confirmation before any real payment</span></div><div className="transfer-safety-point"><Globe2 size={16}/><span>Cross-border support planned for future integration</span></div></aside>
  </div>
  {completed.length>0&&<section className="transfer-history-panel"><div className="panel-heading"><div><h2>Demo transfer activity</h2><p>Records created in this browser session</p></div><span className="wallet-activity-count">{completed.length} records</span></div>{completed.map(item=><div className="activity-row" key={item.id}><div className="activity-icon"><ArrowUpRight size={17}/></div><div className="activity-copy"><strong>{item.recipient} · {item.amount}</strong><span>{item.id} · {item.date}</span></div><span className="transfer-demo-status">SIMULATED</span></div>)}</section>}
 </div>;
}
