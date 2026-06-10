"use client";

import { useGarden } from "../garden-context";
import { IslandCanvas } from "@/components/island/island-canvas";
import { IslandHud } from "@/components/gamification/island-hud";
import { ParchmentPanel, ParchmentInset } from "@/components/gamification/parchment-panel";

const BG: Record<string, string> = {
  stormy: "linear-gradient(180deg,#1E2C37 0%,#0F1E28 45%,#2A4030 100%)",
  rainy: "linear-gradient(180deg,#2A4A5E 0%,#1D4E6B 45%,#3A6040 100%)",
  cloudy: "linear-gradient(180deg,#B0C4CC 0%,#D0DDE5 45%,#8AB878 100%)",
  sunny: "linear-gradient(180deg,#87CEEB 0%,#D4EFF9 45%,#7CC548 100%)",
};

export default function GardenPage() {
  const g = useGarden();

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        /* 4rem = AppNavbar, 4rem = GameNav (fixed) */
        height: "calc(100svh - 4rem - 4rem)",
        background: BG[g.weather] ?? BG.sunny,
      }}
    >
      <IslandHud
        weather={g.weather}
        stepsComplete={g.steps.filter((s) => s.complete).length}
        totalSteps={g.steps.length}
        amount={g.amount}
        executionStatus={g.executionStatus}
        isConnected={Boolean(g.address)}
      />

      {/* Canvas — fills all remaining space */}
      <div className="min-h-0 flex-1 p-3">
        <IslandCanvas
          weather={g.weather}
          slots={g.slots}
          agentData={g.data}
          selectedSlotId={g.selectedSlotId}
          isLoading={g.isPending}
          onSlotClick={g.handleSlotClick}
          onCropPick={g.handleCropPick}
          fullscreen
          className="h-full"
        />
      </div>

      {/* Market weather strip */}
      <div className="px-3 pb-3">
        <ParchmentPanel titleEmoji="🌤️" title="Market Weather">
          <div className="grid grid-cols-3 gap-3">
            <ParchmentInset>
              <p className="text-xs font-black" style={{ color: "var(--island-sign-bg)" }}>
                {g.marketEmojiText} {g.marketLabelText}
              </p>
              <p className="mt-1 text-[10px]" style={{ color: "var(--island-wood)" }}>Market</p>
            </ParchmentInset>
            <ParchmentInset>
              <p className="text-xs font-black" style={{ color: "var(--island-sign-bg)" }}>
                {g.executionStatus}
              </p>
              <p className="mt-1 text-[10px]" style={{ color: "var(--island-wood)" }}>Agent</p>
            </ParchmentInset>
            <ParchmentInset>
              <p className="text-xs font-black" style={{ color: "var(--island-sign-bg)" }}>
                {g.flowState.hasPolicy ? "Policy ✓" : "Need policy"}
              </p>
              <p className="mt-1 text-[10px]" style={{ color: "var(--island-wood)" }}>Setup</p>
            </ParchmentInset>
          </div>
        </ParchmentPanel>
      </div>
    </div>
  );
}
