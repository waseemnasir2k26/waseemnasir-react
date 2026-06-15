"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

// ─── Iridescent Foil — Design 38 ───────────────────────────────────────────
// Fresnel-fake hue shift driven by cursor angle; foil grain overlay;
// ONE iridescent accent element per viewport section; warm literary voice.

const PALETTE = {
  bg: "#08070C",
  surface: "#13101C",
  text: "#FBFAFF",
  muted: "#7E7A93",
  accent: "#FF8FD8",
  accent2: "#6EE7F5",
};

// Foil gradient keyframes cycling pink→gold→cyan
const FOIL_STOPS = [
  "hsl(315,100%,75%)", // pink
  "hsl(40,100%,68%)", // gold
  "hsl(190,90%,72%)", // cyan
  "hsl(270,80%,78%)", // lilac
  "hsl(315,100%,75%)", // back to pink
];

function useCursorAngle() {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const rad = Math.atan2(e.clientY - cy, e.clientX - cx);
      setAngle(rad);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return angle;
}

// Fresnel-fake: maps cursor angle → hue offset
function angleToCss(angle: number): string {
  const deg = ((angle / Math.PI) * 180 + 180) % 360;
  const h1 = (deg + 0) % 360;
  const h2 = (deg + 80) % 360;
  const h3 = (deg + 160) % 360;
  return `linear-gradient(
    ${deg}deg,
    hsl(${h1},100%,72%),
    hsl(${h2},90%,68%),
    hsl(${h3},85%,74%)
  )`;
}

