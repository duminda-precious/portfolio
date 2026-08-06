import type { Experiment } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

const ASPECT_CLASS: Record<Experiment["media"]["aspect"], string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
};

/**
 * A single gallery tile (§9.6).
 *
 * The blue fill is not a placeholder standing in for the real design — it IS
 * the design's loading state (§6.4.2), so an unencoded tile looks intentional
 * rather than broken.
 *
 * Phase 2 replaces the inner div with <Media />, which brings
 * IntersectionObserver-gated playback and the 3-video concurrency cap. The
 * lightbox trigger arrives with it — until there's something to expand, a
 * button that opens nothing would be a worse a11y outcome than no button.
 */
export function ExperimentTile({ experiment }: { experiment: Experiment }) {
  const { media, caption, gridSpan } = experiment;

  return (
    <figure
      className={cn(
        /* A span-2 tile occupies two columns at md and up. At the 1-column
         * mobile layout every tile is full-width, so the span is ignored
         * rather than overridden (§9.6). */
        gridSpan === 2 && "md:col-span-2",
      )}
    >
      <div
        className={cn(
          "w-full bg-brand-500",
          /* Aspect ratio is reserved before load so CLS stays at 0 (§6.4.1). */
          ASPECT_CLASS[media.aspect],
        )}
        /* Decorative until real media lands — there is nothing here to
         * describe yet, and an empty alt is better than a fabricated one. */
        aria-hidden="true"
      />
      <figcaption className="type-caption mt-(--spacing-3) text-ink-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
