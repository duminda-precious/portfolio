import { z } from "zod";

/**
 * Content schemas (§5).
 *
 * Validated at build time so a typo in a content file fails the build rather
 * than rendering `undefined` in production. These map near-verbatim onto
 * Sanity document schemas when the CMS migration happens.
 */

export const MediaSchema = z.object({
  /**
   * "embed" is a live page in an iframe (e.g. a WebGL demo).
   * "youtube" shows the video's thumbnail; the player only loads in the
   * lightbox, and never autoplays.
   */
  kind: z.enum(["gumlet-video", "local-loop", "image", "embed", "youtube"]),
  /** Gumlet asset ID, /public path, remote image URL, embed page URL, or YouTube video ID. */
  src: z.string(),
  /** Required for video — first frame, prevents the flash. */
  poster: z.string().optional(),
  /** Required. Non-negotiable. Empty string ONLY for decorative media. */
  alt: z.string(),
  aspect: z.enum(["16/9", "4/3", "1/1", "3/4"]).default("16/9"),
  hasAudio: z.boolean().default(false),
});

export type Media = z.infer<typeof MediaSchema>;

export const DISCIPLINES = ["ui-ux", "motion", "3d-code"] as const;

/** User-facing discipline labels (§2.4). */
export const DISCIPLINE_LABELS: Record<(typeof DISCIPLINES)[number], string> = {
  "ui-ux": "UI/UX & Design Systems",
  motion: "Motion Design & Video editing",
  "3d-code": "3D & Creative Coding",
};

/**
 * Case study body blocks.
 *
 * A discriminated union rather than MDX: it renders the same layouts with no
 * extra dependencies, stays type-safe, and slots behind the same content layer
 * if MDX arrives later (§5).
 */
export const BodyBlockSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("lead"), text: z.string() }),
  /** Plain body paragraphs with no heading. */
  z.object({
    kind: z.literal("prose"),
    paragraphs: z.array(z.string()).min(1),
  }),
  z.object({
    kind: z.literal("section"),
    heading: z.string(),
    paragraphs: z.array(z.string()).min(1),
  }),
  z.object({
    kind: z.literal("media"),
    media: MediaSchema,
    caption: z.string().optional(),
    /** Gallery row spans the full container instead of the height cap. */
    fullWidth: z.boolean().optional(),
    /** Always gets a row of its own; never paired with neighbouring media. */
    solo: z.boolean().optional(),
  }),
  z.object({
    kind: z.literal("pullquote"),
    text: z.string(),
    attribution: z.string().optional(),
  }),
  z.object({
    kind: z.literal("stats"),
    items: z.array(z.object({ label: z.string(), value: z.string() })).min(1),
  }),
  /**
   * The scan-in-seconds panel: problem, opportunity, result. Sits right
   * under the header so a client gets the whole project before scrolling.
   */
  z.object({
    kind: z.literal("brief"),
    items: z.array(z.object({ label: z.string(), text: z.string() })).min(2),
  }),
  /** How it was, beside how it is. */
  z.object({
    kind: z.literal("compare"),
    before: z.object({ label: z.string(), points: z.array(z.string()).min(1) }),
    after: z.object({ label: z.string(), points: z.array(z.string()).min(1) }),
  }),
  /** Learnings: a short title and one line each, numbered. */
  z.object({
    kind: z.literal("takeaways"),
    heading: z.string(),
    items: z.array(z.object({ title: z.string(), text: z.string() })).min(1),
  }),
]);

export type BodyBlock = z.infer<typeof BodyBlockSchema>;

export const ProjectSchema = z.object({
  slug: z.string(),
  /** Homepage card title — a full sentence, per the mockup. */
  title: z.string(),
  client: z.string().optional(),
  /** Optional: some videos are undated. */
  year: z.number().optional(),
  /** Internal only. Drives template choice + homepage eligibility (§2.4). */
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  discipline: z.enum(DISCIPLINES),
  /** Renders as the blue eyebrow. */
  tags: z.array(z.string()).min(1),
  featured: z.boolean().default(false),
  featuredOrder: z.number().optional(),
  cover: MediaSchema,
  summary: z.string().max(280),
  role: z.string().optional(),
  tools: z.array(z.string()).default([]),
  /** false = needs anonymisation before shipping (§13.7). */
  isPublic: z.boolean().default(true),
  body: z.array(BodyBlockSchema).default([]),
});

export type Project = z.infer<typeof ProjectSchema>;

/**
 * A project is a case study (has its own /work/[slug] page) unless its cover
 * is a YouTube video: those cards open the video in the lightbox instead.
 * Lives here, not in local.ts, so client components can import it without
 * pulling the content data into the bundle.
 */
export const isCaseStudy = (p: Project) => p.cover.kind !== "youtube";

export const ExperimentSchema = z.object({
  id: z.string(),
  caption: z.string(),
  media: MediaSchema,
  /** Column span on the 6-column experiments grid. A row's spans add up to 6. */
  gridSpan: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(6),
  ]).default(1),
  /**
   * Zooms the media inside its tile. The tile box stays the same size;
   * overflow is clipped. Use when the subject sits small in the frame.
   */
  scale: z.number().positive().optional(),
  order: z.number(),
});

export type Experiment = z.infer<typeof ExperimentSchema>;
