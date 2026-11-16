import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CopyEmail } from "@/components/primitives/CopyEmail";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { getSocialLinks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work with me",
  description:
    "Open for projects of any size, and long-term contracts too. Product design, motion and 3D, from research to the last keyframe.",
};

/**
 * Contact page (§2.2).
 *
 * Copy drafted 2026-11-15 from Duminda's interview answers.
 *
 * No contact form: a mailto link needs no backend, no spam handling, and no
 * consent surface. If a form is wanted later it needs a decision on where
 * submissions go before it is worth building.
 */
/** Two halves of the work, as described in the 2026-11-15 interview. */
const SERVICES = [
  {
    heading: "Product, start to finish",
    intro:
      "Not just the design system. I can take a product through the whole pipeline, from the first question to the last micro-interaction.",
    items: [
      "Research",
      "UX",
      "Design documentation and handoff",
      "Motion design",
      "Motion systems and templates",
      "Iconography",
      "Micro-interactions",
      "3D, Three.js and WebGL",
    ],
  },
  {
    heading: "3D and characters",
    intro:
      "On the other side, I'm a 3D generalist. Characters, worlds, and the lighting and camera work that make them feel alive.",
    items: [
      "Character design",
      "Rigging",
      "Modelling",
      "Animation",
      "Lighting and texturing",
      "Camera direction",
    ],
  },
] as const;

export default async function WorkWithMePage() {
  const socials = await getSocialLinks();
  const email = socials.find((s) => s.label === "Email");

  return (
    <>
      <Container as="main" paper className="pb-(--space-section)">
        <div id="main">
          <PageHeader
            title="Work with me"
            standfirst="Got something that needs designing, moving or building in 3D? I'm in."
          />

          {/* Availability */}
          <section className="mt-(--space-section)">
            <SectionHeading>Availability</SectionHeading>
            <p className="type-body-sm mt-(--spacing-6) max-w-[65ch] text-ink">
              I'm open for work right now. Size doesn't really matter to me: a
              quick fix, a full product, or a long-term contract where I sit in
              with your team. We can work out the shape of it together.
            </p>
          </section>

          {/* Services */}
          <section className="mt-(--space-section)">
            <SectionHeading>What I do</SectionHeading>
            <div className="mt-(--spacing-8) grid grid-cols-1 gap-(--spacing-8) md:grid-cols-2">
              {SERVICES.map((service) => (
                <div
                  key={service.heading}
                  className="border-t border-hairline pt-(--spacing-4)"
                >
                  <h3 className="type-title text-ink">{service.heading}</h3>
                  <p className="type-body-sm mt-(--spacing-3) max-w-[50ch] text-ink-muted">
                    {service.intro}
                  </p>
                  <ul className="type-body-sm mt-(--spacing-4) space-y-(--spacing-1) text-ink">
                    {service.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* CV. Copy is the Figma text, including all three Precious Studio lines. */}
          <section className="mt-(--space-section)" aria-labelledby="cv-heading">
            <SectionHeading id="cv-heading">CV</SectionHeading>
            <div className="mt-(--spacing-8) border border-hairline bg-surface px-(--spacing-6) py-(--spacing-6)">
              <Eyebrow tags={["One page"]} />
              <p className="type-title mt-(--spacing-3) text-ink">
                Duminda Hettiarachchi
              </p>
              <p className="type-body-sm mt-(--spacing-3) max-w-[48ch] text-ink">
                Visual designer. The roles, the tools, and where I&apos;ve
                worked. Attach the Word file when an application asks for one.
              </p>
              <div className="mt-(--spacing-6) flex flex-wrap gap-x-(--spacing-6) gap-y-(--spacing-2)">
                <a
                  href="/cv/duminda-hettiarachchi-cv.pdf"
                  target="_blank"
                  rel="noopener"
                  className="type-action inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-4"
                >
                  Read the PDF
                </a>
                <a
                  href="/cv/duminda-hettiarachchi-cv.docx"
                  download="Duminda Hettiarachchi - CV.docx"
                  className="type-action inline-flex min-h-[44px] items-center text-ink underline underline-offset-4"
                >
                  Download the Word file
                </a>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mt-(--space-section)">
            <SectionHeading>Say hello</SectionHeading>
            <p className="type-body-sm mt-(--spacing-6) max-w-[65ch] text-ink">
              Tell me what you're making and where it's stuck. A rough idea is
              plenty to start with.
            </p>

            {email ? (
              /* mailto: is stripped for display — the link re-adds it. */
              <CopyEmail email={email.href.replace("mailto:", "")} />
            ) : null}
          </section>
        </div>
      </Container>

      <Footer />
    </>
  );
}
