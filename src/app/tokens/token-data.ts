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
] as const;

export const TYPE_SCALE = [
  {
    name: "text-hero",
    token: "--text-hero",
    sample: "Hey! I'm Duminda.",
    leading: "--leading-hero",
    tracking: "--tracking-hero",
  },
  {
    name: "text-display",
    token: "--text-display",
    sample: "Things That Kept Me Up",
    leading: "--leading-tight",
    tracking: "--tracking-tight",
  },
  {
    name: "text-h2",
    token: "--text-h2",
    sample: "Section heading",
    leading: "--leading-tight",
    tracking: "--tracking-tight",
  },
  {
    name: "text-h3",
    token: "--text-h3",
    sample: "Subsection heading",
    leading: "--leading-tight",
    tracking: "--tracking-tight",
  },
  {
    name: "text-lead",
    token: "--text-lead",
    sample: "Upgrading iTrvl responsive webapp design system.",
    leading: "--leading-body",
    tracking: "normal",
  },
  {
    name: "text-body",
    token: "--text-body",
    sample: "Body copy sets the baseline rhythm of the page.",
    leading: "--leading-body",
    tracking: "normal",
  },
  {
    name: "text-caption",
    token: "--text-caption",
    sample: "Design System · Web · Mobile",
    leading: "--leading-body",
    tracking: "normal",
  },
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
