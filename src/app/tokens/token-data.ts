/**
 * Token values mirrored as data, so the /tokens page can render swatches and
 * run the contrast audit over real hex values.
 *
 * ⚠️ These MUST stay in sync with src/styles/tokens.css. CSS custom properties
 * are not readable as data at build time, so this is a deliberate, contained
 * duplication that exists only to serve the dev-only audit route. tokens.css
 * remains the source of truth for anything that ships.
 */

export const BRAND = {
  "brand-50": "#F2F5FE",
  "brand-100": "#E2E7FD",
  "brand-200": "#C4D0FB",
  "brand-300": "#9BAEF7",
  "brand-400": "#6986F3",
  "brand-500": "#2E57EF",
  "brand-600": "#1E44D5",
  "brand-700": "#1035BF",
  "brand-800": "#0C268A",
  "brand-900": "#081B60",
} as const;

export const NEUTRALS = {
  ink: "#1F1F1F",
  "ink-muted": "#747474",
  paper: "#FFFFFF",
  surface: "#F8F8F8",
  page: "#CFCFCF",
  chip: "#CFCFCF",
  hairline: "#E4E4E4",
} as const;

/**
 * The §3.2 audit, re-run against the CONFIRMED palette.
 *
 * Three rules fall out of these numbers and are load-bearing for the build:
 *
 *   1. Blue text on the grey page must be brand-700, never brand-500.
 *      (500 → 3.62:1 FAIL · 700 → 5.90:1 AA)
 *   2. ink-muted is a PAPER-ONLY colour. On the grey page it lands at exactly
 *      3.00:1 — large text only, never captions or body.
 *   3. White-on-brand-500 passes at 5.64:1, so the cursor pill is safe.
 */
export const CONTRAST_PAIRS = [
  {
    label: "ink on paper",
    fg: NEUTRALS.ink,
    bg: NEUTRALS.paper,
    usage: "Headings + body copy",
    expect: "AAA",
  },
  {
    label: "ink on page",
    fg: NEUTRALS.ink,
    bg: NEUTRALS.page,
    usage: "Footer statement + footer links",
    expect: "AAA",
  },
  {
    label: "ink-muted on paper",
    fg: NEUTRALS["ink-muted"],
    bg: NEUTRALS.paper,
    usage: "Captions, nav rest state — do not lighten further",
    expect: "AA",
  },
  {
    label: "ink-muted on page",
    fg: NEUTRALS["ink-muted"],
    bg: NEUTRALS.page,
    usage:
      "⚠️ Exactly 3.00:1 — LARGE TEXT ONLY. Never captions or body on grey.",
    expect: "Large only",
  },
  {
    label: "brand-500 on paper",
    fg: BRAND["brand-500"],
    bg: NEUTRALS.paper,
    usage: "Eyebrow tags, 'Literally.' in the hero",
    expect: "AA",
  },
  {
    label: "brand-500 on page",
    fg: BRAND["brand-500"],
    bg: NEUTRALS.page,
    usage: "❌ Large text only. Use brand-700 for blue text on grey instead.",
    expect: "Large only",
  },
  {
    label: "brand-700 on page",
    fg: BRAND["brand-700"],
    bg: NEUTRALS.page,
    usage: "✅ The fix — AA-safe blue for body text on the grey page",
    expect: "AA",
  },
  {
    label: "brand-700 on paper",
    fg: BRAND["brand-700"],
    bg: NEUTRALS.paper,
    usage: "Links and blue body copy inside the white container",
    expect: "AAA",
  },
  {
    label: "brand-500 on surface",
    fg: BRAND["brand-500"],
    bg: NEUTRALS.surface,
    usage: "Accent type on the off-white inset fill",
    expect: "AA",
  },
  {
    label: "paper on brand-500",
    fg: NEUTRALS.paper,
    bg: BRAND["brand-500"],
    usage: "Cursor pill label — white on blue (§8.3)",
    expect: "AA",
  },
  {
    label: "paper on brand-700",
    fg: NEUTRALS.paper,
    bg: BRAND["brand-700"],
    usage: "White on deep blue — inverted surfaces",
    expect: "AAA",
  },
  {
    label: "ink on chip",
    fg: NEUTRALS.ink,
    bg: NEUTRALS.chip,
    usage: "'Scroll For My Work' chip label",
    expect: "AAA",
  },
  {
    label: "nav grey (mockup) on page",
    fg: "#8A8A8A",
    bg: NEUTRALS.page,
    usage: "❌ The mockup's nav grey. Expected to FAIL — this is the §3.2 fix.",
    expect: "FAIL",
  },
  /* Glass composited over pure black — the WORST case for a translucent
   * surface, i.e. a fully dark video frame behind the header or cursor.
   * The composite is precomputed here because the audit takes solid hex
   * pairs; 0.72 white over #000 resolves to #B7B7B7. */
  {
    label: "ink on glass (worst case)",
    fg: NEUTRALS.ink,
    bg: "#B7B7B7",
    usage:
      "✅ Glass 0.72 over BLACK video. Holds AAA — this is why glass carries ink text.",
    expect: "AAA",
  },
  {
    label: "white on glass (worst case)",
    fg: NEUTRALS.paper,
    bg: "#B7B7B7",
    usage:
      "❌ Why glass never carries white text. Fails against every backdrop.",
    expect: "FAIL",
  },
] as const;

