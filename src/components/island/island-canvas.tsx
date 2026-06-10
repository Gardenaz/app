"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";
import type { PotSlot, WeatherMood } from "@/components/sections/farm-scene";
import { CROP_OPTIONS } from "@/components/sections/farm-scene";
import { OceanLayer } from "./ocean-layer";
import { Windmill, Farmhouse, Dock, PineTree, FlowerCluster, Rocks, FenceRow, Bridge, DecorationDefs } from "./decorations";
import { IslandTerrain } from "./island-terrain";
import { GodRays, ColorGrade, Vignette } from "./atmosphere";
import { ParticleSystem } from "./particle-system";
import { BirdLayer } from "./birds";
import { FarmZones } from "./island-zones";

/* ── Cloud ──────────────────────────────────────────── */
function Cloud({ x, y, scale, delay, color, opacity }: {
  x: number; y: number; scale: number; delay: number; color: string; opacity: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: `${x}%`, top: `${y}%`, opacity }}
      animate={{ x: [0, 28, 0] }}
      transition={{ duration: 24 + delay * 6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg width={110 * scale} height={55 * scale} viewBox="0 0 120 60" fill={color}
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.08))" }}>
        <ellipse cx="60" cy="42" rx="55" ry="19" />
        <ellipse cx="44" cy="32" rx="30" ry="24" />
        <ellipse cx="74" cy="27" rx="24" ry="20" />
        <ellipse cx="58" cy="24" rx="21" ry="18" />
      </svg>
    </motion.div>
  );
}

