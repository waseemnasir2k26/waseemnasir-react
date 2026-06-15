"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
  AnimatePresence,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN 24 — Encre
   High-fashion editorial spread / Vogue contents-page
   Palette: #0E0E0C bg · #17160F surface · #F2EFE6 text · #807A6B muted
            #C9A24B accent (gold) · #5B5546 accent2
   Fonts: Playfair Display (display) · Inter (body) · JetBrains Mono (mono)
   Layout: Asymmetric magazine grid, folio numbers in margins, drop-cap openers
   Motion: Headlines + kicker counter-scroll; gold hairlines draw on enter
───────────────────────────────────────────────────────────────────────────── */

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap";

const CTA = "https://skynetjoe.com/discovery-call";
const GITHUB = "https://github.com/waseemnasir2k26";

/* ── palette tokens ── */
const P = {
  bg: "#0E0E0C",
  surface: "#17160F",
  text: "#F2EFE6",
  muted: "#807A6B",
  accent: "#C9A24B",
  accent2: "#5B5546",
};

/* ── editorial sections ── */
const CONTENTS = [
  { folio: "06", label: "opening", title: "The Invisible Machine" },
  { folio: "12", label: "proof", title: "Numbers on Record" },
  { folio: "18", label: "craft", title: "What Gets Built" },
  { folio: "28", label: "selected work", title: "Eight Studies" },
  { folio: "36", label: "founder", title: "On the Road Since 2019" },
  { folio: "44", label: "contact", title: "Book Thirty Minutes" },
];

const SERVICES = [
  {
    num: "I",
    title: "AI Automation",
    body: "n8n workflows that intercept every dead follow-up, missed lead, and manual hand-off before they cost you a client. Designed to run silent.",
  },
  {
    num: "II",
    title: "WhatsApp & Voice Bots",
    body: "Conversational agents that qualify, book, and respond across WhatsApp and phone — in any timezone, without a human in the loop.",
  },
  {
    num: "III",
    title: "AEO Systems",
    body: "Answer-engine optimisation: structured content architecture that earns citations from AI search before your competitors notice the game changed.",
  },
  {
    num: "IV",
    title: "Next.js Builds",
    body: "Performance-obsessed web systems — SSR, edge-deployed, CMS-wired, and ship-ready in weeks rather than quarters.",
  },
];

const WORK_STUDIES = [
  {
    no: "01",
    client: "FreightOps",
    geo: "United States",
    outcome: "AI voice receptionist handles after-hours trucking inquiries",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    orientation: "landscape",
  },
  {
    no: "02",
    client: "Inspire Health PT",
    geo: "United States",
    outcome: "$27 funnel live; WhatsApp bot books Zocdoc appointments",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    orientation: "landscape",
  },
  {
    no: "03",
    client: "IdeaViaggi",
    geo: "Italy",
    outcome: "Custom trip-input CPT with per-customer visibility gating",
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    orientation: "landscape",
  },
  {
    no: "04",
    client: "TakyCorp",
    geo: "France",
    outcome: "Email automation engine — 12-day nurture sequences at scale",
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    orientation: "landscape",
  },
];

/* ── hairline draw component ── */
function Hairline({
  delay = 0,
  color = P.accent,
  vertical = false,
  length = "100%",
  thickness = 1,
  className = "",
}: {
  delay?: number;
  color?: string;
  vertical?: boolean;
  length?: string;
  thickness?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        width: vertical ? `${thickness}px` : length,
        height: vertical ? length : `${thickness}px`,
        background: "transparent",
      }}
    >
      <motion.div
        initial={{ scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }}
        animate={
          inView || reduced
            ? { scaleX: 1, scaleY: 1 }
            : { scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }
        }
        transition={{
          duration: reduced ? 0 : 0.9,
          delay,
          ease: [0.25, 0, 0, 1],
        }}
        style={{
          position: "absolute",
          inset: 0,
          background: color,
          transformOrigin: vertical ? "top center" : "left center",
        }}
      />
    </div>
  );
}

