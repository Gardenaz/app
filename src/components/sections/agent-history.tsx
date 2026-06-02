"use client";

import { useAgentHistory } from "@/hooks/use-agent-history";

export function AgentHistorySection() {
  const { data, isLoading } = useAgentHistory();
  const rows = data ?? [];

  return (
    <section className="space-y-4">
      <div>
        <p className="kicker">Decision log</p>
        <h3 className="mt-1 text-xl font-black text-[var(--text)]">Agent History</h3>
      </div>

      {isLoading && (
        <p className="text-sm text-[var(--text-muted)]">Loading history...</p>
      )}

      <div className="space-y-3">
        {rows.slice(0, 5).map((row) => (
          <div key={row.decisionHash + row.createdAt} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-black ${
                  row.policy?.status === "approved"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {(row.policy?.status ?? "unknown").toUpperCase()}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {new Date(row.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-sm font-bold text-[var(--text)]">
              {row.plan?.title ?? "Unknown strategy"}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{row.summary}</p>
            <p className="mt-2 truncate text-xs text-[var(--text-muted)]">
              <span className="font-bold">Hash:</span> {row.decisionHash}
            </p>
            {row.anchorTxHash && (
              <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
                <span className="font-bold">Anchor Tx:</span> {row.anchorTxHash}
              </p>
            )}
          </div>
        ))}
        {!isLoading && rows.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">No decisions yet. Generate a plan to get started.</p>
        )}
      </div>
    </section>
  );
}
