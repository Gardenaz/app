import type { AgentDecision } from "@/lib/agent/types";

export async function maybeAnchorDecision(decision: AgentDecision): Promise<{ enabled: boolean; txHash: `0x${string}` | null; note: string }> {
  const enabled = process.env.ANCHOR_ONCHAIN === "true";
  if (!enabled) return { enabled: false, txHash: null, note: "ANCHOR_ONCHAIN disabled" };

  // Placeholder testnet-ready adapter:
  // next step: wire viem walletClient + DecisionLog ABI call.
  return {
    enabled: true,
    txHash: (`0x${decision.decisionHash.slice(2, 66)}`) as `0x${string}`,
    note: "Simulated anchor (replace with real DecisionLog write)",
  };
}
