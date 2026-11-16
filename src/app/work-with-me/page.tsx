import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/primitives/ButtonLink";
import { CopyEmail } from "@/components/primitives/CopyEmail";
import { Container } from "@/components/primitives/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { getCv, getSocialLinks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work with me",
  description:
    "Open for work right now. Product design, motion and 3D, from the first question to the last keyframe. Send a rough idea and we'll work out the rest.",
};

/**
 * Work with me (§2.2). Rebuilt 2026-11-16 around ONE action: email me.
 *
 * The page answers a client's questions in the order they ask them:
 * are you free → what can you do for me → can you prove it → how does it
 * go → who are you on paper → how do I reach you. The primary button shows
 * up twice (top and bottom) and both go to the same place. Everything else
 * is a text link, so nothing competes with it.
 *
 * No contact form: a mailto link needs no backend, no spam handling, and no
 * consent surface. If a form is wanted later it needs a decision on where
 * submissions go before it is worth building.
 *
 * Every claim here is from a case study or the CV. Keep it that way.
 */

/** What a client can hand over, each with the case study that proves it. */
const OFFERS = [
  {
    heading: "A product, start to finish",
    text: "Research, UX, design systems, documentation and handoff. From the first question to the last micro-interaction.",
    proof: "90+ brands, one design system",
    href: "/work/endeavor-design-system",
  },
  {
    heading: "Motion that earns its place",
    text: "Motion design, motion systems and templates, iconography and micro-interactions. Built so developers trigger a state and it plays.",
    proof: "A fitness app that moves like its studio",
    href: "/work/lumin-fitness-motion",
  },
  {
    heading: "3D and characters",
    text: "Character design, modelling, rigging, animation, lighting, texturing and camera direction. Three.js and WebGL when it has to live in a browser.",
    proof: "3D fractals, drawn in a browser",
    href: "/work/threejs-fractal-viewer",
  },
  {
    heading: "A prototype you can actually hold",
    text: "With AI in the loop, an idea becomes a working prototype in days. You test the real thing, and we design around what survives.",
    proof: "An app built first and designed second",
    href: "/work/safari-guest-app",
  },
] as const;

