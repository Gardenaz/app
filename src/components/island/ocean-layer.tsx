"use client";

import { motion, useReducedMotion } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   Ocean + horizon backdrop. Top ~34% is open sky, then a
   hazy horizon line with distant islands (atmospheric
   perspective), then water that deepens toward the camera.
   ───────────────────────────────────────────────────────── */

function RippleRing({ delay, size }: { delay: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full border border-white/20"
      style={{ width: size, height: size, top: "50%", left: "50%", marginLeft: -size / 2, marginTop: -size / 2 }}
      animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, delay, ease: "easeOut" }}
    />
  );
}

function FoamStripe({ y, delay }: { y: string; delay: number }) {
  return (
    <motion.div
      className="absolute inset-x-0 rounded-full"
      style={{ top: y, height: 2, background: "rgba(255,255,255,0.22)" }}
      animate={{ x: ["-5%", "5%", "-5%"], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 6 + delay * 2, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* Sun glitter — twinkling specular highlights under the sun */
const GLITTER = Array.from({ length: 14 }, (_, i) => ({
  left: 68 + ((i * 53) % 22),
  top: 37 + ((i * 71) % 26),
  w: 7 + ((i * 31) % 12),
  delay: (i * 0.37) % 2.6,
}));

function SunGlitter() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0" style={{ mixBlendMode: "screen" }}>
      {GLITTER.map((g, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${g.left}%`,
            top: `${g.top}%`,
            width: g.w,
            height: 2,
            background: "rgba(255,250,220,0.9)",
            filter: "blur(0.5px)",
            opacity: 0.3,
          }}
          animate={reduceMotion ? undefined : { opacity: [0.1, 0.85, 0.1], scaleX: [0.7, 1.15, 0.7] }}
          transition={{ duration: 1.8 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut", delay: g.delay }}
        />
      ))}
    </div>
  );
}

interface OceanLayerProps {
  weather?: "sunny" | "cloudy" | "rainy" | "stormy";
}

const weatherOcean: Record<
  string,
  {
    skyTop: string; skyMid: string; horizon: string;
    shallow: string; mid: string; deep: string;
    haze: number; glitter: boolean; distant: string;
  }
> = {
  sunny:  { skyTop: "#2E9FDC", skyMid: "#7DCBF0", horizon: "#EAF7FD", shallow: "#8FDCF2", mid: "#36A3D9", deep: "#0B5E97", haze: 0.85, glitter: true,  distant: "#8FB6CC" },
  cloudy: { skyTop: "#8FA6B2", skyMid: "#B6C7CF", horizon: "#E3EBEF", shallow: "#A8CBD9", mid: "#5E96AD", deep: "#2C617C", haze: 0.9,  glitter: false, distant: "#93A9B6" },
  rainy:  { skyTop: "#56707F", skyMid: "#7A929F", horizon: "#B8C9D1", shallow: "#7FA8BC", mid: "#41788F", deep: "#173F58", haze: 0.7,  glitter: false, distant: "#6E8694" },
  stormy: { skyTop: "#16242F", skyMid: "#26404F", horizon: "#46606E", shallow: "#3A5B6C", mid: "#1F3D4E", deep: "#0A1C29", haze: 0.45, glitter: false, distant: "#334854" },
};

export function OceanLayer({ weather = "sunny" }: OceanLayerProps) {
  const col = weatherOcean[weather];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky band */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "34%",
          background: `linear-gradient(180deg, ${col.skyTop} 0%, ${col.skyMid} 58%, ${col.horizon} 100%)`,
        }}
      />

      {/* Ocean — light at the horizon, deepening toward camera */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "66%",
          background: `linear-gradient(180deg, ${col.shallow} 0%, ${col.mid} 32%, ${col.deep} 100%)`,
        }}
      />

      {/* Distant islands — faded by atmospheric perspective */}
      <svg
        className="absolute inset-x-0"
        style={{ top: "26.5%", height: "9%", width: "100%", filter: "blur(1.2px)", opacity: 0.7 }}
        viewBox="0 0 800 56"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M 30 56 Q 75 26 128 40 Q 162 20 212 38 Q 252 50 285 56 Z" fill={col.distant} opacity="0.75" />
        <path d="M 555 56 Q 598 30 648 42 Q 690 24 742 44 L 765 56 Z" fill={col.distant} opacity="0.6" />
      </svg>

      {/* Horizon haze */}
      <div
        className="absolute inset-x-0"
        style={{
          top: "29%",
          height: "13%",
          background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.6) 45%, transparent 100%)",
          opacity: col.haze * 0.85,
        }}
      />

      {/* Swell animation */}
      <motion.div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "66%",
          background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
        }}
        animate={{ scaleY: [1, 1.025, 1], translateY: [0, -3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sun glitter trail (sunny only) */}
      {col.glitter && <SunGlitter />}

      {/* Foam stripes */}
      <FoamStripe y="44%" delay={0} />
      <FoamStripe y="58%" delay={1.4} />
      <FoamStripe y="72%" delay={2.8} />
      <FoamStripe y="86%" delay={0.7} />

      {/* Ripple rings */}
      <div className="absolute" style={{ left: "16%", top: "62%" }}>
        <RippleRing delay={0} size={40} />
        <RippleRing delay={1.8} size={40} />
      </div>
      <div className="absolute" style={{ left: "84%", top: "50%" }}>
        <RippleRing delay={0.9} size={32} />
        <RippleRing delay={2.7} size={32} />
      </div>
      <div className="absolute" style={{ left: "50%", top: "88%" }}>
        <RippleRing delay={1.4} size={50} />
      </div>
    </div>
  );
}
