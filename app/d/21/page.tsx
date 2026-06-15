"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
  useInView,
} from "framer-motion";
import Link from "next/link";

/* ─────────────────────────────────────────────
   OXIDE PRINT — Design 21
   Acid-risograph hybrid / industrial retro-future
   Palette: bg #14130F · surface #211F18 · text #F4E9C9
            muted #8C8369 · accent #FF6A1A · accent2 #9DFF00
   Fonts: Syne 700/800 · Hanken Grotesk 400/500 · Spline Sans Mono 400
───────────────────────────────────────────── */

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Hanken+Grotesk:wght@400;500&family=Spline+Sans+Mono:wght@400&display=swap";

const PALETTE = {
  bg: "#14130F",
  surface: "#211F18",
  text: "#F4E9C9",
  muted: "#8C8369",
  accent: "#FF6A1A",
  accent2: "#9DFF00",
};

const STATS = [
  { val: "180+", label: "builds shipped" },
  { val: "40+", label: "clients served" },
  { val: "9", label: "countries" },
  { val: "2019", label: "since" },
];

const SERVICES = [
  {
    tag: "01",
    title: "ai automation",
    body: "n8n pipelines that absorb your manual ops — lead capture, follow-up, CRM sync — running 24/7 without you touching them.",
  },
  {
    tag: "02",
    title: "voice & chat bots",
    body: "WhatsApp and voice receptionists that qualify, book, and follow up. Missed leads become a thing of the past.",
  },
  {
    tag: "03",
    title: "next.js builds",
    body: "Performant web apps and landing systems engineered to convert. Fast, semantic, indexed properly.",
  },
  {
    tag: "04",
    title: "aeo & search presence",
    body: "Answer Engine Optimisation — structured so AI search cites you before a human even clicks.",
  },
];

const WORK = [
  { label: "freight ops voice receptionist", tag: "AI · Voice · US+SG" },
  { label: "inspire health pt — $27 funnel", tag: "Next.js · Stripe" },
  { label: "ideaviaggi trip management", tag: "WordPress · WP REST" },
  { label: "takycorp email automation", tag: "n8n · OpenAI" },
  { label: "aeo engine v0.7", tag: "AEO · SkynetJoe" },
  { label: "gigsignal chrome extension", tag: "Chrome · Scraper" },
];

// Images: portrait orientation where practical for editorial spreads
const HERO_IMG =
  "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg";
const ABOUT_IMGS = [
  "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
  "PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg",
  "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
];
const WORK_IMGS = [
  "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
  "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  "PORTRAIT-2025-05-08-cafe-table-arms-crossed-pensive.jpg",
  "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
  "PORTRAIT-mural-halfbody-smile-watch-raised.jpg",
  "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
];

