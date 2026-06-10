"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ParchmentPanelProps {
  children: ReactNode;
  title?: string;
  titleEmoji?: string;
  className?: string;
  noPadding?: boolean;
}

export function ParchmentPanel({ children, title, titleEmoji, className, noPadding }: ParchmentPanelProps) {
  return (
    <div
      className={cn("panel-parchment overflow-hidden", className)}
    >
      {title && (
        <div
          className="flex items-center gap-2 border-b px-4 py-3"
          style={{
            borderColor: "var(--island-parchment-dark)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)",
          }}
        >
          {titleEmoji && <span className="text-xl">{titleEmoji}</span>}
          <h3
            className="text-sm font-black"
            style={{ color: "var(--island-sign-bg)", fontFamily: "var(--font-island-heading)" }}
          >
            {title}
          </h3>
          {/* Decorative corner pins */}
          <div className="ml-auto flex gap-1.5">
            {["bg-red-400", "bg-amber-400", "bg-emerald-400"].map((c, i) => (
              <div key={i} className={`size-2 rounded-full ${c} opacity-70 shadow-sm`} />
            ))}
          </div>
        </div>
      )}
      <div className={noPadding ? "" : "p-4"}>{children}</div>
    </div>
  );
}

/* Parchment inset card — for nested info blocks */
export function ParchmentInset({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("rounded-xl px-4 py-3", className)}
      style={{
        background: "rgba(255,255,255,0.55)",
        border: "1.5px solid var(--island-parchment-dark)",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </div>
  );
}
