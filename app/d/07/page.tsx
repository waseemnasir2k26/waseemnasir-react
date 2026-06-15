"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";

/* ─── scoped font injection ─── */
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Archivo:wght@400;600&family=Space+Mono:wght@400&display=swap";

/* ─── palette ─── */
const C = {
  bg: "#EDE8DF",
  black: "#000000",
  text: "#0A0A0A",
  muted: "#7C7468",
  red: "#D7141A",
  blue: "#1452CC",
} as const;

/* ─── image pool (real filenames only) ─── */
const IMGS = {
  heroFull:
    "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
  heroWork:
    "/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  workDesk: "/img/pro/WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
  rooftop:
    "/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
  bali: "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  night:
    "/img/pro/CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  confident:
    "/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
  travel: "/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  meetup: "/img/pro/EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
  glass:
    "/img/pro/PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg",
  valley:
    "/img/pro/CAFE-WORK-2026-03-29-closeup-laptop-sunglasses-valley-view.jpg",
  blackKurta:
    "/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
  motorbike:
    "/img/pro/TRAVEL-2026-03-27-motorbike-helmet-backpack-mountain-road.jpg",
} as const;

/* ─── services ─── */
const SERVICES = [
  {
    num: "01",
    label: "AI AUTOMATION",
    detail: "n8n workflows that kill dead follow-ups and manual ops forever.",
    color: C.red,
  },
  {
    num: "02",
    label: "VOICE + CHAT BOTS",
    detail: "WhatsApp & voice receptionists that never miss a lead.",
    color: C.blue,
  },
  {
    num: "03",
    label: "AEO SYSTEMS",
    detail: "Answer Engine Optimization — get cited by AI, not just ranked.",
    color: C.black,
  },
  {
    num: "04",
    label: "NEXT.JS BUILDS",
    detail: "Performant, production-grade web apps shipped fast.",
    color: C.red,
  },
];

/* ─── work items ─── */
const WORK = [
  {
    label: "AUTOMATION SYSTEM",
    client: "Freight logistics",
    img: IMGS.heroWork,
    accent: C.red,
  },
  {
    label: "AI RECEPTIONIST",
    client: "Health & clinic sector",
    img: IMGS.workDesk,
    accent: C.blue,
  },
  {
    label: "AEO ENGINE",
    client: "Agency growth stack",
    img: IMGS.rooftop,
    accent: C.red,
  },
  {
    label: "NEXT.JS PLATFORM",
    client: "Travel startup",
    img: IMGS.valley,
    accent: C.blue,
  },
];

/* ─── count-up hook ─── */
function useCountUp(target: number, suffix: string, trigger: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(id);
      } else setVal(start);
    }, 20);
    return () => clearInterval(id);
  }, [target, trigger]);
  return `${val}${suffix}`;
}

