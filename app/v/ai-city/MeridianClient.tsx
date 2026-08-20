"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
import Magnetic from "@/components/Magnetic";
import CountUp from "@/components/CountUp";
import {
  C,
  CTA_URL,
  H1,
  SUB,
  CTA_LABEL,
  HERO_CUE,
  PROOF,
  DISTRICT,
  WORK,
  EASE,
  STAGES,
} from "@/components/aicity-meridian/tokens";

/* ============================================================
   VARIANT: /v/ai-city — "MERIDIAN"
   One scroll = one compressed day: golden hour -> sunset -> dusk ->
   nightfall -> deep night -> midnight. A single scroll-driven scalar
   (`uDayness`, computed in MeridianCanvas from this same scroll
   progress) drives sun/sky/fog/windows/bridges — the metaphor IS the
   pitch: manual work ends at 5pm, automation runs the night shift.

   Sibling of /v/skyline (components/skyline/*) — identical contract:
   - Default render (SSR + first paint) is the flat, static,
     accessible "postcard set" page — real copy, real semantic HTML,
     a per-stage SVG skyline strip hard-coded to that stage's time of
     day standing in for the 3D scene. This IS the no-WebGL / touch /
     reduced-motion fallback, not a separate path bolted on after.
   - On mount, if eligible (fine pointer, motion allowed, WebGL
     available), a fixed-position canvas mounts behind the content and
     the sections switch to a pinned scrollytelling layout, camera-
     synced to the same scroll progress driving the crossfades. Native
     document scroll only — nothing hijacks the wheel/touch.
   ============================================================ */

