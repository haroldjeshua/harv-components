import type { ProximityChapter } from "./proximity-rail";

// Shared chapter data for the proximity entry's explorer and page sections.
// Kept in a directive-free module so both server and client files import
// the identical list with no module-boundary surprises.
export const CHAPTERS: ProximityChapter[] = [
  { id: "px-alpha", label: "Alpha" },
  { id: "px-beta", label: "Beta" },
  { id: "px-gamma", label: "Gamma" },
];
