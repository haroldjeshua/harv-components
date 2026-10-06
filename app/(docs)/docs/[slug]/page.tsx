import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllEntries, getEntry, getSourceFile, getRegistryItem } from "@/lib/entries";
import { getEntryData } from "@/lib/entry-data";
import { highlightCode } from "@/lib/highlight";
import type { ApiRow } from "@/lib/entry-types";
import type { EntryPanelData } from "@/components/entry-panel";
import { EntryPanel, ExampleBlock } from "@/components/entry-panel";
import { Badge } from "@/registry/harv/badge/badge";
import { ThemeToggle } from "@/entries/theme-toggle/theme-toggle";
import { SourcePanelDemo } from "@/entries/source-panel/source-panel";
import { SpecimenTabsDemo } from "@/entries/specimen-tabs/specimen-tabs";
import { WorkGridDemo } from "@/entries/work-grid/work-grid";
import { LabIndexDemo } from "@/entries/lab-index/lab-index";
import { CraftMasonryDemo } from "@/entries/craft-masonry/craft-masonry";
import { MediaBentoDemo } from "@/entries/media-bento/media-bento";
import { MediaStripDemo } from "@/entries/media-strip/media-strip";

export function generateStaticParams() {
  return getAllEntries().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  return {
    title: entry ? `${entry.name} · harv components` : "Not found · harv components",
    description: entry?.description,
  };
}

function Preview({ slug }: { slug: string }) {
  // New-style entries render the EntryPanel (built from entry data below).
  // Legacy entries keep their hand-written previews until migrated.
  const data = getEntryData(slug);
  if (data) return null;
  if (slug === "theme-toggle") {
    return (
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <span className="text-sm" style={{ color: "var(--fg-muted)" }}>Toggles this site&apos;s theme.</span>
      </div>
    );
  }
  if (slug === "specimen-tabs") {
    const demoCode = `<SpecimenTabs sections={sections} />`;
    return (
      <SpecimenTabsDemo
        sections={[
          { id: "contained", label: "Contained", content: <p className="text-sm" style={{ color: "var(--fg-muted)" }}>Contained specimens would render here.</p>, code: demoCode, codeHtml: highlightCode(demoCode) },
          { id: "outline", label: "Outline", content: <p className="text-sm" style={{ color: "var(--fg-muted)" }}>Outline specimens would render here.</p> },
          { id: "sizes", label: "Sizes", content: <p className="text-sm" style={{ color: "var(--fg-muted)" }}>Size specimens would render here.</p> },
        ]}
      />
    );
  }
  if (slug === "work-grid") return <WorkGridDemo />;
  if (slug === "lab-index") return <LabIndexDemo />;
  if (slug === "craft-masonry") return <CraftMasonryDemo />;
  if (slug === "media-bento") return <MediaBentoDemo />;
  if (slug === "media-strip") return <MediaStripDemo />;
  return <SourcePanelDemo />;
}

