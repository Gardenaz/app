"use client";

import { motion } from "framer-motion";
import type { WeatherMood } from "@/components/sections/farm-scene";

interface IslandHudProps {
  weather: WeatherMood;
  stepsComplete: number;
  totalSteps: number;
  amount: string;
  executionStatus: string;
  isConnected: boolean;
}

const weatherHud: Record<WeatherMood, { emoji: string; label: string; hudBg: string }> = {
  sunny:  { emoji: "☀️", label: "Sunny",  hudBg: "linear-gradient(90deg, rgba(245,200,66,0.15) 0%, rgba(245,237,204,0.97) 100%)" },
  cloudy: { emoji: "⛅", label: "Cloudy", hudBg: "linear-gradient(90deg, rgba(176,190,197,0.2) 0%, rgba(240,242,240,0.97) 100%)" },
  rainy:  { emoji: "🌧️", label: "Rainy",  hudBg: "linear-gradient(90deg, rgba(78,120,140,0.15) 0%, rgba(228,236,240,0.97) 100%)" },
  stormy: { emoji: "⛈️", label: "Stormy", hudBg: "linear-gradient(90deg, rgba(30,44,55,0.25) 0%, rgba(210,218,222,0.97) 100%)" },
};

const statusColors: Record<string, string> = {
  READY:     "var(--island-grass)",
  PLANNED:   "var(--island-gold)",
  PENDING:   "var(--island-ocean-mid)",
  SENT:      "var(--quest-complete)",
  CONFIRMED: "var(--quest-complete)",
  BLOCKED:   "var(--danger, #DC2626)",
};

export function IslandHud({ weather, stepsComplete, totalSteps, amount, executionStatus, isConnected }: IslandHudProps) {
  const hw = weatherHud[weather];
  const progress = (stepsComplete / totalSteps) * 100;
  const statusColor = statusColors[executionStatus] ?? "var(--text-muted)";

  return (
    <div
      className="island-hud flex items-center justify-between gap-4 px-5 py-2.5"
      style={{ background: hw.hudBg }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2.5">
        <motion.span
          className="text-2xl"
          animate={{ rotate: [0, 8, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          🌿
        </motion.span>
        <div>
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--island-wood)", fontFamily: "var(--font-island-heading)" }}>
            Gardenaz
          </p>
          <p className="text-[9px]" style={{ color: "var(--island-earth-dark)", fontFamily: "var(--font-island-body)" }}>
            {isConnected ? "🔗 Wallet connected" : "Connect to farm"}
          </p>
        </div>
      </div>

      {/* Center: Weather + XP */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 rounded-full border px-3 py-1"
          style={{ borderColor: "var(--island-parchment-dark)", background: "rgba(255,255,255,0.5)" }}>
          <span className="text-base">{hw.emoji}</span>
          <span className="text-xs font-black" style={{ color: "var(--island-sign-bg)", fontFamily: "var(--font-island-heading)" }}>
            {hw.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black" style={{ color: "var(--island-earth-dark)", fontFamily: "var(--font-island-heading)" }}>
            Quest
          </span>
          <div className="relative h-3 w-28 overflow-hidden rounded-full"
            style={{ background: "rgba(0,0,0,0.1)", border: "1px solid var(--island-parchment-dark)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--island-grass) 0%, var(--island-gold) 100%)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs font-black" style={{ color: "var(--island-grass-dark)", fontFamily: "var(--font-island-heading)" }}>
            {stepsComplete}/{totalSteps}
          </span>
        </div>
      </div>

      {/* Right: Coins + Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-full border px-3 py-1"
          style={{ borderColor: "rgba(245,200,66,0.5)", background: "rgba(245,200,66,0.12)" }}>
          <motion.span
            className="text-base"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            🪙
          </motion.span>
          <span className="text-xs font-black" style={{ color: "var(--island-gold-dark)", fontFamily: "var(--font-island-heading)" }}>
            {Number(amount || 0).toFixed(0)} gUSD
          </span>
        </div>

        <div
          className="rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest"
          style={{
            background: `${statusColor}22`,
            border: `1px solid ${statusColor}66`,
            color: statusColor,
            fontFamily: "var(--font-island-heading)",
          }}
        >
          {executionStatus}
        </div>
      </div>
    </div>
  );
}
