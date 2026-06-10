"use client";

import { motion } from "framer-motion";

/* ── Shared gradient defs ───────────────────────
   Rendered once inside the canvas SVG. All props are lit
   from the top-right to match the sun. */
export function DecorationDefs() {
  return (
    <defs>
      <linearGradient id="dx-pine-hi" x1="0.8" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stopColor="#7FCB4D" />
        <stop offset="100%" stopColor="#33681B" />
      </linearGradient>
      <linearGradient id="dx-pine-mid" x1="0.8" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stopColor="#8FD45C" />
        <stop offset="100%" stopColor="#3D7A21" />
      </linearGradient>
      <linearGradient id="dx-pine-lo" x1="0.8" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stopColor="#9EDB68" />
        <stop offset="100%" stopColor="#4A8F2A" />
      </linearGradient>
      <linearGradient id="dx-trunk" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6E4A30" />
        <stop offset="55%" stopColor="#8B6242" />
        <stop offset="100%" stopColor="#A8784F" />
      </linearGradient>
      <linearGradient id="dx-tower" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8F6A42" />
        <stop offset="60%" stopColor="#B98F60" />
        <stop offset="100%" stopColor="#D2A874" />
      </linearGradient>
      <linearGradient id="dx-roof" x1="0.8" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stopColor="#E2685A" />
        <stop offset="100%" stopColor="#9E342B" />
      </linearGradient>
      <linearGradient id="dx-wall" x1="0.7" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#FBF3D8" />
        <stop offset="100%" stopColor="#E3D3A4" />
      </linearGradient>
      <linearGradient id="dx-rock" x1="0.7" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#C4CBD4" />
        <stop offset="100%" stopColor="#5F6873" />
      </linearGradient>
      <radialGradient id="dx-window" cx="0.5" cy="0.4" r="0.8">
        <stop offset="0%" stopColor="#FFE9A8" />
        <stop offset="100%" stopColor="#F0B95B" />
      </radialGradient>
    </defs>
  );
}

/* ── Windmill ───────────────────────────────── */
export function Windmill({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Ground shadow */}
      <ellipse cx="3" cy="3" rx="14" ry="4" fill="rgba(20,50,20,0.22)" />
      {/* Tower */}
      <polygon points="-5,0 5,0 3,-40 -3,-40" fill="url(#dx-tower)" />
      {/* Door */}
      <rect x="-3" y="-8" width="6" height="8" rx="3" fill="#8B6242" />
      {/* Blades group — spinning */}
      <motion.g
        style={{ transformOrigin: "0px -40px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        {[0, 90, 180, 270].map((angle) => (
          <g key={angle} transform={`rotate(${angle}, 0, -40)`}>
            <rect x="-3" y="-58" width="6" height="22" rx="3" fill="#F5EDCC" opacity="0.95" />
          </g>
        ))}
        <circle cx="0" cy="-40" r="4" fill="#8B6242" />
      </motion.g>
      {/* Base cap */}
      <rect x="-7" y="-2" width="14" height="4" rx="2" fill="#9E6B45" />
    </g>
  );
}

