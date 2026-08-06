/**
 * Site-level content: nav, socials, meta.
 *
 * ⚠️ Nothing outside src/lib/content/ may import this file directly (§4).
 * Components go through the content layer so a later CMS swap is one file.
 */

export type NavItem = {
  label: string;
  href: string;
  /** Cursor pill copy (§8.5). Must stay under ~18 chars or the pill fights
   * the cursor's movement. Every label needs an accessible-text equivalent
   * on the same element — the cursor is never the sole carrier (§8.4.6). */
  cursorLabel: string;
};

/**
 * Primary navigation, right-aligned in the header (§2.3).
 *
 * Note "AI Workflow", not the mockup's "Ai Workflow" — "Ai" reads as a typo
 * and this label is doing brand work (§2.3 labelling decisions).
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "My Work", href: "/work", cursorLabel: "Go to my work" },
  { label: "About Me", href: "/about", cursorLabel: "Meet Duminda" },
  { label: "AI Workflow", href: "/ai-workflow", cursorLabel: "See the tricks" },
  { label: "Work With Me", href: "/work-with-me", cursorLabel: "Let's talk" },
];

export type SocialLink = {
  label: string;
  href: string;
  cursorLabel: string;
};

/**
 * Footer social row — text links only, no icons (§9.7).
 *
 * ⚠️ PLACEHOLDER DESTINATIONS. The mockup listed "LinkedIn" three times; these
 * are the recommended set from §2.3 but the URLs are guesses. Open question
 * §13.6 — confirm the real handles, and whether Behance is current, before
 * launch.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/", // TODO §13.6 — real handle
    cursorLabel: "Go to LinkedIn",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/", // TODO §13.6 — real handle
    cursorLabel: "Go to Instagram",
  },
  {
    label: "Behance",
    href: "https://behance.net/", // TODO §13.6 — confirm still current
    cursorLabel: "Go to Behance",
  },
  {
    label: "Email",
    href: "mailto:hello@example.com", // TODO §13.6 — real address
    cursorLabel: "Say hello",
  },
];

export const SITE = {
  name: "Duminda M",
  role: "Senior Creative Director",
  /** Footer statement. Year is injected at render, not hardcoded (§9.7). */
  copyright: (year: number) =>
    `Site Content © Duminda M · All Rights Reserved · ${year} · Made With Love & Caffeine`,
} as const;
