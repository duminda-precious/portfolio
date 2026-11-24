import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/primitives/ButtonLink";
import { Container } from "@/components/primitives/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { getCv, getSite, getSocialLinks } from "@/lib/content";

/** Absolute, so the layout's " · Duminda Madushan" suffix isn't added twice. */
export const metadata: Metadata = {
  title: {
    absolute: "Work with Duminda Madushan · Product, motion and 3D design",
  },
  description:
    "Got something that needs designing, moving or building in 3D? I'm a full-stack designer in Sri Lanka. Send me a rough idea. I don't need a brief.",
};

/**
 * Work with me (§2.2). Rebuilt 2026-11-16 around ONE action: email me.
 *
 * Kept deliberately short (2026-11-16): one blue section up top with the
 * pitch, the email and WhatsApp buttons, then how it goes, then the CV. The
 * offers grid and the numbers row were cut as clutter.
 *
 * No contact form: a mailto link needs no backend, no spam handling, and no
 * consent surface. If a form is wanted later it needs a decision on where
 * submissions go before it is worth building.
 *
 * Every claim here is from a case study or the CV. Keep it that way.
 *
 * The location and AI lines in the pitch came from the content brief
 * (2026-11-22). The hours were confirmed directly; "weeks into days" rests
 * on the seven-day guest app and the one-week fractal build.
 */

const STEPS = [
  {
    title: "You send a rough idea.",
    text: "Tell me what you're making and where it's stuck. Rough is plenty. I don't need a brief.",
  },
  {
    title: "We work out the shape.",
    text: "A quick fix, a full product, or me sitting in with your team for a while. We agree what done looks like before I draw anything.",
  },
  {
    title: "I get moving.",
    text: "You see real things early. Usually something you can click, not a deck you have to imagine.",
  },
] as const;

export default async function WorkWithMePage() {
  const [socials, cv, site] = await Promise.all([
    getSocialLinks(),
    getCv(),
    getSite(),
  ]);
  const email = socials
    .find((s) => s.label === "Email")
    ?.href.replace("mailto:", "");
  const mailto = email
    ? `mailto:${email}?subject=${encodeURIComponent("I've got something for you")}`
    : null;

  return (
    <>
      <Container as="main" paper className="pb-(--container-pad)">
        <div id="main">
          {/* One blue section: the pitch, the one button and
           * WhatsApp. It used to be a white hero plus a blue ask at the
           * bottom; they said the same thing twice. */}
          <header
            className="mt-(--hero-content-gap) rounded-(--radius-sm) bg-brand-500 p-(--spacing-4) text-cream [&_:focus-visible]:outline-(--color-cream)"
            aria-labelledby="hello-heading"
          >
            <h1 id="hello-heading" className="type-h2 text-pretty">
              Got something that needs designing, moving or building in 3D?
              I&apos;m in.
            </h1>

            <p className="type-body mt-(--spacing-6) text-pretty">
              A quick fix, a full product, or a long stretch sitting in with
              your team. Size doesn&apos;t really matter to me.
              <br />
              Send a rough idea and we&apos;ll work out the shape of it
              together.
              <br />
              I&apos;m based in Sri Lanka and work with teams abroad. My
              evenings overlap with US mornings.
              <br />I direct AI the way I&apos;d direct a team: a clear brief,
              strong opinions, my name on the result. It turns weeks into days.
            </p>

            {/* Primary (solid), secondary (glass), tertiary (ghost, far
             * right). One row, three clear levels. */}
            <div className="mt-(--spacing-8) flex flex-col items-start gap-(--spacing-3) md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-(--spacing-3)">
                {mailto ? (
                  <ButtonLink href={mailto} variant="onBrand">
                    Email me your idea <span aria-hidden="true">→</span>
                  </ButtonLink>
                ) : null}
                <ButtonLink href={site.whatsapp} newTab variant="glass">
                  Or just WhatsApp me
                </ButtonLink>
              </div>
              <ButtonLink href="#cv" variant="ghost" className="shrink-0">
                Read my resume first
              </ButtonLink>
            </div>
          </header>

          {/* How it goes. */}
          <section
            className="mt-(--space-section)"
            aria-labelledby="steps-heading"
          >
            <SectionHeading id="steps-heading">How it goes.</SectionHeading>
            <ol className="mt-(--spacing-8) space-y-(--spacing-4)">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-(--radius-sm) bg-surface p-(--spacing-6) md:p-(--spacing-8)"
                >
                  <h3 className="type-section-title text-pretty text-brand-700">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="type-section-text mt-(--spacing-4) text-pretty text-ink">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* The CV, readable right here. The files are the footnote. */}
          <section
            id="cv"
            className="mt-(--space-section) scroll-mt-(--spacing-24)"
            aria-labelledby="cv-heading"
          >
            <div className="flex flex-col gap-(--spacing-6) lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionHeading id="cv-heading">
                  The resume, no download needed.
                </SectionHeading>
                <p className="type-section-text mt-(--spacing-4) text-pretty text-ink-muted">
                  {cv.intro} {cv.summary}
                </p>
              </div>
              <div className="shrink-0">
                <ButtonLink href={cv.pdf} newTab variant="quiet">
                  Get the one-page PDF
                </ButtonLink>
              </div>
            </div>

            {/* A scannable list, so it sits one step below section text:
             * date (label) > role (body, semibold) > company and highlight
             * (body-sm). Education and Languages use the same levels. */}
            <ol className="mt-(--spacing-12) space-y-(--spacing-8)">
              {cv.roles.map((role) => (
                <li key={`${role.title}-${role.company}`}>
                  <p className="type-label text-brand-700">{role.dates}</p>
                  <h3 className="type-body mt-(--spacing-2) font-semibold text-ink">
                    {role.title}
                  </h3>
                  <p className="type-body-sm text-ink-muted">
                    {role.company}, {role.place}
                  </p>
                  {"highlight" in role && role.highlight ? (
                    <p className="type-body-sm mt-(--spacing-2) text-pretty text-ink">
                      {role.highlight}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>

            <dl className="mt-(--spacing-12) grid grid-cols-1 gap-(--spacing-8) sm:grid-cols-2">
              <div>
                <dt className="type-label text-brand-700">Education</dt>
                <dd className="type-body-sm mt-(--spacing-2) text-ink">
                  {cv.education}
                </dd>
              </div>
              <div>
                <dt className="type-label text-brand-700">Languages</dt>
                <dd className="type-body-sm mt-(--spacing-2) text-ink">
                  {cv.languages}
                </dd>
              </div>
            </dl>
          </section>

        </div>
      </Container>

      <Footer />
    </>
  );
}
