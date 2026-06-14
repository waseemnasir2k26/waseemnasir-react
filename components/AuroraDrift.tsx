"use client";
import { useEffect, useRef } from "react";

/**
 * Optional JS pointer-reactive aurora layer.
 * CSS-first approach (globals.css keyframes) is the default.
 * This escalation adds a pointer-follow indigo bloom via rAF-throttled CSS vars.
 *
 * Hard gates:
 *   - prefers-reduced-motion: reduce → returns null
 *   - pointer: coarse (touch devices) → returns null
 *
 * Writes --mx / --my (0–100%) onto a single fixed div via inline style.
 * One rAF loop, cancelled on unmount. No React state updates per frame.
 */
export default function AuroraDrift() {
  const divRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 50, y: 50 });
  const currentRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    // Gate: reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Gate: touch/coarse pointer — magnetic bloom is meaningless without a fine pointer
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = divRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      targetRef.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    // Lerp loop — smooth follow without React re-renders
    const loop = () => {
      const t = 0.06; // lerp factor — lower = more lag (silkier)
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * t;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * t;

      el.style.setProperty("--mx", `${currentRef.current.x.toFixed(2)}%`);
      el.style.setProperty("--my", `${currentRef.current.y.toFixed(2)}%`);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // CSS-keyframe aurora already handles reduced-motion and coarse pointer.
  // This layer only mounts when the gates pass (fine pointer + motion ok).
  return (
    <div
      ref={divRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        background:
          "radial-gradient(28rem 28rem at var(--mx, 50%) var(--my, 50%), rgba(109,94,246,0.13), transparent 60%)",
      }}
    />
  );
}
