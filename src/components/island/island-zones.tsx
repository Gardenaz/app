"use client";

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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      className="absolute inset-x-2 bottom-2 z-50 overflow-hidden rounded-2xl border-2 shadow-2xl"
      style={{
        borderColor: "var(--island-parchment-dark)",
        background: "linear-gradient(160deg, #FAF0D7 0%, var(--island-parchment) 100%)",
        fontFamily: "var(--font-island-body)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-[var(--island-parchment-dark)] px-4 py-2.5">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--island-wood)" }}>
            Choose Seed
          </p>
          <p className="text-sm font-black" style={{ color: "var(--island-sign-bg)", fontFamily: "var(--font-island-heading)" }}>
            What grows here?
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-7 items-center justify-center rounded-full transition hover:bg-black/10"
          style={{ color: "var(--island-wood)" }}
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3">
        {CROP_OPTIONS.map((opt) => {
          const isRec = opt.recommended(weather);
          return (
            <motion.button
              key={opt.id}
              type="button"
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onPick(zoneId, opt.id)}
              className="relative flex flex-col items-center gap-1 rounded-xl p-3 text-center transition"
              style={{
                border: `2px solid ${isRec ? "var(--island-grass)" : "var(--island-parchment-dark)"}`,
                background: isRec ? "rgba(124,197,72,0.15)" : "rgba(255,255,255,0.6)",
                boxShadow: isRec ? "0 0 0 3px rgba(124,197,72,0.2)" : "none",
              }}
            >
              {isRec && (
                <span
                  className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-1.5 py-px text-[8px] font-black text-white"
                  style={{ background: "var(--island-grass-dark)" }}
                >
                  ✓ Best now
                </span>
              )}
              <span className="text-2xl leading-none">{opt.emoji}</span>
              <p className="text-xs font-black" style={{ color: "var(--island-sign-bg)", fontFamily: "var(--font-island-heading)" }}>
                {opt.crop}
              </p>
              <p className="text-[10px] font-bold" style={{ color: "var(--island-grass-dark)" }}>{opt.apy}</p>
            </motion.button>
          );
        })}
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

        /* Zone layout positions — in the front yard below the farmhouse (~50% x, ~57% y).
           Rice left-of-house, Corn directly in front, Chili right-of-house. */
        const positions = [
          { left: "18%", top: "60%", w: 128, h: 96 },   /* Rice  — left wing  */
          { left: "40%", top: "60%", w: 132, h: 100 },  /* Corn  — front yard */
          { left: "62%", top: "60%", w: 122, h: 96 },   /* Chili — right wing */
        ];
        const pos = positions[zi];

        return (
          <motion.div
            key={zone.id}
            className="pointer-events-auto absolute flex flex-col items-center justify-center gap-1 rounded-2xl"
            style={{
              left: pos.left,
              top: pos.top,
              width: pos.w,
              height: pos.h,
              background: slot.state === "empty"
                ? `linear-gradient(180deg, ${zone.soilColor}99 0%, ${zone.soilColor} 100%)`
                : `linear-gradient(160deg, ${zone.color}33 0%, ${zone.color}55 100%)`,
              border: `2px solid ${isSelected ? zone.color : zone.borderColor}`,
              boxShadow: isSelected ? `0 0 0 4px ${zone.colorSoft}, 0 8px 24px rgba(0,0,0,0.18)` : "0 4px 16px rgba(0,0,0,0.14)",
              cursor: slot.state === "locked" ? "not-allowed" : "pointer",
            }}
            animate={{
              y: isSelected ? -8 : 0,
              scale: isSelected ? 1.04 : 1,
            }}
            whileHover={slot.state !== "locked" ? { y: -4, scale: 1.02 } : {}}
            whileTap={slot.state !== "locked" ? { scale: 0.97 } : {}}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            onClick={() => slot.state !== "locked" && onSlotClick(slot)}
          >
            {/* Zone label tag */}
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
              style={{
                background: zone.colorDark,
                color: "white",
                fontFamily: "var(--font-island-heading)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {zone.label}
            </div>

            {/* Crop rows (soil rows visual) */}
            <div className="absolute bottom-2 flex w-full flex-col gap-0.5 px-3 opacity-40">
              {[0, 1, 2].map((r) => (
                <div
                  key={r}
                  className="rounded-full"
                  style={{
                    height: 3,
                    background: `linear-gradient(90deg, transparent, ${zone.soilColor}, transparent)`,
                    opacity: 0.6 - r * 0.1,
                  }}
                />
              ))}
            </div>

            {/* Growth visual */}
            <GrowthVisual state={slot.state} emoji={zone.emoji} color={zone.color} />

            {/* APY chip when planted */}
            {slot.state !== "empty" && slot.state !== "locked" && (
              <motion.div
                className="rounded-full px-2 py-0.5 text-[10px] font-black"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: zone.color,
                  color: "var(--island-sign-bg)",
                  fontFamily: "var(--font-island-heading)",
                }}
              >
                {zone.description}
              </motion.div>
            )}

            {/* Ready to harvest label */}
            <AnimatePresence>
              {slot.state === "ready" && (
                <motion.div
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-black"
                  style={{
                    background: "var(--quest-complete)",
                    color: "white",
                    fontFamily: "var(--font-island-heading)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ✨ Ready to harvest!
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
