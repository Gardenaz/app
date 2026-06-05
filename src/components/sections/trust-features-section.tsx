"use client";

import { motion } from "framer-motion";
import { Bot, Fingerprint, ShieldCheck, Sprout } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

const marqueeRows = [
  [
    "What strategy fits my risk appetite?",
    "How do I verify agent decisions?",
    "Is my yield source transparent?",
    "Who guards the execution flow?",
  ],
  [
    "Can I trust the AI rationale?",
    "How are risk limits enforced?",
    "Where are proofs stored on-chain?",
    "What if the market shifts suddenly?",
  ],
  [
    "How do I audit past outcomes?",
    "Is my agent identity verifiable?",
    "Can I override agent actions?",
    "How does the policy gate work?",
  ],
];

const features = [
  {
    icon: Sprout,
    title: "Yield that tells a story",
    description:
      "Every strategy comes with LLM rationale, source trace, and a confidence score — no black-box APY numbers.",
  },
  {
    icon: ShieldCheck,
    title: "Deterministic guardrails",
    description:
      "Policy gates approve, hold, or block every action based on risk limits. Humans stay in control at all times.",
  },
  {
    icon: Fingerprint,
    title: "Verifiable proof trail",
    description:
      "Decision hashes, agent identity, and outcome benchmarks are anchored on Mantle for full auditability.",
  },
  {
    icon: Bot,
    title: "AI you can interrogate",
    description:
      "LangGraph agents explain market context and write rationale before any capital moves — inspect every thought.",
  },
];

export function TrustFeaturesSection() {
  return (
    <section id="product" className="relative w-full">
      <div className="mx-auto max-w-full">
        {/* Header */}
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center space-y-4 px-5 pt-20 text-center md:px-10 sm:pt-24">
          <h2 className="max-w-3xl font-display font-semibold text-3xl text-[var(--text)] sm:text-4xl lg:text-5xl">
            Removing the blind spots in agent-driven yield
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
            It&apos;s easy to get lost in DeFi complexity, opaque AI decisions, and
            unchecked automation. We filter out the noise, show you the proof,
            and give you clarity over every move your agents make.
          </p>

          {/* Marquee */}
          <div className="relative mx-auto max-w-3xl overflow-hidden">
            <div className="pointer-events-none absolute left-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--bg)] to-transparent" />
            <div className="pointer-events-none absolute right-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--bg)] to-transparent" />

            <div className="-mx-6 flex w-screen flex-col md:-mx-10 lg:-mx-16">
              <Marquee className="[--duration:45s] [--gap:0.5rem]" repeat={4}>
                {marqueeRows[0].map((q) => (
                  <span
                    key={q}
                    className="rounded-lg border border-[var(--primary)]/15 bg-[var(--primary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)]"
                  >
                    {q}
                  </span>
                ))}
              </Marquee>

              <Marquee className="[--duration:50s] [--gap:0.5rem]" repeat={4} reverse>
                {marqueeRows[1].map((q) => (
                  <span
                    key={q}
                    className="rounded-lg border border-[var(--primary)]/15 bg-[var(--primary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)]"
                  >
                    {q}
                  </span>
                ))}
              </Marquee>

              <Marquee className="[--duration:42s] [--gap:0.5rem]" repeat={4}>
                {marqueeRows[2].map((q) => (
                  <span
                    key={q}
                    className="rounded-lg border border-[var(--primary)]/15 bg-[var(--primary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)]"
                  >
                    {q}
                  </span>
                ))}
              </Marquee>
            </div>
          </div>
        </div>

        {/* 4-column feature grid */}
        <div className="mt-12 grid grid-cols-1 divide-y divide-dashed divide-[var(--border)] border-t border-dashed border-[var(--border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col gap-5 px-5 py-8 last:border-b-0 lg:border-b-0 lg:px-6 lg:py-10"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--primary-soft)]">
                <Icon className="size-5 text-[var(--primary)]" />
              </div>

              <div className="flex flex-col gap-2 pt-6 lg:pt-12">
                <h3 className="font-semibold text-lg tracking-tight text-[var(--text)] sm:text-xl">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
