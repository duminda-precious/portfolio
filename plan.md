# Portfolio Site — Build Plan

**Owner:** Duminda M · Senior Creative Director
**Purpose:** Personal portfolio serving three audiences simultaneously — hiring managers/recruiters (full-time roles), prospective freelance clients, and personal brand development.
**Voice:** Playful, witty, casual, human. Never formal or technical. This applies to UI copy, error states, and empty states too — not just headlines.

This document is the source of truth for scaffolding. Read it fully before writing code. Where a decision is marked `CONFIRM`, stop and ask rather than guessing.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Information Architecture](#2-information-architecture)
3. [Design Tokens](#3-design-tokens)
4. [Project & File Structure](#4-project--file-structure)
5. [Content Model](#5-content-model)
6. [Media Strategy (Gumlet + Local)](#6-media-strategy-gumlet--local)
7. [Component Architecture](#7-component-architecture)
8. [The Dynamic Cursor](#8-the-dynamic-cursor)
9. [Homepage Build Spec](#9-homepage-build-spec)
10. [Motion Spec](#10-motion-spec)
11. [Accessibility & Performance Floor](#11-accessibility--performance-floor)
12. [Build Phases](#12-build-phases)
13. [Open Questions](#13-open-questions)

---

## 1. Tech Stack

### Core

| Layer         | Choice                                               | Why                                                                                                                                                                        |
| ------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework     | **Next.js 15+, App Router, TypeScript (strict)**     | Image/font optimisation, route-level metadata for SEO, easy path to MDX case studies and later CMS. Server components keep the JS bundle honest despite heavy motion work. |
| Styling       | **Tailwind CSS v4** with CSS-first `@theme`          | v4's `@theme` block means design tokens live as real CSS custom properties _and_ become Tailwind utilities from one definition. No `tailwind.config.js` token duplication. |
| Animation     | **GSAP 3 + ScrollTrigger**                           | Scroll-driven reveals, pinned sections, and the cursor lerp all in one system. `gsap.quickTo()` is the right tool for 60fps cursor tracking.                               |
| Smooth scroll | **Lenis** (`lenis`)                                  | Pairs cleanly with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`. Must be disabled under `prefers-reduced-motion`.                                          |
| Content       | **Local TS + MDX**, behind a repository layer        | See [§5](#5-content-model). CMS-ready without being CMS-dependent.                                                                                                         |
| Video         | **Gumlet** (primary) + **local files** (micro-loops) | See [§6](#6-media-strategy-gumlet--local).                                                                                                                                 |
| Deploy        | **Vercel**                                           | Zero-config for Next.js, preview deploys per branch, edge caching for the static shell.                                                                                    |
| Analytics     | **Vercel Analytics** or **Plausible**                | Privacy-first, no cookie banner needed. Avoid GA4 — it forces a consent banner that will ruin the hero.                                                                    |

### Supporting

```
gsap                        # + ScrollTrigger (free tier covers everything here)
lenis                       # smooth scroll
@rive-app/react-canvas      # Rive playback (motion case studies)
lottie-react               # Lottie playback
clsx + tailwind-merge      # conditional classes
next-mdx-remote            # or @next/mdx — MDX case study bodies
zod                        # validate content objects at build time
sharp                      # image pipeline (Next.js peer dep)
hls.js                     # ONLY if Gumlet HLS is used for non-Safari
```

### Explicitly not using

- **No Framer Motion.** Overlaps GSAP and doubles the animation bundle. If a component genuinely needs layout animation, revisit — don't add both by default.
- **No component library** (shadcn, MUI, etc). Everything here is bespoke; a library adds abstraction over ~15 components.
- **No state manager.** Cursor state is React Context (or a tiny store); nothing else needs global state.
- **No CMS in v1.** Committed to by decision — see [§5](#5-content-model).

### Recommended Node/tooling baseline

- Node 20 LTS or 22 LTS
- `pnpm` (fast, strict about phantom deps)
- ESLint + Prettier with `prettier-plugin-tailwindcss`
- `next lint` in CI; `tsc --noEmit` as a separate CI step

---

## 2. Information Architecture

### 2.1 Organisation scheme

**Hybrid**: primary nav organised by _audience task_ (see the work / know the person / understand the process / hire me), while the work itself is organised by an **ambiguous scheme (by discipline)** with **faceted tags** layered on top.

This matters because the three audiences arrive with different questions:

| Audience                   | Their question                                  | Entry point                           |
| -------------------------- | ----------------------------------------------- | ------------------------------------- |
| Recruiter / hiring manager | "Can this person lead and ship?"                | Homepage hero → featured case studies |
| Freelance client           | "Can this person do the specific thing I need?" | My Work → discipline filter           |
| Peer / brand follower      | "Is this person interesting?"                   | Things That Kept Me Up → AI Workflow  |

### 2.2 Sitemap

| ID  | Page         | Parent | Level | URL             | Template    | Notes                                              |
| --- | ------------ | ------ | ----- | --------------- | ----------- | -------------------------------------------------- |
| 1   | Home         | —      | 0     | `/`             | `Homepage`  | Video hero, 3 featured, experiments grid           |
| 2   | My Work      | 1      | 1     | `/work`         | `WorkIndex` | All Tier 1 + Tier 2, filterable                    |
| 3   | Case Study   | 2      | 2     | `/work/[slug]`  | `CaseStudy` | Tier 1 = full narrative; Tier 2 = scroll piece     |
| 4   | About Me     | 1      | 1     | `/about`        | `About`     | Origin story + philosophy + credentials            |
| 5   | AI Workflow  | 1      | 1     | `/ai-workflow`  | `Editorial` | "How I Cheat (With Taste)"                         |
| 6   | Work With Me | 1      | 1     | `/work-with-me` | `Contact`   | Availability, services, contact                    |
| 7   | Experiments  | 1      | 1     | `/experiments`  | `Gallery`   | Optional overflow for "Things That Kept Me Up"     |
| —   | 404          | —      | —     | `/*`            | `NotFound`  | Witty, in voice. An empty screen is an invitation. |

**Depth: 3 levels max.** Flat by design — this is a 6-page site, and anything deeper hurts findability for a recruiter who has 90 seconds.

### 2.3 Navigation model

```
Global (header, right-aligned):
├── My Work        → /work
├── About Me       → /about
├── AI Workflow    → /ai-workflow
└── Work With Me   → /work-with-me   [treat as CTA-weighted, not visually loud]

Contextual (in-page):
├── Homepage featured cards → /work/[slug]
├── Case study footer       → next/prev case study
└── Gallery tile            → lightbox (not a route)

Footer:
├── Row 1: copyright statement (large type, part of the design)
└── Row 2: LinkedIn · Instagram · Behance · Email   [text links, no icons]
```

**Labelling decisions:**

- `Ai Workflow` in the mockup → render as **`AI Workflow`**. "Ai" reads as a typo, and this label is doing brand work.
- `Work With Me` is the strongest of the available options — clearer than "Contact", warmer than "Hire Me". Keep it.
- `My Work` (not "Work" or "Portfolio") — the possessive matches the site's first-person voice.
- Footer social row: **replace the three `LinkedIn` placeholders** with real destinations. Recommended set: `LinkedIn · Instagram · Behance · Email`. Behance/Dribbble is a judgement call — include only if the profile is current.

### 2.4 Taxonomy (faceted, for work items)

```
Discipline (primary facet — one per project, drives grouping)
├── UI/UX & Design Systems
├── Motion Design
└── 3D & Creative Coding

Tags (secondary facet — many per project, shown as the blue eyebrow)
├── Platform:  Web · Mobile · Installation · Broadcast
├── Artefact:  Design System · Prototype · Reel · Character · Shader
└── Method:    AI-Assisted · Creative Coding · Team Lead

Tier (internal only — controls template + homepage eligibility)
├── 1 — Hero: full narrative case study
├── 2 — Scroll piece: visual + brief context
└── 3 — Gallery item / reel fodder
```

`tier` is **not** user-facing. It drives which template renders and whether an item can appear in the homepage featured slots.

The homepage eyebrow (`Design System · Web · Mobile`) is a rendered join of the `tags` array. Data-driven, not hardcoded.

---

## 3. Design Tokens

Tokens are defined **once** in `src/styles/tokens.css` inside a Tailwind v4 `@theme` block, making them available as both CSS variables and Tailwind utilities.

### 3.1 Colour

✅ **CONFIRMED 2026-08-06** — hex values supplied from the design source. The brand
gives seven values: two blues and five neutrals. The remaining ramp steps are
interpolated from the two blue anchors and are not themselves brand-supplied.

```css
@theme {
  /* Brand — the blue does a lot of work here: accent type, media placeholders, links.
   * 500 and 700 are the supplied anchors; everything else is interpolated. */
  --color-brand-50: #f2f5fe;
  --color-brand-100: #e2e7fd;
  --color-brand-200: #c4d0fb;
  --color-brand-300: #9baef7;
  --color-brand-400: #6986f3;
  --color-brand-500: #2e57ef; /* ✅ brand blue — media fill, accent type */
  --color-brand-600: #1e44d5;
  --color-brand-700: #1035bf; /* ✅ deep blue — the AA-safe blue, see §3.2 */
  --color-brand-800: #0c268a;
  --color-brand-900: #081b60;

  /* Neutrals */
  --color-ink: #1f1f1f; /* ✅ headings + body */
  --color-ink-muted: #747474; /* ✅ captions — PAPER ONLY, see §3.2 */
  --color-paper: #ffffff; /* ✅ the 1280px content container */
  --color-surface: #f8f8f8; /* ✅ subtle off-white fill, inset panels */
  --color-page: #cfcfcf; /* ✅ page background behind the container */
  --color-chip: #cfcfcf; /* "Scroll For My Work" pill background */
  --color-hairline: #e4e4e4;
}
```

**The two blues are not interchangeable.** `brand-500` is the media/accent blue that
fills every placeholder in the mockup. `brand-700` is the _accessible_ blue — required
for any blue text sitting on the grey page background. See the audit below.

### 3.2 Contrast audit (WCAG 2.1 AA)

Re-run against the confirmed palette. These are computed values, and the same maths
runs live at `/tokens` so this table can be verified rather than trusted.

| Pair                             | Ratio      | Normal text  | Large text | Verdict                                |
| -------------------------------- | ---------- | ------------ | ---------- | -------------------------------------- |
| `ink` #1F1F1F on `paper`         | 16.48:1    | ✅ AAA       | ✅ AAA     | Ship it                                |
| `ink` #1F1F1F on `page`          | 10.58:1    | ✅ AAA       | ✅ AAA     | Footer copy is fine                    |
| `ink-muted` #747474 on `paper`   | 4.67:1     | ✅ AA        | ✅ AA      | OK — do not lighten further            |
| `ink-muted` #747474 on `page`    | **3.00:1** | ❌ **FAILS** | ✅ AA      | ⚠️ Large text only. Paper-only colour. |
| `brand-500` on `paper`           | 5.64:1     | ✅ AA        | ✅ AA      | Eyebrow tags are safe on white         |
| `brand-500` on `page`            | **3.62:1** | ❌ **FAILS** | ✅ AA      | ⚠️ Use `brand-700` instead on grey     |
| `brand-700` on `page`            | **5.90:1** | ✅ AA        | ✅ AA      | ✅ The fix — blue body text on grey    |
| `brand-700` on `paper`           | 9.20:1     | ✅ AAA       | ✅ AAA     | Links inside the white container       |
| `brand-500` on `surface` #F8F8F8 | 5.31:1     | ✅ AA        | ✅ AA      | Accent type on the off-white fill      |
| `paper` on `brand-500`           | 5.64:1     | ✅ AA        | ✅ AA      | Cursor pill label is safe (§8.3)       |
| `paper` on `brand-700`           | 9.20:1     | ✅ AAA       | ✅ AAA     | White on deep blue — inverted surfaces |
| `ink` on `chip` #CFCFCF          | 10.58:1    | ✅ AAA       | ✅ AAA     | Scroll chip label is fine              |

**Three binding rules from this:**

1. **Blue text on grey must be `brand-700`, never `brand-500`.** The mockup's accent
   blue fails AA at body size on the page background (3.62:1). The deep blue passes
   (5.90:1). This replaces the original "only use brand blue at ≥24px" workaround —
   we now have a colour that just works.
2. **`ink-muted` is a paper-only colour.** At exactly 3.00:1 on the grey page it sits
   on the large-text threshold and fails for anything smaller. Captions therefore
   belong inside the white container. Any muted text that must sit on grey gets `ink`.
3. The nav items in the mockup read as a light grey (~#8A8A8A), which fails against the
   page background. **Fix:** render nav labels in `--color-ink` with a subtle backdrop
   treatment, given they sit over unpredictable video. See [§9.2](#92-header--nav).

### 3.3 Typography

**`CONFIRM` the display face.** The mockup shows a geometric grotesque with a single-storey-feeling `a`, tight apertures, and a distinctive `g` — consistent with **Aeonik**, **General Sans**, or **Cabinet Grotesk**. Do not guess: pull the family name from the Figma text layer.

Fallback recommendation if the licence is a problem: **General Sans** (Fontshare, free for commercial use) for display, **Satoshi** for body/UI. Both are geometric grotesques that hold the same personality at scale.

```css
@theme {
  --font-display: "CONFIRM", "General Sans", system-ui, sans-serif;
  --font-body: "CONFIRM", "Satoshi", system-ui, sans-serif;
  --font-mono:
    "Fira Code", ui-monospace, monospace; /* code in AI Workflow page */
}
```

Fluid scale (`clamp()`, 1.25 ratio at desktop, compressed at mobile):

```css
@theme {
  --text-hero: clamp(2.5rem, 1.2rem + 5.4vw, 5.5rem); /* homepage h1 */
  --text-display: clamp(
    2rem,
    1.2rem + 3.4vw,
    3.75rem
  ); /* section titles, footer */
  --text-h2: clamp(1.5rem, 1.1rem + 1.8vw, 2.25rem);
  --text-h3: clamp(1.25rem, 1.05rem + 0.9vw, 1.5rem);
  --text-lead: clamp(
    1.125rem,
    1rem + 0.6vw,
    1.375rem
  ); /* project card titles */
  --text-body: clamp(1rem, 0.96rem + 0.2vw, 1.125rem);
  --text-caption: 0.8125rem; /* gallery captions, eyebrow tags */
}
```

Line heights and tracking — the hero in the mockup is set **very tight**, and that tightness is part of the identity:

```css
--leading-hero: 0.95;
--leading-tight: 1.05;
--leading-body: 1.55;
--tracking-hero: -0.03em;
--tracking-tight: -0.015em;
```

### 3.4 Spacing (8pt grid)

```css
@theme {
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
  --spacing-32: 128px;

  /* Responsive section rhythm */
  --space-section: clamp(3rem, 2rem + 5vw, 7.5rem); /* 48px → 120px */
  --space-gutter: clamp(1rem, 0.5rem + 2.5vw, 2.5rem);
}
```

### 3.5 Layout

```css
@theme {
  --container-max: 1280px; /* the white content container */
  --container-pad: var(--space-gutter);
  --grid-gallery: 3; /* columns in the experiments grid at desktop */
}
```

Breakpoints — Tailwind v4 defaults are fine and match the skill's recommended scale:
`sm 480 · md 640 · lg 768 · xl 1024 · 2xl 1280`

### 3.6 Motion & radius

```css
@theme {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-pill: 999px; /* the CTA chip, cursor pill */

  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 600ms;
  --duration-reveal: 900ms;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
}
```

Note: media containers in the mockup have **square corners**. Keep `--radius-none` as the default for media; the pill radius is reserved for the CTA chip and the cursor.

### 3.7 Z-index

```css
--z-base: 0;
--z-media: 10;
--z-header: 100;
--z-lightbox: 200;
--z-cursor: 9999; /* cursor is always on top of everything */
```

---

## 4. Project & File Structure

```
portfolio/
├── plan.md                          ← this file
├── public/
│   ├── logo.png                     ← PNG logo per brief (also add @2x + .svg later)
│   ├── video/loops/                 ← LOCAL micro-loops (gallery tiles)
│   └── fonts/                       ← self-hosted woff2
├── content/
│   ├── projects/
│   │   ├── threejs-fractal-viewer.mdx
│   │   ├── endeavor-design-system.mdx
│   │   ├── lumin-fitness-motion.mdx
│   │   └── wiggl-sxsw-animation.mdx
│   ├── experiments.ts               ← Tier 3 gallery items
│   └── site.ts                      ← nav, socials, meta, availability
├── src/
│   ├── app/
│   │   ├── layout.tsx               ← fonts, CursorProvider, Lenis, Header, Footer
│   │   ├── page.tsx                 ← Homepage
│   │   ├── work/page.tsx
│   │   ├── work/[slug]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── ai-workflow/page.tsx
│   │   ├── work-with-me/page.tsx
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── primitives/              ← Container, Eyebrow, Chip, TextLink, Caption
│   │   ├── media/                   ← Media, GumletVideo, LocalLoop, LazyMedia, Lightbox
│   │   ├── cursor/                  ← CursorProvider, CursorRenderer, useCursor
│   │   ├── layout/                  ← Header, Footer, Nav
│   │   └── sections/                ← VideoHero, HeroStatement, FeaturedWork,
│   │                                  FeaturedCard, ExperimentsGrid, ExperimentTile
│   ├── lib/
│   │   ├── content/                 ← ⚠️ THE CMS SEAM. See §5.
│   │   │   ├── index.ts             ← getProjects, getProject, getExperiments, getSite
│   │   │   ├── local.ts             ← reads content/ — the only file a CMS swap replaces
│   │   │   └── schema.ts            ← zod schemas + inferred TS types
│   │   ├── media/gumlet.ts          ← URL builders for Gumlet assets
│   │   ├── motion/                  ← gsap registration, useReveal, useLenis
│   │   └── utils/cn.ts
│   ├── hooks/                       ← usePrefersReducedMotion, useIsTouch, useInView
│   └── styles/
│       ├── globals.css
│       └── tokens.css               ← @theme block from §3
```

**Architectural rule for Claude Code:** no component imports from `content/` directly. Everything goes through `src/lib/content/`. This single rule is what makes the later CMS migration a one-file change instead of a refactor.

---

## 5. Content Model

Local-first, CMS-shaped. Validate with zod at build time so a typo in a content file fails the build rather than rendering `undefined`.

```ts
// src/lib/content/schema.ts
import { z } from "zod";

export const MediaSchema = z.object({
  kind: z.enum(["gumlet-video", "local-loop", "image"]),
  src: z.string(), // Gumlet asset ID, /public path, or image path
  poster: z.string().optional(), // required for video — first frame, prevents flash
  alt: z.string(), // required. Non-negotiable.
  aspect: z.enum(["16/9", "4/3", "1/1", "3/4"]).default("16/9"),
  hasAudio: z.boolean().default(false),
});

export const ProjectSchema = z.object({
  slug: z.string(),
  title: z.string(), // homepage card title — a full sentence, per mockup
  client: z.string().optional(),
  year: z.number(),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  discipline: z.enum(["ui-ux", "motion", "3d-code"]),
  tags: z.array(z.string()).min(1), // renders as the blue eyebrow
  featured: z.boolean().default(false), // eligible for homepage slots
  featuredOrder: z.number().optional(),
  cover: MediaSchema,
  summary: z.string().max(280),
  role: z.string().optional(),
  tools: z.array(z.string()).default([]),
  isPublic: z.boolean().default(true), // false = needs anonymisation before shipping
});

export const ExperimentSchema = z.object({
  id: z.string(),
  caption: z.string(), // the small grey line under each tile
  media: MediaSchema,
  gridSpan: z.union([z.literal(1), z.literal(2)]).default(1),
  order: z.number(),
});
```

Case study **bodies** live in MDX frontmatter + content. Frontmatter maps to `ProjectSchema`; the MDX body is the narrative, with custom components available: `<Media />`, `<Pullquote />`, `<Compare />`, `<TokenTable />`, `<Aside />`.

**Seed content to scaffold with** (from existing inventory):

| slug                     | tier | discipline | notes                                                   |
| ------------------------ | ---- | ---------- | ------------------------------------------------------- |
| `threejs-fractal-viewer` | 1    | 3d-code    | Lead hero — breadth of design + code + AI               |
| `endeavor-design-system` | 1    | ui-ux      | Frame as leadership/process narrative, not deliverables |
| `lumin-fitness-motion`   | 1    | motion     | Motion design hero                                      |
| `wiggl-sxsw-animation`   | 2    | motion     | Scroll piece; details pending                           |

Scaffold the three Tier 1 projects as the homepage featured slots. Everything else can be placeholder until copy lands.

**CMS migration path (do not build now, but do not foreclose):** when moving to Sanity, only `src/lib/content/local.ts` is replaced by `sanity.ts`. Schemas above become the Sanity document schemas near-verbatim. Keep all content functions `async` from day one so the swap doesn't force a sync→async refactor across every page.

---

## 6. Media Strategy (Gumlet + Local)

### 6.1 The split

| Asset type                           | Host                               | Rationale                                                                                    |
| ------------------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| Hero background loop                 | **Gumlet**                         | Largest single asset on the site. Adaptive bitrate + per-device renditions matter most here. |
| Featured project videos (3× 16:9)    | **Gumlet**                         | Above the fold on scroll, high visual weight.                                                |
| Case study inline video              | **Gumlet**                         | Length and quantity make CDN delivery worth it.                                              |
| Showreel                             | **Gumlet**                         | Has audio, needs a real player with controls.                                                |
| "Things That Kept Me Up" micro-loops | **Local** (`/public/video/loops/`) | Confirmed by decision — and correct. See below.                                              |
| Stills, diagrams, screenshots        | **Local** via `next/image`         | Free optimisation, AVIF/WebP, blur placeholder.                                              |
| Rive / Lottie                        | **Local**                          | Small, and needs to run in-process for interactivity.                                        |

### 6.2 Why local is right for the micro-loops

Eight-plus tiles on the homepage. Each Gumlet-hosted video means a separate player init, manifest fetch, and network round trip. For 2–4 second silent loops the _overhead_ exceeds the payload. Local files served from Vercel's edge cache, encoded tight, will feel faster.

**Encoding recipe for micro-loops — enforce this or the page will be heavy:**

```bash
# Target: ≤400KB each, 2-4s, silent, 720p max
ffmpeg -i in.mov -an \
  -vf "scale=-2:720,fps=24" \
  -c:v libx264 -crf 26 -preset slow -profile:v main -pix_fmt yuv420p \
  -movflags +faststart out.mp4

# WebM/VP9 sibling — often 30-40% smaller, served first via <source>
ffmpeg -i in.mov -an -vf "scale=-2:720,fps=24" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 out.webm

# Poster frame
ffmpeg -i in.mov -vframes 1 -q:v 2 poster.jpg
```

`-an` (strip audio) is important twice over: it saves bytes, and a video with no audio track cannot be blocked by autoplay policy.

**Budget: total weight of all local loops ≤ 3MB.** If it exceeds that, move the overflow to Gumlet or cut tiles.

### 6.3 Gumlet integration

Build `src/lib/media/gumlet.ts` as a thin URL builder — do **not** reach for Gumlet's web-component player for background loops, which need to be bare `<video>` elements with no chrome.

```ts
// Shape only — CONFIRM actual Gumlet URL patterns and collection ID from the dashboard.
export function gumletVideoUrl(
  assetId: string,
  opts?: { quality?: "auto" | "720p" | "1080p" },
): string;
export function gumletPosterUrl(assetId: string, opts?: { t?: number }): string;
export function gumletHlsUrl(assetId: string): string;
```

Two delivery modes, pick per asset:

- **Progressive MP4** — simplest. Use for the hero loop and the three featured cards. One request, native `<video>`, no JS.
- **HLS via `hls.js`** — use only for the showreel and any video over ~30s, where adaptive bitrate earns its complexity. Safari plays HLS natively; load `hls.js` dynamically for everything else so it never enters the main bundle.

### 6.4 The `<Media />` abstraction — build this first

Every blue box in the mockup renders through one component. This is the single most important piece of media architecture:

```tsx
<Media
  kind="gumlet-video" | "local-loop" | "image"
  src={...}
  poster={...}
  alt={...}
  aspect="16/9"
  playback="in-view" | "hover" | "always" | "click"
  cursorLabel="View case study"    // wires into §8
/>
```

Requirements:

1. **Reserve aspect ratio with CSS `aspect-ratio`** before load. Zero layout shift — CLS must stay at 0.
2. **Poster or brand-blue fill shows immediately.** The blue boxes in the mockup are literally the loading state — lean into that. `background: var(--color-brand-500)` behind every media element.
3. **IntersectionObserver-gated playback.** Never autoplay off-screen. `rootMargin: '200px'` to pre-warm.
4. **Concurrency cap: max 3 playing videos at once.** Critical — the experiments grid has 8+ tiles and uncapped playback will stall mid-range mobile. Implement a small playback manager: when a 4th video enters view, pause the one furthest from viewport centre.
5. **Mobile default is `poster` + play-on-tap** for gallery tiles. Autoplaying 8 loops on cellular is hostile.
6. **All autoplay video:** `muted playsInline loop preload="metadata"`. Missing `playsInline` = iOS fullscreen hijack.
7. **Respect `prefers-reduced-motion`:** render the poster frame only, with a visible play affordance. Do not autoplay anything.
8. **`<video>` needs an accessible name.** Use `aria-label` from `alt`. Decorative background video gets `aria-hidden="true"` and is excluded from the a11y tree.

---

## 7. Component Architecture

Atomic, tokens-only — **no hardcoded colour, size, or spacing values in any component.**

### Atoms (`components/primitives/`)

| Component   | Props                           | Notes                                                                                    |
| ----------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| `Container` | `bleed?: boolean`               | 1280px max, gutter padding. `bleed` opts out for the video band.                         |
| `Eyebrow`   | `tags: string[]`                | Renders `Design System · Web · Mobile` in `brand-500`, `--text-caption`. Joins with `·`. |
| `Chip`      | `children, as?`                 | The pill. `--radius-pill`, `--color-chip` bg. Used for the scroll CTA.                   |
| `TextLink`  | `href, external?, cursorLabel?` | No icons anywhere per brief. Underline on hover, visible focus ring.                     |
| `Caption`   | `children`                      | `--color-ink-muted`, `--text-caption`. Gallery tile captions.                            |

### Molecules

| Component        | Notes                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `Media`          | See [§6.4](#64-the-media-abstraction--build-this-first). The workhorse.                          |
| `FeaturedCard`   | 16:9 `Media` + `Eyebrow` + title. Whole card is one link. Cursor: `View case study`.             |
| `ExperimentTile` | `Media` + `Caption`. `gridSpan` 1 or 2. Cursor: `Expand`. Opens lightbox.                        |
| `Nav`            | Nav items; handles scrolled state.                                                               |
| `Lightbox`       | Focus-trapped dialog for experiments. Esc to close, arrows to navigate, restores focus on close. |

### Organisms (`components/sections/`)

`VideoHero` · `HeroStatement` · `FeaturedWork` · `ExperimentsGrid` · `Header` · `Footer`

### Variant & state discipline

Every interactive element implements all four states: `hover`, `active`, `focus-visible`, `disabled`. Focus rings must be visible against **both** `--color-paper` and `--color-page` — test on both. A 2px `brand-500` ring with a 2px white offset works on both backgrounds.

Touch targets ≥ 44×44px. Applies to nav items and footer social links, which in the mockup are small text — pad them out.

---

## 8. The Dynamic Cursor

This is the site's **signature element**. It's also the highest-risk piece for accessibility and performance, so the implementation approach matters more than usual.

### 8.1 Architecture: attribute-driven, not prop-driven

The obvious approach — each component calling `setCursorLabel()` on `onMouseEnter` — causes a React re-render per hover and doesn't handle nested targets well.

**Do this instead:** a single global listener reads declarative `data-` attributes off the DOM.

```tsx
// Any element opts in declaratively:
<a href="/work/endeavor" data-cursor="cta" data-cursor-label="View case study">
<button data-cursor="expand" data-cursor-label="Expand">
<a href="https://linkedin.com/..." data-cursor="cta" data-cursor-label="Go to LinkedIn">
<p data-cursor="text">                        {/* shrinks to a caret-like bar */}
<div data-cursor="hidden">                    {/* native cursor returns */}
```

One `pointermove` listener on `document`:

```ts
const target = (e.target as Element).closest("[data-cursor]");
const variant = target?.getAttribute("data-cursor") ?? "default";
const label = target?.getAttribute("data-cursor-label") ?? "";
```

`closest()` gives correct nested behaviour for free — a link inside a card resolves to the innermost declared intent.

### 8.2 Movement: GSAP quickTo, never React state

```ts
const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
// on pointermove: xTo(e.clientX); yTo(e.clientY);
```

Position must **never** live in React state — that's a re-render per mouse pixel. Only `variant` and `label` go through React (they change rarely). Animate `transform` only; never `top`/`left`.

The label pill itself uses a slightly longer duration than the dot (~0.55s vs 0.4s) for a trailing feel.

### 8.3 Variants

| `data-cursor` | Visual                                       | Label example                                       |
| ------------- | -------------------------------------------- | --------------------------------------------------- |
| `default`     | 12px `brand-500` dot                         | —                                                   |
| `cta`         | Pill expands from dot, blue fill, white text | `View case study` · `Go to LinkedIn` · `Let's talk` |
| `expand`      | Circle grows to ~72px, blue fill             | `Expand`                                            |
| `play`        | Circle with label                            | `Play reel`                                         |
| `drag`        | Circle with horizontal arrows                | `Drag`                                              |
| `text`        | Thin 2px vertical bar                        | —                                                   |
| `hidden`      | Custom cursor hides, native returns          | —                                                   |

Transition between variants: width/height/border-radius on `--duration-base` with `--ease-out-expo`. The label cross-fades so text doesn't scramble mid-transition.

### 8.4 Non-negotiable guard rails

A custom cursor that requires `cursor: none` is an accessibility liability if done carelessly. All of these are required:

1. **Pointer gate.** Only mount when `matchMedia('(pointer: fine)')` matches. Touch and stylus get the native cursor, no exceptions. Also bail on `(hover: none)`.
2. **Reduced motion.** Under `prefers-reduced-motion: reduce`, either don't mount at all, or mount with zero lerp (instant follow, no trailing). No easing, no scale animation. Recommendation: **don't mount.**
3. **`cursor: none` scope.** Apply to `body` only when the cursor is actually mounted and active — do it in JS via a class, not statically in CSS. If the JS fails to load, the user must still have a cursor.
4. **Native cursor for real controls.** Text inputs, textareas, and the video player scrubber restore the native cursor via `data-cursor="hidden"`. Never make someone select text or drag a slider without a system cursor.
5. **Window blur / leave.** Hide the custom cursor on `mouseleave` on `document`, `blur` on `window`, and when a modal opens. A frozen dot in the corner looks broken.
6. **Keyboard parity.** The cursor label is _decorative reinforcement_, never the only affordance. Every `data-cursor-label` must correspond to accessible text or an `aria-label` on the same element. A keyboard user must get the same information.
7. **`aria-hidden="true"` and `pointer-events: none`** on the cursor element itself. It's presentational and must never intercept clicks.
8. **Single instance.** Rendered once in `layout.tsx`, portalled to `document.body` at `--z-cursor`. Not per-page.
9. **Escape hatch.** Consider a "use system cursor" toggle in the footer, persisted to `localStorage`. Low cost, and it's the kind of detail that signals craft to a design-literate audience.

### 8.5 Label copy (in voice)

| Context               | Label             |
| --------------------- | ----------------- |
| Featured project card | `View case study` |
| Experiment tile       | `Expand`          |
| Showreel              | `Play reel`       |
| Nav → My Work         | `Go to my work`   |
| Nav → About Me        | `Meet Duminda`    |
| Nav → AI Workflow     | `See the tricks`  |
| Nav → Work With Me    | `Let's talk`      |
| Footer → LinkedIn     | `Go to LinkedIn`  |
| Footer → Instagram    | `Go to Instagram` |
| Footer → Email        | `Say hello`       |

Keep every label under ~18 characters — longer pills fight the cursor's movement and become hard to read while tracking.

---

## 9. Homepage Build Spec

Reading the layout top to bottom. The defining structural move: a **full-bleed video band** that the **1280px white container overlaps and rises into**.

### 9.1 Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [logo]                    My Work  About Me  AI Workflow   │ ← header, fixed
│                                            Work With Me     │
│                                                              │
│              FULL-BLEED LOOPING VIDEO BAND                   │ ← ~60vh, bleeds
│                                                              │
│         ┌──────────────────────────────────────┐            │
│         │  Hey! I'm Duminda. Crafting          │ ← white container
│         │  Experiences That Move                │   overlaps video by ~56px
│         │  Literally.        ← brand-500        │
│         │                                       │
│         │  ( ○ Scroll For My Work )  ← chip     │
├─────────┤                                       ├────────────┤
│  page   │  ████████████████████████████  16/9  │   page     │
│  grey   │  Design System · Web · Mobile         │   grey     │
│         │  Upgrading iTrvl responsive webapp…   │
│         │                                       │
│         │  ████████████████████████████  16/9  │
│         │  Design System · Web · Mobile         │
│         │  Upgrading iTrvl responsive webapp…   │
│         │                                       │
│         │  ████████████████████████████  16/9  │
│         │  Design System · Web · Mobile         │
│         │  Upgrading iTrvl responsive webapp…   │
│         │                                       │
│         │  Things That Kept Me Up                │
│         │  ┌────┐ ┌────┐ ┌────┐                │
│         │  │ 1  │ │ 1  │ │ 1  │   ← 3 × span-1 │
│         │  └────┘ └────┘ └────┘                │
│         │  ┌──────────┐ ┌────┐                 │
│         │  │  span-2  │ │ 1  │                 │
│         │  └──────────┘ └────┘                 │
│         │  ┌────┐ ┌──────────┐                 │
│         │  │ 1  │ │  span-2  │                 │
│         │  └────┘ └──────────┘                 │
│         │  ┌──────────┐                        │
│         │  │  span-2  │        (col 3 empty)   │
│         └──┴──────────┴────────────────────────┘
│  Site Content © Duminda M · All Rights Reserved ·           │ ← footer on grey
│  2026 · Made With Love & Caffeine                           │
│  LinkedIn   Instagram   Behance   Email                     │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Header / Nav

- `position: fixed`, `z-index: var(--z-header)`, full width.
- **Left:** logo as PNG from `/public/logo.png`. Use `next/image` with explicit `width`/`height`, `priority`, and `alt="Duminda M"`. Wrap in a link to `/` (skip on the homepage itself, or make it a no-op scroll-to-top).
- **Right:** nav items, `--text-caption` or `--text-body`, generous letter-spacing.
- **Rest state (over video):** ⚠️ The mockup's light grey nav will be unreadable over some video frames and fails AA. Fix with one of:
  - **(a) Recommended** — nav labels in `--color-ink`, plus a `backdrop-filter: blur(8px)` + 40% white scrim behind the header bar only. Legible over anything, and the blur reads as intentional.
  - **(b)** Keep labels light but add a subtle top-down gradient scrim (`rgba(0,0,0,0.25)` → transparent) over the video's top 120px.
  - Do not ship light-grey-on-raw-video.
- **Scrolled state:** background → `--color-paper`, **no shadow** (explicit in brief). Add a `1px` `--color-hairline` bottom border instead — separation without a shadow. Labels → `--color-ink`.
- **Trigger:** GSAP ScrollTrigger at ~80px scrollY, or an IntersectionObserver sentinel div. Prefer the sentinel — no scroll handler.
- **Transition:** `background-color` + `border-color` on `--duration-base`. Never animate `height` (layout thrash).
- **Mobile:** below `md`, four items won't fit. Full-screen overlay menu triggered by a **text button** (`Menu` / `Close`) — no hamburger icon, consistent with the no-icons rule. Focus-trap the overlay, close on Esc, lock body scroll.
- **Skip link** as the first focusable element: "Skip to content" → `#main`.

### 9.3 Video hero band

- Full-bleed, ~`60vh` (`CONFIRM` exact height against Figma — the mockup suggests ~380/2560 of total scroll height, so `min(60vh, 720px)` is a reasonable starting point).
- Single Gumlet-hosted loop: `muted playsInline loop autoPlay preload="auto"`, `aria-hidden="true"`, `object-fit: cover`.
- **Poster is mandatory** — a blurred or brand-blue first frame. Never a white flash.
- Silent, no audio track, `-an` at encode.
- Reduced motion → static poster image only.
- The white container's overlap is achieved with negative margin-top on the container (~`-56px`, `CONFIRM`), not absolute positioning — keeps the document flow sane.

### 9.4 Hero statement

- `h1`, `--text-hero`, `--leading-hero`, `--tracking-hero`.
- `Literally.` in `brand-500`. Semantically part of the same `h1` — wrap in `<span class="text-brand-500">`, don't split into two headings.
- **Reveal animation:** line-by-line mask reveal on load (translateY + clip). Stagger 60ms. This is the page-load moment — get it right. Under reduced motion, render immediately at full opacity.
- **CTA chip:** `Scroll For My Work` with the small circle glyph. Brief says non-interactive for now — so render as a `<div>`, **not** a `<button>`. Do not put a disabled button in the a11y tree with no action. Add a subtle vertical bob (`3px`, 2s, ease-in-out) so it reads as an affordance, and kill it under reduced motion. Note in a code comment that this becomes an anchor to `#featured-work` in phase 2.

### 9.5 Featured work

- Three items, sourced from `getProjects()` filtered by `featured: true`, sorted by `featuredOrder`, `.slice(0, 3)`. **Never hardcode three cards.**
- Each: full-container-width 16:9 `Media` → `Eyebrow` (blue tags) → title (`--text-lead`, `--color-ink`).
- The **whole card** is one `<a>`. One link per card — do not nest a second link inside (a11y and SEO both suffer).
- `data-cursor="cta" data-cursor-label="View case study"`.
- Hover: subtle media scale (`1.02`, `--duration-base`) and/or the loop starts playing. Choose **one**, not both — restraint.
- Vertical rhythm between cards: `--space-section`.
- Scroll reveal: fade + 24px translateY, staggered, ScrollTrigger at 85% viewport, `once: true`.

### 9.6 "Things That Kept Me Up"

- Section title: `--text-display`, `--color-ink`. Sits on `--color-paper`.
- **CSS Grid, 3 columns**, `gap: var(--spacing-4)`.
- Span pattern from `experiments.ts` `gridSpan` field — data-driven, so reordering is a content change not a code change. The mockup's pattern (`1,1,1 / 2,1 / 1,2 / 2`) is the seed data, not the layout logic.
- Each tile: `Media` (aspect varies) + `Caption` beneath in `--color-ink-muted`.
- **Replace every `Untitled 3D experiments` placeholder** with real captions. This is prime voice real estate — "Don't Tell My Client" energy. Captions here are where the personality lands.
- Click → `Lightbox`. `data-cursor="expand" data-cursor-label="Expand"`.
- Responsive: 3 cols at `lg`+, 2 cols at `md`, 1 col below. Spans collapse to full-width at 1 col.
- **Playback:** desktop `playback="hover"`, mobile `playback="click"`. Never 8 concurrent autoplays.

### 9.7 Footer

- Sits on `--color-page` grey, **outside** the white container. Container ends; footer breathes on the page background.
- Statement line: `--text-display`, `--color-ink`, tight leading. `Site Content © Duminda M · All Rights Reserved · 2026 · Made With Love & Caffeine`
- Year is dynamic: `new Date().getFullYear()`.
- Social row: text links only, no icons. `LinkedIn · Instagram · Behance · Email`. `rel="noopener noreferrer"` and `target="_blank"` on external. Each gets its own cursor label per [§8.5](#85-label-copy-in-voice).
- Pad the links to a ≥44px touch target.
- **Note:** `brand-500` fails AA on the grey background at body size — footer links must be `--color-ink`, not blue.

---

## 10. Motion Spec

Principle from the brief's own tagline — _Experiences That Move_ — the motion has to be good. But the constitution of good motion here is **one orchestrated moment, not scattered effects.**

| Moment          | Behaviour                                                      | Notes                                                                                                 |
| --------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Page load       | Hero line-by-line mask reveal, 60ms stagger, `--ease-out-expo` | The signature load moment. Blocks nothing — text is in the DOM, animation is progressive enhancement. |
| Scroll (global) | Lenis smooth scroll, `lerp: 0.08`                              | Disable entirely on reduced motion and on touch (native momentum is better).                          |
| Header          | Fixed → white on scroll past sentinel                          | Colour only. No height, no shadow.                                                                    |
| Section reveals | Fade + 24px rise, `once: true`                                 | Never re-animate on scroll-up.                                                                        |
| Media hover     | 1.02 scale OR loop playback                                    | Pick one per surface.                                                                                 |
| Cursor          | Lerped follow + variant morph                                  | See [§8](#8-the-dynamic-cursor).                                                                      |
| Route change    | Short fade (200ms)                                             | Keep it cheap; a heavy page transition on a portfolio delays the work.                                |

**Rules:**

- Register GSAP plugins once in a `'use client'` module, guarded for SSR.
- Wire Lenis to ScrollTrigger: `lenis.on('scroll', ScrollTrigger.update)` and drive Lenis from `gsap.ticker`. Getting this wrong causes the classic janky-pin bug.
- Kill all ScrollTriggers on route unmount.
- **Every animation must be behind a `usePrefersReducedMotion()` check.** Reduced motion means the page renders complete and static, not broken.
- Animate `transform` and `opacity` only. If you find yourself animating `height`, `top`, or `box-shadow`, find another way.

---

## 11. Accessibility & Performance Floor

Build to this without announcing it. Non-negotiable.

### Accessibility

- [ ] Semantic landmarks: one `<header>`, one `<main id="main">`, one `<footer>`, `<nav aria-label="Main">`
- [ ] Single `<h1>` per page; heading levels never skip
- [ ] Skip link as first focusable element
- [ ] `:focus-visible` ring visible on **both** white and grey backgrounds
- [ ] Full keyboard path through nav, cards, gallery, lightbox, footer
- [ ] Lightbox: focus trap, Esc closes, focus restored to trigger on close
- [ ] `alt` on every image; `aria-label` on every non-decorative video; `aria-hidden` on decorative media
- [ ] Touch targets ≥ 44×44px
- [ ] `prefers-reduced-motion` respected globally, including the cursor
- [ ] Custom cursor never the sole carrier of information
- [ ] Contrast audit from [§3.2](#32-contrast-audit-wcag-21-aa) passing, including the two flagged fixes
- [ ] Run axe DevTools on every page before launch

### Performance targets

| Metric                           | Target                                                         |
| -------------------------------- | -------------------------------------------------------------- |
| LCP                              | < 2.5s (LCP element = hero poster or `h1` — **not** the video) |
| CLS                              | 0 (aspect ratios reserved on all media)                        |
| INP                              | < 200ms                                                        |
| JS bundle (homepage, first load) | < 180KB gzipped                                                |
| Total local loop weight          | ≤ 3MB                                                          |

**Tactics:**

- Hero poster preloaded; hero video `preload="auto"`, everything else `preload="metadata"` or `none`.
- `hls.js` dynamically imported, never in the initial bundle.
- Self-host fonts as `woff2`, `font-display: swap`, subset to Latin. Preload the display face only.
- Client components kept to leaves: `CursorProvider`, `Media`, `Nav`, `Lightbox`, motion wrappers. Pages and sections stay server components.
- Lighthouse CI in the pipeline once phase 3 lands.

### SEO / metadata

- Per-route `metadata` exports; OG image per case study (Next.js `opengraph-image.tsx`)
- `sitemap.ts` + `robots.ts`
- `Person` + `CreativeWork` JSON-LD
- Descriptive `<title>`s in voice, not `Home | Portfolio`

---

## 12. Build Phases

Each phase ends in something reviewable in a browser. Don't proceed until acceptance criteria pass.

### Phase 0 — Foundation

Scaffold Next.js + TS + Tailwind v4. Write `tokens.css` from [§3](#3-design-tokens). Self-host fonts. Set up ESLint/Prettier, `cn()` util, and the `usePrefersReducedMotion` / `useIsTouch` hooks. Commit a `/tokens` dev-only route rendering every colour, type size, and spacing step.

**Done when:** `/tokens` renders the full system and the contrast audit is verified in-browser.

### Phase 1 — Content layer

Zod schemas, `lib/content/local.ts`, seed the four projects + 8 experiments. All content functions async. A build-time validation script that fails on schema violation.

**Done when:** `getProjects()` returns typed data and a deliberate typo in a content file breaks the build.

### Phase 2 — Media system

`<Media />` with all three kinds, IntersectionObserver gating, the 3-video concurrency cap, poster handling, reduced-motion fallback. Gumlet URL builders. Encode and commit the local loops.

**Done when:** a test page renders 10 tiles, at most 3 play at once, CLS is 0, and reduced motion shows posters only.

### Phase 3 — Homepage

Header with scroll state, video hero band with container overlap, hero statement + reveal, featured work, experiments grid, footer. Fully responsive.

**Done when:** the homepage matches the mockup at 1440/768/375, keyboard-navigable end to end, Lighthouse ≥ 90 across the board.

### Phase 4 — The cursor

`CursorProvider`, attribute-driven detection, GSAP quickTo movement, all variants, every guard rail in [§8.4](#84-non-negotiable-guard-rails).

**Done when:** no re-render on pointermove (verify with React DevTools Profiler), native cursor on touch, doesn't mount under reduced motion, and every label has an accessible-text equivalent.

### Phase 5 — Inner pages

`/work` index with discipline filter. `/work/[slug]` case study template with MDX components. `/about`, `/ai-workflow`, `/work-with-me`, `404`.

**Done when:** all routes render, sitemap generates, per-page OG images work.

### Phase 6 — Polish & launch

Lightbox. Route transitions. Real copy replacing all placeholders. axe audit. Cross-browser (Safari especially — video autoplay and `backdrop-filter`). Analytics. Deploy.

**Done when:** zero placeholder strings remain and axe reports no violations.

---

## 13. Open Questions

Resolve these before or during Phase 0. Marked `CONFIRM` throughout the document.

**Design values**

1. ~~Exact brand blue hex~~ — ✅ **RESOLVED 2026-08-06.** `#2E57EF` (accent) and
   `#1035BF` (deep). The PNG-read guess of `#2F51E8` was close but slightly off.
2. ~~Exact page-background grey~~ — ✅ **RESOLVED 2026-08-06.** `#CFCFCF`. Also
   confirmed: ink `#1F1F1F`, ink-muted `#747474`, surface `#F8F8F8`.
3. Display and body typeface names and licence status. **← still open, blocks
   final type rendering.** Scaffold currently falls through to `system-ui`;
   see `src/styles/fonts.css` for the activation steps.
4. Video hero band height, and the exact container overlap distance. **← still
   open.** Currently `min(60vh, 720px)` and `56px`, both tokenised so changing
   them is a one-line edit in `tokens.css`.

**Content** 5. Real captions for the eight experiments grid tiles. All currently `Untitled 3D experiments`. 6. Real footer social destinations — the mockup has `LinkedIn` three times. Is Behance/Dribbble current? 7. Which projects have `isPublic: false` and need anonymisation? The precious.studio pieces are presumably fine, but confirm per project. 8. The three featured card titles all read `Upgrading iTrvl responsive webapp…` — confirm the actual three hero projects map to Three.js Fractal Viewer / Endeavor / Lumin as planned.

**Behaviour** 9. Should `Work With Me` be visually weighted as a CTA in the nav, or stay flat with the others? 10. Does the showreel live on the homepage, or only on `/work`? It's currently absent from the layout — and it's the flagged content gap. 11. Is the logo animated later (brief says "could be dynamic")? If yes, reserve exact dimensions now so the swap doesn't shift layout. 12. Lightbox for experiments, or link to a dedicated `/experiments` page? Plan assumes lightbox.

**Copy still to write** 13. Case study body copy for all three Tier 1 projects. 14. About page long-form (the ~50-word narration version exists; the full page doesn't). 15. AI Workflow page content. 16. 404 copy.
