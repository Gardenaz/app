"use client";

import { useMutation } from "@tanstack/react-query";
import type { AgentDecision, CropId, RiskLevel } from "@/lib/agent/types";

export type GardenAgentResult = {
  intent: {
    user: `0x${string}`;
    message: string;
    parsedStrategy: CropId;
  };
  marketMood: { mood: "bullish" | "neutral" | "bearish"; weather: "sunny" | "cloudy" | "rainy"; reason: string };
  simulation: {
    crop: string;
    weather: "sunny" | "cloudy" | "rainy";
    background: string;
    actionLabel: string;
    potSlots: Array<{ strategyId: string; title: string; crop: string; apy: number; health: number; selected: boolean }>;
  };
  beginnerExplanation: string;
  effectivePolicy: { maxRiskLevel: RiskLevel; allowedProtocols: `0x${string}`[]; enabled: boolean };
  decision: AgentDecision;
};

type Payload = {
  user: `0x${string}`;
  message: string;
  amount: string;
  riskPreference: RiskLevel;
  execute?: boolean;
};

export function useGardenAgent() {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const res = await fetch("/api/agent/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, garden: true }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { ok: boolean; garden?: GardenAgentResult; error?: string };
      if (!json.ok || !json.garden) throw new Error(json.error ?? "garden agent failed");
      return json.garden;
    },
  });
}
