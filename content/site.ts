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
  name: "Duminda Madushan",
  role: "Director of Design",
  /** WhatsApp chat link. wa.me wants the number without "+" or the
   * leading 0 after the country code: +94 (0)70 214 0827. */
  whatsapp: "https://wa.me/94702140827",
  /** Footer statement. Year is injected at render, not hardcoded (§9.7). */
  copyright: (year: number) =>
    `Site content © Duminda Madushan · All rights reserved · ${year} · Made with love & caffeine`,
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
    "Storytelling",
    "Design Strategy",
    "Motion Design",
    "3D Modeling",
    "2D Animation",
    "Illustration",
    "Ai Augmentation",
    "Ai+Coding",
    "Ai+Design Audit",
    "AI Design Direction",
    "AI System Design",
  ],
} as const;

export type CvRole = {
  title: string;
  company: string;
  place: string;
  dates: string;
  /** One line from the CV. Roles the CV lists without detail have none. */
  highlight?: string;
};

/**
 * The CV, as read on Work with me. Every line is from
 * public/cv/duminda-madushan-resume.pdf: update the two together.
 *
 * ⚠️ Ahead of the PDF since 2026-11-22: the intro, the Director of Design
 * entry and the Head of Motion end date come from the content brief. The PDF
 * still shows the old title and timeline until it is re-exported.
 */
export const CV = {
  name: "Duminda Madushan",
  title: "Director of Design",
  /** The identity line from the content brief. It opens the resume. */
  intro:
    "I'm Duminda Madushan, Director of Design at Precious Studio. Full-stack designer, meaning I design it, animate it and build it in 3D. Based in Sri Lanka.",
  summary:
    "10+ years across interaction design, motion graphics and 3D animation. I lead teams, and I can take a project from concept to delivery.",
  pdf: "/cv/duminda-madushan-resume.pdf",
  roles: [
    {
      // The Senior Consultant role is folded in here (content brief).
      title: "Director of Design",
      company: "Precious Studio",
      place: "Austin, TX",
      dates: "2025 – now",
      highlight:
        "Advising clients on motion, product and interface direction, and turning a business goal into a scope.",
    },
    {
      title: "Head of Motion Design",
      company: "Precious Studio",
      place: "Austin, TX",
      dates: "2023 – 2025",
      highlight:
        "Streamlined client discovery so deliveries close in 2 rounds of revisions. I also mentor the design team.",
    },
    {
      title: "Senior Creative Director",
      company: "Precious Studio",
      place: "Austin, TX",
      dates: "2021 – 2023",
      highlight:
        "Part of the core team that ranked the studio among Clutch's Top B2B Companies in Texas, 2022, within a year of opening.",
    },
    {
      title: "Motion Designer",
      company: "Thiken",
      place: "Austin, TX",
      dates: "2018 – 2021",
      highlight: "Lottie, 2D and 3D animation, storyboards and animatics.",
    },
    {
      title: "Experience Designer",
      company: "Xcendant",
      place: "Nugegoda, Sri Lanka",
      dates: "2016 – 2017",
    },
    {
      title: "Senior User Interface Designer",
      company: "Arimac Lanka",
      place: "Colombo, Sri Lanka",
      dates: "2015 – 2016",
    },
  ] satisfies CvRole[],
  education: "BA (Hons.) Graphic Design, Northumbria University",
  languages: "English (fluent), Sinhala (native)",
} as const;
