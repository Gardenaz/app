"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useGarden } from "../garden-context";
import { IslandCanvas } from "@/components/island/island-canvas";
import { IslandHud } from "@/components/gamification/island-hud";
import { WoodenButton } from "@/components/gamification/wooden-button";

const BG: Record<string, string> = {
  stormy: "linear-gradient(180deg,#1E2C37 0%,#0F1E28 45%,#2A4030 100%)",
  rainy:  "linear-gradient(180deg,#2A4A5E 0%,#1D4E6B 45%,#3A6040 100%)",
  cloudy: "linear-gradient(180deg,#B8CEDD 0%,#D8E8F0 45%,#96C87A 100%)",
  sunny:  "linear-gradient(180deg,#5BC8F5 0%,#A8E4FF 35%,#C8F0A8 100%)",
};

const BANNER: Record<string, { text: string; highlight: string }> = {
  sunny:  { text: "Plant crops and earn yield on",  highlight: "your farm!" },
  cloudy: { text: "Stable market — steady yields on", highlight: "your farm!" },
  rainy:  { text: "Bear season — protect assets on",  highlight: "your farm!" },
  stormy: { text: "High volatility — hedge risk on",   highlight: "your farm!" },
};

export default function GardenPage() {
  const g = useGarden();
  const banner = BANNER[g.weather] ?? BANNER.sunny;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
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

      {/* Promo banner — parchment + island-gold, matches island palette */}
      <div className="px-4 pt-3">
        <motion.div
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{
            background: "rgba(245,237,204,0.95)",
            border: "1.5px solid rgba(196,154,20,0.35)",
            boxShadow: "var(--shadow-sm)",
          }}
          key={g.weather}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Coin icon circle */}
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-lg"
            style={{
              background: "rgba(196,154,20,0.18)",
              border: "1px solid rgba(196,154,20,0.3)",
            }}
          >
            🌾
          </div>

          <p className="flex-1 text-[11px] font-bold leading-snug" style={{ color: "var(--island-sign-bg)" }}>
            {banner.text}{" "}
            <span style={{ color: "var(--island-gold-dark)" }}>{banner.highlight}</span>
          </p>

          {/* Arrow button */}
          <motion.div
            className="flex size-8 shrink-0 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(135deg,#F5C842,#E8A012)" }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight className="size-4" style={{ color: "var(--island-sign-bg)" }} strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </div>

      {/* Canvas */}
      <div className="min-h-0 flex-1 px-4 pt-3">
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

      {/* Big CTA button — wooden, matches island palette */}
      <div className="px-4 pb-3 pt-2">
        <WoodenButton variant="primary" size="lg" className="w-full text-[14px]">
          {g.weather === "sunny"
            ? "🌾 See Market Insights"
            : g.weather === "stormy"
            ? "⛈️ View Risk Report"
            : "📊 See Market Insights"}
        </WoodenButton>
      </div>
    </div>
  );
}
