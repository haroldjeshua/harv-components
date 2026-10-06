import { changelog } from "@/lib/changelog";

export default function ChangelogPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold sm:text-4xl">Changelog</h1>
      <p className="mt-2 leading-relaxed" style={{ color: "var(--fg-muted)" }}>
        What changed, newest first. Entries are deprecated here, never silently deleted.
      </p>
      <div className="mt-8 flex flex-col gap-8">
        {changelog.map((release) => (
          <section key={release.date} aria-label={`${release.date}: ${release.title}`}>
            <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              {release.date}
            </p>
            <h2 className="mt-1 text-xl font-semibold">{release.title}</h2>
            <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              {release.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
