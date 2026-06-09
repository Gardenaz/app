import type { AgentDecision } from "@/lib/agent/types";

export async function maybeAnchorDecision(decision: AgentDecision): Promise<{ enabled: boolean; txHash: `0x${string}` | null; note: string }> {
  const enabled = process.env.ANCHOR_ONCHAIN === "true";
  if (!enabled) return { enabled: false, txHash: null, note: "ANCHOR_ONCHAIN disabled" };

  return {
    enabled: false,
    txHash: null,
    note: `Real DecisionLog write required for ${decision.benchmark.transparency} benchmark proof`,
  };
}
