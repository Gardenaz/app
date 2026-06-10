"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WoodenButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: {
    background: "linear-gradient(180deg, var(--island-wood-light) 0%, var(--island-wood) 55%, var(--island-earth-dark) 100%)",
    border: "2px solid var(--island-earth-dark)",
    borderBottom: "4px solid color-mix(in srgb, var(--island-wood) 50%, black)",
    color: "var(--island-sign-text)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
  },
  secondary: {
    background: "linear-gradient(180deg, var(--island-parchment) 0%, var(--island-parchment-dark) 100%)",
    border: "2px solid var(--island-parchment-dark)",
    borderBottom: "4px solid color-mix(in srgb, var(--island-parchment-dark) 70%, black)",
    color: "var(--island-sign-bg)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.45)",
  },
  danger: {
    background: "linear-gradient(180deg, #E87070 0%, #C8504A 55%, #9E3C38 100%)",
    border: "2px solid #9E3C38",
    borderBottom: "4px solid color-mix(in srgb, #C8504A 50%, black)",
    color: "#FFF3DC",
    boxShadow: "0 4px 12px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
  },
};

const sizeStyles = {
  sm: { padding: "0.35rem 0.8rem",  fontSize: "0.75rem",  minHeight: "2.25rem" },
  md: { padding: "0.625rem 1.25rem", fontSize: "0.875rem", minHeight: "2.75rem" },
  lg: { padding: "0.75rem 1.75rem", fontSize: "1rem",     minHeight: "3rem"   },
};

export function WoodenButton({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  onClick,
  type = "button",
  ...props
}: WoodenButtonProps) {
  const vs = variantStyles[variant];
  const ss = sizeStyles[size];

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn("inline-flex items-center justify-center gap-2 rounded-xl font-black tracking-wide select-none whitespace-nowrap", className)}
      style={{
        ...vs,
        ...ss,
        fontFamily: "var(--font-island-heading)",
        textShadow: "0 1px 2px rgba(0,0,0,0.4)",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        WebkitTapHighlightColor: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      whileHover={!disabled ? { y: -2, boxShadow: "0 7px 20px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.18)" } : {}}
      whileTap={!disabled ? { y: 1, boxShadow: "0 2px 6px rgba(0,0,0,0.2)" } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      {...(props as object)}
    >
      {children}
    </motion.button>
  );
}
