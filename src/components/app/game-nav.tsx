"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/app/garden", icon: "🌿", label: "Garden" },
  { href: "/app/quests", icon: "📋", label: "Quests" },
  { href: "/app/history", icon: "📜", label: "History" },
  { href: "/settings", icon: "⚙️", label: "Settings" },
] as const;

export function GameNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        height: "4rem",
        background: "linear-gradient(180deg, #8B5E3C 0%, #6B4423 100%)",
        borderTop: "3px solid #4A2E12",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
        fontFamily: "var(--font-island-heading)",
      }}
    >
      {/* Wood grain overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(255,255,255,0.015) 48px, rgba(255,255,255,0.015) 50px)",
        }}
      />

      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/settings" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center gap-0.5 px-6 py-2 transition-all duration-150"
            style={{ opacity: isActive ? 1 : 0.55 }}
          >
            {isActive && (
              <motion.div
                layoutId="game-nav-pip"
                className="absolute -top-[3px] inset-x-2 h-[3px] rounded-b-full"
                style={{ background: "var(--island-gold, #F5C842)" }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}

            <motion.span
              className="text-xl leading-none"
              animate={isActive ? { scale: [1, 1.18, 1] } : { scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {item.icon}
            </motion.span>

            <span
              className="text-[9px] font-black uppercase tracking-widest"
              style={{
                color: isActive ? "#F5E8C0" : "rgba(255,240,200,0.5)",
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
