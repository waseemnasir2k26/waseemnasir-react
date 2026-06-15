"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";

/* ─────────────────────────────────────────────
   DESIGN 14 — MARQUEE MACHINE
   Velocity marquee / type-loop maximalism
   Palette: #000 / #0E0E0E / #FFE600 / #FF2D55
   Fonts: Archivo Black / Space Grotesk / JetBrains Mono
───────────────────────────────────────────── */

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500&family=JetBrains+Mono:wght@400&display=swap";

/* ── Marquee row data ── */
const ROWS: {
  words: string[];
  dir: 1 | -1;
  speed: number;
  size: string;
  color: string;
  stroke?: boolean;
}[] = [
  {
    words: [
      "AI",
      "·",
      "AUTOMATION",
      "·",
      "AI",
      "·",
      "AUTOMATION",
      "·",
      "AI",
      "·",
      "AUTOMATION",
      "·",
    ],
    dir: 1,
    speed: 28,
    size: "clamp(3.5rem,9vw,10rem)",
    color: "#FFE600",
    stroke: false,
  },
  {
    words: [
      "WASEEM",
      "·",
      "NASIR",
      "·",
      "WASEEM",
      "·",
      "NASIR",
      "·",
      "WASEEM",
      "·",
      "NASIR",
      "·",
    ],
    dir: -1,
    speed: 40,
    size: "clamp(2rem,5.5vw,6rem)",
    color: "#FFFFFF",
    stroke: true,
  },
  {
    words: [
      "n8n",
      "·",
      "NEXT.JS",
      "·",
      "WHATSAPP",
      "·",
      "BOTS",
      "·",
      "AEO",
      "·",
      "VOICE",
      "·",
    ],
    dir: 1,
    speed: 22,
    size: "clamp(2.5rem,6.5vw,7.5rem)",
    color: "#FF2D55",
    stroke: false,
  },
  {
    words: [
      "180+",
      "·",
      "BUILDS",
      "·",
      "40+",
      "·",
      "CLIENTS",
      "·",
      "9",
      "·",
      "COUNTRIES",
      "·",
    ],
    dir: -1,
    speed: 36,
    size: "clamp(2rem,5vw,5.5rem)",
    color: "#FFFFFF",
    stroke: false,
  },
  {
    words: [
      "KILL",
      "·",
      "BUSYWORK",
      "·",
      "KILL",
      "·",
      "BUSYWORK",
      "·",
      "KILL",
      "·",
      "BUSYWORK",
      "·",
    ],
    dir: 1,
    speed: 18,
    size: "clamp(3rem,8vw,9rem)",
    color: "#FFE600",
    stroke: true,
  },
  {
    words: [
      "SKYNETLABS",
      "·",
      "REMOTE",
      "·",
      "BALI",
      "·",
      "LAHORE",
      "·",
      "SINCE",
      "·",
      "2019",
      "·",
    ],
    dir: -1,
    speed: 32,
    size: "clamp(1.8rem,4.5vw,5rem)",
    color: "#5E5E5E",
    stroke: false,
  },
];

/* ── Service marquee rows ── */
const SERVICE_ROWS: { label: string; desc: string }[] = [
  {
    label: "AI VOICE BOTS",
    desc: "Never miss another inbound — voice agents answer 24/7, qualify leads, book calls.",
  },
  {
    label: "WHATSAPP AUTOMATION",
    desc: "Follow-up sequences that run while you sleep. Powered by n8n + WhatsApp Business API.",
  },
  {
    label: "N8N WORKFLOWS",
    desc: "Every manual hand-off in your ops stack automated. CRM, email, Slack, forms — wired up.",
  },
  {
    label: "AEO SYSTEMS",
    desc: "Answer Engine Optimisation: your brand in the AI answer box, not buried on page 4.",
  },
  {
    label: "NEXT.JS BUILDS",
    desc: "Production-grade web systems. Fast, typed, deployed. Not templates.",
  },
  {
    label: "LEAD CAPTURE FUNNELS",
    desc: "End-to-end lead machines: landing page → capture → nurture → CRM entry. Automatic.",
  },
];

/* ── Work items ── */
const WORK = [
  {
    label: "FreightOps AI Receptionist",
    tag: "Voice AI · US",
    img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
    landscape: true,
  },
  {
    label: "Inspire Health PT — $27 Funnel",
    tag: "Stripe · Next.js",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    landscape: true,
  },
  {
    label: "IdeaViaggi Trip System",
    tag: "WP · CPT · REST API",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    landscape: true,
  },
  {
    label: "SkynetJoe AEO Engine",
    tag: "AEO · Next.js · SEO",
    img: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
    landscape: true,
  },
];

