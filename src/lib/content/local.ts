/**
 * Local content source — reads from content/.
 *
 * ⚠️ THIS IS THE CMS SEAM. When moving to Sanity, this is the ONLY file that
 * gets replaced (by sanity.ts). Everything else imports from ./index, which
 * re-exports whichever source is active. See plan.md §5.
 *
 * Every function is async even though reading a local module is synchronous.
 * That is deliberate: a CMS fetch is async, and having callers already await
 * means the swap doesn't force a refactor through every page.
 */

import { EXPERIMENTS } from "../../../content/experiments";
import { PROJECTS } from "../../../content/projects";
import {
  NAV_ITEMS,
  SITE,
  SOCIAL_LINKS,
  type NavItem,
  type SocialLink,
} from "../../../content/site";

import {
  ExperimentSchema,
  ProjectSchema,
  type Experiment,
  type Project,
} from "./schema";

export type { Experiment, NavItem, Project, SocialLink };

/**
 * Validate once at module load. A schema violation throws here, which fails
 * the build rather than rendering `undefined` in production (§5).
 *
 * The error is rethrown with the offending slug attached, because zod's
 * default message alone doesn't say WHICH project is malformed.
 */
const VALIDATED_PROJECTS: Project[] = PROJECTS.map((project) => {
  const result = ProjectSchema.safeParse(project);

  if (!result.success) {
    throw new Error(
      `Invalid project "${project.slug ?? "<missing slug>"}": ${result.error.message}`,
    );
  }

  return result.data;
});

const VALIDATED_EXPERIMENTS: Experiment[] = EXPERIMENTS.map((experiment) => {
  const result = ExperimentSchema.safeParse(experiment);

  if (!result.success) {
    throw new Error(
      `Invalid experiment "${experiment.id ?? "<missing id>"}": ${result.error.message}`,
    );
  }

  return result.data;
});

export async function getNavItems(): Promise<NavItem[]> {
  return NAV_ITEMS;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return SOCIAL_LINKS;
}

export async function getSite(): Promise<typeof SITE> {
  return SITE;
}

/** Gallery tiles, sorted by their authored order. */
export async function getExperiments(): Promise<Experiment[]> {
  return [...VALIDATED_EXPERIMENTS].sort((a, b) => a.order - b.order);
}

/**
 * All public projects, newest first.
 *
 * `isPublic: false` items are filtered out here rather than at each call
 * site — that way a project pending anonymisation (§13.7) cannot leak into a
 * listing because someone forgot to check.
 */
export async function getProjects(): Promise<Project[]> {
  return VALIDATED_PROJECTS.filter((p) => p.isPublic).sort(
    (a, b) => b.year - a.year,
  );
}

/** Homepage featured slots — eligible projects, in authored order. */
export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const projects = await getProjects();

  return projects
    .filter((p) => p.featured)
    .sort(
      (a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity),
    )
    .slice(0, limit);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

/**
 * Previous/next for case study footer navigation.
 *
 * Wraps at both ends so the reader is never dead-ended on the first or last
 * project — there is always somewhere to go next.
 */
export async function getAdjacentProjects(
  slug: string,
): Promise<{ previous: Project | null; next: Project | null }> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);

  if (index === -1 || projects.length < 2) {
    return { previous: null, next: null };
  }

  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}

/** Every tag actually in use, deduped and sorted — drives the filter chips. */
export async function getAllTags(): Promise<string[]> {
  const projects = await getProjects();
  return [...new Set(projects.flatMap((p) => p.tags))].sort();
}
