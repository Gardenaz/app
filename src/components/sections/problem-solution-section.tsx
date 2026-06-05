"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";

const problemCards = [
  {
    icon: LockKeyhole,
    title: "Yield has no story",
    text: "APY numbers rarely explain source, risk, or why a strategy changed without warning.",
  },
  {
    icon: Bot,
    title: "AI agents are opaque",
    text: "Most agents ask users to trust automation without proof or clear decision boundaries.",
  },
  {
    icon: ShieldCheck,
    title: "RWA UX feels institutional",
    text: "DeFi jargon blocks users who only want safe, understandable yield from real-world assets.",
  },
] as const;

const fixes = [
  "LLM rationale",
  "deterministic gate",
  "Mantle decision log",
  "execution outcome",
] as const;

export function ProblemSolutionSection() {
  return (
    <section id="product" className="w-full px-9 py-16 mt-40">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        {/* Left — Problem */
        }
        <div>
          <p className="mb-3 text-[10.5px] font-bold tracking-[2.5px] text-[#8ab83a]">
            PROBLEM - AGENT TRUST GAP
          </p>
          <h2 className="text-[28px] font-extrabold -tracking-[1px] text-[#0e1a10] leading-[1.15]">
            Real yield exists.
            <br />
            Autopilot trust does not.
          </h2>
          <p className="mt-3 max-w-[52ch] text-[13px] leading-[1.6] text-[#777]">
            RWA strategies are hard to compare, DeFi execution is opaque, and
            most AI agents cannot prove what they decided or why.
          </p>
          <Link href="/app" className="btn-primary mt-5 inline-flex">
            View proof trail <ArrowRight className="size-4" />
          </Link>

          <div className="mt-6 space-y-3">
            {problemCards.map(({ icon: Icon, title, text }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 rounded-2xl border border-[#e8e8e4] bg-white p-4 transition-shadow duration-300 hover:shadow-[0_2px_10px_rgba(13,26,23,0.04)]"
              >
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#f4f9ec]">
                  <Icon className="size-3.5 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111]">{title}</h3>
                  <p className="mt-1 text-[12.5px] leading-[1.6] text-[#777]">
                    {text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — Before/After + Fix */
        }
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[1.75rem] border border-[#e8e8e4] bg-[#f9fbfa] p-5 shadow-[0_2px_12px_rgba(13,26,23,0.03)]"
          >
            <div className="rounded-2xl border border-white/80 bg-white/90 p-5">
              <p className="text-[10.5px] font-bold tracking-[2.5px] text-[#aaa]">
                BLACK BOX
              </p>
              <p className="mt-2 text-3xl font-extrabold text-[#ccc]">? ? ?</p>
              <p className="mt-2 text-[12.5px] leading-[1.6] text-[#999]">
                No policy trace. No rationale. No outcome benchmark. No agent
                identity.
              </p>
            </div>
            <div className="mt-3 rounded-2xl border border-[#c8e89a] bg-white p-5">
              <p className="text-[10.5px] font-bold tracking-[2.5px] text-[#8ab83a]">
                GARDENAZ FIX
              </p>
              <div className="mt-3 grid gap-2">
                {fixes.map((fix) => (
                  <div
                    key={fix}
                    className="flex items-center gap-2.5 text-sm font-bold text-[#111]"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-[var(--primary)]" />
                    {fix}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#e8e8e4] bg-white p-4"
            >
              <p className="text-[10px] font-black tracking-[.14em] text-[#aaa]">
                BEFORE
              </p>
              <p className="mt-2 text-[12.5px] leading-[1.6] text-[#999]">
                Yield dashboard asks users to trust a number.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-[#c8e89a] bg-white p-4"
            >
              <p className="text-[10px] font-black tracking-[.14em] text-[#8ab83a]">
                AFTER
              </p>
              <p className="mt-2 text-[12.5px] leading-[1.6] text-[#555]">
                Gardenaz shows rationale, gate result, and proof trail.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
