"use client";

import { motion } from "framer-motion";
import { Bot, CheckCircle2, ShieldCheck, Sprout } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

const steps = [
  {
    icon: Sprout,
    title: "Guide",
    text: "The user starts with a simple flow instead of a DeFi terminal, so the setup feels understandable from the first step.",
  },
  {
    icon: Bot,
    title: "Plan",
    text: "The agent compares available routes and writes a short explanation before it proposes any automated move.",
  },
  {
    icon: ShieldCheck,
    title: "Check",
    text: "Policy rules decide whether the move is allowed, held back, or blocked based on the limits the user approved.",
  },
  {
    icon: CheckCircle2,
    title: "Prove",
    text: "The decision and the result are written to Mantle so users can look back later and verify what happened.",
  },
] as const;

const proofPoints = [
  {
    title: "Reason shown first",
    text: "The user sees the plan before automation moves.",
  },
  {
    title: "Policy stays in control",
    text: "Rules can block any move outside the approved boundary.",
  },
  {
    title: "Mantle stores the record",
    text: "Each important step leaves a checkable on-chain trace.",
  },
  {
    title: "Agent identity is visible",
    text: "The acting system stays tied to a visible profile and log.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section id="solution" className="landing-section section-landing w-full bg-[var(--surface-soft)]">
      <div className="landing-inner">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="landing-section-head landing-section-head--center relative mx-auto max-w-[40rem]"
        >
          <motion.p variants={staggerItem} className="landing-eyebrow">
            HOW IT WORKS
          </motion.p>
          <motion.h2 variants={staggerItem} className="landing-title">
            The loop is simple: explain, check, execute, prove.
          </motion.h2>
          <motion.p variants={staggerItem} className="landing-subtitle mx-auto max-w-[38rem]">
            Gardenaz keeps the loop simple: the agent explains the move, policy checks it, execution follows the approved path, and Mantle stores the record.
          </motion.p>
          <div className="mx-auto mt-3 h-[2px] w-10 rounded-full bg-gradient-to-r from-transparent via-[var(--primary-border)] to-transparent" />
        </motion.div>

      {/* 4 Steps */
      }
      <div className="relative mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-300 hover:border-[var(--primary-border)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--primary-soft)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative mb-3 flex size-9 items-center justify-center rounded-xl bg-[var(--primary-soft)] transition-colors duration-300 group-hover:bg-[var(--primary-soft-strong)]">
              <step.icon className="size-4 text-[var(--primary)]" />
            </div>
            <h3 className="relative mt-3 text-base font-bold text-[var(--text)]">{step.title}</h3>
            <p className="relative mt-2 text-[12.5px] leading-[1.6] text-[var(--text-muted)]">{step.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Proof points */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {proofPoints.map((point, index) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="rounded-2xl border border-[var(--primary-border)] bg-[var(--surface)] px-4 py-4 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)]">
                <CheckCircle2 className="size-4 text-[var(--primary)]" />
              </div>
              <div>
                <h4 className="landing-card-title">{point.title}</h4>
                <p className="landing-card-body">{point.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      </div>
    </section>
  );
}
