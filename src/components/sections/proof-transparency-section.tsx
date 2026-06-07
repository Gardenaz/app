"use client";

import { motion } from "framer-motion";
import { ArrowRight, DatabaseZap, Fingerprint, Network } from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { AnimatedBentoCard } from "@/components/ui/animated-bento-card";

const proofRows = [
  { label: "Agent identity", value: "registered profile · visible metadata" },
  { label: "Agent record", value: "#1 · checkable on Mantle" },
  { label: "Decision log", value: "onchain record · policy-aware" },
  { label: "Network", value: "Mantle Sepolia · chain 5003" },
] as const;

const proofStats = [
  { value: "3", label: "strategy lanes", colors: ["#B3DF46", "#c4ea5a", "#d3f07a"], delay: 0.2 },
  { value: "5", label: "safety layers", colors: ["#60A5FA", "#B3DF46", "#93C5FD"], delay: 0.35 },
  { value: "1", label: "active agent", colors: ["#F59E0B", "#B3DF46", "#FCD34D"], delay: 0.5 },
] as const;

const primitives = [
  {
    id: "001",
    icon: DatabaseZap,
    title: "Agent guide",
    text: "The model explains the context first, while the guarded execution flow handles the move.",
    colors: ["#B3DF46", "#c4ea5a", "#d3f07a"],
    delay: 0.2,
  },
  {
    id: "002",
    icon: Fingerprint,
    title: "Policy Gate",
    text: "User rules decide whether a move can go through, even when autopilot is enabled.",
    colors: ["#F59E0B", "#B3DF46", "#FCD34D"],
    delay: 0.4,
  },
  {
    id: "003",
    icon: Network,
    title: "Visible identity",
    text: "The agent, its records, and its linked components stay visible for later review.",
    colors: ["#60A5FA", "#34D399", "#B3DF46"],
    delay: 0.6,
  },
] as const;

export function ProofTransparencySection() {
  return (
    <section id="proof" className="landing-section section-landing w-full">
      <div className="landing-inner grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center">
        {/* Left — Proof header */}
        <div>
          <p className="mb-3 text-[10.5px] font-bold tracking-[2.5px] text-[var(--primary)]">
            PROOF LAYER
          </p>
          <h2 className="text-[28px] font-extrabold -tracking-[1px] text-[var(--text)] leading-[1.15]">
            Readable for people first.
            <br />
            Verifiable when details matter.
          </h2>
          <p className="mt-3 max-w-[52ch] text-[13px] leading-[1.6] text-[var(--text-muted)]">
            Gardenaz keeps the important records visible so users can understand the agent story first, then inspect the proof trail behind each move.
          </p>
          <Link href="/app" className="btn-primary mt-5 inline-flex">
            Open the app <ArrowRight className="size-4" />
          </Link>

          {/* Stats with animated gradient */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {proofStats.map(({ value, label, colors, delay }) => (
              <AnimatedBentoCard
                key={label}
                colors={colors}
                delay={delay}
                speed={0.03}
                blur="light"
                className="px-4 py-3 text-center"
              >
                <p className="text-2xl font-extrabold text-[var(--text)]">{value}</p>
                <p className="mt-1 text-[10px] font-black tracking-[.14em] text-[var(--text-subtle)]">
                  {label}
                </p>
              </AnimatedBentoCard>
            ))}
          </div>
        </div>

        {/* Right — Proof rows with animated gradient */}
        <div className="space-y-2">
          {proofRows.map(({ label, value }, i) => (
            <AnimatedBentoCard
              key={label}
              colors={["#B3DF46", "#60A5FA", "#c4ea5a"]}
              delay={0.6 + i * 0.1}
              speed={0.02}
              blur="light"
              className="px-4 py-3.5"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-black tracking-[.14em] text-[var(--text-subtle)]">
                  {label}
                </p>
                <p className="min-w-0 truncate text-right font-mono text-xs font-bold text-[var(--text)]">
                  {value}
                </p>
              </div>
            </AnimatedBentoCard>
          ))}
        </div>
      </div>

      {/* Primitives strip with animated gradient */}
      <div className="relative mt-10 border-t border-[var(--border)] pt-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {primitives.map(({ id, icon: Icon, title, text, colors, delay }) => (
            <AnimatedBentoCard
              key={id}
              colors={colors}
              delay={delay}
              speed={0.04}
              blur="medium"
              className="group p-5"
            >
              <span className="text-[10px] font-black tabular-nums text-[var(--text-subtle)]">
                {id}
              </span>
              <div className="mt-2 flex size-9 items-center justify-center rounded-xl bg-[var(--primary-soft)] transition-colors duration-300 group-hover:bg-[var(--primary-soft-strong)]">
                <Icon className="size-4 text-[var(--primary)]" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-[var(--text)]">{title}</h3>
              <p className="mt-2 text-[12.5px] leading-[1.6] text-[var(--text-muted)]">{text}</p>
            </AnimatedBentoCard>
          ))}
        </div>
      </div>
    </section>
  );
}
