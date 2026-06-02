"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Fingerprint,
  Play,
  ShieldCheck,
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
