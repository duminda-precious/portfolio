"use client";

import { useMediaQuery } from "./useMediaQuery";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Whether the user has asked for reduced motion.
 *
 * ⚠️ The server snapshot is `true` — the OPPOSITE of the useMediaQuery default.
 * Reasoning: before hydration we cannot know the preference, and the two
 * possible wrong guesses are not symmetric.
 *
 *   - Guess "no reduced motion" and be wrong → we fire an animation at someone
 *     who may get motion sickness from it. The harm is real and already done.
 *   - Guess "reduced motion" and be wrong → the first frame is static, then
 *     animations enable a tick later. Nobody notices.
 *
 * So we assume reduced motion until proven otherwise. Every animation in the
 * codebase must be behind this check (§10) — the CSS media query in globals.css
 * is a backstop, not a substitute, because GSAP writes inline styles that CSS
 * cannot reliably override.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(QUERY, true);
}
