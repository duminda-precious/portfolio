"use client";

import { useEffect, useRef, useState } from "react";

import { Media } from "@/components/media/Media";
import type { Media as MediaType } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

/**
 * A live embed with a "Drag to play with" invitation over it.
 *
 * The overlay stays put on hover, so the wheel scrolls the PAGE over the
 * embed instead of being captured by it (a WebGL viewer would zoom). Pressing
 * on the overlay — the start of a drag — removes it and hands the embed over;
 * it returns when the pointer leaves.
 *
 * Known limit: the press that removes the overlay cannot itself be passed
 * into a cross-origin iframe, so the embed starts responding from the next
 * press.
 *
 * Touch: a tap (not a scroll gesture) removes the overlay, and a tap anywhere
 * outside the embed brings it back.
 */
export function InteractiveEmbed({
  media,
  priority,
}: {
  media: MediaType;
  priority?: boolean;
}) {
  const [isEngaged, setIsEngaged] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEngaged) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsEngaged(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isEngaged]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setIsEngaged(false);
      }}
    >
      <Media media={media} priority={priority} interactive />

      {/* Decorative invitation — the iframe itself carries the accessible
       * name, so the overlay stays out of the a11y tree. */}
      <div
        aria-hidden="true"
        /* Mouse: engage on press, the start of a drag. Touch: engage on a
         * completed tap only, so a scroll gesture that starts here scrolls. */
        onPointerDown={(event) => {
          if (event.pointerType === "mouse") setIsEngaged(true);
        }}
        onClick={() => setIsEngaged(true)}
        className={cn(
          "absolute inset-0 flex cursor-grab items-center justify-center bg-ink/20 backdrop-blur-sm",
          "transition-opacity duration-(--duration-base)",
          isEngaged ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        {/* .glass, so the label is ink — never white on a translucent fill. */}
        <span className="glass type-label rounded-(--radius-pill) border border-(--color-glass-border) px-(--spacing-6) py-(--spacing-3) text-[1rem] text-ink">
          Drag to play with
        </span>
      </div>
    </div>
  );
}
