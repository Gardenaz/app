"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

const POLLEN_COLORS = ["#F5C842", "#A8D5A2", "#FFD166", "#87CEEB", "#B3E5FC", "#F5EDCC"];

export function ParticleSystem({ count = 18 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 95 + 2,
      y: Math.random() * 70 + 15,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 5,
      color: POLLEN_COLORS[i % POLLEN_COLORS.length],
    })),
  [count]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}80`,
          }}
          animate={{
            y: [0, -45, -80],
            x: [0, (p.id % 2 === 0 ? 12 : -10), (p.id % 2 === 0 ? 20 : -18)],
            opacity: [0, 0.85, 0],
            scale: [1, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
