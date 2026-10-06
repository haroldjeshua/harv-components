"use client";

import * as React from "react";
import { Badge } from "@/registry/harv/badge/badge";

// Craft masonry: CSS-columns gallery with hover captions and a
// reduced-motion-safe reveal. Compiled from harv's /crafts gallery;
// static content here (no image pipeline). Aspect ratios stand in for photos.
export interface CraftItem {
  title: string;
  type?: string;
  ratio: string; // e.g. "3 / 4"
}

export function CraftMasonry({ items }: { items: CraftItem[] }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const figures = root.querySelectorAll<HTMLElement>("[data-craft]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "visible";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px 120px 0px" }
    );
    for (const figure of figures) {
      if (figure.getBoundingClientRect().top < window.innerHeight + 120) continue;
      figure.dataset.reveal = "pending";
      observer.observe(figure);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ columns: 2, columnGap: "1rem" }}>
      {items.map((item) => (
        <figure
          key={item.title}
          data-craft
          className="group relative mb-4 overflow-hidden"
          style={{ breakInside: "avoid", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface-2)" }}
        >
          <div style={{ aspectRatio: item.ratio }} aria-hidden="true" />
          <figcaption
            className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            style={{ background: "linear-gradient(to top, var(--bg) 30%, transparent)" }}
          >
            <span className="text-sm">{item.title}</span>
            {item.type && <Badge variant="secondary">{item.type}</Badge>}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function CraftMasonryDemo() {
  return (
    <CraftMasonry
      items={[
        { title: "Poster study", type: "print", ratio: "3 / 4" },
        { title: "Icon set", type: "icons", ratio: "1 / 1" },
        { title: "Type specimen", type: "type", ratio: "4 / 3" },
        { title: "Interface concept", type: "ui", ratio: "3 / 4" },
      ]}
    />
  );
}
