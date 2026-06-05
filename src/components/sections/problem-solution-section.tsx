"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";

const problemCards = [
  {
    icon: LockKeyhole,
    title: "Yield has no story",
    text: "APY numbers rarely explain source, risk, or why a strategy changed without warning.",
  },
  {
    icon: Bot,
    title: "AI agents are opaque",
    text: "Most agents ask users to trust automation without proof or clear decision boundaries.",
  },
  {
    icon: ShieldCheck,
    title: "RWA UX feels institutional",
    text: "DeFi jargon blocks users who only want safe, understandable yield from real-world assets.",
  },
] as const;

const fixes = [
  "LLM rationale",
  "deterministic gate",
  "Mantle decision log",
  "execution outcome",
] as const;

export function ProblemSolutionSection() {
  return (
    <section id="product" className="landing-section section-landing w-full bg-[var(--surface-soft)]">
      <div className="landing-inner">
        <div className="landing-section-head landing-section-head--center mx-auto max-w-[40rem]">
          <p className="landing-eyebrow">WHY THIS MATTERS</p>
          <h2 className="landing-title">
            Real yield exists.
            <br />
            Autopilot trust does not.
          </h2>
          <p className="landing-subtitle mx-auto max-w-[48ch]">
            RWA strategies are hard to compare, DeFi execution is opaque, and
            most AI agents cannot prove what they decided or why.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-start lg:gap-10">
          {/* Left — Problem */
          }
          <div className="max-w-[34rem]">
            <Link href="/app" className="btn-primary inline-flex">
              View proof trail <ArrowRight className="size-4" />
            </Link>

            <div className="mt-6 space-y-3">
              {problemCards.map(({ icon: Icon, title, text }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-shadow duration-300 hover:shadow-[var(--shadow-sm)]"
                >
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-soft)]">
                    <Icon className="size-3.5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="landing-card-title">{title}</h3>
                    <p className="landing-card-body">{text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — Before/After + Fix */}
          <div className="max-w-[36rem] space-y-3 lg:justify-self-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg)] p-5 shadow-[var(--shadow-md)]"
            >
              <div className="rounded-2xl border border-white/80 bg-white/90 p-5">
                <p className="landing-subhead mb-0 text-[var(--text-subtle)]">BLACK BOX</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--neutral-300)]">? ? ?</p>
                <p className="landing-card-body text-[var(--neutral-400)]">
                  No policy trace. No rationale. No outcome benchmark. No agent
                  identity.
                </p>
              </div>
              <div className="mt-3 rounded-2xl border border-[var(--primary-border)] bg-[var(--surface)] p-5">
                <p className="landing-subhead mb-0">GARDENAZ FIX</p>
                <div className="mt-3 grid gap-2">
                  {fixes.map((fix) => (
                    <div
                      key={fix}
                      className="flex items-center gap-2.5 text-sm font-bold text-[var(--text)]"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-[var(--primary)]" />
                      {fix}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <p className="landing-subhead mb-0 text-[var(--text-subtle)]">BEFORE</p>
                <p className="landing-card-body text-[var(--neutral-400)]">
                  Yield dashboard asks users to trust a number.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-[var(--primary-border)] bg-[var(--surface)] p-4"
              >
                <p className="landing-subhead mb-0">AFTER</p>
                <p className="landing-card-body">
                  Gardenaz shows rationale, gate result, and proof trail.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
