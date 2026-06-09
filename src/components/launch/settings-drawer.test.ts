import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const drawerSource = readFileSync(new URL("./settings-drawer.tsx", import.meta.url), "utf8");

describe("launch settings drawer", () => {
  it("exposes quick save and cancel controls with beginner-friendly labels", () => {
    assert.match(drawerSource, /Quick settings/i);
    assert.match(drawerSource, /Save changes/i);
    assert.match(drawerSource, /Cancel/i);
    assert.match(drawerSource, /Managed mode/i);
    assert.match(drawerSource, /Default amount/i);
    assert.match(drawerSource, /Risk level/i);
  });
});