const MeridianCanvas = dynamic(
  () => import("@/components/aicity-meridian/MeridianCanvas"),
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

export default function MeridianClient() {
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

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html, body { background: ${C.skyDark} !important; color-scheme: dark !important; }
        .meridian-root { font-synthesis: none; }
        .meridian-cta:active { transform: scale(0.97); }
        .meridian-link { position: relative; }
        .meridian-link::after { content:""; position:absolute; left:0; bottom:-3px; height:1px; width:100%;
          background:${C.jadeBright}; transform:scaleX(0); transform-origin:left; transition:transform .16s ease; }
        .meridian-link:hover::after { transform:scaleX(1); }
        :focus-visible { outline: 2px solid ${C.jadeBright}; outline-offset: 2px; border-radius: 4px; }
        .meridian-tick { cursor: pointer; }
        details.meridian-bldg > summary { cursor: pointer; list-style: none; }
        details.meridian-bldg > summary::-webkit-details-marker { display: none; }
        .meridian-bldg-row { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s ${`cubic-bezier(${EASE.join(",")})`}; }
        details[open] .meridian-bldg-row { grid-template-rows: 1fr; }
        .meridian-bldg-inner { overflow: hidden; }
      `,
        }}
      />
      <main
        id="main-content"
        className={`meridian-root relative ${display.variable} ${body.variable} ${mono.variable}`}
        style={{
          background: C.skyDark,
          color: C.body,
          fontFamily: "var(--font-body)",
          overflowX: "clip",
        }}
      >
        {is3D && (
          <MeridianCanvas
            progress={scrollYProgress}
            onContextLost={() => setCanvasFailed(true)}
          />
        )}

        <MiniNav
          progress={is3D ? scrollYProgress : undefined}
          trackRef={trackRef}
        />

        <div
          ref={trackRef}
          style={{
            position: "relative",
            ...(is3D ? { height: `${STAGES.length * 100}vh` } : {}),
          }}
        >
          {is3D ? (
            <PinnedTrack progress={scrollYProgress} />
          ) : (
            <StaticTrack reduce={reduceOS} />
          )}
        </div>

        <MeridianFooter />
        <MobileCTA />
      </main>
    </>
  );
}

/* ── minimal fixed nav: name + clock-strip day nav (ADDITION 2) + CTA.
   Clock strip only renders meaningfully in 3D mode (it needs scroll
   progress + a scroll target to jump to); in static mode it degrades
   to a plain anchor list — same wayfinding, zero motion. ── */
function MiniNav({
  progress,
  trackRef,
}: {
  progress?: MotionValue<number>;
  trackRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 flex flex-col gap-2 px-5 py-3 sm:px-6"
      style={{
        background: "rgba(3,17,15,0.72)",
        backdropFilter: "blur(14px) saturate(160%)",
        WebkitBackdropFilter: "blur(14px) saturate(160%)",
        borderBottom: `1px solid ${C.hairline}`,
      }}
    >
      <div className="flex items-center justify-between">
        <a href="#golden" className="flex flex-col leading-none">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.95rem",
              color: C.ink,
              letterSpacing: "-0.01em",
            }}
          >
            Waseem Nasir
          </span>
          <span
            className="font-mono"
            style={{
              color: C.mute,
              fontSize: "0.58rem",
              letterSpacing: "0.1em",
              marginTop: 2,
            }}
          >
            MERIDIAN PREVIEW
          </span>
        </a>
        <Link
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="meridian-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
          style={{
            background: C.jade,
            color: "#fff",
            fontSize: "0.82rem",
            padding: "0.5rem 1rem",
          }}
        >
          {CTA_LABEL}
        </Link>
      </div>
      <ClockStrip progress={progress} trackRef={trackRef} />
    </header>
  );
}

/** ADDITION 2 — clickable clock-strip day nav: a thin dawn->midnight
    gradient bar with one tick per stage; the cursor tracks scroll and
    clicking a tick jumps the track scroll to that stage — the nav IS
    the day. Cursor position is a motionValue-driven style transform,
    zero React re-renders per frame. */
function ClockStrip({
  progress,
  trackRef,
}: {
  progress?: MotionValue<number>;
  trackRef: React.RefObject<HTMLDivElement | null>;
}) {
  // Always a real MotionValue (rules-of-hooks safe): falls back to a static
  // zero value in static mode, where the cursor never actually renders.
  const fallback = useMotionValue(0);
  const cursorLeft = useTransform(progress ?? fallback, [0, 1], ["0%", "100%"]);

  const jumpTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const total = STAGES.length;
    const top = track.offsetTop + (track.offsetHeight * i) / total + 4;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div
      className="relative hidden h-3 w-full items-center sm:flex"
      aria-hidden={!progress}
    >
      <div
        className="relative h-[3px] w-full overflow-hidden rounded-full"
        style={{
          background: `linear-gradient(90deg, #E9C9A6, #B87A5C 30%, ${C.skyDark})`,
          opacity: 0.85,
        }}
      >
        {progress && (
          <motion.div
            className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
            style={{
              left: cursorLeft,
              marginLeft: -5,
              background: C.jadeBright,
              boxShadow: `0 0 8px ${C.jadeBright}`,
            }}
          />
        )}
      </div>
      <div className="absolute inset-0 flex justify-between">
        {STAGES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className="meridian-tick flex h-3 w-3 items-center justify-center"
            aria-label={`Jump to ${s.label}, ${s.clock}`}
            onClick={() => (progress ? jumpTo(i) : undefined)}
            tabIndex={progress ? 0 : -1}
            style={progress ? undefined : { pointerEvents: "none" }}
          >
            <span
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: "rgba(234,244,241,0.5)" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   3D MODE — tall scroll track, sticky viewport, 6 crossfading HTML
   overlays synced to the same progress value driving the camera and
   `uDayness`. Every section's real text stays in the DOM at all
   times (opacity/transform only) — nothing removed for SEO/a11y.
   ============================================================ */
function PinnedTrack({ progress }: { progress: MotionValue<number> }) {
  const total = STAGES.length;
  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden">
      {STAGES.map((s, i) => (
        <PinnedScene
          key={s.id}
          id={s.id}
          i={i}
          total={total}
          progress={progress}
        >
          {sceneContent(s.id, true)}
        </PinnedScene>
      ))}
    </div>
  );
}

function PinnedScene({
  id,
  i,
  total,
  progress,
  children,
}: {
  id: string;
  i: number;
  total: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = (i + 1) * seg;
  const fade = seg * 0.22;
  const opacity = useTransform(
    progress,
    i === 0
      ? [0, end - fade, end]
      : i === total - 1
        ? [start, start + fade, 1]
        : [start, start + fade, end - fade, end],
    i === 0 ? [1, 1, 0] : i === total - 1 ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [start, end],
    i === 0 ? [0, -24] : [24, -24],
  );

  // Live-subscribed activity gate: `progress` is a scroll-driven
  // MotionValue, so `active` must be recomputed on every scroll tick
  // (not once at mount, where progress.get() is ~0 and every non-hero
  // scene would be permanently `inert` — dead CTAs/links for the life
  // of the page). Written straight to the DOM node, no React re-render.
  const sectionRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const applyActive = (p: number) => {
      const el = sectionRef.current;
      if (!el) return;
      el.inert = !(p >= start - fade && p < end + fade);
    };
    applyActive(progress.get());
    const unsub = progress.on("change", applyActive);
    return unsub;
  }, [progress, start, end, fade]);

  return (
    <motion.section
      id={id}
      aria-label={id}
      className="absolute inset-0 flex items-center"
      style={{ opacity, y, pointerEvents: "none" }}
      ref={sectionRef}
    >
      <div
        className="mx-auto w-full max-w-[1200px] px-5 sm:px-6"
        style={{ pointerEvents: "auto" }}
      >
        {children}
      </div>
    </motion.section>
  );
}

