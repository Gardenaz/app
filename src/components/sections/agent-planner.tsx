"use client";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAgentPlan } from "@/hooks/use-agent-plan";
import { buildAutopilotPolicy, buildProofCard, cropToAutopilotDefaults } from "@/lib/agent/autopilot";
import type { CropId, RiskLevel } from "@/lib/agent/types";

const crops: Array<{ id: CropId; label: string }> = [
  { id: "steady", label: "Rice / Safe Harvest (USDY)" },
  { id: "growth", label: "Corn / Growth Field (mETH)" },
  { id: "boost", label: "Chili / Boost Farm (USDY/mETH)" },
];

const protocols = ["Mantle RWA USDY Route", "Mantle mETH Yield Route", "Mantle Dynamic RWA Route"];

export function AgentPlannerSection() {
  const [crop, setCrop] = useState<CropId>("steady");
  const [amount, setAmount] = useState("1000");
  const [risk, setRisk] = useState<RiskLevel>(2);
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);
  const [rebalanceIntervalHours, setRebalanceIntervalHours] = useState(24);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>(["Mantle RWA USDY Route"]);
  const [manualAddress, setManualAddress] = useState("0x1111111111111111111111111111111111111111");
  const { address } = useAccount();
  const mutation = useAgentPlan();

  const userAddress = useMemo(
    () => (address ?? manualAddress) as `0x${string}`,
    [address, manualAddress],
  );

  const autopilotDefaults = useMemo(() => cropToAutopilotDefaults(crop, risk), [crop, risk]);
  const policy = useMemo(
    () => buildAutopilotPolicy({ crop, amount, riskPreference: risk, enabled: autopilotEnabled, rebalanceIntervalHours, selectedProtocols }),
    [amount, autopilotEnabled, crop, rebalanceIntervalHours, risk, selectedProtocols],
  );
  const proof = mutation.data ? buildProofCard({ decision: mutation.data, anchorTxHash: mutation.data.anchorTxHash }) : null;

  function toggleProtocol(protocol: string) {
    setSelectedProtocols((current) => (
      current.includes(protocol)
        ? current.filter((item) => item !== protocol)
        : [...current, protocol]
    ));
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="space-y-5">
        <div>
          <p className="text-xs font-black uppercase text-[var(--primary-strong)]">AI x RWA Autopilot</p>
          <h3 className="text-xl font-black">Plan with bounded agent wallet policy</h3>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Wallet Address</label>
          <input className="w-full rounded-xl border border-[var(--border)] px-3 py-2" value={userAddress} onChange={(e) => setManualAddress(e.target.value)} disabled={Boolean(address)} />
          <p className="text-xs text-[var(--text-muted)]">{address ? "Connected wallet detected from wagmi." : "Connect wallet or input address manually."}</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Crop</label>
            <select className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2" value={crop} onChange={(e) => setCrop(e.target.value as CropId)}>
              {crops.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Amount (USDY/mETH route units)</label>
            <input className="w-full rounded-xl border border-[var(--border)] px-3 py-2" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Risk Preference</label>
            <select className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2" value={risk} onChange={(e) => setRisk(Number(e.target.value) as RiskLevel)}>
              <option value={1}>1 - Conservative</option>
              <option value={2}>2 - Balanced</option>
              <option value={3}>3 - Aggressive</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Rebalance interval</label>
            <select className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2" value={rebalanceIntervalHours} onChange={(e) => setRebalanceIntervalHours(Number(e.target.value))}>
              <option value={6}>6 hours</option>
              <option value={24}>24 hours</option>
              <option value={72}>72 hours</option>
              <option value={168}>7 days</option>
            </select>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black">Autopilot guardrails</p>
              <p className="text-xs text-[var(--text-muted)]">Asset {autopilotDefaults.asset} · recommended route {autopilotDefaults.defaultProtocol}</p>
            </div>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={autopilotEnabled} onChange={(e) => setAutopilotEnabled(e.target.checked)} />
              Enabled
            </label>
          </div>
          <div className="mt-4 grid gap-2">
            {protocols.map((protocol) => (
              <label key={protocol} className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold">
                <input type="checkbox" checked={selectedProtocols.includes(protocol)} onChange={() => toggleProtocol(protocol)} />
                {protocol}
              </label>
            ))}
          </div>
          <div className="mt-4 grid gap-2 text-xs font-bold text-[var(--text-muted)] sm:grid-cols-3">
            <span>Max tx: {policy.maxTxAmount}</span>
            <span>Daily loss cap: {policy.maxDailyLoss}</span>
            <span>Max risk: {policy.maxRiskLevel}</span>
          </div>
        </div>
        <Button onClick={() => mutation.mutate({ user: userAddress, crop, amount, riskPreference: risk })}>
          {mutation.isPending ? "Planning..." : "Generate Plan + Proof"}
        </Button>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-xl font-black">Agent Decision & Proof Card</h3>
        {!mutation.data ? <p className="text-sm text-[var(--text-muted)]">No plan yet. Generate one from left panel.</p> : (
          <div className="space-y-4 text-sm">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <p><b>Status:</b> {mutation.data.policy.status.toUpperCase()}</p>
              <p><b>Strategy:</b> {mutation.data.plan.title} ({mutation.data.plan.expectedApy})</p>
              <p><b>Asset:</b> {mutation.data.plan.asset} · {mutation.data.plan.protocol}</p>
              {mutation.data.plan.shareLabel ? <p><b>Share:</b> {mutation.data.plan.shareLabel}</p> : null}
              <p><b>Reason:</b> {mutation.data.policy.reason}</p>
              <p><b>Summary:</b> {mutation.data.summary}</p>
            </div>
            {proof ? (
              <div className="rounded-2xl bg-[var(--text)] p-4 text-white">
                <p className="text-xs font-black uppercase text-emerald-100">{proof.track}</p>
                <h4 className="mt-1 text-lg font-black">{proof.title}</h4>
                <p className="mt-2 text-sm leading-6 text-white/80">{proof.shareText}</p>
                <div className="mt-3 space-y-2">
                  {proof.proofItems.map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-2">
                      <p className="text-xs font-bold uppercase text-white/50">{item.label}</p>
                      <p className="break-all text-xs text-white/85">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </Card>
    </section>
  );
}
