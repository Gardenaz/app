"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { faq, features, navItems, proofRows, steps, strategies } from "@/lib/gardena-content";
import { pageSwap, staggerContainer, staggerItem } from "@/lib/motion";

export function LandingPage() {
  return (
    <motion.main className="gardena-shell" variants={pageSwap} initial="initial" animate="animate">
      <LandingNav />
      <Hero />
      <SocialProof />
      <ProblemSection />
      <StrategySection />
      <FeatureSection />
      <HowItWorks />
      <ProofSection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </motion.main>
  );
}

function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6">
      <div className="glass-nav mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full px-4 sm:px-5">
        <Link href="/"><Logo compact /></Link>
        <nav className="hidden items-center gap-7 text-sm font-bold text-[var(--text-muted)] lg:flex">
          {navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="transition hover:text-[var(--text)]">{item}</a>)}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <PrivyConnectButton compact />
          <Link href="/app" className="teal-btn">Launch app <ArrowRight className="size-4" /></Link>
        </div>
        <button className="ghost-btn !p-3 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}</button>
      </div>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="glass-nav mx-auto mt-3 grid max-w-6xl gap-2 rounded-3xl p-3 lg:hidden">
            {navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="rounded-2xl px-3 py-3 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--surface-soft)]">{item}</a>)}
            <div className="mt-2 flex gap-2"><PrivyConnectButton compact /><Link href="/app" className="teal-btn flex-1">Launch app</Link></div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section id="product" className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:pb-28 lg:pt-32">
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <motion.div variants={staggerItem} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-[.18em] text-teal-700"><Sparkles className="size-3.5" /> AI x RWA on Mantle</motion.div>
        <motion.h1 variants={staggerItem} className="font-display title-balance max-w-4xl text-6xl font-semibold leading-[0.94] tracking-[-0.055em] text-[var(--text)] sm:text-7xl lg:text-8xl">
          Autonomous RWA yield, without black boxes.
        </motion.h1>
        <motion.p variants={staggerItem} className="body-balance mt-7 max-w-2xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
          Gardena helps users grow USDY and mETH strategies through a clean garden interface. AI plans inside user policy. Every move becomes readable proof.
        </motion.p>
        <motion.div variants={staggerItem} className="mt-9 flex flex-wrap gap-3">
          <Link href="/app" className="teal-btn px-6 py-3">Launch app <ArrowRight className="size-4" /></Link>
          <PrivyConnectButton />
        </motion.div>
        <motion.div variants={staggerItem} className="mt-10 grid max-w-xl grid-cols-3 gap-3">
          <Stat value="USDY" label="RWA lane" />
          <Stat value="mETH" label="Yield lane" />
          <Stat value="Policy" label="Agent fence" />
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
        <div className="glass-card p-6 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div><p className="kicker">Live strategy preview</p><h2 className="font-display mt-3 text-4xl font-semibold tracking-tight">Rice / Safe Harvest</h2><p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">Conservative USDY route, guarded by user policy and prepared for Mantle DecisionLog.</p></div>
            <div className="asset-orb grid size-20 place-items-center rounded-3xl text-white"><Coins className="size-8" /></div>
          </div>
          <div className="mt-8 grid gap-3">
            {proofRows.slice(0, 3).map(([label, value]) => (
              <div key={label} className="panel-soft flex items-center justify-between gap-4 p-4"><p className="kicker">{label}</p><p className="max-w-[12rem] text-right text-sm font-semibold text-[var(--text)]">{value}</p></div>
            ))}
          </div>
          <div className="mt-5 rounded-3xl border border-[var(--border)] p-4">
            <div className="mb-3 flex items-center justify-between text-xs font-bold text-[var(--text-muted)]"><span>Policy confidence</span><span>92%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]"><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: .92 }} transition={{ duration: .9 }} className="h-full origin-left rounded-full bg-teal-600" /></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function SocialProof() {
  return <section className="section-rule"><div className="mx-auto grid max-w-6xl gap-4 px-5 py-8 sm:px-8 md:grid-cols-4"><Stat value="3" label="RWA strategies" /><Stat value="4" label="Policy checks" /><Stat value="ERC-8004" label="Agent reputation" /><Stat value="Privy" label="Wallet onboarding" /></div></section>;
}

