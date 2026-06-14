"use client";

import { RotateCcw } from "lucide-react";
import { useGarden } from "../garden-context";
import { useManagedGardenAccount } from "@/hooks/use-managed-garden-account";
import { ParchmentPanel, ParchmentInset } from "@/components/gamification/parchment-panel";
import { WoodenButton } from "@/components/gamification/wooden-button";

const PAGE_BG: Record<string, string> = {
  stormy: "linear-gradient(180deg,#1E2C37 0%,#0F1E28 45%,#2A4030 100%)",
  rainy:  "linear-gradient(180deg,#2A4A5E 0%,#1D4E6B 45%,#3A6040 100%)",
  cloudy: "linear-gradient(180deg,#B8CEDD 0%,#D8E8F0 45%,#96C87A 100%)",
  sunny:  "linear-gradient(180deg,#5BC8F5 0%,#A8E4FF 35%,#C8F0A8 100%)",
};

const laneOptions = [
  { id: "steady" as const, emoji: "🌾", title: "Safe lane", note: "Low risk · simple route" },
  { id: "growth" as const, emoji: "🌽", title: "Growth lane", note: "Balanced · more upside" },
  { id: "boost" as const, emoji: "🌶️", title: "Dynamic lane", note: "Higher variance · active" },
];

const riskOptions = [
  { value: 1 as const, label: "Low" },
  { value: 2 as const, label: "Medium" },
  { value: 3 as const, label: "High" },
];

const authorityOptions = [
  { id: "managed" as const, label: "🤖 Managed mode", note: "Agent manages the delegated account." },
  { id: "wallet" as const, label: "🔑 Wallet mode", note: "You sign each move manually." },
];

/* Island-styled input — parchment inset look, matches the garden palette */
function IslandInput({
  value,
  onChange,
  placeholder,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl px-3 py-2.5 text-sm font-bold outline-none transition focus:ring-2"
      style={{
        background: "rgba(255,255,255,0.7)",
        border: "1.5px solid var(--island-parchment-dark)",
        color: "var(--island-sign-bg)",
        fontFamily: mono ? "var(--font-mono, monospace)" : "var(--font-island-heading)",
      }}
    />
  );
}

function ReadyPill({ ready }: { ready: boolean }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]"
      style={
        ready
          ? { background: "rgba(16,185,129,0.18)", color: "#047857" }
          : { background: "rgba(196,154,20,0.2)", color: "var(--island-gold-dark)" }
      }
    >
      {ready ? "Ready" : "Pending"}
    </span>
  );
}

