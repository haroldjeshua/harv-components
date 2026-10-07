import { describe, expect, it } from "vitest";

import {
  gaussianProximity,
  interpolate,
  itemProgress,
  pickActiveIndex,
  pointerProximity,
  rowHeightFor,
  scrollProgress,
  scrollSpread,
  travelFactor,
} from "./proximity-math";

describe("gaussianProximity", () => {
  it("is 1 at the reading point and decays with distance", () => {
    expect(gaussianProximity(0, 0.1)).toBe(1);
    expect(gaussianProximity(0.05, 0.1)).toBeGreaterThan(
      gaussianProximity(0.2, 0.1),
    );
    expect(gaussianProximity(10, 0.1)).toBeLessThan(0.001);
  });

  it("stays within 0 → 1 and is symmetric", () => {
    expect(gaussianProximity(-0.3, 0.2)).toBe(gaussianProximity(0.3, 0.2));
    expect(gaussianProximity(-5, 0.2)).toBeGreaterThanOrEqual(0);
  });
});

describe("scrollProgress", () => {
  it("maps scroll position to 0 → 1 and clamps", () => {
    expect(scrollProgress(0, 2000, 1000)).toBe(0);
    expect(scrollProgress(500, 2000, 1000)).toBe(0.5);
    expect(scrollProgress(1000, 2000, 1000)).toBe(1);
    expect(scrollProgress(9999, 2000, 1000)).toBe(1);
    expect(scrollProgress(-50, 2000, 1000)).toBe(0);
  });

  it("never divides by zero on short pages", () => {
    expect(scrollProgress(0, 800, 1000)).toBe(0);
  });
});

describe("itemProgress", () => {
  it("spreads items along the rail", () => {
    expect(itemProgress(0, 5)).toBe(0);
    expect(itemProgress(4, 5)).toBe(1);
    expect(itemProgress(2, 5)).toBe(0.5);
  });

  it("handles a single item", () => {
    expect(itemProgress(0, 1)).toBe(0);
  });
});

describe("travelFactor", () => {
  it("peaks at the reading position", () => {
    // Five items, viewport halfway down: middle item swells most.
    const factors = [0, 1, 2, 3, 4].map((i) => travelFactor(i, 5, 0.5));
    expect(factors[2]).toBeGreaterThan(factors[0]);
    expect(factors[2]).toBeGreaterThan(factors[4]);
  });
});

describe("pointerProximity", () => {
  it("is 0 when the pointer is away, 1 at the row center", () => {
    expect(pointerProximity(null, 100)).toBe(0);
    expect(pointerProximity(100, 100)).toBe(1);
    expect(pointerProximity(100 + 58, 100)).toBe(0);
    expect(pointerProximity(100 + 29, 100)).toBeCloseTo(0.5, 10);
  });
});

describe("interpolate", () => {
  it("blends base to max", () => {
    expect(interpolate(7, 14, 0)).toBe(7);
    expect(interpolate(7, 14, 1)).toBe(14);
    expect(interpolate(7, 14, 0.5)).toBe(10.5);
  });
});

describe("pickActiveIndex", () => {
  // Viewport 1000px: the cutoff sits at 380px.
  it("picks the last item at or above 38% of the viewport", () => {
    expect(pickActiveIndex([100, 200, 500, 900], 1000, false)).toBe(1);
    expect(pickActiveIndex([-50, 100, 300], 1000, false)).toBe(2);
  });

  it("falls back to the first item when nothing qualifies", () => {
    expect(pickActiveIndex([500, 900], 1000, false)).toBe(0);
    expect(pickActiveIndex([null, null], 1000, false)).toBe(0);
  });

  it("picks the final item at the bottom, and undefined when empty", () => {
    expect(pickActiveIndex([100, 200], 1000, true)).toBe(1);
    expect(pickActiveIndex([], 1000, false)).toBeUndefined();
    expect(pickActiveIndex([], 1000, true)).toBeUndefined();
  });
});

describe("rowHeightFor", () => {
  it("clamps the expanded wave field to 8–20px", () => {
    expect(rowHeightFor("minimap", 10, true, 1000)).toBeLessThanOrEqual(20);
    expect(rowHeightFor("minimap", 10, true, 1000)).toBeGreaterThanOrEqual(8);
    expect(rowHeightFor("minimap", 200, true, 800)).toBe(8);
  });

  it("gives the indicator taller minimum rows", () => {
    expect(rowHeightFor("indicator", 3, false, 800)).toBeGreaterThanOrEqual(12);
    expect(rowHeightFor("chapters", 3, false, 800)).toBeGreaterThanOrEqual(8);
  });

  it("matches the rail: 384px budget over the item count", () => {
    expect(rowHeightFor("chapters", 32, false, 800)).toBe(12);
  });
});

describe("scrollSpread", () => {
  it("widens the wave for short rails", () => {
    expect(scrollSpread(5)).toBeCloseTo(0.5, 10);
    expect(scrollSpread(0)).toBe(0);
  });
});
