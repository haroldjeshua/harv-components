import { highlightCode } from "@/lib/highlight";

export function CodeBlock({ code, html }: { code?: string; html?: string }) {
  const rendered = html ?? highlightCode(code ?? "");
  return (
    <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
      <code dangerouslySetInnerHTML={{ __html: rendered }} />
    </pre>
  );
}