/* ─── Grain texture SVG (base64 inline) ─── */
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`;

/* ─── CountUp hook ─── */
function useCountUp(target: number, duration = 1400, active = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const id = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target, duration, active]);
  return count;
}

/* ─── Stat card with count-up ─── */
function StatCard({ val, label }: { val: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();
  const numeric = parseInt(val.replace(/\D/g, ""), 10);
  const suffix = val.replace(/[0-9]/g, "");
  const counted = useCountUp(numeric, 1200, inView && !shouldReduce);

  return (
    <div ref={ref} className="oxide-stat-card">
      <span className="oxide-stat-val">
        {shouldReduce ? val : `${counted}${suffix}`}
      </span>
      <span className="oxide-stat-label">{label}</span>
    </div>
  );
}

/* ─── Duotone sweep image ─── */
function DuotoneImg({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const sweep = useTransform(scrollYProgress, [0, 1], ["-120%", "120%"]);
  const shouldReduce = useReducedMotion();

  return (
    <div
      ref={ref}
      className={`oxide-duotone-wrap ${className ?? ""}`}
      style={style}
    >
      <img src={`/img/pro/${src}`} alt={alt} className="oxide-duotone-img" />
      {!shouldReduce && (
        <motion.div className="oxide-duotone-sweep" style={{ x: sweep }} />
      )}
    </div>
  );
}

/* ─── Grain reveal block ─── */
function GrainReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? false : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Ticker rail ─── */
function TickerRail() {
  const items = [
    "ai automation",
    "n8n pipelines",
    "whatsapp bots",
    "next.js builds",
    "voice receptionists",
    "aeo systems",
    "40+ clients",
    "9 countries",
    "180+ builds",
    "since 2019",
    "skynetlabs",
    "no fluff",
  ];
  const shouldReduce = useReducedMotion();

  return (
    <div className="oxide-ticker-outer" aria-hidden="true">
      <motion.div
        className="oxide-ticker-inner"
        animate={shouldReduce ? {} : { x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="oxide-ticker-item">
            {item}
            <span className="oxide-ticker-dot">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Knockout text (mask over moving grain texture) ─── */
function KnockoutHeading({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="oxide-knockout-wrap">
      {!shouldReduce && (
        <motion.div
          className="oxide-knockout-texture"
          style={{ backgroundPositionX: bgX }}
        />
      )}
      <h2 className="oxide-knockout-text">{children}</h2>
    </div>
  );
}

/* ─── Main page ─── */
export default function OxidePrint() {
  const shouldReduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progressWidth = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
    {
      stiffness: 120,
      damping: 30,
    },
  );

  return (
    <div className="root-21">
      {/* ── Font + scoped styles ── */}
      <style>{`
        @import url('${FONT_URL}');

        .root-21 {
          font-family: 'Hanken Grotesk', sans-serif;
          font-weight: 400;
          background: ${PALETTE.bg};
          color: ${PALETTE.text};
          min-height: 100vh;
          position: relative;
          z-index: 2;
          overflow-x: hidden;
        }

        /* Grain overlay on whole page */
        .root-21::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: ${GRAIN_SVG};
          background-size: 300px 300px;
          pointer-events: none;
          z-index: 999;
          opacity: 0.55;
          mix-blend-mode: overlay;
        }

        /* Progress rail */
        .oxide-progress {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          background: ${PALETTE.accent};
          z-index: 1000;
          transform-origin: left;
        }

        /* ── Nav ── */
        .oxide-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          mix-blend-mode: normal;
        }
        .oxide-nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: 0.12em;
          text-transform: lowercase;
          color: ${PALETTE.text};
          text-decoration: none;
        }
        .oxide-nav-logo span {
          color: ${PALETTE.accent};
        }
        .oxide-nav-cta {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: lowercase;
          color: ${PALETTE.bg};
          background: ${PALETTE.accent};
          border: none;
          padding: 9px 20px;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s, color 0.2s;
        }
        .oxide-nav-cta:hover {
          background: ${PALETTE.accent2};
          color: ${PALETTE.bg};
        }
        .oxide-nav-cta:focus-visible {
          outline: 2px solid ${PALETTE.accent2};
          outline-offset: 3px;
        }

        /* ── Hero ── */
        .oxide-hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 0;
          align-items: end;
          padding: 0 48px 80px;
          padding-top: 120px;
          position: relative;
        }
        @media (max-width: 900px) {
          .oxide-hero {
            grid-template-columns: 1fr;
            padding: 120px 24px 60px;
          }
          .oxide-hero-img-col { display: none; }
          .oxide-nav { padding: 20px 24px; }
        }
        .oxide-hero-content {
          padding-right: 60px;
        }
        @media (max-width: 900px) {
          .oxide-hero-content { padding-right: 0; }
        }
        .oxide-hero-tag {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: ${PALETTE.accent};
          text-transform: lowercase;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .oxide-hero-tag::before {
          content: '';
          display: inline-block;
          width: 28px;
          height: 1px;
          background: ${PALETTE.accent};
        }
        .oxide-hero-h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(48px, 7vw, 112px);
          line-height: 0.93;
          letter-spacing: -0.03em;
          text-transform: lowercase;
          color: ${PALETTE.text};
          margin: 0 0 36px;
        }
        .oxide-hero-h1 em {
          font-style: normal;
          color: ${PALETTE.accent};
          display: block;
        }
        .oxide-hero-sub {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: ${PALETTE.muted};
          max-width: 520px;
          margin-bottom: 48px;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .oxide-hero-sub strong {
          color: ${PALETTE.text};
          font-weight: 500;
        }
        .oxide-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: 'Spline Sans Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: lowercase;
          color: ${PALETTE.bg};
          background: ${PALETTE.accent};
          padding: 16px 32px;
          text-decoration: none;
          transition: background 0.2s, color 0.2s, gap 0.2s;
        }
        .oxide-cta-primary::after {
          content: '→';
        }
        .oxide-cta-primary:hover {
          background: ${PALETTE.accent2};
          gap: 20px;
        }
        .oxide-cta-primary:focus-visible {
          outline: 2px solid ${PALETTE.accent2};
          outline-offset: 3px;
        }

        /* Hero image */
        .oxide-hero-img-col {
          position: relative;
          height: 70vh;
          min-height: 500px;
        }

        /* ── Duotone image wrapper ── */
        .oxide-duotone-wrap {
          position: relative;
          overflow: hidden;
        }
        .oxide-duotone-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: grayscale(80%) contrast(1.1);
          mix-blend-mode: luminosity;
        }
        .oxide-duotone-sweep {
          position: absolute;
          inset: 0 -100% 0 -100%;
          background: linear-gradient(
            105deg,
            transparent 30%,
            ${PALETTE.accent}55 48%,
            ${PALETTE.accent2}44 52%,
            transparent 70%
          );
          pointer-events: none;
          mix-blend-mode: color-dodge;
          will-change: transform;
        }

        /* ── Ticker ── */
        .oxide-ticker-outer {
          width: 100%;
          overflow: hidden;
          background: ${PALETTE.accent};
          padding: 12px 0;
        }
        .oxide-ticker-inner {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .oxide-ticker-item {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: lowercase;
          color: ${PALETTE.bg};
          padding: 0 18px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .oxide-ticker-dot {
          font-size: 8px;
          opacity: 0.5;
        }

        /* ── Stats ── */
        .oxide-stats-section {
          padding: 100px 48px;
          background: ${PALETTE.surface};
          position: relative;
        }
        @media (max-width: 600px) {
          .oxide-stats-section { padding: 60px 24px; }
        }
        .oxide-stats-label {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: ${PALETTE.accent};
          text-transform: lowercase;
          margin-bottom: 48px;
        }
        .oxide-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border-top: 1px solid #2E2C23;
        }
        @media (max-width: 700px) {
          .oxide-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .oxide-stat-card {
          padding: 40px 0 40px 0;
          border-right: 1px solid #2E2C23;
          padding-left: 32px;
        }
        .oxide-stat-card:last-child { border-right: none; }
        .oxide-stat-val {
          display: block;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(40px, 5vw, 72px);
          color: ${PALETTE.accent};
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .oxide-stat-label {
          display: block;
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 13px;
          color: ${PALETTE.muted};
          margin-top: 8px;
          letter-spacing: 0.01em;
        }

        /* ── Knockout heading ── */
        .oxide-knockout-wrap {
          position: relative;
          overflow: hidden;
          display: inline-block;
        }
        .oxide-knockout-texture {
          position: absolute;
          inset: 0;
          background-image: ${GRAIN_SVG},
            linear-gradient(135deg, ${PALETTE.accent} 0%, ${PALETTE.accent2} 100%);
          background-size: 300px 300px, 100% 100%;
          will-change: background-position;
        }
        .oxide-knockout-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(52px, 8vw, 128px);
          line-height: 0.9;
          letter-spacing: -0.04em;
          text-transform: lowercase;
          margin: 0;
          position: relative;
          /* Knockout via mix-blend-mode */
          background: ${PALETTE.bg};
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          /* Fallback for non-blend: */
          mix-blend-mode: multiply;
          /* We invert: the texture shows through white area */
          color: ${PALETTE.text};
        }

        /* ── Services ── */
        .oxide-services-section {
          padding: 120px 48px;
          background: ${PALETTE.bg};
        }
        @media (max-width: 600px) {
          .oxide-services-section { padding: 70px 24px; }
        }
        .oxide-section-header {
          display: flex;
          align-items: baseline;
          gap: 24px;
          margin-bottom: 64px;
        }
        .oxide-section-tag {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: ${PALETTE.accent};
          text-transform: lowercase;
        }
        .oxide-section-h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(32px, 4vw, 56px);
          color: ${PALETTE.text};
          letter-spacing: -0.03em;
          text-transform: lowercase;
          margin: 0;
          line-height: 1;
        }
        .oxide-services-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid #2E2C23;
        }
        .oxide-service-row {
          display: grid;
          grid-template-columns: 60px 1fr 1fr;
          gap: 0 40px;
          padding: 40px 0;
          border-bottom: 1px solid #2E2C23;
          align-items: start;
          transition: background 0.2s;
        }
        .oxide-service-row:hover {
          background: ${PALETTE.surface};
          padding-left: 12px;
          padding-right: 12px;
        }
        @media (max-width: 700px) {
          .oxide-service-row { grid-template-columns: 1fr; gap: 8px; }
        }
        .oxide-service-tag {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 11px;
          color: ${PALETTE.accent};
          letter-spacing: 0.1em;
          padding-top: 6px;
        }
        .oxide-service-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: ${PALETTE.text};
          text-transform: lowercase;
          letter-spacing: -0.02em;
        }
        .oxide-service-body {
          font-size: 14px;
          line-height: 1.65;
          color: ${PALETTE.muted};
        }

        /* ── Work grid ── */
        .oxide-work-section {
          padding: 120px 48px;
          background: ${PALETTE.surface};
        }
        @media (max-width: 600px) {
          .oxide-work-section { padding: 70px 24px; }
        }
        .oxide-work-spread {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          margin-top: 64px;
        }
        @media (max-width: 900px) {
          .oxide-work-spread { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .oxide-work-spread { grid-template-columns: 1fr; }
        }
        .oxide-work-cell {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: ${PALETTE.bg};
        }
        .oxide-work-cell:nth-child(2) { aspect-ratio: 3/4; }
        .oxide-work-cell:nth-child(4) { aspect-ratio: 4/3; }
        .oxide-work-label-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 20px 16px 16px;
          background: linear-gradient(transparent, rgba(20,19,15,0.92));
          z-index: 2;
        }
        .oxide-work-label {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          text-transform: lowercase;
          color: ${PALETTE.text};
          line-height: 1.3;
        }
        .oxide-work-tag-pill {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: ${PALETTE.accent2};
          margin-top: 4px;
          display: block;
        }

        /* Selected work list */
        .oxide-work-list {
          margin-top: 48px;
          border-top: 1px solid #2E2C23;
        }
        .oxide-work-list-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          border-bottom: 1px solid #2E2C23;
          gap: 24px;
        }
        .oxide-work-list-label {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: ${PALETTE.text};
          text-transform: lowercase;
        }
        .oxide-work-list-tag {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: ${PALETTE.muted};
          white-space: nowrap;
        }

        /* ── About ── */
        .oxide-about-section {
          padding: 120px 48px;
          background: ${PALETTE.bg};
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .oxide-about-section {
            grid-template-columns: 1fr;
            padding: 70px 24px;
            gap: 48px;
          }
        }
        .oxide-about-photos {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3px;
        }
        .oxide-about-photo {
          aspect-ratio: 2/3;
          overflow: hidden;
        }
        .oxide-about-photo:first-child {
          grid-column: span 2;
          aspect-ratio: 16/9;
        }
        .oxide-about-copy {
          padding-top: 12px;
        }
        .oxide-about-copy h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(36px, 4vw, 60px);
          color: ${PALETTE.text};
          text-transform: lowercase;
          letter-spacing: -0.03em;
          line-height: 0.95;
          margin: 0 0 28px;
        }
        .oxide-about-copy h2 span { color: ${PALETTE.accent}; }
        .oxide-about-copy p {
          font-size: 15px;
          line-height: 1.7;
          color: ${PALETTE.muted};
          margin-bottom: 20px;
        }
        .oxide-about-copy p strong {
          color: ${PALETTE.text};
          font-weight: 500;
        }
        .oxide-about-meta {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          margin-top: 32px;
        }
        .oxide-about-meta a {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: ${PALETTE.accent2};
          text-decoration: none;
          border-bottom: 1px solid ${PALETTE.accent2}55;
          padding-bottom: 2px;
          transition: border-color 0.2s, color 0.2s;
        }
        .oxide-about-meta a:hover { color: ${PALETTE.accent}; border-color: ${PALETTE.accent}; }
        .oxide-about-meta a:focus-visible { outline: 2px solid ${PALETTE.accent2}; outline-offset: 3px; }

        /* ── Wide editorial strip ── */
        .oxide-editorial-strip {
          width: 100%;
          overflow: hidden;
          position: relative;
          height: 420px;
        }
        .oxide-editorial-strip img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: grayscale(70%);
        }
        .oxide-editorial-text-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          padding: 0 48px;
          background: linear-gradient(90deg, rgba(20,19,15,0.85) 40%, transparent);
        }
        .oxide-editorial-text-overlay p {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(28px, 4.5vw, 64px);
          color: ${PALETTE.text};
          text-transform: lowercase;
          letter-spacing: -0.03em;
          line-height: 1;
          max-width: 680px;
          margin: 0;
        }
        .oxide-editorial-text-overlay p em {
          font-style: normal;
          color: ${PALETTE.accent2};
        }

        /* ── CTA / Contact ── */
        .oxide-cta-section {
          padding: 140px 48px 120px;
          background: ${PALETTE.surface};
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .oxide-cta-section { padding: 80px 24px 80px; }
        }
        .oxide-cta-section::before {
          content: 'oxide';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(120px, 20vw, 300px);
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,106,26,0.08);
          text-transform: lowercase;
          letter-spacing: -0.05em;
          pointer-events: none;
          white-space: nowrap;
          user-select: none;
        }
        .oxide-cta-tag {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: ${PALETTE.accent};
          text-transform: lowercase;
          margin-bottom: 28px;
        }
        .oxide-cta-headline {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(36px, 5.5vw, 80px);
          color: ${PALETTE.text};
          text-transform: lowercase;
          letter-spacing: -0.03em;
          line-height: 0.95;
          margin: 0 auto 20px;
          max-width: 800px;
        }
        .oxide-cta-sub {
          font-size: 15px;
          color: ${PALETTE.muted};
          margin-bottom: 48px;
          line-height: 1.6;
        }
        .oxide-cta-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .oxide-cta-ghost {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: lowercase;
          color: ${PALETTE.text};
          border: 1px solid #2E2C23;
          padding: 15px 28px;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .oxide-cta-ghost:hover { border-color: ${PALETTE.accent2}; color: ${PALETTE.accent2}; }
        .oxide-cta-ghost:focus-visible { outline: 2px solid ${PALETTE.accent2}; outline-offset: 3px; }

        /* ── Footer ── */
        .oxide-footer {
          background: ${PALETTE.bg};
          border-top: 1px solid #2E2C23;
          padding: 36px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .oxide-footer { padding: 28px 24px; flex-direction: column; align-items: flex-start; }
        }
        .oxide-footer-left {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: ${PALETTE.muted};
        }
        .oxide-footer-left a {
          color: ${PALETTE.accent};
          text-decoration: none;
          margin-left: 8px;
        }
        .oxide-footer-left a:hover { color: ${PALETTE.accent2}; }
        .oxide-footer-right {
          font-family: 'Spline Sans Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          color: #3A3828;
          text-transform: lowercase;
        }
      `}</style>

      {/* ── Scroll progress ── */}
      <motion.div
        className="oxide-progress"
        style={{ width: progressWidth }}
        aria-hidden="true"
      />

      {/* ── Skip link ── */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          top: -40,
          left: 0,
          background: PALETTE.accent,
          color: PALETTE.bg,
          padding: "8px 16px",
          zIndex: 2000,
          fontFamily: "Spline Sans Mono, monospace",
          fontSize: 12,
          transition: "top 0.2s",
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLElement).style.top = "0";
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLElement).style.top = "-40px";
        }}
      >
        skip to content
      </a>

      {/* ── Nav ── */}
      <nav className="oxide-nav" aria-label="Primary navigation">
        <a href="/" className="oxide-nav-logo">
          skynet<span>labs</span>
        </a>
        <a
          href="https://skynetjoe.com/discovery-call"
          className="oxide-nav-cta"
        >
          book a call
        </a>
      </nav>

      {/* ── Hero ── */}
      <main id="main-content">
        <section className="oxide-hero" aria-label="Hero">
          <div className="oxide-hero-content">
            <GrainReveal>
              <p className="oxide-hero-tag">
                waseem nasir · skynetlabs · since 2019
              </p>
            </GrainReveal>
            <GrainReveal delay={0.08}>
              <h1 className="oxide-hero-h1">
                nine years
                <em>turning grind</em>
                into systems.
              </h1>
            </GrainReveal>
            <GrainReveal delay={0.16}>
              <p className="oxide-hero-sub">
                <strong>
                  180+ builds. 40+ clients. 9 countries. zero fluff.
                </strong>{" "}
                i build the automation layer between you and your next hire — so
                the work happens with or without you at the keyboard.
              </p>
            </GrainReveal>
            <GrainReveal delay={0.22}>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="oxide-cta-primary"
                aria-label="Book a 30-minute discovery call"
              >
                book 30 minutes
              </a>
            </GrainReveal>
          </div>

          <div className="oxide-hero-img-col">
            <DuotoneImg
              src={HERO_IMG}
              alt="Waseem Nasir, founder of SkynetLabs, arms crossed"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </section>

        {/* ── Ticker ── */}
        <TickerRail />

        {/* ── Stats ── */}
        <section className="oxide-stats-section" aria-label="By the numbers">
          <p className="oxide-stats-label">// proof, not promise</p>
          <div className="oxide-stats-grid">
            {STATS.map((s) => (
              <StatCard key={s.label} val={s.val} label={s.label} />
            ))}
          </div>
        </section>

        {/* ── Services ── */}
        <section
          className="oxide-services-section"
          aria-labelledby="services-heading"
        >
          <div className="oxide-section-header">
            <span className="oxide-section-tag">// what i build</span>
            <h2 id="services-heading" className="oxide-section-h2">
              systems
            </h2>
          </div>
          <div className="oxide-services-list" role="list">
            {SERVICES.map((svc) => (
              <GrainReveal key={svc.tag}>
                <div className="oxide-service-row" role="listitem">
                  <span className="oxide-service-tag">{svc.tag}</span>
                  <span className="oxide-service-title">{svc.title}</span>
                  <p className="oxide-service-body">{svc.body}</p>
                </div>
              </GrainReveal>
            ))}
          </div>
        </section>

        {/* ── Wide editorial strip ── */}
        <div className="oxide-editorial-strip" aria-hidden="true">
          <DuotoneImg
            src="CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg"
            alt="Working across dual laptops with analytics dashboards"
            style={{ width: "100%", height: "100%" }}
          />
          <div className="oxide-editorial-text-overlay">
            <p>
              built for those who can't afford to <em>wait</em> on manual.
            </p>
          </div>
        </div>

        {/* ── Work ── */}
        <section className="oxide-work-section" aria-labelledby="work-heading">
          <div className="oxide-section-header">
            <span className="oxide-section-tag">// selected output</span>
            <h2 id="work-heading" className="oxide-section-h2">
              work
            </h2>
          </div>

          {/* Photo grid */}
          <div className="oxide-work-spread">
            {WORK_IMGS.map((img, i) => (
              <GrainReveal key={img} delay={i * 0.06}>
                <div className="oxide-work-cell">
                  <DuotoneImg
                    src={img}
                    alt={`Work photo ${i + 1}: ${img.replace(/-/g, " ").replace(".jpg", "")}`}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </GrainReveal>
            ))}
          </div>

          {/* Work list */}
          <div className="oxide-work-list" role="list">
            {WORK.map((w) => (
              <GrainReveal key={w.label}>
                <div className="oxide-work-list-row" role="listitem">
                  <span className="oxide-work-list-label">{w.label}</span>
                  <span className="oxide-work-list-tag">{w.tag}</span>
                </div>
              </GrainReveal>
            ))}
          </div>
        </section>

        {/* ── Knockout heading strip ── */}
        <section
          style={{
            background: PALETTE.bg,
            padding: "80px 48px",
            overflow: "hidden",
          }}
          aria-hidden="true"
        >
          <KnockoutHeading>oxide print</KnockoutHeading>
        </section>

        {/* ── About ── */}
        <section
          className="oxide-about-section"
          aria-labelledby="about-heading"
        >
          {/* Photo collage */}
          <div className="oxide-about-photos">
            {ABOUT_IMGS.map((img, i) => (
              <GrainReveal key={img} delay={i * 0.08}>
                <div className="oxide-about-photo">
                  <DuotoneImg
                    src={img}
                    alt={`About photo: ${img.replace(/-/g, " ").replace(".jpg", "")}`}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </GrainReveal>
            ))}
          </div>

          {/* Copy */}
          <GrainReveal>
            <div className="oxide-about-copy">
              <h2 id="about-heading">
                independent
                <br />
                <span>founder.</span>
                <br />
                not an agency.
              </h2>
              <p>
                i'm <strong>waseem nasir</strong>, the person who actually
                builds what you commission. no account managers, no handoff to a
                junior. nine years of shipping — from lahore to bali, coworking
                spaces to rooftop cafes.
              </p>
              <p>
                i started <strong>skynetlabs</strong> in 2019 because i kept
                seeing the same problem: businesses drowning in busywork that a
                well-built system could handle at 2am without a salary. that's
                still the whole point.
              </p>
              <p>
                stack:{" "}
                <strong>
                  n8n · next.js · openai · whatsapp biz api · aeo/seo
                </strong>
                . if it touches automation, i've probably built it.
              </p>
              <div className="oxide-about-meta">
                <a
                  href="https://skynetjoe.com/discovery-call"
                  aria-label="Book a discovery call with Waseem"
                >
                  → book a call
                </a>
                <a
                  href="https://github.com/waseemnasir2k26"
                  aria-label="Waseem on GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/waseemnasir2k26
                </a>
              </div>
            </div>
          </GrainReveal>
        </section>

        {/* ── Second editorial strip ── */}
        <div className="oxide-editorial-strip" aria-hidden="true">
          <DuotoneImg
            src="TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
            alt="Waseem at Nusa Penida cliffs, arms spread wide"
            style={{ width: "100%", height: "100%" }}
          />
          <div className="oxide-editorial-text-overlay">
            <p>
              remote from bali. reliable across <em>9 countries</em>.
            </p>
          </div>
        </div>

        {/* ── CTA ── */}
        <section className="oxide-cta-section" aria-labelledby="cta-heading">
          <GrainReveal>
            <p className="oxide-cta-tag">// ready to strip the manual?</p>
            <h2 id="cta-heading" className="oxide-cta-headline">
              let's build your
              <br />
              automation layer.
            </h2>
            <p className="oxide-cta-sub">
              30 minutes. no deck. no pitch. just an honest look at where your
              ops are leaking.
            </p>
            <div className="oxide-cta-actions">
              <a
                href="https://skynetjoe.com/discovery-call"
                className="oxide-cta-primary"
                aria-label="Book a 30-minute discovery call with Waseem"
              >
                book 30 minutes
              </a>
              <a
                href="https://github.com/waseemnasir2k26"
                className="oxide-cta-ghost"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Waseem's work on GitHub"
              >
                see the code
              </a>
            </div>
          </GrainReveal>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="oxide-footer" role="contentinfo">
        <span className="oxide-footer-left">
          skynetlabs · waseem nasir ·
          <a href="https://skynetjoe.com/discovery-call">skynetjoe.com</a>
        </span>
        <span className="oxide-footer-right">oxide print — design 21 / 50</span>
      </footer>
    </div>
  );
}
