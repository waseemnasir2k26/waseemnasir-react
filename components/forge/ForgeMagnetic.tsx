"use client";
import { useRef } from "react";

/* Hydration-safe magnetic hover wrapper.
   The repo's shared components/Magnetic.tsx structurally branches its
   returned JSX on `useReducedMotion()` / a pointer media query read on the
   very first client render — under prefers-reduced-motion the server tree
   (no window, so it renders the wrapped-motion.div path) and the client's
   first paint (media query already true) disagree, producing a hydration
   mismatch (verified via Playwright's reducedMotion:'reduce' emulation).
   Out of scope to fix there (components/Magnetic.tsx is shared, forge's
   scope is app/v/forge/** + components/forge/** only) — this local version
   always renders the identical wrapper element on server and client, and
   only gates the *behavior* (pointermove listener) behind a ref check, so
   the DOM shape never depends on a client-only signal during hydration. */
export default function ForgeMagnetic({
  children,
  strength = 0.22,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const enabledRef = useRef(false);

  const onEnter = () => {
    enabledRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (enabledRef.current) {
      rectRef.current = ref.current?.getBoundingClientRect() ?? null;
    }
  };
  const onMove = (e: React.MouseEvent) => {
    if (!enabledRef.current) return;
    const r = rectRef.current;
    const el = ref.current;
    if (!r || !el) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px)`;
  };
  const onLeave = () => {
    rectRef.current = null;
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block"
      style={{ transition: "transform .25s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
    </div>
  );
}
