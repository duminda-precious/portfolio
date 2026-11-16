import Link from "next/link";

import { Container } from "@/components/primitives/Container";

/**
 * 404 (§2.2) — "an empty screen is an invitation".
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
          Well, this is awkward.
        </h1>

        <p className="type-body mt-(--spacing-6) max-w-[55ch] text-ink-muted">
          This page isn&apos;t here. Maybe it moved, maybe I never made it. I
          animate things for a living, so honestly, stuff wandering off is on
          brand.
        </p>

        <div className="mt-(--spacing-12) flex flex-wrap gap-(--spacing-8)">
          <Link
            href="/"
            className="type-action inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-4"
          >
            Take me home
          </Link>
          <Link
            href="/work"
            className="type-action inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-4"
          >
            Show me the work
          </Link>
        </div>
      </div>
    </Container>
  );
}
