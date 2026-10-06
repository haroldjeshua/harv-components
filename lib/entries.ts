import * as fs from "node:fs";
import * as path from "node:path";
import { validateEntryMeta, type EntryMeta } from "@/lib/entry-schema";
import { buttonEntry } from "@/registry/harv/button/button.entry";
import { badgeEntry } from "@/registry/harv/badge/badge.entry";

// Meta lives here for legacy entries (server-safe) and is being migrated to
// colocated *.entry.tsx files (see buttonEntry). Each entry's COMPONENT lives
// in one file — previews import that same file the Code view shows.
const rawMetas: Record<string, unknown>[] = [
  buttonEntry.meta as unknown as Record<string, unknown>,
  badgeEntry.meta as unknown as Record<string, unknown>,
  {
    slug: "theme-toggle",
    name: "Theme toggle",
    layer: "component",
    tags: ["utility"],
    status: "stable",
    origin: "harv-components",
    usedIn: ["harv-components"],
    figma: null,
    deps: ["next-themes"],
    added: "2026-10-06",
    description: "Light/dark switch used in this site's header. Restrained: a single button, no menu.",
  },
  {
    slug: "specimen-tabs",
    name: "Specimen tabs",
    layer: "pattern",
    tags: ["utility"],
    status: "stable",
    origin: "harv-components",
    usedIn: ["harv-components"],
    figma: null,
    deps: [],
    added: "2026-10-07",
    description: "Single-page category tabs that hide/show sections without a route change. Idea studied from Integrity UI's components index; rewritten as an accessible tablist.",
  },
  {
    slug: "work-grid",
    name: "Work grid",
    layer: "pattern",
    tags: [],
    status: "stable",
    origin: "harv (personal site)",
    usedIn: ["harv"],
    figma: null,
    deps: [],
    added: "2026-10-07",
    description: "Folder-like category index from /work. Tiles lift on hover; icons are slots.",
  },
  {
    slug: "lab-index",
    name: "Lab index",
    layer: "pattern",
    tags: [],
    status: "stable",
    origin: "harv (personal site)",
    usedIn: ["harv"],
    figma: null,
    deps: [],
    added: "2026-10-07",
    description: "Workbench feature cards plus archive grid plus a next-up placeholder, from /labs.",
  },
  {
    slug: "craft-masonry",
    name: "Craft masonry",
    layer: "pattern",
    tags: ["decorative"],
    status: "stable",
    origin: "harv (personal site)",
    usedIn: ["harv"],
    figma: null,
    deps: [],
    added: "2026-10-07",
    description: "CSS-columns masonry with hover captions and motion-safe reveal, from /crafts.",
  },
  {
    slug: "media-bento",
    name: "Media bento",
    layer: "pattern",
    tags: [],
    status: "stable",
    origin: "harv (personal site)",
    usedIn: ["harv"],
    figma: null,
    deps: [],
    added: "2026-10-07",
    description: "Static 3-column bento with featured spans, from /media. The dynamic grid-generator variant is a deferred future feature.",
  },
  {
    slug: "media-strip",
    name: "Media strip",
    layer: "pattern",
    tags: [],
    status: "stable",
    origin: "harv (personal site)",
    usedIn: ["harv"],
    figma: null,
    deps: [],
    added: "2026-10-07",
    description: "Horizontal row of opaque cards with a trailing More tile, from the homepage media section.",
  },
  {
    slug: "source-panel",
    name: "Source panel",
    layer: "component",
    tags: ["utility"],
    status: "stable",
    origin: "harv-components",
    usedIn: ["harv-components"],
    figma: null,
    deps: ["sugar-high"],
    added: "2026-10-06",
    description: "Code display with copy button. Same highlighter my site uses (sugar-high), monotone styling.",
  },
];

const metas: EntryMeta[] = rawMetas.map((m) => validateEntryMeta(m));

export function getAllEntries(): EntryMeta[] {
  return [...metas].sort((a, b) => a.name.localeCompare(b.name));
}

export function getEntry(slug: string): EntryMeta | undefined {
  return metas.find((m) => m.slug === slug);
}

/** Read any repo-relative source file at build time (server only). */
export function getSourceFile(relPath: string): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
  } catch {
    return "";
  }
}

export interface RegistryFileRef {
  path: string;
  type: string;
  target?: string;
}

export interface RegistryItemRef {
  name: string;
  type: string;
  title: string;
  description: string;
  files: RegistryFileRef[];
  dependencies?: string[];
  registryDependencies?: string[];
}

/** Read the source registry.json (server only) for install derivation. */
export function getRegistryItem(slug: string): RegistryItemRef | undefined {
  try {
    const registry = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "registry.json"), "utf8")
    ) as { items: RegistryItemRef[] };
    return registry.items.find((i) => i.name === slug);
  } catch {
    return undefined;
  }
}
