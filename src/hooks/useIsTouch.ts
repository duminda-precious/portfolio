"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * Whether this device lacks a precise pointer (touch, mostly).
 *
 * Used to disable Lenis smooth scroll — native momentum scrolling on touch is
 * better than anything we can emulate (§10).
 */
export function useIsTouch(): boolean {
  return useMediaQuery("(hover: none)");
}

/**
 * Whether this device has a precise pointer AND hover — i.e. a real mouse or
 * trackpad. The gate for mounting the custom cursor (§8.4.1).
 *
 * Both conditions are required. `pointer: fine` alone matches a stylus, which
 * has no hover state and would get a cursor that never moves sensibly.
 *
 * Starts `false` (via useMediaQuery), so the custom cursor never mounts until
 * we have positively confirmed a fine pointer. Touch users get the native
 * cursor with no exceptions.
 */
export function useHasFinePointer(): boolean {
  return useMediaQuery("(pointer: fine) and (hover: hover)");
}
