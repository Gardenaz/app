"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  ChartNoAxesCombined,
  CheckCircle2,
  Coins,
  DatabaseZap,
  Fingerprint,
  Leaf,
  LockKeyhole,
  Menu,
  Play,
  ShieldCheck,
  Sparkles,
  Sprout,
  Wallet,
  X,
} from "lucide-react";
import { AgentPlannerSection } from "@/components/sections/agent-planner";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { pageSwap, staggerContainer, staggerItem } from "@/lib/motion";

const navItems = ["Product", "Tracks", "How it works", "Proof", "FAQ"];

const strategies = [
  {
    name: "Rice / Safe Harvest",
    risk: "Low risk",
    apy: "4-6%",
    asset: "USDY",
    route: "Mantle RWA USDY Route",
    desc: "Conservative USDY lane for stable RWA yield and clean policy proof.",
  },
  {
    name: "Corn / Growth Field",
    risk: "Medium risk",
    apy: "7-11%",
    asset: "mETH",
    route: "Mantle mETH Yield Route",
    desc: "mETH route for measured compounding with volatility guardrails.",
  },
  {
    name: "Chili / Boost Farm",
    risk: "High risk",
    apy: "12-20%",
    asset: "USDY/mETH",
    route: "Mantle Dynamic RWA Route",
    desc: "Dynamic allocation with stricter preflight checks before any rebalance.",
  },
];

const features = [
  {
    icon: <Bot className="size-5" />,
    title: "Bounded AI agent",
    text: "Agent recommends and executes only inside user policy: max amount, max risk, route allowlist, and rebalance interval.",
  },
  {
    icon: <DatabaseZap className="size-5" />,
    title: "On-chain benchmark trail",
    text: "Every decision can produce a hash, Mantle log, benchmark outcome, and reputation update for auditability.",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "Consumer garden UX",
    text: "Complex RWA yield becomes crops, harvest cards, diary entries, and shareable proof instead of raw DeFi jargon.",
  },
];

const steps = [
  ["01", "Connect", "Login with Privy, use embedded wallet or external wallet, then choose a crop lane."],
  ["02", "Set policy", "Pick amount, risk preference, allowed routes, and rebalance interval."],
  ["03", "Agent plans", "LangGraph agent scores USDY/mETH routes and blocks unsafe strategy changes."],
  ["04", "Proof lands", "Decision hash, Mantle tx, and benchmark outcome become garden proof."],
] as const;

const proofRows = [
  ["Agent identity", "ERC-8004-style identity NFT + reputation registry"],
  ["Decision hash", "0xa71e...f09c · policy-safe rebalance"],
  ["Benchmark", "USDY harvest +5.2% APY · outcome pending log"],
  ["Transparency", "Readable diary + on-chain DecisionLog"],
] as const;

const faq = [
  ["Is Gardena a Bybit trading bot?", "No. Current MVP focuses AI x RWA on Mantle with USDY/mETH strategies. Bybit/CEX adapter can be future extension, not core."],
  ["Can agent move funds freely?", "No. Policy fences define max amount, risk level, allowed routes, rebalance interval, and emergency pause."],
  ["Why crops?", "Crops make yield strategy understandable and shareable for consumer users without hiding benchmark proof."],
] as const;

export default function Home() {
  const [view, setView] = useState<"landing" | "app">("landing");
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <main className="gardena-shell">
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.div key="landing" variants={pageSwap} initial="initial" animate="animate" exit="exit">
            <LandingNav onLaunch={() => setView("app")} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            <Hero onLaunch={() => setView("app")} reduceMotion={reduceMotion} />
            <ProblemSection />
            <TrackSection />
            <StrategySection onLaunch={() => setView("app")} />
            <FeatureSection />
            <HowItWorks />
            <ProofSection onLaunch={() => setView("app")} />
            <FaqSection />
            <FinalCta onLaunch={() => setView("app")} />
            <Footer />
          </motion.div>
        ) : (
          <LaunchApp onBack={() => setView("landing")} />
        )}
      </AnimatePresence>
    </main>
  );
}

