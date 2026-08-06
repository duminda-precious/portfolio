import { cn } from "@/lib/utils/cn";

/**
 * The blue tag line above a project title — `Design System · Web · Mobile`.
 *
 * Joins the tags array; never hardcode the string (§2.4).
 *
 * ⚠️ `onPage` matters for accessibility, not aesthetics. brand-500 measures
 * 3.62:1 on the grey page background and FAILS AA at this size; brand-700
 * passes at 5.90:1. Set it whenever the eyebrow sits outside the white
 * container (§3.2).
 */
export function Eyebrow({
  tags,
  onPage = false,
  className,
}: {
  tags: string[];
  onPage?: boolean;
  className?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <p
      className={cn(
        "type-label",
        onPage ? "text-brand-700" : "text-brand-500",
        className,
      )}
    >
      {tags.join(" · ")}
    </p>
  );
}
