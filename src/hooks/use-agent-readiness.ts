"use client";

import { useQuery } from "@tanstack/react-query";
import type { AgentLiveReadiness } from "@gardenaz/agent-types";

export function useAgentReadiness() {
  return useQuery({
    queryKey: ["agent-readiness"],
    queryFn: async () => {
      const res = await fetch("/api/agent/readiness", { cache: "no-store" });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        readiness?: AgentLiveReadiness;
        error?: string;
      };
      if (!res.ok || !json.ok || !json.readiness) {
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }
      return json.readiness;
    },
    refetchInterval: 20_000,
  });
}
