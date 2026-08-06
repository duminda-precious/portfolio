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

export const VARIANTS: Record<CursorVariant, VariantSpec> = {
  /** 12px dot — the resting state. */
  default: {
    width: 12,
    height: 12,
    radius: 999,
    showsLabel: false,
    fill: "brand",
  },

  /** Pill expands from the dot, blue fill, white text. */
  cta: { width: 0, height: 40, radius: 999, showsLabel: true, fill: "brand" },

  /** Circle grows to ~72px. */
  expand: {
    width: 72,
    height: 72,
    radius: 999,
    showsLabel: true,
    fill: "brand",
  },

  play: { width: 72, height: 72, radius: 999, showsLabel: true, fill: "brand" },

  drag: { width: 72, height: 72, radius: 999, showsLabel: true, fill: "brand" },

  /** Thin vertical bar, caret-like, over body text. */
  text: { width: 2, height: 28, radius: 0, showsLabel: false, fill: "ink" },

  /** Custom cursor hides entirely; the native one returns. */
  hidden: { width: 0, height: 0, radius: 0, showsLabel: false, fill: "none" },
};

/**
 * Movement timings (§8.2).
 *
 * The label pill trails the dot slightly — a longer duration on the same
 * pointer input reads as weight rather than lag.
 */
export const DOT_DURATION = 0.4;
export const LABEL_DURATION = 0.55;
export const EASE = "power3";

/**
 * Horizontal breathing room added to the measured label width when sizing the
 * pill. Must stay in step with the label's px-(--spacing-4) — 16px a side.
 */
export const PILL_PADDING_X = 40;
