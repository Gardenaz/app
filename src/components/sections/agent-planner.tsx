"use client";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAgentPlan } from "@/hooks/use-agent-plan";
import type { CropId, RiskLevel } from "@/lib/agent/types";

const crops: Array<{ id: CropId; label: string }> = [
  { id: "steady", label: "Steady Field" },
  { id: "growth", label: "Growth Row" },
  { id: "boost", label: "Boost Plot" },
];

export function AgentPlannerSection() {
  const [crop, setCrop] = useState<CropId>("steady");
  const [amount, setAmount] = useState("1000");
  const [risk, setRisk] = useState<RiskLevel>(2);
  const [manualAddress, setManualAddress] = useState("0x1111111111111111111111111111111111111111");
  const { address } = useAccount();
  const mutation = useAgentPlan();

  const userAddress = useMemo(
    () => (address ?? manualAddress) as `0x${string}`,
    [address, manualAddress],
  );

  return (
    <section className="grid gap-5 md:grid-cols-2">
      <Card className="space-y-4">
        <h3 className="text-xl font-black">Plan with Agent v1.1</h3>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Wallet Address</label>
          <input className="w-full rounded-xl border border-[var(--border)] px-3 py-2" value={userAddress} onChange={(e) => setManualAddress(e.target.value)} disabled={Boolean(address)} />
          <p className="text-xs text-[var(--text-muted)]">{address ? "Connected wallet detected from wagmi." : "Connect wallet or input address manually."}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Crop</label>
          <select className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2" value={crop} onChange={(e) => setCrop(e.target.value as CropId)}>
            {crops.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Amount (USDC)</label>
          <input className="w-full rounded-xl border border-[var(--border)] px-3 py-2" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Risk Preference</label>
          <select className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2" value={risk} onChange={(e) => setRisk(Number(e.target.value) as RiskLevel)}>
            <option value={1}>1 - Conservative</option>
            <option value={2}>2 - Balanced</option>
            <option value={3}>3 - Aggressive</option>
          </select>
        </div>
        <Button onClick={() => mutation.mutate({ user: userAddress, crop, amount, riskPreference: risk })}>
          {mutation.isPending ? "Planning..." : "Generate Plan"}
        </Button>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-xl font-black">Agent Decision</h3>
        {!mutation.data ? <p className="text-sm text-[var(--text-muted)]">No plan yet. Generate one from left panel.</p> : (
          <div className="space-y-3 text-sm">
            <p><b>Status:</b> {mutation.data.policy.status.toUpperCase()}</p>
            <p><b>Strategy:</b> {mutation.data.plan.title} ({mutation.data.plan.expectedApy})</p>
            <p><b>Reason:</b> {mutation.data.policy.reason}</p>
            <p><b>Summary:</b> {mutation.data.summary}</p>
            <p><b>Decision Hash:</b> <span className="break-all">{mutation.data.decisionHash}</span></p>
          </div>
        )}
      </Card>
    </section>
  );
}
