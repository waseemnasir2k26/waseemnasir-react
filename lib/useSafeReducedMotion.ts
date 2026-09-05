"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hydration-safe `prefers-reduced-motion`.
 *
 * framer-motion's `useReducedMotion()` reads `matchMedia` on the client, but the
 * server cannot know the OS flag — so a reduced-motion visitor gets SSR markup
 * built with motion ON and a client tree built with motion OFF. Different inline
 * `style` attributes on every `motion.*` node → React #418 (hydration mismatch),
 * which forces a full client re-render of the root.
 *
 * This hook returns `false` on the server AND on the first client render, so the
 * two passes are byte-identical, then switches to the real preference inside an
 * effect. That is React's documented two-pass pattern:
 * https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content
 *
 * CSS-driven motion is still suppressed immediately (before mount) by the
 * `@media (prefers-reduced-motion: reduce)` block in `app/globals.css`.
 */
export function useSafeReducedMotion(): boolean {
  const os = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? !!os : false;
}

export default useSafeReducedMotion;
