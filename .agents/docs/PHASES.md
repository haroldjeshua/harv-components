# harv components — Phases

> Build order, exit criteria, and guardrails. Do phases in order. Do not build ahead.
> See `PROJECT.md` for scope and `PHILOSOPHY.md` for decision rules.

**Stack:** pnpm · Next.js 16 · TypeScript (strict) · Tailwind v4 · Motion · static content (typed entry files under `registry/harv/`) · Vercel

**Sizing:** S = a sitting, M = a few sittings, L = a week or more of part-time work. Sizes are relative, not deadlines.

---

## Phase 0: Foundation `[M]`

**Goal:** an empty-but-deployed site with the architecture in place.

### Tasks
- [ ] Create repo `haroldjeshua/harv-components`; add `PROJECT.md`, `PHILOSOPHY.md`, `PHASES.md`
- [ ] Scaffold Next.js 15 + TypeScript strict + Tailwind v4 with pnpm
- [ ] Deploy to Vercel; point `components.harv.computer` at it
- [ ] **Decide visual direction** (inherit OEI's dark minimal look, or new) and write it down
- [ ] Define tokens in Tailwind v4 `@theme`: color, type, spacing, radius, motion
- [ ] Light/dark theme with toggle; explicit backgrounds in both
- [ ] Define the entry schema (frontmatter from `PROJECT.md` §7) and a loader that validates it
- [ ] Build the shell: header, gallery grid, entry page template
- [ ] Add one placeholder entry to prove the pipeline end to end

### Exit criteria
- Site is live at the real domain
- One entry renders live preview, source, and metadata from a single file
- Adding an entry means adding one file, nothing else

### Guardrails
- Timebox the shell. It stays plain; entries are the point.
- No search, filters, or foundations page yet.

---

## Phase 1: Seed `[L]`

**Goal:** a launchable archive of real entries.

### Tasks
- [ ] Audit the personal site and recent projects; list candidates
- [ ] Select 8–12 that pass the *earned entries* test (name the project that needed each)
- [ ] Aim for a mix: a few **elements**, several **components**, 1–2 **patterns**
- [ ] Extract each into a clean, self-contained component with minimal dependencies
- [ ] For each: live preview, variants/states, source, short usage note
- [ ] Write the "why I made this / when I reach for it" note for each
- [ ] Verify each preview imports the same source it displays

### Exit criteria
- 8–12 entries live
- Every entry traceable to a real project
- I can explain how each one works

### Guardrails
- No new components invented for the gallery.
- If an extraction drags in half the project, shrink it or skip it.
- Do not mirror any other library's index structure or entry set.

---

## Phase 2: Twins and Provenance `[M]`

**Goal:** every entry connects design ↔ code and says where it came from.

### Tasks
- [ ] Add Figma links for entries that have a frame or component
- [ ] Fill `origin` and `usedIn` for every entry
- [ ] Build the **Foundations** page: tokens, type scale, color, motion, principles
- [ ] Mirror tokens into Figma variables (manual is fine; note the process)
- [ ] Show provenance on the entry page and in the gallery tiles
- [ ] Add `status` (draft / stable) and display it

### Exit criteria
- Tokens have one source of truth; Figma matches
- No entry lacks `origin`
- Foundations page reflects what the code actually uses

### Guardrails
- Pull that system's *ideas* (principles, tokens, shared vocabulary), not its code or branding.
- If tokens drift between Figma and code, fix it before moving on.

---

## Phase 3: Polish and Ship `[M]`

**Goal:** public launch of a small, finished thing.

### Tasks
- [ ] Gallery filter by layer and tag; simple search
- [ ] Changelog page
- [ ] About page: what this is, how I use it
- [ ] OG image and metadata
- [ ] Accessibility pass: keyboard, focus, contrast, reduced motion
- [ ] Performance pass: live previews shouldn't tank the gallery
- [ ] Decide OEI's fate: archive, and optionally redirect `oei.vercel.app`
- [ ] Decide source license and add it
- [ ] Leave that system online as historical reference
- [ ] Quiet public announcement

### Exit criteria
- Deployed, polished, accessible
- Adding a new entry takes minutes
- I use it on the next real project, then add what I build

### Guardrails
- Don't postpone launch for "one more entry."
- Filters and search should be as simple as the entry count warrants.

---

## Phase 4: Registry + stretch `[optional]`

> Amendment (registry-first): the registry is no longer stretch — it is the
> standard every entry page is built to. Status:
> - [x] `registry.json` + `registry:build` serving `public/r/*.json` with derived per-item `cssVars`
> - [x] Button reference implementation, verified with real installs (URL + `@harv` namespace)
> - [ ] Remaining entries migrate one at a time (badge next)
> - [ ] A `block` layer for larger compositions (the original OEI ambition)

Only after Phase 3 is live and I've used the archive on at least one new project.

- [ ] Templates and UX flows (from that system's patterns/flows idea)
- [ ] Filipino/civic patterns as a collection or tag (resolve `PROJECT.md` §12 Q3)
- [ ] Revisit whether OEI's name returns for a registry layer

Each item needs its own mini-brief and must still pass *earned entries*.

---

## Ongoing loop (after launch)

> Changelog constitution: nothing below is logged until the public v0.1.0
> release. Pre-release history lives in git, not in the changelog pages.
> At release, collapse each entry's pre-release notes into one
> "v0.1.0 — initial release" line; from then on, log user-visible changes
> (and any breaking change with its migration) as they ship. No versions
> are stamped before v0.1.0 exists on GitHub.

1. Start a new project; check the archive first
2. Build what's missing
3. If it was reused or likely to be, extract and add it
4. Update `usedIn`, changelog, and Figma link
5. Deprecate stale entries rather than deleting them

---

## Open decisions and where they get resolved

| Question | Resolve in |
|---|---|
| Visual direction (inherit OEI or new) | Phase 0 |
| Figma ↔ code token sync approach | Phase 2 |
| Filipino/civic angle as tag, collection, or section | Phase 2 or 4 |
| Source license | Phase 3 |
| Fate of the OEI name | Phase 3 or 4 |

---

## Instructions for AI coding agents

- Work one phase at a time; confirm exit criteria before starting the next.
- Don't create entries that aren't specified; entries come from my real work.
- Keep dependencies minimal and justify any addition.
- Strict TypeScript; tokens via Tailwind v4 `@theme`; no hard-coded colors outside tokens.
- If a task seems to need something from a later phase, stop and ask.
- Never imitate bencho.dev's layout, copy, naming, or interactions.
- Never import code or branding from a design system I worked on years ago without my explicit approval.
