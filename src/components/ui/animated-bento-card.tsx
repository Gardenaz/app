"use client";

import React, { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { AnimatedGradient } from "@/components/ui/animated-gradient-with-svg";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

interface AnimatedBentoCardProps {
  colors: readonly string[];
  delay?: number;
  speed?: number;
  blur?: "light" | "medium" | "heavy";
  className?: string;
  children: ReactNode;
  animateChildren?: boolean;
}

const AnimatedBentoCard: React.FC<AnimatedBentoCardProps> = ({
  colors,
  delay = 0,
  speed = 0.05,
  blur = "medium",
  className = "",
  children,
  animateChildren = false,
}) => {
  const content = (
    <div className="relative z-10 p-3 sm:p-5 md:p-8 text-[var(--text)] backdrop-blur-sm">
      {children}
    </div>
  );

  return (
    <motion.div
      className={`relative overflow-hidden h-full bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-sm)] ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <AnimatedGradient colors={colors} speed={speed} blur={blur} />
      {animateChildren ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 p-3 sm:p-5 md:p-8 text-[var(--text)] backdrop-blur-sm"
        >
          {children}
        </motion.div>
      ) : (
        content
      )}
    </motion.div>
  );
};

export { AnimatedBentoCard, itemVariants };
