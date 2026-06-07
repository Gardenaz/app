"use client";

import { motion } from "framer-motion";
import { Bot, CheckCircle2, ShieldCheck, Sprout } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { AnimatedBentoCard, itemVariants } from "@/components/ui/animated-bento-card";

const steps = [
  {
    icon: Sprout,
    title: "Guide",
    text: "The user starts with a simple flow instead of a DeFi terminal, so the setup feels understandable from the first step.",
    colors: ["#B3DF46", "#c4ea5a", "#d3f07a"],
    delay: 0.2,
  },
  {
    icon: Bot,
    title: "Plan",
    text: "The agent compares available routes and writes a short explanation before it proposes any automated move.",
    colors: ["#60A5FA", "#B3DF46", "#93C5FD"],
    delay: 0.35,
  },
  {
    icon: ShieldCheck,
    title: "Check",
    text: "Policy rules decide whether the move is allowed, held back, or blocked based on the limits the user approved.",
    colors: ["#F59E0B", "#B3DF46", "#FCD34D"],
    delay: 0.5,
  },
  {
    icon: CheckCircle2,
    title: "Prove",
    text: "The decision and the result are written to Mantle so users can look back later and verify what happened.",
    colors: ["#60A5FA", "#34D399", "#B3DF46"],
    delay: 0.65,
  },
] as const;

const proofPoints = [
  {
    title: "Reason shown first",
    text: "The user sees the plan before automation moves.",
    colors: ["#B3DF46", "#c4ea5a", "#a3d630"],
    delay: 0.8,
  },
  {
    title: "Policy stays in control",
    text: "Rules can block any move outside the approved boundary.",
    colors: ["#F59E0B", "#B3DF46", "#FCD34D"],
    delay: 0.9,
  },
  {
    title: "Mantle stores the record",
    text: "Each important step leaves a checkable on-chain trace.",
    colors: ["#60A5FA", "#34D399", "#B3DF46"],
    delay: 1.0,
  },
  {
    title: "Agent identity is visible",
    text: "The acting system stays tied to a visible profile and log.",
    colors: ["#B3DF46", "#60A5FA", "#c4ea5a"],
    delay: 1.1,
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

        {/* 4 Steps with animated gradient */}
        <div className="relative mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <AnimatedBentoCard
              key={step.title}
              colors={step.colors}
              delay={step.delay}
              speed={0.04}
              blur="medium"
              animateChildren
            >
              <motion.div variants={itemVariants}>
                <div className="relative mb-3 flex size-9 items-center justify-center rounded-xl bg-[var(--primary-soft)] transition-colors duration-300 group-hover:bg-[var(--primary-soft-strong)]">
                  <step.icon className="size-4 text-[var(--primary)]" />
                </div>
              </motion.div>
              <motion.h3 variants={itemVariants} className="relative mt-3 text-base font-bold text-[var(--text)]">
                {step.title}
              </motion.h3>
              <motion.p variants={itemVariants} className="relative mt-2 text-[12.5px] leading-[1.6] text-[var(--text-muted)]">
                {step.text}
              </motion.p>
            </AnimatedBentoCard>
          ))}
        </div>

        {/* Proof points with animated gradient */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {proofPoints.map((point) => (
            <AnimatedBentoCard
              key={point.title}
              colors={point.colors}
              delay={point.delay}
              speed={0.03}
              blur="light"
              className="px-4 py-4"
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
            </AnimatedBentoCard>
          ))}
        </div>
      </div>
    </section>
  );
}
