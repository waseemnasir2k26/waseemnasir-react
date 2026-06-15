"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionValue,
  animate,
} from "framer-motion";

/* ─── scoped styles ─────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Libre+Franklin:ital,wght@0,400;0,500;0,600;1,400&family=Spline+Sans+Mono:wght@400&display=swap');

/* ── Skip link ── */
.r44-skip {
  position: fixed;
  top: -100px;
  left: 1rem;
  z-index: 99999;
  background: #C04A1E;
  color: #F2EEE6;
  padding: 0.6rem 1.2rem;
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.82rem;
  letter-spacing: 0.06em;
  text-decoration: none;
  transition: top 0.15s;
}
.r44-skip:focus { top: 1rem; }

.r44 {
  font-family: 'Libre Franklin', sans-serif;
  background: #F2EEE6;
  color: #23211C;
  overflow-x: hidden;
  position: relative;
  z-index: 2;
  min-height: 100vh;
}
.r44 *, .r44 *::before, .r44 *::after { box-sizing: border-box; margin: 0; padding: 0; }

.r44-display { font-family: 'Libre Caslon Display', Georgia, serif; }
.r44-mono    { font-family: 'Spline Sans Mono', monospace; font-size: 0.8em; letter-spacing: 0.06em; }

/* ── Progress rail ── */
.r44-rail {
  position: fixed;
  left: 0; top: 0;
  width: 3px;
  height: 100vh;
  background: #E4DCCB;
  z-index: 9999;
}
.r44-rail-fill {
  width: 100%;
  background: #C04A1E;
  transform-origin: top;
}

/* ── Masthead / top bar ── */
.r44-masthead {
  border-bottom: 1.5px solid #23211C;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  background: #F2EEE6;
  transition: box-shadow 0.2s;
}
.r44-masthead.scrolled {
  box-shadow: 0 2px 12px rgba(35,33,28,0.08);
}
.r44-masthead-brand {
  font-family: 'Libre Caslon Display', serif;
  font-size: 1.05rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.9rem 0;
}
.r44-masthead-meta {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7A7468;
}
.r44-masthead-cta {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #F2EEE6;
  background: #C04A1E;
  padding: 0.45rem 1rem;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}
