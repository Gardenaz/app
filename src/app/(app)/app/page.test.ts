import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildFlowState,
  getActionRiskPreference,
  getExecutionGardenLabel,
  getOperationLabel,
  getPreviewStepLabel,
} from "@/lib/launch/launch-actions";

describe("Launch app Agni-first flow", () => {
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