/* ── Farmhouse ──────────────────────────────── */
export function Farmhouse({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Shadow */}
      <ellipse cx="-6" cy="4" rx="36" ry="9" fill="rgba(20,50,20,0.25)" />
      {/* Walls */}
      <rect x="-28" y="-30" width="56" height="32" rx="3" fill="url(#dx-wall)" />
      {/* Eave shadow cast by the roof */}
      <rect x="-28" y="-30" width="56" height="5" rx="2" fill="rgba(60,30,15,0.18)" />
      {/* Roof */}
      <polygon points="-32,-30 32,-30 0,-56" fill="url(#dx-roof)" />
      <polygon points="-32,-30 -28,-28 0,-52 0,-56" fill="rgba(255,255,255,0.22)" />
      {/* Chimney */}
      <rect x="10" y="-60" width="10" height="16" rx="1" fill="#9E6B45" />
      <rect x="8" y="-62" width="14" height="4" rx="2" fill="#8B6242" />
      {/* Door */}
      <rect x="-8" y="-14" width="16" height="16" rx="3" fill="#8B6242" />
      <rect x="-8" y="-14" width="5" height="16" rx="2" fill="rgba(0,0,0,0.18)" />
      <circle cx="5" cy="-6" r="2" fill="#F5C842" />
      {/* Windows — warm interior light */}
      <rect x="-24" y="-24" width="12" height="10" rx="2" fill="url(#dx-window)" />
      <rect x="12" y="-24" width="12" height="10" rx="2" fill="url(#dx-window)" />
      <rect x="-24" y="-24" width="12" height="10" rx="2" fill="none" stroke="#8B6242" strokeWidth="1" opacity="0.6" />
      <rect x="12" y="-24" width="12" height="10" rx="2" fill="none" stroke="#8B6242" strokeWidth="1" opacity="0.6" />
      {/* Window cross bars */}
      <line x1="-18" y1="-24" x2="-18" y2="-14" stroke="white" strokeWidth="1.5" opacity="0.7" />
      <line x1="-24" y1="-19" x2="-12" y2="-19" stroke="white" strokeWidth="1.5" opacity="0.7" />
      <line x1="18" y1="-24" x2="18" y2="-14" stroke="white" strokeWidth="1.5" opacity="0.7" />
      <line x1="12" y1="-19" x2="24" y2="-19" stroke="white" strokeWidth="1.5" opacity="0.7" />
    </g>
  );
}

/* ── Boat Dock ──────────────────────────────── */
export function Dock({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Dock planks */}
      <rect x="-6" y="-50" width="14" height="52" rx="2" fill="#C49A6C" />
      <rect x="-4" y="-50" width="14" height="52" rx="2" fill="#C49A6C" opacity="0.7" />
      {/* Deck */}
      <rect x="-22" y="-12" width="44" height="14" rx="3" fill="#D4B896" />
      {["-16", "-6", "4", "14"].map((bx) => (
        <line key={bx} x1={Number(bx) + 2} y1="-12" x2={Number(bx) + 2} y2="2" stroke="#8B6242" strokeWidth="1.5" opacity="0.5" />
      ))}
      {/* Bollard posts */}
      <rect x="-24" y="-16" width="6" height="18" rx="2" fill="#8B6242" />
      <rect x="18" y="-16" width="6" height="18" rx="2" fill="#8B6242" />
      {/* Small boat */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="2" cy="-22" rx="18" ry="7" fill="#E85D3A" />
        <rect x="-16" y="-24" width="36" height="5" rx="2" fill="#C8504A" />
        {/* Sail */}
        <line x1="2" y1="-24" x2="2" y2="-46" stroke="#8B6242" strokeWidth="2" />
        <polygon points="2,-44 2,-26 16,-34" fill="#F5EDCC" opacity="0.9" />
      </motion.g>
    </g>
  );
}

/* ── Wooden Bridge ──────────────────────────── */
export function Bridge({ x, y, width = 80 }: { x: number; y: number; width?: number }) {
  const hw = width / 2;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Bridge rails */}
      <line x1={-hw} y1="-8" x2={hw} y2="-8" stroke="#8B6242" strokeWidth="3" strokeLinecap="round" />
      <line x1={-hw} y1="2" x2={hw} y2="2" stroke="#8B6242" strokeWidth="3" strokeLinecap="round" />
      {/* Planks */}
      {Array.from({ length: Math.floor(width / 10) }).map((_, i) => (
        <rect key={i} x={-hw + i * 10} y="-6" width="8" height="8" rx="1" fill="#C49A6C" />
      ))}
      {/* Posts */}
      <rect x={-hw - 3} y="-14" width="5" height="16" rx="2" fill="#9E6B45" />
      <rect x={hw - 2}  y="-14" width="5" height="16" rx="2" fill="#9E6B45" />
    </g>
  );
}

