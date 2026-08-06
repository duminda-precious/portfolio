/**
 * The content layer's public surface.
 *
 * Components import from HERE, never from content/ directly (§4). Swapping
 * the source below is the entire CMS migration.
 */

export {
  getAdjacentProjects,
  getAllTags,
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
  type BodyBlock,
  type Media,
} from "./schema";
