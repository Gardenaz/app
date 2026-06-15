import { CROP_OPTIONS, type PotSlot } from "@/components/sections/farm-scene";
import type { AgentDecision, AgentHistoryRow, RiskLevel } from "@/lib/agent/types";

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

/* ─────────────────────────────────────────────────────────────────
   Simulation helpers — power the demo loop when the live Agni / agent
   service is not wired. Gated behind SIMULATE in garden-context so the
   real testnet path can replace these later.
───────────────────────────────────────────────────────────────── */
const SIM_DECISION_HASH = "0x5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a" as const;
const SIM_ANCHOR_HASH = "0xab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12" as const;

export const SIM_HASHES = { decisionHash: SIM_DECISION_HASH, anchorTxHash: SIM_ANCHOR_HASH } as const;

/** Approx. harvest gain for a staked amount, based on the crop's APY. */
export function getCropYield(cropId: CropOptionId, stakeAmount: number) {
  if (!Number.isFinite(stakeAmount) || stakeAmount <= 0) return 0;
  const gain = (stakeAmount * getCropApy(cropId)) / 100;
  return Math.round(gain * 100) / 100;
}

function simExecutionOperation(cropId: CropOptionId): ExecutionOperation {
  return cropId === "boost" ? "addLiquidity" : "swap";
}

/** A policy-safe, anchored decision used as a stand-in for a live agent plan. */
export function buildSimDecision(input: {
  user: `0x${string}`;
  crop: CropOptionId;
  amount: string;
  risk: RiskLevel;
}): AgentDecision {
  const option = getCropOption(input.crop);
  const cropName = option?.crop ?? "Crop";
  const asset = option?.asset ?? "USDC";
  return {
    intent: { user: input.user, crop: input.crop, amount: input.amount, riskPreference: input.risk },
    plan: {
      strategyId: input.crop,
      title: `${cropName} / Agni route`,
      riskLevel: input.risk,
      protocol: "Agni Finance",
      action: input.crop === "boost" ? "addLiquidity" : "swap",
      asset,
      expectedApy: option?.apy ?? "~",
      steps: ["Quote Agni route", "Check policy guardrails", "Simulate execution"],
      explanation: `Simulated ${cropName} route on Agni using ${asset}, kept inside your beginner guardrails.`,
    },
    policy: {
      allow: true,
      status: "approved",
      reason: "Within simulated policy guardrails.",
      checks: [],
    },
    decisionHash: SIM_DECISION_HASH,
    summary: `Simulated ${cropName} move prepared on Agni (${option?.apy ?? ""}).`,
    createdAt: new Date().toISOString(),
    erc8004: { agentId: "sim-agent", registries: { agentIdentity: undefined, autopilotPolicy: undefined } },
    benchmark: {
      decisionLog: undefined,
      status: "required",
      anchorState: "anchored",
      outcomeState: "pending",
      transparency: "live",
    },
    anchorTxHash: SIM_ANCHOR_HASH,
    track: { primary: "AI x RWA", secondary: "Consumer & Viral DApps", support: "Agentic Wallets & Economy" },
  };
}

/** The execution preview block paired with a simulated decision. */
export function buildSimExecution(cropId: CropOptionId) {
  return {
    enabled: true,
    mode: "prepared" as ExecutionMode,
    note: "Simulated Agni route preview (no on-chain transaction).",
    operation: simExecutionOperation(cropId),
  };
}

/** An audit/proof row for a simulated executed move. */
export function buildSimHistoryRow(input: {
  crop: CropOptionId;
  amount: string;
  risk: RiskLevel;
}): AgentHistoryRow {
  const option = getCropOption(input.crop);
  const cropName = option?.crop ?? "Crop";
  return {
    decisionId: Date.now(),
    strategyId: input.crop,
    strategyTitle: `${cropName} / Agni route`,
    asset: option?.asset ?? "USDC",
    protocol: "Agni Finance",
    amount: input.amount,
    riskLevel: input.risk,
    outcome: "success",
    statusLabel: "Simulated",
    summary: `Simulated ${cropName} move executed on Agni.`,
    decisionHash: SIM_DECISION_HASH,
    anchorTxHash: SIM_ANCHOR_HASH,
    createdAt: new Date().toISOString(),
    source: "local",
    proofStatus: "anchored",
  };
}
