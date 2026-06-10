"use client";

import { motion, AnimatePresence } from "framer-motion";

interface HarvestBurstProps {
  active: boolean;
  emoji?: string;
}

const BURST_COLORS = ["#F5C842", "#7CC548", "#FF9F1C", "#FFD166", "#4BB8E8", "#FF9EBC"];

export function HarvestBurst({ active, emoji = "✨" }: HarvestBurstProps) {
  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* Radial burst particles */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360;
            const dist = 40 + Math.random() * 30;
            const dx = Math.cos((angle * Math.PI) / 180) * dist;
            const dy = Math.sin((angle * Math.PI) / 180) * dist;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 8 + (i % 3) * 4,
                  height: 8 + (i % 3) * 4,
                  background: BURST_COLORS[i % BURST_COLORS.length],
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{ x: dx, y: dy, scale: [0, 1.4, 0.6], opacity: [1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: i * 0.03, ease: "easeOut" }}
              />
            );
          })}

          {/* Center emoji pop */}
          <motion.div
            className="absolute text-4xl"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1.6, 1.2], opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "backOut" }}
          >
            {emoji}
          </motion.div>

          {/* XP label */}
          <motion.div
            className="absolute -top-8 rounded-full px-3 py-1 text-sm font-black"
            style={{ background: "var(--island-gold)", color: "var(--island-sign-bg)", fontFamily: "var(--font-island-heading)" }}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -40, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            +XP
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
