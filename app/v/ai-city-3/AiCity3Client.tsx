"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  SERVICES,
  WORK,
  EASE,
  LANE_HONESTY_CHIP,
  LEAK_CHIP,
} from "@/components/aicity-signalgrid/tokens";
import FacadeFragment from "@/components/aicity-signalgrid/FacadeFragment";
import type { SignalGridCanvasHandle } from "@/components/aicity-signalgrid/SignalGridCanvas";

/* ============================================================
   VARIANT: /v/ai-city-3 — "SIGNALGRID"
   The city is wireframe; the DATA is the star. Buildings are
   thin jade edge-only outlines on near-black — the only bright
   thing on screen is data in motion: GPU-shader pulses traveling
   building-to-building on catenary light-bridges. Sibling of
   /v/skyline (components/skyline) — identical architecture:
   SSR-first static page is the real default, a fixed WebGL canvas
   mounts additively behind it only when eligible, native scroll
   drives everything, nothing hijacks the wheel/touch.
   ============================================================ */

const SignalGridCanvas = dynamic(
  () => import("@/components/aicity-signalgrid/SignalGridCanvas"),
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

const SCENES = ["entry", "grid", "flybys", "proof", "works", "uplink"] as const;

export default function AiCity3Client() {
  const reduceOS = !!useReducedMotion();
  const [mode, setMode] = useState<Mode>("static");
  const [canvasFailed, setCanvasFailed] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  // NOTE: SignalGridCanvas is loaded via next/dynamic (React.lazy under
  // the hood, see node_modules/next/dist/shared/lib/loadable.shared-runtime.js
  // in this Next 16 build). That wrapper's own forwardRef intercepts any
  // `ref` prop to expose ONLY `{ retry }` (its own useImperativeHandle) and
  // never forwards it to the loaded component — canvasRef.current would
  // resolve to `{ retry }`, so `canvasRef.current?.setFocus(id)` would
  // throw (setFocus is not a function), not silently no-op. Bridge the
  // imperative API through a stable callback prop instead, set once the
  // real component mounts and calls back with its handle.
  const canvasApiRef = useRef<SignalGridCanvasHandle | null>(null);

  useLayoutEffect(() => {
    const forcedStatic = new URLSearchParams(window.location.search).has(
      "static",
    );
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    const eligible =
      !forcedStatic &&
      !reduceOS &&
      !coarsePointer &&
      !noHover &&
      supportsWebGL();
    setMode(eligible ? "3d" : "static");
  }, [reduceOS]);

  const is3D = mode === "3d" && !canvasFailed;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const handleCanvasReady = useCallback(
    (api: SignalGridCanvasHandle | null) => {
      canvasApiRef.current = api;
    },
    [],
  );

  const setFocus = useCallback((id: string | null) => {
    canvasApiRef.current?.setFocus(id);
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html, body { background: ${C.skyDark} !important; color-scheme: dark !important; }
        .sg-root { font-synthesis: none; }
        .sg-cta:active { transform: scale(0.97); }
        .sg-link { position: relative; }
        .sg-link::after { content:""; position:absolute; left:0; bottom:-3px; height:1px; width:100%;
          background:${C.jadeBright}; transform:scaleX(0); transform-origin:left; transition:transform .16s ease; }
        .sg-link:hover::after { transform:scaleX(1); }
        :focus-visible { outline: 2px solid ${C.jadeBright}; outline-offset: 2px; border-radius: 4px; }
        .sg-label-wrapper { pointer-events: none !important; }
        .sg-tower-btn { transition: border-color .16s ease, background .16s ease; }
        .sg-tower-btn:hover, .sg-tower-btn:focus-visible { border-color: ${C.jadeBright} !important; background: ${C.jadeTint} !important; }
        @keyframes sg-lane-flow { to { stroke-dashoffset: -48; } }
        .sg-lane { animation: sg-lane-flow 2.4s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sg-lane { animation: none !important; stroke-dashoffset: 0 !important; }
        }
      `,
        }}
      />
      <main
        id="main-content"
        className={`sg-root relative ${display.variable} ${body.variable} ${mono.variable}`}
        style={{
          background: C.skyDark,
          color: C.body,
          fontFamily: "var(--font-body)",
          overflowX: "clip",
        }}
      >
        {is3D && (
          <SignalGridCanvas
            progress={scrollYProgress}
            onContextLost={() => setCanvasFailed(true)}
            onReady={handleCanvasReady}
          />
        )}

        <MiniNav />

        <div
          ref={trackRef}
          style={{
            position: "relative",
            ...(is3D ? { height: `${SCENES.length * 100}vh` } : {}),
          }}
        >
          {is3D ? (
            <PinnedTrack progress={scrollYProgress} setFocus={setFocus} />
          ) : (
            <StaticTrack reduce={reduceOS} />
          )}
        </div>

        <SignalGridFooter />
        <MobileCTA />
      </main>
    </>
  );
}

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
          SIGNALGRID PREVIEW
        </span>
      </a>
      <Link
        href={CTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="sg-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
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
   3D MODE — tall scroll track, sticky viewport, 6 crossfading
   HTML overlays synced to the same progress value driving the
   camera. Real text stays in the DOM at all times.
   ============================================================ */
function PinnedTrack({
  progress,
  setFocus,
}: {
  progress: MotionValue<number>;
  setFocus: (id: string | null) => void;
}) {
  const total = SCENES.length;
  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden">
      {SCENES.map((id, i) => (
        <PinnedScene key={id} id={id} i={i} total={total} progress={progress}>
          {sceneContent(id, setFocus)}
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
   sticky/pin, no canvas. This is also the mobile experience:
   facade fragments + native <details> tap-to-expand, real DOM,
   real headings, real links — nothing lazy-loaded for content.
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
          <RevealBlock reduce={reduce}>
            {sceneContent(id, () => {})}
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
   SCENE CONTENT
   ============================================================ */
function sceneContent(
  id: (typeof SCENES)[number],
  setFocus: (id: string | null) => void,
) {
  switch (id) {
    case "entry":
      return <EntryScene setFocus={setFocus} />;
    case "grid":
      return <GridScene setFocus={setFocus} />;
    case "flybys":
      return <FlybysScene setFocus={setFocus} />;
    case "proof":
      return <ProofScene />;
    case "works":
      return <WorksScene setFocus={setFocus} />;
    case "uplink":
      return <UplinkScene />;
    default:
      return null;
  }
}

function EntryScene({ setFocus }: { setFocus: (id: string | null) => void }) {
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7" style={{ paddingTop: "4.5rem" }}>
        <Scrim className="px-6 py-7 sm:px-8 sm:py-9">
          <Mono color={C.jadeBright}>SIGNALGRID — the data is the star</Mono>
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
                className="sg-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
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
              href="#grid"
              className="sg-link font-semibold"
              style={{ color: C.jadeBright, fontSize: "0.95rem" }}
            >
              Watch the grid ↓
            </a>
          </div>
          <div className="mt-6">
            <Mono color={C.jadeBright}>
              180+ workflows · 40+ sites · 9 countries · since 2019
            </Mono>
          </div>
          <button
            type="button"
            onFocus={() => setFocus("the-leak")}
            onBlur={() => setFocus(null)}
            onMouseEnter={() => setFocus("the-leak")}
            onMouseLeave={() => setFocus(null)}
            onClick={() =>
              document
                .getElementById("uplink")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="sg-link mt-5 inline-flex items-center gap-2 font-mono"
            style={{
              color: C.mute,
              fontSize: "0.68rem",
              letterSpacing: "0.06em",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            ⚠ one lane in this grid is broken — find it
          </button>
        </Scrim>
      </div>
      <div className="lg:col-span-5">
        <GridIllustration />
      </div>
    </div>
  );
}

/** Decorative SVG wireframe grid — stands in for the 3D scene when the
    canvas isn't mounted. Deterministic, aria-hidden. */
function GridIllustration() {
  const heights = [22, 38, 16, 46, 28, 56, 20, 40, 24, 34, 18, 44];
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
          <rect
            key={i}
            x={x + 3}
            y={y}
            width={w - 6}
            height={h}
            fill="none"
            stroke={C.gridHair}
            strokeWidth={1}
          />
        );
      })}
      {heights.slice(0, -1).map((h, i) => {
        const w = 320 / heights.length;
        const x1 = i * w + w / 2;
        const x2 = (i + 1) * w + w / 2;
        const y1 = 190 - h * 0.7;
        const y2 = 190 - heights[i + 1] * 0.7;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={C.jadeBright}
            strokeWidth={1.4}
            className="sg-lane"
            strokeDasharray="3 8"
          />
        );
      })}
      <rect x="0" y="188" width="320" height="1" fill={C.jade} opacity="0.5" />
    </svg>
  );
}

function TowerButton({
  label,
  sub,
  id,
  setFocus,
}: {
  label: string;
  sub: string;
  id: string;
  setFocus: (id: string | null) => void;
}) {
  return (
    <button
      type="button"
      onFocus={() => setFocus(id)}
      onBlur={() => setFocus(null)}
      onMouseEnter={() => setFocus(id)}
      onMouseLeave={() => setFocus(null)}
      className="sg-tower-btn flex flex-col gap-1 rounded-2xl px-4 py-5 text-left"
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
        {label}
      </span>
      <Mono>{sub}</Mono>
    </button>
  );
}

function GridScene({ setFocus }: { setFocus: (id: string | null) => void }) {
  return (
    <Scrim className="px-6 py-8 sm:px-8 sm:py-10">
      <Mono color={C.jadeBright}>The grid — highest-degree node center</Mono>
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
      <p
        className="mt-3 max-w-[52ch]"
        style={{ color: C.body, fontSize: "0.92rem" }}
      >
        n8n sits at the center — the highest-degree node in the grid. The
        architecture diagram is the skyline.
      </p>
      <div
        className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-5"
        role="list"
        aria-label="Stack towers — focus or hover to isolate on the grid"
      >
        {STACK.map((node) => (
          <TowerButton
            key={node.id}
            id={node.id}
            label={node.label}
            sub={node.sub}
            setFocus={setFocus}
          />
        ))}
      </div>
    </Scrim>
  );
}

function FlybysScene({ setFocus }: { setFocus: (id: string | null) => void }) {
  return (
    <Scrim className="px-6 py-8 sm:px-8 sm:py-10">
      <Mono color={C.jadeBright}>
        Tower flybys — this tower&apos;s traffic, isolated
      </Mono>
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
        Four districts. Each one, isolated.
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <details
            key={s.id}
            className="group rounded-2xl p-5"
            style={{
              background: C.card,
              border: `1px solid ${C.hairline}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
            onToggle={(e) =>
              setFocus((e.target as HTMLDetailsElement).open ? s.id : null)
            }
          >
            <summary
              className="sg-link flex cursor-pointer items-center justify-between gap-3"
              onFocus={() => setFocus(s.id)}
              onBlur={() => setFocus(null)}
              onMouseEnter={() => setFocus(s.id)}
              onMouseLeave={() => setFocus(null)}
              style={{ listStyle: "none" }}
            >
              <span>
                <Mono color={C.jadeBright}>{s.district}</Mono>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    color: C.ink,
                    fontSize: "1.15rem",
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </span>
              <FacadeFragment id={s.id} />
            </summary>
            <div className="mt-3">
              <Mono>{s.kicker}</Mono>
              <p
                className="mt-2"
                style={{ color: C.body, fontSize: "0.92rem" }}
              >
                {s.pitch}
              </p>
            </div>
          </details>
        ))}
      </div>
    </Scrim>
  );
}

