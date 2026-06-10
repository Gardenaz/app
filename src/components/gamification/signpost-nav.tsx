"use client";

import { motion } from "framer-motion";

interface SignpostNavProps {
  view: "canvas" | "audit";
  onViewChange: (view: "canvas" | "audit") => void;
}

export function SignpostNav({ view, onViewChange }: SignpostNavProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-3" style={{ fontFamily: "var(--font-island-heading)" }}>
      {/* Vertical post */}
      <div className="relative flex items-center">
        {/* Post */}
        <div
          className="absolute left-1/2 h-14 w-3 -translate-x-1/2 rounded-full"
          style={{
            background: "linear-gradient(180deg, var(--island-wood-light) 0%, var(--island-wood) 100%)",
            boxShadow: "2px 0 4px rgba(0,0,0,0.2)",
          }}
        />

        {/* Left sign — Garden */}
        <motion.button
          type="button"
          onClick={() => onViewChange("canvas")}
          className="relative z-10 mr-1 flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-black shadow-lg"
          style={{
            background: view === "canvas"
              ? "linear-gradient(180deg, var(--island-wood-light) 0%, var(--island-wood) 100%)"
              : "linear-gradient(180deg, var(--island-parchment) 0%, var(--island-parchment-dark) 100%)",
            border: `2px solid ${view === "canvas" ? "var(--island-earth-dark)" : "var(--island-parchment-dark)"}`,
            color: view === "canvas" ? "var(--island-sign-text)" : "var(--island-sign-bg)",
            fontSize: "0.75rem",
            boxShadow: view === "canvas"
              ? "0 4px 12px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.15)"
              : "0 2px 8px rgba(0,0,0,0.12)",
            /* Arrow shape pointing right */
            clipPath: "polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%)",
            paddingRight: "1.5rem",
          }}
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <span>🌾</span>
          Garden
        </motion.button>

        {/* Right sign — Proof */}
        <motion.button
          type="button"
          onClick={() => onViewChange("audit")}
          className="relative z-10 ml-1 flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-black shadow-lg"
          style={{
            background: view === "audit"
              ? "linear-gradient(180deg, var(--island-wood-light) 0%, var(--island-wood) 100%)"
              : "linear-gradient(180deg, var(--island-parchment) 0%, var(--island-parchment-dark) 100%)",
            border: `2px solid ${view === "audit" ? "var(--island-earth-dark)" : "var(--island-parchment-dark)"}`,
            color: view === "audit" ? "var(--island-sign-text)" : "var(--island-sign-bg)",
            fontSize: "0.75rem",
            boxShadow: view === "audit"
              ? "0 4px 12px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.15)"
              : "0 2px 8px rgba(0,0,0,0.12)",
            /* Arrow shape pointing left */
            clipPath: "polygon(12% 0%, 100% 0%, 100% 100%, 12% 100%, 0% 50%)",
            paddingLeft: "1.5rem",
          }}
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <span>📜</span>
          Proof
        </motion.button>
      </div>
    </div>
  );
}
