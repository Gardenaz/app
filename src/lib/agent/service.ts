import { runAgent } from "@gardena/agent";
import type { AgentDecision, CropId, RiskLevel } from "@/lib/agent/types";

type PlanPayload = { user: `0x${string}`; crop: CropId; amount: string; riskPreference: RiskLevel; execute?: boolean; currentPositionId?: number };
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
  effectivePolicy: { maxRiskLevel: RiskLevel; allowedProtocols: string[]; enabled: boolean };
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
    operation: "open" | "rebalance" | "close" | null;
    preview?: unknown;
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

export async function requestAgentGardenPlan(payload: GardenPayload): Promise<{ garden: GardenAgentResult; anchor: AgentServiceResponse["anchor"]; source: "garden-agent" }> {
  const agentUrl = process.env.AGENT_SERVICE_URL;
  if (!agentUrl) throw new Error("AGENT_SERVICE_URL required for garden agent");

  const res = await fetch(`${agentUrl.replace(/\/$/, "")}/garden/plan`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      user: payload.user,
      message: payload.message,
      amount: payload.amount,
      riskPreference: payload.riskPreference,
      execute: payload.execute ?? false,
    }),
  });
  const json = (await res.json()) as { ok: boolean; garden?: GardenAgentResult; result?: GardenAgentResult; source?: "garden-agent"; anchor?: AgentServiceResponse["anchor"]; error?: string };
  const garden = json.garden ?? json.result;
  if (!res.ok || !json.ok || !garden) throw new Error(json.error ?? `garden agent HTTP ${res.status}`);
  return { garden, anchor: json.anchor, source: "garden-agent" };
}

export async function requestAgentPlan(payload: PlanPayload): Promise<{ decision: AgentDecision; anchor: AgentServiceResponse["anchor"]; execution?: AgentServiceResponse["execution"]; outcome?: AgentServiceResponse["outcome"]; source: "agent-service" | "local-fallback" }> {
  const agentUrl = process.env.AGENT_SERVICE_URL;
  if (agentUrl) {
    const res = await fetch(`${agentUrl.replace(/\/$/, "")}/autopilot/plan`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, anchor: process.env.AGENT_ANCHOR_ONCHAIN !== "false" }),
    });
    const json = (await res.json()) as AgentServiceResponse;
    if (!res.ok || !json.ok || !json.decision) throw new Error(json.error ?? `agent service HTTP ${res.status}`);
    return { decision: json.decision, anchor: json.anchor, execution: json.execution, outcome: json.outcome, source: "agent-service" };
  }

  const decision = await runAgent(payload);
  return { decision, anchor: { enabled: false, txHash: null, note: "AGENT_SERVICE_URL missing; used local fallback" }, source: "local-fallback" };
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

export async function requestAgentAssistantReply(payload: AssistantPayload): Promise<{ answer: string; source: "agent-service" }> {
  const res = await requestAssistantResponse({ ...payload, stream: false });
  const json = (await res.json()) as AssistantServiceResponse;
  if (!res.ok || !json.ok || !json.answer) throw new Error(json.error ?? `assistant HTTP ${res.status}`);
  return { answer: json.answer, source: "agent-service" };
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
