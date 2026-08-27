"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import StaticFallback from "@/components/threeforty7/StaticFallback";
import {
  BEATS,
  C,
  CTA_LABEL,
  CTA_URL,
  CREDENTIAL_LINE,
  PORTRAIT_SRC,
  OPENING_LINE,
  SCROLL_HINT,
  progressToClock,
} from "@/components/threeforty7/tokens";

/* ============================================================
   /v/347 — "3:47 AM — The City That Works While You Sleep"

   The signature: scroll scrubs TIME, not space. The camera never
   moves (see NightCityCanvas — only a ±0.5° parallax nudge). All
   narrative copy is real DOM text laid "on the glass," faded per
   beat with framer's useTransform against the same scrollYProgress
   that drives the canvas's uProgress — nothing here is canvas text.
   ============================================================ */

const NightCityCanvas = dynamic(
  () => import("@/components/threeforty7/NightCityCanvas"),
  { ssr: false },
);

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});
const body = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

const TRACK_VH = 820;

type Mode = "static" | "3d";

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      c.getContext("webgl2") ||
      c.getContext("webgl") ||
      c.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export default function NightCityClient() {
  const reduceOS = !!useReducedMotion();
  const [mode, setMode] = useState<Mode>("static");
  const [canvasFailed, setCanvasFailed] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    const eligible = !reduceOS && !coarsePointer && !noHover && supportsWebGL();
    setMode(eligible ? "3d" : "static");
  }, [reduceOS]);

  const is3D = mode === "3d" && !canvasFailed;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  if (!is3D) {
    return (
      <div className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <StaticFallback />
      </div>
    );
  }

  return (
    <main
      id="main-content"
      className={`relative ${display.variable} ${body.variable} ${mono.variable}`}
      style={{ background: "#050810", fontFamily: "var(--font-body)" }}
    >
      <SmoothScroll />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html, body { background:#050810 !important; color-scheme: dark !important; }
        .glass347-cta:active { transform: scale(0.97); }
      `,
        }}
      />

      <div
        ref={trackRef}
        style={{ position: "relative", height: `${TRACK_VH}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <NightCityCanvas
            progress={scrollYProgress}
            onContextLost={() => setCanvasFailed(true)}
          />
          <PreDawnGlow progress={scrollYProgress} />
          <WindowFrame />
          <GhostReflection progress={scrollYProgress} />
          <ClockReadout progress={scrollYProgress} />
          {BEATS.map((b, i) => (
            <GlassBeat key={b.id} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>

      <Footer347 />
    </main>
  );
}

/* ── pre-dawn atmosphere: faint moon glow + horizon line, CSS-only,
   composited above the canvas but below the glass vignette. Fades out
   by the time the sky starts warming (sun sprite in CitySceneBuild
   takes over from ~p=0.72) so it reads as "before dawn," not a
   permanent fixture. Purely to keep the opening frame from reading
   as an empty void. ── */
function PreDawnGlow({ progress }: { progress: MotionValue<number> }) {
  const glowOpacity = useTransform(progress, [0, 0.22, 0.4], [1, 0.4, 0]);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{ opacity: glowOpacity }}
    >
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: "16%",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(214,226,255,0.14) 0%, rgba(214,226,255,0.05) 45%, transparent 72%)",
          filter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "58%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,200,150,0.10) 20%, rgba(255,210,170,0.16) 50%, rgba(255,200,150,0.10) 80%, transparent 100%)",
          filter: "blur(1px)",
        }}
      />
    </motion.div>
  );
}

/* ── room/window framing — pure CSS, sells "floor-to-ceiling glass" ── */
function WindowFrame() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[5]">
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 140px 40px rgba(0,0,0,0.55)",
        }}
      />
    </div>
  );
}

