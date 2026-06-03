"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Lock, Sprout, X } from "lucide-react";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";

/* ─────────────────────────────────────────────────────────────────
   Types & constants
───────────────────────────────────────────────────────────────── */
export type WeatherMood = "sunny" | "cloudy" | "rainy" | "stormy";

export type PotSlot = {
  id: string;
  strategyId: "steady" | "growth" | "boost" | "";
  crop: string;
  asset: string;
  apy: number;
  health: number;
  state: "empty" | "planted" | "growing" | "ready" | "locked";
  x: number; // percentage 0–100
};

/** The three crop options a user can pick */
export const CROP_OPTIONS = [
  {
    id: "steady" as const,
    crop: "Rice",
    asset: "USDY",
    emoji: "🌾",
    apy: "4–6%",
    risk: "Low",
    riskColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    desc: "Stabil, RWA-backed. Cocok untuk pemula atau bear market.",
    recommended: (weather: WeatherMood) => weather === "rainy" || weather === "stormy",
  },
  {
    id: "growth" as const,
    crop: "Corn",
    asset: "mETH",
    emoji: "🌽",
    apy: "7–11%",
    risk: "Medium",
    riskColor: "text-amber-700 bg-amber-50 border-amber-200",
    desc: "Liquid staking yield. Bagus saat market cloudy atau bullish.",
    recommended: (weather: WeatherMood) => weather === "cloudy",
  },
  {
    id: "boost" as const,
    crop: "Chili",
    asset: "USDY/mETH",
    emoji: "🌶️",
    apy: "12–20%",
    risk: "High",
    riskColor: "text-red-700 bg-red-50 border-red-200",
    desc: "Dynamic rebalance, return tinggi. Ideal saat bull market.",
    recommended: (weather: WeatherMood) => weather === "sunny",
  },
] as const;

/** All 5 pots start empty */
export const INITIAL_SLOTS: PotSlot[] = [
  { id: "slot-1", strategyId: "", crop: "", asset: "", apy: 0, health: 0, state: "empty", x: 12 },
  { id: "slot-2", strategyId: "", crop: "", asset: "", apy: 0, health: 0, state: "empty", x: 30 },
  { id: "slot-3", strategyId: "", crop: "", asset: "", apy: 0, health: 0, state: "empty", x: 50 },
  { id: "slot-4", strategyId: "", crop: "", asset: "", apy: 0, health: 0, state: "empty", x: 70 },
  { id: "slot-5", strategyId: "", crop: "", asset: "", apy: 0, health: 0, state: "empty", x: 88 },
];

/* ─────────────────────────────────────────────────────────────────
   Weather themes
───────────────────────────────────────────────────────────────── */
const weatherTheme: Record<WeatherMood, {
  sky: string; ground: string; filter: string;
  label: string; marketLabel: string; emoji: string;
  cloudOpacity: number; cloudColor: string;
  sunVisible: boolean; rainVisible: boolean;
  tip: string;
}> = {
  sunny: {
    sky: "linear-gradient(180deg,#7dd3fc 0%,#bae6fd 45%,#d1fae5 80%,#a7f3d0 100%)",
    ground: "linear-gradient(180deg,#86efac 0%,#4ade80 40%,#16a34a 100%)",
    filter: "",
    label: "Cerah", marketLabel: "🐂 Bull Market", emoji: "☀️",
    cloudOpacity: 0.15, cloudColor: "#fff",
    sunVisible: true, rainVisible: false,
    tip: "Pasar bullish — semua crop bisa tumbuh! Chili paling optimal.",
  },
  cloudy: {
    sky: "linear-gradient(180deg,#94a3b8 0%,#cbd5e1 45%,#e2e8f0 80%,#d4ede0 100%)",
    ground: "linear-gradient(180deg,#86efac 0%,#4ade80 40%,#22c55e 100%)",
    filter: "brightness-95",
    label: "Berawan", marketLabel: "😐 Neutral", emoji: "⛅",
    cloudOpacity: 0.75, cloudColor: "#e2e8f0",
    sunVisible: true, rainVisible: false,
    tip: "Pasar sideways — tanam Corn atau Rice yang aman.",
  },
  rainy: {
    sky: "linear-gradient(180deg,#475569 0%,#64748b 45%,#94a3b8 80%,#b8d4c8 100%)",
    ground: "linear-gradient(180deg,#6ee7b7 0%,#34d399 40%,#059669 100%)",
    filter: "brightness-85 saturate-75",
    label: "Hujan", marketLabel: "🐻 Bear Market", emoji: "🌧️",
    cloudOpacity: 0.92, cloudColor: "#94a3b8",
    sunVisible: false, rainVisible: true,
    tip: "Bear market — Rice paling aman. Jangan FOMO ke Chili.",
  },
  stormy: {
    sky: "linear-gradient(180deg,#1e293b 0%,#334155 45%,#475569 80%,#7f9e8f 100%)",
    ground: "linear-gradient(180deg,#4ade80 0%,#16a34a 40%,#15803d 100%)",
    filter: "brightness-75 saturate-50",
    label: "Badai", marketLabel: "🔴 Crash", emoji: "⛈️",
    cloudOpacity: 1, cloudColor: "#334155",
    sunVisible: false, rainVisible: true,
    tip: "Crash! Tahan posisi, agent aktif lindungi pot kamu.",
  },
};

