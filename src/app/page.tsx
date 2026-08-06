import Link from "next/link";

import { ExperimentsGrid } from "@/components/sections/ExperimentsGrid";
import { Container } from "@/components/primitives/Container";
import { getExperiments, getSite, getSocialLinks } from "@/lib/content";

/**
 * Homepage (§9).
 *
 * Structure per §9.1: a full-bleed video band, the 1280px white container
 * below it separated by --hero-content-gap, and the footer on the grey page
 * OUTSIDE the container.
 *
 * Featured work is still a stand-in — it needs getProjects() and the zod
 * schemas from Phase 1. The blue blocks are the mockup's own loading state
 * (§6.4.2), not arbitrary placeholders.
 */
export default async function HomePage() {
  const [experiments, socials, site] = await Promise.all([
    getExperiments(),
    getSocialLinks(),
    getSite(),
  ]);

  return (
    <>
      {/*
        Full-bleed hero band — 74vh, capped at the artboard's 800px.

        Phase 3 swaps this div for the Gumlet loop. When it does, the <video>
        needs `object-cover object-bottom` so the framing stays anchored to the
        BOTTOM CENTRE as the viewport resizes — the subject sits low in frame
        and top-cropping would cut it. The wrapper already clips overflow, so
        the video only has to fill it.
      */}
      <div
        className="h-(--hero-band-height) w-full overflow-hidden bg-page"
        aria-hidden="true"
      >
        {/* <video className="h-full w-full object-cover object-bottom" … /> */}
      </div>

      <Container as="main" paper belowHero className="pb-(--space-section)">
        <div id="main" className="hero-optical-top">
          <h1 className="type-h1 text-ink">
            Hey! I&apos;m Duminda. Crafting Experiences That Move{" "}
            <span className="text-brand-500">Literally.</span>
          </h1>

          {/*
            Non-interactive by design (§9.4) — a <div>, not a <button>. A
            disabled control with no action does not belong in the a11y tree.
            Phase 2: becomes an anchor to #featured-work.
          */}
          <div className="mt-(--spacing-8) inline-flex items-center gap-(--spacing-2) rounded-(--radius-pill) bg-chip px-(--spacing-4) py-(--spacing-2)">
            <span className="h-(--spacing-2) w-(--spacing-2) rounded-(--radius-pill) border border-ink" />
            <span className="type-action text-ink">Scroll For My Work</span>
          </div>

          <p className="type-body-sm mt-(--space-section) max-w-[65ch] text-ink-muted">
            Phase 0 scaffold. The design system is live at{" "}
            {/* brand-700, not 500 — the deep blue is the link colour (§3.2). */}
            <Link
              href="/tokens"
              className="text-brand-700 underline underline-offset-4"
            >
              /tokens
            </Link>
            . Featured work and the experiments grid land in Phase 3.
          </p>

          {/* Stand-in for the three 16:9 featured cards. */}
          <div className="mt-(--space-section) space-y-(--space-section)">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="aspect-video w-full bg-brand-500" />
                {/* Eyebrow = Label (16px Bold). Sits on paper, so brand-500. */}
                <p className="type-label mt-(--spacing-3) text-brand-500">
                  Design System · Web · Mobile
                </p>
                <p className="type-title mt-(--spacing-2) text-ink">
                  Placeholder — real projects come from getProjects() in Phase
                  1.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-(--space-section)">
            <ExperimentsGrid experiments={experiments} />
          </div>
        </div>
      </Container>

      {/* Footer sits on the grey page, OUTSIDE the white container (§9.7). */}
      <Container as="footer" className="py-(--space-section)">
        {/* ink, not brand — blue fails AA on the grey page at body size. */}
        <p className="type-h4 text-ink">
          {site.copyright(new Date().getFullYear())}
        </p>

        <ul className="mt-(--spacing-8) flex flex-wrap gap-(--spacing-8)">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="cta"
                data-cursor-label={social.cursorLabel}
                className="type-action inline-flex min-h-[44px] items-center text-ink underline-offset-4 hover:underline"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
