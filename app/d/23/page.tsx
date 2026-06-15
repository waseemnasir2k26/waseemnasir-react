"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionValue,
  useVelocity,
} from "framer-motion";

/* ─────────────────────────────────────────
   VITRINE — Design 23
   Gallery-rail editorial / horizontal museum hang
   Palette: warm parchment + deep burgundy
───────────────────────────────────────── */

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Newsreader:opsz,wght@6..72,400&family=Space+Mono:wght@400&display=swap";

const P = {
  bg: "#EDEAE3",
  surface: "#E2DDD2",
  text: "#222019",
  muted: "#9B958A",
  accent: "#6B2C1F",
  accent2: "#C9C2B2",
};

/* ── Exhibition works ── */
const WORKS = [
  {
    id: "W–01",
    title: "FreightOps AI Voice Receptionist",
    medium: "n8n · Twilio · Next.js",
    year: "2025",
    desc: "An always-on dispatch agent that qualifies trucking leads by voice, routes urgent loads, and files missed-call summaries — without a human at the desk.",
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    orient: "landscape",
    acquired: "United States",
  },
  {
    id: "W–02",
    title: "Inspire Health PT — $27 Funnel",
    medium: "WooCommerce · Stripe · WordPress",
    year: "2025",
    desc: "A single-product conversion system for a physiotherapy clinic. Six post-launch patches delivered zero-downtime. Revenue verified via test-card.",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    orient: "landscape",
    acquired: "Canada",
  },
  {
    id: "W–03",
    title: "IdeaViaggi Trip-Input System",
    medium: "WordPress REST API · CPT · ACF",
    year: "2024",
    desc: "Per-customer trip-visibility gate for a youth-travel operator. 5-agent security audit cleared the build before handing over the keys.",
    img: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
    orient: "portrait",
    acquired: "Italy",
  },
  {
    id: "W–04",
    title: "SkynetJoe.com — AEO Engine v0.7",
    medium: "Next.js 14 · Vercel Edge · Schema.org",
    year: "2024",
    desc: "Answer-engine optimisation layered over a founder site — structured data, mega-menu taxonomy, and de-AI copy pass so search models cite facts, not fluff.",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    orient: "landscape",
    acquired: "Remote",
  },
  {
    id: "W–05",
    title: "TakyCorp Email Automation",
    medium: "n8n · Gmail API · OpenAI",
    year: "2024",
    desc: "Two outages diagnosed and patched — Gmail rate-limit overflow, OOM on large queues, and auto-deactivate on quota breach. Resilient cron restored.",
    img: "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
    orient: "landscape",
    acquired: "France",
  },
  {
    id: "W–06",
    title: "GigSignal Chrome Extension",
    medium: "Manifest v3 · GitHub Pages",
    year: "2025",
    desc: "A public market-intelligence tool for Fiverr sellers — scrapes competitor positioning, surfaces keyword gaps, ships as a free open-source extension.",
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    orient: "landscape",
    acquired: "Global",
  },
  {
    id: "W–07",
    title: "Meta Ads Dual-Geo Launch",
    medium: "Meta Ads · WhatsApp Business · GHL",
    year: "2025",
    desc: "US trucking + Singapore trades/clinic paid campaigns. LPV-on-LP learning events, sequential A/B instant forms, and WhatsApp Conversations as conversion goal.",
    img: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
    orient: "landscape",
    acquired: "US · Singapore",
  },
  {
    id: "W–08",
    title: "Waseemnasir.com Personal Folio",
    medium: "Next.js 14 · Framer Motion · Vercel",
    year: "2025",
    desc: "Six branded design variants shipped simultaneously. Dark-luxe critic top-pick promoted. Pinned horizontal gallery, velocity-skew marquee, pointer-tilt portrait.",
    img: "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    orient: "portrait",
    acquired: "Remote",
  },
];

const SERVICES = [
  {
    cat: "I.",
    label: "Automation Systems",
    desc: "n8n workflows, AI voice agents, WhatsApp bots — the kind that answer leads at 2 am and never miss a follow-up.",
  },
  {
    cat: "II.",
    label: "Frontend & Commerce",
    desc: "Next.js storefronts, WordPress funnels, Stripe integrations. Shipped fast. Patched until solid.",
  },
  {
    cat: "III.",
    label: "AEO & Search Presence",
    desc: "Structured data, schema layering, de-AI copy — so your site gets cited by models, not just crawled by bots.",
  },
  {
    cat: "IV.",
    label: "Paid Acquisition",
    desc: "Meta campaigns wired to real conversion events. No vanity metrics. Learning-phase strategy from day one.",
  },
];

