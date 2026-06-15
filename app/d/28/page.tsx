"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useAnimation,
  useInView,
} from "framer-motion";

/* ─── Scoped font + CSS ─────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Newsreader:opsz,ital,wght@6..72,1,400;6..72,0,500&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');

.d28-root {
  --bg: #0B0B0B;
  --surface: #141414;
  --text: #EDEAE3;
  --muted: #76726A;
  --accent: #A33B2A;
  --accent2: #3A3A38;
  --bar-h: 60px;

  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  overflow-x: hidden;
  position: relative;
  z-index: 2;
  min-height: 100vh;
}

/* Film grain overlay */
.d28-root::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 999;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.07'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px 128px;
  opacity: 0.55;
  animation: d28-grain 0.12s steps(1) infinite;
}

@keyframes d28-grain {
  0%  { transform: translate(0, 0); }
  10% { transform: translate(-2%, -1%); }
  20% { transform: translate(1%, 2%); }
  30% { transform: translate(-1%, 1%); }
  40% { transform: translate(2%, -2%); }
  50% { transform: translate(-2%, 2%); }
  60% { transform: translate(1%, -1%); }
  70% { transform: translate(-1%, -2%); }
  80% { transform: translate(2%, 1%); }
  90% { transform: translate(-1%, 2%); }
  100% { transform: translate(0, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .d28-root::before { animation: none; }
}

/* Letterbox bars */
.d28-letterbox-top,
.d28-letterbox-bottom {
  position: fixed;
  left: 0; right: 0;
  height: var(--bar-h);
  background: #000;
  z-index: 100;
  pointer-events: none;
}
.d28-letterbox-top { top: 0; }
.d28-letterbox-bottom { bottom: 0; }

/* Nav */
.d28-nav {
  position: fixed;
  top: var(--bar-h);
  left: 0; right: 0;
  z-index: 90;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 48px;
  mix-blend-mode: normal;
}
.d28-nav-logo {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 18px;
  color: var(--text);
  letter-spacing: 0.02em;
  text-decoration: none;
}
.d28-nav-cta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  text-decoration: none;
  border: 1px solid var(--accent);
  padding: 8px 20px;
  transition: background 0.2s, color 0.2s;
}
.d28-nav-cta:hover, .d28-nav-cta:focus-visible {
  background: var(--accent);
  color: var(--text);
  outline: none;
}

/* Hero section */
.d28-hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: calc(var(--bar-h) + 80px) 48px calc(var(--bar-h) + 80px);
  position: relative;
  overflow: hidden;
}
.d28-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.d28-hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: brightness(0.18) contrast(1.1);
}
.d28-hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, #0B0B0B 0%, rgba(11,11,11,0.3) 40%, rgba(11,11,11,0.3) 60%, #0B0B0B 100%);
}
.d28-hero-content {
  position: relative;
  z-index: 2;
  max-width: 880px;
}
.d28-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 40px;
  display: block;
}
.d28-hero-title {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(36px, 6vw, 76px);
  line-height: 1.1;
  color: var(--text);
  margin: 0 0 32px;
  letter-spacing: -0.01em;
}
.d28-hero-sub {
  font-family: 'Inter', sans-serif;
  font-size: clamp(14px, 1.6vw, 18px);
  color: var(--muted);
  max-width: 520px;
  margin: 0 auto 56px;
  line-height: 1.7;
  font-weight: 400;
}
.d28-cta-primary {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text);
  background: var(--accent);
  padding: 16px 40px;
  text-decoration: none;
  transition: opacity 0.2s;
}
.d28-cta-primary:hover, .d28-cta-primary:focus-visible {
  opacity: 0.82;
  outline: 2px solid var(--text);
  outline-offset: 3px;
}
.d28-scroll-hint {
  position: absolute;
  bottom: calc(var(--bar-h) + 32px);
  left: 50%;
  transform: translateX(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  z-index: 2;
}

/* Title card dividers */
.d28-title-card {
  background: var(--bg);
  padding: 80px 48px;
  text-align: center;
  border-top: 1px solid var(--accent2);
  border-bottom: 1px solid var(--accent2);
  position: relative;
}
.d28-title-card-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 20px;
  display: block;
}
.d28-title-card-heading {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(28px, 4vw, 52px);
  color: var(--text);
  margin: 0;
  line-height: 1.15;
}

