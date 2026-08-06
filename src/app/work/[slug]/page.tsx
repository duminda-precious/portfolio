import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Media } from "@/components/media/Media";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { BodyBlocks } from "@/components/sections/BodyBlocks";
import {
  DISCIPLINE_LABELS,
  getAdjacentProjects,
  getProject,
  getProjects,
} from "@/lib/content";

/** Prerender every case study at build time — they are fully static. */
export async function generateStaticParams() {
  const projects = await getProjects();
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
      images: project.cover.src ? [{ url: project.cover.src }] : undefined,
    },
  };
}

/**
 * Case study template (§2.2).
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

  return (
    <>
      <Container as="main" paper className="pb-(--space-section)">
        <div id="main">
          <header className="pt-(--hero-content-gap)">
            <Eyebrow tags={project.tags} />
            <h1 className="type-h2 mt-(--spacing-4) text-ink">
              {project.title}
            </h1>
            <p className="type-body mt-(--spacing-6) max-w-[55ch] text-ink-muted">
              {project.summary}
            </p>

            <dl className="mt-(--spacing-8) flex flex-wrap gap-(--spacing-8)">
              {project.client ? (
                <div>
                  <dt className="type-caption text-ink-muted">Client</dt>
                  <dd className="type-label mt-(--spacing-1) text-ink">
                    {project.client}
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="type-caption text-ink-muted">Discipline</dt>
                <dd className="type-label mt-(--spacing-1) text-ink">
                  {DISCIPLINE_LABELS[project.discipline]}
                </dd>
              </div>
              <div>
                <dt className="type-caption text-ink-muted">Year</dt>
                <dd className="type-label mt-(--spacing-1) text-ink">
                  {project.year}
                </dd>
              </div>
              {project.tools.length > 0 ? (
                <div>
                  <dt className="type-caption text-ink-muted">Tools</dt>
                  <dd className="type-label mt-(--spacing-1) text-ink">
                    {project.tools.join(", ")}
                  </dd>
                </div>
              ) : null}
            </dl>
          </header>

          <div className="mt-(--space-section)">
            {/* Cover is the LCP candidate on this route. */}
            <Media media={project.cover} priority />
          </div>

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
