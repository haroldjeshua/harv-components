import Link from "next/link";
import { getAllEntries } from "@/lib/entries";
import { getRegistryReadySlugs } from "@/lib/entry-data";
import { GalleryFilter } from "@/components/gallery-filter";
import { Button } from "@/registry/harv/button/button";
import { Badge } from "@/registry/harv/badge/badge";
import { ThemeToggle } from "@/entries/theme-toggle/theme-toggle";
import type * as React from "react";

// Landing hero: a few live specimens floating over a centered intro.
// Our own components, our own words, monotone. Static (no animation) so
// there is nothing to disable under reduced motion.
function SpecimenStage() {
  const chip: React.CSSProperties = {
    border: "1px solid var(--border)",
    background: "var(--surface)",
    borderRadius: "var(--radius-md)",
    boxShadow: "0 8px 30px rgb(0 0 0 / 0.12)",
  };
  return (
    <div aria-hidden="true" className="relative mx-auto h-56 w-full max-w-xl select-none sm:h-64">
      <div className="absolute left-[4%] top-[8%] -rotate-6" style={chip}>
        <div className="px-4 py-3">
          <Button shape="pill" size="sm">Install</Button>
        </div>
      </div>
      <div className="absolute right-[6%] top-[2%] rotate-3 px-4 py-3" style={chip}>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">stable</Badge>
          <Badge variant="outline">utility</Badge>
        </div>
      </div>
      <div className="absolute left-[12%] top-[52%] rotate-2 px-4 py-3" style={chip}>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-xs" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>dark-first</span>
        </div>
      </div>
      <div className="absolute right-[10%] top-[48%] -rotate-2 px-4 py-3" style={chip}>
        <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--fg-muted)" }}>
          pnpm dlx shadcn add @harv/button
        </span>
      </div>
      <div className="absolute bottom-[0%] left-[42%] rotate-1 px-3 py-2" style={{ ...chip, borderRadius: "999px" }}>
        <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--fg-muted)" }}>⌘K</span>
      </div>
    </div>
  );
}

export default function Home() {
  const entries = getAllEntries();
  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
      <section className="mx-auto pb-12 pt-12 text-center" style={{ maxWidth: "70vh" }}>
        <SpecimenStage />
        <p className="mt-8 text-sm" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
          ✲ harv components
        </p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Components I actually use.</h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          My personal archive. Installable with the shadcn CLI. {entries.length} entries
          and counting, more as real projects need them.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#entries"
            className="no-underline"
            style={{
              display: "inline-flex", alignItems: "center", height: "2.5rem", padding: "0 1rem",
              borderRadius: "var(--radius-sm)", fontSize: "0.875rem", fontWeight: 500,
              background: "var(--fg)", color: "var(--bg)",
            }}
          >
            Browse entries
          </a>
          <Link
            href="/about"
            className="no-underline"
            style={{
              display: "inline-flex", alignItems: "center", height: "2.5rem", padding: "0 1rem",
              borderRadius: "var(--radius-sm)", fontSize: "0.875rem", fontWeight: 500,
              background: "var(--surface-2)", color: "var(--fg)",
            }}
          >
            How to install
          </Link>
        </div>
      </section>
      <section id="entries" aria-label="Entries" className="scroll-mt-20">
        <GalleryFilter entries={entries} readySlugs={getRegistryReadySlugs()} />
      </section>
    </div>
  );
}
