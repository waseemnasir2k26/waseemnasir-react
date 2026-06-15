"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

/* ─── scoped font + CSS ─────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');

.d40 {
  font-family: 'Inter', sans-serif;
  background: #F7F6F3;
  color: #16151A;
  overflow-x: hidden;
}

.d40 *, .d40 *::before, .d40 *::after {
  box-sizing: border-box;
}

.d40-display {
  font-family: 'Fraunces', serif;
}

.d40-mono {
  font-family: 'JetBrains Mono', monospace;
}

/* ── mesh corner light ───────────────────────────────────────── */
@keyframes d40-mesh-drift {
  0%   { transform: translate(0px, 0px) scale(1);   opacity: 0.55; }
  33%  { transform: translate(-18px, 12px) scale(1.04); opacity: 0.6;  }
  66%  { transform: translate(10px, -8px)  scale(0.97); opacity: 0.5;  }
  100% { transform: translate(0px, 0px) scale(1);   opacity: 0.55; }
}

.d40-mesh-orb {
  position: absolute;
  top: -120px;
  right: -120px;
  width: 640px;
  height: 640px;
  border-radius: 50%;
  background: radial-gradient(ellipse at 60% 40%,
    rgba(79,70,229,0.18) 0%,
    rgba(244,114,182,0.14) 40%,
    rgba(247,246,243,0) 75%
  );
  pointer-events: none;
  animation: d40-mesh-drift 14s ease-in-out infinite;
  filter: blur(32px);
}

@media (prefers-reduced-motion: reduce) {
  .d40-mesh-orb { animation: none; }
}

/* ── CTA sweep ───────────────────────────────────────────────── */
.d40-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: #4F46E5;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.925rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline-offset: 3px;
}

.d40-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    rgba(244,114,182,0) 0%,
    rgba(244,114,182,0.35) 40%,
    rgba(79,70,229,0) 80%
  );
  transform: translateX(-120%);
  transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
}

.d40-cta:hover::before,
.d40-cta:focus-visible::before {
  transform: translateX(120%);
}

.d40-cta:focus-visible {
  outline: 2px solid #4F46E5;
  outline-offset: 4px;
}

/* ── nav ─────────────────────────────────────────────────────── */
.d40-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 18px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(247,246,243,0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(22,21,26,0.07);
}

.d40-nav-logo {
  font-family: 'Fraunces', serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #16151A;
  text-decoration: none;
  letter-spacing: -0.01em;
}

.d40-nav-links {
  display: flex;
  gap: 32px;
  list-style: none;
  margin: 0; padding: 0;
}

.d40-nav-links a {
  font-size: 0.85rem;
  font-weight: 500;
  color: #6B6A75;
  text-decoration: none;
  transition: color 0.2s;
}

.d40-nav-links a:hover,
.d40-nav-links a:focus-visible {
  color: #16151A;
}

@media (max-width: 768px) {
  .d40-nav { padding: 16px 20px; }
  .d40-nav-links { display: none; }
}

/* ── section layout ──────────────────────────────────────────── */
.d40-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 48px;
}

@media (max-width: 768px) {
  .d40-section { padding: 0 20px; }
}

/* ── hero ─────────────────────────────────────────────────────── */
.d40-hero {
  padding-top: 160px;
  padding-bottom: 100px;
  position: relative;
}

.d40-hero-tag {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4F46E5;
  margin-bottom: 28px;
  padding: 5px 12px;
  border: 1px solid rgba(79,70,229,0.25);
  background: rgba(79,70,229,0.04);
}

.d40-h1 {
  font-family: 'Fraunces', serif;
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #16151A;
  max-width: 700px;
  margin: 0 0 28px;
}

.d40-h1 em {
  font-style: italic;
  color: #4F46E5;
}

.d40-hero-sub {
  font-size: 1rem;
  color: #6B6A75;
  max-width: 480px;
  line-height: 1.7;
  margin: 0 0 44px;
}

.d40-hero-sub strong {
  color: #16151A;
  font-weight: 500;
}

.d40-scroll-hint {
  margin-top: 64px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: #6B6A75;
  display: flex;
  align-items: center;
  gap: 10px;
}