/* ── Pine Tree ──────────────────────────────── */
export function PineTree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <motion.g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      animate={{ skewX: [-1, 1, -1] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: x * 0.01 }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      {/* Ground shadow */}
      <ellipse cx="-3" cy="9" rx="18" ry="4.5" fill="rgba(20,50,20,0.25)" />
      {/* Trunk */}
      <rect x="-4" y="-4" width="8" height="14" rx="1" fill="url(#dx-trunk)" />
      {/* Canopy layers — lit top-right, shaded bottom-left */}
      <polygon points="0,-42 -16,-18 16,-18" fill="url(#dx-pine-hi)" />
      <polygon points="0,-36 -20,-10 20,-10" fill="url(#dx-pine-mid)" />
      <polygon points="0,-28 -24,2 24,2" fill="url(#dx-pine-lo)" />
      {/* Rim light on the sun side */}
      <polygon points="0,-42 10,-27 5,-27" fill="rgba(255,246,180,0.35)" />
      <polygon points="0,-40 -4,-22 0,-22" fill="rgba(255,255,255,0.18)" />
    </motion.g>
  );
}

/* ── Flower Cluster ─────────────────────────── */
export function FlowerCluster({ x, y }: { x: number; y: number }) {
  const flowers = [
    { dx: 0,   dy: 0,  color: "#FF9EBC" },
    { dx: 10,  dy: -4, color: "#FFD166" },
    { dx: -8,  dy: -2, color: "#A8D5A2" },
    { dx: 5,   dy: 6,  color: "#87CEEB" },
    { dx: -5,  dy: 5,  color: "#FF9EBC" },
  ];
  return (
    <g transform={`translate(${x}, ${y})`}>
      {flowers.map((f, i) => (
        <motion.g
          key={i}
          transform={`translate(${f.dx}, ${f.dy})`}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        >
          {/* Stem */}
          <line x1="0" y1="0" x2="0" y2="6" stroke="#4A8F2A" strokeWidth="1.5" />
          {/* Petals */}
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 4}
              cy={Math.sin((angle * Math.PI) / 180) * 4 - 6}
              rx="3" ry="2.5"
              fill={f.color}
              opacity="0.9"
            />
          ))}
          {/* Center */}
          <circle cx="0" cy="-6" r="2.5" fill="#F5C842" />
        </motion.g>
      ))}
    </g>
  );
}

/* ── Rock cluster ───────────────────────────── */
export function Rocks({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Ground shadow */}
      <ellipse cx="-3" cy="5" rx="18" ry="4" fill="rgba(20,50,20,0.2)" />
      <ellipse cx="-8" cy="0" rx="10" ry="7" fill="url(#dx-rock)" />
      <ellipse cx="6"  cy="-3" rx="8"  ry="6" fill="url(#dx-rock)" opacity="0.85" />
      <ellipse cx="0"  cy="2" rx="6"   ry="4" fill="url(#dx-rock)" />
      {/* Specular highlights */}
      <ellipse cx="-5" cy="-3" rx="4" ry="2" fill="rgba(255,255,255,0.35)" />
      <ellipse cx="8" cy="-5.5" rx="3" ry="1.5" fill="rgba(255,255,255,0.3)" />
    </g>
  );
}

/* ── Fence post ─────────────────────────────── */
export function FenceRow({ x, y, count = 6 }: { x: number; y: number; count?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Rail */}
      <line x1="0" y1="-6" x2={count * 14} y2="-6" stroke="#C49A6C" strokeWidth="3" strokeLinecap="round" />
      <line x1="0" y1="2"  x2={count * 14} y2="2"  stroke="#C49A6C" strokeWidth="3" strokeLinecap="round" />
      {/* Posts */}
      {Array.from({ length: count + 1 }).map((_, i) => (
        <g key={i} transform={`translate(${i * 14}, 0)`}>
          <rect x="-2.5" y="-14" width="5" height="18" rx="1.5" fill="#9E6B45" />
          <polygon points="0,-17 -3,-14 3,-14" fill="#8B6242" />
        </g>
      ))}
    </g>
  );
}
