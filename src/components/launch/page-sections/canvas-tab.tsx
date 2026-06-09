"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { FarmScene, CROP_OPTIONS, type PotSlot, type WeatherMood } from "@/components/sections/farm-scene";
import { PlantedSummary } from "@/components/launch/canvas/planted-summary";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";
import type { CropOptionId } from "@/lib/launch/launch-actions";

type CanvasProps = {
  weather: WeatherMood;
  slots: PotSlot[];
  agentData?: GardenAgentResult | null;
  selectedId: string | null;
  isLoading: boolean;
  onSlotClick: (slot: PotSlot) => void;
  onCropPick: (slotId: string, cropId: CropOptionId) => void;
  onQuickPick: (cropId: CropOptionId) => void;
  onClearSlot: (id: string) => void;
  onOpenShop: () => void;
  onOpenAudit: () => void;
};

export function LaunchCanvasTab({
  weather,
  slots,
  agentData,
  selectedId,
  isLoading,
  onSlotClick,
  onCropPick,
  onQuickPick,
  onClearSlot,
  onOpenShop,
  onOpenAudit,
}: CanvasProps) {
  const selectedSlot = selectedId ? slots.find((slot) => slot.id === selectedId) ?? null : null;

  return (
    <TabsContent value="canvas" className="mt-0">
      <div className="space-y-4">
        <Card className="overflow-hidden p-0">
          <div className="p-3 sm:p-4">
            <FarmScene
              weather={weather}
              slots={slots}
              agentData={agentData}
              onSlotClick={onSlotClick}
              onCropPick={onCropPick}
              selectedSlotId={selectedId}
              isLoading={isLoading}
            />
          </div>
        </Card>

        <Card className="border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,247,245,0.96))] p-4 shadow-[var(--shadow-md)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="kicker">Plan</p>
              <div className="mt-1 flex items-center gap-2">
                <ShieldCheck className="size-4 text-[var(--primary-foreground)]" />
                <p className="text-sm font-black text-[var(--text)]">What the agent sees next</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                {agentData?.decision.summary ?? agentData?.beginnerExplanation ?? "Pick a slot or let the agent suggest a safe lane first."}
              </p>
              <p className="mt-2 text-[11px] text-[var(--text-subtle)]">
                {selectedSlot ? `Selected ${selectedSlot.id}` : "No slot selected"}
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 lg:max-w-[520px]">
              {CROP_OPTIONS.map((opt) => (
                <Button
                  key={opt.id}
                  type="button"
                  variant={opt.id === "steady" ? "primary" : "secondary"}
                  className="justify-between"
                  onClick={() => onQuickPick(opt.id)}
                >
                  <span className="flex items-center gap-2">
                    <span>{opt.emoji}</span>
                    {opt.crop}
                  </span>
                  <span className="text-xs opacity-80">{opt.apy}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-[var(--border)] pt-4 sm:flex-row">
            <Button type="button" variant="primary" onClick={onOpenShop}>
              Open garden
            </Button>
            <Button type="button" variant="secondary" onClick={onOpenAudit}>
              Open proof
            </Button>
          </div>
        </Card>

        <PlantedSummary slots={slots} onClear={onClearSlot} />
      </div>
    </TabsContent>
  );
}
