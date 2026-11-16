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
  { label: "My work", href: "/work" },
  { label: "About me", href: "/about" },
  // AI workflow hidden until its doc and plan land (2026-11-15).
  { label: "Work with me", href: "/work-with-me" },
];

export type SocialLink = {
  label: string;
  href: string;
};

/**
 * Footer social row — text links only, no icons (§9.7).
 *
 * Real destinations, confirmed 2026-11-15. Behance was dropped by decision.
 *
 * No cursor labels — same reasoning as NAV_ITEMS above.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dumindahettiarachchi/" },
  // Share-tracking query string stripped from the supplied link.
  { label: "Instagram", href: "https://www.instagram.com/duminda_was_here" },
  { label: "Dribbble", href: "https://dribbble.com/holytreee" },
  { label: "Email", href: "mailto:mduminda93@gmail.com" },
];

/**
 * Production origin. Vercel injects VERCEL_PROJECT_PRODUCTION_URL (no
 * protocol) at build time; local dev falls back to localhost.
 */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const SITE = {
  name: "Duminda M",
  role: "Head of Motion",
  /** Footer statement. Year is injected at render, not hardcoded (§9.7). */
  copyright: (year: number) =>
    `Site content © Duminda M · All rights reserved · ${year} · Made with love & caffeine`,
  /**
   * About skills, from the About frame. A single stack, not a grid —
   * only render the list, never empty groups.
   */
  skills: [
    "UI Design",
    "Wireframing",
    "HF Prototyping",
    "Design System",
    "Branding",
    "Motion Design",
    "3D Modeling",
    "2D Animation",
    "Illustration",
    "Ai Augmentation",
    "Ai+Coding",
    "Ai+Design Audit",
  ],
} as const;
