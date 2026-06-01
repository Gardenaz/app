"use client";

import { useHealth } from "@/hooks/use-health";

export function SystemStatus() {
  const { data, isLoading, error } = useHealth();
  return (
    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
      <div className="font-bold">System Status</div>
      <div className="mt-1 text-emerald-100/70">{isLoading ? "Checking..." : error ? "Offline" : `API online · ${data?.db}`}</div>
    </div>
  );
}
