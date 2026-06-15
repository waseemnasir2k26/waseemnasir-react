"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import Link from "next/link";

const BOOKING = "https://skynetjoe.com/discovery-call";
const GITHUB = "https://github.com/waseemnasir2k26";

const PALETTE = {
  bg: "#1C0E0E",
  surface: "#2A1414",
  text: "#F2E7D8",
  muted: "#9C7A6E",
  accent: "#7B2018",
  accent2: "#E0A24A",
};

const SERVICES = [
  {
    num: "01",
    title: "AI Voice & Chat Bots",
    desc: "WhatsApp + voice receptionists that answer, qualify, and book — while you sleep. Deployed across clinics, trades, logistics.",
  },
  {
    num: "02",
    title: "n8n Workflow Architecture",
    desc: "End-to-end automation pipelines: CRM sync, lead routing, invoice triggers, Slack alerts. No-code where it fits, code where it counts.",
  },
  {
    num: "03",
    title: "Answer Engine Optimisation",
    desc: "Structure your site so AI search (Perplexity, ChatGPT, Gemini) cites you first. AEO is the next SEO — I've been building it since 2023.",
  },
  {
    num: "04",
    title: "Next.js Product Builds",
    desc: "Full-stack web apps: client portals, SaaS dashboards, booking funnels. Shipped to production, not left as Figma files.",
  },
  {
    num: "05",
    title: "Systems Audits & Strategy",
    desc: "30-minute call → I map where your ops leak money and sequence the fixes. Most clients find 5+ hours of recovered capacity per week.",
  },
];

const SELECTED_WORK = [
  {
    tag: "AI Voice",
    title: "FreightOps Receptionist",
    geo: "United States",
    outcome: "Missed-call rate dropped from 34 % to under 4 % in week one.",
  },
  {
    tag: "Automation",
    title: "Takycorp Email Engine",
    geo: "Canada",
    outcome:
      "2,200 outreach emails / day, fully autonomous — zero manual send.",
  },
  {
    tag: "AEO",
    title: "SkynetJoe Citation Stack",
    geo: "Remote / Global",
    outcome:
      "Site cited by Perplexity & ChatGPT for 6 target queries within 30 days.",
  },
  {
    tag: "Full-Stack",
    title: "Inspire Health PT Funnel",
    geo: "United States",
    outcome:
      "$27 digital product funnel live in 72 h; Stripe confirmed first payment same week.",
  },
];

const STATS = [
  { value: "180+", label: "Builds shipped" },
  { value: "40+", label: "Clients served" },
  { value: "9", label: "Countries worked from" },
  { value: "2019", label: "Operating since" },
];

