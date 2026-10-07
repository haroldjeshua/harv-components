"use client";

import * as React from "react";
import { Moon, Sun, SunMoon, Sunrise, Sunset } from "lucide-react";
import { useTheme } from "next-themes";

import type {
  TemporalPhase,
  TemporalScheme,
  TemporalTemperature,
} from "@/registry/harv/temporal-theme/temporal-theme";
import {
  scopeClass,
  toClock,
  useTemporalClock,
} from "@/registry/harv/temporal-theme/use-temporal-theme";
import "../temporal-theme.css";

export const meta = { id: "stage", title: "Daylight stage, live clock" };

// Contained demo stage. Mirrors the lab's demo surface and control panel:
// Live follows the visitor clock (30s tick + tab-focus refresh), Simulate
// follows the scrubber, scheme/temperature are manual offsets with "from
// day" provenance, and scrubbing re-syncs everything to the clock.
// Deviations from lab source, documented: segmented controls and the hour
// scrubber are native elements (radiogroup + range input) instead of Radix
// ToggleGroup and the borrowed slider, so the entry adds no dependencies.
function PhaseIcon({ phase, minutes }: { phase: TemporalPhase; minutes: number }) {
  const Icon =
    phase === "night" && minutes < 330
      ? SunMoon
      : phase === "night" || phase === "evening"
        ? Moon
        : phase === "dawn"
          ? Sunrise
          : phase === "sunset" || phase === "dusk" || phase === "golden"
            ? Sunset
            : Sun;
  return <Icon aria-hidden="true" className="size-3.5" style={{ color: "var(--fg-faint)" }} />;
}