export default async function EntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();
  const data = getEntryData(slug);

  const all = getAllEntries();
  const index = all.findIndex((e) => e.slug === slug);
  const prev = index > 0 ? all[index - 1] : undefined;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;

  const outline: [string, string][] = [["#preview", "Preview"]];
  if (data && data.examples.length > 0) outline.push(["#examples", "Examples"]);
  if (data && data.api.length > 0) outline.push(["#api", "API reference"]);
  if (data && data.changelog.length > 0) outline.push(["#changelog", "Changelog"]);

  // Panel data is derived server-side: install commands from the registry
  // item, code HTML highlighted at build time, prompt from the template.
  let panel: EntryPanelData | null = null;
  if (data) {
    const item = getRegistryItem(slug);
    const itemName = item?.name ?? slug;
    const depLines = [
      ...(item?.dependencies ?? []).map((d) => `pnpm add ${d}`),
      ...(item?.registryDependencies ?? []).map((d) => `pnpm dlx shadcn@latest add ${d}`),
    ];
    const installCommands = [
      `pnpm dlx shadcn@latest add https://components.harv.computer/r/${itemName}.json`,
      `pnpm dlx shadcn@latest add @harv/${itemName}`,
      ...depLines,
    ];
    const sourceCode = getSourceFile(data.sourceFile);
    const usageHtml = highlightCode(data.usage);
    const prompt = [
      `Add the "${entry.name}" ${entry.layer} to my project.`,
      ``,
      `What it is: ${entry.description}`,
      ``,
      `Install:`,
      ...installCommands,
      ``,
      `Usage:`,
      data.usage,
      ``,
      `Source (${data.sourceFile}):`,
      sourceCode,
      ``,
      `How it works:`,
      data.howItWorks,
      ``,
      `Constraints: use my existing design tokens/theme; keep dependencies to the list above; preserve accessibility behavior (keyboard, focus, reduced motion).`,
    ].join("\n");
    panel = {
      installCommands,
      installNote:
        "First command installs from this registry by URL. The @harv form needs { registries: { \"@harv\": \"https://components.harv.computer/r/{name}.json\" } } in components.json. Manual path: copy the file(s) below and install the listed dependencies.",
      usage: data.usage,
      usageHtml,
      files: [{ path: data.sourceFile, code: sourceCode, html: highlightCode(sourceCode) }],
      howItWorks: data.howItWorks,
      prompt,
    };
  }
  const Hero = data?.hero ?? data?.examples[0]?.Component;

  return (
    <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_12rem]">
      <article className="min-w-0">
      <Link href="/" className="text-sm hover:opacity-70">← Gallery</Link>
      <header className="mt-8 max-w-xl">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{entry.layer}</Badge>
          <Badge variant="outline">{entry.status}</Badge>
          {entry.tags.map((t) => (
            <Badge key={t} variant="outline">{t}</Badge>
          ))}
        </div>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{entry.name}</h1>
        <p className="mt-2 leading-relaxed" style={{ color: "var(--fg-muted)" }}>{entry.description}</p>
        <p className="mt-3 text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
          {entry.origin} · used in {entry.usedIn.join(", ")} · {entry.deps.length ? entry.deps.join(", ") : "no dependencies"}
        </p>
      </header>

      {panel && Hero ? (
        <>
          <section id="preview" aria-label="Live preview" className="mt-8 scroll-mt-20">
            <EntryPanel data={panel} hero={<Hero />} />
          </section>
          {data && data.examples.length > 0 && (
            <section id="examples" aria-label="Examples" className="mt-10 scroll-mt-20">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--fg-faint)" }}>Examples</h2>
              <div className="flex flex-col gap-4">
                {data.examples.map((ex) => {
                  const code = getSourceFile(ex.file);
                  return (
                    <ExampleBlock
                      key={ex.id}
                      title={ex.title}
                      preview={<ex.Component />}
                      code={code}
                      html={highlightCode(code)}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </>
      ) : (
        <section id="preview" aria-label="Live preview" className="mt-8 scroll-mt-20">
          <Preview slug={slug} />
        </section>
      )}

      {data && data.api.length > 0 && (
        <section id="api" aria-label="API reference" className="mt-10 scroll-mt-20">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--fg-faint)" }}>API reference</h2>
          <div className="overflow-x-auto" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--fg-faint)" }}>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.api.map((row: ApiRow, i: number) => (
                  <tr key={row.prop} className="align-top" style={i < data.api.length - 1 ? { borderBottom: "1px solid var(--border)" } : undefined}>
                    <td className="whitespace-nowrap px-4 py-2.5 font-medium" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{row.prop}</td>
                    <td className="px-4 py-2.5" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--fg-muted)" }}>{row.type}</td>
                    <td className="whitespace-nowrap px-4 py-2.5" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--fg-muted)" }}>{row.default}</td>
                    <td className="px-4 py-2.5" style={{ color: "var(--fg-muted)" }}>{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {data && data.changelog.length > 0 && (
        <section id="changelog" aria-label="Changelog" className="mt-10 scroll-mt-20">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--fg-faint)" }}>Changelog</h2>
          <div className="flex flex-col gap-5">
            {data.changelog.map((release) => (
              <div key={release.date}>
                <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
                  {release.date} — {release.title}
                </p>
                <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                  {release.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {release.breaking && (
                  <p className="mt-2 text-sm font-medium" style={{ color: "var(--fg)" }}>
                    Breaking: {release.breaking}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="mt-10 text-xs" style={{ color: "var(--fg-faint)" }}>
        Previews on this page render from the entry&apos;s own source file
        {data ? (
          <> — <span style={{ fontFamily: "var(--font-mono)" }}>{data.sourceFile}</span></>
        ) : (
          <> — <span style={{ fontFamily: "var(--font-mono)" }}>entries/{entry.slug}/{entry.slug}.tsx</span></>
        )}
        . No demo copies.
      </p>

      <nav aria-label="More entries" className="mt-8 flex items-center justify-between gap-4" style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
        <div className="min-w-0">
          {prev ? (
            <Link href={`/docs/${prev.slug}`} className="block no-underline hover:opacity-70" style={{ color: "inherit" }}>
              <span className="block text-xs" style={{ color: "var(--fg-faint)" }}>← Previous</span>
              <span className="block truncate text-sm font-semibold">{prev.name}</span>
            </Link>
          ) : <span />}
        </div>
        <div className="min-w-0 text-right">
          {next && (
            <Link href={`/docs/${next.slug}`} className="block no-underline hover:opacity-70" style={{ color: "inherit" }}>
              <span className="block text-xs" style={{ color: "var(--fg-faint)" }}>Next →</span>
              <span className="block truncate text-sm font-semibold">{next.name}</span>
            </Link>
          )}
        </div>
      </nav>
      </article>
      <aside className="hidden xl:block" aria-label="On this page">
        <nav className="sticky top-20 flex flex-col gap-0.5">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--fg-faint)" }}>
            On this page
          </p>
          {outline.map(([href, label]) => (
            <a key={href} href={href} className="block rounded-md px-3 py-1.5 text-sm no-underline hover:opacity-70" style={{ color: "var(--fg-muted)" }}>
              {label}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
}
