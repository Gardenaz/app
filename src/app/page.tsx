"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bot, Coins, Leaf, ShieldCheck, Wallet } from "lucide-react";
import { pageSwap, staggerContainer, staggerItem } from "@/lib/motion";

const seeds = [
  {
    name: "Rice / Safe Harvest",
    risk: "Low",
    apy: "4-6%",
    asset: "USDY",
    desc: "RWA-backed USDY lane for calm yield, readable exits, and on-chain proof.",
  },
  {
    name: "Corn / Growth Field",
    risk: "Med",
    apy: "7-11%",
    asset: "mETH",
    desc: "mETH yield route for measured volatility and stronger compounding.",
  },
  {
    name: "Chili / Boost Farm",
    risk: "High",
    apy: "12-20%",
    asset: "USDY/mETH",
    desc: "Dynamic RWA + mETH route with stricter policy fences before rebalancing.",
  },
];

export default function Home() {
  const [view, setView] = useState<"landing" | "app">("landing");

  return (
    <main className="paper-shell">
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.section key="landing" variants={pageSwap} initial="initial" animate="animate" exit="exit" className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
            <nav className="paper-card flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl border border-[#d6d3cd] bg-[#f6f3ec]"><Leaf className="size-5" /></div>
                <p className="font-extrabold tracking-tight">Gardena</p>
              </div>
              <button onClick={() => setView("app")} className="paper-btn">Launch App <ArrowRight className="size-4" /></button>
            </nav>

            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid flex-1 place-items-center py-16 text-center">
              <div className="max-w-4xl">
                <motion.p variants={staggerItem} className="paper-label mb-5">AI x RWA · Consumer Garden · Mantle</motion.p>
                <motion.h1 variants={staggerItem} className="paper-title text-5xl leading-[1.04] text-[#111827] sm:text-6xl lg:text-7xl">Grow USDY and mETH yield with a transparent AI garden.</motion.h1>
                <motion.p variants={staggerItem} className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#4b5563] sm:text-lg">Gardena turns Mantle RWA strategies into shareable crop journeys. Pick Rice, Corn, or Chili, set risk fences, and watch every agent decision become a verifiable benchmark trail.</motion.p>
                <motion.div variants={staggerItem} className="mt-8 flex flex-wrap justify-center gap-3">
                  <button onClick={() => setView("app")} className="paper-btn px-7 py-3">Start Farming</button>
                  <button className="paper-btn-ghost px-7 py-3">View Proof Diary</button>
                </motion.div>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          <motion.section key="app" variants={pageSwap} initial="initial" animate="animate" exit="exit" className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col gap-4 px-4 py-4 sm:px-6">
            <header className="paper-card flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3"><button onClick={() => setView("landing")} className="paper-btn-ghost !p-2"><ArrowLeft className="size-4" /></button><div><p className="paper-label">AI x RWA Console</p><p className="font-extrabold">My Garden</p></div></div>
              <div className="flex items-center gap-2 rounded-xl border border-[#d6d3cd] bg-white px-3 py-2"><Wallet className="size-4" /><span className="text-sm font-semibold">0x7A...9F21</span></div>
            </header>

            <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_390px]">
              <div className="space-y-4">
                <article className="paper-card p-5">
                  <div className="mb-4 flex items-center justify-between"><div><p className="paper-label">Active Plot</p><h2 className="paper-title text-2xl">Rice / Safe Harvest</h2></div><span className="rounded-full border border-[#16A34A]/30 bg-[#16A34A]/10 px-3 py-1 text-xs font-bold text-[#166534]">USDY ACTIVE</span></div>
                  <div className="rounded-2xl border border-[#d6d3cd] bg-[#f6f3ec] p-4"><p className="text-sm font-semibold">1,000 USDY · Low Risk · APY 5.2% · Mantle RWA Route</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e5e1d8]"><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 0.46 }} transition={{ duration: 0.8 }} className="h-full origin-left rounded-full bg-[#111111]" /></div><p className="mt-2 text-xs text-[#16A34A]">Benchmark outcome +$12.50 · decision logged on Mantle</p></div>
                </article>

                <motion.article variants={staggerContainer} initial="initial" animate="animate" className="paper-card p-5">
                  <p className="paper-label mb-2">Seed Market</p><h2 className="paper-title mb-4 text-2xl">Choose RWA strategy</h2>
                  <div className="grid gap-3 md:grid-cols-3">{seeds.map((s) => <motion.div key={s.name} variants={staggerItem} whileHover={{ y: -3 }} className="rounded-2xl border border-[#d6d3cd] bg-white p-4"><p className="paper-label">{s.risk} Risk · {s.asset}</p><h3 className="mt-1 font-extrabold">{s.name}</h3><p className="text-sm font-bold text-[#111111]">Est. {s.apy} APY</p><p className="mt-2 text-xs leading-5 text-[#4b5563]">{s.desc}</p><button className="paper-btn-ghost mt-4 w-full justify-center">Plant Strategy</button></motion.div>)}</div>
                </motion.article>
              </div>

              <aside className="paper-card flex min-h-[520px] flex-col p-5">
                <div className="mb-4 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl border border-[#d6d3cd] bg-[#f6f3ec]"><Bot className="size-5" /></div><div><p className="paper-label">Consumer Proof Layer</p><h3 className="font-extrabold">AI Farmer Diary</h3></div></div>
                <div className="space-y-3"><LogItem title="Benchmarked USDY Harvest" text="Rice route stayed inside low-risk policy. Decision hash ready for Mantle log." icon={<Coins className="size-4" />} /><LogItem title="mETH Fence Triggered" text="Corn strategy paused because volatility rose above user guardrail." icon={<ShieldCheck className="size-4" />} /><LogItem title="Shareable Garden Proof" text="Your harvest card can show crop, asset, policy result, and on-chain proof without exposing private keys." icon={<Leaf className="size-4" />} /></div>
              </aside>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

function LogItem({ title, text, icon }: { title: string; text: string; icon: ReactNode }) {
  return <motion.article variants={staggerItem} initial="initial" animate="animate" className="rounded-2xl border border-[#d6d3cd] bg-white p-3"><div className="mb-2 flex items-center gap-2 text-sm font-extrabold">{icon}{title}</div><p className="text-xs leading-5 text-[#4b5563]">{text}</p></motion.article>;
}
