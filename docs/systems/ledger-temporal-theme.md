# Behavior Ledger — Daylight Themes (Lab 003)

Source: `harv.computer` Lab 003 implementation + published article (`/labs/3`).
Files: `lib/temporal-theme.ts` (121), `components/labs/temporal-toggle.tsx` (117),
`components/labs/temporal-theme.css` (89), `components/labs/temporal-theme-demo.tsx` (563),
`components/labs/temporal-theme-lab.tsx` (207).
Current implementation: `registry/harv/temporal-theme/*` + `/docs/temporal-theme`.

Status key: ✅ matches · ⚠️ partial · ❌ missing · ❓ unknown.

## Resolver and schedule

| # | Behavior / claim | Citation | Status |
|---|---|---|---|
| D1 | Pure resolver: clock → phase, scheme (light/dark), temperature (warm/neutral/cool), atmosphere strength | `temporal-theme.ts:1-8`, `88-121` | ✅ shipped byte-identical; asserted in scratch (17:00→golden/light/warm/0.5) |
| D2 | Eight boundaries 05:30, 06:30, 09:00, 16:00, 17:30, 18:30, 19:30, 22:00 with published phase values (night dark/cool/0.10 … evening dark/neutral/0.15) | `temporal-theme.ts:40-67`; article phase table | ✅ values identical; 17:00/05:30/23:15 spot-checked |
| D3 | Boundary inclusivity: 05:29 night, 05:30 dawn; midnight wrap (pre-first-boundary uses final entry) | `temporal-theme.ts:98-111`; article table rows 00:00, 05:29, 05:30, 23:59 | ✅ logic identical; 05:29/05:30 verified in article table, wrap by code reading, not yet executed |
| D4 | Schedule tunable via `DEFAULT_SCHEDULE` + `PHASE_THEMES`; "Copy schedule" copies `describeDay()` JSON | `temporal-theme.ts:39-49`; demo `543-552` | ⚠️ resolver ships tunable and override tested; entry has no Copy-schedule button (deferred: entry Copy prompt covers adoption, schedule JSON stays a lab-page feature) |
| D5 | `phaseTheme()` and `describeDay()` public API | manifest API block; shipped source | ✅ shipped; both in the entry API table; describeDay JSON shown in usage context |
| D6 | Phase table rendered on server at fixed times (00:00 … 23:59, 12 rows incl. 12:00) | lab `42-55`, `136-158`; article "render it on the server at fixed times" | ✅ table renders in How it works, resolved server-side from the same 12 times |

## Runtime: time source and controls

| # | Behavior / claim | Citation | Status |
|---|---|---|---|
| D7 | Live mode follows the visitor clock; 30s tick + refresh on visibilitychange/window focus | demo `70-96` ("Live ticks are cheap… 30-second tick") | ✅ `use-temporal-theme.ts` mirrors tick + listeners + cleanup; stage defaults to live |
| D8 | Simulate mode scrubs 0–1439 minutes via slider; everything follows | demo `220-247` (`LifepatchSlider`, `resync()` on change) | ✅ stage scrubs via native range input (documented deviation, no slider dep); `resync()` mirrored |
| D9 | Manual scheme/temperature are offsets on top of the clock; "from day" provenance tags per control; scrubbing re-syncs everything to the clock | demo `104-115` (`resync`), `249-316`; article "Temperature is your own adjustment… Scrub to a new hour and everything follows again" | ✅ flags + tags + resync on mode change and scrub mirrored in stage |
| D10 | Dynamic pill follows the clock; any manual touch hands control back | take-home dynamic effect + toggle wiring | ✅ toggle example exercises the full loop (follow → manual → follow again); site-wide application lands with the demo route |
| D11 | Clock readout `aria-live="polite"` with `HH:MM · phase (· adjusted)` | demo `129-133` | ✅ mirrored in stage header |
| D12 | Toggle wires to "either tier" | Take-home install step 3, demo `530-535` | ❓ UNKNOWN: what are the two tiers? (control-panel tier vs take-home toggle tier? scheme tier vs temperature tier?) |
| D13 | First paint: no wrong-theme flash, no hydration warnings | lab renders table server-side; demo is `"use client"` with `useState(new Date())` | ⚠️ approach chosen, awaiting gate run: server + first client render share a deterministic noon fallback (`use-temporal-theme.ts`), live clock swaps in on mount. No blocking script. Lab's own minute-mismatch risk documented, not inherited |

## Surface, scoping, integration

| # | Behavior / claim | Citation | Status |
|---|---|---|---|
| D14 | Six scoped classes under `.temporal-scope`; neutral light rides the base (no suffix class) | `temporal-theme.css:8-59`; manifest CSS contract | ✅ CSS verbatim; scopeClass rule documented in Usage snippet + Host requirements; phase table on entry page renders all 12 article rows server-side |
| D15 | Tint/atmosphere layers `pointer-events: none` + `aria-hidden`; inline `--temporal-atmosphere` 0→1 | css `61-81`; usage snippet demo `338-352` | ✅ in CSS and mirrored in stage + demo route |
| D16 | Scoped demo: window wears the phase theme, site theme untouched | article "This window wears the phase theme…" | ✅ stage surface is scoped; entry CSS import is the documented leak (example file, code-shown). Full containment story lands with the demo route (no docs chrome) |
| D17 | Stays on next-themes `.dark`; writes no documentElement classes, reads no theme context | Take-home step 0 (demo `507-514`); manifest peer contract | ✅ install step 0 + host requirement state it; install test ran in a project with next-themes present, surface independent of provider |
| D18 | `prefers-reduced-motion`: 500–600ms transitions drop to none | css `83-89` | ✅ verbatim in shipped CSS |
| D19 | Take-home install steps (0 keep switch, 1 tone, 2 daylight, 3 control) + Copy prompt | demo `331-336`, `506-537`, `553-560` | ✅ 4 steps adapted into Install (tier wording kept from lab); lab's exact prompt text stays lab-side, entry prompt generated from entry data |
| D20 | Credits: Mindless (split scheme/temperature origin), Chloe Yan (time-based color concept) | article footnotes 1–2; lab `170-201` | ✅ Credits section with both URLs |

## Mistreated as inline-component concerns (brief traits)

- **(2) Side effects:** none in resolver/toggle themselves — correctly side-effect-free. But the *demo requirements* (interval, visibility/focus listeners with cleanup, demo `85-96`, `372-382`) were dropped instead of specified.
- **(3) Host contract:** next-themes `.dark` noted in prose only; the `scopeClass` neutral rule (the actual integration logic) not shipped or shown.
- **(5) Configuration:** schedule tunability + Copy schedule missing; `DEFAULT_SCHEDULE` override path undocumented.
- **(6) Install as integration:** reduced to CLI command; the 4-step wire-up (tiers!) missing.
- **(7) Demo constraints:** inline card, no stage, no full-page demo; CSS import leaks globally into docs.
- **(9) Testing:** no runner, no tests; lab's 19-row test file exists as reference only and was never executed.
