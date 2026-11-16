"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A silent loop that only costs anything while it is near the screen
 * (§6.4 requirements 3–4).
 *
 * - Nothing is downloaded until the video is within 200px of the viewport;
 *   until then the poster (or the blue box behind it) is all that shows.
 * - It plays while on screen and pauses when scrolled away, so a page with
 *   20 loops only ever decodes the few that are visible.
 * - `eager` skips the wait for the one above-the-fold video (the LCP cover).
 */
export function LazyVideo({
  src,
  poster,
  eager = false,
  className,
  style,
}: {
  src: string;
  poster?: string;
  eager?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          // No src yet on the first pass: autoPlay starts it once it loads.
          // On later passes this resumes a paused loop.
          if (video.currentSrc) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    /* muted+playsInline+loop+autoPlay per §6.4.6 — missing playsInline is
     * what causes the iOS fullscreen-takeover bug. aria-hidden because
     * decorative background loops are excluded from the a11y tree (§6.4.8). */
    <video
      ref={ref}
      src={shouldLoad ? src : undefined}
      poster={poster}
      muted
      playsInline
      loop
      autoPlay
      preload={shouldLoad ? "auto" : "none"}
      className={className}
      style={style}
      aria-hidden="true"
    />
  );
}
