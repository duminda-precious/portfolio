import Link from "next/link";

import { Container } from "@/components/primitives/Container";

/**
 * 404 (§2.2) — "an empty screen is an invitation".
 *
 * ⚠️ PLACEHOLDER COPY (§13.16). The brief calls for something witty and in
 * voice; this is structural stand-in text at roughly the right length.
 *
 * No Footer here: the footer is an async server component and this route
 * renders for arbitrary bad URLs, so keeping it dependency-free means a 404
 * can never itself fail.
 */
export default function NotFound() {
  return (
    <Container as="main" paper className="min-h-screen pb-(--space-section)">
      <div id="main" className="pt-(--hero-content-gap)">
        <p className="type-label text-brand-500">404</p>

        <h1 className="type-h2 mt-(--spacing-4) max-w-[20ch] text-ink">
          Placeholder 404 headline — real copy pending.
        </h1>

        <p className="type-body mt-(--spacing-6) max-w-[55ch] text-ink-muted">
          Placeholder 404 body copy. This page does not exist, which is the one
          thing we know for certain. Real wording pending (§13.16).
        </p>

        <div className="mt-(--spacing-12) flex flex-wrap gap-(--spacing-8)">
          <Link
            href="/"
            data-cursor="cta"
            data-cursor-label="Back home"
            className="type-action inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-4"
          >
            Back to the homepage
          </Link>
          <Link
            href="/work"
            data-cursor="cta"
            data-cursor-label="Go to my work"
            className="type-action inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-4"
          >
            See the work instead
          </Link>
        </div>
      </div>
    </Container>
  );
}
