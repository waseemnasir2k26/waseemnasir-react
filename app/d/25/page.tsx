"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

/* ─── Scoped font + reset ─────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

.ap-root {
  font-family: 'Inter Tight', sans-serif;
  background: #FBFAF7;
  color: #101010;
  cursor: crosshair;
}
.ap-root *, .ap-root *::before, .ap-root *::after {
  box-sizing: border-box;
}
.ap-root a {
  color: inherit;
  text-decoration: none;
}
.ap-root a:focus-visible {
  outline: 1.5px solid #1E3A2F;
  outline-offset: 3px;
}
.ap-font-display {
  font-family: 'Fraunces', serif;
  font-optical-sizing: auto;
}
.ap-font-mono {
  font-family: 'IBM Plex Mono', monospace;
}

/* 12-col hairline grid */
.ap-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 0 1px;
  position: relative;
}

/* Column hairlines — rendered as background gradient */
.ap-col-rules {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: repeating-linear-gradient(
    to right,
    transparent 0px,
    transparent calc((100% / 12) - 1px),
    #D6CFC0 calc((100% / 12) - 1px),
    #D6CFC0 calc(100% / 12)
  );
}

/* Baseline grid overlay */
.ap-baseline {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 23px,
    rgba(162,160,153,0.15) 23px,
    rgba(162,160,153,0.15) 24px
  );
}

/* Spec row */
.ap-spec-row {
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  gap: 0 2rem;
  border-top: 1px solid #D6CFC0;
  padding: 1.25rem 0;
  align-items: start;
}
.ap-spec-row:last-child {
  border-bottom: 1px solid #D6CFC0;
}
.ap-row-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.625rem;
  color: #A2A099;
  letter-spacing: 0.08em;
  padding-top: 0.2rem;
  line-height: 1.6;
}
.ap-row-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.625rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #A2A099;
  margin-bottom: 0.35rem;
}

/* Section label */
.ap-section-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.625rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A2A099;
  margin-bottom: 1.5rem;
}

/* Hairline divider */
.ap-rule {
  border: none;
  border-top: 1px solid #D6CFC0;
  margin: 0;
}

/* Nav */
.ap-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(251,250,247,0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid #D6CFC0;
}
.ap-nav-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
}
.ap-nav-wordmark {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #101010;
  font-weight: 500;
}
.ap-nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.ap-nav-links a {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #A2A099;
  transition: color 0.2s;
}
.ap-nav-links a:hover { color: #101010; }

/* Hero */
.ap-hero {
  padding-top: 3rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}
.ap-hero-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 5rem 2.5rem 4rem;
  position: relative;
  z-index: 2;
}
.ap-doc-ref {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.5875rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #A2A099;
  margin-bottom: 3rem;
}
.ap-hero-headline {
  font-family: 'Fraunces', serif;
  font-optical-sizing: auto;
  font-size: clamp(3.5rem, 7.5vw, 7.5rem);
  font-weight: 300;
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: #101010;
  max-width: 14ch;
  margin: 0 0 2.5rem;
}
.ap-hero-sub {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: #1E3A2F;
  font-weight: 500;
  max-width: 56ch;
  line-height: 2;
}
.ap-hero-sub span {
  display: inline-block;
  margin-right: 0.25rem;
}
.ap-hero-cta {
  display: inline-block;
  margin-top: 3rem;
  padding: 0.875rem 2rem;
  border: 1px solid #1E3A2F;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #1E3A2F;
  transition: background 0.2s, color 0.2s;
}
.ap-hero-cta:hover {
  background: #1E3A2F;
  color: #FBFAF7;
}
.ap-hero-img-strip {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1px;
  margin-top: 4rem;
}
.ap-hero-img-strip img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  display: block;
}

