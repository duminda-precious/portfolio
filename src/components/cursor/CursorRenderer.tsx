"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  DOT_DURATION,
  EASE,
  LABEL_DURATION,
  PILL_PADDING_X,
  VARIANTS,
  type CursorVariant,
} from "./variants";

/**
 * The cursor itself (§8).
 *
 * ⚠️ THE LOAD-BEARING RULE: pointer POSITION never enters React state. A
 * setState per pointermove is a re-render per mouse pixel, which drops frames
 * on any real page. Position goes straight to GSAP quickTo, which writes
 * transforms outside React entirely.
 *
 * Only `variant` and `label` are React state, and those change on hover
 * boundaries — rarely enough that the re-render is free.
 *
 * Detection is attribute-driven (§8.1): one document-level listener reads
 * data-cursor off the DOM via closest(). No component registers anything, and
 * nested targets resolve to the innermost declared intent for free.
 *
 * TWO ELEMENTS, distinct jobs:
 *   - The DOT is the cursor proper. For labelled variants it morphs INTO the
 *     pill (§8.3 "pill expands from dot"), so there is never a moment with no
 *     cursor on screen.
 *   - The LABEL rides on top with a longer duration, giving the trailing feel.
 *     It is a child of the dot's transform, so it inherits position for free.
 */
export function CursorRenderer() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // ---------------------------------------------------------------------
  // Movement. Runs once; never re-runs on variant change.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const dot = dotRef.current;
    const labelEl = labelRef.current;
    if (!dot || !labelEl) return;

    /* quickTo returns a reusable setter — far cheaper than creating a tween
     * per event (§8.2). It interpolates toward the newest value. */
    const xTo = gsap.quickTo(dot, "x", { duration: DOT_DURATION, ease: EASE });
    const yTo = gsap.quickTo(dot, "y", { duration: DOT_DURATION, ease: EASE });

    const onPointerMove = (event: PointerEvent) => {
      /* Ignore touch and pen — they get the native cursor (§8.4.1). A
       * pointermove from a finger would otherwise park the dot mid-screen. */
      if (event.pointerType !== "mouse") return;

      xTo(event.clientX);
      yTo(event.clientY);

      setIsVisible(true);

      // §8.1 — resolve intent from the DOM; innermost declaration wins.
      const target = (event.target as Element | null)?.closest?.(
        "[data-cursor]",
      );

      setVariant(
        (target?.getAttribute("data-cursor") as CursorVariant | null) ??
          "default",
      );
      setLabel(target?.getAttribute("data-cursor-label") ?? "");
    };

    /* §8.4.5 — a frozen dot in the corner looks broken. Hide on every exit
     * path: leaving the document, losing window focus, or tabbing away. */
    const hide = () => setIsVisible(false);

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      /* Kill in-flight tweens so a route change can't leave GSAP writing to a
       * detached node. */
      gsap.killTweensOf(dot);
    };
  }, []);

  // ---------------------------------------------------------------------
  // Variant morphing. Separate effect — only runs when the variant changes.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const dot = dotRef.current;
    const labelEl = labelRef.current;
    if (!dot || !labelEl) return;

    const spec = VARIANTS[variant];
    const showsLabel = spec.showsLabel && label.length > 0;

    /* A labelled pill sizes to its text. Measuring scrollWidth is a forced
     * layout read, but it happens once per hover boundary — not per frame —
     * so the cost is irrelevant here and gives an exact fit. */
    const targetWidth = showsLabel
      ? labelEl.scrollWidth + PILL_PADDING_X
      : spec.width;

    gsap.to(dot, {
      width: targetWidth,
      height: spec.height,
      borderRadius: spec.radius,
      backgroundColor:
        spec.fill === "ink"
          ? "var(--color-ink)"
          : spec.fill === "none"
            ? "transparent"
            : "var(--color-brand-500)",
      duration: 0.3,
      ease: "expo.out",
      overwrite: "auto",
    });

    /* The label cross-fades on a longer duration so the text doesn't scramble
     * mid-morph (§8.3) and trails the dot slightly (§8.2). */
    gsap.to(labelEl, {
      opacity: showsLabel ? 1 : 0,
      duration: showsLabel ? LABEL_DURATION : 0.15,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [variant, label]);

  // ---------------------------------------------------------------------
  // Scope `cursor: none` to the body only while actually mounted (§8.4.3).
  // Done in JS, never statically in CSS — if this component fails to load,
  // the user must still have a cursor.
  // ---------------------------------------------------------------------
  useEffect(() => {
    document.body.classList.add("cursor-none-active");
    return () => document.body.classList.remove("cursor-none-active");
  }, []);

  const isHidden = variant === "hidden" || !isVisible;

  return createPortal(
    /*
      aria-hidden + pointer-events-none are non-negotiable (§8.4.7). This is
      presentational reinforcement: it must never intercept a click, and never
      appear in the a11y tree — every label already has an accessible-text
      equivalent on the element that declared it (§8.4.6).
    */
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-(--z-cursor) flex items-center justify-center overflow-hidden"
      style={{
        width: VARIANTS.default.width,
        height: VARIANTS.default.height,
        borderRadius: VARIANTS.default.radius,
        backgroundColor: "var(--color-brand-500)",
        /* Centre the element on the pointer. GSAP writes x/y as transforms,
         * and translate(-50%,-50%) composes with them via CSS `translate`,
         * which applies independently of the transform property. */
        translate: "-50% -50%",
        opacity: isHidden ? 0 : 1,
        transition: "opacity var(--duration-fast) ease-out",
        willChange: "transform",
      }}
    >
      <span
        ref={labelRef}
        className="type-label px-(--spacing-4) whitespace-nowrap"
        style={{
          /* White on brand-500 measures 5.64:1 — AA, even decorative (§3.2). */
          color: "var(--color-paper)",
          opacity: 0,
        }}
      >
        {label}
      </span>
    </div>,
    document.body,
  );
}
