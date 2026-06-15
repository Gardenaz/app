import { requestAgentJson, requestAgentReadiness } from "@gardenaz/agent-sdk";
import type { AgentLiveReadiness } from "@gardenaz/agent-types";
import type { AutopilotPolicy } from "@/lib/agent/autopilot";
import type { AgentDecision, CropId, RiskLevel } from "@/lib/agent/types";

type PlanPayload = {
  user: `0x${string}`;
  crop: CropId;
  amount: string;
  riskPreference: RiskLevel;
  execute?: boolean;
  currentPositionId?: string;
  policy?: AutopilotPolicy;
};
type GardenPayload = { user: `0x${string}`; message: string; amount: string; riskPreference: RiskLevel; execute?: boolean };
type AssistantPayload = {
  user?: `0x${string}`;
  message: string;
  context?: unknown;
  view?: "canvas" | "shop" | "audit";
  mode?: "guided" | "autopilot";
};

type GardenAgentResult = {
  intent: { user: `0x${string}`; message: string; parsedStrategy: CropId };
  marketMood: { mood: "bullish" | "neutral" | "bearish"; weather: "sunny" | "cloudy" | "rainy"; reason: string };
  simulation: {
    crop: string;
    weather: "sunny" | "cloudy" | "rainy";
    background: string;
    actionLabel: string;
    potSlots: Array<{ strategyId: string; title: string; crop: string; apy: number; health: number; selected: boolean }>;
  };
  beginnerExplanation: string;
  effectivePolicy: { maxRiskLevel: RiskLevel; allowedProtocols: `0x${string}`[]; enabled: boolean };
  decision: AgentDecision;
};

type AgentServiceResponse = {
  ok: boolean;
  decision?: AgentDecision & { anchorTxHash?: `0x${string}` | null };
  anchor?: { enabled: boolean; txHash: `0x${string}` | null; note: string; mode?: "prepared" | "sent"; calldata?: `0x${string}` };
  execution?: {
    enabled: boolean;
    mode: "disabled" | "blocked" | "prepared" | "sent";
    note: string;
    operation: "swap" | "addLiquidity" | "removeLiquidity" | "rebalanceLiquidity" | null;
    approval?: {
      token: `0x${string}`;
      spender: `0x${string}`;
      amount: string;
      calldata: `0x${string}`;
    };
    preview?: {
      strategyId?: string;
      pair?: string;
      asset?: string;
      amount?: string;
      user?: `0x${string}`;
      tokenIn?: string;
      tokenOut?: string;
      quotedInputAmount?: string;
      quotedOutputAmount?: string;
      minimumOutputAmount?: string;
      feeTier?: number;
      slippageBps?: number;
      deadline?: number;
    };
    calldata?: `0x${string}`;
    target?: `0x${string}`;
    executionTxHash?: `0x${string}`;
  };
  outcome?: { txHash: `0x${string}` } | null;
  source?: "agent-service";
  error?: string;
};

type AssistantServiceResponse = {
  ok: boolean;
  answer?: string;
  source?: "agent-service";
  error?: string;
};

type AssistantRequestOptions = AssistantPayload & {
  stream?: boolean;
};

type RawAgentDecision = AgentDecision & {
    selectedOpportunity?: {
      strategyId?: string;
      title?: string;
      protocol?: string;
      protocolAddress?: `0x${string}`;
      asset?: string;
    riskLevel?: RiskLevel;
    explanation?: string;
    consumerTheme?: string;
    shareLabel?: string;
    trackFit?: string;
  };
  execution?: {
    actionType?: AgentDecision["execution"] extends infer T ? T extends { actionType?: infer A } ? A : never : never;
    executionKind?: AgentDecision["execution"] extends infer T ? T extends { executionKind?: infer A } ? A : never : never;
    pair?: string;
    feeTier?: number;
    quotedInputAmount?: string;
    quotedOutputAmount?: string;
    slippageBps?: number;
    deadlineSeconds?: number;
    positionTokenId?: string;
    tokenIn?: { symbol?: string; address?: `0x${string}` };
    tokenOut?: { symbol?: string; address?: `0x${string}` };
  };
};

