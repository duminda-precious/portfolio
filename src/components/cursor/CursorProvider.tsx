"use client";

import dynamic from "next/dynamic";

import { useHasFinePointer } from "@/hooks/useIsTouch";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { useCursorPreference } from "./useCursorPreference";

/**
 * The renderer imports GSAP, which has no business in the initial bundle for
 * users who will never see a cursor — touch devices, reduced-motion users,
 * and anyone who opted out. Loading it dynamically with ssr:false keeps GSAP
 * out of the server render AND out of the first-load JS on those devices.
 */
const CursorRenderer = dynamic(
  () => import("./CursorRenderer").then((m) => m.CursorRenderer),
  { ssr: false },
);

/**
 * Mount gate for the custom cursor (§8.4).
 *
 * The cursor only mounts when ALL of these hold:
 *
 *   1. A fine pointer WITH hover — a real mouse or trackpad. Touch and stylus
 *      get the native cursor, no exceptions (§8.4.1).
 *   2. Reduced motion is NOT requested. The plan's own recommendation is to
 *      not mount at all rather than mount without lerp (§8.4.2), because a
 *      cursor that teleports is worse than no custom cursor.
 *   3. The user has not opted out via the footer toggle (§8.4.9).
 *
 * Every one of these defaults to the SAFE answer before hydration: the hooks
 * return "no fine pointer" and "reduced motion requested" on the first render,
 * so nothing mounts until we positively know otherwise. A brief native cursor
 * is a non-event; a flash of custom cursor for someone who asked for reduced
 * motion is not.
 *
 * Rendered ONCE in layout.tsx, never per-page (§8.4.8).
 */
export function CursorProvider() {
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { useSystemCursor } = useCursorPreference();

  if (!hasFinePointer || prefersReducedMotion || useSystemCursor) {
    return null;
  }

  return <CursorRenderer />;
}