/* ============================================================
   STATIC MODE — the real fallback: normal document flow, no
   sticky/pin, no canvas. Same six sections, same copy, each headed
   by a deterministic SVG skyline strip hard-coded to that stage's
   time of day (the day/night story survives as discrete frames,
   zero JS animation). Landmark buildings are tap-to-expand
   <details> rows — the mobile "wake a building" requirement,
   costing zero layout thrash (CSS grid-rows).
   ============================================================ */
function StaticTrack({ reduce }: { reduce: boolean }) {
  return (
    <>
      {STAGES.map((s) => (
        <section
          key={s.id}
          id={s.id}
          className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-20"
        >
          <RevealBlock reduce={reduce}>
            <StageStamp stage={s} />
            {/* GoldenScene renders its own hero-column strip; every other
                stage gets the strip stacked above its content. */}
            {s.id !== "golden" && <StaticSkylineStrip stage={s.id} />}
            {sceneContent(s.id, false)}
          </RevealBlock>
        </section>
      ))}
    </>
  );
}

function RevealBlock({
  children,
  reduce,
}: {
  children: React.ReactNode;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 1, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Mono({
  children,
  color = C.mute,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`font-mono uppercase ${className}`}
      style={{
        color,
        fontSize: "0.72rem",
        fontWeight: 500,
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </span>
  );
}

/** Fictional clock-of-day header stamp, top-right of each stage —
    aesthetic only, never a real calendar deadline. */
function StageStamp({ stage }: { stage: (typeof STAGES)[number] }) {
  return (
    <div className="mb-3 flex items-center justify-end">
      <Mono color={C.jadeBright}>
        {stage.clock} · {stage.label}
      </Mono>
    </div>
  );
}

function Scrim({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(3,17,15,0.62)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid ${C.hairline}`,
        borderRadius: 24,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   SCENE CONTENT — the actual copy, identical in both modes.
   ============================================================ */
function sceneContent(id: string, pinned: boolean) {
  switch (id) {
    case "golden":
      return <GoldenScene pinned={pinned} />;
    case "sunset":
      return <SunsetScene />;
    case "dusk":
      return <DuskScene />;
    case "nightfall":
      return <NightfallScene />;
    case "deep":
      return <DeepNightScene />;
    case "midnight":
      return <MidnightScene />;
    default:
      return null;
  }
}

/** Tiny scroll-driven clock glyph beside the hero cue — hands are
    static art in static mode (no progress), rotate with scroll in
    3D mode. Purely decorative, aria-hidden. */
function ClockGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden
      className="inline-block align-[-3px]"
    >
      <circle
        cx="9"
        cy="9"
        r="8"
        fill="none"
        stroke={C.jadeBright}
        strokeWidth="1.2"
      />
      <line
        x1="9"
        y1="9"
        x2="9"
        y2="4.5"
        stroke={C.jadeBright}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="9"
        x2="12"
        y2="10.5"
        stroke={C.jadeBright}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoldenScene({ pinned }: { pinned: boolean }) {
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
      <div
        className="lg:col-span-7"
        style={{ paddingTop: pinned ? "4.5rem" : 0 }}
      >
        <Scrim className="px-6 py-7 sm:px-8 sm:py-9">
          <Mono color={C.jadeBright}>AI automation that pays for itself</Mono>
          <h1
            className="mt-5"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
              lineHeight: 1.03,
              letterSpacing: "-0.026em",
              color: C.ink,
              maxWidth: "17ch",
            }}
          >
            {H1}
          </h1>
          <p
            className="mt-6"
            style={{
              fontSize: "clamp(1rem,1.3vw,1.15rem)",
              lineHeight: 1.6,
              color: C.body,
              maxWidth: "52ch",
            }}
          >
            {SUB}
          </p>
          <div className="mt-6 flex items-center gap-2">
            <ClockGlyph />
            <Mono color={C.body} className="normal-case tracking-normal">
              {HERO_CUE} ↓
            </Mono>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Magnetic>
              <Link
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="meridian-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: C.jade,
                  color: "#fff",
                  fontSize: "0.95rem",
                  padding: "0.8rem 1.6rem",
                }}
              >
                {CTA_LABEL}
              </Link>
            </Magnetic>
            <a
              href="#dusk"
              className="meridian-link font-semibold"
              style={{ color: C.jadeBright, fontSize: "0.95rem" }}
            >
              See the proof ↓
            </a>
          </div>
          <div className="mt-6">
            <Mono color={C.jadeBright}>
              180+ workflows · 40+ sites · 9 countries · since 2019
            </Mono>
          </div>
        </Scrim>
      </div>
      <div className="lg:col-span-5">
        {!pinned && <StaticSkylineStrip stage="golden" hero />}
      </div>
    </div>
  );
}

function SunsetScene() {
  return (
    <Scrim className="px-6 py-8 sm:px-8 sm:py-10">
      <Mono color={C.jadeBright}>The stack district — lights come up</Mono>
      <h2
        className="mt-4"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(1.9rem,4vw,3rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.024em",
          color: C.ink,
          maxWidth: "24ch",
        }}
      >
        Five landmark towers, one system that runs itself.
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DISTRICT.map((d) => (
          <div
            key={d.id}
            className="flex flex-col gap-1 rounded-2xl px-5 py-5"
            style={{
              background: C.card,
              borderTop: `2px solid ${C.jadeBright}`,
              border: `1px solid ${C.hairline}`,
              borderTopWidth: 2,
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: C.ink,
                fontSize: "1.05rem",
              }}
            >
              {d.name}
            </span>
            <Mono>{d.service}</Mono>
            <p className="mt-2" style={{ color: C.body, fontSize: "0.88rem" }}>
              {d.pitch}
            </p>
          </div>
        ))}
      </div>
    </Scrim>
  );
}

function DuskScene() {
  return (
    <Scrim className="px-6 py-8 sm:px-8 sm:py-10">
      <Mono color={C.jadeBright}>Proof plaza — streetlamps pop on</Mono>
      <h2
        className="mt-4"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(1.9rem,4vw,3rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.024em",
          color: C.ink,
        }}
      >
        Real numbers. Nothing invented.
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {PROOF.map((p) => (
          <div key={p.label}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2.2rem,4.5vw,3rem)",
                color: C.jadeBright,
                letterSpacing: "-0.02em",
              }}
            >
              <CountUp
                to={p.value}
                suffix={p.suffix}
                roll={"roll" in p ? p.roll : true}
              />
            </div>
            <Mono className="mt-1">{p.label}</Mono>
          </div>
        ))}
      </div>
      <Mono className="mt-6 block">measured, not modeled</Mono>
    </Scrim>
  );
}

function NightfallScene() {
  return (
    <Scrim className="px-6 py-8 sm:px-8 sm:py-10">
      <Mono color={C.jadeBright}>Work boulevard — named clients</Mono>
      <h2
        className="mt-4"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(1.9rem,4vw,3rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.024em",
          color: C.ink,
        }}
      >
        Real systems, in production.
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {WORK.map((w, i) => (
          <div
            key={w.client}
            className="flex flex-col gap-2 rounded-2xl p-6"
            style={{
              background: C.card,
              border: `1px solid ${C.hairline}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <Mono>
                BLDG {String(i + 1).padStart(2, "0")} · {w.client}
              </Mono>
              <span
                className="font-mono uppercase"
                style={{
                  color: C.jadeBright,
                  background: C.jadeTint,
                  fontSize: "0.62rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  borderRadius: 999,
                  padding: "0.25rem 0.6rem",
                }}
              >
                {w.status}
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.9rem",
                color: C.jadeBright,
              }}
            >
              {w.metric}
            </div>
            <p style={{ color: C.body, fontSize: "0.92rem" }}>{w.note}</p>
            <p style={{ color: C.ink, fontWeight: 600, fontSize: "0.98rem" }}>
              {w.outcome}
            </p>
            <Mono color={C.jadeBright}>{w.mech}</Mono>
          </div>
        ))}
      </div>
    </Scrim>
  );
}

