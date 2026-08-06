"use client";

import { useHasFinePointer } from "@/hooks/useIsTouch";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { useCursorPreference } from "./useCursorPreference";

/**
 * "Use system cursor" escape hatch (§8.4.9).
 *
 * Only renders where the custom cursor could actually be running. Offering to
 * turn off something that was never on is confusing — on touch, or under
 * reduced motion, this control simply isn't there.
 */
export function CursorToggle() {
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { useSystemCursor, setUseSystemCursor } = useCursorPreference();

  if (!hasFinePointer || prefersReducedMotion) return null;

  return (
    <button
      type="button"
      onClick={() => setUseSystemCursor(!useSystemCursor)}
      /* aria-pressed carries the state; the label text stays constant so a
       * screen reader announcement isn't ambiguous about what the press did. */
      aria-pressed={useSystemCursor}
      /* The toggle itself declares `hidden` so the custom cursor gets out of
       * the way of the control that disables it. */
      data-cursor="hidden"
      className="type-caption inline-flex min-h-[44px] items-center text-ink-muted underline-offset-4 hover:text-ink hover:underline"
    >
      {useSystemCursor ? "Use custom cursor" : "Use system cursor"}
    </button>
  );
}
