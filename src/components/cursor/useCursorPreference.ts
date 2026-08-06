"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "portfolio:use-system-cursor";

/**
 * The "use system cursor" escape hatch (§8.4.9).
 *
 * A custom cursor is a preference, not a mandate — some people find the lag
 * disorienting regardless of their OS motion setting. Persisting the opt-out
 * costs almost nothing and is the kind of detail a design-literate audience
 * notices.
 *
 * Implemented as an external store so every subscriber (the provider and the
 * footer toggle) updates together. A plain useState in two places would let
 * them drift apart.
 */

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  /* `storage` fires when another TAB changes the value, keeping open tabs
   * consistent. It does not fire in the tab that made the change, which is
   * why we also emit manually in setUseSystemCursor. */
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    /* Safari in private mode throws on localStorage access. Falling back to
     * the custom cursor is the right default — the feature still works, it
     * just doesn't remember the choice. */
    return false;
  }
}

/** Server and first client render: assume the custom cursor is wanted. */
function getServerSnapshot(): boolean {
  return false;
}

export function useCursorPreference() {
  const useSystemCursor = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setUseSystemCursor = useCallback((value: boolean) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      /* Ignore — the toggle still works for this session. */
    }
    emit();
  }, []);

  return { useSystemCursor, setUseSystemCursor };
}