function normalizeDecision(decision: RawAgentDecision): AgentDecision {
  const execution = decision.execution
    ? {
      actionType: decision.execution.actionType,
      executionKind: decision.execution.executionKind,
      pair: decision.execution.pair,
      feeTier: decision.execution.feeTier,
      quotedInputAmount: decision.execution.quotedInputAmount,
      quotedOutputAmount: decision.execution.quotedOutputAmount,
      slippageBps: decision.execution.slippageBps,
      deadline: decision.execution.deadlineSeconds != null ? String(decision.execution.deadlineSeconds) : undefined,
      positionTokenId: decision.execution.positionTokenId,
      tokenIn: decision.execution.tokenIn?.address,
      tokenOut: decision.execution.tokenOut?.address,
      tokenInSymbol: decision.execution.tokenIn?.symbol,
      tokenOutSymbol: decision.execution.tokenOut?.symbol,
    }
    : decision.plan?.agni;

  if (decision.plan) {
    return {
      ...decision,
      execution,
      plan: {
        ...decision.plan,
        protocolAddress: decision.plan.protocolAddress,
        agni: execution,
      },
    };
  }

  const selected = decision.selectedOpportunity;
  return {
    ...decision,
    execution,
    plan: {
      strategyId: selected?.strategyId ?? "unknown-strategy",
      title: selected?.title ?? selected?.strategyId ?? "Agni route preview",
      riskLevel: selected?.riskLevel ?? decision.intent.riskPreference,
      protocol: selected?.protocol ?? "Agni",
      protocolAddress: (selected as { protocolAddress?: `0x${string}` } | undefined)?.protocolAddress,
      action: execution?.actionType ?? "preview",
      asset: selected?.asset ?? "Unknown asset",
      expectedApy: "Preview",
      steps: [],
      explanation: selected?.explanation ?? decision.summary,
      consumerTheme: selected?.consumerTheme,
      shareLabel: selected?.shareLabel,
      trackFit: selected?.trackFit,
      agni: execution,
    },
  };
}

const SIM_DEC_HASH = "0x5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a5e1a" as const;
const SIM_ANC_HASH = "0xab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12" as const;

function buildSimGardenResult(payload: GardenPayload): { garden: GardenAgentResult; anchor: AgentServiceResponse["anchor"]; source: "garden-agent" } {
  const riskPref = payload.riskPreference;
  const cropId: CropId = riskPref === 3 ? "boost" : riskPref === 2 ? "growth" : "steady";
  const cropName = cropId === "boost" ? "Chili" : cropId === "growth" ? "Corn" : "Rice";
  const apyStr = cropId === "boost" ? "17.6%" : cropId === "growth" ? "9.6%" : "5.2%";
  const apy = cropId === "boost" ? 17.6 : cropId === "growth" ? 9.6 : 5.2;
  const asset = cropId === "boost" ? "USDC/WMNT LP" : cropId === "growth" ? "WMNT" : "USDC";
  const decision: AgentDecision = {
    intent: { user: payload.user, crop: cropId, amount: payload.amount, riskPreference: riskPref },
    plan: {
      strategyId: cropId,
      title: `${cropName} / Agni route`,
      riskLevel: riskPref,
      protocol: "Agni Finance",
      action: "preview",
      asset,
      expectedApy: apyStr,
      steps: [],
      explanation: `Simulated ${cropName} strategy on Agni Finance. No real funds moved.`,
    },
    policy: { allow: true, status: "approved", reason: "Within simulated policy guardrails.", checks: [] },
    decisionHash: SIM_DEC_HASH,
    summary: `Simulated ${cropName} move prepared on Agni (${apyStr}).`,
    createdAt: new Date().toISOString(),
    erc8004: { agentId: "sim-agent", registries: { agentIdentity: undefined, autopilotPolicy: undefined } },
    benchmark: { decisionLog: undefined, status: "required", anchorState: "anchored", outcomeState: "pending", transparency: "live" },
    anchorTxHash: SIM_ANC_HASH,
    track: { primary: "AI x RWA", secondary: "Consumer & Viral DApps", support: "Agentic Wallets & Economy" },
  };
  const garden: GardenAgentResult = {
    intent: { user: payload.user, message: payload.message, parsedStrategy: cropId },
    marketMood: { mood: "bullish", weather: "sunny", reason: "Demo mode — AI agent service offline." },
    simulation: {
      crop: cropName,
      weather: "sunny",
      background: "meadow",
      actionLabel: `Plant ${cropName}`,
      potSlots: [{ strategyId: cropId, title: `${cropName} / Agni`, crop: cropName, apy, health: 100, selected: true }],
    },
    beginnerExplanation: `[Demo] Your ${cropName} crop earns ~${apyStr} APY via Agni Finance. Connect agent service for live market analysis.`,
    effectivePolicy: { maxRiskLevel: riskPref, allowedProtocols: [], enabled: true },
    decision,
  };
  return { garden, anchor: { enabled: false, txHash: SIM_ANC_HASH, note: "Simulated anchor — no on-chain transaction." }, source: "garden-agent" };
}

export async function requestAgentGardenPlan(payload: GardenPayload): Promise<{ garden: GardenAgentResult; anchor: AgentServiceResponse["anchor"]; source: "garden-agent" }> {
  const agentUrl = process.env.AGENT_SERVICE_URL;
  if (!agentUrl) return buildSimGardenResult(payload);

  try {
    const json = await requestAgentJson<{ garden?: GardenAgentResult; result?: GardenAgentResult; source?: "garden-agent"; anchor?: AgentServiceResponse["anchor"] }>(
      agentUrl,
      "/garden/plan",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: payload.user,
          message: payload.message,
          amount: payload.amount,
          riskPreference: payload.riskPreference,
          execute: payload.execute ?? false,
        }),
      },
    );
    const garden = json.garden ?? json.result;
    if (!garden) throw new Error("garden agent response missing payload");
    return { garden: { ...garden, decision: normalizeDecision(garden.decision as RawAgentDecision) }, anchor: json.anchor, source: "garden-agent" };
  } catch {
    return buildSimGardenResult(payload);
  }
}

