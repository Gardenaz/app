"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Launch app", href: "/app" },
      { label: "Garden console", href: "/app#agent-planner" },
    ],
  },
  {
    title: "Protocol",
    links: [
      { label: "USDY route", href: "#solution" },
      { label: "mETH route", href: "#solution" },
      { label: "Policy gate", href: "#what-is-gardenaz" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Proof layer", href: "#proof" },
      { label: "Agent identity", href: "#proof" },
    ],
  },
] as const;

export function LandingFooter() {
  return (
    <footer className="relative w-full min-h-[75vh] overflow-hidden">
      <video
        src="/bg-footer.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/60" />

      <div className="relative container-page flex items-center justify-end min-h-[75vh] py-16">
        <div className="w-full max-w-lg rounded-[1.75rem] border border-white/[0.10] bg-white/[0.06] px-7 py-9 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
          {/* CTA */
          }
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.p
              variants={staggerItem}
              className="mb-3 text-[10.5px] font-bold tracking-[2.5px] text-[var(--primary)]"
            >
              GET STARTED TODAY
            </motion.p>
            <motion.h2
              variants={staggerItem}
              className="mb-3 text-[28px] font-extrabold -tracking-[1px] text-white leading-[1.15]"
            >
              Run AI agents with{" "}
              <span className="text-[var(--primary)]">confidence in production</span>
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="mb-6 text-[13.5px] leading-relaxed text-white/85"
            >
              Join teams using Gardenaz to ship reliable, auditable, and human-supervised agent workflows at scale.
            </motion.p>
            <motion.div variants={staggerItem} className="flex gap-3">
              <Link href="/app" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-3xl bg-[var(--primary)] px-6 py-2.5 text-[13px] font-bold text-[var(--primary-foreground)] shadow-[var(--primary-shadow-sm)] transition-all duration-300 hover:bg-[var(--primary-hover)] hover:shadow-[var(--primary-shadow-md)]">
                Launch app <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#features"
                className="rounded-3xl border border-white/15 bg-transparent px-6 py-2.5 text-[13px] font-medium text-white/65 transition-all duration-300 hover:border-white/35 hover:text-white"
              >
                View Docs
              </Link>
            </motion.div>
          </motion.div>

          {/* Footer links */
          }
          <div className="mt-10 border-t border-white/[0.08] pt-7">
            <div className="grid grid-cols-3 gap-6">
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[.16em] text-white/55">
                    {group.title}
                  </p>
                  <ul className="space-y-2">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-xs text-white/70 transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col justify-between gap-2 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center">
              <p className="text-[11px] text-white/45">&copy; 2026 Gardenaz · Built on Mantle</p>
              <div className="flex items-center gap-1 text-[11px] text-white/45">
                <Leaf className="size-3 text-[var(--primary)]" />
                <span>AI &times; RWA &middot; Powered by LangGraph</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
