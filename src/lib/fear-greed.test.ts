import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fearGreedToWeather } from "./fear-greed";

describe("fear and greed weather mapping", () => {
  it("maps extreme fear to stormy", () => {
    assert.equal(fearGreedToWeather(12), "stormy");
  });

  it("maps fear to rainy", () => {
    assert.equal(fearGreedToWeather(32), "rainy");
  });

  it("maps neutral to cloudy", () => {
    assert.equal(fearGreedToWeather(55), "cloudy");
  });

  it("maps greed to sunny", () => {
    assert.equal(fearGreedToWeather(80), "sunny");
  });
});