.r44-masthead-cta:hover { background: #23211C; }
.r44-masthead-cta:focus-visible { outline: 2px solid #C04A1E; outline-offset: 2px; }

/* ── Chapter index (left sidebar) ── */
.r44-index {
  position: fixed;
  left: 3px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  padding: 0 0.9rem;
}
.r44-index-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  background: none;
  border: none;
  text-align: left;
  position: relative;
}
/* Tooltip on hover */
.r44-index-item::after {
  content: attr(data-label);
  position: absolute;
  left: calc(100% + 0.6rem);
  top: 50%;
  transform: translateY(-50%);
  background: #23211C;
  color: #F2EEE6;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
}
.r44-index-item:hover::after,
.r44-index-item:focus-visible::after { opacity: 1; }
.r44-index-item:focus-visible { outline: 2px solid #C04A1E; outline-offset: 3px; }
.r44-index-num {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.62rem;
  color: #7A7468;
  transition: color 0.25s;
  letter-spacing: 0.06em;
}
.r44-index-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #E4DCCB;
  transition: background 0.25s, transform 0.25s;
  flex-shrink: 0;
}
.r44-index-item.active .r44-index-dot { background: #C04A1E; transform: scale(1.6); }
.r44-index-item.active .r44-index-num { color: #C04A1E; }

/* ── Main layout ── */
.r44-main { padding-left: 3.5rem; }

/* ── Hero ── */
.r44-hero {
  padding: 5rem 3rem 4rem 3rem;
  border-bottom: 1.5px solid #23211C;
  max-width: 1100px;
  position: relative;
}
/* Department stamp — top right corner */
.r44-hero-stamp {
  position: absolute;
  top: 2.5rem;
  right: 3rem;
  text-align: right;
}
.r44-hero-stamp-line {
  display: block;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #C04A1E;
  line-height: 1.8;
}
.r44-hero-stamp-rule {
  width: 100%;
  height: 1px;
  background: #C04A1E;
  margin-bottom: 0.4rem;
  opacity: 0.5;
}
.r44-kicker {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #C04A1E;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.r44-kicker::before {
  content: '';
  display: inline-block;
  width: 2rem;
  height: 1px;
  background: #C04A1E;
}
.r44-hero-hed {
  font-family: 'Libre Caslon Display', serif;
  font-size: clamp(2.4rem, 6vw, 5.2rem);
  line-height: 1.04;
  letter-spacing: -0.01em;
  color: #23211C;
  max-width: 820px;
  margin-bottom: 1.8rem;
}
.r44-hero-standfirst {
  font-size: 1.05rem;
  line-height: 1.65;
  color: #7A7468;
  max-width: 580px;
  border-left: 2px solid #C04A1E;
  padding-left: 1.2rem;
  margin-bottom: 2.5rem;
}
.r44-hero-dateline {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7A7468;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.r44-hero-dateline::before {
  content: '';
  display: inline-block;
  width: 1.2rem;
  height: 1px;
  background: #7A7468;
  flex-shrink: 0;
}

/* ── Chapter sections ── */
.r44-chapter {
  border-bottom: 1.5px solid #E4DCCB;
  padding: 4rem 3rem;
  max-width: 1100px;
}
.r44-chapter-header {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 1.5rem;
  align-items: start;
  margin-bottom: 2.5rem;
}
.r44-chapter-num {
  font-family: 'Libre Caslon Display', serif;
  font-size: 3rem;
  color: #E4DCCB;
  line-height: 1;
  user-select: none;
}
.r44-chapter-title {
  font-family: 'Libre Caslon Display', serif;
  font-size: clamp(1.4rem, 3vw, 2rem);
  line-height: 1.15;
  color: #23211C;
  padding-top: 0.4rem;
}
.r44-chapter-title-kicker {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #C04A1E;
  margin-bottom: 0.4rem;
}

/* ── Stats row ── */
.r44-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid #23211C;
  margin-bottom: 3rem;
}
@media (max-width: 640px) {
  .r44-stats { grid-template-columns: repeat(2, 1fr); }
  .r44-stat:nth-child(2) { border-right: none; }
  .r44-stat:nth-child(3) { border-bottom: none; }
}
.r44-stat {
  padding: 1.6rem 1.4rem;
  border-right: 1px solid #23211C;
  position: relative;
}
.r44-stat:last-child { border-right: none; }
.r44-stat-num {
  font-family: 'Libre Caslon Display', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;
  color: #23211C;
  margin-bottom: 0.3rem;
}
.r44-stat-num span { color: #C04A1E; }
.r44-stat-label {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7A7468;
}
.r44-stat-note {
  display: inline-block;
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.52rem;
  color: #C04A1E;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.15rem;
}

/* ── THE BRIEF sidebar box ── */
.r44-brief-box {
  background: #E4DCCB;
  border: 1px solid #23211C;
  padding: 1.4rem 1.6rem;
  margin-bottom: 2rem;
}
.r44-brief-box-label {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #C04A1E;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.r44-brief-box-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #C04A1E;
  opacity: 0.4;
}
.r44-brief-body {
  font-size: 0.88rem;
  line-height: 1.65;
  color: #23211C;
}

/* ── Fact box ── */
.r44-fact-box {
  border-left: 3px solid #C04A1E;
  padding: 1rem 1.4rem;
  background: #F2EEE6;
  margin: 2rem 0;
}
.r44-fact-label {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #C04A1E;
  margin-bottom: 0.4rem;
}
.r44-fact-body {
  font-size: 0.92rem;
  line-height: 1.6;
  color: #23211C;
}

/* ── Two-col body text ── */
.r44-body-2col {
  columns: 2;
  column-gap: 2.5rem;
  font-size: 0.96rem;
  line-height: 1.75;
  color: #23211C;
}
.r44-body-2col p { break-inside: avoid; margin-bottom: 1rem; }
@media (max-width: 640px) { .r44-body-2col { columns: 1; } }

/* ── Services grid ── */
.r44-services {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border: 1px solid #23211C;
  margin-top: 2rem;
}
@media (max-width: 768px) { .r44-services { grid-template-columns: 1fr; } }
.r44-service {
  padding: 1.8rem 1.6rem;
  border-right: 1px solid #23211C;
  border-bottom: 1px solid #23211C;
  position: relative;
  transition: background 0.2s;
  cursor: default;
}
.r44-service:hover { background: #EAE4D6; }
.r44-service:nth-child(3n) { border-right: none; }
.r44-service:nth-last-child(-n+3) { border-bottom: none; }
/* Red corner accent on hover */
.r44-service::after {
  content: '';
  position: absolute;
  top: 0; right: 0;
  width: 0; height: 0;
  border-style: solid;
  border-width: 0 0 0 0;
  border-color: transparent #C04A1E transparent transparent;
  transition: border-width 0.18s ease;
}
.r44-service:hover::after {
  border-width: 0 18px 18px 0;
}
.r44-service-code {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: #C04A1E;
  margin-bottom: 0.8rem;
}
.r44-service-name {
  font-family: 'Libre Caslon Display', serif;
  font-size: 1.05rem;
  color: #23211C;
  margin-bottom: 0.6rem;
  line-height: 1.3;
}
.r44-service-desc {
  font-size: 0.82rem;
  line-height: 1.65;
  color: #7A7468;
}

/* ── Photo strip (horizontal drag-scroll) ── */
.r44-strip-wrapper {
  overflow: hidden;
  border-top: 1px solid #23211C;
  border-bottom: 1px solid #23211C;
  cursor: grab;
  position: relative;
}
.r44-strip-wrapper:active { cursor: grabbing; }
.r44-strip-inner {
  display: flex;
  gap: 0;
  width: max-content;
}
.r44-strip-img {
  height: 340px;
  width: 260px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
  border-right: 1px solid #23211C;
  user-select: none;
  pointer-events: none;
}
.r44-strip-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 3rem;
}
.r44-strip-caption {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.63rem;
  letter-spacing: 0.1em;
  color: #7A7468;
  text-transform: uppercase;
}
.r44-strip-hint {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  color: #C04A1E;
  text-transform: uppercase;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* ── Work items ── */
.r44-work-list { display: flex; flex-direction: column; }
.r44-work-item {
  display: grid;
  grid-template-columns: 2.5rem 1fr auto;
  align-items: baseline;
  gap: 1.5rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid #E4DCCB;
  font-size: 0.95rem;
  transition: background 0.15s;
}
.r44-work-item:first-child { border-top: 1px solid #E4DCCB; }
.r44-work-item:hover { background: rgba(192,74,30,0.04); }
.r44-work-item:hover .r44-work-n { color: #C04A1E; }
.r44-work-n {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.62rem;
  color: #7A7468;
  transition: color 0.15s;
}
.r44-work-name { font-weight: 600; color: #23211C; }
.r44-work-type {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  color: #2C5545;
  text-transform: uppercase;
}
.r44-work-country {
  font-size: 0.78rem;
  color: #7A7468;
}

/* ── About section ── */
.r44-about-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 4rem;
  align-items: start;
}
@media (max-width: 768px) { .r44-about-grid { grid-template-columns: 1fr; gap: 2rem; } }
.r44-about-img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  object-position: top;
  display: block;
  border: 1px solid #23211C;
}
.r44-about-text {
  padding-top: 0.5rem;
}
.r44-about-name {
  font-family: 'Libre Caslon Display', serif;
  font-size: 2.2rem;
  line-height: 1.1;
  margin-bottom: 0.3rem;
}
.r44-about-title {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #C04A1E;
  margin-bottom: 1.5rem;
}
.r44-about-bio {
  font-size: 0.95rem;
  line-height: 1.75;
  color: #23211C;
  margin-bottom: 1.4rem;
}
.r44-about-bio + .r44-about-bio { color: #7A7468; }
.r44-locations {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}
.r44-location-pill {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #2C5545;
  background: rgba(44,85,69,0.08);
  padding: 0.3rem 0.7rem;
  border: 1px solid rgba(44,85,69,0.25);
}

/* ── CTA / Contact ── */
.r44-cta-section {
  background: #23211C;
  color: #F2EEE6;
  padding: 5rem 3rem 5rem 6.5rem;
}
.r44-cta-inner {
  max-width: 700px;
}
.r44-cta-kicker {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #C04A1E;
  margin-bottom: 1.2rem;
}
.r44-cta-hed {
  font-family: 'Libre Caslon Display', serif;
  font-size: clamp(2rem, 5vw, 3.8rem);
  line-height: 1.08;
  color: #F2EEE6;
  margin-bottom: 1.2rem;
}
.r44-cta-body {
  font-size: 0.98rem;
  line-height: 1.7;
  color: rgba(242,238,230,0.65);
  margin-bottom: 2.5rem;
  max-width: 520px;
}
.r44-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  background: #C04A1E;
  color: #F2EEE6;
  text-decoration: none;
  padding: 1rem 2rem;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
  transition: background 0.2s, gap 0.2s;
}
.r44-cta-btn:hover { background: #E55C28; gap: 1.2rem; }
.r44-cta-btn:focus-visible { outline: 2px solid #C04A1E; outline-offset: 3px; }
.r44-cta-btn-arrow { font-size: 1rem; }
.r44-cta-contacts {
  margin-top: 3.5rem;
  border-top: 1px solid rgba(242,238,230,0.15);
  padding-top: 2rem;
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
}
.r44-cta-contact-item {}
.r44-cta-contact-label {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #C04A1E;
  margin-bottom: 0.3rem;
}
.r44-cta-contact-val {
  font-size: 0.88rem;
  color: rgba(242,238,230,0.65);
  text-decoration: none;
  transition: color 0.15s;
}
a.r44-cta-contact-val:hover { color: #F2EEE6; }

/* ── Footer ── */
.r44-footer {
  background: #F2EEE6;
  border-top: 1.5px solid #23211C;
  padding: 2rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.r44-footer-brand {
  font-family: 'Libre Caslon Display', serif;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.r44-footer-meta {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  color: #7A7468;
  text-transform: uppercase;
}
.r44-footer-link {
  color: #7A7468;
  text-decoration: none;
  transition: color 0.2s;
}
.r44-footer-link:hover { color: #C04A1E; }
.r44-footer-link:focus-visible { outline: 2px solid #C04A1E; outline-offset: 2px; }

/* ── Divider rule ── */
.r44-rule {
  border: none;
  border-top: 1px solid #E4DCCB;
  margin: 0;
}

/* ── Pull quote ── */
.r44-pullquote {
  padding: 1.8rem 0 1.6rem;
  margin: 2rem 0;
  border-top: 2px solid #C04A1E;
  border-bottom: 1px solid #E4DCCB;
}
.r44-pullquote-text {
  font-family: 'Libre Caslon Display', serif;
  font-size: clamp(1.2rem, 2.5vw, 1.7rem);
  line-height: 1.45;
  color: #23211C;
  font-style: italic;
  margin-bottom: 0.8rem;
}
.r44-pullquote-attr {
  font-family: 'Spline Sans Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #C04A1E;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.r44-pullquote-attr::before {
  content: '';
  display: inline-block;
  width: 1.4rem;
  height: 1px;
  background: #C04A1E;
}

/* ── Reduced motion overrides ── */
@media (prefers-reduced-motion: reduce) {
  .r44 * { animation: none !important; transition: none !important; }
}

/* ── Mobile index hide ── */
@media (max-width: 480px) {
  .r44-index { display: none; }
  .r44-main { padding-left: 0.5rem; }
  .r44-cta-section { padding-left: 1.5rem; }
}
`;

/* ─── data ─────────────────────────────────────────────────────────────── */
const CHAPTERS = [
  { num: "01", label: "Briefing" },
  { num: "02", label: "Record" },
  { num: "03", label: "Operations" },
  { num: "04", label: "Field Work" },
  { num: "05", label: "Dossier" },
  { num: "06", label: "Contact" },
];

const SERVICES = [
  {
    code: "SVC-01",
    name: "AI Voice & Chat Bots",
    desc: "Inbound lead qualification, after-hours coverage, appointment booking — deployed in days, not quarters.",
  },
  {
    code: "SVC-02",
    name: "Workflow Automation",
    desc: "n8n-native orchestration across CRM, email, Slack, and databases. If a human is doing it on repeat, it's a workflow.",
  },
  {
    code: "SVC-03",
    name: "Next.js Builds",
    desc: "Production sites that load fast, rank well, and hold up under scrutiny. No templates. Bespoke engineering.",
  },
  {
    code: "SVC-04",
    name: "AEO & AI Search",
    desc: "Answer Engine Optimisation — structured so that Claude, ChatGPT and Perplexity cite you, not a competitor.",
  },
  {
    code: "SVC-05",
    name: "WhatsApp Automation",
    desc: "Meta Business API wired to your CRM. Follow-ups fire automatically. Nothing falls through the gap.",
  },
  {
    code: "SVC-06",
    name: "Systems Audit",
    desc: "A documented map of where your operation leaks time and money, with a ranked fix list and effort estimates.",
  },
];

const WORK_ITEMS = [
  {
    n: "01",
    name: "FreightOps Voice Receptionist",
    type: "AI Voice",
    country: "United States",
  },
  {
    n: "02",
    name: "Inspire Health PT — $27 Funnel",
    type: "Funnel + Automation",
    country: "United States",
  },
  {
    n: "03",
    name: "IdeaViaggi Trip-Input System",
    type: "WP Plugin + AEO",
    country: "Italy",
  },
  {
    n: "04",
    name: "TakyCorp Email Automation",
    type: "n8n Workflow",
    country: "France",
  },
  {
    n: "05",
    name: "SkynetJoe AEO Overhaul",
    type: "AEO + Next.js",
    country: "Remote",
  },
  {
    n: "06",
    name: "GigSignal Chrome Extension",
    type: "Browser Tool",
    country: "Pakistan",
  },
  {
    n: "07",
    name: "Meta Ads Dual-Geo Launch",
    type: "Performance Marketing",
    country: "Singapore + US",
  },
  {
    n: "08",
    name: "AEO Engine v0.7.0",
    type: "AI Search Engine",
    country: "Remote",
  },
];

const STRIP_PHOTOS: { src: string; alt: string }[] = [
  {
    src: "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    alt: "Working from a Bali terrace with laptop and latte",
  },
  {
    src: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    alt: "Portrait on balcony in black prince coat",
  },
  {
    src: "/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
    alt: "Rooftop cafe session with mountain backdrop",
  },
  {
    src: "/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
    alt: "At Nusa Penida cliffs, arms spread",
  },
  {
    src: "/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
    alt: "Rooftop work session with dragonfruit smoothie",
  },
  {
    src: "/img/pro/EVENT-expo-booth-navy-polo-chandelier-hall.jpg",
    alt: "At expo booth in chandelier hall",
  },
  {
    src: "/img/pro/WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
    alt: "Night coworking team selfie with laptops",
  },
  {
    src: "/img/pro/TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
    alt: "Hilltop view with city vista",
  },
  {
    src: "/img/pro/CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
    alt: "Working with coffee and tea sign backdrop",
  },
  {
    src: "/img/pro/SCENERY-2026-05-24-green-valley-hills-cloud-pano.jpg",
    alt: "Panoramic green valley and hills",
  },
];

/* ─── count-up hook ─────────────────────────────────────────────────────── */
function useCountUp(target: number, inView: boolean, reduced: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView || reduced) {
      setVal(target);
      return;
    }
    const ctrl = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, target, reduced]);
  return val;
}

/* ─── DragStrip — shared scroll position via externalRef ────────────────── */
function DragStrip({
  reduced,
  caption,
}: {
  reduced: boolean;
  caption: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const rafRef = useRef<number | null>(null);
  const paused = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft.current = ref.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (ref.current?.offsetLeft ?? 0);
    const walk = (x - startX.current) * 1.4;
    if (ref.current) ref.current.scrollLeft = scrollLeft.current - walk;
  };
  const onEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (reduced || !ref.current) return;
    let pos = 0;
    const el = ref.current;

    const tick = () => {
      if (!paused.current) {
        pos += 0.45;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const pause = () => {
      paused.current = true;
    };
    const resume = () => {
      paused.current = false;
    };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, [reduced]);

  const doubled = [...STRIP_PHOTOS, ...STRIP_PHOTOS];

  return (
    <div>
      <div
        ref={ref}
        className="r44-strip-wrapper"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        style={{ overflowX: "auto", scrollbarWidth: "none" }}
        role="region"
        aria-label="Photo strip — drag or use arrow keys to scroll"
        tabIndex={0}
      >
        <div className="r44-strip-inner">
          {doubled.map((p, i) => (
            <img
              key={i}
              src={p.src}
              alt={i < STRIP_PHOTOS.length ? p.alt : ""}
              aria-hidden={i >= STRIP_PHOTOS.length ? "true" : undefined}
              className="r44-strip-img"
              draggable={false}
              loading="lazy"
            />
          ))}
        </div>
      </div>
      <div className="r44-strip-meta">
        <span className="r44-strip-caption r44-mono">{caption}</span>
        <span className="r44-strip-hint r44-mono" aria-hidden="true">
          drag &#8592;&#8594;
        </span>
      </div>
    </div>
  );
}

/* ─── Chapter number flip animation ─────────────────────────────────────── */
function ChapterNum({
  num,
  inView,
  reduced,
}: {
  num: string;
  inView: boolean;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="r44-chapter-num r44-display"
      initial={reduced ? false : { opacity: 0, y: -20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {num}
    </motion.div>
  );
}

/* ─── Stat block ─────────────────────────────────────────────────────────── */
function StatBlock({
  num,
  suffix,
  label,
  note,
  inView,
  reduced,
}: {
  num: number;
  suffix: string;
  label: string;
  note?: string;
  inView: boolean;
  reduced: boolean;
}) {
  const val = useCountUp(num, inView, reduced);
  return (
    <div className="r44-stat">
      {note && <span className="r44-stat-note r44-mono">{note}</span>}
      <div className="r44-stat-num r44-display">
        {val}
        <span>{suffix}</span>
      </div>
      <div className="r44-stat-label r44-mono">{label}</div>
    </div>
  );
}

/* ─── Section observer hook ─────────────────────────────────────────────── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function Page44() {
  const reduced = useReducedMotion() ?? false;

  // Scroll progress for left rail
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // Active chapter tracking
  const [activeChapter, setActiveChapter] = useState(0);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  // Masthead scroll shadow
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = chapterRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setActiveChapter(i);
        },
        { threshold: 0.3 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const scrollTo = (i: number) => {
    chapterRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // In-view states — defined at top-level (no hook-in-loop)
  const ch0 = useInView(0.15);
  const ch1 = useInView(0.15);
  const ch2 = useInView(0.15);
  const ch3 = useInView(0.15);
  const ch4 = useInView(0.15);
  const ch5 = useInView(0.15);
  const chapterInViews = [ch0, ch1, ch2, ch3, ch4, ch5];

  const { ref: statsRef, inView: statsInView } = useInView(0.3);

  // Helper: attach both chapterRef and inView ref to the same element
  const attachRefs = useCallback(
    (idx: number, inViewRef: React.MutableRefObject<HTMLElement | null>) =>
      (el: HTMLElement | null) => {
        chapterRefs.current[idx] = el;
        inViewRef.current = el;
      },
    [],
  );

  return (
    <>
      <style>{STYLES}</style>

      {/* Skip link — WCAG 2.4.1 */}
      <a href="#main-content" className="r44-skip">
        Skip to main content
      </a>

      <div className="r44" id="top">
        {/* ── Scroll progress rail ── */}
        <div className="r44-rail" aria-hidden="true">
          <motion.div
            className="r44-rail-fill"
            style={{ scaleY, height: "100%" }}
          />
        </div>

        {/* ── Chapter index (fixed sidebar) ── */}
        <nav className="r44-index" aria-label="Chapter index">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.num}
              className={`r44-index-item${activeChapter === i ? " active" : ""}`}
              onClick={() => scrollTo(i)}
              aria-label={`Go to chapter ${c.num}: ${c.label}`}
              aria-current={activeChapter === i ? "true" : undefined}
              data-label={`${c.num} · ${c.label}`}
            >
              <span className="r44-index-num" aria-hidden="true">
                {c.num}
              </span>
              <span className="r44-index-dot" aria-hidden="true" />
            </button>
          ))}
        </nav>

        {/* ── Masthead ── */}
        <header
          className={`r44-masthead${scrolled ? " scrolled" : ""}`}
          role="banner"
        >
          <span className="r44-masthead-brand r44-display">
            SkynetLabs Dossier
          </span>
          <span className="r44-masthead-meta r44-mono">Est. 2019 · Vol. I</span>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="r44-masthead-cta"
          >
            Book a Call
          </a>
        </header>

        <main id="main-content" className="r44-main">
          {/* ── CHAPTER 01 — Hero / Briefing ── */}
          <section
            ref={attachRefs(
              0,
              ch0.ref as React.MutableRefObject<HTMLElement | null>,
            )}
            className="r44-chapter r44-hero"
            aria-labelledby="hero-hed"
          >
            {/* Department stamp */}
            <div className="r44-hero-stamp" aria-hidden="true">
              <div className="r44-hero-stamp-rule" />
              <span className="r44-hero-stamp-line">Intelligence Dossier</span>
              <span className="r44-hero-stamp-line">No. 1 — 2026</span>
              <span className="r44-hero-stamp-line">
                SkynetLabs · Est. 2019
              </span>
            </div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={
                ch0.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
              }
              transition={{ duration: 0.55 }}
            >
              <div className="r44-kicker r44-mono">
                Intelligence Briefing · Dossier No. 1
              </div>
            </motion.div>

            <motion.h1
              id="hero-hed"
              className="r44-hero-hed r44-display"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={
                ch0.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
              }
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Automating the businesses everyone said couldn&rsquo;t be.
            </motion.h1>

            <motion.p
              className="r44-hero-standfirst"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={
                ch0.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
              }
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              A founder-level systems practice. Seven years of shipping AI,
              automation, and web infrastructure to clients who needed results
              last quarter — not a roadmap for next year.
            </motion.p>

            <motion.div
              className="r44-hero-dateline r44-mono"
              initial={reduced ? false : { opacity: 0 }}
              animate={ch0.inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              Waseem Nasir · SkynetLabs · Bali / Lahore · Since 2019
            </motion.div>
          </section>

          {/* ── Photo strip 1 ── */}
          <DragStrip
            reduced={reduced}
            caption="Field dispatches — Bali, Lahore, Singapore, Nusa Penida & beyond"
          />

          {/* ── CHAPTER 02 — Record / Stats ── */}
          <section
            ref={(el) => {
              chapterRefs.current[1] = el;
              (ch1.ref as React.MutableRefObject<HTMLElement | null>).current =
                el;
              (statsRef as React.MutableRefObject<HTMLElement | null>).current =
                el;
            }}
            className="r44-chapter"
            aria-labelledby="chapter-02-hed"
          >
            <div className="r44-chapter-header">
              <ChapterNum num="02" inView={ch1.inView} reduced={reduced} />
              <div>
                <div className="r44-chapter-title-kicker r44-mono">
                  The Record
                </div>
                <h2
                  id="chapter-02-hed"
                  className="r44-chapter-title r44-display"
                >
                  Numbers that do not require a footnote.
                </h2>
              </div>
            </div>

            <div className="r44-stats">
              <StatBlock
                num={180}
                suffix="+"
                label="Builds Shipped"
                inView={statsInView}
                reduced={reduced}
              />
              <StatBlock
                num={40}
                suffix="+"
                label="Clients Served"
                inView={statsInView}
                reduced={reduced}
              />
              <StatBlock
                num={9}
                suffix=""
                label="Countries"
                inView={statsInView}
                reduced={reduced}
              />
              <StatBlock
                num={2019}
                suffix=""
                label="In Operation Since"
                note="EST."
                inView={statsInView}
                reduced={reduced}
              />
            </div>

            <div className="r44-brief-box">
              <div className="r44-brief-box-label r44-mono">The Brief</div>
              <p className="r44-brief-body">
                These figures are first-party. No rounding to the nearest
                impressive benchmark. No counting discovery calls as completed
                projects. 180+ builds means 180+ systems in production or
                delivered to client hands — n8n flows, Next.js sites, voice
                agents, AEO structures, WhatsApp automations, Chrome extensions.
                Clients in 9 countries means actual timezone calls, delivered
                work, and invoices paid.
              </p>
            </div>

            <div className="r44-pullquote">
              <p className="r44-pullquote-text">
                &ldquo;The gap between a tool and a system is whether someone
                actually uses it on Monday morning.&rdquo;
              </p>
              <span className="r44-pullquote-attr r44-mono">
                Waseem Nasir, SkynetLabs
              </span>
            </div>

            <div className="r44-body-2col">
              <p>
                Every engagement starts with the same question: what is the most
                expensive thing happening manually right now? The answer is
                usually embarrassingly simple — a missed follow-up, a data entry
                task, a weekly report that takes four hours to compile and two
                minutes to read.
              </p>
              <p>
                The practice is deliberately solo-founder sized. That is not a
                limitation — it is a structural choice. Every project gets the
                same architect, writer, and implementer. There is no handoff
                tax, no account manager translating requirements into broken
                specs.
              </p>
            </div>
          </section>

          {/* ── CHAPTER 03 — Operations / Services ── */}
          <section
            ref={attachRefs(
              2,
              ch2.ref as React.MutableRefObject<HTMLElement | null>,
            )}
            className="r44-chapter"
            aria-labelledby="chapter-03-hed"
          >
            <div className="r44-chapter-header">
              <ChapterNum num="03" inView={ch2.inView} reduced={reduced} />
              <div>
                <div className="r44-chapter-title-kicker r44-mono">
                  Operations
                </div>
                <h2
                  id="chapter-03-hed"
                  className="r44-chapter-title r44-display"
                >
                  Six disciplines. One operator.
                </h2>
              </div>
            </div>

            <div className="r44-fact-box">
              <div className="r44-fact-label r44-mono">Fact</div>
              <p className="r44-fact-body">
                All six service lines are handled by the same person — Waseem
                Nasir. Stack: n8n, Next.js 14, Framer Motion, Meta Business API,
                OpenAI, Vercel, Hostinger. No subcontractors, no white-label
                resellers.
              </p>
            </div>

            <div className="r44-services">
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.code}
                  className="r44-service"
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={
                    ch2.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                  }
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <div className="r44-service-code r44-mono">{s.code}</div>
                  <div className="r44-service-name r44-display">{s.name}</div>
                  <p className="r44-service-desc">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── CHAPTER 04 — Field Work / Selected Builds ── */}
          <section
            ref={attachRefs(
              3,
              ch3.ref as React.MutableRefObject<HTMLElement | null>,
            )}
            className="r44-chapter"
            aria-labelledby="chapter-04-hed"
          >
            <div className="r44-chapter-header">
              <ChapterNum num="04" inView={ch3.inView} reduced={reduced} />
              <div>
                <div className="r44-chapter-title-kicker r44-mono">
                  Field Work
                </div>
                <h2
                  id="chapter-04-hed"
                  className="r44-chapter-title r44-display"
                >
                  Selected builds from the active register.
                </h2>
              </div>
            </div>

            <div className="r44-brief-box">
              <div className="r44-brief-box-label r44-mono">The Brief</div>
              <p className="r44-brief-body">
                Eight representative engagements, drawn from a 180+ project body
                of work. Industries: freight, healthcare, travel, legal-tech, AI
                tooling, and performance marketing. Geographies: US, EU,
                South-East Asia, South Asia.
              </p>
            </div>

            <div className="r44-work-list" role="list">
              {WORK_ITEMS.map((w, i) => (
                <motion.div
                  key={w.n}
                  className="r44-work-item"
                  role="listitem"
                  initial={reduced ? false : { opacity: 0, x: -16 }}
                  animate={
                    ch3.inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }
                  }
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                >
                  <span className="r44-work-n r44-mono">{w.n}</span>
                  <span>
                    <span className="r44-work-name">{w.name}</span>{" "}
                    <span
                      className="r44-work-country"
                      style={{
                        marginLeft: "0.5rem",
                        fontSize: "0.78rem",
                        color: "#7A7468",
                      }}
                    >
                      &mdash; {w.country}
                    </span>
                  </span>
                  <span className="r44-work-type r44-mono">{w.type}</span>
                </motion.div>
              ))}
            </div>

            <div className="r44-fact-box" style={{ marginTop: "2rem" }}>
              <div className="r44-fact-label r44-mono">Note on scope</div>
              <p className="r44-fact-body">
                Project selection prioritises variety of stack and geography.
                Client identities shared only with permission; all figures
                disclosed above are verifiable on request.
              </p>
            </div>
          </section>

          {/* ── CHAPTER 05 — Dossier / About ── */}
          <section
            ref={attachRefs(
              4,
              ch4.ref as React.MutableRefObject<HTMLElement | null>,
            )}
            className="r44-chapter"
            aria-labelledby="chapter-05-hed"
          >
            <div className="r44-chapter-header">
              <ChapterNum num="05" inView={ch4.inView} reduced={reduced} />
              <div>
                <div className="r44-chapter-title-kicker r44-mono">
                  The Operator
                </div>
                <h2
                  id="chapter-05-hed"
                  className="r44-chapter-title r44-display"
                >
                  On record.
                </h2>
              </div>
            </div>

            <div className="r44-about-grid">
              <motion.div
                initial={reduced ? false : { opacity: 0, x: -20 }}
                animate={
                  ch4.inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{ duration: 0.55 }}
              >
                <img
                  src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
                  alt="Waseem Nasir — founder, SkynetLabs"
                  className="r44-about-img"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                className="r44-about-text"
                initial={reduced ? false : { opacity: 0, x: 20 }}
                animate={
                  ch4.inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                }
                transition={{ duration: 0.55, delay: 0.1 }}
              >
                <div className="r44-about-name r44-display">Waseem Nasir</div>
                <div className="r44-about-title r44-mono">
                  Founder, SkynetLabs · Independent Systems Architect
                </div>
                <p className="r44-about-bio">
                  Seven years building AI and automation infrastructure from
                  first principles. Before the current wave of LLM tooling
                  arrived, the practice was already wiring n8n to CRMs,
                  scripting WhatsApp follow-ups, and deploying production
                  Next.js for clients who could not afford to wait.
                </p>
                <p className="r44-about-bio">
                  The model is simple: one person with full-stack
                  accountability. Clients get direct access to the engineer who
                  reads the brief, writes the spec, ships the code, and monitors
                  the first 48 hours in production. No ticket queues. No
                  project-manager telephone game.
                </p>

                <div className="r44-brief-box" style={{ marginTop: "1.8rem" }}>
                  <div className="r44-brief-box-label r44-mono">
                    Field Locations
                  </div>
                  <p
                    className="r44-brief-body"
                    style={{ marginBottom: "0.8rem" }}
                  >
                    Remote-first. Meeting times available across GMT+5 (Lahore)
                    and GMT+8 (Bali). Client calls on calendar within 24 hours
                    of inquiry.
                  </p>
                  <div className="r44-locations">
                    <span className="r44-location-pill">Bali, Indonesia</span>
                    <span className="r44-location-pill">Lahore, Pakistan</span>
                    <span className="r44-location-pill">
                      Remote &middot; 9 Countries
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Secondary photo strip */}
            <div style={{ marginTop: "3rem" }}>
              <DragStrip
                reduced={reduced}
                caption="Work dispatches / drag to navigate"
              />
            </div>
          </section>

          {/* ── CHAPTER 06 — Contact / CTA ── */}
          <section
            ref={attachRefs(
              5,
              ch5.ref as React.MutableRefObject<HTMLElement | null>,
            )}
            className="r44-cta-section"
            aria-labelledby="chapter-06-hed"
          >
            <div className="r44-cta-inner">
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={
                  ch5.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6 }}
              >
                <div className="r44-cta-kicker r44-mono">
                  Chapter 06 · Contact
                </div>
                <h2 id="chapter-06-hed" className="r44-cta-hed r44-display">
                  The next 30 minutes could be the most useful you spend this
                  quarter.
                </h2>
                <p className="r44-cta-body">
                  Book a discovery call. Come with a specific problem — a
                  workflow that takes too long, a lead source that goes cold, a
                  site that does not convert. Leave with a documented fix list
                  and a cost estimate, at no obligation.
                </p>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="r44-cta-btn"
                  aria-label="Book a 30-minute discovery call with Waseem Nasir"
                >
                  Book the 30-Minute Call
                  <span className="r44-cta-btn-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </a>

                <div className="r44-cta-contacts">
                  <div className="r44-cta-contact-item">
                    <div className="r44-cta-contact-label r44-mono">GitHub</div>
                    <a
                      href="https://github.com/waseemnasir2k26"
                      className="r44-cta-contact-val"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      github.com/waseemnasir2k26
                    </a>
                  </div>
                  <div className="r44-cta-contact-item">
                    <div className="r44-cta-contact-label r44-mono">
                      Booking
                    </div>
                    <a
                      href="https://skynetjoe.com/discovery-call"
                      className="r44-cta-contact-val"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      skynetjoe.com/discovery-call
                    </a>
                  </div>
                  <div className="r44-cta-contact-item">
                    <div className="r44-cta-contact-label r44-mono">
                      Timezone
                    </div>
                    <span className="r44-cta-contact-val">
                      GMT+5 / GMT+8 · Remote
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        {/* ── Footer ── */}
        <footer className="r44-footer" role="contentinfo">
          <span className="r44-masthead-brand r44-display">SkynetLabs</span>
          <span className="r44-footer-meta r44-mono">
            Waseem Nasir · Est. 2019 · 180+ builds · 40+ clients · 9 countries
          </span>
          <nav
            aria-label="Footer links"
            style={{ display: "flex", gap: "1.5rem" }}
          >
            <a
              href="https://github.com/waseemnasir2k26"
              className="r44-footer-link r44-mono"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="r44-footer-link r44-mono"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Book a Call
            </a>
          </nav>
        </footer>
      </div>
    </>
  );
}
