import type { AgentDecision } from "@/lib/agent/types";

export async function maybeAnchorDecisionOnchain(_decision: AgentDecision): Promise<{ enabled: boolean; txHash: `0x${string}` | null; reason: string }> {
  return {
    enabled: false,
    txHash: null,
    reason: "Onchain anchor adapter stub. Enable in next phase with funded deployer key.",
  };
}
