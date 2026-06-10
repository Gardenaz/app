"use client";

import { useGarden } from "../garden-context";
import { AgentHistorySection } from "@/components/sections/agent-history";
import { PlantedSummary } from "@/components/launch/canvas/planted-summary";
import { ParchmentPanel, ParchmentInset } from "@/components/gamification/parchment-panel";
import {
  getExecutionGardenLabel,
  getOperationLabel,
  getPreviewStepLabel,
} from "@/lib/launch/launch-actions";

const PAGE_BG: Record<string, string> = {
  stormy: "linear-gradient(180deg,#1E2C37 0%,#0F1E28 45%,#2A4030 100%)",
  rainy:  "linear-gradient(180deg,#2A4A5E 0%,#1D4E6B 45%,#3A6040 100%)",
  cloudy: "linear-gradient(180deg,#B8CEDD 0%,#D8E8F0 45%,#96C87A 100%)",
  sunny:  "linear-gradient(180deg,#5BC8F5 0%,#A8E4FF 35%,#C8F0A8 100%)",
};

export default function HistoryPage() {
  const g = useGarden();

  return (
    <div
      className="min-h-[calc(100svh-4rem-4rem)]"
      style={{ background: PAGE_BG[g.weather] ?? PAGE_BG.sunny }}
    >
      <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 xl:grid-cols-3">

        {/* Planted crops — full width */}
        <div className="col-span-full">
          <PlantedSummary
            slots={g.slots}
            historyRows={g.historyData ?? []}
            onClear={g.handleClearSlot}
          />
        </div>

        {/* Assistant Preview */}
        <ParchmentPanel titleEmoji="📜" title="Route Preview">
          <h3
            className="text-sm font-black"
            style={{ color: "var(--island-sign-bg)", fontFamily: "var(--font-island-heading)" }}
          >
            {g.preview ? "Summary ready" : "No route preview yet"}
          </h3>
          <p className="mt-2 text-xs leading-5" style={{ color: "var(--island-wood)" }}>
            {g.preview
              ? "Route summary, policy checks, and proof note appear in the assistant chat."
              : "Preview a plan from the Quests page to see what the agent plans next."}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <ParchmentInset>
              <p className="text-[10px] font-black" style={{ color: "var(--island-sign-bg)" }}>
                Move kind
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--island-wood)" }}>
                {getExecutionGardenLabel(g.previewOperation)} / {getOperationLabel(g.previewOperation)}
              </p>
            </ParchmentInset>
            <ParchmentInset>
              <p className="text-[10px] font-black" style={{ color: "var(--island-sign-bg)" }}>
                Preview state
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--island-wood)" }}>
                {g.previewMode ? getPreviewStepLabel(g.previewMode) : "Waiting for preview"}
              </p>
            </ParchmentInset>
          </div>
        </ParchmentPanel>

        {/* On-chain Proof */}
        <ParchmentPanel titleEmoji="⛓️" title="On-chain Proof">
          <div className="space-y-2">
            <ParchmentInset>
              <p className="text-[10px] font-black" style={{ color: "var(--island-sign-bg)" }}>Anchor</p>
              <p className="mt-1 text-xs" style={{ color: "var(--island-wood)" }}>
                {g.preview?.anchor?.note ?? "No proof note yet."}
              </p>
              {g.preview?.anchor?.txHash && (
                <p className="mt-1 break-all text-[10px]" style={{ color: "var(--island-wood)" }}>
                  {g.preview.anchor.txHash}
                </p>
              )}
            </ParchmentInset>
            <ParchmentInset>
              <p className="text-[10px] font-black" style={{ color: "var(--island-sign-bg)" }}>
                Execution
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--island-wood)" }}>
                {g.preview?.execution?.note ?? "No execution request yet."}
              </p>
              {g.preview?.execution?.executionTxHash && (
                <p className="mt-1 break-all text-[10px]" style={{ color: "var(--island-wood)" }}>
                  {g.preview.execution.executionTxHash}
                </p>
              )}
            </ParchmentInset>
            <ParchmentInset>
              <p className="text-[10px] font-black" style={{ color: "var(--island-sign-bg)" }}>
                Policy result
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--island-wood)" }}>
                {g.preview?.decision.policy.reason ?? "No policy result yet."}
              </p>
            </ParchmentInset>
          </div>
        </ParchmentPanel>

        {/* Full agent history — full width */}
        <div className="col-span-full">
          <AgentHistorySection rows={g.historyData} isLoading={g.historyLoading} />
        </div>

      </div>
    </div>
  );
}
