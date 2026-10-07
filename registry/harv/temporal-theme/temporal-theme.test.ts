import { describe, expect, it } from "vitest";

import {
  DEFAULT_SCHEDULE,
  describeDay,
  phaseTheme,
  resolveTemporalState,
  type PhaseBoundary,
  type TemporalPhase,
} from "./temporal-theme";

function at(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(2026, 8, 29, hours, minutes, 0);
}

// The published phase table (Lab 003 article), row for row.
const ARTICLE_TABLE: Array<{
  time: string;
  phase: TemporalPhase;
  scheme: "light" | "dark";
  temperature: "warm" | "neutral" | "cool";
  atmosphere: number;
}> = [
  { time: "00:00", phase: "night", scheme: "dark", temperature: "cool", atmosphere: 0.1 },
  { time: "05:29", phase: "night", scheme: "dark", temperature: "cool", atmosphere: 0.1 },
  { time: "05:30", phase: "dawn", scheme: "light", temperature: "warm", atmosphere: 0.45 },
  { time: "06:30", phase: "morning", scheme: "light", temperature: "neutral", atmosphere: 0.2 },
  { time: "09:00", phase: "day", scheme: "light", temperature: "neutral", atmosphere: 0.05 },
  { time: "12:00", phase: "day", scheme: "light", temperature: "neutral", atmosphere: 0.05 },
  { time: "16:00", phase: "golden", scheme: "light", temperature: "warm", atmosphere: 0.5 },
  { time: "17:30", phase: "sunset", scheme: "light", temperature: "warm", atmosphere: 0.55 },
  { time: "18:30", phase: "dusk", scheme: "dark", temperature: "warm", atmosphere: 0.4 },
  { time: "19:30", phase: "evening", scheme: "dark", temperature: "neutral", atmosphere: 0.15 },
  { time: "22:00", phase: "night", scheme: "dark", temperature: "cool", atmosphere: 0.1 },
  { time: "23:59", phase: "night", scheme: "dark", temperature: "cool", atmosphere: 0.1 },
];

describe("resolveTemporalState", () => {
  for (const row of ARTICLE_TABLE) {
    it(`matches the published table at ${row.time}`, () => {
      const state = resolveTemporalState(at(row.time));
      expect(state.phase).toBe(row.phase);
      expect(state.scheme).toBe(row.scheme);
      expect(state.temperature).toBe(row.temperature);
      expect(state.atmosphereIntensity).toBeCloseTo(row.atmosphere, 10);
    });
  }

  it("wraps past midnight to the final entry (night)", () => {
    const state = resolveTemporalState(at("00:00"));
    expect(state.phase).toBe("night");
    expect(state.progress).toBeGreaterThanOrEqual(0);
    expect(state.progress).toBeLessThanOrEqual(1);
  });

  it("accepts a schedule override", () => {
    const custom: PhaseBoundary[] = [
      { phase: "day", startsAt: "00:00" },
      { phase: "night", startsAt: "12:00" },
    ];
    expect(resolveTemporalState(at("09:00"), custom).phase).toBe("day");
    expect(resolveTemporalState(at("13:00"), custom).phase).toBe("night");
  });

  it("reports 0 → 1 progress inside the phase", () => {
    const early = resolveTemporalState(at("16:00"));
    const late = resolveTemporalState(at("17:29"));
    expect(early.progress).toBe(0);
    expect(late.progress).toBeGreaterThan(0.9);
  });
});

describe("phaseTheme", () => {
  it("returns a phase's theme without a time of day", () => {
    expect(phaseTheme("golden")).toEqual({ scheme: "light", temperature: "warm", atmosphere: 0.5 });
    expect(phaseTheme("dusk")).toEqual({ scheme: "dark", temperature: "warm", atmosphere: 0.4 });
  });
});

describe("describeDay", () => {
  it("describes all eight boundaries with their themes", () => {
    const day = describeDay();
    expect(day).toHaveLength(8);
    expect(day.map((d) => d.phase)).toEqual([
      "dawn", "morning", "day", "golden", "sunset", "dusk", "evening", "night",
    ]);
    expect(day[0]).toMatchObject({ startsAt: "05:30", scheme: "light", temperature: "warm" });
  });

  it("follows an overridden schedule", () => {
    expect(describeDay(DEFAULT_SCHEDULE)).toHaveLength(8);
  });
});
