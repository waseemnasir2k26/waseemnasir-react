"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import ForgeMagnetic from "./ForgeMagnetic";
import {
  BUILD_CAPTIONS,
  C,
  CTA,
  CTA_LABEL,
  EASE,
  H1,
  KICKER,
  STATS,
  SUB,
} from "./tokens";

/* Premium static vertical fallback — touch devices, reduced-motion, or no
   WebGL. Same copy and same locked numbers as the pinned 3D runway, just
   without the scroll-scrub: a real vertical page, SVG in place of three.js,
   fade-ins gated by `reduce`. */

function StaticCountUp({
  to,
  suffix,
  reduce,
}: {
  to: number;
  suffix: string;
  reduce: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(to);
  useEffect(() => {
    if (reduce || !inView) {
      setVal(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 800;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

function Reveal({
  children,
  reduce,
  delay = 0,
}: {
  children: React.ReactNode;
  reduce: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* Hand-rolled SVG core — same jade/ink-jade palette as the 3D scene. */
function CoreIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      role="img"
      aria-label="Illustration of a glowing automation core"
    >
      <defs>
        <radialGradient id="forge-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#117E73" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#117E73" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="forge-core" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1AA398" />
          <stop offset="100%" stopColor="#0A3D38" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#forge-glow)" />
      <g transform="translate(100 100)">
        <polygon
          points="0,-46 40,-23 40,23 0,46 -40,23 -40,-23"
          fill="url(#forge-core)"
          stroke="#117E73"
          strokeWidth="1.5"
        />
        <circle r="16" fill="#EAF4F1" opacity="0.92" />
      </g>
    </svg>
  );
}

function GearIcon({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width="42"
      height="42"
      aria-hidden
      focusable="false"
    >
      <circle
        cx="32"
        cy="32"
        r="14"
        fill="none"
        stroke="#117E73"
        strokeWidth="3"
      />
      <circle cx="32" cy="32" r="4" fill="#117E73" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x1 = 32 + Math.cos(a) * 14;
        const y1 = 32 + Math.sin(a) * 14;
        const x2 = 32 + Math.cos(a) * 20;
        const y2 = 32 + Math.sin(a) * 20;
        return (
          <line
            key={label + i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#117E73"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export default function StaticForge({ reduce }: { reduce: boolean }) {
  return (
    <section style={{ background: C.accentDeep }} className="relative">
      <div className="mx-auto max-w-[720px] px-6 py-24 sm:py-28">
        {/* HERO */}
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <Reveal reduce={reduce}>
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
                  fontSize: "clamp(2.1rem,7vw,3.1rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.024em",
                  color: C.onDeep,
                }}
              >
                {H1}
              </h1>
              <p
                className="mt-5"
                style={{
                  fontSize: "1.0125rem",
                  lineHeight: 1.6,
                  color: "rgba(234,244,241,0.82)",
                }}
              >
                {SUB}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
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
                      boxShadow: "0 0 32px rgba(17,126,115,0.4)",
                    }}
                  >
                    {CTA_LABEL}
                  </Link>
                </ForgeMagnetic>
              </div>
            </Reveal>
          </div>
          <div className="sm:col-span-2" style={{ aspectRatio: "1/1" }}>
            <CoreIllustration />
          </div>
        </div>

        {/* BUILD */}
        <div className="mt-24">
          <Reveal reduce={reduce}>
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
          </Reveal>
          <div className="mt-6 flex flex-col gap-6">
            {BUILD_CAPTIONS.map((caption, i) => (
              <Reveal reduce={reduce} delay={i * 0.08} key={caption}>
                <div className="flex items-center gap-4">
                  <GearIcon label={caption} />
                  <p
                    className="font-mono"
                    style={{
                      color: C.onDeep,
                      fontSize: "1.25rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {caption}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* PROOF */}
        <div className="mt-24">
          <Reveal reduce={reduce}>
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
                fontSize: "clamp(1.6rem,5vw,2.2rem)",
                color: C.onDeep,
                letterSpacing: "-0.02em",
              }}
            >
              One system, run enough times, becomes a body of work.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-6">
            {STATS.map((s, i) => (
              <Reveal reduce={reduce} delay={i * 0.06} key={s.label}>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "clamp(1.9rem,6vw,2.6rem)",
                      color: C.accent,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <StaticCountUp
                      to={s.to}
                      suffix={s.suffix}
                      reduce={reduce}
                    />
                  </div>
                  <div
                    className="mt-2 font-mono uppercase"
                    style={{
                      color: "rgba(234,244,241,0.62)",
                      fontSize: "0.64rem",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
