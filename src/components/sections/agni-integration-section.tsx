"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Zap, RefreshCw, ShieldCheck } from "lucide-react";
import { staggerContainer, staggerItem, easeOutExpo } from "@/lib/motion";

const integrationPoints = [
  {
    icon: Zap,
    title: "Real-time quotes",
    body: "The agent fetches live Agni swap quotes before every recommendation — no stale prices, no surprises.",
  },
  {
    icon: RefreshCw,
    title: "USDC & WMNT routes",
    body: "Stablecoin and native Mantle token swaps routed through Agni's concentrated liquidity pools.",
  },
  {
    icon: ShieldCheck,
    title: "Policy-gated execution",
    body: "Every Agni trade is wrapped in Gardenaz's on-chain policy gate — slippage and size limits enforced before any move lands.",
  },
];

export function AgniIntegrationSection() {
  return (
    <section id="agni" className="landing-section section-landing w-full">
      <div className="landing-inner">

        {/* Video — full container width, half-screen height */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="size-3 rounded-full bg-red-400/70" />
              <span className="size-3 rounded-full bg-yellow-400/70" />
              <span className="size-3 rounded-full bg-green-400/70" />
            </div>
            <div className="ml-2 flex-1 truncate rounded-md bg-[var(--surface-muted)] px-3 py-1 font-mono text-[11px] text-[var(--text-subtle)]">
              agni.finance
            </div>
            <Link
              href="https://agni.finance/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-[var(--text-subtle)] transition-colors hover:text-[var(--text)]"
            >
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
          <div className="max-h-[52vh] overflow-hidden">
            <video
              src="/agni.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full object-cover object-top"
            />
          </div>
        </motion.div>

        {/* Text + features below */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-10"
        >
          {/* Header */}
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.p variants={staggerItem} className="landing-eyebrow">
                DeFi Integration
              </motion.p>
              <motion.h2 variants={staggerItem} className="landing-title max-w-xl">
                Every trade routed through Agni's deep liquidity.
              </motion.h2>
            </div>

            <motion.div variants={staggerItem} className="shrink-0">
              <Link
                href="https://agni.finance/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Explore Agni Finance <ArrowUpRight className="size-4" />
              </Link>
            </motion.div>
          </div>

          <motion.p variants={staggerItem} className="landing-subtitle mt-4 max-w-2xl">
            Gardenaz is natively integrated with Agni Finance — Mantle's concentrated liquidity DEX. The agent fetches live quotes, your policy gate approves the move, and execution hits Agni's pools directly.
          </motion.p>

          {/* Integration points — 3-column grid */}
          <motion.div
            variants={staggerItem}
            className="mt-8 grid gap-4 sm:grid-cols-3"
          >
            {integrationPoints.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-4"
              >
                <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-[var(--primary-soft)]">
                  <Icon className="size-4 text-[var(--primary)]" />
                </div>
                <p className="text-sm font-bold text-[var(--text)]">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{body}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
