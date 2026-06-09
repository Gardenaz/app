import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAutopilotPolicy,
  buildAutopilotPolicyContractArgs,
  buildProofCard,
  cropToAutopilotDefaults,
} from "./autopilot";

describe("app autopilot model", () => {
  it("defaults managed policy to the relayer executor and explicit allowlist", () => {
    const policy = buildAutopilotPolicy({
      user: "0x1111111111111111111111111111111111111111",
      amount: "1000",
      crop: "steady",
      riskPreference: 1,
      enabled: true,
      rebalanceIntervalHours: 24,
      oracleHeartbeatMinutes: 15,
      executionAuthority: "managed",
      executorAddress: "0x9999999999999999999999999999999999999999",
      selectedProtocols: ["0xe38cfa32cCd918d94E2e20230dFaD1A4Fd8aEF16"],
    });

    assert.equal(policy.executionAuthority, "managed");
    assert.deepEqual(policy.allowedExecutors, ["0x9999999999999999999999999999999999999999"]);
    assert.deepEqual(policy.allowedProtocols, ["0xe38cfa32cCd918d94E2e20230dFaD1A4Fd8aEF16"]);
    assert.equal(policy.enabled, true);
  });

  it("builds safe autopilot policy from crop, amount, risk, selected protocols, and execution authority", () => {
    const policy = buildAutopilotPolicy({
      user: "0x1111111111111111111111111111111111111111",
      amount: "1000",
      crop: "growth",
      riskPreference: 2,
      enabled: true,
      rebalanceIntervalHours: 24,
      oracleHeartbeatMinutes: 30,
      executionAuthority: "managed",
      executorAddress: "0x9999999999999999999999999999999999999999",
      selectedProtocols: ["0xe38cfa32cCd918d94E2e20230dFaD1A4Fd8aEF16"],
    });

    assert.equal(policy.enabled, true);
    assert.equal(policy.maxTxAmount, "1000");
    assert.equal(policy.maxRiskLevel, 2);
    assert.equal(policy.rebalanceIntervalSeconds, 86400);
    assert.equal(policy.oracleHeartbeatSeconds, 1800);
    assert.equal(policy.emergencyPaused, false);
    assert.equal(policy.executionAuthority, "managed");
    assert.deepEqual(policy.allowedProtocols, ["0xe38cfa32cCd918d94E2e20230dFaD1A4Fd8aEF16"]);
    assert.deepEqual(policy.allowedExecutors, ["0x9999999999999999999999999999999999999999"]);
    assert.deepEqual(policy.allowedStrategies, ["agni-wmnt-growth-swap"]);
    assert.equal(policy.maxDailyLoss, "50");
  });

  it("builds contract args for setAutopilotPolicy with bytes32 strategy ids", () => {
    const args = buildAutopilotPolicyContractArgs(buildAutopilotPolicy({
      user: "0x1111111111111111111111111111111111111111",
      amount: "1000",
      crop: "steady",
      riskPreference: 1,
      enabled: true,
      rebalanceIntervalHours: 12,
      oracleHeartbeatMinutes: 15,
      executionAuthority: "wallet",
      executorAddress: "0x9999999999999999999999999999999999999999",
      selectedProtocols: ["0xe38cfa32cCd918d94E2e20230dFaD1A4Fd8aEF16"],
    }));

    assert.equal(args.maxTxAmount, 1000n);
    assert.equal(args.rebalanceInterval, 43200n);
    assert.equal(args.oracleHeartbeat, 900n);
    assert.deepEqual(args.executors, ["0x1111111111111111111111111111111111111111"]);
    assert.equal(args.strategies[0], "0x61676e692d757364632d736166652d7377617000000000000000000000000000");
  });

  it("never exceeds user risk preference when deriving crop defaults", () => {
    const defaults = cropToAutopilotDefaults("boost", 1);

    assert.equal(defaults.recommendedRiskLevel, 1);
    assert.equal(defaults.defaultProtocol, "Agni Position Manager");
    assert.equal(defaults.asset, "USDC/WMNT");
  });

  it("builds consumer proof card from agent decision and anchor tx", () => {
    const proof = buildProofCard({
      decision: {
        intent: { user: "0x1111111111111111111111111111111111111111", crop: "steady", amount: "1000", riskPreference: 1 },
        plan: {
          strategyId: "agni-usdc-safe-swap",
          title: "Rice / Safe Harvest",
          riskLevel: 1,
          protocol: "Agni Stablecoin Route",
          action: "Hold USDC route",
          asset: "USDC",
          expectedApy: "4-6%",
          steps: [],
          explanation: "Low risk RWA lane.",
          shareLabel: "Shareable calm harvest proof",
          agni: {
            executionKind: "swap",
            actionType: "swap",
            pair: "USDC/WMNT",
            tokenInSymbol: "USDC",
            tokenOutSymbol: "WMNT",
            quotedInputAmount: "1000",
            quotedOutputAmount: "998",
            slippageBps: 50,
            feeTier: 500,
          },
        },
        policy: { allow: true, status: "approved", reason: "inside guardrails", checks: [] },
        decisionHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        createdAt: "2026-06-02T00:00:00.000Z",
        summary: "approved Rice / Safe Harvest",
        erc8004: {
          agentId: "1",
          registries: {
            agentIdentity: "0x1111111111111111111111111111111111111111",
            autopilotPolicy: "0x2222222222222222222222222222222222222222",
          },
        },
        benchmark: {
          decisionLog: "0x3333333333333333333333333333333333333333",
          status: "required",
          anchorState: "pending",
          outcomeState: "pending",
          transparency: "live",
        },
        track: {
          primary: "AI x RWA",
          secondary: "Consumer & Viral DApps",
          support: "Agentic Wallets & Economy",
        },
      },
      anchorTxHash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    });

    assert.equal(proof.title, "Rice / Safe Harvest Proof");
    assert.equal(proof.asset, "USDC");
    assert.equal(proof.track, "AI x RWA + Consumer & Viral DApps");
    assert.equal(proof.status, "APPROVED");
    assert.equal(proof.shareText.includes("USDC"), true);
    assert.equal(proof.proofItems[0]?.label, "Decision Hash");
    assert.equal(proof.proofItems[1]?.label, "ERC-8004 Agent");
    assert.equal(proof.proofItems.some((item) => item.label === "Agni move" && /swap/i.test(item.value)), true);
    assert.equal(proof.proofItems.some((item) => item.label === "Pair" && item.value === "USDC/WMNT"), true);
    assert.equal(proof.proofItems.some((item) => item.label === "Quote" && /1000/.test(item.value) && /998/.test(item.value)), true);
  });
});
