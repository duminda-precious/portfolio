import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { InteractiveEmbed } from "@/components/media/InteractiveEmbed";
import { Media } from "@/components/media/Media";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { BodyBlocks } from "@/components/sections/BodyBlocks";
import {
  DISCIPLINE_LABELS,
  getAdjacentProjects,
  getProject,
  getCaseStudies,
} from "@/lib/content";

/** Prerender every case study at build time — they are fully static. */
export async function generateStaticParams() {
  const projects = await getCaseStudies();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return { title: "Not found" };

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      // Only a still works as a share image — not a video file or an embed.
      images:
        project.cover.kind === "image" && project.cover.src
          ? [{ url: project.cover.src }]
          : undefined,
    },
  };
}

/**
 * Case study template (§2.2).
 *
 * Every study opens with its header — the cover video or image — then the
 * title, summary and body. The one glass surface is the facts row (client,
 * discipline, year, tools).
 *
 * Tier 1 projects get the full narrative; Tier 2 renders the same template
 * with a shorter body. The tier drives content volume, not a separate
 * component — the layouts are identical.
 */
export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const { previous, next } = await getAdjacentProjects(slug);

  const facts = [
    project.client ? { label: "Client", value: project.client } : null,
    { label: "Discipline", value: DISCIPLINE_LABELS[project.discipline] },
    project.year ? { label: "Year", value: String(project.year) } : null,
    project.tools.length > 0
      ? { label: "Tools", value: project.tools.join(", ") }
      : null,
  ].filter((fact) => fact !== null);

  return (
    <>
      <Container as="main" paper className="pb-(--space-section)">
        <div id="main">
          <div className="pt-(--hero-content-gap)">
            {/* Cover is the LCP candidate on this route, and the first thing
             * on every case study. */}
            {project.cover.kind === "embed" ? (
              <InteractiveEmbed media={project.cover} priority />
            ) : (
              <Media media={project.cover} priority />
            )}
          </div>

          <header className="mt-(--space-section)">
            <Eyebrow tags={project.tags} />
            <h1 className="type-h2 mt-(--spacing-4) text-ink">
              {project.title}
            </h1>
            <p className="type-body mt-(--spacing-6) max-w-[55ch] text-ink-muted">
              {project.summary}
            </p>

            <dl className="glass-tint mt-(--spacing-8) grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-x-(--spacing-8) gap-y-(--spacing-6) rounded-(--radius-sm) p-(--spacing-8)">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="type-label text-brand-700">{fact.label}</dt>
                  <dd className="type-body mt-(--spacing-1) text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </header>

          <div className="mt-(--space-section)">
            <BodyBlocks blocks={project.body} />
          </div>

          {/* Next/prev wraps at both ends, so the reader is never dead-ended. */}
          {previous || next ? (
            <nav
              aria-label="More work"
              className="mt-(--space-section) border-t border-hairline pt-(--spacing-8)"
            >
              <ul className="flex flex-col gap-(--spacing-8) sm:flex-row sm:justify-between">
                {previous ? (
                  <li>
                    <Link
                      href={`/work/${previous.slug}`}
                      data-cursor="cta"
                      data-cursor-label="View case study"
                      className="group block"
                    >
                      <span className="type-caption text-ink-muted">
                        Previous
                      </span>
                      <span className="type-title mt-(--spacing-1) block max-w-[40ch] text-ink group-hover:text-brand-700">
                        {previous.title}
                      </span>
                    </Link>
                  </li>
                ) : null}
                {next ? (
                  <li className="sm:text-right">
                    <Link
                      href={`/work/${next.slug}`}
                      data-cursor="cta"
                      data-cursor-label="View case study"
                      className="group block"
                    >
                      <span className="type-caption text-ink-muted">Next</span>
                      <span className="type-title mt-(--spacing-1) block max-w-[40ch] text-ink group-hover:text-brand-700">
                        {next.title}
                      </span>
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>
          ) : null}
        </div>
      </Container>

      <Footer />
    </>
  );
}