function DeepNightScene() {
  return (
    <Scrim className="px-6 py-8 sm:px-8 sm:py-10">
      <Mono color={C.jadeBright}>While you sleep, the system runs</Mono>
      <h2
        className="mt-4"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(1.9rem,4vw,3rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.024em",
          color: C.ink,
          maxWidth: "22ch",
        }}
      >
        The districts start talking to each other.
      </h2>
      <div
        className="mt-8 flex flex-col gap-3 font-mono"
        style={{ fontSize: "0.85rem", color: C.body }}
      >
        <p>→ Lead comes in — The Switchboard answers first.</p>
        <p>→ Triage — routed straight into the CRM, nothing dropped.</p>
        <p>→ Reply — auto-response goes out before it goes cold.</p>
        <p>→ Log — every touch recorded, 0 messages left waiting.</p>
      </div>
      <Mono className="mt-6 block">illustrative flow, not live data</Mono>
    </Scrim>
  );
}

function MidnightScene() {
  return (
    <div
      className="mx-auto flex max-w-[640px] flex-col items-center gap-6 rounded-[28px] px-6 py-12 text-center sm:px-12"
      style={{
        background: "rgba(3,17,15,0.78)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: `1px solid ${C.hairline}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
      }}
    >
      <Mono color={C.jadeBright}>Dock — midnight</Mono>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "clamp(2rem,4.5vw,3.25rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.026em",
          color: C.ink,
          maxWidth: "20ch",
        }}
      >
        Find your leak. I&apos;ll engineer it shut.
      </h2>
      <Magnetic>
        <Link
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="meridian-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
          style={{
            background: C.jade,
            color: "#fff",
            fontSize: "1rem",
            padding: "0.9rem 1.8rem",
          }}
        >
          {CTA_LABEL}
        </Link>
      </Magnetic>
      <Mono>Free · 30 min · no pitch</Mono>
      <Mono color={C.jadeBright}>
        The city runs all night. Book the daylight call.
      </Mono>
      <Mono className="mt-1">LAST MANUAL TASK · AUTOMATED</Mono>
    </div>
  );
}

