"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "framer-motion";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────
   DESIGN 01 — International Typographic
   Swiss / International Style · Müller-Brockmann grid
   palette: #F4F2EC bg · #0A0A0A text · #E5251A accent · #1A1AFF accent2
   fonts:   Archivo 500/900 · Inter 400/500 · Space Mono 400
───────────────────────────────────────────────────────── */

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Archivo:wght@500;900&family=Inter:wght@400;500&family=Space+Mono:wght@400&display=swap";

const CTA = "https://skynetjoe.com/discovery-call";
const GITHUB = "https://github.com/waseemnasir2k26";

const SERVICES = [
  {
    no: "01",
    title: "AI Automation",
    body: "n8n pipelines that kill dead follow-ups, missed leads, manual hand-offs. Runs overnight. Scales sideways.",
  },
  {
    no: "02",
    title: "Next.js Builds",
    body: "Production-grade web systems. SSR, edge-ready, sub-2s LCP. Not themes—architecture.",
  },
  {
    no: "03",
    title: "AEO Systems",
    body: "Answer Engine Optimisation. Your brand cited in GPT-4, Perplexity, Gemini. Structured data done right.",
  },
  {
    no: "04",
    title: "WhatsApp & Voice Bots",
    body: "AI receptionists that qualify, book, and follow up. 24/7. No headcount added.",
  },
  {
    no: "05",
    title: "CRM & Ops Wiring",
    body: "GHL, Stripe, Calendly, WooCommerce—stitched into one logic layer that just works.",
  },
  {
    no: "06",
    title: "Analytics & Reporting",
    body: "Dashboards that surface what matters. Decisions in seconds, not spreadsheet hours.",
  },
];

const WORK = [
  {
    idx: "A",
    label: "FreightOps USA + SG",
    tags: ["Meta Ads", "AI Voice", "WhatsApp"],
    year: "2026",
  },
  {
    idx: "B",
    label: "Inspire Health PT",
    tags: ["Stripe Funnel", "WP Theme", "Booking"],
    year: "2026",
  },
  {
    idx: "C",
    label: "IdeaViaggi Inpsieme",
    tags: ["CPT System", "REST API", "WP Plugin"],
    year: "2026",
  },
  {
    idx: "D",
    label: "AEO Citation Engine",
    tags: ["SEO", "Structured Data", "n8n"],
    year: "2025",
  },
  {
    idx: "E",
    label: "TakyCorp Email Auto.",
    tags: ["AI Copy", "Gmail API", "OpenAI"],
    year: "2025",
  },
  {
    idx: "F",
    label: "SkynetJoe.com",
    tags: ["Next.js 14", "Framer Motion", "AEO"],
    year: "2024",
  },
];

const STATS = [
  { value: "180+", label: "Builds shipped" },
  { value: "40+", label: "Clients served" },
  { value: "9", label: "Countries" },
  { value: "2019", label: "Operating since" },
];

/* ── Count-up hook ── */
function useCountUp(target: string, inView: boolean) {
  const [display, setDisplay] = useState("0");
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!inView || reduced) {
      setDisplay(target);
      return;
    }
    const numeric = parseInt(target.replace(/\D/g, ""), 10);
    const suffix = target.replace(/[\d]/g, "");
    if (isNaN(numeric)) {
      setDisplay(target);
      return;
    }
    let frame = 0;
    const total = 50;
    const id = setInterval(() => {
      frame++;
      const pct = frame / total;
      const ease = 1 - Math.pow(1 - pct, 3);
      setDisplay(Math.round(ease * numeric) + suffix);
      if (frame >= total) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [inView, target, reduced]);
  return display;
}

