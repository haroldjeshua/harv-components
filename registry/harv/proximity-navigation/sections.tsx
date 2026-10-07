import { CHAPTERS } from "./chapters";

// Page-level demo content for the proximity entry. Rendered outside any
// card, like the lab article: long sections with detail/note paragraphs so
// the fixed rail has breathing room and a real document to track.
const BODY: Record<string, { detail: string; note: string }> = {
  "px-alpha": {
    detail: "A rail for long pages. It keeps the document's shape at the edge of the screen without taking up a column.",
    note: "Scroll, hover over the rail, or use one of its links.",
  },
  "px-beta": {
    detail: "Each mark belongs to a section. The current one grows darker and longer while the page moves underneath it.",
    note: "Move toward the rail and the nearest marks expand.",
  },
  "px-gamma": {
    detail: "Select a mark to move to its section. The address updates with that section's anchor.",
    note: "Jump to the last section, then press Back. The browser returns you to your previous place.",
  },
};

export function ProximityPageSections() {
  return (
    <div className="flex flex-col">
      {CHAPTERS.map((chapter, index) => (
        <section key={chapter.id} id={chapter.id} tabIndex={-1} className="flex min-h-[55dvh] scroll-mt-24 flex-col justify-center gap-5 border-t py-16 focus-visible:outline focus-visible:outline-2" style={{ borderColor: "var(--border)" }}>
          <p className="font-mono text-xs uppercase tabular-nums tracking-wide" style={{ color: "var(--fg-faint)" }}>
            0{index + 1} / {chapter.label}
          </p>
          <h3 className="max-w-xl text-balance text-base font-semibold leading-snug">
            {chapter.label}
          </h3>
          <p
            id={`${chapter.id}-detail`}
            tabIndex={-1}
            className="max-w-xl scroll-mt-32 text-base leading-relaxed"
            style={{ color: "var(--fg-muted)" }}
          >
            {BODY[chapter.id]?.detail}
          </p>
          <p
            id={`${chapter.id}-note`}
            tabIndex={-1}
            className="max-w-xl scroll-mt-32 text-sm leading-relaxed"
            style={{ color: "var(--fg-muted)" }}
          >
            {BODY[chapter.id]?.note}
          </p>
        </section>
      ))}
    </div>
  );
}
