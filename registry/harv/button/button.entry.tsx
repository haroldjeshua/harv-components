import { validateEntryMeta } from "@/lib/entry-schema";
import type { EntryData } from "@/lib/entry-types";
import { Button } from "./button";
import ButtonModifiersExample, { meta as modifiersMeta } from "./examples/button-modifiers.example";
import ButtonTonesExample, { meta as tonesMeta } from "./examples/button-tones.example";
import ButtonSizesExample, { meta as sizesMeta } from "./examples/button-sizes.example";
import ButtonIconsExample, { meta as iconsMeta } from "./examples/button-icons.example";

// Colocated docs data for the Button entry. The component source
// (button.tsx) stays clean for registry installs; everything the page
// renders beyond the component lives here.
export const buttonEntry: EntryData = {
  meta: validateEntryMeta({
    slug: "button",
    name: "Button",
    layer: "element",
    tags: ["utility"],
    status: "stable",
    origin: "harv (personal site)",
    usedIn: ["harv", "harv-components"],
    figma: null,
    deps: [],
    added: "2026-10-06",
    description:
      "Pressable with modifiers (contained, outline, modern, link, flat, raised) and utilities (tones, rounds, sizes, icons). Taxonomy from Integrity UI (my own prior work, rewritten); tones from harv semantic tokens.",
  }),
  sourceFile: "registry/harv/button/button.tsx",
  usage: `import { Button } from "@/registry/harv/button/button"\n\n<Button tone="danger" variant="outline">Delete</Button>`,
  hero: () => <Button>Button</Button>,
  api: [
    { prop: "variant", type: `"default" | "secondary" | "outline" | "modern" | "ghost" | "flat" | "raised" | "link"`, default: `"default"`, description: "Visual modifier. Contained by default; modern is a soft tonal fill; raised adds elevation." },
    { prop: "tone", type: `"default" | "danger" | "warning" | "info" | "success"`, default: `"default"`, description: "Semantic tone. Composes with contained, outline, and modern variants." },
    { prop: "size", type: `"xs" | "sm" | "md" | "lg" | "icon"`, default: `"md"`, description: "Height scale. icon renders a square button for icon-only content." },
    { prop: "shape", type: `"default" | "pill" | "square"`, default: `"default"`, description: "Corner treatment. Ignored by the link variant." },
    { prop: "block", type: "boolean", default: "false", description: "Stretch to the full width of the container." },
  ],
  howItWorks:
    "Variant, tone, size, and shape each map to one CSS class; tone sets --tone-bg/--tone-fg variables that the contained, outline, and modern variants consume, so tone composes instead of multiplying classes. Pressing the button dips it 1px and darkens it instead of scaling it, so the label never wobbles. All styling ships in a <style> tag inside the component file, so the entry is a single portable file with no stylesheet to wire up. Icons are plain children — the button already gaps them — and icon-only buttons use size=\"icon\" with an aria-label.",
  changelog: [
    {
      date: "2026-10-07",
      title: "v0.1.0 — initial release",
      items: [
        "Modifiers, tones, sizes, shapes, and icon support as documented.",
      ],
    },
  ],
  examples: [
    { ...modifiersMeta, Component: ButtonModifiersExample, file: "registry/harv/button/examples/button-modifiers.example.tsx" },
    { ...tonesMeta, Component: ButtonTonesExample, file: "registry/harv/button/examples/button-tones.example.tsx" },
    { ...sizesMeta, Component: ButtonSizesExample, file: "registry/harv/button/examples/button-sizes.example.tsx" },
    { ...iconsMeta, Component: ButtonIconsExample, file: "registry/harv/button/examples/button-icons.example.tsx" },
  ],
};