/* Stats strip */
.d28-stats {
  background: var(--surface);
  padding: 80px 48px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  border-top: 1px solid var(--accent2);
  border-bottom: 1px solid var(--accent2);
}
.d28-stat {
  padding: 48px 32px;
  text-align: center;
  background: var(--surface);
  position: relative;
}
.d28-stat + .d28-stat::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background: var(--accent2);
}
.d28-stat-num {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: clamp(40px, 5vw, 72px);
  color: var(--text);
  display: block;
  line-height: 1;
  margin-bottom: 12px;
}
.d28-stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

/* Marquee */
.d28-marquee-wrap {
  overflow: hidden;
  background: var(--accent);
  padding: 14px 0;
  position: relative;
}
.d28-marquee-track {
  display: flex;
  white-space: nowrap;
  will-change: transform;
}
.d28-marquee-inner {
  display: flex;
  gap: 0;
  flex-shrink: 0;
}
.d28-marquee-item {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0B0B0B;
  padding: 0 32px;
}
.d28-marquee-sep {
  color: rgba(11,11,11,0.4);
  padding: 0 8px;
}

/* Services section */
.d28-services {
  padding: 0;
  background: var(--bg);
}
.d28-service-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 340px;
  border-bottom: 1px solid var(--accent2);
}
.d28-service-row:nth-child(even) .d28-service-text { order: 2; }
.d28-service-row:nth-child(even) .d28-service-img  { order: 1; }
.d28-service-img {
  overflow: hidden;
  position: relative;
}
.d28-service-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.55) contrast(1.05) saturate(0.7);
  display: block;
}
.d28-service-text {
  padding: 64px 56px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-left: 1px solid var(--accent2);
}
.d28-service-row:nth-child(even) .d28-service-text {
  border-left: none;
  border-right: 1px solid var(--accent2);
}
.d28-service-index {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--accent);
  margin-bottom: 20px;
  text-transform: uppercase;
}
.d28-service-name {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: clamp(22px, 3vw, 36px);
  color: var(--text);
  margin: 0 0 16px;
  line-height: 1.2;
}
.d28-service-desc {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.75;
  margin: 0;
  max-width: 400px;
}

/* Work / film stills */
.d28-work {
  background: var(--bg);
  padding: 0 0 0;
}
.d28-film-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background: var(--accent2);
}
.d28-film-cell {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3/4;
  background: var(--surface);
  cursor: default;
}
.d28-film-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.45) saturate(0.5) contrast(1.1);
  display: block;
  transition: filter 0.6s ease, transform 0.7s ease;
}
.d28-film-cell:hover img,
.d28-film-cell:focus-within img {
  filter: brightness(0.62) saturate(0.65) contrast(1.05);
  transform: scale(1.03);
}
.d28-film-caption {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 20px 20px 16px;
  background: linear-gradient(to top, rgba(11,11,11,0.9) 0%, transparent 100%);
}
.d28-film-caption-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

/* About section */
.d28-about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--bg);
  border-top: 1px solid var(--accent2);
}
.d28-about-img-wrap {
  position: relative;
  overflow: hidden;
  min-height: 600px;
}
.d28-about-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: brightness(0.6) contrast(1.1) saturate(0.6);
  display: block;
}
.d28-about-content {
  padding: 80px 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--surface);
  border-left: 1px solid var(--accent2);
}
.d28-about-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 32px;
}
.d28-about-heading {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: clamp(28px, 3.5vw, 44px);
  color: var(--text);
  margin: 0 0 28px;
  line-height: 1.15;
}
.d28-about-body {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.85;
  margin: 0 0 20px;
}
.d28-about-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 32px;
}
.d28-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  border: 1px solid var(--accent2);
  padding: 5px 12px;
}

