"use client";

import { useState } from "react";

import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { Experiment } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

import { ExperimentTile } from "./ExperimentTile";
import { Lightbox } from "./Lightbox";

/**
 * "Things that kept me up" (§9.6).
 *
 * Desktop is a 6-column grid. Each item's `gridSpan` lives in
 * content/experiments.ts, and every row of spans adds up to 6, so a row
 * never opens a hole. Neighbouring rows use different span patterns.
 *
 * A row is its own grid with a fixed height. Tiles stretch to that height
 * and the picture is cropped to the cell, which is what keeps the gap
 * between rows even when the clips have different shapes.
 *
 * Below the lg breakpoint the creative spans drop away: one column on
 * small screens, two from sm, and an odd last tile stretches so the pair
 * still fills the row.
 */
function packRows(experiments: Experiment[]) {
  const rows: { experiment: Experiment; index: number }[][] = [];
  let row: { experiment: Experiment; index: number }[] = [];
  let used = 0;

  experiments.forEach((experiment, index) => {
    const span = experiment.gridSpan;
    if (used > 0 && used + span > 6) {
      rows.push(row);
      row = [];
      used = 0;
    }
    row.push({ experiment, index });
    used += span;
    if (used >= 6) {
      rows.push(row);
      row = [];
      used = 0;
    }
  });

  if (row.length > 0) rows.push(row);
  return rows;
}

/** Same span mix, same row height. Sorted so 4+2 and 2+4 share a frame. */
function rowFrame(spans: number[]) {
  const key = [...spans].sort((a, b) => b - a).join("+");
  switch (key) {
    case "6":
      return "lg:h-[min(56vw,520px)]";
    case "4+2":
      return "lg:h-[min(46vw,440px)]";
    case "3+3":
      return "lg:h-[min(40vw,380px)]";
    case "2+2+2":
      return "lg:h-[min(36vw,340px)]";
    case "3+2+1":
      return "lg:h-[min(38vw,360px)]";
    default:
      return "lg:h-[min(40vw,380px)]";
  }
}

export function ExperimentsGrid({
  experiments,
}: {
  experiments: Experiment[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (experiments.length === 0) return null;

  const rows = packRows(experiments);

  return (
    <section aria-labelledby="experiments-heading">
      <SectionHeading id="experiments-heading">
        Things that kept me up
      </SectionHeading>

      <div className="mt-(--spacing-8) flex flex-col gap-(--spacing-4)">
        {rows.map((row) => {
          const spans = row.map((item) => item.experiment.gridSpan);
          return (
            <div
              key={row.map((item) => item.experiment.id).join("-")}
              className={cn(
                "grid grid-cols-1 items-stretch gap-(--spacing-4) sm:grid-cols-2 lg:grid-cols-6",
                rowFrame(spans),
              )}
            >
              {row.map((item, position) => (
                <ExperimentTile
                  key={item.experiment.id}
                  experiment={item.experiment}
                  wideOnTablet={row.length % 2 === 1 && position === row.length - 1}
                  onExpand={() => setActiveIndex(item.index)}
                />
              ))}
            </div>
          );
        })}
      </div>

      <Lightbox
        experiments={experiments}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </section>
  );
}
