"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/* ─── scoped font + reset ─────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

.root-04 *,
.root-04 *::before,
.root-04 *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.root-04 {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #171717;
  background: #FAFAFA;
  -webkit-font-smoothing: antialiased;
}

/* hairline grid overlay */
.root-04 .grid-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(rgba(10,10,10,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(10,10,10,0.04) 1px, transparent 1px);
  background-size: 64px 64px;
}

/* crosshair cursor helper */
.root-04 .crosshair-dot {
  position: fixed;
  width: 12px;
  height: 12px;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: multiply;
  transform: translate(-50%, -50%);
}
.root-04 .crosshair-dot::before,
.root-04 .crosshair-dot::after {
  content: '';
  position: absolute;
  background: #0070F3;
}
.root-04 .crosshair-dot::before {
  width: 1px;
  height: 12px;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}
.root-04 .crosshair-dot::after {
  width: 12px;
  height: 1px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

/* scroll progress */
.root-04 .progress-rail {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: #0070F3;
  transform-origin: left;
  z-index: 100;
}

/* layout */
.root-04 .wrap {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;
}

/* nav */
.root-04 nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(250,250,250,0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(23,23,23,0.08);
}
.root-04 .nav-inner {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.root-04 .nav-mark {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: #171717;
  text-decoration: none;
}
.root-04 .nav-links {
  display: flex;
  gap: 28px;
  list-style: none;
}
.root-04 .nav-links a {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: #9B9B9B;
  text-decoration: none;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 2px;
  transition: color 120ms ease;
}
.root-04 .nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #171717;
  transition: width 120ms ease;
}
.root-04 .nav-links a:hover {
  color: #171717;
}
.root-04 .nav-links a:hover::after {
  width: 100%;
}
.root-04 .nav-links a:focus-visible {
  outline: 2px solid #0070F3;
  outline-offset: 3px;
  border-radius: 2px;
}

/* section label */
.root-04 .section-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: #9B9B9B;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}
.root-04 .section-label .lnum {
  color: #0070F3;
}
.root-04 .section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(23,23,23,0.1);
}

/* divider */
.root-04 .divider {
  height: 1px;
  background: rgba(23,23,23,0.08);
  margin: 0;
}

/* sections */
.root-04 section {
  padding: 80px 0;
}

/* hero */
.root-04 .hero {
  padding: 140px 0 80px;
}
.root-04 .hero-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.14em;
  color: #9B9B9B;
  text-transform: uppercase;
  margin-bottom: 20px;
}
.root-04 .hero-h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.12;
  color: #171717;
  margin-bottom: 20px;
  max-width: 620px;
}
.root-04 .hero-sub {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #9B9B9B;
  max-width: 480px;
  line-height: 1.65;
  margin-bottom: 36px;
}
.root-04 .cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #FAFAFA;
  background: #0A0A0A;
  padding: 11px 20px;
  text-decoration: none;
  border: 1px solid #0A0A0A;
  position: relative;
  transition: background 120ms ease, color 120ms ease;
}
.root-04 .cta-primary:hover {
  background: #0070F3;
  border-color: #0070F3;
}
.root-04 .cta-primary:focus-visible {
  outline: 2px solid #0070F3;
  outline-offset: 3px;
}
.root-04 .cta-arrow {
  font-size: 14px;
  line-height: 1;
}

/* stat grid */
.root-04 .stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid rgba(23,23,23,0.1);
  margin-top: 40px;
}
@media (max-width: 600px) {
  .root-04 .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.root-04 .stat-cell {
  padding: 24px 20px;
  border-right: 1px solid rgba(23,23,23,0.1);
  background: #FFFFFF;
}
.root-04 .stat-cell:last-child {
  border-right: none;
}
@media (max-width: 600px) {
  .root-04 .stat-cell:nth-child(2) {
    border-right: none;
  }
  .root-04 .stat-cell:nth-child(3),
  .root-04 .stat-cell:nth-child(4) {
    border-top: 1px solid rgba(23,23,23,0.1);
  }
  .root-04 .stat-cell:nth-child(4) {
    border-right: none;
  }
}
.root-04 .stat-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 28px;
  font-weight: 500;
  color: #171717;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 6px;
  display: flex;
  align-items: baseline;
  gap: 2px;
}
.root-04 .stat-suffix {
  font-size: 16px;
  color: #0070F3;
}
.root-04 .stat-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9B9B9B;
}

