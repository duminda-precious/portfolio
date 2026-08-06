/**
 * "Things That Kept Me Up" — Tier 3 gallery items (§9.6).
 *
 * ⚠️ Nothing outside src/lib/content/ may import this directly (§4).
 *
 * The gridSpan values reproduce the mockup's 1,1,1 / 2,1 / 1,2 / 2 rhythm.
 * That pattern is SEED DATA, not layout logic — reordering the grid is a
 * content change here, never a change to ExperimentsGrid.
 */

export type ExperimentMedia = {
  kind: "local-loop" | "image";
  /** Path under /public. Empty string renders the brand-blue placeholder,
   * which is the mockup's loading state and a legitimate interim look. */
  src: string;
  poster?: string;
  /** Required. Non-negotiable — see §5 MediaSchema. */
  alt: string;
  aspect: "16/9" | "4/3" | "1/1" | "3/4";
};

export type Experiment = {
  id: string;
  /** The small grey line under each tile. Prime voice real estate (§9.6) —
   * "Don't Tell My Client" energy, not "Untitled 3D experiment". */
  caption: string;
  media: ExperimentMedia;
  gridSpan: 1 | 2;
  order: number;
};

/**
 * ⚠️ PLACEHOLDER CAPTIONS + MEDIA. Open question §13.5.
 *
 * The captions below are written in voice as a demonstration of the register,
 * NOT as final copy — they describe work that may not exist. Replace every one
 * of them with a real caption for the real tile before launch. The `src` fields
 * are deliberately empty so each tile renders the brand-blue placeholder rather
 * than 404ing on a file that was never encoded.
 */
export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp-01",
    caption: "Placeholder — real caption pending (§13.5)",
    media: { kind: "local-loop", src: "", alt: "", aspect: "4/3" },
    gridSpan: 1,
    order: 1,
  },
  {
    id: "exp-02",
    caption: "Placeholder — real caption pending (§13.5)",
    media: { kind: "local-loop", src: "", alt: "", aspect: "4/3" },
    gridSpan: 1,
    order: 2,
  },
  {
    id: "exp-03",
    caption: "Placeholder — real caption pending (§13.5)",
    media: { kind: "local-loop", src: "", alt: "", aspect: "4/3" },
    gridSpan: 1,
    order: 3,
  },
  {
    id: "exp-04",
    caption: "Placeholder — real caption pending (§13.5)",
    media: { kind: "local-loop", src: "", alt: "", aspect: "16/9" },
    gridSpan: 2,
    order: 4,
  },
  {
    id: "exp-05",
    caption: "Placeholder — real caption pending (§13.5)",
    media: { kind: "local-loop", src: "", alt: "", aspect: "4/3" },
    gridSpan: 1,
    order: 5,
  },
  {
    id: "exp-06",
    caption: "Placeholder — real caption pending (§13.5)",
    media: { kind: "local-loop", src: "", alt: "", aspect: "4/3" },
    gridSpan: 1,
    order: 6,
  },
  {
    id: "exp-07",
    caption: "Placeholder — real caption pending (§13.5)",
    media: { kind: "local-loop", src: "", alt: "", aspect: "16/9" },
    gridSpan: 2,
    order: 7,
  },
  {
    id: "exp-08",
    caption: "Placeholder — real caption pending (§13.5)",
    media: { kind: "local-loop", src: "", alt: "", aspect: "16/9" },
    gridSpan: 2,
    order: 8,
  },
];
