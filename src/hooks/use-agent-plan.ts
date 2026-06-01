"use client";

import { useMutation } from "@tanstack/react-query";
import type { AgentDecision, CropId, RiskLevel } from "@/lib/agent/types";

type Payload = { user: `0x${string}`; crop: CropId; amount: string; riskPreference: RiskLevel };

export function useAgentPlan() {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const res = await fetch("/api/agent/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { ok: boolean; decision: AgentDecision; error?: string };
      if (!json.ok) throw new Error(json.error ?? "agent failed");
      return json.decision;
    },
  });
}
