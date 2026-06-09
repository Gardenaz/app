import type { Address, AgentDecision, CropId, RiskLevel } from "./types";

export type ExecutionAuthority = "wallet" | "managed";

export type AutopilotPolicy = {
  enabled: boolean;
  maxTxAmount: string;
  maxDailyLoss: string;
  maxRiskLevel: RiskLevel;
  rebalanceIntervalSeconds: number;
  oracleHeartbeatSeconds: number;
  allowedProtocols: Address[];
  allowedExecutors: Address[];
  allowedStrategies: string[];
  executionAuthority: ExecutionAuthority;
  emergencyPaused: boolean;
};

export type AutopilotPolicyInput = {
  user: Address;
  crop: CropId;
  amount: string;
  riskPreference: RiskLevel;
  enabled: boolean;
  rebalanceIntervalHours: number;
  oracleHeartbeatMinutes: number;
  executionAuthority: ExecutionAuthority;
  executorAddress?: Address;
  selectedProtocols: Address[];
};

export type CropAutopilotDefaults = {
  crop: CropId;
  asset: string;
  defaultProtocol: string;
  defaultProtocolAddress: Address;
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
    defaultProtocol: "Agni Swap Router",
    defaultProtocolAddress: "0xe38cfa32cCd918d94E2e20230dFaD1A4Fd8aEF16",
    recommendedRiskLevel: 1,
    maxDailyLossPercent: 2,
  },
  growth: {
    asset: "mETH",
    defaultProtocol: "Agni Swap Router",
    defaultProtocolAddress: "0xe38cfa32cCd918d94E2e20230dFaD1A4Fd8aEF16",
    recommendedRiskLevel: 2,
    maxDailyLossPercent: 5,
  },
  boost: {
    asset: "USDY/mETH",
    defaultProtocol: "Agni Position Manager",
    defaultProtocolAddress: "0x71959543c31EC4d68D9D6C492Bf69A1C174bb394",
    recommendedRiskLevel: 3,
    maxDailyLossPercent: 8,
  },
};

const cropStrategyIds: Record<CropId, string> = {
  steady: "agni-usdy-safe-swap",
  growth: "agni-meth-growth-swap",
  boost: "agni-usdy-meth-liquidity",
};

function strategyIdToBytes32(strategyId: string): `0x${string}` {
  const bytes = Buffer.from(strategyId, "utf8").subarray(0, 32);
  return `0x${bytes.toString("hex").padEnd(64, "0")}` as `0x${string}`;
}

export function cropToAutopilotDefaults(crop: CropId, riskPreference: RiskLevel): CropAutopilotDefaults {
  const defaults = cropDefaults[crop];
  return {
    crop,
    asset: defaults.asset,
    defaultProtocol: defaults.defaultProtocol,
    defaultProtocolAddress: defaults.defaultProtocolAddress,
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
  const executor =
    input.executionAuthority === "managed"
      ? input.executorAddress
      : input.user;

  return {
    enabled: input.enabled,
    maxTxAmount: input.amount,
    maxDailyLoss,
    maxRiskLevel: defaults.recommendedRiskLevel,
    rebalanceIntervalSeconds: Math.max(1, Math.floor(input.rebalanceIntervalHours * 3600)),
    oracleHeartbeatSeconds: Math.max(60, Math.floor(input.oracleHeartbeatMinutes * 60)),
    allowedProtocols: input.selectedProtocols.length > 0 ? input.selectedProtocols : [defaults.defaultProtocolAddress],
    allowedExecutors: executor ? [executor] : [],
    allowedStrategies: [cropStrategyIds[input.crop]],
    executionAuthority: input.executionAuthority,
    emergencyPaused: false,
  };
}

export function buildAutopilotPolicyContractArgs(policy: AutopilotPolicy) {
  return {
    maxTxAmount: BigInt(policy.maxTxAmount || "0"),
    maxDailyLoss: BigInt(policy.maxDailyLoss || "0"),
    maxRiskLevel: policy.maxRiskLevel,
    rebalanceInterval: BigInt(policy.rebalanceIntervalSeconds),
    oracleHeartbeat: BigInt(policy.oracleHeartbeatSeconds),
    protocols: policy.allowedProtocols,
    executors: policy.allowedExecutors,
    strategies: policy.allowedStrategies.map(strategyIdToBytes32),
    enabled: policy.enabled,
  };
}

export function buildProofCard(input: { decision: AgentDecision; anchorTxHash?: `0x${string}` | null }): ProofCard {
  const { decision, anchorTxHash } = input;
  const agni = decision.execution ?? decision.plan.agni;

  const proofItems = [
    { label: "Decision Hash", value: decision.decisionHash },
    { label: "ERC-8004 Agent", value: decision.erc8004.agentId },
    { label: "DecisionLog", value: decision.benchmark.decisionLog ?? "missing" },
    { label: "Mantle Tx", value: anchorTxHash ?? decision.anchorTxHash ?? "benchmark write required" },
    { label: "Policy", value: decision.policy.reason },
  ];

  if (agni?.actionType) {
    proofItems.push({ label: "Agni move", value: agni.actionType });
  }
  if (agni?.pair) {
    proofItems.push({ label: "Pair", value: agni.pair });
  }
  if (agni?.quotedInputAmount || agni?.quotedOutputAmount) {
    proofItems.push({
      label: "Quote",
      value: `${agni.quotedInputAmount ?? "?"} -> ${agni.quotedOutputAmount ?? "?"}`,
    });
  }

  return {
    title: `${decision.plan.title} Proof`,
    asset: decision.plan.asset,
    track: "AI x RWA + Consumer & Viral DApps",
    status: decision.policy.status.toUpperCase(),
    shareText: `${decision.plan.title} used ${decision.plan.asset} with ${decision.policy.status} policy status. ${decision.plan.shareLabel ?? "Shareable harvest proof"}.`,
    proofItems,
  };
}
