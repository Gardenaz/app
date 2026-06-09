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

function proofStatusFromDecision(decision: AgentDecision): AgentHistoryRow["proofStatus"] {
  const benchmark = decision.benchmark;
  if (!benchmark) {
    return decision.anchorTxHash ? "anchored" : "pending";
  }
  if (benchmark.outcomeState === "failed") return "failed";
  if (benchmark.outcomeState === "recorded") return "live";
  if (benchmark.anchorState === "anchored" || decision.anchorTxHash) return "anchored";
  return "pending";
}

function coerceDecision(decision: AgentDecision): AgentDecision {
  if (decision.plan) return decision;

  const raw = decision as AgentDecision & {
    selectedOpportunity?: {
      strategyId?: string;
      title?: string;
      protocol?: string;
      asset?: string;
      riskLevel?: RiskLevel;
      explanation?: string;
      consumerTheme?: string;
      shareLabel?: string;
      trackFit?: string;
    };
  };

  const execution = decision.execution;
  return {
    ...decision,
    plan: {
      strategyId: raw.selectedOpportunity?.strategyId ?? "unknown-strategy",
      title: raw.selectedOpportunity?.title ?? raw.selectedOpportunity?.strategyId ?? "Agni route preview",
      riskLevel: raw.selectedOpportunity?.riskLevel ?? decision.intent.riskPreference,
      protocol: raw.selectedOpportunity?.protocol ?? "Agni",
      action: execution?.actionType ?? "preview",
      asset: raw.selectedOpportunity?.asset ?? "Unknown asset",
      expectedApy: "Preview",
      steps: [],
      explanation: raw.selectedOpportunity?.explanation ?? decision.summary,
      consumerTheme: raw.selectedOpportunity?.consumerTheme,
      shareLabel: raw.selectedOpportunity?.shareLabel,
      trackFit: raw.selectedOpportunity?.trackFit,
      agni: execution,
    },
  };
}

function localDecisionToHistoryRow(input: AgentDecision): AgentHistoryRow {
  const decision = coerceDecision(input);
  const agni = decision.execution ?? decision.plan.agni;
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
    outcomeTxHash: null,
    createdAt: decision.createdAt,
    source: "local",
    actionType: agni?.actionType,
    executionKind: agni?.executionKind,
    pair: agni?.pair,
    feeTier: agni?.feeTier,
    tokenInSymbol: agni?.tokenInSymbol,
    tokenOutSymbol: agni?.tokenOutSymbol,
    quotedInputAmount: agni?.quotedInputAmount,
    quotedOutputAmount: agni?.quotedOutputAmount,
    positionTokenId: agni?.positionTokenId,
    proofStatus: proofStatusFromDecision(decision),
    agentId: decision.erc8004.agentId,
  };
}

export async function fetchOnchainDecisionHistory(limit = 25): Promise<AgentHistoryRow[]> {
  const client = createClient();
  const decisionCount = await client.readContract({
    address: decisionLogAddress,
    abi: decisionLogAbi,
    functionName: "decisionCount",
  }) as bigint;

  if (decisionCount === 0n) {
    return [];
  }

  const latestBlock = await client.getBlockNumber();
  const minDecisionId = decisionCount > BigInt(limit) ? decisionCount - BigInt(limit) + 1n : 1n;
  const decisionIds = Array.from({ length: Number(decisionCount - minDecisionId + 1n) }, (_, index) => decisionCount - BigInt(index));

  const rows = await Promise.all(decisionIds.map(async (decisionIdBigInt) => {
    const decisionId = Number(decisionIdBigInt);
    const decision = await client.readContract({
      address: decisionLogAddress,
      abi: decisionLogAbi,
      functionName: "decisions",
      args: [decisionIdBigInt],
    }) as readonly [
      bigint,
      `0x${string}`,
      `0x${string}`,
      Address,
      bigint,
      number,
      number,
      bigint,
      Address,
      bigint,
      bigint,
      Address,
    ];
    const outcomeRow = await client.readContract({
      address: decisionLogAddress,
      abi: decisionLogAbi,
      functionName: "outcomes",
      args: [decisionIdBigInt],
    }) as readonly [`0x${string}`, bigint, bigint, bigint, bigint, boolean, boolean, string, bigint];

    const [, decisionHash, strategyIdHex, , amount, riskLevel, decisionOutcomeCode, timestamp] = decision;
    const strategyId = bytes32ToText(strategyIdHex);
    const meta = cropMeta(strategyId);
    const strategy = meta ?? { name: strategyTitle(strategyId), asset: "USDC", protocol: "Agni Stablecoin Route" };
    const outcomeValue = Number(decisionOutcomeCode);
    const [executionTxHash, pnlBps, , inputAmount, outputAmount, success, finalized] = outcomeRow;
    const liveProofStatus = finalized ? (success ? "live" : "failed") : "anchored";
    const anchorWindowStart = latestBlock > 9_999n ? latestBlock - 9_999n : 0n;

    let anchorTxHash: `0x${string}` | null = null;
    try {
      const logs = await client.getContractEvents({
        address: decisionLogAddress,
        abi: decisionLogAbi,
        eventName: "DecisionLogged",
        args: { decisionId: decisionIdBigInt },
        fromBlock: anchorWindowStart,
        toBlock: latestBlock,
      });
      anchorTxHash = logs.at(-1)?.transactionHash ?? null;
    } catch {
      anchorTxHash = null;
    }

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
        finalized && success
          ? `${strategy.name} was carried out and finished with a recorded Agni result.`
          : finalized && !success
            ? `${strategy.name} was recorded, but the Agni result was later marked as failed.`
            : `${strategy.name} was recorded and is still waiting for a final result.`,
      decisionHash: decisionHash as `0x${string}`,
      anchorTxHash,
      outcomeTxHash: executionTxHash !== "0x0000000000000000000000000000000000000000000000000000000000000000" ? executionTxHash : null,
      createdAt: new Date(Number(timestamp) * 1000).toISOString(),
      source: "onchain" as const,
      proofStatus: liveProofStatus,
      pnlBps: Number(pnlBps),
      quotedInputAmount: inputAmount.toString(),
      quotedOutputAmount: outputAmount.toString(),
    } satisfies AgentHistoryRow;
  }));

  return rows;
}

export function toHistoryRow(decision: AgentDecision): AgentHistoryRow {
  return localDecisionToHistoryRow(decision);
}
