"use client";

import * as React from "react";

// Fixed stage for a gallery tile's live preview. Lazy-mounts on approach so
// off-screen tiles never start timers or hydrate heavy children, isolates
// paint so a preview can never bleed into neighbouring tiles, and stays
// decorative: the whole tile is one link, so the stage is aria-hidden and
// ignores pointer events.
export function PreviewStage({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(() => setShown(true), 0);
      return () => window.clearTimeout(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      inert
      aria-hidden="true"
      className="flex items-center justify-center overflow-hidden px-4"
      style={{
        aspectRatio: "16 / 10",
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        contain: "paint",
        isolation: "isolate",
        pointerEvents: "none",
      }}
    >
      {shown ? (
        <div className="flex w-full items-center justify-center transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none">
          {children}
        </div>
      ) : (
        <span className="block h-2 w-10 rounded-full" style={{ background: "var(--surface-2)" }} />
      )}
    </div>
  );
}
