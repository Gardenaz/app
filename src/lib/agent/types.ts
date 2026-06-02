export type CropId = "steady" | "growth" | "boost";
export type RiskLevel = 1 | 2 | 3;

export type AiAdvisorSignal = {
  provider: "llm" | "fallback";
  model: string;
  recommendedStrategyId: string;
  marketSummary: string;
  riskNotes: string[];
  confidenceReason: string;
};

export type AgentDecision = {
  intent: { user: `0x${string}`; crop: CropId; amount: string; riskPreference: RiskLevel };
  plan: {
    strategyId: string;
    title: string;
    riskLevel: RiskLevel;
    protocol: string;
    action: string;
    asset: string;
    expectedApy: string;
    steps: string[];
    explanation: string;
    consumerTheme?: string;
    shareLabel?: string;
    trackFit?: string;
  };
  policy: { allow: boolean; status: "approved" | "blocked"; reason: string; checks: Array<{ label: string; pass: boolean; detail: string }> };
  aiAdvisor?: AiAdvisorSignal;
  decisionHash: `0x${string}`;
  summary: string;
  createdAt: string;
  anchorTxHash?: string;
};
