"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "framer-motion";

/* ─── SPOTLIGHT CURSOR STATE ─── */
type Pos = { x: number; y: number };

const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(#g)' opacity='0.06'/></svg>`;

/* ─── REDACT REVEAL ─── */
function RedactLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <span
      ref={ref}
      className="d29-redact-wrap"
      style={{ position: "relative", display: "inline" }}
    >
      {children}
      <motion.span
        aria-hidden="true"
        className="d29-redact-bar"
        initial={{ scaleX: 1, transformOrigin: "left" }}
        animate={inView || reduced ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{
          duration: reduced ? 0 : 0.7,
          delay: reduced ? 0 : delay,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{
          position: "absolute",
          inset: "0 -2px",
          background: "#C8A24B",
          display: "block",
          transformOrigin: "left center",
        }}
      />
    </span>
  );
}

/* ─── CASE FILE ENTRY ─── */
function CaseEntry({
  code,
  title,
  tags,
  status,
  delay = 0,
}: {
  code: string;
  title: string;
  tags: string[];
  status: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView || reduced ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: reduced ? 0 : delay,
        ease: "easeOut",
      }}
      className="d29-case-entry"
    >
      <span className="d29-case-code">{code}</span>
      <div className="d29-case-body">
        <p className="d29-case-title">{title}</p>
        <div className="d29-case-tags">
          {tags.map((t) => (
            <span key={t} className="d29-tag">
              {t}
            </span>
          ))}
        </div>
      </div>
      <span className="d29-case-status">{status}</span>
    </motion.div>
  );
}

