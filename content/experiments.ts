/**
 * "Things That Kept Me Up" — Tier 3 gallery items (§9.6).
 *
 * ⚠️ Nothing outside src/lib/content/ may import this directly (§4).
 *
 * gridSpan is SEED DATA, not layout logic — reordering the grid is a content
 * change here, never a change to ExperimentsGrid.
 *
 * YouTube tiles show the thumbnail; clicking opens the lightbox player, which
 * never autoplays. Local loops come from Portfolio/Content, re-encoded to
 * H.264 ≤1280px (public/video/experiments). The grid stays silent. A clip
 * with a real soundtrack keeps it, and the lightbox plays that mix.
 *
 * Captions written from a frame of each piece.
 *
 * Longer films lead. Spans are for a 6-column grid and each row adds up to 6.
 * Neighbouring rows never repeat the same span pattern, so the layout keeps
 * shifting: 4+2, then 3+3, then 2+2+2, and so on.
 */

import type { Experiment } from "@/lib/content/schema";

/** `poster` overrides YouTube's own thumbnail (files in /images/thumbnails). */
const yt = (id: string, title: string, poster?: string) =>
  ({ kind: "youtube", src: id, alt: title, aspect: "16/9", hasAudio: true, poster }) as const;

const loop = (file: string, aspect: "16/9" | "4/3" | "1/1", hasAudio = false) =>
  ({
    kind: "local-loop",
    src: `/video/experiments/${file}.mp4`,
    alt: "",
    aspect,
    hasAudio,
  }) as const;

const still = (file: string, aspect: "16/9" | "4/3", alt: string) =>
  ({
    kind: "image",
    src: `/images/experiments/${file}.png`,
    alt,
    aspect,
    hasAudio: false,
  }) as const;

const ITEMS: Omit<Experiment, "order">[] = [
  // 4 + 2
  { id: "yt-cst", caption: "Children's Story Time promo. She's got a story, and a very big library to tell it in.", media: yt("mnBc1M0PCOQ", "CST Children's Story Time video", "/images/thumbnails/cst-childrens-story-time.jpg"), gridSpan: 4 },
  { id: "yt-austin-next", caption: "Austin Next promo. A podcast set, a lot of energy, and an edit that keeps up with it.", media: yt("EDxnibdrOW8", "Austin Next video"), gridSpan: 2 },
  // 3 + 3
  { id: "rareover", caption: "Rareover ad. Cricket, told like a sci-fi scouting report.", media: loop("rareover", "16/9", true), gridSpan: 3 },
  { id: "yt-sxsw-wiggl", caption: "SXSW Wiggl promo. We built a whole cast of characters just to say hi to Austin.", media: yt("BHLFIod2Elg", "SXSW wiggl promo video"), gridSpan: 3 },
  // 2 + 2 + 2
  { id: "yt-xoogler", caption: "Xoogler promo. One demo day, a room full of pitches, a few minutes to tell it.", media: yt("CxNORwj-cBU", "Xoogler promo video", "/images/thumbnails/xoogler-promo.jpg"), gridSpan: 2 },
  { id: "demo-final", caption: "Sport tech device mockup. Game-day stats, spun into 3D before kickoff.", media: loop("demo-final", "16/9"), gridSpan: 2 },
  { id: "cat", caption: "Christmas card animation. The office card, except this one actually moves.", media: loop("cat", "1/1"), gridSpan: 2 },
  // 6
  { id: "hero-page", caption: "Hero page animation. One planet, and a deadline on every shore.", media: loop("hero-page", "1/1"), gridSpan: 6 },
  // 3 + 2 + 1
  { id: "render-inside", caption: "Precious V1 mascot. Before the name stuck, there was a glow.", media: loop("render-inside", "16/9"), gridSpan: 3 },
  { id: "comp-3", caption: "Greetings from Austin. A postcard for the feed, folded out in 3D.", media: loop("comp-3", "1/1"), gridSpan: 2 },
  { id: "dd-loop", caption: "Mascot design concepts. Round one: a little robot learning to wave.", media: loop("dd-loop", "1/1"), gridSpan: 1 },
  // 4 + 2
  { id: "render-0001", caption: "Endeavor's new site, on a device demo. 90+ brands, one screen.", media: loop("render-0001", "16/9"), gridSpan: 4 },
  { id: "sizzle", caption: "Sizzle. The logo holds still. Then the whole cast shows up.", media: loop("sizzle", "16/9", true), gridSpan: 2 },
  // 2 + 2 + 2
  { id: "balloon-girl", caption: "Balloon girl. She keeps the string, and the ground lets go.", media: loop("balloon-girl", "4/3"), gridSpan: 2 },
  { id: "collins", caption: "Collins logo. Wings, a crown, and a name that takes its time.", media: loop("collins", "1/1"), gridSpan: 2 },
  { id: "comp-1", caption: "Inclusive social post. Grandma finally gets the spotlight.", media: loop("comp-1", "4/3"), gridSpan: 2 },
  // 3 + 3
  { id: "image-processing", caption: "Lunch break. Nobody eats a burger that fast, except in animation.", media: loop("image-processing", "4/3"), gridSpan: 3 },
  { id: "render-ae", caption: "Cherry. A white car, a red room, and the name already on the wall.", media: loop("render-ae", "16/9"), gridSpan: 3 },
  // 4 + 2
  { id: "hand", caption: "Hand. A little hand in a blue cup, running through the gestures.", media: loop("hand", "1/1"), gridSpan: 4 },
  { id: "wiggl-logo", caption: "Wiggl logo animation. A name like that was never going to sit still.", media: loop("wiggl-logo", "1/1"), gridSpan: 2, scale: 2.4 },
  // 6
  { id: "thiken", caption: "Thiken loop. The wordmark throws a party, and one pink guest dances.", media: loop("thiken", "16/9"), gridSpan: 6 },
  // 3 + 3
  { id: "group-482566", caption: "More mascot concepts. Two robots, one job opening.", media: still("group-482566", "16/9", "Two 3D robot characters, one waving."), gridSpan: 3 },
  { id: "untitled", caption: "Knomadix character design. Meet the crew who live inside the screens.", media: still("untitled", "4/3", "Knomadix cartoon characters on a purple stage."), gridSpan: 3 },
];

export const EXPERIMENTS: Experiment[] = ITEMS.map((item, i) => ({ ...item, order: i + 1 }));
