"use client";

import { useMemo, useState } from "react";

import { Chip } from "@/components/primitives/Chip";
import { cn } from "@/lib/utils/cn";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Media } from "@/components/media/Media";
import {
  DISCIPLINES,
  DISCIPLINE_LABELS,
  isCaseStudy,
  type Experiment,
  type Project,
} from "@/lib/content";
import { Lightbox } from "@/components/sections/Lightbox";
import Link from "next/link";

/** Resting folder tab: tinted glass (see .glass-tint in globals.css). */
const TAB_REST = "glass-tint";

type Discipline = (typeof DISCIPLINES)[number];
type DisciplineFilter = Discipline | "all";

/**
 * Faceted work index (§2.4, §9.5).
 *
 * Two facets, and they compose with AND: discipline narrows first, then any
 * selected tags must ALL be present. Tags are multi-select because "Web +
 * Design System" is a meaningful client query in a way that "Web OR Design
 * System" is not.
 *
 * Filtering happens client-side over the full list. That is the right call at
 * this scale — a handful of projects means no network round trip, instant
 * response, and no loading state to design. Revisit past ~100 projects.
 */
export function WorkFilter({
  projects,
  allTags,
}: {
  projects: Project[];
  allTags: string[];
}) {
  const [discipline, setDiscipline] = useState<DisciplineFilter>("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const toggleTag = (tag: string) =>
    setActiveTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag],
    );

  const matches = (d: DisciplineFilter, tags: string[]) => (project: Project) =>
    (d === "all" || project.discipline === d) &&
    tags.every((tag) => project.tags.includes(tag));

  const visible = useMemo(
    () => projects.filter(matches(discipline, activeTags)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects, discipline, activeTags],
  );

  /*
   * Dead-end prevention: a chip is disabled when picking it would leave zero
   * projects. Active chips are never disabled — deselecting only widens the
   * result. "All" never needs it: dropping the discipline can only widen.
   */
  const wouldBeEmpty = (d: DisciplineFilter, tags: string[]) =>
    !projects.some(matches(d, tags));

  const hasFilters = discipline !== "all" || activeTags.length > 0;

  /* The visible YouTube cards, shaped as lightbox items so arrow keys step
   * between the videos currently on screen. */
  const videos: Experiment[] = visible
    .filter((p) => !isCaseStudy(p))
    .map((p, i) => ({
      id: p.slug,
      caption: p.title,
      media: p.cover,
      gridSpan: 1,
      order: i,
    }));
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  return (
    <>
      <div className="mt-(--spacing-8)">
        <h2 className="sr-only-focusable absolute">Filter work</h2>

        {/*
          Discipline — single select, the primary facet, styled as folder
          tabs. The active tab shares the panel's fill and overlaps its top
          edge by 1px, so tab and panel read as one sheet; the tag chips sit
          inside that sheet because they refine the chosen discipline.
          Kept as aria-pressed toggle buttons, not role="tab": these filter one
          list rather than switching between separate panels.
        */}
        <div
          role="group"
          aria-label="Filter by discipline"
          className="-mb-px flex gap-(--spacing-1) overflow-x-auto"
        >
          {[
            { value: "all" as const, label: "All" },
            ...DISCIPLINES.map((value) => ({
              value,
              label: DISCIPLINE_LABELS[value],
            })),
          ].map(({ value, label }) => {
            const isActive = discipline === value;
            const isDisabled =
              !isActive && value !== "all" && wouldBeEmpty(value, activeTags);
            return (
              <button
                key={value}
                type="button"
                onClick={() => setDiscipline(value)}
                disabled={isDisabled}
                aria-pressed={isActive}
                className={cn(
                  "type-label min-h-[44px] shrink-0 whitespace-nowrap rounded-t-(--radius-sm) px-(--spacing-6) py-(--spacing-3) text-[1rem]",
                  "border border-b-0 transition-colors duration-(--duration-fast)",
                  isActive
                    ? "relative z-10 border-hairline bg-paper text-brand-700 shadow-[0_-2px_5px_rgb(0_0_0/0.08)]"
                    : isDisabled
                      ? "cursor-not-allowed text-ink opacity-40 " + TAB_REST
                      : "text-ink " + TAB_REST,
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Tags — multi select, the secondary facet, inside the folder. */}
        <div
          role="group"
          aria-label="Filter by tag"
          className="relative flex flex-wrap gap-(--spacing-2) border-t border-hairline pt-(--spacing-6)"
        >
          {allTags.map((tag) => (
            <Chip
              key={tag}
              onClick={() => toggleTag(tag)}
              size="sm"
              isActive={activeTags.includes(tag)}
              isDisabled={
                !activeTags.includes(tag) &&
                wouldBeEmpty(discipline, [...activeTags, tag])
              }
              cursorLabel="Filter work"
            >
              {tag}
            </Chip>
          ))}

          {/* Sits at the end of the chip row, not on its own line. */}
          {hasFilters ? (
            <Chip
              size="sm"
              tone="danger"
              onClick={() => {
                setDiscipline("all");
                setActiveTags([]);
              }}
              cursorLabel="Clear filters"
            >
              Clear filters
            </Chip>
          ) : null}
        </div>

      </div>

      {/*
        aria-live announces the result count on filter change. Without it a
        screen reader user gets no feedback that anything happened — the
        visual list update is invisible to them.
      */}
      <p
        aria-live="polite"
        className="type-caption mt-(--spacing-6) text-ink-muted"
      >
        {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      {visible.length > 0 ? (
        <div className="mt-(--spacing-8) grid grid-cols-1 gap-(--space-section) md:grid-cols-2">
          {visible.map((project) => {
            const card = (
              <>
                <div className="overflow-hidden">
                  <Media
                    media={project.cover}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:scale-[1.02]"
                  />
                </div>
                <Eyebrow tags={project.tags} className="mt-(--spacing-3)" />
                <h3 className="type-title mt-(--spacing-2) text-ink">
                  {project.title}
                </h3>
              </>
            );

            /* YouTube work has no case study page: the card plays the video
             * in the same lightbox the homepage uses. */
            if (!isCaseStudy(project)) {
              const index = videos.findIndex((v) => v.id === project.slug);
              return (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => setActiveVideo(index)}
                  aria-label={`Play: ${project.title}`}
                  data-cursor="expand"
                  data-cursor-label="Play"
                  className="group block w-full text-left"
                >
                  {card}
                </button>
              );
            }

            return (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                data-cursor="cta"
                data-cursor-label="View case study"
                className="group block"
              >
                {card}
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty state in voice — an empty screen is an invitation (§2.2). */
        <div className="mt-(--spacing-8) py-(--space-section)">
          <p className="type-title text-ink">
            Nothing matches that combination.
          </p>
          <p className="type-body-sm mt-(--spacing-3) text-ink-muted">
            Try taking a filter off. There's more in here, promise.
          </p>
        </div>
      )}

      <Lightbox
        experiments={videos}
        activeIndex={activeVideo}
        onClose={() => setActiveVideo(null)}
        onNavigate={setActiveVideo}
      />
    </>
  );
}
