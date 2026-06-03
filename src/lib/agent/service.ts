import { runAgent } from "@gardena/agent";
import type { AgentDecision, CropId, RiskLevel } from "@/lib/agent/types";

type PlanPayload = { user: `0x${string}`; crop: CropId; amount: string; riskPreference: RiskLevel };
type GardenPayload = { user: `0x${string}`; message: string; amount: string; riskPreference: RiskLevel; execute?: boolean };
type AssistantPayload = { user?: `0x${string}`; message: string; context?: unknown; view?: "canvas" | "shop" | "audit" };

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
  source?: "agent-service";
  error?: string;
};

type AssistantServiceResponse = {
  ok: boolean;
  answer?: string;
  source?: "agent-service" | "local-fallback";
  error?: string;
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

export async function requestAgentPlan(payload: PlanPayload): Promise<{ decision: AgentDecision; anchor: AgentServiceResponse["anchor"]; source: "agent-service" | "local-fallback" }> {
  const agentUrl = process.env.AGENT_SERVICE_URL;
  if (agentUrl) {
    const res = await fetch(`${agentUrl.replace(/\/$/, "")}/autopilot/plan`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, anchor: process.env.AGENT_ANCHOR_ONCHAIN !== "false" }),
    });
    const json = (await res.json()) as AgentServiceResponse;
    if (!res.ok || !json.ok || !json.decision) throw new Error(json.error ?? `agent service HTTP ${res.status}`);
    // console.log(json)
    return { decision: json.decision, anchor: json.anchor, source: "agent-service" };
  }

  const decision = await runAgent(payload);
  return { decision, anchor: { enabled: false, txHash: null, note: "AGENT_SERVICE_URL missing; used local fallback" }, source: "local-fallback" };
}

export async function requestAgentAssistantReply(payload: AssistantPayload): Promise<{ answer: string; source: "agent-service" | "local-fallback" }> {
  const agentUrl = process.env.AGENT_SERVICE_URL;
  if (agentUrl) {
    const res = await fetch(`${agentUrl.replace(/\/$/, "")}/garden/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as AssistantServiceResponse;
    if (!res.ok || !json.ok || !json.answer) throw new Error(json.error ?? `assistant HTTP ${res.status}`);
    return { answer: json.answer, source: "agent-service" };
  }

  const context = payload.context as { marketLabel?: string; weatherReason?: string; gUsdBalance?: string; positionCount?: number; latestDecision?: string | null } | undefined;
  const answer = [
    `I can answer about balance, positions, market, seed shop, or audit proof.`,
    context?.marketLabel ? `Current market: ${context.marketLabel}.` : null,
    context?.weatherReason ? context.weatherReason : null,
    context?.gUsdBalance ? `gUSD balance: ${context.gUsdBalance}.` : null,
    typeof context?.positionCount === "number" ? `Active positions: ${context.positionCount}.` : null,
    context?.latestDecision ? `Latest decision: ${context.latestDecision}.` : null,
  ].filter(Boolean).join(" ");

  return { answer, source: "local-fallback" };
}
