"use client";

import { Activity, Database, WifiOff } from "lucide-react";
import { useHealth } from "@/hooks/use-health";
import { cn } from "@/lib/utils";

export function SystemStatus({ compact = false }: { compact?: boolean }) {
  const { data, isLoading, error } = useHealth();
  const online = Boolean(data?.ok && !error);
  const label = isLoading ? "Checking" : online ? "API online" : "Offline";
  const detail = isLoading ? "Syncing health" : online ? `Database ${data?.db}` : "Health check failed";
  const Icon = error ? WifiOff : Activity;

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition-colors",
          online
            ? "border-emerald-200 bg-emerald-50 text-[var(--primary-strong)]"
            : "border-amber-200 bg-amber-50 text-amber-700",
        )}
      >
        <span className={cn("size-2 rounded-full", online ? "bg-[var(--primary)]" : "bg-amber-500")} />
        {label}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white/82 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--border-strong)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-strong)]">
            <Icon className="size-4" aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-black text-[var(--text)]">System Status</div>
            <div className="mt-1 text-sm text-[var(--text-muted)]">{detail}</div>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-xs font-bold text-[var(--primary-strong)]">
          <Database className="size-3.5" aria-hidden="true" />
          Live
        </div>
      </div>
    </div>
  );
}