function ProblemSection() {
  return <Section id="problem" kicker="Problem" title="Yield products fail when users cannot see why an action happened." text="Premium DeFi UX needs more than a connect button. Gardena turns agent decisions into policy-led steps users can understand, approve, and share.">
    <div className="grid gap-4 md:grid-cols-3">
      {["APY without context", "Opaque agent behavior", "Messy DeFi onboarding"].map((item) => <div key={item} className="subtle-card p-6"><LockKeyhole className="mb-5 size-5 text-teal-700" /><h3 className="font-display text-2xl font-semibold">{item}</h3><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">Replaced with crop lanes, guardrails, benchmark logs, and readable proof cards.</p></div>)}
    </div>
  </Section>;
}

function StrategySection() {
  return <Section id="tracks" kicker="Strategies" title="A simple portfolio menu for Mantle RWA yield." text="Three clear lanes replace raw protocol complexity. Users choose risk; agent handles policy checks and proof output.">
    <div className="grid gap-4 lg:grid-cols-3">
      {strategies.map((strategy) => <motion.div key={strategy.name} variants={staggerItem} whileHover={{ y: -4 }} className="subtle-card p-6"><p className="kicker">{strategy.risk} · {strategy.asset}</p><h3 className="font-display mt-4 text-3xl font-semibold tracking-tight">{strategy.name}</h3><p className="mt-3 text-sm font-black text-teal-700">Est. {strategy.apy} APY</p><p className="mt-2 text-xs font-bold text-[var(--text-muted)]">{strategy.route}</p><p className="mt-5 text-sm leading-6 text-[var(--text-muted)]">{strategy.desc}</p><Link href="/app" className="ghost-btn mt-6 w-full">Open in app</Link></motion.div>)}
    </div>
  </Section>;
}

function FeatureSection() {
  return <Section id="features" kicker="Product" title="Clean surface. Serious trust layer." text="Gardena keeps website polish and protocol evidence separated enough for users, builders, and judges to understand fast.">
    <div className="grid gap-4 lg:grid-cols-3">{features.map((feature) => <div key={feature.title} className="glass-card p-6"><div className="asset-orb mb-5 grid size-11 place-items-center rounded-2xl text-white">{feature.icon}</div><h3 className="font-display text-2xl font-semibold">{feature.title}</h3><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{feature.text}</p></div>)}</div>
  </Section>;
}

function HowItWorks() {
  return <Section id="how-it-works" kicker="Flow" title="Four steps from login to proof." text="No SPA gimmick. Proper route, proper dashboard, proper product path.">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{steps.map(([num, title, text]) => <div key={num} className="panel-soft p-5"><p className="font-display text-5xl font-semibold text-teal-700/30">{num}</p><h3 className="mt-5 text-lg font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{text}</p></div>)}</div>
  </Section>;
}

function ProofSection() {
  return <section id="proof" className="section-rule"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:py-28"><div><p className="kicker">Proof layer</p><h2 className="font-display mt-4 text-5xl font-semibold tracking-tight">Readable for users. Verifiable for auditors.</h2><p className="mt-5 text-sm leading-7 text-[var(--text-muted)]">Gardena frames decisions as benchmark events: who decided, what policy allowed, what route was selected, and what outcome followed.</p><Link href="/app" className="teal-btn mt-7">Open launch app</Link></div><div className="grid gap-3">{proofRows.map(([label, value]) => <div key={label} className="subtle-card flex items-center justify-between gap-4 p-4"><p className="kicker">{label}</p><p className="max-w-md text-right text-sm font-bold text-[var(--text)]">{value}</p></div>)}</div></div></section>;
}

function FaqSection() {
  return <Section id="faq" kicker="FAQ" title="Clear boundaries for demo and judging." text="Gardena stays focused: Mantle-native RWA yield, consumer UX, and on-chain benchmarking.">
    <div className="grid gap-4">{faq.map(([q, a]) => <div key={q} className="subtle-card p-6"><h3 className="text-lg font-black">{q}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{a}</p></div>)}</div>
  </Section>;
}

function FinalCta() {
  return <section className="px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl rounded-[2rem] border border-[var(--border)] bg-[var(--text)] p-8 text-center text-white sm:p-12"><p className="kicker !text-teal-200">Launch</p><h2 className="font-display mx-auto mt-4 max-w-3xl text-5xl font-semibold tracking-tight">Start with a safe harvest. Prove every move.</h2><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70">Connect with Privy, generate a guarded plan, and show a clean proof card for USDY/mETH strategy decisions.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/app" className="teal-btn">Launch app</Link><PrivyConnectButton /></div></div></section>;
}

function Section({ id, kicker, title, text, children }: { id: string; kicker: string; title: string; text: string; children: ReactNode }) {
  return <section id={id} className="section-rule mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28"><motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-80px" }}><motion.p variants={staggerItem} className="kicker">{kicker}</motion.p><motion.div variants={staggerItem} className="mb-10 mt-4 grid gap-5 lg:grid-cols-[.86fr_1.14fr]"><h2 className="font-display title-balance text-5xl font-semibold leading-[1] tracking-[-.035em] sm:text-6xl">{title}</h2><p className="max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">{text}</p></motion.div><motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>{children}</motion.div></motion.div></section>;
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="panel-soft p-4"><p className="font-black text-[var(--text)]">{value}</p><p className="mt-1 text-xs font-bold text-[var(--text-muted)]">{label}</p></div>;
}

function Footer() {
  return <footer className="section-rule"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_1fr_1fr]"><Logo /><div><p className="kicker">Navigation</p><div className="mt-4 grid gap-2 text-sm font-bold text-[var(--text-muted)]">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>{item}</a>)}</div></div><div><p className="kicker">Status</p><p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">MVP: app + LangGraph agent + contracts. Current focus: proper launch app, Privy wallet, and on-chain execution proof.</p></div></div></footer>;
}
