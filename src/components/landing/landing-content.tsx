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
      <div aria-hidden className="absolute inset-x-0 top-20 mx-auto h-[520px] max-w-5xl rounded-full bg-[radial-gradient(circle,#dff6ef_0%,rgba(223,246,239,0)_68%)] blur-2xl" />
      <div className="container-page relative pb-14 pt-14 sm:pb-20 sm:pt-20 lg:pb-24">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="mx-auto max-w-5xl text-center">
          <motion.div variants={staggerItem} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[.18em] text-[var(--primary)] shadow-[var(--shadow-sm)] backdrop-blur">
            <Sparkles className="size-3" /> AI x RWA agent on Mantle
          </motion.div>
          <motion.h1 variants={staggerItem} className="font-display mx-auto mt-6 max-w-4xl text-fluid-hero text-balance text-[var(--text)]">
            Where <em className="text-[var(--text-muted)]">AI agents</em> grow{" "}
            <em className="text-[var(--primary)]">real-world yield.</em>
          </motion.h1>
          <motion.p variants={staggerItem} className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg sm:leading-8">
            Gardena turns USDY and mETH strategies into an autonomous garden: plan with AI, enforce policy gates, execute guarded routes, and prove every move on Mantle.
          </motion.p>
          <motion.div variants={staggerItem} className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/app" className="btn-primary">Launch garden <ArrowRight className="size-4" /></Link>
            <Link href="/app/live" className="btn-secondary">View live proof <Radio className="size-4" /></Link>
            <PrivyConnectButton />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.6 }} className="relative mx-auto mt-12 max-w-6xl">
          <GardenMap />
          <div className="absolute left-1/2 top-5 hidden -translate-x-1/2 rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 shadow-[var(--shadow-md)] backdrop-blur sm:block">
            <p className="text-[11px] font-black uppercase tracking-[.16em] text-[var(--primary)]">ERC-8004 registered</p>
            <p className="mt-1 text-sm font-bold text-[var(--text)]">agentId #1 · IPFS metadata</p>
          </div>
          <div className="mx-auto mt-4 grid max-w-3xl gap-3 sm:grid-cols-3">
            {proofStats.map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-center shadow-[var(--shadow-sm)]">
                <p className="font-display text-3xl text-[var(--text)]">{value}</p>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[.16em] text-[var(--text-subtle)]">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GardenMap() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-gradient-to-b from-[#f4fbf8] to-white p-5 shadow-[var(--shadow-lg)] sm:p-8">
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div className="relative min-h-[310px] overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-[#edf8f2]">
          <div className="absolute inset-x-[-10%] bottom-[-34%] h-[72%] rounded-[50%] bg-[#ccebd8]" />
          <div className="absolute inset-x-[8%] bottom-[-28%] h-[58%] rounded-[50%] bg-[#a9dbc0]" />
          <div className="absolute inset-x-[20%] bottom-[-23%] h-[46%] rounded-[50%] bg-[#82c99f]" />
          <div className="absolute left-[12%] top-[22%] h-16 w-16 rounded-full bg-white/70 blur-xl" />
          <div className="absolute left-[13%] top-[22%] rounded-full bg-white px-3 py-2 text-xs font-black text-[var(--primary)] shadow-[var(--shadow-sm)]">USDY</div>
          <div className="absolute right-[18%] top-[30%] rounded-full bg-white px-3 py-2 text-xs font-black text-[var(--primary)] shadow-[var(--shadow-sm)]">mETH</div>
          <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-3xl border border-white/80 bg-white/80 px-4 py-3 shadow-[var(--shadow-md)] backdrop-blur">
            <Sprout className="size-5 text-[var(--primary)]" />
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-[.14em] text-[var(--primary)]">Gardena Agent</p>
              <p className="text-sm font-bold text-[var(--text)]">plan → gate → prove</p>
            </div>
          </div>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 360" fill="none" aria-hidden>
            <path d="M115 115 C260 205 445 42 575 122" stroke="#0d7f76" strokeWidth="2" strokeDasharray="7 10" opacity=".45" />
            <path d="M170 250 C300 185 405 185 530 245" stroke="#0d7f76" strokeWidth="2" opacity=".22" />
          </svg>
        </div>
        <div className="space-y-3">
          {routes.map(([crop, asset, strategy, desc, risk]) => (
            <div key={strategy} className="rounded-2xl border border-[var(--border)] bg-white/85 p-4 shadow-[var(--shadow-sm)] backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="kicker">{crop} · {asset}</p>
                  <h3 className="mt-1 text-base font-black text-[var(--text)]">{strategy}</h3>
                </div>
                <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-[11px] font-black text-[var(--primary)]">{risk}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StackSection() {
  return (
    <section id="what-is-gardena" className="divider bg-white">
      <div className="container-page py-16 sm:py-24">
        <SectionHeader kicker="What is Gardena?" title="A transparent AI yield agent with a garden interface." text="The user sees crops and harvests. Underneath, a strict agent stack separates LLM reasoning, deterministic policy, execution, and on-chain proof." />
        <div className="mt-12 grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="space-y-4">
            {stackLayers.map(([level, title, text], index) => (
              <motion.div key={level} variants={staggerItem} initial="initial" whileInView="animate" viewport={{ once: true }} className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--surface-soft)] text-xs font-black text-[var(--primary)]">{level}</div>
                <div className="min-w-0">
                  <h3 className="font-black text-[var(--text)]">{title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{text}</p>
                </div>
                {index === 0 && <span className="ml-auto hidden rounded-full bg-[var(--text)] px-3 py-1 text-[11px] font-black text-white sm:inline">user-facing</span>}
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
    <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-[var(--shadow-md)]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,127,118,.06)_1px,transparent_1px),linear-gradient(rgba(13,127,118,.06)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="relative mx-auto mt-10 max-w-md space-y-[-10px]">
        {stackLayers.map(([level, title], i) => (
          <div key={level} className="relative rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-[0_18px_40px_rgba(13,26,23,.08)] backdrop-blur" style={{ transform: `translateX(${i % 2 === 0 ? -10 : 18}px) rotate(${i % 2 === 0 ? -1.5 : 1.2}deg)` }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--primary)]">{level}</p>
              <p className="text-sm font-black text-[var(--text)]">{title}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-6 left-6 rounded-2xl bg-white px-4 py-3 shadow-[var(--shadow-sm)]">
        <p className="kicker">active proof</p>
        <p className="mt-1 text-sm font-black">decision + outcome logs</p>
      </div>
    </div>
  );
}

function PrimitiveStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-white">
      <div className="container-page grid divide-y divide-[var(--border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
        {primitives.map(([num, title, text, Icon]) => (
          <div key={title} className="p-5 sm:p-6">
            <p className="text-xs font-black text-[var(--text-subtle)]">{num}</p>
            <Icon className="mt-5 size-5 text-[var(--primary)]" />
            <h3 className="mt-4 text-sm font-black text-[var(--text)]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="problem" className="divider bg-white">
      <div className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
        <div>
          <p className="kicker">Problem · agent trust gap</p>
          <h2 className="font-display mt-4 text-fluid-section text-balance text-[var(--text)]">Real yield exists.<br />Autopilot trust does not.</h2>
          <p className="mt-5 max-w-[52ch] text-base leading-7 text-[var(--text-muted)]">RWA strategies are hard to compare, DeFi execution is opaque, and most AI agents cannot prove what they decided or why.</p>
          <Link href="/app/live" className="btn-primary mt-7 inline-flex">Read proof trail <ArrowRight className="size-4" /></Link>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {problemCards.map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
                <LockKeyhole className="size-4 text-[var(--primary)]" />
                <h3 className="mt-3 text-sm font-black text-[var(--text)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-[var(--shadow-md)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(13,127,118,.16),transparent_34%)]" />
          <div className="relative rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[var(--shadow-sm)] backdrop-blur">
            <p className="kicker">black box</p>
            <h3 className="font-display mt-3 text-4xl text-[var(--text)]">? ? ?</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">No policy trace. No rationale. No outcome benchmark. No agent identity.</p>
          </div>
          <div className="relative mt-4 rounded-3xl border border-emerald-200 bg-white p-6 shadow-[var(--shadow-sm)]">
            <p className="kicker">Gardena fix</p>
            <div className="mt-4 grid gap-3">
              {["LLM rationale", "deterministic gate", "Mantle decision log", "execution outcome"].map((x) => (
                <div key={x} className="flex items-center gap-3 text-sm font-bold text-[var(--text)]"><CheckCircle2 className="size-4 text-[var(--primary)]" />{x}</div>
              ))}
            </div>
          </div>
          <div className="relative mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-[var(--border)] bg-white/85 p-5 shadow-[var(--shadow-sm)]">
              <p className="kicker">before</p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">Yield dashboard asks users to trust a number.</p>
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-[var(--shadow-sm)]">
              <p className="kicker">after</p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">Gardena shows rationale, gate result, and proof trail.</p>
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
      <div className="container-page py-16 sm:py-24">
        <SectionHeader kicker="Solution · bounded autonomy" title="Plan, gate, execute, and prove." text="Gardena combines a LangGraph AI advisor, deterministic policy checks, guarded Mantle execution, and on-chain outcome benchmarks into one transparent agent loop." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([num, title, text]) => (
            <div key={num} className="relative rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <p className="font-display text-5xl text-[var(--primary)]/20">{num}</p>
              <h3 className="mt-5 text-base font-black text-[var(--text)]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
          <div className="grid gap-3 text-sm font-bold text-[var(--text)] sm:grid-cols-3">
            <span className="rounded-2xl bg-[var(--primary-soft)] px-4 py-3 text-[var(--primary)]">Rationale visible</span>
            <span className="rounded-2xl bg-[var(--surface-soft)] px-4 py-3">Policy decides</span>
            <span className="rounded-2xl bg-[var(--surface-soft)] px-4 py-3">Mantle records outcome</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section id="how-it-works" className="divider bg-white">
      <div className="container-page py-16 sm:py-24">
        <SectionHeader kicker="Live agent workflow" title="Same garden, two perspectives." text="Users get crop-level clarity. Judges and auditors get the underlying proof stream." />
        <div className="mx-auto mt-8 flex w-fit rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-1">
          <span className="rounded-xl bg-[var(--text)] px-4 py-2 text-sm font-black text-white">For Gardeners</span>
          <span className="px-4 py-2 text-sm font-black text-[var(--text-muted)]">For Validators</span>
        </div>
        <div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-md)]">
          <svg viewBox="0 0 820 320" className="h-auto w-full" fill="none" aria-hidden>
            <path d="M90 260 C220 70 590 70 730 260" stroke="#d8e6e1" strokeWidth="2" />
            <path d="M135 260 C260 128 552 128 686 260" stroke="#d8e6e1" strokeWidth="2" />
            <path d="M180 260 C300 184 512 184 640 260" stroke="#0d7f76" strokeWidth="3" />
          </svg>
          <div className="absolute left-[13%] top-[68%] rounded-full bg-white p-3 shadow-[var(--shadow-md)]"><Sprout className="size-5 text-[var(--primary)]" /></div>
          <div className="absolute left-[30%] top-[36%] rounded-full bg-white p-3 shadow-[var(--shadow-md)]"><Bot className="size-5 text-[var(--primary)]" /></div>
          <div className="absolute left-1/2 top-[26%] -translate-x-1/2 rounded-full bg-[var(--text)] p-4 shadow-[var(--shadow-md)]"><Gauge className="size-6 text-white" /></div>
          <div className="absolute right-[30%] top-[36%] rounded-full bg-white p-3 shadow-[var(--shadow-md)]"><LineChart className="size-5 text-[var(--primary)]" /></div>
          <div className="absolute right-[13%] top-[68%] rounded-full bg-white p-3 shadow-[var(--shadow-md)]"><Fingerprint className="size-5 text-[var(--primary)]" /></div>
          <div className="absolute left-1/2 top-[12%] -translate-x-1/2 rounded-2xl bg-[var(--text)] px-4 py-2 text-sm font-black text-white shadow-[var(--shadow-sm)]">Policy gate active</div>
          <p className="mx-auto -mt-4 max-w-2xl text-center text-sm leading-7 text-[var(--text-muted)]">Gardena gives users the engagement of a garden and the proof of an on-chain benchmark system.</p>
        </div>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section id="proof" className="bg-[var(--surface-soft)]">
      <div className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="kicker">Proof layer</p>
          <h2 className="font-display mt-4 text-fluid-section text-balance text-[var(--text)]">Readable for users.<br />Verifiable for auditors.</h2>
          <p className="mt-5 max-w-[52ch] text-base leading-7 text-[var(--text-muted)]">Agent identity, IPFS metadata, decision logs, and outcome fields are available for app UI, judges, and external validators.</p>
          <Link href="/app/live" className="btn-primary mt-7 inline-flex">Open transparency page <ArrowRight className="size-4" /></Link>
        </div>
        <div className="space-y-3">
          {proofRows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-white px-5 py-4 shadow-[var(--shadow-sm)]">
              <p className="kicker shrink-0">{label}</p>
              <p className="min-w-0 truncate text-right text-sm font-black text-[var(--text)]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="container-page py-16">
      <div className="overflow-hidden rounded-[2rem] bg-[var(--text)] px-6 py-14 text-center shadow-[var(--shadow-lg)] sm:px-10 sm:py-16">
        <p className="kicker !text-teal-300">Launch</p>
        <h2 className="font-display mx-auto mt-4 max-w-3xl text-fluid-section text-balance text-white">Start with safe harvest. Prove every move.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">Connect with Privy, generate a guarded plan, and show a clean proof card for USDY/mETH strategy decisions.</p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link href="/app" className="btn-primary">Launch app <ArrowRight className="size-4" /></Link>
          <PrivyConnectButton />
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-80px" }} className="grid gap-5 lg:grid-cols-2 lg:items-end">
      <div>
        <motion.p variants={staggerItem} className="kicker">{kicker}</motion.p>
        <motion.h2 variants={staggerItem} className="font-display mt-4 max-w-2xl text-fluid-section text-balance text-[var(--text)]">{title}</motion.h2>
      </div>
      <motion.p variants={staggerItem} className="max-w-[56ch] text-sm leading-7 text-[var(--text-muted)] sm:text-base lg:justify-self-end">{text}</motion.p>
    </motion.div>
  );
}


