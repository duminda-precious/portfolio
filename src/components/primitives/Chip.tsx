"use client";

import { cn } from "@/lib/utils/cn";

/**
 * The pill. Used for the scroll CTA and the /work filter controls (§7).
 *
 * Renders as a <button> only when given an onClick. A pill with no action is
 * a <span> — a disabled-looking control that does nothing does not belong in
 * the a11y tree (§9.4).
 */
export function Chip({
  children,
  onClick,
  isActive = false,
  cursorLabel,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  cursorLabel?: string;
  className?: string;
}) {
  const shared = cn(
    "type-action inline-flex min-h-[44px] items-center gap-(--spacing-2)",
    "rounded-(--radius-pill) px-(--spacing-4) py-(--spacing-2)",
    "transition-colors duration-(--duration-fast)",
    className,
  );

  if (!onClick) {
    return <span className={cn(shared, "bg-chip text-ink")}>{children}</span>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      /* aria-pressed communicates the toggle state to screen readers — the
       * colour change alone is not an accessible affordance. */
      aria-pressed={isActive}
      /* Only declare a cta cursor when there is actually a label to show —
       * otherwise the pill expands to an empty blue lozenge. */
      data-cursor={cursorLabel ? "cta" : undefined}
      data-cursor-label={cursorLabel}
      className={cn(
        shared,
        isActive
          ? "bg-brand-700 text-paper"
          : "bg-chip text-ink hover:bg-brand-100",
      )}
    >
      {children}
    </button>
  );
}
