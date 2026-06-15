"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
  useSpring,
  AnimatePresence,
} from "framer-motion";

/* ─── Scoped styles ─────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,500;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;1,8..60,400;1,8..60,500&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.d42-root {
  --ink: #0D0C0A;
  --ink-mid: #1A1714;
  --bg: #F2EFE6;
  --bg-warm: #EDE9DC;
  --surface: #F8F6F0;
  --muted: #5C564F;
  --muted-lt: #8A8178;
  --accent: #8B1A14;
  --accent-dk: #6B1410;
  --accent2: #1A3356;
  --gold: #C9933A;
  --rule: rgba(13,12,10,0.14);
  --rule-mid: rgba(13,12,10,0.28);
  --rule-dk: rgba(13,12,10,0.55);
  --col: 1fr;
  --baseline: 24px;
  --page-pad: clamp(20px, 4vw, 56px);

  background: var(--bg);
  color: var(--ink-mid);
  font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif;
  font-size: 15px;
  line-height: var(--baseline);
  overflow-x: hidden;
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Paper grain ── */
.d42-grain {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  mix-blend-mode: multiply;
  opacity: 0.7;
}

/* ── Baseline grid ── */
.d42-baseline {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent calc(var(--baseline) - 1px),
    rgba(13,12,10,0.025) calc(var(--baseline) - 1px),
    rgba(13,12,10,0.025) var(--baseline)
  );
}

.d42-page {
  position: relative;
  z-index: 2;
  min-height: 100vh;
}

/* ─────────────────────────────────────────────────────────────
   FOLIO STRIP — thin masthead line above the nameplate
───────────────────────────────────────────────────────────── */
.d42-folio {
  background: var(--ink);
  color: rgba(242,239,230,0.6);
  padding: 5px var(--page-pad);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-bottom: none;
}

.d42-folio-center {
  color: rgba(242,239,230,0.35);
  letter-spacing: 0.06em;
}

/* ─────────────────────────────────────────────────────────────
   MASTHEAD — Nameplate zone
───────────────────────────────────────────────────────────── */
.d42-masthead-wrap {
  border-top: 4px solid var(--ink);
  border-bottom: 1px solid var(--rule-dk);
  background: var(--surface);
}

.d42-masthead {
  padding: 12px var(--page-pad) 10px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 12px;
  max-width: 1500px;
  margin: 0 auto;
}

.d42-dateline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  line-height: 1.7;
  color: var(--muted);
  letter-spacing: 0.04em;
}

.d42-nameplate {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: clamp(42px, 6.5vw, 88px);
  letter-spacing: -0.025em;
  color: var(--ink);
  text-align: center;
  line-height: 0.95;
  white-space: nowrap;
}

.d42-nameplate-accent {
  color: var(--accent);
  font-style: italic;
}

.d42-edition {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  line-height: 1.7;
  color: var(--muted);
  letter-spacing: 0.04em;
  text-align: right;
}

/* ── Masthead tagline ── */
.d42-masthead-tagline {
  border-top: 1px solid var(--rule-mid);
  padding: 6px var(--page-pad);
  text-align: center;
  font-family: 'Source Serif 4', serif;
  font-style: italic;
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.04em;
  background: var(--surface);
  max-width: none;
}

/* ─────────────────────────────────────────────────────────────
   NAV STRIP
───────────────────────────────────────────────────────────── */
.d42-nav-wrap {
  border-top: 2px solid var(--ink);
  border-bottom: 2px solid var(--ink);
  background: var(--surface);
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.d42-nav-wrap::-webkit-scrollbar { display: none; }

.d42-nav {
  padding: 0 var(--page-pad);
  display: flex;
  max-width: 1500px;
  margin: 0 auto;
}

.d42-nav a {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-mid);
  text-decoration: none;
  padding: 9px 18px;
  border-right: 1px solid var(--rule-mid);
  white-space: nowrap;
  transition: background 0.12s, color 0.12s;
  display: block;
}

.d42-nav a:first-child { border-left: 1px solid var(--rule-mid); }
.d42-nav a:hover { background: var(--ink); color: var(--bg); }
.d42-nav a:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }

.d42-nav-cta {
  margin-left: auto;
  border-left: 1px solid var(--rule-mid) !important;
  background: var(--accent) !important;
  color: var(--surface) !important;
  font-weight: 500 !important;
}
.d42-nav-cta:hover { background: var(--accent-dk) !important; }

/* ─────────────────────────────────────────────────────────────
   ABOVE-FOLD INDEX — "MORE INSIDE" sidebar tease
───────────────────────────────────────────────────────────── */
.d42-index-bar {
  background: var(--bg-warm);
  border-bottom: 2px solid var(--ink);
  padding: 0 var(--page-pad);
}

.d42-index-inner {
  max-width: 1500px;
  margin: 0 auto;
  display: flex;
  align-items: stretch;
  gap: 0;
}

.d42-index-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  padding: 10px 8px;
  border-right: 1px solid var(--rule-mid);
  flex-shrink: 0;
}

.d42-index-items {
  display: flex;
  flex: 1;
  overflow-x: auto;
}

.d42-index-item {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--muted);
  padding: 8px 16px;
  border-right: 1px solid var(--rule);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.d42-index-item strong {
  color: var(--accent);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ─────────────────────────────────────────────────────────────
   HERO — Classic broadsheet front page
───────────────────────────────────────────────────────────── */
.d42-hero-wrap {
  border-bottom: 2px solid var(--ink);
  padding: 0 var(--page-pad);
}

.d42-hero {
  max-width: 1500px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 4fr 2fr;
  gap: 0;
}

.d42-hero-main {
  padding: calc(var(--baseline) * 2) 0;
  border-right: 1px solid var(--rule-dk);
  padding-right: 32px;
}

.d42-hero-sidebar {
  padding: calc(var(--baseline) * 2) 0 calc(var(--baseline) * 2) 28px;
  display: flex;
  flex-direction: column;
  gap: calc(var(--baseline) * 1.25);
}

/* Horizontal rule ornament under kicker */
.d42-kicker-rule {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: calc(var(--baseline) * 0.5);
}

.d42-kicker-rule::before,
.d42-kicker-rule::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--rule-mid);
}

