"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Fingerprint,
  Gauge,
  Leaf,
  LineChart,
  LockKeyhole,
  Network,
  Radio,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { staggerContainer, staggerItem } from "@/lib/motion";

const stackLayers = [
  ["L5", "Garden UI", "plant / monitor / harvest"],
  ["L4", "AI Advisor", "LangGraph + LLM rationale"],
  ["L3", "Policy Gate", "risk limits + kill switch"],
  ["L2", "Mantle Proof", "DecisionLog + outcomes"],
  ["L1", "RWA Routes", "USDY / mETH / Odos"],
] as const;

const primitives = [
  ["001", "AI Advisor", "LLM explains market context, but never executes directly.", Bot],
  ["002", "Policy Gate", "Deterministic guardrails approve, hold, or block every move.", ShieldCheck],
  ["003", "RWA Routes", "USDY and mETH strategy lanes mapped into garden crops.", Leaf],
  ["004", "Mantle Proof", "DecisionLog records decisions and execution outcomes.", Fingerprint],
  ["005", "ERC-8004 Identity", "Agent metadata, tools, wallet, and reputation stay verifiable.", Network],
] as const;

const problemCards = [
  ["Yield has no story", "APY numbers rarely explain source, risk, or why a strategy changed."],
  ["AI agents are opaque", "Most agents ask users to trust automation without proof or boundaries."],
  ["RWA UX feels institutional", "DeFi jargon blocks users who only want safe, understandable yield."],
] as const;

const steps = [
  ["01", "Plant", "Choose a crop lane: USDY, mETH, or dynamic USDY/mETH."],
  ["02", "Think", "LangGraph ranks opportunities and the LLM writes rationale."],
  ["03", "Gate", "Policy checks risk, protocol allowlists, limits, and execution mode."],
  ["04", "Prove", "Decision and outcome records are anchored to Mantle."],
] as const;

const proofRows = [
  ["AgentIdentity", "0xfAc7…1271"],
  ["agentId", "1"],
  ["tokenURI", "ipfs://bafkreica…vxu"],
  ["DecisionLog", "0x4f38…aC7c"],
  ["Network", "Mantle Sepolia · 5003"],
] as const;

const routes = [
  ["Rice", "USDY", "steady-rwa-usdy", "Conservative real-world yield lane with strict policy fence.", "Low risk"],
  ["Corn", "mETH", "growth-meth-yield", "Liquid staking yield lane for higher growth appetite.", "Medium risk"],
  ["Chili", "USDY/mETH", "boost-rwa-meth-dynamic", "Dynamic route, only allowed when policy and execution caps pass.", "High risk"],
] as const;

const proofStats = [
  ["3", "strategy lanes"],
  ["5", "guardrail layers"],
  ["1", "registered agent"],
] as const;

export function LandingContent() {
  return (
    <div className="bg-white">
      <Hero />
      <StackSection />
      <PrimitiveStrip />
      <ProblemSection />
      <SolutionSection />
      <WorkflowSection />
      <ProofSection />
      <FinalCta />
    </div>
  );
}

function Hero() {
  return (
    <section id="product" className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#dff6ef,transparent)]"
      />
      <div className="container-page relative pb-12 pt-12 sm:pb-20 sm:pt-16 lg:pb-24">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            variants={staggerItem}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-3 py-1.5 text-[11px] font-black uppercase tracking-[.16em] text-[var(--primary)] shadow-[var(--shadow-sm)] backdrop-blur"
          >
            <Sparkles className="size-3" /> AI × RWA agent on Mantle
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="font-display mx-auto mt-5 text-fluid-hero text-balance text-[var(--text)]"
          >
            Where AI agents grow{" "}
            <em className="text-[var(--primary)]">real-world yield.</em>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="mx-auto mt-5 max-w-xl text-base leading-7 text-[var(--text-muted)]"
          >
            Gardenaz turns USDY and mETH strategies into an autonomous garden — plan with AI,
            enforce policy gates, execute guarded routes, and prove every move on Mantle.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/app" className="btn-primary">
              Launch garden <ArrowRight className="size-4" />
            </Link>
            <Link href="/app/live" className="btn-secondary">
              View live proof <Radio className="size-4" />
            </Link>
            <PrivyConnectButton />
          </motion.div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5 }}
          className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-3"
        >
          {proofStats.map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-center shadow-[var(--shadow-sm)]"
            >
              <p className="font-display text-3xl font-semibold text-[var(--text)]">{value}</p>
              <p className="mt-1 text-[11px] font-black uppercase tracking-[.14em] text-[var(--text-subtle)]">
                {label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Garden map preview */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative mx-auto mt-8 max-w-5xl"
        >
          <GardenMap />
        </motion.div>
      </div>
    </section>
  );
}