/* ── Scoped CSS injected once ── */
const SCOPED_CSS = `
@import url('${FONTS_URL}');

.vit-root {
  font-family: 'Newsreader', Georgia, serif;
  background: ${P.bg};
  color: ${P.text};
  -webkit-font-smoothing: antialiased;
}
.vit-display { font-family: 'Bodoni Moda', 'Times New Roman', serif; }
.vit-mono   { font-family: 'Space Mono', monospace; }

/* ── Pinned horizontal rail ── */
.vit-rail-outer {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.vit-rail-track {
  display: flex;
  align-items: stretch;
  will-change: transform;
}

/* ── Work frame ── */
.vit-frame {
  flex: 0 0 auto;
  position: relative;
  cursor: default;
}
.vit-frame-mat {
  position: absolute;
  inset: 0;
  border: 1px solid ${P.accent2};
  pointer-events: none;
  transition: inset 0.4s cubic-bezier(.22,1,.36,1);
  z-index: 2;
}
.vit-frame:hover .vit-frame-mat {
  inset: 8px;
}
.vit-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.85) contrast(1.05);
  transition: filter 0.5s ease, transform 0.6s cubic-bezier(.22,1,.36,1);
}
.vit-frame:hover img {
  filter: saturate(1) contrast(1.02);
  transform: scale(1.03);
}

/* ── Wall label ── */
.vit-wall-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.25rem 1.5rem 1.5rem;
  background: linear-gradient(to top, rgba(34,32,25,0.88) 0%, transparent 100%);
  transform: translateY(4px);
  opacity: 0;
  transition: opacity 0.35s ease, transform 0.35s ease;
  z-index: 3;
}
.vit-frame:hover .vit-wall-label {
  opacity: 1;
  transform: translateY(0);
}

/* ── Number line ── */
.vit-num {
  display: inline-block;
  border-top: 1px solid currentColor;
  padding-top: 0.3rem;
}

/* ── Divider ── */
.vit-rule {
  border: none;
  border-top: 1px solid ${P.accent2};
  margin: 0;
}

/* ── Focus styles ── */
.vit-root a:focus-visible {
  outline: 2px solid ${P.accent};
  outline-offset: 3px;
  border-radius: 2px;
}

/* ── Scroll hint ── */
@keyframes vit-pulse-x {
  0%, 100% { transform: translateX(0); opacity: 0.5; }
  50%       { transform: translateX(6px); opacity: 1; }
}
.vit-scroll-hint { animation: vit-pulse-x 1.8s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .vit-frame img,
  .vit-frame-mat,
  .vit-wall-label {
    transition: none !important;
    animation: none !important;
  }
  .vit-scroll-hint { animation: none !important; }
}
`;

/* ── Stat block ── */
function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="vit-display" style={{ minWidth: 120 }}>
      <div
        style={{
          fontSize: "clamp(2rem,5vw,3.5rem)",
          fontWeight: 400,
          lineHeight: 1,
          color: P.text,
        }}
      >
        {num}
      </div>
      <div
        className="vit-mono"
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: P.muted,
          marginTop: "0.4rem",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ── Single work frame card ── */