function Provenance({ manual, phase }: { manual: boolean; phase: TemporalPhase }) {
  return (
    <span className="font-mono text-[11px]" style={{ color: "var(--fg-faint)" }}>
      {manual ? "manual" : `from ${phase}`}
    </span>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  columns,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  columns: number;
}) {
  const groupId = React.useId();
  return (
    <div>
      <p id={groupId} className="text-sm font-medium">
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={groupId}
        className="mt-2 grid gap-1"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className="min-h-9 rounded-md border px-2 text-xs"
              style={{
                borderColor: "var(--border)",
                background: selected ? "var(--fg)" : "transparent",
                color: selected ? "var(--bg)" : "var(--fg)",
                cursor: "pointer",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const ALL_TEMPORAL_CLASSES = [
  "temporal-scope",
  "temporal-light-warm",
  "temporal-light-cool",
  "temporal-dark",
  "temporal-dark-warm",
  "temporal-dark-cool",
];

export default function TemporalStageExample() {
  const [mode, setMode] = React.useState<"live" | "simulate">("live");
  const [scope, setScope] = React.useState<"page" | "site">("page");
  const [simMinutes, setSimMinutes] = React.useState(12 * 60);
  const [scheme, setScheme] = React.useState<TemporalScheme>("light");
  const [temperature, setTemperature] = React.useState<TemporalTemperature>("neutral");
  const [manualScheme, setManualScheme] = React.useState(false);
  const [manualTemperature, setManualTemperature] = React.useState(false);

  const { minutes, state } = useTemporalClock(mode, simMinutes);

  const effectiveScheme = manualScheme ? scheme : state.scheme;
  const effectiveTemperature = manualTemperature ? temperature : state.temperature;
  const adjusted = manualScheme || manualTemperature;

  const resync = () => {
    setManualScheme(false);
    setManualTemperature(false);
  };

  // Article-level scope, not component behavior: page-wide drives the mini
  // browser above; site-wide applies the phase to the document root (theme
  // via next-themes plus a full-viewport wash) and reverses everything on
  // exit or unmount.
  const { theme, setTheme } = useTheme();
  const savedRef = React.useRef<{ theme: string | undefined; atmosphere: string | null } | null>(null);
  const appliedRef = React.useRef(false);
  const surfaceClass = scopeClass(effectiveScheme, effectiveTemperature);

  React.useEffect(() => {
    const root = document.documentElement;
    if (scope !== "site") {
      if (appliedRef.current) {
        root.classList.remove(...ALL_TEMPORAL_CLASSES);
        if (savedRef.current) {
          if (savedRef.current.theme) setTheme(savedRef.current.theme);
          if (savedRef.current.atmosphere) root.style.setProperty("--temporal-atmosphere", savedRef.current.atmosphere);
          else root.style.removeProperty("--temporal-atmosphere");
        }
        appliedRef.current = false;
        savedRef.current = null;
      }
      return;
    }
    if (!appliedRef.current) {
      savedRef.current = {
        theme: theme === "light" || theme === "dark" ? theme : undefined,
        atmosphere: root.style.getPropertyValue("--temporal-atmosphere") || null,
      };
      appliedRef.current = true;
    }
    root.classList.remove(...ALL_TEMPORAL_CLASSES);
    root.classList.add("temporal-scope", ...surfaceClass.split(" ").filter(Boolean));
    root.style.setProperty("--temporal-atmosphere", String(state.atmosphereIntensity));
    setTheme(effectiveScheme);
    return () => {
      root.classList.remove(...ALL_TEMPORAL_CLASSES);
      if (savedRef.current) {
        if (savedRef.current.theme) setTheme(savedRef.current.theme);
        if (savedRef.current.atmosphere) root.style.setProperty("--temporal-atmosphere", savedRef.current.atmosphere);
        else root.style.removeProperty("--temporal-atmosphere");
      }
    };
  }, [scope, surfaceClass, effectiveScheme, state.atmosphereIntensity, theme, setTheme]);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="max-w-xs">
        <Segmented
          label="Scope"
          columns={2}
          value={scope}
          onChange={setScope}
          options={[
            { value: "page", label: "Page-wide" },
            { value: "site", label: "Site-wide" },
          ]}
        />
      </div>
      <p aria-live="polite" className="self-end font-mono text-xs tabular-nums" style={{ color: "var(--fg-faint)" }}>
        {toClock(minutes)} · {state.phase}
        {adjusted ? " · adjusted" : ""}
      </p>

      {scope === "site" && (
        <>
          <div aria-hidden="true" className="temporal-tint pointer-events-none fixed inset-0 z-[70]" />
          <div
            aria-hidden="true"
            className="temporal-atmosphere pointer-events-none fixed inset-0 z-[70]"
            style={{ "--temporal-atmosphere": state.atmosphereIntensity } as React.CSSProperties}
          />
        </>
      )}

      <div
        className={`temporal-scope relative flex min-h-[22rem] flex-col overflow-hidden rounded-xl border ${surfaceClass}`}
        style={{ "--temporal-atmosphere": state.atmosphereIntensity } as React.CSSProperties}
      >
        <div
          aria-hidden="true"
          className="flex items-center gap-1.5 border-b border-current px-4 py-2.5 opacity-40"
        >
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 hidden flex-1 truncate rounded-md bg-current px-3 py-1 font-mono text-[11px] opacity-30 sm:block">
            temporal.page/{state.phase}
          </span>
          <span className="ml-2 font-mono text-[11px] tabular-nums sm:ml-0">
            {toClock(minutes)}
          </span>
        </div>
        <div aria-hidden="true" className="temporal-tint pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="temporal-atmosphere pointer-events-none absolute inset-0" />
        <div className="relative flex flex-1 flex-col justify-center gap-3 px-6 py-8 sm:px-10">
          <p className="font-mono text-[11px] uppercase tracking-wider opacity-70">
            {effectiveScheme} · {effectiveTemperature} · {state.phase}
          </p>
          <p className="text-balance text-3xl font-medium leading-snug sm:text-4xl">
            The room changes its light.
          </p>
          <p className="max-w-md text-pretty text-sm leading-relaxed opacity-70">
            This window wears the phase theme. Nothing outside it is
            affected — the site theme stays exactly where it was.
          </p>
        </div>
      </div>

      <div
        className="flex flex-col gap-4 rounded-xl border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <p className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "var(--fg-faint)" }}>
          Time source control panel
        </p>
        <Segmented
          label="Time source"
          columns={2}
          value={mode}
          onChange={(value) => {
            setMode(value);
            resync();
          }}
          options={[
            { value: "live", label: "Live" },
            { value: "simulate", label: "Simulate" },
          ]}
        />

        {mode === "simulate" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="temporal-stage-scrub" className="inline-flex items-center gap-1.5 text-sm font-medium">
                Simulated time
                <PhaseIcon phase={state.phase} minutes={simMinutes} />
              </label>
              <output htmlFor="temporal-stage-scrub" className="rounded-md px-1.5 py-1 font-mono text-[0.62rem] tabular-nums" style={{ background: "var(--surface-2)" }}>
                {toClock(simMinutes)}
              </output>
            </div>
            <input
              id="temporal-stage-scrub"
              type="range"
              min={0}
              max={1439}
              step={1}
              value={simMinutes}
              onChange={(event) => {
                setSimMinutes(Number(event.target.value));
                resync();
              }}
              aria-valuetext={toClock(simMinutes)}
              className="temporal-scrub w-full"
            />
            <style>{`.temporal-scrub{ -webkit-appearance:none; appearance:none; height:4px; border-radius:999px; background:var(--surface-2); border:1px solid var(--border); cursor:pointer; }
.temporal-scrub::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; width:16px; height:16px; border-radius:50%; background:var(--fg); border:none; cursor:pointer; }
.temporal-scrub::-moz-range-thumb{ width:16px; height:16px; border-radius:50%; background:var(--fg); border:none; cursor:pointer; }
.temporal-scrub::-moz-range-track{ height:4px; border-radius:999px; background:var(--surface-2); }`}</style>
          </div>
        )}

        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium">Color scheme</p>
              <Provenance manual={manualScheme} phase={state.phase} />
            </div>
            <Segmented
              label="Scheme override"
              columns={2}
              value={effectiveScheme}
              onChange={(value) => {
                setScheme(value as TemporalScheme);
                setManualScheme(true);
              }}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium">Temperature</p>
              <Provenance manual={manualTemperature} phase={state.phase} />
            </div>
            <Segmented
              label="Temperature override"
              columns={3}
              value={effectiveTemperature}
              onChange={(value) => {
                setTemperature(value as TemporalTemperature);
                setManualTemperature(true);
              }}
              options={[
                { value: "warm", label: "Warm" },
                { value: "neutral", label: "Neutral" },
                { value: "cool", label: "Cool" },
              ]}
            />
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          Temperature is your own adjustment on top of the clock. It never
          moves the time itself. Scrub to a new hour and everything follows
          again.
        </p>
      </div>
    </div>
  );
}
