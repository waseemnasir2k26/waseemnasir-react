"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

/* ─── palette ─────────────────────────────────────────── */
const C = {
  bg: "#F4F1EA",
  surface: "#FFFFFF",
  text: "#1A1A18",
  muted: "#8C887E",
  accent: "#3D3A34",
  accent2: "#B7A98B",
} as const;

/* ─── images (real filenames only) ────────────────────── */
const IMGS = {
  hero: "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
  about1:
    "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
  about2: "PORTRAIT-travertine-wall-sky-headshot-flowers.jpg",
  work1: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  work2: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  work3: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  work4: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
  travel1: "TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
  travel2: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  lifestyle: "LIFESTYLE-2026-03-29-night-cafe-armchair-relaxed-gaze.jpg",
  event: "EVENT-expo-booth-navy-polo-chandelier-hall.jpg",
  portrait: "PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg",
} as const;

/* ─── per-letter mask-reveal ───────────────────────────── */
function MaskText({
  text,
  tag = "span",
  staggerMs = 60,
  className = "",
  delay = 0,
}: {
  text: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  staggerMs?: number;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const Tag = tag as React.ElementType;
  const letters = text.split("");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      className={className}
      aria-label={text}
      style={{ display: "flex", flexWrap: "wrap", gap: 0 }}
    >
      {letters.map((ch, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            lineHeight: 1.15,
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              delay: delay + (i * staggerMs) / 1000,
              type: "spring",
              stiffness: 200,
              damping: 28,
              mass: 0.6,
            }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ─── portrait with scale-settle ──────────────────────── */
function PortraitSettle({
  src,
  alt,
  style = {},
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.img
      src={`/img/pro/${src}`}
      alt={alt}
      initial={reduced ? false : { scale: 1.04, opacity: 0 }}
      animate={{ scale: 1.0, opacity: 1 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        ...style,
      }}
    />
  );
}

/* ─── fade-in on scroll ────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── scroll progress rail ─────────────────────────────── */
function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: C.accent2,
        transformOrigin: "0%",
        scaleX,
        zIndex: 200,
      }}
    />
  );
}

/* ─── services data ────────────────────────────────────── */
const SERVICES = [
  {
    num: "01",
    title: "AI Automation Systems",
    body: "n8n workflows that replace repetitive ops. Lead capture, follow-up, scheduling — running without you.",
  },
  {
    num: "02",
    title: "Voice & WhatsApp Bots",
    body: "Conversational agents that answer, qualify, and route. Built for clinics, agencies, freight ops.",
  },
  {
    num: "03",
    title: "AEO & Answer Architecture",
    body: "Structured content so AI search surfaces you first. Schema, citations, entity authority.",
  },
  {
    num: "04",
    title: "Next.js Products",
    body: "Fast, deployable web products. Funnels, dashboards, client portals. Shipped in days, not months.",
  },
];

/* ─── selected work ────────────────────────────────────── */
const WORK = [
  {
    label: "AI Receptionist",
    sub: "Voice bot replacing a full-time front desk. Clinic, US.",
    img: IMGS.work1,
  },
  {
    label: "Freight Ops Automation",
    sub: "WhatsApp-first lead system. 40+ trucking dispatchers.",
    img: IMGS.work2,
  },
  {
    label: "AEO Engine v0.7",
    sub: "Answer engine for a solo founder. AI search now cites the site.",
    img: IMGS.work3,
  },
  {
    label: "E-commerce Automation",
    sub: "Order → fulfilment → follow-up. Zero manual touch.",
    img: IMGS.work4,
  },
];

