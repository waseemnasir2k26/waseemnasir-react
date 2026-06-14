import type { Transition, Variants } from "framer-motion";

// ─── Spring presets ───────────────────────────────────────────────────────────
// SPRING_SOFT  — buttery entrance reveals (Reveal, TextReveal, section staggering)
// SPRING_SNAP  — crisp interactive feedback (Nav sheet, Magnetic whileHover/Tap)

export const SPRING_SOFT = {
  type: "spring",
  stiffness: 90,
  damping: 18,
  mass: 0.9,
} as const satisfies Transition;

export const SPRING_SNAP = {
  type: "spring",
  stiffness: 300,
  damping: 26,
} as const satisfies Transition;

// ─── Easing ───────────────────────────────────────────────────────────────────
// Silk bezier for non-spring moments (CountUp ease, shimmer, etc.)
export const EASE_SILK = [0.16, 1, 0.3, 1] as const;

// ─── Stagger container / item variants ───────────────────────────────────────
// Drop onto a wrapping motion.div (variants={STAGGER_CONTAINER})
// and motion.div children (variants={SPRING_ITEM}) for coordinated spring stagger.

export const STAGGER_CONTAINER: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

export const SPRING_ITEM: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: SPRING_SOFT,
  },
};