/* ── folio number ── */
function Folio({
  num,
  side = "left",
}: {
  num: string;
  side?: "left" | "right";
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "clamp(3rem, 8vw, 7rem)",
        fontWeight: 400,
        color: P.accent2,
        lineHeight: 1,
        opacity: 0.18,
        userSelect: "none",
        letterSpacing: "-0.04em",
        writingMode: "vertical-rl",
        textOrientation: "mixed",
        position: "absolute",
        [side]: "-1.2rem",
        top: "50%",
        transform: `${side === "right" ? "rotate(180deg)" : ""} translateY(-50%)`,
      }}
    >
      {num}
    </div>
  );
}

/* ── drop cap paragraph ── */
function DropCapParagraph({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <p
      className="encre-dropcap"
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
        lineHeight: 1.75,
        color: P.text,
        fontStyle: "italic",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/* ── section label ── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.65rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: P.accent,
      }}
    >
      {children}
    </span>
  );
}

/* ── stat block ── */
function Stat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div
      ref={ref}
      style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
    >
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2.4rem, 5vw, 4rem)",
          fontWeight: 900,
          color: P.accent,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </motion.span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: P.muted,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function Encre() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  /* scroll-driven hero parallax */
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  /* headline scrolls DOWN, kicker scrolls UP — counter-scroll */
  const headlineY = useTransform(
    heroScroll,
    [0, 1],
    reduced ? [0, 0] : [0, 60],
  );
  const kickerY = useTransform(heroScroll, [0, 1], reduced ? [0, 0] : [0, -40]);
  const heroImgY = useTransform(heroScroll, [0, 1], reduced ? [0, 0] : [0, 80]);
  const heroOpacity = useTransform(heroScroll, [0.6, 1], [1, 0]);

  /* ── magazine-style section refs for hairline triggers ── */
  const proofRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  return (
    <div className="root-24" ref={containerRef}>
      <style>{`
        @import url('${FONT_URL}');

        .root-24 {
          font-family: 'Inter', sans-serif;
          background: ${P.bg};
          color: ${P.text};
          min-height: 100vh;
          position: relative;
          z-index: 2;
          overflow-x: hidden;
        }

        /* drop cap */
        .root-24 .encre-dropcap::first-letter {
          font-family: 'Playfair Display', serif;
          font-size: 4.5em;
          font-weight: 900;
          font-style: normal;
          float: left;
          line-height: 0.8;
          margin-right: 0.08em;
          margin-top: 0.06em;
          color: ${P.accent};
        }

        .root-24 a:focus-visible {
          outline: 2px solid ${P.accent};
          outline-offset: 3px;
          border-radius: 2px;
        }

        /* magazine text columns */
        .root-24 .two-col {
          columns: 2;
          column-gap: 3rem;
        }

        @media (max-width: 768px) {
          .root-24 .two-col {
            columns: 1;
          }
        }

        /* folio spine */
        .root-24 .folio-wrap {
          position: relative;
        }

        /* work grid */
        .root-24 .work-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: ${P.accent2};
        }
        @media (max-width: 640px) {
          .root-24 .work-grid {
            grid-template-columns: 1fr;
          }
        }

        /* service list */
        .root-24 .service-row {
          display: grid;
          grid-template-columns: 2rem 1fr 2fr;
          gap: 2rem;
          align-items: start;
          padding: 2rem 0;
          border-bottom: 1px solid ${P.accent2};
        }
        @media (max-width: 640px) {
          .root-24 .service-row {
            grid-template-columns: 1.5rem 1fr;
            gap: 1rem;
          }
          .root-24 .service-body {
            grid-column: 1 / -1;
          }
        }

        /* contents page list */
        .root-24 .contents-row {
          display: grid;
          grid-template-columns: 3rem 1fr auto;
          gap: 1.5rem;
          align-items: baseline;
          padding: 0.9rem 0;
          border-bottom: 1px solid ${P.accent2}44;
        }

        /* image hover */
        .root-24 .img-hover {
          transition: transform 0.5s cubic-bezier(0.25,0,0,1),
                      filter 0.5s ease;
          filter: grayscale(30%) brightness(0.85);
        }
        .root-24 .img-hover:hover {
          transform: scale(1.03);
          filter: grayscale(0%) brightness(1);
        }

        /* masthead bar */
        .root-24 .masthead {
          border-bottom: 1px solid ${P.accent2};
        }

        /* pull quote */
        .root-24 .pull-quote {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 3.5vw, 2.8rem);
          font-style: italic;
          font-weight: 400;
          line-height: 1.3;
          color: ${P.text};
          border-left: 3px solid ${P.accent};
          padding-left: 1.5rem;
          margin: 2rem 0;
        }

        /* gold CTA button */
        .root-24 .cta-btn {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${P.bg};
          background: ${P.accent};
          padding: 0.9rem 2.2rem;
          text-decoration: none;
          transition: background 0.25s ease, transform 0.2s ease;
        }
        .root-24 .cta-btn:hover {
          background: #d9b460;
          transform: translateY(-1px);
        }

        /* footer links */
        .root-24 .ft-link {
          color: ${P.muted};
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          transition: color 0.2s;
        }
        .root-24 .ft-link:hover {
          color: ${P.accent};
        }
      `}</style>

      <a
        href="#main-content"
        style={{
          position: "fixed",
          top: "-100%",
          left: "1rem",
          zIndex: 9999,
          background: P.accent,
          color: P.bg,
          padding: "0.5rem 1rem",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.75rem",
          transition: "top 0.2s",
        }}
        onFocus={(e) => ((e.currentTarget as HTMLElement).style.top = "1rem")}
        onBlur={(e) => ((e.currentTarget as HTMLElement).style.top = "-100%")}
      >
        Skip to content
      </a>

      {/* ── MASTHEAD ── */}
      <header
        className="masthead"
        role="banner"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "1.2rem clamp(1.5rem, 5vw, 5rem)",
          background: P.bg,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Label>Issue No. XXIV</Label>
        </div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
            fontWeight: 900,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: P.text,
          }}
        >
          Encre
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <a href={CTA} className="cta-btn" aria-label="Book a discovery call">
            Book a call
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* ══════════════════════════════════════════
            CONTENTS PAGE — editorial spread opener
        ══════════════════════════════════════════ */}
        <section
          aria-label="Contents"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "60vh",
            borderBottom: `1px solid ${P.accent2}`,
          }}
        >
          {/* left: masthead text column */}
          <div
            style={{
              padding: "clamp(2rem, 5vw, 5rem)",
              borderRight: `1px solid ${P.accent2}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Hairline delay={0.1} />
              <div style={{ marginTop: "1.5rem" }}>
                <Label>Contents</Label>
              </div>
              <nav
                aria-label="Editorial contents"
                style={{ marginTop: "2rem" }}
              >
                {CONTENTS.map((c, i) => (
                  <motion.div
                    key={c.folio}
                    className="contents-row"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: reduced ? 0 : 0.5,
                      delay: reduced ? 0 : i * 0.08,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.65rem",
                        color: P.accent,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {c.folio}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
                        fontStyle: "italic",
                        color: P.text,
                      }}
                    >
                      {c.title}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.6rem",
                        color: P.muted,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {c.label}
                    </span>
                  </motion.div>
                ))}
              </nav>
            </div>
            <div style={{ marginTop: "3rem" }}>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  color: P.muted,
                  lineHeight: 1.6,
                }}
              >
                Waseem Nasir · SkynetLabs · Independent
                <br />
                Bali / Lahore · Since 2019
              </p>
            </div>
          </div>

          {/* right: full-bleed cover photo */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              minHeight: "60vh",
            }}
          >
            <img
              src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
              alt="Waseem Nasir on a balcony in a black prince coat, sunglasses, editorial"
              className="img-hover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />
            {/* folio overlay */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "2rem",
                right: "2rem",
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(4rem, 10vw, 9rem)",
                fontWeight: 900,
                color: P.accent,
                opacity: 0.12,
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              XXIV
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "2rem",
                left: "2rem",
              }}
            >
              <Label>Cover</Label>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "0.9rem",
                  fontStyle: "italic",
                  color: P.text,
                  marginTop: "0.3rem",
                }}
              >
                Waseem Nasir, 2026
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HERO — counter-scroll headline + kicker
        ══════════════════════════════════════════ */}
        <section
          ref={heroRef}
          aria-label="Hero"
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: "100vh",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            background: P.surface,
          }}
        >
          {/* left folio margin */}
          <div
            aria-hidden="true"
            style={{
              width: "clamp(2.5rem, 5vw, 4rem)",
              borderRight: `1px solid ${P.accent2}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem 0",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                color: P.muted,
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
              }}
            >
              Automation, but make it disappear.
            </span>
          </div>

          {/* center content */}
          <div
            style={{
              padding: "clamp(3rem, 8vw, 8rem) clamp(2rem, 5vw, 5rem)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* kicker — scrolls UP */}
            <motion.div style={{ y: kickerY }}>
              <Hairline delay={0.2} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  margin: "1.5rem 0",
                }}
              >
                <Label>A founder on the record</Label>
                <div
                  aria-hidden="true"
                  style={{
                    width: "3rem",
                    height: "1px",
                    background: P.accent2,
                  }}
                />
                <Label>Since 2019</Label>
              </div>
            </motion.div>

            {/* headline — scrolls DOWN */}
            <motion.div style={{ y: headlineY, opacity: heroOpacity }}>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.8rem, 8vw, 8rem)",
                  fontWeight: 900,
                  lineHeight: 1.0,
                  color: P.text,
                  letterSpacing: "-0.02em",
                  maxWidth: "14ch",
                  margin: 0,
                }}
              >
                Automation,{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: P.accent,
                    display: "block",
                  }}
                >
                  but make it
                </em>{" "}
                disappear.
              </h1>
            </motion.div>

            {/* subhead — fixed */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0 : 0.8,
                delay: reduced ? 0 : 0.4,
              }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
                color: P.muted,
                marginTop: "2.5rem",
                maxWidth: "55ch",
                lineHeight: 1.6,
              }}
            >
              180+ builds shipped. 40+ clients across 9 countries. The systems
              that make a business run quietly — those are ours.
            </motion.p>

            <div style={{ marginTop: "2.5rem" }}>
              <Hairline delay={0.6} />
            </div>

            {/* hero image — parallax */}
            <motion.div
              style={{ y: heroImgY, marginTop: "3rem" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reduced ? 0 : 1,
                delay: reduced ? 0 : 0.3,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "1px",
                  background: P.accent2,
                  maxHeight: "60vh",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                  alt="Waseem working from a Bali terrace cafe, laptop, latte, sunglasses"
                  className="img-hover"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <img
                  src="/img/pro/PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg"
                  alt="Waseem Nasir in beige tracksuit standing outside glass building"
                  className="img-hover"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* right folio margin */}
          <div
            aria-hidden="true"
            style={{
              width: "clamp(2.5rem, 5vw, 4rem)",
              borderLeft: `1px solid ${P.accent2}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "2rem 0",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(3rem, 5vw, 5rem)",
                fontWeight: 400,
                color: P.accent2,
                opacity: 0.2,
                lineHeight: 1,
                writingMode: "vertical-rl",
              }}
            >
              06
            </span>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            PROOF / NUMBERS
        ══════════════════════════════════════════ */}
        <section
          ref={proofRef}
          aria-label="Numbers on record"
          style={{
            background: P.bg,
            padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "start",
            }}
          >
            {/* left: label + narrative */}
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <Hairline length="2rem" />
                <Label>Folio 12 — Numbers on Record</Label>
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                  fontWeight: 900,
                  color: P.text,
                  marginTop: "1.5rem",
                  marginBottom: "1.5rem",
                  lineHeight: 1.1,
                }}
              >
                Seven years of building
                <br />
                <em style={{ color: P.accent }}>in plain sight.</em>
              </h2>

              <div className="two-col">
                <DropCapParagraph>
                  Since 2019, I have shipped more than 180 production systems
                  under the SkynetLabs banner — not side projects, not
                  prototypes, not decks with screenshots, but live
                  infrastructure that invoices clients and earns trust over
                  years.
                </DropCapParagraph>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)",
                    color: P.muted,
                    lineHeight: 1.75,
                    marginTop: "1.2rem",
                  }}
                >
                  Forty-plus clients across nine countries. A client in Lyon
                  whose automated follow-ups now run while he sleeps. A physical
                  therapy practice in the US whose $27 funnel converts before
                  anyone picks up a phone. An Italian travel brand whose
                  customer-gated trip portal went from spreadsheet chaos to
                  structured CPT in four weeks.
                </p>
              </div>
            </div>

            {/* right: stat grid + image */}
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "3rem 2rem",
                  marginBottom: "2.5rem",
                }}
              >
                <Stat value="180+" label="builds shipped" />
                <Stat value="40+" label="clients served" />
                <Stat value="9" label="countries worked from" />
                <Stat value="2019" label="year one" />
              </div>
              <Hairline delay={0.2} />
              <img
                src="/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg"
                alt="Waseem at dual laptop setup with analytics dashboard and coffee"
                className="img-hover"
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  display: "block",
                  marginTop: "1.5rem",
                }}
              />
            </div>
          </div>

          {/* folio marker */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "clamp(1.5rem, 5vw, 5rem)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: P.muted,
              opacity: 0.5,
            }}
          >
            12
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SERVICES — editorial list
        ══════════════════════════════════════════ */}
        <section
          ref={servicesRef}
          aria-label="Services"
          style={{
            background: P.surface,
            padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)",
            position: "relative",
          }}
        >
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <Hairline length="2rem" />
              <Label>Folio 18 — What Gets Built</Label>
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
                fontWeight: 900,
                color: P.text,
                marginBottom: "3rem",
                lineHeight: 1.15,
              }}
            >
              The craft, in plain language.
            </h2>
            <Hairline delay={0.1} />

            {SERVICES.map((s, i) => (
              <motion.div
                key={s.num}
                className="service-row"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{
                  duration: reduced ? 0 : 0.5,
                  delay: reduced ? 0 : i * 0.1,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                    fontStyle: "italic",
                    color: P.accent,
                    paddingTop: "0.1rem",
                  }}
                >
                  {s.num}
                </span>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
                    fontWeight: 900,
                    color: P.text,
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  className="service-body"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(0.85rem, 1.1vw, 0.9rem)",
                    color: P.muted,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {s.body}
                </p>
              </motion.div>
            ))}

            {/* pull quote */}
            <div
              className="pull-quote"
              style={{ marginTop: "4rem", maxWidth: "45ch" }}
            >
              The best automation is the kind no one notices. It just works,
              every time, without anyone watching.
            </div>
          </div>

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "clamp(1.5rem, 5vw, 5rem)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: P.muted,
              opacity: 0.5,
            }}
          >
            18
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SELECTED WORK — four-up grid
        ══════════════════════════════════════════ */}
        <section
          ref={workRef}
          aria-label="Selected work"
          style={{
            background: P.bg,
            padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)",
            position: "relative",
          }}
        >
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <Hairline length="2rem" />
              <Label>Folio 28 — Eight Studies</Label>
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
                fontWeight: 900,
                color: P.text,
                marginBottom: "2.5rem",
                lineHeight: 1.15,
              }}
            >
              A selection of finished work.
            </h2>
            <Hairline delay={0.1} />
            <div className="work-grid" style={{ marginTop: "2px" }}>
              {WORK_STUDIES.map((w, i) => (
                <motion.article
                  key={w.no}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{
                    duration: reduced ? 0 : 0.6,
                    delay: reduced ? 0 : i * 0.12,
                  }}
                  style={{
                    background: P.surface,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ overflow: "hidden", aspectRatio: "16/10" }}>
                    <img
                      src={`/img/pro/${w.img}`}
                      alt={`${w.client} project work context`}
                      className="img-hover"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <Label>{w.no}</Label>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.6rem",
                          color: P.muted,
                          letterSpacing: "0.1em",
                        }}
                      >
                        {w.geo}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                        fontWeight: 900,
                        color: P.text,
                        margin: "0 0 0.5rem",
                      }}
                    >
                      {w.client}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.8rem",
                        color: P.muted,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {w.outcome}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* additional image spread below grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr",
                gap: "1px",
                background: P.accent2,
                marginTop: "1px",
              }}
            >
              <img
                src="/img/pro/PORTRAIT-2025-05-08-cafe-table-arms-crossed-pensive.jpg"
                alt="Waseem pensive, arms crossed at cafe table"
                className="img-hover"
                style={{
                  width: "100%",
                  aspectRatio: "9/12",
                  objectFit: "cover",
                  objectPosition: "top",
                  display: "block",
                }}
              />
              <img
                src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                alt="Waseem arms spread at Nusa Penida cliffs, Indonesia"
                className="img-hover"
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <img
                src="/img/pro/EVENT-expo-booth-navy-polo-chandelier-hall.jpg"
                alt="Waseem at expo booth in navy polo under chandelier hall"
                className="img-hover"
                style={{
                  width: "100%",
                  aspectRatio: "9/12",
                  objectFit: "cover",
                  objectPosition: "top",
                  display: "block",
                }}
              />
            </div>
          </div>

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "clamp(1.5rem, 5vw, 5rem)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: P.muted,
              opacity: 0.5,
            }}
          >
            28
          </div>
        </section>

        {/* ══════════════════════════════════════════
            ABOUT — founder editorial spread
        ══════════════════════════════════════════ */}
        <section
          ref={aboutRef}
          aria-label="About Waseem Nasir"
          style={{
            background: P.surface,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            {/* left: full-bleed portrait */}
            <div
              style={{
                position: "relative",
                minHeight: "70vh",
                overflow: "hidden",
              }}
            >
              <img
                src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
                alt="Waseem Nasir, arms crossed, sunglasses, confident editorial pose"
                className="img-hover"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
              />
              {/* caption overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background:
                    "linear-gradient(transparent, rgba(14,14,12,0.85))",
                  padding: "3rem 2rem 2rem",
                }}
              >
                <Label>Waseem Nasir · Founder</Label>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontSize: "0.9rem",
                    color: P.muted,
                    marginTop: "0.3rem",
                  }}
                >
                  Bali, 2026
                </p>
              </div>
            </div>

            {/* right: editorial essay */}
            <div
              style={{
                padding: "clamp(3rem, 6vw, 6rem)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderLeft: `1px solid ${P.accent2}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <Hairline length="2rem" />
                <Label>Folio 36 — On the Road Since 2019</Label>
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
                  fontWeight: 900,
                  color: P.text,
                  lineHeight: 1.15,
                  marginBottom: "2rem",
                }}
              >
                I build the kind of things that
                <em style={{ color: P.accent }}> make themselves invisible.</em>
              </h2>

              <DropCapParagraph>
                My name is Waseem Nasir. I founded SkynetLabs in 2019 and have
                been shipping production AI and automation systems ever since —
                not as a consultant who advises, but as a builder who delivers.
                The stack changes. The discipline doesn't.
              </DropCapParagraph>

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(0.85rem, 1.1vw, 0.9rem)",
                  color: P.muted,
                  lineHeight: 1.75,
                  marginTop: "1.2rem",
                }}
              >
                I work remotely — most often from Bali or Lahore — with clients
                who are serious about removing the human bottleneck from their
                growth. WhatsApp bots that qualify leads while their owner
                sleeps. Voice receptionists that handle freight inquiries at 2
                AM. Automation pipelines that make a $27 funnel feel like a team
                of five. The technology is new. The problem — wasted time and
                missed revenue — is ancient.
              </p>

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(0.85rem, 1.1vw, 0.9rem)",
                  color: P.muted,
                  lineHeight: 1.75,
                  marginTop: "1.2rem",
                }}
              >
                Nine countries. Forty-plus clients. One hundred and eighty
                builds. The number that matters most is the one I can't publish:
                the number of hours my systems have given back to the people who
                hired me to build them.
              </p>

              <div
                style={{
                  marginTop: "2.5rem",
                  display: "flex",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                <img
                  src="/img/pro/CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg"
                  alt="Waseem at blue hour, peace sign, laptop and coconut drink"
                  style={{
                    width: "calc(50% - 0.75rem)",
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    display: "block",
                    filter: "brightness(0.85) grayscale(20%)",
                  }}
                />
                <img
                  src="/img/pro/TRAVEL-google-office-sign-cream-outfit.jpg"
                  alt="Waseem at Google office sign in cream outfit"
                  style={{
                    width: "calc(50% - 0.75rem)",
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    display: "block",
                    filter: "brightness(0.85) grayscale(20%)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CONTACT / CTA
        ══════════════════════════════════════════ */}
        <section
          ref={contactRef}
          aria-label="Book a discovery call"
          style={{
            background: P.bg,
            padding: "clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 5rem)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* large background folio number */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(12rem, 30vw, 28rem)",
                fontWeight: 900,
                color: P.accent2,
                opacity: 0.05,
                lineHeight: 1,
                userSelect: "none",
                letterSpacing: "-0.05em",
              }}
            >
              44
            </span>
          </div>

          <div
            style={{
              position: "relative",
              maxWidth: "50rem",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <Hairline delay={0.1} />
            <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
              <Label>Folio 44 — Book Thirty Minutes</Label>
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                fontWeight: 900,
                color: P.text,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: "1.5rem",
              }}
            >
              Thirty minutes.
              <br />
              <em style={{ color: P.accent }}>No fluff, no pitch deck.</em>
            </h2>

            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                color: P.muted,
                lineHeight: 1.65,
                maxWidth: "38ch",
                margin: "0 auto 3rem",
              }}
            >
              Tell me what's breaking in your business. I'll tell you whether
              automation can fix it and roughly how long it takes. That's the
              whole call.
            </p>

            <Hairline delay={0.3} />

            <div
              style={{
                marginTop: "3rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <a
                href={CTA}
                className="cta-btn"
                aria-label="Book a 30-minute discovery call with Waseem Nasir"
              >
                Book a 30-minute call
              </a>
              <a
                href={GITHUB}
                className="ft-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Waseem Nasir on GitHub"
              >
                github.com/waseemnasir2k26
              </a>
            </div>

            {/* end hairline */}
            <div style={{ marginTop: "4rem" }}>
              <Hairline delay={0.5} />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            VISUAL ESSAY — full-width image strip
        ══════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            height: "22vw",
            minHeight: "120px",
            gap: "1px",
            background: P.accent2,
          }}
        >
          {[
            {
              src: "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
              alt: "Waseem standing by neon sign in black outfit",
            },
            {
              src: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
              alt: "Waseem smiling at rooftop laptop with dragonfruit smoothie",
            },
            {
              src: "PORTRAIT-travertine-wall-sky-headshot-flowers.jpg",
              alt: "Waseem headshot against travertine wall and sky with flowers",
            },
            {
              src: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
              alt: "Waseem smiling in garden cafe, blue polo, laptop",
            },
            {
              src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
              alt: "Waseem on hilltop with backpack and sunglasses, city vista",
            },
          ].map((img) => (
            <img
              key={img.src}
              src={`/img/pro/${img.src}`}
              alt={img.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
                filter: "brightness(0.75) grayscale(25%)",
                transition: "filter 0.4s",
              }}
            />
          ))}
        </div>
      </main>

      {/* ══════════════════════════════════════════
          FOOTER — magazine colophon
      ══════════════════════════════════════════ */}
      <footer
        role="contentinfo"
        style={{
          background: P.surface,
          padding: "2.5rem clamp(1.5rem, 5vw, 5rem)",
          borderTop: `1px solid ${P.accent2}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.95rem",
                fontWeight: 900,
                letterSpacing: "0.1em",
                color: P.text,
              }}
            >
              Encre — Issue XXIV
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                color: P.muted,
                textTransform: "uppercase",
              }}
            >
              SkynetLabs · Waseem Nasir · 2019–{new Date().getFullYear()}
            </span>
          </div>

          <Hairline vertical length="3rem" color={P.accent2} />

          <div
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <a href={CTA} className="ft-link">
              Book a call
            </a>
            <a
              href={GITHUB}
              className="ft-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a href="mailto:waseembali2k26@gmail.com" className="ft-link">
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
