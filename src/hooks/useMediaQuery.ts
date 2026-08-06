"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query.
 *
 * Implemented with useSyncExternalStore rather than useState + useEffect.
 * matchMedia IS an external store, and this is what the hook is for: it gives
 * React a subscribe/getSnapshot pair, avoids the cascading render that a
 * setState-in-effect causes, and makes the server snapshot explicit rather
 * than an accident of initial state.
 *
 * `serverSnapshot` is the value used during SSR and the first client render,
 * before React can read the real media query. Choose it so that the SAFE state
 * renders first — see usePrefersReducedMotion, which passes `true`.
 *
 * Default is `false`, i.e. "not yet known, assume no match". For anything where
 * a wrong first answer is harmful (mounting a custom cursor, autoplaying video)
 * gate on the positive signal only.
 */
export function useMediaQuery(query: string, serverSnapshot = false): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
