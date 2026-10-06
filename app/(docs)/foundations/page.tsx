const tokens = [
  { name: "--bg / --fg", value: "paper ↔ ink (theme-aware)", swatch: "var(--fg)" },
  { name: "--surface / --surface-2", value: "raised surfaces", swatch: "var(--fg-muted)" },
  { name: "--border", value: "hairline", swatch: "var(--fg-faint)" },
  { name: "--radius-sm / md / lg", value: "6 / 10 / 14px", swatch: "var(--fg)" },
  { name: "--font-sans / --font-display", value: "Inter 4.1 Variable + Display", swatch: "var(--fg)" },
  { name: "--font-mono", value: "JetBrains Mono (source panels)", swatch: "var(--fg)" },
  { name: "motion", value: "120ms / 200ms, ease-out; off under reduced-motion", swatch: "var(--fg)" },
];

export default function Foundations() {
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold sm:text-4xl">Foundations</h1>
      <p className="mt-2 leading-relaxed" style={{ color: "var(--fg-muted)" }}>
        The tokens this site actually uses. Monotone, dark-first, Inter 4.1 — inherited from harv (personal site).
      </p>
      <ul className="mt-8 list-none space-y-3 p-0">
        {tokens.map((t) => (
          <li key={t.name} className="flex items-center gap-4 p-4" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)" }}>
            <span aria-hidden="true" className="inline-block size-8 shrink-0 rounded-md" style={{ background: t.swatch, border: "1px solid var(--border)" }} />
            <div>
              <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-mono)" }}>{t.name}</p>
              <p className="text-sm" style={{ color: "var(--fg-muted)" }}>{t.value}</p>
            </div>
          </li>
        ))}
      </ul>
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Type scale</h2>
        <div className="mt-4 space-y-2">
          <p style={{ fontSize: "2.5rem", lineHeight: 1.1 }}>Display 40</p>
          <p style={{ fontSize: "1.75rem" }}>Title 28</p>
          <p style={{ fontSize: "1.25rem" }}>Heading 20</p>
          <p style={{ fontSize: "1rem" }}>Body 16 — the archive explains why it exists, not just what it does.</p>
          <p style={{ fontSize: "0.8rem" }}>Small 13 · Caption 12</p>
        </div>
      </section>
    </div>
  );
}
