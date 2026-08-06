import type { Project } from "@/lib/content/schema";

/**
 * Mock project data.
 *
 * ⚠️ ALL COPY IS PLACEHOLDER. Every title, summary, and body string below is
 * scaffolding, not real content — see §13.8 and §13.13. The wording is
 * deliberately obvious ("Placeholder", "Sample") so nothing ships by accident,
 * but the LENGTHS are realistic so line breaks, card density, and column
 * measure can be judged properly.
 *
 * The first four slugs, disciplines, and tiers are real (§5 seed table). The
 * last four are invented purely to populate the grid and exercise the filter —
 * delete them once real projects land.
 *
 * Imagery is Unsplash. Replace with Gumlet assets in Phase 2.
 */

/** Unsplash with explicit sizing so next/image gets a stable, cacheable URL. */
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PROJECTS: Project[] = [
  // ---------------------------------------------------------------------
  // Real slugs from §5. Copy is still placeholder.
  // ---------------------------------------------------------------------
  {
    slug: "threejs-fractal-viewer",
    title:
      "Placeholder title for the Three.js fractal viewer — a real sentence goes here.",
    client: "Self-initiated",
    year: 2025,
    tier: 1,
    discipline: "3d-code",
    tags: ["Creative Coding", "Web", "AI-Assisted"],
    featured: true,
    featuredOrder: 1,
    cover: {
      kind: "image",
      src: unsplash("1633356122544-f134324a6cee"),
      alt: "Placeholder cover image — replace with the real project still.",
      aspect: "16/9",
      hasAudio: false,
    },
    summary:
      "Placeholder summary. This sits under the card title and runs to roughly the length a real two-line description would occupy on the work index.",
    role: "Design, code, and everything in between",
    tools: ["Three.js", "GLSL", "React", "TypeScript"],
    isPublic: true,
    body: [
      {
        kind: "lead",
        text: "Placeholder lead paragraph. It opens the case study and carries the one-sentence version of why this project mattered, at about the length real lead copy would run.",
      },
      {
        kind: "stats",
        items: [
          { label: "Timeline", value: "Placeholder" },
          { label: "Role", value: "Placeholder" },
          { label: "Year", value: "2025" },
        ],
      },
      {
        kind: "section",
        heading: "Placeholder section heading",
        paragraphs: [
          "Placeholder body paragraph. Real case study prose goes here and runs long enough to show how the measure holds at the container width, which is the thing worth checking at this stage.",
          "A second placeholder paragraph, so the vertical rhythm between stacked paragraphs is visible and can be judged against the design.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: unsplash("1635070041078-e363dbe005cb"),
          alt: "Placeholder inline image — replace with a real process shot.",
          aspect: "16/9",
          hasAudio: false,
        },
        caption: "Placeholder caption for an inline case study image.",
      },
      {
        kind: "pullquote",
        text: "Placeholder pullquote. Short, punchy, and set large — this is where a real quote would land.",
      },
      {
        kind: "section",
        heading: "Another placeholder heading",
        paragraphs: [
          "Placeholder closing paragraph. Long enough to show the block spacing before the next/prev navigation at the foot of the case study.",
        ],
      },
    ],
  },
  {
    slug: "endeavor-design-system",
    title:
      "Placeholder title for the Endeavor design system — framed as leadership, not deliverables.",
    client: "Endeavor",
    year: 2024,
    tier: 1,
    discipline: "ui-ux",
    tags: ["Design System", "Web", "Team Lead"],
    featured: true,
    featuredOrder: 2,
    cover: {
      kind: "image",
      src: unsplash("1618788372246-79faff0c3742"),
      alt: "Placeholder cover image — replace with the real project still.",
      aspect: "16/9",
      hasAudio: false,
    },
    summary:
      "Placeholder summary for the design system case study, written to approximately the length the real description will occupy in the grid.",
    role: "Design lead",
    tools: ["Figma", "Storybook", "Tokens Studio"],
    isPublic: true,
    body: [
      {
        kind: "lead",
        text: "Placeholder lead paragraph for the design system narrative, at roughly the length real opening copy would run.",
      },
      {
        kind: "stats",
        items: [
          { label: "Team", value: "Placeholder" },
          { label: "Duration", value: "Placeholder" },
          { label: "Year", value: "2024" },
        ],
      },
      {
        kind: "section",
        heading: "Placeholder section heading",
        paragraphs: [
          "Placeholder body paragraph describing the process, running to a realistic length so the column measure can be evaluated.",
          "A second placeholder paragraph for vertical rhythm.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: unsplash("1586717791821-3f44a563fa4c"),
          alt: "Placeholder inline image — replace with real component documentation.",
          aspect: "16/9",
          hasAudio: false,
        },
        caption: "Placeholder caption for a design system artefact.",
      },
      {
        kind: "pullquote",
        text: "Placeholder pullquote about systems thinking and the value of shared language.",
      },
    ],
  },
  {
    slug: "lumin-fitness-motion",
    title:
      "Placeholder title for the Lumin fitness motion work — the motion design hero.",
    client: "Lumin",
    year: 2024,
    tier: 1,
    discipline: "motion",
    tags: ["Reel", "Mobile", "Broadcast"],
    featured: true,
    featuredOrder: 3,
    cover: {
      kind: "image",
      src: unsplash("1517836357463-d25dfeac3438"),
      alt: "Placeholder cover image — replace with the real project still.",
      aspect: "16/9",
      hasAudio: false,
    },
    summary:
      "Placeholder summary for the motion design case study, sized to match the eventual real copy in the featured card.",
    role: "Motion design",
    tools: ["After Effects", "Cinema 4D", "Rive"],
    isPublic: true,
    body: [
      {
        kind: "lead",
        text: "Placeholder lead paragraph for the motion case study, at a realistic opening length.",
      },
      {
        kind: "stats",
        items: [
          { label: "Deliverables", value: "Placeholder" },
          { label: "Role", value: "Placeholder" },
          { label: "Year", value: "2024" },
        ],
      },
      {
        kind: "section",
        heading: "Placeholder section heading",
        paragraphs: [
          "Placeholder body paragraph about the motion language and how it was built, long enough to judge the measure.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: unsplash("1574680096145-d05b474e2155"),
          alt: "Placeholder inline image — replace with a real motion frame.",
          aspect: "16/9",
          hasAudio: false,
        },
      },
    ],
  },
  {
    slug: "wiggl-sxsw-animation",
    title: "Placeholder title for the Wiggl SXSW animation — details pending.",
    client: "Wiggl",
    year: 2023,
    tier: 2,
    discipline: "motion",
    tags: ["Installation", "Character"],
    featured: false,
    cover: {
      kind: "image",
      src: unsplash("1492684223066-81342ee5ff30"),
      alt: "Placeholder cover image — replace with the real project still.",
      aspect: "16/9",
      hasAudio: false,
    },
    summary:
      "Placeholder summary for the SXSW animation piece, at approximately the real description length.",
    role: "Animation",
    tools: ["After Effects", "Blender"],
    isPublic: true,
    body: [
      {
        kind: "lead",
        text: "Placeholder lead paragraph for this Tier 2 scroll piece, shorter than a full narrative case study.",
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: unsplash("1470229722913-7ea0d7ea3d0f"),
          alt: "Placeholder inline image — replace with real installation footage.",
          aspect: "16/9",
          hasAudio: false,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------
  // ⚠️ INVENTED. These four exist only to populate the grid and exercise the
  // discipline + tag filters. Delete them when real projects land.
  // ---------------------------------------------------------------------
  {
    slug: "placeholder-commerce-platform",
    title:
      "Placeholder project title for an invented commerce platform redesign.",
    client: "Placeholder Client",
    year: 2023,
    tier: 2,
    discipline: "ui-ux",
    tags: ["Design System", "Web", "Mobile"],
    featured: false,
    cover: {
      kind: "image",
      src: unsplash("1467232004584-a241de8bcf5d"),
      alt: "Placeholder cover image for an invented project.",
      aspect: "16/9",
      hasAudio: false,
    },
    summary:
      "Invented placeholder project. Exists to populate the work index and exercise the filter — delete before launch.",
    role: "Placeholder",
    tools: ["Figma"],
    isPublic: true,
    body: [
      {
        kind: "lead",
        text: "Placeholder lead paragraph for an invented project.",
      },
    ],
  },
  {
    slug: "placeholder-brand-identity",
    title: "Placeholder project title for an invented brand identity system.",
    client: "Placeholder Client",
    year: 2023,
    tier: 2,
    discipline: "ui-ux",
    tags: ["Design System", "Prototype"],
    featured: false,
    cover: {
      kind: "image",
      src: unsplash("1523726491678-bf852e717f6a"),
      alt: "Placeholder cover image for an invented project.",
      aspect: "16/9",
      hasAudio: false,
    },
    summary:
      "Invented placeholder project. Exists to populate the work index and exercise the filter — delete before launch.",
    role: "Placeholder",
    tools: ["Figma", "Illustrator"],
    isPublic: true,
    body: [
      {
        kind: "lead",
        text: "Placeholder lead paragraph for an invented project.",
      },
    ],
  },
  {
    slug: "placeholder-generative-shaders",
    title: "Placeholder project title for an invented generative shader study.",
    year: 2025,
    tier: 2,
    discipline: "3d-code",
    tags: ["Shader", "Creative Coding", "Web"],
    featured: false,
    cover: {
      kind: "image",
      src: unsplash("1550745165-9bc0b252726f"),
      alt: "Placeholder cover image for an invented project.",
      aspect: "16/9",
      hasAudio: false,
    },
    summary:
      "Invented placeholder project. Exists to populate the work index and exercise the filter — delete before launch.",
    role: "Placeholder",
    tools: ["GLSL", "Three.js"],
    isPublic: true,
    body: [
      {
        kind: "lead",
        text: "Placeholder lead paragraph for an invented project.",
      },
    ],
  },
  {
    slug: "placeholder-broadcast-package",
    title: "Placeholder project title for an invented broadcast title package.",
    client: "Placeholder Client",
    year: 2022,
    tier: 3,
    discipline: "motion",
    tags: ["Broadcast", "Reel"],
    featured: false,
    cover: {
      kind: "image",
      src: unsplash("1478720568477-152d9b164e26"),
      alt: "Placeholder cover image for an invented project.",
      aspect: "16/9",
      hasAudio: false,
    },
    summary:
      "Invented placeholder project. Exists to populate the work index and exercise the filter — delete before launch.",
    role: "Placeholder",
    tools: ["After Effects"],
    isPublic: true,
    body: [
      {
        kind: "lead",
        text: "Placeholder lead paragraph for an invented project.",
      },
    ],
  },
];
