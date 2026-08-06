import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/primitives/Container";

import { assess } from "./contrast";
import {
  BRAND,
  CONTRAST_PAIRS,
  DURATIONS,
  EASINGS,
  FLUID_SPACING,
  NEUTRALS,
  REM_CONVERSIONS,
  SPACING_STEPS,
  TYPE_SCALE,
} from "./token-data";

export const metadata: Metadata = {
  title: "Design tokens",
  robots: { index: false, follow: false },
};

/**
 * Dev-only design system reference. Phase 0 acceptance criterion (§12):
 * "renders the full system and the contrast audit is verified in-browser".
 *
 * 404s in production — this is scaffolding for us, not a page for visitors.
 */

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-hairline py-(--space-section)">
      <h2 className="type-h4 text-ink">{title}</h2>
      {note ? (
        <p className="type-body-sm mt-(--spacing-2) max-w-[65ch] text-ink-muted">
          {note}
        </p>
      ) : null}
      <div className="mt-(--spacing-8)">{children}</div>
    </section>
  );
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div>
      <div
        className="aspect-[4/3] w-full border border-hairline"
        style={{ backgroundColor: hex }}
      />
      <p className="mt-(--spacing-2) font-(family-name:--font-mono) text-(length:--text-caption) text-ink">
        {name}
      </p>
      <p className="font-(family-name:--font-mono) text-(length:--text-caption) text-ink-muted">
        {hex}
      </p>
    </div>
  );
}