/* ============================================================
   STATIC SKYLINE STRIP — deterministic SVG (no Math.random, hydration-
   safe), sky gradient + window fills hard-coded per stage's time of
   day. Landmark buildings are <button>-wrapped groups inside a
   <details> so tapping expands a detail row beneath the strip (name,
   pitch, anchor link) via CSS grid-rows — the "wake a building"
   requirement, zero JS animation, works with reduced-motion.
   ============================================================ */
const STAGE_SKY: Record<string, { top: string; bottom: string; win: string }> =
  {
    golden: { top: "#E9C9A6", bottom: "#B87A5C", win: "#0A3D38" },
    sunset: { top: "#C77E4F", bottom: "#3B4A52", win: "#1FE7C7" },
    dusk: { top: "#3B4A52", bottom: "#0A3D38", win: "#1FE7C7" },
    nightfall: { top: "#0A3D38", bottom: "#03110F", win: "#1FE7C7" },
    deep: { top: "#03110F", bottom: "#03110F", win: "#1FE7C7" },
    midnight: { top: "#03110F", bottom: "#03110F", win: "#1FE7C7" },
  };

function StaticSkylineStrip({
  stage,
  hero = false,
}: {
  stage: string;
  hero?: boolean;
}) {
  const heights = [42, 68, 30, 84, 54, 96, 38, 72, 46, 62, 34, 80];
  const sky = STAGE_SKY[stage] ?? STAGE_SKY.midnight;
  const gradId = `sky-${stage}`;
  // Landmarks lit proportional to how far into the night this stage is —
  // deterministic, no randomness, matches the district ignition order.
  const litFrom: Record<string, number> = {
    golden: 12,
    sunset: 8,
    dusk: 5,
    nightfall: 2,
    deep: 0,
    midnight: -1,
  };
  const threshold = litFrom[stage] ?? -1;

  return (
    <div className={hero ? "" : "mt-6"}>
      <svg
        viewBox="0 0 320 220"
        role="img"
        aria-label={`City skyline at ${stage}`}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: hero ? 420 : 720,
          display: "block",
          margin: hero ? "0 auto" : undefined,
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sky.top} />
            <stop offset="100%" stopColor={sky.bottom} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="320" height="220" fill={`url(#${gradId})`} />
        {heights.map((h, i) => {
          const w = 320 / heights.length;
          const x = i * w;
          const y = 190 - h;
          const lit = i >= threshold;
          return (
            <g key={i}>
              <rect
                x={x + 2}
                y={y}
                width={w - 4}
                height={h}
                fill={C.card}
                stroke={C.hairline}
              />
              {Array.from({ length: Math.floor(h / 14) }).map((_, r) => (
                <rect
                  key={r}
                  x={x + 6}
                  y={y + 6 + r * 14}
                  width={w - 12}
                  height={5}
                  fill={lit && (i + r) % 3 === 0 ? sky.win : "transparent"}
                  opacity={0.9}
                />
              ))}
            </g>
          );
        })}
        <rect
          x="0"
          y="188"
          width="320"
          height="2"
          fill={C.jade}
          opacity="0.5"
        />
      </svg>
      {stage === "sunset" && !hero && <DistrictAccordion />}
    </div>
  );
}