.d40-scroll-hint::before {
  content: '';
  display: block;
  width: 32px;
  height: 1px;
  background: #6B6A75;
}

/* ── numbers ─────────────────────────────────────────────────── */
.d40-numbers {
  padding: 80px 0;
  border-top: 1px solid rgba(22,21,26,0.1);
  border-bottom: 1px solid rgba(22,21,26,0.1);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}

@media (max-width: 640px) {
  .d40-numbers { grid-template-columns: repeat(2, 1fr); gap: 40px 0; }
}

.d40-num-item {
  padding: 0 32px 0 0;
  border-right: 1px solid rgba(22,21,26,0.1);
}

.d40-num-item:last-child { border-right: none; }

@media (max-width: 640px) {
  .d40-num-item:nth-child(even) { border-right: none; }
  .d40-num-item { padding: 0 0 0 20px; }
}

.d40-num-val {
  font-family: 'Fraunces', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #16151A;
  line-height: 1;
  margin-bottom: 6px;
}

.d40-num-val span {
  color: #4F46E5;
}

.d40-num-label {
  font-size: 0.78rem;
  color: #6B6A75;
  letter-spacing: 0.01em;
}

/* ── services ────────────────────────────────────────────────── */
.d40-services {
  padding: 100px 0;
}

.d40-section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6B6A75;
  margin-bottom: 48px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.d40-section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(22,21,26,0.12);
}

.d40-service-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.d40-service-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 24px;
  padding: 28px 0;
  border-bottom: 1px solid rgba(22,21,26,0.08);
  cursor: default;
}

.d40-service-row:first-child { border-top: 1px solid rgba(22,21,26,0.08); }

.d40-service-name {
  font-family: 'Fraunces', serif;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: #16151A;
  margin: 0 0 6px;
}

.d40-service-desc {
  font-size: 0.88rem;
  color: #6B6A75;
  line-height: 1.6;
  max-width: 560px;
  margin: 0;
}

.d40-service-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: #4F46E5;
  background: rgba(79,70,229,0.07);
  padding: 4px 10px;
  white-space: nowrap;
  margin-top: 4px;
}

/* ── work grid ───────────────────────────────────────────────── */
.d40-work {
  padding: 100px 0;
  border-top: 1px solid rgba(22,21,26,0.08);
}

.d40-work-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  margin-top: 48px;
}

@media (max-width: 768px) {
  .d40-work-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .d40-work-grid { grid-template-columns: 1fr; }
}

.d40-work-cell {
  aspect-ratio: 3/4;
  overflow: hidden;
  position: relative;
  background: #E8E7E2;
}

.d40-work-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.7s cubic-bezier(0.4,0,0.2,1);
  display: block;
}

.d40-work-cell:hover img {
  transform: scale(1.04);
}

.d40-work-cell-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 20px 16px 16px;
  background: linear-gradient(to top, rgba(22,21,26,0.65) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.d40-work-cell:hover .d40-work-cell-overlay {
  opacity: 1;
}

.d40-work-cell-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.85);
  text-transform: uppercase;
}

/* ── voice quote ─────────────────────────────────────────────── */
.d40-voice {
  padding: 80px 0;
  border-top: 1px solid rgba(22,21,26,0.08);
  border-bottom: 1px solid rgba(22,21,26,0.08);
}