/* ─── STAT BLOCK ─── */
function StatBlock({
  value,
  label,
  delay = 0,
}: {
  value: string;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className="d29-stat"
      initial={{ opacity: 0, y: 20 }}
      animate={inView || reduced ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: reduced ? 0 : delay }}
    >
      <span className="d29-stat-value">{value}</span>
      <span className="d29-stat-label">{label}</span>
    </motion.div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function NoirDossier() {
  const reduced = useReducedMotion();
  const [cursor, setCursor] = useState<Pos>({ x: -999, y: -999 });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Spotlight cursor */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    setMounted(true);
    if (!reduced) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, reduced]);

  /* Scroll progress */
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,1,500;9..144,0,600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');

        .root-29 {
          font-family: 'Inter', sans-serif;
          background: #0A0A0B;
          color: #EDEAE3;
          min-height: 100vh;
          position: relative;
          z-index: 2;
          overflow-x: hidden;
          cursor: none;
        }

        /* ── CUSTOM CURSOR ── */
        .d29-cursor {
          position: fixed;
          top: 0; left: 0;
          width: 20px; height: 20px;
          border: 1px solid #C8A24B;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          mix-blend-mode: exclusion;
          transition: transform 0.08s ease;
        }
        .d29-cursor-dot {
          position: fixed;
          top: 0; left: 0;
          width: 4px; height: 4px;
          background: #C8A24B;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
        }

        /* ── GRAIN OVERLAY ── */
        .d29-grain {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}");
          background-repeat: repeat;
          background-size: 200px 200px;
          pointer-events: none;
          z-index: 9990;
          opacity: 0.6;
          mix-blend-mode: overlay;
        }

        /* ── SPOTLIGHT ── */
        .d29-spotlight {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          transition: background 0.05s;
        }

        /* ── PROGRESS RAIL ── */
        .d29-progress {
          position: fixed;
          top: 0; left: 0;
          height: 2px;
          background: #C8A24B;
          z-index: 9998;
          transform-origin: left;
        }

        /* ── NAV ── */
        .d29-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 9000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 48px;
          border-bottom: 1px solid rgba(200,162,75,0.15);
          background: rgba(10,10,11,0.88);
          backdrop-filter: blur(8px);
        }
        .d29-nav-logo {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #C8A24B;
          text-transform: uppercase;
        }
        .d29-nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .d29-nav-links a {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: #6E6A63;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .d29-nav-links a:hover,
        .d29-nav-links a:focus-visible {
          color: #EDEAE3;
          outline: none;
        }
        .d29-nav-cta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: #0A0A0B;
          background: #C8A24B;
          padding: 8px 18px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 0.2s;
        }
        .d29-nav-cta:hover,
        .d29-nav-cta:focus-visible {
          background: #E03E1A;
          outline: none;
        }

        /* ── HERO ── */
        .d29-hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 0;
          padding-top: 80px;
          position: relative;
          overflow: hidden;
        }
        .d29-hero-left {
          padding: 80px 64px 80px 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 4;
        }
        .d29-file-stamp {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          color: #E03E1A;
          text-transform: uppercase;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .d29-file-stamp::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 1px;
          background: #E03E1A;
        }
        .d29-hero-h1 {
          font-family: 'Fraunces', serif;
          font-size: clamp(42px, 5.5vw, 76px);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #EDEAE3;
          margin: 0 0 32px;
        }
        .d29-hero-h1 .d29-dropcap {
          font-size: 1.4em;
          font-style: italic;
          float: left;
          line-height: 0.78;
          margin-right: 6px;
          margin-top: 4px;
          color: #C8A24B;
        }
        .d29-subhead {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: #6E6A63;
          line-height: 1.7;
          margin-bottom: 48px;
          max-width: 480px;
          border-left: 2px solid #C8A24B;
          padding-left: 16px;
        }
        .d29-subhead strong {
          color: #C8A24B;
        }
        .d29-hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #0A0A0B;
          background: #C8A24B;
          padding: 16px 32px;
          text-decoration: none;
          transition: background 0.2s, gap 0.2s;
          align-self: flex-start;
        }
        .d29-hero-cta:hover,
        .d29-hero-cta:focus-visible {
          background: #E03E1A;
          gap: 24px;
          outline: 2px solid #E03E1A;
          outline-offset: 2px;
        }
        .d29-hero-cta::after {
          content: '→';
        }
        .d29-hero-right {
          position: relative;
          overflow: hidden;
          background: #141416;
        }
        .d29-hero-portrait {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          filter: grayscale(0.7) contrast(1.1);
          mix-blend-mode: luminosity;
        }
        .d29-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            #0A0A0B 0%,
            transparent 30%
          ), linear-gradient(
            to top,
            #0A0A0B 0%,
            transparent 40%
          );
        }
        .d29-classified-stamp {
          position: absolute;
          bottom: 40px;
          right: 32px;
          font-family: 'Fraunces', serif;
          font-size: 13px;
          font-style: italic;
          letter-spacing: 0.3em;
          color: #E03E1A;
          border: 2px solid #E03E1A;
          padding: 8px 14px;
          transform: rotate(-12deg);
          opacity: 0.7;
          text-transform: uppercase;
        }

        /* ── DOSSIER DIVIDER ── */
        .d29-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 80px;
          margin: 0;
        }
        .d29-divider-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.24em;
          color: #C8A24B;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .d29-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(200,162,75,0.2);
        }
        .d29-divider-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #6E6A63;
        }

        /* ── PROOF SECTION ── */
        .d29-proof {
          padding: 80px 80px;
          background: #141416;
        }
        .d29-proof-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(200,162,75,0.12);
          margin-top: 48px;
        }
        .d29-stat {
          background: #141416;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .d29-stat-value {
          font-family: 'Fraunces', serif;
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 600;
          color: #C8A24B;
          line-height: 1;
        }
        .d29-stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: #6E6A63;
          text-transform: uppercase;
        }
        .d29-proof-note {
          margin-top: 48px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #6E6A63;
          line-height: 1.8;
          max-width: 640px;
          border-top: 1px solid rgba(200,162,75,0.15);
          padding-top: 24px;
        }

        /* ── SECTION LABEL ── */
        .d29-section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.24em;
          color: #C8A24B;
          text-transform: uppercase;
          margin-bottom: 32px;
        }
        .d29-section-h2 {
          font-family: 'Fraunces', serif;
          font-size: clamp(28px, 3.5vw, 48px);
          font-weight: 600;
          color: #EDEAE3;
          line-height: 1.1;
          margin: 0 0 16px;
        }

        /* ── SERVICES / INTEL ── */
        .d29-intel {
          padding: 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .d29-intel-left {}
        .d29-intel-desc {
          font-size: 15px;
          color: #6E6A63;
          line-height: 1.8;
          margin-bottom: 40px;
          max-width: 400px;
        }
        .d29-intel-list {
          list-style: none;
          margin: 0; padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .d29-intel-item {
          display: grid;
          grid-template-columns: 32px 1fr auto;
          gap: 16px;
          align-items: start;
          padding: 20px 0;
          border-bottom: 1px solid rgba(200,162,75,0.1);
        }
        .d29-intel-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #E03E1A;
          padding-top: 2px;
        }
        .d29-intel-name {
          font-size: 14px;
          color: #EDEAE3;
          font-weight: 500;
          line-height: 1.4;
        }
        .d29-intel-name span {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #6E6A63;
          margin-top: 4px;
          font-weight: 400;
        }
        .d29-intel-arrow {
          color: #C8A24B;
          font-size: 12px;
        }
        .d29-intel-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }
        .d29-intel-photos {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
        }
        .d29-intel-photo {
          aspect-ratio: 3/4;
          object-fit: cover;
          filter: grayscale(0.5) contrast(1.05);
          display: block;
        }
        .d29-intel-photo:first-child {
          grid-column: 1 / -1;
          aspect-ratio: 16/9;
        }

        /* ── CASE FILES ── */
        .d29-cases {
          padding: 80px;
          background: #141416;
        }
        .d29-cases-grid {
          margin-top: 48px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .d29-case-entry {
          display: grid;
          grid-template-columns: 80px 1fr 120px;
          gap: 24px;
          align-items: center;
          padding: 24px 0;
          border-bottom: 1px solid rgba(110,106,99,0.15);
          cursor: default;
          transition: background 0.2s;
        }
        .d29-case-entry:hover {
          background: rgba(200,162,75,0.04);
          padding-left: 8px;
        }
        .d29-case-code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #E03E1A;
          letter-spacing: 0.1em;
        }
        .d29-case-body {}
        .d29-case-title {
          font-size: 15px;
          color: #EDEAE3;
          font-weight: 500;
          margin: 0 0 8px;
        }
        .d29-case-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .d29-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          color: #6E6A63;
          border: 1px solid rgba(110,106,99,0.3);
          padding: 2px 8px;
          text-transform: uppercase;
        }
        .d29-case-status {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          color: #C8A24B;
          text-transform: uppercase;
          text-align: right;
        }

        /* ── ABOUT / SUBJECT ── */
        .d29-subject {
          padding: 80px;
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 80px;
          align-items: start;
        }
        .d29-subject-photo-wrap {
          position: relative;
        }
        .d29-subject-photo {
          width: 100%;
          display: block;
          filter: grayscale(0.4) contrast(1.1) sepia(0.1);
        }
        .d29-subject-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(10,10,11,0.85);
          padding: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          color: #6E6A63;
          text-transform: uppercase;
          border-top: 1px solid rgba(200,162,75,0.2);
        }
        .d29-subject-right {}
        .d29-subject-body {
          font-size: 16px;
          color: #EDEAE3;
          line-height: 1.85;
          margin-bottom: 32px;
        }
        .d29-subject-body em {
          font-family: 'Fraunces', serif;
          font-style: italic;
          color: #C8A24B;
        }
        .d29-subject-details {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid rgba(200,162,75,0.15);
          margin-top: 40px;
        }
        .d29-detail-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 0;
          border-bottom: 1px solid rgba(200,162,75,0.1);
        }
        .d29-detail-row:last-child {
          border-bottom: none;
        }
        .d29-detail-key {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          color: #6E6A63;
          text-transform: uppercase;
          padding: 14px 16px;
          background: rgba(200,162,75,0.04);
          border-right: 1px solid rgba(200,162,75,0.1);
        }
        .d29-detail-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #EDEAE3;
          padding: 14px 16px;
        }

        /* ── GALLERY STRIP ── */
        .d29-gallery {
          padding: 80px;
          background: #0A0A0B;
        }
        .d29-gallery-strip {
          margin-top: 48px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
        }
        .d29-gallery-cell {
          position: relative;
          overflow: hidden;
        }
        .d29-gallery-img {
          width: 100%;
          aspect-ratio: 2/3;
          object-fit: cover;
          object-position: top;
          display: block;
          filter: grayscale(0.6) contrast(1.1);
          transition: filter 0.4s, transform 0.4s;
        }
        .d29-gallery-cell:hover .d29-gallery-img {
          filter: grayscale(0.2) contrast(1.05);
          transform: scale(1.03);
        }

        /* ── CONTACT / TRANSMISSION ── */
        .d29-transmission {
          padding: 120px 80px;
          background: #141416;
          display: grid;
          grid-template-columns: 1fr 480px;
          gap: 80px;
          align-items: center;
        }
        .d29-transmission-left {}
        .d29-transmission-h2 {
          font-family: 'Fraunces', serif;
          font-size: clamp(32px, 4vw, 60px);
          font-weight: 600;
          color: #EDEAE3;
          line-height: 1.1;
          margin: 0 0 24px;
        }
        .d29-transmission-body {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #6E6A63;
          line-height: 1.9;
          max-width: 400px;
        }
        .d29-transmission-cta {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0A0A0B;
          background: #C8A24B;
          padding: 20px 40px;
          text-decoration: none;
          margin-top: 40px;
          transition: background 0.2s, gap 0.2s;
        }
        .d29-transmission-cta:hover,
        .d29-transmission-cta:focus-visible {
          background: #E03E1A;
          gap: 24px;
          outline: 2px solid #E03E1A;
          outline-offset: 2px;
        }
        .d29-transmission-cta::after { content: '→'; }
        .d29-transmission-right {
          background: #0A0A0B;
          border: 1px solid rgba(200,162,75,0.15);
          padding: 40px;
        }
        .d29-transmission-file {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #C8A24B;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(200,162,75,0.15);
        }
        .d29-transmission-lines {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .d29-tline {
          display: flex;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
        }
        .d29-tline-key { color: #6E6A63; }
        .d29-tline-val { color: #EDEAE3; }
        .d29-tline-val a {
          color: #C8A24B;
          text-decoration: none;
        }
        .d29-tline-val a:hover,
        .d29-tline-val a:focus-visible {
          text-decoration: underline;
          outline: none;
        }

        /* ── FOOTER ── */
        .d29-footer {
          padding: 40px 80px;
          border-top: 1px solid rgba(200,162,75,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .d29-footer-logo {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #6E6A63;
          text-transform: uppercase;
        }
        .d29-footer-links {
          display: flex;
          gap: 32px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .d29-footer-links a {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: #6E6A63;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .d29-footer-links a:hover,
        .d29-footer-links a:focus-visible {
          color: #C8A24B;
          outline: none;
        }
        .d29-footer-stamp {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #6E6A63;
          letter-spacing: 0.1em;
        }

        /* ── SKIP LINK ── */
        .d29-skip {
          position: fixed;
          top: -100%;
          left: 16px;
          z-index: 99999;
          background: #C8A24B;
          color: #0A0A0B;
          padding: 8px 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-decoration: none;
          transition: top 0.2s;
        }
        .d29-skip:focus {
          top: 16px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .d29-hero {
            grid-template-columns: 1fr;
          }
          .d29-hero-right {
            height: 50vw;
          }
          .d29-hero-left {
            padding: 80px 24px 40px;
          }
          .d29-nav { padding: 16px 24px; }
          .d29-nav-links { display: none; }
          .d29-proof { padding: 48px 24px; }
          .d29-proof-grid { grid-template-columns: 1fr 1fr; }
          .d29-divider { padding: 0 24px; }
          .d29-intel {
            grid-template-columns: 1fr;
            padding: 48px 24px;
            gap: 40px;
          }
          .d29-cases { padding: 48px 24px; }
          .d29-subject {
            grid-template-columns: 1fr;
            padding: 48px 24px;
            gap: 40px;
          }
          .d29-gallery { padding: 48px 24px; }
          .d29-gallery-strip { grid-template-columns: repeat(3, 1fr); }
          .d29-transmission {
            grid-template-columns: 1fr;
            padding: 60px 24px;
            gap: 40px;
          }
          .d29-footer { padding: 32px 24px; flex-direction: column; gap: 16px; text-align: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .d29-cursor, .d29-cursor-dot { display: none; }
          .root-29 { cursor: auto; }
        }
      `}</style>

      <div className="root-29" ref={containerRef}>
        {/* Skip link */}
        <a href="#main-content" className="d29-skip">
          Skip to content
        </a>

        {/* Custom cursor */}
        {mounted && !reduced && (
          <>
            <div
              className="d29-cursor"
              style={{ left: cursor.x, top: cursor.y }}
              aria-hidden="true"
            />
            <div
              className="d29-cursor-dot"
              style={{ left: cursor.x, top: cursor.y }}
              aria-hidden="true"
            />
          </>
        )}

        {/* Film grain */}
        <div className="d29-grain" aria-hidden="true" />

        {/* Spotlight mask */}
        {mounted && !reduced && (
          <div
            className="d29-spotlight"
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle 280px at ${cursor.x}px ${cursor.y}px, transparent 0%, rgba(10,10,11,0.92) 100%)`,
            }}
          />
        )}

        {/* Scroll progress */}
        <motion.div
          className="d29-progress"
          style={{ width: progressWidth }}
          aria-hidden="true"
        />

        {/* Nav */}
        <nav className="d29-nav" aria-label="Primary navigation">
          <span className="d29-nav-logo">SKL // DOSSIER-29</span>
          <ul className="d29-nav-links">
            <li>
              <a href="#intel">Intel</a>
            </li>
            <li>
              <a href="#cases">Cases</a>
            </li>
            <li>
              <a href="#subject">Subject</a>
            </li>
            <li>
              <a href="#transmission">Contact</a>
            </li>
          </ul>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="d29-nav-cta"
            aria-label="Book a discovery call"
          >
            Open File
          </a>
        </nav>

        {/* HERO */}
        <main id="main-content">
          <section className="d29-hero" aria-labelledby="d29-h1">
            <div className="d29-hero-left">
              <div className="d29-file-stamp" aria-hidden="true">
                CONFIDENTIAL &nbsp;// FILE-2019-ACTIVE
              </div>

              <h1 id="d29-h1" className="d29-hero-h1">
                <span className="d29-dropcap" aria-hidden="true">
                  I
                </span>
                <RedactLine delay={0.3}> build the</RedactLine>
                <br />
                <RedactLine delay={0.5}> machine that</RedactLine>
                <br />
                <RedactLine delay={0.7}> runs the</RedactLine>
                <br />
                <RedactLine delay={0.9}> business</RedactLine>
                <br />
                <RedactLine delay={1.1}> while you sleep.</RedactLine>
              </h1>

              <motion.p
                className="d29-subhead"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                <strong>Subject:</strong> Waseem Nasir. 180+ builds, 40+
                clients,
                <br />
                9 countries, active since 2019.
                <br />
                <strong>Specialty:</strong> AI + automation that kills missed
                leads,
                <br />
                dead follow-ups, manual ops.
              </motion.p>

              <motion.a
                href="https://skynetjoe.com/discovery-call"
                className="d29-hero-cta"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                aria-label="Book a 30-minute discovery call"
              >
                Request Briefing
              </motion.a>
            </div>

            <div className="d29-hero-right" aria-hidden="true">
              <img
                src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                alt="Waseem Nasir — SkynetLabs founder"
                className="d29-hero-portrait"
              />
              <div className="d29-hero-overlay" />
              <div className="d29-classified-stamp">Classified</div>
            </div>
          </section>

          {/* DIVIDER */}
          <div className="d29-divider" aria-hidden="true">
            <span className="d29-divider-label">FIELD REPORT</span>
            <span className="d29-divider-line" />
            <span className="d29-divider-num">§ 01</span>
          </div>

          {/* PROOF / STATS */}
          <section className="d29-proof" aria-labelledby="d29-proof-label">
            <p className="d29-section-label" id="d29-proof-label">
              Verified Record
            </p>
            <h2 className="d29-section-h2">
              Numbers that{" "}
              <em
                style={{ fontFamily: "Fraunces, serif", fontStyle: "italic" }}
              >
                don't negotiate.
              </em>
            </h2>

            <div className="d29-proof-grid">
              <StatBlock value="180+" label="Builds shipped" delay={0.1} />
              <StatBlock value="40+" label="Clients served" delay={0.2} />
              <StatBlock
                value="9"
                label="Countries operated from"
                delay={0.3}
              />
              <StatBlock
                value="2019"
                label="Year operations began"
                delay={0.4}
              />
            </div>

            <p className="d29-proof-note">
              N8N workflow orchestration. Next.js production systems. WhatsApp +
              Voice AI bots. AEO-optimised content infrastructure. Real-time
              lead capture. Every number above is first-party, verifiable,
              non-inflated.
            </p>
          </section>

          {/* DIVIDER */}
          <div className="d29-divider" aria-hidden="true">
            <span className="d29-divider-label">OPERATIONAL INTEL</span>
            <span className="d29-divider-line" />
            <span className="d29-divider-num">§ 02</span>
          </div>

          {/* SERVICES */}
          <section
            id="intel"
            className="d29-intel"
            aria-labelledby="d29-intel-label"
          >
            <div className="d29-intel-left">
              <p className="d29-section-label" id="d29-intel-label">
                Capabilities Matrix
              </p>
              <h2 className="d29-section-h2">
                Six systems.
                <br />
                One operator.
              </h2>
              <p className="d29-intel-desc">
                Each engagement is a precision deployment — scoped, built,
                handed over. No retainer traps. No agency overhead. The machine
                runs when you're not looking.
              </p>

              <ul className="d29-intel-list" aria-label="Services list">
                {[
                  {
                    n: "01",
                    name: "AI Voice + WhatsApp Bots",
                    sub: "Inbound lead capture, 24/7 qualification, auto-follow-up",
                  },
                  {
                    n: "02",
                    name: "N8N Automation Systems",
                    sub: "Workflow orchestration, CRM sync, trigger-based ops",
                  },
                  {
                    n: "03",
                    name: "Next.js Web Applications",
                    sub: "Production-grade, SEO-ready, conversion-optimised",
                  },
                  {
                    n: "04",
                    name: "AEO Content Infrastructure",
                    sub: "AI engine optimisation, answer authority, citation building",
                  },
                  {
                    n: "05",
                    name: "CRM + Funnel Integration",
                    sub: "GHL, Stripe, Calendly — wired together",
                  },
                  {
                    n: "06",
                    name: "Ops Audit + Kill-Busywork",
                    sub: "Map what's manual, automate what's costing revenue",
                  },
                ].map((item) => (
                  <li key={item.n} className="d29-intel-item">
                    <span className="d29-intel-num">{item.n}</span>
                    <div className="d29-intel-name">
                      {item.name}
                      <span>{item.sub}</span>
                    </div>
                    <span className="d29-intel-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="d29-intel-right" aria-hidden="true">
              <div className="d29-intel-photos">
                <img
                  src="/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg"
                  alt="Working remotely — rooftop cafe, mountain clouds"
                  className="d29-intel-photo"
                />
                <img
                  src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                  alt="Typing on laptop at Bali terrace cafe"
                  className="d29-intel-photo"
                />
                <img
                  src="/img/pro/WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg"
                  alt="Focused at coworking desk"
                  className="d29-intel-photo"
                />
              </div>
            </div>
          </section>

          {/* DIVIDER */}
          <div className="d29-divider" aria-hidden="true">
            <span className="d29-divider-label">CASE FILES</span>
            <span className="d29-divider-line" />
            <span className="d29-divider-num">§ 03</span>
          </div>

          {/* CASE FILES */}
          <section
            id="cases"
            className="d29-cases"
            aria-labelledby="d29-cases-label"
          >
            <p className="d29-section-label" id="d29-cases-label">
              Selected Operations
            </p>
            <h2 className="d29-section-h2">The work that shipped.</h2>

            <div className="d29-cases-grid">
              <CaseEntry
                code="OP-001"
                title="WhatsApp AI receptionist — freight operations, USA + Singapore. Handles inbound 24/7, qualifies leads, logs to CRM."
                tags={["n8n", "WhatsApp API", "Voice AI", "GHL"]}
                status="Deployed"
                delay={0.05}
              />
              <CaseEntry
                code="OP-002"
                title="$27 membership funnel + Stripe integration — physical therapy clinic. 6 critical UX bugs resolved post-launch."
                tags={["Next.js", "Stripe", "WordPress", "Funnel"]}
                status="Live"
                delay={0.1}
              />
              <CaseEntry
                code="OP-003"
                title="Trip management CPT system — Italian travel operator. Secure per-customer content gating, GDPR Phase 2."
                tags={["WordPress", "CPT", "GDPR", "REST API"]}
                status="Shipped"
                delay={0.15}
              />
              <CaseEntry
                code="OP-004"
                title="AEO citation engine — SkynetLabs.com. AI answer-engine optimisation, 16 service pages, structured citations."
                tags={["Next.js", "AEO", "SEO", "Schema"]}
                status="Live"
                delay={0.2}
              />
              <CaseEntry
                code="OP-005"
                title="Outreach email automation — SaaS platform. Gmail API + OpenAI orchestration, 500+ contacts sequenced."
                tags={["n8n", "Gmail API", "OpenAI", "Cron"]}
                status="Active"
                delay={0.25}
              />
              <CaseEntry
                code="OP-006"
                title="Chrome extension (GigSignal) — Fiverr scraper + signal tracker. Public, 400+ downloads."
                tags={["Chrome Extension", "JS", "Fiverr API"]}
                status="Public"
                delay={0.3}
              />
            </div>
          </section>

          {/* DIVIDER */}
          <div className="d29-divider" aria-hidden="true">
            <span className="d29-divider-label">FIELD ARCHIVE</span>
            <span className="d29-divider-line" />
            <span className="d29-divider-num">§ 04</span>
          </div>

          {/* GALLERY */}
          <section
            className="d29-gallery"
            aria-label="Photo gallery — remote work and travel"
          >
            <p className="d29-section-label">Documentation</p>
            <h2 className="d29-section-h2">
              Nine countries.
              <br />
              One system.
            </h2>

            <div className="d29-gallery-strip">
              {[
                {
                  src: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                  alt: "Arms spread at Nusa Penida cliffs, Bali",
                },
                {
                  src: "CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg",
                  alt: "Night rooftop cafe, phone, city lights",
                },
                {
                  src: "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
                  alt: "Arms crossed, confident pose, sunglasses",
                },
                {
                  src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                  alt: "Hilltop with backpack, city vista",
                },
                {
                  src: "CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg",
                  alt: "Night beach cafe, working on phone and laptop",
                },
              ].map((img, i) => (
                <motion.div
                  key={img.src}
                  className="d29-gallery-cell"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <img
                    src={`/img/pro/${img.src}`}
                    alt={img.alt}
                    className="d29-gallery-img"
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* DIVIDER */}
          <div className="d29-divider" aria-hidden="true">
            <span className="d29-divider-label">SUBJECT FILE</span>
            <span className="d29-divider-line" />
            <span className="d29-divider-num">§ 05</span>
          </div>

          {/* ABOUT / SUBJECT */}
          <section
            id="subject"
            className="d29-subject"
            aria-labelledby="d29-subject-label"
          >
            <div className="d29-subject-photo-wrap">
              <img
                src="/img/pro/PORTRAIT-2025-05-08-cafe-table-arms-crossed-pensive.jpg"
                alt="Waseem Nasir — arms crossed, pensive, cafe"
                className="d29-subject-photo"
              />
              <div className="d29-subject-caption">
                Waseem Nasir // SkynetLabs // Independent Founder
              </div>
            </div>

            <div className="d29-subject-right">
              <p className="d29-section-label" id="d29-subject-label">
                The Operator
              </p>
              <h2 className="d29-section-h2">
                <RedactLine delay={0.1}>Built on necessity.</RedactLine>
                <br />
                <RedactLine delay={0.3}>Refined by reps.</RedactLine>
              </h2>

              <p className="d29-subject-body">
                Started in 2019. No agency. No investors. No safety net. Just a
                problem worth solving: businesses bleeding revenue through gaps
                that <em>software should have already closed.</em>
              </p>
              <p className="d29-subject-body">
                SkynetLabs is the tool I built to close those gaps — for
                clinics, freight operators, travel companies, SaaS founders
                across 9 countries who needed systems that worked without their
                attention.
              </p>
              <p className="d29-subject-body">
                I work from Bali and Lahore. Remote by design, not default. The
                stack: n8n, Next.js, WhatsApp API, OpenAI, GHL — whatever gets
                the job done without new problems.
              </p>

              <div
                className="d29-subject-details"
                role="table"
                aria-label="Operator details"
              >
                {[
                  { k: "Identity", v: "Waseem Nasir" },
                  { k: "Entity", v: "SkynetLabs" },
                  { k: "Status", v: "Active — Since 2019" },
                  { k: "Base", v: "Bali / Lahore — Remote" },
                  {
                    k: "Stack",
                    v: "n8n · Next.js · OpenAI · GHL · WhatsApp API",
                  },
                  { k: "GitHub", v: "github.com/waseemnasir2k26" },
                ].map((row) => (
                  <div key={row.k} className="d29-detail-row" role="row">
                    <span className="d29-detail-key" role="rowheader">
                      {row.k}
                    </span>
                    <span className="d29-detail-val" role="cell">
                      {row.k === "GitHub" ? (
                        <a
                          href="https://github.com/waseemnasir2k26"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#C8A24B", textDecoration: "none" }}
                        >
                          {row.v}
                        </a>
                      ) : (
                        row.v
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* DIVIDER */}
          <div className="d29-divider" aria-hidden="true">
            <span className="d29-divider-label">TRANSMISSION</span>
            <span className="d29-divider-line" />
            <span className="d29-divider-num">§ 06</span>
          </div>

          {/* CONTACT */}
          <section
            id="transmission"
            className="d29-transmission"
            aria-labelledby="d29-tx-label"
          >
            <div className="d29-transmission-left">
              <p className="d29-section-label" id="d29-tx-label">
                Open a Channel
              </p>
              <h2 className="d29-transmission-h2">
                30 minutes.
                <br />
                Tell me what's broken.
              </h2>
              <p className="d29-transmission-body">
                No deck. No discovery questionnaire. Show me the gap — the lead
                that goes cold, the follow-up nobody sends, the report someone
                builds by hand every Monday. That's the brief. I'll tell you
                what the fix looks like and what it costs.
              </p>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="d29-transmission-cta"
                aria-label="Book a 30-minute discovery call with Waseem Nasir"
              >
                Book the Call
              </a>
            </div>

            <div
              className="d29-transmission-right"
              aria-label="Contact details card"
            >
              <div className="d29-transmission-file">
                CONTACT // SKYNETLABS-001
              </div>
              <div className="d29-transmission-lines">
                {[
                  { k: "FORMAT", v: "30-min video call" },
                  {
                    k: "BOOKING",
                    v: (
                      <a href="https://skynetjoe.com/discovery-call">
                        skynetjoe.com/discovery-call
                      </a>
                    ),
                  },
                  {
                    k: "GITHUB",
                    v: (
                      <a
                        href="https://github.com/waseemnasir2k26"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        waseemnasir2k26
                      </a>
                    ),
                  },
                  { k: "TIMEZONE", v: "Bali WIB / Lahore PKT" },
                  { k: "RESPONSE", v: "Within 24h" },
                  { k: "STATUS", v: "Accepting new ops" },
                ].map((line, i) => (
                  <div key={i} className="d29-tline">
                    <span className="d29-tline-key">{line.k}</span>
                    <span className="d29-tline-val">{line.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="d29-footer">
          <span className="d29-footer-logo">SkynetLabs // Waseem Nasir</span>
          <ul className="d29-footer-links" aria-label="Footer links">
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
              <a href="https://skynetjoe.com/discovery-call">Discovery Call</a>
            </li>
          </ul>
          <span className="d29-footer-stamp">
            ACTIVE SINCE 2019 // CASE {`{`}ONGOING{`}`}
          </span>
        </footer>
      </div>
    </>
  );
}