export async function requestAgentPlan(payload: PlanPayload): Promise<{ decision: AgentDecision; anchor: AgentServiceResponse["anchor"]; execution?: AgentServiceResponse["execution"]; outcome?: AgentServiceResponse["outcome"]; source: "agent-service" | "local-fallback" }> {
  const agentUrl = process.env.AGENT_SERVICE_URL;
  if (!agentUrl) {
    throw new Error("AGENT_SERVICE_URL required for live Agni planning and execution");
  }

  const json = await requestAgentJson<AgentServiceResponse>(
    agentUrl,
    "/autopilot/plan",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, anchor: process.env.AGENT_ANCHOR_ONCHAIN !== "false" }),
    },
  );
  if (!json.decision) throw new Error("agent service decision missing");
  return { decision: normalizeDecision(json.decision as RawAgentDecision), anchor: json.anchor, execution: json.execution, outcome: json.outcome, source: "agent-service" };
}

export async function requestManagedAgentExecution(payload: PlanPayload): Promise<{ decision: AgentDecision; execution?: AgentServiceResponse["execution"]; source: "agent-service" }> {
  const agentUrl = process.env.AGENT_SERVICE_URL;
  if (!agentUrl) {
    throw new Error("AGENT_SERVICE_URL required for managed execution");
  }

  const json = await requestAgentJson<AgentServiceResponse>(
    agentUrl,
    "/autopilot/execute-managed",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  if (!json.decision) throw new Error("managed execution response missing decision");
  return { decision: normalizeDecision(json.decision as RawAgentDecision), execution: json.execution, source: "agent-service" };
}

const SIM_READINESS: AgentLiveReadiness = {
  chainId: 5003,
  network: "Mantle Sepolia (sim)",
  relayer: { enabled: false, signerAddress: null, executorAddress: null, hasPrivateKey: false, rpcConfigured: false },
  contracts: {
    decisionLog: { address: null, writerAuthorized: null, note: "Sim mode — no live agent service." },
    autopilotPolicy: { address: null, callerAuthorized: null, note: "Sim mode — no live agent service." },
  },
  agni: {
    swapRouter: "0x0000000000000000000000000000000000000000",
    quoterV2: "0x0000000000000000000000000000000000000000",
    nonfungiblePositionManager: "0x0000000000000000000000000000000000000000",
    usdyTokenConfigured: false,
    mEthTokenConfigured: false,
  },
  executionModes: {
    wallet: { ready: false, status: "blocked", note: "Sim mode." },
    managed: { ready: false, status: "blocked", note: "Sim mode." },
  },
  benchmarking: { ready: false, status: "blocked", notes: ["Sim mode — no live agent service."] },
};

export async function requestLiveReadiness(): Promise<{ readiness: AgentLiveReadiness; source: "agent-service" }> {
  const agentUrl = process.env.AGENT_SERVICE_URL;
  if (!agentUrl) {
    return { readiness: SIM_READINESS, source: "agent-service" };
  }

  try {
    const json = await requestAgentReadiness(agentUrl);
    return { readiness: json.readiness, source: "agent-service" };
  } catch {
    return { readiness: SIM_READINESS, source: "agent-service" };
  }
}

async function requestAssistantResponse(payload: AssistantRequestOptions): Promise<Response> {
  const agentUrl = process.env.AGENT_SERVICE_URL;
  if (!agentUrl) throw new Error("AGENT_SERVICE_URL required for assistant replies");

  return fetch(`${agentUrl.replace(/\/$/, "")}/garden/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function buildCannedReply(payload: AssistantPayload): string {
  return payload.view === "audit"
    ? "Audit log is in demo mode — real proof anchoring activates once the AI agent service is connected."
    : "Halo! Pak Tani sedang dalam mode demo. Aksi tanam-tumbuh-panen berjalan simulasi. Hubungkan AGENT_SERVICE_URL untuk analisis pasar live.";
}

export async function requestAgentAssistantReply(payload: AssistantPayload): Promise<{ answer: string; source: "agent-service" }> {
  if (!process.env.AGENT_SERVICE_URL) {
    return { answer: buildCannedReply(payload), source: "agent-service" };
  }
  try {
    const res = await requestAssistantResponse({ ...payload, stream: false });
    const json = (await res.json()) as AssistantServiceResponse;
    if (!res.ok || !json.ok || !json.answer) throw new Error(json.error ?? `assistant HTTP ${res.status}`);
    return { answer: json.answer, source: "agent-service" };
  } catch {
    return { answer: buildCannedReply(payload), source: "agent-service" };
  }
}

export async function requestAgentAssistantReplyStream(payload: AssistantPayload): Promise<Response> {
  const res = await requestAssistantResponse({ ...payload, stream: true });
  if (!res.ok || !res.body) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch {
      bodyText = "";
    }
    throw new Error(bodyText || `assistant HTTP ${res.status}`);
  }
  return res;
}
