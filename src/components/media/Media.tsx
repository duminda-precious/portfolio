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
  className?: string;
};

/**
 * The media workhorse (§6.4). Every blue box in the mockup renders through it.
 *
 * Currently handles `image`. Video kinds (gumlet-video, local-loop) fall back
 * to the poster/blue fill — IntersectionObserver-gated playback and the
 * 3-video concurrency cap arrive in Phase 2, and shipping a half-built
 * autoplay path now would be worse than shipping none.
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
  className,
}: MediaProps) {
  const isDecorative = media.alt === "";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-brand-500",
        ASPECT_CLASS[media.aspect],
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
          className="object-cover"
          /* Decorative images are removed from the a11y tree entirely rather
           * than announced with an empty name (§6.4.8). */
          aria-hidden={isDecorative || undefined}
        />
      ) : null}

      {/*
        Video kinds intentionally render the blue fill for now. The poster
        frame shows through once Phase 2 wires <video> up; until then the fill
        is the design's own loading state, not a broken image.
      */}
    </div>
  );
}
