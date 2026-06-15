"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "framer-motion";

/* ─── SCOPED FONTS ─── */
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Anton&family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Space+Mono:wght@400&display=swap";

/* ─── PALETTE ─── */
const P = {
  bg: "#111111",
  surface: "#1C1C1C",
  text: "#F2F2F2",
  muted: "#808080",
  accent: "#FFE600",
  accent2: "#FF5A36",
};

/* ─── REAL IMAGES ─── */
const IMAGES = {
  hero: "/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
  work1:
    "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  work2:
    "/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  work3: "/img/pro/WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
  work4:
    "/img/pro/CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  work5:
    "/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
  about1:
    "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
  about2: "/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  event: "/img/pro/EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
  cafe1:
    "/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
  travel:
    "/img/pro/TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
  night:
    "/img/pro/CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg",
};

/* ─── SERVICES ─── */
const SERVICES = [
  {
    id: "01",
    name: "AI Voice & WhatsApp Bots",
    desc: "Handles inbound calls and DMs without a human. Books appointments, qualifies leads, sends follow-ups — round the clock.",
  },
  {
    id: "02",
    name: "n8n Workflow Automation",
    desc: "Connects your CRM, inbox, Stripe, and calendar into one silent machine. No more copy-paste ops.",
  },
  {
    id: "03",
    name: "Next.js Web Systems",
    desc: "Fast, indexed, conversion-tuned sites built for search and real traffic. Not templates.",
  },
  {
    id: "04",
    name: "Answer Engine Optimization",
    desc: "Gets your brand cited by AI — ChatGPT, Perplexity, Gemini. The new SEO before your competitors discover it.",
  },
  {
    id: "05",
    name: "Lead Recovery Automation",
    desc: "Dead lead pile? Re-engagement sequences that fire on contact-drop signals and bring them back.",
  },
  {
    id: "06",
    name: "Clinic & Agency Ops Stacks",
    desc: "End-to-end ops for clinics and agencies: intake, scheduling, billing comms, reporting — one system.",
  },
];

/* ─── CASE STUDIES (horizontal scroll cards) ─── */
const CASES = [
  {
    num: "01",
    client: "Freight Ops",
    region: "United States",
    result: "Zero missed calls. AI voice bot handles all inbound 24/7.",
    img: IMAGES.work1,
    tag: "Voice AI",
  },
  {
    num: "02",
    client: "Medical Practice",
    region: "Middle East",
    result: "$27K funnel live in 3 weeks. Stripe + booking fully automated.",
    img: IMAGES.work2,
    tag: "Funnel Automation",
  },
  {
    num: "03",
    client: "Trades Agency",
    region: "Singapore",
    result: "WhatsApp bot converts 6× faster than their old form.",
    img: IMAGES.work3,
    tag: "WhatsApp Bot",
  },
  {
    num: "04",
    client: "SaaS Startup",
    region: "Europe",
    result: "n8n pipeline cuts ops time by 12 hrs/week.",
    img: IMAGES.work4,
    tag: "n8n Automation",
  },
  {
    num: "05",
    client: "Consulting Firm",
    region: "Australia",
    result: "AEO citations up 3× in 60 days. ChatGPT now recommends them.",
    img: IMAGES.work5,
    tag: "AEO",
  },
];

