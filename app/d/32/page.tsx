"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

/* ─── font + scoped styles ─────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=Space+Mono:wght@400&display=swap');

.r32 {
  font-family: 'Inter', sans-serif;
  background: #000000;
  color: #FFFFFF;
  overflow-x: hidden;
  position: relative;
  z-index: 2;
}

.r32 * { box-sizing: border-box; margin: 0; padding: 0; }

.r32-display { font-family: 'Space Grotesk', sans-serif; }
.r32-mono    { font-family: 'Space Mono', monospace; }

/* scroll track */
.r32-progress-rail {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 2px;
  background: #111;
  z-index: 999;
}
.r32-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00E5C7, #9A6BFF);
  transform-origin: left;
  box-shadow: 0 0 12px 2px #00E5C799;
}

/* scan-line laser overlay */
.r32-scanline {
  pointer-events: none;
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #00E5C7 50%, transparent 100%);
  box-shadow: 0 0 24px 6px #00E5C755;
  z-index: 998;
  transition: top 0.05s linear;
}

/* hero */
.r32-hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 6vw 8vh;
  position: relative;
}

.r32-hero-eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: clamp(10px, 1.1vw, 13px);
  letter-spacing: 0.18em;
  color: #555555;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.r32-hero-h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(42px, 7.5vw, 120px);
  font-weight: 700;
  line-height: 0.92;
  letter-spacing: -0.03em;
  max-width: 900px;
  color: #FFFFFF;
}

.r32-hero-h1 em {
  font-style: normal;
  color: #00E5C7;
}

.r32-hero-sub {
  font-family: 'Inter', sans-serif;
  font-size: clamp(13px, 1.3vw, 17px);
  color: #555555;
  margin-top: 2.5rem;
  letter-spacing: 0.02em;
}

.r32-hero-sub span {
  color: #FFFFFF;
}

.r32-hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 3.5rem;
  padding: 14px 28px;
  border: 1px solid #00E5C7;
  color: #00E5C7;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.06em;
  text-decoration: none;
  text-transform: uppercase;
  transition: background 0.25s, color 0.25s;
}
.r32-hero-cta:hover {
  background: #00E5C7;
  color: #000;
}
.r32-hero-cta:focus-visible {
  outline: 2px solid #00E5C7;
  outline-offset: 3px;
}

.r32-hero-corner {
  position: absolute;
  top: 8vh;
  right: 6vw;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #333;
  text-align: right;
  line-height: 1.8;
}

/* stats bar */
.r32-stats {
  border-top: 1px solid #111;
  border-bottom: 1px solid #111;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0 6vw;
}

.r32-stat {
  padding: 3.5rem 0;
  border-right: 1px solid #111;
}
.r32-stat:last-child { border-right: none; }
.r32-stat:not(:first-child) { padding-left: 3rem; }

.r32-stat-num {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(36px, 4.5vw, 64px);
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1;
}
.r32-stat-num span { color: #00E5C7; }

.r32-stat-label {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #555555;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 0.6rem;
}

/* horizontal filmstrip section */
.r32-strip-outer {
  position: relative;
}

.r32-strip-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.r32-strip-label {
  position: absolute;
  top: 3.5rem;
  left: 6vw;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #555555;
  text-transform: uppercase;
  z-index: 10;
}

.r32-strip-counter {
  position: absolute;
  top: 3.5rem;
  right: 6vw;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #333;
  z-index: 10;
}

.r32-strip-track {
  display: flex;
  gap: 3px;
  padding: 0 6vw;
  will-change: transform;
}

.r32-card {
  flex: 0 0 auto;
  width: clamp(280px, 35vw, 520px);
  height: clamp(340px, 55vh, 580px);
  position: relative;
  overflow: hidden;
  background: #0D0D0D;
  border: 1px solid #111;
  will-change: transform;
}

.r32-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: brightness(0.55) saturate(0.7);
  transition: filter 0.4s;
}

