/* Shared scroll-progress bands for the single pinned runway (Hero → Build →
   Proof). One `useScroll` progress value (0..1) drives both the HTML
   caption overlays (PinnedForgeRunway) and the 3D scene (ForgeCanvas) —
   keeping them here so the two can never drift out of sync. */

export const HERO_END = 0.28;
export const BUILD_END = 0.66;
// PROOF runs from BUILD_END to 1.

export const BUILD_CAPTION_SPLITS = [
  HERO_END,
  HERO_END + (BUILD_END - HERO_END) / 3,
  HERO_END + ((BUILD_END - HERO_END) * 2) / 3,
  BUILD_END,
] as const;

/** Clamp + remap `p` from [a,b] to [0,1]. */
export function bandLocal(p: number, a: number, b: number): number {
  if (b <= a) return 0;
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** easeInOutCubic — used to soften the linear scroll mapping for anything
    that should feel like it eases rather than tracks 1:1 with the wheel. */
export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