function GhostReflection({ progress }: { progress: MotionValue<number> }) {
  const ghostOpacity = useTransform(progress, [0, 0.82, 0.98], [0.05, 0.04, 0]);
  const sharpOpacity = useTransform(progress, [0.9, 1], [0, 1]);
  return (
    <>
      {/* faint ghost, glass-mode blend — feathered + off-center so it
          reads as a reflection in glass, not a watermark rectangle.
          Sits BELOW the annotation layer (GlassBeat, z-[15]) and below
          the vignette (WindowFrame, z-[5]) — must be noticed second. */}
      <motion.img
        src={PORTRAIT_SRC}
        alt=""
        aria-hidden
        className="pointer-events-none fixed top-[44%] z-[4] w-[46vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 select-none"
        style={{
          left: "68%",
          mixBlendMode: "screen",
          opacity: ghostOpacity,
          maskImage:
            "radial-gradient(ellipse 60% 70% at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 70% at center, black 30%, transparent 75%)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
      {/* sharp CTA-beat photo card, fades in on top */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[7] flex items-center justify-center"
        style={{ opacity: sharpOpacity }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PORTRAIT_SRC}
            alt="Waseem Nasir"
            width={128}
            height={128}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              width: 128,
              height: 128,
              border: `2px solid ${C.amber}`,
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      </motion.div>
    </>
  );
}

function ClockReadout({ progress }: { progress: MotionValue<number> }) {
  const hhRef = useRef<HTMLSpanElement>(null);
  const mmRef = useRef<HTMLSpanElement>(null);
  const ssRef = useRef<HTMLSpanElement>(null);
  const startRef = useRef(performance.now());

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progress.get();
      let hh: string, mm: string, ss: string;
      if (p < 0.0015) {
        // pre-scroll: real ticking seconds off the wall clock, minute
        // locked at 03:47 (the hook beat's own start)
        const elapsedSec = Math.floor(
          (performance.now() - startRef.current) / 1000,
        );
        const clock = progressToClock(0);
        hh = clock.hh;
        mm = clock.mm;
        ss = String(elapsedSec % 60).padStart(2, "0");
      } else {
        const clock = progressToClock(p);
        hh = clock.hh;
        mm = clock.mm;
        ss = clock.ss;
      }
      if (hhRef.current) hhRef.current.textContent = hh;
      if (mmRef.current) mmRef.current.textContent = mm;
      if (ssRef.current) ssRef.current.textContent = ss;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <div
      className="fixed right-5 top-5 z-20 select-none font-mono sm:right-8 sm:top-8"
      style={{
        color: C.amberBright,
        fontSize: "clamp(1.1rem, 2.4vw, 1.7rem)",
        letterSpacing: "0.04em",
        textShadow: "0 0 18px rgba(255,179,92,0.35)",
      }}
    >
      <span ref={hhRef}>03</span>:<span ref={mmRef}>47</span>
      <span style={{ fontSize: "0.55em", opacity: 0.7 }}>
        :<span ref={ssRef}>00</span>
      </span>
    </div>
  );
}

/* ============================================================
   ONE beat's HTML annotation, absolute-stacked over the sticky
   viewport. Opacity is a pure function of scrollYProgress — same
   MotionValue the canvas reads, so text and city ignition can
   never drift out of sync, forward OR backward (rewind-safe).
   ============================================================ */
function GlassBeat({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const beat = BEATS[index];
  const next = BEATS[index + 1];
  const isFirst = index === 0;
  const isLast = index === BEATS.length - 1;
  // The final (CTA) beat sits at p=1 exactly — it can't fade in over a
  // [1, >1, 1] window (framer requires strictly increasing keyframes,
  // and would otherwise silently pin opacity at 0 forever). It gets a
  // fixed fade-in window ending at p=1 instead; the beat immediately
  // before it (sunrise) is capped to finish fading out by that same
  // point so the two never both hold at full opacity at once.
  const CTA_FADE_START = 0.94;
  const start = beat.p;
  const end = isLast
    ? 1
    : next && next.p === 1
      ? Math.min(next.p, CTA_FADE_START)
      : next
        ? next.p
        : 1;
  const fade = Math.max(0.012, (end - start) * 0.25);

  const opacity = useTransform(
    progress,
    isFirst
      ? [0, end - fade, end]
      : isLast
        ? [CTA_FADE_START, 1]
        : [start, start + fade, end - fade, end],
    isFirst ? [1, 1, 0] : isLast ? [0, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    isLast ? [CTA_FADE_START, 1] : [start, end],
    [12, -12],
  );

  const sectionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const applyActive = (p: number) => {
      const el = sectionRef.current;
      if (!el) return;
      const lo = isLast ? CTA_FADE_START : start - fade;
      const hi = isLast ? 1.001 : end + fade;
      el.style.pointerEvents = p >= lo && p < hi ? "auto" : "none";
    };
    applyActive(progress.get());
    const unsub = progress.on("change", applyActive);
    return unsub;
  }, [progress, start, end, fade]);

  return (
    <motion.div
      ref={sectionRef}
      className="pointer-events-none fixed inset-x-0 bottom-[12%] z-[15] flex justify-center px-6 sm:bottom-[16%]"
      style={{ opacity, y }}
    >
      <div className="w-full max-w-[640px] text-center">
        {isFirst && (
          <>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.15rem, 2.6vw, 1.6rem)",
                color: C.ink,
                textShadow:
                  "0 1px 3px rgba(0,0,0,0.9), 0 4px 28px rgba(0,0,0,0.65)",
              }}
            >
              {OPENING_LINE}
            </p>
            <p
              className="mt-6 font-mono"
              style={{
                color: C.mute,
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
              }}
            >
              {SCROLL_HINT.toUpperCase()} ↓
            </p>
          </>
        )}

        {isLast && (
          <div className="flex flex-col items-center gap-4">
            {/* clearance for the sharp portrait card (GhostReflection,
                fixed-centered, 128px) fading in over the same window —
                kept as one photo, not duplicated here */}
            <div style={{ height: 148 }} aria-hidden />
            <p
              style={{
                fontWeight: 600,
                color: C.ink,
                fontSize: "1.05rem",
                textShadow: "0 1px 3px rgba(0,0,0,0.9)",
              }}
            >
              Waseem Nasir
            </p>
            <p
              style={{
                color: C.mute,
                fontSize: "0.85rem",
                textShadow: "0 1px 3px rgba(0,0,0,0.85)",
              }}
            >
              {CREDENTIAL_LINE}
            </p>
            <Link
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass347-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
              style={{
                background: C.amber,
                color: "#1a1206",
                fontSize: "1rem",
                padding: "0.9rem 1.9rem",
                boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
              }}
            >
              {CTA_LABEL}
            </Link>
            <p style={{ color: C.mute, fontSize: "0.8rem", maxWidth: "34ch" }}>
              {beat.line}
            </p>
          </div>
        )}

        {!isFirst && !isLast && (
          <div>
            {beat.eyebrow && (
              <p
                className="font-mono"
                style={{
                  color: C.amber,
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textShadow:
                    "0 1px 3px rgba(0,0,0,0.85), 0 0 12px rgba(255,179,92,0.45)",
                }}
              >
                {beat.eyebrow}
              </p>
            )}
            <p
              className="mt-3"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.25rem, 3vw, 1.9rem)",
                lineHeight: 1.2,
                color: C.ink,
                textShadow:
                  "0 1px 3px rgba(0,0,0,0.9), 0 4px 28px rgba(0,0,0,0.65)",
              }}
            >
              {beat.line}
            </p>
            {beat.sub && (
              <p
                className="mt-2"
                style={{
                  color: C.body,
                  fontSize: "0.95rem",
                  textShadow:
                    "0 1px 3px rgba(0,0,0,0.88), 0 2px 16px rgba(0,0,0,0.6)",
                }}
              >
                {beat.sub}
              </p>
            )}
            {beat.counters && (
              <p
                className="mt-5 font-mono"
                style={{
                  color: C.mute,
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  textShadow: "0 1px 3px rgba(0,0,0,0.85)",
                }}
              >
                {beat.counters}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Footer347() {
  return (
    <footer
      className="relative border-t px-5 py-10 text-center sm:px-6"
      style={{ borderColor: "rgba(245,242,234,0.14)", background: "#0a0c14" }}
    >
      <span
        className="font-mono"
        style={{ color: C.mute, fontSize: "0.72rem" }}
      >
        Built by{" "}
        <a href="https://www.waseemnasir.com" style={{ color: C.amber }}>
          SkynetLabs · waseemnasir.com
        </a>
      </span>
    </footer>
  );
}
