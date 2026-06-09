"use client";

import { useMutation } from "@tanstack/react-query";
import type { AutopilotPolicy } from "@/lib/agent/autopilot";
import type { AgentDecision, CropId, RiskLevel } from "@/lib/agent/types";
import type { ExecutionOperation } from "@/lib/launch/launch-actions";

type Payload = {
  user: `0x${string}`;
  crop: CropId;
  amount: string;
  riskPreference: RiskLevel;
  execute?: boolean;
  currentPositionId?: string;
  policy?: AutopilotPolicy;
};
type AgentPlanResponse = {
  decision: AgentDecision;
  anchor?: { enabled: boolean; txHash: `0x${string}` | null; note: string; mode?: "prepared" | "sent"; calldata?: `0x${string}` };
  execution?: {
    enabled: boolean;
    mode: "disabled" | "blocked" | "prepared" | "sent";
    note: string;
    operation: ExecutionOperation;
    approval?: {
      token: `0x${string}`;
      spender: `0x${string}`;
      amount: string;
      calldata: `0x${string}`;
    };
    target?: `0x${string}`;
    calldata?: `0x${string}`;
    executionTxHash?: `0x${string}`;
    preview?: {
      strategyId?: string;
      pair?: string;
      asset?: string;
      amount?: string;
      user?: `0x${string}`;
      tokenIn?: string;
      tokenOut?: string;
      quotedInputAmount?: string;
      quotedOutputAmount?: string;
      minimumOutputAmount?: string;
      feeTier?: number;
      slippageBps?: number;
      deadline?: number;
    };
  };
  outcome?: { txHash: `0x${string}` } | null;
  source?: string;
};

export function useAgentPlan() {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const res = await fetch("/api/agent/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { ok: boolean; decision: AgentDecision; anchor?: AgentPlanResponse["anchor"]; execution?: AgentPlanResponse["execution"]; outcome?: AgentPlanResponse["outcome"]; source?: string; error?: string };
      if (!json.ok) throw new Error(json.error ?? "agent failed");
      return json;
    },
  });
}