.d42-kicker {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.d42-h1 {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: clamp(38px, 5.5vw, 80px);
  line-height: 1.03;
  letter-spacing: -0.025em;
  color: var(--ink);
  margin: 0 0 calc(var(--baseline) * 0.5) 0;
}

.d42-h1 em {
  font-style: italic;
  color: var(--accent);
}

/* Broadsheet deck — heavier rule above */
.d42-deck {
  font-family: 'Source Serif 4', serif;
  font-size: clamp(15px, 1.5vw, 18px);
  font-weight: 400;
  line-height: 1.55;
  color: var(--muted);
  margin: 0 0 calc(var(--baseline)) 0;
  padding-top: calc(var(--baseline) * 0.5);
  border-top: 2px solid var(--ink);
}

.d42-byline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: calc(var(--baseline) * 0.75);
  display: flex;
  align-items: center;
  gap: 8px;
}
.d42-byline::before {
  content: '—';
  color: var(--accent);
}

/* ─────────────────────────────────────────────────────────────
   BODY TEXT
───────────────────────────────────────────────────────────── */
.d42-body {
  font-family: 'Source Serif 4', serif;
  font-size: 15px;
  line-height: var(--baseline);
  color: var(--ink-mid);
}

.d42-body p {
  margin-bottom: var(--baseline);
}

.d42-body p + p {
  text-indent: 1.5em;
  margin-top: 0;
}

.d42-body p:first-child {
  text-indent: 0;
}

/* ── Drop cap ── */
.d42-dropcap::first-letter {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: 4.2em;
  line-height: 0.82;
  float: left;
  margin-right: 5px;
  margin-top: 5px;
  color: var(--accent2);
  shape-outside: polygon(0 0, 100% 0, 80% 100%, 0 100%);
}

/* ── Images ── */
.d42-img-frame {
  overflow: hidden;
  background: var(--bg-warm);
}

.d42-img-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: contrast(1.04) saturate(0.88) sepia(0.05);
  transition: filter 0.3s;
}

.d42-img-caption {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.05em;
  color: var(--muted-lt);
  padding: 5px 0 0;
  border-top: 1px solid var(--rule);
  margin-top: 4px;
  line-height: 1.5;
}

/* ─────────────────────────────────────────────────────────────
   SECTION STRIPS
───────────────────────────────────────────────────────────── */
.d42-section-strip {
  background: var(--ink);
  color: rgba(242,239,230,0.9);
  padding: 7px var(--page-pad);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}

.d42-section-strip::before {
  content: '';
  position: absolute;
  left: var(--page-pad);
  right: var(--page-pad);
  top: 50%;
  height: 1px;
  background: rgba(242,239,230,0.1);
  transform: translateY(-50%);
}

.d42-section-strip span {
  position: relative;
  background: var(--ink);
  padding-right: 20px;
}

/* ── Section label (inline) ── */
.d42-section-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  border-top: 2px solid var(--accent);
  padding-top: 5px;
  margin-bottom: calc(var(--baseline));
  display: block;
}

/* ─────────────────────────────────────────────────────────────
   PULL QUOTE
───────────────────────────────────────────────────────────── */
.d42-pullquote {
  border-top: 3px solid var(--ink);
  border-bottom: 1px solid var(--rule-mid);
  padding: calc(var(--baseline) * 0.75) 0;
}

.d42-pullquote blockquote {
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  font-style: italic;
  font-size: clamp(15px, 1.6vw, 20px);
  line-height: 1.38;
  color: var(--ink-mid);
  text-indent: -0.42em;
  padding-left: 0.42em;
  margin-bottom: 8px;
}

.d42-pullquote cite {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-lt);
  font-style: normal;
}

/* ─────────────────────────────────────────────────────────────
   STATS BAR
───────────────────────────────────────────────────────────── */
.d42-stats-wrap {
  border-top: 2px solid var(--ink);
  border-bottom: 1px solid var(--rule-dk);
  background: var(--surface);
  padding: 0 var(--page-pad);
}

.d42-stats-inner {
  max-width: 1500px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.d42-stat-cell {
  padding: calc(var(--baseline) * 1.5) 20px;
  border-right: 1px solid var(--rule-mid);
  position: relative;
}

.d42-stat-cell:last-child { border-right: none; }

/* Animating underline under stat number */
.d42-stat-rule {
  position: absolute;
  bottom: calc(var(--baseline) * 1.5 + 4px);
  left: 20px;
  height: 2px;
  background: var(--accent);
  width: 0;
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.d42-stat-rule.drawn { width: 40px; }

.d42-stat-num {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: clamp(36px, 4.5vw, 64px);
  line-height: 1;
  color: var(--accent2);
  display: block;
  margin-bottom: 4px;
}

.d42-stat-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  display: block;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--rule);
}

/* ─────────────────────────────────────────────────────────────
   SERVICES — Broadsheet column grid
───────────────────────────────────────────────────────────── */
.d42-services-wrap {
  padding: 0 var(--page-pad);
  border-bottom: 2px solid var(--ink);
}

.d42-services-inner {
  max-width: 1500px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--rule-dk);
}

.d42-service-item {
  padding: calc(var(--baseline) * 1.5) 20px;
  border-right: 1px solid var(--rule-dk);
  border-bottom: 1px solid var(--rule-mid);
}

.d42-service-item:nth-child(3n) { border-right: none; }
.d42-service-item:nth-child(4),
.d42-service-item:nth-child(5),
.d42-service-item:nth-child(6) { border-bottom: none; }

.d42-service-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.12em;
  color: var(--accent);
  display: block;
  margin-bottom: 8px;
}

.d42-h3 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: clamp(17px, 1.8vw, 24px);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin: 0 0 10px 0;
}

