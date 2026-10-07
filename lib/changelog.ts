export interface ChangelogRelease {
  date: string;
  title: string;
  items: string[];
}

// Constitution (PHASES.md): nothing is logged until the public v0.1.0
// release. Pre-release history lives in git. At release, collapse notes
// into one "v0.1.0 — initial release" line; log user-visible changes after.
export const changelog: ChangelogRelease[] = [
  {
    date: "2026-10-07",
    title: "v0.1.0 — initial release",
    items: [
      "Gallery of 12 entries across elements, components, patterns, and systems, with docs pages under /docs/*",
      "Temporal theme and proximity navigation installable via the shadcn CLI (URL and @harv namespace)",
      "Entry pages with preview, examples, API reference, and copy prompt; full-page demos for both systems",
      "Foundations, changelog, and about pages; light/dark themes",
    ],
  },
];
