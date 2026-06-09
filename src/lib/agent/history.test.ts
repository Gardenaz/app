import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toHistoryRow } from "./history";
import { historyRowToCropCard } from "./history-cards";
import type { AgentDecision } from "./types";

const decision: AgentDecision = {
  intent: { user: "0x1111111111111111111111111111111111111111", crop: "growth", amount: "1500", riskPreference: 2 },
  plan: {
    strategyId: "agni-wmnt-growth-swap",
    title: "Corn / Growth Field",
    riskLevel: 2,
    protocol: "Agni",
    action: "Grow with WMNT",
    asset: "WMNT",
    expectedApy: "7-11%",
    steps: ["quote", "policy", "execute"],
    explanation: "Balanced lane with WMNT upside.",
    agni: {
      executionKind: "liquidity",
      actionType: "addLiquidity",
      pair: "USDC/WMNT",
      tokenInSymbol: "USDC",
      tokenOutSymbol: "WMNT",
      quotedInputAmount: "1500",
      quotedOutputAmount: "1491",
      positionTokenId: "42",
      feeTier: 500,
    },
  },
  policy: { allow: true, status: "approved", reason: "Within policy", checks: [] },
  decisionHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  summary: "Corn field planted with balanced Agni liquidity.",
  createdAt: "2026-06-06T00:00:00.000Z",
  anchorTxHash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  erc8004: {
    agentId: "17",
    registries: {
      agentIdentity: "0x1111111111111111111111111111111111111111",
      autopilotPolicy: "0x2222222222222222222222222222222222222222",
    },
  },
  benchmark: {
    decisionLog: "0x3333333333333333333333333333333333333333",
    status: "required",
    anchorState: "anchored",
    outcomeState: "pending",
    transparency: "live",
  },
  track: {
    primary: "AI x RWA",
    secondary: "Consumer & Viral DApps",
    support: "Agentic Wallets & Economy",
  },
};

describe("history helpers", () => {
  it("keeps agni metadata and ERC-8004 binding when converting a local decision", () => {
    const row = toHistoryRow(decision);

    assert.equal(row.actionType, "addLiquidity");
    assert.equal(row.executionKind, "liquidity");
    assert.equal(row.pair, "USDC/WMNT");
    assert.equal(row.positionTokenId, "42");
    assert.equal(row.agentId, "17");
    assert.equal(row.proofStatus, "anchored");
  });

  it("coerces a raw autopilot-shaped decision without plan into a safe history row", () => {
    const rawDecision = {
      ...decision,
      plan: undefined,
      selectedOpportunity: {
        strategyId: "agni-usdc-safe-swap",
        protocol: "Agni Swap Router",
        asset: "USDC",
        riskLevel: 1,
        explanation: "Safer swap route.",
        shareLabel: "Stable moat lane powered by USDC",
      },
    } as unknown as AgentDecision;

    const row = toHistoryRow(rawDecision);

    assert.equal(row.strategyId, "agni-usdc-safe-swap");
    assert.equal(row.protocol, "Agni Swap Router");
    assert.equal(row.asset, "USDC");
  });

  it("maps a history row into a beginner crop card with duration, PnL, and proof labels", () => {
    const row = {
      ...toHistoryRow(decision),
      outcome: "success" as const,
      statusLabel: "SUCCESS",
      outcomeTxHash: "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc" as const,
      pnlAmount: "24.5",
      pnlBps: 163,
      proofStatus: "live" as const,
    };

    const card = historyRowToCropCard(row, new Date("2026-06-07T12:00:00.000Z"));

    assert.equal(card.cropLabel, "Corn");
    assert.equal(card.agentLabel, "Agent #17");
    assert.equal(card.durationLabel, "1d");
    assert.equal(card.pnlLabel, "+24.5 (1.63%)");
    assert.equal(card.proofLabel, "Live proof");
    assert.equal(card.actionLabel, "Add liquidity");
    assert.equal(card.pairLabel, "USDC/WMNT");
  });
});
