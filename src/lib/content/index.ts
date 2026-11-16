/**
 * The content layer's public surface.
 *
 * Components import from HERE, never from content/ directly (§4). Swapping
 * the source below is the entire CMS migration.
 */

export {
  getAdjacentProjects,
  getAllTags,
  getCaseStudies,
  getCv,
  SITE_URL,
  getExperiments,
  getFeaturedProjects,
  getNavItems,
  getProject,
  getProjects,
  getSite,
  getSocialLinks,
  type Experiment,
  type NavItem,
  type Project,
  type SocialLink,
} from "./local";

export {
  DISCIPLINES,
  DISCIPLINE_LABELS,
  isCaseStudy,
  type BodyBlock,
  type Media,
} from "./schema";
