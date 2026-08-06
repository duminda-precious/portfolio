import { z } from "zod";

/**
 * Content schemas (§5).
 *
 * Validated at build time so a typo in a content file fails the build rather
 * than rendering `undefined` in production. These map near-verbatim onto
 * Sanity document schemas when the CMS migration happens.
 */

export const MediaSchema = z.object({
  kind: z.enum(["gumlet-video", "local-loop", "image"]),
  /** Gumlet asset ID, /public path, or remote image URL. */
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
  motion: "Motion Design",
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
  z.object({
    kind: z.literal("section"),
    heading: z.string(),
    paragraphs: z.array(z.string()).min(1),
  }),
  z.object({
    kind: z.literal("media"),
    media: MediaSchema,
    caption: z.string().optional(),
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
]);

export type BodyBlock = z.infer<typeof BodyBlockSchema>;

export const ProjectSchema = z.object({
  slug: z.string(),
  /** Homepage card title — a full sentence, per the mockup. */
  title: z.string(),
  client: z.string().optional(),
  year: z.number(),
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

export const ExperimentSchema = z.object({
  id: z.string(),
  caption: z.string(),
  media: MediaSchema,
  gridSpan: z.union([z.literal(1), z.literal(2)]).default(1),
  order: z.number(),
});

export type Experiment = z.infer<typeof ExperimentSchema>;
