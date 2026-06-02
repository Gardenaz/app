"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bot, ChartNoAxesCombined, Coins, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { pageSwap, staggerContainer, staggerItem } from "@/lib/motion";

const seeds = [
  {
    name: "Rice / Safe Harvest",
    risk: "Low",
    apy: "4-6%",
    asset: "USDY",
    desc: "RWA-backed USDY lane for calm yield, readable exits, and clean benchmark proof.",
  },
  {
    name: "Corn / Growth Field",
    risk: "Med",
    apy: "7-11%",
    asset: "mETH",
    desc: "mETH yield route for measured volatility, compound growth, and agent guardrails.",
  },
  {
    name: "Chili / Boost Farm",
    risk: "High",
    apy: "12-20%",
    asset: "USDY/mETH",
    desc: "Dynamic RWA + mETH allocation with strict policy checks before any rebalance.",
  },
];

const proofLogs = [
  ["Policy", "USDY route approved under low-risk guardrail"],
  ["Benchmark", "+$12.50 harvest delta prepared for Mantle log"],
  ["Identity", "ERC-8004 agent reputation update queued"],
] as const;

export default function Home() {
  const [view, setView] = useState<"landing" | "app">("landing");
  const reduceMotion = useReducedMotion();

  return (
    <main className="gardena-shell">
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.section key="landing" variants={pageSwap} initial="initial" animate="animate" exit="exit" className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8">
            <motion.div aria-hidden initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1 }} className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-teal-300/15 blur-3xl" />

            <nav className="glass-card relative z-10 flex items-center justify-between px-4 py-3 sm:px-5">
              <div className="flex items-center gap-3">
                <motion.div animate={reduceMotion ? undefined : { rotate: [0, -4, 4, 0] }} transition={{ duration: 5, repeat: Infinity }} className="asset-orb grid size-11 place-items-center rounded-2xl text-white shadow-lg shadow-teal-700/20">
                  <Leaf className="size-5" />
                </motion.div>
                <div>
                  <p className="font-display text-2xl font-semibold tracking-tight">Gardena</p>
                  <p className="hidden text-xs font-semibold text-[var(--text-muted)] sm:block">AI x RWA garden on Mantle</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PrivyConnectButton compact />
                <button onClick={() => setView("app")} className="ghost-btn hidden sm:inline-flex">Launch app <ArrowRight className="size-4" /></button>
              </div>
            </nav>

            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="relative z-10 grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.03fr_0.97fr] lg:py-20">
              <div>
                <motion.p variants={staggerItem} className="kicker mb-5">AI x RWA · Consumer Viral DApp · Mantle</motion.p>
                <motion.h1 variants={staggerItem} className="font-display title-balance max-w-4xl text-6xl font-semibold leading-[0.94] tracking-[-0.045em] text-[var(--text)] sm:text-7xl lg:text-8xl">
                  A quieter way to grow on-chain yield.
                </motion.h1>
                <motion.p variants={staggerItem} className="body-balance mt-7 max-w-2xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
                  Gardena turns USDY and mETH strategies into an elegant farming flow. Pick a crop, set policy fences, connect with Privy, then let an AI agent prepare transparent decision proof.
                </motion.p>
                <motion.div variants={staggerItem} className="mt-9 flex flex-wrap gap-3">
                  <button onClick={() => setView("app")} className="teal-btn px-6 py-3">Start garden <ArrowRight className="size-4" /></button>
                  <PrivyConnectButton />
                </motion.div>
              </div>

              <motion.div variants={staggerItem} className="glass-card relative overflow-hidden p-5 sm:p-6">
                <div className="absolute right-[-80px] top-[-80px] size-56 rounded-full bg-teal-300/20 blur-2xl" />
                <div className="relative flex items-start justify-between gap-5">
                  <div>
                    <p className="kicker">Live Garden Preview</p>
                    <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight">Rice / Safe Harvest</h2>
                    <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">USDY allocation, low-risk policy, benchmark card ready for Mantle logging.</p>
                  </div>
                  <motion.div animate={reduceMotion ? undefined : { y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="asset-orb grid size-24 place-items-center rounded-[2rem] text-white shadow-2xl shadow-teal-900/20">
                    <Coins className="size-9" />
                  </motion.div>
                </div>

                <div className="relative mt-9 grid gap-3">
                  {proofLogs.map(([label, value], index) => (
                    <motion.div key={label} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + index * 0.12 }} className="subtle-card flex items-center justify-between gap-4 p-4">
                      <p className="text-xs font-black uppercase tracking-[.18em] text-teal-700">{label}</p>
                      <p className="text-right text-sm font-semibold text-[var(--text)]">{value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.section>
        ) : (
          <motion.section key="app" variants={pageSwap} initial="initial" animate="animate" exit="exit" className="relative mx-auto flex min-h-screen w-full max-w-[1480px] flex-col gap-5 px-4 py-4 sm:px-6">
            <header className="glass-card flex items-center justify-between px-4 py-3 sm:px-5">
              <div className="flex items-center gap-3">
                <button onClick={() => setView("landing")} className="ghost-btn !p-3"><ArrowLeft className="size-4" /></button>
                <div>
                  <p className="kicker">AI x RWA Console</p>
                  <p className="font-display text-2xl font-semibold tracking-tight">My Garden</p>
                </div>
              </div>
              <PrivyConnectButton />
            </header>

            <div className="grid flex-1 gap-5 lg:grid-cols-[1fr_410px]">
              <div className="space-y-5">
                <motion.article variants={staggerContainer} initial="initial" animate="animate" className="glass-card p-5 sm:p-6">
                  <motion.div variants={staggerItem} className="mb-5 flex items-start justify-between gap-5">
                    <div>
                      <p className="kicker">Active Plot</p>
                      <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight">Rice / Safe Harvest</h2>
                    </div>
                    <span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-black uppercase tracking-[.16em] text-teal-700">USDY Active</span>
                  </motion.div>
                  <motion.div variants={staggerItem} className="subtle-card p-5">
                    <div className="grid gap-4 md:grid-cols-4">
                      <Metric label="Position" value="1,000 USDY" />
                      <Metric label="Risk" value="Low" />
                      <Metric label="APY" value="5.2%" />
                      <Metric label="Route" value="Mantle RWA" />
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/5">
                      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 0.46 }} transition={{ duration: 1, ease: "easeOut" }} className="h-full origin-left rounded-full bg-teal-500" />
                    </div>
                  </motion.div>
                </motion.article>

                <motion.article variants={staggerContainer} initial="initial" animate="animate" className="glass-card p-5 sm:p-6">
                  <motion.div variants={staggerItem} className="mb-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="kicker">Seed Market</p>
                      <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight">Choose RWA strategy</h2>
                    </div>
                    <ChartNoAxesCombined className="size-6 text-teal-700" />
                  </motion.div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {seeds.map((seed) => (
                      <motion.div key={seed.name} variants={staggerItem} whileHover={{ y: -6 }} className="subtle-card p-4 transition-shadow hover:shadow-xl hover:shadow-teal-900/5">
                        <p className="kicker">{seed.risk} · {seed.asset}</p>
                        <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight">{seed.name}</h3>
                        <p className="mt-2 text-sm font-black text-teal-700">Est. {seed.apy} APY</p>
                        <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">{seed.desc}</p>
                        <button className="ghost-btn mt-5 w-full">Plant Strategy</button>
                      </motion.div>
                    ))}
                  </div>
                </motion.article>
              </div>

              <aside className="glass-card flex min-h-[560px] flex-col p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="asset-orb grid size-12 place-items-center rounded-2xl text-white"><Bot className="size-5" /></div>
                  <div>
                    <p className="kicker">Consumer Proof Layer</p>
                    <h3 className="font-display text-2xl font-semibold tracking-tight">AI Farmer Diary</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <LogItem title="Benchmarked USDY Harvest" text="Rice route stayed inside low-risk policy. Decision hash ready for Mantle log." icon={<Coins className="size-4" />} />
                  <LogItem title="mETH Fence Triggered" text="Corn strategy paused because volatility rose above user guardrail." icon={<ShieldCheck className="size-4" />} />
                  <LogItem title="Shareable Garden Proof" text="Harvest card shows crop, asset, policy result, and on-chain proof without exposing private keys." icon={<Sparkles className="size-4" />} />
                </div>
              </aside>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><p className="kicker">{label}</p><p className="mt-1 text-sm font-black text-[var(--text)]">{value}</p></div>;
}

function LogItem({ title, text, icon }: { title: string; text: string; icon: ReactNode }) {
  return (
    <motion.article variants={staggerItem} initial="initial" animate="animate" className="subtle-card p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[var(--text)]">{icon}{title}</div>
      <p className="text-xs leading-5 text-[var(--text-muted)]">{text}</p>
    </motion.article>
  );
}