/* service rows */
.root-04 .service-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0;
  border: 1px solid rgba(23,23,23,0.1);
  margin-bottom: -1px;
  background: #FFFFFF;
  padding: 24px 20px;
  align-items: start;
  transition: background 120ms ease;
}
.root-04 .service-row:hover {
  background: #FAFAFA;
}
.root-04 .service-row:focus-within {
  outline: 2px solid #0070F3;
  outline-offset: -2px;
}
.root-04 .service-index {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  color: #0070F3;
  letter-spacing: 0.06em;
  padding-top: 2px;
}
.root-04 .service-body {}
.root-04 .service-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #171717;
  letter-spacing: -0.01em;
  margin-bottom: 6px;
}
.root-04 .service-desc {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #9B9B9B;
  line-height: 1.6;
}
.root-04 .service-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}
.root-04 .service-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9B9B9B;
  border: 1px solid rgba(23,23,23,0.1);
  padding: 3px 7px;
  background: #FAFAFA;
}

/* work grid */
.root-04 .work-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgba(23,23,23,0.1);
  border: 1px solid rgba(23,23,23,0.1);
}
@media (max-width: 560px) {
  .root-04 .work-grid {
    grid-template-columns: 1fr;
  }
}
.root-04 .work-card {
  background: #FFFFFF;
  overflow: hidden;
  position: relative;
}
.root-04 .work-card-img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
  filter: grayscale(20%);
  transition: filter 180ms ease, transform 180ms ease;
}
.root-04 .work-card:hover .work-card-img {
  filter: grayscale(0%);
  transform: scale(1.01);
}
.root-04 .work-card-meta {
  padding: 14px 16px;
  border-top: 1px solid rgba(23,23,23,0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.root-04 .work-card-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #171717;
}
.root-04 .work-card-loc {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9B9B9B;
}

/* about */
.root-04 .about-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 40px;
  align-items: start;
}
@media (max-width: 580px) {
  .root-04 .about-grid {
    grid-template-columns: 1fr;
  }
}
.root-04 .about-portrait {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
  filter: grayscale(15%);
  border: 1px solid rgba(23,23,23,0.1);
}
.root-04 .about-text-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.root-04 .about-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #171717;
}
.root-04 .about-role {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0070F3;
}
.root-04 .about-bio {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #9B9B9B;
  line-height: 1.7;
  max-width: 400px;
}
.root-04 .about-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.root-04 .about-link-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: #9B9B9B;
}
.root-04 .about-link-row a {
  color: #171717;
  text-decoration: none;
  position: relative;
  padding-bottom: 1px;
}
.root-04 .about-link-row a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #0070F3;
  transition: width 120ms ease;
}
.root-04 .about-link-row a:hover::after { width: 100%; }
.root-04 .about-link-row a:focus-visible {
  outline: 2px solid #0070F3;
  outline-offset: 2px;
}

/* field set — contact area */
.root-04 .field-table {
  display: grid;
  grid-template-columns: 120px 1fr;
  border: 1px solid rgba(23,23,23,0.1);
  background: #FFFFFF;
  margin-bottom: 24px;
}
.root-04 .field-row {
  display: contents;
}
.root-04 .field-key,
.root-04 .field-val {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(23,23,23,0.08);
  font-size: 12px;
  line-height: 1.5;
}
.root-04 .field-key {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9B9B9B;
  border-right: 1px solid rgba(23,23,23,0.08);
  background: #FAFAFA;
}
.root-04 .field-val {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #171717;
}
.root-04 .field-val a {
  color: #0070F3;
  text-decoration: none;
  position: relative;
  padding-bottom: 1px;
}
.root-04 .field-val a::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; width: 0; height: 1px;
  background: #0070F3;
  transition: width 120ms ease;
}
.root-04 .field-val a:hover::after { width: 100%; }
.root-04 .field-val a:focus-visible {
  outline: 2px solid #0070F3;
  outline-offset: 2px;
}
.root-04 .field-row:last-child .field-key,
.root-04 .field-row:last-child .field-val {
  border-bottom: none;
}

/* proof strip images */
.root-04 .proof-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: rgba(23,23,23,0.08);
  border: 1px solid rgba(23,23,23,0.08);
  margin-top: 40px;
  overflow: hidden;
}
@media (max-width: 560px) {
  .root-04 .proof-strip {
    grid-template-columns: repeat(2, 1fr);
  }
}
.root-04 .proof-strip-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
  filter: grayscale(30%);
  transition: filter 180ms ease;
}
.root-04 .proof-strip-img:hover {
  filter: grayscale(0%);
}

