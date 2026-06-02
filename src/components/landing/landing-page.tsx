"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Coins,
  Fingerprint,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { VantaAura } from "@/components/base/vanta-aura";
import { faq, features, navItems, proofRows, steps, strategies } from "@/lib/gardena-content";
import { pageSwap, staggerContainer, staggerItem } from "@/lib/motion";

export function LandingPage() {
  return (
    <motion.main className="gardena-shell" variants={pageSwap} initial="initial" animate="animate">
      <VantaAura />
      <LandingNav />
      <Hero />
      <ProblemSection />
      <TrackSection />
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
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(247,244,237,.78)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/"><Logo /></Link>
        <nav className="hidden items-center gap-7 text-sm font-bold text-[var(--text-muted)] lg:flex">
          {navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="transition hover:text-[var(--text)]">{item}</a>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <PrivyConnectButton compact />
          <Link href="/app" className="ghost-btn">Launch app <ArrowRight className="size-4" /></Link>
        </div>
        <button className="ghost-btn !p-3 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}</button>
      </div>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-[var(--border)] bg-[var(--surface-solid)] px-5 py-4 lg:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="rounded-2xl px-3 py-3 text-sm font-bold text-[var(--text-muted)] hover:bg-teal-50">{item}</a>)}
              <div className="mt-2 flex gap-2"><PrivyConnectButton compact /><Link href="/app" className="teal-btn flex-1">Launch app</Link></div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="product" className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.03fr_.97fr] lg:py-24">
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="relative z-10">
        <motion.div variants={staggerItem} className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-white/60 px-3 py-2 text-xs font-extrabold uppercase tracking-[.18em] text-teal-700"><Sparkles className="size-3.5" /> Turing Test Hackathon · AI x RWA</motion.div>
        <motion.h1 variants={staggerItem} className="font-display title-balance max-w-5xl text-6xl font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--text)] sm:text-7xl lg:text-8xl">
          RWA yield, made safe enough to feel like gardening.
        </motion.h1>
        <motion.p variants={staggerItem} className="body-balance mt-7 max-w-2xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
          Gardena turns USDY and mETH strategies into crop lanes, guarded by AI policy and backed by transparent on-chain proof. Beginner-friendly UX. Judge-friendly audit trail.
        </motion.p>
        <motion.div variants={staggerItem} className="mt-9 flex flex-wrap gap-3">
          <Link href="/app" className="teal-btn px-6 py-3">Launch app <ArrowRight className="size-4" /></Link>
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
  return <Section id="problem" kicker="Problem" title="DeFi promises yield. Users still need trust." text="APY alone is not a product. Gardena packages strategy, policy, and outcome proof into one clean consumer journey.">
    <div className="grid gap-4 md:grid-cols-3">
      {["APY without context", "Opaque agent behavior", "Hard-to-share DeFi UX"].map((item) => <div key={item} className="subtle-card p-5"><LockKeyhole className="mb-4 size-5 text-teal-700" /><h3 className="font-display text-2xl font-semibold">{item}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Replaced with crop lanes, guardrails, benchmark logs, and readable proof cards.</p></div>)}
    </div>
  </Section>;
}

function TrackSection() {
  return <Section id="tracks" kicker="Hackathon fit" title="AI x RWA core. Consumer DApp surface." text="Mantle-native RWA yield strategy under the hood. Viral garden metaphor at the edge. Agentic wallet policy between both.">
    <div className="grid gap-4 lg:grid-cols-3">
      <TrackCard title="AI x RWA" text="Dynamic USDY and mETH yield strategies with automated risk management." active />
      <TrackCard title="Consumer & Viral DApps" text="Crop-based UX, harvest proof cards, AI diary, and shareable outcome framing." />
      <TrackCard title="Agentic Wallets" text="Privy wallet onboarding plus bounded agent policy for future execution." />
    </div>
  </Section>;
}

