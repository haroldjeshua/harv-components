import * as React from "react";

// Work index: folder-like category tiles that lift on hover.
// Compiled from harv's /work grid; rewritten monotone, icon-agnostic (slots).
export interface WorkCategory {
  id: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

export function WorkGrid({ categories }: { categories: WorkCategory[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {categories.map((c) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          className="group flex flex-col items-center justify-center rounded-xl p-6 text-center no-underline"
          style={{ color: "inherit", border: "1px solid var(--border)", background: "var(--surface)" }}
        >
          <span
            aria-hidden="true"
            className="flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1.5 group-hover:rotate-6 motion-reduce:transition-none motion-reduce:transform-none"
            style={{ width: "4rem", height: "4rem", border: "1px dashed var(--border)", borderRadius: "var(--radius-md)", color: "var(--fg-muted)" }}
          >
            {c.icon ?? "▤"}
          </span>
          <span className="mt-3 text-sm font-semibold">{c.label}</span>
          <span className="mt-1 text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>{c.description}</span>
        </a>
      ))}
    </div>
  );
}

export function WorkGridDemo() {
  return (
    <WorkGrid
      categories={[
        { id: "projects", label: "Projects", description: "Websites, web apps, anything tec." },
        { id: "labs", label: "Labs", description: "Experiments, demos, sandboxes." },
        { id: "crafts", label: "Crafts", description: "Visual concepts and iconography." },
      ]}
    />
  );
}
