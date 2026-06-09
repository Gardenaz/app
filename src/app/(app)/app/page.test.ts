import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { APP_ONBOARDING_STEPS, APP_WELCOME_COPY } from "@/lib/launch/app-page";
import {
  buildFlowState,
  getActionRiskPreference,
  getExecutionGardenLabel,
  getOperationLabel,
  getPreviewStepLabel,
} from "@/lib/launch/launch-actions";

const pageSource = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
const welcomeSource = readFileSync(new URL("../../../components/launch/welcome-modal.tsx", import.meta.url), "utf8");
const farmerSource = readFileSync(new URL("../../../components/base/farmer-companion/index.tsx", import.meta.url), "utf8");
const historySource = readFileSync(new URL("../../../components/sections/agent-history.tsx", import.meta.url), "utf8");
const navbarSource = readFileSync(new URL("../../../components/app/app-navbar.tsx", import.meta.url), "utf8");
const walletButtonSource = readFileSync(new URL("../../../components/base/privy-connect-button.tsx", import.meta.url), "utf8");

describe("Launch app Agni-first flow", () => {
  it("uses managed-mode-first onboarding text and flow labels", () => {
    assert.deepEqual(APP_ONBOARDING_STEPS.map((step) => step.title), [
      "Welcome",
      "Connect wallet",
      "Deposit to garden",
      "Set policy",
      "Preview plan",
      "Execute move",
    ]);
    assert.match(APP_WELCOME_COPY.title, /managed mode first/i);
    assert.match(APP_WELCOME_COPY.body, /on-chain benchmarking/i);
    assert.match(APP_WELCOME_COPY.body, /ERC-8004 identity/i);
    assert.match(APP_WELCOME_COPY.body, /deposit to garden/i);
    assert.match(APP_WELCOME_COPY.bullets[2] ?? "", /Deposit to garden/i);
    assert.match(pageSource, /Managed-mode-first flow for first-time growers/i);
    assert.match(pageSource, /Welcome, connect wallet, deposit to garden, set policy, preview the route, then execute the move/i);
    assert.match(pageSource, /Preview summaries stay in assistant chat/i);
    assert.match(pageSource, /Assistant summary ready/i);
    assert.match(pageSource, /Launch settings/);
    assert.match(pageSource, /Ready check/);
    assert.match(pageSource, /On-chain proof/);
    assert.match(pageSource, /Benchmark readiness/);
    assert.match(pageSource, /useLaunchSettings/);
    assert.match(pageSource, /shouldShowWelcomeModal/);
    assert.match(pageSource, /onboardingComplete/);
    assert.match(pageSource, /LaunchSettingsDrawer/);
    assert.match(pageSource, /openSettingsDrawer/);
    assert.match(welcomeSource, /Managed mode first/i);
    assert.match(welcomeSource, /On-chain benchmarking/i);
    assert.match(welcomeSource, /Deposit to garden/i);
    assert.match(welcomeSource, /Current draft/i);
    assert.match(welcomeSource, /Setup readiness/i);
    assert.match(navbarSource, /Managed mode first/i);
    assert.match(pageSource, /AI x RWA/i);
    assert.match(pageSource, /Agni-first/i);
    assert.match(pageSource, /Live readiness/i);
    assert.match(pageSource, /Benchmark readiness/i);
    assert.match(pageSource, /swap\/add liquidity\/remove liquidity\/rebalance/i);
    assert.match(pageSource, /useManagedGardenAccount/);
    assert.match(pageSource, /depositReady = managedAccount\.depositReady/);
    assert.match(pageSource, /managedAccount\.snapshot\?\.executorAuthorized/);
    assert.doesNotMatch(pageSource, /Claim test funds/i);
    assert.doesNotMatch(pageSource, /Move funds into vault/i);
    assert.doesNotMatch(pageSource, /Allow agent/i);
    assert.doesNotMatch(pageSource, /Start autopilot/i);
    assert.doesNotMatch(pageSource, /Open vault/i);
    assert.doesNotMatch(pageSource, /Claim gUSD/i);
    assert.doesNotMatch(pageSource, /setVaultOperator/i);
    assert.doesNotMatch(pageSource, /gardenVault\./i);
    assert.doesNotMatch(pageSource, /useGardenRwaVault/);
    assert.match(pageSource, /FarmerCompanion/);
    assert.match(pageSource, /useGardenAgent/);
    assert.match(pageSource, /useAgentPlan/);
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