/* Numbers / proof */
.ap-stats {
  max-width: 1440px;
  margin: 0 auto;
  padding: 6rem 2.5rem;
  position: relative;
  z-index: 2;
}
.ap-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid #D6CFC0;
}
.ap-stat-cell {
  border-right: 1px solid #D6CFC0;
  padding: 2.5rem 2rem 2.5rem 0;
}
.ap-stat-cell:last-child { border-right: none; }
.ap-stat-cell:not(:first-child) { padding-left: 2rem; }
.ap-stat-num {
  font-family: 'Fraunces', serif;
  font-optical-sizing: auto;
  font-size: clamp(2.5rem, 4vw, 4rem);
  font-weight: 300;
  line-height: 1;
  color: #1E3A2F;
  letter-spacing: -0.03em;
}
.ap-stat-suffix {
  font-size: 0.6em;
  vertical-align: super;
}
.ap-stat-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.5875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #A2A099;
  margin-top: 0.75rem;
}
.ap-stat-sub {
  font-size: 0.75rem;
  color: #A2A099;
  margin-top: 0.25rem;
  font-family: 'Inter Tight', sans-serif;
}

/* Services spec-sheet */
.ap-services {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2.5rem 6rem;
  position: relative;
  z-index: 2;
}

/* Work gallery */
.ap-work {
  background: #F0EEE8;
  position: relative;
  z-index: 2;
}
.ap-work-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 6rem 2.5rem;
}
.ap-work-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  margin-top: 3rem;
  background: #D6CFC0;
}
.ap-work-cell {
  background: #F0EEE8;
  overflow: hidden;
  position: relative;
}
.ap-work-img {
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.ap-work-cell:hover .ap-work-img { transform: scale(1.03); }
.ap-work-caption {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #D6CFC0;
}
.ap-work-caption-ref {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.5625rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #A2A099;
  margin-bottom: 0.35rem;
}
.ap-work-caption-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #101010;
}

/* About */
.ap-about {
  max-width: 1440px;
  margin: 0 auto;
  padding: 6rem 2.5rem;
  position: relative;
  z-index: 2;
}
.ap-about-layout {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 4rem;
  align-items: start;
}
.ap-about-img-wrap {
  position: relative;
}
.ap-about-img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
}
.ap-about-img-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.5625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #A2A099;
  margin-top: 0.75rem;
}
.ap-about-body {
  padding-top: 1rem;
}
.ap-about-name {
  font-family: 'Fraunces', serif;
  font-optical-sizing: auto;
  font-size: clamp(2rem, 3.5vw, 3.25rem);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #101010;
  margin: 1.5rem 0 2rem;
}
.ap-about-body p {
  font-size: 0.9375rem;
  line-height: 1.75;
  color: #4A4845;
  margin-bottom: 1.25rem;
  max-width: 52ch;
}
.ap-about-links {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
}
.ap-about-links a {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.625rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #1E3A2F;
  border-bottom: 1px solid #1E3A2F;
  padding-bottom: 1px;
}

/* CTA */
.ap-cta-section {
  background: #1E3A2F;
  position: relative;
  z-index: 2;
}
.ap-cta-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 7rem 2.5rem;
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 4rem;
  align-items: center;
}
.ap-cta-headline {
  font-family: 'Fraunces', serif;
  font-optical-sizing: auto;
  font-size: clamp(2.5rem, 4.5vw, 4.5rem);
  font-weight: 300;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: #FBFAF7;
}
.ap-cta-sub {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  color: rgba(251,250,247,0.5);
  margin-top: 1.5rem;
  line-height: 1.8;
}
.ap-cta-right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.ap-cta-btn {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: #FBFAF7;
  color: #1E3A2F;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-align: center;
  transition: background 0.2s, color 0.2s;
  border: 1px solid #FBFAF7;
}
.ap-cta-btn:hover {
  background: transparent;
  color: #FBFAF7;
}
.ap-cta-note {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.5625rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(251,250,247,0.35);
  text-align: center;
}

