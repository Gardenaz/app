"use client";

import { motion } from "framer-motion";
import { ArrowRight, DatabaseZap, Fingerprint, Network } from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";

const proofRows = [
  { label: "Agent Identity", value: "ERC-8004 registered · IPFS metadata" },
  { label: "Agent ID", value: "#1 · verifiable on Mantle" },
  { label: "Decision Log", value: "0x4f38…aC7c · policy-safe" },
  { label: "Network", value: "Mantle Sepolia · chain 5003" },
] as const;

const proofStats = [
  { value: "3", label: "strategy lanes" },
  { value: "5", label: "guardrail layers" },
  { value: "1", label: "registered agent" },
] as const;

const primitives = [
  {
    id: "001",
    icon: DatabaseZap,
    title: "AI Advisor",
    text: "LLM explains market context, but never executes directly.",
  },
  {
    id: "002",
    icon: Fingerprint,
    title: "Policy Gate",
    text: "Deterministic guardrails approve, hold, or block every move.",
  },
  {
    id: "003",
    icon: Network,
    title: "ERC-8004 Identity",
    text: "Agent metadata, tools, wallet, and reputation stay verifiable.",
  },
] as const;

export function ProofTransparencySection() {
  return (
    <section id="proof" className="w-full bg-white px-9 py-16">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        {/* Left — Proof header */
        }
        <div>
          <p className="mb-3 text-[10.5px] font-bold tracking-[2.5px] text-[#8ab83a]">
            PROOF LAYER
          </p>
          <h2 className="text-[28px] font-extrabold -tracking-[1px] text-[#0e1a10] leading-[1.15]">
            Readable for users.
            <br />
            Verifiable for auditors.
          </h2>
          <p className="mt-3 max-w-[52ch] text-[13px] leading-[1.6] text-[#777]">
            Agent identity, IPFS metadata, decision logs, and outcome fields are available for app UI, judges, and external validators.
          </p>
          <Link href="/app" className="btn-primary mt-5 inline-flex">
            Open transparency page <ArrowRight className="size-4" />
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
                className="rounded-2xl border border-[#e8e8e4] bg-white px-4 py-3 text-center shadow-[0_1px_4px_rgba(13,26,23,0.03)]"
              >
                <p className="text-2xl font-extrabold text-[#111]">{value}</p>
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
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#e8e8e4] bg-white px-4 py-3.5 transition-shadow duration-300 hover:shadow-[0_2px_8px_rgba(13,26,23,0.04)]"
            >
              <p className="text-[10px] font-black tracking-[.14em] text-[var(--text-subtle)]">
                {label}
              </p>
              <p className="min-w-0 truncate text-right font-mono text-xs font-bold text-[#111]">
                {value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Primitives strip */
      }
      <div className="relative mt-10 border-t border-[#e8e8e4] pt-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {primitives.map(({ id, icon: Icon, title, text }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-[#e8e8e4] p-5 transition-all duration-300 hover:border-[#b0d060] hover:shadow-[0_4px_16px_rgba(179,223,70,0.06)]"
            >
              <span className="text-[10px] font-black tabular-nums text-[var(--text-subtle)]">
                {id}
              </span>
              <div className="mt-2 flex size-9 items-center justify-center rounded-xl bg-[#f4f9ec] transition-colors duration-300 group-hover:bg-[#e8f5ce]">
                <Icon className="size-4 text-[var(--primary)]" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-[#111]">{title}</h3>
              <p className="mt-2 text-[12.5px] leading-[1.6] text-[#777]">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
