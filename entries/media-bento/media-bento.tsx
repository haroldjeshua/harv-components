import * as React from "react";

// Media bento: static 3-column bento; featured tiles span two columns.
// Compiled from harv's /media bento. NOTE (deferred): the dynamic
// CSS-grid-generator variant stays a future feature; this entry is the
// static technique only.
export interface BentoTile {
  id: string;
  title: string;
  icon?: React.ReactNode;
  href?: string;
  featured?: boolean;
}

export function MediaBento({ tiles }: { tiles: BentoTile[] }) {
  return (
    <div className="grid auto-rows-[128px] grid-cols-3 gap-4 sm:auto-rows-[160px]">
      {tiles.map((t) => (
        <div
          key={t.id}
          title={t.href ? t.title : `${t.title} (under construction)`}
          className="flex flex-col items-center justify-center"
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            background: "var(--surface-2)",
            gridColumn: t.featured ? "span 2" : undefined,
          }}
        >
          {t.href ? (
            <a href={t.href} className="flex size-full flex-col items-center justify-center gap-2 no-underline" style={{ color: "inherit" }}>
              <span aria-hidden="true" style={{ color: "var(--fg-muted)" }}>{t.icon ?? "✳"}</span>
              <span className="text-sm font-medium">{t.title}</span>
            </a>
          ) : (
            <>
              <span aria-hidden="true" style={{ color: "var(--fg-faint)" }}>{t.icon ?? "✳"}</span>
              <span className="text-sm" style={{ color: "var(--fg-muted)" }}>{t.title}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export function MediaBentoDemo() {
  return (
    <MediaBento
      tiles={[
        { id: "writing", title: "Writing", href: "#writing", featured: true },
        { id: "toolkit", title: "Toolkit", href: "#toolkit" },
        { id: "playlists", title: "Playlists", href: "#playlists" },
        { id: "reading", title: "Reading", href: "#reading", featured: true },
        { id: "stills", title: "Stills", href: "#stills" },
        { id: "films", title: "Films" },
      ]}
    />
  );
}
