"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll parallax for the hero video behind the paper.
 *
 * The layer is pushed DOWN by `speed` x the scroll distance, so against the
 * page (which moves up with the scroll) it travels at only (1 - speed) of the
 * scroll speed: it lags, and the paper slides over it. Because it only ever
 * moves down, its bottom edge goes further behind the paper and its top edge
 * is already off-screen, so no gap can open.
 *
 * Cheap on purpose: one passive scroll listener, one transform write per
 * frame, nothing after the hero is far off-screen. Visitors who ask for
 * reduced motion get no parallax.
 */
const MAX_SCROLL = 1600;

export function ParallaxLayer({
  speed = 0.4,
  className,
  children,
}: {
  speed?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, MAX_SCROLL) * speed;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
