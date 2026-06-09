"use client";

import { Card } from "@/components/ui/card";
import type { PotSlot } from "@/components/sections/farm-scene";
import type { AgentHistoryRow } from "@/lib/agent/types";
import { historyRowToCropCard } from "@/lib/agent/history-cards";

export function PlantedSummary({
  slots,
  historyRows = [],
  onClear,
}: {
  slots: PotSlot[];
  historyRows?: AgentHistoryRow[];
  onClear: (id: string) => void;
}) {
  const planted = slots.filter((s) => s.state !== "empty");
  const liveRows = historyRows.filter((row) => row.proofStatus === "live" || row.outcome === "success");
  const cards = liveRows.slice(0, 3).map((row) => historyRowToCropCard(row));
  if (!planted.length && !cards.length) return null;

  return (
    <Card className="p-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="kicker">Live garden record</p>
        <p className="text-[11px] text-[var(--text-subtle)]">{cards.length || planted.length} active</p>
      </div>
      {cards.length > 0 ? (
        <p className="mt-1 text-[11px] leading-5 text-[var(--text-subtle)]">
          Only executed moves appear here. Preview anchors stay in the decision log and in the assistant chat.
        </p>
      ) : null}
      {cards.length > 0 ? (
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.id} className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,244,0.95))] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg">{card.cropEmoji}</p>
                  <p className="mt-1 text-sm font-black text-[var(--text)]">{card.title}</p>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-black text-[var(--text-subtle)]">
                  {card.proofLabel}
                </span>
              </div>

              <div className="mt-3 grid gap-2 text-xs text-[var(--text-muted)]">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                  <span>Duration</span>
                  <span className="font-black text-[var(--text)]">{card.durationLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                  <span>PnL</span>
                  <span className="font-black text-[var(--text)]">{card.pnlLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                  <span>Agent</span>
                  <span className="font-black text-[var(--text)]">{card.agentLabel}</span>
                </div>
              </div>

              <p className="mt-3 text-[11px] leading-5 text-[var(--text-subtle)]">
                {card.actionLabel} on {card.pairLabel} via {card.protocolLabel}.
              </p>
            </div>
          ))}
        </div>
      ) : (
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
      )}
    </Card>
  );
}
