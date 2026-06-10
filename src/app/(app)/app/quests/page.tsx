"use client";

import { useGarden } from "../garden-context";
import { QuestBoard } from "@/components/gamification/quest-board";
import { ParchmentPanel, ParchmentInset } from "@/components/gamification/parchment-panel";
import { WoodenButton } from "@/components/gamification/wooden-button";
import { CROP_OPTIONS } from "@/components/sections/farm-scene";
import { getCropRisk, getNextEmptySlotId } from "@/lib/launch/launch-actions";

const PAGE_BG: Record<string, string> = {
  stormy: "linear-gradient(180deg,#1E2C37 0%,#0F1E28 45%,#2A4030 100%)",
  rainy:  "linear-gradient(180deg,#2A4A5E 0%,#1D4E6B 45%,#3A6040 100%)",
  cloudy: "linear-gradient(180deg,#B8CEDD 0%,#D8E8F0 45%,#96C87A 100%)",
  sunny:  "linear-gradient(180deg,#5BC8F5 0%,#A8E4FF 35%,#C8F0A8 100%)",
};

export default function QuestsPage() {
  const g = useGarden();

  return (
    <div
      className="min-h-[calc(100svh-4rem-4rem)]"
      style={{ background: PAGE_BG[g.weather] ?? PAGE_BG.sunny }}
    >
      <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 xl:grid-cols-3">

        <div className="col-span-full">
          <QuestBoard steps={g.steps} />
        </div>

        {/* Garden Plan — crop lane picker */}
        <ParchmentPanel titleEmoji="🗺️" title="Garden Plan">
          <p className="mb-3 text-sm leading-6" style={{ color: "var(--island-wood)" }}>
            Pick a lane, then ask the assistant for the preview note.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {CROP_OPTIONS.map((option) => (
              <WoodenButton
                key={option.id}
                variant={g.activeCrop === option.id ? "primary" : "secondary"}
                size="sm"
                className="h-auto w-full flex-col gap-0.5 py-3"
                onClick={() => {
                  const nextSlot = getNextEmptySlotId(g.slots);
                  if (!nextSlot) {
                    g.launchSettings.setLane(option.id);
                    g.launchSettings.setRisk(getCropRisk(option.id));
                    return;
                  }
                  g.handleCropPick(nextSlot, option.id);
                }}
              >
                <span className="text-2xl leading-none">{option.emoji}</span>
                <span className="text-xs font-black">{option.crop}</span>
                <span className="text-[10px] opacity-75">{option.apy}</span>
              </WoodenButton>
            ))}
          </div>
        </ParchmentPanel>

        {/* Launch Settings */}
        <ParchmentPanel titleEmoji="⚙️" title="Launch Settings" noPadding>
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            <ParchmentInset>
              <p
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: "var(--island-wood)" }}
              >
                Default amount
              </p>
              <input
                value={g.amount}
                onChange={(e) => g.launchSettings.setAmount(e.target.value)}
                className="mt-2 w-full bg-transparent text-lg font-black outline-none"
                style={{ color: "var(--island-sign-bg)", fontFamily: "var(--font-island-heading)" }}
              />
            </ParchmentInset>
            <ParchmentInset>
              <p
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: "var(--island-wood)" }}
              >
                Selected lane
              </p>
              <p className="mt-2 text-sm font-black" style={{ color: "var(--island-sign-bg)" }}>
                {g.selectedCrop?.crop ?? "Rice"} · {g.selectedCrop?.asset ?? "USDC"}
              </p>
            </ParchmentInset>
          </div>

          <div className="grid gap-2 px-4 pb-3">
            {(
              [
                { id: "steady" as const, label: "🌾 Safe lane", note: "4–6% APY · USDC" },
                { id: "growth" as const, label: "🌽 Growth lane", note: "7–11% APY · WMNT" },
                { id: "boost" as const, label: "🌶️ Dynamic lane", note: "12–20% APY · LP" },
              ] as const
            ).map((lane) => (
              <WoodenButton
                key={lane.id}
                variant={g.activeCrop === lane.id ? "primary" : "secondary"}
                size="sm"
                className="w-full justify-between"
                onClick={() => {
                  g.launchSettings.setLane(lane.id);
                  g.launchSettings.setRisk(getCropRisk(lane.id));
                }}
              >
                <span>{lane.label}</span>
                <span className="text-xs opacity-75">{lane.note}</span>
              </WoodenButton>
            ))}
          </div>

          <div className="grid gap-2 px-4 pb-4">
            {(
              [
                { id: "wallet" as const, label: "🔑 Wallet execution", note: "You approve each move." },
                { id: "managed" as const, label: "🤖 Managed autopilot", note: "Executor wallet mode." },
              ] as const
            ).map((opt) => (
              <WoodenButton
                key={opt.id}
                variant={g.executionAuthority === opt.id ? "primary" : "secondary"}
                size="sm"
                className="w-full justify-between"
                onClick={() => g.launchSettings.setExecutionAuthority(opt.id)}
              >
                <span>{opt.label}</span>
                <span className="text-xs opacity-75">{opt.note}</span>
              </WoodenButton>
            ))}
          </div>
        </ParchmentPanel>

        {/* Ready Check */}
        <ParchmentPanel titleEmoji="🛡️" title="Ready Check">
          <ParchmentInset>
            <p className="text-[10px] font-black" style={{ color: "var(--island-sign-bg)" }}>
              {g.readiness.data
                ? `${g.executionAuthority === "managed" ? "Managed" : "Wallet"} mode: ${g.modeReadiness?.status ?? "blocked"}`
                : g.readiness.isLoading
                  ? "Checking relayer..."
                  : "Readiness not loaded yet."}
            </p>
            <p className="mt-1 text-[10px]" style={{ color: "var(--island-wood)" }}>
              {g.readinessLabel}
            </p>
            {g.managedModeMismatch && (
              <p className="mt-2 text-[10px]" style={{ color: "var(--danger, #DC2626)" }}>
                Managed mode only works when the connected wallet matches the configured executor wallet.
              </p>
            )}
          </ParchmentInset>
        </ParchmentPanel>

      </div>
    </div>
  );
}
