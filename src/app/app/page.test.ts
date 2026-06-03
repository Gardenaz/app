import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const pageSource = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

describe("Launch app game assistant UI", () => {
  it("renders a corner farmer agent assistant with user interaction modes", () => {
    assert.match(pageSource, /FarmerAgentCompanion/);
    assert.match(pageSource, /data-testid="farmer-agent-companion"/);
    assert.match(pageSource, /Market Coach/);
    assert.match(pageSource, /Plant for me/);
    assert.match(pageSource, /Protect harvest/);
    assert.match(pageSource, /onClick=\{/);
  });
});
