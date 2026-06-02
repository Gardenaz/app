"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Fingerprint, Play, ShieldCheck, Wallet } from "lucide-react";
import { AgentPlannerSection } from "@/components/sections/agent-planner";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { VantaAura } from "@/components/base/vanta-aura";
import { proofRows, strategies } from "@/lib/gardena-content";
import { pageSwap, staggerItem } from "@/lib/motion";

export default function LaunchAppPage() {
  return (
    <motion.main key="app" variants={pageSwap} initial="initial" animate="animate" className="gardena-shell mx-auto min-h-screen w-full max-w-[1500px] px-4 py-4 sm:px-6">
      <VantaAura />
      <header className="glass-card relative z-10 flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <Link href="/" className="ghost-btn !p-3"><ArrowLeft className="size-4" /></Link>
          <Logo />
        </div>
        <div className="flex items-center gap-2"><PrivyConnectButton /><span className="hidden rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-xs font-black uppercase tracking-[.16em] text-teal-700 md:inline-flex">Mantle Sepolia</span></div>
      </header>

      <div className="relative z-10 mt-5 grid gap-5 xl:grid-cols-[1fr_430px]">
        <div className="space-y-5">
          <section className="glass-card p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div><p className="kicker">Launch App</p><h1 className="font-display mt-2 text-5xl font-semibold tracking-tight">Your RWA Garden Console</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">Connect with Privy, choose a USDY/mETH crop, set policy, and generate proof-ready agent plan.</p></div>
              <button className="teal-btn"><Play className="size-4" /> Run autopilot</button>
            </div>
            <div className="grid gap-4 md:grid-cols-4"><Metric label="Position" value="1,000 USDY" /><Metric label="Benchmark" value="+5.2% APY" /><Metric label="Risk" value="Low" /><Metric label="Proof status" value="Dry-run" /></div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/5"><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: .52 }} transition={{ duration: 1 }} className="h-full origin-left rounded-full bg-teal-500" /></div>
          </section>
          <section className="grid gap-4 lg:grid-cols-3">{strategies.map((s) => <motion.div key={s.name} variants={staggerItem} initial="initial" animate="animate" whileHover={{ y: -4 }} className="subtle-card p-5"><p className="kicker">{s.asset}</p><h3 className="font-display mt-2 text-2xl font-semibold">{s.name}</h3><p className="mt-2 text-sm font-black text-teal-700">{s.apy} APY</p><p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">{s.desc}</p></motion.div>)}</section>
          <AgentPlannerSection />
        </div>
        <aside className="space-y-5">
          <div className="glass-card p-5"><div className="mb-4 flex items-center gap-3"><div className="asset-orb grid size-11 place-items-center rounded-2xl text-white"><Fingerprint className="size-5" /></div><div><p className="kicker">Agent Identity</p><h3 className="font-display text-2xl font-semibold">ERC-8004 Ready</h3></div></div><div className="grid gap-3">{proofRows.map(([label, value]) => <div key={label} className="subtle-card p-3"><p className="kicker">{label}</p><p className="mt-1 text-xs font-bold leading-5 text-[var(--text)]">{value}</p></div>)}</div></div>
          <div className="glass-card p-5"><p className="kicker">AI Farmer Diary</p><h3 className="font-display mt-2 text-2xl font-semibold">Latest decisions</h3><div className="mt-4 space-y-3"><Diary title="USDY Harvest Approved" text="Policy allowed Rice route. Decision hash prepared." icon={<CheckCircle2 className="size-4" />} /><Diary title="mETH Rebalance Paused" text="Volatility exceeded user risk preference." icon={<ShieldCheck className="size-4" />} /><Diary title="Proof Card Ready" text="Shareable consumer proof can include crop, asset, and tx hash." icon={<Wallet className="size-4" />} /></div></div>
        </aside>
      </div>
    </motion.main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><p className="kicker">{label}</p><p className="mt-1 text-sm font-black text-[var(--text)]">{value}</p></div>;
}

function Diary({ title, text, icon }: { title: string; text: string; icon: ReactNode }) {
  return <motion.article variants={staggerItem} initial="initial" animate="animate" className="subtle-card p-4"><div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[var(--text)]">{icon}{title}</div><p className="text-xs leading-5 text-[var(--text-muted)]">{text}</p></motion.article>;
}
