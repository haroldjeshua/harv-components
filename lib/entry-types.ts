import type { ComponentType } from "react";
import type { EntryMeta } from "./entry-schema";

export interface ApiRow {
  prop: string;
  type: string;
  default: string;
  description: string;
}

export interface EntryExample {
  id: string;
  title: string;
  /** Small mono caption shown under the title in the block header. */
  caption?: string;
  Component: ComponentType;
  /** Repo-relative path, read at build time for the Code view. */
  file: string;
}

export interface EntryChangelogItem {
  date: string;
  title: string;
  items: string[];
  breaking?: string;
}

export interface EntryAnatomyPart {
  part: string;
  mounts: string;
}

export interface EntryCredit {
  name: string;
  href: string;
  note: string;
}

/** Everything a template needs to render an entry page. The component
 *  source itself is NOT here — it is imported directly where rendered. */
export interface EntryData {
  meta: EntryMeta;
  /** Repo-relative component source path shown in the trust note. */
  sourceFile: string;
  /** Minimal working snippet for the Usage section. */
  usage: string;
  /** Slugs of related entries, rendered as cross-links. */
  related?: string[];
  /** Ordered wire-up steps rendered at the top of Install. */
  installSteps?: string[];
  /** Fixed clock times rendered as a server-side phase table in How it works. */
  phaseTableTimes?: string[];
  /** Full-page demo route, linked under the panel. */
  demoHref?: string;
  /** Full-width page content rendered after examples, outside any card.
   *  For page-level systems whose demo is the page itself. */
  pageContent?: ComponentType;
  /** Anatomy table (part → mount point). */
  anatomy?: EntryAnatomyPart[];
  /** Host requirements list. */
  hostRequirements?: string[];
  /** Gotchas list. */
  gotchas?: string[];
  /** Credits list. */
  credits?: EntryCredit[];
  /** Simple default render for the panel hero. Defaults to examples[0]. */
  hero?: ComponentType;
  api: ApiRow[];
  howItWorks: string;
  changelog: EntryChangelogItem[];
  examples: EntryExample[];
}
