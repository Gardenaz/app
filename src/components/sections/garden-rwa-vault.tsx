"use client";

import { Loader2, Sprout, Pickaxe, BadgeDollarSign, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGardenRwaVault } from "@/hooks/use-garden-rwa-vault";
import type { GardenRwaCropKey } from "@/lib/contracts/garden-rwa";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";

type Props = {
  agentData?: GardenAgentResult | null;
  amount: string;
  className?: string;
};

function cropLabel(cropKey: GardenRwaCropKey) {
  return cropKey === "steady" ? "Rice / Safe Harvest" : cropKey === "growth" ? "Corn / Growth Field" : "Chili / Boost Farm";
}

function money(value: string) {
  const num = Number(value);
  if (!Number.isFinite(num)) return value;
  return num.toFixed(2);
}

function formatTxError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Action failed";
}

export function GardenRwaVaultSection({ agentData, amount, className }: Props) {
  const {
    snapshot,
    allSnapshot,
    walletAddress,
    operatorAddress,
    autopilotPolicyAddress,
    isLoading,
    error,
    faucet,
    deposit,
    withdraw,
    plant,
    harvest,
    setVaultOperator,
    setAutopilotPolicy,
    isFauceting,
    isDepositing,
    isWithdrawing,
    isPlanting,
    isHarvesting,
    isSettingOperator,
    isSettingPolicy,
    faucetError,
    faucetAvailableInMs,
    canFaucet,
    txError,
    canInteract,
  } = useGardenRwaVault();

  const recommendedCrop = (agentData?.intent.parsedStrategy ?? "steady") as GardenRwaCropKey;
  const activeSnapshot = snapshot?.configured ? snapshot : allSnapshot;
  const positions = snapshot?.positions.length ? snapshot.positions : allSnapshot?.positions ?? [];
  const walletBalance = activeSnapshot?.tokenBalance ?? "0";
  const vaultBalance = activeSnapshot?.vaultCashBalance ?? "0";
  const operatorApproved = activeSnapshot?.operatorApproved ?? false;
  const policyEnabled = Boolean(activeSnapshot?.autopilotPolicyEnabled && activeSnapshot?.autopilotProtocolAllowed && !activeSnapshot?.autopilotEmergencyPaused);
  const activePositionCount = positions.filter((position) => !position.harvested).length;
  const harvestablePosition = positions.find((position) => !position.harvested) ?? null;
  const hasWalletFunds = Number(walletBalance) > 0;
  const hasVaultFunds = Number(vaultBalance) > 0;
  const nextAction = !hasWalletFunds
    ? {
      label: canFaucet ? "Claim test funds" : "Faucet cooling down",
      note: "Start by putting test funds in your wallet.",
      disabled: !canInteract || isFauceting || !canFaucet,
      busy: isFauceting,
      icon: BadgeDollarSign,
      run: () => faucet("1000"),
    }
    : !hasVaultFunds
      ? {
        label: "Move funds into vault",
        note: "Vault cash is what the agent can manage.",
        disabled: !canInteract || isDepositing,
        busy: isDepositing,
        icon: BadgeDollarSign,
        run: () => deposit(amount),
      }
      : !operatorApproved
        ? {
          label: "Allow agent",
          note: "This lets the agent act inside your policy.",
          disabled: !canInteract || isSettingOperator || !operatorAddress,
          busy: isSettingOperator,
          icon: Flower2,
          run: () => setVaultOperator(true),
        }
        : !policyEnabled
          ? {
            label: "Turn on policy",
            note: "This turns on the on-chain rules the agent must obey.",
            disabled: !canInteract || isSettingPolicy || !autopilotPolicyAddress,
            busy: isSettingPolicy,
            icon: Flower2,
            run: () => setAutopilotPolicy({ amount, maxDailyLossAmount: amount, riskLevel: 1 }),
          }
        : {
          label: "Vault is ready",
          note: "Use the agent planner or open advanced controls below.",
          disabled: true,
          busy: false,
          icon: Sprout,
          run: async () => undefined,
        };

  return (
    <section className={className ?? "card-lg p-4"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="kicker">Vault</p>
          <h3 className="mt-0.5 text-sm font-black text-[var(--text)]">Move money in, let the agent work, pull money out when needed.</h3>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-[var(--text-muted)]">
            Only the balances and controls that matter stay here.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-black text-[var(--text-muted)]">
          {policyEnabled ? "Agent ready" : "Setup needed"}
        </span>
      </div>

      <div className="mt-4 grid gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 md:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-white/80 px-4 py-3">
          <p className="kicker">Wallet</p>
          <p className="mt-1 text-xl font-black text-[var(--text)]">{money(walletBalance)} gUSD</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white/80 px-4 py-3">
          <p className="kicker">Vault</p>
          <p className="mt-1 text-xl font-black text-[var(--text)]">{money(vaultBalance)} gUSD</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white/80 px-4 py-3">
          <p className="kicker">Agent</p>
          <p className="mt-1 text-xl font-black text-[var(--text)]">{operatorApproved ? "Allowed" : "Off"}</p>
          <p className="mt-1 text-[11px] leading-5 text-[var(--text-subtle)]">
            Policy {policyEnabled ? "on" : "off"}
          </p>
        </div>
      </div>

      <Card className="mt-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="kicker">Next step</p>
            <p className="mt-1 text-sm font-black text-[var(--text)]">{nextAction.label}</p>
            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{nextAction.note}</p>
          </div>
          <Button type="button" variant="primary" disabled={nextAction.disabled} onClick={() => void nextAction.run()}>
            {nextAction.busy ? <Loader2 className="size-4 animate-spin" /> : <nextAction.icon className="size-4" />}
            {nextAction.label}
          </Button>
        </div>
      </Card>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <Button type="button" variant="secondary" disabled={!canInteract || isDepositing} onClick={() => deposit(amount)}>
          {isDepositing ? <Loader2 className="size-4 animate-spin" /> : <BadgeDollarSign className="size-4" />}
          Deposit
        </Button>
        <Button type="button" variant="secondary" disabled={!canInteract || isWithdrawing || Number(vaultBalance) <= 0} onClick={() => withdraw(amount)}>
          {isWithdrawing ? <Loader2 className="size-4 animate-spin" /> : <BadgeDollarSign className="size-4" />}
          Withdraw
        </Button>
        <Button type="button" variant="secondary" disabled={!canInteract || isSettingOperator || !operatorAddress} onClick={() => setVaultOperator(!operatorApproved)}>
          {isSettingOperator ? <Loader2 className="size-4 animate-spin" /> : <Flower2 className="size-4" />}
          {operatorApproved ? "Revoke agent" : "Authorize"}
        </Button>
      </div>

      <details className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
        <summary className="cursor-pointer list-none text-sm font-black text-[var(--text)]">Manual actions</summary>
        <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
          Keep this closed unless you want to place or close a position by hand.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <Button type="button" variant="primary" disabled={!canInteract || isPlanting || !agentData} onClick={() => plant({ cropKey: recommendedCrop, amount })}>
            {isPlanting ? <Loader2 className="size-4 animate-spin" /> : <Sprout className="size-4" />}
            Open position manually
          </Button>
          <Button type="button" variant="secondary" disabled={!canInteract || isHarvesting || !harvestablePosition} onClick={() => harvest(harvestablePosition!.positionId)}>
            {isHarvesting ? <Loader2 className="size-4 animate-spin" /> : <Pickaxe className="size-4" />}
            Close position manually
          </Button>
        </div>
      </details>

      {isLoading && !activeSnapshot ? (
        <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
          <p className="text-sm font-bold text-[var(--text)]">Loading your vault view…</p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">Reading balances, routes, and positions from Mantle.</p>
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="kicker">Positions</p>
            <p className="text-[11px] font-medium text-[var(--text-subtle)]">
              {activePositionCount} active
            </p>
          </div>

          {!positions.length ? (
            <div className="mt-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
              <p className="text-sm font-bold text-[var(--text)]">No positions yet</p>
              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                Deposit funds first, then let autopilot plan the first move or open one manually.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {positions.map((position) => {
                const pnl = Number(position.currentValue) - Number(position.principal);
                return (
                  <div key={position.positionId} className="rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-black text-[var(--text)]">{cropLabel(position.cropKey)}</p>
                          <span className="rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                            #{position.positionId}
                          </span>
                          <span className="rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                            {position.harvested ? "Closed" : "Active"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                          Deposited {money(position.principal)} gUSD · now {money(position.currentValue)} gUSD
                        </p>
                      </div>
                      <p className={`text-sm font-black ${pnl >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                        {pnl >= 0 ? "+" : ""}{money(String(pnl))} gUSD
                      </p>
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-[var(--text-subtle)]">
                      Opened {position.plantedAt}. {position.harvestedAt ? `Closed ${position.harvestedAt}.` : `Updated ${position.lastRebalancedAt}.`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {(error || txError || faucetError) && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
          {formatTxError(faucetError ?? txError ?? error)}
        </p>
      )}

      {faucetAvailableInMs > 0 && (
        <p className="mt-2 text-[11px] text-[var(--text-subtle)]">
          Faucet cooling down. Try again in about {Math.ceil(faucetAvailableInMs / (60 * 60 * 1000))} hour{Math.ceil(faucetAvailableInMs / (60 * 60 * 1000)) > 1 ? "s" : ""}.
        </p>
      )}
    </section>
  );
}
