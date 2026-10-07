import * as React from "react";
import { cn } from "@/lib/utils";

// Button system, rewritten for this archive.
// Taxonomy studied from a design system I worked on years ago (my own prior
// work, reused with my approval): modifiers (contained / outline / modern /
// link / flat+raised / icons) and utilities (tones / rounds / sizes).
// Dropped: that system's brand color, class names, and unfinished specials
// (toggle, multiselect, split, FAB, mobile) — those ship only if a real
// project needs them.
// Alert tones reuse harv (personal site) semantic hues; everything else is
// monotone.
//
// This file exports only the component. Docs data (examples, API rows,
// how-it-works) lives in button.entry.tsx so registry installs stay clean.

export type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "modern"
  | "ghost"
  | "flat"
  | "raised"
  | "link";
export type ButtonTone = "default" | "danger" | "warning" | "info" | "success";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";
export type ButtonShape = "default" | "pill" | "square";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  shape?: ButtonShape;
  block?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  default: "button--default",
  secondary: "button--secondary",
  outline: "button--outline",
  modern: "button--modern",
  ghost: "button--ghost",
  flat: "button--flat",
  raised: "button--raised",
  link: "button--link",
};

const toneClass: Record<ButtonTone, string> = {
  default: "",
  danger: "button--tone-danger",
  warning: "button--tone-warning",
  info: "button--tone-info",
  success: "button--tone-success",
};

const sizeClass: Record<ButtonSize, string> = {
  xs: "button--xs",
  sm: "button--sm",
  md: "button--md",
  lg: "button--lg",
  icon: "button--icon",
};

const shapeClass: Record<ButtonShape, string> = {
  default: "",
  pill: "button--pill",
  square: "button--square",
};

const CSS = `.button{ display:inline-flex; align-items:center; justify-content:center; gap:0.5rem; border-radius:var(--radius-sm); font-size:0.875rem; font-weight:500; border:1px solid transparent; cursor:pointer; transition:opacity var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out), filter var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out); }
.button:active{ transform:translateY(1px); filter:brightness(0.9); }
.button--default{ background:var(--tone-bg,var(--fg)); color:var(--tone-fg,var(--bg)); } .button--default:hover{ opacity:0.88; }
.button--secondary{ background:var(--surface-2); color:var(--fg); } .button--secondary:hover{ opacity:0.8; }
.button--outline{ background:transparent; color:var(--tone-bg,var(--fg)); border-color:var(--tone-bg,var(--border)); } .button--outline:hover{ background:var(--surface-2); }
.button--modern{ background:color-mix(in srgb, var(--tone-bg,var(--fg)) 12%, transparent); color:var(--fg); } .button--modern:hover{ background:color-mix(in srgb, var(--tone-bg,var(--fg)) 20%, transparent); }
.button--ghost{ background:transparent; color:var(--fg); } .button--ghost:hover{ background:var(--surface-2); }
.button--flat{ background:transparent; color:var(--fg); } .button--flat:hover{ opacity:0.65; }
.button--raised{ background:var(--tone-bg,var(--fg)); color:var(--tone-fg,var(--bg)); box-shadow:0 2px 10px rgb(0 0 0 / 0.35); } .button--raised:hover{ opacity:0.9; }
.button--link{ background:transparent; border-color:transparent; color:var(--fg); padding-left:0; padding-right:0; text-decoration:underline; text-underline-offset:4px; } .button--link:hover{ opacity:0.65; }
.button--tone-danger{ --tone-bg:#c43d2b; --tone-fg:#fff; } .button--tone-warning{ --tone-bg:#a86e0a; --tone-fg:#fff; }
.button--tone-info{ --tone-bg:#1f7fa8; --tone-fg:#fff; } .button--tone-success{ --tone-bg:#2f8a4d; --tone-fg:#fff; }
.button--xs{ height:1.5rem; padding:0 0.5rem; font-size:0.72rem; } .button--sm{ height:2rem; padding:0 0.75rem; font-size:0.8rem; }
.button--md{ height:2.5rem; padding:0 1rem; } .button--lg{ height:2.75rem; padding:0 1.5rem; font-size:1rem; }
.button--icon{ width:2.5rem; height:2.5rem; padding:0; }
.button--pill{ border-radius:999px; } .button--square{ border-radius:0; }
.button--block{ display:flex; width:100%; }
.button:disabled{ opacity:0.5; pointer-events:none; }`;

export function Button({
  variant = "default",
  tone = "default",
  size = "md",
  shape = "default",
  block = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <>
      <style>{CSS}</style>
      <button
        type={type}
        className={cn(
          "button",
          variantClass[variant],
          tone !== "default" && toneClass[tone],
          sizeClass[size],
          shape !== "default" && shapeClass[shape],
          block && "button--block",
          className
        )}
        {...props}
      />
    </>
  );
}
