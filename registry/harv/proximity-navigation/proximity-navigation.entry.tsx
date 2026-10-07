import { validateEntryMeta } from "@/lib/entry-schema";
import type { EntryData } from "@/lib/entry-types";
import ProximityExplorerExample, { meta as explorerMeta } from "./examples/proximity-explorer.example";
import { ProximityPageSections } from "./sections";
import { ProximityHero } from "./hero";

// Colocated docs data for the proximity-navigation entry. The rail source
// stays clean for registry installs; everything the page renders beyond it
// lives here.
export const proximityNavigationEntry: EntryData = {
  meta: validateEntryMeta({
    slug: "proximity-navigation",
    name: "Proximity navigation",
    layer: "system",
    tags: ["lab", "animated"],
    status: "stable",
    origin: "harv.computer — Lab 002, Proximity Navigation",
    usedIn: ["harv"],
    figma: null,
    deps: ["motion"],
    added: "2026-10-07",
    description: "Scroll-synced rail for long pages. Marks swell near you.",
  }),
  sourceFile: "registry/harv/proximity-navigation/proximity-rail.tsx",
  installSteps: [
    "Ships as one item: hand it your chapters and pick a mode. Defaults match the explorer on this page.",
    "Give every chapter a matching #id element (plus #id-detail and #id-note for minimap density). Sections must be focusable with scroll margins.",
    "Keyboard, screen readers, and reduced motion come along: real links, aria-current, instant scrolling when motion is reduced.",
  ],
  demoHref: "/demo/proximity-navigation",
  anatomy: [
    { part: "proximity-rail.tsx → components/proximity-rail.tsx", mounts: "Once per page. Fixed to the viewport edge; takes no column." },
    { part: "proximity-math.ts → lib/proximity-math.ts", mounts: "Nowhere — pure functions (spread, progress, active pick, row heights) the rail consumes." },
    { part: "Your sections (host markup)", mounts: "Page flow with matching #ids. The rail observes them; without them it renders an empty track." },
  ],
  usage: `import { ProximityNavigation } from "@/components/proximity-rail"

<ProximityNavigation
  chapters={[
    { id: "idea", label: "The idea" },
    { id: "install", label: "Install" },
  ]}
  mode="chapters"
  marker="lines"
  position="right"
/>`,
  hero: ProximityHero,
  api: [
    { prop: "chapters", type: "readonly { id: string; label: string }[]", default: "required", description: "Sections the rail tracks. Each needs a matching #id element on the page." },
    { prop: "mode", type: `"minimap" | "chapters" | "indicator"`, default: `"chapters"`, description: "Minimap maps every paragraph; chapters lists sections; indicator only reports progress." },
    { prop: "marker", type: `"lines" | "dots"`, default: `"lines"`, description: "Lines take waves; dots take the optional contained pill." },
    { prop: "waves", type: "boolean", default: "false", description: "Fill chapter gaps with wave marks. Only applies to minimap + lines." },
    { prop: "contained", type: "boolean", default: "false", description: "Wrap dots in a rounded container. Ignored outside dots." },
    { prop: "position", type: `"left" | "right"`, default: `"right"`, description: "Which viewport edge the fixed rail hugs." },
  ],
  howItWorks:
    "Chapters become rail items, plus detail and note paragraph marks in minimap mode and interstitial wave marks when waves is on. On scroll (batched per frame), each observed section's viewport position picks the active mark, while scroll position drives a Gaussian proximity swell through motion scroll values and springs. Interactive modes render real links — rowHeight-tall marks (8–20px) on a 44px-wide track — with aria-current on the active mark; indicator mode renders a progressbar and is not clickable. Reduced motion disables smooth scrolling and springs; a hydration gate keeps server markup matched.",
  hostRequirements: [
    "One element with a matching #id per chapter (plus optional #id-detail and #id-note paragraphs for minimap density).",
    "Sections must be focusable (tabIndex -1) with scroll margins so Enter-to-section never hides headings.",
    "Chapter ids must be unique on the page — the rail observes by document id.",
    "Window scroll only. Sections added after mount are not re-scanned.",
  ],
  gotchas: [
    "The fixed wrapper carries the id proximity-navigation-demo. Two rails on one page duplicate it.",
    "On small screens the fixed rail overlaps content; the lab provides no responsive behavior.",
    "Link boxes are rowHeight tall (8–20px) on a 44px-wide line track. Stated as shipped; the lab article's 40px claim does not match the source.",
    "On temporal surfaces the rail keeps host (next-themes) colors; it does not re-tint with phase. Verified side by side in Phase 9.",
  ],
  credits: [
    { name: "Devouring Details by Rauno Freiberg", href: "https://devouringdetails.com/", note: "The first place I saw a rail like this, and the reason this experiment exists." },
    { name: "Making Software, how a screen works", href: "https://www.makingsoftware.com/chapters/how-a-screen-works", note: "Where the expanded docs minimap got its idea: a full-height map of the page you are on." },
    { name: "RareUI's proximity sidebar", href: "https://www.rareui.com/components/proximitysidebar", note: "A reference for how installable this kind of component can be. Installability reference only." },
    { name: "shedsgns taste", href: "https://shedsgns.me/taste", note: "The model for the Indicator variant: present, non-clickable, only there to show position." },
  ],
  changelog: [
    {
      date: "2026-10-07",
      title: "v0.1.0 — initial release",
      items: ["Rail with minimap, chapters, and indicator modes as published in Lab 002."],
    },
  ],
  examples: [
    { ...explorerMeta, Component: ProximityExplorerExample, file: "registry/harv/proximity-navigation/examples/proximity-explorer.example.tsx" },
  ],
  pageContent: ProximityPageSections,
};
