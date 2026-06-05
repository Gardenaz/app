"use client";

import { motion } from "framer-motion";

export function ManifestoSection() {
  return (
    <section className="landing-section landing-section--narrow relative w-full">
      {/* Decorative accent line — anime-style brush hint */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[2px] w-16 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="landing-inner text-center"
      >
        <p className="mb-6 text-[11px] font-black uppercase tracking-[.22em] text-[var(--text-subtle)]">
          Manifesto
        </p>
        <p className="font-display text-fluid-hero text-balance text-[var(--text)]">
          AI should not become another black box.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg sm:leading-8">
          Gardenaz turns autonomous finance into something people can still follow: the agent explains the move, policy decides the boundary, and Mantle keeps the record.
        </p>

        {/* Anime-style decorative dots */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="inline-block size-[6px] rounded-full bg-[var(--primary-border)]" />
          <span className="inline-block size-[10px] rounded-full bg-[var(--primary)]/30" />
          <span className="inline-block size-[6px] rounded-full bg-[var(--primary-border)]" />
        </div>
      </motion.div>
    </section>
  );
}
