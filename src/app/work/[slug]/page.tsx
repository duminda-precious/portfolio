import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { InteractiveEmbed } from "@/components/media/InteractiveEmbed";
import { Media } from "@/components/media/Media";
import { ButtonLink } from "@/components/primitives/ButtonLink";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { BodyBlocks } from "@/components/sections/BodyBlocks";
import { FeaturedCard } from "@/components/sections/FeaturedCard";
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
  // Deduped: with only two studies, previous and next are the same one.
  const others = [previous, next].filter(
    (p, i, all): p is NonNullable<typeof p> =>
      p !== null && all.findIndex((q) => q?.slug === p.slug) === i,
  );

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
      <Container as="main" paper className="pb-(--container-pad)">
        <div id="main">
          <div>
            {/* Cover is the LCP candidate on this route. It starts at the
             * top edge of the viewport; the fixed header sits over it. */}
            {project.cover.kind === "embed" ? (
              <InteractiveEmbed media={project.cover} priority />
            ) : (
              <Media media={project.cover} priority />
            )}
          </div>

          <header className="mt-(--space-section)">
            <Eyebrow tags={project.tags} />
            <h1 className="type-h2 mt-(--spacing-4) text-pretty text-ink">
              {project.title}
            </h1>
            <p className="type-body mt-(--spacing-6) text-pretty text-ink-muted">
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

          {/* Every study ends on the same ask the footer makes, said louder. */}
          <aside
            className="mt-(--space-section) flex flex-col items-start gap-(--spacing-6) rounded-(--radius-sm) bg-brand-500 p-(--spacing-4) text-cream md:flex-row md:items-center md:justify-between [&_:focus-visible]:outline-(--color-cream)"
          >
            <p className="type-h4 max-w-[20ch]">
              Got something like this on your plate?
            </p>
            <ButtonLink
              href="/work-with-me"
              variant="glass"
              className="shrink-0"
            >
              Work with me <span aria-hidden="true">→</span>
            </ButtonLink>
          </aside>

          {/* Two more studies, last on the page. Same card as the homepage.
           * previous/next wrap at both ends, so the reader is never
           * dead-ended. */}
          {others.length > 0 ? (
            <section
              className="mt-(--space-section)"
              aria-labelledby="other-studies-heading"
            >
              <SectionHeading id="other-studies-heading">
                Other case studies
              </SectionHeading>
              <ul className="mt-(--spacing-8) grid grid-cols-1 gap-(--spacing-8) md:grid-cols-2 md:gap-(--spacing-4)">
                {others.map((other) => (
                  <li key={other.slug}>
                    <FeaturedCard project={other} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </Container>

      <Footer />
    </>
  );
}
