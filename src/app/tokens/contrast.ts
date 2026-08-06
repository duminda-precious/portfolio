/**
 * WCAG 2.1 contrast maths, for verifying the §3.2 audit in-browser rather than
 * trusting numbers computed off a PNG.
 *
 * Implements the relative-luminance and contrast-ratio definitions from
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */

type Rgb = { r: number; g: number; b: number };

function hexToRgb(hex: string): Rgb {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** Relative luminance, per WCAG 2.1. Channels are linearised before weighting. */
function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (value: number) => {
    const srgb = value / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast ratio between two hex colours. Ranges from 1 to 21. */
export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(hexToRgb(foreground));
  const l2 = relativeLuminance(hexToRgb(background));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export type ContrastVerdict = {
  ratio: number;
  /** AA needs 4.5:1 for normal text. */
  normalAA: boolean;
  /** AAA needs 7:1 for normal text. */
  normalAAA: boolean;
  /** Large text (≥24px, or ≥18.66px bold) needs 3:1 for AA. */
  largeAA: boolean;
};

export function assess(
  foreground: string,
  background: string,
): ContrastVerdict {
  const ratio = contrastRatio(foreground, background);

  return {
    ratio,
    normalAA: ratio >= 4.5,
    normalAAA: ratio >= 7,
    largeAA: ratio >= 3,
  };
}
