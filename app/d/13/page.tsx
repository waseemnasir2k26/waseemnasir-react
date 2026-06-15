"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";

/* ─── Palette ───────────────────────────────────────────────── */
const C = {
  bg: "#FAF7F2",
  surface: "#EFEAE2",
  text: "#111111",
  muted: "#7E7A72",
  accent: "#0033FF",
  accent2: "#FF4D00",
} as const;

/* ─── Images (real filenames only) ──────────────────────────── */
const IMGS = {
  hero: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
  work1:
    "/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  work2:
    "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  work3: "/img/pro/WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
  work4:
    "/img/pro/CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  travel1: "/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  travel2:
    "/img/pro/TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
  portrait1: "/img/pro/PORTRAIT-2026-02-15-balcony-gray-adidas-soft-smile.jpg",
  portrait2: "/img/pro/PORTRAIT-2025-05-08-cafe-table-arms-crossed-pensive.jpg",
  lifestyle1:
    "/img/pro/LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
  cafe1:
    "/img/pro/CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
  event1: "/img/pro/EVENT-expo-booth-navy-polo-chandelier-hall.jpg",
};

/* ─── ClipReveal: line-by-line clip-path reveal ─────────────── */
function ClipReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className={`d13-clip-wrap ${className}`}
      style={{ overflow: "hidden" }}
    >
      <motion.div
        initial={reduced ? false : { clipPath: "inset(0 0 100% 0)", y: 24 }}
        animate={
          isInView
            ? { clipPath: "inset(0 0 0% 0)", y: 0 }
            : { clipPath: "inset(0 0 100% 0)", y: 24 }
        }
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── LiquidWord: weight-bleed on accent words ──────────────── */
function LiquidWord({
  word,
  delay = 0,
  color = C.accent,
}: {
  word: string;
  delay?: number;
  color?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" });
  const reduced = useReducedMotion();

  return (
    <motion.span
      ref={ref}
      style={{
        color,
        display: "inline-block",
        fontVariationSettings: "'wght' 400",
      }}
      animate={
        isInView && !reduced
          ? {
              fontVariationSettings: ["'wght' 100", "'wght' 700", "'wght' 600"],
            }
          : {}
      }
      transition={{ duration: 1.4, delay, ease: "easeOut" }}
    >
      {word}
    </motion.span>
  );
}

/* ─── MaskReveal: expanding mask for images ─────────────────── */
function MaskReveal({
  src,
  alt,
  className = "",
  delay = 0,
  style = {},
}: {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className={className}
      style={{ overflow: "hidden", ...style }}
    >
      <motion.div
        initial={reduced ? false : { clipPath: "inset(100% 0 0 0)" }}
        animate={
          isInView
            ? { clipPath: "inset(0% 0 0 0)" }
            : { clipPath: "inset(100% 0 0 0)" }
        }
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", height: "100%" }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ─── CountUp ────────────────────────────────────────────────── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!isInView || reduced) {
      setCount(target);
      return;
    }
    let start = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 28);
    return () => clearInterval(timer);
  }, [isInView, target, reduced]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ─── Services data ──────────────────────────────────────────── */
const SERVICES = [
  {
    num: "01",
    title: "AI Automation Systems",
    body: "n8n workflows that route leads, send follow-ups, and handle ops — without a human in the loop.",
  },
  {
    num: "02",
    title: "Voice + WhatsApp Bots",
    body: "Receptionist-grade bots that qualify, respond, and book — across voice, SMS, and WhatsApp.",
  },
  {
    num: "03",
    title: "AEO Infrastructure",
    body: "Answer Engine Optimization: structured data, schema, and content architecture so AI answers cite you first.",
  },
  {
    num: "04",
    title: "Next.js Builds",
    body: "Fast, indexed, conversion-tuned sites and apps. No bloat. Built to perform on search and in load time.",
  },
];

/* ─── Selected work ──────────────────────────────────────────── */
const WORK = [
  {
    client: "FreightOps",
    location: "United States",
    outcome: "AI voice + WhatsApp receptionist. Zero missed dispatch calls.",
    img: IMGS.work1,
  },
  {
    client: "Inspire Health PT",
    location: "Canada",
    outcome: "$27 digital funnel + booking automation. Live in 72 hours.",
    img: IMGS.work3,
  },
  {
    client: "IdeaViaggi",
    location: "Italy",
    outcome: "Per-customer trip access system. WP + REST + CTM integration.",
    img: IMGS.work4,
  },
  {
    client: "TakyCorp",
    location: "France",
    outcome: "Autonomous email automation. OpenAI + Gmail. 1,000+ sequences.",
    img: IMGS.work2,
  },
];

