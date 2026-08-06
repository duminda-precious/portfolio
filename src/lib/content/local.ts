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

import { EXPERIMENTS, type Experiment } from "../../../content/experiments";
import {
  NAV_ITEMS,
  SITE,
  SOCIAL_LINKS,
  type NavItem,
  type SocialLink,
} from "../../../content/site";

export type { Experiment, NavItem, SocialLink };

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
  return [...EXPERIMENTS].sort((a, b) => a.order - b.order);
}
