import * as React from "react";
import { cn } from "@/lib/utils";

// Small label for layers, statuses, and tags. From harv's badge, reduced
// to monotone. This file exports only the component; docs data lives in
// badge.entry.tsx so registry installs stay clean.

export type BadgeVariant = "default" | "secondary" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <>
      <style>{`.badge{ display:inline-flex; align-items:center; gap:0.25rem; border-radius:999px; border:1px solid transparent; padding:0.15rem 0.6rem; font-size:0.72rem; font-weight:600; letter-spacing:0.01em; line-height:1.4; white-space:nowrap; }
.badge--default{ background:var(--fg); color:var(--bg); }
.badge--secondary{ background:var(--surface-2); color:var(--fg); }
.badge--outline{ background:transparent; color:var(--fg); border-color:var(--border); }`}</style>
      <span className={cn("badge", `badge--${variant}`, className)} {...props} />
    </>
  );
}
