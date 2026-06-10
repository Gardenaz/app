"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function BirdSvg({ scale = 1 }: { scale?: number }) {
  return (
    <svg width={22 * scale} height={12 * scale} viewBox="0 0 22 12" fill="none">
      <motion.path
        d="M11 6 Q7 2 2 5"
        stroke="#334155"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <motion.path
        d="M11 6 Q15 2 20 5"
        stroke="#334155"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

interface BirdFlock {
  id: number;
  y: number;
  scale: number;
  delay: number;
  count: number;
}

export function BirdLayer() {
  const [flocks, setFlocks] = useState<BirdFlock[]>([]);

  useEffect(() => {
    const spawn = () => {
      const flock: BirdFlock = {
        id: Date.now(),
        y: 5 + Math.random() * 30,
        scale: 0.6 + Math.random() * 0.6,
        delay: 0,
        count: 2 + Math.floor(Math.random() * 4),
      };
      setFlocks((prev) => [...prev.slice(-3), flock]);
    };

    const interval = setInterval(spawn, 8000 + Math.random() * 8000);
    const initial = setTimeout(spawn, 3000);
    return () => { clearInterval(interval); clearTimeout(initial); };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {flocks.map((flock) => (
          <motion.div
            key={flock.id}
            className="absolute flex gap-3"
            style={{ top: `${flock.y}%`, left: 0 }}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: "110vw", opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 12 + flock.scale * 4, ease: "linear" }}
            onAnimationComplete={() =>
              setFlocks((prev) => prev.filter((f) => f.id !== flock.id))
            }
          >
            {Array.from({ length: flock.count }).map((_, i) => (
              <motion.div
                key={i}
                style={{ marginTop: i % 2 === 0 ? 0 : 8 }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              >
                <BirdSvg scale={flock.scale} />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
