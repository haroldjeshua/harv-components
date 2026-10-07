# harv components

Small personal archive of elements, components, and patterns I actually use. Live at `components.harv.computer`.

## Run it

```sh
pnpm install
pnpm dev             # http://localhost:3000
pnpm typecheck       # tsc --noEmit
pnpm lint
pnpm registry:build  # derive cssVars into registry.json, then shadcn build → public/r/
pnpm build
```

Stack: pnpm · Next.js 16 · TypeScript (strict) · Tailwind v4 (tokens in `app/globals.css`) · Motion · sugar-high (build-time highlighting) · next-themes · lucide-react · shadcn (registry build only). No database.

## How to add an entry

Adding an entry means adding one folder, `registry/harv/<slug>/`:

1. `<slug>.tsx` — the component only. No docs exports; this file ships to installs.
2. `examples/*.example.tsx` — compiled examples. Each one default-exports a demo plus a named `meta` with `id` and `title`. Rendered live and shown as source.
3. `<slug>.entry.tsx` — meta validated against the entry schema, plus `usage`, `api` rows, `howItWorks`, `changelog`, and the examples list.
4. Register in `lib/entry-data.ts` with one line. Add the item to `registry.json` with `name`, `type`, `title`, `description`, and `files`. Never hand-type `cssVars`; the build derives them.
5. Run `pnpm typecheck && pnpm lint && pnpm registry:build && pnpm build`.

Earned-entries rule: only add it if you can name the project that needed it.

## Install entries elsewhere

```sh
pnpm dlx shadcn@latest add https://components.harv.computer/r/<name>.json
pnpm dlx shadcn@latest add @harv/<name>   # needs the @harv template in components.json, see About
```

## Deploy

Point a Vercel project at this repo. No env vars. Connect `components.harv.computer` in the Vercel dashboard.

## License

MIT © 2026 Harold Varde. See `LICENSE`. Installing an entry into your own project counts as reuse under those terms. Keep the copyright notice with the code.

Typefaces ship under their own terms. Inter 4.1 in `public/fonts/` is © The Inter Project Authors, licensed under the SIL Open Font License 1.1. See `public/fonts/Inter-4.1/OFL.txt`.