/* CTA section */
.d28-cta-section {
  background: var(--bg);
  padding: 120px 48px;
  text-align: center;
  border-top: 1px solid var(--accent2);
  position: relative;
  overflow: hidden;
}
.d28-cta-section-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.d28-cta-section-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.08) contrast(1.1);
}
.d28-cta-content {
  position: relative;
  z-index: 2;
}
.d28-cta-heading {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: clamp(32px, 5vw, 64px);
  color: var(--text);
  margin: 0 0 20px;
  line-height: 1.1;
}
.d28-cta-sub {
  font-size: 14px;
  color: var(--muted);
  margin: 0 auto 48px;
  max-width: 440px;
}
.d28-cta-ghost {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  margin-top: 24px;
  transition: color 0.2s;
}
.d28-cta-ghost:hover, .d28-cta-ghost:focus-visible {
  color: var(--text);
  outline: none;
}

/* Footer */
.d28-footer {
  background: var(--surface);
  padding: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--accent2);
  padding-bottom: calc(48px + var(--bar-h));
}
.d28-footer-logo {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 18px;
  color: var(--text);
}
.d28-footer-links {
  display: flex;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.d28-footer-links a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}
.d28-footer-links a:hover, .d28-footer-links a:focus-visible {
  color: var(--text);
  outline: none;
}
.d28-footer-copy {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.12em;
}

/* Word-by-word reveal */
.d28-word {
  display: inline-block;
  overflow: hidden;
}
.d28-word-inner {
  display: inline-block;
}

/* Horizontal rule accent */
.d28-rule {
  border: none;
  border-top: 1px solid var(--accent2);
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .d28-nav { padding: 16px 24px; }
  .d28-hero { padding: calc(var(--bar-h) + 60px) 24px calc(var(--bar-h) + 60px); }
  .d28-stats { grid-template-columns: repeat(2, 1fr); padding: 40px 24px; }
  .d28-stat + .d28-stat::before { display: none; }
  .d28-service-row { grid-template-columns: 1fr; min-height: auto; }
  .d28-service-row:nth-child(even) .d28-service-text { order: 0; }
  .d28-service-row:nth-child(even) .d28-service-img  { order: 0; }
  .d28-service-img { min-height: 240px; }
  .d28-service-text { padding: 40px 24px; border-left: none !important; border-right: none !important; }
  .d28-film-grid { grid-template-columns: repeat(2, 1fr); }
  .d28-about { grid-template-columns: 1fr; }
  .d28-about-img-wrap { min-height: 360px; }
  .d28-about-content { padding: 48px 24px; border-left: none; }
  .d28-footer { flex-direction: column; gap: 24px; text-align: center; padding: 40px 24px calc(40px + var(--bar-h)); }
  .d28-title-card { padding: 60px 24px; }
  .d28-cta-section { padding: 80px 24px; }
}