function LandingNav({ onLaunch, mobileOpen, setMobileOpen }: { onLaunch: () => void; mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(247,244,237,.78)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-bold text-[var(--text-muted)] lg:flex">
          {navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="transition hover:text-[var(--text)]">{item}</a>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <PrivyConnectButton compact />
          <button onClick={onLaunch} className="ghost-btn">Launch app <ArrowRight className="size-4" /></button>
        </div>
        <button className="ghost-btn !p-3 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}</button>
      </div>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-[var(--border)] bg-[var(--surface-solid)] px-5 py-4 lg:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="rounded-2xl px-3 py-3 text-sm font-bold text-[var(--text-muted)] hover:bg-teal-50">{item}</a>)}
              <div className="mt-2 flex gap-2"><PrivyConnectButton compact /><button onClick={onLaunch} className="teal-btn flex-1">Launch app</button></div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function Hero({ onLaunch, reduceMotion }: { onLaunch: () => void; reduceMotion: boolean | null }) {
  return (
    <section id="product" className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.03fr_.97fr] lg:py-24">
      <motion.div aria-hidden initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1 }} className="absolute left-1/2 top-20 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-teal-300/15 blur-3xl" />
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="relative z-10">
        <motion.div variants={staggerItem} className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-white/60 px-3 py-2 text-xs font-extrabold uppercase tracking-[.18em] text-teal-700"><Sparkles className="size-3.5" /> Turing Test Hackathon · AI x RWA</motion.div>
        <motion.h1 variants={staggerItem} className="font-display title-balance max-w-5xl text-6xl font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--text)] sm:text-7xl lg:text-8xl">
          Make RWA yield feel like growing a garden.
        </motion.h1>
        <motion.p variants={staggerItem} className="body-balance mt-7 max-w-2xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
          Gardena is a consumer DeFi app where beginners choose USDY and mETH crop strategies, set risk policy, and let a transparent AI agent create verifiable on-chain performance proof.
        </motion.p>
        <motion.div variants={staggerItem} className="mt-9 flex flex-wrap gap-3">
          <button onClick={onLaunch} className="teal-btn px-6 py-3">Launch app <ArrowRight className="size-4" /></button>
          <PrivyConnectButton />
        </motion.div>
        <motion.div variants={staggerItem} className="mt-10 grid max-w-xl grid-cols-3 gap-3">
          <Stat value="USDY" label="RWA asset" />
          <Stat value="mETH" label="Yield lane" />
          <Stat value="ERC-8004" label="Agent identity" />
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 42 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7 }} className="relative z-10">
        <div className="glass-card overflow-hidden p-5 sm:p-6">
          <div className="flex items-start justify-between gap-5">
            <div><p className="kicker">Garden Preview</p><h2 className="font-display mt-3 text-4xl font-semibold tracking-tight">Rice / Safe Harvest</h2><p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">Policy-safe USDY route. Benchmark proof ready for Mantle DecisionLog.</p></div>
            <motion.div animate={reduceMotion ? undefined : { y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="asset-orb grid size-24 place-items-center rounded-[2rem] text-white shadow-2xl shadow-teal-900/20"><Coins className="size-9" /></motion.div>
          </div>
          <div className="mt-8 grid gap-3">
            {proofRows.slice(0, 3).map(([label, value], index) => (
              <motion.div key={label} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .2 + index * .1 }} className="subtle-card flex items-center justify-between gap-4 p-4"><p className="text-xs font-black uppercase tracking-[.18em] text-teal-700">{label}</p><p className="text-right text-sm font-semibold text-[var(--text)]">{value}</p></motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function ProblemSection() {
  return <Section id="problem" kicker="Problem" title="RWA yield is promising, but still hard to trust." text="Beginners see APY numbers, protocol names, and risk jargon. Gardena turns strategy into understandable policy, visible agent reasoning, and proof that can be checked later.">
    <div className="grid gap-4 md:grid-cols-3">
      {["APY without context", "Opaque agent behavior", "Hard-to-share DeFi UX"].map((item) => <div key={item} className="subtle-card p-5"><LockKeyhole className="mb-4 size-5 text-teal-700" /><h3 className="font-display text-2xl font-semibold">{item}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Replaced with crop lanes, guardrails, benchmark logs, and readable proof cards.</p></div>)}
    </div>
  </Section>;
}

function TrackSection() {
  return <Section id="tracks" kicker="Hackathon fit" title="Built for AI x RWA. Designed like a Consumer & Viral DApp." text="Core thesis: autonomous agents should create verifiable value on Mantle, while consumer users understand and share what happened.">
    <div className="grid gap-4 lg:grid-cols-3">
      <TrackCard title="AI x RWA" text="Dynamic USDY and mETH yield strategies with automated risk management." active />
      <TrackCard title="Consumer & Viral DApps" text="Crop-based UX, harvest proof cards, AI diary, and shareable outcome framing." />
      <TrackCard title="Agentic Wallets" text="Privy wallet onboarding plus bounded agent policy for future execution." />
    </div>
  </Section>;
}

function StrategySection({ onLaunch }: { onLaunch: () => void }) {
  return <Section id="strategies" kicker="Strategies" title="Three crops. Three risk profiles. One proof layer." text="Each strategy maps to assets and routes that agent can score, block, or prepare for execution.">
    <div className="grid gap-4 lg:grid-cols-3">
      {strategies.map((strategy) => <motion.div key={strategy.name} variants={staggerItem} whileHover={{ y: -6 }} className="subtle-card p-5"><p className="kicker">{strategy.risk} · {strategy.asset}</p><h3 className="font-display mt-3 text-3xl font-semibold tracking-tight">{strategy.name}</h3><p className="mt-2 text-sm font-black text-teal-700">Est. {strategy.apy} APY</p><p className="mt-1 text-xs font-bold text-[var(--text-muted)]">{strategy.route}</p><p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">{strategy.desc}</p><button onClick={onLaunch} className="ghost-btn mt-5 w-full">Open in app</button></motion.div>)}
    </div>
  </Section>;
}

function FeatureSection() {
  return <Section id="features" kicker="Product" title="Not just a landing story. Product pieces already connect." text="App, agent, and contracts are separate repos with matching strategy metadata and proof framing.">
    <div className="grid gap-4 lg:grid-cols-3">{features.map((feature) => <div key={feature.title} className="glass-card p-6"><div className="asset-orb mb-5 grid size-11 place-items-center rounded-2xl text-white">{feature.icon}</div><h3 className="font-display text-2xl font-semibold">{feature.title}</h3><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{feature.text}</p></div>)}</div>
  </Section>;
}

function HowItWorks() {
  return <Section id="how-it-works" kicker="Flow" title="From wallet login to proof card." text="Launch app gives a proper flow: connect wallet, configure policy, generate plan, inspect proof, then prepare execution in next phase.">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{steps.map(([num, title, text]) => <div key={num} className="subtle-card p-5"><p className="font-display text-5xl font-semibold text-teal-700/30">{num}</p><h3 className="mt-4 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{text}</p></div>)}</div>
  </Section>;
}

function ProofSection({ onLaunch }: { onLaunch: () => void }) {
  return <section id="proof" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24"><div className="glass-card grid gap-8 overflow-hidden p-6 sm:p-8 lg:grid-cols-[.9fr_1.1fr]"><div><p className="kicker">Radical transparency</p><h2 className="font-display mt-4 text-5xl font-semibold tracking-tight">Every agent action earns or loses reputation.</h2><p className="mt-5 text-sm leading-7 text-[var(--text-muted)]">Gardena frames decisions as benchmark events: who decided, what policy allowed, what route was selected, and what outcome followed.</p><button onClick={onLaunch} className="teal-btn mt-7">Open proof console</button></div><div className="grid gap-3">{proofRows.map(([label, value]) => <div key={label} className="subtle-card flex items-center justify-between gap-4 p-4"><p className="kicker">{label}</p><p className="max-w-md text-right text-sm font-bold text-[var(--text)]">{value}</p></div>)}</div></div></section>;
}

function FaqSection() {
  return <Section id="faq" kicker="FAQ" title="Clear boundaries for demo and judging." text="Gardena stays focused: Mantle-native RWA yield, consumer UX, and on-chain benchmarking.">
    <div className="grid gap-4">{faq.map(([q, a]) => <div key={q} className="subtle-card p-5"><h3 className="text-lg font-black">{q}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{a}</p></div>)}</div>
  </Section>;
}

function FinalCta({ onLaunch }: { onLaunch: () => void }) {
  return <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><div className="glass-card p-8 text-center sm:p-12"><p className="kicker">Launch</p><h2 className="font-display mx-auto mt-4 max-w-3xl text-5xl font-semibold tracking-tight">Start with a safe harvest. Prove every move.</h2><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">Connect with Privy, generate a guarded plan, and show a clean proof card for USDY/mETH strategy decisions.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><button onClick={onLaunch} className="teal-btn">Launch app</button><PrivyConnectButton /></div></div></section>;
}

function LaunchApp({ onBack }: { onBack: () => void }) {
  return (
    <motion.section key="app" variants={pageSwap} initial="initial" animate="animate" exit="exit" className="mx-auto min-h-screen w-full max-w-[1500px] px-4 py-4 sm:px-6">
      <header className="glass-card flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3"><button onClick={onBack} className="ghost-btn !p-3"><ArrowLeft className="size-4" /></button><div><p className="kicker">Launch App</p><p className="font-display text-2xl font-semibold tracking-tight">Gardena Console</p></div></div>
        <div className="flex items-center gap-2"><PrivyConnectButton /><span className="hidden rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-xs font-black uppercase tracking-[.16em] text-teal-700 md:inline-flex">Mantle Sepolia</span></div>
      </header>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_430px]">
        <div className="space-y-5">
          <section className="glass-card p-5 sm:p-6"><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="kicker">Portfolio</p><h1 className="font-display mt-2 text-4xl font-semibold tracking-tight">Your RWA Garden</h1></div><button className="teal-btn"><Play className="size-4" /> Run autopilot</button></div><div className="grid gap-4 md:grid-cols-4"><Metric label="Position" value="1,000 USDY" /><Metric label="Benchmark" value="+5.2% APY" /><Metric label="Risk" value="Low" /><Metric label="Proof status" value="Dry-run" /></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-black/5"><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: .52 }} transition={{ duration: 1 }} className="h-full origin-left rounded-full bg-teal-500" /></div></section>
          <section className="grid gap-4 lg:grid-cols-3">{strategies.map((s) => <div key={s.name} className="subtle-card p-5"><p className="kicker">{s.asset}</p><h3 className="font-display mt-2 text-2xl font-semibold">{s.name}</h3><p className="mt-2 text-sm font-black text-teal-700">{s.apy} APY</p><p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">{s.desc}</p></div>)}</section>
          <AgentPlannerSection />
        </div>
        <aside className="space-y-5">
          <div className="glass-card p-5"><div className="mb-4 flex items-center gap-3"><div className="asset-orb grid size-11 place-items-center rounded-2xl text-white"><Fingerprint className="size-5" /></div><div><p className="kicker">Agent Identity</p><h3 className="font-display text-2xl font-semibold">ERC-8004 Ready</h3></div></div><div className="grid gap-3">{proofRows.map(([label, value]) => <div key={label} className="subtle-card p-3"><p className="kicker">{label}</p><p className="mt-1 text-xs font-bold leading-5 text-[var(--text)]">{value}</p></div>)}</div></div>
          <div className="glass-card p-5"><p className="kicker">AI Farmer Diary</p><h3 className="font-display mt-2 text-2xl font-semibold">Latest decisions</h3><div className="mt-4 space-y-3"><Diary title="USDY Harvest Approved" text="Policy allowed Rice route. Decision hash prepared." icon={<CheckCircle2 className="size-4" />} /><Diary title="mETH Rebalance Paused" text="Volatility exceeded user risk preference." icon={<ShieldCheck className="size-4" />} /><Diary title="Proof Card Ready" text="Shareable consumer proof can include crop, asset, and tx hash." icon={<Wallet className="size-4" />} /></div></div>
        </aside>
      </div>
    </motion.section>
  );
}

function Section({ id, kicker, title, text, children }: { id: string; kicker: string; title: string; text: string; children: ReactNode }) {
  return <section id={id} className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24"><motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-80px" }}><motion.p variants={staggerItem} className="kicker">{kicker}</motion.p><motion.div variants={staggerItem} className="mb-9 mt-4 grid gap-4 lg:grid-cols-[.9fr_1.1fr]"><h2 className="font-display title-balance text-5xl font-semibold leading-[1] tracking-[-.035em] sm:text-6xl">{title}</h2><p className="max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">{text}</p></motion.div><motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>{children}</motion.div></motion.div></section>;
}

function TrackCard({ title, text, active = false }: { title: string; text: string; active?: boolean }) {
  return <div className={`${active ? "glass-card" : "subtle-card"} p-6`}><div className="mb-5 flex items-center gap-2 text-teal-700"><Sprout className="size-5" /><span className="text-xs font-black uppercase tracking-[.18em]">{active ? "Primary" : "Support"}</span></div><h3 className="font-display text-3xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{text}</p></div>;
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="subtle-card p-4"><p className="font-black text-[var(--text)]">{value}</p><p className="mt-1 text-xs font-bold text-[var(--text-muted)]">{label}</p></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><p className="kicker">{label}</p><p className="mt-1 text-sm font-black text-[var(--text)]">{value}</p></div>;
}

function Diary({ title, text, icon }: { title: string; text: string; icon: ReactNode }) {
  return <motion.article variants={staggerItem} initial="initial" animate="animate" className="subtle-card p-4"><div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[var(--text)]">{icon}{title}</div><p className="text-xs leading-5 text-[var(--text-muted)]">{text}</p></motion.article>;
}

function Logo() {
  return <div className="flex items-center gap-3"><div className="asset-orb grid size-11 place-items-center rounded-2xl text-white shadow-lg shadow-teal-700/20"><Leaf className="size-5" /></div><div><p className="font-display text-2xl font-semibold tracking-tight">Gardena</p><p className="hidden text-xs font-semibold text-[var(--text-muted)] sm:block">AI x RWA garden on Mantle</p></div></div>;
}

function Footer() {
  return <footer className="border-t border-[var(--border)]"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_1fr_1fr]"><Logo /><div><p className="kicker">Navigation</p><div className="mt-4 grid gap-2 text-sm font-bold text-[var(--text-muted)]">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>{item}</a>)}</div></div><div><p className="kicker">Status</p><p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">MVP: app + LangGraph agent + contracts. Current focus: proper launch app, Privy wallet, and on-chain execution proof.</p></div></div></footer>;
}
