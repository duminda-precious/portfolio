/**
 * The content layer's public surface.
 *
 * Components import from HERE, never from content/ directly (§4). Swapping
 * the source below is the entire CMS migration.
 */

export {
  getExperiments,
  getNavItems,
  getSite,
  getSocialLinks,
  type Experiment,
  type NavItem,
  type SocialLink,
} from "./local";
