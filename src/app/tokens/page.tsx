import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/primitives/Container";

import { TYPE_SCALE } from "./token-data";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

/**
 * Dev-only reference. Three things: font, color, glass.
 * 404s in production.
 */

const COLORS = [
  { name: "Blue", value: "#2E57EF", swatch: "bg-brand-500" },
  { name: "Blue deep", value: "#1035BF", swatch: "bg-brand-700" },
  { name: "Ink", value: "#1F1F1F", swatch: "bg-ink" },
  { name: "Muted", value: "#747474", swatch: "bg-ink-muted" },
  { name: "Paper", value: "#FFFFFF", swatch: "bg-paper" },
  { name: "Page", value: "#CFCFCF", swatch: "bg-page" },
  { name: "Cream", value: "#F5F1EB", swatch: "bg-cream" },
] as const;

export default function TokensPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <Container paper as="main" className="py-(--space-section)">
      <h1 className="type-h2 text-ink">Design system</h1>
      <p className="type-body mt-(--spacing-4) max-w-[42rem] text-ink-muted">
        Font, color, and glass. The hero title stays at 80px. Everything else
        is 15% smaller, on desktop and on mobile.
      </p>

      <section className="mt-(--space-section)">
        <h2 className="type-title text-ink">Font</h2>
        <p className="type-body-sm mt-(--spacing-2) text-ink-muted">
          Rethink Sans. One family.
        </p>
        <div className="mt-(--spacing-8) space-y-(--spacing-8)">
          {TYPE_SCALE.map((step) => (
            <div key={step.name}>
              <p className="type-caption text-ink-muted">
                {step.name} · {step.spec}
              </p>
              <p className={`mt-(--spacing-2) text-ink ${step.className}`}>
                {step.sample}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-(--space-section)">
        <h2 className="type-title text-ink">Color</h2>
        <div className="mt-(--spacing-8) grid grid-cols-2 gap-(--spacing-4) sm:grid-cols-4 lg:grid-cols-7">
          {COLORS.map((color) => (
            <div key={color.name}>
              <div
                className={`aspect-[4/3] w-full border border-hairline ${color.swatch}`}
              />
              <p className="type-label mt-(--spacing-2) text-ink">{color.name}</p>
              <p className="type-caption text-ink-muted">{color.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-(--space-section)">
        <h2 className="type-title text-ink">Glass</h2>
        <p className="type-body-sm mt-(--spacing-2) max-w-[42rem] text-ink-muted">
          Light glass carries ink. On the blue field, the dark glass carries
          cream.
        </p>
        <div className="mt-(--spacing-8) grid gap-(--spacing-4) md:grid-cols-2">
          <div className="flex flex-col gap-(--spacing-4) bg-page p-(--spacing-8)">
            <div className="glass rounded-(--radius-sm) px-(--spacing-6) py-(--spacing-4)">
              <p className="type-action text-ink">Glass</p>
            </div>
            <div className="glass-strong rounded-(--radius-sm) px-(--spacing-6) py-(--spacing-4)">
              <p className="type-action text-ink">Glass strong</p>
            </div>
            <div className="glass-tint rounded-(--radius-sm) px-(--spacing-6) py-(--spacing-4)">
              <p className="type-action text-ink">Glass tint</p>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-brand-500 p-(--spacing-8)">
            <div className="glass-dark rounded-(--radius-sm) px-(--spacing-6) py-(--spacing-4)">
              <p className="type-action text-cream">Glass dark</p>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