function GardenMap() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-gradient-to-b from-[#f4fbf8] to-white shadow-[var(--shadow-lg)]">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_.9fr]">
        {/* Left — visual map */}
        <div className="relative min-h-[280px] overflow-hidden border-b border-[var(--border)] bg-[#edf8f2] p-6 lg:border-b-0 lg:border-r sm:min-h-[320px]">
          <div className="absolute inset-x-[-10%] bottom-[-34%] h-[72%] rounded-[50%] bg-[#ccebd8]" />
          <div className="absolute inset-x-[8%] bottom-[-28%] h-[58%] rounded-[50%] bg-[#a9dbc0]" />
          <div className="absolute inset-x-[20%] bottom-[-23%] h-[46%] rounded-[50%] bg-[#82c99f]" />

          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 320" fill="none" aria-hidden>
            <path d="M80 280 C200 100 390 100 520 280" stroke="#0d7f76" strokeWidth="1.5" strokeDasharray="6 8" opacity=".3" />
          </svg>

          {/* Floating chips */}
          <div className="absolute left-[12%] top-[20%] rounded-full bg-white px-3 py-1.5 text-xs font-black text-[var(--primary)] shadow-[var(--shadow-sm)]">
            USDY
          </div>
          <div className="absolute right-[16%] top-[28%] rounded-full bg-white px-3 py-1.5 text-xs font-black text-[var(--primary)] shadow-[var(--shadow-sm)]">
            mETH
          </div>

          <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-white/70 bg-white/85 px-4 py-2.5 shadow-[var(--shadow-md)] backdrop-blur">
            <Sprout className="size-4 text-[var(--primary)] shrink-0" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-[var(--primary)]">Gardenaz Agent</p>
              <p className="text-sm font-bold text-[var(--text)]">plan → gate → prove</p>
            </div>
          </div>

          {/* ERC badge */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-xl border border-emerald-200 bg-white/90 px-3 py-1.5 text-center shadow-[var(--shadow-sm)] backdrop-blur">
            <p className="text-[10px] font-black uppercase tracking-[.14em] text-[var(--primary)]">ERC-8004 registered</p>
            <p className="text-xs font-bold text-[var(--text)]">agentId #1 · IPFS metadata</p>
          </div>
        </div>

        {/* Right — route cards */}
        <div className="divide-y divide-[var(--border)]">
          {routes.map(([crop, asset, strategy, desc, risk]) => (
            <div key={strategy} className="flex items-start gap-3 p-4 sm:p-5">
              <div className="shrink-0 rounded-xl bg-[var(--primary-soft)] p-2">
                <Sprout className="size-4 text-[var(--primary)]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="kicker">{crop} · {asset}</p>
                  <span className="shrink-0 rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] font-black text-[var(--text-muted)]">
                    {risk}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-5 text-[var(--text-muted)]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StackSection() {
  return (
    <section id="what-is-gardenaz" className="divider bg-white">
      <div className="container-page py-14 sm:py-20">
        <SectionHeader
          kicker="What is Gardenaz?"
          title="A transparent AI yield agent with a garden interface."
          text="The user sees crops and harvests. Underneath, a strict agent stack separates LLM reasoning, deterministic policy, execution, and on-chain proof."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-3">
            {stackLayers.map(([level, title, text], index) => (
              <motion.div
                key={level}
                variants={staggerItem}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--surface-soft)] text-xs font-black text-[var(--primary)]">
                  {level}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-[var(--text)]">{title}</h3>
                  <p className="mt-0.5 text-sm text-[var(--text-muted)]">{text}</p>
                </div>
                {index === 0 && (
                  <span className="shrink-0 rounded-full bg-[var(--text)] px-2.5 py-1 text-[10px] font-black text-white">
                    user-facing
                  </span>
                )}
              </motion.div>
            ))}
          </div>
          <LayerDiagram />
        </div>
      </div>
    </section>
  );
}

function LayerDiagram() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-[var(--shadow-md)] min-h-[360px]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,127,118,.05)_1px,transparent_1px),linear-gradient(rgba(13,127,118,.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative mx-auto max-w-sm space-y-2 pt-6">
        {stackLayers.map(([level, title], i) => (
          <div
            key={level}
            className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-[0_12px_32px_rgba(13,26,23,.07)] backdrop-blur"
            style={{
              transform: `translateX(${i % 2 === 0 ? -8 : 14}px) rotate(${i % 2 === 0 ? -1.2 : 0.9}deg)`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-[var(--primary)]">{level}</span>
              <span className="text-sm font-black text-[var(--text)]">{title}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-5 left-5 rounded-xl bg-white px-3 py-2 shadow-[var(--shadow-sm)]">
        <p className="kicker">active proof</p>
        <p className="mt-0.5 text-xs font-black text-[var(--text)]">decision + outcome logs</p>
      </div>
    </div>
  );
}

function PrimitiveStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface-soft)]">
      <div className="container-page">
        <div className="grid divide-y divide-[var(--border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
          {primitives.map(([num, title, text, Icon]) => (
            <div key={title} className="flex flex-col gap-3 p-5 sm:p-6">
              <span className="text-xs font-black tabular-nums text-[var(--text-subtle)]">{num}</span>
              <Icon className="size-5 text-[var(--primary)]" />
              <div>
                <h3 className="text-sm font-black text-[var(--text)]">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[var(--text-muted)]">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="problem" className="divider bg-white">
      <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="kicker">Problem · agent trust gap</p>
          <h2 className="font-display mt-4 text-fluid-section text-balance text-[var(--text)]">
            Real yield exists.<br />Autopilot trust does not.
          </h2>
          <p className="mt-4 max-w-[52ch] text-base leading-7 text-[var(--text-muted)]">
            RWA strategies are hard to compare, DeFi execution is opaque, and most AI agents
            cannot prove what they decided or why.
          </p>
          <Link href="/app/live" className="btn-primary mt-6 inline-flex">
            Read proof trail <ArrowRight className="size-4" />
          </Link>
          <div className="mt-6 space-y-3">
            {problemCards.map(([title, text]) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
                <LockKeyhole className="mt-0.5 size-4 shrink-0 text-[var(--primary)]" />
                <div>
                  <h3 className="text-sm font-black text-[var(--text)]">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface-soft)] p-5 shadow-[var(--shadow-md)]">
            <div className="rounded-2xl border border-white/80 bg-white/85 p-5 backdrop-blur">
              <p className="kicker">black box</p>
              <h3 className="font-display mt-2 text-4xl text-[var(--text)]">? ? ?</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                No policy trace. No rationale. No outcome benchmark. No agent identity.
              </p>
            </div>
            <div className="mt-3 rounded-2xl border border-emerald-200 bg-white p-5">
              <p className="kicker">Gardenaz fix</p>
              <div className="mt-3 grid gap-2">
                {["LLM rationale", "deterministic gate", "Mantle decision log", "execution outcome"].map((x) => (
                  <div key={x} className="flex items-center gap-2.5 text-sm font-bold text-[var(--text)]">
                    <CheckCircle2 className="size-4 shrink-0 text-[var(--primary)]" />{x}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <p className="kicker">before</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Yield dashboard asks users to trust a number.</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-[var(--shadow-sm)]">
              <p className="kicker">after</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Gardenaz shows rationale, gate result, and proof trail.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section id="solution" className="bg-[var(--surface-soft)]">
      <div className="container-page py-14 sm:py-20">
        <SectionHeader
          kicker="Solution · bounded autonomy"
          title="Plan, gate, execute, and prove."
          text="Gardenaz combines a LangGraph AI advisor, deterministic policy checks, guarded Mantle execution, and on-chain outcome benchmarks into one transparent agent loop."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([num, title, text]) => (
            <div key={num} className="relative rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <p className="font-display text-4xl text-[var(--primary)]/20">{num}</p>
              <h3 className="mt-4 text-base font-black text-[var(--text)]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
          <div className="flex flex-wrap gap-2 text-sm font-bold">
            <span className="rounded-xl bg-[var(--primary-soft)] px-3 py-2 text-[var(--primary)]">Rationale visible</span>
            <span className="rounded-xl bg-[var(--surface-soft)] px-3 py-2 text-[var(--text)]">Policy decides</span>
            <span className="rounded-xl bg-[var(--surface-soft)] px-3 py-2 text-[var(--text)]">Mantle records outcome</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section id="how-it-works" className="divider bg-white">
      <div className="container-page py-14 sm:py-20">
        <SectionHeader
          kicker="Live agent workflow"
          title="Same garden, two perspectives."
          text="Users get crop-level clarity. Judges and auditors get the underlying proof stream."
        />
        <div className="relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8">
          <svg viewBox="0 0 820 280" className="h-auto w-full" fill="none" aria-hidden>
            <path d="M90 230 C220 60 590 60 730 230" stroke="#d8e6e1" strokeWidth="2" />
            <path d="M155 230 C278 115 536 115 666 230" stroke="#0d7f76" strokeWidth="2.5" />
          </svg>

          {/* Icons along the arc */}
          {[
            { icon: Sprout, x: "13%", y: "60%" },
            { icon: Bot, x: "30%", y: "32%" },
            { icon: Gauge, x: "50%", y: "22%", dark: true },
            { icon: LineChart, x: "70%", y: "32%" },
            { icon: Fingerprint, x: "87%", y: "60%" },
          ].map(({ icon: Icon, x, y, dark }) => (
            <div
              key={x}
              className={`absolute flex items-center justify-center rounded-full p-2.5 shadow-[var(--shadow-md)] ${
                dark ? "bg-[var(--text)]" : "bg-white"
              }`}
              style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}
            >
              <Icon className={`size-5 ${dark ? "text-white" : "text-[var(--primary)]"}`} />
            </div>
          ))}

          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-xl bg-[var(--text)] px-3 py-1.5 text-xs font-black text-white shadow-[var(--shadow-sm)]">
            Policy gate active
          </div>

          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-[var(--text-muted)]">
            Gardenaz gives users the engagement of a garden and the proof of an on-chain benchmark system.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section id="proof" className="bg-[var(--surface-soft)]">
      <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="kicker">Proof layer</p>
          <h2 className="font-display mt-4 text-fluid-section text-balance text-[var(--text)]">
            Readable for users.<br />Verifiable for auditors.
          </h2>
          <p className="mt-4 max-w-[52ch] text-base leading-7 text-[var(--text-muted)]">
            Agent identity, IPFS metadata, decision logs, and outcome fields are available for
            app UI, judges, and external validators.
          </p>
          <Link href="/app/live" className="btn-primary mt-6 inline-flex">
            Open transparency page <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="space-y-2">
          {proofRows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-white px-4 py-3.5 shadow-[var(--shadow-sm)]"
            >
              <p className="kicker shrink-0">{label}</p>
              <p className="min-w-0 truncate text-right font-mono text-xs font-bold text-[var(--text)]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="container-page py-12 sm:py-16">
      <div className="overflow-hidden rounded-[2rem] bg-[var(--text)] px-6 py-12 text-center shadow-[var(--shadow-lg)] sm:px-10 sm:py-16">
        <p className="kicker !text-teal-400">Launch</p>
        <h2 className="font-display mx-auto mt-4 max-w-2xl text-fluid-section text-balance text-white">
          Start with safe harvest. Prove every move.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60">
          Connect with Privy, generate a guarded plan, and show a clean proof card for
          USDY/mETH strategy decisions.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/app" className="btn-primary">Launch app <ArrowRight className="size-4" /></Link>
          <PrivyConnectButton />
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-4 lg:grid-cols-2 lg:items-end"
    >
      <div>
        <motion.p variants={staggerItem} className="kicker">{kicker}</motion.p>
        <motion.h2 variants={staggerItem} className="font-display mt-3 max-w-2xl text-fluid-section text-balance text-[var(--text)]">
          {title}
        </motion.h2>
      </div>
      <motion.p variants={staggerItem} className="max-w-[56ch] text-sm leading-7 text-[var(--text-muted)] sm:text-base lg:justify-self-end">
        {text}
      </motion.p>
    </motion.div>
  );
}