/** Numbers that already appear in the case studies and the CV. */
const RECEIPTS = [
  { value: "10+ years", label: "across the whole production cycle" },
  { value: "~40%", label: "less design debt for Endeavor's 90+ brands" },
  { value: "10x", label: "smaller motion assets in the Lumin app" },
  { value: "Day 1", label: "a working prototype for a safari guest app" },
] as const;

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
  const [socials, cv] = await Promise.all([getSocialLinks(), getCv()]);
  const email = socials
    .find((s) => s.label === "Email")
    ?.href.replace("mailto:", "");
  const mailto = email
    ? `mailto:${email}?subject=${encodeURIComponent("I've got something for you")}`
    : null;

  return (
    <>
      <Container as="main" paper className="pb-(--space-section)">
        <div id="main">
          {/* Hero: availability, the pitch, the one button. */}
          <header className="pt-(--hero-content-gap)">
            <p className="glass-tint type-label inline-flex min-h-[32px] items-center gap-(--spacing-2) rounded-(--radius-pill) px-(--spacing-3) text-ink">
              <span
                aria-hidden="true"
                className="size-2 rounded-(--radius-pill) bg-[#1f9d55]"
              />
              Open for work right now
            </p>

            <h1 className="type-h2 mt-(--spacing-6) max-w-[18ch] text-ink">
              Got something that needs designing, moving or building in 3D?{" "}
              <span className="text-brand-500">I&apos;m in.</span>
            </h1>

            <p className="type-body mt-(--spacing-6) max-w-[52ch] text-ink-muted">
              A quick fix, a full product, or a long stretch sitting in with
              your team. Size doesn&apos;t really matter to me. Send a rough
              idea and we&apos;ll work out the shape of it together.
            </p>

            <div className="mt-(--spacing-8) flex flex-wrap items-center gap-x-(--spacing-6) gap-y-(--spacing-3)">
              {mailto ? (
                <ButtonLink href={mailto}>
                  Email me your idea <span aria-hidden="true">→</span>
                </ButtonLink>
              ) : null}
              <a
                href="#cv"
                className="type-action inline-flex min-h-[44px] items-center text-ink underline underline-offset-4 hover:text-brand-700"
              >
                Or read my CV first
              </a>
            </div>
          </header>

          {/* What I can take on, each with its proof. */}
          <section
            className="mt-(--space-section)"
            aria-labelledby="offers-heading"
          >
            <SectionHeading id="offers-heading">
              What you can hand me.
            </SectionHeading>
            <ul className="mt-(--spacing-8) grid grid-cols-1 gap-(--spacing-4) md:grid-cols-2">
              {OFFERS.map((offer) => (
                <li
                  key={offer.heading}
                  className="flex flex-col rounded-(--radius-sm) border border-hairline bg-surface p-(--spacing-6) md:p-(--spacing-8)"
                >
                  <h3 className="type-title text-ink">{offer.heading}</h3>
                  <p className="type-body-sm mt-(--spacing-3) max-w-[48ch] text-ink">
                    {offer.text}
                  </p>
                  <p className="type-body-sm mt-auto pt-(--spacing-6) text-ink-muted">
                    Proof:{" "}
                    <Link
                      href={offer.href}
                      className="inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-4"
                    >
                      {offer.proof}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Receipts. */}
          <section
            className="mt-(--space-section)"
            aria-labelledby="receipts-heading"
          >
            <SectionHeading id="receipts-heading">
              Receipts, not adjectives.
            </SectionHeading>
            <dl className="mt-(--spacing-8) grid grid-cols-2 gap-x-(--spacing-8) gap-y-(--spacing-8) border-t border-hairline pt-(--spacing-8) lg:grid-cols-4">
              {RECEIPTS.map((receipt) => (
                <div key={receipt.label} className="flex flex-col-reverse">
                  <dt className="type-body-sm mt-(--spacing-2) max-w-[22ch] text-ink-muted">
                    {receipt.label}
                  </dt>
                  <dd className="type-h3 text-brand-700">{receipt.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* How it goes. */}
          <section
            className="mt-(--space-section) grid grid-cols-1 gap-(--spacing-6) lg:grid-cols-12 lg:gap-(--spacing-8)"
            aria-labelledby="steps-heading"
          >
            <SectionHeading id="steps-heading" className="lg:col-span-5">
              How it goes.
            </SectionHeading>
            <ol className="lg:col-span-7">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="flex gap-(--spacing-6) border-t border-hairline py-(--spacing-6)"
                >
                  <span
                    aria-hidden="true"
                    className="type-label w-(--spacing-6) shrink-0 pt-[0.35em] text-brand-700"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="type-title text-ink">{step.title}</h3>
                    <p className="type-body-sm mt-(--spacing-2) max-w-[55ch] text-ink-muted">
                      {step.text}
                    </p>
                  </div>
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
                  The CV, no download needed.
                </SectionHeading>
                <p className="type-body-sm mt-(--spacing-4) max-w-[55ch] text-ink-muted">
                  {cv.name}. {cv.title}. {cv.summary}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-x-(--spacing-6) gap-y-(--spacing-2)">
                <ButtonLink href={cv.pdf} newTab variant="quiet">
                  Get the one-page PDF
                </ButtonLink>
                <a
                  href={cv.docx}
                  download={cv.docxName}
                  className="type-body-sm inline-flex min-h-[44px] items-center text-ink-muted underline underline-offset-4 hover:text-ink"
                >
                  Need Word? Here you go
                </a>
              </div>
            </div>

            <ol className="mt-(--spacing-8) border-b border-hairline">
              {cv.roles.map((role) => (
                <li
                  key={`${role.title}-${role.company}`}
                  className="grid grid-cols-1 gap-x-(--spacing-8) gap-y-(--spacing-1) border-t border-hairline py-(--spacing-6) md:grid-cols-12"
                >
                  <p className="type-label pt-[0.4em] text-brand-700 md:col-span-2">
                    {role.dates}
                  </p>
                  <div className="md:col-span-4">
                    <h3 className="type-title text-ink">{role.title}</h3>
                    <p className="type-body-sm mt-(--spacing-1) text-ink-muted">
                      {role.company}, {role.place}
                    </p>
                  </div>
                  {"highlight" in role && role.highlight ? (
                    <p className="type-body-sm max-w-[55ch] text-ink md:col-span-6">
                      {role.highlight}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>

            <dl className="mt-(--spacing-6) grid grid-cols-1 gap-(--spacing-6) sm:grid-cols-2">
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

          {/* The ask, again. Same action as the top of the page. */}
          {email && mailto ? (
            <section
              className="mt-(--space-section) rounded-(--radius-sm) bg-brand-500 px-(--spacing-6) py-(--spacing-16) text-cream md:px-(--spacing-16) [&_:focus-visible]:outline-(--color-cream)"
              aria-labelledby="hello-heading"
            >
              <h2 id="hello-heading" className="type-h2 max-w-[14ch]">
                So, what are you making?
              </h2>
              <p className="type-body mt-(--spacing-6) max-w-[48ch]">
                Tell me what it is and where it&apos;s stuck. A rough idea is
                plenty to start with.
              </p>
              <div className="mt-(--spacing-8)">
                <ButtonLink href={mailto} variant="onBrand">
                  Email me your idea <span aria-hidden="true">→</span>
                </ButtonLink>
              </div>
              <p className="type-body-sm mt-(--spacing-12)">
                Rather copy the address?
              </p>
              <CopyEmail email={email} onBrand className="mt-(--spacing-2)" />
            </section>
          ) : null}
        </div>
      </Container>

      <Footer />
    </>
  );
}
