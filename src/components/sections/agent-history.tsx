"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAgentHistory } from "@/hooks/use-agent-history";
import type { AgentHistoryRow } from "@/lib/agent/types";
import { historyRowToCropCard } from "@/lib/agent/history-cards";

function statusTone(statusLabel: string) {
  if (statusLabel === "SUCCESS") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (statusLabel === "FAILED") return "border-red-200 bg-red-50 text-red-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

type Props = {
  rows?: AgentHistoryRow[];
  isLoading?: boolean;
};

export function AgentHistorySection({ rows: rowsProp, isLoading: loadingProp }: Props) {
  const query = useAgentHistory();
  const rows = rowsProp ?? query.data ?? [];
  const isLoading = loadingProp ?? query.isLoading;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="kicker">Decision log</p>
        <h3 className="mt-1 text-xl font-black text-[var(--text)]">What the agent did</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          A short record of the latest moves, with the reason, amount, and proof trail still attached.
        </p>
      </div>

      {isLoading && (
        <Card className="p-4">
          <p className="text-sm font-bold text-[var(--text)]">Loading recent activity...</p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">Reading the latest records from Mantle.</p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {rows.slice(0, 5).map((row) => {
          const card = historyRowToCropCard(row);
          return (
            <Card key={row.decisionHash + row.createdAt} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge className={statusTone(row.statusLabel)}>{row.statusLabel}</Badge>
                <span className="text-xs text-[var(--text-muted)]">{new Date(row.createdAt).toLocaleString()}</span>
              </div>

              <div className="mt-3 flex flex-col gap-1">
                <p className="text-sm font-black text-[var(--text)]">{card.cropEmoji} {row.strategyTitle}</p>
                <p className="text-sm leading-6 text-[var(--text-muted)]">{row.summary}</p>
              </div>

              <Separator className="my-3" />

              <div className="grid gap-2 text-xs text-[var(--text-muted)] sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                  <p className="font-black text-[var(--text)]">Crop age</p>
                  <p className="mt-0.5">{card.durationLabel}</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                  <p className="font-black text-[var(--text)]">PnL</p>
                  <p className="mt-0.5">{card.pnlLabel}</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                  <p className="font-black text-[var(--text)]">Proof</p>
                  <p className="mt-0.5">{card.proofLabel}</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                  <p className="font-black text-[var(--text)]">Move</p>
                  <p className="mt-0.5">{card.actionLabel}</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                  <p className="font-black text-[var(--text)]">Pair</p>
                  <p className="mt-0.5">{card.pairLabel}</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                  <p className="font-black text-[var(--text)]">ERC-8004</p>
                  <p className="mt-0.5">{card.agentLabel}</p>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-xs text-[var(--text-muted)]">
                <p className="truncate">
                  <span className="font-bold">Decision record:</span> {row.decisionHash}
                </p>
                {row.anchorTxHash && (
                  <p className="truncate">
                    <span className="font-bold">Mantle transaction:</span> {row.anchorTxHash}
                  </p>
                )}
                <p>
                  <span className="font-bold">Managed through:</span> {row.protocol}
                </p>
                <p>
                  <span className="font-bold">Amount moved:</span> {row.amount}
                </p>
              </div>
            </Card>
          );
        })}

        {!isLoading && rows.length === 0 && (
          <Card className="p-4">
            <p className="text-sm font-bold text-[var(--text)]">No agent moves yet</p>
            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
              Connect a wallet, preview the first move, and the first proof-backed crop card will appear here.
            </p>
          </Card>
        )}
      </div>
    </section>
  );
}
