import { Media } from "@/components/media/Media";
import { Caption } from "@/components/primitives/Caption";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { BodyBlock } from "@/lib/content";

/**
 * Renders a case study body (§5).
 *
 * Structured blocks rather than MDX: same layouts, no extra dependencies, and
 * fully type-safe. If MDX arrives later it can produce this same block array,
 * so nothing downstream changes.
 *
 * Prose blocks are held to ~65ch. Full container width at 1280px would run
 * well past a comfortable reading measure.
 */
export function BodyBlocks({ blocks }: { blocks: BodyBlock[] }) {
  return (
    <div className="space-y-(--space-section)">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "lead":
            return (
              <p key={index} className="type-title max-w-[55ch] text-ink">
                {block.text}
              </p>
            );

          case "section":
            return (
              <section key={index}>
                {/* h3 — the case study title is the h1 and the block heading
                 * sits under it. Levels must never skip (§11). */}
                <SectionHeading as="h3">{block.heading}</SectionHeading>
                <div className="mt-(--spacing-6) space-y-(--spacing-6)">
                  {block.paragraphs.map((paragraph, i) => (
                    <p key={i} className="type-body-sm max-w-[65ch] text-ink">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            );

          case "media":
            return (
              <figure key={index}>
                <Media media={block.media} />
                {block.caption ? (
                  <figcaption>
                    <Caption className="mt-(--spacing-3)">
                      {block.caption}
                    </Caption>
                  </figcaption>
                ) : null}
              </figure>
            );

          case "pullquote":
            return (
              <figure key={index} className="max-w-[45ch]">
                <blockquote className="type-h4 text-brand-700">
                  {block.text}
                </blockquote>
                {block.attribution ? (
                  <figcaption>
                    <Caption className="mt-(--spacing-4)">
                      {block.attribution}
                    </Caption>
                  </figcaption>
                ) : null}
              </figure>
            );

          case "stats":
            return (
              <dl
                key={index}
                className="grid grid-cols-1 gap-(--spacing-8) border-t border-hairline pt-(--spacing-8) sm:grid-cols-3"
              >
                {block.items.map((item) => (
                  <div key={item.label}>
                    <dt className="type-caption text-ink-muted">
                      {item.label}
                    </dt>
                    <dd className="type-title mt-(--spacing-2) text-ink">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            );
        }
      })}
    </div>
  );
}
