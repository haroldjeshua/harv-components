import { validateEntryMeta } from "@/lib/entry-schema";
import type { EntryData } from "@/lib/entry-types";
import { TemporalHero } from "./hero";
import TemporalToggleExample, { meta as toggleMeta } from "./examples/temporal-toggle.example";
import TemporalStageExample, { meta as stageMeta } from "./examples/temporal-stage.example";

// Colocated docs data for the temporal-theme entry. Component sources stay
// clean for registry installs; everything the page renders beyond them
// lives here.
export const temporalThemeEntry: EntryData = {
  meta: validateEntryMeta({
    slug: "temporal-theme",
    name: "Temporal theme",
    layer: "system",
    tags: ["lab", "animated"],
    status: "stable",
    origin: "harv.computer — Lab 003, Dynamic Daylight Themes",
    usedIn: ["harv"],
    figma: null,
    deps: ["lucide-react"],
    added: "2026-10-07",
    description: "Daylight-following theme: clock in, scheme and warmth out.",
  }),
  sourceFile: "registry/harv/temporal-theme/temporal-toggle.tsx",
  usage: `import { useState } from "react";
import { TemporalToggle } from "@/components/temporal-toggle";
import { resolveTemporalState } from "@/lib/temporal-theme";
import "@/components/temporal-theme.css";

// Neutral rides the scope base with no suffix class.
function scopeClass(scheme: "light" | "dark", temperature: "warm" | "neutral" | "cool") {
  if (scheme === "dark") return temperature === "neutral" ? "temporal-dark" : \`temporal-dark-\${temperature}\`;
  return temperature === "neutral" ? "" : \`temporal-light-\${temperature}\`;
}

const [scheme, setScheme] = useState<"light" | "dark">("light");
const [temperature, setTemperature] = useState<"warm" | "neutral" | "cool">("neutral");
const live = resolveTemporalState(new Date());

<TemporalToggle
  scheme={scheme}
  temperature={temperature}
  onSchemeChange={setScheme}
  onTemperatureChange={setTemperature}
/>
<div className={\`temporal-scope \${scopeClass(live.scheme, live.temperature)}\`}>
  {/* your content */}
</div>`,
  related: ["theme-toggle"],
  installSteps: [
    "Keep your switch: stay on next-themes with a .dark class. Nothing here replaces that.",
    "Add tone: the Styles tab holds six scoped classes — light and dark, each in warm, neutral, and cool. Import the CSS file.",
    "Add daylight: the Resolver tab holds one pure function mapping the clock to phase, scheme, temperature, and atmosphere.",
    "Add control: mount the Toggle with parent-owned scheme and temperature state. Manual picks sit on top of the time as an offset.",
  ],
  phaseTableTimes: [
    "00:00", "05:29", "05:30", "06:30", "09:00", "12:00",
    "16:00", "17:30", "18:30", "19:30", "22:00", "23:59",
  ],
  demoHref: "/demo/temporal-theme",
  anatomy: [
    { part: "temporal-theme.ts → lib/temporal-theme.ts", mounts: "Nowhere — pure function, called with a Date wherever you render." },
    { part: "TemporalToggle → components/temporal-toggle.tsx", mounts: "Inline in your control bar. Fully controlled; owns no state." },
    { part: "temporal-theme.css → components/temporal-theme.css", mounts: "Imported once globally. Scoped classes only; touches nothing outside .temporal-scope." },
  ],
  hostRequirements: [
    "A dark-mode mechanism of your own (e.g. next-themes with a .dark class). This system extends it and never replaces it.",
    "Import the stylesheet once. Surfaces opt in per element with temporal-scope plus one phase class.",
    "Neutral rides the scope base with no suffix class — map it (see Usage), or neutral renders unstyled.",
    "Toggle state lives in the parent. Pass onDynamicChange to enable the clock-follow pill.",
  ],
  gotchas: [
    "There is no temporal-light class. Neutral light is the bare .temporal-scope base.",
    "Manual picks diverge per part until time moves again — that is the contract, not a bug.",
    "Two scoped surfaces with different phases on one page are fine; classes never leak outside their scope.",
  ],
  credits: [
    { name: "Mindless", href: "https://mindless.harv.computer/", note: "My writing app. Its split scheme/temperature theme is what this lab extends into time." },
    { name: "Chloe Yan's personal website", href: "https://www.chloeyan.me", note: "Where I first got the idea of a time-based color scheme." },
  ],
  hero: TemporalHero,
  api: [
    { prop: "resolveTemporalState", type: "(date: Date, schedule?: PhaseBoundary[]) => TemporalState", default: "schedule = DEFAULT_SCHEDULE", description: "Pure resolver: clock time in, phase plus the scheme, temperature, and atmosphere that phase implies." },
    { prop: "phaseTheme", type: "(phase: TemporalPhase) => PhaseTheme", default: "—", description: "The theme a single phase implies, without needing a time of day." },
    { prop: "describeDay", type: "(schedule?: PhaseBoundary[]) => Array<PhaseBoundary & PhaseTheme>", default: "schedule = DEFAULT_SCHEDULE", description: "The whole day as data, for schedules and copy features." },
    { prop: "DEFAULT_SCHEDULE", type: "PhaseBoundary[]", default: "8 boundaries, 05:30 → 22:00", description: "Tunable phase start times in local HH:MM. Override per project." },
    { prop: "scheme", type: `"light" | "dark"`, default: "required", description: "TemporalToggle: current scheme. Fully controlled." },
    { prop: "temperature", type: `"warm" | "neutral" | "cool"`, default: "required", description: "TemporalToggle: current temperature offset." },
    { prop: "onSchemeChange / onTemperatureChange", type: "(value) => void", default: "required", description: "TemporalToggle: parent-owned setters." },
    { prop: "dynamic / onDynamicChange", type: "boolean / (boolean) => void", default: "false / undefined", description: "TemporalToggle: clock-follow pill. Rendered only when onDynamicChange is provided." },
    { prop: "label", type: "string", default: `"Theme"`, description: "TemporalToggle: aria-label stem for the temperature settings button." },
  ],
  howItWorks:
    "Time in, theme out, through one deterministic function. The schedule maps clock times to eight phases; each phase implies a scheme, a temperature, and an atmosphere strength. Temperature is a taste offset on top of phase, never a second time source: manual picks diverge per part, and re-moving time re-syncs. The toggle is fully controlled and owns no state; the surface carries one scoped temporal-* class plus an inline --temporal-atmosphere value. CSS transitions drop to none under prefers-reduced-motion.",
  changelog: [
    {
      date: "2026-10-07",
      title: "v0.1.0 — initial release",
      items: ["Resolver, toggle, and scoped styles as published in Lab 003."],
    },
  ],
  examples: [
    { ...toggleMeta, caption: "temporal-toggle.tsx · live", Component: TemporalToggleExample, file: "registry/harv/temporal-theme/examples/temporal-toggle.example.tsx" },
    { ...stageMeta, caption: "Demo surface", Component: TemporalStageExample, file: "registry/harv/temporal-theme/examples/temporal-stage.example.tsx" },
  ],
};