/**
 * The type spec, as data. `className` is the .type-* component class defined
 * in globals.css — the /tokens page renders each sample through the real class
 * rather than restating its properties, so what you see is what ships.
 */
export const TYPE_SCALE = [
  {
    name: "H1",
    className: "type-h1",
    spec: "Bold · 80px · hero, unchanged",
    sample: "Hey! I'm Duminda.",
  },
  {
    name: "H2",
    className: "type-h2",
    spec: "Bold · 54.4px · 30.6px on mobile",
    sample: "Things That Kept Me Up",
  },
  {
    name: "H3",
    className: "type-h3",
    spec: "Bold · 47.6px · 27.2px on mobile",
    sample: "Section heading",
  },
  {
    name: "H4",
    className: "type-h4",
    spec: "Bold · 40.8px · 23.8px on mobile",
    sample: "Subsection heading",
  },
  {
    name: "Title",
    className: "type-title",
    spec: "SemiBold · 23.8px · 18.7px on mobile",
    sample: "Upgrading iTrvl responsive webapp design system.",
  },
  {
    name: "Body",
    className: "type-body",
    spec: "Regular · 20.4px · 15.3px on mobile",
    sample: "Body copy sets the baseline rhythm of the page.",
  },
  {
    name: "Action",
    className: "type-action",
    spec: "SemiBold · 17px",
    sample: "Scroll For My Work",
  },
  {
    name: "Body Small",
    className: "type-body-sm",
    spec: "Regular · 15.3px",
    sample: "Secondary copy sits one step down from body.",
  },
  {
    name: "Label",
    className: "type-label",
    spec: "Bold · 13.6px",
    sample: "Design System · Web · Mobile",
  },
  {
    name: "Captions",
    className: "type-caption",
    spec: "Regular · 11.9px",
    sample: "Untitled 3D experiment",
  },
] as const;

/** px → rem conversion table at a 16px root, for the /tokens reference. */
export const REM_CONVERSIONS = [
  { px: 80, rem: "5rem", use: "Hero" },
  { px: 54.4, rem: "3.4rem", use: "H2" },
  { px: 47.6, rem: "2.975rem", use: "H3" },
  { px: 40.8, rem: "2.55rem", use: "H4" },
  { px: 23.8, rem: "1.488rem", use: "Title" },
  { px: 20.4, rem: "1.275rem", use: "Body" },
  { px: 17, rem: "1.063rem", use: "Action" },
  { px: 15.3, rem: "0.956rem", use: "Body Small" },
  { px: 13.6, rem: "0.85rem", use: "Label" },
  { px: 11.9, rem: "0.744rem", use: "Captions" },
] as const;

export const SPACING_STEPS = [
  { name: "spacing-1", value: "4px" },
  { name: "spacing-2", value: "8px" },
  { name: "spacing-3", value: "12px" },
  { name: "spacing-4", value: "16px" },
  { name: "spacing-6", value: "24px" },
  { name: "spacing-8", value: "32px" },
  { name: "spacing-12", value: "48px" },
  { name: "spacing-16", value: "64px" },
  { name: "spacing-20", value: "80px" },
  { name: "spacing-24", value: "96px" },
  { name: "spacing-32", value: "128px" },
] as const;

export const FLUID_SPACING = [
  { name: "space-section", token: "--space-section", note: "48px → 120px" },
  { name: "space-gutter", token: "--space-gutter", note: "16px → 40px" },
] as const;

export const DURATIONS = [
  { name: "duration-fast", value: "150ms" },
  { name: "duration-base", value: "300ms" },
  { name: "duration-slow", value: "600ms" },
  { name: "duration-reveal", value: "900ms" },
] as const;

export const EASINGS = [
  { name: "ease-out-expo", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
  { name: "ease-in-out-quart", value: "cubic-bezier(0.76, 0, 0.24, 1)" },
] as const;

/**
 * Cursor reference values (§8.3). These mirror what
 * src/components/cursor/variants.ts actually uses — GSAP reads plain numbers
 * there, not these custom properties, for reasons documented in tokens.css.
 * This table exists so the values are visible and auditable in one place.
 */
export const CURSOR_SIZES = [
  {
    token: "--cursor-size-default",
    value: "12px",
    usage: "Resting square (default variant)",
  },
  {
    token: "--cursor-size-cta-height",
    value: "48px",
    usage: "The one labelled pill (cta, expand, play, drag). Ends use --radius-pill.",
  },
  {
    token: "--cursor-size-expand",
    value: "72px",
    usage: "Reserved for a future icon-only cursor. Labelled cursors use the pill.",
  },
  {
    token: "--cursor-size-text-width / -height",
    value: "2px / 28px",
    usage: "Text-caret bar over prose (text variant)",
  },
] as const;

export const CURSOR_TIMINGS = [
  {
    token: "--cursor-duration-track",
    value: "120ms",
    usage:
      "Pointer-follow (GSAP quickTo). Deliberately faster than any --duration-* — tracking needs to read sharper than a UI transition.",
  },
  {
    token: "--cursor-duration-morph",
    value: "150ms = --duration-fast",
    usage:
      "Shape change between variants. Literally shares the site's fast timing rather than inventing a new one.",
  },
  {
    token: "--cursor-ease-track",
    value: "≈ power2.out",
    usage:
      "GSAP-only easing name; the CSS token is a reference cubic-bezier, not what actually runs.",
  },
] as const;
