"use client";

import { Fingerprint } from "lucide-react";
import { AgentHistorySection } from "@/components/sections/agent-history";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import type { FarmerCompanionContext } from "@/components/base/farmer-companion";

type AuditProps = {
  assistantContext: FarmerCompanionContext;
};

export function LaunchAuditTab({ assistantContext }: AuditProps) {
  return (
    <TabsContent value="audit" className="mt-0">
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="kicker">Proof</p>
              <h3 className="mt-0.5 text-sm font-black text-[var(--text)]">Latest actions and on-chain record</h3>
              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                Open this only when you want to check what happened and what was recorded.
              </p>
            </div>
            <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 lg:min-w-[320px]">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-black text-[var(--text)]">
                <div className="orb-teal grid size-8 shrink-0 place-items-center rounded-xl text-white">
                  <Fingerprint className="size-4" aria-hidden="true" />
                </div>
                Agent identity
              </summary>
              <div className="mt-3 space-y-1.5">
                {assistantContext.proofRows.map(([label, value]) => (
                  <div key={label} className="card-soft px-3 py-2">
                    <p className="kicker">{label}</p>
                    <p className="mt-0.5 truncate text-xs font-bold text-[var(--text)]">{value}</p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </Card>

        <Card className="p-4">
          <p className="kicker">History</p>
          <h3 className="mt-0.5 mb-3 text-sm font-black text-[var(--text)]">What the agent did</h3>
          <AgentHistorySection />
        </Card>
      </div>
    </TabsContent>
  );
}