.r32-card:hover img {
  filter: brightness(0.72) saturate(0.85);
}

.r32-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #000000ee 30%, transparent 70%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
}

.r32-card-tag {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #00E5C7;
  margin-bottom: 0.5rem;
}

.r32-card-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(14px, 1.6vw, 20px);
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
}

.r32-card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #888;
  margin-top: 0.5rem;
  line-height: 1.5;
}

.r32-card-accent-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #00E5C7, #9A6BFF);
  transition: width 0.45s ease;
}
.r32-card:hover .r32-card-accent-bar {
  width: 100%;
}

.r32-card-index {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  color: #333;
  letter-spacing: 0.1em;
}

/* services */
.r32-services {
  padding: 12vh 6vw;
  border-top: 1px solid #111;
}

.r32-section-eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #555555;
  text-transform: uppercase;
  margin-bottom: 4rem;
}

.r32-services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #111;
}

.r32-service-cell {
  background: #000;
  padding: 3rem;
  position: relative;
}

.r32-service-num {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #333;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
}

.r32-service-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(16px, 1.6vw, 22px);
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.r32-service-desc {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #555555;
  line-height: 1.7;
}

.r32-service-accent {
  position: absolute;
  top: 3rem;
  right: 3rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00E5C7;
  opacity: 0.5;
}

/* about */
.r32-about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 80vh;
  border-top: 1px solid #111;
}

.r32-about-img-col {
  position: relative;
  overflow: hidden;
}

.r32-about-img-col img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: brightness(0.7) saturate(0.6);
}

.r32-about-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent 70%, #000 100%);
}

.r32-about-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8vh 6vw;
}

.r32-about-h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(28px, 3.5vw, 52px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
}

.r32-about-h2 em {
  font-style: normal;
  color: #9A6BFF;
}

.r32-about-body {
  font-family: 'Inter', sans-serif;
  font-size: clamp(14px, 1.1vw, 16px);
  color: #888;
  line-height: 1.8;
  max-width: 480px;
}

.r32-about-body p + p { margin-top: 1.2rem; }

.r32-about-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2.5rem;
}

.r32-pill {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #555;
  border: 1px solid #222;
  padding: 6px 14px;
  letter-spacing: 0.08em;
}

/* locations ticker */
.r32-ticker {
  border-top: 1px solid #111;
  border-bottom: 1px solid #111;
  padding: 1.4rem 0;
  overflow: hidden;
  white-space: nowrap;
}

.r32-ticker-inner {
  display: inline-flex;
  gap: 4rem;
  animation: r32-tick 22s linear infinite;
}

@keyframes r32-tick {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.r32-ticker-item {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #333;
  text-transform: uppercase;
}

.r32-ticker-item.accent {
  color: #00E5C7;
}

/* cta / contact */
.r32-cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16vh 6vw;
  text-align: center;
  position: relative;
  border-top: 1px solid #111;
}

.r32-cta-void-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 50% at 50% 50%, #00E5C708 0%, transparent 70%);
  pointer-events: none;
}

.r32-cta-h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(32px, 5.5vw, 80px);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.03em;
  max-width: 700px;
  position: relative;
}

.r32-cta-h2 em {
  font-style: normal;
  color: #00E5C7;
}

.r32-cta-sub {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #555;
  margin-top: 1.8rem;
  position: relative;
}

.r32-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 3.5rem;
  padding: 18px 40px;
  background: #00E5C7;
  color: #000;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.05em;
  text-decoration: none;
  text-transform: uppercase;
  position: relative;
  transition: background 0.2s, box-shadow 0.2s;
}
.r32-cta-btn:hover {
  background: #00FFE0;
  box-shadow: 0 0 40px 8px #00E5C744;
}
.r32-cta-btn:focus-visible {
  outline: 2px solid #00E5C7;
  outline-offset: 3px;
}

