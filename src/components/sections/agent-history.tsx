"use client";

import { Card } from "@/components/ui/card";
import { useAgentHistory } from "@/hooks/use-agent-history";

export function AgentHistorySection() {
  const { data, isLoading } = useAgentHistory();

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-black">Decision History</h3>
      {isLoading ? <p className="text-sm text-[var(--text-muted)]">Loading history...</p> : null}
      <div className="grid gap-3">
        {(data ?? []).slice(0, 5).map((row) => (
          <Card key={row.decisionHash + row.createdAt}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-bold">{row.plan.title} • {row.policy.status.toUpperCase()}</div>
              <div className="text-xs text-[var(--text-muted)]">{new Date(row.createdAt).toLocaleString()}</div>
            </div>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{row.summary}</p>
            <p className="mt-2 text-xs break-all"><b>Decision:</b> {row.decisionHash}</p>
            {row.anchorTxHash ? <p className="mt-1 text-xs break-all"><b>Anchor Tx:</b> {row.anchorTxHash}</p> : null}
          </Card>
        ))}
        {(data ?? []).length === 0 ? <p className="text-sm text-[var(--text-muted)]">No decisions yet.</p> : null}
      </div>
    </section>
  );
}
