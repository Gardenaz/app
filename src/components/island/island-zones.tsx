"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import type { PotSlot, WeatherMood } from "@/components/sections/farm-scene";
import { CROP_OPTIONS } from "@/components/sections/farm-scene";

/* ── Zone config ─────────────────────────────────────── */
interface ZoneConfig {
  id: "steady" | "growth" | "boost";
  label: string;
  emoji: string;
  color: string;
  colorDark: string;
  colorSoft: string;
  borderColor: string;
  soilColor: string;
  description: string;
}

const ZONES: ZoneConfig[] = [
  {
    id: "steady",
    label: "Rice Paddy",
    emoji: "🌾",
    color: "#A8D5A2",
    colorDark: "#5CA032",
    colorSoft: "rgba(168,213,162,0.18)",
    borderColor: "rgba(168,213,162,0.6)",
    soilColor: "#6B8E6F",
    description: "4–6% APY · USDC",
  },
  {
    id: "growth",
    label: "Corn Farm",
    emoji: "🌽",
    color: "#F5C542",
    colorDark: "#C49B14",
    colorSoft: "rgba(245,197,66,0.18)",
    borderColor: "rgba(245,197,66,0.6)",
    soilColor: "#8B7355",
    description: "7–11% APY · WMNT",
  },
  {
    id: "boost",
    label: "Chili Garden",
    emoji: "🌶️",
    color: "#E85D3A",
    colorDark: "#B03820",
    colorSoft: "rgba(232,93,58,0.18)",
    borderColor: "rgba(232,93,58,0.6)",
    soilColor: "#7A5040",
    description: "12–20% APY · LP",
  },
];

