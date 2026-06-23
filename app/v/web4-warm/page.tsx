"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Instrument_Serif } from "next/font/google";

/* ============================================================
   VARIANT: web4-warm
   Reference-class cinematic hero (web4guru.com) ported to the
   waseemnasir warm-editorial brand. The reference's "wow" is an
   ABSTRACT orchestration-motion backdrop — here rebuilt as a
   live warm node-network canvas + drifting gradient-glow, over
   the cream editorial base, scroll-pinned with a staggered
   Instrument-Serif reveal.

   SELF-CONTAINED — touches zero shared files. Light bg via a
   `fixed inset-0 z-0` cream div over the global dark body.
   ============================================================ */

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

/* ─── Palette (brand source of truth: editorial-warm) ─── */
const CREAM = "#F4EADE";
const CREAM_SURFACE = "#F9F4EC";
const ESPRESSO = "#2B1D14";
const MUTED = "#7A6150";
const OXBLOOD = "#5A1A1A";
const CARAMEL = "#B07D4E";
const HAIRLINE = "rgba(43,29,20,0.10)";

const CTA = "https://skynetjoe.com/discovery-call";

const PROOF = ["180+ workflows", "40+ sites", "9 countries", "since 2019"];

/* ─── Live warm orchestration field (canvas node-network) ─── */
function OrchestrationField({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Alias as non-null so nested functions don't re-trigger narrowing complaints
    const cvs: HTMLCanvasElement = canvas;
    const cx: CanvasRenderingContext2D = ctx;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    type Pulse = { a: number; b: number; t: number; speed: number };
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const MAXD = 168;

    function resize() {
      w = cvs.clientWidth;
      h = cvs.clientHeight;
      cvs.width = Math.floor(w * dpr);
      cvs.height = Math.floor(h * dpr);
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      // density scales with area, capped for perf
      const count = Math.min(70, Math.max(34, Math.floor((w * h) / 26000)));
      nodes = Array.from({ length: count }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.14, 0.14),
        vy: rand(-0.14, 0.14),
        r: rand(1.0, 2.6),
      }));
      // a few travelling "orchestration" pulses along random pairs
      pulses = Array.from({ length: 6 }, () => ({
        a: Math.floor(rand(0, nodes.length)),
        b: Math.floor(rand(0, nodes.length)),
        t: rand(0, 1),
        speed: rand(0.0016, 0.0042),
      }));
    }

    function update() {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (const p of pulses) {
        p.t += p.speed;
        if (p.t > 1) {
          p.t = 0;
          p.a = Math.floor(rand(0, nodes.length));
          p.b = Math.floor(rand(0, nodes.length));
        }
      }
    }

    function render() {
      cx.clearRect(0, 0, w, h);

      // edges — faint oxblood, opacity by proximity
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < MAXD) {
            const o = (1 - d / MAXD) * 0.16;
            cx.strokeStyle = `rgba(90,26,26,${o.toFixed(3)})`;
            cx.lineWidth = 0.7;
            cx.beginPath();
            cx.moveTo(a.x, a.y);
            cx.lineTo(b.x, b.y);
            cx.stroke();
          }
        }
      }

      // travelling pulses — caramel dots gliding node→node
      for (const p of pulses) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const fade = Math.sin(p.t * Math.PI); // fade in/out across the trip
        cx.beginPath();
        cx.arc(x, y, 2.1, 0, Math.PI * 2);
        cx.fillStyle = `rgba(176,125,78,${(0.7 * fade).toFixed(3)})`;
        cx.fill();
      }

      // nodes — caramel
      for (const n of nodes) {
        cx.beginPath();
        cx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        cx.fillStyle = "rgba(176,125,78,0.55)";
        cx.fill();
      }
    }

    function tick() {
      update();
      render();
      raf = requestAnimationFrame(tick);
    }

    resize();
    init();
    if (reduce) {
      render(); // single static frame, no animation
    } else {
      tick();
    }

    const onResize = () => {
      resize();
      init();
      if (reduce) render();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduce]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.9 }}
      aria-hidden
    />
  );
}