/* ─────────────────────────────────────────────────────────────────
   Sky elements
───────────────────────────────────────────────────────────────── */
function Cloud({ x, y, scale, delay, color, opacity }: {
  x: number; y: number; scale: number; delay: number; color: string; opacity: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: `${x}%`, top: `${y}%`, opacity }}
      animate={{ x: [0, 22, 0] }}
      transition={{ duration: 22 + delay * 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg width={100 * scale} height={50 * scale} viewBox="0 0 120 60" fill={color}
        style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.06))" }}>
        <ellipse cx="60" cy="40" rx="55" ry="20" />
        <ellipse cx="45" cy="32" rx="28" ry="22" />
        <ellipse cx="72" cy="28" rx="22" ry="18" />
        <ellipse cx="58" cy="25" rx="20" ry="17" />
      </svg>
    </motion.div>
  );
}

function RainLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div key={i}
          className="absolute w-px rounded-full bg-sky-300/50"
          style={{ left: `${(i * 3.5) % 100}%`, height: `${10 + (i % 5) * 5}px`, top: "-8%" }}
          animate={{ y: ["0%", "110vh"] }}
          transition={{ duration: 0.65 + (i % 5) * 0.12, repeat: Infinity, delay: (i * 0.06) % 1.1, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function Sun({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <motion.div className="pointer-events-none absolute right-10 top-5"
      animate={{ y: [0, -5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
      <div className="relative flex size-14 items-center justify-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute w-1 rounded-full bg-amber-300/70"
            style={{ height: 12, top: "50%", left: "50%", transformOrigin: "50% 210%",
              transform: `translate(-50%,-210%) rotate(${i * 45}deg)` }} />
        ))}
        <div className="relative z-10 size-9 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-[0_0_22px_7px_rgba(251,191,36,0.38)]" />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Crop picker overlay (appears when user clicks an empty pot)
───────────────────────────────────────────────────────────────── */
function CropPicker({
  slotId,
  weather,
  onPick,
  onClose,
}: {
  slotId: string;
  weather: WeatherMood;
  onPick: (slotId: string, cropId: typeof CROP_OPTIONS[number]["id"]) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 8 }}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      className="absolute inset-x-3 bottom-4 z-40 rounded-2xl border border-white/70 bg-white/96 p-3 shadow-[0_12px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:inset-x-6"
      onClick={(e) => e.stopPropagation()}
    >
      {/* header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pilih tanaman</p>
          <p className="text-sm font-black text-gray-800">Mau tanam apa di pot ini?</p>
        </div>
        <button type="button" onClick={onClose}
          className="flex size-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Tutup">
          <X className="size-4" />
        </button>
      </div>

      {/* crop options */}
      <div className="grid grid-cols-3 gap-2">
        {CROP_OPTIONS.map((opt) => {
          const isRec = opt.recommended(weather);
          return (
            <motion.button
              key={opt.id}
              type="button"
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onPick(slotId, opt.id)}
              className={`relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition ${
                isRec
                  ? "border-teal-300 bg-teal-50/80 shadow-[0_0_0_3px_rgba(20,184,166,0.15)]"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              {isRec && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-teal-500 px-1.5 py-px text-[8px] font-black text-white">
                  Rekomendasi
                </span>
              )}
              <span className="text-2xl leading-none">{opt.emoji}</span>
              <p className="text-xs font-black text-gray-800">{opt.crop}</p>
              <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-black ${opt.riskColor}`}>
                {opt.risk}
              </span>
              <p className="text-[10px] font-black text-teal-700">{opt.apy}</p>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-2.5 text-center text-[10px] leading-4 text-gray-400">
        💬 Atau tanya <strong className="text-emerald-600">Pak Tani</strong> di pojok kanan untuk rekomendasi sesuai pasar
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Single pot button
───────────────────────────────────────────────────────────────── */
const stateColor: Record<PotSlot["state"], string> = {
  empty:   "#e5e7eb",
  planted: "#86efac",
  growing: "#4ade80",
  ready:   "#16a34a",
  locked:  "#6b7280",
};

function GardenPot({
  slot,
  isSelected,
  onClick,
}: {
  slot: PotSlot;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isEmpty  = slot.state === "empty";
  const isLocked = slot.state === "locked";
  const color    = stateColor[slot.state];

  return (
    <motion.button
      type="button"
      aria-label={isEmpty ? `Pot kosong ${slot.id} — klik untuk tanam` : `${slot.crop} — ${slot.state}`}
      onClick={onClick}
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: isSelected ? -14 : 0, opacity: 1 }}
      whileHover={{ y: isSelected ? -16 : -5, scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="relative flex select-none flex-col items-center gap-1"
      style={{ position: "absolute", left: `${slot.x}%`, bottom: "17%", transform: "translateX(-50%)" }}
    >
      {/* selection ring */}
      <AnimatePresence>
        {isSelected && (
          <motion.div layoutId="pot-ring"
            className="absolute -inset-2 rounded-[2rem] border-2 border-teal-400 bg-teal-50/20"
            initial={false} transition={{ type: "spring", stiffness: 300 }} />
        )}
      </AnimatePresence>

      {/* APY tooltip when selected + filled */}
      <AnimatePresence>
        {isSelected && !isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/80 bg-white/90 px-2.5 py-1 text-[10px] font-black text-emerald-800 shadow-md backdrop-blur-sm"
          >
            {slot.apy.toFixed(1)}% APY · {slot.asset}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pot body */}
      <div
        className="relative flex items-center justify-center rounded-[1.4rem] border-2 shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
        style={{
          width: 68, height: 68,
          background: isEmpty
            ? "linear-gradient(160deg,#f3f4f6,#e5e7eb)"
            : `radial-gradient(circle at 35% 35%,${color}cc,${color})`,
          borderColor: isSelected ? "#2dd4bf" : isEmpty ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.72)",
        }}
      >
        {isLocked ? (
          <Lock className="size-7 text-white/70" />
        ) : isEmpty ? (
          /* "+" with gentle pulse on empty */
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Plus className="size-7 text-gray-400" />
          </motion.div>
        ) : (
          <span className="text-[2rem] leading-none">
            {slot.crop === "Rice" ? "🌾" : slot.crop === "Corn" ? "🌽" : slot.crop === "Chili" ? "🌶️" : "🌱"}
          </span>
        )}

        {/* Ready glow */}
        {slot.state === "ready" && (
          <motion.div className="absolute inset-0 rounded-[1.3rem]"
            animate={{ boxShadow: ["0 0 0 0 rgba(22,163,74,0)","0 0 18px 7px rgba(22,163,74,0.4)","0 0 0 0 rgba(22,163,74,0)"] }}
            transition={{ duration: 2, repeat: Infinity }} />
        )}
      </div>

      {/* Pot base */}
      <div className="rounded-b-xl border border-white/40 shadow-inner"
        style={{ width: 52, height: 13, background: "linear-gradient(180deg,#92400e,#78350f)" }} />

      {/* Label chip */}
      <div className="rounded-lg border border-white/70 bg-white/88 px-2 py-0.5 shadow-sm backdrop-blur-sm">
        {isEmpty ? (
          <p className="text-[9px] font-black text-gray-400 leading-tight">Kosong</p>
        ) : (
          <>
            <p className="text-[10px] font-black text-gray-800 leading-tight">{slot.crop}</p>
            <p className="text-[9px] font-bold leading-tight text-emerald-600">
              {slot.state === "ready" ? "Panen! 🌾" : slot.state === "growing" ? "Tumbuh 🌱" : "Baru tanam"}
            </p>
          </>
        )}
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FarmScene — main export
───────────────────────────────────────────────────────────────── */
export interface FarmSceneProps {
  weather?: WeatherMood;
  slots: PotSlot[];
  agentData?: GardenAgentResult | null;
  onSlotClick: (slot: PotSlot) => void;
  onCropPick: (slotId: string, cropId: typeof CROP_OPTIONS[number]["id"]) => void;
  selectedSlotId?: string | null;
  isLoading?: boolean;
}

export function FarmScene({
  weather = "sunny",
  slots,
  agentData,
  onSlotClick,
  onCropPick,
  selectedSlotId,
  isLoading = false,
}: FarmSceneProps) {
  const theme = weatherTheme[weather];
  const pickerSlot = slots.find((s) => s.id === selectedSlotId && s.state === "empty") ?? null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[2rem] border border-white/30 shadow-[0_16px_64px_rgba(0,0,0,0.18)] ${theme.filter}`}
      style={{ minHeight: "clamp(320px,42vw,500px)", background: theme.sky }}
      role="img"
      aria-label={`Garden — ${theme.label}, ${theme.marketLabel}`}
    >
      {/* clouds */}
      <Cloud x={4}  y={7}  scale={1.2}  delay={0}   color={theme.cloudColor} opacity={theme.cloudOpacity} />
      <Cloud x={26} y={3}  scale={0.85} delay={2.4}  color={theme.cloudColor} opacity={theme.cloudOpacity * 0.82} />
      <Cloud x={54} y={10} scale={1.0}  delay={1.1}  color={theme.cloudColor} opacity={theme.cloudOpacity * 0.7} />
      <Cloud x={74} y={4}  scale={0.72} delay={3.7}  color={theme.cloudColor} opacity={theme.cloudOpacity * 0.88} />

      <Sun visible={theme.sunVisible} />
      {theme.rainVisible && <RainLayer />}

      {/* market badge — top-left */}
      <motion.div
        className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-3 py-2 shadow-md backdrop-blur-sm"
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      >
        <span className="text-base leading-none">{theme.emoji}</span>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Market</p>
          <p className="text-xs font-black text-gray-800">{theme.marketLabel}</p>
        </div>
      </motion.div>

      {/* tip badge — top-right */}
      <motion.div
        className="absolute right-4 top-4 z-10 hidden max-w-[200px] rounded-xl border border-white/50 bg-white/72 px-2.5 py-1.5 shadow-sm backdrop-blur-sm sm:block"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
      >
        <p className="text-[10px] font-bold leading-4 text-gray-600">{theme.tip}</p>
      </motion.div>

      {/* ground */}
      <div className="absolute inset-x-0 bottom-0" style={{ height: "43%", background: theme.ground, borderRadius: "2rem 2rem 0 0" }}>
        {/* depth stripes */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="absolute inset-x-0 bottom-0 opacity-15"
            style={{ height: `${18 + i * 6}%`, background: `rgba(0,0,0,${0.05 + i * 0.01})` }} />
        ))}
        {/* grass tufts */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-around px-3" style={{ height: 22 }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div key={i} className="flex gap-[1px]"
              animate={{ skewX: [0, i % 2 === 0 ? 5 : -5, 0] }}
              transition={{ duration: 2.8 + i * 0.25, repeat: Infinity, ease: "easeInOut" }}>
              <div className="rounded-t-full bg-emerald-600/55" style={{ width: 3, height: 9 + (i % 3) * 4, marginTop: "auto" }} />
              <div className="rounded-t-full bg-emerald-500/45" style={{ width: 2, height: 7 + (i % 4) * 3, marginTop: "auto" }} />
              <div className="rounded-t-full bg-emerald-600/55" style={{ width: 3, height: 11 + (i % 2) * 4, marginTop: "auto" }} />
            </motion.div>
          ))}
        </div>
        {/* dirt path */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-3xl opacity-35"
          style={{ width: "55%", height: "48%", background: "linear-gradient(180deg,#a16207,#92400e)" }} />
      </div>

      {/* loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div className="absolute inset-0 z-40 flex items-center justify-center rounded-[2rem] bg-white/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/60 bg-white/92 px-6 py-4 shadow-xl backdrop-blur-md">
              <Loader2 className="size-8 animate-spin text-teal-600" />
              <p className="text-sm font-black text-gray-700">Petani lagi analisa pasar…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* pots layer */}
      <div className="absolute inset-0 z-10">
        {slots.map((slot) => (
          <GardenPot
            key={slot.id}
            slot={slot}
            isSelected={selectedSlotId === slot.id}
            onClick={() => onSlotClick(slot)}
          />
        ))}
      </div>

      {/* crop picker overlay — only when an EMPTY slot is selected */}
      <AnimatePresence>
        {pickerSlot && (
          <CropPicker
            key={pickerSlot.id}
            slotId={pickerSlot.id}
            weather={weather}
            onPick={onCropPick}
            onClose={() => onSlotClick(pickerSlot)} /* deselect */
          />
        )}
      </AnimatePresence>

      {/* agent explanation banner */}
      <AnimatePresence>
        {agentData?.beginnerExplanation && !pickerSlot && (
          <motion.div
            className="absolute bottom-4 left-1/2 z-20 w-[min(90%,460px)] -translate-x-1/2 rounded-2xl border border-emerald-200/80 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
          >
            <p className="flex items-start gap-2 text-xs font-bold leading-5 text-emerald-800">
              <Sprout className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
              {agentData.beginnerExplanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