// Conic foil mesh — structural surface behind hero
function ConicFoilMesh({
  angle,
  reduced,
}: {
  angle: number;
  reduced: boolean;
}) {
  const deg = reduced ? 0 : ((angle / Math.PI) * 180 + 180) % 360;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Primary conic foil layer */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "70%",
          height: "140%",
          background: `conic-gradient(
            from ${deg}deg at 40% 50%,
            hsl(315,100%,60%) 0deg,
            hsl(40,100%,62%) 60deg,
            hsl(190,90%,65%) 120deg,
            hsl(270,80%,70%) 180deg,
            hsl(160,90%,60%) 240deg,
            hsl(315,100%,60%) 360deg
          )`,
          opacity: 0.09,
          filter: "blur(48px)",
          mixBlendMode: "screen",
          transform: `rotate(${deg * 0.03}deg)`,
          transition: reduced ? "none" : "transform 0.8s ease",
        }}
      />
      {/* Secondary offset conic for interference depth */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "-15%",
          width: "55%",
          height: "80%",
          background: `conic-gradient(
            from ${(deg + 120) % 360}deg at 60% 40%,
            hsl(190,90%,65%) 0deg,
            hsl(315,100%,60%) 90deg,
            hsl(40,100%,62%) 180deg,
            hsl(270,80%,70%) 270deg,
            hsl(190,90%,65%) 360deg
          )`,
          opacity: 0.07,
          filter: "blur(60px)",
          mixBlendMode: "screen",
          transform: `rotate(${-deg * 0.02}deg)`,
          transition: reduced ? "none" : "transform 0.8s ease",
        }}
      />
      {/* Thin-film iridescent horizontal band */}
      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(
            90deg,
            transparent 0%,
            hsl(${(deg + 40) % 360},100%,72%) 20%,
            hsl(${(deg + 120) % 360},90%,68%) 50%,
            hsl(${(deg + 200) % 360},85%,74%) 80%,
            transparent 100%
          )`,
          opacity: 0.6,
        }}
      />
    </div>
  );
}

// ─── Components ──────────────────────────────────────────────────────────────

function FoilText({
  children,
  className = "",
  tag: Tag = "span",
  angle,
  reduced,
}: {
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  angle: number;
  reduced: boolean;
  style?: React.CSSProperties;
}) {
  const grad = reduced
    ? `linear-gradient(135deg, ${PALETTE.accent}, ${PALETTE.accent2})`
    : angleToCss(angle);

  const El = Tag as React.ElementType;
  return (
    <El
      className={`foil-text ${className}`}
      style={{
        backgroundImage: grad,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
      }}
    >
      {children}
    </El>
  );
}

function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9,
        pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
        mixBlendMode: "overlay",
        opacity: 0.6,
      }}
    />
  );
}

function IridescentRule({
  angle,
  reduced,
}: {
  angle: number;
  reduced: boolean;
}) {
  const grad = reduced
    ? `linear-gradient(90deg, ${PALETTE.accent}, ${PALETTE.accent2})`
    : angleToCss(angle);
  return (
    <div
      aria-hidden="true"
      style={{
        height: 1,
        background: grad,
        opacity: 0.55,
        margin: "0",
      }}
    />
  );
}

const SERVICES = [
  {
    id: "01",
    title: "AI Automation",
    desc: "n8n workflows that replace repetitive tasks — follow-ups, lead routing, data sync — without hiring.",
  },
  {
    id: "02",
    title: "Voice & WhatsApp Bots",
    desc: "24/7 AI receptionists that answer calls, qualify leads, and book appointments while you sleep.",
  },
  {
    id: "03",
    title: "AEO & LLM Visibility",
    desc: "Structure your site so AI search engines cite you first. The next layer of SEO.",
  },
  {
    id: "04",
    title: "Next.js Builds",
    desc: "Fast, opinionated web products — from landing pages to full SaaS — shipped in days, not months.",
  },
  {
    id: "05",
    title: "Operations Audits",
    desc: "Walk through your stack, find the friction, hand you a prioritised fix list.",
  },
  {
    id: "06",
    title: "Fractional CTO",
    desc: "Technical decision-making without a full-time hire. I stay until the system runs itself.",
  },
];

const WORK_ITEMS = [
  {
    label: "FreightOps AI",
    note: "Voice + WhatsApp receptionist for US trucking ops. Zero missed calls.",
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    orient: "landscape",
  },
  {
    label: "Inspire Health PT",
    note: "$27 funnel — Stripe to WP to Calendly, automated in one afternoon.",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    orient: "landscape",
  },
  {
    label: "IdeaViaggi",
    note: "Per-customer trip visibility system via custom taxonomy + REST API gate.",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    orient: "landscape",
  },
  {
    label: "AEO Engine v0.7",
    note: "Structured-data pipeline that got skynetjoe.com cited in ChatGPT answers.",
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    orient: "landscape",
  },
];

export default function IridescentFoilPage() {
  const reduced = useReducedMotion() ?? false;
  const angle = useCursorAngle();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const rawProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const progress = useSpring(rawProgress, { stiffness: 80, damping: 30 });

  // Foil sheen sweep gradient for work cards
  const foilSheenGrad = reduced
    ? `linear-gradient(135deg, transparent 0%, rgba(255,143,216,0.18) 50%, transparent 100%)`
    : `linear-gradient(
        ${((angle / Math.PI) * 180 + 180) % 360}deg,
        transparent 0%,
        rgba(255,143,216,0.22) 35%,
        rgba(110,231,245,0.18) 60%,
        transparent 100%
      )`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Mulish:wght@400;500&family=Space+Mono:wght@400&display=swap');

        /* ── Custom scrollbar — foil palette ── */
        .root-38 ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .root-38 ::-webkit-scrollbar-track {
          background: #08070C;
        }
        .root-38 ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #FF8FD8, #6EE7F5, #FF8FD8);
          border-radius: 3px;
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #08070C; }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #FF8FD8, #6EE7F5, #FF8FD8);
          border-radius: 3px;
        }

        /* ── Selection styling — foil palette ── */
        .root-38 ::selection,
        ::selection {
          background: rgba(255,143,216,0.28);
          color: #FBFAFF;
        }

        .root-38 {
          font-family: 'Mulish', sans-serif;
          color: ${PALETTE.text};
          background: ${PALETTE.bg};
        }
        .root-38 h1,
        .root-38 h2,
        .root-38 h3 {
          font-family: 'Fraunces', Georgia, serif;
        }
        .root-38 .mono {
          font-family: 'Space Mono', monospace;
        }

        .root-38 a:focus-visible {
          outline: 2px solid ${PALETTE.accent};
          outline-offset: 3px;
          border-radius: 2px;
        }

        /* ── Iridescent hover on nav/footer links ── */
        .root-38 .foil-link {
          position: relative;
          text-decoration: none;
          color: ${PALETTE.muted};
          transition: color 0.25s;
        }
        .root-38 .foil-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, #FF8FD8, #6EE7F5, #FF8FD8);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .root-38 .foil-link:hover {
          color: ${PALETTE.text};
          background-image: linear-gradient(135deg, #FF8FD8, #6EE7F5, #b89aff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .root-38 .foil-link:hover::after {
          transform: scaleX(1);
        }

        .root-38 .foil-cta {
          display: inline-block;
          padding: 14px 36px;
          border-radius: 2px;
          font-family: 'Space Mono', monospace;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          text-decoration: none;
          background: linear-gradient(135deg, ${PALETTE.accent}, ${PALETTE.accent2});
          color: #08070C;
          font-weight: 700;
          transition: opacity 0.2s;
          position: relative;
          overflow: hidden;
        }
        .root-38 .foil-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, ${PALETTE.accent2}, ${PALETTE.accent});
          opacity: 0;
          transition: opacity 0.3s;
        }
        .root-38 .foil-cta:hover::before {
          opacity: 1;
        }
        .root-38 .foil-cta span {
          position: relative;
          z-index: 1;
        }

        @keyframes foil-cycle {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .root-38 .foil-wordmark {
          background-image: linear-gradient(
            135deg,
            hsl(315,100%,75%),
            hsl(40,100%,68%),
            hsl(190,90%,72%),
            hsl(270,80%,78%),
            hsl(315,100%,75%)
          );
          background-size: 300% 300%;
          animation: ${reduced ? "none" : "foil-cycle 6s ease infinite"};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Work card — thin-film sheen sweep on hover ── */
        .root-38 .work-card {
          position: relative;
          overflow: hidden;
          border-radius: 2px;
        }
        .root-38 .work-card img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          display: block;
          filter: saturate(0.7) brightness(0.75);
          transition: filter 0.4s, transform 0.5s;
        }
        .root-38 .work-card:hover img {
          filter: saturate(1.1) brightness(0.85);
          transform: scale(1.03);
        }
        /* Foil sheen pseudo-layer */
        .root-38 .work-card .foil-sheen {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255,143,216,0.25) 30%,
            rgba(110,231,245,0.20) 55%,
            rgba(184,154,255,0.18) 75%,
            transparent 100%
          );
          transition: opacity 0.35s ease, transform 0.5s ease;
          transform: translateX(-100%);
          mix-blend-mode: screen;
          z-index: 2;
        }
        .root-38 .work-card:hover .foil-sheen {
          opacity: 1;
          transform: translateX(0%);
        }
        .root-38 .work-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(to top, rgba(8,7,12,0.95) 0%, transparent 100%);
          z-index: 3;
        }

        .root-38 .about-img {
          width: 100%;
          max-width: 480px;
          border-radius: 2px;
          object-fit: cover;
          aspect-ratio: 4/5;
          filter: saturate(0.8);
        }

        .root-38 .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, ${PALETTE.accent}, ${PALETTE.accent2});
          z-index: 100;
          transform-origin: left;
        }

        .root-38 section {
          padding: 96px 0;
        }

        .root-38 .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .root-38 .label {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${PALETTE.muted};
          margin-bottom: 12px;
        }

        /* ── Services — numbered horizontal index layout ── */
        .root-38 .services-index {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .root-38 .service-row {
          display: grid;
          grid-template-columns: 64px 1fr auto;
          align-items: start;
          gap: 24px;
          padding: 28px 0;
          border-bottom: 1px solid rgba(126,122,147,0.1);
          transition: background 0.2s;
          position: relative;
          cursor: default;
        }
        .root-38 .service-row::before {
          content: '';
          position: absolute;
          left: -32px;
          right: -32px;
          top: 0;
          bottom: 0;
          background: transparent;
          transition: background 0.2s;
          pointer-events: none;
        }
        .root-38 .service-row:hover::before {
          background: rgba(255,143,216,0.03);
        }
        .root-38 .service-row:hover .service-foil-tick {
          opacity: 1;
          transform: scaleX(1);
        }
        .root-38 .service-foil-tick {
          position: absolute;
          left: -32px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #FF8FD8, #6EE7F5, #b89aff);
          opacity: 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: opacity 0.2s, transform 0.25s;
        }
        .root-38 .service-num {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          color: ${PALETTE.muted};
          letter-spacing: 0.1em;
          padding-top: 4px;
        }
        .root-38 .service-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: ${PALETTE.text};
          margin-bottom: 6px;
          line-height: 1.2;
        }
        .root-38 .service-desc {
          font-size: 0.875rem;
          color: ${PALETTE.muted};
          line-height: 1.65;
          max-width: 480px;
        }
        .root-38 .service-arrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          color: ${PALETTE.muted};
          opacity: 0;
          transition: opacity 0.2s, color 0.2s;
          align-self: center;
          white-space: nowrap;
        }
        .root-38 .service-row:hover .service-arrow {
          opacity: 1;
          color: ${PALETTE.accent};
        }

        @media (max-width: 640px) {
          .root-38 .hero-hed {
            font-size: clamp(2.2rem, 10vw, 4rem) !important;
          }
          .root-38 .about-grid {
            flex-direction: column !important;
          }
          .root-38 .service-row {
            grid-template-columns: 48px 1fr;
          }
          .root-38 .service-arrow {
            display: none;
          }
        }
      `}</style>

      <a
        href="#main-content"
        className="root-38"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        Skip to main content
      </a>

      <div
        className="root-38"
        style={{
          minHeight: "100vh",
          background: PALETTE.bg,
          position: "relative",
          zIndex: 2,
          overflowX: "hidden",
        }}
      >
        <GrainOverlay />

        {/* Scroll progress rail */}
        <motion.div
          className="root-38 scroll-progress"
          style={{ scaleX: useTransform(progress, [0, 100], [0, 1]) }}
        />

        {/* ── NAV ── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            background: "rgba(8,7,12,0.82)",
            borderBottom: `1px solid rgba(126,122,147,0.12)`,
          }}
        >
          <div
            className="root-38 container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 60,
            }}
          >
            <span
              className="root-38 foil-wordmark"
              style={{
                fontSize: "1rem",
                fontFamily: "'Fraunces',serif",
                fontWeight: 600,
              }}
            >
              Waseem Nasir
            </span>
            <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
              <a
                href="#services"
                className="root-38 foil-link mono"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                Services
              </a>
              <a
                href="#work"
                className="root-38 foil-link mono"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                Work
              </a>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="root-38 foil-cta"
                style={{ padding: "8px 20px", fontSize: "0.75rem" }}
              >
                <span>Book a Call</span>
              </a>
            </nav>
          </div>
        </header>

        <main id="main-content">
          {/* ── HERO ── */}
          <section
            style={{ paddingTop: 120, paddingBottom: 80, position: "relative" }}
          >
            {/* Structural conic foil mesh — the real surface treatment */}
            <ConicFoilMesh angle={angle} reduced={reduced} />

            <div
              className="root-38 container"
              style={{ position: "relative", zIndex: 1 }}
            >
              <motion.p
                className="root-38 label"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                SkynetLabs · Independent Founder · 2019—
              </motion.p>

              <motion.h1
                className="root-38 hero-hed foil-wordmark"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "clamp(2.8rem,7vw,5.6rem)",
                  fontWeight: 600,
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  marginBottom: 32,
                  maxWidth: 700,
                }}
              >
                I turn messy&nbsp;operations into quiet machines.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                style={{
                  fontSize: "1.2rem",
                  color: PALETTE.muted,
                  fontFamily: "'Mulish', sans-serif",
                  fontWeight: 400,
                  lineHeight: 1.7,
                  maxWidth: 540,
                  marginBottom: 44,
                }}
              >
                AI systems, voice bots, and automations that replace the
                busywork — missed leads, dead follow-ups, manual ops — so you
                can focus on the work that matters.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.38 }}
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="root-38 foil-cta"
                >
                  <span>Book 30 minutes — free</span>
                </a>
                <a
                  href="https://github.com/waseemnasir2k26"
                  className="root-38 foil-link"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.06em",
                    paddingBottom: 2,
                  }}
                >
                  GitHub ↗
                </a>
              </motion.div>

              {/* Foil hero image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ marginTop: 72, position: "relative" }}
              >
                <img
                  src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                  alt="Waseem Nasir working on a Bali terrace cafe, laptop open, latte beside him"
                  style={{
                    width: "100%",
                    maxHeight: 480,
                    objectFit: "cover",
                    objectPosition: "center 30%",
                    borderRadius: 2,
                    display: "block",
                    filter: "saturate(0.75) brightness(0.8)",
                  }}
                />
                {/* Full iridescent foil overlay on hero image — structural surface */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(
                      ${((angle / Math.PI) * 180 + 180) % 360}deg,
                      rgba(255,143,216,0.12) 0%,
                      rgba(110,231,245,0.09) 35%,
                      rgba(184,154,255,0.08) 65%,
                      rgba(64,220,180,0.10) 100%
                    )`,
                    mixBlendMode: "screen",
                    borderRadius: 2,
                    transition: reduced ? "none" : "background 0.6s ease",
                    pointerEvents: "none",
                  }}
                />
                {/* Bottom foil accent bar */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: angleToCss(angle),
                    opacity: 0.9,
                  }}
                />
              </motion.div>
            </div>
          </section>

          {/* ── PROOF NUMBERS ── */}
          <section style={{ paddingTop: 0, paddingBottom: 80 }}>
            <div className="root-38 container">
              <IridescentRule angle={angle} reduced={reduced} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 0,
                  marginTop: 0,
                }}
              >
                {[
                  { n: "180+", l: "Builds shipped" },
                  { n: "40+", l: "Clients served" },
                  { n: "9", l: "Countries worked from" },
                  { n: "2019", l: "Year I started" },
                ].map((item, i) => (
                  <motion.div
                    key={item.n}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    style={{
                      padding: "40px 0",
                      borderRight:
                        i < 3 ? `1px solid rgba(126,122,147,0.12)` : "none",
                      paddingLeft: i === 0 ? 0 : 32,
                    }}
                  >
                    {/* Single clipped element — no double-gradient nesting */}
                    <div
                      style={{
                        fontFamily: "'Fraunces', Georgia, serif",
                        fontSize: "3rem",
                        fontWeight: 600,
                        lineHeight: 1,
                        display: "block",
                        marginBottom: 8,
                        backgroundImage: reduced
                          ? `linear-gradient(135deg, ${PALETTE.accent}, ${PALETTE.accent2})`
                          : angleToCss(angle),
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {item.n}
                    </div>
                    <p
                      className="root-38 label"
                      style={{ marginBottom: 0, marginTop: 0 }}
                    >
                      {item.l}
                    </p>
                  </motion.div>
                ))}
              </div>
              <IridescentRule angle={angle} reduced={reduced} />
            </div>
          </section>

          {/* ── WHAT I BUILD — numbered horizontal index ── */}
          <section id="services">
            <div className="root-38 container">
              <motion.p
                className="root-38 label"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                What I build
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: 48,
                  color: PALETTE.text,
                  maxWidth: 520,
                }}
              >
                Six things I do exceptionally well.
              </motion.h2>

              {/* Bespoke numbered index — replaces auto-grid */}
              <div className="root-38 services-index">
                {SERVICES.map((s, i) => (
                  <motion.div
                    key={s.id}
                    className="root-38 service-row"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                  >
                    <div
                      className="root-38 service-foil-tick"
                      aria-hidden="true"
                    />
                    <span className="root-38 service-num">{s.id}</span>
                    <div>
                      <p className="root-38 service-title">{s.title}</p>
                      <p className="root-38 service-desc">{s.desc}</p>
                    </div>
                    <span className="root-38 service-arrow">→</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SELECTED WORK ── */}
          <section id="work" style={{ background: PALETTE.surface }}>
            <div className="root-38 container">
              <motion.p
                className="root-38 label"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Selected work
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: 48,
                  color: PALETTE.text,
                }}
              >
                A small handful of what ships.
              </motion.h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {WORK_ITEMS.map((w, i) => (
                  <motion.div
                    key={w.label}
                    className="root-38 work-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: i * 0.1 }}
                  >
                    <img src={`/img/pro/${w.img}`} alt={w.label} />
                    {/* Thin-film sheen sweep — slides in on hover via CSS */}
                    <div className="foil-sheen" aria-hidden="true" />
                    {/* Foil accent left edge */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 3,
                        height: "100%",
                        background: angleToCss(angle),
                        opacity: 0.7,
                        zIndex: 4,
                      }}
                    />
                    <div className="root-38 work-card-overlay">
                      <p
                        style={{
                          fontFamily: "'Fraunces', Georgia, serif",
                          fontSize: "1.05rem",
                          fontWeight: 600,
                          color: PALETTE.text,
                          marginBottom: 4,
                        }}
                      >
                        {w.label}
                      </p>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          color: PALETTE.muted,
                          lineHeight: 1.55,
                        }}
                      >
                        {w.note}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── ABOUT ── */}
          <section>
            <div className="root-38 container">
              <div
                className="root-38 about-grid"
                style={{ display: "flex", gap: 64, alignItems: "flex-start" }}
              >
                {/* Images column */}
                <div
                  style={{
                    flex: "0 0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <motion.div
                    style={{ position: "relative" }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                  >
                    <img
                      src="/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg"
                      alt="Waseem Nasir in a black kurta, soft smile, wooden interior"
                      style={{
                        width: "280px",
                        maxWidth: "100%",
                        borderRadius: 2,
                        objectFit: "cover",
                        aspectRatio: "4/5",
                        filter: "saturate(0.8)",
                        display: "block",
                      }}
                    />
                    {/* Iridescent foil duotone overlay on about portrait */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(
                          ${((angle / Math.PI) * 180 + 180) % 360}deg,
                          rgba(255,143,216,0.10) 0%,
                          rgba(110,231,245,0.07) 50%,
                          rgba(184,154,255,0.09) 100%
                        )`,
                        mixBlendMode: "screen",
                        borderRadius: 2,
                        pointerEvents: "none",
                        transition: reduced ? "none" : "background 0.6s ease",
                      }}
                    />
                  </motion.div>
                  <motion.img
                    src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                    alt="Waseem at Nusa Penida cliffs, arms spread, ocean below"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    style={{
                      width: "280px",
                      maxWidth: "100%",
                      borderRadius: 2,
                      objectFit: "cover",
                      aspectRatio: "16/9",
                      filter: "saturate(0.75)",
                      display: "block",
                    }}
                  />
                </div>

                {/* Text column */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  style={{ flex: 1 }}
                >
                  <p className="root-38 label">About</p>
                  <h2
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                      fontWeight: 400,
                      lineHeight: 1.25,
                      marginBottom: 28,
                      color: PALETTE.text,
                    }}
                  >
                    I've been building quietly since 2019. No venture money. No
                    team of ten.
                  </h2>
                  <p
                    style={{
                      color: PALETTE.muted,
                      fontSize: "0.95rem",
                      lineHeight: 1.75,
                      marginBottom: 20,
                    }}
                  >
                    Independent founder of SkynetLabs. I design and ship AI
                    automation systems — the kind that quietly handle the work
                    nobody wants to do manually. Missed leads, dead follow-ups,
                    broken handoffs. I find them, automate them, then move on to
                    the next one.
                  </p>
                  <p
                    style={{
                      color: PALETTE.muted,
                      fontSize: "0.95rem",
                      lineHeight: 1.75,
                      marginBottom: 20,
                    }}
                  >
                    180+ builds. 40+ clients. Nine countries worked from —
                    currently splitting time between Bali and Lahore. The stack
                    I reach for most: n8n, Next.js, WhatsApp API, voice AI.
                  </p>
                  <p
                    style={{
                      color: PALETTE.muted,
                      fontSize: "0.95rem",
                      lineHeight: 1.75,
                      marginBottom: 36,
                    }}
                  >
                    I don't sell retainers for the sake of them. I stay until
                    the system runs itself.
                  </p>

                  <IridescentRule angle={angle} reduced={reduced} />

                  {/* Mini gallery */}
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 24,
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      {
                        file: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                        alt: "Rooftop cafe, dragonfruit smoothie, smiling at laptop",
                      },
                      {
                        file: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                        alt: "Hilltop city vista with backpack and sunglasses",
                      },
                      {
                        file: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                        alt: "Bali coworking group meetup",
                      },
                      {
                        file: "LIFESTYLE-2026-06-09-acoustic-guitar-smile-white-cafe.jpg",
                        alt: "Playing acoustic guitar smiling in white cafe",
                      },
                    ].map((img) => (
                      <img
                        key={img.file}
                        src={`/img/pro/${img.file}`}
                        alt={img.alt}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: 2,
                          filter: "saturate(0.7)",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── TEXTURE BREAK — big foil quote ── */}
          <section
            style={{
              background: PALETTE.surface,
              paddingTop: 80,
              paddingBottom: 80,
            }}
          >
            <div className="root-38 container">
              <IridescentRule angle={angle} reduced={reduced} />
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{
                  margin: "56px 0",
                  padding: 0,
                  border: "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
                    fontWeight: 400,
                    lineHeight: 1.35,
                    color: PALETTE.text,
                    maxWidth: 640,
                  }}
                >
                  "The best automation is the one you never have to think about
                  again. That's what I'm after, every build."
                </p>
                <footer
                  style={{
                    marginTop: 20,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.72rem",
                    color: PALETTE.muted,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  — Waseem Nasir, SkynetLabs
                </footer>
              </motion.blockquote>
              <IridescentRule angle={angle} reduced={reduced} />
            </div>
          </section>

          {/* ── MORE WORK PHOTOS ── */}
          <section>
            <div className="root-38 container">
              <motion.p
                className="root-38 label"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                How I work
              </motion.p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                  marginTop: 24,
                }}
              >
                {[
                  {
                    file: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
                    alt: "Rooftop cafe with mountain clouds view, laptop open",
                    h: 280,
                  },
                  {
                    file: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
                    alt: "Night coworking space, team laptops, selfie",
                    h: 280,
                  },
                  {
                    file: "CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg",
                    alt: "Night rooftop cafe, city lights, on phone",
                    h: 280,
                  },
                  {
                    file: "PORTRAIT-2026-02-15-balcony-gray-adidas-soft-smile.jpg",
                    alt: "Balcony portrait, gray Adidas, soft smile",
                    h: 200,
                  },
                  {
                    file: "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
                    alt: "Rice terrace, phone and powerbank, deep focus",
                    h: 200,
                  },
                  {
                    file: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
                    alt: "Garden cafe, blue polo shirt, smiling at laptop",
                    h: 200,
                  },
                ].map((img, i) => (
                  <motion.div
                    key={img.file}
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 2,
                    }}
                  >
                    <img
                      src={`/img/pro/${img.file}`}
                      alt={img.alt}
                      style={{
                        width: "100%",
                        height: img.h,
                        objectFit: "cover",
                        display: "block",
                        filter: "saturate(0.72) brightness(0.8)",
                        transition: "filter 0.4s",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section style={{ background: PALETTE.surface }}>
            <div className="root-38 container" style={{ textAlign: "center" }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                {/* Foil accent rule centered */}
                <div
                  aria-hidden="true"
                  style={{
                    width: 64,
                    height: 2,
                    background: angleToCss(angle),
                    margin: "0 auto 48px",
                    borderRadius: 1,
                  }}
                />

                <h2
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: "clamp(2rem, 5vw, 3.6rem)",
                    fontWeight: 600,
                    lineHeight: 1.1,
                    color: PALETTE.text,
                    marginBottom: 24,
                  }}
                >
                  Ready to stop patching and start{" "}
                  <span
                    style={{
                      backgroundImage: reduced
                        ? `linear-gradient(135deg, ${PALETTE.accent}, ${PALETTE.accent2})`
                        : angleToCss(angle),
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    automating?
                  </span>
                </h2>

                <p
                  style={{
                    color: PALETTE.muted,
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    maxWidth: 420,
                    margin: "0 auto 44px",
                  }}
                >
                  30 minutes. We map the friction in your ops, agree on what to
                  fix first, and you leave with a plan — whether or not you hire
                  me.
                </p>

                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="root-38 foil-cta"
                  style={{ fontSize: "0.9rem", padding: "16px 48px" }}
                >
                  <span>Book a free 30-minute call</span>
                </a>

                <p
                  className="root-38 mono"
                  style={{
                    marginTop: 24,
                    fontSize: "0.72rem",
                    color: PALETTE.muted,
                    letterSpacing: "0.1em",
                  }}
                >
                  Bali · Lahore · Remote · Async-first
                </p>
              </motion.div>
            </div>
          </section>
        </main>

        {/* ── FOOTER ── */}
        <footer
          style={{
            borderTop: `1px solid rgba(126,122,147,0.14)`,
            padding: "40px 32px",
          }}
        >
          <div
            className="root-38 container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span
              className="root-38 foil-wordmark"
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            >
              Waseem Nasir
            </span>
            <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
              <a
                href="https://github.com/waseemnasir2k26"
                className="root-38 foil-link"
                style={{
                  fontSize: "0.8rem",
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                GitHub
              </a>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="root-38 foil-link"
                style={{
                  fontSize: "0.8rem",
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                Book a call
              </a>
            </div>
            <p
              className="root-38 mono"
              style={{ fontSize: "0.7rem", color: PALETTE.muted }}
            >
              © 2019–2026 SkynetLabs
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
