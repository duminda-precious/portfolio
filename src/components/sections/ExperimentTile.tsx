import { Media } from "@/components/media/Media";
import { Caption } from "@/components/primitives/Caption";
import type { Experiment } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

/**
 * A single gallery tile (§9.6).
 *
 * Phase 2 makes this a lightbox trigger with hover-playback. Until there is
 * something to expand, it stays a plain figure — a button that opens nothing
 * is a worse outcome than no button.
 */
export function ExperimentTile({ experiment }: { experiment: Experiment }) {
  const { media, caption, gridSpan } = experiment;

  return (
    <figure
      className={cn(
        /* A span-2 tile takes two columns from md up. At the 1-column mobile
         * layout every tile is full-width, so the span simply doesn't apply
         * rather than being overridden (§9.6). */
        gridSpan === 2 && "md:col-span-2",
      )}
    >
      <Media
        media={media}
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      />
      <figcaption>
        <Caption className="mt-(--spacing-3)">{caption}</Caption>
      </figcaption>
    </figure>
  );
}
