"use client";

import { ClockFading, Contrast, Moon, Sun } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
// Registry convention: intra-item imports use the @/registry path so the
// CLI rewrites them to the install targets. Nothing else changed.
import type {
  TemporalScheme,
  TemporalTemperature,
} from "@/registry/harv/temporal-theme/temporal-theme";

// The reusable seed from Lab 003: a Mindless-style compact toggle.
// Scheme flips with one tap, Dynamic follows the clock, and temperature
// lives behind the contrast button. Fully controlled — the parent owns
// every value, this owns the UI.
export function TemporalToggle({
  scheme,
  temperature,
  onSchemeChange,
  onTemperatureChange,
  dynamic = false,
  onDynamicChange,
  label = "Theme",
}: {
  scheme: TemporalScheme;
  temperature: TemporalTemperature;
  onSchemeChange: (scheme: TemporalScheme) => void;
  onTemperatureChange: (temperature: TemporalTemperature) => void;
  dynamic?: boolean;
  onDynamicChange?: (dynamic: boolean) => void;
  label?: string;
}) {
  // Warm, neutral, cool — neutral carries the scheme's own name, the
  // way the demo panel labels it, so both controls always agree.
  const temperatures: { value: TemporalTemperature; label: string }[] = [
    { value: "warm", label: "Warm" },
    { value: "neutral", label: scheme === "dark" ? "Dark" : "Light" },
    { value: "cool", label: "Cool" },
  ];
  const isDark = scheme === "dark";

  return (
    <div className="flex items-center rounded-full border bg-background/80 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => onSchemeChange(isDark ? "light" : "dark")}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-foreground/10 active:scale-[0.96]"
      >
        {isDark ? (
          <Moon aria-hidden="true" className="size-[1.2rem]" />
        ) : (
          <Sun aria-hidden="true" className="size-[1.2rem]" />
        )}
      </button>
      <div aria-hidden="true" className="h-5 w-px bg-border" />
      {onDynamicChange && (
        <>
          <button
            type="button"
            onClick={() => onDynamicChange(!dynamic)}
            aria-pressed={dynamic}
            aria-label="Follow the time of day"
            title="Dynamic daylight"
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-foreground/10 active:scale-[0.96]"
          >
            <ClockFading
              aria-hidden="true"
              className={cn(
                "size-[1.2rem]",
                dynamic && "text-amber-500",
              )}
            />
          </button>
          <div aria-hidden="true" className="h-5 w-px bg-border" />
        </>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`${label} temperature settings`}
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-foreground/10 active:scale-[0.96]"
          >
            <Contrast
              aria-hidden="true"
              className={cn(
                "size-[1.2rem] transition-transform duration-300",
                isDark ? "rotate-180" : "rotate-0",
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-32 p-1">
          {temperatures.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onTemperatureChange(option.value)}
              aria-pressed={temperature === option.value}
              className={cn(
                "flex w-full items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-foreground/10",
                temperature === option.value && "bg-accent",
              )}
            >
              {option.label}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
