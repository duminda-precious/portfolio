import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/primitives/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { getSocialLinks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work With Me",
  description:
    "Availability, services, and how to get in touch. Placeholder description — real copy pending.",
};

/**
 * Contact page (§2.2).
 *
 * ⚠️ ALL COPY IS PLACEHOLDER (§13.15). Services, availability, and process
 * text below are structural stand-ins at realistic lengths, not real offers.
 *
 * No contact form: a mailto link needs no backend, no spam handling, and no
 * consent surface. If a form is wanted later it needs a decision on where
 * submissions go before it is worth building.
 */
export default async function WorkWithMePage() {
  const socials = await getSocialLinks();
  const email = socials.find((s) => s.label === "Email");

  return (
    <>
      <Container as="main" paper className="pb-(--space-section)">
        <div id="main">
          <PageHeader
            title="Work With Me"
            standfirst="Placeholder standfirst for the contact page. Real copy pending — this runs to about the length the final introduction will occupy."
          />

          {/* Availability */}
          <section className="mt-(--space-section)">
            <SectionHeading>Availability</SectionHeading>
            <p className="type-body-sm mt-(--spacing-6) max-w-[65ch] text-ink">
              Placeholder availability copy. Real status pending — this states
              whether freelance work is open, what the current lead time looks
              like, and the kind of engagement that fits best.
            </p>
          </section>

          {/* Services */}
          <section className="mt-(--space-section)">
            <SectionHeading>What I Do</SectionHeading>
            <div className="mt-(--spacing-8) grid grid-cols-1 gap-(--spacing-8) md:grid-cols-3">
              {["Design Systems", "Motion Design", "3D & Creative Coding"].map(
                (service) => (
                  <div
                    key={service}
                    className="border-t border-hairline pt-(--spacing-4)"
                  >
                    <h3 className="type-title text-ink">{service}</h3>
                    <p className="type-body-sm mt-(--spacing-3) text-ink-muted">
                      Placeholder service description. Real copy pending — sized
                      to roughly match the final blurb for this column.
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* Contact */}
          <section className="mt-(--space-section)">
            <SectionHeading>Say Hello</SectionHeading>
            <p className="type-body-sm mt-(--spacing-6) max-w-[65ch] text-ink">
              Placeholder contact copy. Real wording pending.
            </p>

            {email ? (
              /* No data-cursor — a large underlined link is its own CTA. */
              <a
                href={email.href}
                className="type-h4 mt-(--spacing-8) inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-8"
              >
                {/* mailto: is stripped for display — the href carries it. */}
                {email.href.replace("mailto:", "")}
              </a>
            ) : null}
          </section>
        </div>
      </Container>

      <Footer />
    </>
  );
}
