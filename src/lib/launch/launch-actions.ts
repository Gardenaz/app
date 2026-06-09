import { CROP_OPTIONS, type PotSlot } from "@/components/sections/farm-scene";
import type { RiskLevel } from "@/lib/agent/types";

export type FarmerAction = "plant" | "analyze" | "protect" | "harvest";
export type CropOptionId = (typeof CROP_OPTIONS)[number]["id"];
export type ExecutionMode = "disabled" | "blocked" | "prepared" | "sent";
export type ExecutionOperation = "swap" | "addLiquidity" | "removeLiquidity" | "rebalanceLiquidity" | null;
export type FlowState = {
  hasConnectedWallet: boolean;
  hasPolicy: boolean;
  hasPreview: boolean;
  canExecute: boolean;
};

export function getCropOption(cropId: CropOptionId) {
  return CROP_OPTIONS.find((option) => option.id === cropId);
}

export function getCropRisk(cropId: CropOptionId): RiskLevel {
  return cropId === "steady" ? 1 : cropId === "growth" ? 2 : 3;
}

export function getCropApy(cropId: CropOptionId) {
  return cropId === "steady" ? 5.2 : cropId === "growth" ? 9.6 : 17.6;
}

export function buildPlantedSlot(slot: PotSlot, cropId: CropOptionId) {
  const option = getCropOption(cropId);
  if (!option) return slot;

  return {
    ...slot,
    strategyId: cropId,
    crop: option.crop,
    asset: option.asset,
    apy: getCropApy(cropId),
    health: 100,
    state: "planted" as const,
  };
}

export function getNextEmptySlotId(slots: PotSlot[]) {
  return slots.find((slot) => slot.state === "empty")?.id ?? null;
}

export function getActionRiskPreference(action: FarmerAction, currentRisk: RiskLevel) {
  return action === "protect" ? 1 : currentRisk;
}

export function getNextHarvestablePositionId(
  positions: Array<{ positionId: number; harvested: boolean }>,
) {
  return positions.find((position) => !position.harvested)?.positionId ?? null;
}

export function buildFlowState(input: {
  connected: boolean;
  policyReady: boolean;
  planPreviewed: boolean;
  hasExecutionTarget: boolean;
}): FlowState {
  return {
    hasConnectedWallet: input.connected,
    hasPolicy: input.policyReady,
    hasPreview: input.planPreviewed,
    canExecute: input.hasExecutionTarget,
  };
}

export function getPreviewStepLabel(mode: ExecutionMode) {
  if (mode === "prepared") return "Preview ready";
  if (mode === "sent") return "Preview anchored";
  if (mode === "blocked") return "Preview blocked";
  return "Preview unavailable";
}

export function getOperationLabel(operation: ExecutionOperation) {
  if (operation === "swap") return "Swap";
  if (operation === "addLiquidity") return "Add liquidity";
  if (operation === "removeLiquidity") return "Remove liquidity";
  if (operation === "rebalanceLiquidity") return "Rebalance liquidity";
  return "No move yet";
}

export function getExecutionGardenLabel(operation: ExecutionOperation) {
  if (operation === "swap") return "Transplant";
  if (operation === "addLiquidity") return "Plant";
  if (operation === "removeLiquidity") return "Harvest";
  if (operation === "rebalanceLiquidity") return "Rebalance field";
  return "Wait";
}
