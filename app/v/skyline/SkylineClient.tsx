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
import Magnetic from "@/components/Magnetic";
import CountUp from "@/components/CountUp";
import {
  C,
  CTA_URL,
  H1,
  SUB,
  CTA_LABEL,
  PROOF,
  STACK,
  WORK,
  EASE,
} from "@/components/skyline/tokens";

/* ============================================================
   VARIANT: /v/skyline
   "The city at night" — one Canvas, one scroll-scrubbed camera
   flyover through five districts: ENTRY (high approach) / STACK
   DISTRICT (5 landmark towers) / PROOF PLAZA (4 illuminated
   towers + locked numbers) / WORKS BOULEVARD (billboard signs) /
   DOCK (landing pad + final CTA).

   Sibling of /v/orbit (app/v/orbit/OrbitClient.tsx) — identical
   architecture, night-city world instead of the orbiting-emblem
   world. Same rules apply:
   - Default render (SSR + first paint) is the flat, static,
     accessible page — real copy, real semantic HTML, an SVG
     skyline illustration standing in for the 3D scene. This IS
     the no-WebGL / touch / reduced-motion fallback, not a
     separate code path bolted on afterward.
   - On mount, if eligible (fine pointer, motion allowed, WebGL
     available), a fixed-position <Canvas> mounts behind the
     content and the same sections switch to a pinned scrollytelling
     layout, camera-synced to the identical scroll progress value
     driving the crossfades. Native document scroll only — nothing
     hijacks the wheel/touch.
   ============================================================ */

