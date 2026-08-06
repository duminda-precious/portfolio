import Link from "next/link";

import { Media } from "@/components/media/Media";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import type { Project } from "@/lib/content";

/**
 * A featured project card (§9.5).
 *
 * The WHOLE card is one <a>. Never nest a second link inside — it hurts both
 * the a11y tree and SEO, and gives keyboard users two stops for one
 * destination.
 *
 * Hover does media scale OR loop playback, never both (§9.5) — restraint. The
 * scale is on a wrapper with overflow-hidden so the image grows within its
 * frame rather than pushing the layout.
 */
export function FeaturedCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="cta"
      data-cursor-label="View case study"
      className="group block"
    >
      <div className="overflow-hidden">
        <Media
          media={project.cover}
          priority={priority}
          className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:scale-[1.02]"
        />
      </div>

      <Eyebrow tags={project.tags} className="mt-(--spacing-3)" />

      <h3 className="type-title mt-(--spacing-2) text-ink">{project.title}</h3>
    </Link>
  );
}
