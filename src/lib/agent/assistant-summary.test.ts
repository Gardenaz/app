import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildAssistantSummary } from "./assistant-summary";
import type { AgentDecision } from "./types";

const baseDecision: AgentDecision = {
  intent: { user: "0x1111111111111111111111111111111111111111", crop: "steady", amount: "1000", riskPreference: 1 },
  plan: {
    strategyId: "steady-rwa",
    title: "Steady RWA Route",
    riskLevel: 1,
    protocol: "Mantle RWA",
    action: "PLAN",
    asset: "USDY",
    expectedApy: "4.0%",
    steps: ["scan", "gate", "execute"],
    explanation: "Best low-volatility choice.",
  },
  policy: { allow: true, status: "approved", reason: "Within policy", checks: [] },
  decisionHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  summary: "Best option: steady",
  createdAt: "2026-06-04T00:00:00.000Z",
};

describe("assistant summary helpers", () => {
  it("formats a guided recommendation summary", () => {
    const summary = buildAssistantSummary("guided", baseDecision, "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
    assert.match(summary, /Best option/i);
    assert.match(summary, /Alternative/i);
    assert.match(summary, /Proof/i);
  });

  it("formats an autopilot execution summary", () => {
    const summary = buildAssistantSummary("autopilot", baseDecision);
    assert.match(summary, /Current action/i);
    assert.match(summary, /Why it moved/i);
    assert.match(summary, /Next review/i);
  });
});
