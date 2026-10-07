"use client";

import * as React from "react";
import { TemporalToggle } from "@/registry/harv/temporal-theme/temporal-toggle";
import type { TemporalScheme, TemporalTemperature } from "@/registry/harv/temporal-theme/temporal-theme";
import { scopeClass, useTemporalClock } from "@/registry/harv/temporal-theme/use-temporal-theme";
import "../temporal-theme.css";

export const meta = { id: "toggle", title: "Controlled toggle" };

export default function TemporalToggleExample() {
  const [scheme, setScheme] = React.useState<TemporalScheme>("light");
  const [temperature, setTemperature] = React.useState<TemporalTemperature>("neutral");
  const [dynamic, setDynamic] = React.useState(true);
  const { state } = useTemporalClock("live", 12 * 60);

  const shownScheme = dynamic ? state.scheme : scheme;
  const shownTemperature = dynamic ? state.temperature : temperature;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="self-end">
        <TemporalToggle
          scheme={shownScheme}
          temperature={shownTemperature}
          onSchemeChange={(value) => {
            setScheme(value);
            setDynamic(false);
          }}
          onTemperatureChange={(value) => {
            setTemperature(value);
            setDynamic(false);
          }}
          dynamic={dynamic}
          onDynamicChange={setDynamic}
        />
      </div>
      <div
        className={`temporal-scope relative mx-auto aspect-video w-full max-w-sm overflow-hidden rounded-lg border ${scopeClass(shownScheme, shownTemperature)}`}
      >
        <div
          aria-hidden="true"
          className="temporal-atmosphere pointer-events-none absolute inset-0"
          style={{ "--temporal-atmosphere": 0.35 } as React.CSSProperties}
        />
        <div className="relative">
          <div aria-hidden="true" className="flex items-center gap-1 border-b border-current px-3 py-1.5 opacity-40">
            <span className="size-1.5 rounded-full bg-current" />
            <span className="size-1.5 rounded-full bg-current" />
            <span className="size-1.5 rounded-full bg-current" />
          </div>
          <div aria-hidden="true" className="flex flex-col gap-1.5 p-3">
            <span className="h-2 w-2/3 rounded-full bg-current opacity-60" />
            <span className="h-1.5 w-full rounded-full bg-current opacity-30" />
            <span className="h-1.5 w-5/6 rounded-full bg-current opacity-30" />
          </div>
        </div>
      </div>
      <p className="text-center font-mono text-xs" style={{ color: "var(--fg-faint)" }}>
        {dynamic ? `following the clock · ${state.phase}` : "manual · press the clock to follow again"}
      </p>
    </div>
  );
}