function StrategySection() {
  return <Section id="strategies" kicker="Strategies" title="Three crops. Three risk profiles. One proof layer." text="Each strategy maps to assets and routes that agent can score, block, or prepare for execution.">
    <div className="grid gap-4 lg:grid-cols-3">
      {strategies.map((strategy) => <motion.div key={strategy.name} variants={staggerItem} whileHover={{ y: -6 }} className="subtle-card p-5"><p className="kicker">{strategy.risk} · {strategy.asset}</p><h3 className="font-display mt-3 text-3xl font-semibold tracking-tight">{strategy.name}</h3><p className="mt-2 text-sm font-black text-teal-700">Est. {strategy.apy} APY</p><p className="mt-1 text-xs font-bold text-[var(--text-muted)]">{strategy.route}</p><p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">{strategy.desc}</p><Link href="/app" className="ghost-btn mt-5 w-full">Open in app</Link></motion.div>)}
    </div>
  </Section>;
}

function FeatureSection() {
  return <Section id="features" kicker="Product" title="SaaS-quality product story. Web3 proof depth." text="App, agent, and contracts are separated, documented, and aligned around one user promise: safer autonomous yield with evidence.">
    <div className="grid gap-4 lg:grid-cols-3">{features.map((feature) => <div key={feature.title} className="glass-card p-6"><div className="asset-orb mb-5 grid size-11 place-items-center rounded-2xl text-white">{feature.icon}</div><h3 className="font-display text-2xl font-semibold">{feature.title}</h3><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{feature.text}</p></div>)}</div>
  </Section>;
}

function HowItWorks() {
  return <Section id="how-it-works" kicker="Flow" title="From wallet login to proof card." text="Launch app gives a proper flow: connect wallet, configure policy, generate plan, inspect proof, then prepare execution in next phase.">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{steps.map(([num, title, text]) => <div key={num} className="subtle-card p-5"><p className="font-display text-5xl font-semibold text-teal-700/30">{num}</p><h3 className="mt-4 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{text}</p></div>)}</div>
  </Section>;
}

function ProofSection() {
  return <section id="proof" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24"><div className="glass-card grid gap-8 overflow-hidden p-6 sm:p-8 lg:grid-cols-[.9fr_1.1fr]"><div><p className="kicker">Radical transparency</p><h2 className="font-display mt-4 text-5xl font-semibold tracking-tight">Every agent action earns or loses reputation.</h2><p className="mt-5 text-sm leading-7 text-[var(--text-muted)]">Gardena frames decisions as benchmark events: who decided, what policy allowed, what route was selected, and what outcome followed.</p><Link href="/app" className="teal-btn mt-7">Open proof console</Link></div><div className="grid gap-3">{proofRows.map(([label, value]) => <div key={label} className="subtle-card flex items-center justify-between gap-4 p-4"><p className="kicker">{label}</p><p className="max-w-md text-right text-sm font-bold text-[var(--text)]">{value}</p></div>)}</div></div></section>;
}

function FaqSection() {
  return <Section id="faq" kicker="FAQ" title="Clear boundaries for demo and judging." text="Gardena stays focused: Mantle-native RWA yield, consumer UX, and on-chain benchmarking.">
    <div className="grid gap-4">{faq.map(([q, a]) => <div key={q} className="subtle-card p-5"><h3 className="text-lg font-black">{q}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{a}</p></div>)}</div>
  </Section>;
}

function FinalCta() {
  return <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><div className="glass-card p-8 text-center sm:p-12"><p className="kicker">Launch</p><h2 className="font-display mx-auto mt-4 max-w-3xl text-5xl font-semibold tracking-tight">Start with a safe harvest. Prove every move.</h2><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">Connect with Privy, generate a guarded plan, and show a clean proof card for USDY/mETH strategy decisions.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/app" className="teal-btn">Launch app</Link><PrivyConnectButton /></div></div></section>;
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

function Footer() {
  return <footer className="border-t border-[var(--border)]"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_1fr_1fr]"><Logo /><div><p className="kicker">Navigation</p><div className="mt-4 grid gap-2 text-sm font-bold text-[var(--text-muted)]">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>{item}</a>)}</div></div><div><p className="kicker">Status</p><p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">MVP: app + LangGraph agent + contracts. Current focus: proper launch app, Privy wallet, and on-chain execution proof.</p></div></div></footer>;
}
