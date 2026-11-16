import { Media } from "@/components/media/Media";
import { Caption } from "@/components/primitives/Caption";
import type { Experiment } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

/**
 * A single gallery tile (§9.6) — opens the Lightbox on click.
 *
 * `data-cursor="expand"` / `data-cursor-label="Expand"` ("Play" for YouTube tiles) per §7/§8.5; the
 * accessible name comes from the caption via aria-label, so the cursor label
 * is reinforcement, never the sole carrier of information (§8.4.6).
 */
const SPAN_CLASS = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  6: "lg:col-span-6",
} as const;

export function ExperimentTile({
  experiment,
  onExpand,
  wideOnTablet = false,
}: {
  experiment: Experiment;
  onExpand: () => void;
  /** Last tile of an odd tablet row. Stretches so the pair doesn't leave a hole. */
  wideOnTablet?: boolean;
}) {
  const { media, caption, gridSpan, scale } = experiment;

  return (
    <figure
      className={cn(
        "flex min-w-0 flex-col lg:h-full",
        wideOnTablet && "sm:col-span-2",
        SPAN_CLASS[gridSpan],
      )}
    >
      <button
        type="button"
        onClick={onExpand}
        aria-label={`${media.kind === "youtube" ? "Play" : "Expand"}: ${caption}`}
        data-cursor="expand"
        data-cursor-label={media.kind === "youtube" ? "Play" : "Expand"}
        className="relative block min-h-0 w-full flex-1 text-left"
      >
        {/* In flow on small screens (aspect-video). At lg the row has a fixed
         * height, so the picture is taken out of flow and cropped to the cell. */}
        <Media
          media={media}
          scale={scale}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
        />
      </button>
      <figcaption className="min-w-0" title={caption}>
        <Caption className="mt-(--spacing-3) truncate">{caption}</Caption>
      </figcaption>
    </figure>
  );
}
