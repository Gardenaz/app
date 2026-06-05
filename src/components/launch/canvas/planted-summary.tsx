"use client";

import { Card } from "@/components/ui/card";
import type { PotSlot } from "@/components/sections/farm-scene";

export function PlantedSummary({ slots, onClear }: { slots: PotSlot[]; onClear: (id: string) => void }) {
  const planted = slots.filter((s) => s.state !== "empty");
  if (!planted.length) return null;

  return (
    <Card className="p-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="kicker">Filled pots</p>
        <p className="text-[11px] text-[var(--text-subtle)]">{planted.length} active</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {planted.map((s) => (
          <div key={s.id} className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5">
            <span className="text-sm">{s.crop === "Rice" ? "🌾" : s.crop === "Corn" ? "🌽" : "🌶️"}</span>
            <div>
              <p className="text-xs font-black text-[var(--text)]">{s.crop}</p>
              <p className="text-[9px] font-bold text-[var(--text-subtle)]">{s.apy.toFixed(1)}% · {s.asset}</p>
            </div>
            <button
              type="button"
              onClick={() => onClear(s.id)}
              className="ml-1 rounded-full p-0.5 text-[var(--text-subtle)] transition hover:bg-white hover:text-[var(--danger)]"
              aria-label={`Remove ${s.crop}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
