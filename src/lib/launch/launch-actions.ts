import { CROP_OPTIONS, type PotSlot } from "@/components/sections/farm-scene";
import type { RiskLevel } from "@/lib/agent/types";
import type { GardenRwaCropKey } from "@/lib/contracts/garden-rwa";

export type FarmerAction = "plant" | "analyze" | "protect" | "harvest";
export type CropOptionId = (typeof CROP_OPTIONS)[number]["id"];

export type StartHereState = {
  hasWalletFunds: boolean;
  hasVaultFunds: boolean;
  hasAuthorizedOperator: boolean;
  hasRequestedAutopilotStart: boolean;
  hasCompletedOnboarding: boolean;
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

export function toGardenCropKey(parsedStrategy?: string | null): GardenRwaCropKey {
  return (parsedStrategy ?? "steady") as GardenRwaCropKey;
}

export function buildStartHereState(input: {
  walletBalance?: string;
  vaultBalance?: string;
  operatorApproved?: boolean;
  autopilotStarted?: boolean;
  onboardingCompleted?: boolean;
}): StartHereState {
  const hasWalletFunds = Number(input.walletBalance ?? "0") > 0;
  const hasVaultFunds = Number(input.vaultBalance ?? "0") > 0;
  const hasAuthorizedOperator = Boolean(input.operatorApproved);
  const hasRequestedAutopilotStart = Boolean(input.autopilotStarted);
  const hasCompletedOnboarding = Boolean(input.onboardingCompleted);

  return {
    hasWalletFunds,
    hasVaultFunds,
    hasAuthorizedOperator,
    hasRequestedAutopilotStart,
    hasCompletedOnboarding,
  };
}
