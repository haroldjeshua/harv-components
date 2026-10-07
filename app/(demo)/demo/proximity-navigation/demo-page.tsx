"use client";

import * as React from "react";
import Link from "next/link";
import {
  ProximityNavigation,
  type MarkerStyle,
  type ProximityMode,
  type RailPosition,
} from "@/registry/harv/proximity-navigation/proximity-rail";
import { ProximityPageSections } from "@/registry/harv/proximity-navigation/sections";

// Full-page demo: the explorer drives a rail over a long document, exactly
// the lab arrangement. Scroll to move the active mark, pick a link to jump
// (hash updates), press Back to return.
export function ProximityDemoPage() {
  const [mode, setMode] = React.useState<ProximityMode>("chapters");
  const [marker, setMarker] = React.useState<MarkerStyle>("lines");
  const [position, setPosition] = React.useState<RailPosition>("right");

  return (
    <div>
      <Link href="/docs/proximity-navigation" className="text-sm hover:opacity-70">
        ← Proximity navigation docs
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <p className="font-mono text-xs" style={{ color: "var(--fg-faint)" }}>
          Full-page demo
        </p>
        {(
          [
            ["Mode", mode, setMode, ["minimap", "chapters", "indicator"]],
            ["Marker", marker, setMarker, ["lines", "dots"]],
            ["Position", position, setPosition, ["left", "right"]],
          ] as const
        ).map(([label, value, setValue, options]) => (
          <div key={label} className="flex items-center gap-1" role="group" aria-label={label}>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => (setValue as (v: string) => void)(option)}
                aria-pressed={value === option}
                className="rounded-md border px-2.5 py-1 text-xs"
                style={{
                  borderColor: "var(--border)",
                  background: value === option ? "var(--fg)" : "transparent",
                  color: value === option ? "var(--bg)" : "var(--fg)",
                  cursor: "pointer",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        ))}
      </div>
      <ProximityNavigation
        chapters={[
          { id: "px-alpha", label: "Alpha" },
          { id: "px-beta", label: "Beta" },
          { id: "px-gamma", label: "Gamma" },
        ]}
        mode={mode}
        marker={marker}
        position={position}
      />
      <div className="mt-8">
        <ProximityPageSections />
      </div>
    </div>
  );
}
