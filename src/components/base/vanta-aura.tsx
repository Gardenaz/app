"use client";

import { motion, useReducedMotion } from "framer-motion";

export function VantaAura() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="vanta-aura">
      <motion.div
        className="vanta-orb vanta-orb-a"
        animate={reduceMotion ? undefined : { x: [0, 28, -10, 0], y: [0, -18, 16, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="vanta-orb vanta-orb-b"
        animate={reduceMotion ? undefined : { x: [0, -24, 12, 0], y: [0, 18, -12, 0], scale: [1, 0.94, 1.1, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="vanta-grid"
        animate={reduceMotion ? undefined : { opacity: [0.28, 0.42, 0.28] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
