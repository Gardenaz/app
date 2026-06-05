"use client";

import { BadgeCheck, ShieldCheck, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type HeaderProps = {
  view: "canvas" | "shop" | "audit";
  mode: "guided" | "autopilot";
  executionStatus: "READY" | "PLANNED" | "PENDING" | "SENT" | "CONFIRMED" | "BLOCKED";
  plantedCount: number;
  isPending: boolean;
  onPlanSafeMove: () => void;
  onTopUp: () => void;
  canTopUp: boolean;
  onViewChange: (view: "canvas" | "shop" | "audit") => void;
  onModeChange: (mode: "guided" | "autopilot") => void;
  marketLabel: string;
  marketEmoji: string;
  agentReady: boolean;
};

export function LaunchHeaderCard({
  view,
  mode,
  executionStatus,
  plantedCount,
  isPending,
  onPlanSafeMove,
  onTopUp,
  canTopUp,
  onViewChange,
  onModeChange,
  marketLabel,
  marketEmoji,
  agentReady,
}: HeaderProps) {
  const currentTab = view === "canvas" ? "Plan" : view === "shop" ? "Vault" : "Proof";
  const actionLabel = mode === "guided" ? "Run plan" : "Run agent";

  return (
    <Card className="overflow-hidden border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,247,0.98))] p-0 shadow-[var(--shadow-md)]">
      <div className="p-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Gardenaz
              </span>
              <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text)]">
                {currentTab}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--primary-foreground)]">
                <BadgeCheck className="size-3.5" />
                Mantle Sepolia
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5">
                {marketEmoji} {marketLabel}
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5">
                {executionStatus}
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5">
                {agentReady ? "Agent ready" : "Finish setup"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" className="shrink-0 !px-4 !py-2" disabled={isPending} onClick={onPlanSafeMove}>
              <ShieldCheck className="size-4" />
              {actionLabel}
            </Button>
            <Button type="button" variant="secondary" className="shrink-0 !px-4 !py-2" disabled={!canTopUp} onClick={onTopUp}>
              <Sprout className="size-4" />
              {canTopUp ? "Claim gUSD" : "Cooling down"}
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Tabs value={view} onValueChange={(value) => onViewChange(value as HeaderProps["view"])}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="canvas">Plan</TabsTrigger>
              <TabsTrigger value="shop">Vault</TabsTrigger>
              <TabsTrigger value="audit">Proof</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-soft)] p-1">
            <button
              type="button"
              onClick={() => onModeChange("guided")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                mode === "guided" ? "bg-white text-[var(--text)] shadow-[var(--shadow-sm)]" : "text-[var(--text-muted)]"
              }`}
            >
              Guided
            </button>
            <button
              type="button"
              onClick={() => onModeChange("autopilot")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                mode === "autopilot" ? "bg-white text-[var(--text)] shadow-[var(--shadow-sm)]" : "text-[var(--text-muted)]"
              }`}
            >
              Autopilot
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