/* Services image heights — staggered for visual rhythm */
.d42-svc-img-0 { height: 180px; }
.d42-svc-img-1 { height: 140px; }
.d42-svc-img-2 { height: 200px; }
.d42-svc-img-3 { height: 160px; }
.d42-svc-img-4 { height: 190px; }
.d42-svc-img-5 { height: 150px; }

/* ─────────────────────────────────────────────────────────────
   WORK GRID
───────────────────────────────────────────────────────────── */
.d42-work-wrap {
  padding: 0 var(--page-pad);
  border-bottom: 2px solid var(--ink);
}

.d42-work-inner {
  max-width: 1500px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--rule-dk);
}

.d42-work-item {
  padding: calc(var(--baseline)) 20px;
  border-right: 1px solid var(--rule-dk);
}

.d42-work-item:last-child { border-right: none; }

.d42-tag {
  display: inline-block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid currentColor;
  padding: 2px 7px;
  margin-top: 8px;
}

/* ─────────────────────────────────────────────────────────────
   CENTRED BROADSHEET PULL QUOTE STRIP
───────────────────────────────────────────────────────────── */
.d42-quote-strip {
  background: var(--surface);
  border-top: 2px solid var(--ink);
  border-bottom: 2px solid var(--ink);
  padding: calc(var(--baseline) * 3.5) var(--page-pad);
}

.d42-quote-strip-inner {
  max-width: 840px;
  margin: 0 auto;
}

.d42-ornament {
  text-align: center;
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  color: var(--accent);
  opacity: 0.35;
  line-height: 1;
  margin-bottom: 16px;
  letter-spacing: 0.2em;
}

.d42-quote-strip blockquote {
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  font-style: italic;
  font-size: clamp(22px, 2.8vw, 38px);
  line-height: 1.3;
  color: var(--ink);
  text-align: center;
  text-indent: 0;
  margin-bottom: 20px;
}

.d42-quote-strip cite {
  display: block;
  text-align: center;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  font-style: normal;
}

.d42-dagger {
  color: var(--accent);
  margin: 0 6px;
}

/* ─────────────────────────────────────────────────────────────
   ABOUT — Correspondent profile
───────────────────────────────────────────────────────────── */
.d42-about-wrap {
  padding: 0 var(--page-pad);
  border-bottom: 2px solid var(--ink);
}

.d42-about-inner {
  max-width: 1500px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 5fr 7fr;
  border-top: 1px solid var(--rule-dk);
}

.d42-about-photo {
  padding: calc(var(--baseline) * 2) 28px calc(var(--baseline) * 2) 0;
  border-right: 1px solid var(--rule-dk);
}

.d42-about-cols {
  padding: calc(var(--baseline) * 2) 0 calc(var(--baseline) * 2) 28px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
}

.d42-about-col {
  padding: 0 20px;
  border-right: 1px solid var(--rule-mid);
}

.d42-about-col:first-child { padding-left: 0; }
.d42-about-col:last-child { border-right: none; padding-right: 0; }

/* ─────────────────────────────────────────────────────────────
   PHOTO GALLERY
───────────────────────────────────────────────────────────── */
.d42-gallery-wrap {
  border-bottom: 2px solid var(--ink);
}

.d42-gallery-inner {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.d42-gallery-cell {
  border-right: 1px solid var(--rule-dk);
  overflow: hidden;
}

.d42-gallery-cell:last-child { border-right: none; }

.d42-gallery-img {
  height: 220px;
  overflow: hidden;
}

.d42-gallery-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: contrast(1.04) saturate(0.85) sepia(0.06);
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.d42-gallery-cell:hover .d42-gallery-img img {
  transform: scale(1.04);
}

.d42-gallery-cap {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.05em;
  color: var(--muted-lt);
  padding: 6px 12px;
  border-top: 1px solid var(--rule);
}

/* ─────────────────────────────────────────────────────────────
   CTA
───────────────────────────────────────────────────────────── */
.d42-cta-wrap {
  background: var(--accent2);
  padding: calc(var(--baseline) * 4) var(--page-pad);
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Ink-bleed watermark behind CTA */
.d42-cta-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: clamp(80px, 18vw, 220px);
  line-height: 1;
  color: rgba(255,255,255,0.03);
  white-space: nowrap;
  letter-spacing: -0.03em;
  pointer-events: none;
  user-select: none;
}

.d42-cta-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(242,239,230,0.5);
  margin-bottom: 16px;
  display: block;
}

