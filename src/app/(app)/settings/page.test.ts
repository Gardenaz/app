import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const pageSource = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

describe("managed settings page", () => {
  it("shows advanced settings sections for managed account, policy, and network", () => {
    assert.match(pageSource, /Managed settings/i);
    assert.match(pageSource, /Managed account/i);
    assert.match(pageSource, /Policy defaults/i);
    assert.match(pageSource, /Network readiness/i);
    assert.match(pageSource, /Reset to recommended defaults/i);
  });
});
