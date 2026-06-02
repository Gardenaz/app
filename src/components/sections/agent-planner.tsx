"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAgentPlan } from "@/hooks/use-agent-plan";
import { usePrivyWalletAddress } from "@/hooks/use-privy-wallet-address";
import {
  buildAutopilotPolicy,
  buildProofCard,
  cropToAutopilotDefaults,
} from "@/lib/agent/autopilot";
import type { CropId, RiskLevel } from "@/lib/agent/types";

/* ── Static config ─────────────────────────────────────────────── */
const CROPS: Array<{ id: CropId; label: string }> = [
  { id: "steady", label: "Rice / Safe Harvest (USDY)" },
  { id: "growth", label: "Corn / Growth Field (mETH)" },
  { id: "boost",  label: "Chili / Boost Farm (USDY/mETH)" },
];

const PROTOCOLS = [
  "Mantle RWA USDY Route",
  "Mantle mETH Yield Route",
  "Mantle Dynamic RWA Route",
];

/* ── Shared input styles ───────────────────────────────────────── */
const field =
  "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] disabled:opacity-60";

const label = "block text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]";

/* ── Component ─────────────────────────────────────────────────── */
export function AgentPlannerSection() {
  const [crop, setCrop]                         = useState<CropId>("steady");
  const [amount, setAmount]                     = useState("1000");
  const [risk, setRisk]                         = useState<RiskLevel>(2);
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);
  const [rebalanceHours, setRebalanceHours]     = useState(24);
  const [protocols, setProtocols]               = useState<string[]>(["Mantle RWA USDY Route"]);
  const [manualAddr, setManualAddr]             = useState("0x1111111111111111111111111111111111111111");

  const { ready, authenticated, login, logout, address } = usePrivyWalletAddress();
  const mutation = useAgentPlan();

  const userAddress = useMemo(
    () => (address ?? manualAddr) as `0x${string}`,
    [address, manualAddr],
  );

  const defaults = useMemo(() => cropToAutopilotDefaults(crop, risk), [crop, risk]);

  const policy = useMemo(
    () =>
      buildAutopilotPolicy({
        crop,
        amount,
        riskPreference: risk,
        enabled: autopilotEnabled,
        rebalanceIntervalHours: rebalanceHours,
        selectedProtocols: protocols,
      }),
    [amount, autopilotEnabled, crop, rebalanceHours, risk, protocols],
  );

  const proof = mutation.data
    ? buildProofCard({ decision: mutation.data, anchorTxHash: mutation.data.anchorTxHash })
    : null;

  function toggleProtocol(p: string) {
    setProtocols((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }

  return (
    /* Two-column on lg: form left, output right */
    <div className="grid min-w-0 gap-5 lg:grid-cols-2">

      {/* ── LEFT: Planner form ──────────────────────────────────── */}
      <div className="card-lg flex min-w-0 flex-col gap-5 p-5 sm:p-6">

        {/* Header */}
        <div>
          <p className="kicker">AI × RWA Autopilot</p>
          <h3 className="mt-1 text-lg font-black text-[var(--text)] sm:text-xl">
            Plan with bounded agent wallet policy
          </h3>
        </div>

        {/* Wallet row */}
        <div className="space-y-1.5">
          <label className={label}>Privy wallet</label>
          <div className="flex gap-2">
            <input
              className={field}
              value={userAddress}
              onChange={(e) => setManualAddr(e.target.value)}
              disabled={Boolean(address)}
              aria-label="Wallet address"
            />
            <button
              type="button"
              className="btn-secondary shrink-0"
              onClick={() => (authenticated ? logout() : login())}
              disabled={!ready}
            >
              {authenticated ? "Logout" : "Login"}
            </button>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {address
              ? "Privy wallet connected."
              : "Login with Privy or enter address manually for demo."}
          </p>
        </div>

        {/* Crop + Amount */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={label}>Crop</label>
            <select
              className={field}
              value={crop}
              onChange={(e) => setCrop(e.target.value as CropId)}
            >
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className={label}>Amount</label>
            <input
              className={field}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1000"
            />
          </div>
        </div>

        {/* Risk + Interval */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={label}>Risk preference</label>
            <select
              className={field}
              value={risk}
              onChange={(e) => setRisk(Number(e.target.value) as RiskLevel)}
            >
              <option value={1}>1 — Conservative</option>
              <option value={2}>2 — Balanced</option>
              <option value={3}>3 — Aggressive</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className={label}>Rebalance interval</label>
            <select
              className={field}
              value={rebalanceHours}
              onChange={(e) => setRebalanceHours(Number(e.target.value))}
            >
              <option value={6}>Every 6 hours</option>
              <option value={24}>Every 24 hours</option>
              <option value={72}>Every 72 hours</option>
              <option value={168}>Every 7 days</option>
            </select>
          </div>
        </div>

        {/* Guardrails */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[var(--text)]">Autopilot guardrails</p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {defaults.asset} · {defaults.defaultProtocol}
              </p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
              <input
                type="checkbox"
                className="size-4 rounded"
                checked={autopilotEnabled}
                onChange={(e) => setAutopilotEnabled(e.target.checked)}
              />
              Enabled
            </label>
          </div>

          {/* Protocol checkboxes */}
          <div className="mt-3 space-y-2">
            {PROTOCOLS.map((p) => (
              <label
                key={p}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm font-medium transition hover:border-[var(--primary)]"
              >
                <input
                  type="checkbox"
                  className="size-4 shrink-0 rounded"
                  checked={protocols.includes(p)}
                  onChange={() => toggleProtocol(p)}
                />
                {p}
              </label>
            ))}
          </div>

          {/* Policy stats */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { l: "Max tx",        v: policy.maxTxAmount },
              { l: "Daily cap",     v: policy.maxDailyLoss },
              { l: "Max risk",      v: String(policy.maxRiskLevel) },
            ].map(({ l, v }) => (
              <div key={l} className="card-inset px-3 py-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">{l}</p>
                <p className="mt-0.5 text-sm font-black text-[var(--text)]">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          className="btn-primary mt-auto w-full justify-center py-3"
          disabled={mutation.isPending}
          onClick={() =>
            mutation.mutate({ user: userAddress, crop, amount, riskPreference: risk })
          }
        >
          {mutation.isPending ? "Planning…" : "Generate Plan + Proof"}
        </button>

        {mutation.isError && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-xs font-bold text-red-700">
            {(mutation.error as Error).message}
          </p>
        )}
      </div>

      {/* ── RIGHT: Output ───────────────────────────────────────── */}
      <div className="card-lg flex min-w-0 flex-col gap-4 p-5 sm:p-6">
        <div>
          <p className="kicker">Output</p>
          <h3 className="mt-1 text-lg font-black text-[var(--text)] sm:text-xl">
            Agent Decision &amp; Proof Card
          </h3>
        </div>

        {!mutation.data ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] px-6 py-16 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              No plan yet. Fill the form and click Generate.
            </p>
          </div>
        ) : (
          <div className="min-w-0 space-y-4 text-sm">

            {/* Decision summary */}
            <div className="card p-4">
              <div className="mb-3 flex items-center gap-2">
                {mutation.data.policy?.status === "approved" ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                ) : (
                  <XCircle className="size-4 shrink-0 text-red-600" />
                )}
                <span className="font-black">
                  {(mutation.data.policy?.status ?? "unknown").toUpperCase()}
                </span>
              </div>
              <div className="space-y-1.5">
                <Row label="Strategy" value={`${mutation.data.plan?.title} · ${mutation.data.plan?.expectedApy}`} />
                <Row label="Asset"    value={`${mutation.data.plan?.asset} · ${mutation.data.plan?.protocol}`} />
                <Row label="Reason"   value={mutation.data.policy?.reason ?? "—"} />
                {mutation.data.plan?.shareLabel && (
                  <Row label="Share" value={mutation.data.plan.shareLabel} />
                )}
              </div>
              {mutation.data.summary && (
                <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
                  {mutation.data.summary}
                </p>
              )}
            </div>

            {/* LLM advisor (optional) */}
            {mutation.data.aiAdvisor && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="kicker !text-emerald-700">
                  LLM Advisor · {mutation.data.aiAdvisor.provider} · {mutation.data.aiAdvisor.model}
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--text)]">
                  {mutation.data.aiAdvisor.marketSummary}
                </p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  <b>Recommended:</b> {mutation.data.aiAdvisor.recommendedStrategyId}
                </p>
                <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-[var(--text-muted)]">
                  {mutation.data.aiAdvisor.riskNotes.map((note: string) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
                {mutation.data.aiAdvisor.confidenceReason && (
                  <p className="mt-2 text-xs text-[var(--text-muted)]">
                    {mutation.data.aiAdvisor.confidenceReason}
                  </p>
                )}
              </div>
            )}

            {/* Proof card */}
            {proof && (
              <div className="overflow-hidden rounded-xl bg-[var(--text)]">
                <div className="px-5 py-4">
                  <p className="kicker !text-teal-400">{proof.track}</p>
                  <h4 className="mt-1 text-base font-black text-white">{proof.title}</h4>
                  <p className="mt-2 text-xs leading-5 text-white/60">{proof.shareText}</p>
                </div>
                <div className="space-y-1.5 p-4 pt-0">
                  {proof.proofItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">
                        {item.label}
                      </p>
                      <p className="mt-0.5 break-all text-xs text-white/80">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────── */
function Row({ label: l, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-baseline justify-between gap-4">
      <span className="shrink-0 text-xs font-bold text-[var(--text-muted)]">{l}</span>
      <span className="min-w-0 truncate text-right text-xs text-[var(--text)]">{value}</span>
    </div>
  );
}