export default function SettingsPage() {
  const g = useGarden();
  const managedAccount = useManagedGardenAccount();
  const draft = g.launchSettings.draft;

  const walletConnected = Boolean(g.address);
  const managedModeReady = g.readiness.data?.executionModes.managed?.ready ?? false;
  const walletModeReady = g.readiness.data?.executionModes.wallet?.ready ?? false;
  const networkNote =
    g.readiness.data?.benchmarking.notes?.[0] ?? "Live network checks will show here.";

  const readinessRows = [
    { label: "Wallet connected", value: walletConnected },
    { label: "Deposit ready", value: g.depositReady },
    { label: "Policy ready", value: g.onchainPolicyReady },
    { label: "Managed mode ready", value: managedModeReady },
    { label: "Wallet mode ready", value: walletModeReady },
  ];

  return (
    <div
      className="min-h-[calc(100svh-4rem-4rem)]"
      style={{ background: PAGE_BG[g.weather] ?? PAGE_BG.sunny }}
    >
      <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 xl:grid-cols-3">

        {/* Header — full width */}
        <div className="col-span-full">
          <ParchmentPanel titleEmoji="⚙️" title="Managed Settings">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="max-w-2xl text-sm leading-6" style={{ color: "var(--island-wood)" }}>
                Tune the advanced managed account, policy defaults, and network guardrails — without
                leaving the beginner-first flow. Changes persist as you edit.
              </p>
              <ParchmentInset className="shrink-0">
                <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--island-wood)" }}>
                  Status
                </p>
                <p className="mt-1 text-base font-black" style={{ color: "var(--island-sign-bg)" }}>
                  {g.readinessLabel}
                </p>
              </ParchmentInset>
            </div>
          </ParchmentPanel>
        </div>

        {/* Managed account */}
        <ParchmentPanel titleEmoji="🔑" title="Managed Account">
          <p className="mb-3 text-sm leading-6" style={{ color: "var(--island-wood)" }}>
            Set the managed account and executor the agent uses in managed mode.
          </p>
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--island-wood)" }}>
                Managed account
              </p>
              <IslandInput
                value={draft.managedAccountAddress}
                onChange={(v) => g.launchSettings.updateDraft({ managedAccountAddress: v as `0x${string}` | "" })}
                placeholder="0x..."
                mono
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--island-wood)" }}>
                Managed executor
              </p>
              <IslandInput
                value={draft.managedExecutorAddress}
                onChange={(v) => g.launchSettings.updateDraft({ managedExecutorAddress: v as `0x${string}` | "" })}
                placeholder="0x..."
                mono
              />
            </div>
          </div>
        </ParchmentPanel>

        {/* Policy defaults */}
        <ParchmentPanel titleEmoji="🛡️" title="Policy Defaults">
          <p className="mb-3 text-sm leading-6" style={{ color: "var(--island-wood)" }}>
            These defaults drive the preview before any live move.
          </p>

          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--island-wood)" }}>
            Lane
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {laneOptions.map((opt) => (
              <WoodenButton
                key={opt.id}
                variant={draft.selectedLane === opt.id ? "primary" : "secondary"}
                size="sm"
                className="h-auto w-full flex-col gap-0.5 py-3"
                onClick={() => g.launchSettings.setLane(opt.id)}
              >
                <span className="text-xl leading-none">{opt.emoji}</span>
                <span className="text-xs font-black">{opt.title}</span>
                <span className="text-[9px] opacity-75">{opt.note}</span>
              </WoodenButton>
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--island-wood)" }}>
                Default amount
              </p>
              <IslandInput value={draft.defaultAmount} onChange={(v) => g.launchSettings.setAmount(v)} />
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--island-wood)" }}>
                Risk level
              </p>
              <div className="grid grid-cols-3 gap-2">
                {riskOptions.map((opt) => (
                  <WoodenButton
                    key={opt.value}
                    variant={draft.riskPreference === opt.value ? "primary" : "secondary"}
                    size="sm"
                    className="w-full"
                    onClick={() => g.launchSettings.setRisk(opt.value)}
                  >
                    {opt.label}
                  </WoodenButton>
                ))}
              </div>
            </div>
          </div>

          <p className="mb-2 mt-3 text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--island-wood)" }}>
            Execution authority
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {authorityOptions.map((opt) => (
              <WoodenButton
                key={opt.id}
                variant={draft.executionAuthority === opt.id ? "primary" : "secondary"}
                size="sm"
                className="h-auto w-full flex-col items-start gap-0.5 py-2.5 text-left"
                onClick={() => g.launchSettings.setExecutionAuthority(opt.id)}
              >
                <span className="text-xs font-black">{opt.label}</span>
                <span className="text-[9px] opacity-75">{opt.note}</span>
              </WoodenButton>
            ))}
          </div>
        </ParchmentPanel>

        {/* Network readiness */}
        <ParchmentPanel titleEmoji="📡" title="Network Readiness">
          <p className="mb-3 text-sm leading-6" style={{ color: "var(--island-wood)" }}>
            Live checks in plain language — what still blocks a live managed move.
          </p>
          <div className="space-y-2">
            {readinessRows.map((row) => (
              <ParchmentInset key={row.label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black" style={{ color: "var(--island-sign-bg)" }}>{row.label}</p>
                  <ReadyPill ready={row.value} />
                </div>
              </ParchmentInset>
            ))}
          </div>
          <ParchmentInset className="mt-3">
            <p className="text-[10px] font-black" style={{ color: "var(--island-sign-bg)" }}>Readiness note</p>
            <p className="mt-1 text-xs leading-5" style={{ color: "var(--island-wood)" }}>{networkNote}</p>
            <p className="mt-1 text-xs" style={{ color: "var(--island-wood)" }}>
              USDC deposit: {managedAccount.snapshot?.tokenBalance ?? "0"}
            </p>
            {managedAccount.snapshot?.executorAddress ? (
              <p className="mt-2 break-all text-[10px]" style={{ color: "var(--island-wood)" }}>
                Executor: {managedAccount.snapshot.executorAddress}
              </p>
            ) : null}
            {managedAccount.snapshot?.accountAddress ? (
              <p className="mt-1 break-all text-[10px]" style={{ color: "var(--island-wood)" }}>
                Account: {managedAccount.snapshot.accountAddress}
              </p>
            ) : null}
          </ParchmentInset>
        </ParchmentPanel>

        {/* Live draft summary — full width */}
        <div className="col-span-full">
          <ParchmentPanel titleEmoji="📋" title="Live Draft Summary">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Lane", value: draft.selectedLane },
                { label: "Amount", value: draft.defaultAmount },
                { label: "Risk", value: String(draft.riskPreference) },
                { label: "Authority", value: draft.executionAuthority },
              ].map((item) => (
                <ParchmentInset key={item.label}>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--island-wood)" }}>
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-black" style={{ color: "var(--island-sign-bg)" }}>{item.value}</p>
                </ParchmentInset>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <WoodenButton variant="primary" size="md" onClick={() => g.launchSettings.saveDraft()}>
                Save changes
              </WoodenButton>
              <WoodenButton variant="secondary" size="md" onClick={() => g.launchSettings.resetDraft()}>
                <RotateCcw className="size-4" />
                Reset to defaults
              </WoodenButton>
            </div>

            <p className="mt-3 text-xs leading-5" style={{ color: "var(--island-wood)" }}>
              The draft saves automatically as you edit. Use reset to return to the recommended starting point.
            </p>
          </ParchmentPanel>
        </div>

      </div>
    </div>
  );
}
