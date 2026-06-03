"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Fingerprint,
  Play,
  ShieldCheck,
  Sprout,
  Sun,
  Wallet,
} from "lucide-react";
import { AgentPlannerSection } from "@/components/sections/agent-planner";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { proofRows, strategies } from "@/lib/gardena-content";
import { staggerItem } from "@/lib/motion";

/* ── Page ──────────────────────────────────────────────────────── */
export default function LaunchAppPage() {
  return (
    <div className="shell">
      {/* ── Sticky top nav ── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="btn-ghost !p-2"
              aria-label="Back to home"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <Logo compact />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 sm:inline-flex">
              Mantle Sepolia
            </span>
            <PrivyConnectButton compact />
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="mx-auto grid max-w-screen-xl gap-5 px-4 py-5 sm:px-6 xl:grid-cols-[1fr_380px]">

        {/* ── Left column ── */}
        <div className="min-w-0 space-y-5">

          {/* Hero stat bar */}
          <div className="card-lg p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="kicker">Launch App</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-[var(--text)] sm:text-3xl">
                  Your RWA Garden Console
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
                  Connect with Privy, choose a USDY/mETH crop, set policy, and generate a proof-ready agent plan.
                </p>
              </div>
              <button type="button" className="btn-primary shrink-0">
                <Play className="size-4" aria-hidden="true" />
                Run autopilot
              </button>
            </div>

            {/* Metrics */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Position",     value: "1,000 USDY" },
                { label: "Benchmark",    value: "+5.2% APY" },
                { label: "Risk level",   value: "Low" },
                { label: "Proof status", value: "Dry-run" },
              ].map((m) => (
                <div key={m.label} className="card-soft px-4 py-3">
                  <p className="kicker">{m.label}</p>
                  <p className="mt-1 text-base font-black text-[var(--text)]">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-[var(--text-muted)]">
                <span>Strategy allocation</span>
                <span>52%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 0.52 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="h-full origin-left rounded-full bg-teal-500"
                />
              </div>
            </div>
          </div>

          <GardenScene />
          <FarmerAgentCompanion />

          {/* Strategy cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {strategies.map((s, i) => {
              const bar   = ["bg-emerald-400", "bg-amber-400", "bg-red-400"][i];
              const badge = ["bg-emerald-50 text-emerald-700", "bg-amber-50 text-amber-700", "bg-red-50 text-red-700"][i];
              return (
                <motion.div
                  key={s.name}
                  variants={staggerItem}
                  initial="initial"
                  animate="animate"
                  whileHover={{ y: -3 }}
                  className="card overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)]"
                >
                  <div className={`h-1 w-full ${bar}`} />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${badge}`}>
                        {s.risk}
                      </span>
                      <span className="text-xs font-bold text-[var(--text-muted)]">{s.asset}</span>
                    </div>
                    <h3 className="mt-3 text-base font-black text-[var(--text)]">{s.name}</h3>
                    <p className="mt-0.5 text-lg font-black text-teal-700">{s.apy} APY</p>
                    <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">{s.desc}</p>
                    <Link
                      href="#agent-planner"
                      className="btn-secondary mt-3 w-full text-xs"
                    >
                      Use strategy <ChevronRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Agent planner */}
          <div id="agent-planner">
            <div className="mb-3">
              <p className="kicker">Planner</p>
              <h2 className="mt-1 text-xl font-black text-[var(--text)]">Agent configuration</h2>
            </div>
            <AgentPlannerSection />
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <aside className="min-w-0 space-y-5">

          {/* Agent identity */}
          <div className="card-lg p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="orb-teal grid size-10 shrink-0 place-items-center rounded-xl text-white">
                <Fingerprint className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="kicker">Agent Identity</p>
                <h3 className="text-base font-black text-[var(--text)]">ERC-8004 Ready</h3>
              </div>
            </div>
            <div className="space-y-2">
              {proofRows.map(([lbl, val]) => (
                <div key={lbl} className="card-soft px-3 py-2.5">
                  <p className="kicker">{lbl}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-[var(--text)]">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Farmer diary */}
          <div className="card-lg p-5">
            <p className="kicker">AI Farmer Diary</p>
            <h3 className="mt-1 text-base font-black text-[var(--text)]">Latest decisions</h3>
            <div className="mt-4 space-y-2">
              <DiaryEntry
                icon={<CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />}
                title="USDY Harvest Approved"
                text="Policy allowed Rice route. Decision hash prepared."
              />
              <DiaryEntry
                icon={<ShieldCheck className="size-4 text-amber-500" aria-hidden="true" />}
                title="mETH Rebalance Paused"
                text="Volatility exceeded user risk preference."
              />
              <DiaryEntry
                icon={<Wallet className="size-4 text-[var(--primary)]" aria-hidden="true" />}
                title="Proof Card Ready"
                text="Shareable consumer proof includes crop, asset, and tx hash."
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────── */
const gardenSlots = [
  { crop: "Rice", asset: "USDY", label: "Safe Harvest", apy: "5.20%", health: "92%", state: "Active", x: "left-[14%]", delay: 0.1 },
  { crop: "Corn", asset: "mETH", label: "Growth Field", apy: "9.60%", health: "86%", state: "Ready", x: "left-[42%]", delay: 0.2 },
  { crop: "Chili", asset: "USDY/mETH", label: "Boost Farm", apy: "17.60%", health: "72%", state: "Locked", x: "left-[70%]", delay: 0.3 },
];

function GardenScene() {
  return (
    <div className="card-lg overflow-hidden p-0">
      <div className="relative min-h-[390px] bg-[linear-gradient(180deg,#f7fffb_0%,#edf8f1_48%,#d7efdc_100%)]">
        <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.18),transparent_28%)]" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
          <div>
            <p className="kicker">Live Garden Agent</p>
            <h2 className="mt-1 text-xl font-black text-[var(--text)] sm:text-2xl">AI reads market weather, then plants for you</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              Beginner mode turns USDY and mETH routing into crop slots. Policy gate still blocks risk before execution.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-3 py-2 text-xs font-black text-emerald-700 shadow-sm">
            <Sun className="size-4" aria-hidden="true" /> Sunny market
          </div>
        </div>

        <div className="relative mx-4 h-56 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/45 shadow-inner sm:mx-6">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,#bfe8c9,#7cc889)]" />
          <div className="absolute inset-x-0 bottom-0 grid grid-cols-8 gap-1 opacity-45">
            {Array.from({ length: 24 }).map((_, index) => (
              <span key={index} className="h-24 origin-bottom rounded-t-full bg-emerald-600/30" style={{ transform: `scaleY(${0.35 + (index % 5) * 0.14})` }} />
            ))}
          </div>
          <motion.div
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: [6, -4, 6], opacity: 1 }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-8 top-7 flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-xs font-black text-sky-700 shadow-sm"
          >
            <CloudRain className="size-4 text-sky-500" aria-hidden="true" /> Rain shield standby
          </motion.div>

          {gardenSlots.map((slot) => (
            <motion.div
              key={slot.crop}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: slot.delay, duration: 0.45 }}
              className={`absolute bottom-8 ${slot.x} w-24 -translate-x-1/2 text-center sm:w-28`}
            >
              <div className="mx-auto mb-2 grid size-16 place-items-center rounded-[1.5rem] border border-emerald-100 bg-white shadow-[0_16px_40px_rgba(21,128,61,0.16)] sm:size-20">
                <Sprout className="size-8 text-emerald-600 sm:size-10" aria-hidden="true" />
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/90 p-2 shadow-sm">
                <p className="text-xs font-black text-[var(--text)]">{slot.crop}</p>
                <p className="text-[10px] font-bold text-[var(--text-muted)]">{slot.asset}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
          {gardenSlots.map((slot) => (
            <div key={slot.label} className="card-soft p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-black text-[var(--text)]">{slot.label}</p>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">{slot.state}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="kicker">APY</p>
                  <p className="font-black text-teal-700">{slot.apy}</p>
                </div>
                <div>
                  <p className="kicker">Health</p>
                  <p className="font-black text-[var(--text)]">{slot.health}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const farmerModes = [
  {
    title: "Market Coach",
    line: "Weather sunny. Rice safe, Corn growth ready. I explain before move.",
    cta: "Ask strategy",
  },
  {
    title: "Plant for me",
    line: "I can pick crop, set policy, and prepare agent plan. You approve final action.",
    cta: "Start planting",
  },
  {
    title: "Protect harvest",
    line: "If market turns rainy, I hold position and block risky routes.",
    cta: "Raise shield",
  },
];

function FarmerAgentCompanion() {
  const [modeIndex, setModeIndex] = useState(0);
  const mode = farmerModes[modeIndex];

  return (
    <motion.div
      data-testid="farmer-agent-companion"
      initial={{ y: 22, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 right-4 z-40 w-[min(92vw,340px)] rounded-[2rem] border border-emerald-100 bg-white/92 p-3 shadow-[0_24px_80px_rgba(15,118,110,0.18)] backdrop-blur-xl"
    >
      <div className="flex gap-3">
        <button
          type="button"
          aria-label="Talk to farmer agent"
          onClick={() => setModeIndex((current) => (current + 1) % farmerModes.length)}
          className="relative grid size-20 shrink-0 place-items-center rounded-[1.6rem] border border-emerald-100 bg-[linear-gradient(180deg,#f8fff8,#dff5e5)] shadow-inner transition hover:scale-[1.02]"
        >
          <span className="absolute -top-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">Agent</span>
          <span className="relative block size-12 rounded-full bg-[#9b6b43]">
            <span className="absolute -top-3 left-1/2 h-4 w-12 -translate-x-1/2 rounded-t-full bg-amber-700" />
            <span className="absolute left-2 top-4 size-1.5 rounded-full bg-white" />
            <span className="absolute right-2 top-4 size-1.5 rounded-full bg-white" />
            <span className="absolute bottom-2 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-white/80" />
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="kicker">Farmer Assistant</p>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">Game mode</span>
          </div>
          <h3 className="mt-1 text-sm font-black text-[var(--text)]">{mode.title}</h3>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{mode.line}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {farmerModes.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setModeIndex(index)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-black transition ${
                  modeIndex === index ? "bg-teal-600 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
          <button type="button" className="btn-primary mt-3 w-full justify-center text-xs">
            {mode.cta}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DiaryEntry({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card-soft p-3.5">
      <div className="mb-1.5 flex items-center gap-2">
        {icon}
        <span className="text-xs font-black text-[var(--text)]">{title}</span>
      </div>
      <p className="text-xs leading-5 text-[var(--text-muted)]">{text}</p>
    </div>
  );
}
