# harv components — Project Brief

> `components.harv.computer` · `github.com/haroldjeshua/harv-components`
> Status: idea stage (no repo yet) · Owner: Harv

---

## 1. One-line definition

A small, deployed, personal archive of the elements, components, and patterns I actually use, built in code and paired with their Figma counterparts, so every new project starts from my own references instead of from zero.

## 2. Why this exists

- My personal Figma file already works as an archive: a recent landing page design went fast because earlier frames and components were there to pull from.
- The code side has no equivalent. Components live scattered across my personal site and past projects.
- I want the same compounding effect in code: **design once, retrieve forever.**
- The audience is me first. Anyone else who benefits is a bonus, not a requirement.

## 3. Decision: which path

| Path | What it is | Verdict |
|---|---|---|
| **A. harv components** | Small personal archive, deployed | **Chosen.** Viable scope, ships, solves a real recurring need |
| B. OEI | Large shadcn-registry-style block library | Parked. Needs a scale of components, docs, and maintenance I can't commit to now. Only the homepage exists ("Currently building...") |
| C. Integrity UI revival | Full design system from a previous company | Not revived as a product. Mined for ideas (see §6) |

**Why A wins:** it is the only option where "done and deployed" is realistic. OEI and Integrity UI both fail the same test: they are *products* that need completeness to be credible, while an *archive* is useful at 5 entries.

**What happens to the other two**
- **OEI:** archive the project. Its taxonomy and "extensive" ambition are absorbed here (§6). The name/domain can be reused later if a public registry layer ever earns its place. Optionally redirect `oei.vercel.app` to the new site once live.
- **Integrity UI:** leave online as a historical reference. Do not continue it as a standalone system. Rebuild the good ideas fresh here.

> **Ownership check (important):** Integrity UI was made for a previous company and carries IntegrityNet branding. Before reusing any actual code, assets, or copy, confirm I'm free to. Safest approach: reuse the *ideas and structure*, rewrite everything from scratch, drop all company branding and wording.

## 4. Principles (PHILOSOPHY)

1. **Earned entries only.** A component is added only after it's been used in a real project or the personal site. No speculative components.
2. **Small and finished beats large and planned.** Ship at 8–12 entries. Never block launch on completeness.
3. **Live, not mocked.** Every entry is a real, interactive component rendered from the actual source.
4. **Design ↔ code twins.** Each entry links to its Figma frame/component where one exists.
5. **Provenance matters.** Each entry records where it came from and where I've used it.
6. **Copyable by default.** Source is one click away; dependencies are minimal.
7. **Understand before implementing.** No vibe-coded entries; I should be able to explain every one.
8. **Personal voice.** It should look and feel like my work, not a generic docs template.

## 5. Scope

### In scope (v1)
- A gallery of live entries across three layers: **elements → components → patterns**
- Per-entry page: live preview, source, notes, props/variants, "used in", Figma link
- Foundations page: tokens (color, type, spacing, radius, motion) and design principles
- Light/dark theme (OEI already toggles; keep it)
- Search/filter by layer and tag
- Deployed on `components.harv.computer`

### Explicitly out of scope (v1)
- npm package publishing
- Accounts, comments, analytics dashboards
- Docs for other people's use cases
- Large blocks, full templates, or a 50+ entry catalog
- Maintaining a public API/versioning promise

### Stretch (only after v1 ships)
- shadcn-compatible registry JSON so entries install via CLI
- A `blocks` / `templates` layer (the OEI ambition)
- Entries contributed from civic-tech work (e.g. Filipino-context patterns)

## 6. Ideas ingested from OEI, Integrity UI, and Bencho

### From OEI (what I built: oei.vercel.app)
- **Taxonomy ambition.** The OEI homepage lists: extensive components, animated, decorative, blocks, templates, utilities, tools, resources, design guide. Too many for v1, so collapse into a shortlist:
  - Layers: `element` · `component` · `pattern`
  - Tags: `animated` · `decorative` · `utility`
  - Later: `block` · `template`
- **"Resources" and "design guide"** become the Foundations page.
- **Visual identity cues** worth keeping: dark-first (`#101010`), minimal chrome, ✲ mark, theme toggle, restrained typographic homepage.

### From Integrity UI (what I built: integrity-ui.netlify.app)
- **Information architecture:** What's New · Design · Components · Docs. Reuse as: Changelog · Foundations · Gallery · About/Usage.
- **Contents of a real design system**, reduced to what a solo archive needs:
  - Design principles → my §4
  - Design tokens → Foundations page, single source of truth
  - UI patterns → the `pattern` layer
  - UX guidelines / templates and flows → stretch
- **"Shared vocabulary" and "useful reference"** as the core benefits: naming consistency inside my own work.
- **"Visual language is part of development standards"**: tokens drive both Figma and code so the twins don't drift.
- **Leave behind:** corporate framing, IntegrityNet branding, benefit-list marketing copy.

### From Bencho (bencho.dev): inspiration, not imitation
What Bencho does well, as a lesson:
- Entries are **live and interactive**, not screenshots.
- The index is scannable at a glance: one tile per entry, immediate feel.
- Strong sense of craft in micro-interactions.
- Adjacent sections (sounds, finds, bench) give the site a personality beyond a component list.

