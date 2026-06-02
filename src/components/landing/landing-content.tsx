"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { faq, features, proofRows, steps, strategies } from "@/lib/gardena-content";
import { staggerContainer, staggerItem } from "@/lib/motion";

export function LandingContent() {
  return (
    <>
      <Hero />
      <SocialProof />
      <ProblemSection />
      <StrategySection />
      <FeatureSection />
      <HowItWorks />
      <ProofSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Hero
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Hero() {
  return (
    <section id="product" className="relative bg-white">
      {/* Decorative blobs — clipped by section, won't cause scroll */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0" style={{ overflow: "clip" }}>
        <div className="absolute -top-24 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-teal-50/90 blur-[90px] sm:h-[600px] sm:w-[700px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-emerald-50/70 blur-[60px] sm:h-64 sm:w-64" />
      </div>

      {/*
        Mobile-first:  single column, comfortable vertical padding
        lg+:           two-column grid
        min-w-0 on the grid itself prevents CSS grid blowout
      */}
      <div className="container-page relative grid min-w-0 items-center gap-10 pb-16 pt-14 sm:gap-12 sm:pb-20 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:pb-28 lg:pt-28">

        {/* ── Left col ── min-w-0 prevents content from expanding the cell */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="min-w-0 space-y-6 sm:space-y-8"
        >
          {/* Badge */}
          <motion.div variants={staggerItem}>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[.18em] text-teal-700">
              <Sparkles className="size-3" aria-hidden="true" />
              AI × RWA on Mantle
            </span>
          </motion.div>

          {/* Fluid headline — smooth from 40px → 72px */}
          <motion.h1
            variants={staggerItem}
            className="font-display text-fluid-hero text-balance text-[var(--text)]"
          >
            Autonomous yield,{" "}
            <em className="not-italic text-teal-700">without black boxes.</em>
          </motion.h1>

          {/* Body copy — comfortable line-length on all screens */}
          <motion.p
            variants={staggerItem}
            className="max-w-[52ch] text-base leading-7 text-[var(--text-muted)] sm:text-lg sm:leading-8"
          >
            Gardena turns Mantle RWA strategies into a guided farming flow.
            Choose a crop, set guardrails — every AI decision becomes a
            verifiable proof trail.
          </motion.p>

          {/* Stat chips */}
          <motion.div variants={staggerItem} className="grid grid-cols-3 gap-2 pt-1 sm:gap-3">
            <StatBox value="USDY"   label="RWA lane" />
            <StatBox value="mETH"   label="Yield lane" />
            <StatBox value="Policy" label="Agent fence" />
          </motion.div>
        </motion.div>

        {/* ── Right col — strategy preview card ── min-w-0 prevents grid blowout */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="min-w-0"
        >
          <div className="card-lg overflow-hidden p-1">
            {/* Dark header */}
            <div className="rounded-[22px] bg-[var(--text)] px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="kicker !text-teal-300">Live strategy preview</p>
                  <h2 className="font-display mt-2 text-2xl font-semibold text-white sm:text-3xl">
                    Rice / Safe Harvest
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Conservative USDY route, guarded by policy and prepared for Mantle proof log.
                  </p>
                </div>
                <div className="orb-teal grid size-12 shrink-0 place-items-center rounded-2xl text-white sm:size-14">
                  <Coins className="size-5 sm:size-6" aria-hidden="true" />
                </div>
              </div>
              {/* Confidence bar */}
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs font-bold text-white/50">
                  <span>Policy confidence</span><span>92%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 0.92 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full origin-left rounded-full bg-teal-400"
                  />
                </div>
              </div>
            </div>

            {/* Proof rows */}
            <div className="space-y-2 p-3 sm:p-4">
              {proofRows.slice(0, 3).map(([label, value]) => (
                <div
                  key={label}
                  className="card-soft flex min-w-0 items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3"
                >
                  <p className="kicker shrink-0">{label}</p>
                  <p className="min-w-0 truncate text-right text-xs font-semibold text-[var(--text-muted)]">
                    {value}
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-center gap-2 py-1">
                <CheckCircle2 className="size-3.5 shrink-0 text-teal-600" aria-hidden="true" />
                <span className="text-xs font-bold text-teal-700">
                  Policy approved · dry-run complete
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Social proof bar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const socialStats = [
  { value: "3",       label: "RWA strategies" },
  { value: "4",       label: "Policy checks" },
  { value: "ERC-8004",label: "Agent reputation" },
  { value: "Privy",   label: "Wallet onboarding" },
] as const;

function SocialProof() {
  return (
    <div className="divider bg-white">
      <div className="container-page grid grid-cols-2 divide-x divide-y divide-[var(--border)] md:grid-cols-4 md:divide-y-0">
        {socialStats.map((item) => (
          <div key={item.label} className="py-7 text-center sm:py-8">
            <p className="font-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">
              {item.value}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Problem
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const problems = [
  {
    title: "APY without context",
    desc:  "Raw numbers with no explanation of risk, strategy, or what the protocol is actually doing.",
  },
  {
    title: "Opaque agent behavior",
    desc:  "Automated strategies that execute silently — users trust blindly or don't use them at all.",
  },
  {
    title: "Messy DeFi onboarding",
    desc:  "Jargon-heavy interfaces designed for traders, not for the next wave of everyday yield seekers.",
  },
] as const;

function ProblemSection() {
  return (
    <Section
      id="problem"
      kicker="Problem"
      title="Yield products fail when users can't see why an action happened."
      text="Premium DeFi UX needs more than a connect button. Gardena turns agent decisions into policy-led steps users can understand, approve, and share."
    >
      {/* 1 col → 2 col (sm) → 3 col (lg) — avoids squishing on medium screens */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((item) => (
          <div key={item.title} className="card p-5 sm:p-6">
            <LockKeyhole className="mb-4 size-5 text-teal-600" aria-hidden="true" />
            <h3 className="text-[0.9375rem] font-black text-[var(--text)]">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{item.desc}</p>
            <p className="mt-4 text-xs font-bold text-teal-700">
              → Solved with crop lanes, guardrails &amp; proof cards
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Strategies
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const strategyMeta = [
  { bar: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700" },
  { bar: "bg-amber-400",   badge: "bg-amber-50 text-amber-700" },
  { bar: "bg-red-400",     badge: "bg-red-50 text-red-700" },
] as const;

function StrategySection() {
  return (
    <Section
      id="tracks"
      kicker="Strategies"
      title="A simple portfolio menu for Mantle RWA yield."
      text="Three clear lanes replace raw protocol complexity. Choose risk; agent handles policy checks and proof output."
    >
      {/* 1 → 2 (sm) → 3 (lg) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy, i) => {
          const meta = strategyMeta[i];
          return (
            <motion.div
              key={strategy.name}
              variants={staggerItem}
              whileHover={{ y: -3 }}
              className="card overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)]"
            >
              <div className={`h-1.5 w-full ${meta.bar}`} />
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${meta.badge}`}>
                    {strategy.risk}
                  </span>
                  <span className="text-xs font-bold text-[var(--text-muted)]">{strategy.asset}</span>
                </div>
                <h3 className="font-display mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
                  {strategy.name}
                </h3>
                <p className="mt-1 text-lg font-black text-teal-700">
                  {strategy.apy}{" "}
                  <span className="text-sm font-bold text-[var(--text-muted)]">APY</span>
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{strategy.route}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{strategy.desc}</p>
                <Link href="/app" className="btn-secondary mt-4 w-full">
                  Open in app <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Features
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FeatureSection() {
  return (
    <Section
      id="features"
      kicker="Product"
      title="Clean surface. Serious trust layer."
      text="Gardena keeps website polish and protocol evidence separated enough for users, builders, and judges to understand fast."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="card p-5 sm:p-6">
            <div className="orb-teal mb-4 grid size-10 place-items-center rounded-xl text-white sm:mb-5 sm:size-11">
              {feature.icon}
            </div>
            <h3 className="text-[0.9375rem] font-black text-[var(--text)]">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{feature.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   How it works
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      kicker="Flow"
      title="Four steps from login to proof."
      text="No SPA gimmick. Proper route, proper dashboard, proper product path."
    >
      {/* 1 → 2 (sm) → 4 (lg) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([num, title, text], i) => (
          <div key={num} className="card-soft relative p-5 sm:p-6">
            {/* Connector line between steps — desktop only */}
            {i < steps.length - 1 && (
              <div
                aria-hidden
                className="absolute right-0 top-8 hidden h-px w-4 translate-x-full bg-[var(--border)] lg:block"
              />
            )}
            <p className="font-display text-4xl font-semibold text-teal-600/20 sm:text-5xl">{num}</p>
            <h3 className="mt-4 text-sm font-black text-[var(--text)]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Proof
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProofSection() {
  return (
    <section id="proof" className="divider bg-[var(--surface-soft)]">
      <div className="container-page grid gap-10 py-14 sm:gap-12 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <p className="kicker">Proof layer</p>
          <h2 className="font-display mt-4 text-fluid-section text-balance text-[var(--text)]">
            Readable for users.<br className="hidden sm:block" /> Verifiable for auditors.
          </h2>
          <p className="mt-4 max-w-[46ch] text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            Gardena frames decisions as benchmark events: who decided, what
            policy allowed, what route was selected, and what outcome followed.
          </p>
          <Link href="/app" className="btn-primary mt-6 inline-flex sm:mt-7">
            Open launch app <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {proofRows.map(([label, value]) => (
            <div
              key={label}
              className="card flex min-w-0 items-center justify-between gap-4 px-4 py-3 sm:px-5 sm:py-4"
            >
              <p className="kicker shrink-0">{label}</p>
              <p className="min-w-0 truncate text-right text-sm font-semibold text-[var(--text)]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FAQ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FaqSection() {
  return (
    <Section
      id="faq"
      kicker="FAQ"
      title="Clear boundaries for demo and judging."
      text="Gardena stays focused: Mantle-native RWA yield, consumer UX, and on-chain benchmarking."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {faq.map(([q, a]) => (
          <div key={q} className="card p-5 sm:p-6">
            <h3 className="text-[0.9375rem] font-black text-[var(--text)]">{q}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{a}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Final CTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FinalCta() {
  return (
    <section className="container-page py-14 sm:py-16">
      <div className="overflow-hidden rounded-3xl bg-[var(--text)]">
        <div className="relative px-6 py-12 text-center sm:px-10 sm:py-16">
          {/* Glow blob */}
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ overflow: "clip" }}>
            <div className="absolute left-1/2 top-0 h-64 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl sm:w-96" />
          </div>

          <p className="kicker !text-teal-400">Launch</p>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-fluid-section text-balance leading-tight text-white">
            Start with a safe harvest.{" "}
            <span className="block sm:inline">Prove every move.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-sm leading-7 text-white/60 sm:text-base">
            Connect with Privy, generate a guarded plan, and show a clean
            proof card for USDY/mETH strategy decisions.
          </p>

          {/* Stack on mobile, row on sm+ */}
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link href="/app" className="btn-primary">
              Launch app <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <PrivyConnectButton />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Shared section wrapper
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Section({
  id,
  kicker,
  title,
  text,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="divider">
      <div className="container-page py-14 sm:py-20 lg:py-28">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p variants={staggerItem} className="kicker">
            {kicker}
          </motion.p>

          {/* Header row: title left, desc right on lg — both need min-w-0 */}
          <motion.div
            variants={staggerItem}
            className="mb-10 mt-4 grid gap-4 sm:gap-6 lg:grid-cols-2"
          >
            <h2 className="font-display min-w-0 text-fluid-section text-balance text-[var(--text)]">
              {title}
            </h2>
            <p className="min-w-0 max-w-[52ch] self-end text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              {text}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Micro-components
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="card-soft px-3 py-2.5 text-center sm:px-4 sm:py-3">
      <p className="text-xs font-black text-[var(--text)] sm:text-sm">{value}</p>
      <p className="mt-0.5 text-[11px] text-[var(--text-muted)] sm:text-xs">{label}</p>
    </div>
  );
}
