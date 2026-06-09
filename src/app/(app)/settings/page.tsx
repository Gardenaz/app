"use client";

import Link from "next/link";
import { ArrowLeft, BadgeInfo, Orbit, RotateCcw, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAgentReadiness } from "@/hooks/use-agent-readiness";
import { useManagedGardenAccount } from "@/hooks/use-managed-garden-account";
import { usePrivyWalletAddress } from "@/hooks/use-privy-wallet-address";
import { useLaunchSettings } from "@/hooks/use-launch-settings";
import { shouldShowWelcomeModal } from "@/lib/launch/settings-state";

const laneOptions = [
  { id: "steady" as const, title: "Safe lane", note: "Low risk, simple route." },
  { id: "growth" as const, title: "Growth lane", note: "Balanced route with more upside." },
  { id: "boost" as const, title: "Dynamic lane", note: "Higher-variance, more active route." },
];

const riskOptions = [
  { value: 1 as const, label: "Low" },
  { value: 2 as const, label: "Medium" },
  { value: 3 as const, label: "High" },
];

function dotLabel(value: boolean) {
  return value ? "Ready" : "Pending";
}

export default function SettingsPage() {
  const { address } = usePrivyWalletAddress();
  const managedAccount = useManagedGardenAccount();
  const agentReadiness = useAgentReadiness();
  const walletConnected = Boolean(address);
  const depositReady = managedAccount.depositReady;
  const policyReady = Boolean(managedAccount.snapshot?.executorAuthorized);
  const launchSettings = useLaunchSettings({
    walletConnected,
    depositReady,
    policyReady,
  });

  const readinessLabel = shouldShowWelcomeModal(launchSettings.draft, {
    walletConnected,
    depositReady,
    policyReady,
  })
    ? "Setup still needs attention"
    : "Setup ready";

  const networkNote = agentReadiness.data?.benchmarking.notes?.[0] ?? "Live network checks will show here.";
  const managedModeReady = agentReadiness.data?.executionModes.managed?.ready ?? false;
  const walletModeReady = agentReadiness.data?.executionModes.wallet?.ready ?? false;

  return (
    <main className="space-y-5">
      <Card className="border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,248,0.98))] p-6 shadow-[var(--shadow-md)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Managed settings
              </span>
              <span className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text)]">
                Beginner friendly
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-black text-[var(--text)]">Managed settings</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              Adjust the advanced managed account inputs, policy defaults, and network guardrails without losing the beginner-first flow.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">Status</p>
            <p className="mt-1 text-xl font-black text-[var(--text)]">{readinessLabel}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Changes persist as you edit the draft.</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Wallet className="size-4 text-[var(--text-muted)]" />
              <h2 className="text-sm font-black text-[var(--text)]">Managed account</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Set the managed account and executor that the agent can use when the flow is in managed mode.
            </p>

            <div className="mt-4 grid gap-3">
              <label className="space-y-2 text-xs font-medium text-[var(--text-muted)]">
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">Managed account</span>
                <Input
                  value={launchSettings.draft.managedAccountAddress}
                  onChange={(event) => launchSettings.updateDraft({ managedAccountAddress: event.target.value as `0x${string}` | "" })}
                  placeholder="0x..."
                  className="h-12 rounded-2xl border-[var(--border)] bg-white text-sm font-semibold text-[var(--text)]"
                />
              </label>

              <label className="space-y-2 text-xs font-medium text-[var(--text-muted)]">
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">Managed executor</span>
                <Input
                  value={launchSettings.draft.managedExecutorAddress}
                  onChange={(event) => launchSettings.updateDraft({ managedExecutorAddress: event.target.value as `0x${string}` | "" })}
                  placeholder="0x..."
                  className="h-12 rounded-2xl border-[var(--border)] bg-white text-sm font-semibold text-[var(--text)]"
                />
              </label>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[var(--text-muted)]" />
              <h2 className="text-sm font-black text-[var(--text)]">Policy defaults</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              These defaults drive the preview, then the user can review the policy before any live move.
            </p>

            <div className="mt-4 grid gap-3">
              <div>
                <Label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">Lane</Label>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {laneOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => launchSettings.setLane(option.id)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        launchSettings.draft.selectedLane === option.id
                          ? "border-[var(--primary-border)] bg-[var(--primary-soft)]"
                          : "border-[var(--border)] bg-[var(--surface-soft)]"
                      }`}
                    >
                      <p className="text-sm font-black text-[var(--text)]">{option.title}</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{option.note}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-2 text-xs font-medium text-[var(--text-muted)]">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em]">Default amount</span>
                  <Input
                    value={launchSettings.draft.defaultAmount}
                    onChange={(event) => launchSettings.setAmount(event.target.value)}
                    className="h-12 rounded-2xl border-[var(--border)] bg-white text-sm font-semibold text-[var(--text)]"
                  />
                </label>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">Risk level</p>
                  <div className="grid grid-cols-3 gap-2">
                    {riskOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => launchSettings.setRisk(option.value)}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          launchSettings.draft.riskPreference === option.value
                            ? "border-[var(--primary-border)] bg-[var(--primary-soft)]"
                            : "border-[var(--border)] bg-[var(--surface-soft)]"
                        }`}
                      >
                        <p className="text-sm font-black text-[var(--text)]">{option.label}</p>
                        <p className="mt-1 text-[11px] text-[var(--text-muted)]">Level {option.value}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">Execution authority</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { id: "managed" as const, label: "Managed mode", note: "Agent can manage the delegated account." },
                    { id: "wallet" as const, label: "Wallet mode", note: "User signs each move manually." },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => launchSettings.setExecutionAuthority(option.id)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        launchSettings.draft.executionAuthority === option.id
                          ? "border-[var(--primary-border)] bg-[var(--primary-soft)]"
                          : "border-[var(--border)] bg-[var(--surface-soft)]"
                      }`}
                    >
                      <p className="text-sm font-black text-[var(--text)]">{option.label}</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{option.note}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Orbit className="size-4 text-[var(--text-muted)]" />
              <h2 className="text-sm font-black text-[var(--text)]">Network readiness</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              The page keeps the live checks in plain language so you know what still blocks a live managed move.
            </p>

            <div className="mt-4 space-y-3">
              {[
                { label: "Wallet connected", value: walletConnected },
                { label: "Deposit ready", value: depositReady },
                { label: "Policy ready", value: policyReady },
                { label: "Managed mode ready", value: managedModeReady },
                { label: "Wallet mode ready", value: walletModeReady },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-[var(--text)]">{item.label}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${item.value ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {dotLabel(item.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-3xl border border-[var(--border)] bg-white px-4 py-4 text-xs leading-5 text-[var(--text-muted)]">
              <p className="font-black text-[var(--text)]">Readiness note</p>
              <p className="mt-1">{networkNote}</p>
              <p className="mt-1">USDC deposit: {managedAccount.snapshot?.tokenBalance ?? "0"}</p>
              {managedAccount.snapshot?.executorAddress ? (
                <p className="mt-2 break-all">Managed executor: {managedAccount.snapshot.executorAddress}</p>
              ) : null}
              {managedAccount.snapshot?.accountAddress ? (
                <p className="mt-1 break-all">Managed account: {managedAccount.snapshot.accountAddress}</p>
              ) : null}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <BadgeInfo className="size-4 text-[var(--text-muted)]" />
              <h2 className="text-sm font-black text-[var(--text)]">Live draft summary</h2>
            </div>
            <div className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              <p>Lane: <span className="font-black text-[var(--text)]">{launchSettings.draft.selectedLane}</span></p>
              <p>Amount: <span className="font-black text-[var(--text)]">{launchSettings.draft.defaultAmount}</span></p>
              <p>Risk: <span className="font-black text-[var(--text)]">{launchSettings.draft.riskPreference}</span></p>
              <p>Authority: <span className="font-black text-[var(--text)]">{launchSettings.draft.executionAuthority}</span></p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => launchSettings.resetDraft()}>
                <RotateCcw className="size-4" />
                Reset to recommended defaults
              </Button>
              <Button type="button" variant="primary" onClick={() => launchSettings.saveDraft()}>
                Save changes
              </Button>
            </div>

            <p className="mt-3 text-xs leading-5 text-[var(--text-subtle)]">
              The draft saves automatically as you edit. Use reset if you want to return to the recommended starting point.
            </p>
          </Card>

          <div className="flex items-center gap-2">
            <Link href="/app" className="btn-secondary inline-flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Back to garden
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