/* ─── PER-WORD WIPE REVEAL ─── */
function WordReveal({
  text,
  className,
  delay = 0,
  highlight,
}: {
  text: string;
  className?: string;
  delay?: number;
  highlight?: string[];
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  const words = text.split(" ");

  return (
    <span ref={ref} className={className} style={{ display: "inline" }}>
      {words.map((word, i) => {
        const isHighlight = highlight?.some((h) =>
          word.toLowerCase().includes(h.toLowerCase()),
        );
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              position: "relative",
              marginRight: "0.22em",
              overflow: "hidden",
            }}
          >
            {isHighlight && (
              <motion.span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "-2px -4px",
                  background: P.accent,
                  zIndex: 0,
                  transformOrigin: "left center",
                  scaleX: 0,
                }}
                animate={inView && !reduced ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{
                  duration: 0.35,
                  delay: delay + i * 0.07 + 0.1,
                  ease: "easeOut",
                }}
              />
            )}
            <motion.span
              style={{
                display: "inline-block",
                clipPath: "inset(0 100% 0 0)",
                position: "relative",
                zIndex: 1,
                color: isHighlight ? P.bg : undefined,
              }}
              animate={
                inView && !reduced
                  ? { clipPath: "inset(0 0% 0 0)" }
                  : { clipPath: "inset(0 100% 0 0)" }
              }
              transition={{
                duration: 0.5,
                delay: delay + i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

/* ─── COUNT-UP STAT ─── */
function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || reduced) {
      setCount(value);
      return;
    }
    let start = 0;
    const step = Math.ceil(value / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, value, reduced]);

  return (
    <div
      ref={ref}
      style={{ borderLeft: `3px solid ${P.accent}`, paddingLeft: "1.25rem" }}
    >
      <div
        style={{
          fontFamily: "Anton, sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          color: P.text,
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}
      >
        {count}
        <span style={{ color: P.accent }}>{suffix}</span>
      </div>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.7rem",
          color: P.muted,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginTop: "0.4rem",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─── HORIZONTAL GALLERY ─── */
function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const reduced = useReducedMotion();

  const cardWidth = 440;
  const gap = 32;
  const totalCards = CASES.length;
  const totalWidth = totalCards * (cardWidth + gap);
  const xRange = -(
    totalWidth -
    (typeof window !== "undefined" ? window.innerWidth : 1440) +
    80
  );

  const x = useTransform(scrollYProgress, [0, 1], [80, xRange]);
  const xStatic = 80;

  return (
    <section
      ref={containerRef}
      style={{
        height: `${totalCards * 100}vh`,
        position: "relative",
      }}
      aria-label="Selected work"
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Section label */}
        <div
          style={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.7rem",
              color: P.accent,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}
          >
            Selected Work — Drag to scroll
          </span>
        </div>

        <motion.div
          style={{
            display: "flex",
            gap: `${gap}px`,
            x: reduced ? xStatic : x,
            paddingLeft: "2rem",
          }}
        >
          {CASES.map((c, i) => (
            <motion.article
              key={c.num}
              initial={reduced ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{
                width: `${cardWidth}px`,
                flexShrink: 0,
                background: P.surface,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "280px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={c.img}
                  alt={`${c.client} project`}
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
                    top: "1rem",
                    left: "1rem",
                    background: P.accent,
                    color: P.bg,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.65rem",
                    padding: "0.25rem 0.6rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {c.tag}
                </div>
              </div>
              <div style={{ padding: "2rem" }}>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.65rem",
                    color: P.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: "0.5rem",
                  }}
                >
                  {c.num} — {c.region}
                </div>
                <h3
                  style={{
                    fontFamily: "Anton, sans-serif",
                    fontSize: "1.75rem",
                    color: P.text,
                    lineHeight: 1.05,
                    letterSpacing: "0.01em",
                    marginBottom: "1rem",
                  }}
                >
                  {c.client}
                </h3>
                <p
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontSize: "1rem",
                    color: P.muted,
                    lineHeight: 1.6,
                  }}
                >
                  {c.result}
                </p>
              </div>
              {/* Yellow accent bar bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "3px",
                  background: P.accent,
                }}
              />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── MAIN PAGE ─── */
export default function Design05SignalColorEditorial() {
  const reduced = useReducedMotion();

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');

        .root-05 {
          background: ${P.bg};
          color: ${P.text};
          font-family: 'Fraunces', serif;
          position: relative;
          z-index: 2;
          min-height: 100vh;
        }

        .root-05 * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .root-05 a:focus-visible {
          outline: 2px solid ${P.accent};
          outline-offset: 3px;
        }

        .root-05 .skip-05 {
          position: absolute;
          left: -9999px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
        .root-05 .skip-05:focus {
          position: fixed;
          top: 1rem;
          left: 1rem;
          width: auto;
          height: auto;
          padding: 0.75rem 1.25rem;
          background: ${P.accent};
          color: ${P.bg};
          font-family: 'Space Mono', monospace;
          font-size: 0.85rem;
          z-index: 9999;
        }

        .root-05 .hero-type {
          font-family: Anton, sans-serif;
          font-size: clamp(4.5rem, 13vw, 12rem);
          line-height: 0.9;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: ${P.text};
        }

        .root-05 .bleeding-left {
          margin-left: -0.04em;
        }

        .root-05 .section-rule {
          border: none;
          border-top: 1px solid #2A2A2A;
          margin: 0;
        }

        .root-05 .cta-btn {
          display: inline-block;
          background: ${P.accent};
          color: ${P.bg};
          font-family: Anton, sans-serif;
          font-size: 1.1rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 1.1rem 2.5rem;
          transition: background 0.2s, color 0.2s;
          position: relative;
        }
        .root-05 .cta-btn:hover {
          background: ${P.accent2};
          color: ${P.text};
        }

        .root-05 .service-item {
          border-top: 1px solid #2A2A2A;
          padding: 2rem 0;
          display: grid;
          grid-template-columns: 60px 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 768px) {
          .root-05 .service-item {
            grid-template-columns: 40px 1fr;
          }
          .root-05 .service-item .svc-desc {
            grid-column: 2;
          }
        }

        .root-05 .nav-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          background: rgba(17,17,17,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #1C1C1C;
        }

        @media (max-width: 640px) {
          .root-05 .hero-type {
            font-size: clamp(3rem, 15vw, 6rem);
          }
        }
      `}</style>

      <div className="root-05">
        <a href="#main-content-05" className="skip-05">
          Skip to content
        </a>

        {/* NAV */}
        <nav className="nav-bar" aria-label="Primary navigation">
          <span
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "1.1rem",
              letterSpacing: "0.08em",
              color: P.text,
              textTransform: "uppercase",
            }}
          >
            Waseem<span style={{ color: P.accent }}>.</span>
          </span>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="cta-btn"
            style={{ fontSize: "0.75rem", padding: "0.6rem 1.4rem" }}
          >
            Book a Call
          </a>
        </nav>

        {/* ── HERO ── */}
        <main id="main-content-05">
          <section
            style={{
              minHeight: "100vh",
              paddingTop: "5rem",
              display: "grid",
              gridTemplateColumns: "1fr",
              position: "relative",
              overflow: "hidden",
            }}
            aria-label="Hero"
          >
            {/* Top ticker */}
            <div
              style={{
                borderBottom: `1px solid #2A2A2A`,
                padding: "0.75rem 2rem",
                display: "flex",
                gap: "3rem",
                overflow: "hidden",
              }}
            >
              {[
                "SkynetLabs",
                "Founded 2019",
                "180+ Builds",
                "40+ Clients",
                "9 Countries",
                "Bali · Lahore · Remote",
              ].map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.65rem",
                    color: P.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 380px",
                gap: "0",
                flex: 1,
                minHeight: "calc(100vh - 8rem)",
              }}
            >
              {/* Left: Giant type */}
              <div
                style={{
                  padding: "3rem 2rem 3rem 2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRight: "1px solid #2A2A2A",
                }}
              >
                <div>
                  {/* Issue label */}
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.65rem",
                      color: P.accent,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      marginBottom: "2.5rem",
                    }}
                  >
                    Vol. 05 — Signal/Color — 2019–Present
                  </div>

                  <h1 className="hero-type bleeding-left">
                    <WordReveal text="THE QUIET" delay={0.1} />
                    <br />
                    <WordReveal
                      text="FORCE"
                      delay={0.3}
                      highlight={["FORCE"]}
                    />
                    <br />
                    <WordReveal text="BEHIND" delay={0.45} />
                    <br />
                    <WordReveal text="40+" delay={0.55} highlight={["40+"]} />
                    <br />
                    <WordReveal text="BUSINESSES" delay={0.65} />
                  </h1>
                </div>

                <div>
                  <p
                    style={{
                      fontFamily: "Fraunces, serif",
                      fontSize: "clamp(1rem, 2vw, 1.25rem)",
                      color: P.muted,
                      lineHeight: 1.7,
                      maxWidth: "52ch",
                      marginBottom: "2.5rem",
                    }}
                  >
                    180+ automations shipped since 2019, across 9 countries.
                    Missed leads, dead follow-ups, manual ops — none of them
                    survive contact with what I build.
                  </p>

                  <a
                    href="https://skynetjoe.com/discovery-call"
                    className="cta-btn"
                    aria-label="Book a 30-minute discovery call"
                  >
                    Book 30-min Call &rarr;
                  </a>
                </div>
              </div>

              {/* Right: Hero image */}
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  background: P.surface,
                }}
              >
                <img
                  src={IMAGES.hero}
                  alt="Waseem Nasir — founder of SkynetLabs"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    display: "block",
                  }}
                />
                {/* Overlay label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "2rem",
                    left: "1.5rem",
                    right: "1.5rem",
                    background: P.accent,
                    color: P.bg,
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Anton, sans-serif",
                      fontSize: "0.85rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Waseem Nasir
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.08em",
                      marginTop: "0.2rem",
                    }}
                  >
                    Founder, SkynetLabs
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── PROOF NUMBERS ── */}
          <section
            aria-label="Proof numbers"
            style={{
              padding: "5rem 2rem",
              borderTop: "1px solid #2A2A2A",
              borderBottom: "1px solid #2A2A2A",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "3rem",
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            >
              <Stat value={180} suffix="+" label="Automations Shipped" />
              <Stat value={40} suffix="+" label="Clients Worldwide" />
              <Stat value={9} suffix="" label="Countries Worked In" />
              <Stat value={2019} suffix="" label="Operating Since" />
            </div>
          </section>

          {/* ── SIGNAL BAR (accent statement) ── */}
          <section
            style={{
              background: P.accent,
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                fontFamily: "Anton, sans-serif",
                fontSize: "clamp(1.5rem, 4vw, 3rem)",
                color: P.bg,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              They never miss a lead
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.7rem",
                color: "rgba(0,0,0,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                flexShrink: 0,
              }}
            >
              — that's the only metric that matters.
            </span>
          </section>

          {/* ── WHAT I DO (SERVICES) ── */}
          <section
            aria-label="Services"
            style={{
              padding: "5rem 2rem",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "4rem",
                marginBottom: "3rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.65rem",
                    color: P.accent,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    display: "block",
                  }}
                >
                  What I Do
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  color: P.text,
                  lineHeight: 1,
                  letterSpacing: "0.01em",
                  textTransform: "uppercase",
                }}
              >
                <WordReveal
                  text="Six Systems. One Operator."
                  delay={0}
                  highlight={["Six", "One"]}
                />
              </h2>
            </div>

            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.id}
                className="service-item"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.65rem",
                    color: P.accent,
                    letterSpacing: "0.1em",
                    paddingTop: "0.2rem",
                  }}
                >
                  {svc.id}
                </span>
                <h3
                  style={{
                    fontFamily: "Anton, sans-serif",
                    fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)",
                    color: P.text,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {svc.name}
                </h3>
                <p
                  className="svc-desc"
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontSize: "0.95rem",
                    color: P.muted,
                    lineHeight: 1.65,
                  }}
                >
                  {svc.desc}
                </p>
              </motion.div>
            ))}
          </section>

          {/* ── PHOTO GRID (editorial break) ── */}
          <section
            aria-label="In the field"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              height: "50vh",
              overflow: "hidden",
            }}
          >
            {[IMAGES.cafe1, IMAGES.travel, IMAGES.night, IMAGES.event].map(
              (src, i) => (
                <div
                  key={i}
                  style={{ overflow: "hidden", position: "relative" }}
                >
                  <img
                    src={src}
                    alt="Waseem Nasir working remotely"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: i % 2 === 1 ? "none" : "grayscale(30%)",
                    }}
                  />
                  {i === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1rem",
                        left: "1rem",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.6rem",
                        color: P.accent,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                      }}
                    >
                      Bali, 2026
                    </div>
                  )}
                </div>
              ),
            )}
          </section>

          {/* ── HORIZONTAL CASE STUDIES ── */}
          <HorizontalGallery />

          {/* ── ABOUT ── */}
          <section
            aria-label="About Waseem"
            style={{
              padding: "6rem 2rem",
              borderTop: "1px solid #2A2A2A",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "5rem",
                maxWidth: "1200px",
                margin: "0 auto",
                alignItems: "start",
              }}
            >
              {/* Images col */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <img
                  src={IMAGES.about1}
                  alt="Waseem Nasir in Bali"
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    objectPosition: "top",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    paddingTop: "3rem",
                  }}
                >
                  <img
                    src={IMAGES.about2}
                    alt="Waseem Nasir at Nusa Penida cliffs"
                    style={{
                      width: "100%",
                      aspectRatio: "3/4",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      background: P.accent,
                      padding: "1.5rem",
                      color: P.bg,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Anton, sans-serif",
                        fontSize: "2rem",
                        lineHeight: 1,
                      }}
                    >
                      2019
                    </div>
                    <div
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.6rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginTop: "0.4rem",
                      }}
                    >
                      Year One — Still running.
                    </div>
                  </div>
                </div>
              </div>

              {/* Text col */}
              <div style={{ paddingTop: "1rem" }}>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.65rem",
                    color: P.accent,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    display: "block",
                    marginBottom: "1.5rem",
                  }}
                >
                  The Operator
                </span>
                <h2
                  style={{
                    fontFamily: "Anton, sans-serif",
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    color: P.text,
                    lineHeight: 0.95,
                    letterSpacing: "0.01em",
                    textTransform: "uppercase",
                    marginBottom: "2rem",
                  }}
                >
                  <WordReveal
                    text="WASEEM NASIR"
                    delay={0}
                    highlight={["NASIR"]}
                  />
                </h2>
                <div
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontSize: "1.05rem",
                    color: P.muted,
                    lineHeight: 1.75,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <p>
                    I started SkynetLabs in 2019 with one premise: most business
                    problems are operational problems wearing disguises. A
                    clinic losing patients? Operations. An agency bleeding
                    margins? Operations. A founder working 14-hour days?
                    Operations.
                  </p>
                  <p>
                    I build the systems that remove the bottlenecks. n8n
                    automation pipelines, AI voice receptionists, WhatsApp bots,
                    Next.js lead machines, AEO stacks that put you in the AI
                    answer box before your competitor discovers the game exists.
                  </p>
                  <p>
                    Based wherever has the best espresso — currently Bali and
                    Lahore. I work with founders across the US, UK, Middle East,
                    Southeast Asia and Australia.
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "2rem",
                    marginTop: "2.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href="https://github.com/waseemnasir2k26"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.7rem",
                      color: P.accent,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      textDecoration: "none",
                      borderBottom: `1px solid ${P.accent}`,
                      paddingBottom: "0.2rem",
                    }}
                    aria-label="GitHub profile"
                  >
                    GitHub &rarr;
                  </a>
                  <a
                    href="https://skynetjoe.com"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.7rem",
                      color: P.muted,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      textDecoration: "none",
                      borderBottom: `1px solid #2A2A2A`,
                      paddingBottom: "0.2rem",
                    }}
                    aria-label="SkynetLabs website"
                  >
                    SkynetLabs &rarr;
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ── RED ACCENT QUOTE ── */}
          <section
            style={{
              background: P.accent2,
              padding: "4rem 2rem",
              borderTop: `4px solid ${P.accent}`,
            }}
          >
            <div
              style={{
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <p
                style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  color: P.text,
                  lineHeight: 1.05,
                  textTransform: "uppercase",
                  letterSpacing: "0.01em",
                }}
              >
                "If it runs on people, it's fragile. If it runs on systems, it
                scales."
              </p>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.65rem",
                  color: "rgba(242,242,242,0.6)",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  marginTop: "1.5rem",
                }}
              >
                — Waseem Nasir / SkynetLabs
              </div>
            </div>
          </section>

          {/* ── CTA / CONTACT ── */}
          <section
            aria-label="Book a call"
            style={{
              padding: "7rem 2rem",
              borderTop: "1px solid #2A2A2A",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 400px",
                gap: "4rem",
                maxWidth: "1200px",
                margin: "0 auto",
                alignItems: "end",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.65rem",
                    color: P.accent,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    display: "block",
                    marginBottom: "1.5rem",
                  }}
                >
                  Next Step
                </span>
                <h2
                  style={{
                    fontFamily: "Anton, sans-serif",
                    fontSize: "clamp(3rem, 8vw, 7rem)",
                    color: P.text,
                    lineHeight: 0.9,
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                  }}
                >
                  <WordReveal
                    text="STOP LOSING LEADS."
                    delay={0}
                    highlight={["LOSING"]}
                  />
                </h2>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontSize: "1.05rem",
                    color: P.muted,
                    lineHeight: 1.7,
                    marginBottom: "2.5rem",
                  }}
                >
                  30 minutes. No deck, no agency pitch. We look at your actual
                  ops, find the leakage, and I tell you exactly what to build —
                  even if you decide not to use me.
                </p>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="cta-btn"
                  aria-label="Book a 30-minute discovery call with Waseem Nasir"
                >
                  Book Your Call &rarr;
                </a>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.6rem",
                    color: P.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginTop: "1rem",
                  }}
                >
                  Free · 30 min · Remote · No hard sell
                </div>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer
            role="contentinfo"
            style={{
              borderTop: "1px solid #2A2A2A",
              padding: "2.5rem 2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: "1rem",
                  color: P.text,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Waseem<span style={{ color: P.accent }}>.</span>
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.6rem",
                  color: P.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                SkynetLabs &copy; {new Date().getFullYear()}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "2rem",
              }}
            >
              {[
                { label: "GitHub", href: "https://github.com/waseemnasir2k26" },
                { label: "SkynetLabs", href: "https://skynetjoe.com" },
                {
                  label: "Book a Call",
                  href: "https://skynetjoe.com/discovery-call",
                },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.6rem",
                    color: P.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    textDecoration: "none",
                  }}
                  aria-label={link.label}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
