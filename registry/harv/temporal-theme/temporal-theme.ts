// Temporal Theme resolver (Lab 003, Phase 1).
//
// Pure and deterministic: given a Date and a schedule it returns the day
// phase plus the theme state that phase implies. No React, no DOM, no
// animation — the lab component owns state, CSS owns rendering.
//
// Tune the day by editing DEFAULT_SCHEDULE and PHASE_THEMES below; every
// value the page renders flows from these two tables.

export type TemporalPhase =
  | "night"
  | "dawn"
  | "morning"
  | "day"
  | "golden"
  | "sunset"
  | "dusk"
  | "evening";

export type TemporalScheme = "light" | "dark";
export type TemporalTemperature = "warm" | "neutral" | "cool";

export interface PhaseBoundary {
  phase: TemporalPhase;
  /** Local time the phase starts, as "HH:MM". */
  startsAt: string;
}

export interface TemporalState {
  phase: TemporalPhase;
  scheme: TemporalScheme;
  temperature: TemporalTemperature;
  /** 0 → 1 position inside the current phase. */
  progress: number;
  /** 0 → 1 base atmosphere strength for the phase. */
  atmosphereIntensity: number;
}

/** Phase start times in local time. Kept as strings so the day reads like a schedule. */
export const DEFAULT_SCHEDULE: PhaseBoundary[] = [
  { phase: "dawn", startsAt: "05:30" },
  { phase: "morning", startsAt: "06:30" },
  { phase: "day", startsAt: "09:00" },
  { phase: "golden", startsAt: "16:00" },
  { phase: "sunset", startsAt: "17:30" },
  { phase: "dusk", startsAt: "18:30" },
  { phase: "evening", startsAt: "19:30" },
  { phase: "night", startsAt: "22:00" },
];

/** The theme each phase implies. Scheme and temperature stay independent axes. */
export interface PhaseTheme {
  scheme: TemporalScheme;
  temperature: TemporalTemperature;
  atmosphere: number;
}

const PHASE_THEMES: Record<TemporalPhase, PhaseTheme> = {
  night: { scheme: "dark", temperature: "cool", atmosphere: 0.1 },
  dawn: { scheme: "light", temperature: "warm", atmosphere: 0.45 },
  morning: { scheme: "light", temperature: "neutral", atmosphere: 0.2 },
  day: { scheme: "light", temperature: "neutral", atmosphere: 0.05 },
  golden: { scheme: "light", temperature: "warm", atmosphere: 0.5 },
  sunset: { scheme: "light", temperature: "warm", atmosphere: 0.55 },
  dusk: { scheme: "dark", temperature: "warm", atmosphere: 0.4 },
  evening: { scheme: "dark", temperature: "neutral", atmosphere: 0.15 },
};

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** The theme a single phase implies, without needing a time of day. */
export function phaseTheme(phase: TemporalPhase): PhaseTheme {
  return PHASE_THEMES[phase];
}

/** The whole day as data: each boundary with the theme its phase implies. */
export function describeDay(schedule: PhaseBoundary[] = DEFAULT_SCHEDULE) {
  return schedule.map((entry) => ({
    startsAt: entry.startsAt,
    phase: entry.phase,
    ...PHASE_THEMES[entry.phase],
  }));
}

export function resolveTemporalState(
  date: Date,
  schedule: PhaseBoundary[] = DEFAULT_SCHEDULE,
): TemporalState {
  const now = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
  const starts = schedule.map((entry) => ({
    phase: entry.phase,
    at: toMinutes(entry.startsAt),
  }));

  // The active phase is the last boundary at or before now. Before the
  // first boundary of the day the final entry (night) still applies.
  let index = starts.length - 1;
  for (let i = 0; i < starts.length; i++) {
    if (now >= starts[i].at) index = i;
    else break;
  }
  const current = starts[index];
  const next = starts[(index + 1) % starts.length];

  let span = next.at - current.at;
  if (span <= 0) span += 24 * 60;
  let elapsed = now - current.at;
  if (elapsed < 0) elapsed += 24 * 60;

  const theme = PHASE_THEMES[current.phase];
  return {
    phase: current.phase,
    scheme: theme.scheme,
    temperature: theme.temperature,
    progress: Math.min(1, Math.max(0, elapsed / span)),
    atmosphereIntensity: theme.atmosphere,
  };
}