/* ── Sun ────────────────────────────────────────────── */
function Sun({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <motion.div
      className="pointer-events-none absolute right-8 top-4"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Bloom halo — bleeds light into the sky like a camera lens */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 220,
          height: 220,
          background: "radial-gradient(circle, rgba(255,236,150,0.55) 0%, rgba(255,220,120,0.18) 40%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <div className="relative flex size-16 items-center justify-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 rounded-full bg-amber-300/60"
            style={{
              height: 14,
              top: "50%",
              left: "50%",
              transformOrigin: "50% 220%",
              transform: `translate(-50%,-220%) rotate(${i * 45}deg)`,
            }}
          />
        ))}
        <motion.div
          className="relative z-10 size-11 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, #FFF3A3, #F5C842 50%, #E8A012)",
            boxShadow: "0 0 24px 8px rgba(245,200,66,0.5), 0 0 48px 16px rgba(245,200,66,0.2)",
          }}
          animate={{ boxShadow: [
            "0 0 24px 8px rgba(245,200,66,0.5), 0 0 48px 16px rgba(245,200,66,0.2)",
            "0 0 36px 14px rgba(245,200,66,0.65), 0 0 64px 24px rgba(245,200,66,0.3)",
            "0 0 24px 8px rgba(245,200,66,0.5), 0 0 48px 16px rgba(245,200,66,0.2)",
          ]}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

/* ── Rain ───────────────────────────────────────────── */
function RainLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 35 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px rounded-full"
          style={{
            left: `${(i * 3) % 100}%`,
            height: `${10 + (i % 5) * 5}px`,
            top: "-8%",
            background: "rgba(125,211,252,0.45)",
          }}
          animate={{ y: ["0%", "110vh"] }}
          transition={{
            duration: 0.6 + (i % 5) * 0.1,
            repeat: Infinity,
            delay: (i * 0.055) % 1.2,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* ── Weather config ─────────────────────────────────── */
const weatherConfig = {
  sunny: {
    sky: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 30%, #B3E5FC 65%, #C8F5D0 100%)",
    cloudColor: "#FFFFFF",
    cloudOpacity: 0.2,
    sunVisible: true,
    rainVisible: false,
    ambientFilter: "saturate(1.08) contrast(1.03)",
  },
  cloudy: {
    sky: "linear-gradient(180deg, #90A4AE 0%, #B0BEC5 35%, #CFD8DC 70%, #D4EDD5 100%)",
    cloudColor: "#ECEFF1",
    cloudOpacity: 0.85,
    sunVisible: true,
    rainVisible: false,
    ambientFilter: "brightness(0.93)",
  },
  rainy: {
    sky: "linear-gradient(180deg, #546E7A 0%, #78909C 45%, #90A4AE 80%, #AECFC0 100%)",
    cloudColor: "#B0BEC5",
    cloudOpacity: 0.95,
    sunVisible: false,
    rainVisible: true,
    ambientFilter: "brightness(0.82) saturate(0.78)",
  },
  stormy: {
    sky: "linear-gradient(180deg, #1C2B36 0%, #263238 45%, #37474F 80%, #4E6B5E 100%)",
    cloudColor: "#546E7A",
    cloudOpacity: 1,
    sunVisible: false,
    rainVisible: true,
    ambientFilter: "brightness(0.72) saturate(0.55)",
  },
};

/* ── Market badge ───────────────────────────────────── */
const marketBadgeConfig: Record<WeatherMood, { emoji: string; label: string }> = {
  sunny:  { emoji: "☀️", label: "Bull Market" },
  cloudy: { emoji: "⛅", label: "Neutral" },
  rainy:  { emoji: "🌧️", label: "Bear Market" },
  stormy: { emoji: "⛈️", label: "Crash Mode" },
};

/* ── IslandCanvas ───────────────────────────────────── */
export interface IslandCanvasProps {
  weather?: WeatherMood;
  slots: PotSlot[];
  agentData?: GardenAgentResult | null;
  onSlotClick: (slot: PotSlot) => void;
  onCropPick: (slotId: string, cropId: typeof CROP_OPTIONS[number]["id"]) => void;
  selectedSlotId?: string | null;
  isLoading?: boolean;
  /** Fill parent height instead of using the default clamp size */
  fullscreen?: boolean;
  className?: string;
}

export function IslandCanvas({
  weather = "sunny",
  slots,
  agentData,
  onSlotClick,
  onCropPick,
  selectedSlotId,
  isLoading = false,
  fullscreen = false,
  className = "",
}: IslandCanvasProps) {
  const cfg = weatherConfig[weather];
  const badge = marketBadgeConfig[weather];
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`relative w-full overflow-hidden rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.22)] ${fullscreen ? "h-full" : ""} ${className}`.trim()}
      style={{
        minHeight: fullscreen ? "320px" : "clamp(380px, 48vw, 560px)",
        background: cfg.sky,
        filter: cfg.ambientFilter || undefined,
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Layer 0: Ocean + horizon */}
      <OceanLayer weather={weather} />

      {/* Layers 1–2: Painterly terrain + paths + decorations */}
      <svg
        className="pointer-events-none absolute inset-0 overflow-visible"
        style={{ width: "100%", height: "100%" }}
        viewBox="0 0 800 560"
        preserveAspectRatio="xMidYMid slice"
      >
        <DecorationDefs />

        {/* Island base — beach, cliffs, shaded grass plateau */}
        <IslandTerrain />

        {/* Main dirt path — arcs from left wing through front yard to right wing */}
        <path
          d="M 185 490 Q 230 440 280 400 Q 340 370 400 385 Q 460 370 520 400 Q 570 440 615 490"
          stroke="#C8956C"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
        <path
          d="M 185 490 Q 230 440 280 400 Q 340 370 400 385 Q 460 370 520 400 Q 570 440 615 490"
          stroke="#D4A87C"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
          strokeDasharray="18 10"
        />

        {/* Path up from front yard to the farmhouse door */}
        <path
          d="M 400 385 Q 400 355 400 325"
          stroke="#C8956C"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
          opacity="0.45"
        />

        {/* Wooden bridge at the entrance to the front yard */}
        <Bridge x={400} y={395} width={70} />

        {/* Decorative elements */}
        <Farmhouse x={400} y={320} />
        <Windmill x={250} y={270} />
        <Dock x={640} y={480} />

        {/* Pine trees */}
        <PineTree x={130} y={310} scale={1.0} />
        <PineTree x={165} y={325} scale={0.75} />
        <PineTree x={680} y={300} scale={0.85} />
        <PineTree x={710} y={320} scale={1.1} />
        <PineTree x={460} y={460} scale={0.7} />

        {/* Flower clusters */}
        <FlowerCluster x={310} y={440} />
        <FlowerCluster x={560} y={430} />
        <FlowerCluster x={450} y={370} />

        {/* Rocks */}
        <Rocks x={170} y={420} />
        <Rocks x={660} y={350} />

        {/* Fence rows framing the front-yard garden plots */}
        <FenceRow x={138} y={395} count={4} />
        <FenceRow x={330} y={367} count={4} />
        <FenceRow x={498} y={367} count={4} />
      </svg>

      {/* Layer 5: Clouds */}
      <Cloud x={3}  y={5}  scale={1.3}  delay={0}   color={cfg.cloudColor} opacity={cfg.cloudOpacity} />
      <Cloud x={24} y={2}  scale={0.9}  delay={2.5}  color={cfg.cloudColor} opacity={cfg.cloudOpacity * 0.8} />
      <Cloud x={52} y={8}  scale={1.1}  delay={1.2}  color={cfg.cloudColor} opacity={cfg.cloudOpacity * 0.7} />
      <Cloud x={73} y={3}  scale={0.75} delay={3.8}  color={cfg.cloudColor} opacity={cfg.cloudOpacity * 0.9} />

      <Sun visible={cfg.sunVisible} />
      {cfg.rainVisible && !reduceMotion && <RainLayer />}

      {/* Layer 6: Particles (skipped for reduced motion) */}
      {!reduceMotion && <ParticleSystem count={14} />}

      {/* Layer 7: Birds */}
      {!reduceMotion && <BirdLayer />}

      {/* Layer 3: Farm zones (interactive) */}
      <FarmZones
        slots={slots}
        weather={weather}
        selectedSlotId={selectedSlotId}
        onSlotClick={onSlotClick}
        onCropPick={onCropPick}
      />

      {/* Layer 8: Cinematic post-processing */}
      <GodRays visible={cfg.sunVisible && weather === "sunny"} />
      <ColorGrade weather={weather} />
      <Vignette />

      {/* Market badge */}
      <motion.div
        className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-2xl border border-white/50 px-3 py-2 shadow-lg backdrop-blur-sm"
        style={{ background: "rgba(255,255,255,0.82)", fontFamily: "var(--font-island-heading)" }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-lg leading-none">{badge.emoji}</span>
        <div>
          <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Market</p>
          <p className="text-xs font-black text-gray-800">{badge.label}</p>
        </div>
      </motion.div>

      {/* Agent explanation banner */}
      <AnimatePresence>
        {agentData?.beginnerExplanation && (
          <motion.div
            className="absolute bottom-4 left-1/2 z-20 w-[min(88%,440px)] -translate-x-1/2 rounded-2xl border-2 px-4 py-2.5 shadow-xl backdrop-blur-sm"
            style={{
              borderColor: "var(--island-grass)",
              background: "rgba(245,237,204,0.96)",
              fontFamily: "var(--font-island-body)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
          >
            <p className="flex items-start gap-2 text-xs font-bold leading-5" style={{ color: "var(--island-grass-dark)" }}>
              <span className="text-base">🌱</span>
              {agentData.beginnerExplanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center rounded-[2rem] backdrop-blur-sm"
            style={{ background: "rgba(245,237,204,0.7)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="flex flex-col items-center gap-3 rounded-2xl border-2 px-6 py-5 shadow-xl"
              style={{
                borderColor: "var(--island-parchment-dark)",
                background: "rgba(255,252,240,0.96)",
                fontFamily: "var(--font-island-heading)",
              }}
            >
              <Loader2 className="size-8 animate-spin" style={{ color: "var(--island-grass)" }} />
              <p className="text-sm font-black" style={{ color: "var(--island-sign-bg)" }}>
                🌿 The farm is thinking...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
