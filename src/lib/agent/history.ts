import { createPublicClient, http, type Address } from "viem";
import { getContractAbi, getContractAddress } from "@/lib/contracts/config";
import { crops } from "@/lib/crops/data";
import type { AgentDecision, AgentHistoryRow, RiskLevel } from "./types";

const decisionLogAbi = getContractAbi("DecisionLog");
const decisionLogAddress = getContractAddress("decisionLog") as Address;

function resolveRpcUrl() {
  return process.env.MANTLE_RPC_URL ?? process.env.NEXT_PUBLIC_MANTLE_RPC_URL ?? process.env.RPC_URL;
}

function createClient() {
  const rpcUrl = resolveRpcUrl();
  if (!rpcUrl) {
    throw new Error("Mantle RPC URL is required to read on-chain history");
  }

  return createPublicClient({
    transport: http(rpcUrl),
  });
}

function bytes32ToText(value: `0x${string}`): string {
  return Buffer.from(value.slice(2), "hex").toString("utf8").replace(/\0+$/g, "").trim();
}

function cropMeta(strategyId: string) {
  if (strategyId.includes("steady")) {
    return crops[0];
  }
  if (strategyId.includes("growth")) {
    return crops[1];
  }
  return crops[2];
}

function outcomeLabel(outcome: number) {
  if (outcome === 1) return "success";
  if (outcome === 2) return "failed";
  return "logged";
}

function statusLabel(outcome: number) {
  if (outcome === 1) return "SUCCESS";
  if (outcome === 2) return "FAILED";
  return "LOGGED";
}

function strategyTitle(strategyId: string) {
  return cropMeta(strategyId)?.name ?? strategyId;
}

function localDecisionToHistoryRow(decision: AgentDecision): AgentHistoryRow {
  return {
    decisionId: 0,
    strategyId: decision.plan.strategyId,
    strategyTitle: decision.plan.title,
    asset: decision.plan.asset,
    protocol: decision.plan.protocol,
    amount: decision.intent.amount,
    riskLevel: decision.plan.riskLevel,
    outcome: decision.policy.allow ? "logged" : "failed",
    statusLabel: decision.policy.allow ? "APPROVED" : "BLOCKED",
    summary: decision.summary,
    decisionHash: decision.decisionHash,
    anchorTxHash: decision.anchorTxHash ?? null,
    createdAt: decision.createdAt,
    source: "local",
  };
}

export async function fetchOnchainDecisionHistory(limit = 25): Promise<AgentHistoryRow[]> {
  const client = createClient();

  const logs = (await client.getContractEvents({
    address: decisionLogAddress,
    abi: decisionLogAbi,
    eventName: "DecisionLogged",
    fromBlock: 0n,
    toBlock: "latest",
  })) as unknown as Array<{ args: { decisionId: bigint }; transactionHash?: `0x${string}` | null }>;

  const recentLogs = [...logs]
    .sort((a, b) => Number((b.args.decisionId ?? 0n) - (a.args.decisionId ?? 0n)))
    .slice(0, limit);

  const rows = await Promise.all(recentLogs.map(async (log) => {
    const decisionId = Number(log.args.decisionId ?? 0n);
    const decision = await client.readContract({
      address: decisionLogAddress,
      abi: decisionLogAbi,
      functionName: "decisions",
      args: [BigInt(decisionId)],
    }) as readonly [bigint, `0x${string}`, `0x${string}`, Address, bigint, bigint, bigint, bigint];

    const [, decisionHash, strategyIdHex, , amount, riskLevel, outcome, timestamp] = decision;
    const strategyId = bytes32ToText(strategyIdHex);
    const meta = cropMeta(strategyId);
    const strategy = meta ?? { name: strategyTitle(strategyId), asset: "USDY", protocol: "Mantle RWA USDY Route" };
    const outcomeValue = Number(outcome);

    return {
      decisionId,
      strategyId,
      strategyTitle: strategy.name,
      asset: strategy.asset,
      protocol: strategy.protocol,
      amount: amount.toString(),
      riskLevel: Number(riskLevel) as RiskLevel,
      outcome: outcomeLabel(outcomeValue),
      statusLabel: statusLabel(outcomeValue),
      summary:
        outcomeValue === 1
          ? `${strategy.name} was carried out and finished with a successful result.`
          : outcomeValue === 2
            ? `${strategy.name} was recorded, but the result was later marked as failed.`
            : `${strategy.name} was recorded and is still waiting for a final result.`,
      decisionHash: decisionHash as `0x${string}`,
      anchorTxHash: (log.transactionHash ?? null) as `0x${string}` | null,
      createdAt: new Date(Number(timestamp) * 1000).toISOString(),
      source: "onchain" as const,
    } satisfies AgentHistoryRow;
  }));

  return rows;
}

export function toHistoryRow(decision: AgentDecision): AgentHistoryRow {
  return localDecisionToHistoryRow(decision);
}
