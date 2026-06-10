"use client";

import { motion, useReducedMotion } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   Painterly island terrain — rendered inside the 800×560
   canvas SVG. Light source: top-right (matches the Sun).
   Layer order (bottom → top): water contact shadow →
   foam ring → wet sand → dry sand → cliff/earth rim →
   grass plateau → painted texture → ambient-occlusion
   edge → warm sun highlight.
   ───────────────────────────────────────────────────────── */

const GRASS_PATH =
  "M 400 168 C 545 170 688 218 714 318 C 736 408 658 498 522 534 C 432 558 326 552 248 522 C 142 482 68 398 86 304 C 103 214 258 165 400 168 Z";

const CX = 400;
const CY = 358;

/** Scale the island blob outward from its centroid (beach rings). */
const ring = (s: number) =>
  `translate(${CX} ${CY}) scale(${s}) translate(${-CX} ${-CY})`;

/* Deterministic scatter — no Math.random so SSR/CSR match */
const TUFTS = Array.from({ length: 38 }, (_, i) => ({
  x: 135 + ((i * 131) % 530),
  y: 225 + ((i * 79) % 270),
  s: 0.75 + ((i * 37) % 11) / 16,
}));

const MOTTLES = Array.from({ length: 12 }, (_, i) => ({
  x: 150 + ((i * 173) % 500),
  y: 220 + ((i * 113) % 270),
  rx: 34 + ((i * 29) % 40),
  ry: 14 + ((i * 17) % 14),
  light: i % 3 === 0,
}));

export function IslandTerrain() {
  const reduceMotion = useReducedMotion();

  return (
    <g>
      <defs>
        {/* Grass lit from top-right, falling into shadow toward bottom-left */}
        <linearGradient id="it-grass" x1="0.72" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#97D659" />
          <stop offset="45%" stopColor="#6CB840" />
          <stop offset="100%" stopColor="#41862A" />
        </linearGradient>
        <linearGradient id="it-cliff" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9C7148" />
          <stop offset="60%" stopColor="#7E5635" />
          <stop offset="100%" stopColor="#5C3D25" />
        </linearGradient>
        {/* Left side of the cliff falls into shadow */}
        <linearGradient id="it-cliff-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(30,15,5,0.3)" />
          <stop offset="45%" stopColor="rgba(30,15,5,0)" />
          <stop offset="100%" stopColor="rgba(255,220,160,0.12)" />
        </linearGradient>
        <linearGradient id="it-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4E2B0" />
          <stop offset="100%" stopColor="#D9B87E" />
        </linearGradient>
        <radialGradient id="it-sunlight" cx="0.7" cy="0.16" r="0.85">
          <stop offset="0%" stopColor="rgba(255,244,168,0.4)" />
          <stop offset="45%" stopColor="rgba(255,244,168,0.1)" />
          <stop offset="100%" stopColor="rgba(255,244,168,0)" />
        </radialGradient>
        <pattern id="it-speckle" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="3" r="0.8" fill="rgba(140,100,55,0.3)" />
          <circle cx="6.5" cy="7" r="0.6" fill="rgba(255,255,255,0.28)" />
        </pattern>
        <filter id="it-blur16" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id="it-blur10" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="it-blur4" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <clipPath id="it-grass-clip">
          <path d={GRASS_PATH} />
        </clipPath>
      </defs>

      {/* Water contact shadow — grounds the island in the sea */}
      <path
        d={GRASS_PATH}
        transform={ring(1.17)}
        fill="rgba(6,42,66,0.38)"
        filter="url(#it-blur16)"
      />

      {/* Drifting foam ring around the shoreline */}
      <motion.path
        d={GRASS_PATH}
        transform={ring(1.1)}
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth={9}
        strokeDasharray="34 22"
        strokeLinecap="round"
        filter="url(#it-blur4)"
        opacity={0.6}
        animate={
          reduceMotion
            ? undefined
            : { strokeDashoffset: [0, -112], opacity: [0.45, 0.75, 0.45] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />

      {/* Wet sand → dry sand beach */}
      <path d={GRASS_PATH} transform={ring(1.085)} fill="#C9A26A" opacity={0.92} />
      <path d={GRASS_PATH} transform={ring(1.05)} fill="url(#it-sand)" />
      <path d={GRASS_PATH} transform={ring(1.05)} fill="url(#it-speckle)" opacity={0.5} />

      {/* Earth/cliff rim — gives the plateau 3D thickness */}
      <path d={GRASS_PATH} transform="translate(0 20)" fill="url(#it-cliff)" />
      <path d={GRASS_PATH} transform="translate(0 20)" fill="url(#it-cliff-shade)" />

      {/* Grass plateau */}
      <path d={GRASS_PATH} fill="url(#it-grass)" />

      <g clipPath="url(#it-grass-clip)">
        {/* Painted mottling — breaks up the flat green */}
        {MOTTLES.map((m, i) => (
          <ellipse
            key={i}
            cx={m.x}
            cy={m.y}
            rx={m.rx}
            ry={m.ry}
            fill={m.light ? "rgba(255,250,190,0.1)" : "rgba(18,80,20,0.1)"}
            filter="url(#it-blur4)"
          />
        ))}

        {/* Grass tufts */}
        {TUFTS.map((t, i) => (
          <path
            key={i}
            transform={`translate(${t.x} ${t.y}) scale(${t.s})`}
            d="M -4 0 Q -3 -7 -1 -9 M 0 0 Q 1 -8 3 -10 M 4 1 Q 6 -5 8 -7"
            stroke="rgba(34,102,27,0.5)"
            strokeWidth={1.6}
            fill="none"
            strokeLinecap="round"
          />
        ))}

        {/* Ambient occlusion along the plateau edge */}
        <path
          d={GRASS_PATH}
          fill="none"
          stroke="rgba(26,74,16,0.5)"
          strokeWidth={30}
          filter="url(#it-blur10)"
        />

        {/* Warm key light from the sun (top-right) */}
        <path d={GRASS_PATH} fill="url(#it-sunlight)" />
      </g>
    </g>
  );
}
