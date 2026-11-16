import Link from "next/link";

import { cn } from "@/lib/utils/cn";

/**
 * The one real button on the site: a pill link for the action a page most
 * wants taken. Use at most one "primary" per view. Everything else is a
 * text link or "quiet", so the primary never has to compete.
 *
 * Internal paths go through next/link. mailto:, files and anchors render a
 * plain <a>.
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  download,
  newTab = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  /** "onBrand" is the primary for the solid blue band. */
  variant?: "primary" | "quiet" | "onBrand";
  download?: string;
  newTab?: boolean;
  className?: string;
}) {
  const classes = cn(
    "type-action inline-flex min-h-[52px] items-center gap-(--spacing-2) rounded-(--radius-pill) px-(--spacing-6) py-(--spacing-3)",
    "transition-colors duration-(--duration-fast)",
    variant === "primary" && "glass-brand text-paper hover:bg-brand-700",
    variant === "quiet" && "glass-tint text-ink",
    variant === "onBrand" &&
      "bg-cream text-brand-700 shadow-[0_1px_2px_rgb(0_0_0/0.12)] hover:bg-paper",
    className,
  );

  const isInternal = href.startsWith("/") && !download && !newTab;

  if (isInternal) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      download={download}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener" : undefined}
      className={classes}
    >
      {children}
    </a>
  );
}
