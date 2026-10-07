"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import {
  interpolate,
  pickActiveIndex,
  pointerProximity,
  rowHeightFor,
  scrollProgress,
  travelFactor,
} from "@/registry/harv/proximity-navigation/proximity-math";
export type ProximityChapter = { id: string; label: string };
export type ProximityMode = "minimap" | "chapters" | "indicator";
export type MarkerStyle = "lines" | "dots";
export type RailPosition = "left" | "right";

type NavigationItem = {
  id: string;
  label: string;
  weight: "major" | "detail" | "body";
  wave?: boolean;
  swell?: boolean;
};


function navigationItems(
  chapters: readonly ProximityChapter[],
  mode: ProximityMode,
  waves: boolean,
  marker: MarkerStyle,
) {
  const paragraphMark = (
    chapter: ProximityChapter,
    suffix: "detail" | "note",
  ): NavigationItem => ({
    id: `${chapter.id}-${suffix}`,
    label: chapter.label,
    weight: suffix === "detail" ? "detail" : "body",
  });

  if (mode === "minimap") {
    if (marker === "dots") {
      return chapters.flatMap<NavigationItem>((chapter) => [
        { ...chapter, weight: "major" },
        paragraphMark(chapter, "detail"),
        paragraphMark(chapter, "note"),
      ]);
    }
    return chapters.flatMap<NavigationItem>((chapter, i) => {
      // Trailing waves swell back up into the next chapter:
      // second-to-last matches the note size, last matches the detail size.
      const gapWaves =
        waves && i < chapters.length - 1
          ? waveLines(chapter, 6, 0).map((w, wi, arr) =>
              wi === arr.length - 2
                ? { ...w, weight: "body" as const, swell: true }
                : wi === arr.length - 1
                  ? { ...w, weight: "detail" as const, swell: true }
                  : w,
            )
          : [];
      return [
        { ...chapter, weight: "major" },
        paragraphMark(chapter, "detail"),
        paragraphMark(chapter, "note"),
        ...gapWaves,
      ];
    });
  }

  const base = chapters.map<NavigationItem>((chapter) => ({
    ...chapter,
    weight: "major",
  }));

  if (!waves) return base;

  return chapters.flatMap<NavigationItem>((chapter, i) => [
    { ...chapter, weight: "major" },
    ...(i === chapters.length - 1
      ? []
      : waveLines(chapter, mode === "indicator" ? 3 : 4, 1)),
  ]);
}

function waveLines(
  chapter: ProximityChapter,
  count: number,
  start: number,
): NavigationItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${chapter.id}-wave-${start + i}`,
    label: "",
    weight: "body",
    wave: true,
  }));
}

/**
 * ProximityNavigation — a scroll-synced rail for long pages.
 *
 * Give it the page's chapters; it observes the matching section elements
 * (`#<id>`, `#<id>-detail`, `#<id>-note`) and grows the nearest mark.
 * Interactive in every mode except `indicator`, which only reports
 * progress. All props optional except `chapters`.
 */
