import { runAgent } from "@gardena/agent";
import type { AgentDecision, CropId, RiskLevel } from "@/lib/agent/types";

type PlanPayload = { user: `0x${string}`; crop: CropId; amount: string; riskPreference: RiskLevel };
type GardenPayload = { user: `0x${string}`; message: string; amount: string; riskPreference: RiskLevel; execute?: boolean };

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
  decision?: AgentDecision & { anchorTxHash?: `0x${string}` };
  anchor?: { enabled: boolean; txHash: `0x${string}` | null; note: string; mode?: "prepared" | "sent"; calldata?: `0x${string}` };
  source?: "agent-service";
  error?: string;
};

export async function requestAgentGardenPlan(payload: GardenPayload): Promise<{ garden: GardenAgentResult; source: "garden-agent" }> {
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
  const json = (await res.json()) as { ok: boolean; garden?: GardenAgentResult; result?: GardenAgentResult; source?: "garden-agent"; error?: string };
  const garden = json.garden ?? json.result;
  if (!res.ok || !json.ok || !garden) throw new Error(json.error ?? `garden agent HTTP ${res.status}`);
  return { garden, source: "garden-agent" };
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
