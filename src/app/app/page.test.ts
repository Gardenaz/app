import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const pageSource = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
const consoleSource = readFileSync(new URL("../../components/sections/garden-agent-console.tsx", import.meta.url), "utf8");

describe("Launch app game assistant UI", () => {
  it("renders a paper-style garden agent console connected to runtime API", () => {
    assert.match(pageSource, /GardenAgentConsole/);
    assert.match(consoleSource, /Playable Garden Agent/);
    assert.match(consoleSource, /Paper garden\. Real agent plan\./);
    assert.match(consoleSource, /useGardenAgent/);
    assert.match(consoleSource, /Plan safe move/);
    assert.match(consoleSource, /shadow-\[8px_8px_0_#161616\]/);
  });
});
