"use client";

import * as React from "react";

import {
  resolveTemporalState,
  type TemporalScheme,
  type TemporalTemperature,
} from "@/registry/harv/temporal-theme/temporal-theme";

// Entry-side runtime for the Daylight demos. Mirrors the lab's demo logic
// (temporal-theme-demo.tsx): live ticks are cheap and infrequent, manual
// picks are flags on top of the clock, scrubbing re-syncs. Not part of the
// shipped registry item, which stays resolver + toggle + styles per manifest.

function toDate(minutes: number): Date {
  return new Date(2026, 8, 29, Math.floor(minutes / 60), minutes % 60, 0);
}

function nowMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

// Hydration approach (chosen, no blocking script): server and first client
// render share a deterministic fallback (noon, day phase), so markup
// matches and no wrong theme flashes. The live clock swaps in on mount.
const FALLBACK_MINUTES = 12 * 60;

function useNow(mode: "live" | "simulate"): Date | null {
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (mode !== "live") return;
    const refresh = () => setNow(new Date());
    refresh();
    const id = setInterval(refresh, 30_000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [mode]);

  return now;
}

export function useTemporalClock(mode: "live" | "simulate", simMinutes: number) {
  const now = useNow(mode);
  // Null until mount in live mode → deterministic fallback, no mismatch.
  const minutes = mode === "live" ? (now ? nowMinutes(now) : FALLBACK_MINUTES) : simMinutes;
  const state = React.useMemo(() => resolveTemporalState(toDate(minutes)), [minutes]);
  return { minutes, state };
}

// Documented snippet (approved): neutral rides the scope base with no
// suffix class. Hosts copy this mapping; it is not a shipped export.
export function scopeClass(
  scheme: TemporalScheme,
  temperature: TemporalTemperature,
): string {
  if (scheme === "dark") {
    if (temperature === "warm") return "temporal-dark-warm";
    if (temperature === "cool") return "temporal-dark-cool";
    return "temporal-dark";
  }
  if (temperature === "warm") return "temporal-light-warm";
  if (temperature === "cool") return "temporal-light-cool";
  return "";
}

export function toClock(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}
