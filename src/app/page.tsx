import Link from "next/link";

import { Container } from "@/components/primitives/Container";

/**
 * Homepage — Phase 0 skeleton.
 *
 * This stands up the one structural move that everything else hangs off (§9.1):
 * a full-bleed band, with the 1280px white container rising into it by
 * --hero-overlap, and the footer sitting on the grey page OUTSIDE the container.
 *
 * The real hero, featured work, and experiments grid land in Phase 3. The blue
 * blocks below are stand-ins for <Media /> (Phase 2) and are intentionally the
 * same brand blue the mockup uses as its loading state (§6.4.2).
 */
export default function HomePage() {
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
        </div>
      </Container>

      {/* Footer sits on the grey page, OUTSIDE the white container (§9.7). */}
      <Container as="footer" className="py-(--space-section)">
        <p className="type-h4 text-ink">
          Site Content © Duminda M · All Rights Reserved ·{" "}
          {new Date().getFullYear()} · Made With Love &amp; Caffeine
        </p>
      </Container>
    </>
  );
}
