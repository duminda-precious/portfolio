/**
 * Site-level content: nav, socials, meta.
 *
 * ⚠️ Nothing outside src/lib/content/ may import this file directly (§4).
 * Components go through the content layer so a later CMS swap is one file.
 */

export type NavItem = {
  label: string;
  href: string;
};

/**
 * Primary navigation, right-aligned in the header (§2.3).
 *
 * Note "AI Workflow", not the mockup's "Ai Workflow" — "Ai" reads as a typo
 * and this label is doing brand work (§2.3 labelling decisions).
 *
 * No cursor labels: nav links already carry a clear hover state, so the
 * cursor's CTA reinforcement (§8.5) was redundant here — dropped by decision.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "My Work", href: "/work" },
  { label: "About Me", href: "/about" },
  { label: "AI Workflow", href: "/ai-workflow" },
  { label: "Work With Me", href: "/work-with-me" },
];

export type SocialLink = {
  label: string;
  href: string;
};

/**
 * Footer social row — text links only, no icons (§9.7).
 *
 * ⚠️ PLACEHOLDER DESTINATIONS. The mockup listed "LinkedIn" three times; these
 * are the recommended set from §2.3 but the URLs are guesses. Open question
 * §13.6 — confirm the real handles, and whether Behance is current, before
 * launch.
 *
 * No cursor labels — same reasoning as NAV_ITEMS above.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com/in/" }, // TODO §13.6 — real handle
  { label: "Instagram", href: "https://instagram.com/" }, // TODO §13.6 — real handle
  { label: "Behance", href: "https://behance.net/" }, // TODO §13.6 — confirm still current
  { label: "Email", href: "mailto:hello@example.com" }, // TODO §13.6 — real address
];

export const SITE = {
  name: "Duminda M",
  role: "Senior Creative Director",
  /** Footer statement. Year is injected at render, not hardcoded (§9.7). */
  copyright: (year: number) =>
    `Site Content © Duminda M · All Rights Reserved · ${year} · Made With Love & Caffeine`,
} as const;
