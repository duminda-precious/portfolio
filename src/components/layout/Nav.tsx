"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

type NavProps = {
  items: NavItem[];
  /** Rendered inside the mobile overlay — larger type, stacked, full-width. */
  variant?: "header" | "overlay";
  onNavigate?: () => void;
};

/**
 * Primary navigation links (§2.3).
 *
 * The header list is one glass pill (.glass-strong, white at 0.9). Text sits
 * on that light surface, so it does not follow the
 * page colour: ink at 60% at rest, brand-700 on hover and on the current
 * page. No underline.
 *
 * The overlay is a full glass sheet with its own type size, and uses the
 * same light-surface colours.
 *
 * brand-700 is the text blue: brand-500 fails AA for this size on white.
 */
export function Nav({ items, variant = "header", onNavigate }: NavProps) {
  const pathname = usePathname();

  return (
    <ul
      className={cn(
        variant === "header" &&
          "glass-strong flex items-center gap-(--spacing-8) rounded-(--radius-pill) border border-(--color-glass-border) px-(--spacing-6) shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_0_0_1px_rgb(31_31_31/0.08),0_1px_2px_rgb(0_0_0/0.06)] [&_a:focus-visible]:outline-(--color-brand-500)",
        variant === "overlay" && "flex flex-col gap-(--spacing-8)",
      )}
    >
      {items.map((item) => {
        const isCurrent = pathname === item.href;

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              /* aria-current is the accessible equivalent of the visual
               * active state — a screen reader user gets the same info. */
              aria-current={isCurrent ? "page" : undefined}
              /* No data-cursor here on purpose. Nav links already carry a
               * clear hover state (colour change); the cursor's CTA
               * reinforcement is redundant on something this legible. */
              className={cn(
                "no-underline transition-colors duration-(--duration-fast)",
                /* ≥44px touch target (§7). Inside the pill this is the
                 * height of the capsule, so there is no negative margin. */
                "inline-flex min-h-[44px] items-center",
                /*
                 * Colour only — no underline. Hover and the current page
                 * share the solid colour; everything else sits at 60%.
                 */
                variant === "header" &&
                  "type-action text-ink/60 hover:text-brand-700 focus-visible:text-brand-700 active:text-brand-700 aria-[current=page]:text-brand-700",
                /* Overlay sits on white glass, at the frame's display size. */
                variant === "overlay" &&
                  "type-h3 type-h3-fixed text-ink/60 hover:text-brand-700 focus-visible:text-brand-700 active:text-brand-700 aria-[current=page]:text-brand-700",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
