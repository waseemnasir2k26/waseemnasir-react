"use client";
import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

/**
 * Thin "use client" wrapper that provides the site-wide MotionConfig.
 * Imported by the Server Component layout.tsx so it doesn't need "use client" itself.
 *
 * reducedMotion="user" → framer-motion auto-disables all transforms when
 * the OS prefers-reduced-motion flag is set (single source of truth).
 *
 * The default spring transition here is a fallback; individual components
 * override via their own transition prop or motion.ts presets.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      {children}
    </MotionConfig>
  );
}
