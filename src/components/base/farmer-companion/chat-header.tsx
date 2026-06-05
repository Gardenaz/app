"use client";

import { ChevronDown, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";
import { FarmerSprite as FarmerSpriteView, MarketBadge as MarketBadgeView } from "@/components/base/farmer-companion-parts";

type FarmerCompanionChatHeaderProps = {
  isPending: boolean;
  isMinimized: boolean;
  pageViewLabel: string;
  agentData?: GardenAgentResult | null;
  moodIcon: string;
  onToggleMinimized: () => void;
  onClose: () => void;
};

export function FarmerCompanionChatHeader({
  isPending,
  isMinimized,
  pageViewLabel,
  agentData,
  moodIcon,
  onToggleMinimized,
  onClose,
}: FarmerCompanionChatHeaderProps) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-b border-[var(--border)] bg-gradient-to-r from-[var(--surface-soft)] to-[var(--surface)] px-4 py-3">
      <motion.div
        className="relative shrink-0 rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface-soft)] p-1.5 shadow-inner"
        animate={isPending ? { rotate: [-3, 3, -3] } : { rotate: 0 }}
        transition={{ duration: 0.45, repeat: isPending ? Infinity : 0 }}
      >
        <FarmerSpriteView mood={isPending ? "thinking" : "happy"} size={40} />
        <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-[var(--surface)] bg-[var(--surface)] text-[11px] leading-none">
          {moodIcon}
        </span>
      </motion.div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-sm font-black text-[var(--text)]">Garden Assistant</p>
          <Badge className="px-1.5 py-0.5 text-[9px]">AI Agent</Badge>
          <Badge className="px-1.5 py-0.5 text-[9px]">{pageViewLabel}</Badge>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <MarketBadgeView agentData={agentData ?? null} />
          {isPending && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-teal-600">
              <Loader2 className="size-3 animate-spin" /> Analyzing…
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={isMinimized ? "Expand" : "Minimize"}
          onClick={onToggleMinimized}
          className="flex size-7 items-center justify-center rounded-full border border-transparent bg-transparent text-[var(--text-muted)] transition hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
        >
          <ChevronDown className={`size-4 transition-transform duration-200 ${isMinimized ? "rotate-180" : ""}`} />
        </button>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex size-7 items-center justify-center rounded-full border border-transparent bg-transparent text-[var(--text-muted)] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
