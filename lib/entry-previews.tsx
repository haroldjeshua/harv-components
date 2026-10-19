import type { ComponentType, ReactNode } from "react";
import { ButtonHero } from "@/registry/harv/button/hero";
import { BadgeHero } from "@/registry/harv/badge/hero";
import { TemporalHero } from "@/registry/harv/temporal-theme/hero";
import { ProximityHero } from "@/registry/harv/proximity-navigation/hero";
import { ThemeToggle } from "@/entries/theme-toggle/theme-toggle";

// Gallery thumbnails: one small render per entry, resolved by slug at the
// tile. Client-safe by construction — this file must never import
// lib/entries.ts (node:fs) or any server-only module. Rules for every
// preview: no fixed/sticky positioning, no portals, no document-level
// listeners. Wide patterns get a distilled static thumb, not a scaled
// live demo, so a tile never crops or misrepresents the real component.

function Frame({ children, width = 15 }: { children: ReactNode; width?: number }) {
  return <div style={{ width: "100%", maxWidth: `${width}rem` }}>{children}</div>;
}

function Card() {
  return (
    <span
      className="block flex-1"
      style={{ height: "1.75rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface-2)" }}
    />
  );
}

function CraftMasonryThumb() {
  const column = (heights: number[]) => (
    <div className="flex flex-1 flex-col gap-1.5">
      {heights.map((h, i) => (
        <span
          key={i}
          className="block w-full"
          style={{ height: `${h}px`, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface-2)" }}
        />
      ))}
    </div>
  );
  return (
    <Frame width={12}>
      <div className="flex w-full gap-1.5">
        {column([38, 58])}
        {column([54, 42])}
      </div>
    </Frame>
  );
}

function LabIndexThumb() {
  return (
    <Frame width={14}>
      <div className="flex w-full flex-col gap-2">
        <div className="flex gap-2">{Card()}{Card()}</div>
        <span
          className="block w-full"
          style={{ height: "1.75rem", border: "2px dashed var(--border)", borderRadius: "var(--radius-sm)" }}
        />
      </div>
    </Frame>
  );
}

function MediaBentoThumb() {
  const spans = [2, 1, 1, 2];
  return (
    <Frame width={13}>
      <div className="grid w-full grid-cols-3 gap-1.5">
        {spans.map((span, i) => (
          <span
            key={i}
            className="block"
            style={{ gridColumn: `span ${span}`, height: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface-2)" }}
          />
        ))}
      </div>
    </Frame>
  );
}

function MediaStripThumb() {
  return (
    <Frame width={14}>
      <div className="flex w-full gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block flex-1"
            style={{ height: "3.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface-2)" }}
          />
        ))}
        <span
          className="flex flex-1 items-center justify-center text-sm"
          style={{ height: "3.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--fg-faint)" }}
        >
          +
        </span>
      </div>
    </Frame>
  );
}

function SpecimenTabsThumb() {
  return (
    <Frame width={13}>
      <div className="w-full">
        <div className="flex gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <span className="pb-1.5 text-xs font-semibold" style={{ borderBottom: "2px solid var(--fg)", marginBottom: "-1px" }}>Contained</span>
          <span className="pb-1.5 text-xs" style={{ color: "var(--fg-muted)" }}>Outline</span>
          <span className="pb-1.5 text-xs" style={{ color: "var(--fg-muted)" }}>Sizes</span>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          <span className="block h-6 w-full" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface-2)" }} />
          <span className="block h-2 w-2/3 rounded-full" style={{ background: "var(--surface-2)" }} />
        </div>
      </div>
    </Frame>
  );
}

function WorkGridThumb() {
  return (
    <Frame width={13}>
      <div className="grid w-full grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex flex-col items-center gap-1.5">
            <span className="block" style={{ width: "1.75rem", height: "1.75rem", border: "1px dashed var(--border)", borderRadius: "var(--radius-sm)" }} />
            <span className="block h-1.5 w-8 rounded-full" style={{ background: "var(--surface-2)" }} />
          </span>
        ))}
      </div>
    </Frame>
  );
}

function SourcePanelThumb() {
  const lines = [
    [40, 62],
    [55],
    [30, 70],
  ];
  return (
    <Frame width={14}>
      <div className="overflow-hidden" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)" }}>
        <div className="flex items-center justify-between px-2.5 py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
          <span className="font-mono text-[10px]" style={{ color: "var(--fg-muted)" }}>ts</span>
          <span className="block size-2 rounded-full" style={{ background: "var(--surface-2)" }} />
        </div>
        <div className="flex flex-col gap-1.5 p-2.5">
          {lines.map((row, i) => (
            <span key={i} className="flex gap-1.5">
              {row.map((w, j) => (
                <span
                  key={j}
                  className="block h-1.5 rounded-full"
                  style={{ width: `${w}%`, background: j === 0 ? "var(--fg-muted)" : "var(--surface-2)" }}
                />
              ))}
            </span>
          ))}
        </div>
      </div>
    </Frame>
  );
}

const previews: Record<string, ComponentType> = {
  button: ButtonHero,
  badge: BadgeHero,
  "temporal-theme": TemporalHero,
  "proximity-navigation": ProximityHero,
  "theme-toggle": ThemeToggle,
  "source-panel": SourcePanelThumb,
  "specimen-tabs": SpecimenTabsThumb,
  "work-grid": WorkGridThumb,
  "lab-index": LabIndexThumb,
  "craft-masonry": CraftMasonryThumb,
  "media-bento": MediaBentoThumb,
  "media-strip": MediaStripThumb,
};

/** The tile render for an entry, or undefined when it has no preview yet. */
export function getEntryPreview(slug: string): ComponentType | undefined {
  return previews[slug];
}
