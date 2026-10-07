import { buttonEntry } from "@/registry/harv/button/button.entry";
import { badgeEntry } from "@/registry/harv/badge/badge.entry";
import { temporalThemeEntry } from "@/registry/harv/temporal-theme/temporal-theme.entry";
import { proximityNavigationEntry } from "@/registry/harv/proximity-navigation/proximity-navigation.entry";
import type { EntryData } from "./entry-types";

// New-style entries register here. Legacy entries (meta only, in
// lib/entries.ts) keep working through the template's fallbacks until they
// are migrated one at a time.
const entries: Record<string, EntryData> = {
  button: buttonEntry,
  badge: badgeEntry,
  "temporal-theme": temporalThemeEntry,
  "proximity-navigation": proximityNavigationEntry,
};

export function getEntryData(slug: string): EntryData | undefined {
  return entries[slug];
}

/** Slugs with colocated entry data + registry items (CLI-installable). */
export function getRegistryReadySlugs(): string[] {
  return Object.keys(entries);
}
