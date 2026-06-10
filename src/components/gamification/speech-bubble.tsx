"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpeechBubbleProps {
  children: ReactNode;
  visible?: boolean;
  className?: string;
  tailDirection?: "bottom" | "left" | "right" | "top";
  variant?: "default" | "info" | "success" | "warning";
}

const variantStyles = {
  default: {
    bg: "white",
    border: "var(--island-wood)",
    tailColor: "var(--island-wood)",
    color: "var(--island-sign-bg)",
  },
  info: {
    bg: "#EBF5FF",
    border: "#4BB8E8",
    tailColor: "#4BB8E8",
    color: "#0D4B6E",
  },
  success: {
    bg: "#F0FFF4",
    border: "var(--island-grass)",
    tailColor: "var(--island-grass)",
    color: "var(--island-grass-dark)",
  },
  warning: {
    bg: "#FFFBEB",
    border: "var(--island-gold)",
    tailColor: "var(--island-gold)",
    color: "var(--island-gold-dark)",
  },
};

export function SpeechBubble({
  children,
  visible = true,
  className,
  tailDirection = "bottom",
  variant = "default",
}: SpeechBubbleProps) {
  const vs = variantStyles[variant];

  const tailStyles: Record<string, object> = {
    bottom: {
      bottom: -11, left: "50%", transform: "translateX(-50%)",
      borderTop: `6px solid ${vs.tailColor}`,
      borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
    },
    top: {
      top: -11, left: "50%", transform: "translateX(-50%)",
      borderBottom: `6px solid ${vs.tailColor}`,
      borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
    },
    left: {
      left: -11, top: "50%", transform: "translateY(-50%)",
      borderRight: `6px solid ${vs.tailColor}`,
      borderTop: "6px solid transparent", borderBottom: "6px solid transparent",
    },
    right: {
      right: -11, top: "50%", transform: "translateY(-50%)",
      borderLeft: `6px solid ${vs.tailColor}`,
      borderTop: "6px solid transparent", borderBottom: "6px solid transparent",
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn("relative rounded-2xl px-4 py-3 shadow-lg", className)}
          style={{
            background: vs.bg,
            border: `2px solid ${vs.border}`,
            color: vs.color,
            fontFamily: "var(--font-island-body)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          }}
          initial={{ opacity: 0, scale: 0.88, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 4 }}
          transition={{ type: "spring", stiffness: 340, damping: 26 }}
        >
          {children}
          {/* Tail */}
          <div
            className="absolute"
            style={{
              width: 0,
              height: 0,
              ...tailStyles[tailDirection],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Floating notification bubble */
export function FloatingNotification({
  children,
  visible,
}: { children: ReactNode; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-24 right-6 z-50 max-w-xs"
          initial={{ opacity: 0, x: 40, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
        >
          <SpeechBubble tailDirection="right" variant="success">
            {children}
          </SpeechBubble>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
