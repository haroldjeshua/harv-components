"use client";

import * as React from "react";
import Link from "next/link";
import { TemporalToggle } from "@/registry/harv/temporal-theme/temporal-toggle";
import {
  scopeClass,
  toClock,
  useTemporalClock,
} from "@/registry/harv/temporal-theme/use-temporal-theme";
import type {
  TemporalScheme,
  TemporalTemperature,
} from "@/registry/harv/temporal-theme/temporal-theme";

// Full-page demo: the page shell itself wears the phase theme. Dynamic mode
// follows the visitor clock; any manual pick switches to manual mode until
// "Follow the clock" is chosen again. The docs shell stays in its own theme.
export function TemporalDemoPage() {
  const [dynamic, setDynamic] = React.useState(true);
  const [scheme, setScheme] = React.useState<TemporalScheme>("light");
  const [temperature, setTemperature] = React.useState<TemporalTemperature>("neutral");
  const [simMinutes] = React.useState(12 * 60);

  const { minutes, state } = useTemporalClock(dynamic ? "live" : "simulate", simMinutes);

  const effectiveScheme = dynamic ? state.scheme : scheme;
  const effectiveTemperature = dynamic ? state.temperature : temperature;

  function pickScheme(value: TemporalScheme) {
    setScheme(value);
    setDynamic(false);
  }

  function pickTemperature(value: TemporalTemperature) {
    setTemperature(value);
    setDynamic(false);
  }

  return (
    <div>
      <Link href="/docs/temporal-theme" className="text-sm hover:opacity-70">
        ← Temporal theme docs
      </Link>
      <div
        className={`temporal-scope relative mt-6 overflow-hidden rounded-xl border ${scopeClass(effectiveScheme, effectiveTemperature)}`}
      >
      <div
        aria-hidden="true"
        className="temporal-atmosphere pointer-events-none absolute inset-0"
        style={{ "--temporal-atmosphere": state.atmosphereIntensity } as React.CSSProperties}
      />
      <div className="relative flex flex-col gap-8 p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs" style={{ color: "var(--fg-faint)" }}>
              Full-page demo
            </p>
            <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Daylight, page-wide</h1>
            <p aria-live="polite" className="mt-2 font-mono text-sm tabular-nums opacity-70">
              {toClock(minutes)} · {state.phase}
              {dynamic ? " · following the clock" : " · manual"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TemporalToggle
              scheme={effectiveScheme}
              temperature={effectiveTemperature}
              onSchemeChange={pickScheme}
              onTemperatureChange={pickTemperature}
              dynamic={dynamic}
              onDynamicChange={setDynamic}
            />
          </div>
        </div>

        {!dynamic && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Manual theme">
            {(["light", "dark"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => pickScheme(s)}
                aria-pressed={scheme === s}
                className="rounded-md border px-3 py-1.5 text-xs"
                style={{ borderColor: "var(--border)", opacity: scheme === s ? 1 : 0.6 }}
              >
                {s}
              </button>
            ))}
            {(["warm", "neutral", "cool"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => pickTemperature(t)}
                aria-pressed={temperature === t}
                className="rounded-md border px-3 py-1.5 text-xs"
                style={{ borderColor: "var(--border)", opacity: temperature === t ? 1 : 0.6 }}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {Array.from({ length: 4 }, (_, i) => (
          <section key={i} className="max-w-xl">
            <h2 className="text-xl font-semibold">Section {i + 1}</h2>
            <p className="mt-2 text-sm leading-relaxed opacity-70">
              Scroll through the day. The room holds its light while the page
              moves underneath it — scheme, warmth, and atmosphere all follow
              the phase the clock implies.
            </p>
          </section>
        ))}
      </div>
      </div>
    </div>
  );
}

