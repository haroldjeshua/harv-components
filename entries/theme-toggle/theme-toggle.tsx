"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const dark = mounted ? resolvedTheme === "dark" : true;
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: "2rem", height: "2rem", borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)", background: "transparent", color: "var(--fg)",
        cursor: "pointer", fontSize: "1rem",
      }}
    >
      <span aria-hidden="true">{mounted ? (dark ? "○" : "●") : "○"}</span>
    </button>
  );
}
