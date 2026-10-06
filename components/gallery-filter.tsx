"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/registry/harv/badge/badge";
import { Button } from "@/registry/harv/button/button";
import type { EntryMeta } from "@/lib/entry-schema";

export function GalleryFilter({ entries, readySlugs = [] }: { entries: EntryMeta[]; readySlugs?: string[] }) {
  const [layer, setLayer] = React.useState<string | null>(null);
  const [tag, setTag] = React.useState<string | null>(null);

  const layers = React.useMemo(() => [...new Set(entries.map((e) => e.layer))], [entries]);
  const tags = React.useMemo(() => [...new Set(entries.flatMap((e) => e.tags))].sort(), [entries]);

  const ready = React.useMemo(() => new Set(readySlugs), [readySlugs]);

  const visible = entries.filter(
    (e) => (!layer || e.layer === layer) && (!tag || e.tags.includes(tag))
  );

  return (
    <div>
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
      <p className="mt-4 text-xs" style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }} aria-live="polite">
        {visible.length} of {entries.length}
      </p>
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
                {ready.has(e.slug) && (
                  <span
                    aria-hidden="true"
                    title="Installable via CLI"
                    className="ml-auto inline-block size-1 shrink-0 rounded-full"
                    style={{ background: "var(--status-ready)" }}
                  />
                )}
              </div>
              <h2 className="mt-3 text-xl font-semibold">{e.name}</h2>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>{e.description}</p>
              <p className="mt-auto pt-3 text-xs" style={{ color: "var(--fg-faint)" }}>origin: {e.origin}</p>
            </Link>
          </li>
        ))}
      </ul>
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
