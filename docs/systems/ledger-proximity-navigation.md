# Behavior Ledger — Proximity Navigation (Lab 002)

Source: `harv.computer` Lab 002 implementation + published article (`/labs/2`).
Files: `components/labs/proximity-rail.tsx` (510),
`components/labs/proximity-navigation.tsx` (384, demo shell + VariantSelector, stays behind).
Current implementation: `registry/harv/proximity-navigation/*` + `/docs/proximity-navigation`.

Status key: ✅ matches · ⚠️ partial / ❌ missing / ❓ unknown.

## Model and modes

| # | Behavior / claim | Citation | Status |
|---|---|---|---|
| P1 | Fixed rail at viewport edge, no column taken | rail (fixed wrapper) | ✅ file verbatim; rail mounts from the explorer block — fixed overlay can cover the docs outline on xl screens |
| P2 | Modes: chapters (main sections), minimap (every paragraph), indicator (progress only, non-clickable) | rail `109-129`; demo shell mode descriptions | ✅ all three exercised in the explorer example; visual confirmation pending gate run |
| P3 | Markers lines/dots; waves fill chapter gaps; lines take waves, dots take contained pill | rail `131-137`, `163-176`; article §06 | ✅ logic verbatim; all combinations selectable in the explorer (waves labeled Expanded in minimap, as lab); visual confirmation pending gate run |
| P4 | "Expanded" = minimap + lines + waves relabeled (full-height wave field), not a separate prop | demo shell `119-121` (`wave`wavesLabel`), rail row-height memo | ✅ our explorer states the equivalence in-UI; prose explanation pending (Phase 8 follow-up if wanted) |
| P5 | Seed-list "markers: lines, dots, **off**" | phase seed list | ❌ confirmed seed-list error per Harv: source type is `"lines" \| "dots"` (rail `17`). No `off` marker ever existed |
| P6 | Position left/right | rail `115`, `236-240` | ✅ shipped; both selectable in the explorer (default right, as lab) |
| P7 | Current mark grows darker/longer; pointer proximity swells neighbors; names appear in chapters mode | rail `379-414`; article §§02–03 | ✅ math unit-tested; live behavior exercised in explorer; visual confirmation pending gate run |
| P8 | Minimap density needs `#id`, `#id-detail`, `#id-note` elements per chapter | rail `142-148`; demo shell `74-88` (detail/note paragraphs with ids + tabIndex) | ✅ documented in entry Host requirements; examples still omit detail/note ids (chapters-mode only — minimap demo lands with the full explorer) |

## Navigation and history

| # | Behavior / claim | Citation | Status |
|---|---|---|---|
| P9 | Select mark → smooth scroll, hash updates via `history.pushState` (push, not replace); Back returns to previous place | rail (scrollTo + link handler); article §04 | ✅ shipped; `/demo/proximity-navigation` route exists for the end-to-end run — live Back-button run pending gate |
| P10 | Sections focusable (`tabIndex={-1}`), Enter moves focus to section, `scroll-mt` offsets | rail (focus move); demo shell (tabIndex, scroll margins, min heights) | ✅ page-level sections demonstrate all three; host requirements document them |
| P11 | Hardcoded wrapper id `proximity-navigation-demo` | rail (fixed wrapper) | ✅ verbatim; duplicate-id gotcha documented in entry Gotchas |

## Accessibility (article §05 claims)

| # | Behavior / claim | Citation | Status |
|---|---|---|---|
| P12 | "Every link has a 40-pixel target" | article §05 | ❌ article wrong per Harv ruling: links are `rowHeight` tall (8–20px, rail `165-176`) on a 44px-wide track. Entry documents actual geometry; lab's own CliInstall note repeats the claim — flagged upstream |
| P13 | Real links with per-chapter `aria-label`, `aria-current="location"` on active | rail `469-472` | ✅ code-verified; live SR announcement pending gate run |
| P14 | Indicator: `role="progressbar"` + valuemin/max/now/valuetext, not clickable | rail `251-264`, `456-466` | ✅ code-verified |
| P15 | Reduced motion disables smooth scroll (`behavior: reducedMotion ? "instant" : "smooth"`) and springs/tooltip motion | rail `227-229`; demo shell `193-195`, `256-258` | ✅ code-verified in shipped file (shell durations correctly left behind) |
| P16 | Tooltips `aria-hidden` visual + `role="tooltip"`; screen readers use link labels; current section announced | rail `415-439`, `488-508`; article §05 | ✅ code-verified; live SR spot check pending gate run |
| P17 | Touch users use visible marks; no hover dependency | article §03; rail links are real `<a>` (tap navigates, no pointermove needed); device test pending gate run |
| P18 | Hydration gate `useSyncExternalStore`, static base styles first pass | rail `154-160`; manifest a11y block | ✅ verbatim; SSR prerender of our docs pages passes with no mismatch warnings |

## Lifecycle and robustness

| # | Behavior / claim | Citation | Status |
|---|---|---|---|
| P19 | Scroll/resize listeners with rAF + cleanup; viewport-height tracking | rail (resize effect, scroll effect with frame cancel + listener cleanup) | ✅ code-verified (both effects clean up; `cancelAnimationFrame` on unmount) |
| P20 | Late-loading content: observer list derives from props; dynamically added sections are not re-scanned | rail observed-items memo + scroll effect deps | ⚠️ documented limitation in gotchas; no MutationObserver by lab design |
| P21 | Small screens: fixed rail overlaps content; no responsive behavior in source | rail (fixed positioning) | ⚠️ documented in gotchas; mobile emulation pending gate run |
| P22 | VariantSelector + mode copy + Live badge (demo chrome) | demo shell (full file) | ✅ correctly left behind per manifest; our explorer covers every combination natively |

## Mistreated as inline-component concerns (brief traits)

- **(1) Mount point:** explorer mounts one rail; page-level sections carry the document. Resolved by the pageContent restructure.
- **(2) Side effects:** `history.pushState` fires inside docs pages — inherent to the demo, noted; exactly one rail mounts per page since the hero fix.
- **(3) Host contract:** ids, tabIndex, scroll margins, section heights — documented in Host requirements and demonstrated in page sections.
- **(4) Multi-part anatomy:** single file is correct here (manifest); math lib ships alongside with its own tab in Code.
- **(7) Demo constraints:** full-page demo route exists; hash/focus/Back testable there at the gate run.
- **(8) Failure modes:** resize handled; late content + small screens documented as limitations; route changes unaddressed (lab design).
- **(9) Testing:** automatable half done (34 unit tests, code verification); human half pending gate.
