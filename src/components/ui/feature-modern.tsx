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
    icon: <Bot className="h-5 w-5 text-[var(--primary)]" />,
    title: "Readable AI decisions",
    description:
      "The agent explains every move in plain language before executing. No black boxes, no jargon — just clear rationale you can follow.",
    href: "/app",
    cta: "Try the agent",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-[var(--primary)]" />,
    title: "Policy-bound autopilot",
    description:
      "Your rules stay in control even when automation is enabled. Max size, slippage, protocol whitelist — policy gates every move.",
    href: "/app",
    cta: "Set your rules",
  },
  {
    icon: <DatabaseZap className="h-5 w-5 text-[var(--primary)]" />,
    title: "Verifiable proof trail on Mantle",
    description:
      "Every decision, rationale, and execution outcome is recorded on-chain. Agent identity stays visible, so anyone can audit the full trail.",
    href: "/app",
    cta: "View proof trail",
  },
];

export function FeatureModern() {
  return (
    <section className="landing-section section-landing w-full bg-[var(--bg)]">
      <div className="landing-inner max-w-[40rem]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="landing-eyebrow">WHY THIS MATTERS</p>
          <h3 className="landing-title">
            <Balancer>
              Autonomous finance needs more than trust — it needs proof.
            </Balancer>
          </h3>
          <p className="landing-subtitle">
            <Balancer>
              DeFi agents are powerful but opaque. Gardenaz makes every decision visible, auditable, and bound by your rules — so you never have to guess what the agent did or why.
            </Balancer>
          </p>

          {/* Feature list — dashed line separators */}
          <div className="mt-10 divide-y divide-[var(--border)] border-t border-[var(--border)]">
            {features.map(({ icon, title, description, href, cta }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="py-6"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-soft)]">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-lg font-bold text-[var(--text)]">{title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                      {description}
                    </p>
                    {cta && (
                      <Link
                        href={href || "#"}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
                      >
                        <span>{cta}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
