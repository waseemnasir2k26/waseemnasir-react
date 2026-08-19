"use client";
import { useEffect, useState } from "react";

export type ForgeCapabilities = {
  /** true once the checks below have run on the client */
  ready: boolean;
  /** desktop + fine pointer + motion allowed + WebGL available */
  use3D: boolean;
  reduce: boolean;
};

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * Gate for the pinned 3D forge experience.
 * Server default is `use3D: false` so SSR always ships the static markup
 * (no CLS, no flash of a canvas that never mounts). Reconciles once on
 * mount, then again on the reduced-motion / pointer media queries changing.
 */
export function useForgeCapabilities(): ForgeCapabilities {
  const [state, setState] = useState<ForgeCapabilities>({
    ready: false,
    use3D: false,
    reduce: false,
  });

  useEffect(() => {
    const reduceQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineQ = window.matchMedia("(pointer: fine)");
    const desktopQ = window.matchMedia("(min-width: 1024px)");

    const evaluate = () => {
      const reduce = reduceQ.matches;
      const fine = fineQ.matches;
      const desktop = desktopQ.matches;
      const webgl = detectWebGL();
      setState({
        ready: true,
        reduce,
        use3D: !reduce && fine && desktop && webgl,
      });
    };

    evaluate();
    reduceQ.addEventListener("change", evaluate);
    fineQ.addEventListener("change", evaluate);
    desktopQ.addEventListener("change", evaluate);
    return () => {
      reduceQ.removeEventListener("change", evaluate);
      fineQ.removeEventListener("change", evaluate);
      desktopQ.removeEventListener("change", evaluate);
    };
  }, []);

  return state;
}
