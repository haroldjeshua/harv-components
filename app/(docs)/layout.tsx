import { SiteSidebar } from "@/components/site-sidebar";
import { getAllEntries } from "@/lib/entries";
import { getRegistryReadySlugs } from "@/lib/entry-data";

// Docs pages only (/, the gallery index, stays full-width without a sidebar).
// URLs: entries live at /docs/[slug].
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const entries = getAllEntries();
  const readySlugs = getRegistryReadySlugs();
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-5 pb-24 pt-8 sm:px-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <SiteSidebar entries={entries} readySlugs={readySlugs} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
