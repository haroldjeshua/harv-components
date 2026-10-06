import { CodeBlock } from "@/components/code-block";
import { CopyButton } from "@/components/copy-button";

// Code display with copy button. Highlighting happens at build time
// (CodeBlock is a server component); only the copy button is interactive.
export function SourcePanel({ code, language = "tsx" }: { code: string; language?: string }) {
  return (
    <div
      className="overflow-hidden"
      style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2 text-xs"
        style={{ borderBottom: "1px solid var(--border)", color: "var(--fg-muted)" }}
      >
        <span style={{ fontFamily: "var(--font-mono)" }}>{language}</span>
        <CopyButton text={code} />
      </div>
      <CodeBlock code={code} />
    </div>
  );
}

export function SourcePanelDemo() {
  return <SourcePanel code={`const hello = "copy me";`} language="ts" />;
}
