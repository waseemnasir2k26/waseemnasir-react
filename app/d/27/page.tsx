"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "framer-motion";

/* ─── SCOPED STYLES ──────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,500&family=Spectral:wght@400;500&family=Space+Mono:wght@400&display=swap');

.root-27 {
  font-family: 'Spectral', Georgia, serif;
  background: #E8E6E1;
  color: #1C1C1A;
  -webkit-font-smoothing: antialiased;
}

.root-27 * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.root-27 h1,
.root-27 h2,
.root-27 h3,
.root-27 .display {
  font-family: 'Bodoni Moda', 'Times New Roman', serif;
  font-weight: 500;
}

.root-27 .mono {
  font-family: 'Space Mono', monospace;
  font-weight: 400;
}

/* Scroll progress rail */
.root-27 .progress-rail {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 240px;
  background: rgba(140, 140, 130, 0.2);
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.root-27 .rail-track {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  background: #33403A;
  transition: height 0.1s ease;
}

.root-27 .rail-tick {
  width: 5px;
  height: 1px;
  background: rgba(140, 140, 130, 0.4);
  position: relative;
  z-index: 1;
}

.root-27 .rail-tick.active {
  background: #33403A;
  width: 8px;
}

/* Chapter label */
.root-27 .chapter-label {
  position: fixed;
  right: 44px;
  top: 50%;
  transform: translateY(-50%);
  writing-mode: vertical-rl;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: #8E8C85;
  text-transform: uppercase;
  z-index: 100;
  transition: opacity 0.4s ease;
}

/* Curtain wipe */
.root-27 .curtain-wrap {
  position: relative;
  overflow: hidden;
}

.root-27 .curtain-overlay {
  position: absolute;
  inset: 0;
  background: #DAD7D0;
  transform-origin: left;
  z-index: 2;
  pointer-events: none;
}

/* Horizontal rule accent */
.root-27 .ruled-line {
  width: 48px;
  height: 1px;
  background: #33403A;
}

/* Nav */
.root-27 nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  padding: 24px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  mix-blend-mode: normal;
}

.root-27 .nav-wordmark {
  font-family: 'Bodoni Moda', serif;
  font-size: 17px;
  letter-spacing: 0.05em;
  color: #1C1C1A;
}

.root-27 .nav-cta {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #33403A;
  text-decoration: none;
  border-bottom: 1px solid #33403A;
  padding-bottom: 2px;
  transition: opacity 0.2s;
}

.root-27 .nav-cta:hover {
  opacity: 0.6;
}

.root-27 .nav-cta:focus-visible {
  outline: 2px solid #33403A;
  outline-offset: 4px;
}

/* Focus visible global */
.root-27 a:focus-visible,
.root-27 button:focus-visible {
  outline: 2px solid #33403A;
  outline-offset: 3px;
  border-radius: 1px;
}

/* Hero */
.root-27 .hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
}

.root-27 .hero-left {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 120px 64px 80px 64px;
  background: #E8E6E1;
}

.root-27 .hero-right {
  background: #DAD7D0;
  position: relative;
  overflow: hidden;
}

.root-27 .hero-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.root-27 .hero-eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #8E8C85;
  margin-bottom: 32px;
}

.root-27 .hero-h1 {
  font-size: clamp(52px, 6vw, 88px);
  line-height: 1.02;
  letter-spacing: -0.01em;
  color: #1C1C1A;
  margin-bottom: 40px;
}

.root-27 .hero-sub {
  font-family: 'Spectral', serif;
  font-size: 17px;
  line-height: 1.7;
  color: #8E8C85;
  max-width: 380px;
  margin-bottom: 56px;
}

.root-27 .hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #E8E6E1;
  background: #33403A;
  text-decoration: none;
  padding: 18px 36px;
  transition: background 0.3s ease, color 0.3s ease;
}

.root-27 .hero-cta:hover {
  background: #1C1C1A;
}

/* Numbers strip */
.root-27 .numbers-strip {
  background: #33403A;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid rgba(255,255,255,0.08);
}

