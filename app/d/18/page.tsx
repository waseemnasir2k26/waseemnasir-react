"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* ─── CONSTANTS ─────────────────────────────────────────── */
const ACCENT = "#1500FF";
const ACCENT2 = "#E8FF00";
const TEXT = "#050505";
const BG = "#FFFFFF";
const SURFACE = "#F2F2F2";
const MUTED = "#8A8A8A";

const SERVICES = [
  {
    id: "01",
    label: "AI VOICE + WHATSAPP BOTS",
    body: "Every missed call is a dead lead. I wire voice + WhatsApp bots that answer, qualify, and book — 24/7, zero human.",
  },
  {
    id: "02",
    label: "N8N WORKFLOW AUTOMATION",
    body: "Manual handoffs, copy-paste hell, forgotten follow-ups. n8n chains kill all of it. You describe the ops; I build the pipe.",
  },
  {
    id: "03",
    label: "AEO + NEXT.JS SITES",
    body: "Answer Engine Optimisation on a fast Next.js shell. AI search cites you. Clients find you. You stop explaining yourself.",
  },
  {
    id: "04",
    label: "LEAD-CAPTURE FUNNELS",
    body: "Forms that don't convert are art projects. I build funnels wired straight into your CRM / WhatsApp / calendar.",
  },
  {
    id: "05",
    label: "CRM + PIPELINE WIRING",
    body: "GHL, HubSpot, Notion — whatever you run. I wire the data layer so nothing falls through and every deal is tracked.",
  },
  {
    id: "06",
    label: "FULL-STACK SHIPPING",
    body: "Product in your head → production URL. TypeScript + Next.js + Postgres. No PM layer. I ship direct.",
  },
];

const WORK_ITEMS = [
  {
    label: "FREIGHTOPS",
    tag: "AI VOICE + OPS",
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    loc: "USA + SINGAPORE",
  },
  {
    label: "INSPIRE HEALTH PT",
    tag: "FUNNEL + STRIPE",
    img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
    loc: "USA",
  },
  {
    label: "IDEAVIAGGI TRIPS",
    tag: "WP PLUGIN + CPT",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    loc: "ITALY",
  },
  {
    label: "SKYNETJOE.COM",
    tag: "AEO + NEXT.JS",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    loc: "GLOBAL",
  },
  {
    label: "TAKYCORP EMAIL AI",
    tag: "AI AUTOMATION",
    img: "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
    loc: "FRANCE",
  },
  {
    label: "GIGSIGNAL EXT",
    tag: "CHROME EXTENSION",
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    loc: "REMOTE",
  },
];

const MARQUEE_ITEMS = [
  "180+ BUILDS SHIPPED",
  "40+ CLIENTS SERVED",
  "9 COUNTRIES WORKED",
  "SINCE 2019",
  "ZERO PADDING",
  "NO EXCUSES",
  "SYSTEMS THAT SHIP",
  "KILL BUSYWORK",
];

/* ─── HOOK: BOX SHADOW SNAP ──────────────────────────────── */
function useSnapShadow() {
  const [pressed, setPressed] = useState(false);
  return {
    pressed,
    handlers: {
      onMouseDown: () => setPressed(true),
      onMouseUp: () => setPressed(false),
      onMouseLeave: () => setPressed(false),
    },
    style: pressed
      ? { boxShadow: "0 0 0 0 " + TEXT, transform: "translate(4px,4px)" }
      : { boxShadow: `4px 4px 0 0 ${TEXT}`, transform: "translate(0,0)" },
  };
}

/* ─── SUB-COMPONENTS ─────────────────────────────────────── */

