import { InteractiveEmbed } from "@/components/media/InteractiveEmbed";
import { Media } from "@/components/media/Media";
import { Caption } from "@/components/primitives/Caption";
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
type MediaBlock = Extract<BodyBlock, { kind: "media" }>;
type SectionBlock = Extract<BodyBlock, { kind: "section" }>;
type Group = BodyBlock | { kind: "gallery"; items: MediaBlock[] };

const RATIO: Record<MediaBlock["media"]["aspect"], number> = {
  "16/9": 16 / 9,
  "4/3": 4 / 3,
  "1/1": 1,
  "3/4": 3 / 4,
};

/** Tallest a gallery row is allowed to get, in px. */
const ROW_MAX_HEIGHT = 520;
/** Matches gap-(--spacing-4). */
const ROW_GAP = 16;
const ROW_MAX_ITEMS = 3;

/** Consecutive media blocks become one gallery; everything else passes through. */
function groupBlocks(blocks: BodyBlock[]): Group[] {
  const groups: Group[] = [];
  for (const block of blocks) {
    const last = groups[groups.length - 1];
    const joinable =
      block.kind === "media" &&
      last?.kind === "gallery" &&
      !block.solo &&
      !last.items[last.items.length - 1].solo;
    if (joinable) {
      last.items.push(block);
    } else if (block.kind === "media") {
      groups.push({ kind: "gallery", items: [block] });
    } else {
      groups.push(block);
    }
  }
  return groups;
}

/** Stacked paragraphs in the ~20px case study text style. */
function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div data-cursor="text" className="space-y-(--spacing-6)">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="type-section-text text-pretty text-ink">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function SectionText({ block }: { block: SectionBlock }) {
  return (
    /* Title on top, text underneath. No separators: the size step and the
     * gap carry the hierarchy. h2: the case study title is the h1 and the
     * block heading sits under it. Levels must never skip (§11). */
    <section>
      <h2 className="type-section-title text-ink">{block.heading}</h2>
      <div className="mt-(--spacing-4)">
        <Paragraphs paragraphs={block.paragraphs} />
      </div>
    </section>
  );
}

/**
 * A filled card: blue title on top, text underneath. Brief items and
 * takeaways stack these vertically, like a project plan.
 */
function Card({
  title,
  text,
  as: Heading = "h3",
}: {
  title: string;
  text: string;
  as?: "h2" | "h3";
}) {
  return (
    <div
      data-cursor="text"
      className="rounded-(--radius-sm) bg-surface p-(--spacing-6) md:p-(--spacing-8)"
    >
      <Heading className="type-section-title text-pretty text-brand-700">
        {title}
      </Heading>
      <p className="type-section-text mt-(--spacing-4) text-pretty text-ink">
        {text}
      </p>
    </div>
  );
}

