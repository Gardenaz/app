import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createDefaultLaunchSettings,
  parseLaunchSettings,
  serializeLaunchSettings,
  shouldShowWelcomeModal,
} from "./settings-state";

describe("launch settings state", () => {
  it("round-trips launch settings and keeps onboarding open until setup is complete", () => {
    const draft = createDefaultLaunchSettings();
    const encoded = serializeLaunchSettings(draft);
    const decoded = parseLaunchSettings(encoded);

    assert.equal(decoded.selectedLane, "steady");
    assert.equal(decoded.executionAuthority, "managed");
    assert.equal(
      shouldShowWelcomeModal(decoded, {
        walletConnected: false,
        depositReady: false,
        policyReady: false,
      }),
      true,
    );
    assert.equal(
      shouldShowWelcomeModal(
        {
          ...decoded,
          onboardingComplete: true,
          policyConfirmed: true,
          depositConfirmed: true,
        },
        {
          walletConnected: true,
          depositReady: true,
          policyReady: true,
        },
      ),
      false,
    );
  });
});
