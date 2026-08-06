import { CursorToggle } from "@/components/cursor/CursorToggle";
import { Container } from "@/components/primitives/Container";
import { getSite, getSocialLinks } from "@/lib/content";

/**
 * Site footer (§9.7).
 *
 * Sits on --color-page grey, OUTSIDE the white container — the container ends
 * and the footer breathes on the page background.
 *
 * ⚠️ Everything here is --color-ink, never brand blue. brand-500 fails AA on
 * the grey background at body size (§3.2), so the social links are ink with an
 * underline on hover rather than blue.
 */
export async function Footer() {
  const [site, socials] = await Promise.all([getSite(), getSocialLinks()]);

  return (
    <Container as="footer" className="py-(--space-section)">
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
              /* No data-cursor — these are text links with a clear underline
               * hover state, so the cursor's CTA reinforcement is redundant. */
              /* Padded to a ≥44px touch target — these are small text links
               * in the mockup and would otherwise be hard to hit (§9.7). */
              className="type-action inline-flex min-h-[44px] items-center text-ink underline-offset-4 hover:underline"
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Escape hatch (§8.4.9). Self-hides where no custom cursor runs. */}
      <div className="mt-(--spacing-8)">
        <CursorToggle />
      </div>
    </Container>
  );
}
