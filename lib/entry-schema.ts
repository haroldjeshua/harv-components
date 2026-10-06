export type EntryLayer = "element" | "component" | "pattern";
export type EntryStatus = "draft" | "stable";

export interface EntryMeta {
  slug: string;
  name: string;
  layer: EntryLayer;
  tags: string[];
  status: EntryStatus;
  origin: string;
  usedIn: string[];
  figma: string | null;
  deps: string[];
  added: string;
  description: string;
}

const REQUIRED = ["slug", "name", "layer", "status", "origin", "usedIn", "added", "description"] as const;

export function validateEntryMeta(meta: Record<string, unknown>): EntryMeta {
  for (const key of REQUIRED) {
    if (meta[key] === undefined || meta[key] === null || meta[key] === "") {
      throw new Error(`Entry missing required field: ${key}`);
    }
  }
  if (!["element", "component", "pattern"].includes(meta.layer as string)) {
    throw new Error(`Entry "${meta.slug}": invalid layer "${meta.layer}"`);
  }
  if (!["draft", "stable"].includes(meta.status as string)) {
    throw new Error(`Entry "${meta.slug}": invalid status "${meta.status}"`);
  }
  if (!Array.isArray(meta.usedIn)) throw new Error(`Entry "${meta.slug}": usedIn must be an array`);
  return {
    slug: String(meta.slug),
    name: String(meta.name),
    layer: meta.layer as EntryLayer,
    tags: Array.isArray(meta.tags) ? meta.tags.map(String) : [],
    status: meta.status as EntryStatus,
    origin: String(meta.origin),
    usedIn: meta.usedIn.map(String),
    figma: meta.figma ? String(meta.figma) : null,
    deps: Array.isArray(meta.deps) ? meta.deps.map(String) : [],
    added: String(meta.added),
    description: String(meta.description),
  };
}