/* ── Registration rule (red line draws left→right on scroll) ── */
function RegistrationRule({ delay = 0 }: { delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        height: 1,
        background: "#E5251A",
        overflow: "hidden",
        margin: "0",
      }}
    >
      <motion.div
        initial={{ scaleX: reduced ? 1 : 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          background: "#E5251A",
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const display = useCountUp(value, inView);
  return (
    <div ref={ref} className="d01-stat-card">
      <span className="d01-stat-value">{display}</span>
      <span className="d01-stat-label">{label}</span>
    </div>
  );
}

/* ── Headline line snap ── */
function SnapLine({
  text,
  delay = 0,
  large = false,
}: {
  text: string;
  delay?: number;
  large?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const reduced = useReducedMotion();
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ y: reduced ? 0 : "110%", opacity: reduced ? 1 : 0 }}
        animate={{ y: inView ? "0%" : "110%", opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        className={large ? "d01-hero-line" : "d01-sub-line"}
      >
        {text}
      </motion.div>
    </div>
  );
}

/* ── Main component ── */
export default function Design01() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const reduced = useReducedMotion();

  return (
    <div className="root-01" ref={containerRef}>
      {/* ── scoped styles ── */}
      <style>{`
        @import url('${FONT_URL}');

        .root-01 {
          font-family: 'Inter', sans-serif;
          background: #F4F2EC;
          color: #0A0A0A;
          min-height: 100vh;
          position: relative;
          z-index: 2;
        }

        /* 12-column grid system */
        .d01-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          column-gap: 16px;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 32px;
        }

        @media (max-width: 768px) {
          .d01-grid { padding: 0 16px; column-gap: 12px; }
        }

        /* Scroll progress rail */
        .d01-progress-rail {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: rgba(10,10,10,0.08);
          z-index: 200;
        }
        .d01-progress-fill {
          height: 100%;
          background: #E5251A;
          transform-origin: left;
        }

        /* NAV */
        .d01-nav {
          position: sticky;
          top: 0;
          background: #F4F2EC;
          border-bottom: 1px solid #0A0A0A;
          z-index: 100;
          padding: 0;
        }
        .d01-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 52px;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .d01-nav-logo {
          font-family: 'Archivo', sans-serif;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0A0A0A;
          text-decoration: none;
        }
        .d01-nav-meta {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #6E6E6E;
          letter-spacing: 0.04em;
        }
        .d01-nav-cta {
          font-family: 'Archivo', sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #F4F2EC;
          background: #0A0A0A;
          padding: 8px 16px;
          text-decoration: none;
          display: inline-block;
          transition: background 0.15s;
        }
        .d01-nav-cta:hover { background: #E5251A; }
        .d01-nav-cta:focus-visible { outline: 2px solid #E5251A; outline-offset: 2px; }

        /* HERO */
        .d01-hero {
          border-bottom: 1px solid #0A0A0A;
          padding: 80px 0 0;
        }
        .d01-hero-col-main {
          grid-column: 1 / 9;
        }
        .d01-hero-col-meta {
          grid-column: 9 / 13;
          padding-top: 8px;
          border-left: 1px solid #0A0A0A;
          padding-left: 24px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-bottom: 48px;
        }
        .d01-hero-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #E5251A;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .d01-hero-line {
          font-family: 'Archivo', sans-serif;
          font-weight: 900;
          font-size: clamp(56px, 7.5vw, 108px);
          line-height: 0.92;
          letter-spacing: -0.025em;
          color: #0A0A0A;
        }
        .d01-hero-sub {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 13px;
          line-height: 1.6;
          color: #6E6E6E;
          margin-top: 32px;
          max-width: 220px;
        }
        .d01-hero-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #6E6E6E;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .d01-hero-bottom {
          grid-column: 1 / 13;
          border-top: 1px solid #0A0A0A;
          margin-top: 48px;
          display: flex;
          align-items: center;
          gap: 0;
          height: 52px;
        }
        .d01-hero-tag {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6E6E6E;
          padding: 0 24px 0 0;
          border-right: 1px solid rgba(10,10,10,0.15);
          margin-right: 24px;
          white-space: nowrap;
        }
        .d01-hero-tag:last-child { border-right: none; }

        .d01-sub-line {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: clamp(14px, 1.5vw, 18px);
          line-height: 1.5;
          color: #0A0A0A;
        }

        /* STATS */
        .d01-stats-section {
          border-bottom: 1px solid #0A0A0A;
          padding: 0;
        }
        .d01-stat-card {
          padding: 40px 0 36px;
          border-right: 1px solid #0A0A0A;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .d01-stat-card:last-child { border-right: none; }
        .d01-stat-value {
          font-family: 'Archivo', sans-serif;
          font-weight: 900;
          font-size: clamp(40px, 5vw, 72px);
          letter-spacing: -0.03em;
          line-height: 1;
          color: #0A0A0A;
        }
        .d01-stat-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6E6E6E;
        }
        .d01-stat-col { padding-right: 24px; }

        /* SERVICES */
        .d01-services-section {
          border-bottom: 1px solid #0A0A0A;
          padding: 80px 0 0;
        }
        .d01-section-no {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #E5251A;
          letter-spacing: 0.12em;
          margin-bottom: 48px;
        }
        .d01-section-title {
          font-family: 'Archivo', sans-serif;
          font-weight: 900;
          font-size: clamp(32px, 4vw, 56px);
          letter-spacing: -0.02em;
          line-height: 0.95;
          color: #0A0A0A;
          margin-bottom: 64px;
        }
        .d01-service-row {
          grid-column: 1 / 13;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          column-gap: 16px;
          border-top: 1px solid rgba(10,10,10,0.15);
          padding: 24px 0;
          align-items: baseline;
        }
        .d01-service-no {
          grid-column: 1 / 2;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #E5251A;
          letter-spacing: 0.1em;
        }
        .d01-service-name {
          grid-column: 2 / 6;
          font-family: 'Archivo', sans-serif;
          font-weight: 900;
          font-size: clamp(16px, 1.8vw, 22px);
          letter-spacing: -0.01em;
          color: #0A0A0A;
        }
        .d01-service-body {
          grid-column: 6 / 13;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          line-height: 1.6;
          color: #6E6E6E;
        }

        /* WORK */
        .d01-work-section {
          border-bottom: 1px solid #0A0A0A;
          padding: 80px 0 0;
        }
        .d01-work-head-col {
          grid-column: 1 / 5;
          padding-bottom: 64px;
        }
        .d01-work-intro-col {
          grid-column: 5 / 13;
          padding-bottom: 64px;
          padding-top: 8px;
        }
        .d01-work-intro {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: #6E6E6E;
          max-width: 480px;
        }
        .d01-work-list { grid-column: 1 / 13; }
        .d01-work-item {
          display: grid;
          grid-template-columns: 40px 1fr auto auto;
          gap: 0 24px;
          align-items: center;
          border-top: 1px solid rgba(10,10,10,0.15);
          padding: 18px 0;
          transition: background 0.1s;
        }
        .d01-work-item:last-child { border-bottom: 1px solid rgba(10,10,10,0.15); }
        .d01-work-item:hover { background: rgba(229,37,26,0.04); }
        .d01-work-idx {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #E5251A;
          letter-spacing: 0.1em;
        }
        .d01-work-name {
          font-family: 'Archivo', sans-serif;
          font-weight: 900;
          font-size: clamp(15px, 1.5vw, 19px);
          letter-spacing: -0.01em;
          color: #0A0A0A;
        }
        .d01-work-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .d01-tag {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6E6E6E;
          border: 1px solid rgba(10,10,10,0.2);
          padding: 3px 7px;
        }
        .d01-work-year {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #6E6E6E;
          letter-spacing: 0.06em;
          text-align: right;
        }

        /* ABOUT */
        .d01-about-section {
          border-bottom: 1px solid #0A0A0A;
          padding: 80px 0 0;
        }
        .d01-about-img-col {
          grid-column: 1 / 5;
          position: relative;
        }
        .d01-about-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top;
          display: block;
          filter: grayscale(8%);
        }
        .d01-reg-mark {
          position: absolute;
          top: -16px; right: -16px;
          width: 32px; height: 32px;
          border: 1px solid #E5251A;
          border-radius: 50%;
        }
        .d01-reg-cross-h {
          position: absolute;
          top: 50%; left: -8px; right: -8px;
          height: 1px;
          background: #E5251A;
        }
        .d01-reg-cross-v {
          position: absolute;
          left: 50%; top: -8px; bottom: -8px;
          width: 1px;
          background: #E5251A;
        }
        .d01-about-text-col {
          grid-column: 5 / 13;
          padding: 0 0 80px 48px;
          border-left: 1px solid #0A0A0A;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .d01-about-role {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #E5251A;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .d01-about-name {
          font-family: 'Archivo', sans-serif;
          font-weight: 900;
          font-size: clamp(36px, 4.5vw, 64px);
          letter-spacing: -0.025em;
          line-height: 0.93;
          color: #0A0A0A;
          margin-bottom: 32px;
        }
        .d01-about-body {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          line-height: 1.65;
          color: #6E6E6E;
          max-width: 480px;
          margin-bottom: 40px;
        }
        .d01-about-locs {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        .d01-about-loc {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6E6E6E;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .d01-loc-dot {
          width: 6px; height: 6px;
          background: #E5251A;
          flex-shrink: 0;
        }

        /* PHOTO GRID */
        .d01-photo-grid-section {
          border-bottom: 1px solid #0A0A0A;
          padding: 0;
        }
        .d01-photo-grid {
          grid-column: 1 / 13;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .d01-photo-cell {
          aspect-ratio: 1/1;
          overflow: hidden;
          border-right: 1px solid #0A0A0A;
          position: relative;
        }
        .d01-photo-cell:last-child { border-right: none; }
        .d01-photo-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          display: block;
          transition: transform 0.4s ease;
          filter: grayscale(5%);
        }
        .d01-photo-cell:hover img { transform: scale(1.04); }

        /* CTA */
        .d01-cta-section {
          border-bottom: 1px solid #0A0A0A;
          background: #0A0A0A;
          padding: 80px 0;
        }
        .d01-cta-col {
          grid-column: 1 / 8;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .d01-cta-aside {
          grid-column: 9 / 13;
          border-left: 1px solid rgba(244,242,236,0.12);
          padding-left: 32px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 16px;
        }
        .d01-cta-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #E5251A;
        }
        .d01-cta-headline {
          font-family: 'Archivo', sans-serif;
          font-weight: 900;
          font-size: clamp(36px, 5vw, 72px);
          letter-spacing: -0.025em;
          line-height: 0.92;
          color: #F4F2EC;
        }
        .d01-cta-sub {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(244,242,236,0.5);
          max-width: 320px;
        }
        .d01-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: 'Archivo', sans-serif;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #0A0A0A;
          background: #E5251A;
          padding: 16px 32px;
          text-decoration: none;
          align-self: flex-start;
          transition: background 0.15s, color 0.15s;
        }
        .d01-cta-btn:hover { background: #F4F2EC; }
        .d01-cta-btn:focus-visible { outline: 2px solid #F4F2EC; outline-offset: 2px; }
        .d01-cta-btn-arrow {
          font-size: 18px;
          line-height: 1;
          display: inline-block;
          transition: transform 0.15s;
        }
        .d01-cta-btn:hover .d01-cta-btn-arrow { transform: translateX(4px); }
        .d01-aside-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(244,242,236,0.3);
        }
        .d01-aside-val {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: rgba(244,242,236,0.7);
        }
        .d01-aside-val a {
          color: rgba(244,242,236,0.7);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .d01-aside-val a:hover { color: #E5251A; }

        /* FOOTER */
        .d01-footer {
          padding: 24px 0;
          background: #F4F2EC;
        }
        .d01-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .d01-footer-left {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #6E6E6E;
          letter-spacing: 0.06em;
        }
        .d01-footer-right {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #6E6E6E;
          letter-spacing: 0.06em;
          display: flex;
          gap: 24px;
        }
        .d01-footer-right a {
          color: #6E6E6E;
          text-decoration: none;
        }
        .d01-footer-right a:hover { color: #E5251A; }

        /* mobile */
        @media (max-width: 768px) {
          .d01-hero-col-main { grid-column: 1 / 13; }
          .d01-hero-col-meta { grid-column: 1 / 13; border-left: none; padding-left: 0; border-top: 1px solid #0A0A0A; padding-top: 24px; }
          .d01-service-row { grid-template-columns: 40px 1fr; row-gap: 8px; }
          .d01-service-name { grid-column: 2 / 3; }
          .d01-service-body { grid-column: 1 / 3; margin-top: 8px; }
          .d01-about-img-col { grid-column: 1 / 13; }
          .d01-about-text-col { grid-column: 1 / 13; border-left: none; padding-left: 0; padding-top: 32px; }
          .d01-work-head-col { grid-column: 1 / 13; padding-bottom: 16px; }
          .d01-work-intro-col { grid-column: 1 / 13; padding-bottom: 32px; }
          .d01-work-item { grid-template-columns: 32px 1fr auto; }
          .d01-work-year { display: none; }
          .d01-work-tags { display: none; }
          .d01-photo-grid { grid-template-columns: repeat(2, 1fr); }
          .d01-photo-cell { border-bottom: 1px solid #0A0A0A; }
          .d01-photo-cell:nth-child(2n) { border-right: none; }
          .d01-cta-col { grid-column: 1 / 13; }
          .d01-cta-aside { grid-column: 1 / 13; border-left: none; border-top: 1px solid rgba(244,242,236,0.12); padding-left: 0; padding-top: 32px; }
          .d01-stat-card { grid-column: span 6 !important; border-right: 1px solid #0A0A0A !important; }
          .d01-stat-card:nth-child(2n) { border-right: none !important; }
          .d01-hero-tag { font-size: 9px; padding: 0 12px 0 0; margin-right: 12px; }
          .d01-nav-meta { display: none; }
        }

        /* skip link */
        .d01-skip {
          position: absolute;
          left: -999px;
          top: -999px;
        }
        .d01-skip:focus {
          left: 8px; top: 8px;
          background: #E5251A;
          color: #fff;
          padding: 8px 16px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          z-index: 9999;
          text-decoration: none;
        }
      `}</style>

      {/* Skip link */}
      <a href="#main-content" className="d01-skip">
        Skip to content
      </a>

      {/* Scroll progress */}
      <div className="d01-progress-rail" aria-hidden="true">
        <motion.div
          className="d01-progress-fill"
          style={{ scaleX: progressWidth, transformOrigin: "left" }}
        />
      </div>

      {/* NAV */}
      <nav className="d01-nav" aria-label="Primary navigation">
        <div className="d01-nav-inner">
          <a href="/" className="d01-nav-logo" aria-label="Waseem Nasir – home">
            WN — SkynetLabs
          </a>
          <span className="d01-nav-meta">
            Design 01 / International Typographic
          </span>
          <a
            href={CTA}
            className="d01-nav-cta"
            aria-label="Book a discovery call"
          >
            Book a call
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header className="d01-hero" id="main-content">
        <div className="d01-grid">
          <div className="d01-hero-col-main">
            <p
              className="d01-hero-eyebrow"
              aria-label="Section: AI Systems Builder"
            >
              <span style={{ fontFamily: "'Space Mono', monospace" }}>D01</span>
              {" — "}AI Systems Builder
            </p>
            <h1 style={{ margin: 0 }}>
              <SnapLine text="I build the" delay={0} large />
              <SnapLine text="systems that" delay={0.06} large />
              <SnapLine text="run the business" delay={0.12} large />
              <SnapLine text="while you sleep." delay={0.18} large />
            </h1>
          </div>
          <div className="d01-hero-col-meta">
            <p className="d01-hero-label">Founded</p>
            <p
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(24px,3vw,40px)",
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              2019
            </p>
            <p className="d01-hero-label">Discipline</p>
            <div style={{ overflow: "hidden", marginBottom: 24 }}>
              <motion.p
                className="d01-hero-sub"
                initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                n8n · Next.js · AEO · WhatsApp bots · Voice AI · CRM wiring
              </motion.p>
            </div>
            <p className="d01-hero-label">Location</p>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "#6E6E6E",
                lineHeight: 1.6,
              }}
            >
              Bali / Lahore
              <br />
              Remote, worldwide
            </p>
          </div>
          <div className="d01-hero-bottom">
            {[
              "180+ builds",
              "40+ clients",
              "9 countries",
              "Operating since 2019",
            ].map((t) => (
              <span key={t} className="d01-hero-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* RED RULE 1 */}
      <RegistrationRule delay={0.2} />

      {/* STATS */}
      <section className="d01-stats-section" aria-label="Key numbers">
        <div className="d01-grid">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="d01-stat-card"
              style={{ gridColumn: `${1 + i * 3} / ${4 + i * 3}` }}
            >
              <StatCard value={s.value} label={s.label} />
            </div>
          ))}
        </div>
      </section>

      {/* RED RULE 2 */}
      <RegistrationRule delay={0} />

      {/* SERVICES */}
      <section className="d01-services-section" aria-label="Services">
        <div className="d01-grid">
          <div style={{ gridColumn: "1 / 5" }}>
            <p className="d01-section-no">§ 02 — What I Build</p>
            <h2 className="d01-section-title">
              Six systems.
              <br />
              One operator.
            </h2>
          </div>
          <div
            style={{ gridColumn: "5 / 13", paddingTop: 8, paddingBottom: 64 }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 15,
                lineHeight: 1.65,
                color: "#6E6E6E",
                maxWidth: 480,
                marginTop: 48,
              }}
            >
              Every engagement is direct. No account managers. No junior devs.
              Waseem designs, builds, and ships every system himself.
            </p>
          </div>
          {SERVICES.map((s) => (
            <motion.div
              key={s.no}
              className="d01-service-row"
              initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="d01-service-no">{s.no}</span>
              <span className="d01-service-name">{s.title}</span>
              <span className="d01-service-body">{s.body}</span>
            </motion.div>
          ))}
          <div style={{ gridColumn: "1 / 13", height: 64 }} />
        </div>
      </section>

      {/* RED RULE 3 */}
      <RegistrationRule delay={0} />

      {/* SELECTED WORK */}
      <section className="d01-work-section" aria-label="Selected work">
        <div className="d01-grid">
          <div className="d01-work-head-col">
            <p className="d01-section-no">§ 03 — Selected Work</p>
            <h2 className="d01-section-title" style={{ marginBottom: 0 }}>
              180+ builds.
              <br />
              Six here.
            </h2>
          </div>
          <div className="d01-work-intro-col">
            <p className="d01-work-intro">
              Clients across USA, Singapore, Italy, Pakistan, Australia. Every
              system ships production-ready. No handholding required after.
            </p>
          </div>
          <div className="d01-work-list">
            {WORK.map((w, i) => (
              <motion.div
                key={w.idx}
                className="d01-work-item"
                initial={{ opacity: reduced ? 1 : 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <span className="d01-work-idx">{w.idx}</span>
                <span className="d01-work-name">{w.label}</span>
                <div className="d01-work-tags">
                  {w.tags.map((t) => (
                    <span key={t} className="d01-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="d01-work-year">{w.year}</span>
              </motion.div>
            ))}
          </div>
          <div style={{ gridColumn: "1 / 13", height: 80 }} />
        </div>
      </section>

      {/* RED RULE 4 */}
      <RegistrationRule delay={0} />

      {/* PHOTO STRIP */}
      <section
        className="d01-photo-grid-section"
        aria-label="Photo documentation"
      >
        <div className="d01-grid" style={{ padding: 0, maxWidth: "100%" }}>
          <div className="d01-photo-grid">
            {[
              {
                src: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
                alt: "Waseem working on laptop at Bali terrace cafe, sunglasses, latte nearby",
              },
              {
                src: "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
                alt: "Waseem focused on phone at Bali rice terrace, powerbank in hand",
              },
              {
                src: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
                alt: "Waseem at rooftop cafe with laptop, mountains and clouds behind",
              },
              {
                src: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
                alt: "Waseem typing on backlit keyboard at night cafe, candid shot",
              },
            ].map((img, i) => (
              <motion.div
                key={img.src}
                className="d01-photo-cell"
                initial={{ opacity: reduced ? 1 : 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <img src={`/img/pro/${img.src}`} alt={img.alt} loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RED RULE 5 */}
      <RegistrationRule delay={0} />

      {/* ABOUT */}
      <section className="d01-about-section" aria-label="About Waseem Nasir">
        <div className="d01-grid" style={{ alignItems: "start" }}>
          <div className="d01-about-img-col">
            {/* Registration mark detail */}
            <div className="d01-reg-mark" aria-hidden="true">
              <div className="d01-reg-cross-h" />
              <div className="d01-reg-cross-v" />
            </div>
            <motion.img
              src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
              alt="Waseem Nasir, arms crossed, confident pose at table wearing sunglasses"
              className="d01-about-img"
              loading="lazy"
              initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 1.03 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
            {/* Second portrait below */}
            <motion.img
              src="/img/pro/WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg"
              alt="Waseem Nasir giving thumbs up with a client at a cafe"
              style={{
                width: "100%",
                display: "block",
                marginTop: 1,
                objectFit: "cover",
                height: 200,
                objectPosition: "top",
                filter: "grayscale(5%)",
              }}
              loading="lazy"
              initial={{ opacity: reduced ? 1 : 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            />
          </div>

          <div className="d01-about-text-col">
            <p className="d01-about-role">§ 04 — Founder, SkynetLabs</p>
            <h2 className="d01-about-name">
              Waseem
              <br />
              Nasir
            </h2>
            <p className="d01-about-body">
              Independent AI systems builder. I work directly with founders,
              operators, and growth teams to automate the ops layer — lead
              capture, follow-up sequences, booking flows, reporting pipelines.
              Everything runs in the background after handoff.
            </p>
            <p className="d01-about-body" style={{ marginBottom: 40 }}>
              Seven years operating remotely. 180+ systems shipped across 9
              countries. n8n, Next.js, OpenAI, WhatsApp Cloud API, GHL —
              whatever the job needs.
            </p>
            <div className="d01-about-locs">
              {["Bali, Indonesia", "Lahore, Pakistan", "Remote worldwide"].map(
                (l) => (
                  <span key={l} className="d01-about-loc">
                    <span className="d01-loc-dot" aria-hidden="true" />
                    {l}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Second photo row in about section */}
        <div className="d01-grid" style={{ marginTop: 0 }}>
          <div
            style={{
              gridColumn: "1 / 13",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              borderTop: "1px solid #0A0A0A",
            }}
          >
            {[
              {
                src: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                alt: "Waseem at Nusa Penida cliffs with arms spread",
              },
              {
                src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                alt: "Waseem on hilltop with backpack and sunglasses, city vista behind",
              },
              {
                src: "PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg",
                alt: "Waseem in beige tracksuit, hands in pockets, glass building behind",
              },
            ].map((img, i) => (
              <motion.div
                key={img.src}
                style={{
                  overflow: "hidden",
                  borderRight: i < 2 ? "1px solid #0A0A0A" : "none",
                  aspectRatio: "1/1",
                }}
                initial={{ opacity: reduced ? 1 : 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <img
                  src={`/img/pro/${img.src}`}
                  alt={img.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                    display: "block",
                    filter: "grayscale(5%)",
                    transition: "transform 0.4s ease",
                  }}
                  loading="lazy"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform =
                      "scale(1.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform =
                      "scale(1)";
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RED RULE 6 */}
      <RegistrationRule delay={0} />

      {/* ADDITIONAL PHOTOS */}
      <section
        aria-label="Work documentation"
        style={{ borderBottom: "1px solid #0A0A0A" }}
      >
        <div className="d01-grid" style={{ padding: 0, maxWidth: "100%" }}>
          <div
            style={{
              gridColumn: "1 / 13",
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 0,
            }}
          >
            {[
              {
                src: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                alt: "Waseem smiling at rooftop cafe with laptop and dragonfruit smoothie",
                wide: true,
              },
              {
                src: "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
                alt: "Waseem in black prince coat on balcony with sunglasses",
              },
              {
                src: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                alt: "Waseem at Bali coworking group meetup",
              },
              {
                src: "LIFESTYLE-2026-05-18-black-bandhgala-sunglasses-phone-cafe-table.jpg",
                alt: "Waseem in black bandhgala with sunglasses at cafe table with phone",
              },
            ].map((img, i) => (
              <div
                key={img.src}
                style={{
                  overflow: "hidden",
                  borderRight: i < 3 ? "1px solid #0A0A0A" : "none",
                  height: 280,
                }}
              >
                <img
                  src={`/img/pro/${img.src}`}
                  alt={img.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                    display: "block",
                    filter: "grayscale(5%)",
                  }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RED RULE 7 */}
      <RegistrationRule delay={0} />

      {/* CTA */}
      <section className="d01-cta-section" aria-label="Contact and booking">
        <div className="d01-grid">
          <div className="d01-cta-col">
            <p className="d01-cta-eyebrow">§ 05 — Start here</p>
            <h2 className="d01-cta-headline">
              <SnapLine text="One call." delay={0} />
              <SnapLine text="One operator." delay={0.06} />
              <SnapLine text="No hand-offs." delay={0.12} />
            </h2>
            <p className="d01-cta-sub">
              30 minutes. You describe the problem. I tell you exactly what to
              build and what it costs. No pitch deck.
            </p>
            <a
              href={CTA}
              className="d01-cta-btn"
              aria-label="Book a 30-minute discovery call with Waseem Nasir"
            >
              Book discovery call
              <span className="d01-cta-btn-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
          <div className="d01-cta-aside">
            <div>
              <p className="d01-aside-label">GitHub</p>
              <p className="d01-aside-val">
                <a href={GITHUB} target="_blank" rel="noopener noreferrer">
                  github.com/waseemnasir2k26
                </a>
              </p>
            </div>
            <div>
              <p className="d01-aside-label">Email</p>
              <p className="d01-aside-val">
                <a href="mailto:waseembali2k26@gmail.com">
                  waseembali2k26@gmail.com
                </a>
              </p>
            </div>
            <div>
              <p className="d01-aside-label">Time zones</p>
              <p className="d01-aside-val">UTC+5 / UTC+8 · Async worldwide</p>
            </div>
            <div>
              <p className="d01-aside-label">Response</p>
              <p className="d01-aside-val">Within 24 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="d01-footer" role="contentinfo">
        <div className="d01-grid">
          <div className="d01-footer-inner" style={{ gridColumn: "1 / 13" }}>
            <span className="d01-footer-left">
              © 2019 – 2026 SkynetLabs · Waseem Nasir
            </span>
            <div className="d01-footer-right">
              <a href={CTA}>Discovery Call</a>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a
                href="https://skynetjoe.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                SkynetJoe
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