const SkylineCanvas = dynamic(
  () => import("@/components/skyline/SkylineCanvas"),
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

const SCENES = ["entry", "stack", "proof", "work", "dock"] as const;

export default function SkylineClient() {
  const reduceOS = !!useReducedMotion();
  const [mode, setMode] = useState<Mode>("static");
  const [canvasFailed, setCanvasFailed] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Decided before paint (useLayoutEffect) so there is no visible flash
  // between the SSR static layout and the upgraded 3D layout.
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
        .skyline-root { font-synthesis: none; }
        .skyline-cta:active { transform: scale(0.97); }
        .skyline-link { position: relative; }
        .skyline-link::after { content:""; position:absolute; left:0; bottom:-3px; height:1px; width:100%;
          background:${C.jadeBright}; transform:scaleX(0); transform-origin:left; transition:transform .16s ease; }
        .skyline-link:hover::after { transform:scaleX(1); }
        :focus-visible { outline: 2px solid ${C.jadeBright}; outline-offset: 2px; border-radius: 4px; }
        .skyline-label-wrapper { pointer-events: none !important; }
      `,
        }}
      />
      <main
        id="main-content"
        className={`skyline-root relative ${display.variable} ${body.variable} ${mono.variable}`}
        style={{
          background: C.skyDark,
          color: C.body,
          fontFamily: "var(--font-body)",
          overflowX: "clip",
        }}
      >
        {is3D && (
          <SkylineCanvas
            progress={scrollYProgress}
            onContextLost={() => setCanvasFailed(true)}
          />
        )}

        <MiniNav />

        {/* One stable DOM node for the whole component lifetime — the
            scroll-progress target for useScroll below. Only its *children*
            switch between the pinned-crossfade layout and the plain
            stacked fallback; the node identity itself never changes, so
            useScroll never loses its target across the static→3d upgrade. */}
        <div
          ref={trackRef}
          style={{
            position: "relative",
            ...(is3D ? { height: `${SCENES.length * 100}vh` } : {}),
          }}
        >
          {is3D ? (
            <PinnedTrack progress={scrollYProgress} />
          ) : (
            <StaticTrack reduce={reduceOS} />
          )}
        </div>

        <SkylineFooter />
        <MobileCTA />
      </main>
    </>
  );
}

/* ── minimal fixed nav — name + single CTA, matches the orbit
   convention without duplicating the full site Nav ── */
function MiniNav() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-3 sm:px-6"
      style={{
        background: "rgba(3,17,15,0.72)",
        backdropFilter: "blur(14px) saturate(160%)",
        WebkitBackdropFilter: "blur(14px) saturate(160%)",
        borderBottom: `1px solid ${C.hairline}`,
      }}
    >
      <a href="#entry" className="flex flex-col leading-none">
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
          SKYLINE PREVIEW
        </span>
      </a>
      <Link
        href={CTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="skyline-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
        style={{
          background: C.jade,
          color: "#fff",
          fontSize: "0.82rem",
          padding: "0.5rem 1rem",
        }}
      >
        {CTA_LABEL}
      </Link>
    </header>
  );
}

/* ============================================================
   3D MODE — tall scroll track, sticky viewport, 5 crossfading
   HTML overlays synced to the same progress value driving the
   camera. Every section's real text stays in the DOM at all
   times (opacity/transform only) — nothing is removed for SEO
   or a11y reasons, only visually deprioritised when inactive.
   ============================================================ */
function PinnedTrack({ progress }: { progress: MotionValue<number> }) {
  const total = SCENES.length;
  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden">
      {SCENES.map((id, i) => (
        <PinnedScene key={id} id={id} i={i} total={total} progress={progress}>
          {sceneContent(id)}
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
  const active = progress.get() >= start - fade && progress.get() < end + fade;
  return (
    <motion.section
      id={id}
      aria-label={id}
      className="absolute inset-0 flex items-center"
      style={{ opacity, y, pointerEvents: "none" }}
      ref={(el: HTMLElement | null) => {
        if (el) el.inert = !active;
      }}
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
   sticky/pin, no canvas. Same five sections, same copy, styled
   as night jade cards with a decorative SVG skyline graphic
   standing in for the 3D scene.
   ============================================================ */
function StaticTrack({ reduce }: { reduce: boolean }) {
  return (
    <>
      {SCENES.map((id) => (
        <section
          key={id}
          id={id}
          className="mx-auto max-w-[1200px] px-5 py-20 sm:px-6 sm:py-24"
        >
          <RevealBlock reduce={reduce}>{sceneContent(id)}</RevealBlock>
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

/* ── shared mono label ── */
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

/* ── translucent night scrim behind HTML text, so copy stays legible
   regardless of exactly what the jade-lit city looks like underneath
   at any given scroll position ── */
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
function sceneContent(id: (typeof SCENES)[number]) {
  switch (id) {
    case "entry":
      return <EntryScene />;
    case "stack":
      return <StackScene />;
    case "proof":
      return <ProofScene />;
    case "work":
      return <WorkScene />;
    case "dock":
      return <DockScene />;
    default:
      return null;
  }
}

function EntryScene() {
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7" style={{ paddingTop: "4.5rem" }}>
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
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Magnetic>
              <Link
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="skyline-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
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
              href="#proof"
              className="skyline-link font-semibold"
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
        <SkylineIllustration />
      </div>
    </div>
  );
}

/** Decorative SVG skyline graphic — stands in for the 3D scene when the
    canvas isn't mounted. aria-hidden; purely visual. */
function SkylineIllustration() {
  // Deterministic building heights so SSR and hydration render the same
  // string every time (no Math.random in JSX — same lesson as the orbit
  // illustration's float-rounding fix, applied up front here).
  const heights = [42, 68, 30, 84, 54, 96, 38, 72, 46, 62, 34, 80];
  return (
    <svg
      viewBox="0 0 320 220"
      aria-hidden
      role="presentation"
      style={{
        width: "100%",
        height: "auto",
        maxWidth: 420,
        display: "block",
        margin: "0 auto",
      }}
    >
      <rect x="0" y="0" width="320" height="220" fill={C.skyDark} />
      {heights.map((h, i) => {
        const w = 320 / heights.length;
        const x = i * w;
        const y = 190 - h;
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
                fill={(i + r) % 3 === 0 ? C.jadeBright : "transparent"}
                opacity={0.9}
              />
            ))}
          </g>
        );
      })}
      <rect x="0" y="188" width="320" height="2" fill={C.jade} opacity="0.5" />
    </svg>
  );
}

function StackScene() {
  return (
    <Scrim className="px-6 py-8 sm:px-8 sm:py-10">
      <Mono color={C.jadeBright}>The stack district</Mono>
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
        Five landmark towers, one system that runs itself.
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {STACK.map((node) => (
          <div
            key={node.id}
            className="flex flex-col gap-1 rounded-2xl px-4 py-5"
            style={{
              background: C.card,
              border: `1px solid ${C.hairline}`,
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
              {node.label}
            </span>
            <Mono>{node.sub}</Mono>
          </div>
        ))}
      </div>
    </Scrim>
  );
}

function ProofScene() {
  return (
    <Scrim className="px-6 py-8 sm:px-8 sm:py-10">
      <Mono color={C.jadeBright}>Proof plaza — the locked numbers</Mono>
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
    </Scrim>
  );
}

function WorkScene() {
  return (
    <Scrim className="px-6 py-8 sm:px-8 sm:py-10">
      <Mono color={C.jadeBright}>Works boulevard — named clients</Mono>
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
        {WORK.map((w) => (
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
              <Mono>{w.client}</Mono>
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

function DockScene() {
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
      <Mono color={C.jadeBright}>Dock</Mono>
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
          className="skyline-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
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
    </div>
  );
}

/* ── footer — self-contained, credits SkynetLabs per house rule,
   matches the orbit footer convention already live on /v/orbit ── */
function SkylineFooter() {
  return (
    <footer
      className="relative mt-8 border-t px-5 py-10 text-center sm:px-6"
      style={{ borderColor: C.hairline, background: C.card }}
    >
      <Mono>
        Built by{" "}
        <a
          href="https://www.waseemnasir.com"
          className="skyline-link"
          style={{ color: C.jadeBright }}
        >
          SkynetLabs · waseemnasir.com
        </a>
      </Mono>
    </footer>
  );
}

function MobileCTA() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = document.getElementById("dock");
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => setHidden(!!e[0]?.isIntersecting),
      {
        threshold: 0.1,
      },
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
        className="skyline-cta flex w-full items-center justify-center rounded-full font-semibold"
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
