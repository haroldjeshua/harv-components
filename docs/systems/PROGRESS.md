# Systems rebuild — progress log

Running log for the Lab 002 / Lab 003 system-entry rebuild. Fresh sessions
resume here.

## Phase 0 — ground truth and audit (done, awaiting review)

- Read Lab 002 + Lab 003 source (`harv.computer` repo, read-only) and both
  published articles (`/labs/2`, `/labs/3`).
- Wrote `docs/systems/ledger-temporal-theme.md` (20 rows) and
  `docs/systems/ledger-proximity-navigation.md` (22 rows).
- No code changes. Working tree should match `origin/main` except these
  three new files.

## Decisions carried in

- Layers are `system` + `lab` tag (Harv directive; reverses the pre-phase call).
- Daylight independent of Theme toggle; cross-link `related`, no registryDependency.
- Project-card question deferred to Wave 2 (two-vs-one still open; standing recommendation: two).
- Daylight first; Proximity behind API freeze (freeze doc exists in manifest; P5 seed "off" marker corrected — doesn't exist).
- Dogfooding is verification, not provenance; `usedIn` frozen at extraction.
- Prior system de-named across worktree/docs ("a design system I worked on years ago").

## Phase 2 — resolver, styles, tests (done, reviewed)

## Phase 3 — runtime + contained stage (done, awaiting gate run)

- Template gained generic Anatomy, Host requirements, Gotchas, Credits
  sections + demo-route link; panel gained install steps + phase table.
- Temporal entry complete: consumer-path usage (with scopeClass + explicit
  state generics), 4 install steps, API, anatomy, host, gotchas, credits,
  changelog, related link. Theme-toggle cross-link present, no dependency.
- `/demo/temporal-theme` full-page route (200): page shell wears the phase,
  dynamic/manual modes, docs chrome untouched.
- Registry item unchanged in shape (lib+component+component-css,
  lucide dep, popover regDep); next-themes stays a documented prerequisite
  per manifest, not a dependency.
- Install test (docs-only, next-themes present): URL add, wire-up per Usage,
  scratch tsc + prerender green. One doc gap found and fixed: temperature
  state needed an explicit union generic.
- Ledger Daylight rows all ✅ or explained. No deploy (gate says hold).

- `use-temporal-theme.ts` (entry-side, not shipped): live tick 30s +
  visibility/focus with cleanup, simulate minutes, resync rule, mount-gated
  deterministic noon fallback (no blocking script, no mismatch by construction).
- `temporal-stage.example.tsx`: browser-window surface, aria-live readout,
  Live/Simulate segmented radiogroups, native range scrubber, scheme/temp
  overrides with provenance tags, resync on scrub and mode change.
- Deviations from lab, documented in-file: native controls instead of Radix
  ToggleGroup + borrowed slider (no new deps); PhaseIcon colors use docs
  tokens. Behavior (tick cadence, flags, labels, resync rule) mirrors source.
- Gates: typecheck, lint, tests (18 green), build green.
- Still ahead (Phase 4): site-wide application, phase table on entry page,
  copy schedule/prompt, 4-step install, full-page demo route.

- vitest 5 installed (`pnpm test` → `vitest run`). Peer warning: wants
  @types/node 22+, repo has 20.x — harmless, tests run.
- Resolver verified byte-identical to lab (matching SHA-256).
- `temporal-theme.test.ts`: 18 tests green — all 12 published table rows,
  midnight wrap, schedule override, progress bounds, `phaseTheme`,
  `describeDay` shape.
- Styles verified byte-identical, reduced-motion query present.
- Styles use the lab's hardcoded scoped values, not docs tokens — deliberate:
  those values ARE the shipped theme, and sources stay verbatim.
- Gates: typecheck, lint (`--max-warnings 0`), tests, build all green.

## Open questions (for Harv)

1. Daylight "either tier": what are the two tiers the take-home toggle wires to?
2. Rail "40px target": links are 8–20px tall; is the claim about the 44px track width, or is something missing?
3. Marker "off": confirm it never existed (seed list error, not a regression).
4. Daylight runtime tick cadence for our entry (lab: 30s + visibility/focus)?
5. Simulate scrubber approach (native range input to avoid a slider dep)?
6. Full-page demo routes: where should they live (e.g. `/docs/<slug>/demo`)?

## Harv directives, post-Phase 0 (override pre-phase decisions where noted)

- **New `system` layer approved.** Reverses the "no new layer" call: both labs move
  out of `component` into `system` (page-wide/site-wide, not inline). Sidebar
  and gallery groupings must gain the layer (gallery derives it; sidebar
  `LAYERS` const is hardcoded — update it).
- **Daylight goes site-wide on harv-components** (dynamic or manual mode), while
  harv.computer keeps it lab-scoped only. Entry needs: demo surface, time
  source panel (both site-wide application AND inline browser-window stage),
  server-rendered phase boundaries table, take-home with inline component +
  tiny browser preview, lucide icons matching the lab.
- **Sources stay verbatim.** Do not restructure lab files to fit our entry
  shape; mismatch between the two repos is worse than an imperfect file.
- **Proximity keeps the long-document feel** plus the rail explorer panel
  (mode/marker/waves/expanded/position) with take-home beneath it.
- Footnote URLs captured for Credits: devouringdetails.com,
  makingsoftware.com/chapters/how-a-screen-works,
  rareui.com/components/proximitysidebar, shedsgns.me/taste,
  mindless.harv.computer, chloeyan.me.
- Tier inference (unconfirmed): "either tier" = site-wide application tier vs
  scoped-surface tier. Confirm in Phase 1 gate.

## Future entry candidates (Harv requests)

- **Scrub range input**: the hour-scrubber pattern reused across lab
  articles. Candidate for its own components entry. Not started.

## Phase 5 - proximity core (done, awaiting review)

- `proximity-math.ts` (new, shipped as `registry:lib`): gaussian, spread,
  progress, travel/pointer factors, interpolation, active-pick, row heights —
  all mirrored from rail inline logic, including edge cases.
- 16 new tests green (34 total with resolver). Rail refactored to consume the
  module; behavior has one source.
- Deviation from manifest (documented): item gains a second file (math lib).
  Justification: the approved test plan requires unit-testable pure logic.
  No behavior, prop, default, or visual change — one unused import removed
  (lint gate), nothing else touched.
- `system` layer created per Harv directive: schema union, sidebar group,
  both lab entries + registry meta moved. Gallery derives it.
- Host requirements + honest-geometry gotchas added to the proximity entry.
- Scroll-container proposal: NO addition. Rail tracks window scroll by
  document id; limitation documented in gotchas. Object now or it stands.
- Gates: typecheck, lint (`--max-warnings 0`), tests, registry:build, build
  all green.

## Phase 6 - rail explorer, all combinations (done, awaiting gate run)

- `proximity-explorer.example.tsx`: mode/marker/waves-or-Expanded/contained/
  position explorer with live rail + anchored sections carrying detail/note
  ids, tabIndex, and scroll margins (host contract demonstrated, not just
  documented). Native controls instead of Radix ToggleGroup (no new deps);
  labels and conditional logic mirror the lab VariantSelector.
- Wired as third example. Gates green (typecheck, lint, 34 tests, build).
- Gate run: switch every combination on `/docs/proximity-navigation` and
  eyeball the rail — especially minimap+Expanded wave field and contained
  dots pill.

## Phase 7 - behavior verification, automatable half (done; human half pending gate)

- No browser tooling in this environment, so no axe run: documented as
  pending (recommend CI or a gate-run instead of a heavy one-off install).
- Code-verified against the refactored rail: pushState (push, not replace),
  scrollIntoView + focus move, aria-current, progressbar semantics,
  reduced-motion paths, listener cleanup with rAF cancel.
- Caught and fixed a real doc bug: the proximity how-it-works claimed
  IntersectionObserver tracking (copied from the manifest) and repeated the
  40px claim. The rail uses scroll-position checks; text now states shipped
  geometry. Manifest inaccuracy noted for the harv.computer side.
- Ledger P9-P21 updated to code-verified/gate-pending states.
- Gates: typecheck, lint, tests (34 green), registry:build, build green.
- Human gate must still cover: keyboard-only full flow, hash + Back run,
  SR spot check, touch device, mobile emulation, axe.

## Phase 8 - proximity entry page, demo route, install test (done, awaiting gate)
- Entry restructured per annotations: single "Proximity rail" explorer block,
  page-level `ProximityPageSections` via generic `pageContent` field,
  captions in block headers, install steps, anatomy with install targets,
  honest host/gotchas, 4-footnote Credits.
- `/demo/proximity-navigation` route (explorer controls + long sections);
  demo layout back-link generalized per demo page.
- Install test (docs-only): URL add (rail + math lib), wire-up per Usage,
  scratch tsc + prerender green. Namespace form verified earlier.
- Gates green (typecheck, lint, 34 tests, registry:build, build).

## Phase 9 - integration QA (done, awaiting gate review)

- Registry endpoints: /r/registry.json + all 4 items return 200, valid
  JSON, no redirects (checked with redirects disabled).
- Joint scratch app via @harv namespace: temporal-theme (4 files incl.
  popover chain) + proximity-navigation (rail + math lib) installed clean;
  /joint page (live temporal surface + minimap+waves rail + long sections)
  tsc-clean and prerendered — both systems SSR together with no hydration
  errors.
- Resolver re-asserted against the installed copy (golden/dawn/night rows,
  8 day entries).
- Copy-prompt ingredients verified in served HTML (install commands,
  usage, source, credits, prompt buttons on both pages).
- Finding: rail keeps host next-themes colors on temporal surfaces (does
  not re-tint with phase) — by lab design, recorded in entry gotchas.
- Ledger final pass: stale rows corrected (D5/D10/P1/P4/P9/P10/P22),
  mistreated-concerns section rewritten to resolved state. Remaining
  ⚠️/❌ are documented limitations (late content, small screens, human
  gate runs) or historical records (40px claim, off-marker).

## Phase 10 - ship prep and handoff (done; deploy held for Harv's word)

- Changelog updated to 12 entries incl. both systems; hero count is dynamic.
- `HANDOFF-harv-computer.md`: verified install commands (URL + namespace),
  item contents, docs links, upstream notes for the harv side.
- `REGISTRY-INDEX-DRAFT.md`: namespace, homepage, URL template, description.
  Not submitted.
- LICENSE confirmed (MIT, present). Gates green across the board.
