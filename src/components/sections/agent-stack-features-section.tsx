"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { timelineData } from "@/components/sections/orbital-features-section";

const stackLayers = [
  { level: "L5", title: "Garden UI", text: "guided setup + clear next step" },
  { level: "L4", title: "AI Guide", text: "agent plan + plain-language reason" },
  { level: "L3", title: "Policy Gate", text: "user rules + safety checks" },
  { level: "L2", title: "Mantle Proof", text: "decision log + outcomes" },
  { level: "L1", title: "Execution Layer", text: "strategy routes + mock DeFi adapters" },
] as const;

export function AgentStackFeaturesSection() {
  return (
    <section id="stack" className="landing-section section-landing w-full bg-(--surface-soft)">
      <div className="landing-inner">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="landing-section-head landing-section-head--center relative mx-auto max-w-160"
        >
          <motion.p variants={staggerItem} className="landing-eyebrow">
            AGENT STACK
          </motion.p>
          <motion.h2 variants={staggerItem} className="landing-title">
            The stack that keeps agents readable, bounded, and production-ready.
          </motion.h2>
          <motion.p variants={staggerItem} className="landing-subtitle mx-auto max-w-[38rem]">
            From the execution layer to the user-facing Garden UI, every level in the stack does one job &mdash; so you get explainable automation with on-chain proof built in.
          </motion.p>
          <div className="mx-auto mt-3 h-[2px] w-10 rounded-full bg-gradient-to-r from-transparent via-[var(--primary-border)] to-transparent" />
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          {/* LEFT: Agent Stack Layers */}
          <div>
            <p className="landing-subhead mb-5">AGENT STACK</p>
            <div className="space-y-2">
              {stackLayers.map(({ level, title, text }, i) => (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative overflow-hidden flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-[var(--primary-border)] hover:shadow-[var(--shadow-md)]"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--primary-soft)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-xs font-black text-[var(--primary)] transition-colors duration-300 group-hover:bg-[var(--primary-soft-strong)]">
                    {level}
                  </div>
                  <div className="relative min-w-0 flex-1">
                    <h3 className="landing-card-title mt-0">{title}</h3>
                    <p className="landing-card-body mt-1 text-[var(--text-subtle)]">{text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: Everything You Need — orbital timeline */}
          <div>
            <p className="landing-subhead mb-5">EVERYTHING YOU NEED</p>
            <RadialOrbitalTimeline timelineData={timelineData} />
          </div>
        </div>
      </div>
    </section>
  );
}
