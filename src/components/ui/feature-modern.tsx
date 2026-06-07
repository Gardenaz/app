"use client";

import React from "react";
import Balancer from "react-wrap-balancer";
import { Bot, DatabaseZap, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type FeatureItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  cta?: string;
};

const features: FeatureItem[] = [
  {
    icon: <Bot className="h-6 w-6 text-[var(--primary)]" />,
    title: "Readable AI decisions",
    description:
      "The agent explains every move in plain language before executing. No black boxes, no jargon — just clear rationale you can follow.",
    href: "/app",
    cta: "Try the agent",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-[var(--primary)]" />,
    title: "Policy-bound autopilot",
    description:
      "Your rules stay in control even when automation is enabled. Max size, slippage, protocol whitelist — policy gates every move.",
    href: "/app",
    cta: "Set your rules",
  },
];

const highlight: FeatureItem = {
  icon: <DatabaseZap className="h-6 w-6 text-[var(--primary)]" />,
  title: "Verifiable proof trail on Mantle",
  description:
    "Every decision, rationale, and execution outcome is recorded on-chain. Agent identity stays visible, so anyone can audit the full trail.",
  href: "/app",
  cta: "View proof trail",
};

export function FeatureModern() {
  return (
    <section className="landing-section section-landing w-full bg-[var(--bg)]">
      <div className="landing-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="landing-eyebrow">WHY THIS MATTERS</p>
          <h3 className="landing-title max-w-[20ch]">
            <Balancer>
              Autonomous finance needs more than trust — it needs proof.
            </Balancer>
          </h3>
          <h4 className="landing-subtitle max-w-[42ch]">
            <Balancer>
              DeFi agents are powerful but opaque. Gardenaz makes every decision visible, auditable, and bound by your rules — so you never have to guess what the agent did or why.
            </Balancer>
          </h4>

          {/* Feature cards — 2 col */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12">
            {features.map(({ icon, title, description, href, cta }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  href={href || "#"}
                  className="flex flex-col justify-between gap-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-mt-2 hover:mb-2 hover:border-[var(--primary-border)] hover:shadow-[var(--shadow-md)]"
                >
                  <div className="grid gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--primary-soft)]">
                      {icon}
                    </div>
                    <h4 className="text-xl font-bold text-[var(--text)]">{title}</h4>
                    <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                      {description}
                    </p>
                  </div>
                  {cta && (
                    <div className="flex h-fit items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                      <span>{cta}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Single highlight card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4"
          >
            <Link
              href={highlight.href || "#"}
              className="flex flex-col justify-between gap-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-mt-2 hover:mb-2 hover:border-[var(--primary-border)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="grid gap-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--primary-soft)]">
                  {highlight.icon}
                </div>
                <h4 className="text-xl font-bold text-[var(--text)]">
                  {highlight.title}
                </h4>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  {highlight.description}
                </p>
              </div>
              {highlight.cta && (
                <div className="flex h-fit items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                  <span>{highlight.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
