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
  isDisabled = false,
  size = "md",
  tone = "default",
  cursorLabel,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  /** Dimmed and inert, but kept in place so the chip row doesn't reflow. */
  isDisabled?: boolean;
  /** "sm" is the compact pill for secondary filters (32px tall, 14px text). */
  size?: "md" | "sm";
  /** "danger" = red glass, for reset/destructive actions. */
  tone?: "default" | "danger";
  cursorLabel?: string;
  className?: string;
}) {
  const shared = cn(
    "type-label inline-flex items-center gap-(--spacing-2) rounded-(--radius-pill)",
    size === "sm"
      ? "min-h-[32px] px-(--spacing-3) py-(--spacing-1) text-(length:--text-caption)"
      : "min-h-[44px] px-(--spacing-4) py-(--spacing-2)",
    "transition-colors duration-(--duration-fast)",
    className,
  );

  // Every chip is glass: tinted at rest, brand glass when selected
  // (.glass-tint / .glass-brand in globals.css).
  if (!onClick) {
    return <span className={cn(shared, "glass-tint text-ink")}>{children}</span>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      /* aria-pressed communicates the toggle state to screen readers — the
       * colour change alone is not an accessible affordance. */
      aria-pressed={isActive}
      /* No cursor CTA on chips, by decision (2026-11-15): the morphing
       * label is kept for case study cards only. */
      className={cn(
        shared,
        isActive
          ? "glass-brand text-paper"
          : isDisabled
            ? "glass-tint cursor-not-allowed text-ink opacity-40"
            : tone === "danger"
              ? "glass-danger"
              : "glass-tint text-ink",
      )}
    >
      {children}
    </button>
  );
}
