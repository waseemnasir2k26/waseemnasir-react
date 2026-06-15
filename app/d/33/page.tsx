"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/* ─── SCOPED FONTS & STYLES ─────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

.r33 *, .r33 *::before, .r33 *::after { box-sizing: border-box; margin: 0; padding: 0; }

.r33 {
  font-family: 'Inter', sans-serif;
  background: #08090A;
  color: #D6F5E3;
  min-height: 100vh;
  position: relative;
  z-index: 2;
  overflow-x: hidden;
}

/* CRT grain overlay */
.r33::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.045'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px 128px;
  opacity: 0.55;
  mix-blend-mode: overlay;
}

/* CRT scanlines */
.r33::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.12) 2px,
    rgba(0,0,0,0.12) 4px
  );
}

.r33-mono { font-family: 'IBM Plex Mono', monospace; }
.r33-display { font-family: 'Space Grotesk', sans-serif; }

/* ── HERO SPLIT ── */
.r33-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  position: relative;
}

@media (max-width: 900px) {
  .r33-hero { grid-template-columns: 1fr; }
  .r33-hero-right { min-height: 60vw; }
}

/* LEFT — terminal panel */
.r33-hero-left {
  background: #08090A;
  border-right: 1px solid rgba(57,255,122,0.15);
  padding: 3rem 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
}

.r33-terminal-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.r33-terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.r33-terminal-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: #4A5C52;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-left: 0.5rem;
}

.r33-headline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  font-weight: 400;
  color: #39FF7A;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.r33-caret {
  display: inline-block;
  width: 0.55em;
  height: 1.1em;
  background: #39FF7A;
  vertical-align: text-bottom;
  margin-left: 2px;
  animation: r33blink 1s step-end infinite;
}

@keyframes r33blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.r33-subhead {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: #4A5C52;
  margin-bottom: 2.5rem;
  letter-spacing: 0.02em;
}

/* stat log stream */
.r33-log {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.r33-log-line {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  line-height: 1.8;
  color: #4A5C52;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
}

.r33-log-line.accent { color: #39FF7A; }
.r33-log-line.accent2 { color: #FFB000; }
.r33-log-line.dim { color: #2a3a30; }
.r33-log-line.text { color: #D6F5E3; }

.r33-prompt {
  color: #39FF7A;
}

.r33-log-cursor {
  display: inline-block;
  width: 0.45em;
  height: 0.85em;
  background: #4A5C52;
  vertical-align: middle;
  margin-left: 2px;
  animation: r33blink 1s step-end infinite;
}

/* RIGHT — chiaroscuro portrait */
.r33-hero-right {
  position: relative;
  overflow: hidden;
  background: #040506;
}

.r33-portrait-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: grayscale(25%) contrast(1.1);
}

/* chiaroscuro key-light: hard single-source from left */
.r33-chiaroscuro {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 90% at 15% 35%,
      rgba(255,176,0,0.10) 0%,
      rgba(57,255,122,0.04) 30%,
      transparent 65%),
    linear-gradient(105deg,
      rgba(255,176,0,0.06) 0%,
      transparent 40%),
    linear-gradient(90deg,
      rgba(8,9,10,0) 0%,
      rgba(8,9,10,0.55) 100%);
  mix-blend-mode: normal;
}

/* deep shadow on right side */
.r33-shadow-vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 100% at 90% 50%,
      rgba(8,9,10,0.7) 0%,
      transparent 70%),
    linear-gradient(180deg,
      rgba(8,9,10,0.5) 0%,
      transparent 20%,
      transparent 75%,
      rgba(8,9,10,0.9) 100%);
}

.r33-portrait-credit {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  color: #4A5C52;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ── SECTION SHELL ── */
.r33-section {
  padding: 5rem 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.r33-section-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: #39FF7A;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.r33-section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(57,255,122,0.18);
  max-width: 80px;
}

.r33-h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #D6F5E3;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

/* ── STATS ROW ── */
.r33-stats {
  background: #101214;
  border-top: 1px solid rgba(57,255,122,0.12);
  border-bottom: 1px solid rgba(57,255,122,0.12);
  padding: 3rem 2.5rem;
}

.r33-stats-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

@media (max-width: 700px) {
  .r33-stats-inner { grid-template-columns: repeat(2, 1fr); }
}

.r33-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.r33-stat-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 500;
  color: #39FF7A;
  line-height: 1;
}

.r33-stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #4A5C52;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* ── SERVICES ── */
.r33-services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(57,255,122,0.1);
  border: 1px solid rgba(57,255,122,0.1);
  margin-top: 2.5rem;
}

