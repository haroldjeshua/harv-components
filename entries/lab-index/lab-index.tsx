import { Badge } from "@/registry/harv/badge/badge";

// Lab index: workbench feature cards + archive grid + "next up" placeholder.
// Compiled from harv's /labs (workbench + archive); rewritten monotone.
export interface LabItem {
  id: string;
  title: string;
  category: string;
  description: string;
  year?: string;
}

export function LabIndex({ workbench, archive }: { workbench: LabItem[]; archive: LabItem[] }) {
  return (
    <div className="flex flex-col gap-8">
      <section aria-label="On the workbench">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workbench.map((item) => (
            <article key={item.id} className="flex flex-col gap-2 p-4" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)" }}>
              <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>{item.id} / {item.category}</p>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>{item.description}</p>
            </article>
          ))}
          <article className="flex min-h-40 flex-col items-center justify-center gap-2 p-4 text-center" style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius-md)", color: "var(--fg-faint)" }}>
            <p className="text-sm">More on the workbench — the next experiment is still taking shape.</p>
          </article>
        </div>
      </section>
      <section aria-label="Experiment archive">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {archive.map((item) => (
            <article key={item.id} className="relative flex flex-col gap-1 p-3" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)" }}>
              {item.year && <Badge variant="secondary" className="absolute right-2 top-2">{item.year}</Badge>}
              <h3 className="text-sm font-medium">{item.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function LabIndexDemo() {
  return (
    <LabIndex
      workbench={[
        { id: "001", title: "Temporal theme", category: "theming", description: "A theme that follows the time of day." },
        { id: "002", title: "Proximity nav", category: "navigation", description: "Navigation that reacts to pointer distance." },
      ]}
      archive={[
        { id: "a1", title: "Lifepatch slider", category: "input", description: "A slider study.", year: "2024" },
        { id: "a2", title: "Code block", category: "display", description: "A code display study.", year: "2024" },
        { id: "a3", title: "Draggable", category: "interaction", description: "A drag study.", year: "2023" },
      ]}
    />
  );
}