/* footer */
.root-04 footer {
  border-top: 1px solid rgba(23,23,23,0.08);
  padding: 24px 0;
}
.root-04 .footer-inner {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.root-04 .footer-copy {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9B9B9B;
}
.root-04 .footer-badge {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: #171717;
  border: 1px solid rgba(23,23,23,0.12);
  padding: 4px 8px;
  background: #FFFFFF;
}

/* reduced motion */
@media (prefers-reduced-motion: reduce) {
  .root-04 * {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
`;

/* ─── count-up hook ───────────────────────────────────────────────── */
function useCountUp(target: number, duration: number, trigger: boolean) {
  const [val, setVal] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!trigger) return;
    if (reduced) {
      setVal(target);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration, reduced]);

  return val;
}

/* ─── stat cell ──────────────────────────────────────────────────── */
function StatCell({
  target,
  suffix,
  label,
  inView,
}: {
  target: number;
  suffix: string;
  label: string;
  inView: boolean;
}) {
  const n = useCountUp(target, 1.4, inView);
  return (
    <div className="stat-cell">
      <div className="stat-num">
        <span>{n}</span>
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ─── crosshair component ────────────────────────────────────────── */
function Crosshair() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [reduced]);

  if (reduced) return null;
  return <div ref={ref} className="crosshair-dot" aria-hidden="true" />;
}

/* ─── progress rail ──────────────────────────────────────────────── */
function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <motion.div
      className="progress-rail"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

/* ─── services data ──────────────────────────────────────────────── */
const SERVICES = [
  {
    title: "AI Automation Systems",
    desc: "n8n-native pipelines that eliminate the manual layer — lead capture, follow-up, triage, escalation. Runs while you sleep.",
    tags: ["n8n", "Webhooks", "LLM routing", "Zapier migration"],
  },
  {
    title: "WhatsApp & Voice Bots",
    desc: "AI receptionists that qualify inbound, book discovery calls, and hand off to humans only when stakes are high.",
    tags: ["WhatsApp API", "Twilio", "GPT-4o", "Calendly"],
  },
  {
    title: "Next.js Product Builds",
    desc: "Full-stack shipping from Figma to prod — Next 14, Vercel edge, Auth, Postgres. Spec-to-live in days, not sprints.",
    tags: ["Next.js 14", "TypeScript", "Vercel", "Postgres"],
  },
  {
    title: "AEO & AI Visibility",
    desc: "Structured data and content architecture tuned for AI answer engines — so ChatGPT, Perplexity and Gemini cite you first.",
    tags: ["Schema.org", "FAQ clusters", "Wikidata", "Semantic SEO"],
  },
];

/* ─── work entries ───────────────────────────────────────────────── */
const WORK = [
  {
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    title: "Analytics Dashboard",
    loc: "Remote / Bali",
    alt: "Waseem working on dual-screen analytics dashboard setup in cafe",
  },
  {
    img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
    title: "Client Session",
    loc: "Indonesia",
    alt: "Waseem with client, both smiling and giving thumbs up",
  },
  {
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    title: "Bali Build Sprint",
    loc: "Canggu, Bali",
    alt: "Waseem typing on laptop at Bali terrace with latte and sunglasses",
  },
  {
    img: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
    title: "Cowork Session",
    loc: "Night / Remote",
    alt: "Waseem and team at night coworking session with laptops",
  },
];

/* ─── proof strip images ─────────────────────────────────────────── */
const PROOF_IMGS = [
  {
    src: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
    alt: "Waseem at Nusa Penida cliffs, arms spread wide",
  },
  {
    src: "TRAVEL-google-office-sign-cream-outfit.jpg",
    alt: "Waseem at Google office sign in cream outfit",
  },
  {
    src: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
    alt: "Group coworking meetup at Bali cafe",
  },
  {
    src: "TRAVEL-sentosa-sign-hedge-cream-set.jpg",
    alt: "Waseem at Sentosa sign in Singapore",
  },
];

/* ─── component ──────────────────────────────────────────────────── */
export default function Design04() {
  const reduced = useReducedMotion();

  /* inView for stat count-up */
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* fade-in helper */
  const fadeUp = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay },
        };

  return (
    <div className="root-04">
      <style>{STYLES}</style>

      {/* grid bg */}
      <div className="grid-bg" aria-hidden="true" />

      {/* cursor crosshair */}
      <Crosshair />

      {/* scroll progress */}
      <ProgressRail />

      {/* skip link */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          zIndex: 9999,
          background: "#0070F3",
          color: "#fff",
          padding: "8px 16px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px",
        }}
        onFocus={(e) => {
          (e.target as HTMLAnchorElement).style.left = "16px";
        }}
        onBlur={(e) => {
          (e.target as HTMLAnchorElement).style.left = "-9999px";
        }}
      >
        Skip to content
      </a>

      {/* nav */}
      <nav aria-label="Primary navigation">
        <div className="nav-inner">
          <a href="#main-content" className="nav-mark">
            WN / SKYNETLABS
          </a>
          <ul className="nav-links">
            <li>
              <a href="#work">Work</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a
                href="https://skynetjoe.com/discovery-call"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book call
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* main */}
      <main id="main-content">
        {/* ── HERO ── */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="wrap">
            <motion.p className="hero-eyebrow" {...fadeUp(0)}>
              WASEEMNASIR — SKYNETLABS — EST. 2019
            </motion.p>
            <motion.h1 id="hero-heading" className="hero-h1" {...fadeUp(0.05)}>
              Founder. Operator.
              <br />I ship AI systems
              <br />
              that pay for themselves.
            </motion.h1>
            <motion.p className="hero-sub" {...fadeUp(0.1)}>
              n8n pipelines, WhatsApp bots, Next.js products. Built for
              operators who measure ROI in hours-killed, not impressions earned.
            </motion.p>
            <motion.div {...fadeUp(0.15)}>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="cta-primary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book a 30-minute discovery call with Waseem"
              >
                <span>Book 30-min call</span>
                <span className="cta-arrow" aria-hidden="true">
                  &#8594;
                </span>
              </a>
            </motion.div>

            {/* stat grid */}
            <div
              ref={statsRef}
              className="stat-grid"
              role="list"
              aria-label="Key statistics"
            >
              <div role="listitem">
                <StatCell
                  target={180}
                  suffix="+"
                  label="Builds shipped"
                  inView={statsVisible}
                />
              </div>
              <div role="listitem">
                <StatCell
                  target={40}
                  suffix="+"
                  label="Clients served"
                  inView={statsVisible}
                />
              </div>
              <div role="listitem">
                <StatCell
                  target={9}
                  suffix=""
                  label="Countries worked"
                  inView={statsVisible}
                />
              </div>
              <div role="listitem">
                <StatCell
                  target={2019}
                  suffix=""
                  label="Year founded"
                  inView={statsVisible}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── WORK ── */}
        <section id="work" aria-labelledby="work-heading">
          <div className="wrap">
            <div className="section-label">
              <span className="lnum">01</span>
              <span id="work-heading">SELECTED WORK</span>
            </div>
            <motion.div className="work-grid" {...fadeUp(0)}>
              {WORK.map((w) => (
                <div key={w.img} className="work-card">
                  <img
                    src={`/img/pro/${w.img}`}
                    alt={w.alt}
                    className="work-card-img"
                    loading="lazy"
                  />
                  <div className="work-card-meta">
                    <span className="work-card-title">{w.title}</span>
                    <span className="work-card-loc">{w.loc}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* proof strip */}
            <div
              className="proof-strip"
              aria-label="Proof photos from various locations"
            >
              {PROOF_IMGS.map((p) => (
                <img
                  key={p.src}
                  src={`/img/pro/${p.src}`}
                  alt={p.alt}
                  className="proof-strip-img"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── SERVICES ── */}
        <section id="services" aria-labelledby="services-heading">
          <div className="wrap">
            <div className="section-label">
              <span className="lnum">02</span>
              <span id="services-heading">WHAT I BUILD</span>
            </div>
            <div role="list">
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.title}
                  className="service-row"
                  role="listitem"
                  {...fadeUp(i * 0.05)}
                >
                  <div className="service-index">0{i + 1}</div>
                  <div className="service-body">
                    <div className="service-title">{s.title}</div>
                    <div className="service-desc">{s.desc}</div>
                    <div className="service-tags">
                      {s.tags.map((t) => (
                        <span key={t} className="service-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── ABOUT ── */}
        <section id="about" aria-labelledby="about-heading">
          <div className="wrap">
            <div className="section-label">
              <span className="lnum">03</span>
              <span id="about-heading">OPERATOR PROFILE</span>
            </div>
            <motion.div className="about-grid" {...fadeUp(0)}>
              <img
                src="/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg"
                alt="Waseem Nasir — founder of SkynetLabs, smiling in black kurta against wood interior"
                className="about-portrait"
                loading="lazy"
              />
              <div className="about-text-block">
                <div>
                  <div className="about-role">
                    Independent founder / AI systems
                  </div>
                  <h2 className="about-name">Waseem Nasir</h2>
                </div>
                <p className="about-bio">
                  Independent operator building AI automation since 2019. I take
                  on work that removes bottlenecks — missed leads, manual ops,
                  broken follow-ups — and replace them with systems that run
                  without babysitting.
                </p>
                <p className="about-bio">
                  180+ builds across 40+ clients in 9 countries. Remote from
                  Bali and Lahore. No agency overhead — you talk to the person
                  who ships the work.
                </p>
                <div className="about-links">
                  <div className="about-link-row">
                    <span>GH /</span>
                    <a
                      href="https://github.com/waseemnasir2k26"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      github.com/waseemnasir2k26
                    </a>
                  </div>
                  <div className="about-link-row">
                    <span>WEB /</span>
                    <a
                      href="https://skynetjoe.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      skynetjoe.com
                    </a>
                  </div>
                  <div className="about-link-row">
                    <span>BASE /</span>
                    <span
                      style={{
                        color: "#171717",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "10px",
                      }}
                    >
                      Bali, Indonesia · Lahore, Pakistan
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="divider" />

        {/* ── FIELD PHOTOS — extra images in spec-sheet format ── */}
        <section aria-labelledby="field-heading">
          <div className="wrap">
            <div className="section-label">
              <span className="lnum">04</span>
              <span id="field-heading">FIELD LOG</span>
            </div>
            <motion.div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1px",
                background: "rgba(23,23,23,0.08)",
                border: "1px solid rgba(23,23,23,0.08)",
                overflow: "hidden",
              }}
              {...fadeUp(0)}
            >
              {[
                {
                  src: "CAFE-WORK-2026-02-27-smiling-headphones-neon-tea-sign-closeup.jpg",
                  alt: "Waseem smiling with headphones near neon tea sign",
                },
                {
                  src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                  alt: "Waseem on hilltop with backpack and city vista",
                },
                {
                  src: "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
                  alt: "Waseem standing by neon limit quote sign in black outfit",
                },
              ].map((img) => (
                <img
                  key={img.src}
                  src={`/img/pro/${img.src}`}
                  alt={img.alt}
                  loading="lazy"
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    display: "block",
                    filter: "grayscale(20%)",
                    transition: "filter 180ms ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLImageElement).style.filter =
                      "grayscale(0%)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLImageElement).style.filter =
                      "grayscale(20%)";
                  }}
                />
              ))}
            </motion.div>
          </div>
        </section>

        <div className="divider" />

        {/* ── CONTACT / CTA ── */}
        <section id="contact" aria-labelledby="contact-heading">
          <div className="wrap">
            <div className="section-label">
              <span className="lnum">05</span>
              <span id="contact-heading">CONTACT</span>
            </div>

            <motion.div {...fadeUp(0)}>
              <div
                className="field-table"
                role="table"
                aria-label="Contact information"
              >
                <div className="field-row" role="row">
                  <div className="field-key" role="rowheader">
                    Status
                  </div>
                  <div className="field-val" role="cell">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: "#0070F3",
                          display: "inline-block",
                        }}
                        aria-hidden="true"
                      />
                      Available for new projects
                    </span>
                  </div>
                </div>
                <div className="field-row" role="row">
                  <div className="field-key" role="rowheader">
                    Response
                  </div>
                  <div className="field-val" role="cell">
                    Within 24h on business days
                  </div>
                </div>
                <div className="field-row" role="row">
                  <div className="field-key" role="rowheader">
                    Location
                  </div>
                  <div className="field-val" role="cell">
                    Bali, Indonesia · Lahore, Pakistan · Remote-first
                  </div>
                </div>
                <div className="field-row" role="row">
                  <div className="field-key" role="rowheader">
                    GitHub
                  </div>
                  <div className="field-val" role="cell">
                    <a
                      href="https://github.com/waseemnasir2k26"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      github.com/waseemnasir2k26
                    </a>
                  </div>
                </div>
                <div className="field-row" role="row">
                  <div className="field-key" role="rowheader">
                    Book call
                  </div>
                  <div className="field-val" role="cell">
                    <a
                      href="https://skynetjoe.com/discovery-call"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      skynetjoe.com/discovery-call
                    </a>
                  </div>
                </div>
              </div>

              <a
                href="https://skynetjoe.com/discovery-call"
                className="cta-primary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book a 30-minute discovery call — opens skynetjoe.com"
              >
                <span>Schedule 30-min discovery call</span>
                <span className="cta-arrow" aria-hidden="true">
                  &#8594;
                </span>
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer>
        <div className="footer-inner">
          <span className="footer-copy">
            &copy; 2019&#8211;{new Date().getFullYear()} SkynetLabs / Waseem
            Nasir
          </span>
          <span className="footer-badge">D-04 / MONO-GRID MINIMALIST</span>
        </div>
      </footer>
    </div>
  );
}
