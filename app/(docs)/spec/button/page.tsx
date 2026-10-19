import type { Metadata } from "next";
import Link from "next/link";
import { Exploded } from "@/components/exploded/react/Exploded";
import { Button } from "@/registry/harv/button/button";

export const metadata: Metadata = {
  title: "Button spec · harv components",
  description:
    "Experimental exploded spec sheet for the Button entry (exploded-skill pilot).",
};

// Pilot sheet for the exploded skill (branch experimental-exploded).
// One figure per variant, same camera and size so they compare; each
// figure exercises a different layer kind: contained, stroke, tonal,
// elevation. The figures read the live components' own paint.
const FIGURES = [
  {
    fig: 1,
    title: "Button · primary",
    note: "Contained default. Surface + content + focus ring.",
    states: "pressable" as const,
    button: <Button>Deploy</Button>,
  },
  {
    fig: 2,
    title: "Button · outline",
    note: "Transparent fill, real border. Split every stroke onto its own sheet.",
    states: "pressable" as const,
    splitStroke: "all" as const,
    button: <Button variant="outline">Deploy</Button>,
  },
  {
    fig: 3,
    title: "Button · modern, danger",
    note: "Tonal fill from color-mix; tone rides --tone-bg so T mode shows the token.",
    states: "pressable" as const,
    button: (
      <Button variant="modern" tone="danger">
        Delete
      </Button>
    ),
  },
  {
    fig: 4,
    title: "Button · raised",
    note: "Box-shadow elevation gets its own sheet above the surface.",
    states: "pressable" as const,
    button: <Button variant="raised">Deploy</Button>,
  },
];

export default function ButtonSpecPage() {
  return (
    <div>
      <Link href="/docs/button" className="text-sm hover:opacity-70">
        ← Button entry
      </Link>
      <header className="mt-8 max-w-xl">
        <h1 className="text-3xl font-semibold sm:text-4xl">Button spec</h1>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--fg-muted)" }}
        >
          Experimental exploded figures (pilot sheet). Hover to open the
          stack, hover a layer for redlines, keys 1–9 switch states, T shows
          tokens. Each live button beside its figure drives it.
        </p>
      </header>
      {FIGURES.map((f) => (
        <section key={f.fig} aria-label={f.title} className="mt-10">
          <p
            className="mb-2 text-sm"
            style={{ color: "var(--fg-muted)" }}
          >
            {f.note}
          </p>
          <Exploded
            fig={f.fig}
            title={f.title}
            states={f.states}
            splitStroke={f.splitStroke}
            theme="dark"
          >
            {f.button}
          </Exploded>
        </section>
      ))}
    </div>
  );
}
