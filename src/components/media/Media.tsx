import Image from "next/image";

import type { Media as MediaType } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

export const ASPECT_CLASS: Record<MediaType["aspect"], string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
};

type MediaProps = {
  media: MediaType;
  /** Cursor pill copy (§8). Decorative reinforcement only — never the sole
   * carrier of information. */
  cursorLabel?: string;
  /** LCP candidate. Set on the first above-the-fold image only. */
  priority?: boolean;
  /** Responsive sizes hint. Defaults to the container width at desktop. */
  sizes?: string;
  /** Embeds only. false (the default) makes the iframe an inert picture:
   * no pointer events, out of the tab order and the a11y tree — required
   * inside cards, where the whole tile is a link. true lets it be used. */
  interactive?: boolean;
  /** Zooms the media inside the box. The box size does not change. */
  scale?: number;
  /**
   * Skip the media's own aspect ratio. The tile passes a height instead,
   * and object-cover crops whatever doesn't fit.
   */
  fill?: boolean;
  className?: string;
};

/**
 * The media workhorse (§6.4). Every blue box in the mockup renders through it.
 *
 * ⚠️ VIDEO PLAYBACK BELOW IS A VISUAL-TEST STUB, NOT PHASE 2. Added
 * 2026-08-06 to preview a real local-loop file in the featured cards and
 * experiments grid. It plays UNCONDITIONALLY (no IntersectionObserver
 * gating, no 3-video concurrency cap, §6.4 requirements 3–4) — fine for
 * eyeballing a handful of tiles, wrong for a real page with 8+ grid tiles
 * autoplaying at once. Do not treat this as Phase 2 done; the real
 * implementation still needs the gating/cap before shipping.
 *
 * Two invariants that must survive any future edit:
 *
 *   1. The aspect ratio is reserved by CSS BEFORE load, so nothing reflows
 *      when the image arrives. CLS must stay at 0 (§11).
 *   2. The brand-blue fill sits behind every media element. In the mockup the
 *      blue boxes ARE the loading state, so an unloaded image looks
 *      intentional rather than broken (§6.4.2).
 */
export function Media({
  media,
  cursorLabel,
  priority = false,
  sizes = "(min-width: 1280px) 1280px, 100vw",
  interactive = false,
  scale,
  fill = false,
  className,
}: MediaProps) {
  const isDecorative = media.alt === "";
  const isVideo = media.kind === "local-loop" || media.kind === "gumlet-video";
  const zoomed = scale != null && scale !== 1;
  const zoomStyle = zoomed ? { transform: `scale(${scale})` } : undefined;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-brand-500",
        fill ? "aspect-video" : ASPECT_CLASS[media.aspect],
        className,
      )}
      data-cursor={cursorLabel ? "expand" : undefined}
      data-cursor-label={cursorLabel}
    >
      {media.kind === "image" && media.src ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", zoomed && "origin-center")}
          style={zoomStyle}
          /* Decorative images are removed from the a11y tree entirely rather
           * than announced with an empty name (§6.4.8). */
          aria-hidden={isDecorative || undefined}
        />
      ) : isVideo && media.src ? (
        /* muted+playsInline+loop+autoPlay per §6.4.6 — missing playsInline is
         * what causes the iOS fullscreen-takeover bug. aria-hidden because
         * decorative background loops are excluded from the a11y tree
         * (§6.4.8); a real accessible name would come from `alt` if this
         * video ever needs to convey information beyond decoration. */
        <video
          src={media.src}
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            zoomed && "origin-center",
          )}
          style={zoomStyle}
          aria-hidden="true"
        />
      ) : media.kind === "youtube" && media.src ? (
        /* Thumbnail only — the player itself loads in the lightbox. */
        <>
          <Image
            src={media.poster ?? `https://i.ytimg.com/vi/${media.src}/maxresdefault.jpg`}
            alt={media.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
          <span
            aria-hidden="true"
            className="glass-tint absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-(--radius-pill) text-ink"
          >
            <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 4.5v11l9-5.5-9-5.5z" />
            </svg>
          </span>
        </>
      ) : media.kind === "embed" && media.src ? (
        /* Live page (e.g. a WebGL demo). `alt` doubles as the frame title.
         * Lazy so an off-screen embed costs nothing until scrolled to. */
        <iframe
          src={media.src}
          title={media.alt}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          tabIndex={interactive ? undefined : -1}
          aria-hidden={interactive ? undefined : true}
          /* Inert (card) embeds render at 2.5x the box and are scaled back
           * down, so the page lays out as if on a desktop-sized screen —
           * otherwise its own UI panels swamp a small card. */
          className={cn(
            "absolute top-0 left-0 border-0",
            interactive
              ? "h-full w-full"
              : "pointer-events-none h-[250%] w-[250%] origin-top-left scale-[0.4]",
          )}
        />
      ) : null}
    </div>
  );
}
