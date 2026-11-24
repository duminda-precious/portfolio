import { Footer } from "@/components/layout/Footer";
import { LazyVideo } from "@/components/media/LazyVideo";
import { ParallaxLayer } from "@/components/media/ParallaxLayer";
import { Chip } from "@/components/primitives/Chip";
import { Container } from "@/components/primitives/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { CtaCard } from "@/components/sections/CtaCard";
import { ExperimentsGrid } from "@/components/sections/ExperimentsGrid";
import { FeaturedCard } from "@/components/sections/FeaturedCard";
import { getExperiments, getFeaturedProjects } from "@/lib/content";

/**
 * Homepage (§9).
 *
 * Structure per §9.1: full-bleed video band → the 1280px white container
 * below it (separated by --hero-content-gap) → footer on the grey page
 * OUTSIDE the container. The video runs 120px past the container's top
 * edge, behind it.
 */
export default async function HomePage() {
  const [featured, experiments] = await Promise.all([
    getFeaturedProjects(3),
    getExperiments(),
  ]);

  return (
    <>
      {/*
        Full-bleed hero band. The band keeps its height (it sets where the
        paper starts), but the video inside is taller: it runs the 120px gap
        PLUS 120px more, so its bottom edge slides behind the top of the
        paper, which sits in front (z-media). It scrolls away with the page
        (not fixed), and lags behind the scroll (parallax) so the paper
        slides over it. The clip's own background is the page grey, so it reads
        as part of the background. Decorative and silent.
      */}
      <div
        className="relative h-(--hero-band-height) w-full"
        aria-hidden="true"
      >
        <ParallaxLayer className="absolute inset-x-0 top-0 h-[calc(var(--hero-band-height)+var(--hero-content-gap)*2)] overflow-hidden bg-page">
          <LazyVideo
            src="/video/hero/hero.mp4"
            poster="/video/hero/hero-poster.jpg"
            eager
            className="h-full w-full object-cover"
          />
        </ParallaxLayer>
      </div>

      <Container as="main" paper belowHero className="pb-(--container-pad)">
        <div id="main" className="hero-optical-top">
          <h1 className="type-h1 text-ink">
            Hey, I&apos;m Duminda. I design things, then I make them move.{" "}
            <span className="text-brand-500">Literally.</span>
          </h1>

          {/* The plain facts the joke leaves out: full name, title,
            disciplines and Sri Lanka (content brief, 2026-11-22). */}
          <p className="type-body mt-(--spacing-6) text-pretty text-ink-muted">
            Duminda Madushan, Director of Design at Precious Studio. Full-stack
            designer in Sri Lanka: product, motion and 3D.
          </p>

          {/*
            Non-interactive for now (§9.4) — a Chip with no onClick renders a
            <span>, not a <button>. A disabled-looking control with no action
            does not belong in the a11y tree.
            Phase 2: becomes an anchor to #featured-work.
          */}
          <Chip className="mt-(--spacing-8)">
            <span aria-hidden="true" className="scroll-arrow">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1.5 3.25 5 6.75 8.5 3.25"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            The work&apos;s down here
          </Chip>

          {/* Featured work — never hardcoded, always from the content layer.
            The heading (content brief, 2026-11-22) takes the same style and
            gap as "Things that kept me up", so the page reads hero, featured
            work, experiments, contact. */}
          {featured.length > 0 ? (
            <section
              id="featured-work"
              aria-labelledby="featured-heading"
              className="mt-(--space-section)"
            >
              <SectionHeading id="featured-heading">
                The big ones.
              </SectionHeading>
              <div className="mt-(--spacing-8) space-y-(--space-section)">
                {featured.map((project, index) => (
                  <FeaturedCard
                    key={project.slug}
                    project={project}
                    /* Only the first card is an LCP candidate. */
                    priority={index === 0}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-(--space-section)">
            <ExperimentsGrid experiments={experiments} />
          </div>

          {/* Same ask as every case study, right after the grid. */}
          <CtaCard className="mt-(--space-section)" />
        </div>
      </Container>

      <Footer />
    </>
  );
}
