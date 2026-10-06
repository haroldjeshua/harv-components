# harv components — Philosophy

> Why this project exists, what it believes, and how to decide when the brief doesn't cover something.
> Read alongside `PROJECT.md` (what) and `PHASES.md` (when).

---

## 1. The core belief

**A personal archive compounds. A product has to be complete.**

OEI and Integrity UI both tried to be products: they needed breadth before they were credible. harv components only has to be *useful to me at 5 entries*. Every decision below follows from that difference.

My Figma file already proves it. A past frame, reused, made a recent landing page fast and easy. This project is the same effect for code.

## 2. Principles

### 2.1 Earned entries only
An entry exists because I used it in a real project or on my site, not because it might be useful.
- **Why:** speculative components are how OEI got too big to start. Used components are already tested against reality.
- **Test:** *Can I name the project that needed this?* If not, it waits.

### 2.2 Small and finished beats large and planned
Ship at roughly 8–12 entries. Launch is never blocked on completeness.
- **Why:** an abandoned large library is worth less than a deployed small one.
- **Test:** *If I stopped today, would the site still be useful and live?*

### 2.3 Live, not mocked
Every entry renders the actual component from the actual source. No screenshots standing in for behavior, no separate demo code that can drift.
- **Why:** an archive I can't trust is an archive I won't use.
- **Test:** *Is the preview importing the same file that the "source" panel shows?*

### 2.4 Design and code are twins
Each entry links to its Figma counterpart where one exists. Tokens come from one source and are mirrored in both places.
- **Why:** my design process and my code process should reinforce each other, not diverge.
- **Test:** *If I change a token, can I tell what changes in both Figma and code?*

### 2.5 Provenance is a feature
Each entry records where it came from and where it's been used.
- **Why:** context is what turns a snippet into knowledge. "Used in X, made for Y" tells me when to reach for it.
- **Test:** *Does the entry explain why it exists, not just what it does?*

### 2.6 Copyable by default
Source is one click away. Dependencies are minimal and justified.
- **Why:** the point is reuse. Friction kills reuse.
- **Test:** *Could I paste this into a new project in under a minute?*

### 2.7 Understand before implementing
No vibe-coded entries. I should be able to explain how each one works. AI agents assist; they don't author what I can't explain.
- **Why:** deliberate, phased building is my practice. An archive of things I don't understand is a liability.
- **Test:** *Can I explain the tricky part of this without reading it?*

### 2.8 Personal voice
It should look and feel like my work, not a generic docs template. Humble entries (a button, a label, an input) belong next to ambitious ones.
- **Why:** this is a reflection of how I design, and it's what separates an archive from a catalog.
- **Test:** *Would this site be recognizable as mine with the logo removed?*

## 3. Relationship to what came before

| Source | What it taught me | What I carry | What I leave |
|---|---|---|---|
| **OEI** | Ambition without scope doesn't ship | Layers, dark-first feel, theme toggle | The block/template library ambition (for now) |
| **Integrity UI** | A real system has principles, tokens, and shared vocabulary | The structure of foundations and naming | Corporate framing, branding, any code I don't own |
| **Bencho** (inspiration only) | Live, interactive entries make a library feel alive | The standard of craft and the "live, not mocked" bar | Their structure, naming, interactions, and styling |

**On inspiration vs. copying:** I may learn *why* something works. I may not reproduce *what* it is. If I can't explain how my version differs in purpose and structure, it isn't ready.

## 4. Decision rules

When something isn't covered, apply these in order:

1. **Does it serve my own next project?** If no, defer it.
2. **Is it smaller?** Choose the smaller option that works.
3. **Does it ship sooner?** Prefer the path that gets something live.
4. **Can I understand and explain it?** If no, simplify or learn first.
5. **Does it keep design and code aligned?** Prefer the option that does.
6. **Is it reversible?** Prefer choices that are cheap to change later.

## 5. Anti-patterns

- Adding a component "while I'm here" with no project behind it
- Building the site shell more elaborately than the entries it holds
- Creating a taxonomy before there are enough entries to need it
- Mirroring another library's structure because it looks polished
- Adding dependencies for effects I could write in a few lines
- Treating the site as the product instead of the archive
- Starting phase N+1 before phase N's exit criteria are met
- Letting Figma and code tokens drift apart "temporarily"
- Reusing Integrity UI code or branding without confirming I'm free to

## 6. Tone and visual direction

- **Restrained.** Typography and spacing do the work; chrome stays quiet.
- **Dark-first**, with a light theme that is equally considered.
- **Specimen-like.** Entries are shown the way a type specimen shows a face: clean, labeled, in context.
- **Honest.** Notes say what an entry is bad at, not just what it's good at.
- **Open question:** whether this inherits OEI's look or takes its own (see `PROJECT.md` §12). Decide in Phase 0, then hold it.

## 7. What "done" feels like

Not "the library is complete." It never will be.

Done is: I start a new project, open this site first, find something I already built, and move on. Then, afterward, I add the new thing I made. That loop is the project.
