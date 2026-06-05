import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const landingSource = readFileSync(new URL("../../components/landing/landing-content.tsx", import.meta.url), "utf8");
const heroSource = readFileSync(new URL("../../components/sections/hero-cloud-reveal.tsx", import.meta.url), "utf8");
const historySource = readFileSync(new URL("../../components/sections/agent-history.tsx", import.meta.url), "utf8");

describe("Paper landing and audit language", () => {
  it("keeps the landing narrative simple and beginner-friendly", () => {
    assert.match(landingSource, /HeroCloudReveal/i);
    assert.match(heroSource, /Where guided DeFi meets/i);
    assert.match(heroSource, /an agent that proves its work/i);
    assert.match(heroSource, /explains its[\s\S]*stays inside policy[\s\S]*visible proof trail/i);
    assert.match(historySource, /What the agent did/i);
    assert.match(historySource, /Money moved/i);
  });
});
