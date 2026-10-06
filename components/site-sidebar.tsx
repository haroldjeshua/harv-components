"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { EntryMeta } from "@/lib/entry-schema";

const LAYERS = [
  { id: "element", label: "Elements" },
  { id: "component", label: "Components" },
  { id: "pattern", label: "Patterns" },
] as const;

export function SiteSidebar({ entries, readySlugs = [] }: { entries: EntryMeta[]; readySlugs?: string[] }) {
  const pathname = usePathname();
  const ready = new Set(readySlugs);

  function itemHref(href: string, label: string, slug?: string) {
    const active = pathname === href;
    const isReady = slug !== undefined && ready.has(slug);
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm no-underline"
        style={{
          color: active ? "var(--fg)" : "var(--fg-muted)",
          background: active ? "var(--surface-2)" : "transparent",
          fontWeight: active ? 600 : 400,
        }}
      >
        <span className="flex-1">{label}</span>
        {isReady && (
          <span
            aria-hidden="true"
            title="Installable via CLI"
            className="inline-block size-1 shrink-0 rounded-full"
            style={{ background: "var(--status-ready)" }}
          />
        )}
        {isReady && <span className="sr-only">(installable via CLI)</span>}
      </Link>
    );
  }

  return (
    <nav aria-label="Docs" className="flex flex-col gap-6">
      <div>
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--fg-faint)" }}>
          Docs
        </p>
        <div className="flex flex-col gap-0.5">
          {LAYERS.map((layer) => {
            const items = entries.filter((e) => e.layer === layer.id);
            if (!items.length) return null;
            return (
              <div key={layer.id}>
                <p className="px-3 pb-1 pt-3 text-xs" style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
                  {layer.label} · {items.length}
                </p>
                {items.map((e) => itemHref(`/docs/${e.slug}`, e.name, e.slug))}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--fg-faint)" }}>
          Site
        </p>
        <div className="flex flex-col gap-0.5">
          {itemHref("/foundations", "Foundations")}
          {itemHref("/changelog", "Changelog")}
          {itemHref("/about", "About")}
        </div>
      </div>
      <p className="flex items-center gap-2 px-3 text-xs" style={{ color: "var(--fg-faint)" }}>
        <span aria-hidden="true" className="inline-block size-1 rounded-full" style={{ background: "var(--status-ready)" }} />
        Installable via CLI
      </p>
    </nav>
  );
}
