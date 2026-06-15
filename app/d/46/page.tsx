"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useVelocity,
  animate,
} from "framer-motion";

/* ─── PALETTE ───────────────────────────────────────────────────────── */
const C = {
  bg: "#16130F",
  surface: "#211C16",
  surfaceHigh: "#2A2318",
  text: "#F0E9DC",
  muted: "#8E8474",
  accent: "#D9A441",
  accent2: "#B5462E",
  rule: "#2E2720",
};

/* ─── FONT INJECTION ─────────────────────────────────────────────────── */
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Spectral:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap";

/* ─── IMAGES ──────────────────────────────────────────────────────────── */
const HERO_IMG =
  "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg";
const ABOUT_IMG =
  "/img/pro/PORTRAIT-2025-05-08-cafe-table-arms-crossed-pensive.jpg";
const NIGHT_IMG =
  "/img/pro/CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg";
const ROOFTOP_IMG =
  "/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg";
const BALI_IMG =
  "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg";
const CITY_IMG =
  "/img/pro/CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg";
const TRAVEL_IMG =
  "/img/pro/TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg";
const WORK_IMG = "/img/pro/WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg";
const COWORK_IMG =
  "/img/pro/WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg";
const VALLEY_IMG =
  "/img/pro/SCENERY-2026-05-24-green-valley-hills-cloud-pano.jpg";
const NUSA_IMG =
  "/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg";
const CLOSEUP_IMG =
  "/img/pro/PORTRAIT-restaurant-closeup-glasses-beige-shirt.jpg";

/* ─── HAIRLINE RULE ──────────────────────────────────────────────────── */
function HairlineRule({
  delay = 0,
  vertical = false,
  color,
}: {
  delay?: number;
  vertical?: boolean;
  color?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={
        reduced ? { opacity: 1 } : vertical ? { scaleY: 0 } : { scaleX: 0 }
      }
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: reduced ? 0 : 1.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        background: color ?? C.accent,
        transformOrigin: vertical ? "top center" : "left center",
        ...(vertical
          ? { width: 1, height: "100%", display: "block" }
          : { height: 1, width: "100%", display: "block" }),
      }}
    />
  );
}

/* ─── FOLIO LABEL ────────────────────────────────────────────────────── */
function FolioLabel({ chapter, title }: { chapter: string; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
        marginBottom: "2rem",
      }}
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: C.accent,
          whiteSpace: "nowrap",
        }}
      >
        {chapter}
      </span>
      <div style={{ flex: 1 }}>
        <HairlineRule color={C.rule} />
      </div>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: C.muted,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </span>
    </div>
  );
}

