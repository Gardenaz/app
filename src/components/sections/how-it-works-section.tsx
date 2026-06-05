"use client";

import { motion } from "framer-motion";
import { Bot, CheckCircle2, ShieldCheck, Sprout } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

const stackLayers = [
  { level: "L5", title: "Garden UI", text: "guided setup + clear next step", user: true },
  { level: "L4", title: "AI Guide", text: "agent plan + plain-language reason" },
  { level: "L3", title: "Policy Gate", text: "user rules + safety checks" },
  { level: "L2", title: "Mantle Proof", text: "decision log + outcomes" },
  { level: "L1", title: "Execution Layer", text: "strategy routes + mock DeFi adapters" },
] as const;

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

      {/* Stack Layers */
      }
      <div className="mt-12">
        <div className="landing-section-head max-w-[34rem]">
          <p className="landing-subhead mb-0">AGENT STACK</p>
          <h3 className="landing-subhead-title">The layers that keep the agent readable and bounded.</h3>
          <p className="landing-subhead-body">
            Each layer has one job: guide the user, shape the plan, enforce the rules, store the proof, and execute the route.
          </p>
        </div>
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="space-y-2">
            {stackLayers.map(({ level, title, text, ...rest }, i) => (
              <motion.div
                key={level}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-xs font-black text-[var(--primary)]">
                  {level}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="landing-card-title mt-0">{title}</h3>
                  <p className="landing-card-body mt-1 text-[var(--text-subtle)]">{text}</p>
                </div>
                {"user" in rest && (
                  <span className="shrink-0 rounded-full bg-[var(--text)] px-3 py-1 text-[10px] font-black text-[var(--surface)]">
                    user-facing
                  </span>
                )}
              </motion.div>
            ))}
          </div>
          <LayerDiagram />
        </div>
      </div>
      </div>
    </section>
  );
}

function LayerDiagram() {
  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--primary-soft)] p-6 shadow-[var(--shadow-md)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--primary-soft)_1px,transparent_1px),linear-gradient(var(--primary-soft)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="relative mx-auto max-w-sm space-y-2 pt-4">
        {stackLayers.map(({ level, title }, i) => (
          <div
            key={level}
            className="rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-[var(--shadow-sm)]"
            style={{
              transform: `translateX(${i % 2 === 0 ? -6 : 10}px) rotate(${i % 2 === 0 ? -1 : 0.8}deg)`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-[var(--primary)]">{level}</span>
              <span className="text-sm font-bold text-[var(--text)]">{title}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-4 rounded-2xl bg-[var(--surface)] px-3 py-2 shadow-[var(--shadow-sm)]">
        <p className="landing-subhead mb-0">ACTIVE PROOF</p>
        <p className="mt-1 text-xs font-bold text-[var(--text)]">decision + result records</p>
      </div>
    </div>
  );
}