What I will **not** copy:
- Their index structure (labeling every entry by gesture: Press, Hover, Drag...)
- Their section set (Blocks / Sounds / Finds / Bench)
- Their entry names, interaction ideas, or visual styling
- A collection built mainly from showpiece micro-interactions

**How mine is different (my angle):**
| Bencho | harv components |
|---|---|
| Showcase of interaction craft | Working archive of what I actually reuse |
| Organized by gesture | Organized by **layer** (element/component/pattern) and **provenance** (which project it came from) |
| Standalone React blocks | Code + **Figma twin** per entry |
| General audience | Me first; Filipino/civic context as a natural strength |
| Polished showpieces | Includes humble, unglamorous elements (buttons, inputs, labels) if I reuse them |

## 7. Information architecture

```
/                    Gallery (filter by layer / tag)
/docs/[slug]        Entry page (registry source at registry/harv/[slug]/)
/foundations         Tokens, type, color, motion, principles
/changelog           What's new (from Integrity's "What's New")
/about               What this is, how I use it
```

### Entry anatomy
Each entry is a folder, `registry/harv/[slug]/`, containing the component source (`[slug].tsx`, which exports only the component), compiled examples (`*.example.tsx`, rendered live and shown as source so docs can't rot), and `[slug].entry.tsx` (meta, usage, api, howItWorks, changelog). Page sections and registry `cssVars` derive from these files; nothing is retyped.

Entry page sections: header → entry panel (Install / Usage / Code / How it works + copy prompt) → examples → API reference → provenance → changelog → prev/next.

Legacy frontmatter fields (kept, now validated in the entry file):

```yaml
slug: string
name: string
layer: element | component | pattern
tags: [animated | decorative | utility | ...]
status: draft | stable
origin: where it first appeared   # provenance
usedIn: [project names]
figma: url | null
deps: [package names]             # keep tiny
added: date
```

> Amendment (registry-first): Figma links are background context only and are
> not shown on the site. Provenance is a one-line `origin · used in` note.

## 8. Tech stack

Matches my existing standard so there's nothing new to learn:
- pnpm · Next.js 16 · TypeScript (strict) · Tailwind v4 · Motion
- MDX or typed content files for entries (no database; this is a static archive)
- Deployed on Vercel at `components.harv.computer`
- Tokens defined once (CSS variables in Tailwind v4 `@theme`) and mirrored to Figma variables

Not needed for v1: Drizzle, Neon, TanStack Query.

## 9. Phases (PHASES)

**Phase 0: Foundation**
- Create repo, set up Next.js, configure domain
- Establish tokens and base theme (dark-first, toggle)
- Build shell: header, gallery grid, entry page template
- Exit: empty-but-deployed site with one placeholder entry

**Phase 1: Seed**
- Pull 8–12 entries from the personal site and recent projects
- Mix of layers: a few elements, several components, 1–2 patterns
- Exit: launchable archive

**Phase 2: Twins and provenance**
- Add Figma links, `origin`, `usedIn` to every entry
- Foundations page with tokens and principles
- Exit: each entry is traceable both ways (design ↔ code)

**Phase 3: Polish and ship**
- Search/filter, changelog, about page, OG images
- Redirect or archive OEI; decide Integrity UI's fate (leave as-is)
- Exit: public launch, announce quietly

**Phase 4 (stretch, optional):** blocks layer.

> Amendment (registry-first): the shadcn-compatible registry was pulled forward
> out of stretch — the registry *is* the standard. Button is the reference
> implementation, verified with real `shadcn add` installs (URL + `@harv`
> namespace). Remaining entries migrate one at a time.

## 10. Success criteria

- Deployed at `components.harv.computer`
- 8–12 real entries, each used in a real project
- On the next new project, I reach for this archive before starting a component from scratch
- Adding a new entry takes minutes, not an afternoon
- Figma and code visibly agree on tokens

## 11. Risks and guardrails

| Risk | Guardrail |
|---|---|
| Scope creeps back toward OEI-size ambition | Earned-entries rule; v1 capped at ~12 |
| Spending time on the site instead of the components | Phase 0 is timeboxed; shell stays plain |
| Looks like a Bencho clone | Layer/provenance IA, Figma twins, own visual identity |
| Reusing company IP from Integrity UI | Rewrite, don't copy; remove branding; confirm rights |
| Entries rot as projects evolve | `status` field and changelog; deprecate rather than delete |
| Abandonment like OEI | Small scope, deployed early, useful to me even unfinished |

## 12. Open questions

1. Visual identity: stay in OEI's dark minimal direction, or take a distinct look from the personal site?
2. Figma ↔ code token sync: manual mirror or tooling later?
3. Should the Filipino/civic angle be a tag, a collection, or a separate section?
4. Do I keep the name "OEI" for the future registry layer, or retire it entirely?
5. Public license for source (MIT, or "look, don't ship")?

## 13. Notes for AI coding agents

- Follow the phases in order; don't build ahead.
- Do not add entries that haven't been specified; entries come from my real work.
- Keep dependencies minimal; justify any new package.
- Strict TypeScript; Tailwind v4 tokens via `@theme`; no hard-coded colors outside tokens.
- Do not mimic bencho.dev's layout, copy, naming, or interactions.
- Do not import code or branding from Integrity UI without my explicit go-ahead.
