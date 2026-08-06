/**
 * Cursor variants (§8.3).
 *
 * Sizes are in px rather than tokens because GSAP animates these as raw
 * numeric values — a CSS custom property would have to be resolved and parsed
 * on every variant change, which is work on the hot path for no gain.
 */

export type CursorVariant =
  "default" | "cta" | "expand" | "play" | "drag" | "text" | "hidden";

export type VariantSpec = {
  width: number;
  height: number;
  radius: number;
  /** Whether the label pill renders for this variant. */
  showsLabel: boolean;
  /** Fill uses the brand blue unless stated. */
  fill: "brand" | "ink" | "none";
};

/**
 * Square-cornered throughout — this matches the media containers, which the
 * design keeps at --radius-none. The pill radius stays reserved for the
 * scroll chip and the filter chips.
 */
export const VARIANTS: Record<CursorVariant, VariantSpec> = {
  /** 12px square — the resting state. */
  default: {
    width: 12,
    height: 12,
    radius: 0,
    showsLabel: false,
    fill: "brand",
  },

  /** Square label box, expands from the dot. Blue fill, white text. */
  cta: { width: 0, height: 40, radius: 0, showsLabel: true, fill: "brand" },

  /** Grows to ~72px. */
  expand: {
    width: 72,
    height: 72,
    radius: 0,
    showsLabel: true,
    fill: "brand",
  },

  play: { width: 72, height: 72, radius: 0, showsLabel: true, fill: "brand" },

  drag: { width: 72, height: 72, radius: 0, showsLabel: true, fill: "brand" },

  /** Thin vertical bar, caret-like, over body text. */
  text: { width: 2, height: 28, radius: 0, showsLabel: false, fill: "ink" },

  /** Custom cursor hides entirely; the native one returns. */
  hidden: { width: 0, height: 0, radius: 0, showsLabel: false, fill: "none" },
};

/**
 * Movement timings (§8.2).
 *
 * Tuned for a SHARP, responsive cursor rather than a floaty one. Two things
 * produce that together, and changing only one won't do it:
 *
 *   1. A short duration (0.12s). The long 0.4s lerp is what reads as "drifting
 *      toward" the pointer instead of tracking it.
 *   2. `power2.out` rather than `power3`. A higher-power ease spends most of
 *      its time decelerating, which is exactly the soft tail we don't want.
 *
 * Set DOT_DURATION to 0 for a cursor that pins exactly to the pointer with no
 * interpolation at all.
 */
export const DOT_DURATION = 0.12;
export const LABEL_DURATION = 0.15;
export const EASE = "power2.out";

/** Variant morph (size/shape change) — 150ms, matching --duration-fast. */
export const MORPH_DURATION = 0.15;
export const MORPH_EASE = "power2.out";

/**
 * Horizontal breathing room added to the measured label width when sizing the
 * pill. Must stay in step with the label's px-(--spacing-4) — 16px a side.
 */
export const PILL_PADDING_X = 40;
