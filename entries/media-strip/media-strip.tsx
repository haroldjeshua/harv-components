import * as React from "react";

// Media strip: horizontal row of opaque cards with a trailing "More" tile.
// Compiled from the media section on harv's homepage; rewritten monotone.
export interface StripCard {
  id: string;
  title: string;
  icon?: React.ReactNode;
  href?: string;
}

export function MediaStrip({ cards, moreHref = "#more" }: { cards: StripCard[]; moreHref?: string }) {
  return (
    <div className="flex w-full flex-row flex-nowrap gap-2 overflow-x-auto pb-1" role="list">
      {cards.map((c) => (
        <div
          key={c.id}
          role="listitem"
          className="flex h-48 w-40 shrink-0 flex-col items-center justify-center"
          style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface-2)" }}
        >
          {c.href ? (
            <a href={c.href} className="flex size-full flex-col items-center justify-center gap-2 p-6 text-center no-underline" style={{ color: "inherit" }}>
              <span aria-hidden="true" style={{ color: "var(--fg-muted)" }}>{c.icon ?? "✳"}</span>
              <span className="text-sm font-medium">{c.title}</span>
            </a>
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <span aria-hidden="true" style={{ color: "var(--fg-faint)" }}>{c.icon ?? "✳"}</span>
              <span className="text-sm" style={{ color: "var(--fg-muted)" }}>{c.title}</span>
            </div>
          )}
        </div>
      ))}
      <div className="flex h-48 w-40 shrink-0 flex-col items-center justify-center" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface-2)" }}>
        <a href={moreHref} className="flex size-full flex-col items-center justify-center gap-2 no-underline" style={{ color: "inherit" }} aria-label="More media">
          <span aria-hidden="true">+</span>
          <span className="text-sm font-medium">More</span>
        </a>
      </div>
    </div>
  );
}

export function MediaStripDemo() {
  return (
    <MediaStrip
      cards={[
        { id: "writing", title: "Writing", href: "#writing" },
        { id: "toolkit", title: "Toolkit", href: "#toolkit" },
        { id: "playlists", title: "Playlists", href: "#playlists" },
        { id: "reading", title: "Reading", href: "#reading" },
      ]}
    />
  );
}
