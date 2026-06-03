"use client";

import { useQuery } from "@tanstack/react-query";
import type { AgentHistoryRow } from "@/lib/agent/types";

export function useAgentHistory() {
  return useQuery({
    queryKey: ["agent-history"],
    queryFn: async () => {
      const res = await fetch("/api/agent/history", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { ok: boolean; rows: AgentHistoryRow[]; source?: string };
      return json.rows ?? [];
    },
    refetchInterval: 15_000,
  });
}
