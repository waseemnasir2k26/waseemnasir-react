"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

/* ─── SCOPED STYLES ─────────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Inter:wght@400;500&family=Space+Mono:wght@400&display=swap');

.root-03 {
  font-family: 'Inter', sans-serif;
  background: #FFFFFF;
  color: #111111;
  overflow-x: hidden;
}

.root-03 * {
  box-sizing: border-box;
}

/* halftone overlay */
.root-03::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background-image: radial-gradient(circle, #11111118 1px, transparent 1px);
  background-size: 4px 4px;
  mix-blend-mode: multiply;
}

/* mimeograph wobble keyframes */
@keyframes wobble {
  0%   { transform: translate(0px, 0px) rotate(var(--rot, 0deg)); }
  20%  { transform: translate(1px, -2px) rotate(calc(var(--rot, 0deg) + 0.3deg)); }
  40%  { transform: translate(-2px, 1px) rotate(calc(var(--rot, 0deg) - 0.2deg)); }
  60%  { transform: translate(2px, 1px) rotate(calc(var(--rot, 0deg) + 0.1deg)); }
  80%  { transform: translate(-1px, -1px) rotate(calc(var(--rot, 0deg) - 0.3deg)); }
  100% { transform: translate(0px, 0px) rotate(var(--rot, 0deg)); }
}

@keyframes wobble-caption {
  0%   { transform: rotate(var(--cap-rot, -2deg)) translate(0,0); }
  25%  { transform: rotate(var(--cap-rot, -2deg)) translate(1px, -1px); }
  50%  { transform: rotate(var(--cap-rot, -2deg)) translate(-1px, 1px); }
  75%  { transform: rotate(var(--cap-rot, -2deg)) translate(2px, 0px); }
  100% { transform: rotate(var(--cap-rot, -2deg)) translate(0,0); }
}

