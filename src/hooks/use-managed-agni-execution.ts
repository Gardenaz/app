"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AutopilotPolicy } from "@/lib/agent/autopilot";
import type { CropId, RiskLevel } from "@/lib/agent/types";

type Payload = {
  user: `0x${string}`;
  crop: CropId;
  amount: string;
  riskPreference: RiskLevel;
  currentPositionId?: string;
  policy: AutopilotPolicy;
};

export function useManagedAgniExecution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const res = await fetch("/api/agent/managed-execute", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }
      await queryClient.invalidateQueries({ queryKey: ["agent-history"] });
      return json;
    },
  });
}