/* ─── main component ───────────────────────────────────── */
export default function MaisonBlanc() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* scoped fonts + base */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,1,300&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap');

        .mb-root {
          background: ${C.bg};
          color: ${C.text};
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .mb-root *, .mb-root *::before, .mb-root *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .mb-root .serif {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 300;
        }
        .mb-root .mono {
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 400;
        }
        .mb-root .italic {
          font-style: italic;
        }
        .mb-root section {
          position: relative;
        }

        /* Museum gutters — 18vw each side */
        .mb-root .museum {
          padding-left: 18vw;
          padding-right: 18vw;
        }
        @media (max-width: 900px) {
          .mb-root .museum {
            padding-left: 6vw;
            padding-right: 6vw;
          }
        }

        /* nav */
        .mb-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 18vw;
          background: ${C.bg};
          border-bottom: 1px solid transparent;
          transition: border-color 0.4s;
          mix-blend-mode: normal;
        }
        .mb-nav.scrolled {
          border-color: ${C.accent2}40;
        }
        @media (max-width: 900px) {
          .mb-nav { padding: 20px 6vw; }
        }
        .mb-nav-logo {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 300;
          font-size: 13px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${C.text};
          text-decoration: none;
        }
        .mb-nav-cta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: ${C.muted};
          text-decoration: none;
          border-bottom: 1px solid ${C.accent2};
          padding-bottom: 2px;
          transition: color 0.2s;
        }
        .mb-nav-cta:hover, .mb-nav-cta:focus-visible {
          color: ${C.text};
          outline: none;
        }

        /* divider */
        .mb-rule {
          width: 100%;
          height: 1px;
          background: ${C.accent2}50;
          border: none;
        }

        /* label caps */
        .mb-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${C.muted};
        }

        /* link underline */
        .mb-link {
          color: ${C.text};
          text-decoration: none;
          border-bottom: 1px solid ${C.accent2};
          transition: border-color 0.2s;
        }
        .mb-link:hover, .mb-link:focus-visible {
          border-color: ${C.text};
          outline: none;
        }

        /* CTA button */
        .mb-cta-btn {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${C.bg};
          background: ${C.accent};
          text-decoration: none;
          padding: 14px 36px;
          transition: background 0.25s, color 0.25s;
        }
        .mb-cta-btn:hover, .mb-cta-btn:focus-visible {
          background: ${C.text};
          outline: 2px solid ${C.accent2};
          outline-offset: 3px;
        }

        /* service row */
        .mb-service-row {
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: 0 32px;
          padding: 40px 0;
          border-bottom: 1px solid ${C.accent2}40;
          align-items: start;
        }
        .mb-service-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: ${C.accent2};
          letter-spacing: 0.06em;
          padding-top: 4px;
        }
        .mb-service-title {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 300;
          font-size: clamp(18px, 2.2vw, 26px);
          margin-bottom: 10px;
          color: ${C.text};
        }
        .mb-service-body {
          font-size: 14px;
          color: ${C.muted};
          line-height: 1.65;
          max-width: 480px;
        }

        /* work grid */
        .mb-work-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }
        @media (max-width: 700px) {
          .mb-work-grid { grid-template-columns: 1fr; }
        }
        .mb-work-item {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4/5;
          background: ${C.surface};
        }
        .mb-work-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mb-work-item:hover img {
          transform: scale(1.03);
        }
        .mb-work-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px 20px 20px;
          background: linear-gradient(to top, ${C.text}cc 0%, transparent 100%);
        }
        .mb-work-caption-label {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 300;
          font-size: 15px;
          color: ${C.bg};
          display: block;
          margin-bottom: 4px;
        }
        .mb-work-caption-sub {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: ${C.accent2};
          letter-spacing: 0.06em;
        }

        /* stat */
        .mb-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: ${C.accent2}40;
        }
        @media (max-width: 700px) {
          .mb-stats { grid-template-columns: 1fr 1fr; }
        }
        .mb-stat {
          background: ${C.bg};
          padding: 40px 28px;
        }
        .mb-stat-num {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 300;
          font-size: clamp(36px, 4vw, 52px);
          color: ${C.text};
          display: block;
          margin-bottom: 6px;
        }
        .mb-stat-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${C.muted};
        }

        /* about two-col */
        .mb-about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          align-items: stretch;
        }
        @media (max-width: 700px) {
          .mb-about-grid { grid-template-columns: 1fr; }
        }
        .mb-about-img {
          aspect-ratio: 3/4;
          overflow: hidden;
        }
        .mb-about-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 48px;
          background: ${C.surface};
        }
        @media (max-width: 900px) {
          .mb-about-copy { padding: 32px 24px; }
        }

        /* footer */
        .mb-footer {
          border-top: 1px solid ${C.accent2}50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        /* skip link */
        .mb-skip {
          position: absolute;
          left: -9999px;
          z-index: 9999;
        }
        .mb-skip:focus {
          left: 18vw;
          top: 80px;
          background: ${C.accent};
          color: ${C.bg};
          padding: 8px 16px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
        }
      `}</style>

      <div
        className="mb-root"
        style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}
      >
        <a href="#main-content" className="mb-skip">
          Skip to content
        </a>

        <ScrollRail />

        {/* ── NAV ── */}
        <NavBar />

        <main id="main-content">
          {/* ── HERO ── */}
          <section
            style={{
              minHeight: "100vh",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              paddingTop: 0,
            }}
          >
            {/* left: copy */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "0 6vw 10vh 18vw",
              }}
            >
              {mounted && (
                <>
                  <p className="mb-label" style={{ marginBottom: 32 }}>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                    >
                      Waseem Nasir — SkynetLabs
                    </motion.span>
                  </p>

                  <h1
                    className="serif"
                    style={{
                      fontSize: "clamp(28px, 3.8vw, 56px)",
                      fontWeight: 300,
                      lineHeight: 1.18,
                      letterSpacing: "-0.01em",
                      color: C.text,
                      marginBottom: 36,
                    }}
                  >
                    <MaskText
                      text="I build the systems"
                      tag="span"
                      staggerMs={52}
                      delay={0.3}
                    />
                    <br />
                    <MaskText
                      text="that quietly run"
                      tag="span"
                      staggerMs={52}
                      className="italic"
                      delay={0.65}
                    />
                    <br />
                    <MaskText
                      text="the company."
                      tag="span"
                      staggerMs={52}
                      delay={0.98}
                    />
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 1.6,
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      fontSize: 13,
                      color: C.muted,
                      marginBottom: 48,
                      fontFamily: "'IBM Plex Mono', monospace",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Since 2019. 180+ builds. 40+ clients. 9 countries.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.9, duration: 0.7 }}
                  >
                    <a
                      href="https://skynetjoe.com/discovery-call"
                      className="mb-cta-btn"
                      aria-label="Book a 30-minute discovery call"
                    >
                      Book a call
                    </a>
                  </motion.div>
                </>
              )}
            </div>

            {/* right: portrait */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: "100vh",
              }}
            >
              {mounted && (
                <PortraitSettle
                  src={IMGS.hero}
                  alt="Waseem Nasir — founder, SkynetLabs"
                  style={{ position: "absolute", inset: 0 }}
                />
              )}
              {/* caption bottom-left of image */}
              <motion.span
                className="mb-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.8 }}
                style={{
                  position: "absolute",
                  bottom: 32,
                  left: 24,
                  color: C.bg,
                  letterSpacing: "0.18em",
                  fontSize: 9,
                }}
              >
                Remote — Bali / Lahore
              </motion.span>
            </div>
          </section>

          {/* ── STATS ── */}
          <section aria-label="Proof of work">
            <div className="mb-stats">
              {[
                { num: "180+", label: "Builds shipped" },
                { num: "40+", label: "Clients served" },
                { num: "9", label: "Countries worked from" },
                { num: "2019", label: "Year founded" },
              ].map((s, i) => (
                <FadeUp key={s.label} delay={i * 0.08}>
                  <div className="mb-stat">
                    <span className="mb-stat-num serif">{s.num}</span>
                    <span className="mb-stat-label">{s.label}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>

          {/* ── DECLARATION ── */}
          <section
            className="museum"
            style={{ paddingTop: "14vh", paddingBottom: "14vh" }}
            aria-label="Approach"
          >
            <FadeUp>
              <p className="mb-label" style={{ marginBottom: 28 }}>
                Approach
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p
                className="serif italic"
                style={{
                  fontSize: "clamp(22px, 3.2vw, 46px)",
                  fontWeight: 300,
                  lineHeight: 1.35,
                  color: C.text,
                  maxWidth: "720px",
                }}
              >
                "Most founders spend forty hours a week on work a machine can do
                in four minutes. That is the gap I build into."
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p
                style={{
                  marginTop: 32,
                  fontSize: 13,
                  color: C.muted,
                  maxWidth: 480,
                  lineHeight: 1.7,
                }}
              >
                AI automation. WhatsApp bots. Voice agents. AEO infrastructure.
                The stack varies — the outcome does not: less friction between
                your business and its revenue.
              </p>
            </FadeUp>
          </section>

          <hr className="mb-rule" />

          {/* ── SERVICES ── */}
          <section
            className="museum"
            style={{ paddingTop: "10vh", paddingBottom: "10vh" }}
            aria-label="Services"
          >
            <FadeUp>
              <p className="mb-label" style={{ marginBottom: 48 }}>
                What I build
              </p>
            </FadeUp>
            {SERVICES.map((s, i) => (
              <FadeUp key={s.num} delay={i * 0.07}>
                <div className="mb-service-row">
                  <span className="mb-service-num">{s.num}</span>
                  <div>
                    <h2 className="mb-service-title">{s.title}</h2>
                    <p className="mb-service-body">{s.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </section>

          {/* ── SELECTED WORK ── */}
          <section aria-label="Selected work">
            <div
              className="museum"
              style={{ paddingTop: "10vh", paddingBottom: "40px" }}
            >
              <FadeUp>
                <p className="mb-label">Selected work</p>
              </FadeUp>
            </div>
            <div className="mb-work-grid">
              {WORK.map((w, i) => (
                <FadeUp key={w.label} delay={i * 0.06}>
                  <div className="mb-work-item">
                    <img src={`/img/pro/${w.img}`} alt={w.label} />
                    <div className="mb-work-caption">
                      <span className="mb-work-caption-label">{w.label}</span>
                      <span className="mb-work-caption-sub">{w.sub}</span>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>

          {/* ── TRAVEL / PLACE STRIP ── */}
          <section
            aria-label="Context — where the work happens"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "2px",
              marginTop: "2px",
            }}
          >
            {[
              {
                img: IMGS.travel1,
                alt: "Mountain ridge — Kyrgyzstan",
                cap: "Lahore",
              },
              { img: IMGS.lifestyle, alt: "Night cafe — Bali", cap: "Bali" },
              {
                img: IMGS.travel2,
                alt: "Nusa Penida cliffs",
                cap: "Nusa Penida",
              },
            ].map((p, i) => (
              <FadeUp key={p.cap} delay={i * 0.08}>
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "3/4",
                  }}
                >
                  <img
                    src={`/img/pro/${p.img}`}
                    alt={p.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <span
                    className="mb-label"
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      color: C.bg,
                      fontSize: 9,
                      letterSpacing: "0.2em",
                    }}
                  >
                    {p.cap}
                  </span>
                </div>
              </FadeUp>
            ))}
          </section>

          {/* ── ABOUT ── */}
          <section aria-label="About Waseem Nasir" style={{ marginTop: "2px" }}>
            <div className="mb-about-grid">
              <div className="mb-about-img">
                <PortraitSettle
                  src={IMGS.about1}
                  alt="Waseem Nasir — arms crossed, confident"
                />
              </div>
              <div className="mb-about-copy">
                <FadeUp>
                  <p className="mb-label" style={{ marginBottom: 28 }}>
                    Founder
                  </p>
                </FadeUp>
                <FadeUp delay={0.08}>
                  <h2
                    className="serif"
                    style={{
                      fontSize: "clamp(22px, 2.8vw, 38px)",
                      fontWeight: 300,
                      lineHeight: 1.28,
                      marginBottom: 24,
                      color: C.text,
                    }}
                  >
                    Waseem Nasir
                  </h2>
                </FadeUp>
                <FadeUp delay={0.12}>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.muted,
                      lineHeight: 1.75,
                      marginBottom: 20,
                    }}
                  >
                    Independent. Since 2019. Ships AI and automation
                    infrastructure for founders and operators who have run out
                    of hours. Not a studio — one person with a narrow, deep
                    focus.
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.muted,
                      lineHeight: 1.75,
                      marginBottom: 20,
                    }}
                  >
                    Built across clinics, freight ops, e-commerce, agencies.
                    Deployed n8n, Next.js, voice bots, WhatsApp flows, and AEO
                    content engines. 180+ builds without a sales team or ad
                    budget.
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.muted,
                      lineHeight: 1.75,
                      marginBottom: 36,
                    }}
                  >
                    Works from Bali and Lahore. Available to qualified clients.
                  </p>
                </FadeUp>
                <FadeUp delay={0.16}>
                  <a
                    href="https://github.com/waseemnasir2k26"
                    className="mb-link mono"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 11, letterSpacing: "0.08em" }}
                  >
                    github.com/waseemnasir2k26
                  </a>
                </FadeUp>
              </div>
            </div>

            {/* second about image — full bleed strip */}
            <div
              style={{ height: "56vh", overflow: "hidden", marginTop: "2px" }}
            >
              <FadeUp>
                <img
                  src={`/img/pro/${IMGS.event}`}
                  alt="Waseem Nasir at industry event"
                  style={{
                    width: "100%",
                    height: "56vh",
                    objectFit: "cover",
                    display: "block",
                    objectPosition: "center 30%",
                  }}
                />
              </FadeUp>
            </div>
          </section>

          {/* ── ADDITIONAL PORTRAIT ── */}
          <section
            style={{ display: "grid", gridTemplateColumns: "18vw 1fr 18vw" }}
          >
            <div style={{ background: C.bg }} />
            <div style={{ paddingTop: "10vh", paddingBottom: "10vh" }}>
              <FadeUp>
                <div style={{ aspectRatio: "3/4", overflow: "hidden" }}>
                  <PortraitSettle
                    src={IMGS.portrait}
                    alt="Waseem Nasir — beige tracksuit, glass building"
                  />
                </div>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p
                  className="serif italic"
                  style={{
                    fontSize: "clamp(16px, 2vw, 22px)",
                    fontWeight: 300,
                    color: C.muted,
                    textAlign: "center",
                    marginTop: 24,
                    letterSpacing: "0.01em",
                  }}
                >
                  The restraint is the design.
                </p>
              </FadeUp>
            </div>
            <div style={{ background: C.bg }} />
          </section>

          <hr className="mb-rule" />

          {/* ── CONTACT / CTA ── */}
          <section
            className="museum"
            style={{ paddingTop: "14vh", paddingBottom: "14vh" }}
            aria-label="Contact"
          >
            <FadeUp>
              <p className="mb-label" style={{ marginBottom: 32 }}>
                Book a call
              </p>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2
                className="serif"
                style={{
                  fontSize: "clamp(26px, 4vw, 58px)",
                  fontWeight: 300,
                  lineHeight: 1.2,
                  color: C.text,
                  marginBottom: 24,
                  maxWidth: 640,
                }}
              >
                Thirty minutes. No pitch deck. Just the problem.
              </h2>
            </FadeUp>
            <FadeUp delay={0.14}>
              <p
                style={{
                  fontSize: 14,
                  color: C.muted,
                  marginBottom: 44,
                  maxWidth: 440,
                  lineHeight: 1.7,
                }}
              >
                If the fit is right, I will tell you in the first ten minutes
                what the automation looks like and roughly what it costs. No
                follow-up sequence. No deck.
              </p>
            </FadeUp>
            <FadeUp delay={0.18}>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="mb-cta-btn"
                aria-label="Book a 30-minute discovery call with Waseem Nasir"
              >
                Book a 30-minute call
              </a>
            </FadeUp>
          </section>

          {/* ── FOOTER ── */}
          <footer
            className="museum mb-footer"
            style={{ paddingTop: 36, paddingBottom: 36 }}
          >
            <span className="mb-label" style={{ fontSize: 9 }}>
              &copy; {new Date().getFullYear()} SkynetLabs — Waseem Nasir
            </span>
            <span className="mb-label" style={{ fontSize: 9 }}>
              Remote. AI + Automation.
            </span>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="mb-nav-cta"
              aria-label="Book a discovery call"
            >
              Discovery call
            </a>
          </footer>
        </main>
      </div>
    </>
  );
}

/* ─── scroll-aware nav ─────────────────────────────────── */
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <nav
      className={`mb-nav${scrolled ? " scrolled" : ""}`}
      aria-label="Main navigation"
    >
      <a
        href="https://skynetjoe.com"
        className="mb-nav-logo"
        aria-label="SkynetLabs — home"
      >
        SkynetLabs
      </a>
      <a
        href="https://skynetjoe.com/discovery-call"
        className="mb-nav-cta"
        aria-label="Book a discovery call"
      >
        Book a call
      </a>
    </nav>
  );
}
