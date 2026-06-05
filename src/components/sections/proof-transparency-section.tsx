"use client";

import { motion } from "framer-motion";
import { ArrowRight, DatabaseZap, Fingerprint, Network } from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";

const proofRows = [
  { label: "Agent identity", value: "registered profile · visible metadata" },
  { label: "Agent record", value: "#1 · checkable on Mantle" },
  { label: "Decision log", value: "onchain record · policy-aware" },
  { label: "Network", value: "Mantle Sepolia · chain 5003" },
] as const;

const proofStats = [
  { value: "3", label: "strategy lanes" },
  { value: "5", label: "safety layers" },
  { value: "1", label: "active agent" },
] as const;

const primitives = [
  {
    id: "001",
    icon: DatabaseZap,
    title: "Agent guide",
    text: "The model explains the context first, while the guarded execution flow handles the move.",
  },
  {
    id: "002",
    icon: Fingerprint,
    title: "Policy Gate",
    text: "User rules decide whether a move can go through, even when autopilot is enabled.",
  },
  {
    id: "003",
    icon: Network,
    title: "Visible identity",
    text: "The agent, its records, and its linked components stay visible for later review.",
  },
] as const;

export function ProofTransparencySection() {
  return (
    <section id="proof" className="landing-section section-landing w-full">
      <div className="landing-inner grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center">
        {/* Left — Proof header */
        }
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

          {/* Stats */
          }
          <div className="mt-6 grid grid-cols-3 gap-3">
            {proofStats.map(({ value, label }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-center shadow-[var(--shadow-sm)]"
              >
                <p className="text-2xl font-extrabold text-[var(--text)]">{value}</p>
                <p className="mt-1 text-[10px] font-black tracking-[.14em] text-[var(--text-subtle)]">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — Proof rows */
        }
        <div className="space-y-2">
          {proofRows.map(({ label, value }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 transition-shadow duration-300 hover:shadow-[var(--shadow-sm)]"
            >
              <p className="text-[10px] font-black tracking-[.14em] text-[var(--text-subtle)]">
                {label}
              </p>
              <p className="min-w-0 truncate text-right font-mono text-xs font-bold text-[var(--text)]">
                {value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Primitives strip */
      }
      <div className="relative mt-10 border-t border-[var(--border)] pt-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {primitives.map(({ id, icon: Icon, title, text }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-[var(--border)] p-5 transition-all duration-300 hover:border-[var(--primary-border)] hover:shadow-[var(--shadow-md)]"
            >
              <span className="text-[10px] font-black tabular-nums text-[var(--text-subtle)]">
                {id}
              </span>
              <div className="mt-2 flex size-9 items-center justify-center rounded-xl bg-[var(--primary-soft)] transition-colors duration-300 group-hover:bg-[var(--primary-soft-strong)]">
                <Icon className="size-4 text-[var(--primary)]" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-[var(--text)]">{title}</h3>
              <p className="mt-2 text-[12.5px] leading-[1.6] text-[var(--text-muted)]">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
