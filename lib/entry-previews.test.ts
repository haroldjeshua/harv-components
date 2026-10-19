import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Gallery thumbnails are docs assets: they must exist for every entry and
// must never leak into the registry output that adopters install.
const root = process.cwd();

function entrySlugs(): string[] {
  const dirs = (parent: string) =>
    readdirSync(join(root, parent), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  return [...new Set([...dirs("entries"), ...dirs(join("registry", "harv"))])];
}

function previewSlugs(): string[] {
  const src = readFileSync(join(root, "lib", "entry-previews.tsx"), "utf8");
  const body = src.slice(src.indexOf("const previews"));
  return [...body.matchAll(/(?:^|\n)\s*(?:const\s+)?"?([a-z0-9-]+)"?\s*:/g)]
    .map((m) => m[1])
    .filter((slug) => slug !== "previews");
}

describe("gallery previews", () => {
  it("covers every entry in the archive", () => {
    const missing = entrySlugs().filter((slug) => !previewSlugs().includes(slug));
    expect(missing).toEqual([]);
  });

  it("ships no preview, hero, or entry asset in the registry", () => {
    const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8")) as {
      items: { name: string; files: { path: string }[] }[];
    };
    const shipped = registry.items.flatMap((i) => i.files.map((f) => f.path));
    const leaked = shipped.filter((p) => /(hero|thumb|preview)\.tsx?$|\.entry\.tsx?$/.test(p));
    expect(leaked).toEqual([]);
  });
});
