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
/**
 * "onBrand" is the primary for blue; "glass" the secondary; "ghost" the
 * tertiary on blue: no fill, cream text, no underline.
 */
type ButtonVariant = "primary" | "quiet" | "onBrand" | "glass" | "ghost";

/**
 * The pill's classes, shared with CopyEmail's <button> so a real button and
 * a link in the same row look identical.
 */
export function buttonClasses(variant: ButtonVariant, className?: string) {
  return cn(
    "type-action inline-flex min-h-[52px] items-center gap-(--spacing-2) rounded-(--radius-pill) px-(--spacing-6) py-(--spacing-3)",
    "transition-colors duration-(--duration-fast)",
    variant === "primary" && "glass-brand text-paper hover:bg-brand-700",
    variant === "quiet" && "glass-tint text-ink",
    variant === "onBrand" &&
      "bg-paper text-brand-700 shadow-[0_1px_2px_rgb(0_0_0/0.12)] hover:opacity-90",
    variant === "glass" &&
      "glass-strong border border-(--color-glass-border) text-brand-700 shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_0_0_1px_rgb(31_31_31/0.08),0_1px_2px_rgb(0_0_0/0.06)] hover:bg-paper",
    variant === "ghost" && "text-cream hover:opacity-80",
    className,
  );
}

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
  /**
   * "onBrand" is the primary for the solid blue band. "glass" is the white
   * glass pill, the same material as the header nav pill.
   */
  variant?: ButtonVariant;
  download?: string;
  newTab?: boolean;
  className?: string;
}) {
  const classes = buttonClasses(variant, className);

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
