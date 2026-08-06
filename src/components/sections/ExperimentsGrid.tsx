import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { Experiment } from "@/lib/content";

import { ExperimentTile } from "./ExperimentTile";

/**
 * "Things That Kept Me Up" (§9.6).
 *
 * 3 columns at lg+, 2 at md, 1 below. The mockup's 1,1,1 / 2,1 / 1,2 / 2
 * rhythm comes entirely from each item's `gridSpan` in content/experiments.ts
 * — this component holds no layout pattern of its own, so reordering the grid
 * is a content edit, never a code change.
 *
 * `items-start` matters: tiles have differing aspect ratios, and without it
 * grid would stretch every tile in a row to match the tallest.
 */
export function ExperimentsGrid({
  experiments,
}: {
  experiments: Experiment[];
}) {
  if (experiments.length === 0) return null;

  return (
    <section aria-labelledby="experiments-heading">
      <SectionHeading id="experiments-heading">
        Things That Kept Me Up
      </SectionHeading>

      <div className="mt-(--spacing-8) grid grid-cols-1 items-start gap-(--spacing-4) md:grid-cols-2 lg:grid-cols-3">
        {experiments.map((experiment) => (
          <ExperimentTile key={experiment.id} experiment={experiment} />
        ))}
      </div>
    </section>
  );
}
