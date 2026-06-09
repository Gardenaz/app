import { crops } from "@/lib/crops/data";
import type { AgentHistoryRow, AgentPositionCard } from "./types";

function cropMeta(strategyId: string) {
  if (strategyId.includes("steady")) return crops[0];
  if (strategyId.includes("growth")) return crops[1];
  return crops[2];
}

function cropLabel(strategyId: string) {
  if (strategyId.includes("steady")) return "Rice";
  if (strategyId.includes("growth")) return "Corn";
  if (strategyId.includes("boost")) return "Chili";
  return "Sprout";
}

function cropEmoji(strategyId: string) {
  if (strategyId.includes("steady")) return "🌾";
  if (strategyId.includes("growth")) return "🌽";
  if (strategyId.includes("boost")) return "🌶️";
  return "🌱";
}

function actionLabel(actionType?: AgentHistoryRow["actionType"]) {
  if (actionType === "addLiquidity") return "Add liquidity";
  if (actionType === "removeLiquidity") return "Remove liquidity";
  if (actionType === "rebalanceLiquidity") return "Rebalance field";
  if (actionType === "swap") return "Swap";
  return "Watch";
}

function proofLabel(status: AgentHistoryRow["proofStatus"]) {
  if (status === "live") return "Live proof";
  if (status === "anchored") return "Anchored";
  if (status === "failed") return "Proof flagged";
  return "Waiting proof";
}

function formatDurationLabel(createdAt: string, now = new Date()) {
  const deltaMs = Math.max(0, now.getTime() - new Date(createdAt).getTime());
  const hours = Math.floor(deltaMs / 3_600_000);
  if (hours < 24) return `${Math.max(1, hours)}h`;
  return `${Math.floor(hours / 24)}d`;
}

function formatPercentFromBps(bps?: number) {
  if (typeof bps !== "number" || !Number.isFinite(bps)) return null;
  return `${(bps / 100).toFixed(2)}%`;
}

function formatPnlLabel(row: AgentHistoryRow) {
  if (row.outcome === "failed") return "Move failed";
  const percent = formatPercentFromBps(row.pnlBps);
  if (row.pnlAmount) {
    const numeric = Number(row.pnlAmount);
    const amountText = Number.isFinite(numeric)
      ? `${numeric >= 0 ? "+" : ""}${numeric.toString()}`
      : row.pnlAmount;
    return percent ? `${amountText} (${percent})` : amountText;
  }
  if (percent) return percent.startsWith("-") ? percent : `+${percent}`;
  if (row.outcome === "success") return "Live result recorded";
  return "Waiting for live result";
}

export function historyRowToCropCard(row: AgentHistoryRow, now = new Date()): AgentPositionCard {
  const strategy = cropMeta(row.strategyId);
  return {
    id: `${row.decisionId}-${row.decisionHash}`,
    cropLabel: cropLabel(row.strategyId),
    cropEmoji: cropEmoji(row.strategyId),
    title: row.strategyTitle,
    assetLabel: row.asset,
    protocolLabel: row.protocol,
    actionLabel: actionLabel(row.actionType),
    statusLabel: row.statusLabel,
    durationLabel: formatDurationLabel(row.createdAt, now),
    pnlLabel: formatPnlLabel(row),
    proofLabel: proofLabel(row.proofStatus),
    pairLabel: row.pair ?? strategy?.asset ?? row.asset,
    agentLabel: row.agentId ? `Agent #${row.agentId}` : "Agent pending",
  };
}
