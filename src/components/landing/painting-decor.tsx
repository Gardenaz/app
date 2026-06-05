"use client";

import { motion } from "framer-motion";

const petalsTop = [
  { x: "5%", y: "20%", r: 8, d: 2.5, delay: 0 },
  { x: "18%", y: "60%", r: 5, d: 3.2, delay: 0.8 },
  { x: "32%", y: "35%", r: 7, d: 2.8, delay: 1.4 },
  { x: "55%", y: "50%", r: 6, d: 3.5, delay: 0.3 },
  { x: "70%", y: "25%", r: 9, d: 2.2, delay: 1.1 },
  { x: "88%", y: "55%", r: 5, d: 3.0, delay: 0.6 },
  { x: "95%", y: "70%", r: 7, d: 2.7, delay: 1.7 },
];

function FloralTop() {
  return (
    <div className="pointer-events-none relative h-32 w-full overflow-hidden bg-white" aria-hidden="true">
      {petalsTop.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-[#B3DF46]/20 to-[var(--primary)]/10"
          style={{ left: p.x, top: p.y }}
          animate={{
            y: [0, -8, 0],
            x: [0, 3, -3, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: p.d,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width={p.r * 4} height={p.r * 4} viewBox="0 0 32 32">
            <ellipse cx="16" cy="14" rx="8" ry="12" fill="currentColor" opacity="0.6" />
            <line x1="16" y1="26" x2="16" y2="30" stroke="var(--primary)" strokeWidth="0.5" opacity="0.3" />
          </svg>
        </motion.div>
      ))}

      {/* Brush-stroke horizon line */}
      <div className="absolute bottom-0 left-1/2 h-[2px] w-[40%] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#B3DF46]/25 to-transparent" />
      <div className="absolute bottom-3 left-1/2 h-[1px] w-[25%] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[var(--primary)]/15 to-transparent" />
    </div>
  );
}

function WavesBottom() {
  return (
    <div className="pointer-events-none relative h-24 w-full overflow-hidden bg-white" aria-hidden="true">
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave-grad-bottom" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.04" />
            <stop offset="50%" stopColor="#B3DF46" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 C120,80 240,20 360,45 C480,70 600,90 720,55 C840,20 960,80 1080,50 C1200,20 1320,70 1440,45 L1440,120 L0,120 Z"
          fill="url(#wave-grad-bottom)"
        />
        <path
          d="M0,75 C120,70 240,55 360,65 C480,75 600,90 720,65 C840,40 960,70 1080,60 C1200,50 1320,75 1440,55 L1440,120 L0,120 Z"
          fill="url(#wave-grad-bottom)"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

type DecorVariant = "floral-top" | "waves-bottom";

export function PaintingDecor({ variant }: { variant: DecorVariant }) {
  if (variant === "floral-top") return <FloralTop />;
  if (variant === "waves-bottom") return <WavesBottom />;
  return null;
}