export default function Web4WarmHero() {
  const reduce = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 0.95],
    [1, 1, reduce ? 1 : 0],
  );

  const ease = [0.25, 0.46, 0.45, 0.94] as const;

  return (
    <main className={`${instrumentSerif.variable}`}>
      {/* cream canvas covering the global dark body */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: CREAM }}
        aria-hidden
      />

      <section
        ref={sectionRef}
        className="relative z-10 flex min-h-screen flex-col justify-center overflow-hidden"
      >
        {/* ── Background layers ── */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {/* base warm gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(168deg, ${CREAM_SURFACE} 0%, ${CREAM} 52%, #EFE2D2 100%)`,
            }}
          />
          {/* drifting glow blobs */}
          <motion.div
            className="absolute rounded-full"
            style={{
              top: "-10%",
              right: "-8%",
              width: 620,
              height: 620,
              background: CARAMEL,
              opacity: 0.1,
              filter: "blur(150px)",
            }}
            animate={reduce ? undefined : { x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              bottom: "-14%",
              left: "-10%",
              width: 560,
              height: 560,
              background: OXBLOOD,
              opacity: 0.07,
              filter: "blur(160px)",
            }}
            animate={reduce ? undefined : { x: [0, 50, 0], y: [0, -24, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* live orchestration network */}
          {mounted && <OrchestrationField reduce={reduce} />}
          {/* faint grid texture (espresso, low alpha) */}
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.04,
              backgroundImage:
                "linear-gradient(to right, #2B1D14 1px, transparent 1px), linear-gradient(to bottom, #2B1D14 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          {/* cream vignette mask — calm center, soft edges (light-mode tuned) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 46%, rgba(244,234,222,0) 0%, rgba(244,234,222,0.35) 64%, rgba(244,234,222,0.82) 100%)",
            }}
          />
        </div>

        {/* ── Content ── */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-32 text-center sm:pt-36"
        >
          {/* pill badge */}
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-9 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{
              borderColor: HAIRLINE,
              background: "rgba(249,244,236,0.6)",
              color: MUTED,
              backdropFilter: "blur(4px)",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: CARAMEL }}
            >
              <motion.span
                className="block h-1.5 w-1.5 rounded-full"
                style={{ background: CARAMEL }}
                animate={reduce ? undefined : { opacity: [1, 0.2, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </span>
            AI &amp; Automation Systems
          </motion.span>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.05 }}
            className="font-[family-name:var(--font-instrument)] text-[2.6rem] font-normal leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.6rem]"
            style={{ color: ESPRESSO }}
          >
            I take the repetitive work
            <br />
            that drains your business —
            <br />
            <span
              style={{
                display: "inline-block",
                backgroundImage: `linear-gradient(110deg, ${OXBLOOD} 0%, ${CARAMEL} 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                fontStyle: "italic",
              }}
            >
              and make it run itself.
            </span>
          </motion.h1>

          {/* subtext */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-base leading-relaxed sm:text-lg"
            style={{ color: MUTED }}
          >
            Independent founder building AI &amp; automation systems for growing
            companies across nine countries — the quiet machinery that captures
            the lead, sends the follow-up, and books the call, around the clock.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.32 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href={CTA}
              className="group inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl px-9 py-4 text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              style={{
                background: OXBLOOD,
                color: CREAM_SURFACE,
                boxShadow: "0 18px 40px -16px rgba(90,26,26,0.55)",
              }}
            >
              Book a discovery call
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <a
              href="#work"
              className="inline-flex min-h-[56px] w-full items-center justify-center rounded-xl border px-9 py-4 text-base font-semibold transition-all duration-300 sm:w-auto"
              style={{
                borderColor: "rgba(43,29,20,0.22)",
                color: ESPRESSO,
                background: "rgba(249,244,236,0.4)",
              }}
            >
              See the work
            </a>
          </motion.div>

          {/* proof row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-11 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "rgba(122,97,80,0.85)" }}
          >
            {PROOF.map((p, i) => (
              <span key={p} className="inline-flex items-center gap-3">
                {i > 0 && (
                  <span style={{ color: "rgba(43,29,20,0.25)" }}>·</span>
                )}
                {p}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{ color: "rgba(122,97,80,0.7)" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={reduce ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </motion.div>
      </section>

      {/* short second section so the scroll-fade reads + anchor target */}
      <section
        id="work"
        className="relative z-10 border-t px-6 py-28"
        style={{ borderColor: HAIRLINE, background: CREAM_SURFACE }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.25em]"
            style={{ color: CARAMEL }}
          >
            The work
          </p>
          <h2
            className="font-[family-name:var(--font-instrument)] mt-4 text-3xl leading-tight sm:text-4xl"
            style={{ color: ESPRESSO }}
          >
            Systems quietly running behind businesses in nine countries.
          </h2>
        </div>
      </section>
    </main>
  );
}
