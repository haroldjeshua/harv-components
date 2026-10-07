"use client";

import * as React from "react";
import { Box, ChevronRight, CodeXml } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

// Reusable entry panel: Preview/Code toggle, four collapsible sections,
// copy-everywhere. Built in our own tokens; only the interaction pattern
// (collapsible Install/Usage/Code/How-it-works + copy prompt) is borrowed.
export interface PanelCodeFile {
  path: string;
  code: string;
  html: string;
}

export interface PhaseTableRow {
  time: string;
  phase: string;
  scheme: string;
  temperature: string;
  atmosphere: string;
}

export interface EntryPanelData {
  installCommands: string[];
  installNote: string;
  /** Ordered wire-up steps rendered above the commands. */
  installSteps?: string[];
  usage: string;
  usageHtml: string;
  files: PanelCodeFile[];
  howItWorks: string;
  /** Server-rendered phase table appended to How it works. */
  phaseTable?: PhaseTableRow[];
  prompt: string;
}

function Disclosure({
  id,
  title,
  open,
  onToggle,
  copyText,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  copyText: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-body`}
          id={`${id}-button`}
          className="flex flex-1 items-center gap-2 px-4 py-3 text-left text-sm font-semibold hover:opacity-80"
          style={{ color: "var(--fg)", cursor: "pointer", background: "transparent", border: "none" }}
        >
          <ChevronRight
            size={16}
            aria-hidden="true"
            className="shrink-0 transition-transform duration-200 motion-reduce:transition-none"
            style={{ transform: open ? "rotate(90deg)" : "none", color: "var(--fg-faint)" }}
          />
          {title}
        </button>
        <div className="pr-2">
          <CopyButton text={copyText} label={`Copy ${title.toLowerCase()}`} />
        </div>
      </div>
      <div
        id={`${id}-body`}
        role="region"
        aria-labelledby={`${id}-button`}
        className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function EntryPanel({ data, hero }: { data: EntryPanelData; hero: React.ReactNode }) {
  const [mode, setMode] = React.useState<"preview" | "code">("preview");
  const [openSection, setOpenSection] = React.useState<string | null>("install");
  const [fileTab, setFileTab] = React.useState(0);
  const groupRef = React.useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    setMode((m) => (m === "preview" ? "code" : "preview"));
    const next = mode === "preview" ? 1 : 0;
    groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
  }

  const toggle = (which: "preview" | "code") => (
    <button
      key={which}
      type="button"
      role="radio"
      aria-checked={mode === which}
      tabIndex={mode === which ? 0 : -1}
      onClick={() => setMode(which)}
      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
      style={{
        background: mode === which ? "var(--fg)" : "transparent",
        color: mode === which ? "var(--bg)" : "var(--fg-muted)",
        border: "none",
        cursor: "pointer",
        fontWeight: mode === which ? 600 : 400,
      }}
    >
      {which === "preview" ? <Box size={13} aria-hidden="true" /> : <CodeXml size={13} aria-hidden="true" />}
      {which === "preview" ? "Preview" : "Code"}
    </button>
  );

  const section = (key: string) => ({
    open: openSection === key,
    onToggle: () => setOpenSection((s) => (s === key ? null : key)),
  });

  const activeFile = data.files[Math.min(fileTab, data.files.length - 1)];

  return (
    <div className="overflow-hidden" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)" }}>
      <div className="flex items-center justify-between gap-3 px-3 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div
          ref={groupRef}
          role="radiogroup"
          aria-label="Panel view"
          onKeyDown={onKeyDown}
          className="flex items-center gap-1 rounded-full p-0.5"
          style={{ background: "var(--surface-2)" }}
        >
          {toggle("preview")}
          {toggle("code")}
        </div>
        <CopyButton text={data.prompt} label="Copy prompt" />
      </div>

      {mode === "preview" ? (
        <div className="flex items-center justify-center px-6 py-12" style={{ background: "var(--bg)" }}>
          {hero}
        </div>
      ) : (
        <div>
          <Disclosure id="panel-install" title="Install" copyText={data.installCommands.join("\n")} {...section("install")}>
            <div className="flex flex-col gap-2">
              {data.installSteps && data.installSteps.length > 0 && (
                <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed" style={{ color: "var(--fg)" }}>
                  {data.installSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              )}
              {data.installCommands.map((cmd) => (
                <pre key={cmd} className="overflow-x-auto px-3 py-2.5 text-[13px]" style={{ fontFamily: "var(--font-mono)", background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
                  <code>{cmd}</code>
                </pre>
              ))}
              <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>{data.installNote}</p>
            </div>
          </Disclosure>
          <Disclosure id="panel-usage" title="Usage" copyText={data.usage} {...section("usage")}>
            <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-mono)", background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
              <code dangerouslySetInnerHTML={{ __html: data.usageHtml }} />
            </pre>
          </Disclosure>
          <Disclosure
            id="panel-code"
            title="Code"
            copyText={activeFile ? activeFile.code : ""}
            {...section("code")}
          >
            {data.files.length > 1 && (
              <div className="mb-2 flex flex-wrap gap-1" role="tablist" aria-label="Source files">
                {data.files.map((f, i) => (
                  <button
                    key={f.path}
                    type="button"
                    role="tab"
                    aria-selected={i === fileTab}
                    onClick={() => setFileTab(i)}
                    className="rounded-md px-2.5 py-1 text-xs"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: i === fileTab ? "var(--fg)" : "var(--fg-muted)",
                      background: i === fileTab ? "var(--surface-2)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {f.path.split("/").pop()}
                  </button>
                ))}
              </div>
            )}
            {activeFile && (
              <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-mono)", background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
                <code dangerouslySetInnerHTML={{ __html: activeFile.html }} />
              </pre>
            )}
          </Disclosure>
          <div style={{ borderBottom: "none" }}>
            <Disclosure id="panel-how" title="How it works" copyText={data.howItWorks} {...section("how")}>
              <p className="max-w-prose text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                {data.howItWorks}
              </p>
              {data.phaseTable && data.phaseTable.length > 0 && (
                <div className="mt-3 overflow-x-auto" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                  <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--fg-faint)" }}>
                        {["Time", "Phase", "Scheme", "Tone", "Atmosphere"].map((h) => (
                          <th key={h} className="px-3 py-2 text-xs font-semibold uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.phaseTable.map((row) => (
                        <tr key={row.time} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td className="px-3 py-1.5" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>{row.time}</td>
                          <td className="px-3 py-1.5">{row.phase}</td>
                          <td className="px-3 py-1.5" style={{ color: "var(--fg-muted)" }}>{row.scheme}</td>
                          <td className="px-3 py-1.5" style={{ color: "var(--fg-muted)" }}>{row.temperature}</td>
                          <td className="px-3 py-1.5" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--fg-muted)" }}>{row.atmosphere}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Disclosure>
          </div>
        </div>
      )}
    </div>
  );
}

/** Lighter example block: titled live preview with a Preview/Code tab toggle. */
export function ExampleBlock({ title, caption, preview, code, html }: { title: string; caption?: string; preview: React.ReactNode; code: string; html: string }) {
  const [mode, setMode] = React.useState<"preview" | "code">("preview");
  const groupRef = React.useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    setMode((m) => (m === "preview" ? "code" : "preview"));
    const next = mode === "preview" ? 1 : 0;
    groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
  }

  const tab = (which: "preview" | "code") => (
    <button
      key={which}
      type="button"
      role="radio"
      aria-checked={mode === which}
      tabIndex={mode === which ? 0 : -1}
      onClick={() => setMode(which)}
      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
      style={{
        background: mode === which ? "var(--fg)" : "transparent",
        color: mode === which ? "var(--bg)" : "var(--fg-muted)",
        border: "none",
        cursor: "pointer",
        fontWeight: mode === which ? 600 : 400,
      }}
    >
      {which === "preview" ? <Box size={13} aria-hidden="true" /> : <CodeXml size={13} aria-hidden="true" />}
      {which === "preview" ? "Preview" : "Code"}
    </button>
  );

  return (
    <section aria-label={title} className="overflow-hidden" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)" }}>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="truncate text-sm font-semibold">{title}</h3>
          {caption && (
            <p className="truncate font-mono text-[11px]" style={{ color: "var(--fg-faint)" }}>{caption}</p>
          )}
        </div>
        <div
          ref={groupRef}
          role="radiogroup"
          aria-label={`${title} view`}
          onKeyDown={onKeyDown}
          className="flex items-center gap-1 rounded-full p-0.5"
          style={{ background: "var(--surface-2)" }}
        >
          {tab("preview")}
          {tab("code")}
        </div>
      </div>
      {mode === "code" ? (
        <div>
          <div className="flex items-center justify-end border-b px-2 py-1" style={{ borderColor: "var(--border)" }}>
            <CopyButton text={code} />
          </div>
          <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
            <code dangerouslySetInnerHTML={{ __html: html }} />
          </pre>
        </div>
      ) : (
        <div className="flex items-center justify-center px-6 py-8" style={{ background: "var(--bg)" }}>
          {preview}
        </div>
      )}
    </section>
  );
}
