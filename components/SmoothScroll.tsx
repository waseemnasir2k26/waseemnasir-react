"use client";
import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Initialises Lenis smooth scroll and exposes the instance on window.__lenis
 * so the mobile Nav drawer can call .stop() / .start() to lock scroll while open.
 * Cleans up (and deletes window.__lenis) on unmount.
 *
 * Reduced-motion: returns without initialising — Lenis never runs.
 * This is intentional: WorkGallery hard-branches to a static grid when
 * useReducedMotion() is true, so there's nothing to drive.
 */

// Augment window type for the shared Lenis handle
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    // Expose for Nav drawer stop/start
    window.__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
