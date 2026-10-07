// Panel hero: a static marks graphic. Deliberately NOT the rail — mounting
// the fixed, listening component twice (panel + examples) rendered two
// rails. This draws the same visual language with plain spans.
export function ProximityHero() {
  return (
    <div className="flex flex-col items-end gap-1.5" aria-hidden="true">
      <span className="block h-0.5 w-11 rounded-full" style={{ background: "var(--fg)", opacity: 1 }} />
      <span className="block h-0.5 w-6 rounded-full" style={{ background: "var(--fg)", opacity: 0.6 }} />
      <span className="block h-0.5 w-8 rounded-full" style={{ background: "var(--fg)", opacity: 0.45 }} />
      <span className="block h-0.5 w-4 rounded-full" style={{ background: "var(--fg)", opacity: 0.35 }} />
      <span className="block h-0.5 w-6 rounded-full" style={{ background: "var(--fg)", opacity: 0.35 }} />
    </div>
  );
}
