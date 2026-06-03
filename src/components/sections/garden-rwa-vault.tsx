"use client";

import { Loader2, Sprout, Pickaxe, BadgeDollarSign } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
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

function formatTxError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Action failed";
}

export function GardenRwaVaultSection({ agentData, amount, className }: Props) {
  const {
    snapshot,
    walletAddress,
    vaultAddress,
    isLoading,
    error,
    plant,
    harvest,
    faucet,
    isFauceting,
    isPlanting,
    isHarvesting,
    faucetError,
    txError,
    canInteract,
  } = useGardenRwaVault();
  const recommendedCrop = (agentData?.intent.parsedStrategy ?? "steady") as GardenRwaCropKey;
  const harvestablePosition = useMemo(
    () => snapshot?.positions.find((position) => position.owner.toLowerCase() === walletAddress?.toLowerCase() && !position.harvested),
    [snapshot?.positions, walletAddress],
  );

  return (
    <section className={className ?? "card-lg p-4"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="kicker">Gardenaz Vault</p>
          <h3 className="mt-0.5 text-sm font-black text-[var(--text)]">Mock RWA vault with Garden USD settlement</h3>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            Positions and settlement are onchain. Prices move from the oracle, so the mock yield still follows market movement.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${snapshot?.configured ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            {snapshot?.configured ? "ONCHAIN" : "NOT CONFIGURED"}
          </span>
          <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-black text-[var(--text-muted)]">
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "No wallet"}
          </span>
        </div>
      </div>

      {isLoading && !snapshot ? (
        <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
          <p className="text-sm font-bold text-[var(--text)]">Loading Garden USD vault…</p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            Reading onchain routes, token balance, and live positions from Mantle.
          </p>
        </div>
      ) : !snapshot?.configured ? (
        <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
          <p className="text-sm font-bold text-[var(--text)]">Vault address not configured yet</p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            Set `NEXT_PUBLIC_GARDEN_RWA_MOCK_VAULT_ADDRESS` to connect this section to the deployed GardenRwaMockVault contract.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {snapshot.routes.map((route) => (
              <div key={route.cropKey} className="card-soft px-3 py-3">
                <p className="kicker">{route.asset}</p>
                <p className="mt-0.5 text-sm font-black text-[var(--text)]">{cropLabel(route.cropKey)}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">Oracle price: {Number(route.price).toFixed(4)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3">
              <p className="kicker">Garden USD</p>
              <p className="mt-0.5 text-sm font-black text-[var(--text)]">
                {snapshot.tokenBalance ? Number(snapshot.tokenBalance).toFixed(2) : "0.00"} gUSD
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Test balance for planting and harvest return.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              disabled={!canInteract || isFauceting}
              onClick={() => faucet("1000")}
            >
              {isFauceting ? <Loader2 className="size-4 animate-spin" /> : <BadgeDollarSign className="size-4" />}
              Top up test USD
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={!canInteract || isPlanting || !agentData}
              onClick={() => plant({ cropKey: recommendedCrop, amount })}
            >
              {isPlanting ? <Loader2 className="size-4 animate-spin" /> : <Sprout className="size-4" />}
              Plant with gUSD
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={!canInteract || isHarvesting || !harvestablePosition}
              onClick={() => harvest(harvestablePosition!.positionId)}
            >
              {isHarvesting ? <Loader2 className="size-4 animate-spin" /> : <Pickaxe className="size-4" />}
              Harvest next ready pot
            </Button>
            <span className="text-xs text-[var(--text-muted)] sm:col-span-3">
              Task execution uses the connected Privy wallet. Planting pulls Garden USD from your wallet, harvest returns it with oracle-driven value change.
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <p className="kicker">Positions</p>
            {isLoading && <p className="text-sm text-[var(--text-muted)]">Loading onchain positions...</p>}
            {!isLoading && snapshot.positions.length === 0 && (
              <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
                <p className="text-sm font-bold text-[var(--text)]">No planted positions yet</p>
                <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                  Ask the agent to recommend a crop, then plant it from here or from the assistant.
                </p>
              </div>
            )}
            {snapshot.positions.map((position) => (
              <div key={position.positionId} className="card-soft px-3 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-black text-[var(--text)]">{cropLabel(position.cropKey)}</p>
                    <p className="text-xs text-[var(--text-muted)]">Position #{position.positionId} · {position.harvested ? "Harvested" : "Growing"}</p>
                  </div>
                  <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[10px] font-black text-[var(--text-muted)]">
                    {position.currentValue} / {position.principal}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  Planted {position.plantedAt} · {position.harvestedAt ? `Harvested ${position.harvestedAt}` : "Not harvested yet"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {(error || txError || faucetError) && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
          {formatTxError(faucetError ?? txError ?? error)}
        </p>
      )}
    </section>
  );
}
