export type CropId = "steady" | "growth" | "boost";
export type RiskLevel = 1 | 2 | 3;
export type Address = `0x${string}`;
export type AgniExecutionKind = "swap" | "liquidity";
export type AgniActionType = "swap" | "addLiquidity" | "removeLiquidity" | "rebalanceLiquidity" | "hold";

export type AiAdvisorSignal = {
  provider: "llm" | "fallback";
  model: string;
  recommendedStrategyId: string;
  marketSummary: string;
  riskNotes: string[];
  confidenceReason: string;
};

export type Erc8004Binding = {
  agentId: string;
  registries: {
    agentIdentity: Address | undefined;
    autopilotPolicy: Address | undefined;
  };
};

export type BenchmarkProof = {
  decisionLog: Address | undefined;
  status: "required";
  anchorState: "pending" | "anchored";
  outcomeState: "pending" | "recorded" | "failed";
  transparency: "live";
};

export type AgniDecisionSemantics = {
  executionKind?: AgniExecutionKind;
  actionType?: AgniActionType;
  tokenIn?: Address;
  tokenOut?: Address;
  tokenInSymbol?: string;
  tokenOutSymbol?: string;
  pair?: string;
  feeTier?: number;
  quotedInputAmount?: string;
  quotedOutputAmount?: string;
  slippageBps?: number;
  deadline?: string;
  positionTokenId?: string;
};

export type AgentDecision = {
  intent: { user: `0x${string}`; crop: CropId; amount: string; riskPreference: RiskLevel };
  plan: {
    strategyId: string;
    title: string;
    riskLevel: RiskLevel;
    protocol: string;
    protocolAddress?: Address;
    action: string;
    asset: string;
    expectedApy: string;
    steps: string[];
    explanation: string;
    consumerTheme?: string;
    shareLabel?: string;
    trackFit?: string;
    agni?: AgniDecisionSemantics;
  };
  execution?: AgniDecisionSemantics;
  policy: { allow: boolean; status: "approved" | "blocked"; reason: string; checks: Array<{ label: string; pass: boolean; detail: string }> };
  aiAdvisor?: AiAdvisorSignal;
  decisionHash: `0x${string}`;
  summary: string;
  createdAt: string;
  anchorTxHash?: `0x${string}` | null;
  erc8004: Erc8004Binding;
  benchmark: BenchmarkProof;
  deployment?: {
    chainId: number;
    network: string;
    contracts: {
      agentIdentity: Address;
      decisionLog: Address;
      autopilotPolicy: Address;
    };
  };
  track: {
    primary: "AI x RWA";
    secondary: "Consumer & Viral DApps";
    support: "Agentic Wallets & Economy";
  };
};

export type AgentHistoryRow = {
  decisionId: number;
  strategyId: string;
  strategyTitle: string;
  asset: string;
  protocol: string;
  amount: string;
  riskLevel: RiskLevel;
  outcome: "logged" | "success" | "failed";
  statusLabel: string;
  summary: string;
  decisionHash: `0x${string}`;
  anchorTxHash?: `0x${string}` | null;
  outcomeTxHash?: `0x${string}` | null;
  createdAt: string;
  source: "onchain" | "local";
  actionType?: AgniActionType;
  executionKind?: AgniExecutionKind;
  pair?: string;
  feeTier?: number;
  tokenInSymbol?: string;
  tokenOutSymbol?: string;
  quotedInputAmount?: string;
  quotedOutputAmount?: string;
  positionTokenId?: string;
  proofStatus: "pending" | "anchored" | "live" | "failed";
  agentId?: string;
  pnlAmount?: string;
  pnlBps?: number;
};

export type AgentPositionCard = {
  id: string;
  cropLabel: string;
  cropEmoji: string;
  title: string;
  assetLabel: string;
  protocolLabel: string;
  actionLabel: string;
  statusLabel: string;
  durationLabel: string;
  pnlLabel: string;
  proofLabel: string;
  pairLabel: string;
  agentLabel: string;
};
