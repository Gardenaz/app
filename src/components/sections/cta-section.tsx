"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";

export function CtaSection() {
  return (
    <section id="get-started" className="section-landing relative w-full overflow-hidden bg-[var(--text)] text-center">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[400px] w-[400px] -translate-x-1/2 bg-[radial-gradient(circle,var(--primary-soft-strong)_0%,transparent_70%)]" />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="container-landing-narrow relative"
      >
        <motion.p
          variants={staggerItem}
          className="mb-[10px] text-[10.5px] font-bold tracking-[2.5px] text-[var(--primary)]"
        >
          GET STARTED TODAY
        </motion.p>
        <motion.h2
          variants={staggerItem}
          className="mb-[10px] text-[32px] font-extrabold -tracking-[1px] text-white"
        >
          Run AI agents with
          <br />
          <span className="text-[var(--primary)]">confidence in production</span>
        </motion.h2>
        <motion.p
          variants={staggerItem}
          className="mb-7 text-[13.5px] text-white/55"
        >
          Join teams using Gardenaz to ship reliable, auditable, and
          <br />
          human-supervised agent workflows at scale.
        </motion.p>
        <motion.div
          variants={staggerItem}
          className="flex justify-center gap-3"
        >
          <Link href="/app" className="btn-primary !rounded-3xl">
            Launch app <ArrowRight className="size-4" />
          </Link>
          <Link
            href="#features"
            className="rounded-3xl border border-white/20 bg-transparent px-6 py-2.5 text-[13px] font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            View Docs
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
