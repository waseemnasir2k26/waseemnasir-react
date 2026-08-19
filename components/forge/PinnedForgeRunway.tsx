"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import ForgeMagnetic from "./ForgeMagnetic";
import {
  BUILD_CAPTIONS,
  C,
  CTA,
  CTA_LABEL,
  H1,
  KICKER,
  STATS,
  SUB,
} from "./tokens";
import { BUILD_CAPTION_SPLITS, BUILD_END, HERO_END } from "./bands";

const ForgeCanvas = dynamic(() => import("./ForgeCanvas"), { ssr: false });

/* Count-up that arms once `start` flips true (once, never resets) — the
   Proof beat is already on-stage via the pin, so there's no IntersectionObserver
   here, just the scroll-progress crossing into the Proof band. */
function ForgeCountUp({
  to,
  suffix,
  start,
}: {
  to: number;
  suffix: string;
  start: boolean;
}) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!start || done.current) return;
    done.current = true;
    let raf = 0;
    const t0 = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to]);
  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}

export default function PinnedForgeRunway() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  // R3F reads scroll progress through a ref (no per-frame React re-render).
  const pRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    pRef.current = v;
  });
  const getP = useCallback(() => pRef.current, []);

  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [contextLost, setContextLost] = useState(false);
  const onContextLost = useCallback(() => setContextLost(true), []);

  const [buildIdx, setBuildIdx] = useState(0);
  const [proofArmed, setProofArmed] = useState(false);
  // Which band is on-stage right now — drives `inert` so keyboard/AT users
  // never tab into a beat that's faded to opacity:0. Plain state (not a
  // motion value) because inert has to be a real DOM commit, not a style.
  const [activeBand, setActiveBand] = useState<"hero" | "build" | "proof">(
    "hero",
  );
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    let idx = 0;
    for (let i = 0; i < 3; i++) {
      if (v >= BUILD_CAPTION_SPLITS[i]) idx = i;
    }
    setBuildIdx(idx);
    if (v >= BUILD_END && !proofArmed) setProofArmed(true);
    setActiveBand(v < HERO_END ? "hero" : v < BUILD_END ? "build" : "proof");
  });

  const heroElRef = useRef<HTMLDivElement>(null);
  const buildElRef = useRef<HTMLDivElement>(null);
  const proofElRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (heroElRef.current) heroElRef.current.inert = activeBand !== "hero";
    if (buildElRef.current) buildElRef.current.inert = activeBand !== "build";
    if (proofElRef.current) proofElRef.current.inert = activeBand !== "proof";
  }, [activeBand]);

  // Band opacities — content stays in the DOM always (SEO/CLS safe); only
  // opacity/pointer-events swap so screen readers + Tab order skip the
  // beat that isn't on-stage.
  const heroOpacity = useTransform(
    scrollYProgress,
    [0, HERO_END - 0.05, HERO_END],
    [1, 1, 0],
  );
  const buildOpacity = useTransform(
    scrollYProgress,
    [HERO_END - 0.05, HERO_END, BUILD_END, BUILD_END + 0.04],
    [0, 1, 1, 0],
  );
  const proofOpacity = useTransform(
    scrollYProgress,
    [BUILD_END, BUILD_END + 0.04, 1],
    [0, 1, 1],
  );

  return (
    <section
      aria-label="The Forge — from manual work to a running system"
      style={{ background: C.accentDeep }}
    >
      <div ref={runwayRef} style={{ height: "420vh" }}>
        <div
          ref={stickyRef}
          className="sticky top-0 h-screen w-full overflow-hidden"
        >
          {contextLost ? (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: C.accentDeep }}
              role="status"
            >
              <p
                className="font-mono text-xs uppercase tracking-[0.1em]"
                style={{ color: C.onDeep }}
              >
                Preview graphics unavailable — scroll on for the rest of the
                page.
              </p>
            </div>
          ) : (
            <div className="absolute inset-0" aria-hidden>
              <ForgeCanvas
                getP={getP}
                active={inView}
                onContextLost={onContextLost}
              />
            </div>
          )}

          {/* legibility scrim */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(60% 60% at 50% 45%, rgba(10,61,56,0.15), rgba(10,61,56,0.72) 75%)",
            }}
          />

          {/* HERO band */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="absolute inset-0 flex items-center"
            ref={heroElRef}
          >
            <div className="mx-auto w-full max-w-[1200px] px-6">
              <div className="max-w-[62ch]">
                <p
                  className="font-mono uppercase"
                  style={{
                    color: C.accent,
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                  }}
                >
                  {KICKER}
                </p>
                <h1
                  className="mt-5"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "clamp(2.5rem, 5.6vw, 4.5rem)",
                    lineHeight: 1.03,
                    letterSpacing: "-0.026em",
                    color: C.onDeep,
                  }}
                >
                  {H1}
                </h1>
                <p
                  className="mt-6"
                  style={{
                    fontSize: "clamp(1.0225rem,1.3vw,1.1875rem)",
                    lineHeight: 1.6,
                    color: "rgba(234,244,241,0.82)",
                    maxWidth: "54ch",
                  }}
                >
                  {SUB}
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <ForgeMagnetic>
                    <Link
                      href={CTA}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
                      style={{
                        background: C.accent,
                        color: "#fff",
                        fontSize: "0.95rem",
                        padding: "0.85rem 1.7rem",
                        boxShadow: "0 0 40px rgba(17,126,115,0.45)",
                      }}
                    >
                      {CTA_LABEL}
                    </Link>
                  </ForgeMagnetic>
                  <span
                    className="font-mono uppercase"
                    style={{
                      color: "rgba(234,244,241,0.55)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Scroll to watch it get built ↓
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* BUILD band */}
          <motion.div
            style={{ opacity: buildOpacity }}
            className="absolute inset-0 flex items-end justify-center pb-24 sm:items-center sm:pb-0"
            ref={buildElRef}
          >
            <div className="mx-auto w-full max-w-[1200px] px-6">
              <div className="max-w-[38ch]">
                <p
                  className="font-mono uppercase"
                  style={{
                    color: C.accent,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                  }}
                >
                  The build
                </p>
                <p
                  className="mt-4 font-mono"
                  style={{
                    color: C.onDeep,
                    fontSize: "clamp(1.5rem,3.2vw,2.25rem)",
                    lineHeight: 1.3,
                    minHeight: "2.6em",
                  }}
                  aria-live="polite"
                >
                  {BUILD_CAPTIONS[buildIdx]}
                </p>
                <div className="mt-4 flex gap-2" aria-hidden>
                  {BUILD_CAPTIONS.map((c, i) => (
                    <div
                      key={c}
                      style={{
                        height: 3,
                        width: 30,
                        borderRadius: 999,
                        background:
                          i <= buildIdx ? C.accent : "rgba(234,244,241,0.2)",
                        transition: "background .25s ease-out",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* PROOF band */}
          <motion.div
            style={{ opacity: proofOpacity }}
            className="absolute inset-0 flex items-end pb-16 sm:items-center sm:pb-0"
            ref={proofElRef}
          >
            <div className="mx-auto w-full max-w-[1200px] px-6">
              <p
                className="font-mono uppercase"
                style={{
                  color: C.accent,
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                }}
              >
                The proof
              </p>
              <h2
                className="mt-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "clamp(1.75rem,3.6vw,2.75rem)",
                  color: C.onDeep,
                  letterSpacing: "-0.02em",
                  maxWidth: "24ch",
                }}
              >
                One system, run enough times, becomes a body of work.
              </h2>
              <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "clamp(2rem,4vw,2.9rem)",
                        color: C.accent,
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                      }}
                    >
                      <ForgeCountUp
                        to={s.to}
                        suffix={s.suffix}
                        start={proofArmed}
                      />
                    </div>
                    <div
                      className="mt-2 font-mono uppercase"
                      style={{
                        color: "rgba(234,244,241,0.62)",
                        fontSize: "0.66rem",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