@media (max-width: 800px) {
  .r33-services-grid { grid-template-columns: 1fr; }
}

.r33-service-card {
  background: #08090A;
  padding: 2rem 1.75rem;
  position: relative;
  overflow: hidden;
  transition: background 0.25s;
}

.r33-service-card:hover { background: #0d0f10; }

.r33-service-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, #39FF7A, transparent);
  opacity: 0;
  transition: opacity 0.25s;
}

.r33-service-card:hover::before { opacity: 1; }

.r33-service-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: #39FF7A;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
}

.r33-service-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #D6F5E3;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.r33-service-desc {
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  color: #4A5C52;
  line-height: 1.7;
}

.r33-service-tag {
  display: inline-block;
  margin-top: 1.25rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.62rem;
  color: #FFB000;
  letter-spacing: 0.1em;
  background: rgba(255,176,0,0.08);
  padding: 0.2em 0.5em;
  border: 1px solid rgba(255,176,0,0.2);
}

/* ── WORK GALLERY ── */
.r33-work-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(57,255,122,0.08);
  margin-top: 2.5rem;
}

@media (max-width: 750px) {
  .r33-work-grid { grid-template-columns: repeat(2, 1fr); }
}

.r33-work-item {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3/4;
  background: #101214;
  cursor: default;
}

.r33-work-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: grayscale(40%) brightness(0.8);
  transition: filter 0.4s, transform 0.5s;
}

.r33-work-item:hover .r33-work-img {
  filter: grayscale(0%) brightness(1);
  transform: scale(1.03);
}

.r33-work-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(8,9,10,0.9) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.25rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.r33-work-item:hover .r33-work-overlay { opacity: 1; }

.r33-work-caption {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  color: #39FF7A;
  letter-spacing: 0.08em;
}

/* ── ABOUT ── */
.r33-about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

@media (max-width: 800px) {
  .r33-about { grid-template-columns: 1fr; gap: 2rem; }
}

.r33-about-img-wrap {
  position: relative;
  overflow: hidden;
}

.r33-about-img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  object-position: center top;
  filter: grayscale(20%) contrast(1.05);
  display: block;
}

.r33-about-key-light {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 80% at 0% 30%,
      rgba(255,176,0,0.12) 0%,
      rgba(57,255,122,0.06) 30%,
      transparent 65%),
    linear-gradient(90deg,
      transparent 60%,
      rgba(8,9,10,0.5) 100%);
  pointer-events: none;
}

.r33-about-img-border {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(57,255,122,0.15);
  pointer-events: none;
}

.r33-about-text {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.5rem;
}

.r33-about-p {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #4A5C52;
  line-height: 1.85;
}

.r33-about-p strong {
  color: #D6F5E3;
  font-weight: 500;
}

.r33-about-stack {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.r33-stack-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: #4A5C52;
  border: 1px solid rgba(74,92,82,0.4);
  padding: 0.25em 0.6em;
  text-transform: uppercase;
}

.r33-stack-tag.hot {
  color: #39FF7A;
  border-color: rgba(57,255,122,0.3);
}

/* ── DIVIDER ── */
.r33-divider {
  border: none;
  border-top: 1px solid rgba(57,255,122,0.1);
  margin: 0;
}

/* ── CONTACT ── */
.r33-contact {
  background: #101214;
  padding: 5rem 2.5rem;
  position: relative;
  overflow: hidden;
}

