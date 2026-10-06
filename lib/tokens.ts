// Canonical theme tokens mirrored from app/globals.css.
// Values here are informational; registry cssVars are derived by parsing
// globals.css directly (scripts/build-registry.mjs) so shipped values can
// never drift from the stylesheet. Keep this map's keys in sync with the
// vars entries actually use — the build warns on unknown vars.
export const THEME_VAR_NAMES = [
  "--bg",
  "--surface",
  "--surface-2",
  "--fg",
  "--fg-muted",
  "--fg-faint",
  "--border",
  "--accent-fg",
  "--radius-sm",
  "--radius-md",
  "--radius-lg",
  "--duration-fast",
  "--duration-med",
  "--ease-out",
  "--font-sans",
  "--font-display",
  "--font-mono",
] as const;

/** Collect `var(--x)` references from source, restricted to known theme vars.
 *  Component-scoped custom props (e.g. --tone-bg, defined in the same file)
 *  ship with the file itself and are excluded. */
export function collectThemeVars(source: string): string[] {
  const found = new Set<string>();
  for (const match of source.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
    if ((THEME_VAR_NAMES as readonly string[]).includes(match[1])) {
      found.add(match[1]);
    }
  }
  return [...found].sort();
}
