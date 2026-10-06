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

/** Everything a template needs to render an entry page. The component
 *  source itself is NOT here — it is imported directly where rendered. */
export interface EntryData {
  meta: EntryMeta;
  /** Repo-relative component source path shown in the trust note. */
  sourceFile: string;
  /** Minimal working snippet for the Usage section. */
  usage: string;
  /** Simple default render for the panel hero. Defaults to examples[0]. */
  hero?: ComponentType;
  api: ApiRow[];
  howItWorks: string;
  changelog: EntryChangelogItem[];
  examples: EntryExample[];
}