/* Footer */
.ap-footer {
  background: #101010;
  position: relative;
  z-index: 2;
}
.ap-footer-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ap-footer-copy {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.5625rem;
  letter-spacing: 0.12em;
  color: rgba(251,250,247,0.3);
}
.ap-footer-links {
  display: flex;
  gap: 2rem;
}
.ap-footer-links a {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.5625rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(251,250,247,0.3);
  transition: color 0.2s;
}
.ap-footer-links a:hover { color: rgba(251,250,247,0.7); }

/* Progress rail */
.ap-progress-rail {
  position: fixed;
  top: 3rem;
  left: 0;
  width: 0%;
  height: 2px;
  background: #1E3A2F;
  z-index: 200;
  transform-origin: left;
}

/* Photo strip (portrait) */
.ap-photo-strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1px;
  background: #D6CFC0;
  margin-top: 4rem;
}
.ap-photo-strip img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
  transition: opacity 0.3s;
}
.ap-photo-strip img:hover { opacity: 0.9; }

@media (max-width: 900px) {
  .ap-stats-grid { grid-template-columns: 1fr 1fr; }
  .ap-stat-cell:nth-child(2) { border-right: none; }
  .ap-about-layout { grid-template-columns: 1fr; }
  .ap-cta-inner { grid-template-columns: 1fr; gap: 2rem; }
  .ap-work-grid { grid-template-columns: 1fr; }
  .ap-hero-img-strip { grid-template-columns: 1fr 1fr; }
  .ap-photo-strip { grid-template-columns: repeat(3, 1fr); }
  .ap-nav-links { display: none; }
}
@media (max-width: 600px) {
  .ap-hero-inner, .ap-stats, .ap-services, .ap-work-inner,
  .ap-about, .ap-cta-inner, .ap-footer-inner { padding-left: 1.25rem; padding-right: 1.25rem; }
  .ap-hero-img-strip { grid-template-columns: 1fr; }
  .ap-photo-strip { grid-template-columns: 1fr 1fr; }
}
`;

/* ─── Count-up hook ───────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1400, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return val;
}

/* ─── Spec row component ──────────────────────────────────────────────────── */
interface SpecRowProps {
  num: string;
  label: string;
  children: React.ReactNode;
  delay?: number;
  reduced?: boolean;
}
function SpecRow({
  num,
  label,
  children,
  delay = 0,
  reduced = false,
}: SpecRowProps) {
  return (
    <motion.div
      className="ap-spec-row"
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="ap-row-num">{num}</div>
      <div>
        <div className="ap-row-label">{label}</div>
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Stat cell with count-up ─────────────────────────────────────────────── */
interface StatCellProps {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  reduced: boolean;
  inView: boolean;
}
function StatCell({
  value,
  suffix,
  label,
  sub,
  reduced,
  inView,
}: StatCellProps) {
  const counted = useCountUp(value, 1200, !reduced && inView);
  const display = reduced ? value : counted;
  return (
    <div className="ap-stat-cell">
      <div className="ap-stat-num">
        {display}
        <span className="ap-stat-suffix">{suffix}</span>
      </div>
      <div className="ap-stat-label">{label}</div>
      <div className="ap-stat-sub">{sub}</div>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────────────────── */
export default function AtelierPaper() {
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const statsRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  const [gridVisible, setGridVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setGridVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsInView(true);
      },
      { threshold: 0.2 },
    );
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const services = [
    {
      num: "01",
      label: "DISCIPLINE",
      title: "AI Automation Systems",
      desc: "End-to-end workflow automation via n8n — CRM sync, lead routing, task triggers. Eliminates the ops debt that kills small teams.",
    },
    {
      num: "02",
      label: "DISCIPLINE",
      title: "WhatsApp & Voice Bots",
      desc: "Conversational AI that handles inbound leads, qualifies prospects, and books calls without human intervention. Built on real business logic.",
    },
    {
      num: "03",
      label: "DISCIPLINE",
      title: "AEO — Answer Engine Optimisation",
      desc: "Structured content and schema architecture that positions your brand in AI-generated search answers. Next-gen SEO.",
    },
    {
      num: "04",
      label: "DISCIPLINE",
      title: "Next.js Product Builds",
      desc: "Full-stack web applications shipped from brief to deploy. TypeScript, performant, production-grade. Not templates — bespoke systems.",
    },
    {
      num: "05",
      label: "DISCIPLINE",
      title: "Growth Infrastructure",
      desc: "The stack of systems under a scaling business: email sequences, onboarding flows, intake forms, analytics pipelines. Stitched, not bolted.",
    },
    {
      num: "06",
      label: "DISCIPLINE",
      title: "Systems Audit",
      desc: "One session. Complete mapping of where your ops leak time and revenue. Prioritised fix-list, not a slide deck.",
    },
  ];

  const workItems = [
    {
      img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
      ref: "WRK-001",
      title: "Analytics dashboard build — dual-screen ops review",
    },
    {
      img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
      ref: "WRK-002",
      title: "Remote client sprint — Bali, May 2026",
    },
    {
      img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
      ref: "WRK-003",
      title: "Coworking session — WhatsApp bot deployment",
    },
    {
      img: "EVENT-expo-booth-navy-polo-chandelier-hall.jpg",
      ref: "WRK-004",
      title: "Expo presence — SkynetLabs product showcase",
    },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="ap-root"
        style={{ position: "relative", zIndex: 2, minHeight: "100vh" }}
      >
        {/* Scroll progress rail */}
        <motion.div
          className="ap-progress-rail"
          style={{ width: progressWidth }}
        />

        {/* Column hairlines — fade in */}
        <motion.div
          className="ap-col-rules"
          initial={reduced ? { opacity: 0.4 } : { opacity: 0 }}
          animate={{ opacity: gridVisible ? 0.4 : 0 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />

        {/* Baseline grid */}
        <motion.div
          className="ap-baseline"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: gridVisible ? 1 : 0 }}
          transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
        />

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <motion.nav
          className="ap-nav"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          aria-label="Primary navigation"
        >
          <div className="ap-nav-inner">
            <span className="ap-nav-wordmark">Waseem Nasir — SkynetLabs</span>
            <ul className="ap-nav-links">
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#work">Work</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="https://skynetjoe.com/discovery-call">Book a call</a>
              </li>
            </ul>
          </div>
        </motion.nav>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <main id="main-content">
          <a
            href="#main-content"
            style={{
              position: "absolute",
              left: "-9999px",
              top: "auto",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
            className="ap-font-mono"
          >
            Skip to main content
          </a>

          <section className="ap-hero" aria-labelledby="hero-heading">
            <div
              className="ap-hero-inner"
              style={{ position: "relative", zIndex: 2 }}
            >
              <motion.p
                className="ap-doc-ref"
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                DOC REF: SNL-2019-0001 &nbsp;·&nbsp; REV 9 &nbsp;·&nbsp; STATUS:
                ACTIVE
              </motion.p>

              <h1 className="ap-hero-headline" id="hero-heading">
                {["A", "founder", "who", "ships."].map((word, i) => (
                  <motion.span
                    key={i}
                    style={{ display: "block" }}
                    initial={
                      reduced
                        ? { opacity: 1, clipPath: "inset(0 0 0 0)" }
                        : { opacity: 0, clipPath: "inset(0 0 100% 0)" }
                    }
                    animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                    transition={{
                      duration: 0.55,
                      delay: 0.6 + i * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                className="ap-hero-sub"
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 1.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span>DISCIPLINE: AI systems</span>
                <span style={{ color: "#D6CFC0", margin: "0 0.75rem" }}>·</span>
                <span>CLIENTS: 40+</span>
                <span style={{ color: "#D6CFC0", margin: "0 0.75rem" }}>·</span>
                <span>BUILDS: 180+</span>
                <span style={{ color: "#D6CFC0", margin: "0 0.75rem" }}>·</span>
                <span>SINCE: 2019</span>
              </motion.p>

              <motion.div
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.3 }}
              >
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="ap-hero-cta"
                  aria-label="Book a 30-minute discovery call"
                >
                  Book a 30-min call &rarr;
                </a>
              </motion.div>

              {/* Three-image strip */}
              <motion.div
                className="ap-hero-img-strip"
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {[
                  "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
                  "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
                  "PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg",
                ].map((f, i) => (
                  <img
                    key={i}
                    src={`/img/pro/${f}`}
                    alt={`Waseem Nasir — image ${i + 1}`}
                    style={{ filter: "grayscale(15%)" }}
                  />
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── STATS ─────────────────────────────────────────────────────── */}
          <section
            className="ap-stats"
            ref={statsRef}
            aria-label="Track record"
          >
            <motion.p
              className="ap-section-tag"
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              SECTION 01 — TRACK RECORD
            </motion.p>
            <div className="ap-stats-grid">
              <StatCell
                value={180}
                suffix="+"
                label="BUILDS SHIPPED"
                sub="Products, automations, bots"
                reduced={reduced}
                inView={statsInView}
              />
              <StatCell
                value={40}
                suffix="+"
                label="CLIENTS SERVED"
                sub="Startups to enterprise"
                reduced={reduced}
                inView={statsInView}
              />
              <StatCell
                value={9}
                suffix=""
                label="COUNTRIES"
                sub="Worked and operated from"
                reduced={reduced}
                inView={statsInView}
              />
              <StatCell
                value={2019}
                suffix=""
                label="FOUNDED"
                sub="7+ years of compounded craft"
                reduced={reduced}
                inView={statsInView}
              />
            </div>
          </section>

          {/* ── SERVICES ──────────────────────────────────────────────────── */}
          <section
            className="ap-services"
            id="services"
            aria-labelledby="services-heading"
          >
            <motion.p
              className="ap-section-tag"
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              SECTION 02 — DISCIPLINES
            </motion.p>
            <h2
              id="services-heading"
              className="ap-font-display"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: "3rem",
                color: "#101010",
              }}
            >
              What I build
            </h2>
            {services.map((s, i) => (
              <SpecRow
                key={s.num}
                num={s.num}
                label={s.label}
                delay={i * 0.07}
                reduced={reduced}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0 3rem",
                  }}
                >
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: "0.9375rem",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {s.title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      color: "#4A4845",
                      margin: 0,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </SpecRow>
            ))}
          </section>

          {/* ── WORK GALLERY ──────────────────────────────────────────────── */}
          <section className="ap-work" id="work" aria-labelledby="work-heading">
            <div className="ap-work-inner">
              <motion.p
                className="ap-section-tag"
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                SECTION 03 — SELECTED WORK
              </motion.p>
              <h2
                id="work-heading"
                className="ap-font-display"
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "#101010",
                }}
              >
                In the field
              </h2>
              <div className="ap-work-grid">
                {workItems.map((w, i) => (
                  <motion.div
                    key={w.ref}
                    className="ap-work-cell"
                    initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.55,
                      delay: i * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <img
                      src={`/img/pro/${w.img}`}
                      alt={w.title}
                      className="ap-work-img"
                    />
                    <div className="ap-work-caption">
                      <div className="ap-work-caption-ref">{w.ref}</div>
                      <div className="ap-work-caption-title">{w.title}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Portrait photo strip */}
              <div className="ap-photo-strip">
                {[
                  "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
                  "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                  "LIFESTYLE-2026-03-29-night-cafe-armchair-relaxed-gaze.jpg",
                  "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                  "PORTRAIT-mural-halfbody-smile-watch-raised.jpg",
                ].map((f, i) => (
                  <motion.img
                    key={i}
                    src={`/img/pro/${f}`}
                    alt={`Waseem Nasir — field photo ${i + 1}`}
                    initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── ABOUT ─────────────────────────────────────────────────────── */}
          <section
            className="ap-about"
            id="about"
            aria-labelledby="about-heading"
          >
            <motion.p
              className="ap-section-tag"
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              SECTION 04 — PRINCIPAL
            </motion.p>
            <div className="ap-about-layout">
              <motion.div
                className="ap-about-img-wrap"
                initial={reduced ? { opacity: 1 } : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src="/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg"
                  alt="Waseem Nasir — founder portrait"
                  className="ap-about-img"
                />
                <p className="ap-about-img-label">
                  FIG 01 — Waseem Nasir, Principal. SkynetLabs.
                </p>
              </motion.div>

              <motion.div
                className="ap-about-body"
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.65,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="ap-row-label">PRINCIPAL ENGINEER + FOUNDER</div>
                <h2 id="about-heading" className="ap-about-name">
                  Waseem Nasir
                </h2>

                {[
                  "Independent founder of SkynetLabs. Building AI and automation systems that remove the operational drag stopping small businesses from scaling. Not consultancy — direct execution.",
                  "Seven years of shipping across 9 countries. From n8n pipelines that replace five-person ops teams, to voice bots handling inbound at 3 AM, to Next.js products that go live in weeks not quarters.",
                  "The work is precise. Systems either run or they don't. There's no middle ground in automation — and that discipline shows in how I build everything else.",
                  "Currently taking on a limited number of direct projects. Based between Bali and Lahore. Remote-first by default.",
                ].map((text, i) => (
                  <p key={i}>{text}</p>
                ))}

                <div className="ap-about-links">
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    aria-label="Book a call with Waseem"
                  >
                    Book a call
                  </a>
                  <a
                    href="https://github.com/waseemnasir2k26"
                    aria-label="Waseem's GitHub profile"
                  >
                    GitHub
                  </a>
                </div>

                {/* Mini spec block */}
                <div style={{ marginTop: "3rem" }}>
                  {[
                    {
                      label: "STACK",
                      val: "n8n · Next.js · TypeScript · Python · WhatsApp API",
                    },
                    {
                      label: "LOCATION",
                      val: "Bali, Indonesia / Lahore, Pakistan — remote worldwide",
                    },
                    {
                      label: "AVAILABILITY",
                      val: "Limited direct engagements. Q3 2026.",
                    },
                    { label: "CONTACT", val: "skynetjoe.com/discovery-call" },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="ap-spec-row"
                      style={{
                        gridTemplateColumns: "7rem 1fr",
                        gap: "0 1.5rem",
                      }}
                    >
                      <div className="ap-row-num" style={{ paddingTop: 0 }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <div className="ap-row-label">{row.label}</div>
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            margin: 0,
                            color: "#4A4845",
                            lineHeight: 1.6,
                          }}
                        >
                          {row.val}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── VOICE / PROCESS ───────────────────────────────────────────── */}
          <section
            style={{ background: "#F0EEE8", position: "relative", zIndex: 2 }}
            aria-labelledby="process-heading"
          >
            <div
              style={{
                maxWidth: 1440,
                margin: "0 auto",
                padding: "6rem 2.5rem",
              }}
            >
              <motion.p
                className="ap-section-tag"
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                SECTION 05 — METHOD
              </motion.p>
              <h2
                id="process-heading"
                className="ap-font-display"
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "#101010",
                  marginBottom: "3rem",
                }}
              >
                How the work gets done
              </h2>
              {[
                {
                  num: "01",
                  label: "PHASE",
                  title: "Scope",
                  desc: "30-minute call. I map your ops, find where time and revenue leak, and define exactly what we're building. No proposals without clarity first.",
                },
                {
                  num: "02",
                  label: "PHASE",
                  title: "Specification",
                  desc: "A written spec document — requirements, success criteria, delivery format. This is the contract. Misalignment dies here.",
                },
                {
                  num: "03",
                  label: "PHASE",
                  title: "Build",
                  desc: "Direct execution. I build, not delegate. You have one point of contact. Velocity and quality don't trade off — that's the point of working with a specialist.",
                },
                {
                  num: "04",
                  label: "PHASE",
                  title: "Handoff",
                  desc: "Documented systems. Walk-through video. 30-day support window. You own everything built — code, credentials, docs. No lock-in.",
                },
              ].map((row, i) => (
                <SpecRow
                  key={row.num}
                  num={row.num}
                  label={row.label}
                  delay={i * 0.08}
                  reduced={reduced}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 2fr",
                      gap: "0 3rem",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 500,
                        fontSize: "0.9375rem",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {row.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        lineHeight: 1.65,
                        color: "#4A4845",
                        margin: 0,
                      }}
                    >
                      {row.desc}
                    </p>
                  </div>
                </SpecRow>
              ))}

              {/* Extra image row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "1px",
                  background: "#D6CFC0",
                  marginTop: "4rem",
                }}
              >
                {[
                  "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
                  "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
                  "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
                  "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
                ].map((f, i) => (
                  <motion.img
                    key={i}
                    src={`/img/pro/${f}`}
                    alt={`Working photo ${i + 1}`}
                    style={{
                      width: "100%",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      display: "block",
                    }}
                    initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ───────────────────────────────────────────────────────── */}
          <section className="ap-cta-section" aria-labelledby="cta-heading">
            <div className="ap-cta-inner">
              <motion.div
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <p
                  className="ap-font-mono"
                  style={{
                    fontSize: "0.5875rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(251,250,247,0.4)",
                    marginBottom: "1.5rem",
                  }}
                >
                  SECTION 06 — ENGAGEMENT
                </p>
                <h2 id="cta-heading" className="ap-cta-headline">
                  Nine years on
                  <br />
                  the record.
                  <br />
                  Ready to engage.
                </h2>
                <p className="ap-cta-sub">
                  Systems built to last. No retainer lock-in.
                  <br />
                  Bali / Lahore / wherever the work is.
                </p>
              </motion.div>
              <motion.div
                className="ap-cta-right"
                initial={reduced ? { opacity: 1 } : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div
                  style={{
                    borderTop: "1px solid rgba(251,250,247,0.15)",
                    paddingTop: "1.5rem",
                  }}
                >
                  {[
                    { k: "FORMAT", v: "30-min discovery call" },
                    { k: "RESPONSE", v: "Within 24 hours" },
                    { k: "PLATFORM", v: "skynetjoe.com" },
                  ].map((row) => (
                    <div
                      key={row.k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid rgba(251,250,247,0.1)",
                        padding: "0.75rem 0",
                      }}
                    >
                      <span
                        className="ap-font-mono"
                        style={{
                          fontSize: "0.5625rem",
                          letterSpacing: "0.12em",
                          color: "rgba(251,250,247,0.35)",
                        }}
                      >
                        {row.k}
                      </span>
                      <span
                        className="ap-font-mono"
                        style={{
                          fontSize: "0.5625rem",
                          letterSpacing: "0.1em",
                          color: "rgba(251,250,247,0.7)",
                        }}
                      >
                        {row.v}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="ap-cta-btn"
                  aria-label="Book a 30-minute discovery call with Waseem Nasir"
                >
                  Book a discovery call &rarr;
                </a>
                <p className="ap-cta-note">
                  No obligation. 30 minutes. Specific outcomes.
                </p>
              </motion.div>
            </div>
          </section>

          {/* ── FOOTER ────────────────────────────────────────────────────── */}
          <footer className="ap-footer">
            <div className="ap-footer-inner">
              <p className="ap-footer-copy">
                &copy; 2019–2026 Waseem Nasir / SkynetLabs &nbsp;·&nbsp; DOC REF
                SNL-2019-0001
              </p>
              <nav className="ap-footer-links" aria-label="Footer links">
                <a href="https://skynetjoe.com/discovery-call">Book a call</a>
                <a href="https://github.com/waseemnasir2k26">GitHub</a>
                <a href="https://skynetjoe.com">SkynetJoe</a>
              </nav>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
