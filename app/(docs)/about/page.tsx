import { CodeBlock } from "@/components/code-block";

const REGISTRIES_SNIPPET = `{
  "registries": {
    "@harv": "https://components.harv.computer/r/{name}.json"
  }
}`;

export default function About() {
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold sm:text-4xl">About</h1>
      <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--fg-muted)" }}>
        <p>
          harv components is my personal archive of elements, components, and patterns I actually use.
          Every entry earned its place: it was needed by a real project — this site, my personal site, or client work.
        </p>
        <p>
          Each entry shows a live preview rendered from the same file the source panel displays.
          No demo copies, no screenshots standing in for behavior.
        </p>
        <p>Adding an entry means adding one folder under <span style={{ fontFamily: "var(--font-mono)" }}>registry/harv/</span>: the component source plus a small entry file. That&apos;s it.</p>
      </div>

      <h2 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--fg-faint)" }}>
        Install from this registry
      </h2>
      <div className="space-y-4 leading-relaxed" style={{ color: "var(--fg-muted)" }}>
        <p className="text-sm">
          Entries with a registry item install via the shadcn CLI, no package needed.
          By URL, from any project:
        </p>
        <div className="overflow-hidden" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)" }}>
          <CodeBlock code={`pnpm dlx shadcn@latest add https://components.harv.computer/r/button.json`} />
        </div>
        <p className="text-sm">
          Or once, register the <span style={{ fontFamily: "var(--font-mono)" }}>@harv</span> namespace
          in <span style={{ fontFamily: "var(--font-mono)" }}>components.json</span>, then install by name:
        </p>
        <div className="overflow-hidden" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)" }}>
          <CodeBlock code={REGISTRIES_SNIPPET} />
        </div>
        <div className="overflow-hidden" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)" }}>
          <CodeBlock code={`pnpm dlx shadcn@latest add @harv/button`} />
        </div>
      </div>
    </div>
  );
}
