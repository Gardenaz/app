import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  buildFlowState,
  getActionRiskPreference,
  getExecutionGardenLabel,
  getOperationLabel,
  getPreviewStepLabel,
} from "@/lib/launch/launch-actions";

const pageSource = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
const farmerSource = readFileSync(new URL("../../../components/base/farmer-companion/index.tsx", import.meta.url), "utf8");
const historySource = readFileSync(new URL("../../../components/sections/agent-history.tsx", import.meta.url), "utf8");
const navbarSource = readFileSync(new URL("../../../components/app/app-navbar.tsx", import.meta.url), "utf8");
const walletButtonSource = readFileSync(new URL("../../../components/base/privy-connect-button.tsx", import.meta.url), "utf8");

describe("Launch app Agni-first flow", () => {
  it("uses a direct wallet-policy-preview-execute beginner flow without vault onboarding language", () => {
    assert.match(pageSource, /Connect wallet/i);
    assert.match(pageSource, /Set policy/i);
    assert.match(pageSource, /Preview plan/i);
    assert.match(pageSource, /Execute move/i);
    assert.match(pageSource, /AI x RWA/i);
    assert.match(pageSource, /Agni-first/i);
    assert.match(pageSource, /Live readiness/i);
    assert.match(pageSource, /Live benchmark readiness/i);
    assert.match(pageSource, /swap\/add liquidity\/remove liquidity\/rebalance/i);
    assert.doesNotMatch(pageSource, /Claim test funds/i);
    assert.doesNotMatch(pageSource, /Move funds into vault/i);
    assert.doesNotMatch(pageSource, /Allow agent/i);
    assert.doesNotMatch(pageSource, /Start autopilot/i);
    assert.doesNotMatch(pageSource, /Open vault/i);
    assert.doesNotMatch(pageSource, /Claim gUSD/i);
    assert.doesNotMatch(pageSource, /setVaultOperator/i);
    assert.doesNotMatch(pageSource, /gardenVault\./i);
    assert.match(pageSource, /FarmerCompanion/);
    assert.match(pageSource, /useGardenAgent/);
    assert.match(pageSource, /useAgentPlan/);
    assert.match(pageSource, /snapshot\?\.policyEnabled/);
    assert.match(farmerSource, /Quick actions/);
    assert.match(historySource, /useAgentHistory/);
    assert.match(navbarSource, /Mantle Testnet/);
    assert.match(navbarSource, /Mantle Mainnet Soon/);
    assert.match(walletButtonSource, /Wallet profile/);
    assert.match(walletButtonSource, /Logout/);
    assert.match(walletButtonSource, /DropdownMenu/);
  });

  it("keeps the flow boundaries aligned to real Agni planning and execution states", () => {
    assert.deepEqual(
      buildFlowState({
        connected: true,
        policyReady: true,
        planPreviewed: false,
        hasExecutionTarget: false,
      }),
      {
        hasConnectedWallet: true,
        hasPolicy: true,
        hasPreview: false,
        canExecute: false,
      },
    );

    assert.equal(getPreviewStepLabel("prepared"), "Preview ready");
    assert.equal(getPreviewStepLabel("sent"), "Preview anchored");
    assert.equal(getPreviewStepLabel("disabled"), "Preview unavailable");
    assert.equal(getPreviewStepLabel("blocked"), "Preview blocked");

    assert.equal(getOperationLabel("swap"), "Swap");
    assert.equal(getOperationLabel("addLiquidity"), "Add liquidity");
    assert.equal(getOperationLabel("removeLiquidity"), "Remove liquidity");
    assert.equal(getOperationLabel("rebalanceLiquidity"), "Rebalance liquidity");
    assert.equal(getOperationLabel(null), "No move yet");

    assert.equal(getExecutionGardenLabel("swap"), "Transplant");
    assert.equal(getExecutionGardenLabel("addLiquidity"), "Plant");
    assert.equal(getExecutionGardenLabel("removeLiquidity"), "Harvest");
    assert.equal(getExecutionGardenLabel("rebalanceLiquidity"), "Rebalance field");
    assert.equal(getExecutionGardenLabel(null), "Wait");

    assert.equal(getActionRiskPreference("protect", 3), 1);
    assert.equal(getActionRiskPreference("harvest", 2), 2);
  });
});
