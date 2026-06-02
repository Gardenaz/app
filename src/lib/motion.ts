import type { Variants } from "framer-motion";

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const pageSwap: Variants = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: easeOutExpo } },
  exit: { opacity: 0, y: -10, filter: "blur(8px)", transition: { duration: 0.35 } },
};

export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delayChildren: 0.12, staggerChildren: 0.08 } },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOutExpo } },
};

export const cardHover: Variants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -4, scale: 1.012, transition: { type: "spring", stiffness: 220, damping: 18 } },
};

export const orbFloat: Variants = {
  animate: {
    y: [0, -14, 0, 10, 0],
    x: [0, 6, 0, -5, 0],
    scale: [1, 1.06, 1],
    transition: { duration: 9, ease: "easeInOut", repeat: Infinity },
  },
};

export const pulseDot: Variants = {
  animate: {
    opacity: [0.45, 1, 0.45],
    scale: [0.95, 1.12, 0.95],
    transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
  },
};
