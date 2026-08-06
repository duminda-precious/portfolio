import { cn } from "@/lib/utils/cn";

/**
 * Section title — "Things That Kept Me Up", "Selected Work".
 *
 * `as` exists so heading LEVEL stays a semantic decision independent of size:
 * a section inside a case study may need an h3 while still looking like an h4.
 * Heading levels must never skip (§11).
 */
export function SectionHeading({
  children,
  as: Component = "h2",
  id,
  className,
}: {
  children: React.ReactNode;
  as?: "h2" | "h3";
  id?: string;
  className?: string;
}) {
  return (
    <Component id={id} className={cn("type-h4 text-ink", className)}>
      {children}
    </Component>
  );
}