/* Skip link */
.d28-skip {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.d28-skip:focus {
  position: fixed;
  left: 50%;
  top: 70px;
  transform: translateX(-50%);
  background: var(--accent);
  color: var(--text);
  padding: 10px 24px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  z-index: 200;
  width: auto;
  height: auto;
  outline: none;
}
`;

/* ─── Credits-roll word reveal ─────────────────────────────── */
function WordReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="d28-word" aria-hidden="true">
          <motion.span
            className="d28-word-inner"
            initial={reduced ? false : { y: "100%", opacity: 0 }}
            animate={isInView || reduced ? { y: "0%", opacity: 1 } : {}}
            transition={{
              duration: 0.55,
              delay: delay + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/* ─── Fade-in section ──────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={isInView || reduced ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Velocity-skew marquee ────────────────────────────────── */
const MARQUEE_ITEMS = [
  "n8n automation",
  "AI voice bots",
  "WhatsApp systems",
  "AEO engineering",
  "Next.js builds",
  "lead capture",
  "follow-up flows",
  "ops elimination",
  "Bali / Lahore",
  "9 countries",
];

function Marquee() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const velRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (reduced || !trackRef.current) return;
    const speed = 0.55;
    let last = performance.now();

    function tick(now: number) {
      const dt = Math.min(now - last, 32);
      last = now;
      velRef.current += (speed - velRef.current) * 0.08;
      xRef.current -= velRef.current * dt;
      const el = trackRef.current;
      if (!el) return;
      const half = el.scrollWidth / 2;
      if (Math.abs(xRef.current) >= half) xRef.current += half;
      el.style.transform = `translateX(${xRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced]);

  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="d28-marquee-wrap" aria-hidden="true">
      <div className="d28-marquee-track" ref={trackRef}>
        {[0, 1].map((_, rep) => (
          <div key={rep} className="d28-marquee-inner">
            {items.map((item, i) => (
              <span key={i} className="d28-marquee-item">
                {item}
                <span className="d28-marquee-sep">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Count-up stat ────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isInView || reduced) {
      setVal(to);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * to));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, to, reduced]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ─── Letterbox bars with reveal animation ─────────────────── */
function LetterboxBars() {
  const reduced = useReducedMotion();
  return (
    <>
      <motion.div
        className="d28-letterbox-top"
        initial={reduced ? false : { scaleY: 2.5, transformOrigin: "top" }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="d28-letterbox-bottom"
        initial={reduced ? false : { scaleY: 2.5, transformOrigin: "bottom" }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
      />
    </>
  );
}

/* ─── Service data ──────────────────────────────────────────── */
const SERVICES = [
  {
    index: "01",
    name: "Automation Architecture",
    desc: "End-to-end n8n pipelines that connect CRMs, forms, and messaging layers. Missed leads become captured ones. Manual ops become invisible ones.",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  },
  {
    index: "02",
    name: "AI Voice + WhatsApp Bots",
    desc: "Conversational agents that qualify, book, and follow up — 24/7, across WhatsApp and voice. Trains on your own scripts. Ships in days.",
    img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
  },
  {
    index: "03",
    name: "AEO + Next.js Engineering",
    desc: "Sites that answer questions before they're asked. Structured data, schema markup, and precision copy that wins AI-cited search placements.",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  },
];

/* ─── Work stills data ──────────────────────────────────────── */
const STILLS = [
  {
    img: "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    caption: "Lahore, 2026",
  },
  {
    img: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
    caption: "Nusa Penida, 2025",
  },
  {
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    caption: "Bali, 2026",
  },
  {
    img: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
    caption: "City vista, 2026",
  },
  {
    img: "LIFESTYLE-2026-03-29-night-cafe-armchair-relaxed-gaze.jpg",
    caption: "Night session",
  },
  {
    img: "EVENT-expo-booth-navy-polo-chandelier-hall.jpg",
    caption: "Expo, 2025",
  },
];

/* ─── Main component ────────────────────────────────────────── */
export default function EditorialNoir() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <style>{STYLES}</style>

      <div className="d28-root" id="d28-root">
        {/* Skip link */}
        <a href="#main-content" className="d28-skip">
          Skip to main content
        </a>

        {/* Scroll progress */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: "var(--bar-h)" as unknown as number,
            left: 0,
            height: "2px",
            background: "#A33B2A",
            width: progressWidth,
            zIndex: 95,
            transformOrigin: "left",
          }}
        />

        {/* Letterbox bars */}
        <LetterboxBars />

        {/* Nav */}
        <motion.nav
          className="d28-nav"
          aria-label="Primary navigation"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <a href="/" className="d28-nav-logo" aria-label="Waseem Nasir — home">
            Waseem Nasir
          </a>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="d28-nav-cta"
            rel="noopener noreferrer"
          >
            Book a call
          </a>
        </motion.nav>

        {/* ── HERO ───────────────────────────────────────────── */}
        <section className="d28-hero" aria-label="Hero">
          <div className="d28-hero-bg" aria-hidden="true">
            <img
              src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
              alt=""
            />
          </div>

          <div className="d28-hero-content" id="main-content">
            <motion.span
              className="d28-eyebrow"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              SkynetLabs · Est. 2019
            </motion.span>

            <h1 className="d28-hero-title">
              <WordReveal text="Most of what I build," delay={1.1} />
              <br />
              <WordReveal text="you'll never notice." delay={1.4} />
              <br />
              <WordReveal text="That's the point." delay={1.7} />
            </h1>

            <motion.p
              className="d28-hero-sub"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 2.1 }}
            >
              Directing automation since 2019 — 180+ builds, 40+ clients, 9
              countries.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.4 }}
            >
              <a
                href="https://skynetjoe.com/discovery-call"
                className="d28-cta-primary"
                rel="noopener noreferrer"
              >
                Book 30 minutes
              </a>
            </motion.div>
          </div>

          <motion.span
            className="d28-scroll-hint"
            aria-hidden="true"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3.0 }}
          >
            Scroll
          </motion.span>
        </section>

        {/* ── STATS ──────────────────────────────────────────── */}
        <section className="d28-stats" aria-label="Proof">
          {[
            { num: 180, suffix: "+", label: "Builds shipped" },
            { num: 40, suffix: "+", label: "Clients served" },
            { num: 9, suffix: "", label: "Countries worked" },
            { num: 2019, suffix: "", label: "Year started" },
          ].map(({ num, suffix, label }) => (
            <div key={label} className="d28-stat">
              <span className="d28-stat-num">
                <CountUp to={num} suffix={suffix} />
              </span>
              <span className="d28-stat-label">{label}</span>
            </div>
          ))}
        </section>

        {/* ── MARQUEE ────────────────────────────────────────── */}
        <Marquee />

        {/* ── TITLE CARD: WHAT I DO ───────────────────────────── */}
        <FadeIn>
          <div className="d28-title-card">
            <span className="d28-title-card-label">Act II</span>
            <h2 className="d28-title-card-heading">
              <WordReveal text="Systems that run the business while you sleep." />
            </h2>
          </div>
        </FadeIn>

        {/* ── SERVICES ───────────────────────────────────────── */}
        <section aria-label="Services">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.index} delay={0.05}>
              <div className="d28-service-row">
                <div className="d28-service-img">
                  <img src={`/img/pro/${s.img}`} alt="" />
                </div>
                <div className="d28-service-text">
                  <span className="d28-service-index">{s.index}</span>
                  <h3 className="d28-service-name">{s.name}</h3>
                  <p className="d28-service-desc">{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </section>

        {/* ── TITLE CARD: SELECTED WORK ───────────────────────── */}
        <FadeIn>
          <div className="d28-title-card">
            <span className="d28-title-card-label">Act III</span>
            <h2 className="d28-title-card-heading">
              <WordReveal text="Field notes from seven years on location." />
            </h2>
          </div>
        </FadeIn>

        {/* ── FILM STILLS GRID ────────────────────────────────── */}
        <section aria-label="Selected work — film stills" className="d28-work">
          <div className="d28-film-grid">
            {STILLS.map((s, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="d28-film-cell" tabIndex={0}>
                  <img src={`/img/pro/${s.img}`} alt={s.caption} />
                  <div className="d28-film-caption" aria-hidden="true">
                    <span className="d28-film-caption-text">{s.caption}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── MARQUEE (second pass) ───────────────────────────── */}
        <Marquee />

        {/* ── ABOUT ──────────────────────────────────────────── */}
        <section className="d28-about" aria-label="About">
          <div className="d28-about-img-wrap">
            <img
              src="/img/pro/PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg"
              alt="Waseem Nasir, founder of SkynetLabs, at a rice field in Bali"
            />
          </div>
          <div className="d28-about-content">
            <FadeIn delay={0.1}>
              <span className="d28-about-label">Director's statement</span>
              <h2 className="d28-about-heading">
                <WordReveal text="I build the infrastructure. You take the credit." />
              </h2>
              <p className="d28-about-body">
                Waseem Nasir. Independent founder, SkynetLabs. I've been
                constructing automation and AI systems since 2019 — not as a
                service, as a compulsion. The work shows up in faster pipelines,
                eliminated follow-up queues, and leads that don't disappear into
                silence.
              </p>
              <p className="d28-about-body">
                I operate from Bali and Lahore, serve clients across 9
                countries, and keep a tight client list on purpose. Every
                engagement is direct. No account managers, no handoffs. Just the
                builder.
              </p>
              <div className="d28-about-meta">
                {[
                  "n8n",
                  "Next.js",
                  "AEO",
                  "WhatsApp AI",
                  "Voice bots",
                  "Bali · Lahore",
                ].map((tag) => (
                  <span key={tag} className="d28-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── MORE PHOTOS ROW ─────────────────────────────────── */}
        <section
          aria-label="Additional work context"
          style={{ background: "var(--bg)" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "2px",
              background: "#3A3A38",
            }}
          >
            {[
              {
                img: "CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg",
                alt: "Night session, Bali coast",
              },
              {
                img: "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
                alt: "Working at rice terrace, Bali",
              },
              {
                img: "LIFESTYLE-2026-05-18-black-bandhgala-sunglasses-phone-cafe-table.jpg",
                alt: "Focused call",
              },
              {
                img: "CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg",
                alt: "Rooftop, city lights",
              },
            ].map(({ img, alt }) => (
              <FadeIn key={img}>
                <div style={{ overflow: "hidden", aspectRatio: "3/4" }}>
                  <img
                    src={`/img/pro/${img}`}
                    alt={alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.45) saturate(0.5) contrast(1.1)",
                      display: "block",
                    }}
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── CTA SECTION ────────────────────────────────────── */}
        <section className="d28-cta-section" aria-label="Contact">
          <div className="d28-cta-section-bg" aria-hidden="true">
            <img
              src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
              alt=""
            />
          </div>
          <div className="d28-cta-content">
            <FadeIn>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "32px",
                }}
              >
                Final act
              </p>
              <h2 className="d28-cta-heading">
                <WordReveal text="Thirty minutes. No pitch deck." />
              </h2>
              <p className="d28-cta-sub">
                Tell me what's leaking time and money. I'll tell you if
                automation fixes it. If it doesn't, I'll say so.
              </p>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="d28-cta-primary"
                rel="noopener noreferrer"
              >
                Book the call
              </a>
              <br />
              <a
                href="https://github.com/waseemnasir2k26"
                className="d28-cta-ghost"
                rel="noopener noreferrer"
              >
                github.com/waseemnasir2k26
              </a>
            </FadeIn>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <footer className="d28-footer" role="contentinfo">
          <span className="d28-footer-logo">Waseem Nasir</span>
          <nav aria-label="Footer navigation">
            <ul className="d28-footer-links">
              <li>
                <a href="https://skynetjoe.com" rel="noopener noreferrer">
                  SkynetLabs
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/waseemnasir2k26"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  rel="noopener noreferrer"
                >
                  Discovery call
                </a>
              </li>
            </ul>
          </nav>
          <span className="d28-footer-copy">
            © 2019 – {new Date().getFullYear()}
          </span>
        </footer>
      </div>
    </>
  );
}
