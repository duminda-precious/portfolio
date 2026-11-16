/**
 * Cursor variants (§8.3).
 *
 * Sizes are in px rather than reading CSS custom properties, because GSAP
 * animates these as raw numeric values on the hot path (every pointer event,
 * every variant change) — resolving a var() there is unnecessary work, and
 * GSAP's tween engine wants numbers to interpolate reliably.
 *
 * ⚠️ KEPT IN SYNC WITH TOKENS.CSS "Cursor" section — every value below has a
 * --cursor-* reference token there for humans and for /tokens to render
 * against. If you change a number here, change the matching token too.
 */

export type CursorVariant =
  "default" | "cta" | "expand" | "play" | "drag" | "text" | "hidden";

export type VariantSpec = {
  width: number;
  height: number;
  radius: number;
  /** Whether the label pill renders for this variant. */
  showsLabel: boolean;
  /**
   * Surface treatment.
   *
   * `invert` — the resting square. No fill of its own; the renderer applies
   *   backdrop-filter: invert(1), so the square is the inverse of whatever
   *   sits under it. A flat color disappears on the page gray and on the
   *   blue About field.
   * `glass` — translucent blurred panel, for anything carrying a LABEL. The
   *   label text is --color-ink on glass; white would have no guaranteed
   *   contrast, since the effective background is whatever is behind it.
   *   Labels stay glass: inverting them would recolor the words per pixel.
   * `ink`   — solid dark, for the text caret.
   * `none`  — transparent; the variant is hidden.
   */
  fill: "invert" | "glass" | "ink" | "none";
};

/**
 * One pill for every labelled cursor. "View case study", "Expand", "Play"
 * and "Drag" are the same component — only the words change. Width grows to
 * the label; the ends stay fully round (--radius-pill, 999px) and the height
 * stays --cursor-size-cta-height. The resting dot stays a square.
 */
const PILL: VariantSpec = {
  width: 0,
  height: 48,
  radius: 999,
  showsLabel: true,
  fill: "glass",
};

export const VARIANTS: Record<CursorVariant, VariantSpec> = {
  /** 12px square — the resting state. Inverted, not a flat fill.
   * Token: --cursor-size-default. */
  default: {
    width: 12,
    height: 12,
    radius: 0,
    showsLabel: false,
    fill: "invert",
  },

  /** Labelled pill. See PILL. */
  cta: PILL,
  expand: PILL,
  play: PILL,
  drag: PILL,

  /** Thin vertical bar, caret-like, over body text.
   * Tokens: --cursor-size-text-width, --cursor-size-text-height. */
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
 *
 * Token: --cursor-duration-track (120ms) — deliberately faster than any
 * --duration-* in §3.6, because pointer-follow needs to read as sharper than
 * a UI transition or it feels laggy.
 */
export const DOT_DURATION = 0.12;
export const LABEL_DURATION = 0.15;
/** GSAP easing name — no CSS equivalent exists; --cursor-ease-track in
 * tokens.css documents the closest cubic-bezier for reference only. */
export const EASE = "power2.out";

/**
 * Variant morph (size/shape change).
 * Token: --cursor-duration-morph, which literally equals --duration-fast —
 * the cursor's shape change deliberately rides the site's fast timing rather
 * than inventing a separate one.
 */
export const MORPH_DURATION = 0.15;
export const MORPH_EASE = "power2.out";

/**
 * Glass blur radius, in px. Token: --blur-glass.
 *
 * ⚠️ Must stay in step with --blur-glass in tokens.css and the literal values
 * in the .glass rules in globals.css. It is duplicated here rather than read
 * from the custom property because the CSS minifier deduplicates prefixed and
 * standard backdrop-filter declarations when both use an identical var() —
 * keeping only the -webkit- form, which Chrome and Firefox ignore.
 */
export const GLASS_BLUR_PX = 12;

/**
 * Saturation lift applied alongside the glass blur. Token: --glass-saturate.
 * Same "must be a literal, not a var()" constraint as GLASS_BLUR_PX above —
 * kept as a separate constant so both are named rather than a bare "160%" in
 * the filter string.
 */
export const GLASS_SATURATE = "160%";

/**
 * Horizontal breathing room added to the measured label width when sizing the
 * box. This is the TOTAL, both sides combined.
 *
 * ⚠️ Must stay in step with the label's inline padding in CursorRenderer
 * (currently 8px a side via `px-(--spacing-2)`) — half of this value on each
 * side, or the text sits off-centre in the box.
 */
export const PILL_PADDING_X = 16;
