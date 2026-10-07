"use client";

import * as React from "react";
import {
  ProximityNavigation,
  type MarkerStyle,
  type ProximityMode,
  type RailPosition,
} from "@/registry/harv/proximity-navigation/proximity-rail";
import { CHAPTERS } from "@/registry/harv/proximity-navigation/chapters";

export const meta = { id: "explorer", title: "Proximity rail" };

// Contained stage mirroring the lab's VariantSelector: every mode, marker,
// waves/expanded, contained, and position combination, driving a live rail
// over anchored sections. Native segmented controls stand in for the lab's
// Radix ToggleGroup so the entry adds no dependencies; behavior and labels
// follow the lab.
const MODE_DESCRIPTIONS: Record<ProximityMode, string> = {
  minimap: "A dense map for text-heavy pages. Turn on Expanded for the full-height wave field.",
  chapters: "Only the main sections. Add waves from the marker settings to see the space between them.",
  indicator: "Shows where you are on the page. Nothing to click.",
};

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

function ToggleRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const groupId = React.useId();
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p id={groupId} className="text-sm font-medium">
          {label}
        </p>
        <div role="radiogroup" aria-labelledby={groupId} className="flex gap-1">
          {([false, true] as const).map((option) => (
            <button
              key={String(option)}
              type="button"
              role="radio"
              aria-checked={value === option}
              onClick={() => onChange(option)}
              className="min-h-9 rounded-md border px-3 text-xs"
              style={{
                borderColor: "var(--border)",
                background: value === option ? "var(--fg)" : "transparent",
                color: value === option ? "var(--bg)" : "var(--fg)",
                cursor: "pointer",
              }}
            >
              {option ? "On" : "Off"}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
        {hint}
      </p>
    </div>
  );
}

export default function ProximityExplorerExample() {
  const [mode, setMode] = React.useState<ProximityMode>("chapters");
  const [marker, setMarker] = React.useState<MarkerStyle>("lines");
  const [waves, setWaves] = React.useState(false);
  const [contained, setContained] = React.useState(false);
  const [position, setPosition] = React.useState<RailPosition>("right");

  const showWaves = marker === "lines";
  const showContained = marker === "dots" && mode !== "indicator";
  const wavesLabel = mode === "minimap" ? "Expanded" : "Waves";

  return (
    <div className="relative flex w-full flex-col gap-4">
      <ProximityNavigation
        chapters={CHAPTERS}
        mode={mode}
        marker={marker}
        waves={waves}
        contained={contained}
        position={position}
      />
      <div
        className="flex flex-col gap-4 rounded-xl border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <Segmented
          label="Mode"
          columns={3}
          value={mode}
          onChange={setMode}
          options={[
            { value: "minimap", label: "Docs minimap" },
            { value: "chapters", label: "Chapters" },
            { value: "indicator", label: "Indicator" },
          ]}
        />
        <p aria-live="polite" className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          {MODE_DESCRIPTIONS[mode]}
        </p>
        <Segmented
          label="Marker"
          columns={2}
          value={marker}
          onChange={setMarker}
          options={[
            { value: "lines", label: "Lines" },
            { value: "dots", label: "Dots" },
          ]}
        />
        {showWaves && (
          <ToggleRow
            label={wavesLabel}
            hint={
              mode === "minimap"
                ? "Stretch the minimap into a full-height wave field. Off keeps the compact map."
                : "Fill the space between chapters with smaller marks."
            }
            value={waves}
            onChange={setWaves}
          />
        )}
        {showContained && (
          <ToggleRow
            label="Contained"
            hint="Wrap the rail in a small rounded container with a subtle shadow."
            value={contained}
            onChange={setContained}
          />
        )}
        <Segmented
          label="Position"
          columns={2}
          value={position}
          onChange={setPosition}
          options={[
            { value: "left", label: "Left" },
            { value: "right", label: "Right" },
          ]}
        />
      </div>
    </div>
  );
}