.d42-cta-headline {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-style: italic;
  font-size: clamp(30px, 4.5vw, 60px);
  color: #F2EFE6;
  margin-bottom: calc(var(--baseline));
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.d42-cta-subhead {
  font-family: 'Source Serif 4', serif;
  font-size: clamp(15px, 1.4vw, 18px);
  color: rgba(242,239,230,0.65);
  max-width: 520px;
  margin: 0 auto calc(var(--baseline) * 2);
  line-height: 1.65;
}

.d42-cta-link {
  display: inline-block;
  background: transparent;
  color: #F2EFE6;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 14px 36px;
  border: 1px solid rgba(242,239,230,0.5);
  transition: background 0.18s, border-color 0.18s, color 0.18s;
}

.d42-cta-link:hover {
  background: rgba(242,239,230,0.1);
  border-color: #F2EFE6;
}

.d42-cta-link:focus-visible {
  outline: 2px solid #F2EFE6;
  outline-offset: 4px;
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */
.d42-footer {
  background: var(--ink);
  color: rgba(242,239,230,0.55);
  padding: calc(var(--baseline) * 2.5) var(--page-pad);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.04em;
}

.d42-footer-inner {
  max-width: 1500px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 40px;
}

.d42-footer a {
  color: rgba(242,239,230,0.55);
  text-decoration: none;
  display: block;
  margin-bottom: 5px;
  transition: color 0.12s;
}

.d42-footer a:hover { color: #F2EFE6; }
.d42-footer a:focus-visible { outline: 1px solid #F2EFE6; }

.d42-footer-name {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: 26px;
  color: #F2EFE6;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
  line-height: 1;
}

.d42-footer-sub {
  color: rgba(242,239,230,0.35);
  font-size: 9.5px;
  letter-spacing: 0.08em;
}

.d42-footer-col-head {
  color: rgba(242,239,230,0.35);
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.d42-footer-rule {
  border: none;
  border-top: 1px solid rgba(242,239,230,0.12);
  margin: calc(var(--baseline)) 0 calc(var(--baseline) * 0.75);
}

.d42-footer-bottom {
  max-width: 1500px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  font-size: 9.5px;
  color: rgba(242,239,230,0.3);
  letter-spacing: 0.06em;
  flex-wrap: wrap;
}

/* ─────────────────────────────────────────────────────────────
   SKIP LINK
───────────────────────────────────────────────────────────── */
.d42-skip {
  position: absolute;
  left: -9999px;
  top: 4px;
  padding: 8px 16px;
  background: var(--accent2);
  color: #F2EFE6;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  z-index: 9999;
  text-decoration: none;
}
.d42-skip:focus { left: var(--page-pad); }

/* ─────────────────────────────────────────────────────────────
   SCROLL PROGRESS — horizontal top rail (broadsheet page marker)
───────────────────────────────────────────────────────────── */
.d42-scroll-rail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(13,12,10,0.08);
  z-index: 9997;
  pointer-events: none;
}

.d42-scroll-fill {
  height: 100%;
  background: var(--accent);
  transform-origin: left;
}

/* ─────────────────────────────────────────────────────────────
   COLUMN RULE — draw-in animation
───────────────────────────────────────────────────────────── */
.d42-col-rule {
  position: relative;
  height: 100%;
}

.d42-col-rule::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 1px;
  background: var(--rule-dk);
  transform-origin: top;
  transform: scaleY(0);
  transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.d42-col-rule.drawn::after { transform: scaleY(1); }

/* ─────────────────────────────────────────────────────────────
   INK ANIMATIONS
───────────────────────────────────────────────────────────── */
@keyframes d42-ink-in {
  0%   { opacity: 0; filter: blur(8px) contrast(0.8); transform: translateY(6px); }
  60%  { opacity: 0.9; filter: blur(1px) contrast(1); }
  100% { opacity: 1; filter: blur(0) contrast(1); transform: translateY(0); }
}

.d42-ink { animation: d42-ink-in 1s cubic-bezier(0.16,1,0.3,1) both; }
.d42-ink-d1 { animation-delay: 0.1s; }
.d42-ink-d2 { animation-delay: 0.22s; }
.d42-ink-d3 { animation-delay: 0.36s; }
.d42-ink-d4 { animation-delay: 0.52s; }
.d42-ink-d5 { animation-delay: 0.68s; }

/* ─────────────────────────────────────────────────────────────
   RESPONSIVE
───────────────────────────────────────────────────────────── */
@media (max-width: 1100px) {
  .d42-hero { grid-template-columns: 1fr; }
  .d42-hero-main { border-right: none; border-bottom: 1px solid var(--rule-dk); padding-right: 0; }
  .d42-hero-sidebar { padding-left: 0; }

  .d42-services-inner { grid-template-columns: 1fr 1fr; }
  .d42-service-item:nth-child(3n) { border-right: 1px solid var(--rule-dk); }
  .d42-service-item:nth-child(2n) { border-right: none; }
  .d42-service-item:nth-child(5),
  .d42-service-item:nth-child(6) { border-bottom: none; }

  .d42-about-inner { grid-template-columns: 1fr; }
  .d42-about-photo { border-right: none; padding-right: 0; border-bottom: 1px solid var(--rule-dk); padding-bottom: calc(var(--baseline) * 2); }
  .d42-about-cols { padding-left: 0; }

  .d42-work-inner { grid-template-columns: 1fr 1fr; }
  .d42-work-item:nth-child(2n) { border-right: none; }
  .d42-work-item:nth-child(3),
  .d42-work-item:nth-child(4) { border-top: 1px solid var(--rule-dk); }
}

@media (max-width: 768px) {
  .d42-masthead { grid-template-columns: 1fr; justify-items: center; text-align: center; gap: 4px; }
  .d42-dateline, .d42-edition { text-align: center; }
  .d42-nameplate { font-size: clamp(36px, 10vw, 64px); }

  .d42-services-inner { grid-template-columns: 1fr; }
  .d42-service-item { border-right: none !important; }

  .d42-about-cols { grid-template-columns: 1fr; }
  .d42-about-col { border-right: none; padding: 0 0 var(--baseline) 0; }

  .d42-gallery-inner { grid-template-columns: repeat(2, 1fr); }
  .d42-gallery-cell:nth-child(2n) { border-right: none; }

  .d42-stats-inner { grid-template-columns: 1fr 1fr; }
  .d42-stat-cell:nth-child(2n) { border-right: none; }

  .d42-work-inner { grid-template-columns: 1fr; }
  .d42-work-item { border-right: none !important; border-bottom: 1px solid var(--rule-mid); }

  .d42-footer-inner { grid-template-columns: 1fr; gap: 24px; }

  .d42-index-bar { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .d42-ink, .d42-ink-d1, .d42-ink-d2, .d42-ink-d3, .d42-ink-d4, .d42-ink-d5 {
    animation: none;
    opacity: 1;
    filter: none;
    transform: none;
  }
  .d42-col-rule::after { transition: none; transform: scaleY(1); }
  .d42-gallery-cell:hover .d42-gallery-img img { transform: none; }
}
`;

/* ─── Scroll progress rail (horizontal, top) ── */
function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 28 });

  if (reduced) return null;
  return (
    <div className="d42-scroll-rail" aria-hidden="true">
      <motion.div className="d42-scroll-fill" style={{ scaleX }} />
    </div>
  );
}

/* ─── Ink reveal (framer-motion, scroll-triggered) ── */
function InkReveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-6% 0px" });

  const MotionTag = motion[Tag as "div"] ?? motion.div;

  return (
    <MotionTag
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 8, filter: "blur(6px)" }}
      animate={
        isInView || reduced
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 8, filter: "blur(6px)" }
      }
      transition={{
        duration: reduced ? 0 : 1.0,
        delay: reduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

/* ─── Column rule draw-in ── */
function ColRule({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <div ref={ref} className={`d42-col-rule${isInView ? " drawn" : ""}`}>
      {children}
    </div>
  );
}

/* ─── Count-up stat ── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (reduced) {
      setCount(target);
      return;
    }
    const dur = 1600;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target, reduced]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ─── Stat cell with animating underline ── */
function StatCell({
  num,
  suffix,
  label,
  delay,
}: {
  num: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <InkReveal delay={delay}>
      <div ref={ref} className="d42-stat-cell">
        <div className={`d42-stat-rule${isInView ? " drawn" : ""}`} />
        <span className="d42-stat-num">
          <CountUp target={num} suffix={suffix} />
        </span>
        <span className="d42-stat-label">{label}</span>
      </div>
    </InkReveal>
  );
}

/* ─── Page component ─────────────────────────────────────────── */
export default function Design42() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const SERVICES = [
    {
      num: "§ I",
      title: "AI Voice & WhatsApp Automation",
      body: "Round-the-clock inbound handling. Voice bots and WhatsApp agents that qualify, route, and respond before a human touches the queue. Deployed across clinics, logistics operators, and trade businesses.",
      img: "CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg",
      alt: "Waseem working at night beach cafe with phone and laptop",
    },
    {
      num: "§ II",
      title: "n8n Workflow Engineering",
      body: "Backend automation wired to CRMs, booking systems, and payment rails. Dead follow-ups automated. Lead pipelines closed. Built on n8n for full operator ownership — no vendor lock-in.",
      img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
      alt: "Waseem with dual laptops showing analytics dashboard",
    },
    {
      num: "§ III",
      title: "AEO & Answer-Engine Positioning",
      body: "Structured content and schema architecture that surfaces clients inside ChatGPT, Perplexity, and Google AI Overviews. The next generation of organic reach — before the keyword search is made.",
      img: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
      alt: "Waseem smiling on rooftop with laptop and dragonfruit smoothie",
    },
    {
      num: "§ IV",
      title: "Next.js Product Builds",
      body: "Full-stack web applications from concept to Vercel production. Booking funnels, client portals, SaaS dashboards. TypeScript-strict, performance-first, built to hand over without a manual.",
      img: "CAFE-WORK-2025-08-15-couch-laptop-brick-wall-cafe-candid.jpg",
      alt: "Waseem working on laptop in cafe with brick wall",
    },
    {
      num: "§ V",
      title: "Missed-Lead Recovery Systems",
      body: "Audits of where prospects enter and disappear. Automated re-engagement sequences, follow-up triggers, and CRM hygiene that converts the pipeline already in the building.",
      img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
      alt: "Waseem focused at coworking desk with phone",
    },
    {
      num: "§ VI",
      title: "Remote Delivery, Global Scope",
      body: "Operating from Bali and Lahore, serving clients across nine countries. Async-first, documentation-heavy, timezone-agnostic. Projects run clean and on-spec without a single in-person meeting.",
      img: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
      alt: "Waseem on hilltop with backpack and city vista",
    },
  ];

  const WORK = [
    {
      geo: "Healthcare · US",
      headline: "Clinic Booked Full. Receptionist Remained Unaware.",
      body: "WhatsApp bot handles inbound inquiries, qualifies for insurance, and books Zocdoc appointments. Physical therapy practice, United States.",
      img: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-phone-focus.jpg",
      alt: "Waseem focused on phone in garden cafe",
      tag: "Voice AI + Booking",
    },
    {
      geo: "Logistics · SG + US",
      headline: "The Receptionist That Never Clocks Out.",
      body: "AI voice and WhatsApp receptionist for trucking and airfreight operators. Dual-geo launch across Singapore and the United States.",
      img: "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
      alt: "Waseem with coffee and laptop, olive jacket",
      tag: "Voice AI + WhatsApp",
    },
    {
      geo: "Email SaaS · FR",
      headline: "2,000 Sends Per Hour. Zero Human Oversight.",
      body: "TakyCorp outreach platform — Gmail limit management, OOM hardening, and automated cron recovery. Zero-downtime patch delivered remotely.",
      img: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
      alt: "Night coworking session with team and laptops",
      tag: "n8n + Automation",
    },
    {
      geo: "Travel · IT",
      headline: "Gated by Destination. Unlocked by Code.",
      body: "IdeaViaggi — per-customer trip visibility for an Italian youth travel operator. REST-gated content delivery, GDPR-compliant from day one.",
      img: "TRAVEL-2026-05-24-jungle-bridge-standing-sunglasses-front.jpg",
      alt: "Waseem on jungle bridge, sunglasses, confident",
      tag: "WordPress + CPT",
    },
  ];

  const GALLERY = [
    {
      img: "CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg",
      alt: "Blue hour, peace sign, laptop and coconut",
      cap: "Bali, 2026",
    },
    {
      img: "PORTRAIT-2026-02-15-balcony-gray-adidas-soft-smile.jpg",
      alt: "Portrait on balcony, gray Adidas, soft smile",
      cap: "Lahore, 2026",
    },
    {
      img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
      alt: "Night cafe, typing, backlit keyboard",
      cap: "Night session, 2026",
    },
    {
      img: "LIFESTYLE-2025-08-08-rattan-chair-headphones-pavilion-relaxed.jpg",
      alt: "Rattan chair, headphones, pavilion",
      cap: "Pavilion, 2025",
    },
    {
      img: "TRAVEL-2025-03-28-canggu-beach-profile-cap-arms-crossed.jpg",
      alt: "Canggu beach, cap, arms crossed",
      cap: "Canggu, 2025",
    },
  ];

  return (
    <div className="d42-root">
      <style>{STYLES}</style>

      {/* Atmospheric layers */}
      <div className="d42-baseline" aria-hidden="true" />
      <div className="d42-grain" aria-hidden="true" />

      <div className="d42-page">
        <ScrollRail />

        {/* Skip nav */}
        <a href="#main-content" className="d42-skip">
          Skip to main content
        </a>

        {/* ── Folio strip — thin top line ── */}
        <div className="d42-folio" aria-hidden="true">
          <span>SkynetLabs · Independent Dispatch</span>
          <span className="d42-folio-center">skynetjoe.com</span>
          <span>Vol. VII · No. 42 · Est. 2019</span>
        </div>

        {/* ── Masthead ── */}
        <header role="banner">
          <div className="d42-masthead-wrap">
            <div className="d42-masthead">
              <div className="d42-dateline">
                <div>{dateStr}</div>
                <div style={{ marginTop: 2 }}>Bali · Lahore · Remote</div>
              </div>
              <div className="d42-nameplate d42-ink">
                Skynet<span className="d42-nameplate-accent">Labs</span>
              </div>
              <div className="d42-edition">
                <div>AI &amp; Automation Systems</div>
                <div style={{ marginTop: 2 }}>Vol. VII · No. 42</div>
              </div>
            </div>
            <div className="d42-masthead-tagline">
              "Building the systems that answer when no one is watching — since
              2019."
            </div>
          </div>

          {/* Nav strip */}
          <nav className="d42-nav-wrap" aria-label="Primary navigation">
            <div className="d42-nav">
              {[
                ["#automation", "Automation"],
                ["#builds", "Builds"],
                ["#aeo", "AEO"],
                ["#voice", "Voice AI"],
                ["#work", "Portfolio"],
                ["#about", "About"],
              ].map(([href, label]) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
              <a
                href="https://skynetjoe.com/discovery-call"
                className="d42-nav-cta"
                aria-label="Book a discovery call with Waseem Nasir"
              >
                Book a Call ↗
              </a>
            </div>
          </nav>
        </header>

        {/* ── Above-fold index bar ── */}
        <div className="d42-index-bar" aria-label="Contents">
          <div className="d42-index-inner">
            <span className="d42-index-label">Inside</span>
            <div className="d42-index-items">
              {[
                ["Voice AI", "Clinic books without a receptionist"],
                ["n8n", "2,000 sends per hour, zero oversight"],
                ["AEO", "Cited before the search result loads"],
                ["Next.js", "Portals built to hand over clean"],
                ["Global", "Nine countries, one operator"],
              ].map(([tag, text]) => (
                <div key={tag} className="d42-index-item">
                  <strong>{tag}</strong>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Hero ── */}
        <main id="main-content">
          <section aria-labelledby="hero-headline">
            <div className="d42-hero-wrap">
              <div className="d42-hero">
                {/* Main lede column */}
                <div className="d42-hero-main">
                  <InkReveal delay={0}>
                    <div className="d42-kicker-rule">
                      <span className="d42-kicker">
                        Dispatched from the field · Waseem Nasir · Founder,
                        SkynetLabs
                      </span>
                    </div>
                  </InkReveal>

                  <InkReveal delay={0.1}>
                    <h1 id="hero-headline" className="d42-h1">
                      The Founder Who Taught
                      <br />
                      the Phones to <em>Answer.</em>
                    </h1>
                  </InkReveal>

                  <InkReveal delay={0.22}>
                    <p className="d42-deck">
                      Filed since 2019 — 180+ builds, 40+ clients, 9 countries.
                      AI and automation systems that eliminate missed leads,
                      stalled follow-ups, and manual operations from the ground
                      up.
                    </p>
                  </InkReveal>

                  <InkReveal delay={0.32}>
                    <span className="d42-byline">
                      Waseem Nasir · SkynetLabs · Canggu, Bali · 2026
                    </span>
                  </InkReveal>

                  <InkReveal delay={0.42}>
                    <div
                      className="d42-img-frame"
                      style={{ height: 340, marginBottom: "var(--baseline)" }}
                    >
                      <img
                        src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                        alt="Waseem Nasir at a Bali terrace, working on laptop with coffee"
                        loading="eager"
                      />
                    </div>
                    <p className="d42-img-caption">
                      Waseem Nasir, SkynetLabs · Canggu, Bali · May 2026 ·
                      Photo: Field Dispatch
                    </p>
                  </InkReveal>

                  <InkReveal delay={0.55}>
                    <div
                      className="d42-body"
                      style={{ marginTop: "var(--baseline)" }}
                    >
                      <p className="d42-dropcap">
                        In seven years of independent practice, Waseem Nasir has
                        shipped more than 180 production systems — voice bots
                        that handle inbound calls at three in the morning, n8n
                        workflows that route and reply without human oversight,
                        AEO architectures that position clients inside the
                        answers that language models surface before a search
                        result is ever clicked.
                      </p>
                      <p>
                        The work is declarative: identify the leak, build the
                        mechanism that seals it, hand over the keys. No
                        retainers for retainer's sake. No sprawling agencies in
                        the chain. One operator, one standard of precision,
                        shipped to forty clients across nine countries.
                      </p>
                    </div>
                  </InkReveal>
                </div>

                {/* Sidebar — intelligence brief */}
                <aside
                  className="d42-hero-sidebar"
                  aria-label="Briefs and field notes"
                >
                  <InkReveal delay={0.18}>
                    <span className="d42-section-label">
                      Intelligence Brief
                    </span>
                    <div className="d42-pullquote">
                      <blockquote>
                        "The phone rang. The bot answered. The client was
                        already asleep. That is the whole point."
                      </blockquote>
                      <cite>— W. Nasir, SkynetLabs · Dispatch No. 42</cite>
                    </div>
                  </InkReveal>

                  <InkReveal delay={0.3}>
                    <span className="d42-section-label">Filed Location</span>
                    <div className="d42-img-frame" style={{ height: 188 }}>
                      <img
                        src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                        alt="Waseem Nasir on cliffs of Nusa Penida, Bali"
                      />
                    </div>
                    <p className="d42-img-caption">
                      Nusa Penida, Indonesia · Remote operations since 2019
                    </p>
                  </InkReveal>

                  <InkReveal delay={0.42}>
                    <div className="d42-img-frame" style={{ height: 164 }}>
                      <img
                        src="/img/pro/TRAVEL-google-office-sign-cream-outfit.jpg"
                        alt="Waseem Nasir at Google office"
                      />
                    </div>
                    <p className="d42-img-caption">
                      Google Campus · Enterprise client delivery
                    </p>
                  </InkReveal>

                  <InkReveal delay={0.52}>
                    <span className="d42-section-label">Contact the Desk</span>
                    <a
                      href="https://skynetjoe.com/discovery-call"
                      className="d42-cta-link"
                      style={{
                        display: "block",
                        textAlign: "center",
                        marginTop: 8,
                        background: "var(--accent2)",
                        color: "#F2EFE6",
                        borderColor: "var(--accent2)",
                      }}
                    >
                      File a 30-Minute Brief ↗
                    </a>
                  </InkReveal>

                  <InkReveal delay={0.6}>
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 9.5,
                        letterSpacing: "0.06em",
                        lineHeight: 1.8,
                        color: "var(--muted-lt)",
                        borderTop: "1px solid var(--rule)",
                        paddingTop: 12,
                      }}
                    >
                      <div
                        style={{
                          color: "var(--muted)",
                          marginBottom: 6,
                          fontSize: 9,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                        }}
                      >
                        Corrections & Contact
                      </div>
                      <div>waseembali2k26@gmail.com</div>
                      <div>github.com/waseemnasir2k26</div>
                      <div>skynetjoe.com/discovery-call</div>
                    </div>
                  </InkReveal>
                </aside>
              </div>
            </div>
          </section>

          {/* ── Stats bar ── */}
          <section aria-label="Record of operations">
            <div className="d42-stats-wrap">
              <div className="d42-stats-inner">
                {[
                  { num: 180, suffix: "+", label: "Production Builds Shipped" },
                  { num: 40, suffix: "+", label: "Clients Across 9 Countries" },
                  { num: 9, suffix: "", label: "Countries of Operation" },
                  { num: 2019, suffix: "", label: "Year Founded" },
                ].map((s, i) => (
                  <StatCell key={s.label} {...s} delay={i * 0.09} />
                ))}
              </div>
            </div>
          </section>

          {/* ── Services ── */}
          <section id="automation" aria-labelledby="services-heading">
            <div className="d42-section-strip">
              <span id="services-heading">
                Capabilities &amp; Filed Disciplines
              </span>
            </div>
            <div className="d42-services-wrap">
              <div className="d42-services-inner">
                {SERVICES.map((svc, i) => (
                  <InkReveal key={svc.num} delay={i * 0.07}>
                    <div className="d42-service-item">
                      <span className="d42-service-num">{svc.num}</span>
                      <h3 className="d42-h3">{svc.title}</h3>
                      <div
                        className={`d42-img-frame d42-svc-img-${i}`}
                        style={{ marginBottom: 12 }}
                      >
                        <img src={`/img/pro/${svc.img}`} alt={svc.alt} />
                      </div>
                      <p className="d42-body" style={{ marginBottom: 0 }}>
                        {svc.body}
                      </p>
                    </div>
                  </InkReveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Selected work ── */}
          <section id="work" aria-labelledby="work-heading">
            <div className="d42-section-strip">
              <span id="work-heading">
                Selected Dispatches — Portfolio of Record
              </span>
            </div>
            <div className="d42-work-wrap">
              <div className="d42-work-inner">
                {WORK.map((w, i) => (
                  <InkReveal key={w.geo} delay={i * 0.09}>
                    <div className="d42-work-item">
                      <span className="d42-section-label">{w.geo}</span>
                      <div className="d42-img-frame" style={{ height: 190 }}>
                        <img src={`/img/pro/${w.img}`} alt={w.alt} />
                      </div>
                      <h3 className="d42-h3" style={{ marginTop: 10 }}>
                        {w.headline}
                      </h3>
                      <p className="d42-body" style={{ marginBottom: 6 }}>
                        {w.body}
                      </p>
                      <span className="d42-tag">{w.tag}</span>
                    </div>
                  </InkReveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Pull quote strip ── */}
          <div className="d42-quote-strip">
            <InkReveal delay={0}>
              <div className="d42-quote-strip-inner">
                <div className="d42-ornament">✦ ✦ ✦</div>
                <blockquote>
                  "Most businesses do not have a marketing problem. They have a
                  response problem. The lead arrived. No one was there."
                </blockquote>
                <cite>
                  <span className="d42-dagger">§</span>
                  Waseem Nasir, SkynetLabs · Field Notes, 2024
                  <span className="d42-dagger">§</span>
                </cite>
              </div>
            </InkReveal>
          </div>

          {/* ── About ── */}
          <section id="about" aria-labelledby="about-heading">
            <div className="d42-section-strip">
              <span id="about-heading">
                Correspondent Profile — Waseem Nasir
              </span>
            </div>

            <div className="d42-about-wrap">
              <div className="d42-about-inner">
                {/* Portrait */}
                <div className="d42-about-photo">
                  <InkReveal delay={0}>
                    <div className="d42-img-frame" style={{ height: 480 }}>
                      <img
                        src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                        alt="Waseem Nasir — founder portrait, black prince coat, balcony"
                      />
                    </div>
                    <p className="d42-img-caption">
                      Waseem Nasir · Founder, SkynetLabs · Lahore, 2026
                    </p>
                    <div style={{ marginTop: 20 }}>
                      <div className="d42-img-frame" style={{ height: 200 }}>
                        <img
                          src="/img/pro/EVENT-expo-booth-navy-polo-chandelier-hall.jpg"
                          alt="Waseem Nasir at expo booth, navy polo, chandelier hall"
                        />
                      </div>
                      <p className="d42-img-caption">
                        Tech Expo · Enterprise client engagement
                      </p>
                    </div>
                  </InkReveal>
                </div>

                {/* Three editorial columns */}
                <div className="d42-about-cols">
                  <div className="d42-about-col">
                    <InkReveal delay={0.14}>
                      <span className="d42-section-label">
                        The Correspondent
                      </span>
                      <div className="d42-body">
                        <p className="d42-dropcap">
                          Waseem Nasir founded SkynetLabs in 2019 with a single
                          premise: that the tools of enterprise automation
                          should be available to any business willing to deploy
                          them precisely.
                        </p>
                        <p>
                          Since then, the practice has grown to span nine
                          countries, forty-plus clients, and more than 180
                          shipped systems — without a single office, a standing
                          team, or a retainer that was not earned.
                        </p>
                      </div>
                    </InkReveal>
                  </div>

                  <div className="d42-about-col">
                    <InkReveal delay={0.24}>
                      <span className="d42-section-label">The Method</span>
                      <div className="d42-body">
                        <p>
                          Every engagement begins with a diagnostic: where does
                          the process leak, and at what cost? The answer is
                          almost always the same — a human task that should have
                          been automated years ago.
                        </p>
                        <p>
                          The build phase is compact and documented. Systems are
                          handed over with runbooks, not locked behind
                          dashboards. Clients operate their own infrastructure.
                          That is the standard.
                        </p>
                      </div>
                      <div
                        className="d42-img-frame"
                        style={{ height: 168, marginTop: 4 }}
                      >
                        <img
                          src="/img/pro/WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg"
                          alt="Waseem with client, thumbs up, smiling in cafe"
                        />
                      </div>
                      <p className="d42-img-caption">
                        Client delivery session · 2025
                      </p>
                    </InkReveal>
                  </div>

                  <div className="d42-about-col">
                    <InkReveal delay={0.34}>
                      <span className="d42-section-label">
                        The Dispatch Route
                      </span>
                      <div className="d42-body">
                        <p>
                          Operations run from Bali and Lahore. Projects are
                          async-first. Every deliverable arrives with
                          documentation sufficient to run without the builder
                          present.
                        </p>
                        <p>
                          The client list includes physical therapy practices in
                          the United States, freight operators in Singapore,
                          travel platforms in Italy, and email SaaS companies in
                          France.
                        </p>
                      </div>
                      <div
                        className="d42-img-frame"
                        style={{ height: 168, marginTop: 4 }}
                      >
                        <img
                          src="/img/pro/TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg"
                          alt="Waseem in tan knit sweater on mountain ridge"
                        />
                      </div>
                      <p className="d42-img-caption">
                        Mountain ridge, 2026 · Filed remotely
                      </p>
                    </InkReveal>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Photo gallery ── */}
          <section aria-label="Field photographs — nine countries of operation">
            <div className="d42-section-strip">
              <span>Field Photographs — From Nine Countries of Operation</span>
            </div>
            <div className="d42-gallery-wrap">
              <div className="d42-gallery-inner">
                {GALLERY.map((p, i) => (
                  <InkReveal key={p.img} delay={i * 0.06}>
                    <div className="d42-gallery-cell">
                      <div className="d42-gallery-img">
                        <img src={`/img/pro/${p.img}`} alt={p.alt} />
                      </div>
                      <div className="d42-gallery-cap">{p.cap}</div>
                    </div>
                  </InkReveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section aria-labelledby="cta-heading">
            <div className="d42-cta-wrap">
              <div className="d42-cta-watermark" aria-hidden="true">
                SkynetLabs
              </div>
              <InkReveal delay={0}>
                <span className="d42-cta-label">
                  File a Dispatch · 30 Minutes · No Obligation
                </span>
                <h2 id="cta-heading" className="d42-cta-headline">
                  Commission a System.
                  <br />
                  Stop the Leak.
                </h2>
                <p className="d42-cta-subhead">
                  A 30-minute call to diagnose the gap, propose the build, and
                  establish whether SkynetLabs is the right operator. No decks.
                  No pitch theatre. No retainers for retainer's sake.
                </p>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="d42-cta-link"
                  aria-label="Book a 30-minute discovery call with Waseem Nasir"
                >
                  Book a 30-Minute Call ↗
                </a>
              </InkReveal>
            </div>
          </section>
        </main>

        {/* ── Footer ── */}
        <footer className="d42-footer" role="contentinfo">
          <div className="d42-footer-inner">
            <div>
              <div className="d42-footer-name">SkynetLabs</div>
              <div
                style={{
                  color: "rgba(242,239,230,0.45)",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  marginBottom: 14,
                }}
              >
                Waseem Nasir · Independent Founder · Est. 2019
              </div>
              <div style={{ lineHeight: 1.8, color: "rgba(242,239,230,0.45)" }}>
                AI &amp; Automation Systems
                <br />
                Bali · Lahore · Remote
              </div>
            </div>

            <div>
              <div className="d42-footer-col-head">Dispatch Links</div>
              <a href="https://skynetjoe.com/discovery-call">
                Book a Discovery Call ↗
              </a>
              <a
                href="https://skynetjoe.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                skynetjoe.com ↗
              </a>
              <a
                href="https://github.com/waseemnasir2k26"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/waseemnasir2k26 ↗
              </a>
            </div>

            <div>
              <div className="d42-footer-col-head">Copyright Notice</div>
              <div style={{ lineHeight: 1.8, color: "rgba(242,239,230,0.45)" }}>
                © {new Date().getFullYear()} SkynetLabs.
                <br />
                All systems built to spec.
                <br />
                No retainers for retainer's sake.
                <br />
                180+ builds delivered.
              </div>
            </div>
          </div>

          <hr className="d42-footer-rule" />
          <div className="d42-footer-bottom">
            <span>SkynetLabs · Independent Dispatch · Vol. VII · No. 42</span>
            <span>skynetjoe.com · waseemnasir.vercel.app</span>
            <span>All rights reserved · {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
