"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAgentHistory } from "@/hooks/use-agent-history";

function statusTone(statusLabel: string) {
  if (statusLabel === "SUCCESS") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (statusLabel === "FAILED") return "border-red-200 bg-red-50 text-red-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

export function AgentHistorySection() {
  const { data, isLoading } = useAgentHistory();
  const rows = data ?? [];

  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="kicker">Decision log</p>
        <h3 className="mt-1 text-xl font-black text-[var(--text)]">Agent History</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Every logged move is anchored or recorded for audit review.
        </p>
      </div>

      {isLoading && (
        <Card className="p-4">
          <p className="text-sm font-bold text-[var(--text)]">Loading history...</p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">Reading onchain records from Mantle.</p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {rows.slice(0, 5).map((row) => (
          <Card key={row.decisionHash + row.createdAt} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge className={statusTone(row.statusLabel)}>{row.statusLabel}</Badge>
              <span className="text-xs text-[var(--text-muted)]">{new Date(row.createdAt).toLocaleString()}</span>
            </div>

            <div className="mt-3 flex flex-col gap-1">
              <p className="text-sm font-black text-[var(--text)]">{row.strategyTitle}</p>
              <p className="text-sm leading-6 text-[var(--text-muted)]">{row.summary}</p>
            </div>

            <Separator className="my-3" />

            <div className="grid gap-2 text-xs text-[var(--text-muted)] sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                <p className="font-black text-[var(--text)]">Strategy</p>
                <p className="mt-0.5">{row.strategyId}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                <p className="font-black text-[var(--text)]">Asset</p>
                <p className="mt-0.5">{row.asset}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                <p className="font-black text-[var(--text)]">Amount</p>
                <p className="mt-0.5">{row.amount}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
                <p className="font-black text-[var(--text)]">Risk</p>
                <p className="mt-0.5">{row.riskLevel}</p>
              </div>
            </div>

            <div className="mt-3 space-y-1 text-xs text-[var(--text-muted)]">
              <p className="truncate">
                <span className="font-bold">Hash:</span> {row.decisionHash}
              </p>
              {row.anchorTxHash && (
                <p className="truncate">
                  <span className="font-bold">Anchor Tx:</span> {row.anchorTxHash}
                </p>
              )}
              <p>
                <span className="font-bold">Protocol:</span> {row.protocol}
              </p>
            </div>
          </Card>
        ))}

        {!isLoading && rows.length === 0 && (
          <Card className="p-4">
            <p className="text-sm font-bold text-[var(--text)]">No decisions yet</p>
            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
              Generate a plan or plant a seed to create the first onchain audit entry.
            </p>
          </Card>
        )}
      </div>
    </section>
  );
}
