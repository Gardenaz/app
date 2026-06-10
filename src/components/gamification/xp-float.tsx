"use client";

import { motion, AnimatePresence } from "framer-motion";

interface XpFloatProps {
  visible: boolean;
  label?: string;
  x?: number;
  y?: number;
}

export function XpFloat({ visible, label = "+XP", x = 50, y = 50 }: XpFloatProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute z-50 select-none rounded-full px-3 py-1 text-sm font-black"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%, -50%)",
            background: "var(--island-gold)",
            color: "var(--island-sign-bg)",
            fontFamily: "var(--font-island-heading)",
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            boxShadow: "0 4px 12px rgba(245,200,66,0.5)",
          }}
          initial={{ y: 0, opacity: 1, scale: 0.8 }}
          animate={{ y: -60, opacity: 0, scale: 1.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