/* ── Scoped CSS ── */
const SCOPED_CSS = `
@import url('${FONT_URL}');

.root-14 *,
.root-14 *::before,
.root-14 *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.root-14 {
  font-family: 'Space Grotesk', sans-serif;
  background: #000000;
  color: #FFFFFF;
  overflow-x: hidden;
}

.root-14 .arch { font-family: 'Archivo Black', sans-serif; }
.root-14 .mono { font-family: 'JetBrains Mono', monospace; }

/* marquee overflow clip */
.root-14 .mq-track {
  overflow: hidden;
  white-space: nowrap;
  will-change: transform;
}

/* word chip */
.root-14 .mq-word {
  display: inline-block;
  cursor: default;
  transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), color 0.15s;
  will-change: transform;
  user-select: none;
}

.root-14 .mq-word:hover {
  color: #FFE600 !important;
  -webkit-text-stroke-color: #FFE600 !important;
}

/* stroke variant */
.root-14 .stroke-word {
  -webkit-text-stroke: 0.04em currentColor;
  color: transparent;
}

/* section divider */
.root-14 .divider {
  width: 100%;
  height: 1px;
  background: #1A1A1A;
}

/* number stat */
.root-14 .stat-num {
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(3rem,8vw,7rem);
  color: #FFE600;
  line-height: 1;
}

.root-14 .stat-label {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(0.75rem,1.5vw,1rem);
  color: #5E5E5E;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-top: 0.4rem;
}

/* service row */
.root-14 .svc-row {
  border-top: 1px solid #1A1A1A;
  padding: 2.5rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
  transition: background 0.2s;
}
.root-14 .svc-row:hover {
  background: #0E0E0E;
}
.root-14 .svc-row:last-child { border-bottom: 1px solid #1A1A1A; }

.root-14 .svc-label {
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(1.25rem,2.5vw,2rem);
  color: #FFFFFF;
  letter-spacing: -0.02em;
}
.root-14 .svc-label span {
  color: #FF2D55;
  margin-right: 0.6rem;
}

.root-14 .svc-desc {
  font-size: clamp(0.85rem,1.3vw,1rem);
  color: #5E5E5E;
  line-height: 1.6;
}

/* work card */
.root-14 .work-card {
  position: relative;
  overflow: hidden;
  background: #0E0E0E;
  cursor: pointer;
}
.root-14 .work-card img {
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
  filter: grayscale(30%);
}
.root-14 .work-card:hover img {
  transform: scale(1.04);
  filter: grayscale(0%);
}
.root-14 .work-info {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}
.root-14 .work-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(1rem,1.8vw,1.4rem);
  color: #FFFFFF;
}
.root-14 .work-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #5E5E5E;
  white-space: nowrap;
}

/* about photo */
.root-14 .about-photo {
  aspect-ratio: 3/4;
  object-fit: cover;
  width: 100%;
  max-width: 420px;
  display: block;
  filter: grayscale(20%) contrast(1.05);
}

/* accent blob */
.root-14 .accent-bar {
  display: inline-block;
  background: #FFE600;
  color: #000;
  font-family: 'Archivo Black', sans-serif;
  padding: 0.15em 0.5em;
  margin: 0 0.1em;
}

/* nav */
.root-14 .nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 5vw;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #1A1A1A;
}
.root-14 .nav-logo {
  font-family: 'Archivo Black', sans-serif;
  font-size: 1.1rem;
  color: #FFFFFF;
  text-decoration: none;
  letter-spacing: -0.03em;
}
.root-14 .nav-logo span { color: #FFE600; }

.root-14 .nav-cta {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #000;
  background: #FFE600;
  padding: 0.55rem 1.4rem;
  text-decoration: none;
  transition: background 0.15s;
  letter-spacing: 0.02em;
}
.root-14 .nav-cta:hover { background: #ffe926; }

/* CTA block */
.root-14 .cta-block {
  background: #FFE600;
  padding: 5rem 5vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
}
.root-14 .cta-headline {
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(2.5rem,7vw,7rem);
  color: #000;
  line-height: 1;
  letter-spacing: -0.03em;
}
.root-14 .cta-sub {
  font-size: clamp(1rem,1.8vw,1.25rem);
  color: #333;
  max-width: 52ch;
}
.root-14 .cta-btn {
  display: inline-block;
  background: #000;
  color: #FFE600;
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(1rem,2vw,1.5rem);
  padding: 1rem 3rem;
  text-decoration: none;
  letter-spacing: 0.04em;
  transition: background 0.15s, color 0.15s;
}
.root-14 .cta-btn:hover { background: #0E0E0E; }

/* footer */
.root-14 .footer {
  background: #000;
  border-top: 1px solid #1A1A1A;
  padding: 3rem 5vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.root-14 .footer-copy {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #5E5E5E;
}
.root-14 .footer-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #5E5E5E;
  text-decoration: none;
  transition: color 0.15s;
}
.root-14 .footer-link:hover { color: #FFE600; }

/* skip link */
.root-14 .skip-link {
  position: absolute;
  top: -100px;
  left: 1rem;
  background: #FFE600;
  color: #000;
  padding: 0.5rem 1rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  z-index: 999;
  text-decoration: none;
  transition: top 0.1s;
}
.root-14 .skip-link:focus { top: 1rem; }

/* hero area between bands */
.root-14 .hero-content {
  padding: 4rem 5vw;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 2rem;
  background: #000;
}
.root-14 .hero-subhead {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1rem,2vw,1.4rem);
  color: #5E5E5E;
  max-width: 44ch;
  line-height: 1.5;
}
.root-14 .hero-subhead strong { color: #FFFFFF; }

/* scroll indicator */
.root-14 .scroll-rail {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: #FFE600;
  z-index: 200;
  transform-origin: left;
}

/* band gap */
.root-14 .band { position: relative; }

/* about section */
.root-14 .about-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 5vw;
  padding: 6rem 5vw;
  align-items: center;
  background: #0E0E0E;
}

@media (max-width: 768px) {
  .root-14 .about-grid { grid-template-columns: 1fr; }
  .root-14 .svc-row { grid-template-columns: 1fr; }
  .root-14 .hero-content { flex-direction: column; align-items: flex-start; }
  .root-14 .work-grid { grid-template-columns: 1fr !important; }
}

/* tag pill */
.root-14 .tag {
  display: inline-block;
  border: 1px solid #1A1A1A;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #5E5E5E;
  padding: 0.25em 0.75em;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* proof strip */
.root-14 .proof-strip {
  background: #0E0E0E;
  padding: 5rem 5vw;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  border-top: 1px solid #1A1A1A;
  border-bottom: 1px solid #1A1A1A;
}
@media (max-width:768px) {
  .root-14 .proof-strip { grid-template-columns: 1fr 1fr; }
}
`;