// Circular rotating text seal
function CircularSeal({ reduced }: { reduced: boolean }) {
  const TEXT = "WASEEM·NASIR·SKYNETLABS·AI·AUTOMATION·";
  const RADIUS = 88;
  const chars = TEXT.split("");
  const angleStep = 360 / chars.length;
  const rotation = useMotionValue(0);

  useAnimationFrame((t) => {
    if (!reduced) {
      rotation.set((t / 60) * 0.4); // slow orbit, ~0.4 deg/frame
    }
  });

  return (
    <motion.div style={{ rotate: rotation }} aria-hidden className="d10-seal">
      <svg viewBox="0 0 220 220" width={220} height={220}>
        {chars.map((ch, i) => {
          const angle = angleStep * i - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 110 + RADIUS * Math.cos(rad);
          const y = 110 + RADIUS * Math.sin(rad);
          const rotation2 = angle + 90;
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${rotation2}, ${x}, ${y})`}
              style={{
                fontSize: 11,
                fontFamily: "IBM Plex Mono, monospace",
                fill: PALETTE.accent2,
                letterSpacing: 1,
                opacity: 0.85,
              }}
            >
              {ch}
            </text>
          );
        })}
        {/* Center dot */}
        <circle cx={110} cy={110} r={5} fill={PALETTE.accent} />
      </svg>
    </motion.div>
  );
}

// Variable font weight + opsz morph on scroll
function MorphHeadline({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawWeight = useTransform(scrollYProgress, [0, 0.5, 1], [300, 900, 300]);
  const rawOpsz = useTransform(scrollYProgress, [0, 0.5, 1], [9, 144, 9]);
  const weight = useSpring(rawWeight, { stiffness: 60, damping: 20 });
  const opsz = useSpring(rawOpsz, { stiffness: 60, damping: 20 });

  const [wVal, setWVal] = useState(300);
  const [oVal, setOVal] = useState(9);

  useEffect(() => {
    if (reduced) return;
    const unW = weight.on("change", (v) => setWVal(Math.round(v)));
    const unO = opsz.on("change", (v) => setOVal(Math.round(v)));
    return () => {
      unW();
      unO();
    };
  }, [weight, opsz, reduced]);

  const fontVariationSettings = reduced
    ? `"wght" 600, "opsz" 72`
    : `"wght" ${wVal}, "opsz" ${oVal}`;

  return (
    <h1
      ref={ref}
      className="d10-morph-headline"
      style={{ fontVariationSettings }}
    >
      Nine years teaching machines to earn their keep.
    </h1>
  );
}

export default function OxbloodCircular() {
  const reduced = useReducedMotion() ?? false;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Portrait parallax
  const rawY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const portraitY = useSpring(rawY, { stiffness: 40, damping: 18 });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600;9..144,900&family=Karla:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap');

        .root-10 {
          font-family: 'Karla', sans-serif;
          background-color: #1C0E0E;
          color: #F2E7D8;
          position: relative;
          z-index: 2;
          min-height: 100vh;
        }

        .root-10 *,
        .root-10 *::before,
        .root-10 *::after {
          box-sizing: border-box;
        }

        /* --- Typography --- */
        .d10-morph-headline {
          font-family: 'Fraunces', serif;
          font-size: clamp(2.6rem, 6vw, 5.5rem);
          line-height: 1.05;
          color: #F2E7D8;
          margin: 0;
          transition: font-variation-settings 0s;
        }

        .d10-display {
          font-family: 'Fraunces', serif;
          font-variation-settings: "wght" 600, "opsz" 72;
          color: #F2E7D8;
        }

        .d10-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #E0A24A;
        }

        .d10-muted {
          color: #9C7A6E;
        }

        /* --- Layout --- */
        .d10-full {
          min-height: 100vh;
          width: 100%;
          background-color: #1C0E0E;
          position: relative;
          overflow: hidden;
        }

        /* --- Hero --- */
        .d10-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          position: relative;
        }

        @media (max-width: 800px) {
          .d10-hero {
            grid-template-columns: 1fr;
          }
          .d10-hero-portrait-col {
            min-height: 60vw;
            order: -1;
          }
        }

        .d10-hero-portrait-col {
          position: relative;
          overflow: hidden;
        }

        .d10-hero-portrait-inner {
          position: absolute;
          inset: 0;
          will-change: transform;
        }

        .d10-hero-portrait-inner img {
          width: 100%;
          height: 115%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        /* Oxblood tonal overlay on portrait */
        .d10-hero-portrait-inner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(28,14,14,0.55) 0%,
            rgba(123,32,24,0.18) 50%,
            rgba(28,14,14,0.7) 100%
          );
        }

        .d10-hero-type-col {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(2.5rem, 6vw, 6rem) clamp(2rem, 5vw, 5rem) clamp(3rem, 7vw, 7rem);
          position: relative;
          z-index: 2;
        }

        .d10-seal-wrapper {
          position: absolute;
          top: clamp(1.5rem, 4vw, 3rem);
          right: clamp(1.5rem, 4vw, 3rem);
          z-index: 10;
        }

        .d10-seal {
          display: block;
        }

        .d10-hero-eyebrow {
          margin-bottom: 1.8rem;
        }

        .d10-hero-subhead {
          font-size: clamp(1rem, 1.8vw, 1.25rem);
          line-height: 1.6;
          color: #9C7A6E;
          margin: 1.6rem 0 2.8rem;
          max-width: 38ch;
          font-family: 'Karla', sans-serif;
        }

        .d10-cta {
          display: inline-block;
          padding: 1rem 2.4rem;
          background: #7B2018;
          color: #F2E7D8;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1.5px solid #7B2018;
          transition: background 0.25s, color 0.25s, border-color 0.25s;
        }

        .d10-cta:hover,
        .d10-cta:focus-visible {
          background: transparent;
          color: #E0A24A;
          border-color: #E0A24A;
          outline: none;
        }

        .d10-cta:focus-visible {
          outline: 2px solid #E0A24A;
          outline-offset: 3px;
        }

        /* Horizontal rule in accent */
        .d10-rule {
          border: none;
          border-top: 1px solid #2A1414;
          margin: 0;
        }

        .d10-rule-accent {
          border-top-color: #7B2018;
          opacity: 0.5;
        }

        /* --- Stats Strip --- */
        .d10-stats {
          background: #2A1414;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(224,162,74,0.15);
        }

        @media (max-width: 700px) {
          .d10-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .d10-stat-cell {
          padding: 2.8rem 2rem;
          border-right: 1px solid rgba(224,162,74,0.1);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .d10-stat-cell:last-child {
          border-right: none;
        }

        .d10-stat-value {
          font-family: 'Fraunces', serif;
          font-variation-settings: "wght" 900, "opsz" 144;
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          color: #E0A24A;
          line-height: 1;
        }

        .d10-stat-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9C7A6E;
        }

        /* --- Section wrapper --- */
        .d10-section {
          padding: clamp(4rem, 8vw, 9rem) clamp(1.5rem, 6vw, 8rem);
        }

        .d10-section-inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        .d10-section-header {
          display: flex;
          align-items: baseline;
          gap: 1.5rem;
          margin-bottom: 3.5rem;
        }

        .d10-section-title {
          font-family: 'Fraunces', serif;
          font-variation-settings: "wght" 600, "opsz" 72;
          font-size: clamp(1.6rem, 3vw, 2.6rem);
          color: #F2E7D8;
          margin: 0;
        }

        /* --- Services grid --- */
        .d10-services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border: 1px solid #2A1414;
        }

        @media (max-width: 700px) {
          .d10-services-grid {
            grid-template-columns: 1fr;
          }
        }

        .d10-service-card {
          padding: 2.5rem 2.2rem;
          border-right: 1px solid #2A1414;
          border-bottom: 1px solid #2A1414;
          position: relative;
          transition: background 0.2s;
        }

        .d10-service-card:hover {
          background: #2A1414;
        }

        .d10-service-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          color: #7B2018;
          letter-spacing: 0.12em;
          margin-bottom: 1rem;
        }

        .d10-service-title {
          font-family: 'Fraunces', serif;
          font-variation-settings: "wght" 600, "opsz" 36;
          font-size: 1.15rem;
          color: #F2E7D8;
          margin: 0 0 0.75rem;
        }

        .d10-service-desc {
          font-size: 0.9rem;
          line-height: 1.65;
          color: #9C7A6E;
        }

        /* Accent bar on hover */
        .d10-service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 0;
          background: #7B2018;
          transition: height 0.3s ease;
        }

        .d10-service-card:hover::before {
          height: 100%;
        }

        /* --- Selected Work --- */
        .d10-work-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .d10-work-item {
          display: grid;
          grid-template-columns: 90px 1fr 1fr;
          align-items: center;
          gap: 2rem;
          padding: 2rem 0;
          border-bottom: 1px solid #2A1414;
          transition: background 0.2s;
        }

        @media (max-width: 700px) {
          .d10-work-item {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
        }

        .d10-work-item:first-child {
          border-top: 1px solid #2A1414;
        }

        .d10-work-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #7B2018;
          background: rgba(123,32,24,0.12);
          padding: 0.3rem 0.6rem;
          display: inline-block;
        }

        .d10-work-title {
          font-family: 'Fraunces', serif;
          font-variation-settings: "wght" 600, "opsz" 36;
          font-size: 1.1rem;
          color: #F2E7D8;
          margin: 0 0 0.3rem;
        }

        .d10-work-geo {
          font-size: 0.78rem;
          color: #9C7A6E;
          font-family: 'IBM Plex Mono', monospace;
        }

        .d10-work-outcome {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #9C7A6E;
        }

        /* --- About two-col --- */
        .d10-about {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        @media (max-width: 900px) {
          .d10-about {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        .d10-about-img-wrap {
          position: relative;
          aspect-ratio: 4/5;
          overflow: hidden;
        }

        .d10-about-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        /* Corner oxblood accent */
        .d10-about-img-wrap::before {
          content: '';
          position: absolute;
          bottom: -1px;
          left: -1px;
          width: 60px;
          height: 60px;
          border-left: 3px solid #7B2018;
          border-bottom: 3px solid #7B2018;
          z-index: 2;
        }

        .d10-about-img-wrap::after {
          content: '';
          position: absolute;
          top: -1px;
          right: -1px;
          width: 60px;
          height: 60px;
          border-right: 3px solid #E0A24A;
          border-top: 3px solid #E0A24A;
          z-index: 2;
        }

        .d10-about-copy h2 {
          font-family: 'Fraunces', serif;
          font-variation-settings: "wght" 600, "opsz" 72;
          font-size: clamp(1.8rem, 3.5vw, 3rem);
          color: #F2E7D8;
          line-height: 1.15;
          margin: 0 0 1.5rem;
        }

        .d10-about-copy p {
          font-size: 0.95rem;
          line-height: 1.75;
          color: #9C7A6E;
          margin: 0 0 1.2rem;
        }

        .d10-about-copy p:last-of-type {
          margin-bottom: 2.2rem;
        }

        .d10-geo-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2.4rem;
        }

        .d10-geo-pill {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          padding: 0.25rem 0.7rem;
          border: 1px solid #2A1414;
          color: #9C7A6E;
        }

        /* --- Photo strip --- */
        .d10-photo-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        @media (max-width: 700px) {
          .d10-photo-strip {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .d10-strip-img {
          aspect-ratio: 3/4;
          overflow: hidden;
        }

        .d10-strip-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          transition: transform 0.5s ease;
        }

        .d10-strip-img:hover img {
          transform: scale(1.04);
        }

        /* --- CTA Banner --- */
        .d10-cta-banner {
          background: #2A1414;
          border-top: 1px solid rgba(224,162,74,0.15);
          border-bottom: 1px solid rgba(224,162,74,0.15);
          padding: clamp(4rem, 8vw, 8rem) clamp(1.5rem, 6vw, 8rem);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .d10-cta-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(123,32,24,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .d10-cta-banner h2 {
          font-family: 'Fraunces', serif;
          font-variation-settings: "wght" 300, "opsz" 144;
          font-size: clamp(2rem, 5vw, 4.5rem);
          color: #F2E7D8;
          line-height: 1.1;
          margin: 0 0 1rem;
          max-width: 18ch;
          margin-left: auto;
          margin-right: auto;
        }

        .d10-cta-banner p {
          font-size: 1rem;
          color: #9C7A6E;
          margin: 0 0 2.8rem;
        }

        /* --- Footer --- */
        .d10-footer {
          background: #1C0E0E;
          padding: 2.5rem clamp(1.5rem, 6vw, 8rem);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          border-top: 1px solid #2A1414;
        }

        .d10-footer-brand {
          font-family: 'Fraunces', serif;
          font-variation-settings: "wght" 600, "opsz" 36;
          font-size: 1rem;
          color: #F2E7D8;
        }

        .d10-footer-links {
          display: flex;
          gap: 2rem;
        }

        .d10-footer-links a {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9C7A6E;
          text-decoration: none;
          transition: color 0.2s;
        }

        .d10-footer-links a:hover,
        .d10-footer-links a:focus-visible {
          color: #E0A24A;
          outline: none;
        }

        .d10-footer-links a:focus-visible {
          outline: 2px solid #E0A24A;
          outline-offset: 2px;
        }

        .d10-footer-copy {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          color: #9C7A6E;
          opacity: 0.6;
        }

        /* Skip link */
        .d10-skip {
          position: absolute;
          left: -9999px;
          top: 0;
          z-index: 999;
          padding: 0.5rem 1rem;
          background: #7B2018;
          color: #F2E7D8;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          text-decoration: none;
        }

        .d10-skip:focus {
          left: 1rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .d10-strip-img img,
          .d10-service-card::before {
            transition: none;
          }
        }
      `}</style>

      <div className="root-10" ref={containerRef}>
        <a href="#d10-main" className="d10-skip">
          Skip to content
        </a>

        {/* ─── HERO ──────────────────────────────────────────── */}
        <header>
          <div className="d10-hero">
            {/* Left: Portrait with parallax */}
            <div className="d10-hero-portrait-col" aria-hidden="true">
              <motion.div
                className="d10-hero-portrait-inner"
                style={reduced ? {} : { y: portraitY }}
              >
                <img
                  src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                  alt="Waseem Nasir — founder, SkynetLabs"
                />
              </motion.div>
            </div>

            {/* Right: Type stack */}
            <div className="d10-hero-type-col">
              {/* Circular seal — top right of type col */}
              <div className="d10-seal-wrapper">
                <CircularSeal reduced={reduced} />
              </div>

              <div className="d10-hero-eyebrow">
                <span className="d10-label">
                  Waseem Nasir · SkynetLabs · Est. 2019
                </span>
              </div>

              <MorphHeadline reduced={reduced} />

              <p className="d10-hero-subhead">
                180+ builds. 40+ clients. 9 countries. The kind of software that
                earns its keep quietly — leads captured, ops automated, nothing
                leaking.
              </p>

              <a href={BOOKING} className="d10-cta" rel="noopener noreferrer">
                Book a 30-minute call
              </a>
            </div>
          </div>
        </header>

        {/* ─── STATS STRIP ──────────────────────────────────── */}
        <div className="d10-stats" role="list" aria-label="Track record">
          {STATS.map((s) => (
            <motion.div
              key={s.value}
              className="d10-stat-cell"
              role="listitem"
              initial={reduced ? {} : { opacity: 0, y: 24 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <div className="d10-stat-value">{s.value}</div>
              <div className="d10-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ─── MAIN CONTENT ─────────────────────────────────── */}
        <main id="d10-main">
          {/* ─── SERVICES ───────────────────────────────────── */}
          <section className="d10-section" aria-labelledby="d10-services-title">
            <div className="d10-section-inner">
              <div className="d10-section-header">
                <span className="d10-label">What I build</span>
                <h2 id="d10-services-title" className="d10-section-title">
                  Five levers, one system.
                </h2>
              </div>
              <div className="d10-services-grid">
                {SERVICES.map((svc, i) => (
                  <motion.div
                    key={svc.num}
                    className="d10-service-card"
                    initial={reduced ? {} : { opacity: 0, y: 30 }}
                    whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.07,
                      ease: "easeOut",
                    }}
                  >
                    <div className="d10-service-num">{svc.num}</div>
                    <h3 className="d10-service-title">{svc.title}</h3>
                    <p className="d10-service-desc">{svc.desc}</p>
                  </motion.div>
                ))}
                {/* 5 cards in 2-col grid — last row has one card; add a fill cell */}
                <div
                  className="d10-service-card"
                  aria-hidden
                  style={{ background: "#1C0E0E", borderRight: "none" }}
                >
                  <p
                    className="d10-label"
                    style={{ opacity: 0.35, marginTop: "auto" }}
                  >
                    Every system built to earn its keep.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── SELECTED WORK ──────────────────────────────── */}
          <section
            className="d10-section"
            style={{ paddingTop: 0, background: "#1C0E0E" }}
            aria-labelledby="d10-work-title"
          >
            <div className="d10-section-inner">
              <div className="d10-section-header">
                <span className="d10-label">Selected work</span>
                <h2 id="d10-work-title" className="d10-section-title">
                  Results, not renders.
                </h2>
              </div>
              <div className="d10-work-list" role="list">
                {SELECTED_WORK.map((w, i) => (
                  <motion.div
                    key={w.title}
                    className="d10-work-item"
                    role="listitem"
                    initial={reduced ? {} : { opacity: 0, x: -20 }}
                    whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{
                      duration: 0.45,
                      delay: i * 0.08,
                      ease: "easeOut",
                    }}
                  >
                    <span className="d10-work-tag">{w.tag}</span>
                    <div>
                      <div className="d10-work-title">{w.title}</div>
                      <div className="d10-work-geo">{w.geo}</div>
                    </div>
                    <p className="d10-work-outcome">{w.outcome}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── PHOTO STRIP ────────────────────────────────── */}
          <section
            className="d10-section"
            style={{ paddingTop: 0, paddingBottom: 0 }}
            aria-label="Work in the field"
          >
            <div className="d10-photo-strip">
              {[
                {
                  src: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
                  alt: "Waseem working from Bali terrace cafe",
                },
                {
                  src: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
                  alt: "Dual laptop setup with analytics dashboard",
                },
                {
                  src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                  alt: "Waseem at hilltop city vista with backpack",
                },
                {
                  src: "CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg",
                  alt: "Night beach cafe session, phone and laptop",
                },
              ].map((img) => (
                <div key={img.src} className="d10-strip-img">
                  <img src={`/img/pro/${img.src}`} alt={img.alt} />
                </div>
              ))}
            </div>
          </section>

          {/* ─── ABOUT ──────────────────────────────────────── */}
          <section className="d10-section" aria-labelledby="d10-about-title">
            <div className="d10-section-inner">
              <div className="d10-about">
                {/* Photos collage */}
                <motion.div
                  initial={reduced ? {} : { opacity: 0, x: -30 }}
                  whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="d10-about-img-wrap">
                    <img
                      src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
                      alt="Waseem Nasir — arms crossed, confident, at work"
                    />
                  </div>
                </motion.div>

                {/* Copy */}
                <motion.div
                  className="d10-about-copy"
                  initial={reduced ? {} : { opacity: 0, x: 30 }}
                  whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <span
                    className="d10-label"
                    style={{ display: "block", marginBottom: "1.2rem" }}
                  >
                    The founder
                  </span>
                  <h2 id="d10-about-title">
                    Craft built over time, not shipped overnight.
                  </h2>
                  <p>
                    I'm Waseem Nasir, independent founder of SkynetLabs. Since
                    2019 I've been building the kind of AI and automation
                    systems that make businesses quieter — fewer missed leads,
                    fewer manual handoffs, fewer things that need a human in the
                    loop.
                  </p>
                  <p>
                    My background is generalist by design: n8n pipelines,
                    Next.js products, WhatsApp and voice bots, AEO architecture.
                    I move fast because I've built the same problems enough
                    times to know where the edge cases hide.
                  </p>
                  <p>
                    I work remotely — mostly Bali and Lahore — with clients
                    across four continents. The timezone rarely matters when the
                    system runs itself.
                  </p>

                  <div
                    className="d10-geo-list"
                    aria-label="Countries worked from"
                  >
                    {[
                      "Bali",
                      "Lahore",
                      "Singapore",
                      "USA",
                      "Canada",
                      "UK",
                      "Australia",
                      "UAE",
                      "Germany",
                    ].map((g) => (
                      <span key={g} className="d10-geo-pill">
                        {g}
                      </span>
                    ))}
                  </div>

                  <a
                    href={GITHUB}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d10-cta"
                    style={{ fontSize: "0.72rem" }}
                  >
                    View GitHub →
                  </a>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ─── SECONDARY PHOTO GRID ───────────────────────── */}
          <section
            className="d10-section"
            style={{ paddingTop: 0 }}
            aria-label="More from the field"
          >
            <div className="d10-section-inner">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  gap: 6,
                }}
              >
                <div className="d10-strip-img" style={{ aspectRatio: "16/10" }}>
                  <img
                    src="/img/pro/WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg"
                    alt="Night coworking team session with laptops"
                    style={{
                      aspectRatio: "16/10",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
                <div className="d10-strip-img">
                  <img
                    src="/img/pro/PORTRAIT-2026-02-15-balcony-gray-adidas-soft-smile.jpg"
                    alt="Waseem on balcony, gray Adidas, soft smile"
                  />
                </div>
                <div className="d10-strip-img">
                  <img
                    src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                    alt="Waseem at Nusa Penida cliffs, arms spread"
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 2fr",
                  gap: 6,
                  marginTop: 6,
                }}
              >
                <div className="d10-strip-img">
                  <img
                    src="/img/pro/LIFESTYLE-2026-05-18-black-bandhgala-sunglasses-phone-cafe-table.jpg"
                    alt="Waseem in black bandhgala at cafe table, phone in hand"
                  />
                </div>
                <div className="d10-strip-img">
                  <img
                    src="/img/pro/CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg"
                    alt="Waseem smiling at garden cafe with laptop"
                  />
                </div>
                <div className="d10-strip-img" style={{ aspectRatio: "16/10" }}>
                  <img
                    src="/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg"
                    alt="Rooftop cafe session with laptop and mountain clouds"
                    style={{
                      aspectRatio: "16/10",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ─── CTA BANNER ─────────────────────────────────── */}
          <div className="d10-cta-banner">
            <span
              className="d10-label"
              style={{ display: "block", marginBottom: "1.5rem" }}
            >
              Ready when you are
            </span>
            <h2>Thirty minutes to find out what's leaking.</h2>
            <p>
              No pitch deck. No deck. Just a direct conversation about your ops.
            </p>
            <a
              href={BOOKING}
              className="d10-cta"
              style={{ fontSize: "0.82rem", padding: "1.1rem 3rem" }}
              rel="noopener noreferrer"
            >
              Book the call — it's free
            </a>
          </div>
        </main>

        {/* ─── FOOTER ─────────────────────────────────────── */}
        <footer>
          <div className="d10-footer">
            <div className="d10-footer-brand">Waseem Nasir</div>
            <nav className="d10-footer-links" aria-label="Footer navigation">
              <a href={BOOKING} rel="noopener noreferrer">
                Book a call
              </a>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a
                href="https://skynetjoe.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                SkynetLabs
              </a>
            </nav>
            <div className="d10-footer-copy">
              © {new Date().getFullYear()} SkynetLabs · Bali / Lahore ·
              Remote-first since 2019
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
