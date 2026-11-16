import { Footer } from "@/components/layout/Footer";
import { Chip } from "@/components/primitives/Chip";
import { Container } from "@/components/primitives/Container";
import { ExperimentsGrid } from "@/components/sections/ExperimentsGrid";
import { FeaturedCard } from "@/components/sections/FeaturedCard";
import { getExperiments, getFeaturedProjects } from "@/lib/content";

/**
 * Homepage (§9).
 *
 * Structure per §9.1: full-bleed video band → the 1280px white container
 * below it (separated by --hero-content-gap) → footer on the grey page
 * OUTSIDE the container.
 */
export default async function HomePage() {
  const [featured, experiments] = await Promise.all([
    getFeaturedProjects(3),
    getExperiments(),
  ]);

  return (
    <>
      {/*
        Full-bleed hero band — 74vh, capped at the artboard's 800px.

        Phase 2 swaps this for the Gumlet loop. The <video> needs
        `object-cover object-bottom` so framing stays anchored to the BOTTOM
        CENTRE on resize — the subject sits low in frame and top-cropping
        would cut it. This wrapper already clips overflow.
      */}
      <div
        className="h-(--hero-band-height) w-full overflow-hidden bg-page"
        aria-hidden="true"
      >
        {/* <video className="h-full w-full object-cover object-bottom" … /> */}
      </div>

      <Container as="main" paper belowHero className="pb-(--space-section)">
        <div id="main" className="hero-optical-top">
          {/* Forced two-line break after "Crafting" — natural wrapping won't
           * reliably land here once the viewport changes. */}
          <h1 className="type-h1 text-ink">
            Hey! I&apos;m Duminda. Crafting Experiences That Move{" "}
            <span className="text-brand-500">Literally.</span>
          </h1>

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
            Scroll for my work
          </Chip>

          {/* Featured work — never hardcoded, always from the content layer. */}
          {featured.length > 0 ? (
            <section
              id="featured-work"
              aria-label="Featured work"
              className="mt-(--space-section) space-y-(--space-section)"
            >
              {featured.map((project, index) => (
                <FeaturedCard
                  key={project.slug}
                  project={project}
                  /* Only the first card is an LCP candidate. */
                  priority={index === 0}
                />
              ))}
            </section>
          ) : null}

          <div className="mt-(--space-section)">
            <ExperimentsGrid experiments={experiments} />
          </div>
        </div>
      </Container>

      <Footer />
    </>
  );
}
