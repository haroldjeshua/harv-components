import { validateEntryMeta } from "@/lib/entry-schema";
import type { EntryData } from "@/lib/entry-types";
import { BadgeHero } from "./hero";
import BadgeVariantsExample, { meta as variantsMeta } from "./examples/badge-variants.example";
import BadgeStatusExample, { meta as statusMeta } from "./examples/badge-status.example";

// Colocated docs data for the Badge entry. The component source (badge.tsx)
// stays clean for registry installs; everything the page renders beyond the
// component lives here.
export const badgeEntry: EntryData = {
  meta: validateEntryMeta({
    slug: "badge",
    name: "Badge",
    layer: "element",
    tags: ["utility"],
    status: "stable",
    origin: "harv (personal site)",
    usedIn: ["harv", "harv-components"],
    figma: null,
    deps: [],
    added: "2026-10-06",
    description: "Small label for layers, statuses, and tags.",
  }),
  sourceFile: "registry/harv/badge/badge.tsx",
  usage: `import { Badge } from "@/registry/harv/badge/badge"\n\n<Badge variant="secondary">stable</Badge>`,
  hero: BadgeHero,
  api: [
    { prop: "variant", type: `"default" | "secondary" | "outline"`, default: `"default"`, description: "Visual treatment. Default is inverted; secondary is tonal; outline is bordered." },
  ],
  howItWorks:
    "One span, one variant class. All styling ships in a <style> tag inside the component file, so the entry is a single portable file with no stylesheet to wire up. Renders as a span — use it for labels and statuses, not for interactive controls.",
  changelog: [
    {
      date: "2026-10-07",
      title: "v0.1.0 — initial release",
      items: ["Default, secondary, and outline variants as documented."],
    },
  ],
  examples: [
    { ...variantsMeta, Component: BadgeVariantsExample, file: "registry/harv/badge/examples/badge-variants.example.tsx" },
    { ...statusMeta, Component: BadgeStatusExample, file: "registry/harv/badge/examples/badge-status.example.tsx" },
  ],
};
