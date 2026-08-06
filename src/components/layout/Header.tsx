"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { NavItem } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

import { MobileMenu } from "./MobileMenu";
import { Nav } from "./Nav";

/**
 * Fixed site header (§9.2).
 *
 * Scroll state is driven by an IntersectionObserver watching a zero-height
 * sentinel at the top of the document — NOT a scroll handler. A scroll
 * listener fires on every frame and would fight Lenis for the main thread;
 * the observer fires twice, when the sentinel enters and leaves.
 *
 * Rest state over video: labels in --color-ink with a blurred scrim. The
 * mockup's light grey fails AA over unpredictable video frames (§3.2), and
 * the blur reads as intentional rather than as a fix.
 *
 * Scrolled state: paper background, hairline bottom border, NO shadow —
 * explicit in the brief. Only background-color and border-color animate;
 * never height, which would thrash layout.
 */
export function Header({ items }: { items: NavItem[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      /* Fire once the sentinel is fully out of view. Its 80px height is what
       * sets the trigger point, so there's no magic scrollY constant. */
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Zero-visual sentinel. Height defines the scroll trigger distance. */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[80px] w-px"
      />

      {/*
        Rest state is FULLY transparent; scrolling brings in the glass panel —
        the same translucent surface the expanded cursor uses (tokens.css).

        Only background-color and border-color transition. Never height, which
        would thrash layout (§9.2). `backdrop-filter` is applied by the .glass
        class rather than animated, because it cannot be interpolated — it
        arrives with the background, which reads as a single change.
      */}
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-(--z-header)",
          "transition-colors duration-(--duration-base)",
          isScrolled
            ? "glass-strong border-b border-(--color-glass-border)"
            : "border-b border-transparent bg-transparent",
        )}
      >
        {/* The scrim applies ONLY while transparent. Once the glass panel is
         * in, it provides the contrast and the halo would just look smudged. */}
        <div
          className={cn(
            "mx-auto flex max-w-(--container-max) items-center justify-between px-(--container-pad) py-(--spacing-4)",
            !isScrolled && "text-on-media",
          )}
        >
          <Link
            href="/"
            aria-label="Duminda M — home"
            data-cursor="cta"
            data-cursor-label="Back to top"
            className="inline-flex min-h-[44px] items-center"
          >
            {/*
              Logo is a brand-blue disc in the mockup. Rendered as a styled
              element rather than next/image because /logo.png doesn't exist
              yet. Dimensions are fixed here, so dropping in the real asset
              won't shift layout (§13.11).
            */}
            <span
              aria-hidden="true"
              className="block h-(--spacing-8) w-(--spacing-8) rounded-(--radius-pill) bg-brand-700"
            />
          </Link>

          <nav aria-label="Main" className="hidden md:block">
            <Nav items={items} />
          </nav>

          <MobileMenu items={items} />
        </div>
      </header>
    </>
  );
}
