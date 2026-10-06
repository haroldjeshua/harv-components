"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { EntryMeta } from "@/lib/entry-schema";

export function SiteSearch({ entries }: { entries: EntryMeta[] }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  function setOpenAndReset(v: boolean) {
    if (v) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    setOpen(v);
  }

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenAndReset(!open);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  const results = entries.filter((e) =>
    `${e.name} ${e.slug} ${e.layer}`.toLowerCase().includes(query.toLowerCase())
  );

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && results[Math.min(activeIndex, results.length - 1)]) {
      go(`/docs/${results[Math.min(activeIndex, results.length - 1)].slug}`);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenAndReset(true)}
        aria-label="Search entries"
        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:opacity-70"
        style={{ border: "1px solid var(--border)", color: "var(--fg-muted)" }}
      >
        <Search size={15} aria-hidden="true" className="shrink-0" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded px-1.5 py-0.5 text-[11px] sm:inline" style={{ border: "1px solid var(--border)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>⌘K</kbd>
      </button>
      {/* Portaled to document.body: the sticky header's backdrop-filter
          creates a containing block that would trap a fixed overlay. */}
      {open && mounted && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[12vh]"
          style={{ background: "color-mix(in srgb, var(--bg) 60%, transparent)", backdropFilter: "blur(8px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-md overflow-hidden"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 30px 60px rgb(0 0 0 / 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <Search size={16} aria-hidden="true" className="shrink-0" style={{ color: "var(--fg-faint)" }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                onKeyDown={onInputKeyDown}
                placeholder="Search entries…"
                aria-label="Search entries"
                role="combobox"
                aria-expanded="true"
                aria-controls="site-search-results"
                aria-activedescendant={results.length ? `site-search-${results[Math.min(activeIndex, results.length - 1)].slug}` : undefined}
                className="w-full bg-transparent py-3.5 text-sm outline-none focus-visible:outline-none"
                style={{ color: "var(--fg)" }}
              />
              <kbd className="hidden shrink-0 rounded px-1.5 py-0.5 text-[11px] sm:inline" style={{ border: "1px solid var(--border)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--fg-faint)" }}>esc</kbd>
            </div>
            <ul id="site-search-results" role="listbox" aria-label="Results" className="max-h-72 list-none overflow-y-auto p-2">
              {results.map((e, i) => (
                <li key={e.slug} role="option" id={`site-search-${e.slug}`} aria-selected={i === activeIndex}>
                  <button
                    type="button"
                    onClick={() => go(`/docs/${e.slug}`)}
                    onMouseMove={() => setActiveIndex(i)}
                    className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm"
                    style={{
                      color: "var(--fg)",
                      background: i === activeIndex ? "var(--surface-2)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span className="font-medium">{e.name}</span>
                    <span className="text-xs" style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>{e.layer}</span>
                  </button>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-3 py-4 text-sm" style={{ color: "var(--fg-faint)" }}>No entries match “{query}”.</li>
              )}
            </ul>
            <div className="flex items-center gap-4 px-4 py-2.5 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--fg-faint)" }}>
              <span><kbd style={{ fontFamily: "var(--font-mono)" }}>↑↓</kbd> navigate</span>
              <span><kbd style={{ fontFamily: "var(--font-mono)" }}>↵</kbd> open</span>
              <span><kbd style={{ fontFamily: "var(--font-mono)" }}>esc</kbd> close</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