.r33-contact-inner {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
}

.r33-contact-pre {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  color: #4A5C52;
  white-space: pre;
  line-height: 1.7;
  border-left: 2px solid rgba(57,255,122,0.25);
  padding-left: 1rem;
}

.r33-contact-pre .g { color: #39FF7A; }
.r33-contact-pre .a { color: #FFB000; }
.r33-contact-pre .w { color: #D6F5E3; }

.r33-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: #39FF7A;
  color: #08090A;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  padding: 0.85em 1.75em;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  position: relative;
}

.r33-cta-btn:hover {
  background: #FFB000;
  transform: translateY(-1px);
}

.r33-cta-btn:focus-visible {
  outline: 2px solid #FFB000;
  outline-offset: 2px;
}

.r33-cta-arrow {
  display: inline-block;
  transition: transform 0.2s;
}

.r33-cta-btn:hover .r33-cta-arrow { transform: translateX(4px); }

/* ── FOOTER ── */
.r33-footer {
  background: #08090A;
  border-top: 1px solid rgba(57,255,122,0.1);
  padding: 2rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.r33-footer-mono {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: #4A5C52;
  letter-spacing: 0.08em;
}

.r33-footer-link {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: #4A5C52;
  text-decoration: none;
  letter-spacing: 0.08em;
  transition: color 0.2s;
}

.r33-footer-link:hover { color: #39FF7A; }
.r33-footer-link:focus-visible { outline: 1px solid #39FF7A; outline-offset: 2px; }

/* skip link */
.r33-skip {
  position: absolute;
  top: -100%;
  left: 1rem;
  background: #39FF7A;
  color: #08090A;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  padding: 0.5em 1em;
  text-decoration: none;
  z-index: 10000;
  transition: top 0.2s;
}

.r33-skip:focus { top: 1rem; }

/* secondary photo strip */
.r33-strip {
  display: flex;
  gap: 1px;
  background: rgba(57,255,122,0.06);
  overflow: hidden;
  height: 240px;
}

.r33-strip-img {
  flex: 1;
  object-fit: cover;
  object-position: center;
  filter: grayscale(50%) brightness(0.7);
  transition: filter 0.4s, flex 0.4s;
}

.r33-strip:hover .r33-strip-img { filter: grayscale(60%) brightness(0.6); }
.r33-strip .r33-strip-img:hover {
  flex: 2.5;
  filter: grayscale(0%) brightness(0.95);
}

@media (max-width: 700px) {
  .r33-strip { height: 160px; }
}
`;

/* ─── LOG LINES DATA ─────────────────────────────────────────────────── */
type LogClass = "accent" | "accent2" | "dim" | "text" | "default";

const LOG_LINES: Array<{ cls: LogClass; text: string }> = [
  { cls: "accent", text: "$ skynetlabs --init" },
  { cls: "dim", text: "  connecting to field ops..." },
  { cls: "accent", text: "  [OK] uptime: 2019 → 2026" },
  { cls: "default", text: "" },
  { cls: "accent2", text: "  STAT  builds_shipped     : 180+" },
  { cls: "accent2", text: "  STAT  clients_served     : 40+" },
  { cls: "accent2", text: "  STAT  countries_worked   : 9" },
  { cls: "accent2", text: "  STAT  active_since       : 2019" },
  { cls: "default", text: "" },
  { cls: "default", text: "  loading service_modules..." },
  { cls: "accent", text: "  [OK] n8n_automation       v4.x" },
  { cls: "accent", text: "  [OK] next_js_builds       v14" },
  { cls: "accent", text: "  [OK] aeo_content_engine   v0.7" },
  { cls: "accent", text: "  [OK] whatsapp_voice_bots  active" },
  { cls: "default", text: "" },
  { cls: "dim", text: "  scanning geo..." },
  { cls: "text", text: "  LOC  bali / lahore / remote" },
  { cls: "default", text: "" },
  { cls: "dim", text: "  checking open slots..." },
  { cls: "accent2", text: "  [WARN] capacity limited — book early" },
  { cls: "default", text: "" },
  { cls: "accent", text: "  GITHUB  waseemnasir2k26" },
  { cls: "default", text: "" },
  { cls: "dim", text: "  system ready. awaiting input_" },
];

/* ─── TYPED HEADLINE HOOK ─────────────────────────────────────────────── */
const FULL_HEADLINE = "$ deploy founder --proof=real --hype=0";

function useTyped(full: string, speed: number, skip: boolean) {
  const [displayed, setDisplayed] = useState(skip ? full : "");
  useEffect(() => {
    if (skip) {
      setDisplayed(full);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [full, speed, skip]);
  return displayed;
}

/* ─── STREAMING LOG ───────────────────────────────────────────────────── */
function StreamLog({ skip }: { skip: boolean }) {
  const [visible, setVisible] = useState(skip ? LOG_LINES.length : 0);

  useEffect(() => {
    if (skip) return;
    const delay = 2200; // start after typing finishes
    const interval = 160;
    let count = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        count++;
        setVisible((v) => Math.min(v + 1, LOG_LINES.length));
        if (count >= LOG_LINES.length) clearInterval(id);
      }, interval);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(start);
  }, [skip]);

  return (
    <div
      className="r33-log"
      role="log"
      aria-live="polite"
      aria-label="System log"
    >
      {LOG_LINES.slice(0, visible).map((line, i) => (
        <div
          key={i}
          className={`r33-log-line ${line.cls === "default" ? "" : line.cls}`}
        >
          {line.text}
        </div>
      ))}
      {visible < LOG_LINES.length && (
        <div className="r33-log-line dim">
          {"  "}
          <span className="r33-log-cursor" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

/* ─── SERVICES DATA ───────────────────────────────────────────────────── */
const SERVICES = [
  {
    num: "01",
    title: "Automation Systems",
    desc: "n8n workflows that kill manual ops: lead routing, CRM sync, follow-up sequences, internal triggers. Set once, run forever.",
    tag: "n8n · webhook · no-code ops",
  },
  {
    num: "02",
    title: "AI Voice & Chat Bots",
    desc: "WhatsApp / voice receptionists that qualify leads, book appointments, and handle repeat queries — without a human on call.",
    tag: "openai · twilio · whatsapp api",
  },
  {
    num: "03",
    title: "Next.js Web Builds",
    desc: "Fast, search-optimised sites that convert. From founders landing pages to multi-service SaaS front-ends — shipped under budget.",
    tag: "next.js 14 · vercel · typescript",
  },
  {
    num: "04",
    title: "AEO Content Engine",
    desc: "Answer-engine optimisation: structured content that surfaces in AI summaries, not buried in page-4 search results.",
    tag: "schema · llm-visibility · SEO",
  },
  {
    num: "05",
    title: "Lead Recovery Systems",
    desc: "Missed-lead detection + auto-follow-up pipelines. If someone fills a form and hears nothing for 24 hours, that is revenue left on the table.",
    tag: "crm · drip · recovery loops",
  },
  {
    num: "06",
    title: "Custom Integrations",
    desc: "Stripe, Calendly, Zocdoc, Notion, Airtable, Google Sheets — connected to whatever stack you are already running.",
    tag: "api · rest · zapier bypass",
  },
];

/* ─── WORK ITEMS ──────────────────────────────────────────────────────── */
const WORK_ITEMS = [
  {
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    caption: "analytics dashboard session · bali",
  },
  {
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    caption: "client build sprint · coworking",
  },
  {
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    caption: "late-night deploy · night cafe",
  },
  {
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    caption: "automation build · bali terrace",
  },
  {
    img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
    caption: "client handoff · thumbs up",
  },
  {
    img: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
    caption: "project review · garden cafe",
  },
];

/* ─── STRIP IMAGES ────────────────────────────────────────────────────── */
const STRIP_IMGS = [
  "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
  "TRAVEL-2025-05-17-beach-arms-spread-laughing-camera.jpg",
  "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
  "TRAVEL-google-office-sign-cream-outfit.jpg",
];

/* ─── COUNT-UP ────────────────────────────────────────────────────────── */
function useCountUp(target: number, duration: number, skip: boolean) {
  const [val, setVal] = useState(skip ? target : 0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (skip) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 40;
          const step = duration / steps;
          let s = 0;
          const id = setInterval(() => {
            s++;
            setVal(Math.round((s / steps) * target));
            if (s >= steps) clearInterval(id);
          }, step);
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, skip]);

  return { val, ref };
}

function StatNum({
  value,
  suffix,
  label,
  skip,
}: {
  value: number;
  suffix: string;
  label: string;
  skip: boolean;
}) {
  const { val, ref } = useCountUp(value, 800, skip);
  return (
    <div className="r33-stat" ref={ref}>
      <span className="r33-stat-num r33-mono">
        {val}
        {suffix}
      </span>
      <span className="r33-stat-label">{label}</span>
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────── */
export default function Design33() {
  const prefersReduced = useReducedMotion();
  const skip = !!prefersReduced;
  const typed = useTyped(FULL_HEADLINE, 48, skip);
  const doneTyping = skip || typed.length >= FULL_HEADLINE.length;

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <style>{STYLES}</style>
      <div className="r33">
        {/* scroll progress rail */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "2px",
            background: "#39FF7A",
            zIndex: 10000,
            width: progressWidth,
          }}
        />

        {/* skip nav */}
        <a href="#main-content" className="r33-skip">
          Skip to content
        </a>

        {/* ── HERO ── */}
        <section className="r33-hero" aria-label="Hero">
          {/* LEFT — terminal */}
          <div className="r33-hero-left">
            {/* terminal title bar */}
            <div className="r33-terminal-bar" aria-hidden="true">
              <div
                className="r33-terminal-dot"
                style={{ background: "#FF5F57" }}
              />
              <div
                className="r33-terminal-dot"
                style={{ background: "#FEBC2E" }}
              />
              <div
                className="r33-terminal-dot"
                style={{ background: "#28C840" }}
              />
              <span className="r33-terminal-label">
                skynetlabs — bash — 80x40
              </span>
            </div>

            {/* typed headline */}
            <h1 className="r33-headline" aria-label={FULL_HEADLINE}>
              {typed}
              {!doneTyping && <span className="r33-caret" aria-hidden="true" />}
              {doneTyping && <span className="r33-caret" aria-hidden="true" />}
            </h1>

            <p className="r33-subhead r33-mono">
              180+ builds &middot; 40+ clients &middot; 9 countries &middot;
              since 2019.
            </p>

            <StreamLog skip={skip} />
          </div>

          {/* RIGHT — portrait */}
          <div className="r33-hero-right" aria-label="Portrait of Waseem Nasir">
            <img
              src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
              alt="Waseem Nasir, founder of SkynetLabs, on a balcony"
              className="r33-portrait-img"
            />
            <div className="r33-chiaroscuro" aria-hidden="true" />
            <div className="r33-shadow-vignette" aria-hidden="true" />
            <div className="r33-portrait-credit r33-mono" aria-hidden="true">
              waseem nasir / skynetlabs
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div id="main-content" className="r33-stats" aria-label="Key metrics">
          <div className="r33-stats-inner">
            <StatNum
              value={180}
              suffix="+"
              label="Builds Shipped"
              skip={skip}
            />
            <StatNum value={40} suffix="+" label="Clients Served" skip={skip} />
            <StatNum value={9} suffix="" label="Countries" skip={skip} />
            <StatNum value={2019} suffix="" label="Active Since" skip={skip} />
          </div>
        </div>

        {/* ── SERVICES ── */}
        <section className="r33-section" aria-labelledby="r33-services-h2">
          <div className="r33-section-label" aria-hidden="true">
            // services
          </div>
          <h2 className="r33-h2" id="r33-services-h2">
            What I actually build.
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.88rem",
              color: "#4A5C52",
              lineHeight: 1.8,
              maxWidth: 560,
              marginBottom: "0.5rem",
            }}
          >
            Six system types. All designed to remove friction, recover revenue,
            or compound over time.
          </p>

          <div className="r33-services-grid">
            {SERVICES.map((s) => (
              <motion.div
                key={s.num}
                className="r33-service-card"
                initial={skip ? {} : { opacity: 0, y: 16 }}
                whileInView={skip ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: parseInt(s.num) * 0.05 }}
              >
                <div className="r33-service-num r33-mono">{s.num}/</div>
                <div className="r33-service-title r33-display">{s.title}</div>
                <div className="r33-service-desc">{s.desc}</div>
                <div className="r33-service-tag">{s.tag}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <hr className="r33-divider" />

        {/* ── WORK ── */}
        <section className="r33-section" aria-labelledby="r33-work-h2">
          <div className="r33-section-label" aria-hidden="true">
            // selected work
          </div>
          <h2 className="r33-h2" id="r33-work-h2">
            Field notes, shipped live.
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.88rem",
              color: "#4A5C52",
              lineHeight: 1.8,
              maxWidth: 540,
            }}
          >
            180+ builds across clinics, freight ops, SaaS founders, and local
            service businesses. Remote-first since 2019.
          </p>

          <div className="r33-work-grid" role="list">
            {WORK_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                className="r33-work-item"
                role="listitem"
                initial={skip ? {} : { opacity: 0 }}
                whileInView={skip ? {} : { opacity: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <img
                  src={`/img/pro/${item.img}`}
                  alt={item.caption}
                  className="r33-work-img"
                />
                <div className="r33-work-overlay" aria-hidden="true">
                  <span className="r33-work-caption r33-mono">
                    {item.caption}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── PHOTO STRIP ── */}
        <div className="r33-strip" role="presentation" aria-hidden="true">
          {STRIP_IMGS.map((img, i) => (
            <img
              key={i}
              src={`/img/pro/${img}`}
              alt=""
              className="r33-strip-img"
            />
          ))}
        </div>

        {/* ── ABOUT ── */}
        <section className="r33-section" aria-labelledby="r33-about-h2">
          <div className="r33-section-label" aria-hidden="true">
            // about
          </div>
          <div className="r33-about">
            <div className="r33-about-img-wrap">
              <img
                src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                alt="Waseem Nasir working at a Bali terrace cafe with a laptop"
                className="r33-about-img"
              />
              <div className="r33-about-key-light" aria-hidden="true" />
              <div className="r33-about-img-border" aria-hidden="true" />
            </div>

            <div className="r33-about-text">
              <h2
                className="r33-h2"
                id="r33-about-h2"
                style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)" }}
              >
                Waseem Nasir
              </h2>

              <p className="r33-about-p">
                <strong>Independent founder of SkynetLabs.</strong> I build AI
                and automation systems — not decks, not roadmaps, not pilot
                programmes that need six meetings to scope. Systems that run.
              </p>
              <p className="r33-about-p">
                The work:{" "}
                <strong>
                  n8n workflows, Next.js builds, AEO content engines, WhatsApp
                  and voice bots.
                </strong>{" "}
                Each one targeting a specific leak — missed leads, dead
                follow-ups, ops work that a computer should handle.
              </p>
              <p className="r33-about-p">
                Operating since 2019. Currently writing this from Bali or
                Lahore, depending on the month. 40+ clients across 9 countries.{" "}
                <strong>180+ builds shipped.</strong> No team — just fast,
                precise output.
              </p>

              <div className="r33-about-stack">
                {[
                  "n8n",
                  "Next.js 14",
                  "TypeScript",
                  "OpenAI API",
                  "Twilio",
                  "Stripe",
                  "Vercel",
                  "Airtable",
                  "Webhooks",
                  "AEO / SEO",
                ].map((t) => (
                  <span
                    key={t}
                    className={`r33-stack-tag${["n8n", "Next.js 14", "OpenAI API"].includes(t) ? " hot" : ""}`}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="r33-cta-btn"
                  aria-label="Book a 30-minute discovery call with Waseem"
                >
                  $ book --slot=30min
                  <span className="r33-cta-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <hr className="r33-divider" />

        {/* ── MORE WORK PHOTOS ── */}
        <section
          className="r33-section"
          aria-labelledby="r33-context-h2"
          style={{ paddingTop: "3rem", paddingBottom: "3rem" }}
        >
          <div className="r33-section-label" aria-hidden="true">
            // context
          </div>
          <h2
            className="r33-h2"
            id="r33-context-h2"
            style={{
              fontSize: "clamp(1.4rem,2.8vw,2rem)",
              marginBottom: "2rem",
            }}
          >
            Remote-first since 2019.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1px",
              background: "rgba(57,255,122,0.06)",
            }}
          >
            {[
              {
                img: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                alt: "Waseem at rooftop cafe with laptop and dragonfruit smoothie",
              },
              {
                img: "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
                alt: "Waseem with laptop and coffee, olive jacket",
              },
              {
                img: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
                alt: "Night coworking team session with laptops",
              },
              {
                img: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                alt: "Bali coworking group meetup",
              },
            ].map(({ img, alt }, i) => (
              <motion.div
                key={i}
                style={{ overflow: "hidden", aspectRatio: "1/1" }}
                initial={skip ? {} : { opacity: 0 }}
                whileInView={skip ? {} : { opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <img
                  src={`/img/pro/${img}`}
                  alt={alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "grayscale(30%) brightness(0.75)",
                    display: "block",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </section>

        <hr className="r33-divider" />

        {/* ── CONTACT ── */}
        <section className="r33-contact" aria-labelledby="r33-contact-h2">
          <div className="r33-contact-inner">
            <div className="r33-section-label" aria-hidden="true">
              // contact
            </div>
            <h2 className="r33-h2" id="r33-contact-h2">
              Ready to ship.
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.88rem",
                color: "#4A5C52",
                lineHeight: 1.85,
              }}
            >
              30 minutes. No pitch deck. Tell me where the ops are leaking — I
              will tell you whether automation fixes it and roughly how.
            </p>

            <div
              className="r33-contact-pre"
              role="presentation"
              aria-hidden="true"
            >
              <span className="g">$</span> ./book-call{" "}
              <span className="a">--duration</span>=
              <span className="w">30min</span>
              {"\n"}
              <span className="g">$</span> ./scope-project{" "}
              <span className="a">--type</span>=
              <span className="w">ai-automation</span>
              {"\n"}
              <span className="g">$</span> ./get-answer{" "}
              <span className="a">--hype</span>=<span className="w">0</span>
            </div>

            <a
              href="https://skynetjoe.com/discovery-call"
              className="r33-cta-btn"
              aria-label="Book a 30-minute discovery call"
            >
              $ book_call --confirm
              <span className="r33-cta-arrow" aria-hidden="true">
                →
              </span>
            </a>

            <p
              className="r33-mono"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.68rem",
                color: "#4A5C52",
                marginTop: "0.5rem",
              }}
            >
              waseembali2k26@gmail.com &nbsp;·&nbsp; bali / lahore / remote
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="r33-footer">
          <div className="r33-footer-mono">
            <span style={{ color: "#39FF7A" }}>skynetlabs</span> &nbsp;/&nbsp;
            waseem nasir &nbsp;·&nbsp; © 2019–2026
          </div>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <a
              href="https://github.com/waseemnasir2k26"
              className="r33-footer-link"
              aria-label="GitHub profile — waseemnasir2k26"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/waseemnasir2k26
            </a>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="r33-footer-link"
              aria-label="Book a discovery call"
            >
              book a call →
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
