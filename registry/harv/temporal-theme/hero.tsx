"use client";

import {
  scopeClass,
  toClock,
  useTemporalClock,
} from "@/registry/harv/temporal-theme/use-temporal-theme";
import "./temporal-theme.css";

// Panel hero: a one-glance greeting for what the system does. Live clock,
// current phase in words, and a swatch wearing the phase theme. No controls
// (full controls live in the stage example); nothing here can be dead.
export function TemporalHero() {
  const { minutes, state } = useTemporalClock("live", 12 * 60);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <span
        aria-hidden="true"
        className={`temporal-scope inline-flex items-center gap-2 rounded-full border px-4 py-2 ${scopeClass(state.scheme, state.temperature)}`}
        style={{ borderColor: "var(--border)" }}
      >
        <span className="font-mono text-xs">
          {state.phase} · {state.scheme} · {state.temperature}
        </span>
      </span>
      <p aria-live="polite" className="font-mono text-xs tabular-nums" style={{ color: "var(--fg-faint)" }}>
        {toClock(minutes)} from your clock
      </p>
    </div>
  );
}
