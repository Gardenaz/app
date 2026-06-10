"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";

type Bird = {
  id: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  scale: number;
  delay: number;
  duration: number;
};

function generateBirds(): Bird[] {
  const birds: Bird[] = [];
  for (let i = 0; i < 14; i++) {
    const fromLeft = Math.random() < 0.5;
    birds.push({
      id: i,
      x0: fromLeft ? -12 : 112,
      y0: 5 + Math.random() * 60,
      x1: fromLeft ? 112 : -12,
      y1: 10 + Math.random() * 55,
      scale: 0.4 + Math.random() * 0.8,
      delay: 0.2 + Math.random() * 2.5,
      duration: 6 + Math.random() * 12,
    });
  }
  return birds;
}

function BirdShape({ scale = 1 }: { scale: number }) {
  return (
    <svg width={14 * scale} height={6 * scale} viewBox="0 0 14 6">
      <path
        d="M0,3 Q4,0 8,3 Q12,0 14,3 Q10,2.5 7,3.5 Q4,2.5 0,3Z"
        fill="var(--text)"
      />
    </svg>
  );
}

function BirdsLayer() {
  const [birds] = useState<Bird[]>(() => generateBirds());

  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
      {birds.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          initial={{ x: `${b.x0}%`, y: `${b.y0}%`, opacity: 0 }}
          animate={{ x: `${b.x1}%`, y: `${b.y1}%`, opacity: 1 }}
          transition={{
            x: { duration: b.duration, delay: b.delay, ease: "linear", repeat: Infinity },
            y: { duration: b.duration * 0.6, delay: b.delay, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
            opacity: { duration: 0.4, delay: b.delay },
          }}
        >
          <motion.div
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
          >
            <BirdShape scale={b.scale} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export function HeroCloudReveal() {
  return (
    <section id="what-is-gardenaz" className="landing-section landing-section--flush relative min-h-[90vh] w-full overflow-hidden">
      <video
        src="/bg-hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-x-0 top-0 h-[calc(100%+3rem)] w-full object-cover"
      />

      {/* Dark gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/55 via-black/35 to-black/65" />

      Gradient cover to blend with page background
      {/* <div className="pointer-events-none absolute top-0 left-0 right-0 z-[7] h-20 bg-gradient-to-b from-[var(--bg)] to-transparent" /> */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[7] h-24 bg-gradient-to-t from-[var(--bg)] to-transparent" />

      {/* <BirdsLayer /> */}

      {/* Centered text layout */}
      <div className="landing-inner relative z-[5] flex min-h-[90vh] items-center justify-center px-[var(--landing-inline)] py-12">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex max-w-[40rem] flex-col items-center text-center"
        >
          <motion.h1
            variants={staggerItem}
            className="mb-5 text-[44px] font-semibold leading-[1.02] -tracking-[1.5px] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.45)] sm:text-[56px] lg:text-[64px]"
          >
            Autonomous finance
            <br />
            <span className="text-[var(--primary)] [filter:drop-shadow(0_0_24px_var(--primary-glow))]">should stay transparent.</span>
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="mb-8 max-w-[480px] text-base leading-[1.75] text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-lg"
          >
            Gardenaz gives you an AI agent that explains every move, stays within your policy, and proves it on Mantle.
          </motion.p>
          <motion.div variants={staggerItem}>
            <Link
              href="/app"
              className="group inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-[var(--primary-foreground)] shadow-[var(--primary-shadow-sm)] transition-all duration-300 hover:bg-[var(--primary-hover)] hover:shadow-[var(--primary-shadow-md)]"
            >
              Launch App
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Right — 3D Tilt Yield Card (commented out)
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: easeOutExpo }}
          className="w-full max-w-[22rem] justify-self-center lg:justify-self-end"
        >
          <YieldCardHero
            title="Strategy Review"
            subtitle="The agent compares options, writes a clear reason, checks policy, and records the decision before execution."
            cta="See the plan"
            onCtaClick={() => (window.location.href = "/app")}
            confidence={84}
            assignedTo="Yield Scout"
          />
        </motion.div>
        */}
      </div>
    </section>
  );
}