.root-27 .number-cell {
  padding: 56px 40px;
  border-right: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.root-27 .number-cell:last-child {
  border-right: none;
}

.root-27 .number-val {
  font-family: 'Bodoni Moda', serif;
  font-size: 52px;
  line-height: 1;
  color: #E8E6E1;
  letter-spacing: -0.02em;
}

.root-27 .number-label {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #B9B3A7;
}

/* Chapter heading shared */
.root-27 .chapter-heading {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #8E8C85;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
}

/* Services section */
.root-27 .services {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
}

.root-27 .services-left {
  background: #DAD7D0;
  padding: 120px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.root-27 .services-right {
  padding: 120px 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.root-27 .services-h2 {
  font-size: clamp(40px, 4.5vw, 68px);
  line-height: 1.05;
  letter-spacing: -0.01em;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  color: #1C1C1A;
}

.root-27 .service-item {
  padding: 40px 0;
  border-bottom: 1px solid #DAD7D0;
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 24px;
  align-items: start;
}

.root-27 .service-item:first-child {
  border-top: 1px solid #DAD7D0;
}

.root-27 .service-num {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  color: #8E8C85;
  padding-top: 6px;
}

.root-27 .service-name {
  font-family: 'Bodoni Moda', serif;
  font-size: 26px;
  color: #1C1C1A;
  margin-bottom: 12px;
}

.root-27 .service-desc {
  font-size: 15px;
  line-height: 1.7;
  color: #8E8C85;
}

/* Manifesto / type panel */
.root-27 .manifesto {
  background: #1C1C1A;
  padding: 160px 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
}

.root-27 .manifesto-pull {
  font-family: 'Bodoni Moda', serif;
  font-size: clamp(36px, 4vw, 58px);
  line-height: 1.15;
  color: #E8E6E1;
  max-width: 760px;
  letter-spacing: -0.01em;
}

.root-27 .manifesto-pull em {
  color: #B9B3A7;
  font-style: italic;
}

.root-27 .manifesto-body {
  font-size: 16px;
  line-height: 1.8;
  color: #8E8C85;
  max-width: 540px;
}

/* Work grid */
.root-27 .work-section {
  padding: 120px 64px;
  background: #E8E6E1;
}

.root-27 .work-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  margin-top: 64px;
}

.root-27 .work-cell {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3/4;
  background: #DAD7D0;
}

.root-27 .work-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.root-27 .work-cell:hover img {
  transform: scale(1.04);
}

.root-27 .work-cell-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px 24px;
  background: linear-gradient(to top, rgba(28,28,26,0.85) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.root-27 .work-cell:hover .work-cell-overlay {
  opacity: 1;
}

.root-27 .work-cell-label {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #E8E6E1;
}

/* About */
.root-27 .about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 90vh;
}

.root-27 .about-img {
  position: relative;
  overflow: hidden;
  background: #DAD7D0;
}

.root-27 .about-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.root-27 .about-content {
  background: #E8E6E1;
  padding: 120px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
}

.root-27 .about-h2 {
  font-size: clamp(40px, 4vw, 60px);
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: #1C1C1A;
}

.root-27 .about-text {
  font-size: 16px;
  line-height: 1.85;
  color: #8E8C85;
  max-width: 460px;
}

.root-27 .about-detail {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8E8C85;
  line-height: 2;
}

/* Contact / CTA */
.root-27 .contact {
  background: #DAD7D0;
  padding: 160px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 40px;
}

.root-27 .contact-h2 {
  font-size: clamp(44px, 6vw, 92px);
  line-height: 1.02;
  letter-spacing: -0.015em;
  color: #1C1C1A;
  max-width: 720px;
}

.root-27 .contact-sub {
  font-size: 17px;
  line-height: 1.7;
  color: #8E8C85;
  max-width: 460px;
}

.root-27 .contact-cta {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #E8E6E1;
  background: #33403A;
  text-decoration: none;
  padding: 22px 48px;
  transition: background 0.3s ease;
}

.root-27 .contact-cta:hover {
  background: #1C1C1A;
}

/* Footer */
.root-27 footer {
  background: #1C1C1A;
  padding: 48px 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.root-27 .footer-mark {
  font-family: 'Bodoni Moda', serif;
  font-size: 20px;
  color: #E8E6E1;
  letter-spacing: 0.03em;
}

.root-27 .footer-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.root-27 .footer-link {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8E8C85;
  text-decoration: none;
  transition: color 0.2s;
}

.root-27 .footer-link:hover {
  color: #E8E6E1;
}

.root-27 .footer-copy {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: #8E8C85;
}

/* Large quote panel */
.root-27 .quote-panel {
  padding: 120px 80px;
  background: #E8E6E1;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 80px;
  align-items: center;
}

.root-27 .quote-text {
  font-family: 'Bodoni Moda', serif;
  font-size: clamp(28px, 3vw, 44px);
  line-height: 1.3;
  color: #1C1C1A;
  letter-spacing: -0.01em;
}

.root-27 .quote-text em {
  color: #8E8C85;
  font-style: italic;
}

.root-27 .quote-img {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3/4;
}

.root-27 .quote-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

/* Skip nav */
.root-27 .skip-nav {
  position: absolute;
  top: -999px;
  left: 0;
  background: #33403A;
  color: #E8E6E1;
  padding: 8px 16px;
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  z-index: 999;
  text-decoration: none;
}

.root-27 .skip-nav:focus {
  top: 0;
}

/* Responsive */
@media (max-width: 900px) {
  .root-27 .hero {
    grid-template-columns: 1fr;
  }
  .root-27 .hero-right {
    height: 60vw;
    min-height: 360px;
  }
  .root-27 .hero-left {
    padding: 100px 32px 64px;
  }
  .root-27 .numbers-strip {
    grid-template-columns: repeat(2, 1fr);
  }
  .root-27 .number-cell:nth-child(2) {
    border-right: none;
  }
  .root-27 .services {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .root-27 .services-left {
    padding: 64px 32px 32px;
  }
  .root-27 .services-h2 {
    writing-mode: horizontal-tb;
    transform: none;
  }
  .root-27 .services-right {
    padding: 32px 32px 80px;
  }
  .root-27 .work-grid {
    grid-template-columns: 1fr;
  }
  .root-27 .work-section {
    padding: 80px 32px;
  }
  .root-27 .about {
    grid-template-columns: 1fr;
  }
  .root-27 .about-img {
    height: 70vw;
    min-height: 320px;
  }
  .root-27 .about-content {
    padding: 64px 32px;
  }
  .root-27 .manifesto {
    padding: 80px 32px;
  }
  .root-27 .contact {
    padding: 100px 32px;
  }
  .root-27 .quote-panel {
    grid-template-columns: 1fr;
    padding: 80px 32px;
  }
  .root-27 .progress-rail,
  .root-27 .chapter-label {
    display: none;
  }
  footer.root-27-footer {
    flex-direction: column;
    text-align: center;
  }
  .root-27 nav {
    padding: 20px 24px;
  }
}
`;

/* ─── TYPES ──────────────────────────────────────────────────────── */
interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

interface CurtainImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

/* ─── COMPONENTS ─────────────────────────────────────────────────── */

function SectionReveal({
  children,
  delay = 0,
  className = "",
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, scale: 1.06, y: 24 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 0.1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MonumentalTitle({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { scale: 1.3, opacity: 0, y: 16 }}
      animate={inView ? { scale: 1, opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, delay, ease: [0.16, 0.77, 0.26, 0.99] }}
    >
      {children}
    </motion.div>
  );
}

function CurtainImage({
  src,
  alt,
  className = "",
  style = {},
}: CurtainImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <div ref={ref} className={`curtain-wrap ${className}`} style={style}>
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      {!reduced && (
        <motion.div
          className="curtain-overlay"
          initial={{ scaleX: 1 }}
          animate={inView ? { scaleX: 0 } : {}}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        />
      )}
    </div>
  );
}

/* ─── SCROLL PROGRESS RAIL ───────────────────────────────────────── */
const CHAPTERS = [
  "Intro",
  "Numbers",
  "Craft",
  "Work",
  "Voice",
  "Origin",
  "Contact",
];

function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setProgress(v);
      setActiveChapter(Math.floor(v * CHAPTERS.length));
    });
  }, [scrollYProgress]);

  return (
    <>
      <div className="progress-rail" aria-hidden="true">
        <div className="rail-track" style={{ height: `${progress * 240}px` }} />
        {CHAPTERS.map((_, i) => (
          <div
            key={i}
            className={`rail-tick${Math.floor(progress * CHAPTERS.length) === i ? " active" : ""}`}
          />
        ))}
      </div>
      <div className="chapter-label" aria-hidden="true">
        {CHAPTERS[Math.min(activeChapter, CHAPTERS.length - 1)]}
      </div>
    </>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────────── */
export default function Marbre() {
  return (
    <>
      <style>{STYLES}</style>

      <div
        className="root-27"
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          background: "#E8E6E1",
        }}
      >
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>

        {/* Fixed scroll rail */}
        <ProgressRail />

        {/* ── NAV ── */}
        <nav aria-label="Site navigation">
          <span className="nav-wordmark">Waseem Nasir</span>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="nav-cta"
            aria-label="Book a discovery call"
          >
            Book a Call
          </a>
        </nav>

        <main id="main-content">
          {/* ── HERO ── */}
          <section className="hero" aria-labelledby="hero-heading">
            <div className="hero-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hero-eyebrow"
              >
                SkynetLabs — Est. 2019
              </motion.div>

              <MonumentalTitle>
                <h1 className="hero-h1" id="hero-heading">
                  Built to last
                  <br />
                  longer than
                  <br />
                  the hype.
                </h1>
              </MonumentalTitle>

              <motion.p
                className="hero-sub"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                AI systems, automation engines, and digital infrastructure built
                to eliminate busywork — permanently. Not a template. Not a
                shortcut. Architecture that holds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="hero-cta"
                >
                  Reserve 30 Minutes
                  <span aria-hidden="true">→</span>
                </a>
              </motion.div>
            </div>

            {/* Hero image with curtain wipe */}
            <div className="hero-right">
              <CurtainImage
                src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                alt="Waseem Nasir — founder of SkynetLabs"
                style={{ height: "100%" }}
              />
            </div>
          </section>

          {/* ── NUMBERS STRIP ── */}
          <section aria-label="Credentials and track record">
            <div className="numbers-strip">
              {[
                { val: "180+", label: "Builds Shipped" },
                { val: "40+", label: "Clients Served" },
                { val: "9", label: "Countries Operated" },
                { val: "2019", label: "Year Founded" },
              ].map(({ val, label }, i) => (
                <SectionReveal key={label} delay={i * 0.08}>
                  <div className="number-cell">
                    <span className="number-val">{val}</span>
                    <span className="number-label">{label}</span>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </section>

          {/* ── SERVICES ── */}
          <section className="services" aria-labelledby="services-heading">
            <div className="services-left">
              <MonumentalTitle>
                <h2 className="services-h2" id="services-heading">
                  What I Build
                </h2>
              </MonumentalTitle>
            </div>
            <div className="services-right">
              <SectionReveal delay={0.1}>
                <div className="chapter-heading">
                  <span className="ruled-line" aria-hidden="true" />
                  Disciplines
                </div>
              </SectionReveal>

              {[
                {
                  n: "01",
                  name: "AI Automation Systems",
                  desc: "n8n-based pipelines that turn scattered triggers into precise, reliable outcomes. Lead routing, follow-up sequences, document generation — running without you.",
                },
                {
                  n: "02",
                  name: "WhatsApp & Voice Bots",
                  desc: "Conversational agents that handle first contact, triage, and booking — across WhatsApp and telephony — so no enquiry goes cold at 2 AM.",
                },
                {
                  n: "03",
                  name: "AEO & Answer Architecture",
                  desc: "Structured content frameworks engineered for AI-generated search results. Your expertise, surfaced where decisions happen.",
                },
                {
                  n: "04",
                  name: "Next.js Product Builds",
                  desc: "Full-stack web products: dashboards, client portals, booking flows, and internal tooling — shipped at pace, built to last.",
                },
                {
                  n: "05",
                  name: "Ops Infra & Integration",
                  desc: "CRM wiring, webhook fabrics, Notion/Airtable/Slack pipelines — the connective tissue between your stack's moving parts.",
                },
              ].map(({ n, name, desc }, i) => (
                <SectionReveal key={n} delay={i * 0.07}>
                  <div className="service-item">
                    <span className="service-num mono">{n}</span>
                    <div>
                      <div className="service-name">{name}</div>
                      <p className="service-desc">{desc}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </section>

          {/* ── MANIFESTO / TYPE PANEL ── */}
          <section className="manifesto" aria-label="Philosophy">
            <SectionReveal>
              <div className="chapter-heading" style={{ color: "#B9B3A7" }}>
                <span
                  className="ruled-line"
                  style={{ background: "#B9B3A7" }}
                  aria-hidden="true"
                />
                On Building
              </div>
            </SectionReveal>

            <MonumentalTitle delay={0.1}>
              <p className="manifesto-pull">
                Most automation breaks the moment someone touches it.{" "}
                <em>Mine is designed for the moment after that.</em>
              </p>
            </MonumentalTitle>

            <SectionReveal delay={0.3}>
              <p className="manifesto-body">
                Seven years of production systems across nine countries teach
                you one thing: architecture is either honest or it isn't. Honest
                systems survive handoffs, edge cases, and scale. Everything else
                is just impressive until it isn't.
              </p>
            </SectionReveal>
          </section>

          {/* ── WORK GRID ── */}
          <section className="work-section" aria-labelledby="work-heading">
            <SectionReveal>
              <div className="chapter-heading">
                <span className="ruled-line" aria-hidden="true" />
                Selected Work
              </div>
            </SectionReveal>
            <MonumentalTitle>
              <h2
                id="work-heading"
                style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontSize: "clamp(36px, 4vw, 56px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                  color: "#1C1C1A",
                  marginBottom: 0,
                }}
              >
                Proof in the field.
              </h2>
            </MonumentalTitle>

            <div className="work-grid">
              {[
                {
                  src: "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
                  label: "Bali / Client Systems",
                },
                {
                  src: "/img/pro/WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
                  label: "Remote / n8n Automation",
                },
                {
                  src: "/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
                  label: "Lahore / Product Builds",
                },
                {
                  src: "/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                  label: "Bali / AEO Architecture",
                },
                {
                  src: "/img/pro/CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg",
                  label: "Night Sessions / Deep Work",
                },
                {
                  src: "/img/pro/EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                  label: "Bali / Community Events",
                },
              ].map(({ src, label }, i) => (
                <SectionReveal key={src} delay={i * 0.06}>
                  <div className="work-cell">
                    <CurtainImage
                      src={src}
                      alt={label}
                      style={{ height: "100%" }}
                    />
                    <div className="work-cell-overlay">
                      <span className="work-cell-label">{label}</span>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </section>

          {/* ── QUOTE PANEL ── */}
          <section className="quote-panel" aria-label="Perspective">
            <SectionReveal>
              <div>
                <div className="chapter-heading" style={{ marginBottom: 40 }}>
                  <span className="ruled-line" aria-hidden="true" />
                  Working Philosophy
                </div>
                <blockquote className="quote-text">
                  "Every missed lead, unanswered message, and manual data entry
                  is a tax.{" "}
                  <em>I build the systems that stop collecting it.</em>"
                  <footer
                    style={{
                      marginTop: 32,
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#8E8C85",
                    }}
                  >
                    — Waseem Nasir, SkynetLabs
                  </footer>
                </blockquote>
              </div>
            </SectionReveal>

            <CurtainImage
              src="/img/pro/LIFESTYLE-2026-05-18-black-bandhgala-sunglasses-phone-cafe-table.jpg"
              alt="Waseem Nasir at work"
              className="quote-img"
            />
          </section>

          {/* ── ABOUT ── */}
          <section className="about" aria-labelledby="about-heading">
            <div className="about-img">
              <CurtainImage
                src="/img/pro/PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg"
                alt="Waseem Nasir — independent founder, SkynetLabs"
                style={{ height: "100%" }}
              />
            </div>
            <div className="about-content">
              <SectionReveal>
                <div className="chapter-heading">
                  <span className="ruled-line" aria-hidden="true" />
                  The Founder
                </div>
              </SectionReveal>

              <MonumentalTitle>
                <h2 className="about-h2" id="about-heading">
                  Standing since
                  <br />
                  2019.
                </h2>
              </MonumentalTitle>

              <SectionReveal delay={0.2}>
                <p className="about-text">
                  Waseem Nasir. Independent founder of SkynetLabs. I build AI
                  automation and digital infrastructure for founders and
                  operators who have no tolerance for busywork. Clients across
                  nine countries. 180+ systems shipped. Headquartered wherever
                  the work demands — currently between Bali and Lahore.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.3}>
                <div className="about-detail">
                  <div>n8n · Next.js · WhatsApp API · AEO</div>
                  <div>Remote-first · Bali / Lahore</div>
                  <div>github.com/waseemnasir2k26</div>
                </div>
              </SectionReveal>

              {/* Extra photo grid */}
              <SectionReveal delay={0.35}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 4,
                    marginTop: 8,
                  }}
                >
                  {[
                    {
                      src: "/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                      alt: "Nusa Penida, Indonesia",
                    },
                    {
                      src: "/img/pro/TRAVEL-google-office-sign-cream-outfit.jpg",
                      alt: "Google Singapore office",
                    },
                  ].map(({ src, alt }) => (
                    <CurtainImage
                      key={src}
                      src={src}
                      alt={alt}
                      style={{ aspectRatio: "1", overflow: "hidden" }}
                    />
                  ))}
                </div>
              </SectionReveal>
            </div>
          </section>

          {/* ── CONTACT / CTA ── */}
          <section className="contact" aria-labelledby="contact-heading">
            <SectionReveal>
              <div
                className="chapter-heading"
                style={{ justifyContent: "center" }}
              >
                <span className="ruled-line" aria-hidden="true" />
                Next Step
                <span className="ruled-line" aria-hidden="true" />
              </div>
            </SectionReveal>

            <MonumentalTitle>
              <h2 className="contact-h2" id="contact-heading">
                Ready to stop
                <br />
                patching gaps?
              </h2>
            </MonumentalTitle>

            <SectionReveal delay={0.2}>
              <p className="contact-sub">
                Thirty minutes. We map where your operation leaks time and
                money. I tell you exactly what to build and in what order. No
                pitch deck. No retainer unless it makes sense.
              </p>
            </SectionReveal>

            <SectionReveal delay={0.3}>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="contact-cta"
                aria-label="Book a 30-minute discovery call with Waseem Nasir"
              >
                Book the 30-Minute Call
                <span aria-hidden="true">→</span>
              </a>
            </SectionReveal>

            <SectionReveal delay={0.4}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 4,
                  marginTop: 16,
                  width: "100%",
                  maxWidth: 600,
                }}
              >
                {[
                  {
                    src: "/img/pro/CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
                    alt: "Work setup",
                  },
                  {
                    src: "/img/pro/PORTRAIT-travertine-wall-sky-headshot-flowers.jpg",
                    alt: "Waseem Nasir portrait",
                  },
                  {
                    src: "/img/pro/CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
                    alt: "Garden cafe session",
                  },
                ].map(({ src, alt }) => (
                  <CurtainImage
                    key={src}
                    src={src}
                    alt={alt}
                    style={{ aspectRatio: "3/4", overflow: "hidden" }}
                  />
                ))}
              </div>
            </SectionReveal>
          </section>
        </main>

        {/* ── FOOTER ── */}
        <footer
          style={{
            background: "#1C1C1A",
            padding: "48px 64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span className="footer-mark">Marbre — Waseem Nasir</span>
          <div className="footer-links">
            <a
              href="https://github.com/waseemnasir2k26"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
            >
              GitHub
            </a>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="footer-link"
              aria-label="Book a call"
            >
              Book a Call
            </a>
          </div>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.1em",
              color: "#8E8C85",
            }}
          >
            SkynetLabs &copy; {new Date().getFullYear()}
          </span>
        </footer>
      </div>
    </>
  );
}
