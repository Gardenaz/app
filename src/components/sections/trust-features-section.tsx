"use client";

import { motion } from "framer-motion";
import { Bot, Fingerprint, ShieldCheck, Sprout } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

const marqueeRows = [
  [
    "Why did the agent choose this move?",
    "What makes this automation trustworthy?",
    "Can I follow the reasoning later?",
    "What keeps the agent inside bounds?",
  ],
  [
    "Do I still control the rules?",
    "How are risk limits enforced?",
    "Can beginners follow the flow?",
    "What happens if markets change fast?",
  ],
  [
    "How do I review past moves?",
    "Is the agent identity visible?",
    "Can I step in when needed?",
    "Where is the proof stored?",
  ],
];

const features = [
  {
    icon: Sprout,
    title: "Reason before execution",
    description:
      "The agent explains the move in plain language first, so users see the thinking before automation does anything onchain.",
  },
  {
    icon: ShieldCheck,
    title: "Policy stays in charge",
    description:
      "The agent can only act inside the limits the user approved. If a move falls outside policy, it does not go through.",
  },
  {
    icon: Fingerprint,
    title: "Proof that stays visible",
    description:
      "Each decision leaves a readable trail so users can come back later and see what happened, when it happened, and how it finished.",
  },
  {
    icon: Bot,
    title: "Built for ordinary users",
    description:
      "The app starts with a guided story instead of terminal-like jargon, while deeper details remain available when users want them.",
  },
];

export function TrustFeaturesSection() {
  return (
    <section id="product" className="landing-section section-landing relative w-full">
      <div className="landing-inner">
        {/* Header */}
        <div className="landing-section-head landing-section-head--center mx-auto max-w-[40rem]">
          <p className="landing-eyebrow">WHY THE MOAT HOLDS</p>
          <h2 className="landing-title max-w-[40rem]">
            The moat is not just automation. It is explainable automation.
          </h2>
          <p className="landing-subtitle max-w-[38rem]">
            Gardenaz combines an AI guide, policy guardrails, and onchain proof so users can understand what the agent is doing without thinking like traders or auditors.
          </p>

          {/* Marquee */}
          <div className="relative mx-auto max-w-[40rem] overflow-hidden">
            <div className="pointer-events-none absolute left-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--bg)] to-transparent" />
            <div className="pointer-events-none absolute right-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--bg)] to-transparent" />

            <div className="flex flex-col gap-2">
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
                <h3 className="landing-card-title">{title}</h3>
                <p className="landing-card-body">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