/* ─── DiagonalBar ─── */
function DiagonalBars({ reduced }: { reduced: boolean }) {
  const bars = [C.red, C.blue, C.black];
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {bars.map((color, i) => (
        <motion.div
          key={i}
          initial={reduced ? false : { x: "-110%" }}
          animate={{ x: "110%" }}
          transition={{
            duration: reduced ? 0 : 0.8,
            delay: i * 0.18,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: color,
            transformOrigin: "center",
            transform: "skewX(-20deg) scaleX(1.2)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── StatsBlock ─── */
function StatsBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const [fired, setFired] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setFired(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const s180 = useCountUp(180, "+", fired);
  const s40 = useCountUp(40, "+", fired);
  const s9 = useCountUp(9, "", fired);
  const stats = [
    { val: s180, label: "BUILDS SHIPPED" },
    { val: s40, label: "CLIENTS SERVED" },
    { val: s9, label: "COUNTRIES" },
    { val: "2019", label: "SINCE" },
  ];
  return (
    <div
      ref={ref}
      style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 2 }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: C.black,
            color: C.bg,
            padding: "2rem 1.5rem",
            borderLeft: `6px solid ${C.red}`,
          }}
        >
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.5rem,6vw,4rem)",
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {s.val}
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              marginTop: "0.5rem",
              color: C.muted,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── VerticalType ─── */
function VerticalType({
  text,
  color = C.red,
}: {
  text: string;
  color?: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        writingMode: "vertical-rl",
        textOrientation: "mixed",
        transform: "rotate(180deg)",
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: "clamp(0.65rem, 1.2vw, 0.9rem)",
        letterSpacing: "0.25em",
        color,
        userSelect: "none",
      }}
    >
      {text}
    </div>
  );
}

/* ─── DiagonalDivider ─── */
function DiagonalDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 80,
        background: C.black,
        clipPath: flip
          ? "polygon(0 0, 100% 0, 100% 100%, 0 60%)"
          : "polygon(0 0, 100% 40%, 100% 100%, 0 100%)",
        margin: 0,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════ MAIN PAGE */
export default function DadaConstructivist() {
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');
        .root-07 {
          font-family: 'Archivo', sans-serif;
          background: ${C.bg};
          color: ${C.text};
        }
        .root-07 *:focus-visible {
          outline: 3px solid ${C.red};
          outline-offset: 3px;
        }
        .root-07 a {
          color: inherit;
          text-decoration: none;
        }
        .cta-07 {
          display: inline-block;
          background: ${C.red};
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 0.18em;
          padding: 1rem 2.5rem;
          text-transform: uppercase;
          border: 2px solid ${C.red};
          transition: background 0.2s, color 0.2s;
          cursor: pointer;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
        }
        .cta-07:hover {
          background: ${C.black};
          border-color: ${C.black};
          color: #fff;
        }
        @media (prefers-reduced-motion: reduce) {
          .root-07 * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── scroll progress rail ── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 4,
          background: C.red,
          width: progressWidth,
          zIndex: 9999,
          transformOrigin: "left",
        }}
      />

      <div
        className="root-07"
        style={{ position: "relative", minHeight: "100vh", zIndex: 10 }}
      >
        {/* ══ SKIP LINK ══ */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "auto",
            zIndex: 99999,
            background: C.red,
            color: "#fff",
            padding: "0.5rem 1rem",
            fontFamily: "'Syne',sans-serif",
            fontWeight: 700,
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

        {/* ══ NAV ══ */}
        <nav
          aria-label="Primary"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 2rem",
            background: C.black,
            borderBottom: `3px solid ${C.red}`,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            {/* constructivist mark */}
            <div style={{ width: 28, height: 28, position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: C.red,
                  transform: "rotate(45deg)",
                }}
              />
              <div
                style={{ position: "absolute", inset: 4, background: C.blue }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                color: "#fff",
                fontSize: "1rem",
                letterSpacing: "0.1em",
              }}
            >
              WASEEM NASIR
            </span>
          </div>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="cta-07"
            style={{ fontSize: "0.75rem", padding: "0.6rem 1.5rem" }}
          >
            BOOK A CALL
          </a>
        </nav>

        {/* ══ HERO ══ */}
        <section
          id="main-content"
          style={{
            position: "relative",
            minHeight: "100vh",
            background: C.black,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            paddingTop: 64,
          }}
        >
          {/* entrance diagonal bars */}
          <DiagonalBars reduced={reduced} />

          {/* left: image panel */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <motion.img
              src={IMGS.heroFull}
              alt="Waseem Nasir — founder, SkynetLabs"
              initial={reduced ? false : { scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.4, ease: [0.25, 0, 0, 1] }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
                filter: "grayscale(30%) contrast(1.05)",
              }}
            />
            {/* red diagonal overlay strip */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "30%",
                left: -40,
                width: "140%",
                height: 8,
                background: C.red,
                transform: "rotate(-20deg)",
              }}
            />
            {/* vertical label */}
            <div
              style={{
                position: "absolute",
                left: 16,
                bottom: 48,
              }}
            >
              <VerticalType text="SKYNETLABS — WASEEM NASIR" color="#fff" />
            </div>
          </div>

          {/* right: headline panel */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "3rem 2.5rem 3rem 2rem",
              background: C.bg,
              zIndex: 3,
            }}
          >
            {/* diagonal accent top-right */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 120,
                height: 120,
                background: C.blue,
                clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              }}
            />

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1 }}
            >
              {/* constructivist label bar */}
              <div
                style={{
                  background: C.red,
                  display: "inline-block",
                  padding: "0.25rem 1rem",
                  marginBottom: "1.5rem",
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  color: "#fff",
                  textTransform: "uppercase",
                  transform: "skewX(-6deg)",
                }}
              >
                AI + AUTOMATION SYSTEMS
              </div>

              <h1
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(2.4rem,5.5vw,4.2rem)",
                  lineHeight: 0.95,
                  color: C.text,
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                }}
              >
                BUILD
                <br />
                <span style={{ color: C.red }}>LOUD.</span>
                <br />
                AUTOMATE
                <br />
                <span
                  style={{
                    WebkitTextStroke: `2px ${C.black}`,
                    color: "transparent",
                  }}
                >
                  EVERYTHING.
                </span>
                <br />
                ANSWER TO
                <br />
                <span style={{ color: C.blue }}>NO ONE.</span>
              </h1>

              <p
                style={{
                  fontFamily: "'Archivo',sans-serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: C.text,
                  marginBottom: "2rem",
                  maxWidth: 340,
                  lineHeight: 1.5,
                  borderLeft: `4px solid ${C.red}`,
                  paddingLeft: "1rem",
                }}
              >
                One founder. 180+ systems shipped. 40+ clients across 9
                countries. Operating since 2019.
              </p>

              <a href="https://skynetjoe.com/discovery-call" className="cta-07">
                BOOK 30-MIN CALL &rarr;
              </a>

              {/* bottom rule */}
              <div
                aria-hidden="true"
                style={{
                  marginTop: "2.5rem",
                  height: 4,
                  background: `linear-gradient(to right, ${C.red} 33%, ${C.blue} 33% 66%, ${C.black} 66%)`,
                }}
              />
            </motion.div>
          </div>
        </section>

        {/* ══ DIAGONAL DIVIDER ══ */}
        <DiagonalDivider />

        {/* ══ STATS ══ */}
        <section
          aria-label="Proof of work"
          style={{
            background: C.bg,
            padding: "4rem 2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* large rotated BG text */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%) rotate(-20deg)",
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(6rem,18vw,14rem)",
              color: "rgba(0,0,0,0.04)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 0,
              userSelect: "none",
            }}
          >
            SKYNETLABS
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 900,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  color: C.red,
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                }}
              >
                // HARD NUMBERS
              </div>
              <StatsBlock />
            </div>

            <div>
              <motion.img
                src={IMGS.heroWork}
                alt="Waseem Nasir working with dual laptops and analytics dashboard"
                initial={reduced ? false : { opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{
                  width: "100%",
                  aspectRatio: "16/10",
                  objectFit: "cover",
                  display: "block",
                  borderTop: `8px solid ${C.red}`,
                  borderLeft: `2px solid ${C.black}`,
                }}
              />
              <div
                style={{
                  background: C.blue,
                  padding: "0.75rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <VerticalType text="PROOF" color="#fff" />
                <p
                  style={{
                    fontFamily: "'Archivo',sans-serif",
                    fontSize: "0.85rem",
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  n8n · Next.js · WhatsApp Bots · Voice AI · AEO
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ DIAGONAL DIVIDER FLIP ══ */}
        <DiagonalDivider flip />

        {/* ══ SERVICES ══ */}
        <section
          aria-label="Services"
          style={{
            background: C.black,
            padding: "5rem 2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* diagonal stripe BG */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `repeating-linear-gradient(
                -20deg,
                transparent,
                transparent 40px,
                rgba(215,20,26,0.06) 40px,
                rgba(215,20,26,0.06) 41px
              )`,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1000,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                marginBottom: "3rem",
              }}
            >
              <div
                style={{ flex: 1, height: 2, background: C.red }}
                aria-hidden="true"
              />
              <h2
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  color: "#fff",
                  fontSize: "clamp(1.5rem,3vw,2.5rem)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                WHAT I BUILD
              </h2>
              <div
                style={{ flex: 1, height: 2, background: C.blue }}
                aria-hidden="true"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 3,
              }}
            >
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.num}
                  initial={reduced ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{
                    background: C.bg,
                    padding: "2rem",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "default",
                  }}
                >
                  {/* accent diagonal corner */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 60,
                      height: 60,
                      background: s.color,
                      clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "0.65rem",
                      color: C.muted,
                      letterSpacing: "0.15em",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {s.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 800,
                      fontSize: "1.4rem",
                      color: C.text,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      marginBottom: "0.75rem",
                      borderLeft: `4px solid ${s.color}`,
                      paddingLeft: "0.75rem",
                    }}
                  >
                    {s.label}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Archivo',sans-serif",
                      fontSize: "0.9rem",
                      color: C.muted,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {s.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FULL-BLEED RED PANEL ══ */}
        <section
          aria-label="Manifesto"
          style={{
            background: C.red,
            padding: "5rem 2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* diagonal geometry */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 300,
              height: 300,
              background: "rgba(0,0,0,0.15)",
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 200,
              height: 200,
              background: "rgba(255,255,255,0.08)",
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 900,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "3rem",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 6,
                background: "#fff",
                alignSelf: "stretch",
                minHeight: 160,
              }}
              aria-hidden="true"
            />
            <div>
              <motion.blockquote
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem,4vw,3rem)",
                  color: "#fff",
                  textTransform: "uppercase",
                  lineHeight: 1.1,
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                "Your missed leads aren't bad luck. They're your ops failing
                you. I fix the ops."
              </motion.blockquote>
              <div
                style={{
                  marginTop: "1.5rem",
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.15em",
                }}
              >
                — WASEEM NASIR, SKYNETLABS
              </div>
            </div>
          </div>
        </section>

        {/* ══ WORK GALLERY ══ */}
        <section
          aria-label="Selected work"
          style={{
            background: C.bg,
            padding: "5rem 2rem",
            position: "relative",
          }}
        >
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "1rem",
                marginBottom: "3rem",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: C.blue,
                  transform: "rotate(45deg)",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              <h2
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem,3vw,2.2rem)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: 0,
                }}
              >
                SELECTED WORK
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 4,
              }}
            >
              {WORK.map((w, i) => (
                <motion.div
                  key={w.label}
                  initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "4/3",
                    cursor: "default",
                  }}
                >
                  <img
                    src={w.img}
                    alt={`${w.label} — ${w.client}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: "grayscale(20%)",
                    }}
                  />
                  {/* diagonal label overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: `linear-gradient(to top, ${w.accent}EE 0%, transparent 100%)`,
                      padding: "2rem 1rem 1rem",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Space Mono',monospace",
                        fontSize: "0.6rem",
                        color: "rgba(255,255,255,0.7)",
                        letterSpacing: "0.15em",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {w.client.toUpperCase()}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        color: "#fff",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {w.label}
                    </div>
                  </div>
                  {/* top-right corner mark */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 40,
                      height: 40,
                      background: w.accent,
                      clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FULL-BLEED BLUE PANEL ══ */}
        <section
          aria-label="Remote founder"
          style={{
            background: C.blue,
            padding: "5rem 2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "50%",
              height: "140%",
              background: "rgba(0,0,0,0.1)",
              transform: "skewX(-12deg)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1000,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "1rem",
                }}
              >
                // OPERATING MODEL
              </div>
              <h2
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem,4vw,3rem)",
                  color: "#fff",
                  textTransform: "uppercase",
                  lineHeight: 1.0,
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.01em",
                }}
              >
                SOLO FOUNDER.
                <br />
                ZERO BLOAT.
                <br />
                <span
                  style={{ WebkitTextStroke: "2px #fff", color: "transparent" }}
                >
                  FULL OUTPUT.
                </span>
              </h2>
              <p
                style={{
                  fontFamily: "'Archivo',sans-serif",
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                }}
              >
                Remote from Bali and Lahore. No agency overhead. I build
                directly with you — from discovery to deployment. AI automation,
                voice bots, web platforms, AEO — everything that makes your ops
                run without you watching.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a
                  href="https://github.com/waseemnasir2k26"
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    color: "#fff",
                    borderBottom: "2px solid rgba(255,255,255,0.4)",
                    paddingBottom: "2px",
                    textTransform: "uppercase",
                  }}
                  aria-label="Waseem Nasir on GitHub"
                >
                  GITHUB &rarr;
                </a>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 4,
              }}
            >
              {[IMGS.bali, IMGS.travel, IMGS.night, IMGS.motorbike].map(
                (src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={
                      [
                        "Waseem working from Bali terrace",
                        "Waseem at Nusa Penida cliffs",
                        "Night coding session",
                        "Waseem on motorbike mountain road",
                      ][i]
                    }
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      display: "block",
                      filter: "contrast(1.05) saturate(0.8)",
                      borderTop:
                        i % 2 === 0
                          ? `4px solid ${C.red}`
                          : "4px solid rgba(255,255,255,0.3)",
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </section>

        {/* ══ ABOUT ══ */}
        <section
          aria-label="About Waseem"
          style={{
            background: C.bg,
            padding: "5rem 2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* large diagonal rule */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "40%",
              left: -80,
              width: "110%",
              height: 6,
              background: C.red,
              transform: "rotate(-3deg)",
              opacity: 0.12,
            }}
          />

          <div
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "start",
            }}
          >
            {/* photo col */}
            <div style={{ position: "relative" }}>
              <motion.img
                src={IMGS.confident}
                alt="Waseem Nasir — arms crossed, confident pose"
                initial={reduced ? false : { opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                  filter: "grayscale(15%)",
                  borderRight: `8px solid ${C.blue}`,
                }}
              />
              {/* label below */}
              <div
                style={{
                  background: C.black,
                  padding: "0.75rem 1rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <VerticalType text="FOUNDER" color={C.red} />
                <div>
                  <div
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 800,
                      color: "#fff",
                      fontSize: "1rem",
                      letterSpacing: "0.06em",
                    }}
                  >
                    WASEEM NASIR
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "0.6rem",
                      color: C.muted,
                      letterSpacing: "0.12em",
                    }}
                  >
                    SKYNETLABS
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  marginTop: 2,
                }}
              >
                <img
                  src={IMGS.glass}
                  alt="Waseem in front of glass building"
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    display: "block",
                    filter: "grayscale(20%)",
                  }}
                />
                <img
                  src={IMGS.meetup}
                  alt="Bali co-working meetup group"
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    display: "block",
                    filter: "grayscale(20%)",
                  }}
                />
              </div>
            </div>

            {/* text col */}
            <div style={{ paddingTop: "2rem" }}>
              <div
                style={{
                  display: "inline-block",
                  background: C.black,
                  color: "#fff",
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  padding: "0.4rem 1rem",
                  marginBottom: "1.5rem",
                  transform: "skewX(-4deg)",
                }}
              >
                // WHO BUILT THIS
              </div>

              <h2
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
                  textTransform: "uppercase",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                  marginBottom: "1.5rem",
                }}
              >
                ONE PERSON.
                <br />
                <span style={{ color: C.red }}>FULL-STACK</span>
                <br />
                CONVICTION.
              </h2>

              <p
                style={{
                  fontFamily: "'Archivo',sans-serif",
                  fontSize: "1rem",
                  color: C.muted,
                  lineHeight: 1.8,
                  marginBottom: "1rem",
                }}
              >
                I'm Waseem — independent founder running SkynetLabs since 2019.
                I build AI and automation systems that make businesses stop
                bleeding leads, stop paying for manual ops, and stop depending
                on people who never show up.
              </p>
              <p
                style={{
                  fontFamily: "'Archivo',sans-serif",
                  fontSize: "1rem",
                  color: C.muted,
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                }}
              >
                180+ systems shipped across 40+ clients in 9 countries. All
                solo. All deliberate. n8n workflows, WhatsApp voice bots, AEO
                content engines, Next.js platforms — if it touches automation or
                AI, I build it.
              </p>

              {/* tech tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "2rem",
                }}
              >
                {[
                  "n8n",
                  "NEXT.JS",
                  "VOICE AI",
                  "WHATSAPP BOTS",
                  "AEO",
                  "GPT-4o",
                ].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      padding: "0.3rem 0.75rem",
                      border: `1px solid ${C.text}`,
                      color: C.text,
                      textTransform: "uppercase",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <img
                src={IMGS.valley}
                alt="Waseem with laptop at mountain valley cafe"
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  display: "block",
                  borderLeft: `6px solid ${C.red}`,
                  filter: "grayscale(10%)",
                }}
              />
            </div>
          </div>
        </section>

        {/* ══ DIAGONAL DIVIDER ══ */}
        <DiagonalDivider />

        {/* ══ CTA ══ */}
        <section
          aria-label="Book a call"
          style={{
            background: C.black,
            padding: "6rem 2rem",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          {/* diagonal block BG */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              background: C.red,
              clipPath: "polygon(0 0, 80% 0, 60% 100%, 0 100%)",
              opacity: 0.12,
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "40%",
              height: "100%",
              background: C.blue,
              clipPath: "polygon(40% 0, 100% 0, 100% 100%, 20% 100%)",
              opacity: 0.1,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 60,
                height: 60,
                background: C.red,
                transform: "rotate(45deg)",
                margin: "0 auto 2rem",
              }}
            />
            <h2
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem,5vw,3.5rem)",
                color: "#fff",
                textTransform: "uppercase",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                marginBottom: "1.5rem",
              }}
            >
              STOP LOSING LEADS.
              <br />
              <span style={{ color: C.red }}>START AUTOMATING.</span>
            </h2>
            <p
              style={{
                fontFamily: "'Archivo',sans-serif",
                fontSize: "1.1rem",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.6,
                marginBottom: "2.5rem",
              }}
            >
              30 minutes. No deck, no pitch. Just a direct conversation about
              what's broken in your ops and whether I'm the right person to fix
              it.
            </p>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="cta-07"
              style={{ fontSize: "1rem", padding: "1.25rem 3rem" }}
            >
              BOOK YOUR 30-MIN CALL &rarr;
            </a>

            <div
              style={{
                marginTop: "3rem",
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.65rem",
                color: C.muted,
                letterSpacing: "0.15em",
              }}
            >
              BALI · LAHORE · REMOTE · WORLDWIDE
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer
          aria-label="Site footer"
          style={{
            background: C.black,
            borderTop: `3px solid ${C.red}`,
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div style={{ width: 20, height: 20, position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: C.red,
                  transform: "rotate(45deg)",
                }}
              />
              <div
                style={{ position: "absolute", inset: 3, background: C.blue }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                color: "#fff",
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
              }}
            >
              SKYNETLABS
            </span>
          </div>

          <div
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.6rem",
              color: C.muted,
              letterSpacing: "0.12em",
              textAlign: "center",
            }}
          >
            &copy; 2019–{new Date().getFullYear()} WASEEM NASIR — SKYNETLABS
          </div>

          <a
            href="https://github.com/waseemnasir2k26"
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.6rem",
              color: C.muted,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderBottom: `1px solid ${C.muted}`,
              paddingBottom: "1px",
            }}
            aria-label="Waseem Nasir GitHub profile"
          >
            GITHUB
          </a>
        </footer>
      </div>
    </>
  );
}
