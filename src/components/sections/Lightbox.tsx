"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Caption } from "@/components/primitives/Caption";
import type { Experiment } from "@/lib/content";

type LightboxProps = {
  experiments: Experiment[];
  /** Index into `experiments`, or null when closed. */
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/**
 * Focus-trapped dialog for the experiments grid (§7, §9.6).
 *
 * Same modal pattern as MobileMenu — focus trap, Esc closes, body scroll
 * locked, focus restored to the trigger on close — plus arrow-key navigation
 * between tiles, which a single-item overlay like the mobile menu doesn't
 * need.
 *
 * Ownership: ExperimentsGrid holds `activeIndex` state (it already has the
 * full experiments array in scope), and each ExperimentTile is a button that
 * reports its own index up. The Lightbox itself is stateless beyond its refs.
 *
 * ⚠️ PORTALLED to document.body, same as CursorProvider, so it always stacks
 * above the fixed Header regardless of where ExperimentsGrid happens to
 * render in the tree — z-index alone doesn't guarantee winning against a
 * `position: fixed` sibling several ancestors up if anything in between
 * forms its own stacking context. --z-lightbox (200) still sits below
 * --z-cursor (9999), so the custom cursor keeps tracking on top of the
 * lightbox itself.
 *
 * ⚠️ Overlay is the SAME `.glass` surface as the header/cursor label, by
 * decision (2026-08-06) — one blurred frosted panel, full-bleed, everything
 * (media, caption, controls) sits directly on it rather than on a separate
 * solid panel. See tokens.css for why glass carries ink text, never white.
 *
 * ⚠️ NO SCROLLING, by decision. The controls live in ONE top row (counter |
 * Previous/Next | Close), a 3-col grid — Close moved down from its earlier
 * absolute top-right position to sit in this row, and Previous/Next moved up
 * from a separate bottom row, by decision (2026-08-06). That row has a fixed
 * height; the media area is a flex-1 region that gets whatever vertical space
 * remains, and shrinks via `min-h-0` + `object-contain` so a tall image fits
 * instead of overflowing. `h-dvh`, not `h-screen` — the dynamic viewport unit
 * accounts for mobile browser chrome that `vh` doesn't.
 */
export function Lightbox({
  experiments,
  activeIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const isOpen = activeIndex !== null;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  /* The element that had focus before the lightbox opened — NOT necessarily
   * the tile at activeIndex, since arrow-key navigation changes activeIndex
   * without changing which trigger should reclaim focus on close. */
  const triggerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundBlocked, setSoundBlocked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  const close = useCallback(() => {
    onClose();
    triggerRef.current?.focus();
  }, [onClose]);

  // Lock body scroll while open, and restore it precisely on close.
  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Esc closes, arrow keys navigate, Tab is trapped inside the panel.
  useEffect(() => {
    if (!isOpen || activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNavigate((activeIndex + 1) % experiments.length);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onNavigate((activeIndex - 1 + experiments.length) % experiments.length);
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      // Wrap focus at both ends so Tab never escapes the dialog.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, activeIndex, experiments.length, close, onNavigate]);

  /* Move focus into the panel on open, and again on every navigate — arrow
   * keys change content but not open/close state, so the open-only effect
   * above wouldn't refire. Focusing the close button (rather than content)
   * gives a consistent, predictable landing spot each time. */
  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
  }, [isOpen, activeIndex]);

  /* A soundtrack only plays once the tile is open — the grid stays muted.
   * The click that opened the dialog is the user gesture; if the browser
   * still blocks it, the controls (and the fallback button) start it. */
  useEffect(() => {
    setSoundBlocked(false);
    const video = videoRef.current;
    if (!video || activeIndex === null) return;
    if (!experiments[activeIndex]?.media.hasAudio) return;
    video.muted = false;
    void video.play().catch(() => setSoundBlocked(true));
  }, [activeIndex, experiments]);

  if (activeIndex === null) return null;

  const experiment = experiments[activeIndex];
  const { media, caption } = experiment;
  const isDecorative = media.alt === "";
  const isVideo = media.kind === "local-loop" || media.kind === "gumlet-video";

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={caption}
      /* Full-bleed .glass — the same frosted panel as the header/cursor
       * label, not a separate solid backdrop (§8/tokens.css). h-dvh, not
       * h-screen: the dynamic viewport unit accounts for mobile browser
       * chrome, so the panel doesn't overflow by the address-bar height. */
      className="glass fixed inset-0 z-(--z-lightbox) flex h-dvh flex-col"
    >
      {/*
        Single top row: counter | Previous/Next | Close, by decision
        (2026-08-06) — a 3-column grid rather than flex justify-between, so
        the CENTRE column can be truly centred on the row regardless of how
        wide the counter or Close button are (flex justify-between only
        balances the two end items against each other, not against a
        floating middle one).
      */}
      <div className="grid shrink-0 grid-cols-3 items-center px-(--container-pad) py-(--spacing-4)">
        <p className="type-caption text-ink-muted">
          {activeIndex + 1} / {experiments.length}
        </p>

        {experiments.length > 1 ? (
          /*
            ⚠️ ICONS, BY DECISION (2026-08-06) — a deliberate, SCOPED
            exception to the site-wide no-icons rule (§2.3/§9.2/§9.7 all use
            text instead of icons everywhere else). Chevrons read faster than
            "Previous"/"Next" for rapid keyboard-free browsing through a
            gallery, which is the one place on the site where that tradeoff
            was judged worth it. Close (below) got the same treatment for
            consistency within this one dialog.

            The accessible name is UNCHANGED on all three buttons —
            aria-label carries "Previous"/"Next"/"Close" exactly as before,
            so screen readers and the a11y tree see no difference. Only the
            visible glyph changed.

            data-cursor="cta" + data-cursor-label, NOT "hidden" — an earlier
            pass used "hidden" (native-cursor variant, meant for real inputs
            needing system-cursor precision, §8.4.4) and it made the custom
            cursor vanish over these buttons for no reason. Since the visible
            label is now icon-only, the cursor's glass label is what carries
            "Previous"/"Next"/"Close" for a SIGHTED pointer user — the
            aria-label above is what carries it for everyone else.
          */
          <div className="flex gap-(--spacing-8) justify-self-center">
            <button
              type="button"
              onClick={() =>
                onNavigate(
                  (activeIndex - 1 + experiments.length) % experiments.length,
                )
              }
              aria-label="Previous"
              className="glass-tint flex min-h-[44px] min-w-[44px] items-center justify-center rounded-(--radius-pill) text-ink"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onNavigate((activeIndex + 1) % experiments.length)}
              aria-label="Next"
              className="glass-tint flex min-h-[44px] min-w-[44px] items-center justify-center rounded-(--radius-pill) text-ink"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div />
        )}

        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label="Close"
          className="glass-tint flex min-h-[44px] min-w-[44px] items-center justify-center justify-self-end rounded-(--radius-pill) text-ink"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/*
        No scrolling, by decision. `min-h-0` is load-bearing on a flex child —
        without it the image's intrinsic size would force this row to grow
        past its share of the flex column instead of shrinking to fit, which
        is exactly the overflow this layout exists to prevent.
      */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-(--spacing-4) px-(--container-pad) pb-(--spacing-4)">
        {media.kind === "image" && media.src ? (
          <div className="relative min-h-0 w-full flex-1">
            <Image
              src={media.src}
              alt={media.alt}
              fill
              sizes="100vw"
              priority
              /* object-contain, not cover — a lightbox must show the whole
               * image inside the available space, never crop it. This is
               * the one thing Media.tsx can't do (it's aspect-box + cover by
               * design for grid tiles), hence rendering next/image directly
               * rather than reusing it. */
              className="object-contain"
              aria-hidden={isDecorative || undefined}
            />
          </div>
        ) : media.kind === "youtube" && media.src ? (
          /* YouTube player, no autoplay — the visitor presses play. Sized to
           * the largest 16:9 box that fits the remaining space. */
          <div className="flex min-h-0 w-full flex-1 items-center justify-center">
            <iframe
              key={media.src}
              src={`https://www.youtube-nocookie.com/embed/${media.src}?rel=0`}
              title={media.alt}
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="aspect-video max-h-full w-full max-w-[calc((100dvh-10rem)*16/9)] border-0"
            />
          </div>
        ) : isVideo && media.src ? (
          /*
            ⚠️ VISUAL-TEST STUB (2026-08-06), matching Media.tsx's own video
            branch — not real Phase 2. object-contain (not cover), same
            reasoning as the image branch above: a lightbox must show the
            whole clip within the available space, never crop it, which is
            the opposite of the grid tile's fill-the-box behaviour.
          */
          <div className="relative min-h-0 w-full flex-1">
            <video
              key={media.src}
              ref={videoRef}
              src={media.src}
              muted={!media.hasAudio}
              playsInline
              loop
              autoPlay
              controls={media.hasAudio}
              preload="metadata"
              className="absolute inset-0 h-full w-full object-contain"
              aria-hidden={!media.hasAudio && isDecorative ? true : undefined}
              onCanPlay={() => {
                const video = videoRef.current;
                if (!video || !media.hasAudio) return;
                video.muted = false;
                void video.play().catch(() => setSoundBlocked(true));
              }}
            />
            {media.hasAudio && soundBlocked ? (
              <button
                type="button"
                onClick={() => {
                  const video = videoRef.current;
                  if (!video) return;
                  video.muted = false;
                  void video.play().then(() => setSoundBlocked(false));
                }}
                className="glass-tint absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-(--radius-pill) px-(--spacing-5) py-(--spacing-3) text-ink"
              >
                Play with sound
              </button>
            ) : null}
          </div>
        ) : (
          /* No src yet (e.g. a gumlet-video not wired up) — same blue-fill
           * loading state as Media.tsx. */
          <div className="min-h-0 w-full flex-1 bg-brand-500" />
        )}
        <Caption className="shrink-0">{caption}</Caption>
      </div>
    </div>,
    document.body,
  );
}
