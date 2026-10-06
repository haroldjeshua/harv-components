"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

/** Copy button with check feedback and screen-reader announcement.
 *  Shared by code blocks and the entry panel. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      aria-label={copied ? "Copied" : label}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs hover:opacity-70"
      style={{ color: "var(--fg)" }}
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {copied ? "Copied" : label}
    </button>
  );
}