function BorderBox({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        border: `1px solid ${TEXT}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SnapButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const snap = useSnapShadow();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...snap.handlers}
      style={{
        display: "inline-block",
        padding: "14px 32px",
        background: ACCENT,
        color: ACCENT2,
        fontFamily: "'Archivo', sans-serif",
        fontWeight: 900,
        fontSize: "13px",
        letterSpacing: "0.12em",
        textDecoration: "none",
        border: `1px solid ${TEXT}`,
        cursor: "pointer",
        transition: "box-shadow 0.08s ease, transform 0.08s ease",
        ...snap.style,
      }}
    >
      {children}
    </a>
  );
}

function ServiceCard({ s, i }: { s: (typeof SERVICES)[0]; i: number }) {
  const snap = useSnapShadow();
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 24 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
      {...snap.handlers}
      style={{
        border: `1px solid ${TEXT}`,
        padding: "28px 24px",
        background: i % 2 === 0 ? BG : SURFACE,
        cursor: "default",
        transition: "box-shadow 0.08s ease, transform 0.08s ease",
        ...snap.style,
      }}
    >
      <div
        style={{
          fontFamily: "'Martian Mono', monospace",
          fontSize: "11px",
          color: MUTED,
          marginBottom: "12px",
        }}
      >
        {s.id}
      </div>
      <div
        style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 900,
          fontSize: "14px",
          letterSpacing: "0.08em",
          marginBottom: "12px",
          color: TEXT,
        }}
      >
        {s.label}
      </div>
      <div
        style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 400,
          fontSize: "13px",
          lineHeight: 1.65,
          color: MUTED,
        }}
      >
        {s.body}
      </div>
    </motion.div>
  );
}

/* ─── MARQUEE ─────────────────────────────────────────────── */
function Marquee() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const skew = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -4]);

  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: `1px solid ${TEXT}`,
        borderBottom: `1px solid ${TEXT}`,
        background: ACCENT,
        padding: "14px 0",
      }}
    >
      <motion.div
        style={{ display: "flex", gap: "0", skewX: skew }}
        animate={reduced ? {} : { x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 900,
              fontSize: "13px",
              letterSpacing: "0.14em",
              color: ACCENT2,
              whiteSpace: "nowrap",
              paddingRight: "60px",
            }}
          >
            {item} ·
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── WORK GRID ────────────────────────────────────────────── */
function WorkCard({ item, i }: { item: (typeof WORK_ITEMS)[0]; i: number }) {
  const snap = useSnapShadow();
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 30 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: i * 0.06 }}
      {...snap.handlers}
      style={{
        border: `1px solid ${TEXT}`,
        background: BG,
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 0.08s ease, transform 0.08s ease",
        ...snap.style,
      }}
    >
      <div
        style={{
          aspectRatio: "4/3",
          overflow: "hidden",
          borderBottom: `1px solid ${TEXT}`,
        }}
      >
        <img
          src={`/img/pro/${item.img}`}
          alt={item.label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
      <div style={{ padding: "16px 18px" }}>
        <div
          style={{
            fontFamily: "'Martian Mono', monospace",
            fontSize: "10px",
            color: ACCENT,
            marginBottom: "6px",
            letterSpacing: "0.1em",
          }}
        >
          {item.tag} · {item.loc}
        </div>
        <div
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: "15px",
            color: TEXT,
          }}
        >
          {item.label}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── STAT BLOCK ──────────────────────────────────────────── */
function StatBlock({ num, label }: { num: string; label: string }) {
  return (
    <BorderBox style={{ padding: "28px 24px", flex: 1, minWidth: "140px" }}>
      <div
        style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(36px, 5vw, 56px)",
          color: ACCENT,
          lineHeight: 1,
        }}
      >
        {num}
      </div>
      <div
        style={{
          fontFamily: "'Martian Mono', monospace",
          fontSize: "11px",
          color: MUTED,
          marginTop: "10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </BorderBox>
  );
}

/* ─── MAIN PAGE ───────────────────────────────────────────── */
export default function SwissPoison() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, reduced ? 0 : -60]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;900&family=Martian+Mono:wght@400;500&display=swap');

        .root-18 * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .root-18 a:focus-visible {
          outline: 2px solid ${ACCENT};
          outline-offset: 3px;
        }
        .root-18 img:focus-visible {
          outline: 2px solid ${ACCENT};
        }
        .root-18 .grid-services {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0;
        }
        .root-18 .grid-services > * {
          border-right: 1px solid ${TEXT};
          border-bottom: 1px solid ${TEXT};
          margin: -1px -1px 0 0;
        }
        .root-18 .grid-work {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0;
        }
        .root-18 .grid-work > * {
          margin: -1px -1px 0 0;
        }
        .root-18 .stats-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
        }
        .root-18 .stats-row > * {
          border-right: 1px solid ${TEXT};
          margin-right: -1px;
        }
        .root-18 .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        @media (max-width: 720px) {
          .root-18 .about-grid {
            grid-template-columns: 1fr;
          }
          .root-18 .hero-headline {
            font-size: clamp(38px, 11vw, 80px) !important;
          }
        }
        @media (max-width: 560px) {
          .root-18 .stats-row {
            flex-direction: column;
          }
          .root-18 .stats-row > * {
            border-right: none;
            border-bottom: 1px solid ${TEXT};
          }
        }
      `}</style>

      <div
        className="root-18"
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          background: BG,
          color: TEXT,
          fontFamily: "'Archivo', sans-serif",
        }}
      >
        {/* ── SKIP LINK ── */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "auto",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
          onFocus={(e) => {
            (e.target as HTMLElement).style.left = "16px";
            (e.target as HTMLElement).style.top = "16px";
            (e.target as HTMLElement).style.width = "auto";
            (e.target as HTMLElement).style.height = "auto";
          }}
          onBlur={(e) => {
            (e.target as HTMLElement).style.left = "-9999px";
          }}
        >
          Skip to main content
        </a>

        {/* ── NAV ── */}
        <nav
          role="navigation"
          aria-label="Primary"
          style={{
            borderBottom: `1px solid ${TEXT}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            height: "52px",
            position: "sticky",
            top: 0,
            background: BG,
            zIndex: 100,
          }}
        >
          <div
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 900,
              fontSize: "13px",
              letterSpacing: "0.14em",
            }}
          >
            WASEEM NASIR
          </div>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {["WORK", "SERVICES", "ABOUT"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: "11px",
                  color: TEXT,
                  textDecoration: "none",
                  letterSpacing: "0.1em",
                }}
              >
                {item}
              </a>
            ))}
            <SnapButton href="https://skynetjoe.com/discovery-call">
              BOOK CALL
            </SnapButton>
          </div>
        </nav>

        <main id="main-content">
          {/* ── HERO ── */}
          <section
            style={{
              borderBottom: `1px solid ${TEXT}`,
              padding: "80px 24px 64px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* accent stripe */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "6px",
                height: "100%",
                background: ACCENT,
              }}
            />

            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              {/* label */}
              <BorderBox
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  marginBottom: "32px",
                  background: ACCENT2,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                  }}
                >
                  SKYNETLABS · AUTOMATION SYSTEMS · EST. 2019
                </span>
              </BorderBox>

              <motion.h1
                className="hero-headline"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(48px, 9vw, 120px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  color: TEXT,
                  maxWidth: "900px",
                  marginBottom: "40px",
                  y: heroY,
                }}
              >
                I DELETE
                <br />
                <span style={{ color: ACCENT }}>JOBS.</span>
                <br />
                THE BORING
                <br />
                ONES. ON
                <br />
                <span
                  style={{
                    WebkitTextStroke: `2px ${TEXT}`,
                    color: "transparent",
                  }}
                >
                  PURPOSE.
                </span>
              </motion.h1>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "24px",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ maxWidth: "480px" }}>
                  <p
                    style={{
                      fontFamily: "'Archivo', sans-serif",
                      fontWeight: 400,
                      fontSize: "18px",
                      lineHeight: 1.55,
                      color: MUTED,
                      marginBottom: "32px",
                    }}
                  >
                    No fluff. Shipped systems. 180+ builds, 40+ clients, 9
                    countries. If it can be automated, it will be. If it can't
                    justify itself, it's gone.
                  </p>
                  <SnapButton href="https://skynetjoe.com/discovery-call">
                    BOOK 30-MIN CALL — FREE
                  </SnapButton>
                </div>

                {/* hero image stack */}
                <div style={{ display: "flex", gap: "0", flex: "0 0 auto" }}>
                  <BorderBox
                    style={{
                      width: "140px",
                      height: "180px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
                      alt="Waseem Nasir, founder of SkynetLabs"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top",
                      }}
                    />
                  </BorderBox>
                  <BorderBox
                    style={{
                      width: "140px",
                      height: "180px",
                      overflow: "hidden",
                      marginLeft: "-1px",
                    }}
                  >
                    <img
                      src="/img/pro/CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg"
                      alt="Working remotely from Bali"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top",
                      }}
                    />
                  </BorderBox>
                </div>
              </div>
            </div>
          </section>

          {/* ── MARQUEE ── */}
          <Marquee />

          {/* ── STATS ── */}
          <section
            aria-label="Key numbers"
            style={{ borderBottom: `1px solid ${TEXT}` }}
          >
            <div
              className="stats-row"
              style={{ maxWidth: "1200px", margin: "0 auto" }}
            >
              <StatBlock num="180+" label="Builds shipped" />
              <StatBlock num="40+" label="Clients served" />
              <StatBlock num="9" label="Countries worked" />
              <StatBlock num="2019" label="Year founded" />
              <BorderBox
                style={{
                  flex: 2,
                  minWidth: "200px",
                  padding: "28px 24px",
                  background: ACCENT,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 600,
                    fontSize: "15px",
                    lineHeight: 1.5,
                    color: ACCENT2,
                    maxWidth: "280px",
                  }}
                >
                  Every build solves a real ops problem. No vanity projects. No
                  spec work.
                </p>
              </BorderBox>
            </div>
          </section>

          {/* ── SERVICES ── */}
          <section id="services" style={{ borderBottom: `1px solid ${TEXT}` }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              {/* section header */}
              <div
                style={{
                  borderBottom: `1px solid ${TEXT}`,
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    color: MUTED,
                  }}
                >
                  02 / SERVICES
                </div>
                <div
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(18px, 3vw, 28px)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  WHAT DIES WHEN I SHOW UP
                </div>
              </div>

              <div className="grid-services">
                {SERVICES.map((s, i) => (
                  <ServiceCard key={s.id} s={s} i={i} />
                ))}
              </div>
            </div>
          </section>

          {/* ── MANIFESTO BAND ── */}
          <section
            style={{
              borderBottom: `1px solid ${TEXT}`,
              background: SURFACE,
              padding: "60px 24px",
            }}
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0",
                }}
              >
                <BorderBox
                  style={{
                    padding: "40px 32px",
                    borderRight: `1px solid ${TEXT}`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Archivo', sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(22px, 3.5vw, 40px)",
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                      color: TEXT,
                    }}
                  >
                    "AGENCIES SELL HOURS.
                    <br />
                    I SELL OUTCOMES.
                    <br />
                    THE PRICE IS YOUR
                    <br />
                    BROKEN PROCESS."
                  </p>
                </BorderBox>
                <BorderBox
                  style={{ padding: "40px 32px", background: ACCENT2 }}
                >
                  <div
                    style={{
                      fontFamily: "'Martian Mono', monospace",
                      fontSize: "11px",
                      color: MUTED,
                      marginBottom: "20px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    THE OPERATING PRINCIPLE
                  </div>
                  <ul
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    {[
                      "Build the thing that kills the manual task.",
                      "Ship fast. Iterate if needed. Never ship air.",
                      "Clients get loom walkthroughs, not jargon decks.",
                      "One CTA. One owner. Zero hand-holding chains.",
                    ].map((line, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          gap: "12px",
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Martian Mono', monospace",
                            fontSize: "11px",
                            color: ACCENT,
                            marginTop: "2px",
                            flexShrink: 0,
                          }}
                        >
                          [{String(i + 1).padStart(2, "0")}]
                        </span>
                        <span
                          style={{
                            fontFamily: "'Archivo', sans-serif",
                            fontSize: "14px",
                            lineHeight: 1.55,
                            color: TEXT,
                          }}
                        >
                          {line}
                        </span>
                      </li>
                    ))}
                  </ul>
                </BorderBox>
              </div>
            </div>
          </section>

          {/* ── SELECTED WORK ── */}
          <section id="work" style={{ borderBottom: `1px solid ${TEXT}` }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div
                style={{
                  borderBottom: `1px solid ${TEXT}`,
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    color: MUTED,
                  }}
                >
                  03 / SELECTED WORK
                </div>
                <div
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(18px, 3vw, 28px)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  PROOF, NOT PROMISE
                </div>
              </div>

              <div className="grid-work">
                {WORK_ITEMS.map((item, i) => (
                  <WorkCard key={item.label} item={item} i={i} />
                ))}
              </div>
            </div>
          </section>

          {/* ── ABOUT ── */}
          <section id="about" style={{ borderBottom: `1px solid ${TEXT}` }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="about-grid">
                {/* photo column */}
                <BorderBox
                  style={{
                    borderRight: `1px solid ${TEXT}`,
                    position: "relative",
                    minHeight: "480px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                    alt="Waseem Nasir on balcony, SkynetLabs founder"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top",
                      position: "absolute",
                      inset: 0,
                    }}
                  />
                  {/* yellow label */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: ACCENT2,
                      borderTop: `1px solid ${TEXT}`,
                      padding: "12px 20px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Martian Mono', monospace",
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                        color: TEXT,
                      }}
                    >
                      BALI / LAHORE · REMOTE-FIRST
                    </div>
                  </div>
                </BorderBox>

                {/* text column */}
                <div
                  style={{
                    padding: "40px 32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'Martian Mono', monospace",
                        fontSize: "11px",
                        color: MUTED,
                        marginBottom: "16px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      04 / ABOUT
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(24px, 3.5vw, 38px)",
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        marginBottom: "20px",
                      }}
                    >
                      WASEEM NASIR.
                      <br />
                      INDEPENDENT.
                      <br />
                      FOUNDER.
                    </h2>
                    <p
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontSize: "15px",
                        lineHeight: 1.7,
                        color: MUTED,
                        marginBottom: "16px",
                      }}
                    >
                      I run SkynetLabs solo. No junior devs handing off your
                      project. No account managers re-explaining your brief. You
                      talk to the person who ships.
                    </p>
                    <p
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontSize: "15px",
                        lineHeight: 1.7,
                        color: MUTED,
                      }}
                    >
                      Seven years building AI + automation systems for founders,
                      clinics, freight ops, and e-commerce brands across the US,
                      Europe, and Southeast Asia. The stack is n8n + Next.js +
                      whatever actually solves the problem.
                    </p>
                  </div>

                  {/* photo grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0",
                      border: `1px solid ${TEXT}`,
                    }}
                  >
                    {[
                      {
                        src: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                        alt: "Waseem at Nusa Penida cliffs, Bali",
                      },
                      {
                        src: "EVENT-expo-booth-navy-polo-chandelier-hall.jpg",
                        alt: "Waseem at expo booth",
                      },
                      {
                        src: "CAFE-WORK-2026-02-27-smiling-headphones-neon-tea-sign-closeup.jpg",
                        alt: "Working with headphones, neon sign",
                      },
                      {
                        src: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
                        alt: "Night coworking session with team",
                      },
                    ].map((p, i) => (
                      <div
                        key={i}
                        style={{
                          aspectRatio: "1",
                          overflow: "hidden",
                          borderRight:
                            i % 2 === 0 ? `1px solid ${TEXT}` : "none",
                          borderBottom: i < 2 ? `1px solid ${TEXT}` : "none",
                        }}
                      >
                        <img
                          src={`/img/pro/${p.src}`}
                          alt={p.alt}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div
                    style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
                  >
                    <SnapButton href="https://skynetjoe.com/discovery-call">
                      BOOK THE CALL
                    </SnapButton>
                    <a
                      href="https://github.com/waseemnasir2k26"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        padding: "14px 24px",
                        border: `1px solid ${TEXT}`,
                        fontFamily: "'Martian Mono', monospace",
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                        color: TEXT,
                        textDecoration: "none",
                        background: BG,
                      }}
                    >
                      GITHUB ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── CONTACT / CTA ── */}
          <section
            id="contact"
            style={{
              borderBottom: `1px solid ${TEXT}`,
              background: ACCENT,
              padding: "80px 24px",
            }}
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "40px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Martian Mono', monospace",
                      fontSize: "11px",
                      color: ACCENT2,
                      marginBottom: "16px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    05 / NEXT STEP
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Archivo', sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(32px, 5vw, 64px)",
                      lineHeight: 1.0,
                      letterSpacing: "-0.02em",
                      color: ACCENT2,
                      marginBottom: "20px",
                    }}
                  >
                    WHAT'S THE
                    <br />
                    BROKEN PART?
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Archivo', sans-serif",
                      fontSize: "16px",
                      lineHeight: 1.6,
                      color: "rgba(255,255,255,0.75)",
                      maxWidth: "480px",
                    }}
                  >
                    30 minutes. You describe the thing that eats your time. I
                    tell you whether I can kill it, how long it takes, and what
                    it costs. No sales deck.
                  </p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      padding: "20px 40px",
                      background: ACCENT2,
                      color: TEXT,
                      fontFamily: "'Archivo', sans-serif",
                      fontWeight: 900,
                      fontSize: "14px",
                      letterSpacing: "0.12em",
                      textDecoration: "none",
                      border: `1px solid ${TEXT}`,
                      boxShadow: `6px 6px 0 0 ${TEXT}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    BOOK 30-MIN CALL →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ── PHOTO STRIP ── */}
          <section
            style={{ borderBottom: `1px solid ${TEXT}`, overflow: "hidden" }}
          >
            <div style={{ display: "flex", height: "200px" }}>
              {[
                {
                  src: "TRAVEL-2026-05-24-jungle-bridge-standing-sunglasses-front.jpg",
                  alt: "Waseem on jungle bridge",
                },
                {
                  src: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
                  alt: "Working from mountain rooftop cafe",
                },
                {
                  src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                  alt: "Hilltop with city vista",
                },
                {
                  src: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                  alt: "Rooftop laptop with dragonfruit smoothie",
                },
                {
                  src: "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
                  alt: "Standing by neon sign, black outfit",
                },
                {
                  src: "PORTRAIT-travertine-wall-sky-headshot-flowers.jpg",
                  alt: "Portrait at travertine wall",
                },
              ].map((p, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    borderRight: i < 5 ? `1px solid ${TEXT}` : "none",
                  }}
                >
                  <img
                    src={`/img/pro/${p.src}`}
                    alt={p.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top",
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* ── FOOTER ── */}
        <footer
          role="contentinfo"
          style={{
            borderTop: `1px solid ${TEXT}`,
            background: TEXT,
            color: BG,
            padding: "0 24px",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* footer top */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0",
                borderBottom: `1px solid rgba(255,255,255,0.12)`,
              }}
            >
              {/* col 1 */}
              <div
                style={{
                  padding: "40px 24px 40px 0",
                  borderRight: `1px solid rgba(255,255,255,0.12)`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 900,
                    fontSize: "22px",
                    letterSpacing: "-0.01em",
                    marginBottom: "12px",
                  }}
                >
                  WASEEM NASIR
                </div>
                <div
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: "11px",
                    color: ACCENT2,
                    letterSpacing: "0.08em",
                  }}
                >
                  SKYNETLABS · AUTOMATION SYSTEMS
                </div>
              </div>
              {/* col 2 */}
              <div
                style={{
                  padding: "40px 24px",
                  borderRight: `1px solid rgba(255,255,255,0.12)`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: "16px",
                    letterSpacing: "0.1em",
                  }}
                >
                  LINKS
                </div>
                {[
                  {
                    label: "BOOK A CALL",
                    href: "https://skynetjoe.com/discovery-call",
                  },
                  { label: "SKYNETJOE.COM", href: "https://skynetjoe.com" },
                  {
                    label: "GITHUB",
                    href: "https://github.com/waseemnasir2k26",
                  },
                ].map((l) => (
                  <div key={l.label} style={{ marginBottom: "10px" }}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.7)",
                        textDecoration: "none",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {l.label} ↗
                    </a>
                  </div>
                ))}
              </div>
              {/* col 3 */}
              <div style={{ padding: "40px 0 40px 24px" }}>
                <div
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: "16px",
                    letterSpacing: "0.1em",
                  }}
                >
                  LOCATION
                </div>
                <p
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Remote-first.
                  <br />
                  Bali · Lahore.
                  <br />
                  Client timezone: yours.
                </p>
              </div>
            </div>

            {/* footer bottom */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 0",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.08em",
                }}
              >
                © 2019–2026 WASEEM NASIR · SKYNETLABS
              </div>
              <div
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(32px, 6vw, 72px)",
                  letterSpacing: "-0.02em",
                  color: "transparent",
                  WebkitTextStroke: `1px rgba(255,255,255,0.12)`,
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                SWISS POISON
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