/* ──────────────────────────────────────────────────────────
   MarqueeRow component
   Uses rAF loop for smooth, velocity-reactive scrolling
────────────────────────────────────────────────────────── */
interface MarqueeRowProps {
  words: string[];
  dir: 1 | -1;
  baseSpeed: number;
  size: string;
  color: string;
  stroke?: boolean;
  velocityFactor: number;
}

function MarqueeRow({
  words,
  dir,
  baseSpeed,
  size,
  color,
  stroke,
  velocityFactor,
}: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const shouldReduce = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const doubled = [...words, ...words, ...words, ...words];

  useEffect(() => {
    if (shouldReduce) return;
    const el = trackRef.current;
    if (!el) return;

    let lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const speed = baseSpeed + Math.abs(velocityFactor) * 80;
      const skew = Math.max(-12, Math.min(12, velocityFactor * 15));

      posRef.current += dir * speed * dt;

      const half = el!.scrollWidth / 2;
      if (posRef.current > 0) posRef.current -= half;
      if (posRef.current < -half) posRef.current += half;

      el!.style.transform = `translateX(${posRef.current}px) skewX(${skew}deg)`;

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [dir, baseSpeed, velocityFactor, shouldReduce]);

  return (
    <div className="mq-track" style={{ padding: "0.25rem 0" }}>
      <div
        ref={trackRef}
        style={{
          display: "inline-flex",
          gap: "0.6em",
          willChange: "transform",
        }}
      >
        {doubled.map((word, i) => (
          <span
            key={i}
            className={`mq-word arch${stroke ? " stroke-word" : ""}`}
            style={{
              fontSize: size,
              color: color,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              transform: hoveredIdx === i ? "scale(1.18)" : "scale(1)",
              WebkitTextStrokeColor: stroke ? color : undefined,
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Main page component
────────────────────────────────────────────────────────── */
export default function MarqueeMachinePage() {
  const shouldReduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [velocity, setVelocity] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  /* scroll velocity tracker */
  useEffect(() => {
    let raf: number | null = null;
    let smoothV = 0;

    function onScroll() {
      const current = window.scrollY;
      const raw = (current - lastScrollY.current) / 16;
      lastScrollY.current = current;
      smoothV = smoothV * 0.7 + raw * 0.3;
      setVelocity(smoothV);

      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? current / total : 0);

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        smoothV = smoothV * 0.85;
        setVelocity(smoothV);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="root-14"
      ref={containerRef}
      style={{ position: "relative", zIndex: 2, minHeight: "100vh" }}
    >
      <style>{SCOPED_CSS}</style>

      {/* Skip link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Scroll progress rail */}
      <div
        className="scroll-rail"
        style={{
          width: `${scrollProgress * 100}%`,
          transition: shouldReduce ? "none" : undefined,
        }}
        aria-hidden="true"
      />

      {/* NAV */}
      <nav className="nav" aria-label="Primary navigation">
        <a href="/" className="nav-logo">
          WASEEM<span>.</span>
        </a>
        <a
          href="https://skynetjoe.com/discovery-call"
          className="nav-cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a Call
        </a>
      </nav>

      {/* HERO — marquee bands fill viewport */}
      <main id="main-content">
        <section
          aria-label="Hero"
          style={{ paddingTop: "64px", background: "#000", overflow: "hidden" }}
        >
          {/* Row 0: BIG YELLOW */}
          <div
            className="band"
            style={{ background: "#000", paddingTop: "2.5rem" }}
          >
            <MarqueeRow
              {...ROWS[0]}
              baseSpeed={ROWS[0].speed}
              velocityFactor={velocity}
            />
          </div>

          {/* Content peek between rows */}
          <div className="hero-content">
            <div>
              <p className="tag" style={{ marginBottom: "1.5rem" }}>
                Est. 2019 · SkynetLabs · Remote
              </p>
              <h1
                className="arch"
                style={{
                  fontSize: "clamp(1.5rem,4vw,3.5rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  maxWidth: "18ch",
                  color: "#FFFFFF",
                }}
              >
                AI <span style={{ color: "#FFE600" }}>&middot;</span> automation{" "}
                <span style={{ color: "#FFE600" }}>&middot;</span> AI{" "}
                <span style={{ color: "#FFE600" }}>&middot;</span> automation
                <br />
                <span style={{ color: "#5E5E5E" }}>Waseem Nasir</span>
                <br />
                <span style={{ color: "#FF2D55" }}>builds the loop.</span>
              </h1>
            </div>
            <div className="hero-subhead">
              <strong>180+ builds shipped.</strong> 40+ clients across 9
              countries. Looping since 2019.
              <br />
              <br />
              n8n · Next.js · AEO · WhatsApp bots · Voice AI
            </div>
          </div>

          {/* Row 1 */}
          <div className="band" style={{ background: "#000" }}>
            <MarqueeRow
              {...ROWS[1]}
              baseSpeed={ROWS[1].speed}
              velocityFactor={velocity}
            />
          </div>

          {/* Row 2 */}
          <div
            className="band"
            style={{ background: "#000", paddingTop: "0.5rem" }}
          >
            <MarqueeRow
              {...ROWS[2]}
              baseSpeed={ROWS[2].speed}
              velocityFactor={velocity}
            />
          </div>

          {/* Row 3 */}
          <div
            className="band"
            style={{ background: "#000", paddingTop: "0.5rem" }}
          >
            <MarqueeRow
              {...ROWS[3]}
              baseSpeed={ROWS[3].speed}
              velocityFactor={velocity}
            />
          </div>

          {/* Peek CTA */}
          <div
            style={{
              padding: "3rem 5vw",
              background: "#000",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <a
              href="https://skynetjoe.com/discovery-call"
              className="nav-cta arch"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "clamp(1rem,2vw,1.4rem)",
                padding: "1rem 2.5rem",
              }}
            >
              Book 30 min &rarr;
            </a>
          </div>

          {/* Row 4: KILL BUSYWORK */}
          <div className="band" style={{ background: "#000" }}>
            <MarqueeRow
              {...ROWS[4]}
              baseSpeed={ROWS[4].speed}
              velocityFactor={velocity}
            />
          </div>
        </section>

        {/* ── PROOF NUMBERS ── */}
        <section aria-label="Proof numbers" className="proof-strip">
          {[
            { num: "180+", label: "Builds shipped" },
            { num: "40+", label: "Clients served" },
            { num: "9", label: "Countries worked from" },
            { num: "2019", label: "Operating since" },
          ].map(({ num, label }) => (
            <motion.div
              key={num}
              initial={shouldReduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <div className="stat-num">{num}</div>
              <div className="stat-label">{label}</div>
            </motion.div>
          ))}
        </section>

        {/* Row 5: SKYNETLABS */}
        <div className="band" style={{ background: "#000", padding: "2rem 0" }}>
          <MarqueeRow
            {...ROWS[5]}
            baseSpeed={ROWS[5].speed}
            velocityFactor={velocity}
          />
        </div>

        <div className="divider" />

        {/* ── SERVICES ── */}
        <section
          aria-label="Services"
          style={{ padding: "6rem 5vw 3rem", background: "#000" }}
        >
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: "3rem" }}
          >
            <p className="tag" style={{ marginBottom: "1rem" }}>
              What I build
            </p>
            <h2
              className="arch"
              style={{
                fontSize: "clamp(2rem,5vw,4.5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                maxWidth: "20ch",
              }}
            >
              Six systems.
              <br />
              <span style={{ color: "#FF2D55" }}>One loop.</span>
            </h2>
          </motion.div>

          <div>
            {SERVICE_ROWS.map((svc, i) => (
              <motion.div
                key={svc.label}
                className="svc-row"
                initial={shouldReduce ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className="svc-label">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {svc.label}
                </div>
                <div className="svc-desc">{svc.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* BIG MARQUEE DIVIDER */}
        <div
          style={{ background: "#000", padding: "2rem 0", overflow: "hidden" }}
        >
          <MarqueeRow
            words={[
              "BUILD",
              "·",
              "SHIP",
              "·",
              "LOOP",
              "·",
              "REPEAT",
              "·",
              "BUILD",
              "·",
              "SHIP",
              "·",
              "LOOP",
              "·",
              "REPEAT",
              "·",
            ]}
            dir={1}
            baseSpeed={50}
            size="clamp(4rem,12vw,14rem)"
            color="#0E0E0E"
            stroke={false}
            velocityFactor={velocity}
          />
        </div>

        {/* ── SELECTED WORK ── */}
        <section
          aria-label="Selected work"
          style={{ padding: "6rem 5vw", background: "#000" }}
        >
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: "3rem" }}
          >
            <p className="tag" style={{ marginBottom: "1rem" }}>
              Selected work
            </p>
            <h2
              className="arch"
              style={{
                fontSize: "clamp(2rem,5vw,4.5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              Real systems.
              <br />
              <span style={{ color: "#FFE600" }}>Real revenue.</span>
            </h2>
          </motion.div>

          <div
            className="work-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.5rem",
            }}
          >
            {WORK.map((item, i) => (
              <motion.div
                key={item.label}
                className="work-card"
                initial={shouldReduce ? false : { opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <img src={`/img/pro/${item.img}`} alt={item.label} />
                <div className="work-info">
                  <div className="work-title">{item.label}</div>
                  <div className="work-tag">{item.tag}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PHOTO MARQUEE STRIP */}
        <section
          aria-label="Photo reel"
          style={{ overflow: "hidden", background: "#0E0E0E", padding: "0" }}
        >
          <motion.div
            initial={shouldReduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                padding: "1.5rem 0",
                overflowX: "auto",
                scrollbarWidth: "none",
              }}
            >
              {[
                "CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg",
                "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
                "CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg",
                "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
                "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
                "PORTRAIT-2026-02-15-balcony-gray-adidas-soft-smile.jpg",
              ].map((img, i) => (
                <img
                  key={i}
                  src={`/img/pro/${img}`}
                  alt="Waseem Nasir working remotely"
                  style={{
                    height: "clamp(160px, 22vh, 260px)",
                    width: "auto",
                    objectFit: "cover",
                    flexShrink: 0,
                    filter: "grayscale(20%)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── ABOUT ── */}
        <section aria-label="About Waseem Nasir" className="about-grid">
          <div>
            <img
              src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
              alt="Waseem Nasir — founder of SkynetLabs"
              className="about-photo"
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <div>
              <p className="tag" style={{ marginBottom: "1rem" }}>
                Who
              </p>
              <h2
                className="arch"
                style={{
                  fontSize: "clamp(2rem,4.5vw,4rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  marginBottom: "1.5rem",
                }}
              >
                Waseem Nasir
                <br />
                <span style={{ color: "#5E5E5E" }}>Founder, SkynetLabs</span>
              </h2>
              <p
                style={{
                  color: "#5E5E5E",
                  lineHeight: 1.7,
                  fontSize: "clamp(0.95rem,1.5vw,1.1rem)",
                  maxWidth: "50ch",
                }}
              >
                Independent founder since 2019. I build AI and automation
                systems that kill the busywork draining your team — missed
                leads, dead follow-ups, manual data-entry. Not theory. Not
                templates.{" "}
                <strong style={{ color: "#FFFFFF" }}>
                  Production systems shipping on day one.
                </strong>
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {[
                "n8n",
                "Next.js",
                "AEO",
                "WhatsApp API",
                "Voice AI",
                "Stripe",
                "REST APIs",
                "WordPress",
              ].map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <div>
              <p
                className="mono"
                style={{
                  color: "#5E5E5E",
                  fontSize: "0.8rem",
                  lineHeight: 1.6,
                }}
              >
                // Remote-first. Bali / Lahore / wherever.
                <br />
                // github.com/waseemnasir2k26
                <br />
                // 9 countries. One loop.
              </p>
            </div>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="nav-cta arch"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                alignSelf: "flex-start",
                fontSize: "clamp(1rem,1.6vw,1.2rem)",
                padding: "1rem 2.5rem",
              }}
            >
              Book 30 min &rarr;
            </a>
          </div>
        </section>

        {/* SECOND PHOTO STRIP */}
        <section
          aria-label="Additional photos"
          style={{ overflow: "hidden", background: "#000", padding: "0" }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              padding: "1.5rem 0",
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {[
              "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
              "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
              "LIFESTYLE-2026-03-29-night-cafe-armchair-relaxed-gaze.jpg",
              "TRAVEL-2025-05-17-beach-arms-spread-laughing-camera.jpg",
              "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
              "PORTRAIT-travertine-wall-sky-headshot-flowers.jpg",
            ].map((img, i) => (
              <img
                key={i}
                src={`/img/pro/${img}`}
                alt="Waseem Nasir — remote work and travel"
                style={{
                  height: "clamp(180px, 25vh, 300px)",
                  width: "auto",
                  objectFit: "cover",
                  flexShrink: 0,
                  filter: "grayscale(20%) contrast(1.05)",
                }}
              />
            ))}
          </div>
        </section>

        {/* FULL-WIDTH MARQUEE BEFORE CTA */}
        <div
          style={{ background: "#000", overflow: "hidden", padding: "2rem 0" }}
        >
          <MarqueeRow
            words={[
              "BOOK A CALL",
              "·",
              "BOOK A CALL",
              "·",
              "BOOK A CALL",
              "·",
              "BOOK A CALL",
              "·",
              "BOOK A CALL",
              "·",
              "BOOK A CALL",
              "·",
            ]}
            dir={-1}
            baseSpeed={35}
            size="clamp(2rem,6vw,6rem)"
            color="#FF2D55"
            stroke={false}
            velocityFactor={velocity}
          />
        </div>

        {/* ── CTA BLOCK ── */}
        <section aria-label="Book a call" className="cta-block">
          <p
            className="tag"
            style={{
              background: "#000",
              color: "#5E5E5E",
              border: "1px solid #1A1A1A",
            }}
          >
            30 min. No fluff.
          </p>
          <h2 className="cta-headline">
            Stop the
            <br />
            busywork loop.
          </h2>
          <p className="cta-sub">
            One call. We map exactly which AI + automation stack kills your top
            bottleneck — missed leads, dead follow-ups, manual ops. Then I build
            it.
          </p>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="cta-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            BOOK YOUR 30 MIN CALL &rarr;
          </a>
          <p
            className="mono"
            style={{ fontSize: "0.75rem", color: "#555", marginTop: "-0.5rem" }}
          >
            skynetjoe.com/discovery-call
          </p>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="footer" role="contentinfo">
        <div>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Waseem Nasir / SkynetLabs
          </p>
          <p className="footer-copy" style={{ marginTop: "0.25rem" }}>
            180+ builds &middot; 40+ clients &middot; 9 countries &middot; since
            2019
          </p>
        </div>
        <nav
          aria-label="Footer links"
          style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}
        >
          <a
            href="https://github.com/waseemnasir2k26"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://skynetjoe.com"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            SkynetJoe.com
          </a>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a call
          </a>
        </nav>
      </footer>
    </div>
  );
}
