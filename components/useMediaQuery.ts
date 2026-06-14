"use client";
import { useEffect, useState } from "react";

/**
 * SSR-safe matchMedia hook.
 * Returns `serverDefault` during SSR (before hydration), then reconciles to
 * the real value after mount via a matchMedia change listener.
 *
 * Usage:
 *   const isDesktop = useMediaQuery("(min-width: 768px)");
 *   const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", false);
 */
export function useMediaQuery(query: string, serverDefault = true): boolean {
  const [matches, setMatches] = useState<boolean>(serverDefault);

  useEffect(() => {
    const mql = window.matchMedia(query);
    // Reconcile immediately after mount
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    // Modern browsers
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
