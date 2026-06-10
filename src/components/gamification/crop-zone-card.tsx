"use client";

import { motion } from "framer-motion";
import type { PotSlot } from "@/components/sections/farm-scene";

interface CropZoneCardProps {
  slot: PotSlot;
  isActive: boolean;
  onSelect: () => void;
}

const stateLabel: Record<PotSlot["state"], string> = {
  empty:   "Empty field",
  planted: "Just planted",
  growing: "Growing...",
  ready:   "Ready to harvest! ✨",
  locked:  "Locked",
};

const stateColor: Record<PotSlot["state"], string> = {
  empty:   "var(--neutral-400)",
  planted: "var(--island-ocean-mid)",
  growing: "var(--island-grass)",
  ready:   "var(--quest-complete)",
  locked:  "var(--neutral-500)",
};

const cropEmoji: Record<string, string> = {
  Rice:  "🌾",
  Corn:  "🌽",
  Chili: "🌶️",
};

const growthPercent: Record<PotSlot["state"], number> = {
  empty:   0,
  planted: 20,
  growing: 60,
  ready:   100,
  locked:  0,
};

export function CropZoneCard({ slot, isActive, onSelect }: CropZoneCardProps) {
  const isEmpty = slot.state === "empty";
  const color = stateColor[slot.state];
  const pct = growthPercent[slot.state];
  const emoji = slot.crop ? cropEmoji[slot.crop] ?? "🌱" : null;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="quest-card relative w-full overflow-hidden p-3 text-left"
      style={{
        border: isActive ? `2px solid ${color}` : "1.5px solid var(--island-parchment-dark)",
        boxShadow: isActive ? `0 0 0 3px ${color}33, 0 4px 16px rgba(0,0,0,0.1)` : "0 2px 8px rgba(0,0,0,0.06)",
      }}
      animate={{ y: isActive ? -2 : 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ background: isEmpty ? "rgba(0,0,0,0.06)" : `${color}22`, border: `1.5px solid ${color}55` }}
        >
          {emoji ?? "🪴"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black" style={{ color: "var(--island-sign-bg)", fontFamily: "var(--font-island-heading)" }}>
            {isEmpty ? "Empty Slot" : slot.crop}
          </p>
          <p className="text-[10px]" style={{ color: "var(--island-earth-dark)", fontFamily: "var(--font-island-body)" }}>
            {stateLabel[slot.state]}
          </p>
        </div>
        {!isEmpty && (
          <div className="text-right">
            <p className="text-xs font-black" style={{ color: "var(--island-grass-dark)", fontFamily: "var(--font-island-heading)" }}>
              {slot.apy.toFixed(1)}%
            </p>
            <p className="text-[9px]" style={{ color: "var(--island-earth-dark)" }}>APY</p>
          </div>
        )}
      </div>

      {/* Growth bar */}
      {!isEmpty && (
        <div className="mt-2.5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--island-earth)" }}>
              Growth
            </span>
            <span className="text-[9px] font-black" style={{ color }}>{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full" style={{ background: "rgba(0,0,0,0.1)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, var(--island-grass), ${color})` }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </motion.button>
  );
}
