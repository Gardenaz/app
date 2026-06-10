"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeatherMood } from "@/components/sections/farm-scene";

/* ─────────────────────────────────────────────────────────
   Cinematic post-processing layers: volumetric god rays,
   per-weather color grade, and a soft vignette. All are
   pointer-events-none overlays stacked above the scene.
   ───────────────────────────────────────────────────────── */

/* ── God rays — volumetric light shafts from the sun ── */
const RAYS = [
  { left: "56%", rotate: 26, width: 90, delay: 0 },
  { left: "68%", rotate: 19, width: 150, delay: 2.4 },
  { left: "81%", rotate: 11, width: 70, delay: 1.1 },
];

export function GodRays({ visible }: { visible: boolean }) {
  const reduceMotion = useReducedMotion();
  if (!visible) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ mixBlendMode: "screen" }}
    >
      {RAYS.map((r, i) => (
        <motion.div
          key={i}
          className="absolute -top-[12%]"
          style={{
            left: r.left,
            width: r.width,
            height: "90%",
            transformOrigin: "top center",
            rotate: r.rotate,
            background:
              "linear-gradient(180deg, rgba(255,240,170,0.5) 0%, rgba(255,240,170,0.16) 55%, transparent 100%)",
            opacity: 0.35,
          }}
          animate={reduceMotion ? undefined : { opacity: [0.18, 0.45, 0.18] }}
          transition={{
            duration: 7 + i * 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: r.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ── Per-weather color grade ─────────────────────────── */
const GRADES: Record<
  WeatherMood,
  { background: string; blend: CSSProperties["mixBlendMode"] }
> = {
  /* Golden-hour warmth pooling from the sun corner */
  sunny: {
    background:
      "linear-gradient(205deg, rgba(255,206,110,0.32) 0%, rgba(255,170,90,0.12) 40%, rgba(110,170,255,0.14) 100%)",
    blend: "soft-light",
  },
  cloudy: {
    background:
      "linear-gradient(180deg, rgba(150,168,184,0.16) 0%, rgba(118,138,150,0.12) 100%)",
    blend: "multiply",
  },
  rainy: {
    background:
      "linear-gradient(180deg, rgba(72,110,140,0.22) 0%, rgba(42,72,98,0.2) 100%)",
    blend: "multiply",
  },
  stormy: {
    background:
      "linear-gradient(180deg, rgba(24,44,64,0.36) 0%, rgba(10,24,40,0.32) 100%)",
    blend: "multiply",
  },
};

export function ColorGrade({ weather }: { weather: WeatherMood }) {
  const grade = GRADES[weather] ?? GRADES.sunny;
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ background: grade.background, mixBlendMode: grade.blend }}
    />
  );
}

/* ── Vignette — pulls the eye toward the island ──────── */
export function Vignette() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 95% 90% at 50% 42%, transparent 58%, rgba(15,30,40,0.1) 78%, rgba(10,22,32,0.3) 100%)",
      }}
    />
  );
}