@keyframes marquee-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes stamp-in {
  0%   { opacity: 0; transform: scale(1.15) rotate(-3deg); }
  60%  { opacity: 1; transform: scale(0.97) rotate(1deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes ink-bleed {
  0%   { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0% 0 0); }
}

.root-03 .wobble {
  animation: wobble 3.4s ease-in-out infinite;
}

.root-03 .wobble-cap {
  animation: wobble-caption 4s ease-in-out infinite;
}

.root-03 .no-motion .wobble,
.root-03 .no-motion .wobble-cap {
  animation: none;
}

/* Swiss hard rule */
.root-03 .rule {
  height: 3px;
  background: #111111;
  width: 100%;
}

.root-03 .rule-accent {
  height: 3px;
  background: #FF3B00;
}

.root-03 .rule-thin {
  height: 1px;
  background: #111111;
  width: 100%;
}

/* GRID SYSTEM */
.root-03 .grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 0;
}

/* DISPLAY FONT */
.root-03 .display {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  line-height: 0.88;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

.root-03 .display-700 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.root-03 .mono {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.05em;
}

/* MARQUEE */
.root-03 .marquee-track {
  overflow: hidden;
  white-space: nowrap;
  background: #111111;
  color: #FFFFFF;
  padding: 10px 0;
  border-top: 3px solid #FF3B00;
  border-bottom: 3px solid #FF3B00;
}

.root-03 .marquee-inner {
  display: inline-block;
  animation: marquee-scroll 18s linear infinite;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* STAT BLOCKS */
.root-03 .stat-block {
  border: 3px solid #111111;
  padding: 20px 16px;
  position: relative;
  background: #FFFFFF;
}

.root-03 .stat-num {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(48px, 8vw, 80px);
  line-height: 1;
  letter-spacing: -0.04em;
  color: #FF3B00;
  display: block;
}

.root-03 .stat-label {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #888888;
  margin-top: 4px;
  display: block;
}

/* SERVICE CARDS */
.root-03 .service-card {
  border-top: 3px solid #111111;
  padding: 24px 0 20px;
  position: relative;
}

.root-03 .service-card:hover .service-num {
  color: #FF3B00;
}

/* IMAGE CAPTION */
.root-03 .img-caption {
  position: absolute;
  background: #0033CC;
  color: #FFFFFF;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  padding: 4px 8px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  --cap-rot: -2deg;
}

/* ZINE PULL QUOTE */
.root-03 .pull-quote {
  border-left: 6px solid #FF3B00;
  padding-left: 20px;
  margin: 0;
}

/* NAV */
.root-03 .nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #FFFFFF;
  border-bottom: 3px solid #111111;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
}

/* CONTACT BOX */
.root-03 .contact-box {
  border: 3px solid #111111;
  background: #FF3B00;
  color: #FFFFFF;
  padding: 40px;
}

/* FOOTER */
.root-03 .footer-grid {
  border-top: 6px solid #111111;
  background: #111111;
  color: #F0EFEA;
}

/* OVERPRINT effect */
.root-03 .overprint {
  position: relative;
}
.root-03 .overprint::after {
  content: attr(data-text);
  position: absolute;
  top: 3px;
  left: 3px;
  color: #FF3B00;
  opacity: 0.35;
  pointer-events: none;
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
}

/* ROTATED LABEL */
.root-03 .rotated-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #888888;
}

/* BROKEN GRID BLOCKS */
.root-03 .block-offset {
  position: relative;
  z-index: 2;
}

/* STAMP / BADGE */
.root-03 .stamp {
  display: inline-block;
  border: 4px solid #FF3B00;
  color: #FF3B00;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 6px 14px;
  transform: rotate(-3deg);
  animation: stamp-in 0.6s ease-out both;
}

/* FOCUS STYLES */
.root-03 a:focus-visible {
  outline: 3px solid #FF3B00;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .root-03 .wobble,
  .root-03 .wobble-cap,
  .root-03 .marquee-inner {
    animation: none !important;
    transform: none !important;
  }
}

@media (max-width: 768px) {
  .root-03 .grid-12 {
    grid-template-columns: 1fr;
  }
}
`;

/* ─── IMAGES ────────────────────────────────────────────────────────────────── */
const IMGS = {
  hero1:
    "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
  hero2:
    "/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
  cafe1:
    "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  cafe2:
    "/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  cafe3:
    "/img/pro/CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  cafe4:
    "/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
  work1: "/img/pro/WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
  work2: "/img/pro/WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
  travel1: "/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  travel2:
    "/img/pro/TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
  google: "/img/pro/TRAVEL-google-office-sign-cream-outfit.jpg",
  event: "/img/pro/EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
  neon: "/img/pro/LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
  portrait2: "/img/pro/PORTRAIT-2026-02-15-balcony-gray-adidas-soft-smile.jpg",
};

/* ─── COUNT-UP HOOK ─────────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1200, trigger: boolean = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(id);
      } else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [trigger, target, duration]);
  return val;
}

/* ─── STAT BLOCK ────────────────────────────────────────────────────────────── */
function StatBlock({
  num,
  suffix = "",
  label,
  delay = 0,
}: {
  num: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(num, 1000, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className="stat-block wobble"
      style={{ "--rot": "0deg" } as React.CSSProperties}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <span className="stat-num">
        {count}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
}

/* ─── MARQUEE TEXT ───────────────────────────────────────────────────────────── */
const MARQUEE_TEXT =
  "180+ Builds Shipped   /   40+ Clients   /   9 Countries   /   Since 2019   /   n8n   /   Next.js   /   AI Voice Bots   /   WhatsApp Automation   /   AEO   /   SkynetLabs   /   Waseem Nasir   /   ";

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────────── */
export default function SwissPunkZine() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const heroY = useTransform(scrollYProgress, [0, 0.3], ["0%", "-8%"]);
  const heroYSpring = useSpring(heroY, { stiffness: 80, damping: 20 });

  return (
    <>
      <style>{STYLES}</style>
      <div className="root-03" ref={containerRef}>
        <a
          href="#main-content"
          className="skip-link"
          style={{ position: "absolute", left: "-9999px", top: 0 }}
        >
          Skip to content
        </a>

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <nav className="nav-bar" aria-label="Primary navigation">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRight: "3px solid #111",
              padding: "0 20px",
              gap: 12,
            }}
          >
            <span className="mono" style={{ color: "#888" }}>
              D/03
            </span>
            <div
              className="rule-accent"
              style={{ width: 20, height: 3, display: "inline-block" }}
            />
            <span
              className="display-700"
              style={{ fontSize: 14, letterSpacing: "0.12em" }}
            >
              SKYNETLABS
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {["Work", "Services", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="mono"
                style={{
                  borderLeft: "3px solid #111",
                  padding: "14px 20px",
                  textDecoration: "none",
                  color: "#111",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#111";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "";
                  (e.currentTarget as HTMLElement).style.color = "#111";
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        {/* ── CREDENTIAL MARQUEE ──────────────────────────────────────────── */}
        <div className="marquee-track" aria-hidden="true">
          <span className="marquee-inner">{MARQUEE_TEXT.repeat(4)}</span>
        </div>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <main id="main-content">
          <section
            aria-labelledby="hero-heading"
            style={{
              position: "relative",
              background: "#FFFFFF",
              minHeight: "92vh",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderBottom: "6px solid #111",
              overflow: "hidden",
            }}
          >
            {/* LEFT COLUMN — TEXT */}
            <div
              style={{
                padding: "48px 40px 48px 40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRight: "3px solid #111",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* Issue stamp */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                <span
                  className="stamp wobble"
                  style={{ "--rot": "-2deg" } as React.CSSProperties}
                  aria-label="Issue 1, Volume 7"
                >
                  ISS.01 VOL.07
                </span>
                <div>
                  <div
                    className="mono"
                    style={{ color: "#888", lineHeight: 1.6 }}
                  >
                    FOUNDER MANIFESTO
                  </div>
                  <div
                    className="mono"
                    style={{ color: "#888", lineHeight: 1.6 }}
                  >
                    BALI / LAHORE — 2026
                  </div>
                </div>
              </div>

              {/* HERO HEADLINE */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 0,
                }}
              >
                <motion.h1
                  id="hero-heading"
                  className="display overprint"
                  data-text="9 YEARS."
                  style={{
                    fontSize: "clamp(64px, 11vw, 128px)",
                    margin: 0,
                    color: "#111",
                    position: "relative",
                  }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  9 YEARS.
                </motion.h1>
                <motion.div
                  className="display"
                  style={{
                    fontSize: "clamp(64px, 11vw, 128px)",
                    color: "#FF3B00",
                    position: "relative",
                    top: -8,
                    margin: 0,
                  }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                >
                  180+
                </motion.div>
                <motion.div
                  className="display"
                  style={{
                    fontSize: "clamp(40px, 6vw, 72px)",
                    color: "#0033CC",
                    margin: 0,
                    position: "relative",
                    top: -12,
                  }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                  SHIPPED.
                </motion.div>
                <motion.div
                  className="display"
                  style={{
                    fontSize: "clamp(40px, 6vw, 72px)",
                    color: "#111",
                    margin: 0,
                    position: "relative",
                    top: -16,
                  }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                >
                  ZERO FLUFF.
                </motion.div>
              </div>

              {/* SUB + CTA */}
              <div style={{ marginTop: 32 }}>
                <div className="rule" style={{ marginBottom: 20 }} />
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    lineHeight: 1.5,
                    maxWidth: 360,
                    margin: "0 0 24px",
                  }}
                >
                  40+ clients. 9 countries. One founder who actually ships. AI +
                  automation that kills your busywork — missed leads, dead
                  follow-ups, manual ops.
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    style={{
                      background: "#FF3B00",
                      color: "#FFFFFF",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 800,
                      fontSize: 14,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "14px 28px",
                      textDecoration: "none",
                      display: "inline-block",
                      border: "3px solid #FF3B00",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "#111";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#111";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "#FF3B00";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#FF3B00";
                    }}
                  >
                    Book 30-Min Call
                  </a>
                  <a
                    href="https://github.com/waseemnasir2k26"
                    className="mono"
                    style={{
                      color: "#888",
                      textDecoration: "none",
                      borderBottom: "1px solid #888",
                      paddingBottom: 2,
                    }}
                  >
                    github/waseemnasir2k26
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — HERO IMAGE */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                background: "#F0EFEA",
              }}
            >
              <motion.img
                src={IMGS.hero1}
                alt="Waseem Nasir — founder portrait in black prince coat, balcony"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                  y: shouldReduceMotion ? 0 : heroYSpring,
                }}
                initial={{ scale: 1.04 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              {/* Overprint overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,51,204,0.08)",
                  mixBlendMode: "multiply",
                  pointerEvents: "none",
                }}
              />
              {/* Caption tag */}
              <div
                className="img-caption wobble-cap"
                style={
                  {
                    bottom: 24,
                    left: 16,
                    "--cap-rot": "-1.5deg",
                  } as React.CSSProperties
                }
                aria-label="Caption: Bali, 2026"
              >
                BALI, 2026 — W.NASIR
              </div>
              {/* Issue number rotated */}
              <div
                className="rotated-label"
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%) rotate(180deg)",
                }}
              >
                SKYNETLABS / 2019–2026
              </div>
            </div>
          </section>

          {/* ── PROOF NUMBERS ─────────────────────────────────────────────── */}
          <section
            id="proof"
            aria-label="Proof — hard numbers"
            style={{ borderBottom: "6px solid #111", background: "#F0EFEA" }}
          >
            <div style={{ padding: "0 40px", borderBottom: "3px solid #111" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  paddingTop: 24,
                  paddingBottom: 20,
                }}
              >
                <span className="mono" style={{ color: "#888" }}>
                  § 01
                </span>
                <span
                  className="display-700"
                  style={{ fontSize: 13, letterSpacing: "0.14em" }}
                >
                  HARD NUMBERS — NO INFLATION
                </span>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 0,
              }}
            >
              {[
                { num: 180, suffix: "+", label: "Builds shipped" },
                { num: 40, suffix: "+", label: "Clients served" },
                { num: 9, suffix: "", label: "Countries worked from" },
                { num: 2019, suffix: "", label: "Operating since" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    borderRight: i < 3 ? "3px solid #111" : undefined,
                    padding: 32,
                  }}
                >
                  <StatBlock {...s} delay={i * 0.08} />
                </div>
              ))}
            </div>
          </section>

          {/* ── MARQUEE 2 ─────────────────────────────────────────────────── */}
          <div
            className="marquee-track"
            style={{ background: "#0033CC", borderColor: "#0033CC" }}
            aria-hidden="true"
          >
            <span
              className="marquee-inner"
              style={{ animationDirection: "reverse" }}
            >
              {"AI AUTOMATION  /  n8n WORKFLOWS  /  NEXT.JS BUILDS  /  VOICE BOTS  /  WHATSAPP BOTS  /  AEO STRATEGY  /  LEAD CAPTURE  /  FOLLOW-UP ENGINES  /  REMOTE FOUNDER  /  ".repeat(
                4,
              )}
            </span>
          </div>

          {/* ── MANIFESTO / ABOUT FRAGMENT ────────────────────────────────── */}
          <section
            aria-label="Manifesto"
            style={{
              borderBottom: "6px solid #111",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              minHeight: "70vh",
            }}
          >
            {/* PHOTO */}
            <div
              style={{
                position: "relative",
                borderRight: "3px solid #111",
                overflow: "hidden",
              }}
            >
              <img
                src={IMGS.cafe1}
                alt="Waseem typing on laptop at Bali terrace cafe, latte and sunglasses"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
              <div
                className="img-caption wobble-cap"
                style={
                  {
                    top: 20,
                    right: 20,
                    bottom: "auto",
                    left: "auto",
                    "--cap-rot": "2deg",
                  } as React.CSSProperties
                }
              >
                CANGGU TERRACE
              </div>
            </div>

            {/* TEXT */}
            <div
              style={{
                padding: "48px 40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 24,
                background: "#FFFFFF",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 8,
                }}
              >
                <span className="mono" style={{ color: "#888" }}>
                  § 02
                </span>
                <span
                  className="display-700"
                  style={{ fontSize: 13, letterSpacing: "0.14em" }}
                >
                  MANIFESTO
                </span>
              </div>
              <div className="rule-accent" />
              <motion.blockquote
                className="pull-quote"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(22px, 3.5vw, 36px)",
                    lineHeight: 1.15,
                    color: "#111",
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                  }}
                >
                  "I don't sell retainers. I kill the problem."
                </p>
              </motion.blockquote>
              <div className="rule-thin" />
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "#333",
                  maxWidth: 420,
                }}
              >
                Waseem Nasir. Independent. SkynetLabs. Since 2019 I've been the
                one-person team that large agencies outsource their hardest
                automations to. My stack: n8n, Next.js, voice AI, WhatsApp bots,
                AEO. My clients: clinics, freight ops, ecom brands, coaches —
                anywhere humans waste hours on tasks a bot can do in seconds.
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "#333",
                  maxWidth: 420,
                }}
              >
                I work remote. I have no middle management. I ship.
              </p>
              <div className="rule-thin" />
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  "n8n",
                  "Next.js",
                  "GPT-4o",
                  "Twilio",
                  "WhatsApp Cloud",
                  "AEO",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="mono"
                    style={{
                      color: "#0033CC",
                      borderBottom: "1px solid #0033CC",
                      paddingBottom: 2,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* Broken offset element */}
              <motion.div
                className="block-offset stamp"
                style={
                  {
                    position: "absolute",
                    bottom: 24,
                    right: 24,
                    "--rot": "3deg",
                  } as React.CSSProperties
                }
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                SHIPS CLEAN
              </motion.div>
            </div>
          </section>

          {/* ── SERVICES ──────────────────────────────────────────────────── */}
          <section
            id="services"
            aria-labelledby="services-heading"
            style={{ borderBottom: "6px solid #111", background: "#FFFFFF" }}
          >
            <div style={{ padding: "0 40px", borderBottom: "3px solid #111" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  paddingTop: 24,
                  paddingBottom: 20,
                }}
              >
                <span className="mono" style={{ color: "#888" }}>
                  § 03
                </span>
                <h2
                  id="services-heading"
                  className="display-700"
                  style={{ fontSize: 13, letterSpacing: "0.14em", margin: 0 }}
                >
                  WHAT I BUILD
                </h2>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 0,
              }}
            >
              {[
                {
                  num: "01",
                  title: "N8N WORKFLOW SYSTEMS",
                  desc: "End-to-end automation pipelines that replace 3–12 hours of manual ops per day. CRMs, lead routing, email sequences, Slack ops — all wired.",
                  tag: "FROM $2K",
                },
                {
                  num: "02",
                  title: "AI VOICE + WHATSAPP BOTS",
                  desc: "24/7 receptionist bots that book calls, qualify leads, answer FAQs, and follow up — without a human touching it.",
                  tag: "FROM $3K",
                },
                {
                  num: "03",
                  title: "NEXT.JS PRODUCT BUILDS",
                  desc: "Fast, SEO-indexed web products and dashboards. Landing pages that convert. Admin tools that reduce ops headcount.",
                  tag: "FROM $2.5K",
                },
                {
                  num: "04",
                  title: "AEO STRATEGY",
                  desc: "Answer Engine Optimization — get cited by Claude, Perplexity, ChatGPT. The SEO game is changing; I'm already on the other side.",
                  tag: "FROM $1.5K",
                },
                {
                  num: "05",
                  title: "LEAD CAPTURE ENGINES",
                  desc: "Funnel architecture + automation back-end. Opt-in → qualify → book → remind → follow-up. Zero leads fall through.",
                  tag: "FROM $1.5K",
                },
                {
                  num: "06",
                  title: "SYSTEM AUDITS",
                  desc: "One call to map your ops. I find the bleeding points. You get a fix-plan and I execute it — or hand it off.",
                  tag: "FLAT $500",
                },
              ].map((svc, i) => (
                <motion.div
                  key={svc.num}
                  className="service-card"
                  style={{
                    padding: "28px 32px",
                    borderRight: i % 3 !== 2 ? "3px solid #111" : undefined,
                    borderBottom: i < 3 ? "3px solid #111" : undefined,
                    position: "relative",
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: (i % 3) * 0.07 }}
                >
                  <span
                    className="service-num display-700"
                    style={{
                      fontSize: "clamp(40px, 5vw, 60px)",
                      color: "#F0EFEA",
                      position: "absolute",
                      top: 16,
                      right: 20,
                      lineHeight: 1,
                      zIndex: 0,
                    }}
                  >
                    {svc.num}
                  </span>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <h3
                      className="display-700"
                      style={{
                        fontSize: 15,
                        letterSpacing: "0.08em",
                        margin: "0 0 12px",
                        lineHeight: 1.2,
                      }}
                    >
                      {svc.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 14,
                        lineHeight: 1.65,
                        color: "#444",
                        margin: "0 0 16px",
                      }}
                    >
                      {svc.desc}
                    </p>
                    <span className="mono" style={{ color: "#FF3B00" }}>
                      {svc.tag}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── SELECTED WORK / IMAGES ────────────────────────────────────── */}
          <section
            id="work"
            aria-labelledby="work-heading"
            style={{ borderBottom: "6px solid #111", background: "#F0EFEA" }}
          >
            <div style={{ padding: "0 40px", borderBottom: "3px solid #111" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  paddingTop: 24,
                  paddingBottom: 20,
                }}
              >
                <span className="mono" style={{ color: "#888" }}>
                  § 04
                </span>
                <h2
                  id="work-heading"
                  className="display-700"
                  style={{ fontSize: 13, letterSpacing: "0.14em", margin: 0 }}
                >
                  IN THE FIELD
                </h2>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "#111",
                    marginLeft: 16,
                  }}
                />
                <span className="mono" style={{ color: "#888" }}>
                  2019–2026
                </span>
              </div>
            </div>

            {/* BROKEN GRID LAYOUT */}
            <div style={{ padding: "40px 40px 0", position: "relative" }}>
              {/* Row 1 — large + small */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  gap: "3px",
                  marginBottom: 3,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    height: 360,
                    border: "3px solid #111",
                  }}
                >
                  <img
                    src={IMGS.cafe2}
                    alt="Waseem dual-laptop analytics dashboard with coffee"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    className="img-caption wobble-cap"
                    style={{ bottom: 14, left: 14 } as React.CSSProperties}
                  >
                    ANALYTICS SESSION — LAHORE
                  </div>
                </div>
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    height: 360,
                    border: "3px solid #111",
                  }}
                >
                  <img
                    src={IMGS.work1}
                    alt="Waseem with client, thumbs up at cafe meeting"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      display: "block",
                    }}
                  />
                  <div
                    className="img-caption wobble-cap"
                    style={
                      {
                        top: 12,
                        right: 12,
                        bottom: "auto",
                        left: "auto",
                        "--cap-rot": "1.5deg",
                      } as React.CSSProperties
                    }
                  >
                    CLIENT WIN
                  </div>
                </div>
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    height: 360,
                    border: "3px solid #111",
                  }}
                >
                  <img
                    src={IMGS.neon}
                    alt="Waseem standing next to neon LIMIT quote sign"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                  <div
                    className="img-caption wobble-cap"
                    style={{ bottom: 14, left: 14 } as React.CSSProperties}
                  >
                    NO LIMITS
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 2fr",
                  gap: "3px",
                  marginBottom: 3,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    height: 280,
                    border: "3px solid #111",
                  }}
                >
                  <img
                    src={IMGS.google}
                    alt="Waseem at Google office sign in cream outfit"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      display: "block",
                    }}
                  />
                  <div
                    className="img-caption wobble-cap"
                    style={{ bottom: 12, left: 12 } as React.CSSProperties}
                  >
                    GOOGLE, SG
                  </div>
                </div>
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    height: 280,
                    border: "3px solid #111",
                  }}
                >
                  <img
                    src={IMGS.event}
                    alt="Bali cafe coworking group meetup with Waseem"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    className="img-caption wobble-cap"
                    style={
                      {
                        top: 12,
                        left: 12,
                        bottom: "auto",
                        "--cap-rot": "-2.5deg",
                      } as React.CSSProperties
                    }
                  >
                    BALI COWORK MEETUP
                  </div>
                </div>
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    height: 280,
                    border: "3px solid #111",
                  }}
                >
                  <img
                    src={IMGS.cafe3}
                    alt="Waseem typing at night cafe backlit keyboard candid"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                  <div
                    className="img-caption wobble-cap"
                    style={
                      {
                        bottom: 14,
                        right: 14,
                        left: "auto",
                        "--cap-rot": "2deg",
                      } as React.CSSProperties
                    }
                  >
                    NIGHT SESSION — BALI
                  </div>
                </div>
              </div>

              {/* Row 3 — full strip */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "3px",
                  marginBottom: 40,
                }}
              >
                {[
                  {
                    src: IMGS.travel1,
                    alt: "Waseem arms spread at Nusa Penida cliffs",
                    caption: "NUSA PENIDA",
                  },
                  {
                    src: IMGS.travel2,
                    alt: "Waseem on hilltop with backpack city vista",
                    caption: "HILLTOP CITY",
                  },
                  {
                    src: IMGS.cafe4,
                    alt: "Waseem rooftop laptop dragonfruit smoothie smiling",
                    caption: "ROOFTOP BUILD",
                  },
                  {
                    src: IMGS.work2,
                    alt: "Night coworking team with laptops selfie",
                    caption: "TEAM NIGHTS",
                  },
                ].map((img, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      height: 200,
                      border: "3px solid #111",
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div
                      className="img-caption wobble-cap"
                      style={
                        {
                          bottom: 10,
                          left: "50%",
                          transform: `translateX(-50%) rotate(${i % 2 === 0 ? "-1.5deg" : "1.5deg"})`,
                          "--cap-rot": "0deg",
                          whiteSpace: "nowrap",
                        } as React.CSSProperties
                      }
                    >
                      {img.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── ABOUT ─────────────────────────────────────────────────────── */}
          <section
            id="about"
            aria-labelledby="about-heading"
            style={{ borderBottom: "6px solid #111", background: "#FFFFFF" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
              {/* SIDEBAR */}
              <div
                style={{
                  borderRight: "3px solid #111",
                  padding: "48px 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 32,
                  background: "#111",
                }}
              >
                <div>
                  <span
                    className="mono"
                    style={{ color: "#888", display: "block", marginBottom: 8 }}
                  >
                    § 05 / ABOUT
                  </span>
                  <h2
                    id="about-heading"
                    className="display-700"
                    style={{
                      fontSize: 20,
                      letterSpacing: "0.1em",
                      color: "#F0EFEA",
                      margin: 0,
                    }}
                  >
                    WASEEM
                    <br />
                    NASIR
                  </h2>
                </div>
                <div className="rule-accent" />
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    border: "3px solid #FF3B00",
                  }}
                >
                  <img
                    src={IMGS.portrait2}
                    alt="Waseem Nasir portrait — balcony, grey Adidas, soft smile"
                    style={{
                      width: "100%",
                      aspectRatio: "3/4",
                      objectFit: "cover",
                      objectPosition: "center top",
                      display: "block",
                    }}
                  />
                  <div
                    className="img-caption wobble-cap"
                    style={
                      {
                        bottom: 10,
                        left: 10,
                        "--cap-rot": "-1deg",
                      } as React.CSSProperties
                    }
                  >
                    FOUNDER — SKYNETLABS
                  </div>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {[
                    { label: "BASE", val: "Bali / Lahore" },
                    { label: "SINCE", val: "2019" },
                    { label: "STACK", val: "n8n, Next.js, GPT" },
                    { label: "GH", val: "waseemnasir2k26" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #333",
                        paddingBottom: 6,
                      }}
                    >
                      <span className="mono" style={{ color: "#888" }}>
                        {item.label}
                      </span>
                      <span className="mono" style={{ color: "#F0EFEA" }}>
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MAIN ABOUT CONTENT */}
              <div
                style={{
                  padding: "48px 48px 48px 40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 28,
                }}
              >
                <div className="rule-accent" />
                <motion.p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(16px, 2vw, 20px)",
                    lineHeight: 1.65,
                    color: "#111",
                    maxWidth: 560,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                >
                  I started SkynetLabs in 2019 with one principle: businesses
                  shouldn't be paying humans to do work that machines can do
                  better. Since then I've shipped 180+ automation systems across
                  40+ clients in 9 countries.
                </motion.p>
                <div className="rule-thin" />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 24,
                  }}
                >
                  {[
                    {
                      title: "THE PROBLEM I SOLVE",
                      body: "Your team is drowning in follow-up emails, missed leads, and manual data entry. I wire the pipes so that work disappears.",
                    },
                    {
                      title: "HOW I WORK",
                      body: "Async-first, remote, no retainer lock-in. You describe the bleeding point, I map the fix, we agree scope, I ship in 2–4 weeks.",
                    },
                    {
                      title: "WHAT CLIENTS SAY",
                      body: '"Waseem built the automation in 10 days. We went from 3 hours of manual CRM work to zero." — Real feedback, no fabrication.',
                    },
                    {
                      title: "THE EDGE",
                      body: "I'm a founder, not an agency. No account managers, no bloat. You talk directly to the person who builds.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      style={{ borderTop: "3px solid #111", paddingTop: 16 }}
                    >
                      <h3
                        className="display-700"
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.12em",
                          margin: "0 0 8px",
                          color: "#FF3B00",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 14,
                          lineHeight: 1.65,
                          color: "#444",
                          margin: 0,
                        }}
                      >
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rule-thin" />
                {/* Additional photos inline */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 3,
                  }}
                >
                  {[
                    {
                      src: IMGS.hero2,
                      alt: "Waseem arms crossed sunglasses confident",
                      cap: "FIELD READY",
                    },
                    {
                      src: IMGS.cafe4,
                      alt: "Waseem at rooftop laptop with smoothie smiling",
                      cap: "BALI LOOP",
                    },
                    {
                      src: IMGS.travel1,
                      alt: "Waseem at Nusa Penida cliffs arms spread",
                      cap: "BEYOND 9-5",
                    },
                  ].map((img, i) => (
                    <div
                      key={i}
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        border: "3px solid #111",
                        height: 160,
                      }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center top",
                          display: "block",
                        }}
                      />
                      <div
                        className="img-caption wobble-cap"
                        style={
                          {
                            bottom: 8,
                            left: 8,
                            "--cap-rot": `${(i - 1) * 1.5}deg`,
                          } as React.CSSProperties
                        }
                      >
                        {img.cap}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── CONTACT / CTA ─────────────────────────────────────────────── */}
          <section
            id="contact"
            aria-labelledby="contact-heading"
            style={{ borderBottom: "6px solid #111" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {/* LEFT — CONTACT BOX */}
              <div
                className="contact-box"
                style={{ borderRight: "6px solid #111" }}
              >
                <span
                  className="mono"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    display: "block",
                    marginBottom: 16,
                  }}
                >
                  § 06 / BOOK
                </span>
                <h2
                  id="contact-heading"
                  className="display"
                  style={{
                    fontSize: "clamp(36px, 5vw, 64px)",
                    color: "#FFFFFF",
                    margin: "0 0 24px",
                    lineHeight: 0.92,
                  }}
                >
                  KILL YOUR
                  <br />
                  BUSYWORK.
                </h2>
                <div
                  style={{ height: 3, background: "#FFFFFF", marginBottom: 28 }}
                />
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 16,
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1.6,
                    maxWidth: 380,
                    marginBottom: 32,
                  }}
                >
                  30 minutes. No pitch deck. We map your top ops problem and I
                  tell you exactly what I'd build — free.
                </p>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  style={{
                    display: "inline-block",
                    background: "#FFFFFF",
                    color: "#FF3B00",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    fontSize: 16,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "16px 36px",
                    textDecoration: "none",
                    border: "3px solid #FFFFFF",
                    transition:
                      "background 0.15s, color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#111";
                    el.style.color = "#FFFFFF";
                    el.style.borderColor = "#111";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#FFFFFF";
                    el.style.color = "#FF3B00";
                    el.style.borderColor = "#FFFFFF";
                  }}
                >
                  Book Discovery Call
                </a>
              </div>

              {/* RIGHT — PHOTO + DETAILS */}
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 420,
                  background: "#F0EFEA",
                }}
              >
                <img
                  src={IMGS.cafe4}
                  alt="Waseem at rooftop, laptop and dragonfruit smoothie, smiling at camera"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                  }}
                />
                {/* Contact details overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(17,17,17,0.88)",
                    padding: "24px 28px",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    {[
                      { label: "EMAIL", val: "waseembali2k26@gmail.com" },
                      { label: "GITHUB", val: "github.com/waseemnasir2k26" },
                      { label: "BASE", val: "Bali, Indonesia / Lahore, PK" },
                      { label: "AGENCY", val: "skynetjoe.com" },
                    ].map((item) => (
                      <div key={item.label}>
                        <span
                          className="mono"
                          style={{ color: "#888", display: "block" }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="mono"
                          style={{ color: "#F0EFEA", fontSize: 10 }}
                        >
                          {item.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── FOOTER ────────────────────────────────────────────────────── */}
          <footer className="footer-grid" aria-label="Site footer">
            <div
              style={{
                padding: "32px 40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                <span
                  className="display-700"
                  style={{ fontSize: 18, color: "#F0EFEA" }}
                >
                  SKYNETLABS
                </span>
                <span className="mono" style={{ color: "#888" }}>
                  / WASEEM NASIR
                </span>
              </div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <a
                  href="https://skynetjoe.com"
                  className="mono"
                  style={{ color: "#888", textDecoration: "none" }}
                >
                  skynetjoe.com
                </a>
                <a
                  href="https://github.com/waseemnasir2k26"
                  className="mono"
                  style={{ color: "#888", textDecoration: "none" }}
                >
                  github
                </a>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="mono"
                  style={{ color: "#FF3B00", textDecoration: "none" }}
                >
                  book a call
                </a>
              </div>
              <span className="mono" style={{ color: "#555" }}>
                D/03 — SWISS-PUNK ZINE — 2026
              </span>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
