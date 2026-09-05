"use client";
import { MotionConfig } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

/**
 * Thin "use client" wrapper that provides the site-wide MotionConfig.
 * Imported by the Server Component layout.tsx so it doesn't need "use client" itself.
 *
 * 🔴 HYDRATION (React #418) — fixed 2026-09-06.
 * `reducedMotion="user"` made framer-motion skip transform/opacity values on the
 * client whenever the OS flag was set, while the server (which cannot read
 * `matchMedia`) had already emitted them. The inline `style` attributes then
 * disagreed on every `motion.*` node of the homepage → "Hydration failed because
 * the server rendered HTML didn't match the client" → full client re-render.
 *
 * Fix = React's documented two-pass mount: SSR and the FIRST client render both
 * use `"never"` (identical markup, hydration succeeds); an effect then flips to
 * `"user"` so reduced-motion visitors still get the preference honoured.
 * CSS-driven motion is suppressed from the very first paint by the
 * `@media (prefers-reduced-motion: reduce)` block in app/globals.css.
 *
 * The default spring transition here is a fallback; individual components
 * override via their own transition prop or motion.ts presets.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <MotionConfig
      reducedMotion={hydrated ? "user" : "never"}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      {children}
    </MotionConfig>
  );
}