.r32-cta-note {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #333;
  margin-top: 1.5rem;
  letter-spacing: 0.1em;
  position: relative;
}

/* footer */
.r32-footer {
  border-top: 1px solid #111;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.5rem 6vw;
  flex-wrap: wrap;
  gap: 1rem;
}

.r32-footer-brand {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.01em;
}

.r32-footer-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.r32-footer-links a {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #333;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.2s;
}
.r32-footer-links a:hover  { color: #00E5C7; }
.r32-footer-links a:focus-visible { outline: 1px solid #00E5C7; outline-offset: 2px; }

.r32-footer-copy {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  color: #333;
  letter-spacing: 0.08em;
}

/* skip link */
.r32-skip {
  position: absolute;
  top: -100px;
  left: 1rem;
  z-index: 9999;
  background: #00E5C7;
  color: #000;
  padding: 8px 16px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  text-decoration: none;
  transition: top 0.2s;
}
.r32-skip:focus { top: 1rem; }

@media (max-width: 900px) {
  .r32-stats {
    grid-template-columns: 1fr 1fr;
  }
  .r32-stat:nth-child(2) { border-right: none; }
  .r32-stat:nth-child(3) { border-right: 1px solid #111; border-top: 1px solid #111; }
  .r32-stat:nth-child(4) { border-right: none; border-top: 1px solid #111; }

  .r32-services-grid {
    grid-template-columns: 1fr;
  }

  .r32-about {
    grid-template-columns: 1fr;
  }
  .r32-about-img-col {
    height: 50vw;
    min-height: 260px;
  }
}

@media (max-width: 600px) {
  .r32-stats {
    grid-template-columns: 1fr 1fr;
  }
  .r32-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .r32-ticker-inner { animation: none; }
}
`;

/* ─── work cards data ───────────────────────────────────────────────────── */
const CARDS = [
  {
    tag: "AI Automation",
    title: "Zero-Lag Lead Capture",
    desc: "n8n pipeline: enquiry → qualify → CRM write → reply. Fully unmanned.",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    idx: "01",
  },
  {
    tag: "WhatsApp Bot",
    title: "24/7 Client Intake",
    desc: "WhatsApp Biz API: books, collects, routes. No staff touched it.",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    idx: "02",
  },
  {
    tag: "Next.js Build",
    title: "Performance-First Site",
    desc: "Core Web Vitals green. Sub-second LCP. Zero layout shift.",
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    idx: "03",
  },
  {
    tag: "Voice AI",
    title: "Receptionist That Never Sleeps",
    desc: "Vapi + Retell integration. Handles calls, books slots, escalates edge cases.",
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    idx: "04",
  },
  {
    tag: "AEO Engine",
    title: "Answer-Engine Optimisation",
    desc: "Structured content re-architecture for ChatGPT + Perplexity citation.",
    img: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
    idx: "05",
  },
  {
    tag: "Freight Ops",
    title: "Trucking Lead System",
    desc: "US + SG dual-geo Meta funnel. Voice + WhatsApp follow-up stack.",
    img: "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
    idx: "06",
  },
  {
    tag: "E-Commerce",
    title: "Stripe Funnel $27 Product",
    desc: "WooCommerce + Stripe. Full checkout. Zero support tickets post-launch.",
    img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
    idx: "07",
  },
  {
    tag: "Email Automation",
    title: "Drip Sequences That Convert",
    desc: "12-touch sequences. Human-voiced copy. 38% avg open rate.",
    img: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
    idx: "08",
  },
  {
    tag: "Global Remote",
    title: "9-Country Delivery Track Record",
    desc: "Same quality from Bali, Lahore, Canggu or Zurich. Time zones are a non-issue.",
    img: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
    idx: "09",
  },
];

const SERVICES = [
  {
    num: "01",
    name: "AI & Automation Systems",
    desc: "n8n, Make, custom APIs. Missed-lead pipelines, follow-up sequences, CRM sync. Built to run without you watching.",
  },
  {
    num: "02",
    name: "Next.js & Web Builds",
    desc: "Performance-first sites and funnels. Green Core Web Vitals as a constraint, not a goal. Stripe, WooCommerce, headless CMS wired in.",
  },
  {
    num: "03",
    name: "WhatsApp & Voice Bots",
    desc: "Conversational intake that books and qualifies without staff. WhatsApp Biz API, Vapi, Retell — whichever fits your stack.",
  },
  {
    num: "04",
    name: "AEO & Structured Content",
    desc: "Answer-engine architecture so ChatGPT, Perplexity and Google AI cite your business by name — not a competitor.",
  },
  {
    num: "05",
    name: "Paid Ads & Funnel Strategy",
    desc: "Meta campaigns with correct learning-event mapping. No vanity metrics. Spend only scales when cost-per-acquisition is proven.",
  },
  {
    num: "06",
    name: "Ops Consulting & Retainers",
    desc: "Ongoing technical partner for founders who want systems that compound — not one-off projects that need re-explaining every time.",
  },
];

const TICKER_ITEMS = [
  { text: "Bali", accent: false },
  { text: "Lahore", accent: false },
  { text: "Singapore", accent: true },
  { text: "USA", accent: false },
  { text: "United Kingdom", accent: false },
  { text: "Germany", accent: false },
  { text: "Australia", accent: true },
  { text: "Canada", accent: false },
  { text: "UAE", accent: false },
  // repeated for seamless loop
  { text: "Bali", accent: false },
  { text: "Lahore", accent: false },
  { text: "Singapore", accent: true },
  { text: "USA", accent: false },
  { text: "United Kingdom", accent: false },
  { text: "Germany", accent: false },
  { text: "Australia", accent: true },
  { text: "Canada", accent: false },
  { text: "UAE", accent: false },
];

/* ─── animated count-up ─────────────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVal(to);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const duration = 1200;
        const step = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          setVal(Math.floor(p * to));
          if (p < 1) requestAnimationFrame(step);
          else setVal(to);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, reduced]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ─── horizontal filmstrip ──────────────────────────────────────────────── */
function FilmStrip() {
  const reduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const TOTAL_CARDS = CARDS.length;
  const scrollHeight = `${100 + TOTAL_CARDS * 36}vh`;

  const { scrollYProgress } = useScroll({ target: outerRef });

  // Measure actual track width on mount so we use pixel values (avoids TS string|number issue)
  const [maxShift, setMaxShift] = useState(0);

  useEffect(() => {
    function measure() {
      if (!trackRef.current) return;
      const trackW = trackRef.current.scrollWidth;
      const vw = window.innerWidth;
      setMaxShift(Math.max(0, trackW - vw + vw * 0.06));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // numeric-only motion values — no string|number union
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -maxShift]);
  const x = useSpring(rawX, { stiffness: 80, damping: 28, mass: 0.8 });

  // Per-card velocity skew
  const velocity = useMotionValue(0);
  const skew = useTransform(velocity, [-800, 0, 800], [-12, 0, 12]);

  useEffect(() => {
    if (reduced) return;
    return x.on("change", () => {
      velocity.set(x.getVelocity() * 0.008);
    });
  }, [x, velocity, reduced]);

  // active card counter (approximate)
  const activeIdx = useTransform(scrollYProgress, [0, 1], [1, TOTAL_CARDS]);
  const [activeDisplay, setActiveDisplay] = useState(1);
  useEffect(
    () => activeIdx.on("change", (v) => setActiveDisplay(Math.round(v))),
    [activeIdx],
  );

  return (
    <div
      ref={outerRef}
      style={{ height: scrollHeight }}
      className="r32-strip-outer"
    >
      <div className="r32-strip-sticky">
        <div className="r32-strip-label">Selected Work</div>
        <div className="r32-strip-counter">
          {String(activeDisplay).padStart(2, "0")} /{" "}
          {String(TOTAL_CARDS).padStart(2, "0")}
        </div>
        <motion.div
          ref={trackRef}
          className="r32-strip-track"
          style={reduced ? {} : { x, skewX: skew }}
        >
          {CARDS.map((card, i) => (
            <motion.div
              key={card.idx}
              className="r32-card"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <img
                src={`/img/pro/${card.img}`}
                alt={card.title}
                loading="lazy"
              />
              <div className="r32-card-overlay">
                <div className="r32-card-tag">{card.tag}</div>
                <div className="r32-card-title">{card.title}</div>
                <div className="r32-card-desc">{card.desc}</div>
              </div>
              <div className="r32-card-index">{card.idx}</div>
              <div className="r32-card-accent-bar" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── scan-line that follows scroll ─────────────────────────────────────── */
function ScanLine({ progress }: { progress: number }) {
  return (
    <div
      className="r32-scanline"
      style={{ top: `${progress * 100}vh` }}
      aria-hidden="true"
    />
  );
}

/* ─── root component ────────────────────────────────────────────────────── */
export default function Design32() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [scanPct, setScanPct] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => setScanPct(v));
  }, [scrollYProgress]);

  const fadeUp = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 32 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
        };

  return (
    <div className="r32">
      <style>{STYLES}</style>

      {/* skip nav */}
      <a href="#main-content" className="r32-skip">
        Skip to content
      </a>

      {/* scroll progress rail */}
      <div className="r32-progress-rail" aria-hidden="true">
        <motion.div className="r32-progress-fill" style={{ scaleX }} />
      </div>

      {/* scan-line laser */}
      {!reduced && <ScanLine progress={scanPct} />}

      <main id="main-content">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="r32-hero" aria-label="Hero">
          <div className="r32-hero-corner">
            <div>Waseem Nasir</div>
            <div>SkynetLabs</div>
            <div>Est. 2019</div>
          </div>

          <motion.p className="r32-hero-eyebrow" {...fadeUp(0.1)}>
            AI Systems · Automation · Web
          </motion.p>

          <motion.h1 className="r32-hero-h1 r32-display" {...fadeUp(0.2)}>
            Scroll the proof.
            <br />
            <em>Forty companies,</em>
            <br />
            fewer headaches.
          </motion.h1>

          <motion.p className="r32-hero-sub" {...fadeUp(0.35)}>
            <span>180+ builds</span> &nbsp;·&nbsp; <span>9 countries</span>{" "}
            &nbsp;·&nbsp; <span>operating since 2019.</span>
          </motion.p>

          <motion.div {...fadeUp(0.5)}>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="r32-hero-cta r32-display"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book 30 min &rarr;
            </a>
          </motion.div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────────── */}
        <section className="r32-stats" aria-label="Proof numbers">
          {[
            { num: 180, suffix: "+", label: "Builds shipped" },
            { num: 40, suffix: "+", label: "Clients served" },
            { num: 9, suffix: "", label: "Countries worked from" },
            { num: 2019, suffix: "", label: "Operating since" },
          ].map((s) => (
            <div className="r32-stat" key={s.label}>
              <div className="r32-stat-num r32-display">
                <CountUp to={s.num} suffix={s.suffix} />
              </div>
              <div className="r32-stat-label r32-mono">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── HORIZONTAL FILMSTRIP ──────────────────────────────────────── */}
        <FilmStrip />

        {/* ── SERVICES ─────────────────────────────────────────────────── */}
        <section className="r32-services" aria-label="Services">
          <p className="r32-section-eyebrow r32-mono">What I Build</p>
          <div className="r32-services-grid">
            {SERVICES.map((svc) => (
              <motion.div
                key={svc.num}
                className="r32-service-cell"
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="r32-service-accent" aria-hidden="true" />
                <div className="r32-service-num r32-mono">{svc.num}</div>
                <h3 className="r32-service-name r32-display">{svc.name}</h3>
                <p className="r32-service-desc">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── LOCATIONS TICKER ─────────────────────────────────────────── */}
        <div className="r32-ticker" aria-hidden="true">
          <div className="r32-ticker-inner r32-mono">
            {TICKER_ITEMS.map((item, i) => (
              <span
                key={i}
                className={`r32-ticker-item${item.accent ? " accent" : ""}`}
              >
                {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* ── ABOUT ────────────────────────────────────────────────────── */}
        <section className="r32-about" aria-label="About Waseem">
          <div className="r32-about-img-col">
            <img
              src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
              alt="Waseem Nasir — founder, SkynetLabs"
            />
            <div className="r32-about-img-overlay" aria-hidden="true" />
          </div>

          <div className="r32-about-copy">
            <motion.h2
              className="r32-about-h2 r32-display"
              initial={reduced ? {} : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Systems first.
              <br />
              <em>Founder-led.</em>
              <br />
              No agency markup.
            </motion.h2>

            <motion.div
              className="r32-about-body"
              initial={reduced ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p>
                I'm Waseem Nasir — independent founder of SkynetLabs. I build AI
                and automation infrastructure that removes the ops drag killing
                most small businesses: missed leads, dead follow-ups, manual
                data entry, zero-at-night coverage.
              </p>
              <p>
                Every system I ship gets used by real clients, not handed to a
                junior to maintain. You deal with me start to finish.
              </p>
              <p>Remote from Bali and Lahore. Available worldwide.</p>
            </motion.div>

            <div className="r32-about-pills">
              {[
                "n8n",
                "Next.js",
                "Vapi",
                "WhatsApp API",
                "Stripe",
                "OpenAI",
                "AEO",
                "Make",
              ].map((p) => (
                <span key={p} className="r32-pill r32-mono">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROOF GALLERY STRIP ──────────────────────────────────────── */}
        <section
          aria-label="Work photos"
          style={{ borderTop: "1px solid #111", padding: "6vh 6vw" }}
        >
          <p className="r32-section-eyebrow r32-mono">In the field</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "3px",
            }}
          >
            {[
              {
                src: "CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg",
                alt: "Night session, beach cafe",
              },
              {
                src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                alt: "City vista, travelling",
              },
              {
                src: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                alt: "Coworking meetup, Bali",
              },
              {
                src: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
                alt: "Night coworking session",
              },
            ].map(({ src, alt }) => (
              <div
                key={src}
                style={{
                  aspectRatio: "1/1",
                  overflow: "hidden",
                  background: "#0D0D0D",
                }}
              >
                <img
                  src={`/img/pro/${src}`}
                  alt={alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.6) saturate(0.6)",
                    display: "block",
                  }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="r32-cta-section" aria-label="Contact">
          <div className="r32-cta-void-bg" aria-hidden="true" />
          <motion.h2
            className="r32-cta-h2 r32-display"
            initial={reduced ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            One call.
            <br />
            <em>Clarity</em> in thirty minutes.
          </motion.h2>
          <p className="r32-cta-sub">
            No deck. No sales pitch. Bring your problem — leave with a build
            plan.
          </p>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="r32-cta-btn r32-display"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book the call &rarr;
          </a>
          <p className="r32-cta-note r32-mono">30 min · free · no obligation</p>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="r32-footer">
        <div className="r32-footer-brand r32-display">SkynetLabs</div>
        <nav aria-label="Footer links">
          <ul className="r32-footer-links">
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
              <a
                href="https://skynetjoe.com/discovery-call"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a call
              </a>
            </li>
          </ul>
        </nav>
        <div className="r32-footer-copy r32-mono">
          &copy; {new Date().getFullYear()} Waseem Nasir / SkynetLabs
        </div>
      </footer>
    </div>
  );
}
