# Handoff — harv.computer agent: flip REGISTRY_READY

Both systems below are live, install-tested (URL + `@harv` namespace), and
served from `https://components.harv.computer/r/`. Safe to flip the
`REGISTRY_READY` flags in the harv.computer repo.

## Install commands (verified with real `shadcn add` installs)

```sh
pnpm dlx shadcn@latest add https://components.harv.computer/r/temporal-theme.json
pnpm dlx shadcn@latest add https://components.harv.computer/r/proximity-navigation.json
```

Namespace form (needs `{ "registries": { "@harv": "https://components.harv.computer/r/{name}.json" } }`
in the consumer's `components.json`):

```sh
pnpm dlx shadcn@latest add @harv/temporal-theme
pnpm dlx shadcn@latest add @harv/proximity-navigation
```

## What each item contains

- `@harv/temporal-theme`: `lib/temporal-theme.ts` (pure resolver),
  `components/temporal-toggle.tsx` (fully controlled toggle),
  `components/temporal-theme.css` (six scoped classes + tint/atmosphere,
  reduced-motion query included). Runtime deps: `lucide-react`;
  registry dep: `popover` (pulled automatically). Peer contract, not code:
  the host keeps its own dark-mode mechanism (e.g. next-themes `.dark`).
- `@harv/proximity-navigation`: `components/proximity-rail.tsx` (rail) +
  `lib/proximity-math.ts` (tested pure logic the rail consumes). Runtime
  dep: `motion`. No stylesheet (Tailwind utilities only).

## Docs for adopters

- https://components.harv.computer/docs/temporal-theme (wire-up, phase table, demo)
- https://components.harv.computer/docs/proximity-navigation (explorer, host requirements)
- Full-page demos: `/demo/temporal-theme`, `/demo/proximity-navigation`

## Known upstream notes (yours to fix or keep)

- Lab 002 article + install note claim 40px link targets; measured link
  boxes are `rowHeight` tall (8–20px) on a 44px-wide track.
- The extraction manifests say `registry:css` for the stylesheet and
  mention an IntersectionObserver; the CLI rejects `registry:css` (shipped
  as `registry:component` beside the toggle) and the rail uses
  scroll-position checks.
