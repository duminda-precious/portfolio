import { cn } from "@/lib/utils/cn";

/**
 * Small muted text beneath media.
 *
 * ⚠️ ink-muted measures exactly 3.00:1 on the grey page — it FAILS AA at
 * caption size. Captions therefore belong inside the white container. If one
 * must sit on grey, pass `onPage` and it renders in ink instead (§3.2).
 */
export function Caption({
  children,
  onPage = false,
  className,
}: {
  children: React.ReactNode;
  onPage?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "type-caption",
        onPage ? "text-ink" : "text-ink-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}