function MediaFigure({
  block,
  sizes,
  className,
  style,
}: {
  block: MediaBlock;
  sizes: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <figure className={className} style={style}>
      {/* A live embed in the body is there to be used, so it gets the
       * "Drag to play with" overlay rather than the inert card treatment. */}
      {block.media.kind === "embed" ? (
        <InteractiveEmbed media={block.media} />
      ) : (
        <Media media={block.media} sizes={sizes} />
      )}
      {block.caption ? (
        <figcaption>
          <Caption className="mt-(--spacing-3)">{block.caption}</Caption>
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Split a run into even rows of at most ROW_MAX_ITEMS (4 → 2+2, not 3+1). */
function toRows(items: MediaBlock[]): MediaBlock[][] {
  const rowCount = Math.ceil(items.length / ROW_MAX_ITEMS);
  const perRow = Math.ceil(items.length / rowCount);
  const rows: MediaBlock[][] = [];
  for (let i = 0; i < items.length; i += perRow) {
    rows.push(items.slice(i, i + perRow));
  }
  return rows;
}

/**
 * Justified gallery row.
 *
 * Each item's flex-grow is its aspect ratio, so every item in a row lands at
 * the SAME height with nothing cropped beyond its declared shape — a 16:9
 * beside a 1:1 reads as one band rather than two mismatched boxes. The row's
 * max-width is derived from ROW_MAX_HEIGHT, so a lone square or a pair of
 * squares stays a sensible size instead of stretching to the full container.
 * Below `sm` the row stacks and each item takes the full width.
 */
function Gallery({ items }: { items: MediaBlock[] }) {
  return (
    <div className="space-y-(--spacing-4)">
      {toRows(items).map((row, rowIndex) => {
        const ratioSum = row.reduce((sum, b) => sum + RATIO[b.media.aspect], 0);
        // Any item flagged fullWidth lifts the height cap for its whole row.
        const maxWidth = row.some((b) => b.fullWidth)
          ? undefined
          : ROW_MAX_HEIGHT * ratioSum + ROW_GAP * (row.length - 1);
        return (
          <div
            key={rowIndex}
            className="flex flex-col gap-(--spacing-4) sm:flex-row"
            style={{ maxWidth }}
          >
            {row.map((block, i) => (
              <MediaFigure
                key={i}
                block={block}
                className="min-w-0 sm:flex-(--ratio)"
                style={
                  { "--ratio": RATIO[block.media.aspect] } as React.CSSProperties
                }
                sizes={`(min-width: 640px) ${Math.round(100 / row.length)}vw, 100vw`}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function BodyBlocks({ blocks }: { blocks: BodyBlock[] }) {
  return (
    <div className="space-y-(--space-section)">
      {groupBlocks(blocks).map((block, index) => {
        switch (block.kind) {
          case "lead":
            return (
              /* Special text: an optional ~20px label over a ~40px statement.
               * data-cursor="text" shrinks the dot to a caret-like bar over
               * readable prose (§8.3). */
              <div key={index} data-cursor="text">
                {block.label ? (
                  <p className="type-section-text mb-(--spacing-3) text-ink">
                    {block.label}
                  </p>
                ) : null}
                <p className="type-statement text-pretty text-ink">
                  {block.text}
                </p>
              </div>
            );

          case "section":
            return <SectionText key={index} block={block} />;

          case "prose":
            return <Paragraphs key={index} paragraphs={block.paragraphs} />;

          case "gallery":
            return <Gallery key={index} items={block.items} />;

          // Media is always folded into a gallery by groupBlocks.
          case "media":
            return null;

          case "pullquote":
            return (
              <figure key={index} data-cursor="text">
                <blockquote className="type-statement text-pretty text-brand-700">
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

          case "brief":
            return (
              <section
                key={index}
                aria-label="At a glance"
                className="space-y-(--spacing-4)"
              >
                {block.items.map((item) => (
                  <Card
                    key={item.label}
                    as="h2"
                    title={item.label}
                    text={item.text}
                  />
                ))}
              </section>
            );

          case "compare":
            return (
              <section
                key={index}
                aria-label="Before and after"
                className="grid grid-cols-1 gap-(--spacing-4) md:grid-cols-2"
              >
                {[
                  { side: block.before, isAfter: false },
                  { side: block.after, isAfter: true },
                ].map(({ side, isAfter }) => (
                  <div
                    key={side.label}
                    data-cursor="text"
                    className={
                      isAfter
                        ? "rounded-(--radius-sm) bg-brand-700 p-(--spacing-6) text-paper md:p-(--spacing-8)"
                        : "rounded-(--radius-sm) bg-surface p-(--spacing-6) text-ink md:p-(--spacing-8)"
                    }
                  >
                    <h2 className="type-section-title">{side.label}</h2>
                    <ul className="type-section-text mt-(--spacing-4) space-y-(--spacing-3)">
                      {side.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            );

          case "takeaways":
            return (
              <section key={index}>
                <h2 className="type-section-title text-ink">{block.heading}</h2>
                <ol className="mt-(--spacing-4) space-y-(--spacing-4)">
                  {block.items.map((item, i) => (
                    <li key={item.title}>
                      <Card title={`${i + 1}. ${item.title}`} text={item.text} />
                    </li>
                  ))}
                </ol>
              </section>
            );

          case "stats":
            return (
              /* Same label-over-value shape as special text, smaller. */
              <dl
                key={index}
                className="grid grid-cols-1 gap-(--spacing-8) sm:grid-cols-3"
              >
                {block.items.map((item) => (
                  <div key={item.label} className="flex flex-col-reverse">
                    <dd className="type-statement text-ink">{item.value}</dd>
                    <dt className="type-section-text mb-(--spacing-2) text-ink-muted">
                      {item.label}
                    </dt>
                  </div>
                ))}
              </dl>
            );
        }
      })}
    </div>
  );
}
