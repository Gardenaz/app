import type { AgentDecision, CropId, RiskLevel } from "./types";

export type AutopilotPolicy = {
  enabled: boolean;
  maxTxAmount: string;
  maxDailyLoss: string;
  maxRiskLevel: RiskLevel;
  rebalanceIntervalSeconds: number;
  allowedProtocols: string[];
  emergencyPaused: boolean;
};

export type AutopilotPolicyInput = {
  crop: CropId;
  amount: string;
  riskPreference: RiskLevel;
  enabled: boolean;
  rebalanceIntervalHours: number;
  selectedProtocols: string[];
};

export type CropAutopilotDefaults = {
  crop: CropId;
  asset: string;
  defaultProtocol: string;
  recommendedRiskLevel: RiskLevel;
  maxDailyLossPercent: number;
};

export type ProofCard = {
  title: string;
  asset: string;
  track: "AI x RWA + Consumer & Viral DApps";
  status: string;
  shareText: string;
  proofItems: Array<{ label: string; value: string }>;
};

const cropDefaults: Record<CropId, Omit<CropAutopilotDefaults, "crop" | "recommendedRiskLevel"> & { recommendedRiskLevel: RiskLevel }> = {
  steady: {
    asset: "USDY",
    defaultProtocol: "Mantle RWA USDY Route",
    recommendedRiskLevel: 1,
    maxDailyLossPercent: 2,
  },
  growth: {
    asset: "mETH",
    defaultProtocol: "Mantle mETH Yield Route",
    recommendedRiskLevel: 2,
    maxDailyLossPercent: 5,
  },
  boost: {
    asset: "USDY/mETH",
    defaultProtocol: "Mantle Dynamic RWA Route",
    recommendedRiskLevel: 3,
    maxDailyLossPercent: 8,
  },
};

export function cropToAutopilotDefaults(crop: CropId, riskPreference: RiskLevel): CropAutopilotDefaults {
  const defaults = cropDefaults[crop];
  return {
    crop,
    asset: defaults.asset,
    defaultProtocol: defaults.defaultProtocol,
    recommendedRiskLevel: Math.min(defaults.recommendedRiskLevel, riskPreference) as RiskLevel,
    maxDailyLossPercent: defaults.maxDailyLossPercent,
  };
}

export function buildAutopilotPolicy(input: AutopilotPolicyInput): AutopilotPolicy {
  const defaults = cropToAutopilotDefaults(input.crop, input.riskPreference);
  const amount = Number(input.amount);
  const maxDailyLoss = Number.isFinite(amount) && amount > 0
    ? Math.floor((amount * defaults.maxDailyLossPercent) / 100).toString()
    : "0";

  return {
    enabled: input.enabled,
    maxTxAmount: input.amount,
    maxDailyLoss,
    maxRiskLevel: defaults.recommendedRiskLevel,
    rebalanceIntervalSeconds: Math.max(1, Math.floor(input.rebalanceIntervalHours * 3600)),
    allowedProtocols: input.selectedProtocols.length > 0 ? input.selectedProtocols : [defaults.defaultProtocol],
    emergencyPaused: false,
  };
}

export function buildProofCard(input: { decision: AgentDecision; anchorTxHash?: string | null }): ProofCard {
  const { decision, anchorTxHash } = input;
  const proofItems = [
    { label: "Decision Hash", value: decision.decisionHash },
    { label: "Mantle Tx", value: anchorTxHash ?? "dry-run proof pending" },
    { label: "Policy", value: decision.policy.reason },
  ];

  return {
    title: `${decision.plan.title} Proof`,
    asset: decision.plan.asset,
    track: "AI x RWA + Consumer & Viral DApps",
    status: decision.policy.status.toUpperCase(),
    shareText: `${decision.plan.title} used ${decision.plan.asset} with ${decision.policy.status} policy status. ${decision.plan.shareLabel ?? "Shareable harvest proof"}.`,
    proofItems,
  };
}
