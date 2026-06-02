import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAutopilotPolicy,
  buildProofCard,
  cropToAutopilotDefaults,
} from "./autopilot";

describe("app autopilot model", () => {
  it("builds safe autopilot policy from crop, amount, risk, and selected protocols", () => {
    const policy = buildAutopilotPolicy({
      amount: "1000",
      crop: "growth",
      riskPreference: 2,
      enabled: true,
      rebalanceIntervalHours: 24,
      selectedProtocols: ["Mantle mETH Yield Route"],
    });

    assert.equal(policy.enabled, true);
    assert.equal(policy.maxTxAmount, "1000");
    assert.equal(policy.maxRiskLevel, 2);
    assert.equal(policy.rebalanceIntervalSeconds, 86400);
    assert.equal(policy.emergencyPaused, false);
    assert.deepEqual(policy.allowedProtocols, ["Mantle mETH Yield Route"]);
    assert.equal(policy.maxDailyLoss, "50");
  });

  it("never exceeds user risk preference when deriving crop defaults", () => {
    const defaults = cropToAutopilotDefaults("boost", 1);

    assert.equal(defaults.recommendedRiskLevel, 1);
    assert.equal(defaults.defaultProtocol, "Mantle Dynamic RWA Route");
    assert.equal(defaults.asset, "USDY/mETH");
  });

  it("builds consumer proof card from agent decision and anchor tx", () => {
    const proof = buildProofCard({
      decision: {
        intent: { user: "0x1111111111111111111111111111111111111111", crop: "steady", amount: "1000", riskPreference: 1 },
        plan: {
          strategyId: "steady-rwa-usdy",
          title: "Rice / Safe Harvest",
          riskLevel: 1,
          protocol: "Mantle RWA USDY Route",
          action: "Hold USDY route",
          asset: "USDY",
          expectedApy: "4-6%",
          steps: [],
          explanation: "Low risk RWA lane.",
          shareLabel: "Shareable calm harvest proof",
        },
        policy: { allow: true, status: "approved", reason: "inside guardrails", checks: [] },
        decisionHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        createdAt: "2026-06-02T00:00:00.000Z",
        summary: "approved Rice / Safe Harvest",
      },
      anchorTxHash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    });

    assert.equal(proof.title, "Rice / Safe Harvest Proof");
    assert.equal(proof.asset, "USDY");
    assert.equal(proof.track, "AI x RWA + Consumer & Viral DApps");
    assert.equal(proof.status, "APPROVED");
    assert.equal(proof.shareText.includes("USDY"), true);
    assert.equal(proof.proofItems[0]?.label, "Decision Hash");
    assert.equal(proof.proofItems[1]?.label, "Mantle Tx");
  });
});
