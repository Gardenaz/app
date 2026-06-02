import { runAgent } from "@gardena/agent";
import type { AgentDecision, CropId, RiskLevel } from "@/lib/agent/types";

type PlanPayload = { user: `0x${string}`; crop: CropId; amount: string; riskPreference: RiskLevel };

type AgentServiceResponse = {
  ok: boolean;
  decision?: AgentDecision & { anchorTxHash?: `0x${string}` };
  anchor?: { enabled: boolean; txHash: `0x${string}` | null; note: string; mode?: "prepared" | "sent"; calldata?: `0x${string}` };
  source?: "agent-service";
  error?: string;
};

export async function requestAgentPlan(payload: PlanPayload): Promise<{ decision: AgentDecision; anchor: AgentServiceResponse["anchor"]; source: "agent-service" | "local-fallback" }> {
  const agentUrl = process.env.AGENT_SERVICE_URL;
  console.log("Agent", agentUrl)
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