/* ─── PULL-QUOTE SPOTLIGHT ───────────────────────────────────────────── */
function PullQuote({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || reduced) return;
      const rect = ref.current.getBoundingClientRect();
      setSpotlight({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [reduced],
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "4rem 3rem",
        background: C.surface,
        borderLeft: `3px solid ${C.accent}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: active
            ? `radial-gradient(circle 380px at ${spotlight.x}% ${spotlight.y}%, rgba(217,164,65,0.1) 0%, transparent 70%)`
            : "transparent",
          transition: "background 0.08s linear",
          pointerEvents: "none",
        }}
      />
      {/* decorative large open-quote */}
      <div
        style={{
          position: "absolute",
          top: "0.5rem",
          left: "2.5rem",
          fontFamily: "'DM Serif Display', serif",
          fontSize: "8rem",
          lineHeight: 1,
          color: C.accent,
          opacity: 0.08,
          pointerEvents: "none",
          userSelect: "none",
        }}
        aria-hidden="true"
      >
        &ldquo;
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ─── SEPIA PORTRAIT ─────────────────────────────────────────────────── */
function SepiaPortrait({
  src,
  alt,
  style,
  objectPosition,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  objectPosition?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: objectPosition ?? "center",
        filter: hovered
          ? "sepia(0%) brightness(1) saturate(1)"
          : "sepia(65%) brightness(0.78) saturate(0.6)",
        transition: "filter 0.8s cubic-bezier(0.16,1,0.3,1)",
        ...style,
      }}
    />
  );
}

/* ─── PARALLAX IMAGE ──────────────────────────────────────────────────── */
function ParallaxHero({
  src,
  alt,
  height,
}: {
  src: string;
  alt: string;
  height: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y = reduced ? "0%" : rawY;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      style={{ position: "relative", height, overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "115%",
          objectFit: "cover",
          objectPosition: "top center",
          y,
          filter: hovered
            ? "sepia(0%) brightness(1)"
            : "sepia(55%) brightness(0.8) saturate(0.65)",
          transition: "filter 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  );
}

/* ─── COUNT-UP STAT ──────────────────────────────────────────────────── */
function StatBlock({
  value,
  label,
  numericEnd,
  prefix = "",
  suffix = "",
}: {
  value?: string;
  label: string;
  numericEnd?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState(numericEnd !== undefined ? 0 : "");
  const [hasRun, setHasRun] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (numericEnd === undefined || hasRun || reduced) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun) {
          setHasRun(true);
          const controls = animate(0, numericEnd, {
            duration: 1.6,
            ease: "easeOut",
            onUpdate: (v) => setDisplayed(Math.round(v)),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [numericEnd, hasRun, reduced]);

  const displayValue =
    numericEnd !== undefined
      ? `${prefix}${hasRun || reduced ? numericEnd : displayed}${suffix}`
      : value;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ textAlign: "center" }}
    >
      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(2.6rem, 5vw, 4.2rem)",
          color: C.accent,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {displayValue}
      </div>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.58rem",
          color: C.muted,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginTop: "0.6rem",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

/* ─── TICKER / MARQUEE ──────────────────────────────────────────────── */
const TICKER_ITEMS = [
  "n8n · Automation Systems",
  "WhatsApp Voice Bots",
  "Next.js Platforms",
  "AEO Architecture",
  "Stripe Payment Funnels",
  "AI Agent Workflows",
  "Remote · 9 Countries",
  "Since 2019",
];

function Ticker() {
  const reduced = useReducedMotion();
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: `1px solid ${C.rule}`,
        borderBottom: `1px solid ${C.rule}`,
      }}
      aria-hidden="true"
    >
      <motion.div
        animate={reduced ? {} : { x: ["0%", "-50%"] }}
        transition={{
          duration: 28,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          display: "flex",
          gap: "0",
          whiteSpace: "nowrap",
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.muted,
              padding: "0.7rem 2.5rem",
              borderRight: `1px solid ${C.rule}`,
              display: "inline-block",
            }}
          >
            {i % 2 === 0 ? (
              item
            ) : (
              <span style={{ color: C.accent }}>&#x2014;</span>
            )}
            {i % 2 !== 0 && (
              <span style={{ marginLeft: "2.5rem" }}>{item}</span>
            )}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function LeMondNoir() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');

        .root-46 {
          font-family: 'Spectral', serif;
          background: ${C.bg};
          color: ${C.text};
          min-height: 100vh;
        }

        .root-46 *,
        .root-46 *::before,
        .root-46 *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .root-46 a:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 3px;
        }

        /* Drop-cap: 3-baseline italic serif, gold */
        .root-46 .drop-cap::first-letter {
          font-family: 'DM Serif Display', serif;
          font-size: 5.4em;
          line-height: 0.76;
          float: left;
          margin-right: 0.07em;
          margin-top: 0.06em;
          color: ${C.accent};
          font-style: italic;
        }

        .root-46 .two-col {
          column-count: 2;
          column-gap: 2.5rem;
          column-rule: 1px solid ${C.rule};
        }

        @media (max-width: 760px) {
          .root-46 .two-col {
            column-count: 1;
          }
          .root-46 .night-spread {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .root-46 .night-spread > * {
            height: 280px !important;
          }
          .root-46 .field-strip {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .root-46 .field-strip > * {
            height: 260px !important;
          }
          .root-46 .feature-grid {
            grid-template-columns: 1fr !important;
          }
          .root-46 .services-grid {
            grid-template-columns: 1fr !important;
          }
          .root-46 .about-grid {
            grid-template-columns: 1fr !important;
          }
          .root-46 .work-grid {
            grid-template-columns: 1fr !important;
          }
          .root-46 .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        .root-46 .service-tag {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${C.muted};
          border: 1px solid ${C.rule};
          padding: 0.3rem 0.65rem;
          transition: border-color 0.3s ease, color 0.3s ease;
        }

        .root-46 .service-tag:hover {
          border-color: ${C.accent};
          color: ${C.accent};
        }

        .root-46 .work-card {
          background: ${C.surface};
          overflow: hidden;
          position: relative;
        }

        .root-46 .work-card img {
          transition: transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.7s cubic-bezier(0.16,1,0.3,1);
          filter: sepia(55%) brightness(0.78) saturate(0.6);
        }

        .root-46 .work-card:hover img {
          transform: scale(1.05);
          filter: sepia(0%) brightness(1) saturate(1);
        }

        .root-46 .cta-btn {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${C.bg};
          background: ${C.accent};
          padding: 1.1rem 2.8rem;
          text-decoration: none;
          transition: background 0.3s ease, letter-spacing 0.3s ease;
          position: relative;
        }

        .root-46 .cta-btn::after {
          content: '';
          position: absolute;
          inset: -4px;
          border: 1px solid ${C.accent};
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .root-46 .cta-btn:hover {
          background: #E8B851;
          letter-spacing: 0.26em;
        }

        .root-46 .cta-btn:hover::after {
          opacity: 0.4;
        }

        .root-46 .section-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: ${C.muted};
        }

        /* Masthead serif — tight negative tracking */
        .root-46 .masthead-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(3rem, 9vw, 7rem);
          letter-spacing: -0.04em;
          line-height: 0.9;
          color: ${C.text};
        }

        /* Body serif override */
        .root-46 .body-text {
          font-family: 'Spectral', serif;
          font-size: 1.05rem;
          line-height: 1.78;
          color: ${C.text};
          margin-bottom: 1.4rem;
        }
      `}</style>

      <div className="root-46" style={{ position: "relative" }}>
        {/* ── SCROLL PROGRESS RAIL ── */}
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: C.accent,
            scaleX,
            transformOrigin: "left",
            zIndex: 9999,
          }}
        />

        {/* ── SKIP LINK ── */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            background: C.accent,
            color: C.bg,
            padding: "0.5rem 1rem",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.75rem",
            zIndex: 10000,
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.left = "1rem";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.left = "-9999px";
          }}
        >
          Skip to content
        </a>

        {/* ═══════════════════════════════════════════════
            HEADER — broadsheet masthead
        ════════════════════════════════════════════════ */}
        <header
          role="banner"
          style={{
            borderBottom: `1px solid ${C.rule}`,
            padding: "1.25rem 0 1rem",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
                gap: "1.5rem",
              }}
            >
              <span className="section-label" style={{ whiteSpace: "nowrap" }}>
                Vol. IX &mdash; No. 46
              </span>
              <div style={{ flex: 1 }}>
                <HairlineRule color={C.rule} />
              </div>
              <span className="section-label" style={{ whiteSpace: "nowrap" }}>
                Est. 2019 &middot; Bali / Lahore
              </span>
            </div>

            {/* Masthead title */}
            <div style={{ textAlign: "center", paddingBottom: "0.75rem" }}>
              <motion.h1
                className="masthead-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                Le Monde Noir
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: C.muted,
                  marginTop: "0.75rem",
                }}
              >
                An independent chronicle of autonomous work
              </motion.p>
            </div>
            <HairlineRule delay={0.4} />
          </div>
        </header>

        {/* ── TICKER ── */}
        <Ticker />

        {/* ═══════════════════════════════════════════════
            HERO — parallax portrait + editorial headline
        ════════════════════════════════════════════════ */}
        <main id="main-content">
          <section
            aria-label="Profile feature"
            style={{ position: "relative" }}
          >
            <div style={{ position: "relative" }}>
              <ParallaxHero
                src={HERO_IMG}
                alt="Waseem Nasir — founder of SkynetLabs, on a balcony rail at night wearing a black coat"
                height="clamp(540px, 82vh, 940px)"
              />

              {/* Multi-layer gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    linear-gradient(to top, ${C.bg} 0%, rgba(22,19,15,0.75) 38%, rgba(22,19,15,0.2) 65%, transparent 85%),
                    linear-gradient(to right, rgba(22,19,15,0.35) 0%, transparent 50%)
                  `,
                  pointerEvents: "none",
                }}
              />

              {/* Hero text — absolute bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              >
                <div
                  style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "0 2rem 3.5rem",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.4,
                      duration: 1.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ maxWidth: 900 }}
                  >
                    <span
                      className="section-label"
                      style={{
                        color: C.accent,
                        display: "block",
                        marginBottom: "1.25rem",
                      }}
                    >
                      Profile &nbsp;&middot;&nbsp; Waseem Nasir
                    </span>
                    <p
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontStyle: "italic",
                        fontSize: "clamp(1.9rem, 4.8vw, 3.8rem)",
                        lineHeight: 1.1,
                        color: C.text,
                        letterSpacing: "-0.025em",
                        maxWidth: 820,
                      }}
                    >
                      After dark, his agents keep the lights on for 40
                      companies.
                    </p>
                    <p
                      style={{
                        fontFamily: "'Spectral', serif",
                        fontStyle: "italic",
                        fontSize: "1rem",
                        color: C.muted,
                        marginTop: "1rem",
                        letterSpacing: "0.01em",
                      }}
                    >
                      180+ builds across 9 countries &mdash; since 2019.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Gold hairline below hero */}
            <div
              style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}
            >
              <HairlineRule delay={0.7} />
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              PROOF — animated count-up numbers
          ════════════════════════════════════════════════ */}
          <section
            aria-label="Proof of work"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "3.5rem 2rem",
            }}
          >
            <div
              className="stats-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1rem",
                position: "relative",
              }}
            >
              {/* vertical rules between stat cells */}
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  style={{
                    position: "absolute",
                    left: `${(n / 4) * 100}%`,
                    top: "10%",
                    height: "80%",
                  }}
                >
                  <HairlineRule vertical delay={n * 0.1} color={C.rule} />
                </div>
              ))}
              <StatBlock numericEnd={180} suffix="+" label="Builds shipped" />
              <StatBlock numericEnd={40} suffix="+" label="Clients retained" />
              <StatBlock numericEnd={9} label="Countries worked" />
              <StatBlock value="2019" label="Year founded" />
            </div>
            <div style={{ marginTop: "2.5rem" }}>
              <HairlineRule />
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              LONG-READ BODY — feature piece
          ════════════════════════════════════════════════ */}
          <section
            aria-label="Feature article"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 2rem 5rem",
            }}
          >
            <FolioLabel chapter="I — Feature" title="The Night Operator" />
            <div
              className="feature-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "3.5rem",
                alignItems: "start",
              }}
            >
              {/* Left: byline sidebar */}
              <aside aria-label="Byline">
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    style={{
                      position: "sticky",
                      top: "2rem",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "0.58rem",
                        letterSpacing: "0.22em",
                        color: C.muted,
                        textTransform: "uppercase",
                        marginBottom: "1rem",
                      }}
                    >
                      By the editors
                    </div>
                    <HairlineRule />
                    <div style={{ marginTop: "1.75rem" }}>
                      <div style={{ position: "relative" }}>
                        <img
                          src={CLOSEUP_IMG}
                          alt="Waseem Nasir — closeup portrait, glasses, beige shirt"
                          style={{
                            width: "100%",
                            aspectRatio: "3/4",
                            objectFit: "cover",
                            objectPosition: "center top",
                            filter: "sepia(45%) brightness(0.82) saturate(0.7)",
                            display: "block",
                            marginBottom: "1rem",
                          }}
                        />
                        {/* corner bracket overlay */}
                        <div
                          style={{
                            position: "absolute",
                            top: -6,
                            left: -6,
                            width: 28,
                            height: 28,
                            borderTop: `1px solid ${C.accent}`,
                            borderLeft: `1px solid ${C.accent}`,
                            pointerEvents: "none",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: "1rem",
                            right: -6,
                            width: 28,
                            height: 28,
                            borderBottom: `1px solid ${C.accent}`,
                            borderRight: `1px solid ${C.accent}`,
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Serif Display', serif",
                          fontSize: "1.1rem",
                          color: C.text,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Waseem Nasir
                      </div>
                      <div
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "0.57rem",
                          color: C.muted,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          marginTop: "0.3rem",
                        }}
                      >
                        Founder, SkynetLabs
                      </div>
                      <div style={{ marginTop: "1.25rem" }}>
                        <HairlineRule color={C.rule} />
                      </div>
                      <div
                        style={{
                          fontFamily: "'Spectral', serif",
                          fontStyle: "italic",
                          fontSize: "0.82rem",
                          color: C.muted,
                          lineHeight: 1.7,
                          marginTop: "1rem",
                        }}
                      >
                        Remote from Bali and Lahore. Building since 2019.
                        Shipped to 9 countries without a single office.
                      </div>
                      <div
                        style={{
                          marginTop: "1.5rem",
                          display: "flex",
                          gap: "0.4rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {["n8n", "Next.js", "AEO", "WhatsApp AI"].map((t) => (
                          <span key={t} className="service-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </aside>

              {/* Right: editorial body copy */}
              <article>
                <motion.div
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Drop-cap paragraph — text starts with capital S */}
                  <p className="drop-cap body-text">
                    Somewhere between midnight in Bali and a client call in
                    Toronto, the automations run themselves. Workflows designed
                    weeks ago &mdash; scaffolded in n8n, trained on real intake
                    data, stitched to WhatsApp &mdash; continue routing leads,
                    answering enquiries, and filing reports while Waseem Nasir
                    is asleep.
                  </p>

                  <div className="two-col">
                    <p className="body-text">
                      This is not passive income in the lifestyle-influencer
                      sense. It is infrastructure &mdash; quiet, unglamorous,
                      relentlessly functional. The kind of infrastructure that
                      forty companies now depend on, in industries ranging from
                      freight logistics to physical therapy clinics to AI-first
                      agencies still figuring out what they want to build.
                    </p>

                    <p className="body-text">
                      Nasir founded SkynetLabs in 2019. The name was deliberate
                      &mdash; provocative in the way that only someone who
                      genuinely believes in the technology would dare to be
                      provocative. &ldquo;Most agencies sell the idea of
                      AI,&rdquo; he says. &ldquo;We ship the wiring.&rdquo;
                    </p>

                    <p className="body-text">
                      One hundred and eighty builds later, the pattern is
                      consistent: a client arrives with a problem &mdash; missed
                      leads, dead follow-ups, an operations team drowning in
                      copy-paste work &mdash; and leaves with a system that runs
                      without them. No recurring subscription to a platform. No
                      vendor lock-in. Just code, logic, and a handover document
                      they can actually read.
                    </p>

                    <p className="body-text" style={{ marginBottom: 0 }}>
                      He has never maintained a permanent office. The work has
                      taken him from Lahore to Singapore&rsquo;s Google campus
                      to rooftop caf&eacute;s in Bali&rsquo;s Canggu district,
                      where a reliable connection and a strong flat white
                      constitute the sum total of infrastructure requirements.
                      The geography is incidental. The output is not.
                    </p>
                  </div>
                </motion.div>
              </article>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              PULL QUOTE
          ════════════════════════════════════════════════ */}
          <section
            aria-label="Pull quote"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 2rem 5rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <PullQuote>
                <p
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(1.7rem, 3.8vw, 2.8rem)",
                    color: C.text,
                    lineHeight: 1.2,
                    letterSpacing: "-0.015em",
                  }}
                >
                  &ldquo;Most agencies sell the idea of AI. We ship the wiring
                  &mdash; and the wiring works while everyone else is
                  sleeping.&rdquo;
                </p>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.58rem",
                    color: C.accent,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginTop: "1.75rem",
                    paddingTop: "1.25rem",
                    borderTop: `1px solid ${C.rule}`,
                  }}
                >
                  &mdash; Waseem Nasir, Founder &middot; SkynetLabs
                </div>
              </PullQuote>
            </motion.div>
          </section>

          {/* ═══════════════════════════════════════════════
              NIGHT SPREAD — atmospheric image strip
          ════════════════════════════════════════════════ */}
          <section
            aria-label="Work environments"
            style={{ marginBottom: "5rem" }}
          >
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                padding: "0 2rem 1.5rem",
              }}
            >
              <FolioLabel chapter="II — Field" title="The Night Shift" />
            </div>
            <motion.div
              className="night-spread"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: 3,
                height: 440,
              }}
            >
              <div className="work-card">
                <SepiaPortrait
                  src={CITY_IMG}
                  alt="Night rooftop cafe — Waseem with phone and city lights below"
                  objectPosition="center"
                />
                {/* caption overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to top, rgba(22,19,15,0.85) 0%, transparent 45%)`,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "1.5rem",
                    left: "1.5rem",
                    right: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "0.54rem",
                      color: C.accent,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Night shift
                  </div>
                  <div
                    style={{
                      fontFamily: "'Spectral', serif",
                      fontStyle: "italic",
                      fontSize: "0.85rem",
                      color: C.text,
                      lineHeight: 1.4,
                    }}
                  >
                    City rooftop, somewhere above the grid
                  </div>
                </div>
              </div>
              <div className="work-card">
                <SepiaPortrait
                  src={NIGHT_IMG}
                  alt="Night beach cafe — Waseem with phone and laptop, staring into distance"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to top, rgba(22,19,15,0.8) 0%, transparent 50%)`,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "1rem",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.52rem",
                    color: C.muted,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Beach cafe &middot; Bali
                </div>
              </div>
              <div className="work-card">
                <SepiaPortrait
                  src={BALI_IMG}
                  alt="Bali terrace — Waseem typing on laptop with latte, sunglasses on"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to top, rgba(22,19,15,0.8) 0%, transparent 50%)`,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "1rem",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.52rem",
                    color: C.muted,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Terrace &middot; Canggu
                </div>
              </div>
            </motion.div>
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                padding: "1.5rem 2rem 0",
              }}
            >
              <HairlineRule />
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              SERVICES — what he builds
          ════════════════════════════════════════════════ */}
          <section
            aria-label="Services"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 2rem 6rem",
            }}
          >
            <FolioLabel chapter="III — Practice" title="The Build Catalogue" />
            <div
              className="services-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "4rem",
                alignItems: "start",
              }}
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: "relative" }}
                >
                  <img
                    src={ROOFTOP_IMG}
                    alt="Waseem on a mountain-view rooftop cafe with laptop and clouds"
                    style={{
                      width: "100%",
                      aspectRatio: "4/3",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                      filter: "sepia(50%) brightness(0.8) saturate(0.6)",
                    }}
                  />
                  {/* caption strip below image */}
                  <div
                    style={{
                      padding: "0.75rem 0",
                      borderBottom: `1px solid ${C.rule}`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "0.52rem",
                        color: C.muted,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      Rooftop — mountain clouds, 2026
                    </span>
                  </div>
                </motion.div>
              </div>
              <div>
                {[
                  {
                    no: "01",
                    title: "AI Automation Systems",
                    body: "End-to-end n8n workflows that replace repetitive ops: lead capture, follow-up sequences, CRM syncs, appointment routing. Built to run without a babysitter.",
                  },
                  {
                    no: "02",
                    title: "WhatsApp & Voice Bots",
                    body: "Conversational agents wired into real business backends. A physio clinic books appointments. A freight broker qualifies loads. They run on WhatsApp because that is where clients actually are.",
                  },
                  {
                    no: "03",
                    title: "Next.js Platforms",
                    body: "Full-stack web products &mdash; SaaS dashboards, content sites, client portals &mdash; built in Next.js with TypeScript. Shipped to production, not left in staging.",
                  },
                  {
                    no: "04",
                    title: "AEO & Search Presence",
                    body: "Answer Engine Optimisation: structured content architecture so that AI-powered search surfaces your business when a buyer asks the exact question you answer. Semantic, not gimmicky.",
                  },
                ].map((svc, i) => (
                  <motion.div
                    key={svc.no}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "3rem 1fr",
                      gap: "1.5rem",
                      paddingBottom: "2rem",
                      marginBottom: "2rem",
                      borderBottom: `1px solid ${C.rule}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "0.58rem",
                        color: C.accent,
                        letterSpacing: "0.16em",
                        paddingTop: "0.3rem",
                      }}
                    >
                      {svc.no}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'DM Serif Display', serif",
                          fontSize: "1.2rem",
                          color: C.text,
                          marginBottom: "0.6rem",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {svc.title}
                      </div>
                      <p
                        style={{
                          fontFamily: "'Spectral', serif",
                          fontSize: "0.92rem",
                          lineHeight: 1.72,
                          color: C.muted,
                        }}
                        dangerouslySetInnerHTML={{ __html: svc.body }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              SELECTED WORK — four-up grid
          ════════════════════════════════════════════════ */}
          <section
            aria-label="Selected work"
            style={{
              background: C.surface,
              padding: "5rem 0",
            }}
          >
            <div
              style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}
            >
              <FolioLabel chapter="IV — Portfolio" title="Selected Work" />
              <div
                className="work-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 3,
                }}
              >
                {[
                  {
                    img: TRAVEL_IMG,
                    alt: "Waseem on a hilltop with backpack, city vista behind him",
                    title: "FreightOps Voice AI",
                    geo: "United States",
                    tag: "Voice Bot · WhatsApp",
                    desc: "AI receptionist qualifying loads 24 / 7",
                  },
                  {
                    img: WORK_IMG,
                    alt: "Waseem giving thumbs up with a client in a cafe setting",
                    title: "Clinic Booking Automation",
                    geo: "Singapore",
                    tag: "n8n · WhatsApp",
                    desc: "Zero-touch appointment routing for PT clinic",
                  },
                  {
                    img: NUSA_IMG,
                    alt: "Waseem with arms spread on Nusa Penida clifftop",
                    title: "SkynetJoe.com AEO Platform",
                    geo: "Global",
                    tag: "Next.js · AEO",
                    desc: "Live dogfood case study in AI search visibility",
                  },
                  {
                    img: COWORK_IMG,
                    alt: "Night coworking session — team with laptops",
                    title: "InspireHealth Stripe Funnel",
                    geo: "Pakistan → USA",
                    tag: "$27 Funnel · Automation",
                    desc: "End-to-end payment + onboarding in 72 h",
                  },
                ].map((w, i) => (
                  <motion.div
                    key={i}
                    className="work-card"
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.75,
                      delay: i * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ height: 340 }}
                  >
                    <img
                      src={w.img}
                      alt={w.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(to top, rgba(22,19,15,0.93) 0%, rgba(22,19,15,0.4) 45%, transparent 68%)`,
                        pointerEvents: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1.5rem",
                        left: "1.5rem",
                        right: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "0.52rem",
                          color: C.accent,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          marginBottom: "0.4rem",
                        }}
                      >
                        {w.tag}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Serif Display', serif",
                          fontSize: "1.1rem",
                          color: C.text,
                          letterSpacing: "-0.01em",
                          marginBottom: "0.3rem",
                        }}
                      >
                        {w.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Spectral', serif",
                          fontStyle: "italic",
                          fontSize: "0.78rem",
                          color: C.muted,
                          marginBottom: "0.5rem",
                        }}
                      >
                        {w.desc}
                      </div>
                      <div
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "0.5rem",
                          color: C.muted,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {w.geo}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              ABOUT — portrait + editorial bio
          ════════════════════════════════════════════════ */}
          <section
            aria-label="About Waseem Nasir"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "6rem 2rem",
            }}
          >
            <FolioLabel
              chapter="V — Profile"
              title="The Man Behind the System"
            />
            <div
              className="about-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "5rem",
                alignItems: "center",
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: "relative" }}
              >
                <SepiaPortrait
                  src={ABOUT_IMG}
                  alt="Waseem Nasir — seated at a cafe table, arms crossed, pensive look"
                  style={{ aspectRatio: "3/4", objectFit: "cover" }}
                />
                {/* corner brackets */}
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    left: -10,
                    width: 36,
                    height: 36,
                    borderTop: `2px solid ${C.accent}`,
                    borderLeft: `2px solid ${C.accent}`,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -10,
                    right: -10,
                    width: 36,
                    height: 36,
                    borderBottom: `2px solid ${C.accent}`,
                    borderRight: `2px solid ${C.accent}`,
                    pointerEvents: "none",
                  }}
                />
                {/* caption strip */}
                <div
                  style={{
                    paddingTop: "0.75rem",
                    borderTop: `1px solid ${C.rule}`,
                    marginTop: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "0.52rem",
                      color: C.muted,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    Caf&eacute; table &middot; Pensive &middot; 2025
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(1.9rem, 3.8vw, 3rem)",
                    color: C.text,
                    lineHeight: 1.12,
                    marginBottom: "1.75rem",
                    letterSpacing: "-0.025em",
                  }}
                >
                  An independent founder who outlasted the hype and kept
                  shipping.
                </h2>
                <div style={{ marginBottom: "1.75rem" }}>
                  <HairlineRule color={C.rule} />
                </div>
                <p
                  style={{
                    fontFamily: "'Spectral', serif",
                    fontSize: "1rem",
                    lineHeight: 1.82,
                    color: C.muted,
                    marginBottom: "1.25rem",
                  }}
                >
                  Waseem Nasir started SkynetLabs in 2019 before &ldquo;AI
                  automation&rdquo; became a conference theme. The early years
                  were spent building systems for clients who could not
                  articulate exactly what they needed &mdash; only that the
                  manual work was killing them.
                </p>
                <p
                  style={{
                    fontFamily: "'Spectral', serif",
                    fontSize: "1rem",
                    lineHeight: 1.82,
                    color: C.muted,
                    marginBottom: "2.25rem",
                  }}
                >
                  He works from wherever the connection is stable. He takes on
                  clients from wherever the problem is real. The constraint has
                  never been geography &mdash; it has been whether or not the
                  work is worth doing.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <a
                    href="https://github.com/waseemnasir2k26"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: C.muted,
                      textDecoration: "none",
                      borderBottom: `1px solid ${C.rule}`,
                      paddingBottom: "0.25rem",
                      transition: "color 0.3s ease, border-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.color = C.accent;
                      el.style.borderBottomColor = C.accent;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.color = C.muted;
                      el.style.borderBottomColor = C.rule;
                    }}
                  >
                    github.com/waseemnasir2k26
                  </a>
                  <a
                    href="https://skynetjoe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: C.muted,
                      textDecoration: "none",
                      borderBottom: `1px solid ${C.rule}`,
                      paddingBottom: "0.25rem",
                      transition: "color 0.3s ease, border-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.color = C.accent;
                      el.style.borderBottomColor = C.accent;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.color = C.muted;
                      el.style.borderBottomColor = C.rule;
                    }}
                  >
                    skynetjoe.com
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              FIELD STRIP — travel / landscape photography
          ════════════════════════════════════════════════ */}
          <section aria-label="Field photography">
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                padding: "0 2rem 1.5rem",
              }}
            >
              <FolioLabel chapter="VI — Field" title="Where the Work Is Done" />
            </div>
            <motion.div
              className="field-strip"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, staggerChildren: 0.1 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 3,
                height: 360,
              }}
            >
              {[
                {
                  src: VALLEY_IMG,
                  alt: "Green valley hills with clouds — panoramic view from Bali",
                  caption: "Green valley · Bali highlands",
                },
                {
                  src: TRAVEL_IMG,
                  alt: "Waseem on a hilltop with backpack, city vista behind him",
                  caption: "City vista · hilltop survey",
                },
                {
                  src: NUSA_IMG,
                  alt: "Waseem with arms spread on Nusa Penida clifftop",
                  caption: "Nusa Penida · cliff edge",
                },
              ].map((img, i) => (
                <div key={i} className="work-card" style={{ height: 360 }}>
                  <SepiaPortrait
                    src={img.src}
                    alt={img.alt}
                    style={{ height: 360 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(to top, rgba(22,19,15,0.75) 0%, transparent 45%)`,
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      left: "1rem",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "0.52rem",
                      color: C.muted,
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                    }}
                  >
                    {img.caption}
                  </div>
                </div>
              ))}
            </motion.div>
          </section>

          {/* ═══════════════════════════════════════════════
              CTA — contact + booking
          ════════════════════════════════════════════════ */}
          <section
            aria-label="Contact and booking"
            style={{
              background: C.surface,
              padding: "7rem 2rem",
              textAlign: "center",
            }}
          >
            <div style={{ maxWidth: 740, margin: "0 auto" }}>
              <div style={{ marginBottom: "3rem" }}>
                <HairlineRule />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="section-label"
                  style={{ display: "block", marginBottom: "1.75rem" }}
                >
                  Commission a build
                </span>
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(2.1rem, 5.5vw, 3.8rem)",
                    color: C.text,
                    lineHeight: 1.08,
                    marginBottom: "1.5rem",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Thirty minutes to decide if the system you need is the system
                  we can build.
                </h2>
                <p
                  style={{
                    fontFamily: "'Spectral', serif",
                    fontStyle: "italic",
                    fontSize: "1.05rem",
                    color: C.muted,
                    lineHeight: 1.75,
                    marginBottom: "3rem",
                    maxWidth: 540,
                    margin: "0 auto 3rem",
                  }}
                >
                  A discovery call. No pitch deck. No upsell. Just the problem
                  and whether it has a solution worth building.
                </p>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="cta-btn"
                  rel="noopener noreferrer"
                >
                  Book the 30-minute call
                </a>
              </motion.div>
              <div style={{ marginTop: "3rem" }}>
                <HairlineRule />
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              FOOTER
          ════════════════════════════════════════════════ */}
          <footer
            role="contentinfo"
            style={{
              borderTop: `1px solid ${C.rule}`,
              padding: "2rem",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.2rem",
                  color: C.muted,
                  letterSpacing: "-0.01em",
                }}
              >
                Le Monde Noir
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.54rem",
                  color: C.muted,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                SkynetLabs &middot; Est. 2019 &middot; Remote &middot; 9
                Countries
              </div>
              <a
                href="https://skynetjoe.com/discovery-call"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.6rem",
                  color: C.accent,
                  textDecoration: "none",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.7")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
                }
              >
                skynetjoe.com
              </a>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
