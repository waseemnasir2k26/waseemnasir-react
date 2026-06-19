"use client";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * 2px top gradient reading rail, spring-smoothed.
 * Mounted once in layout.tsx — sits above Nav (z-60).
 * No props. GPU-only (scaleX on transform-origin: 0%).
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Reduced-motion: scroll-linked motion values aren't governed by MotionConfig,
  // so suppress the rail entirely rather than spring it.
  if (reduce) return null;

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-0 inset-x-0 h-[2px] z-[60] pointer-events-none bg-gradient-to-r from-accent via-accent2 to-accent"
      aria-hidden
    />
  );
}