/** Tap-to-expand building list — mobile "wake a building" requirement,
    native <details> semantics, keyboard-accessible, no JS animation. */
function DistrictAccordion() {
  return (
    <div className="mt-4 flex flex-col gap-2">
      {DISTRICT.map((d) => (
        <details
          key={d.id}
          className="meridian-bldg rounded-xl px-4 py-3"
          style={{ background: C.card, border: `1px solid ${C.hairline}` }}
        >
          <summary className="flex items-center justify-between">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: C.ink,
                fontSize: "0.95rem",
              }}
            >
              {d.name}
            </span>
            <Mono color={C.jadeBright}>tap →</Mono>
          </summary>
          <div className="meridian-bldg-row">
            <div className="meridian-bldg-inner">
              <p
                className="pt-2"
                style={{ color: C.body, fontSize: "0.85rem" }}
              >
                {d.service} — {d.pitch}
              </p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

function MeridianFooter() {
  return (
    <footer
      className="relative mt-8 border-t px-5 py-10 text-center sm:px-6"
      style={{ borderColor: C.hairline, background: C.card }}
    >
      <Mono>
        Built by{" "}
        <a
          href="https://www.waseemnasir.com"
          className="meridian-link"
          style={{ color: C.jadeBright }}
        >
          SkynetLabs · waseemnasir.com
        </a>
      </Mono>
      <Mono className="mt-2 block">SUNSET 19:06 · GRID ONLINE 21:30</Mono>
    </footer>
  );
}

function MobileCTA() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = document.getElementById("midnight");
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => setHidden(!!e[0]?.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{
        transform: hidden ? "translateY(120%)" : "translateY(0)",
        transition: "transform .3s ease",
        padding: "10px 14px calc(10px + env(safe-area-inset-bottom))",
        background: "rgba(3,17,15,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: `1px solid ${C.hairline}`,
      }}
    >
      <Link
        href={CTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="meridian-cta flex w-full items-center justify-center rounded-full font-semibold"
        style={{
          background: C.jade,
          color: "#fff",
          fontSize: "0.95rem",
          minHeight: 46,
        }}
      >
        {CTA_LABEL}
      </Link>
    </div>
  );
}
