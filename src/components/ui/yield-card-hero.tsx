"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, TrendingUp, ShieldCheck, Sprout } from "lucide-react";

interface YieldCardHeroProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"> {
  title: string;
  subtitle: string;
  cta: string;
  onCtaClick?: () => void;
  confidence: number;
  assignedTo: string;
}

export const YieldCardHero = React.forwardRef<
  HTMLDivElement,
  YieldCardHeroProps
>(
  (
    {
      className,
      title,
      subtitle,
      cta,
      onCtaClick,
      confidence,
      assignedTo,
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({
      clientX,
      clientY,
      currentTarget,
    }: React.MouseEvent) => {
      const { left, top, width, height } =
        currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    };

    const rotateX = useTransform(mouseY, [0, 400], [10, -10]);
    const rotateY = useTransform(mouseX, [0, 360], [-10, 10]);
    const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
    const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(180);
          mouseY.set(200);
        }}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative flex w-full max-w-[400px] flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-8 backdrop-blur-md",
          className,
        )}
        {...props}
      >
        {/* Floating card — top right (small)
        <motion.div
          style={{ transform: "translateZ(50px)" }}
          className="absolute -top-8 -right-6 z-10 flex h-24 w-44 flex-col justify-between rounded-xl border border-white/20 bg-white/12 p-3 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--primary-soft-strong)]">
              <TrendingUp className="size-3.5 text-[var(--primary)]" />
            </div>
            <span className="text-[11px] font-bold text-white/80">
              YIELD SIGNAL
            </span>
          </div>
          <div>
            <p className="text-base font-bold text-white">+12.4% APY</p>
            <p className="mt-0.5 text-[11px] text-white/50">
              USDY route · Mantle
            </p>
          </div>
        </motion.div> */}

        {/* Floating card — bottom left (bigger) */}
        {/* <motion.div
          style={{ transform: "translateY(60px) translateX(-30px)" }}
          className="absolute -bottom-8 -left-6 z-10 flex h-28 w-48 flex-col justify-between rounded-xl border border-white/20 bg-white/12 p-3 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--primary-soft-strong)]">
              <ShieldCheck className="size-3.5 text-[var(--primary)]" />
            </div>
            <span className="text-[11px] font-bold text-white/80">
              POLICY GATE
            </span>
          </div>
          <div>
            <p className="text-base font-bold text-white">Guard Active</p>
            <p className="mt-0.5 text-[11px] text-white/50">
              Risk limits verified
            </p>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 flex-1 rounded-full bg-[var(--primary-border)]">
              <div className="h-full w-3/4 rounded-full bg-[var(--primary)]" />
            </div>
            <span className="text-[10px] font-bold text-white/60">75%</span>
          </div>
        </motion.div> */}

        {/* Main card content */}
        <div className="relative z-20 w-full text-left">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)] px-3 py-1">
            <Sprout className="size-3 text-[var(--primary)]" />
            <span className="text-[10px] font-bold tracking-wider text-[var(--primary)]">AGENT OUTPUT</span>
          </div>

          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70">
            {subtitle}
          </p>

          {/* Confidence bar */}
          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-[10px] font-semibold tracking-widest text-white/40">
              <span>CONFIDENCE</span>
              <span className="text-white/70">{confidence}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)]"
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between">
            <p className="text-[11px] text-white/40">
              Assigned to{" "}
              <strong className="text-white/70">{assignedTo}</strong>
            </p>
            <button
              onClick={onCtaClick}
              className="group flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-[var(--primary-foreground)] transition-all duration-300 hover:bg-white/90"
            >
              {cta}
              <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  },
);

YieldCardHero.displayName = "YieldCardHero";
