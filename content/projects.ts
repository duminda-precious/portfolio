import type { Project } from "@/lib/content/schema";

/**
 * Project data: three case studies plus YouTube work.
 *
 * Real projects only. The invented layout placeholders were removed on
 * 2026-11-15. YouTube entries open in the lightbox, not a case study page.
 */

/** YouTube cover: the card shows the thumbnail; click plays in the lightbox. */
const youtube = (id: string, title: string, poster?: string) =>
  ({ kind: "youtube", src: id, alt: title, aspect: "16/9", hasAudio: true, poster }) as const;

/** Endeavor case study assets in /public, URL-encoded (filenames have spaces). */
const endeavor = (file: string) => `/images/endeavor/${encodeURIComponent(file)}`;

/** Lumin media, hot-linked from the Precious Studio case study page. */
const lumin = (file: string) =>
  `https://precious.studio/media/portfolio/lumin/${file}`;

export const PROJECTS: Project[] = [
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------
  {
    // Real copy (2026-11-15) from the "Fractal Viewer case study draft" doc.
    // Copy is final as written there: do not add to or reword it.
    // ⚠️ Credited to Precious Studio only. Never name the end client.
    slug: "threejs-fractal-viewer",
    title:
      "Can a browser draw 3D fractals fast enough to be useful? I had a week to find out.",
    client: "Precious Studio",
    year: 2026,
    tier: 1,
    discipline: "3d-code",
    tags: ["Creative Coding", "WebGL", "AI-Built"],
    featured: true,
    featuredOrder: 1,
    // Screen recording of the viewer (1920×1000, 3 s, ~12.7 MB original —
    // over the §6.2 budget; encode before launch). The live viewer itself is
    // the embed at the end of the body.
    cover: {
      kind: "local-loop",
      src: "/images/fractals/cover.mp4",
      alt: "A 3D fractal rotating in the browser viewer.",
      aspect: "16/9",
      hasAudio: true,
    },
    summary:
      "A proof of concept for Precious Studio: real-time 3D fractals in the browser, built in a week with AI writing every line of code. I did the research and the directing.",
    tools: ["Three.js", "GLSL", "lil-gui", "Vite", "Claude Code", "Antigravity"],
    isPublic: true,
    body: [
      {
        kind: "prose",
        paragraphs: [
          "It started with a simple question: can a browser draw 3D fractals smoothly enough to be worth building on? I had a week. Most of it went on homework, because before anything could be built I had to understand how fractals actually get made: the different types, how they grow out of a few rules, and how to get Three.js to draw them so they look right.",
          "Then I handed the building to AI. Every line of code and every bit of the interface came out of Claude Code and Antigravity. I pointed and they typed. By the end of the week there were four shapes you could spin, zoom and pull apart, and it stayed smooth by dropping detail while you move and sharpening when you stop. I sent it off for approval and got an immediate yes. The real models are proprietary, so this one is the concept test. Go on, play with it.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "embed",
          src: "https://fractals-omega.vercel.app/",
          alt: "Live 3D fractal viewer",
          aspect: "16/9",
          hasAudio: false,
        },
        fullWidth: true,
      },
    ],
  },
  {
    // Real copy (2026-11-15) from the "Endeavor case study draft" doc. Copy is
    // final as written there: do not add to or reword it.
    slug: "endeavor-design-system",
    title: "90+ brands, one design system, and a CMS that made the rules.",
    client: "Endeavor Business Media",
    year: 2024,
    tier: 1,
    discipline: "ui-ux",
    tags: ["Design System", "CMS", "Web"],
    featured: true,
    featuredOrder: 3,
    // ⚠️ Cover.mp4 is 3.2:1 and is cropped to 16:9 here. Originals are
    // uncompressed (~80MB across this page's videos), far over the §6.2
    // budget; swap for encoded copies before launch.
    cover: {
      kind: "local-loop",
      src: endeavor("Cover.mp4"),
      alt: "Design tokens and type styles flowing into the new Endeavor brand pages.",
      aspect: "16/9",
      hasAudio: true,
    },
    summary:
      "Endeavor Business Media runs 90+ B2B brands on one CMS, with 100+ components that never matched. I spent six months turning that into one system every brand builds from.",
    role: "Sole designer",
    tools: ["Figma", "Figma variables"],
    isPublic: true,
    body: [
      {
        kind: "lead",
        text: "Endeavor Business Media has 90+ brands, and no two of their sites quite matched. My job was to fix that without breaking the CMS they all run on.",
      },
      {
        kind: "stats",
        items: [
          { label: "Role", value: "Sole designer" },
          { label: "Timeline", value: "About 6 months" },
          { label: "Scale", value: "90+ brands" },
        ],
      },
      {
        kind: "section",
        heading: "The problem",
        paragraphs: [
          "Everything lived on one CMS, Aspire, carrying 100+ components that had nothing to do with each other. Marketing, Editorial and Audience Engagement all wanted the same page space. Whatever I designed had to fit what the CMS could do and still work for all three teams.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: endeavor("old web.mp4"),
          alt: "The legacy Firehouse and Aviation Pros pages before the redesign.",
          aspect: "16/9",
          hasAudio: false,
        },
      },
      {
        kind: "section",
        heading: "The call that made it work",
        paragraphs: [
          "Before drawing anything, we agreed on one thing: atomic design, all the way down. Small pieces first, bigger ones built from them. That early call is why the system scaled, and why I can change something at the foundation and it updates everywhere.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: endeavor("design sys.mp4"),
          alt: "Design tokens, type styles and components in the Endeavor design system.",
          aspect: "1/1",
          hasAudio: false,
        },
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: endeavor("WtSJuOdl2dmYnXPLq3U1G4AxK6U.jpg"),
          alt: "Figma colour variables for the Endeavor design system.",
          aspect: "1/1",
          hasAudio: false,
        },
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: endeavor("c771pCqc6ppttTvoM8ZQiaUXE.jpg"),
          alt: "Component properties for an Article Title component in Figma.",
          aspect: "1/1",
          hasAudio: false,
        },
      },
      {
        kind: "section",
        heading: "Designing inside the CMS",
        paragraphs: [
          "Aspire is strict about some things and loose about others. Endeavor's PM has a developer background, so he knew exactly where it could bend. We built the system around those spots.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: endeavor("Article page with content metering pop up.png"),
          alt: "The finished Wastewater article page with a content metering pop-up.",
          aspect: "4/3",
          hasAudio: false,
        },
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: endeavor("Theme.mp4"),
          alt: "The same page switching between light and dark themes.",
          aspect: "1/1",
          hasAudio: true,
        },
      },
      {
        kind: "section",
        heading: "How it landed",
        paragraphs: [
          "About 40% less design debt. That came from cutting components and variations, simplifying the tokens and combining states into fewer blocks. All 90+ brands build from the same set now. The client is happy, I'm happy, and they're still adding to it.",
        ],
      },
    ],
  },
  {
    // Real copy (2026-11-15) from the "Lumin case study draft" doc. Copy is
    // final as written there: do not add to or reword it. Media is hot-linked
    // from the Precious Studio Lumin page until local copies land.
    slug: "lumin-fitness-motion",
    title: "Making a fitness app feel like the studio it belongs to.",
    client: "Lumin Fitness",
    year: 2025,
    tier: 1,
    discipline: "motion",
    tags: ["Motion Design", "Rive", "Mobile App"],
    featured: true,
    featuredOrder: 2,
    cover: {
      kind: "local-loop",
      src: lumin("ZG9qQLBrKnMciYiOjlWdcuFWZ5o.mp4"),
      poster: lumin("ZG9qQLBrKnMciYiOjlWdcuFWZ5o.jpg"),
      alt: "Lumin app screens in motion.",
      aspect: "16/9",
      hasAudio: false,
    },
    summary:
      "Lumin's studios run on interactive screens, AI coaching and motion tracking. The app felt a tier behind. I built the motion that carries the studio onto the phone.",
    role: "Motion design, UI polish",
    tools: ["Rive", "Blender", "Figma"],
    isPublic: true,
    body: [
      {
        kind: "lead",
        text: "Lumin's studios are the fun part: a big interactive screen in front of every machine, AI coaching, motion tracking. Then you opened the app and it just sat there. My job was to make the phone feel like the same place.",
      },
      {
        kind: "stats",
        items: [
          { label: "Role", value: "Motion design, UI polish" },
          { label: "Timeline", value: "Over a year" },
          { label: "Platform", value: "Mobile app" },
        ],
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: lumin("O8koo9XoQCeHIkxeOqnAq0IcIU.jpg"),
          alt: "Two people in silhouette in front of a large studio screen showing coloured score rings.",
          aspect: "16/9",
          hasAudio: false,
        },
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: lumin("jH3h40Z0gCtw3P8pU5tVEuAbg.jpg"),
          alt: "People on bikes in front of a neon-lit wall screen in the Lumin studio.",
          aspect: "1/1",
          hasAudio: false,
        },
      },
      {
        kind: "section",
        heading: "The hard part",
        paragraphs: [
          "I couldn't design the motion from the phone alone. People go from a wall-sized screen to a pocket-sized one, so the app had to move the way the studio does. Every transition was judged against what happens on those studio screens.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: lumin("jQPVbZjaSSBQzcc60v2FLj8qYEE.mp4"),
          poster: lumin("jQPVbZjaSSBQzcc60v2FLj8qYEE.jpg"),
          alt: "Three phones guiding the user to put in headphones and dock the phone.",
          aspect: "16/9",
          hasAudio: false,
        },
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: lumin("KSSt3ZwGaKL7qh3MdrSXmpAdW4.mp4"),
          poster: lumin("KSSt3ZwGaKL7qh3MdrSXmpAdW4.jpg"),
          alt: "The My Programs screen with workout classes.",
          aspect: "1/1",
          hasAudio: false,
        },
      },
      {
        kind: "section",
        heading: "Motion that earns its place",
        paragraphs: [
          "The old app gave you nothing back when you tapped. Now motion confirms what you did, shows what changed, and tells you when the AI is doing the work and not you.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: lumin("0uq4LkKUCrod2gcX0I9KcncTQlI.mp4"),
          poster: lumin("0uq4LkKUCrod2gcX0I9KcncTQlI.jpg"),
          alt: "A loading checklist, starting with Analyzing your Lumin Score.",
          aspect: "1/1",
          hasAudio: false,
        },
        fullWidth: true,
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: lumin("EtXC2wmxznulrsUUlWIDVKRQgtM.mp4"),
          poster: lumin("EtXC2wmxznulrsUUlWIDVKRQgtM.jpg"),
          alt: "The app asking for fitness level and experience preferences.",
          aspect: "1/1",
          hasAudio: false,
        },
      },
      {
        kind: "section",
        heading: "Rewards in 3D",
        paragraphs: [
          "Unlock a level or a tier and you get a proper reward. Those are Blender animations, with liquid and reflections. Gamification only works if the payoff feels good.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: lumin("4XWBPUtYhOkK8NoC5BLfncRn9w.mp4"),
          poster: lumin("4XWBPUtYhOkK8NoC5BLfncRn9w.jpg"),
          alt: "A phone in a dark gym, showing a lock icon unlocking.",
          aspect: "16/9",
          hasAudio: false,
        },
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: lumin("ujfAVAAgzwjZmY6Bx4TQBSM2F0k.jpg"),
          alt: "A Lumin Feature Unlock screen with a row of numbered steps.",
          aspect: "1/1",
          hasAudio: false,
        },
      },
      {
        kind: "section",
        heading: "No animation code",
        paragraphs: [
          "The interactive animations live in Rive, with the logic inside the file as state machines. Simple loops stayed as Lottie. Developers trigger a state and it plays.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: lumin("7nPhRatnertzICeRTDCJdztDQN4.mp4"),
          poster: lumin("7nPhRatnertzICeRTDCJdztDQN4.jpg"),
          alt: "A glowing purple sphere in the Rive editor, with its state machine.",
          aspect: "1/1",
          hasAudio: false,
        },
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: lumin("rMprLmAV4XvzG9Ku8Z1cdIuz8.mp4"),
          poster: lumin("rMprLmAV4XvzG9Ku8Z1cdIuz8.jpg"),
          alt: "A glowing square frame being built in the Rive editor.",
          aspect: "16/9",
          hasAudio: false,
        },
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: lumin("TcWW9zNDkbufSlxHPoo6mfOfgSw.mp4"),
          poster: lumin("TcWW9zNDkbufSlxHPoo6mfOfgSw.jpg"),
          alt: "A radial burst being built in an animation editor.",
          aspect: "16/9",
          hasAudio: false,
        },
      },
      {
        kind: "section",
        heading: "How it landed",
        paragraphs: [
          "Assets came out about 10x smaller: a 60 KB Lottie bundle became one 5 KB Rive file. Lumin's developers wrote zero animation code. Their designers owned the UI decisions, we went back and forth on them, and the motion was ours end to end.",
        ],
      },
    ],
  },
  {
    // Rebuilt 2026-11-15 in the Ferd case study style: imagery first, very
    // little copy. Anonymised: the client, the operator and the product are
    // never named. On-screen branding was swapped for the fictional
    // "Kestrel & Co." mark at capture time. The SwiftUI step is planned, not
    // done. Compositions were rendered from HTML (scratchpad/rec/comp) using
    // screens captured from the live prototype.
    slug: "safari-guest-app",
    title: "We built the app first and designed it second. It took seven days.",
    client: "Luxury travel platform (NDA)",
    year: 2026,
    tier: 1,
    discipline: "ui-ux",
    tags: ["Product Design", "Prototyping", "AI-Built"],
    featured: true,
    featuredOrder: 4,
    cover: {
      kind: "local-loop",
      src: "/images/guest-app/cover-v2.mp4",
      poster: "/images/guest-app/cover-v2.jpg",
      alt: "A giraffe at sunset. Built backwards. Shipped in seven days.",
      aspect: "16/9",
      hasAudio: false,
    },
    summary:
      "A guest app for luxury safari travellers. We skipped the wireframes, built a working prototype on day one with AI, put it in everyone's hands, and designed the system around what survived.",
    role: "Product designer, prototyper",
    tools: ["Claude Design", "Claude Code", "Cursor", "React", "Vercel", "Figma"],
    isPublic: true,
    body: [
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: "/images/guest-app/phone-tour-v2.mp4",
          poster: "/images/guest-app/phone-tour-v2.jpg",
          alt: "The guest app on a phone: Home, then the day-first itinerary, then chat with the liaison.",
          aspect: "16/9",
          hasAudio: false,
        },
        fullWidth: true,
        solo: true,
      },
      {
        kind: "lead",
        text: "Normally a prototype comes last. We already knew how this app should look and behave, so we built it first, and let a week of testing decide what stayed.",
      },
      {
        kind: "stats",
        items: [
          { label: "Working prototype", value: "Day 1" },
          { label: "Tested and settled", value: "7 days" },
          { label: "Backend", value: "None" },
        ],
      },
      {
        kind: "section",
        heading: "Backwards, on purpose",
        paragraphs: [
          "The usual order is research, then wireframes, then UI, then a design system, and a prototype right at the end. We ran it the other way round. A prototype on day one, a real app the same day, a week of testing, and only then the system and the flows. A real thing to hold made every conversation shorter, because nobody had to imagine the app any more.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: "/images/guest-app/process-v2.mp4",
          poster: "/images/guest-app/process-v2.jpg",
          alt: "A looping timeline: prototype, real app, team testing, simplify, design system, UX flows, each connected to the next.",
          aspect: "16/9",
          hasAudio: false,
        },
        fullWidth: true,
        solo: true,
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: "/images/guest-app/dayone-v2.jpg",
          alt: "Day one: a paragraph prompt in Claude Design, the React build in Cursor and Claude Code, and the live app on a phone.",
          aspect: "16/9",
          hasAudio: false,
        },
        caption: "Claude Design for the canvas, Cursor and Claude Code for the build, a Vercel link by lunch.",
        fullWidth: true,
        solo: true,
      },
      {
        kind: "section",
        heading: "A link, not a deck",
        paragraphs: [
          "Sales, operations and guest services don't open Figma. They do open links. Everyone tested it on their own phone like a real trip, and a hidden demo menu let them jump to any day or state without me in the room. Their notes became the backlog.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: "/images/guest-app/feedback-v2.mp4",
          poster: "/images/guest-app/feedback-v2.jpg",
          alt: "Notes from guest services, sales, operations, leadership, product and a design audit, pinned around the Home screen.",
          aspect: "16/9",
          hasAudio: false,
        },
        fullWidth: true,
        solo: true,
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: "/images/guest-app/beforeafter-v3.jpg",
          alt: "Day one with grey placeholder blocks and the date strip under the switch, beside day seven in the brand serif, warm canvas and teal.",
          aspect: "16/9",
          hasAudio: false,
        },
        caption: "Same flow, same data. Day one had grey blocks where the photos go.",
        fullWidth: true,
        solo: true,
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: "/images/guest-app/split-v2.jpg",
          alt: "A safari truck beside the PIN setup screen. Looks like the brand. Behaves like iOS.",
          aspect: "16/9",
          hasAudio: false,
        },
        fullWidth: true,
        solo: true,
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: "/images/guest-app/uicards-v2.jpg",
          alt: "Close-ups: the date strip and stay card, chat with the liaison, saved documents, and a setup step.",
          aspect: "16/9",
          hasAudio: false,
        },
        fullWidth: true,
        solo: true,
      },
      {
        kind: "section",
        heading: "Day seven: the flows",
        paragraphs: [
          "With the screens settled, we mapped every flow properly: the happy path, the alternate paths and every error state. Then we walked the friction points a traveller actually hits mid-trip. No signal at camp, a mistyped PIN, a code that never arrives, a transfer that moves, a document that didn't download before the flight.",
          "Each of those got a recovery point and a fallback that works offline, so nobody is ever stuck on a screen with no way forward. That's where the product got its confidence.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: "/images/guest-app/lineup-v2.jpg",
          alt: "Six screens in a row: welcome, details, Home, Itinerary, Travel and Chat.",
          aspect: "16/9",
          hasAudio: false,
        },
        fullWidth: true,
        solo: true,
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: "/images/guest-app/type-v2.jpg",
          alt: "Crimson Pro and Hanken Grotesk, with the six colour roles from canvas to ink.",
          aspect: "16/9",
          hasAudio: false,
        },
        fullWidth: true,
        solo: true,
      },
      {
        kind: "section",
        heading: "The system came last",
        paragraphs: [
          "Only what survived testing became a component. Brands fill in roles, not hex values, so the next operator is a new token file, not a redesign. The guidelines site sits beside the app, written for engineers, designers and writers alike.",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "local-loop",
          src: "/images/guest-app/system-v2.mp4",
          poster: "/images/guest-app/system-v2.jpg",
          alt: "Scrolling the design system guidelines site: icons, buttons, rows, fields and cards.",
          aspect: "16/9",
          hasAudio: false,
        },
        fullWidth: true,
        solo: true,
      },
      {
        kind: "media",
        media: {
          kind: "image",
          src: "/images/guest-app/closing-v2.jpg",
          alt: "Week two: tokens and specs moving into a native SwiftUI build, beside a camp pool at golden hour.",
          aspect: "16/9",
          hasAudio: false,
        },
        fullWidth: true,
        solo: true,
      },
    ],
  },

  // YouTube work (2026-11-15). Cards on /work open the video in the
  // lightbox; there is no case study page (see isCaseStudy). Years unknown.
  {
    slug: "austin-next",
    title: "Austin Next: motion design and editing for a real broadcast.",
    client: "Austin Next",
    tier: 2,
    discipline: "motion",
    tags: ["Motion Design", "Video Editing", "Broadcast"],
    featured: false,
    cover: youtube("EDxnibdrOW8", "Austin Next video"),
    summary: "Motion design and video editing for a broadcast piece.",
    tools: [],
    isPublic: true,
    body: [],
  },
  {
    slug: "sxsw-wiggl-promo",
    title: "Wiggl at SXSW: a 3D character promo, built for broadcast.",
    client: "Wiggl",
    tier: 2,
    discipline: "motion",
    tags: ["Motion Design", "3D Animation", "Character Design", "Broadcast"],
    featured: false,
    cover: youtube("BHLFIod2Elg", "SXSW wiggl promo video"),
    summary: "Character design, 3D animation and motion design for a SXSW promo.",
    tools: [],
    isPublic: true,
    body: [],
  },
  {
    slug: "cst-childrens-story-time",
    title: "Children's Story Time: 3D characters telling the story.",
    client: "CST",
    tier: 2,
    discipline: "motion",
    tags: ["Motion Design", "3D Character", "Broadcast"],
    featured: false,
    cover: youtube("mnBc1M0PCOQ", "CST Children's Story Time video", "/images/thumbnails/cst-childrens-story-time.jpg"),
    summary: "Motion design and 3D characters for a broadcast children's series.",
    tools: [],
    isPublic: true,
    body: [],
  },
  {
    slug: "xoogler-promo",
    title: "Xoogler: a promo cut with motion design on top.",
    client: "Xoogler",
    tier: 2,
    discipline: "motion",
    tags: ["Promo", "Video Editing", "Motion Design"],
    featured: false,
    cover: youtube("CxNORwj-cBU", "Xoogler promo video", "/images/thumbnails/xoogler-promo.jpg"),
    summary: "Video editing and motion design for a promo video.",
    tools: [],
    isPublic: true,
    body: [],
  },
];
