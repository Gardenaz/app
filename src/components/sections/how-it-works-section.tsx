"use client";

import { motion } from "framer-motion";
import { Bot, CheckCircle2, ShieldCheck, Sprout } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

const stackLayers = [
  { level: "L5", title: "Garden UI", text: "plant / monitor / harvest", user: true },
  { level: "L4", title: "AI Advisor", text: "LangGraph + LLM rationale" },
  { level: "L3", title: "Policy Gate", text: "risk limits + kill switch" },
  { level: "L2", title: "Mantle Proof", text: "DecisionLog + outcomes" },
  { level: "L1", title: "RWA Routes", text: "USDY / mETH / Odos" },
] as const;

const steps = [
  {
    icon: Sprout,
    title: "Plant",
    text: "Choose a crop lane: USDY, mETH, or dynamic USDY/mETH based on risk appetite and market conditions.",
  },
  {
    icon: Bot,
    title: "Think",
    text: "LangGraph ranks opportunities. The LLM writes rationale so you see the reasoning behind every move.",
  },
  {
    icon: ShieldCheck,
    title: "Gate",
    text: "Deterministic policy checks approve, hold, or block every action based on your risk limits.",
  },
  {
    icon: CheckCircle2,
    title: "Prove",
    text: "Decision and outcome records are anchored on-chain to Mantle for full auditability.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section id="solution" className="w-full px-9 py-16">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="relative mx-auto max-w-[520px] text-center"
      >
        <motion.p
          variants={staggerItem}
          className="mb-[10px] text-[10.5px] font-bold tracking-[2.5px] text-[#8ab83a]"
        >
          HOW IT WORKS
        </motion.p>
        <motion.h2
          variants={staggerItem}
          className="text-[28px] font-extrabold -tracking-[1px] text-[#0e1a10] leading-[1.15]"
        >
          Plan, gate, execute, and prove.
        </motion.h2>
        <motion.p
          variants={staggerItem}
          className="mx-auto mt-3 max-w-[480px] text-[13px] leading-[1.6] text-[#777]"
        >
          Gardenaz combines a LangGraph AI advisor, deterministic policy checks, guarded Mantle execution, and on-chain outcome benchmarks into one transparent agent loop.
        </motion.p>
        {/* Anime-style accent */
        }
        <div className="mx-auto mt-3 h-[2px] w-10 rounded-full bg-gradient-to-r from-transparent via-[#B3DF46]/50 to-transparent" />
      </motion.div>

      {/* 4 Steps */
      }
      <div className="relative mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative overflow-hidden rounded-2xl border border-[#e8e8e4] bg-white p-5 transition-all duration-300 hover:border-[#b0d060] hover:shadow-[0_4px_20px_rgba(179,223,70,0.06)]"
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#B3DF46]/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative mb-3 flex size-9 items-center justify-center rounded-xl bg-[#f4f9ec] transition-colors duration-300 group-hover:bg-[#e8f5ce]">
              <step.icon className="size-4 text-[var(--primary)]" />
            </div>
            <h3 className="relative mt-3 text-base font-bold text-[#111]">{step.title}</h3>
            <p className="relative mt-2 text-[12.5px] leading-[1.6] text-[#777]">{step.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Policy tags */
      }
      <div className="mt-5 flex flex-wrap gap-2">
        {["Rationale visible", "Policy decides", "Mantle records outcome", "Agent identity verifiable"].map(
          (tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#d0e890] bg-[#f7fdf0] px-3 py-2 text-xs font-bold text-[#4a8018]"
            >
              <CheckCircle2 className="mr-1.5 inline size-3" />
              {tag}
            </motion.span>
          ),
        )}
      </div>

      {/* Stack Layers */
      }
      <div className="mt-10">
        <p className="mb-6 text-center text-[10.5px] font-bold tracking-[2.5px] text-[#8ab83a]">
          AGENT STACK
        </p>
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="space-y-2">
            {stackLayers.map(({ level, title, text, ...rest }, i) => (
              <motion.div
                key={level}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 rounded-2xl border border-[#e8e8e4] bg-white p-4 shadow-[0_1px_3px_rgba(13,26,23,0.02)]"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f4f9ec] text-xs font-black text-[var(--primary)]">
                  {level}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-[#111]">{title}</h3>
                  <p className="mt-0.5 text-[12px] text-[#888]">{text}</p>
                </div>
                {"user" in rest && (
                  <span className="shrink-0 rounded-full bg-[#0e1a10] px-3 py-1 text-[10px] font-black text-white">
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
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#e8e8e4] bg-[#f4f9ec] p-6 min-h-[320px] shadow-[0_2px_12px_rgba(13,26,23,0.03)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(13,127,118,.04)_1px,transparent_1px),linear-gradient(rgba(13,127,118,.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="relative mx-auto max-w-sm space-y-2 pt-4">
        {stackLayers.map(({ level, title }, i) => (
          <div
            key={level}
            className="rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-[0_1px_3px_rgba(13,26,23,0.03)]"
            style={{
              transform: `translateX(${i % 2 === 0 ? -6 : 10}px) rotate(${i % 2 === 0 ? -1 : 0.8}deg)`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-[var(--primary)]">{level}</span>
              <span className="text-sm font-bold text-[#111]">{title}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-4 rounded-2xl bg-white px-3 py-2 shadow-[0_1px_6px_rgba(13,26,23,0.06)]">
        <p className="text-[10px] font-black tracking-[.14em] text-[var(--primary)]">ACTIVE PROOF</p>
        <p className="mt-0.5 text-xs font-bold text-[#111]">decision + outcome logs</p>
      </div>
    </div>
  );
}
