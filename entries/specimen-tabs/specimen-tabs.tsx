"use client";

import * as React from "react";
import { CopyButton } from "@/components/copy-button";

// Tabbed specimen: one page, category tabs hide/show sections without a
// route change. Idea studied from Integrity UI's single-page components index;
// rewritten here as an accessible tablist in this archive's monotone voice.
//
// Code HTML is pre-highlighted at build time by the page (server) and passed
// as `codeHtml`; nothing tokenizes in the browser.
export interface SpecimenSection {
  id: string;
  label: string;
  content: React.ReactNode;
  /** Raw usage snippet, used for the copy button. */
  code?: string;
  /** Build-time highlighted HTML for `code`. */
  codeHtml?: string;
}

export function SpecimenTabs({ sections, defaultSection }: { sections: SpecimenSection[]; defaultSection?: string }) {
  const [active, setActive] = React.useState(defaultSection ?? sections[0]?.id);
  const [showCode, setShowCode] = React.useState(false);
  const current = sections.find((s) => s.id === active) ?? sections[0];

  function onKeyDown(e: React.KeyboardEvent) {
    const i = sections.findIndex((s) => s.id === active);
    if (e.key === "ArrowRight") setActive(sections[(i + 1) % sections.length].id);
    if (e.key === "ArrowLeft") setActive(sections[(i - 1 + sections.length) % sections.length].id);
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Specimen categories"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {sections.map((s) => {
          const selected = s.id === current?.id;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${s.id}`}
              id={`tab-${s.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => { setActive(s.id); setShowCode(false); }}
              className="px-3 py-2 text-sm"
              style={{
                color: selected ? "var(--fg)" : "var(--fg-muted)",
                fontWeight: selected ? 600 : 400,
                borderBottom: selected ? "2px solid var(--fg)" : "2px solid transparent",
                marginBottom: "-1px",
                cursor: "pointer",
                background: "transparent",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      {current && (
        <div
          key={current.id}
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="mt-5"
        >
          {current.content}
          {current.code && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowCode((v) => !v)}
                aria-expanded={showCode}
                className="text-sm hover:opacity-70"
                style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}
              >
                {showCode ? "Hide code ⌃" : "Show code ⌄"}
              </button>
              {showCode && (
                <div
                  className="mt-3 overflow-hidden"
                  style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)" }}
                >
                  <div
                    className="flex items-center justify-end px-2 py-1"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <CopyButton text={current.code} />
                  </div>
                  <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
                    <code dangerouslySetInnerHTML={{ __html: current.codeHtml ?? "" }} />
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SpecimenTabsDemo({ sections }: { sections: SpecimenSection[] }) {
  return <SpecimenTabs sections={sections} />;
}
