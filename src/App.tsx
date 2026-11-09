import { useState } from "react";
import { Activity, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Bell, Bot, ChevronDown, CircleHelp, CreditCard, Globe2, LayoutDashboard, Menu, Plus, Send, Settings, ShieldCheck, Sparkles, Wallet, X } from "lucide-react";

type Page = "Overview" | "Wallet" | "Transfers" | "Exchange" | "AI assistant" | "Activity" | "Settings";
const pages: { label: Page; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard }, { label: "Wallet", icon: Wallet },
  { label: "Transfers", icon: Send }, { label: "Exchange", icon: ArrowLeftRight },
  { label: "AI assistant", icon: Bot }, { label: "Activity", icon: Activity }
];

export default function App() {
  const [page, setPage] = useState<Page>("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (next: Page) => { setPage(next); setMenuOpen(false); };
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
        </>:<section className="panel placeholder-panel"><div className="placeholder-icon">{page==="AI assistant"?<Bot size={25}/>:page==="Transfers"?<Send size={25}/>:page==="Exchange"?<ArrowLeftRight size={25}/>:page==="Wallet"?<Wallet size={25}/>:<CreditCard size={25}/>}</div><span className="eyebrow">UPCOMING BUILD MILESTONE</span><h2>{page} workspace</h2><p>This area is included in the Zorvian product plan. We’ll implement and test it in a dedicated milestone. No live financial services are connected.</p><button className="outline-button" onClick={() => go("Overview")}>Back to overview</button></section>}
        <footer className="footer"><span>© 2026 Zorvian · Product prototype</span><span><ShieldCheck size={14}/> Built with security in mind</span></footer>
      </div>
    </main>
  </div>;
}
function description(page:Page){const copy:Record<Page,string>={Overview:"Here’s your financial snapshot at a glance.",Wallet:"Manage your multi-currency wallet experience.",Transfers:"Explore the cross-border transfer journey.",Exchange:"Preview currency conversion experiences.","AI assistant":"A conversational way to explore your finances.",Activity:"Review your transaction activity.",Settings:"Manage your profile and preferences."};return copy[page];}
function Metric({title,value,caption,icon,tone}:{title:string;value:string;caption:string;icon:React.ReactNode;tone:string}){return <article className="metric-card"><div className="metric-heading"><span>{title}</span><div className={`metric-icon ${tone}`}>{icon}</div></div><div className="metric-value">{value}</div><span className="metric-caption">{caption}</span></article>}
function WalletRow({flag,currency,code,amount}:{flag:string;currency:string;code:string;amount:string}){return <div className="wallet-row"><div className="currency-flag">{flag}</div><div className="wallet-currency"><strong>{currency}</strong><span>{code}</span></div><strong className="wallet-amount">{amount}</strong></div>}
function ActivityRow({icon,title,detail,amount,incoming=false}:{icon:React.ReactNode;title:string;detail:string;amount:string;incoming?:boolean}){return <div className="activity-row"><div className={`activity-icon ${incoming?"incoming":""}`}>{icon}</div><div className="activity-copy"><strong>{title}</strong><span>{detail}</span></div><strong className={`activity-amount ${incoming?"incoming-text":""}`}>{amount}</strong></div>}
