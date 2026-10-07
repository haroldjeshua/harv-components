// Pure math behind the proximity rail. No DOM, no React, no motion —
// unit-tested here, consumed by proximity-rail.tsx so the behavior has one
// source. Every function mirrors the rail's inline logic exactly, including
// its edge cases.

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/** Gaussian falloff: 1 at the reading point, decaying with distance. */
export function gaussianProximity(distance: number, spread: number): number {
  if (!(spread > 0)) return distance === 0 ? 1 : 0;
  return clamp01(Math.exp(-(distance * distance) / (2 * spread * spread)));
}

/** Wave spread for a rail with `total` items. Mirrors the rail's constant. */
export function scrollSpread(total: number): number {
  if (total <= 0) return 0;
  return 2.5 / total;
}

/** Fractional position of an item along the rail. */
export function itemProgress(index: number, total: number): number {
  return total > 1 ? index / (total - 1) : 0;
}

/** How far down the document the viewport has travelled, 0 → 1. */
export function scrollProgress(
  scrollY: number,
  scrollHeight: number,
  viewportHeight: number,
): number {
  return clamp01(scrollY / Math.max(1, scrollHeight - viewportHeight));
}

/** Traveling-wave factor for one item: expansion near the reading point. */
export function travelFactor(itemIndex: number, total: number, progress: number): number {
  return gaussianProximity(itemProgress(itemIndex, total) - progress, scrollSpread(total));
}

/** Pointer proximity: expansion near the cursor, 0 when the pointer is away. */
export function pointerProximity(pointerY: number | null, rowCenter: number): number {
  if (pointerY === null) return 0;
  return clamp01(1 - Math.abs(pointerY - rowCenter) / 58);
}

/** Linear interpolation between a base and a fully-expanded size. */
export function interpolate(base: number, max: number, t: number): number {
  return base + (max - base) * t;
}

/**
 * Which observed item is current, given each item's viewport top (or null
 * when its element is missing). Mirrors the rail's scroll handler: the last
 * item at or above 38% of the viewport wins, the final item wins at the
 * bottom, and the first item is the fallback when nothing qualifies.
 */
export function pickActiveIndex(
  tops: ReadonlyArray<number | null>,
  viewportHeight: number,
  atBottom: boolean,
): number | undefined {
  if (tops.length === 0) return undefined;
  if (atBottom) return tops.length - 1;
  let index = 0;
  let found = false;
  for (let i = 0; i < tops.length; i++) {
    const top = tops[i];
    if (top !== null && top <= viewportHeight * 0.38) {
      index = i;
      found = true;
    }
  }
  return found ? index : 0;
}

/** Row height in px. Mirrors the rail's memo exactly, including clamps. */
export function rowHeightFor(
  mode: "minimap" | "chapters" | "indicator",
  itemCount: number,
  expanded: boolean,
  viewportHeight: number,
): number {
  if (expanded) {
    const target = Math.floor((viewportHeight * 0.72 - 16) / itemCount);
    return Math.max(8, Math.min(20, target));
  }
  const maxInner = 384;
  if (mode === "indicator") {
    return Math.max(12, Math.min(18, Math.floor(maxInner / itemCount)));
  }
  return Math.max(8, Math.min(18, Math.floor(maxInner / itemCount)));
}