.d40-pull-quote {
  font-family: 'Fraunces', serif;
  font-size: clamp(1.5rem, 3.5vw, 2.4rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: #16151A;
  max-width: 680px;
  margin: 0;
  padding-left: 24px;
  border-left: 3px solid #4F46E5;
}

.d40-pull-quote em {
  color: #F472B6;
  font-style: italic;
}

.d40-pull-attr {
  margin-top: 24px;
  font-size: 0.82rem;
  color: #6B6A75;
  padding-left: 24px;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.06em;
}

/* ── about ───────────────────────────────────────────────────── */
.d40-about {
  padding: 100px 0;
}

.d40-about-grid {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 64px;
  align-items: start;
}

@media (max-width: 900px) {
  .d40-about-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.d40-about-img-wrap {
  position: relative;
}

.d40-about-img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  object-position: center top;
  display: block;
  filter: grayscale(8%);
}

.d40-about-img-badge {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(247,246,243,0.95);
  padding: 10px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: #16151A;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(22,21,26,0.1);
}

.d40-about-text h2 {
  font-family: 'Fraunces', serif;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #16151A;
  line-height: 1.15;
  margin: 0 0 24px;
}

.d40-about-text p {
  font-size: 0.95rem;
  color: #6B6A75;
  line-height: 1.8;
  margin: 0 0 20px;
}

.d40-about-text p strong {
  color: #16151A;
  font-weight: 500;
}

.d40-about-links {
  display: flex;
  gap: 16px;
  margin-top: 36px;
  flex-wrap: wrap;
}

.d40-about-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: #4F46E5;
  text-decoration: none;
  border-bottom: 1px solid rgba(79,70,229,0.3);
  padding-bottom: 2px;
  transition: border-color 0.2s;
}

.d40-about-link:hover,
.d40-about-link:focus-visible {
  border-color: #4F46E5;
}

/* ── location strip ──────────────────────────────────────────── */
.d40-location {
  padding: 48px 0;
  border-top: 1px solid rgba(22,21,26,0.08);
  display: flex;
  gap: 48px;
  align-items: center;
  flex-wrap: wrap;
}

.d40-location-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.d40-location-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6B6A75;
}

.d40-location-val {
  font-size: 0.9rem;
  font-weight: 500;
  color: #16151A;
}

/* ── photo strip ─────────────────────────────────────────────── */
.d40-strip {
  width: 100%;
  overflow: hidden;
  border-top: 1px solid rgba(22,21,26,0.08);
  border-bottom: 1px solid rgba(22,21,26,0.08);
}

.d40-strip-inner {
  display: flex;
  gap: 2px;
  width: max-content;
}

.d40-strip-img {
  height: 240px;
  width: 200px;
  object-fit: cover;
  object-position: center top;
  flex-shrink: 0;
  display: block;
  filter: grayscale(15%);
}

/* ── CTA section ─────────────────────────────────────────────── */
.d40-cta-section {
  padding: 120px 0;
}

.d40-cta-section h2 {
  font-family: 'Fraunces', serif;
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #16151A;
  line-height: 1.1;
  max-width: 620px;
  margin: 0 0 20px;
}

.d40-cta-section h2 em {
  font-style: italic;
  color: #4F46E5;
}

.d40-cta-section p {
  font-size: 0.95rem;
  color: #6B6A75;
  margin: 0 0 40px;
  max-width: 440px;
  line-height: 1.7;
}

.d40-cta-arrow {
  display: inline-block;
  transition: transform 0.3s;
}

.d40-cta:hover .d40-cta-arrow {
  transform: translateX(4px);
}

/* ── footer ──────────────────────────────────────────────────── */
.d40-footer {
  border-top: 1px solid rgba(22,21,26,0.1);
  padding: 40px 0 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.d40-footer-name {
  font-family: 'Fraunces', serif;
  font-size: 1rem;
  font-weight: 700;
  color: #16151A;
  letter-spacing: -0.01em;
}

.d40-footer-right {
  display: flex;
  gap: 24px;
  align-items: center;
}

.d40-footer-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: #6B6A75;
  text-decoration: none;
  transition: color 0.2s;
}

.d40-footer-link:hover,
.d40-footer-link:focus-visible {
  color: #16151A;
}

.d40-footer-copy {
  font-size: 0.78rem;
  color: #6B6A75;
}