/* ── Growth stage visual ────────────────────────────── */
function GrowthVisual({ state, emoji, color }: {
  state: PotSlot["state"];
  emoji: string;
  color: string;
}) {
  if (state === "empty") {
    return (
      <motion.div
        className="flex items-center justify-center"
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Plus className="size-8 text-white/60" />
      </motion.div>
    );
  }
  if (state === "planted") {
    return (
      <motion.div
        className="text-3xl"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        🌱
      </motion.div>
    );
  }
  if (state === "growing") {
    return (
      <motion.div
        className="text-3xl"
        animate={{ rotate: [-2, 2, -2], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {emoji}
      </motion.div>
    );
  }
  if (state === "ready") {
    return (
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute rounded-full"
          style={{ width: 64, height: 64, background: `${color}40` }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="relative text-4xl"
          animate={{ y: [0, -5, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {emoji}
        </motion.div>
      </div>
    );
  }
  return <span className="text-3xl opacity-40">🔒</span>;
}

/* ── Crop picker overlay ────────────────────────────── */
function ZoneCropPicker({
  zoneId,
  weather,
  onPick,
  onClose,
}: {
  zoneId: string;
  weather: WeatherMood;
  onPick: (slotId: string, cropId: typeof CROP_OPTIONS[number]["id"]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = React.useState<typeof CROP_OPTIONS[number]["id"] | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="absolute inset-x-0 bottom-0 z-50 overflow-hidden rounded-2xl shadow-2xl"
      style={{ background: "#FFFFFF" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-2 pt-3">
        <p className="text-[12px] font-black text-gray-800">Choose a crop to plant</p>
        <button
          type="button"
          onClick={onClose}
          className="flex size-7 items-center justify-center rounded-full"
          style={{ background: "#F0F0F0" }}
          aria-label="Close crop picker"
        >
          <X className="size-3.5 text-gray-500" />
        </button>
      </div>

      {/* 2×2 crop card grid */}
      <div className="grid grid-cols-2 gap-2 px-3 pb-2">
        {CROP_OPTIONS.map((opt) => {
          const isRec = opt.recommended(weather);
          const isSel = selected === opt.id;

          /* Colour per crop */
          const sceneBg = opt.id === "stable"
            ? "linear-gradient(160deg,#DCEDC8 0%,#A5D6A7 100%)"
            : opt.id === "growth"
            ? "linear-gradient(160deg,#FFF9C4 0%,#FFE082 100%)"
            : opt.id === "yield"
            ? "linear-gradient(160deg,#FFCCBC 0%,#FF8A65 100%)"
            : "linear-gradient(160deg,#B3E5FC 0%,#4FC3F7 100%)";

          return (
            <motion.button
              key={opt.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(isSel ? null : opt.id)}
              className="relative flex flex-col overflow-hidden rounded-xl text-left"
              style={{
                border: `2.5px solid ${isSel ? "#FF7A2F" : isRec ? "#4CAF50" : "#E8E8E8"}`,
                background: "#FAFAFA",
                boxShadow: isSel ? "0 0 0 3px rgba(255,122,47,0.2)" : "none",
              }}
            >
              {/* Scene illustration strip */}
              <div
                className="flex items-center justify-center py-4 text-3xl"
                style={{ background: sceneBg }}
              >
                {opt.emoji}
                {isRec && (
                  <span
                    className="absolute right-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[8px] font-black text-white"
                    style={{ background: "#2E7D32" }}
                  >
                    Best
                  </span>
                )}
              </div>

              {/* Info row */}
              <div className="px-2.5 pb-2 pt-1.5">
                <p className="text-[11px] font-black text-gray-800">{opt.crop}</p>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-gray-400">{opt.asset}</span>
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[8px] font-black text-white"
                    style={{ background: "rgba(30,30,30,0.80)" }}
                  >
                    {opt.apy}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Plant Now CTA */}
      <div className="px-3 pb-3">
        <motion.button
          type="button"
          disabled={!selected}
          whileTap={selected ? { scale: 0.97 } : {}}
          onClick={() => selected && onPick(zoneId, selected)}
          className="w-full rounded-xl py-3.5 text-[13px] font-black text-white shadow-md transition-opacity"
          style={{
            background: selected
              ? "linear-gradient(135deg, #FF7A2F 0%, #FF9A4F 100%)"
              : "#D1D5DB",
            opacity: selected ? 1 : 0.7,
          }}
        >
          🌱 Plant Now
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── FarmZones — main export ────────────────────────── */
export interface FarmZonesProps {
  slots: PotSlot[];
  weather: WeatherMood;
  selectedSlotId?: string | null;
  onSlotClick: (slot: PotSlot) => void;
  onCropPick: (slotId: string, cropId: typeof CROP_OPTIONS[number]["id"]) => void;
}

export function FarmZones({ slots, weather, selectedSlotId, onSlotClick, onCropPick }: FarmZonesProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {ZONES.map((zone, zi) => {
        const slot = slots[zi] ?? slots[0];
        const isSelected = selectedSlotId === slot.id;
        const isEmpty = slot.state === "empty";

        /* Zone layout positions — front yard below farmhouse (~50% x, ~57% y).
           Widths expressed as % of container so they don't overlap at any viewport. */
        const positions = [
          { left: "4%",  top: "60%", w: "28%", h: 96  },  /* Rice  — left  */
          { left: "36%", top: "60%", w: "28%", h: 100 },  /* Corn  — front */
          { left: "68%", top: "60%", w: "28%", h: 96  },  /* Chili — right */
        ];
        const pos = positions[zi];

        return (
          <motion.div
            key={zone.id}
            className="pointer-events-auto absolute flex flex-col items-center justify-between overflow-hidden rounded-2xl"
            style={{
              left: pos.left,
              top: pos.top,
              width: pos.w,
              height: pos.h,
              background: "rgba(255,255,255,0.94)",
              border: `2px solid ${isSelected ? zone.color : "rgba(255,255,255,0.7)"}`,
              boxShadow: isSelected
                ? `0 0 0 3px ${zone.colorSoft}, 0 8px 28px rgba(0,0,0,0.18)`
                : "0 4px 20px rgba(0,0,0,0.13)",
              cursor: slot.state === "locked" ? "not-allowed" : "pointer",
              backdropFilter: "blur(8px)",
            }}
            animate={{ y: isSelected ? -6 : 0, scale: isSelected ? 1.04 : 1 }}
            whileHover={slot.state !== "locked" ? { y: -3, scale: 1.02 } : {}}
            whileTap={slot.state !== "locked" ? { scale: 0.97 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={() => slot.state !== "locked" && onSlotClick(slot)}
          >
            {/* Top: APY badge + label */}
            <div className="flex w-full items-center justify-between px-2.5 pt-2">
              <span
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: zone.colorDark }}
              >
                {zone.label}
              </span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[8px] font-black text-white"
                style={{ background: zone.colorDark }}
              >
                {zone.description.split("·")[0].trim()}
              </span>
            </div>

            {/* Center: growth visual */}
            <div className="flex flex-1 items-center justify-center">
              <GrowthVisual state={slot.state} emoji={zone.emoji} color={zone.color} />
            </div>

            {/* Bottom: asset label */}
            <div
              className="w-full rounded-b-xl px-2.5 py-1.5 text-center text-[9px] font-black"
              style={{ background: `${zone.color}22`, color: zone.colorDark }}
            >
              {slot.state === "locked"
                ? "🔒 Locked"
                : slot.state === "empty"
                ? "Tap to plant"
                : zone.description.split("·").slice(1).join("·").trim()}
            </div>

            {/* Ready to harvest label */}
            <AnimatePresence>
              {slot.state === "ready" && (
                <motion.div
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-black text-white"
                  style={{ background: "#22C55E", boxShadow: "0 2px 10px rgba(34,197,94,0.4)" }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ✨ Harvest!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Crop picker overlay on empty + selected */}
            <AnimatePresence>
              {isSelected && isEmpty && (
                <ZoneCropPicker
                  key={slot.id}
                  zoneId={slot.id}
                  weather={weather}
                  onPick={onCropPick}
                  onClose={() => onSlotClick(slot)}
                />
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