function WorkFrame({
  work,
  skewDeg,
}: {
  work: (typeof WORKS)[0];
  skewDeg: number;
}) {
  const shouldReduce = useReducedMotion();
  const isPortrait = work.orient === "portrait";
  const w = isPortrait ? 280 : 440;
  const h = isPortrait ? 380 : 290;

  return (
    <motion.div
      className="vit-frame"
      style={{
        width: w,
        height: h + 80,
        marginRight: 48,
        skewX: shouldReduce ? 0 : skewDeg,
      }}
    >
      {/* Mat-shift border */}
      <div className="vit-frame-mat" />
      {/* Image */}
      <div
        style={{
          position: "relative",
          width: w,
          height: h,
          overflow: "hidden",
        }}
      >
        <img
          src={`/img/pro/${work.img}`}
          alt={`${work.title} — ${work.medium}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Wall label overlay */}
        <div className="vit-wall-label">
          <div
            className="vit-mono"
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: P.accent2,
              marginBottom: "0.35rem",
            }}
          >
            {work.id} · {work.year} · {work.acquired}
          </div>
          <div
            className="vit-display"
            style={{
              fontSize: "0.95rem",
              color: "#F5F1EA",
              lineHeight: 1.3,
              marginBottom: "0.4rem",
            }}
          >
            {work.title}
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              color: "rgba(245,241,234,0.75)",
              lineHeight: 1.45,
            }}
          >
            {work.desc}
          </div>
        </div>
      </div>
      {/* Caption below frame */}
      <div style={{ paddingTop: "0.75rem", paddingLeft: "0.25rem" }}>
        <div
          className="vit-mono"
          style={{
            fontSize: "0.6rem",
            color: P.muted,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {work.medium}
        </div>
        <div
          className="vit-display"
          style={{
            fontSize: "0.88rem",
            color: P.text,
            marginTop: "0.2rem",
            lineHeight: 1.3,
          }}
        >
          {work.title}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Horizontal rail with scroll-driven translation ── */
function ExhibitionRail() {
  const shouldReduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure after mount
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setTrackWidth(trackRef.current.scrollWidth);
      if (containerRef.current)
        setContainerWidth(containerRef.current.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Scroll-driven horizontal pan
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const xRaw = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(trackWidth - containerWidth + 96)],
  );
  const x = useSpring(xRaw, { stiffness: 80, damping: 22, mass: 0.5 });

  // Velocity for skew
  const xVelocity = useVelocity(xRaw);
  const skewFactor = useTransform(xVelocity, [-2000, 0, 2000], [4, 0, -4]);
  const [skewDeg, setSkewDeg] = useState(0);
  useEffect(() => {
    if (shouldReduce) return;
    return skewFactor.on("change", (v) => setSkewDeg(v));
  }, [skewFactor, shouldReduce]);

  // Sticky height = track content width so scroll distance = pan distance
  const stickyH = Math.max(trackWidth - containerWidth + containerWidth, 800);

  return (
    <div
      ref={containerRef}
      className="vit-rail-outer"
      style={{ height: shouldReduce ? "auto" : stickyH }}
      aria-label="Selected work exhibition"
    >
      <div
        style={{
          position: shouldReduce ? "relative" : "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Section label */}
        <div
          style={{
            paddingLeft: "clamp(2rem,6vw,7rem)",
            paddingBottom: "2.5rem",
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <span
            className="vit-mono"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              color: P.muted,
              textTransform: "uppercase",
            }}
          >
            Selected Works — 2019–2025
          </span>
          <div
            style={{
              flex: 1,
              borderTop: `1px solid ${P.accent2}`,
              maxWidth: 200,
            }}
          />
          <span
            className="vit-scroll-hint vit-mono"
            style={{ fontSize: "0.6rem", color: P.muted }}
          >
            scroll to traverse →
          </span>
        </div>

        {/* Track */}
        <motion.div
          ref={trackRef}
          className="vit-rail-track"
          style={{
            x: shouldReduce ? 0 : x,
            paddingLeft: "clamp(2rem,6vw,7rem)",
            paddingRight: "clamp(2rem,6vw,7rem)",
          }}
        >
          {WORKS.map((w) => (
            <WorkFrame
              key={w.id}
              work={w}
              skewDeg={shouldReduce ? 0 : skewDeg}
            />
          ))}
        </motion.div>

        {/* Progress rail */}
        {!shouldReduce && (
          <div
            style={{
              paddingLeft: "clamp(2rem,6vw,7rem)",
              paddingRight: "clamp(2rem,6vw,7rem)",
              paddingTop: "2rem",
            }}
          >
            <div
              style={{ height: 1, background: P.accent2, position: "relative" }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  background: P.accent,
                  scaleX: scrollYProgress,
                  transformOrigin: "left",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function Vitrine() {
  const shouldReduce = useReducedMotion();

  const fadeUp = (delay = 0) =>
    shouldReduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
        };

  return (
    <>
      <style>{SCOPED_CSS}</style>

      <div
        className="vit-root"
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          background: P.bg,
        }}
      >
        {/* ── SKIP NAV ── */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            top: -999,
            left: 0,
            padding: "0.5rem 1rem",
            background: P.accent,
            color: "#F5F1EA",
            fontSize: "0.8rem",
            zIndex: 999,
          }}
          onFocus={(e) => {
            (e.target as HTMLAnchorElement).style.top = "0";
          }}
          onBlur={(e) => {
            (e.target as HTMLAnchorElement).style.top = "-999px";
          }}
        >
          Skip to main content
        </a>

        {/* ───────────────── NAV ───────────────── */}
        <header
          role="banner"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem clamp(2rem,6vw,7rem)",
            background: P.bg,
            borderBottom: `1px solid ${P.accent2}`,
          }}
        >
          <div
            className="vit-display"
            style={{
              fontSize: "1.05rem",
              letterSpacing: "0.04em",
              color: P.text,
            }}
          >
            Waseem Nasir
          </div>
          <nav
            aria-label="Primary"
            style={{ display: "flex", gap: "2rem", alignItems: "center" }}
          >
            {["Works", "Practice", "About"].map((lbl) => (
              <a
                key={lbl}
                href={`#${lbl.toLowerCase()}`}
                className="vit-mono"
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: P.muted,
                  textDecoration: "none",
                }}
              >
                {lbl}
              </a>
            ))}
            <a
              href="https://skynetjoe.com/discovery-call"
              className="vit-mono"
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#F5F1EA",
                background: P.accent,
                padding: "0.45rem 1rem",
                textDecoration: "none",
              }}
            >
              Book a Call
            </a>
          </nav>
        </header>

        {/* ───────────────── HERO ───────────────── */}
        <main id="main-content">
          <section
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "0 clamp(2rem,6vw,7rem) 5rem",
              paddingTop: "8rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Hero background photograph */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
              }}
            >
              <img
                src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                alt=""
                aria-hidden="true"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  filter: "saturate(0.6) brightness(0.45)",
                }}
              />
              {/* Warm overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to top, ${P.bg} 0%, ${P.bg}CC 25%, transparent 60%)`,
                }}
              />
            </div>

            {/* Hero text */}
            <div style={{ position: "relative", zIndex: 2, maxWidth: 760 }}>
              <motion.div {...fadeUp(0)}>
                <span
                  className="vit-mono"
                  style={{
                    display: "inline-block",
                    fontSize: "0.62rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: P.accent,
                    borderTop: `1px solid ${P.accent}`,
                    paddingTop: "0.35rem",
                    marginBottom: "2.5rem",
                  }}
                >
                  Vitrine No. 23 — Permanent Collection
                </span>
              </motion.div>

              <motion.h1
                className="vit-display"
                style={{
                  fontSize: "clamp(2.8rem,7vw,6rem)",
                  fontWeight: 400,
                  lineHeight: 1.05,
                  color: P.text,
                  margin: 0,
                  marginBottom: "1.75rem",
                }}
                {...fadeUp(0.1)}
              >
                Forty-plus deployments.
                <br />
                <em style={{ fontStyle: "italic", color: P.muted }}>
                  Each one a quiet machine.
                </em>
              </motion.h1>

              <motion.p
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.65,
                  color: P.muted,
                  maxWidth: 520,
                  margin: 0,
                  marginBottom: "3rem",
                }}
                {...fadeUp(0.2)}
              >
                Exhibited since 2019 — 180+ builds across 9 countries.
                <br />
                Automation systems that close the gap between a missed lead and
                a signed contract.
              </motion.p>

              <motion.div
                style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}
                {...fadeUp(0.3)}
              >
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="vit-mono"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.7rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#F5F1EA",
                    background: P.accent,
                    padding: "0.9rem 2rem",
                    textDecoration: "none",
                    border: `1px solid ${P.accent}`,
                  }}
                >
                  Request a Private Viewing
                  <span aria-hidden>→</span>
                </a>
                <a
                  href="#works"
                  className="vit-mono"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.7rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: P.text,
                    padding: "0.9rem 2rem",
                    textDecoration: "none",
                    border: `1px solid ${P.accent2}`,
                  }}
                >
                  Enter Exhibition Hall
                  <span aria-hidden>↓</span>
                </a>
              </motion.div>
            </div>

            {/* Accession numbers bottom-right */}
            <div
              style={{
                position: "absolute",
                bottom: "4rem",
                right: "clamp(2rem,6vw,7rem)",
                zIndex: 2,
                textAlign: "right",
              }}
            >
              <div
                className="vit-mono"
                style={{
                  fontSize: "0.55rem",
                  color: P.muted,
                  letterSpacing: "0.12em",
                  lineHeight: 1.8,
                }}
              >
                ACC. NO. SKN–2019–∞
                <br />
                MEDIUM: Code, Automation, Strategy
                <br />
                COLLECTION: SkynetLabs, Private
              </div>
            </div>
          </section>

          {/* ───────────────── PROOF / NUMBERS ───────────────── */}
          <section
            aria-label="Statistics"
            style={{
              padding: "6rem clamp(2rem,6vw,7rem)",
              background: P.surface,
              borderTop: `1px solid ${P.accent2}`,
              borderBottom: `1px solid ${P.accent2}`,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "clamp(2rem,6vw,5rem)",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <motion.div {...fadeUp(0)}>
                <Stat num="180+" label="Builds shipped" />
              </motion.div>
              <div
                style={{
                  width: 1,
                  background: P.accent2,
                  alignSelf: "stretch",
                  minHeight: 60,
                }}
              />
              <motion.div {...fadeUp(0.05)}>
                <Stat num="40+" label="Clients served" />
              </motion.div>
              <div
                style={{
                  width: 1,
                  background: P.accent2,
                  alignSelf: "stretch",
                  minHeight: 60,
                }}
              />
              <motion.div {...fadeUp(0.1)}>
                <Stat num="9" label="Countries worked from" />
              </motion.div>
              <div
                style={{
                  width: 1,
                  background: P.accent2,
                  alignSelf: "stretch",
                  minHeight: 60,
                }}
              />
              <motion.div {...fadeUp(0.15)}>
                <Stat num="2019" label="Established" />
              </motion.div>

              <div
                style={{
                  flex: 1,
                  minWidth: 240,
                  paddingLeft: "clamp(0px,3vw,3rem)",
                }}
              >
                <motion.p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    color: P.muted,
                    margin: 0,
                  }}
                  {...fadeUp(0.2)}
                >
                  These are first-party figures — no rounding up, no agency
                  multipliers. Every build has a commit hash. Every client has a
                  country.
                </motion.p>
              </div>
            </div>
          </section>

          {/* ───────────────── EXHIBITION RAIL ───────────────── */}
          <section id="works" aria-label="Selected works">
            <ExhibitionRail />
          </section>

          {/* ───────────────── PRACTICE / SERVICES ───────────────── */}
          <section
            id="practice"
            style={{
              padding: "8rem clamp(2rem,6vw,7rem)",
              background: P.bg,
              borderTop: `1px solid ${P.accent2}`,
            }}
          >
            <motion.div {...fadeUp(0)} style={{ marginBottom: "4rem" }}>
              <span
                className="vit-mono"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: P.accent,
                  borderTop: `1px solid ${P.accent}`,
                  paddingTop: "0.3rem",
                  display: "inline-block",
                  marginBottom: "1.5rem",
                }}
              >
                The Practice
              </span>
              <h2
                className="vit-display"
                style={{
                  fontSize: "clamp(2rem,4vw,3.2rem)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: P.text,
                  margin: 0,
                  maxWidth: 560,
                }}
              >
                Four disciplines. One through-line: less manual labour.
              </h2>
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: "0",
                borderTop: `1px solid ${P.accent2}`,
              }}
            >
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.cat}
                  {...fadeUp(i * 0.08)}
                  style={{
                    padding: "2.5rem 2rem 2.5rem 0",
                    borderRight: `1px solid ${P.accent2}`,
                    borderBottom: `1px solid ${P.accent2}`,
                  }}
                >
                  <div
                    className="vit-mono"
                    style={{
                      fontSize: "0.6rem",
                      color: P.accent,
                      letterSpacing: "0.12em",
                      marginBottom: "1rem",
                    }}
                  >
                    {s.cat}
                  </div>
                  <h3
                    className="vit-display"
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 400,
                      color: P.text,
                      margin: 0,
                      marginBottom: "1rem",
                    }}
                  >
                    {s.label}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      lineHeight: 1.65,
                      color: P.muted,
                      margin: 0,
                    }}
                  >
                    {s.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ───────────────── ABOUT / PORTRAIT ───────────────── */}
          <section
            id="about"
            style={{
              padding: "8rem clamp(2rem,6vw,7rem)",
              background: P.surface,
              borderTop: `1px solid ${P.accent2}`,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "5rem",
              alignItems: "center",
            }}
          >
            {/* Text side */}
            <div>
              <motion.div {...fadeUp(0)}>
                <span
                  className="vit-mono"
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: P.accent,
                    borderTop: `1px solid ${P.accent}`,
                    paddingTop: "0.3rem",
                    display: "inline-block",
                    marginBottom: "2rem",
                  }}
                >
                  Curator / Founder
                </span>
              </motion.div>
              <motion.h2
                className="vit-display"
                style={{
                  fontSize: "clamp(1.8rem,3vw,2.6rem)",
                  fontWeight: 400,
                  color: P.text,
                  lineHeight: 1.15,
                  margin: 0,
                  marginBottom: "1.5rem",
                }}
                {...fadeUp(0.1)}
              >
                Waseem Nasir
              </motion.h2>
              <motion.p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  color: P.muted,
                  marginBottom: "1.25rem",
                }}
                {...fadeUp(0.15)}
              >
                Independent founder of SkynetLabs. Since 2019, the practice has
                built AI and automation systems that replace the busywork
                strangling growth — unanswered leads, stalled follow-up queues,
                operations still running on spreadsheets.
              </motion.p>
              <motion.p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  color: P.muted,
                  marginBottom: "2rem",
                }}
                {...fadeUp(0.2)}
              >
                The studio operates remotely — principally from Bali and Lahore.
                Clients come from the US, Canada, Italy, France, Singapore, and
                beyond.
              </motion.p>
              <motion.div
                style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}
                {...fadeUp(0.25)}
              >
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="vit-mono"
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#F5F1EA",
                    background: P.accent,
                    padding: "0.75rem 1.75rem",
                    textDecoration: "none",
                  }}
                >
                  Book a 30-min call →
                </a>
                <a
                  href="https://github.com/waseemnasir2k26"
                  className="vit-mono"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: P.text,
                    padding: "0.75rem 1.75rem",
                    textDecoration: "none",
                    border: `1px solid ${P.accent2}`,
                  }}
                >
                  GitHub Profile
                </a>
              </motion.div>

              {/* Secondary portraits strip */}
              <motion.div
                style={{ display: "flex", gap: "0.75rem", marginTop: "3rem" }}
                {...fadeUp(0.3)}
              >
                {[
                  "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
                  "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                  "EVENT-expo-booth-navy-polo-chandelier-hall.jpg",
                ].map((img) => (
                  <div
                    key={img}
                    style={{
                      width: 80,
                      height: 80,
                      overflow: "hidden",
                      border: `1px solid ${P.accent2}`,
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={`/img/pro/${img}`}
                      alt=""
                      aria-hidden="true"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "saturate(0.8)",
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Portrait side */}
            <motion.div {...fadeUp(0.1)} style={{ position: "relative" }}>
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  border: `1px solid ${P.accent2}`,
                }}
              >
                <img
                  src="/img/pro/PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg"
                  alt="Waseem Nasir — founder, SkynetLabs"
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    filter: "saturate(0.85)",
                  }}
                />
              </div>
              {/* Accession label */}
              <div
                className="vit-mono"
                style={{
                  position: "absolute",
                  bottom: "1.25rem",
                  right: "-1rem",
                  background: P.bg,
                  border: `1px solid ${P.accent2}`,
                  padding: "0.6rem 1rem",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  color: P.muted,
                  lineHeight: 1.7,
                }}
              >
                Waseem Nasir
                <br />
                Founder, SkynetLabs
                <br />
                Est. 2019
              </div>
            </motion.div>
          </section>

          {/* ───────────────── FIELD NOTES (extra imagery) ───────────────── */}
          <section
            style={{
              padding: "6rem clamp(2rem,6vw,7rem)",
              background: P.bg,
              borderTop: `1px solid ${P.accent2}`,
            }}
          >
            <motion.div {...fadeUp(0)} style={{ marginBottom: "3rem" }}>
              <span
                className="vit-mono"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: P.muted,
                  borderTop: `1px solid ${P.accent2}`,
                  paddingTop: "0.3rem",
                  display: "inline-block",
                }}
              >
                Field Notes — Studio in Motion
              </span>
            </motion.div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: "1rem",
              }}
            >
              {[
                {
                  img: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                  span: 1,
                  tall: true,
                },
                {
                  img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
                  span: 1,
                  tall: false,
                },
                {
                  img: "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
                  span: 1,
                  tall: false,
                },
              ].map(({ img, tall }, i) => (
                <motion.div
                  key={img}
                  {...fadeUp(i * 0.08)}
                  style={{
                    overflow: "hidden",
                    border: `1px solid ${P.accent2}`,
                    position: "relative",
                  }}
                >
                  <img
                    src={`/img/pro/${img}`}
                    alt=""
                    aria-hidden="true"
                    style={{
                      width: "100%",
                      height: tall ? 420 : 200,
                      objectFit: "cover",
                      filter: "saturate(0.8) contrast(1.02)",
                      display: "block",
                    }}
                  />
                </motion.div>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 2fr",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {[
                "TRAVEL-2026-05-24-jungle-bridge-standing-sunglasses-front.jpg",
                "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
                "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
              ].map((img, i) => (
                <motion.div
                  key={img}
                  {...fadeUp(0.1 + i * 0.08)}
                  style={{
                    overflow: "hidden",
                    border: `1px solid ${P.accent2}`,
                  }}
                >
                  <img
                    src={`/img/pro/${img}`}
                    alt=""
                    aria-hidden="true"
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      filter: "saturate(0.8)",
                      display: "block",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* ───────────────── CONTACT / CTA ───────────────── */}
          <section
            id="contact"
            style={{
              padding: "10rem clamp(2rem,6vw,7rem)",
              background: P.text,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Faint watermark */}
            <div
              className="vit-display"
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "-2rem",
                right: "-1rem",
                fontSize: "clamp(6rem,18vw,16rem)",
                lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: `1px rgba(201,194,178,0.08)`,
                fontWeight: 400,
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              SKN
            </div>

            <div style={{ position: "relative", zIndex: 2, maxWidth: 680 }}>
              <motion.div {...fadeUp(0)}>
                <span
                  className="vit-mono"
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: P.accent,
                    borderTop: `1px solid ${P.accent}`,
                    paddingTop: "0.3rem",
                    display: "inline-block",
                    marginBottom: "2.5rem",
                  }}
                >
                  Viewings by Appointment
                </span>
              </motion.div>
              <motion.h2
                className="vit-display"
                style={{
                  fontSize: "clamp(2.5rem,6vw,5rem)",
                  fontWeight: 400,
                  color: P.bg,
                  lineHeight: 1.08,
                  margin: 0,
                  marginBottom: "1.5rem",
                }}
                {...fadeUp(0.1)}
              >
                The next build
                <br />
                <em style={{ fontStyle: "italic", color: P.accent2 }}>
                  could be yours.
                </em>
              </motion.h2>
              <motion.p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  color: P.accent2,
                  marginBottom: "3rem",
                  maxWidth: 480,
                }}
                {...fadeUp(0.2)}
              >
                A 30-minute call is enough to know whether what I build fits
                what you need. No decks, no pitches — a direct conversation.
              </motion.p>
              <motion.a
                href="https://skynetjoe.com/discovery-call"
                className="vit-mono"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: P.text,
                  background: P.bg,
                  padding: "1.1rem 2.5rem",
                  textDecoration: "none",
                }}
                whileHover={shouldReduce ? {} : { x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                {...fadeUp(0.3)}
              >
                Schedule a Private Viewing — 30 min →
              </motion.a>

              <div
                style={{
                  marginTop: "4rem",
                  display: "flex",
                  gap: "2.5rem",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "Studio", val: "SkynetLabs" },
                  { label: "Base", val: "Bali / Lahore" },
                  { label: "GitHub", val: "waseemnasir2k26" },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div
                      className="vit-mono"
                      style={{
                        fontSize: "0.55rem",
                        color: P.muted,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      className="vit-display"
                      style={{ fontSize: "0.9rem", color: P.accent2 }}
                    >
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ───────────────── FOOTER ───────────────── */}
          <footer
            role="contentinfo"
            style={{
              padding: "2rem clamp(2rem,6vw,7rem)",
              background: P.text,
              borderTop: `1px solid rgba(201,194,178,0.15)`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div
              className="vit-mono"
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.1em",
                color: P.muted,
              }}
            >
              © 2019–2026 SkynetLabs. All works in the permanent collection.
            </div>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="vit-mono"
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: P.accent2,
                textDecoration: "none",
              }}
            >
              skynetjoe.com/discovery-call
            </a>
          </footer>
        </main>
      </div>
    </>
  );
}
