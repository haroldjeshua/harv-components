# System-entry spec (short)

How Lab 002 (Proximity Navigation) and Lab 003 (Daylight Themes) live in
this repo as **system** entries. Everything here derives from the Phase 0
ledgers; nothing new is invented except where marked PROPOSAL.

## 1. Classification

Both entries use layer **`system`** (Harv directive, reverses the pre-phase
"no new layer" call). Tags stay descriptive: `lab` on both, `animated` where
motion is intrinsic (both).

Trade-offs considered: a new layer touches the sidebar `LAYERS` const, the
gallery grouping (derived, no change), and the two entries' `layer` fields.
Registry item types are unaffected (`component`/`lib` as now). Keeping them
in `component` with a `system` tag was rejected: `component` promises
drop-inline semantics, and both systems violate that promise (fixed
positioning, document classes, history writes).

## 2. Page anatomy (standard + minimum additions)

Standard order holds: header → EntryPanel → Examples → API reference →
Provenance → Changelog → prev/next. System entries add exactly three
sections, each justified by the brief's system traits:

1. **Anatomy** — the parts and where each mounts (lib / component / styles;
   layout vs page vs inline stage). Justified: multi-part systems can't be
   understood from a file list.
2. **Host requirements** — what the host page must provide (heading ids,
   `tabIndex`, scroll margins, next-themes `.dark`, CSS import). With a
   stated check where automatable. Justified: install fails silently without
   them (ledger P8/P10, D14/D17).
3. **Gotchas** — known sharp edges, each cited (duplicate fixed-wrapper id,
   late content not re-scanned, small-screen overlap, `useState(new Date())`
   mismatch risk). Justified: failure-modes trait; honest notes per our tone.
4. **Credits** — built from each lab's own footnotes, quoted scope only
   (brief requirement; Mindless + Chloe Yan for Daylight; all four
   Proximity footnotes).

## 3. EntryPanel adaptation

Already supported, no changes: multi-file Code tabs (from the registry item's
file list), per-section copy, Copy prompt. Two data additions:

- `installSteps: string[]` (ordered wire-up: what goes in `layout.tsx`,
  CSS import, provider/toggle mount) rendered as the Install section body
  above the CLI commands. Falls back to current note when absent.
- `stageNote` not needed: Preview renders a **contained stage** component
  supplied per entry (Daylight: scoped surface + time panel; Proximity:
  bounded long-form section with anchored subsections driving a page-scoped
  rail explorer).

Usage shows the minimal wire-up snippet (imports + mount), not just JSX.

## 4. Registry shape

**One item per system** (per both manifests). File types, verified against
the current `registry-item.json` schema (fetched this session):

| File | Type | Notes |
|---|---|---|
| `temporal-theme.ts` | `registry:lib` | installs to `lib/` |
| `temporal-toggle.tsx` | `registry:component` | intra-item imports via `@/registry/…`, rewritten by CLI (verified) |
| `temporal-theme.css` | `registry:component` | `registry:css` is **not a valid file type** (build rejects it; verified empirically). Same target dir as the toggle by design |
| `proximity-rail.tsx` | `registry:component` | single file, no stylesheet |

Schema support answers: **`cssVars`** ✓ (top-level `{theme,light,dark}`, already used);
**`css`** ✓ (top-level rules object for `@layer`/`@keyframes`, not for files);
**`docs`** ✓ (post-install message string — carries a short wire-up pointer,
not the full steps; full steps stay on the entry page).

## 5. Public API sketches

Types only. Everything below exists in the labs today, except marked items.

### Daylight (from `lib/temporal-theme.ts` + toggle props)

```ts
type TemporalPhase = "night" | "dawn" | "morning" | "day"
  | "golden" | "sunset" | "dusk" | "evening";
type TemporalScheme = "light" | "dark";
type TemporalTemperature = "warm" | "neutral" | "cool";

interface PhaseBoundary { phase: TemporalPhase; startsAt: string /* "HH:MM" */ }
interface TemporalState {
  phase: TemporalPhase; scheme: TemporalScheme;
  temperature: TemporalTemperature; progress: number; atmosphereIntensity: number;
}
interface PhaseTheme { scheme: TemporalScheme; temperature: TemporalTemperature; atmosphere: number }

resolveTemporalState(date: Date, schedule?: PhaseBoundary[]): TemporalState
phaseTheme(phase: TemporalPhase): PhaseTheme
describeDay(schedule?: PhaseBoundary[]): Array<PhaseBoundary & PhaseTheme>
DEFAULT_SCHEDULE: PhaseBoundary[]

interface TemporalToggleProps {
  scheme: TemporalScheme; temperature: TemporalTemperature;
  onSchemeChange: (s: TemporalScheme) => void;
  onTemperatureChange: (t: TemporalTemperature) => void;
  dynamic?: boolean; onDynamicChange?: (d: boolean) => void;
  label?: string; // default "Theme"
}
```

PROPOSAL (needs approval, not in lab): export the neutral→base surface
mapping (`scopeClass`: neutral light rides `.temporal-scope` with no suffix)
as a documented snippet, not a new export. Rationale: new exports are new
API; the rule already lives in the demo and the entry usage can show it in
three lines.

### Proximity (from rail props; frozen, no additions)

```ts
type ProximityChapter = { id: string; label: string };
type ProximityMode = "minimap" | "chapters" | "indicator";
type MarkerStyle = "lines" | "dots"; // no "off" — confirmed seed-list error
type RailPosition = "left" | "right";

interface ProximityNavigationProps {
  chapters: readonly ProximityChapter[]; // each needs a matching #id element
  mode?: ProximityMode;      // default "chapters"
  marker?: MarkerStyle;       // default "lines"
  waves?: boolean;            // default false; minimap+lines only (labeled Expanded there)
  contained?: boolean;        // default false; dots only, ignored elsewhere
  position?: RailPosition;    // default "right"
}
// Derived, never props: interactive = mode !== "indicator".
// `waves` in minimap+lines IS the Expanded field (label swap, same boolean).
```

## 6. Test plan

Unit tests (pure logic, deterministic): resolver boundary table incl.
05:29/05:30, 22:00, 23:59, 00:00, midnight wrap; schedule override;
`describeDay` length/shape; `phaseTheme` per phase. Runner: **vitest**
(repo has none; vitest is the standard minimal pick — PROPOSAL, justify:
zero-config TS, watch mode, matches ecosystem; alternative `node:test`
needs a TS loader we don't have).

Manual checklist (per entry, pasted into ledger on run): keyboard-only
full flow; screen-reader spot check (current-section announcement);
touch/mobile emulation; reduced-motion on; resize during session;
late-loading content noted as limitation; small-screen overlap noted;
hash set + Back returns; no hydration warnings in console; axe run
attached where applicable.

## 7. Demo plan

**Contained stage (in entry page):** Daylight — scoped surface wearing the
phase theme + time-source panel (Live/Simulate), driven by entry-local
state; never touches the docs shell. Proximity — bounded long-form section
with anchored subsections + rail explorer (mode/marker/waves/contained/
position controls); rail mounts on the entry page, scoped to that content.

**Full-page demo routes:** `/demo/temporal-theme` (applies the phase theme
to the page shell — the *only* place allowed to do so) and
`/demo/proximity-navigation` (long page where hash, history, and focus are
testable). Bare layout: back link + content, no docs sidebar/outline, so
fixed chrome behaves as installed. Route location PROPOSAL — alternatives
are `/docs/<slug>/demo` (inherits docs chrome, defeats the purpose) or
query-param modes (untestable URLs). Recommend `/demo/<slug>`.
