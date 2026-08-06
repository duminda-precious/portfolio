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
 * Labels render in --color-ink rather than the mockup's light grey: over
 * unpredictable video that grey fails AA (§3.2). The header's backdrop blur
 * does the legibility work instead.
 */
export function Nav({ items, variant = "header", onNavigate }: NavProps) {
  const pathname = usePathname();

  return (
    <ul
      className={cn(
        variant === "header" && "flex items-center gap-(--spacing-8)",
        variant === "overlay" && "flex flex-col gap-(--spacing-4)",
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
              data-cursor="cta"
              data-cursor-label={item.cursorLabel}
              className={cn(
                "text-ink transition-colors duration-(--duration-fast)",
                "hover:text-brand-700",
                /* ≥44px touch target (§7). The negative margin keeps the
                 * padding from disturbing the visual rhythm. */
                "-my-(--spacing-3) inline-flex min-h-[44px] items-center py-(--spacing-3)",
                variant === "header" && "type-action",
                variant === "overlay" && "type-h4",
                isCurrent && "text-brand-700",
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
