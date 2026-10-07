"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutGrid, List, Type } from "lucide-react";
import { Badge } from "@/registry/harv/badge/badge";
import { Button } from "@/registry/harv/button/button";
import type { EntryMeta } from "@/lib/entry-schema";

type View = "grid" | "list" | "text";

export function GalleryFilter({ entries, readySlugs = [] }: { entries: EntryMeta[]; readySlugs?: string[] }) {
  const [layer, setLayer] = React.useState<string | null>(null);
  const [tag, setTag] = React.useState<string | null>(null);
  const [view, setView] = React.useState<View>("grid");

  const layers = React.useMemo(() => [...new Set(entries.map((e) => e.layer))], [entries]);
  const tags = React.useMemo(() => [...new Set(entries.flatMap((e) => e.tags))].sort(), [entries]);
  const ready = React.useMemo(() => new Set(readySlugs), [readySlugs]);

  const visible = entries.filter(
    (e) => (!layer || e.layer === layer) && (!tag || e.tags.includes(tag))
  );

  const views: { id: View; label: string; Icon: typeof LayoutGrid }[] = [
    { id: "grid", label: "Card grid", Icon: LayoutGrid },
    { id: "list", label: "List", Icon: List },
    { id: "text", label: "Simple text", Icon: Type },
  ];

  function dot(slug: string) {
    if (!ready.has(slug)) return null;
    return (
      <span
        aria-hidden="true"
        title="Installable via CLI"
        className="inline-block size-1 shrink-0 rounded-full"
        style={{ background: "var(--status-ready)" }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by layer">
          <Button variant={layer === null ? "default" : "secondary"} size="sm" onClick={() => setLayer(null)}>
            All
          </Button>
          {layers.map((l) => (
            <Button key={l} variant={layer === l ? "default" : "secondary"} size="sm" onClick={() => setLayer(layer === l ? null : l)}>
              {l}
            </Button>
          ))}
          {tags.map((t) => (
            <Button key={t} variant={tag === t ? "default" : "ghost"} size="sm" shape="pill" onClick={() => setTag(tag === t ? null : t)}>
              #{t}
            </Button>
          ))}
        </div>
        <div
          role="radiogroup"
          aria-label="Gallery view"
          className="flex items-center gap-1 rounded-full p-0.5"
          style={{ background: "var(--surface-2)" }}
        >
          {views.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={view === id}
              aria-label={label}
              title={label}
              onClick={() => setView(id)}
              className="flex items-center rounded-full px-2.5 py-1.5"
              style={{
                background: view === id ? "var(--fg)" : "transparent",
                color: view === id ? "var(--bg)" : "var(--fg-muted)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Icon size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs" style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }} aria-live="polite">
        {visible.length} of {entries.length}
      </p>

      {view === "grid" && (
        <ul className="mt-3 grid list-none grid-cols-1 items-stretch gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3" aria-label="Entries">
          {visible.map((e) => (
            <li
              key={e.slug}
              className="flex transition-[border-color] duration-200 hover:[border-color:var(--fg-faint)] motion-reduce:transition-none"
              style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)" }}
            >
              <Link
                href={`/docs/${e.slug}`}
                aria-label={`${e.name}, ${e.layer}, ${e.status}${ready.has(e.slug) ? ", installable via CLI" : ""}`}
                className="flex h-full w-full flex-col rounded-[inherit] p-5 no-underline focus-visible:outline-2"
                style={{ color: "inherit" }}
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{e.layer}</Badge>
                  <Badge variant="outline">{e.status}</Badge>
                  <span className="ml-auto flex items-center">{dot(e.slug)}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold">{e.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>{e.description}</p>
                <p className="mt-auto pt-3 text-xs" style={{ color: "var(--fg-faint)" }}>origin: {e.origin}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {view === "list" && (
        <ul className="mt-3 list-none overflow-hidden p-0" aria-label="Entries" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)" }}>
          {visible.map((e, i) => (
            <li key={e.slug} style={i < visible.length - 1 ? { borderBottom: "1px solid var(--border)" } : undefined}>
              <Link
                href={`/docs/${e.slug}`}
                aria-label={`${e.name}, ${e.layer}, ${e.status}${ready.has(e.slug) ? ", installable via CLI" : ""}`}
                className="flex items-center gap-3 px-4 py-3 no-underline hover:opacity-80 focus-visible:outline-2"
                style={{ color: "inherit" }}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{e.name}</span>
                  <span className="block truncate text-xs" style={{ color: "var(--fg-muted)" }}>{e.description}</span>
                </span>
                <span className="hidden shrink-0 text-xs sm:inline" style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>{e.layer}</span>
                {dot(e.slug)}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {view === "text" && (
        <ul className="mt-3 list-none space-y-1.5 p-0" aria-label="Entries">
          {visible.map((e) => (
            <li key={e.slug} className="flex items-baseline gap-2 text-sm">
              <Link href={`/docs/${e.slug}`} className="underline underline-offset-4 hover:opacity-70" style={{ color: "var(--fg)" }}>
                {e.name}
              </Link>
              <span className="text-xs" style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>{e.layer}</span>
              {dot(e.slug)}
            </li>
          ))}
        </ul>
      )}

      {visible.length === 0 && (
        <p className="mt-6 text-sm" style={{ color: "var(--fg-muted)" }}>
          Nothing matches.{" "}
          <button type="button" className="underline underline-offset-4 hover:opacity-70" onClick={() => { setLayer(null); setTag(null); }}>
            Clear filters
          </button>
        </p>
      )}
    </div>
  );
}
