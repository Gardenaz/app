import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const pageSource = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
const farmerSource = readFileSync(new URL("../../components/base/farmer-companion.tsx", import.meta.url), "utf8");
const historySource = readFileSync(new URL("../../components/sections/agent-history.tsx", import.meta.url), "utf8");
const vaultSource = readFileSync(new URL("../../components/sections/garden-rwa-vault.tsx", import.meta.url), "utf8");

describe("Launch app game assistant UI", () => {
  it("renders a paper-style garden agent console connected to runtime API and live history", () => {
    assert.match(pageSource, /FarmScene/);
    assert.match(pageSource, /FarmerCompanion/);
    assert.match(pageSource, /useGardenAgent/);
    assert.match(pageSource, /Plan safe move/);
    assert.match(pageSource, /Pak Tani/);
    assert.match(pageSource, /Gardenaz Audit Garden/);
    assert.match(pageSource, /Live agent history/);
    assert.match(pageSource, /AgentHistorySection/);
    assert.match(farmerSource, /Ask about this page/);
    assert.match(farmerSource, /gUSD/);
    assert.match(farmerSource, /positionCount/);
    assert.match(historySource, /useAgentHistory/);
    assert.match(vaultSource, /Gardenaz Vault/);
    assert.match(vaultSource, /Mock RWA vault with Garden USD settlement/);
    assert.doesNotMatch(pageSource, /AI Farmer Diary/);
    assert.doesNotMatch(pageSource, /Latest decisions/);
  });
});