function ProofScene() {
  return (
    <Scrim className="px-6 py-8 sm:px-8 sm:py-10">
      <Mono color={C.jadeBright}>Proof substation — the locked numbers</Mono>
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
      <p
        className="mt-3 max-w-[48ch]"
        style={{ color: C.mute, fontSize: "0.8rem" }}
      >
        Substation heights are decorative — they never encode these numbers.
      </p>
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

function WorksScene({ setFocus }: { setFocus: (id: string | null) => void }) {
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
            key={w.id}
            className="sg-tower-btn flex flex-col gap-2 rounded-2xl p-6"
            tabIndex={0}
            onFocus={() => setFocus(w.id)}
            onBlur={() => setFocus(null)}
            onMouseEnter={() => setFocus(w.id)}
            onMouseLeave={() => setFocus(null)}
            style={{
              background: C.card,
              border: w.dashed
                ? `1px dashed ${C.gridHair}`
                : `1px solid ${C.hairline}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
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
                  className="mt-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.9rem",
                    color: C.jadeBright,
                  }}
                >
                  {w.metric}
                </div>
              </div>
              <FacadeFragment id={w.id} />
            </div>
            <p style={{ color: C.body, fontSize: "0.92rem" }}>{w.note}</p>
            <p style={{ color: C.ink, fontWeight: 600, fontSize: "0.98rem" }}>
              {w.outcome}
            </p>
            <Mono color={C.jadeBright}>{w.mech}</Mono>
            <Mono color={C.mute} className="mt-1">
              {LANE_HONESTY_CHIP}
            </Mono>
          </div>
        ))}
      </div>
    </Scrim>
  );
}

function UplinkScene() {
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
      <Mono color={C.jadeBright}>Uplink</Mono>
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
      <p style={{ color: C.body, fontSize: "0.85rem", maxWidth: "38ch" }}>
        {LEAK_CHIP}
      </p>
      <Magnetic>
        <Link
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="sg-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
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

function SignalGridFooter() {
  return (
    <footer
      className="relative mt-8 border-t px-5 py-10 text-center sm:px-6"
      style={{ borderColor: C.hairline, background: C.card }}
    >
      <Mono>
        Built by{" "}
        <a
          href="https://www.waseemnasir.com"
          className="sg-link"
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
    const el = document.getElementById("uplink");
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
        className="sg-cta flex w-full items-center justify-center rounded-full font-semibold"
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
