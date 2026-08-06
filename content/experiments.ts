/**
 * "Things That Kept Me Up" — Tier 3 gallery items (§9.6).
 *
 * ⚠️ Nothing outside src/lib/content/ may import this directly (§4).
 *
 * The gridSpan values reproduce the mockup's 1,1,1 / 2,1 / 1,2 / 2 rhythm.
 * That pattern is SEED DATA, not layout logic — reordering the grid is a
 * content change here, never a change to ExperimentsGrid.
 */

import type { Experiment } from "@/lib/content/schema";

/** Unsplash with explicit sizing so next/image gets a stable, cacheable URL. */
const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * ⚠️ PLACEHOLDER CAPTIONS + MEDIA. Open question §13.5.
 *
 * Captions are deliberately obvious placeholders so nothing ships by accident,
 * but they run to a realistic length — a caption's line count affects the grid's
 * vertical rhythm, so lorem-short strings would misrepresent the layout.
 *
 * Imagery is Unsplash standing in for the real micro-loops. Phase 2 replaces
 * these with local encoded .mp4/.webm (§6.2), at which point `kind` becomes
 * "local-loop" and the encoding budget applies.
 */
export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp-01",
    caption: "Placeholder caption — real copy pending (§13.5)",
    media: {
      kind: "image",
      src: unsplash("1618005182384-a83a8bd57fbe"),
      alt: "Placeholder experiment still.",
      aspect: "4/3",
      hasAudio: false,
    },
    gridSpan: 1,
    order: 1,
  },
  {
    id: "exp-02",
    caption: "Placeholder caption — real copy pending (§13.5)",
    media: {
      kind: "image",
      src: unsplash("1620121692029-d088224ddc74"),
      alt: "Placeholder experiment still.",
      aspect: "4/3",
      hasAudio: false,
    },
    gridSpan: 1,
    order: 2,
  },
  {
    id: "exp-03",
    caption: "Placeholder caption — real copy pending (§13.5)",
    media: {
      kind: "image",
      src: unsplash("1614851099511-773084f6911d"),
      alt: "Placeholder experiment still.",
      aspect: "4/3",
      hasAudio: false,
    },
    gridSpan: 1,
    order: 3,
  },
  {
    id: "exp-04",
    caption: "Placeholder caption for a wider tile — real copy pending (§13.5)",
    media: {
      kind: "image",
      src: unsplash("1633356122102-3fe601e05bd2"),
      alt: "Placeholder experiment still.",
      aspect: "16/9",
      hasAudio: false,
    },
    gridSpan: 2,
    order: 4,
  },
  {
    id: "exp-05",
    caption: "Placeholder caption — real copy pending (§13.5)",
    media: {
      kind: "image",
      src: unsplash("1550859492-d5da9d8e45f3"),
      alt: "Placeholder experiment still.",
      aspect: "4/3",
      hasAudio: false,
    },
    gridSpan: 1,
    order: 5,
  },
  {
    id: "exp-06",
    caption: "Placeholder caption — real copy pending (§13.5)",
    media: {
      kind: "image",
      src: unsplash("1502691876148-a84978e59af8"),
      alt: "Placeholder experiment still.",
      aspect: "4/3",
      hasAudio: false,
    },
    gridSpan: 1,
    order: 6,
  },
  {
    id: "exp-07",
    caption: "Placeholder caption for a wider tile — real copy pending (§13.5)",
    media: {
      kind: "image",
      src: unsplash("1604871000636-074fa5117945"),
      alt: "Placeholder experiment still.",
      aspect: "16/9",
      hasAudio: false,
    },
    gridSpan: 2,
    order: 7,
  },
  {
    id: "exp-08",
    caption: "Placeholder caption for a wider tile — real copy pending (§13.5)",
    media: {
      kind: "image",
      src: unsplash("1517483000871-1dbf64a6e1c6"),
      alt: "Placeholder experiment still.",
      aspect: "16/9",
      hasAudio: false,
    },
    gridSpan: 2,
    order: 8,
  },
];