/* ── progress rail ───────────────────────────────────────────── */
.d40-progress {
  position: fixed;
  top: 0; left: 0;
  width: 0%;
  height: 2px;
  background: linear-gradient(90deg, #4F46E5, #F472B6);
  z-index: 200;
  pointer-events: none;
  transform-origin: left;
}
`;

/* ─── count-up hook ─────────────────────────────────────────── */
function useCountUp(target: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

/* ─── number card ───────────────────────────────────────────── */
function StatCard({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1600, visible);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div className="d40-num-item" ref={ref}>
      <div className="d40-num-val">
        {count}
        <span>{suffix}</span>
      </div>
      <div className="d40-num-label">{label}</div>
    </div>
  );
}

/* ─── fade-in wrapper ───────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 28 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── main component ────────────────────────────────────────── */
export default function Page40() {
  const reduced = useReducedMotion();

  /* scroll progress */
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  /* strip scroll offset */
  const stripRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const stripX = useTransform(scrollY, [0, 3000], [0, -300]);

  const services = [
    {
      name: "AI Systems & Workflow Automation",
      desc: "End-to-end n8n pipelines that kill repetitive ops — lead capture, follow-up, reporting, client onboarding — without a single extra hire.",
      tag: "n8n / Make / Zapier",
    },
    {
      name: "Voice & WhatsApp AI Bots",
      desc: "24/7 conversational agents that book appointments, qualify leads, and answer calls — while you sleep.",
      tag: "VAPI / Twilio / WhatsApp API",
    },
    {
      name: "AEO & AI Visibility",
      desc: "Structured data, semantic content, and schema that gets your brand cited in ChatGPT, Perplexity, and Google AI overviews.",
      tag: "AEO / Schema / GEO",
    },
    {
      name: "Next.js Product Builds",
      desc: "Fast, SEO-clean web products — landing pages, SaaS dashboards, client portals — deployed and monitored.",
      tag: "Next.js / TypeScript / Vercel",
    },
    {
      name: "Funnel & Conversion Systems",
      desc: "Stripe-integrated funnels, email sequences, and tracking stacks. Not pretty mockups — shipping revenue.",
      tag: "Stripe / GHL / Vercel",
    },
  ];

  const workImages = [
    {
      src: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
      label: "Bali / System build",
    },
    {
      src: "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
      label: "SkynetLabs",
    },
    {
      src: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
      label: "Analytics dashboard",
    },
    {
      src: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
      label: "Remote / Nusa Penida",
    },
    {
      src: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
      label: "Client delivery",
    },
    {
      src: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
      label: "Client meetup",
    },
  ];

  const stripImages = [
    "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
    "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
    "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
    "TRAVEL-2025-05-17-beach-arms-spread-laughing-camera.jpg",
    "CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg",
    "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    "SCENERY-2026-05-24-green-valley-hills-cloud-pano.jpg",
    "CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg",
  ];

  return (
    <>
      <style>{STYLES}</style>

      {/* skip nav */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          top: -60,
          left: 0,
          background: "#4F46E5",
          color: "#fff",
          padding: "8px 16px",
          zIndex: 999,
          fontSize: "0.85rem",
          textDecoration: "none",
          transition: "top 0.2s",
        }}
        onFocus={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.top = "0")
        }
        onBlur={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.top = "-60px")
        }
      >
        Skip to content
      </a>

      {/* scroll progress rail */}
      <motion.div className="d40-progress" style={{ width: progressWidth }} />

      <div
        className="d40"
        style={{
          position: "relative",
          minHeight: "100vh",
          zIndex: 2,
          background: "#F7F6F3",
        }}
      >
        {/* ── nav ── */}
        <nav className="d40-nav" aria-label="Primary navigation">
          <a href="#main-content" className="d40-nav-logo">
            Waseem Nasir
          </a>
          <ul className="d40-nav-links" role="list">
            <li>
              <a href="#services">Work</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="d40-cta"
            style={{ padding: "10px 20px", fontSize: "0.8rem" }}
          >
            Book a call <span className="d40-cta-arrow">→</span>
          </a>
        </nav>

        {/* ── hero ── */}
        <main id="main-content">
          <div style={{ position: "relative", overflow: "hidden" }}>
            {/* mesh corner orb */}
            <div className="d40-mesh-orb" aria-hidden="true" />

            <section
              className="d40-section d40-hero"
              aria-labelledby="hero-heading"
            >
              <FadeUp delay={0.05}>
                <div className="d40-hero-tag">
                  SkynetLabs · AI Systems · Est. 2019
                </div>
              </FadeUp>

              <FadeUp delay={0.15}>
                <h1 className="d40-h1" id="hero-heading">
                  Fewer tools.
                  <br />
                  Less busywork.
                  <br />
                  <em>More revenue.</em>
                </h1>
              </FadeUp>

              <FadeUp delay={0.25}>
                <p className="d40-hero-sub">
                  I build AI and automation systems that replace the manual
                  grind — missed leads, dead follow-ups, broken ops.{" "}
                  <strong>Ships in days, not quarters.</strong>
                </p>
              </FadeUp>

              <FadeUp delay={0.35}>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="d40-cta"
                  aria-label="Book a 30-minute discovery call with Waseem Nasir"
                >
                  Book a 30-min call
                  <span className="d40-cta-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </FadeUp>

              <FadeUp delay={0.45}>
                <p className="d40-scroll-hint" aria-hidden="true">
                  Scroll to explore
                </p>
              </FadeUp>
            </section>
          </div>

          {/* ── numbers ── */}
          <section className="d40-section" aria-label="Proof numbers">
            <div className="d40-numbers">
              <StatCard value={180} suffix="+" label="builds shipped" />
              <StatCard value={40} suffix="+" label="clients served" />
              <StatCard value={9} suffix="" label="countries worked from" />
              <StatCard value={2019} suffix="" label="operating since" />
            </div>
          </section>

          {/* ── services ── */}
          <section
            id="services"
            className="d40-section d40-services"
            aria-labelledby="services-heading"
          >
            <div className="d40-section-label">What I build</div>
            <FadeUp>
              <h2
                id="services-heading"
                className="d40-display"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#16151A",
                  marginBottom: 48,
                }}
              >
                Systems that compound. Not sprints that stall.
              </h2>
            </FadeUp>
            <div className="d40-service-list" role="list">
              {services.map((s, i) => (
                <FadeUp key={s.name} delay={i * 0.07}>
                  <div className="d40-service-row" role="listitem">
                    <div>
                      <h3 className="d40-service-name">{s.name}</h3>
                      <p className="d40-service-desc">{s.desc}</p>
                    </div>
                    <div className="d40-service-tag">{s.tag}</div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>

          {/* ── voice pull quote ── */}
          <section className="d40-section d40-voice" aria-label="Philosophy">
            <FadeUp>
              <blockquote className="d40-pull-quote">
                "Most clients hire me after losing 6 months to tools that
                promised automation but delivered <em>administration.</em>"
              </blockquote>
              <p className="d40-pull-attr">— Waseem Nasir, SkynetLabs</p>
            </FadeUp>
          </section>

          {/* ── selected work photos ── */}
          <section
            className="d40-section d40-work"
            aria-labelledby="work-heading"
          >
            <div className="d40-section-label">Selected work</div>
            <FadeUp>
              <h2
                id="work-heading"
                className="d40-display"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#16151A",
                  marginBottom: 0,
                }}
              >
                Remote. Focused. Shipped.
              </h2>
            </FadeUp>
            <div className="d40-work-grid" role="list">
              {workImages.map((img, i) => (
                <motion.div
                  key={img.src}
                  className="d40-work-cell"
                  role="listitem"
                  initial={
                    reduced ? { opacity: 1 } : { opacity: 0, scale: 0.96 }
                  }
                  whileInView={
                    reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }
                  }
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <img
                    src={`/img/pro/${img.src}`}
                    alt={`Waseem Nasir — ${img.label}`}
                    loading="lazy"
                  />
                  <div className="d40-work-cell-overlay" aria-hidden="true">
                    <span className="d40-work-cell-label">{img.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── photo strip (parallax) ── */}
          <div className="d40-strip" aria-hidden="true">
            <motion.div
              className="d40-strip-inner"
              style={reduced ? {} : { x: stripX }}
              ref={stripRef}
            >
              {[...stripImages, ...stripImages].map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={`/img/pro/${src}`}
                  alt=""
                  className="d40-strip-img"
                  loading="lazy"
                />
              ))}
            </motion.div>
          </div>

          {/* ── about ── */}
          <section
            id="about"
            className="d40-section d40-about"
            aria-labelledby="about-heading"
          >
            <div className="d40-section-label">About</div>
            <div className="d40-about-grid">
              <div className="d40-about-text">
                <FadeUp>
                  <h2 id="about-heading">
                    Independent founder.
                    <br />
                    No retainers. No bloat.
                  </h2>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <p>
                    I'm <strong>Waseem Nasir</strong> — founder of SkynetLabs.
                    Since 2019 I've shipped <strong>180+ builds</strong> for 40+
                    clients across 9 countries, mostly solo or with a tight-knit
                    remote crew.
                  </p>
                </FadeUp>
                <FadeUp delay={0.15}>
                  <p>
                    My systems run on{" "}
                    <strong>n8n, Next.js, VAPI, and WhatsApp APIs</strong> —
                    practical stacks that ship fast and break rarely. I don't
                    upsell complexity. If something can be automated, it gets
                    automated.
                  </p>
                </FadeUp>
                <FadeUp delay={0.2}>
                  <p>
                    Currently based between <strong>Bali and Lahore.</strong>{" "}
                    Remote-first by design — my best client relationships are
                    fully async.
                  </p>
                </FadeUp>
                <FadeUp delay={0.25}>
                  <div className="d40-about-links">
                    <a
                      href="https://github.com/waseemnasir2k26"
                      className="d40-about-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      github.com/waseemnasir2k26
                    </a>
                    <a
                      href="https://skynetjoe.com"
                      className="d40-about-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      skynetjoe.com
                    </a>
                  </div>
                </FadeUp>
              </div>

              <FadeUp delay={0.1}>
                <div className="d40-about-img-wrap">
                  <img
                    src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                    alt="Waseem Nasir, founder of SkynetLabs, standing on a balcony"
                    className="d40-about-img"
                  />
                  <div className="d40-about-img-badge">
                    Bali · Lahore · Remote
                  </div>
                </div>
              </FadeUp>
            </div>
          </section>

          {/* ── location strip ── */}
          <section className="d40-section" aria-label="Operating details">
            <div className="d40-location">
              {[
                { label: "Status", val: "Available for projects" },
                { label: "Base", val: "Bali / Lahore" },
                { label: "Response", val: "< 24 hours" },
                { label: "Timezone", val: "UTC+5 / UTC+8" },
              ].map((item) => (
                <div className="d40-location-item" key={item.label}>
                  <span className="d40-location-label">{item.label}</span>
                  <span className="d40-location-val">{item.val}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA section ── */}
          <section
            id="contact"
            className="d40-section d40-cta-section"
            aria-labelledby="cta-heading"
          >
            <div style={{ position: "relative" }}>
              {/* second mesh orb — bottom left for balance */}
              <div
                className="d40-mesh-orb"
                aria-hidden="true"
                style={{
                  top: "auto",
                  right: "auto",
                  bottom: -80,
                  left: -120,
                  background:
                    "radial-gradient(ellipse at 40% 60%, rgba(244,114,182,0.15) 0%, rgba(79,70,229,0.1) 45%, rgba(247,246,243,0) 75%)",
                }}
              />
              <FadeUp>
                <h2 id="cta-heading">
                  One call.
                  <br />
                  <em>Clear plan.</em>
                </h2>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p>
                  30 minutes. We map your biggest operational bottleneck and
                  whether automation solves it. No pitch deck. No upsell.
                </p>
              </FadeUp>
              <FadeUp delay={0.2}>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="d40-cta"
                  style={{ fontSize: "1rem", padding: "16px 32px" }}
                  aria-label="Book your 30-minute discovery call with Waseem Nasir"
                >
                  Book a free 30-min call
                  <span className="d40-cta-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </FadeUp>
            </div>
          </section>

          {/* ── footer ── */}
          <footer className="d40-section d40-footer" role="contentinfo">
            <span className="d40-footer-name">Waseem Nasir</span>
            <div className="d40-footer-right">
              <a
                href="https://github.com/waseemnasir2k26"
                className="d40-footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://skynetjoe.com"
                className="d40-footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                SkynetLabs
              </a>
              <span className="d40-footer-copy">
                © {new Date().getFullYear()}
              </span>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
