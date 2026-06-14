"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import { useMediaQuery } from "./useMediaQuery";

const ITEMS = [
  "AI automation",
  "n8n workflows",
  "Next.js builds",
  "Answer Engine Optimization",
  "Stripe & payments",
  "WhatsApp bots",
  "Email automation",
  "Lead systems",
];

// Base scroll speed in px/frame (at 60fps ≈ 60px/s)
const BASE_SPEED = 1;
// Maximum skew in degrees when scrolling fast
const MAX_SKEW_DEG = 3;

function MarqueeTrack() {
  const row = [...ITEMS, ...ITEMS, ...ITEMS]; // 3× so wrap never shows a gap
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Spring-smooth the raw scroll velocity so the lean is buttery, not jerky
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 400,
    damping: 50,
  });

  // Map velocity → skewX: ±velocity/500, capped at ±MAX_SKEW_DEG
  const skewX = useTransform(smoothVelocity, (v) => {
    const raw = -v / 500; // negative = leans forward in scroll direction
    return Math.min(MAX_SKEW_DEG, Math.max(-MAX_SKEW_DEG, raw));
  });

  // Drive translateX via rAF — no React re-render per frame
  const directionRef = useRef(1);
  useAnimationFrame((_t, delta) => {
    // delta is ms since last frame; normalise to 60fps equivalent
    const move = BASE_SPEED * (delta / 16.67);
    let next = baseX.get() - move * directionRef.current;
    // Each ITEMS copy is ~50% of the total row width
    // wrap() keeps us inside [−50%, 0] so the seam is invisible
    next = wrap(-50, 0, next / 100) * 100; // percent-based wrap
    baseX.set(next);
  });

  // Convert raw number → "X%" string for translateX
  const x = useTransform(baseX, (v) => `${v}%`);

  return (
    <motion.div
      className="marquee-track flex w-max gap-12 pr-12"
      style={{ x, skewX }}
      aria-hidden="true"
    >
      {row.map((t, i) => (
        <div key={i} className="flex items-center gap-12 whitespace-nowrap">
          <span className="text-sm font-medium tracking-wide text-mute transition-colors duration-300 hover:text-chalk">
            {t}
          </span>
          {/* Editorial slash separator — mono, muted, unobtrusive */}
          <span
            className="font-mono text-xs text-mute/40 select-none"
            aria-hidden="true"
          >
            /
          </span>
        </div>
      ))}
    </motion.div>
  );
}

// CSS-only fallback for reduced-motion and server render
function MarqueeTrackStatic() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      className="marquee-track flex w-max gap-12 pr-12 animate-[marquee-scroll_30s_linear_infinite]"
      aria-hidden="true"
    >
      {row.map((t, i) => (
        <div key={i} className="flex items-center gap-12 whitespace-nowrap">
          <span className="text-sm font-medium tracking-wide text-mute">
            {t}
          </span>
          <span
            className="font-mono text-xs text-mute/40 select-none"
            aria-hidden="true"
          >
            /
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Marquee() {
  // useMediaQuery SSR-safe: server + reduced-motion users get CSS path
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  return (
    <section className="border-y border-line py-6" aria-label="Capabilities">
      <div className="relative overflow-hidden edge-fade-x">
        {reducedMotion ? <MarqueeTrackStatic /> : <MarqueeTrack />}
      </div>

      {/* CSS keyframe for the static fallback path */}
      <style jsx>{`
        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
