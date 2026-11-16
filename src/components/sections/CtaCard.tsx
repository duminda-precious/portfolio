import { ButtonLink } from "@/components/primitives/ButtonLink";
import { cn } from "@/lib/utils/cn";

/**
 * The blue "Work with me" ask: cream headline left, white glass pill right,
 * 16px padding all round. One component so the homepage and every case
 * study say it the same way.
 */
export function CtaCard({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "flex flex-col items-start gap-(--spacing-6) rounded-(--radius-sm) bg-brand-500 p-(--spacing-4) text-cream md:flex-row md:items-center md:justify-between [&_:focus-visible]:outline-(--color-cream)",
        className,
      )}
    >
      <p className="type-h4 max-w-[20ch]">
        Got something like this on your plate?
      </p>
      <ButtonLink href="/work-with-me" variant="glass" className="shrink-0">
        Work with me <span aria-hidden="true">→</span>
      </ButtonLink>
    </aside>
  );
}