export function ProximityNavigation({
  chapters,
  mode = "chapters",
  marker = "lines",
  waves = false,
  contained = false,
  position = "right",
}: {
  /** Sections the rail tracks. Each needs a matching `#id` element on the page. */
  chapters: readonly ProximityChapter[];
  /** minimap maps every paragraph; chapters lists sections; indicator only reports progress. */
  mode?: ProximityMode;
  /** lines take waves; dots take the optional contained pill. */
  marker?: MarkerStyle;
  /** Fill chapter gaps with wave marks. Only applies to minimap + lines (the Expanded field). */
  waves?: boolean;
  /** Wrap dots in a rounded container. Only applies to dots outside indicator mode. */
  contained?: boolean;
  /** Which viewport edge the fixed rail hugs. */
  position?: RailPosition;
}) {
  const reducedMotion = useReducedMotion();
  const hasWaves = marker === "lines" && waves;
  const hasContained =
    marker === "dots" && contained && mode !== "indicator";
  const items = useMemo(
    () => navigationItems(chapters, mode, hasWaves, marker),
    [chapters, mode, hasWaves, marker],
  );
  const chapterItems = useMemo(
    () => navigationItems(chapters, "chapters", false, marker),
    [chapters, marker],
  );
  const observedItems = useMemo(
    () =>
      mode === "minimap"
        ? items.filter((item) => !item.wave)
        : chapterItems,
    [items, chapterItems, mode],
  );
  const [active, setActive] = useState<string | undefined>(
    observedItems[0]?.id,
  );
  const [focused, setFocused] = useState<string | null>(null);
  const [viewportH, setViewportH] = useState(800);
  // Render static base styles on the server and first client pass so
  // hydration matches; swap to live scroll-driven motion values after mount.
  const live = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const rail = useRef<HTMLDivElement>(null);
  const interactive = mode !== "indicator";
  const expanded =
    mode === "minimap" && marker === "lines" && waves;
  const rowHeight = useMemo(() => {
    return rowHeightFor(mode, items.length, expanded, viewportH);
  }, [mode, items.length, expanded, viewportH]);
  const padTop = hasContained ? 6 : 8;

  useEffect(() => {
    const onResize = () => setViewportH(window.innerHeight);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollY = useScroll().scrollY;
  const pointerY = useMotionValue<number | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8;
      const tops = observedItems.map((item) => {
        const element = document.getElementById(item.id);
        return element ? element.getBoundingClientRect().top : null;
      });
      const index = pickActiveIndex(tops, window.innerHeight, atBottom);
      setActive(index === undefined ? undefined : observedItems[index]?.id);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [observedItems]);

  function scrollTo(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    history.pushState(null, "", `#${id}`);
    target.scrollIntoView({
      behavior: reducedMotion ? "instant" : "smooth",
      block: "start",
    });
    target.focus({ preventScroll: true });
  }

  return (
    <div
      id="proximity-navigation-demo"
      className={cn(
        "fixed top-1/2 z-20 -translate-y-1/2",
        position === "right" ? "right-2 sm:right-5" : "left-2 sm:left-5",
      )}
    >
      <div
        ref={rail}
        aria-label={
          interactive
            ? mode === "minimap"
              ? "Document minimap"
              : "Chapter navigation"
            : undefined
        }
        role={interactive ? "navigation" : "progressbar"}
        aria-orientation={interactive ? undefined : "vertical"}
        aria-valuemin={interactive ? undefined : 1}
        aria-valuemax={interactive ? undefined : items.length}
        aria-valuenow={
          interactive
            ? undefined
            : Math.max(1, items.findIndex((item) => item.id === active) + 1)
        }
        aria-valuetext={
          interactive
            ? undefined
            : chapters.find((chapter) => chapter.id === active)?.label
        }
        onPointerMove={(event) => {
          if (!interactive) return;
          const bounds = rail.current?.getBoundingClientRect();
          if (bounds) pointerY.set(event.clientY - bounds.top);
        }}
        onPointerLeave={() => pointerY.set(null)}
        className={cn(
          "flex flex-col",
          position === "right" ? "items-end" : "items-start",
          hasContained
            ? "rounded-full border border-foreground/10 bg-background/80 p-1.5 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
            : "py-2",
          !hasContained && (interactive ? "px-1" : "px-2"),
        )}
      >
        {items.map((item, index) => (
          <RailMark
            key={item.id}
            item={item}
            index={index}
            total={items.length}
            position={position}
            marker={marker}
            rowHeight={rowHeight}
            padTop={padTop}
            live={live}
            contained={hasContained}
            interactive={interactive}
            isActive={active === item.id}
            showLabel={interactive && focused === item.id}
            scrollY={scrollY}
            pointerY={pointerY}
            onNavigate={scrollTo}
            onHover={setFocused}
          />
        ))}
      </div>
    </div>
  );
}

function RailMark({
  item,
  index,
  total,
  position,
  marker,
  rowHeight,
  padTop,
  live,
  contained,
  interactive,
  isActive,
  showLabel,
  scrollY,
  pointerY,
  onNavigate,
  onHover,
}: {
  item: NavigationItem;
  index: number;
  total: number;
  position: RailPosition;
  marker: MarkerStyle;
  rowHeight: number;
  padTop: number;
  live: boolean;
  contained: boolean;
  interactive: boolean;
  isActive: boolean;
  showLabel: boolean;
  scrollY: MotionValue<number>;
  pointerY: MotionValue<number | null>;
  onNavigate: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const reducedMotion = useReducedMotion();
  const isWave = item.wave === true;
  const rowCenter = padTop + rowHeight * index + rowHeight / 2;
  const baseLine = isWave
    ? item.swell
      ? item.weight === "detail"
        ? 12
        : 7
      : 6
    : item.weight === "major"
      ? 22
      : item.weight === "detail"
        ? 12
        : 7;
  const maxLine = isWave
    ? item.swell
      ? item.weight === "detail"
        ? 22
        : 14
      : 24
    : item.weight === "major" ? 34 : item.weight === "detail" ? 22 : 14;
  const baseDot = isWave
    ? item.swell
      ? 3
      : 1
    : item.weight === "major"
      ? 5
      : 3;
  const maxDot = isWave
    ? item.swell
      ? item.weight === "detail"
        ? 6
        : 4.5
      : 4
    : item.weight === "major" ? 9 : item.weight === "detail" ? 6 : 4.5;
  const baseOpacity = isWave ? 0.15 : 0.35;
  const fullOpacity = isWave ? 0.6 : 1;

  const scrollFactor = useTransform(scrollY, (y) => {
    if (typeof document === "undefined") return 0;
    const progress = scrollProgress(
      y,
      document.documentElement.scrollHeight,
      window.innerHeight,
    );
    return travelFactor(index, total, progress);
  });

  const proximityFactor = useTransform(pointerY, (py) =>
    pointerProximity(py, rowCenter),
  );

  const factor = useTransform(
    [scrollFactor, proximityFactor],
    (values: number[]) => Math.max(values[0], values[1]),
  );

  const lineWidth = useTransform(factor, (t) =>
    marker === "lines"
      ? interpolate(baseLine, maxLine, t) / 44
      : interpolate(baseDot, maxDot, t) / 12,
  );
  const lineOpacity = useTransform(factor, (t) =>
    interpolate(baseOpacity, fullOpacity, t),
  );

  const visual = (
    <motion.span
      aria-hidden="true"
      className={cn(
        "block shrink-0 rounded-full bg-foreground",
        marker === "lines" ? "h-0.5 w-11" : "size-3",
      )}
      style={{
        scaleX:
          marker === "lines"
            ? live
              ? lineWidth
              : baseLine / 44
            : undefined,
        scale:
          marker === "dots" ? (live ? lineWidth : baseDot / 12) : undefined,
        opacity: live ? lineOpacity : baseOpacity,
        transformOrigin:
          marker === "lines"
            ? position === "right"
              ? "right center"
              : "left center"
            : "center",
      }}
    />
  );

  // Contained dots stay centered in the symmetric pill; uncontained
  // dots lean toward the rail edge.
  const lean =
    marker !== "dots"
      ? undefined
      : contained
        ? "justify-center"
        : position === "right"
          ? "justify-end"
          : "justify-start";
  // Lines get a 44px track; dots get square cells so every row box is
  // identical and the contained pill hugs them evenly.
  const rowWidth = marker === "lines" ? 44 : rowHeight;

  if (!interactive || isWave) {
    return (
      <span
        aria-hidden="true"
        className={cn("flex items-center", lean)}
        style={{ width: rowWidth, height: rowHeight }}
      >
        {visual}
      </span>
    );
  }

  return (
    <a
      href={`#${item.id}`}
      aria-label={item.label}
      aria-current={isActive ? "location" : undefined}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(item.id);
      }}
      onPointerEnter={() => onHover(item.id)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(item.id)}
      onBlur={() => onHover(null)}
      className={cn(
        "relative flex items-center rounded-full outline-offset-2 focus-visible:outline focus-visible:outline-2",
        lean,
      )}
      style={{ width: rowWidth, height: rowHeight }}
    >
      {visual}
      <AnimatePresence>
        {showLabel && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, x: 6, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 4, scale: 0.98 }}
            transition={{
              duration: reducedMotion ? 0 : 0.15,
              ease: "easeOut",
            }}
            className={cn(
              "pointer-events-none absolute whitespace-nowrap rounded-md border bg-background/95 px-2.5 py-1.5 font-mono text-xs text-foreground shadow-md backdrop-blur-sm",
              position === "right" ? "right-full mr-3" : "left-full ml-3",
            )}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
}