export default function TokensPage() {
  // Dev-only route. In production this behaves as though it does not exist.
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <Container paper as="main" className="py-(--space-section)">
      <header>
        <p className="font-(family-name:--font-mono) text-(length:--text-caption) text-brand-500">
          Dev only · not indexed · 404s in production
        </p>
        <h1 className="type-h2 mt-(--spacing-4) text-ink">Design Tokens</h1>
        <p className="type-body-sm mt-(--spacing-4) max-w-[65ch] text-ink-muted">
          Every colour, type size, and spacing step in the system, plus a live
          WCAG contrast audit. Values marked{" "}
          <code className="font-(family-name:--font-mono)">CONFIRM</code> in
          plan.md §13 are read off a PNG and still need verifying against Figma.
        </p>
      </header>

      {/* ---------------------------------------------------------------- */}
      <Section
        title="Colour — Brand"
        note="The blue does a lot of work: accent type, media placeholders, links. brand-500 is the base."
      >
        <div className="grid grid-cols-2 gap-(--spacing-4) md:grid-cols-5">
          {Object.entries(BRAND).map(([name, hex]) => (
            <Swatch key={name} name={name} hex={hex} />
          ))}
        </div>
      </Section>

      <Section
        title="Colour — Neutrals"
        note="ink-muted is a paper-only colour — it lands at exactly 3.00:1 on the page grey. See the audit below."
      >
        <div className="grid grid-cols-2 gap-(--spacing-4) md:grid-cols-7">
          {Object.entries(NEUTRALS).map(([name, hex]) => (
            <Swatch key={name} name={name} hex={hex} />
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section
        title="Contrast audit — WCAG 2.1 AA"
        note="Computed live from the token values. AA needs 4.5:1 for normal text and 3:1 for large text (≥24px). Two known issues are expected below — they are the §3.2 action items, not regressions."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline">
                {["Pair", "Ratio", "Normal", "Large", "Usage"].map((h) => (
                  <th
                    key={h}
                    className="py-(--spacing-3) pr-(--spacing-4) font-(family-name:--font-mono) text-(length:--text-caption) font-normal text-ink-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTRAST_PAIRS.map((pair) => {
                const result = assess(pair.fg, pair.bg);

                return (
                  <tr key={pair.label} className="border-b border-hairline">
                    <td className="py-(--spacing-3) pr-(--spacing-4)">
                      <span
                        className="inline-block px-(--spacing-3) py-(--spacing-2) text-(length:--text-caption)"
                        style={{ color: pair.fg, backgroundColor: pair.bg }}
                      >
                        {pair.label}
                      </span>
                    </td>
                    <td className="py-(--spacing-3) pr-(--spacing-4) font-(family-name:--font-mono) text-(length:--text-caption) text-ink">
                      {result.ratio.toFixed(2)}:1
                    </td>
                    <td className="py-(--spacing-3) pr-(--spacing-4) text-(length:--text-caption) text-ink">
                      {result.normalAAA
                        ? "✅ AAA"
                        : result.normalAA
                          ? "✅ AA"
                          : "❌ FAIL"}
                    </td>
                    <td className="py-(--spacing-3) pr-(--spacing-4) text-(length:--text-caption) text-ink">
                      {result.largeAA ? "✅ AA" : "❌ FAIL"}
                    </td>
                    <td className="py-(--spacing-3) text-(length:--text-caption) text-ink-muted">
                      {pair.usage}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section
        title="Typography — Rethink Sans"
        note="Each sample is rendered through its real .type-* class, so this page shows what actually ships rather than a restatement of it. Sizes are fluid — resize the window to check the compression at mobile."
      >
        <div className="space-y-(--spacing-8)">
          {TYPE_SCALE.map((step) => (
            <div key={step.name}>
              <p className="font-(family-name:--font-mono) text-(length:--text-caption) text-ink-muted">
                {step.name} · {step.spec}
              </p>
              <p className={`mt-(--spacing-2) text-ink ${step.className}`}>
                {step.sample}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-(--space-section)">
          <p className="font-(family-name:--font-mono) text-(length:--text-caption) text-ink-muted">
            px → rem at a 16px root
          </p>
          <div className="mt-(--spacing-4) flex flex-wrap gap-(--spacing-4)">
            {REM_CONVERSIONS.map((c) => (
              <div
                key={c.px}
                className="border border-hairline px-(--spacing-3) py-(--spacing-2)"
              >
                <p className="font-(family-name:--font-mono) text-(length:--text-caption) text-ink">
                  {c.px}px = {c.rem}
                </p>
                <p className="font-(family-name:--font-mono) text-(length:--text-caption) text-ink-muted">
                  {c.use}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-(--space-section)">
          <p className="font-(family-name:--font-mono) text-(length:--text-caption) text-ink-muted">
            Hero treatment — &apos;Literally.&apos; in brand-500, one h1
          </p>
          <p className="type-h1 mt-(--spacing-4) text-ink">
            Hey! I&apos;m Duminda. Crafting Experiences That Move{" "}
            <span className="text-brand-500">Literally.</span>
          </p>
        </div>

        <div className="mt-(--space-section)">
          <p className="font-(family-name:--font-mono) text-(length:--text-caption) text-ink-muted">
            Weights — 400 Regular · 600 SemiBold · 700 Bold
          </p>
          <div className="mt-(--spacing-4) space-y-(--spacing-2)">
            {[
              { w: "var(--font-weight-regular)", label: "Regular 400" },
              { w: "var(--font-weight-semibold)", label: "SemiBold 600" },
              { w: "var(--font-weight-bold)", label: "Bold 700" },
            ].map((item) => (
              <p
                key={item.label}
                className="text-(length:--text-title) text-ink"
                style={{ fontWeight: item.w }}
              >
                {item.label} — Rethink Sans
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section title="Spacing — 8pt grid">
        <div className="space-y-(--spacing-3)">
          {SPACING_STEPS.map((step) => (
            <div
              key={step.name}
              className="flex items-center gap-(--spacing-4)"
            >
              <span className="w-[7rem] shrink-0 font-(family-name:--font-mono) text-(length:--text-caption) text-ink-muted">
                {step.name}
              </span>
              <span className="w-[3.5rem] shrink-0 font-(family-name:--font-mono) text-(length:--text-caption) text-ink">
                {step.value}
              </span>
              <span
                className="h-(--spacing-4) bg-brand-500"
                style={{ width: step.value }}
              />
            </div>
          ))}
        </div>

        <div className="mt-(--spacing-8) space-y-(--spacing-3)">
          {FLUID_SPACING.map((step) => (
            <div
              key={step.name}
              className="flex items-center gap-(--spacing-4)"
            >
              <span className="w-[7rem] shrink-0 font-(family-name:--font-mono) text-(length:--text-caption) text-ink-muted">
                {step.name}
              </span>
              <span className="w-[7rem] shrink-0 font-(family-name:--font-mono) text-(length:--text-caption) text-ink">
                {step.note}
              </span>
              <span
                className="h-(--spacing-4) bg-brand-300"
                style={{ width: `var(${step.token})` }}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section
        title="Layout — measured from the 1920px artboard"
        note="Resize the window to watch the hero band clamp. At 1920×1080 it should read 800px; it never drops below 420px."
      >
        <dl className="space-y-(--spacing-4)">
          {[
            {
              t: "--container-max",
              v: "1280px",
              n: "White content container, centred. At 1920 the true side margin is 320px.",
            },
            {
              t: "--hero-band-height",
              v: "clamp(420px, 74vh, 800px)",
              n: "800px at the artboard. Clamped so the h1 stays above the fold on short laptops.",
            },
            {
              t: "--hero-content-gap",
              v: "120px",
              n: "Band bottom → hero content. Constant at every viewport — does not scale.",
            },
            {
              t: "--hero-cap-offset",
              v: "14px",
              n: "Optical compensation: Figma's 64px is to cap height, CSS pads the layout box.",
            },
          ].map((row) => (
            <div
              key={row.t}
              className="border-l-2 border-brand-500 pl-(--spacing-4)"
            >
              <dt className="font-(family-name:--font-mono) text-(length:--text-caption) text-ink">
                {row.t} — {row.v}
              </dt>
              <dd className="type-caption mt-(--spacing-1) text-ink-muted">
                {row.n}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-(--spacing-8)">
          <p className="font-(family-name:--font-mono) text-(length:--text-caption) text-ink-muted">
            Live hero band height — resize to verify
          </p>
          <div className="mt-(--spacing-3) flex h-(--hero-band-height) w-full items-end justify-center overflow-hidden bg-page">
            <p className="type-caption pb-(--spacing-3) text-ink">
              object-position: bottom center — the video anchors here as the
              viewport resizes
            </p>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section
        title="Motion"
        note="Hover a swatch to see its duration and easing. Under prefers-reduced-motion these collapse to near-zero via the globals.css backstop — toggle it in your OS to verify."
      >
        <div className="grid grid-cols-2 gap-(--spacing-4) md:grid-cols-4">
          {DURATIONS.map((d) => (
            <div key={d.name}>
              <div
                className="group aspect-square w-full bg-brand-100 p-(--spacing-3)"
                style={{ transitionDuration: d.value }}
              >
                <div
                  className="h-full w-full bg-brand-500 transition-transform ease-(--ease-out-expo) hover:scale-90"
                  style={{ transitionDuration: d.value }}
                />
              </div>
              <p className="mt-(--spacing-2) font-(family-name:--font-mono) text-(length:--text-caption) text-ink">
                {d.name}
              </p>
              <p className="font-(family-name:--font-mono) text-(length:--text-caption) text-ink-muted">
                {d.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-(--spacing-8) space-y-(--spacing-2)">
          {EASINGS.map((e) => (
            <p
              key={e.name}
              className="font-(family-name:--font-mono) text-(length:--text-caption) text-ink-muted"
            >
              <span className="text-ink">{e.name}</span> — {e.value}
            </p>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section
        title="Radius"
        note="Media containers are square-cornered. The pill radius is reserved for the CTA chip and the cursor."
      >
        <div className="flex flex-wrap items-end gap-(--spacing-6)">
          {[
            { name: "radius-none", value: "0" },
            { name: "radius-sm", value: "4px" },
            { name: "radius-pill", value: "999px" },
          ].map((r) => (
            <div key={r.name}>
              <div
                className="h-(--spacing-16) w-(--spacing-32) bg-brand-500"
                style={{ borderRadius: r.value }}
              />
              <p className="mt-(--spacing-2) font-(family-name:--font-mono) text-(length:--text-caption) text-ink">
                {r.name}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-(--spacing-8)">
          <p className="font-(family-name:--font-mono) text-(length:--text-caption) text-ink-muted">
            The chip, as it appears in the mockup
          </p>
          <div className="mt-(--spacing-3) inline-flex items-center gap-(--spacing-2) rounded-(--radius-pill) bg-chip px-(--spacing-4) py-(--spacing-2)">
            <span className="h-(--spacing-2) w-(--spacing-2) rounded-(--radius-pill) border border-ink" />
            <span className="text-(length:--text-caption) text-ink">
              Scroll For My Work
            </span>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section
        title="Focus rings"
        note="Tab through these. The ring must stay visible on BOTH the white paper and the grey page (§7)."
      >
        <div className="flex flex-wrap gap-(--spacing-6)">
          <div className="bg-paper p-(--spacing-6)">
            <button
              type="button"
              className="border border-ink px-(--spacing-4) py-(--spacing-3) text-(length:--text-body) text-ink"
            >
              Focus me on paper
            </button>
          </div>
          <div className="bg-page p-(--spacing-6)">
            <button
              type="button"
              className="border border-ink px-(--spacing-4) py-(--spacing-3) text-(length:--text-body) text-ink"
            >
              Focus me on page
            </button>
          </div>
          <div className="bg-brand-500 p-(--spacing-6)">
            <button
              type="button"
              className="border border-paper px-(--spacing-4) py-(--spacing-3) text-(length:--text-body) text-paper"
            >
              Focus me on brand
            </button>
          </div>
        </div>
      </Section>
    </Container>
  );
}
