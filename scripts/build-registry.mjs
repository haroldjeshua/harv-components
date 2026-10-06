// Injects derived `cssVars` into registry.json before `shadcn build` runs.
//
// Derivation (nothing hand-typed):
//   1. For each item, read its `files` and collect `var(--x)` references that
//      match known theme vars (same allowlist as lib/tokens.ts).
//   2. Parse values for those vars from app/globals.css (`:root` = light,
//      `.dark` = dark). Non-theme vars (e.g. --tone-bg, defined in the file
//      itself) ship with the file and are excluded.
// Also drift-checks `title`/`description` against the colocated *.entry.tsx.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const KNOWN_VARS = [
  "--bg", "--surface", "--surface-2", "--fg", "--fg-muted", "--fg-faint",
  "--border", "--accent-fg", "--radius-sm", "--radius-md", "--radius-lg",
  "--duration-fast", "--duration-med", "--ease-out",
  "--font-sans", "--font-display", "--font-mono",
];

function parseBlock(css, selector) {
  const m = css.match(new RegExp(`${selector}\\s*{([^}]*)}`, "s"));
  const vars = {};
  if (!m) return vars;
  for (const line of m[1].split(";")) {
    const mm = line.match(/(--[a-z0-9-]+)\s*:\s*(.+)/i);
    if (mm && KNOWN_VARS.includes(mm[1])) vars[mm[1]] = mm[2].trim();
  }
  return vars;
}

function usedVars(source) {
  const found = new Set();
  for (const m of source.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
    if (KNOWN_VARS.includes(m[1])) found.add(m[1]);
  }
  return [...found].sort();
}

function entryField(entrySource, field) {
  const m = entrySource.match(new RegExp(`${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "s"));
  return m ? m[1] : null;
}

const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
const theme = parseBlock(css, "@theme");
const light = { ...theme, ...parseBlock(css, ":root") };
const dark = { ...theme, ...parseBlock(css, String.raw`\.dark`) };

const registryPath = join(ROOT, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
let failed = false;

for (const item of registry.items) {
  const sources = item.files.map((f) => readFileSync(join(ROOT, f.path), "utf8"));
  const combined = sources.join("\n");
  const vars = usedVars(combined);
  const cssVars = { light: {}, dark: {} };
  for (const v of vars) {
    if (light[v]) cssVars.light[v] = light[v];
    if (dark[v]) cssVars.dark[v] = dark[v];
    if (!light[v] && !dark[v]) {
      console.error(`  ✗ ${item.name}: ${v} has no value in globals.css`);
      failed = true;
    }
  }
  item.cssVars = cssVars;
  console.log(`  ✓ ${item.name}: ${vars.length} theme vars → cssVars`);

  // Drift check against the colocated entry file.
  const entryFile = `registry/harv/${item.name}/${item.name}.entry.tsx`;
  try {
    const entry = readFileSync(join(ROOT, entryFile), "utf8");
    for (const field of ["title", "description"]) {
      const expected = field === "title" ? item.title : item.description;
      const actual = entryField(entry, field === "title" ? "name" : "description");
      if (actual && actual !== expected) {
        console.error(`  ✗ ${item.name}: registry.json ${field} differs from ${entryFile}`);
        failed = true;
      }
    }
  } catch {
    console.error(`  ✗ ${item.name}: missing ${entryFile}`);
    failed = true;
  }
}

if (failed) process.exit(1);
writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n");
console.log("registry.json cssVars injected.");
