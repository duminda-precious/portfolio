"use client";

import { useMemo, useState } from "react";

import { Chip } from "@/components/primitives/Chip";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Media } from "@/components/media/Media";
import { DISCIPLINES, DISCIPLINE_LABELS, type Project } from "@/lib/content";
import Link from "next/link";

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

  const visible = useMemo(
    () =>
      projects.filter((project) => {
        const matchesDiscipline =
          discipline === "all" || project.discipline === discipline;

        const matchesTags = activeTags.every((tag) =>
          project.tags.includes(tag),
        );

        return matchesDiscipline && matchesTags;
      }),
    [projects, discipline, activeTags],
  );

  const hasFilters = discipline !== "all" || activeTags.length > 0;

  return (
    <>
      <div className="mt-(--spacing-8)">
        <h2 className="sr-only-focusable absolute">Filter work</h2>

        {/* Discipline — single select, the primary facet. */}
        <div
          role="group"
          aria-label="Filter by discipline"
          className="flex flex-wrap gap-(--spacing-3)"
        >
          <Chip
            onClick={() => setDiscipline("all")}
            isActive={discipline === "all"}
            cursorLabel="Show all"
          >
            All
          </Chip>
          {DISCIPLINES.map((value) => (
            <Chip
              key={value}
              onClick={() => setDiscipline(value)}
              isActive={discipline === value}
              cursorLabel="Filter work"
            >
              {DISCIPLINE_LABELS[value]}
            </Chip>
          ))}
        </div>

        {/* Tags — multi select, the secondary facet. */}
        <div
          role="group"
          aria-label="Filter by tag"
          className="mt-(--spacing-4) flex flex-wrap gap-(--spacing-2)"
        >
          {allTags.map((tag) => (
            <Chip
              key={tag}
              onClick={() => toggleTag(tag)}
              isActive={activeTags.includes(tag)}
              cursorLabel="Filter work"
            >
              {tag}
            </Chip>
          ))}
        </div>

        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setDiscipline("all");
              setActiveTags([]);
            }}
            data-cursor="cta"
            data-cursor-label="Clear filters"
            className="type-body-sm mt-(--spacing-4) min-h-[44px] text-brand-700 underline underline-offset-4"
          >
            Clear filters
          </button>
        ) : null}
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
          {visible.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              data-cursor="cta"
              data-cursor-label="View case study"
              className="group block"
            >
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
            </Link>
          ))}
        </div>
      ) : (
        /* Empty state in voice — an empty screen is an invitation (§2.2). */
        <div className="mt-(--spacing-8) py-(--space-section)">
          <p className="type-title text-ink">
            Nothing matches that combination.
          </p>
          <p className="type-body-sm mt-(--spacing-3) text-ink-muted">
            Placeholder empty-state copy — real wording pending. Try loosening a
            filter.
          </p>
        </div>
      )}
    </>
  );
}