/* ─── Main component ─────────────────────────────────────────── */
export default function D13InkBleed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroImgScale = useTransform(scrollYProgress, [0, 0.3], [1.05, 1.0]);
  const reduced = useReducedMotion();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Newsreader:opsz,wght@6..72,400&family=Space+Mono:wght@400&display=swap');

        .d13-root {
          background: ${C.bg};
          color: ${C.text};
          font-family: 'Newsreader', Georgia, serif;
          -webkit-font-smoothing: antialiased;
        }

        .d13-root h1,
        .d13-root h2,
        .d13-root h3,
        .d13-root .d13-display {
          font-family: 'Fraunces', Georgia, serif;
        }

        .d13-root .d13-mono {
          font-family: 'Space Mono', 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .d13-root a:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 3px;
        }

        .d13-rule {
          border: none;
          border-top: 1px solid ${C.text};
          margin: 0;
          opacity: 0.15;
        }

        .d13-rule-accent {
          border: none;
          border-top: 2px solid ${C.accent};
          margin: 0;
          width: 48px;
        }

        /* Nav */
        .d13-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 20px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          mix-blend-mode: multiply;
        }

        .d13-nav-logo {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 14px;
          font-weight: 600;
          color: ${C.text};
          text-decoration: none;
          letter-spacing: -0.01em;
        }

        .d13-nav-cta {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${C.accent};
          text-decoration: none;
          border-bottom: 1px solid ${C.accent};
          padding-bottom: 2px;
          transition: opacity 0.2s;
        }
        .d13-nav-cta:hover { opacity: 0.65; }

        /* Hero */
        .d13-hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          overflow: hidden;
        }

        .d13-hero-left {
          padding: 160px 48px 80px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          position: relative;
          z-index: 2;
        }

        .d13-hero-right {
          position: relative;
          overflow: hidden;
        }

        .d13-hero-tag {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${C.accent};
          margin-bottom: 40px;
          display: block;
        }

        .d13-h1 {
          font-size: clamp(42px, 5.5vw, 88px);
          font-weight: 600;
          line-height: 1.03;
          letter-spacing: -0.025em;
          margin: 0 0 40px;
          color: ${C.text};
        }

        .d13-subhead {
          font-family: 'Newsreader', Georgia, serif;
          font-size: clamp(15px, 1.4vw, 18px);
          line-height: 1.65;
          color: ${C.muted};
          max-width: 380px;
          margin-bottom: 56px;
        }

        .d13-cta-primary {
          display: inline-block;
          background: ${C.accent};
          color: #ffffff;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 16px 32px;
          transition: background 0.25s;
        }
        .d13-cta-primary:hover { background: #0022cc; }

        /* Stats bar */
        .d13-stats {
          background: ${C.text};
          color: ${C.bg};
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid ${C.text};
        }

        .d13-stat-cell {
          padding: 48px 40px;
          border-right: 1px solid rgba(250,247,242,0.1);
        }
        .d13-stat-cell:last-child { border-right: none; }

        .d13-stat-num {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(36px, 4vw, 64px);
          font-weight: 600;
          line-height: 1;
          color: ${C.bg};
          display: block;
          margin-bottom: 8px;
        }
        .d13-stat-num span[style*="color"] {
          color: ${C.accent} !important;
        }

        .d13-stat-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(250,247,242,0.45);
        }

        /* Services */
        .d13-services {
          padding: 120px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .d13-section-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${C.muted};
          margin-bottom: 64px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .d13-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: ${C.muted};
          opacity: 0.3;
        }

        .d13-services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        .d13-service-item {
          padding: 48px 0;
          border-top: 1px solid rgba(17,17,17,0.12);
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 32px;
          align-items: start;
        }

        .d13-service-num {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: ${C.accent};
          letter-spacing: 0.05em;
        }

        .d13-service-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(18px, 1.8vw, 24px);
          font-weight: 600;
          line-height: 1.2;
          margin: 0 0 12px;
          color: ${C.text};
        }

        .d13-service-body {
          font-size: 15px;
          line-height: 1.65;
          color: ${C.muted};
          margin: 0;
        }

        /* Work grid */
        .d13-work {
          padding: 0 0 120px;
        }

        .d13-work-header {
          padding: 80px 48px 64px;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          border-top: 1px solid rgba(17,17,17,0.12);
        }

        .d13-work-h2 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(28px, 3.5vw, 52px);
          font-weight: 600;
          letter-spacing: -0.02em;
          margin: 0;
          color: ${C.text};
        }

        .d13-work-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          background: ${C.surface};
        }

        .d13-work-card {
          background: ${C.bg};
          position: relative;
          overflow: hidden;
        }

        .d13-work-img-wrap {
          height: 320px;
          overflow: hidden;
        }

        .d13-work-meta {
          padding: 32px 36px 36px;
        }

        .d13-work-client {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 22px;
          font-weight: 600;
          margin: 0 0 4px;
          color: ${C.text};
        }

        .d13-work-location {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${C.accent};
          margin-bottom: 16px;
          display: block;
        }

        .d13-work-outcome {
          font-size: 14px;
          line-height: 1.6;
          color: ${C.muted};
          margin: 0;
        }

        /* About */
        .d13-about {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 640px;
          border-top: 1px solid rgba(17,17,17,0.12);
        }

        .d13-about-img {
          position: relative;
          overflow: hidden;
          height: 640px;
        }

        .d13-about-copy {
          padding: 80px 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: ${C.bg};
        }

        .d13-about-h2 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(28px, 3vw, 44px);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin: 0 0 28px;
          color: ${C.text};
        }

        .d13-about-body {
          font-size: 16px;
          line-height: 1.75;
          color: ${C.muted};
          margin: 0 0 20px;
        }

        .d13-about-body:last-of-type {
          margin-bottom: 40px;
        }

        /* Manifesto strip */
        .d13-manifesto {
          background: ${C.accent};
          padding: 80px 48px;
          overflow: hidden;
        }

        .d13-manifesto-line {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(24px, 3.5vw, 56px);
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: #ffffff;
          margin: 0 0 12px;
        }

        .d13-manifesto-line.strike {
          color: rgba(255,255,255,0.3);
          text-decoration: line-through;
          font-weight: 400;
        }

        /* Images strip */
        .d13-img-strip {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          height: 480px;
          gap: 2px;
          background: ${C.surface};
        }

        /* CTA */
        .d13-cta-section {
          padding: 160px 48px;
          text-align: left;
          max-width: 900px;
          border-top: 1px solid rgba(17,17,17,0.12);
        }

        .d13-cta-pre {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${C.accent};
          margin-bottom: 32px;
          display: block;
        }

        .d13-cta-h2 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(36px, 5vw, 80px);
          font-weight: 600;
          letter-spacing: -0.03em;
          line-height: 1.0;
          margin: 0 0 48px;
          color: ${C.text};
        }

        .d13-cta-link {
          display: inline-block;
          background: ${C.accent};
          color: #ffffff;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 20px 48px;
          transition: background 0.25s;
        }
        .d13-cta-link:hover { background: #0022cc; }

        /* Footer */
        .d13-footer {
          background: ${C.text};
          color: ${C.bg};
          padding: 64px 48px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .d13-footer-logo {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 18px;
          font-weight: 600;
          color: ${C.bg};
        }

        .d13-footer-links {
          display: flex;
          gap: 32px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .d13-footer-links a {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(250,247,242,0.4);
          text-decoration: none;
          transition: color 0.2s;
        }
        .d13-footer-links a:hover { color: ${C.bg}; }

        .d13-footer-copy {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: rgba(250,247,242,0.3);
          letter-spacing: 0.05em;
        }

        /* Vertical label */
        .d13-vert-label {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${C.muted};
          opacity: 0.5;
          transform: rotate(180deg);
        }

        /* Accent marker */
        .d13-accent-marker {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: ${C.accent};
          border-radius: 50%;
          margin-right: 10px;
          flex-shrink: 0;
        }

        /* Pull quote */
        .d13-pull-quote {
          padding: 80px 48px;
          border-top: 1px solid rgba(17,17,17,0.12);
          border-bottom: 1px solid rgba(17,17,17,0.12);
          max-width: 1200px;
          margin: 0 auto;
        }

        .d13-pull-quote blockquote {
          margin: 0;
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(22px, 3vw, 42px);
          font-weight: 400;
          line-height: 1.35;
          letter-spacing: -0.015em;
          color: ${C.text};
        }

        .d13-pull-quote cite {
          display: block;
          margin-top: 24px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${C.muted};
          font-style: normal;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .d13-hero { grid-template-columns: 1fr; }
          .d13-hero-right { height: 50vh; }
          .d13-hero-left { padding: 120px 24px 64px; }
          .d13-stats { grid-template-columns: 1fr 1fr; }
          .d13-stat-cell { padding: 32px 24px; }
          .d13-services { padding: 80px 24px; }
          .d13-services-grid { grid-template-columns: 1fr; }
          .d13-service-item { grid-template-columns: 56px 1fr; gap: 16px; }
          .d13-work-header { padding: 64px 24px 40px; flex-direction: column; gap: 16px; }
          .d13-work-grid { grid-template-columns: 1fr; }
          .d13-work-img-wrap { height: 260px; }
          .d13-about { grid-template-columns: 1fr; }
          .d13-about-img { height: 380px; }
          .d13-about-copy { padding: 48px 24px; }
          .d13-manifesto { padding: 64px 24px; }
          .d13-img-strip { grid-template-columns: 1fr; height: auto; }
          .d13-img-strip > div { height: 260px; }
          .d13-cta-section { padding: 100px 24px; }
          .d13-footer { flex-direction: column; gap: 32px; align-items: flex-start; padding: 48px 24px; }
          .d13-nav { padding: 20px 24px; }
          .d13-pull-quote { padding: 60px 24px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .d13-root * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div
        className="d13-root"
        ref={containerRef}
        style={{
          minHeight: "100vh",
          position: "relative",
          zIndex: 2,
          background: C.bg,
        }}
      >
        {/* Skip link */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            left: -9999,
            top: 16,
            zIndex: 999,
            background: C.accent,
            color: "#fff",
            padding: "8px 16px",
            fontFamily: "Space Mono, monospace",
            fontSize: 11,
          }}
          onFocus={(e) => {
            (e.target as HTMLAnchorElement).style.left = "16px";
          }}
          onBlur={(e) => {
            (e.target as HTMLAnchorElement).style.left = "-9999px";
          }}
        >
          Skip to content
        </a>

        {/* Nav */}
        <nav className="d13-nav" aria-label="Main navigation">
          <a href="/" className="d13-nav-logo">
            Waseem Nasir
          </a>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="d13-nav-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a call
          </a>
        </nav>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <main id="main-content">
          <section className="d13-hero" aria-label="Hero">
            {/* Left: type */}
            <div className="d13-hero-left">
              <ClipReveal delay={0.1}>
                <span className="d13-hero-tag">
                  Waseem Nasir &mdash; SkynetLabs &mdash; Est. 2019
                </span>
              </ClipReveal>

              <h1 className="d13-h1">
                <ClipReveal delay={0.2}>The quiet</ClipReveal>
                <ClipReveal delay={0.35}>machinery behind</ClipReveal>
                <ClipReveal delay={0.5}>
                  a <LiquidWord word="louder" delay={0.7} color={C.accent} />{" "}
                  business.
                </ClipReveal>
              </h1>

              <ClipReveal delay={0.65}>
                <p className="d13-subhead">
                  AI and automation systems that vanish into the background —
                  handling leads, follow-ups, and manual ops so the business
                  runs without you running it.
                </p>
              </ClipReveal>

              <ClipReveal delay={0.75}>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="d13-cta-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book 30 minutes &rarr;
                </a>
              </ClipReveal>
            </div>

            {/* Right: portrait */}
            <div className="d13-hero-right" aria-hidden="true">
              <motion.div
                style={{
                  scale: reduced ? 1 : heroImgScale,
                  width: "100%",
                  height: "100%",
                }}
              >
                <img
                  src={IMGS.hero}
                  alt="Waseem Nasir — black prince coat, balcony, sunglasses"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                  }}
                />
              </motion.div>

              {/* Klein-blue accent bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: C.accent,
                }}
              />

              {/* Vertical label */}
              <div
                style={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <span className="d13-vert-label">
                  Independent founder &mdash; Remote &mdash; Global
                </span>
              </div>
            </div>
          </section>

          {/* ─── STATS BAR ────────────────────────────────────── */}
          <section className="d13-stats" aria-label="Track record">
            {[
              { num: 180, suffix: "+", label: "Builds shipped" },
              { num: 40, suffix: "+", label: "Clients served" },
              { num: 9, suffix: "", label: "Countries worked from" },
              { num: 2019, suffix: "", label: "Operating since" },
            ].map((s) => (
              <div className="d13-stat-cell" key={s.label}>
                <ClipReveal delay={0.1}>
                  <span className="d13-stat-num" style={{ color: C.bg }}>
                    <CountUp target={s.num} suffix={s.suffix} />
                  </span>
                  <span className="d13-stat-label">{s.label}</span>
                </ClipReveal>
              </div>
            ))}
          </section>

          {/* ─── PULL QUOTE ───────────────────────────────────── */}
          <div className="d13-pull-quote">
            <ClipReveal delay={0}>
              <blockquote>
                "Most businesses don&rsquo;t have a productivity problem.{" "}
                <span style={{ color: C.accent }}>
                  They have a systems problem.
                </span>{" "}
                The work that should be automatic isn&rsquo;t."
              </blockquote>
              <cite>&mdash; Waseem Nasir, SkynetLabs</cite>
            </ClipReveal>
          </div>

          {/* ─── SERVICES ─────────────────────────────────────── */}
          <section className="d13-services" aria-label="Services">
            <div className="d13-section-label">What I build</div>

            <div className="d13-services-grid">
              {SERVICES.map((svc, i) => (
                <div
                  key={svc.num}
                  className="d13-service-item"
                  style={i % 2 === 1 ? { paddingLeft: 40 } : {}}
                >
                  <ClipReveal delay={0.1}>
                    <span className="d13-service-num">{svc.num}</span>
                  </ClipReveal>
                  <div>
                    <ClipReveal delay={0.15}>
                      <h3 className="d13-service-title">{svc.title}</h3>
                    </ClipReveal>
                    <ClipReveal delay={0.2}>
                      <p className="d13-service-body">{svc.body}</p>
                    </ClipReveal>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── IMAGE STRIP ──────────────────────────────────── */}
          <div className="d13-img-strip" aria-hidden="true">
            <MaskReveal
              src={IMGS.travel1}
              alt="Waseem at Nusa Penida cliffs, Bali"
              delay={0}
              style={{ height: "100%" }}
            />
            <MaskReveal
              src={IMGS.lifestyle1}
              alt="Waseem at neon limit sign"
              delay={0.15}
              style={{ height: "100%" }}
            />
            <MaskReveal
              src={IMGS.travel2}
              alt="Waseem on hilltop city vista"
              delay={0.3}
              style={{ height: "100%" }}
            />
          </div>

          {/* ─── WORK ─────────────────────────────────────────── */}
          <section className="d13-work" aria-label="Selected work">
            <div className="d13-work-header">
              <ClipReveal>
                <h2 className="d13-work-h2">Selected work</h2>
              </ClipReveal>
              <span className="d13-mono" style={{ color: C.muted }}>
                40+ clients &mdash; 9 countries
              </span>
            </div>

            <div className="d13-work-grid">
              {WORK.map((item, i) => (
                <div key={item.client} className="d13-work-card">
                  <MaskReveal
                    src={item.img}
                    alt={`Project for ${item.client}`}
                    delay={i * 0.1}
                    className="d13-work-img-wrap"
                  />
                  <div className="d13-work-meta">
                    <ClipReveal delay={0.1}>
                      <h3 className="d13-work-client">{item.client}</h3>
                      <span className="d13-work-location">{item.location}</span>
                      <p className="d13-work-outcome">{item.outcome}</p>
                    </ClipReveal>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── MANIFESTO ────────────────────────────────────── */}
          <section className="d13-manifesto" aria-label="Manifesto">
            <ClipReveal delay={0}>
              <p className="d13-manifesto-line strike">
                Hire a VA. Hope they follow up.
              </p>
            </ClipReveal>
            <ClipReveal delay={0.12}>
              <p className="d13-manifesto-line strike">
                Build a Zap. Watch it break.
              </p>
            </ClipReveal>
            <ClipReveal delay={0.24}>
              <p className="d13-manifesto-line strike">
                Ask the dev. Wait six weeks.
              </p>
            </ClipReveal>
            <ClipReveal delay={0.4}>
              <p
                className="d13-manifesto-line"
                style={{ marginTop: 32, color: "#ffffff" }}
              >
                Or: one system. Runs itself.
              </p>
            </ClipReveal>
          </section>

          {/* ─── ABOUT ────────────────────────────────────────── */}
          <section className="d13-about" aria-label="About Waseem Nasir">
            <MaskReveal
              src={IMGS.portrait1}
              alt="Waseem Nasir — balcony portrait, gray Adidas, soft smile"
              className="d13-about-img"
            />
            <div className="d13-about-copy">
              <div className="d13-section-label" style={{ marginBottom: 40 }}>
                About
              </div>

              <ClipReveal delay={0.1}>
                <h2 className="d13-about-h2">
                  Seven years of quiet{" "}
                  <LiquidWord word="precision." delay={0.4} color={C.accent} />
                </h2>
              </ClipReveal>

              <ClipReveal delay={0.2}>
                <p className="d13-about-body">
                  I&rsquo;m Waseem Nasir, founder of SkynetLabs. Since 2019
                  I&rsquo;ve built AI and automation systems for over 40 clients
                  across 9 countries — from solo founders to multi-location
                  clinics and freight operators.
                </p>
              </ClipReveal>

              <ClipReveal delay={0.3}>
                <p className="d13-about-body">
                  I work with n8n, Next.js, OpenAI, and voice infrastructure to
                  build systems that handle the parts of your business that
                  currently require a human to remember, follow up, or repeat
                  themselves. They shouldn&rsquo;t.
                </p>
              </ClipReveal>

              <ClipReveal delay={0.4}>
                <p className="d13-about-body" style={{ marginBottom: 40 }}>
                  Currently operating remote from Bali and Lahore. 180+ builds
                  shipped. Still counting.
                </p>
              </ClipReveal>

              <ClipReveal delay={0.5}>
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    className="d13-cta-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book a call &rarr;
                  </a>
                  <a
                    href="https://github.com/waseemnasir2k26"
                    style={{
                      fontFamily: "Space Mono, monospace",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: C.muted,
                      textDecoration: "none",
                      borderBottom: `1px solid ${C.muted}`,
                      paddingBottom: 2,
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </ClipReveal>
            </div>
          </section>

          {/* ─── SECONDARY IMAGE PROOF ────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              height: 300,
              gap: 2,
              background: C.surface,
            }}
            aria-hidden="true"
          >
            {[IMGS.event1, IMGS.cafe1, IMGS.portrait2, IMGS.work4].map(
              (src, i) => (
                <MaskReveal
                  key={src}
                  src={src}
                  alt={`Work in progress — image ${i + 1}`}
                  delay={i * 0.1}
                  style={{ height: "100%" }}
                />
              ),
            )}
          </div>

          {/* ─── CONTACT / CTA ────────────────────────────────── */}
          <section aria-label="Contact" style={{ padding: "0 48px" }}>
            <div className="d13-cta-section">
              <ClipReveal delay={0}>
                <span className="d13-cta-pre">Ready when you are</span>
              </ClipReveal>

              <h2 className="d13-cta-h2">
                <ClipReveal delay={0.1}>Tell me what&rsquo;s</ClipReveal>
                <ClipReveal delay={0.25}>
                  still{" "}
                  <LiquidWord word="manual." delay={0.45} color={C.accent2} />
                </ClipReveal>
              </h2>

              <ClipReveal delay={0.4}>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="d13-cta-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book 30 minutes &rarr;
                </a>
              </ClipReveal>

              <ClipReveal delay={0.5}>
                <p
                  style={{
                    marginTop: 32,
                    fontFamily: "Space Mono, monospace",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: C.muted,
                  }}
                >
                  Free. 30 minutes. No pitch deck.
                </p>
              </ClipReveal>
            </div>
          </section>

          {/* ─── FOOTER ───────────────────────────────────────── */}
          <footer className="d13-footer">
            <div>
              <div className="d13-footer-logo">Waseem Nasir</div>
              <div className="d13-footer-copy" style={{ marginTop: 8 }}>
                SkynetLabs &mdash; Est. 2019
              </div>
            </div>

            <ul className="d13-footer-links">
              <li>
                <a
                  href="https://skynetjoe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SkynetLabs
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/waseemnasir2k26"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a call
                </a>
              </li>
            </ul>

            <div className="d13-footer-copy">
              &copy; {new Date().getFullYear()}
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
