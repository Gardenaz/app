"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sprout, ScrollText, History, Settings, Leaf } from "lucide-react";

const NAV_ITEMS = [
  { href: "/app/garden",  Icon: Sprout,     label: "Garden"   },
  { href: "/app/quests",  Icon: ScrollText, label: "Quests"   },
  { href: "/app/history", Icon: History,    label: "History"  },
  { href: "/settings",    Icon: Settings,   label: "Settings" },
] as const;

export function GameNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-3"
      style={{
        height: "4rem",
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 -2px 20px rgba(0,0,0,0.07)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/settings" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5"
          >
            <motion.div
              className="flex items-center justify-center rounded-2xl px-4 py-1.5"
              animate={isActive
                ? { background: "rgba(30,30,30,0.88)", scale: 1 }
                : { background: "transparent", scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <item.Icon
                className="size-[20px]"
                style={{
                  color: isActive ? "#FFFFFF" : "#B8C2CC",
                  strokeWidth: 2,
                }}
              />
            </motion.div>
            <span
              className="text-[9px] font-bold"
              style={{ color: isActive ? "#1E1E1E" : "#B8C2CC" }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
