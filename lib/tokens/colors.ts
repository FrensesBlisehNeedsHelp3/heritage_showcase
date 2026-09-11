/**
 * Color Tokens (atom)
 * ---------------------------------------------------------------
 * Single source of truth for the showcase's palette. tailwind.config.ts
 * imports this file directly, so design tokens are defined once and
 * consumed everywhere (Tailwind utility classes, and anywhere else in
 * the app that needs a raw value, e.g. a canvas/meta-theme-color tag).
 *
 * Documented for the Atomic Design manual (Deliverable 1.2 — Atoms):
 *   ink    — near-black forest green. Body text, dark section backgrounds.
 *   forest — deep hero-overlay green. Gradient/scrim over hero imagery.
 *   moss   — mid green. Secondary text, borders, muted UI.
 *   sage   — light sage. Section backgrounds (alternates with sand).
 *   sand   — warm off-white. Default page background.
 *   clay   — warm gold accent. Focus rings, small highlights only.
 */
export type ColorTokens = {
  ink: string;
  forest: string;
  moss: string;
  sage: string;
  sand: string;
  clay: string;
};

const colors: ColorTokens = {
  ink: "#16241a",
  forest: "#233626",
  moss: "#5c6f52",
  sage: "#dde3d2",
  sand: "#f6f3ea",
  clay: "#c9a06a",
};

export default colors;
