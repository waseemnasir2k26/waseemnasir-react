"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useVelocity,
  useSpring,
} from "framer-motion";

/* ─── Scoped fonts & baseline grid ─────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,700&family=Space+Mono:wght@400&display=swap');

.bs09 {
  --bg:       #F3EFE6;
  --surface:  #FFFFFF;
  --text:     #16140F;
  --muted:    #8A8275;
  --accent:   #D8362A;
  --accent2:  #1A1A1A;
  --rule:     rgba(22,20,15,0.18);
  --col:      calc((100% - 11 * 1px) / 12);
  background: var(--bg);
  color: var(--text);
  font-family: 'Newsreader', Georgia, serif;
  font-optical-sizing: auto;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* Reset any aurora/dark bleed from root layout */
.bs09 *, .bs09 *::before, .bs09 *::after { box-sizing: border-box; }

/* Typography scale */
.bs09 .f-masthead  { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; line-height: 0.92; letter-spacing: -0.04em; }
.bs09 .f-head      { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; line-height: 1.0;  letter-spacing: -0.03em; }
.bs09 .f-deck      { font-family: 'Newsreader', Georgia, serif; font-weight: 400; font-style: italic; }
.bs09 .f-byline    { font-family: 'Space Mono', monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.bs09 .f-body      { font-family: 'Newsreader', Georgia, serif; font-size: 1.0625rem; line-height: 1.72; font-weight: 400; }
.bs09 .f-caption   { font-family: 'Space Mono', monospace; font-size: 0.68rem; letter-spacing: 0.05em; color: var(--muted); }

/* Grid rules */
.bs09 .rule-h      { border: none; border-top: 1px solid var(--rule); margin: 0; }
.bs09 .rule-h-bold { border: none; border-top: 3px solid var(--text); margin: 0; }
.bs09 .rule-h-red  { border: none; border-top: 2px solid var(--accent); margin: 0; }

/* 12-col grid container */
.bs09 .grid12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 1px;
  width: 100%;
}

/* Baseline grid overlay (visible) */
.bs09 .baseline-bg {
  background-image: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent calc(1.625rem - 1px),
    rgba(22,20,15,0.045) calc(1.625rem - 1px),
    rgba(22,20,15,0.045) 1.625rem
  );
}

/* Marquee */
.bs09 .marquee-track {
  display: flex;
  white-space: nowrap;
  width: max-content;
}
.bs09 .marquee-inner {
  overflow: hidden;
  display: flex;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}

/* Clip-mask wipe */
.bs09 .clip-reveal {
  clip-path: inset(0 100% 0 0);
}

/* Column vertical rules */
.bs09 .col-border-r { border-right: 1px solid var(--rule); }
.bs09 .col-border-l { border-left: 1px solid var(--rule); }

/* Tag/label pill */
.bs09 .tag {
  display: inline-block;
  font-family: 'Space Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 1px solid var(--text);
  padding: 0.18em 0.55em;
  color: var(--text);
}
.bs09 .tag-red {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.bs09 .tag-fill {
  background: var(--text);
  border-color: var(--text);
  color: var(--bg);
}

/* CTA button */
.bs09 .cta-btn {
  display: inline-block;
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: var(--accent);
  color: #fff;
  padding: 0.8em 2em;
  border: 2px solid var(--accent);
  text-decoration: none;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.bs09 .cta-btn:hover  { background: transparent; color: var(--accent); }
.bs09 .cta-btn:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }

.bs09 .ghost-btn {
  display: inline-block;
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: transparent;
  color: var(--text);
  padding: 0.8em 2em;
  border: 2px solid var(--text);
  text-decoration: none;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.bs09 .ghost-btn:hover  { background: var(--text); color: var(--bg); }
.bs09 .ghost-btn:focus-visible { outline: 3px solid var(--text); outline-offset: 3px; }

/* Drop cap */
.bs09 .drop-cap::first-letter {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: 4.5rem;
  line-height: 0.82;
  float: left;
  margin-right: 0.08em;
  margin-top: 0.06em;
  color: var(--accent);
}

/* Stat number */
.bs09 .stat-num {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--text);
}
.bs09 .stat-unit {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  color: var(--accent);
}

/* Pull quote */
.bs09 .pull-quote {
  font-family: 'Newsreader', Georgia, serif;
  font-size: clamp(1.5rem, 3vw, 2.4rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.35;
  letter-spacing: -0.01em;
  border-left: 4px solid var(--accent);
  padding-left: 1.25rem;
}

/* Photo frame */
.bs09 .photo-frame {
  background: var(--muted);
  overflow: hidden;
  display: block;
}
.bs09 .photo-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Number label */
.bs09 .section-num {
  font-family: 'Space Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: var(--muted);
  text-transform: uppercase;
}

/* Ticker divider */
.bs09 .ticker-bg {
  background: var(--text);
  color: var(--bg);
  padding: 0.4rem 0;
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  overflow: hidden;
}

/* Service item */
.bs09 .service-item {
  border-top: 1px solid var(--rule);
  padding: 1.25rem 0;
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 1rem;
  align-items: start;
}
.bs09 .service-item:last-child { border-bottom: 1px solid var(--rule); }

/* Work grid image hover */
.bs09 .work-img { overflow: hidden; display: block; }
.bs09 .work-img img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.55s cubic-bezier(.19,1,.22,1); }
.bs09 .work-img:hover img { transform: scale(1.04); }

/* Footer */
.bs09 .footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--rule);
}
.bs09 .footer-cell { background: var(--bg); padding: 2rem 1.5rem; }

@media (max-width: 900px) {
  .bs09 .hide-sm { display: none !important; }
  .bs09 .footer-grid { grid-template-columns: 1fr; }
  .bs09 .masthead-size { font-size: clamp(3.5rem, 14vw, 7rem) !important; }
}
@media (max-width: 640px) {
  .bs09 .mobile-stack { grid-column: 1 / -1 !important; }
  .bs09 .masthead-size { font-size: clamp(2.8rem, 13vw, 5rem) !important; }
}
`;

/* ─── Clip-reveal section title ─────────────────────────────────────────── */
function WipeTitle({
  children,
  className = "",
  as: Tag = "h2",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span";
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefersReduced]);

  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <motion.div
        animate={
          visible
            ? { clipPath: "inset(0 0% 0 0)" }
            : { clipPath: "inset(0 100% 0 0)" }
        }
        transition={{
          duration: prefersReduced ? 0 : 0.75,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <Tag className={className} style={style}>
          {children}
        </Tag>
      </motion.div>
    </div>
  );
}

/* ─── Fade-in on scroll ─────────────────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefersReduced]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Scroll-velocity marquee ───────────────────────────────────────────── */
function VelocityMarquee({
  items,
  baseSpeed = 40,
}: {
  items: string[];
  baseSpeed?: number;
}) {
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothV = useSpring(velocity, { damping: 50, stiffness: 400 });

  const [x, setX] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const lastTime = useRef<number>(0);

  useEffect(() => {
    if (prefersReduced) return;
    let currentX = 0;
    const trackW = trackRef.current?.scrollWidth
      ? trackRef.current.scrollWidth / 2
      : 600;

    const tick = (t: number) => {
      const dt = lastTime.current ? (t - lastTime.current) / 1000 : 0.016;
      lastTime.current = t;
      const vel = smoothV.get();
      const skewBoost = Math.abs(vel) * 0.002;
      const speed = (baseSpeed + skewBoost) * (vel < 0 ? 1.4 : 1);
      currentX -= speed * dt;
      if (currentX < -trackW) currentX += trackW;
      setX(currentX);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [prefersReduced, baseSpeed, smoothV]);

  const skewX = useTransform(smoothV, [-2000, 0, 2000], [-6, 0, 6]);

  const str = items.join("  /  ") + "  /  ";

  return (
    <div className="bs09 marquee-inner" style={{ width: "100%" }}>
      <motion.div
        className="bs09 marquee-track"
        ref={trackRef}
        style={{ x: prefersReduced ? 0 : x, skewX }}
      >
        {[str, str, str, str].map((s, i) => (
          <span key={i} style={{ paddingRight: "2rem" }}>
            {s}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Count-up stat ─────────────────────────────────────────────────────── */
function CountStat({
  end,
  suffix = "",
  label,
}: {
  end: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [val, setVal] = useState(prefersReduced ? end : 0);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered || prefersReduced) return;
    let start: number | null = null;
    const duration = 1600;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, end, prefersReduced]);

  return (
    <div
      ref={ref}
      style={{ padding: "1.5rem 0", borderTop: "1px solid var(--rule)" }}
    >
      <div className="bs09 stat-num">
        {val}
        <span className="stat-unit">{suffix}</span>
      </div>
      <div
        className="bs09 f-caption"
        style={{ marginTop: "0.4rem", color: "var(--muted)" }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─── Masthead skew on scroll ───────────────────────────────────────────── */
function MastheadLine({
  children,
  dir = 1,
}: {
  children: React.ReactNode;
  dir?: 1 | -1;
}) {
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothV = useSpring(velocity, { damping: 50, stiffness: 400 });
  const skew = useTransform(smoothV, [-3000, 0, 3000], [dir * -8, 0, dir * 8]);

  return (
    <motion.div style={{ skewX: prefersReduced ? 0 : skew }}>
      {children}
    </motion.div>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */
export default function Broadsheet09() {
  const prefersReduced = useReducedMotion();

  const services = [
    {
      num: "01",
      title: "n8n Workflow Architecture",
      desc: "End-to-end automation pipelines that connect your CRM, calendar, inbox, and data warehouse — without a single line of glue code from your team.",
    },
    {
      num: "02",
      title: "AI Voice & WhatsApp Bots",
      desc: "Receptionist-grade voice agents and WhatsApp responders that qualify leads, book calls, and follow up — around the clock, in any timezone.",
    },
    {
      num: "03",
      title: "Answer Engine Optimisation",
      desc: "Structural content engineering so your brand surfaces in ChatGPT, Perplexity, and Gemini answers — not just Google's tenth blue link.",
    },
    {
      num: "04",
      title: "Next.js Product Engineering",
      desc: "Production-ready web apps with clean architecture, TypeScript throughout, and deployment pipelines that don't break at 2 a.m.",
    },
    {
      num: "05",
      title: "Lead Capture & Nurture Systems",
      desc: "Multi-touch sequences that turn cold traffic into booked meetings without a sales team — automated, measurable, and built to iterate.",
    },
  ];

  const works = [
    {
      img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
      label: "FreightOps US — AI Receptionist",
      tag: "Voice AI",
      caption: "Dual-geo campaign, US + Singapore",
      landscape: true,
    },
    {
      img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
      label: "Inspire Health PT — $27 Funnel",
      tag: "Automation",
      caption: "Stripe live, 6 bugs shipped",
      landscape: false,
    },
    {
      img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
      label: "IdeaViaggi — Trip-Input System",
      tag: "Next.js",
      caption: "GDPR-hardened, 5-agent audit",
      landscape: true,
    },
    {
      img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
      label: "TakyCorp — Email Automation",
      tag: "n8n",
      caption: "Outage patched, cron running",
      landscape: false,
    },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="bs09 baseline-bg"
        style={{
          minHeight: "100vh",
          position: "relative",
          zIndex: 2,
          background: "var(--bg)",
        }}
        id="main-content"
      >
        {/* ── Skip link target ── */}
        <a
          href="#main-content"
          className="bs09"
          style={{
            position: "absolute",
            top: -999,
            left: -999,
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          Skip to content
        </a>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 0 — TOP BAR
        ══════════════════════════════════════════════════════════════════════ */}
        <header role="banner">
          <div
            style={{
              borderBottom: "3px solid var(--text)",
              padding: "0.5rem 2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <span className="bs09 f-byline" style={{ color: "var(--text)" }}>
              SkynetLabs / Waseem Nasir
            </span>
            <span className="bs09 f-byline" style={{ color: "var(--muted)" }}>
              Est. 2019 &mdash; Bali / Lahore / Remote
            </span>
            <span className="bs09 f-byline" style={{ color: "var(--text)" }}>
              Vol. VII &nbsp;&bull;&nbsp; Issue 09
            </span>
          </div>
          <hr className="bs09 rule-h-red" />
        </header>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 1 — MASTHEAD
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Hero"
          style={{
            padding: "3rem 2rem 0",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          {/* Kicker */}
          <FadeIn>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <span className="bs09 tag tag-red">Breaking</span>
              <span className="bs09 f-byline">
                Automation dispatch &mdash; June 2026
              </span>
            </div>
          </FadeIn>

          {/* Big masthead headline */}
          <div style={{ overflow: "hidden", marginBottom: "0.25rem" }}>
            <MastheadLine dir={1}>
              <h1
                className="bs09 f-masthead masthead-size"
                style={{
                  fontSize: "clamp(4rem, 12vw, 10rem)",
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Automation,
              </h1>
            </MastheadLine>
          </div>
          <div style={{ overflow: "hidden", marginBottom: "0.25rem" }}>
            <MastheadLine dir={-1}>
              <div
                className="bs09 f-masthead masthead-size"
                style={{
                  fontSize: "clamp(4rem, 12vw, 10rem)",
                  color: "var(--accent)",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                set in type.
                <span
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    color: "var(--text)",
                    fontStyle: "normal",
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Built by Waseem Nasir.
                </span>
              </div>
            </MastheadLine>
          </div>

          {/* Subgrid: deck + photo strip */}
          <div
            className="bs09 grid12"
            style={{
              marginTop: "2.5rem",
              borderTop: "1px solid var(--rule)",
              paddingTop: "2rem",
              paddingBottom: "2.5rem",
              rowGap: "1.5rem",
            }}
          >
            {/* Deck copy — cols 1-5 */}
            <div style={{ gridColumn: "1 / 6" }}>
              <FadeIn delay={0.1}>
                <p
                  className="bs09 f-deck"
                  style={{
                    fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                    color: "var(--text)",
                    margin: "0 0 1.5rem",
                  }}
                >
                  "Founder, AI systems &mdash; 180+ builds, 40+ clients, 9
                  countries, operating since 2019."
                </p>
                <p
                  className="bs09 f-body"
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--muted)",
                    maxWidth: "38ch",
                    margin: "0 0 2rem",
                  }}
                >
                  Missed leads die. Follow-ups don&apos;t happen. Manual ops
                  drain margin. SkynetLabs builds the systems that fix all three
                  &mdash; without adding headcount.
                </p>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="bs09 cta-btn"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Book 30-min call &rarr;
                </a>
              </FadeIn>
            </div>

            {/* Vertical rule */}
            <div
              className="bs09 col-border-r hide-sm"
              style={{ gridColumn: "6 / 7" }}
            />

            {/* Photo strip — cols 7-12 */}
            <div
              style={{
                gridColumn: "7 / -1",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1px",
                background: "var(--rule)",
              }}
            >
              {[
                {
                  f: "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
                  alt: "Waseem Nasir, arms crossed, confident",
                },
                {
                  f: "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
                  alt: "Waseem Nasir working at Bali rooftop cafe",
                },
              ].map(({ f, alt }) => (
                <div
                  key={f}
                  className="bs09 photo-frame"
                  style={{
                    height: "clamp(220px, 28vw, 380px)",
                    background: "var(--surface)",
                  }}
                >
                  <img
                    src={`/img/pro/${f}`}
                    alt={alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Mobile fallback for cols */}
            <div className="mobile-stack" style={{ gridColumn: "1 / -1" }} />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            TICKER MARQUEE
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="bs09 ticker-bg" aria-hidden>
          <VelocityMarquee
            items={[
              "180+ systems shipped",
              "40+ clients",
              "9 countries",
              "n8n workflows",
              "WhatsApp bots",
              "Voice AI",
              "AEO",
              "Next.js",
              "Est. 2019",
              "Bali-based",
            ]}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 2 — PROOF NUMBERS
        ══════════════════════════════════════════════════════════════════════ */}
        <section aria-label="Proof numbers" style={{ padding: "0 2rem" }}>
          <div
            style={{
              paddingTop: "2.5rem",
              paddingBottom: "0.5rem",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <span className="bs09 section-num">§ 01</span>
            <hr className="bs09 rule-h" style={{ flex: 1 }} />
            <WipeTitle
              as="h2"
              className="bs09 f-byline"
              style={{
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.7rem",
              }}
            >
              By the numbers
            </WipeTitle>
          </div>

          <div
            className="bs09 grid12"
            style={{
              columnGap: "1px",
              background: "var(--rule)",
              borderTop: "1px solid var(--rule)",
              borderBottom: "1px solid var(--rule)",
            }}
          >
            {[
              { end: 180, suffix: "+", label: "Automation builds shipped" },
              { end: 40, suffix: "+", label: "Clients across industries" },
              { end: 9, suffix: "", label: "Countries worked from" },
              { end: 2019, suffix: "", label: "Year operations began" },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{
                  gridColumn: `${1 + i * 3} / ${4 + i * 3}`,
                  background: "var(--bg)",
                  padding: "0 1.5rem",
                  borderRight: i < 3 ? "1px solid var(--rule)" : undefined,
                }}
                className="mobile-stack"
              >
                <CountStat end={s.end} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 3 — WHAT I BUILD (SERVICES)
        ══════════════════════════════════════════════════════════════════════ */}
        <section aria-label="Services" style={{ padding: "3rem 2rem" }}>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <span className="bs09 section-num">§ 02</span>
            <hr className="bs09 rule-h" style={{ flex: 1 }} />
          </div>
          <div className="bs09 grid12" style={{ rowGap: "0" }}>
            {/* Section label */}
            <div style={{ gridColumn: "1 / 5" }} className="mobile-stack">
              <WipeTitle
                as="h2"
                className="bs09 f-head"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  color: "var(--text)",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                The systems I build.
              </WipeTitle>
              <p
                className="bs09 f-body"
                style={{
                  color: "var(--muted)",
                  maxWidth: "34ch",
                  marginTop: "1rem",
                  fontSize: "0.9rem",
                }}
              >
                Every engagement is scoped to solve a specific operations
                problem &mdash; not to add software for its own sake.
              </p>
            </div>

            {/* Service list */}
            <div
              style={{
                gridColumn: "5 / -1",
                paddingLeft: "2rem",
                borderLeft: "1px solid var(--rule)",
              }}
              className="mobile-stack"
            >
              {services.map((s, i) => (
                <FadeIn key={s.num} delay={i * 0.07}>
                  <div className="bs09 service-item">
                    <span
                      className="bs09 f-byline"
                      style={{ paddingTop: "0.2rem" }}
                    >
                      {s.num}
                    </span>
                    <div>
                      <div
                        className="bs09 f-head"
                        style={{
                          fontSize: "1.05rem",
                          marginBottom: "0.35rem",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontWeight: 700,
                        }}
                      >
                        {s.title}
                      </div>
                      <p
                        className="bs09 f-body"
                        style={{
                          margin: 0,
                          fontSize: "0.88rem",
                          color: "var(--muted)",
                          lineHeight: 1.6,
                        }}
                      >
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            TICKER 2 — dark accent strip
        ══════════════════════════════════════════════════════════════════════ */}
        <div
          aria-hidden
          style={{
            background: "var(--accent)",
            color: "#fff",
            padding: "0.35rem 0",
            borderTop: "2px solid var(--accent2)",
            borderBottom: "2px solid var(--accent2)",
            overflow: "hidden",
          }}
        >
          <div className="bs09">
            <VelocityMarquee
              baseSpeed={30}
              items={[
                "n8n Workflows",
                "WhatsApp Bots",
                "Voice AI Receptionists",
                "AEO Content Systems",
                "Lead Nurture Sequences",
                "Next.js Apps",
                "Stripe Integrations",
                "CRM Automation",
              ]}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 4 — SELECTED WORK (photo grid)
        ══════════════════════════════════════════════════════════════════════ */}
        <section aria-label="Selected work" style={{ padding: "3rem 2rem" }}>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span className="bs09 section-num">§ 03</span>
            <hr className="bs09 rule-h" style={{ flex: 1 }} />
            <WipeTitle
              as="h2"
              className="bs09 f-head"
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                color: "var(--text)",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              Selected engagements.
            </WipeTitle>
          </div>
          <p
            className="bs09 f-byline"
            style={{ marginBottom: "2rem", marginLeft: "3.5rem" }}
          >
            Real clients. Real systems. Real results.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1px",
              background: "var(--rule)",
              border: "1px solid var(--rule)",
            }}
          >
            {works.map((w, i) => (
              <FadeIn key={w.img} delay={i * 0.08} className="">
                <div style={{ background: "var(--surface)", padding: "0" }}>
                  <div
                    className="bs09 work-img"
                    style={{
                      height: w.landscape
                        ? "clamp(180px, 22vw, 300px)"
                        : "clamp(220px, 28vw, 360px)",
                    }}
                  >
                    <img src={`/img/pro/${w.img}`} alt={w.label} />
                  </div>
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      borderTop: "1px solid var(--rule)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "0.5rem",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <span
                        className="bs09 f-head"
                        style={{
                          fontSize: "0.95rem",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontWeight: 700,
                        }}
                      >
                        {w.label}
                      </span>
                      <span className="bs09 tag">{w.tag}</span>
                    </div>
                    <span className="bs09 f-caption">{w.caption}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 5 — EDITORIAL / PULL QUOTE + PORTRAIT
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Editorial"
          style={{
            padding: "3rem 2rem",
            borderTop: "3px solid var(--text)",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          <div className="bs09 grid12" style={{ rowGap: "2rem" }}>
            {/* Portrait */}
            <div style={{ gridColumn: "1 / 5" }} className="mobile-stack">
              <FadeIn>
                <div
                  className="bs09 photo-frame"
                  style={{ height: "clamp(340px, 45vw, 580px)" }}
                >
                  <img
                    src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                    alt="Waseem Nasir, founder of SkynetLabs, on balcony"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <p className="bs09 f-caption" style={{ marginTop: "0.5rem" }}>
                  PORTRAIT &mdash; Waseem Nasir, SkynetLabs founder.
                </p>
              </FadeIn>
            </div>

            {/* Vertical rule */}
            <div
              className="bs09 col-border-r hide-sm"
              style={{ gridColumn: "5 / 6" }}
            />

            {/* Pull quote + body copy */}
            <div
              style={{
                gridColumn: "6 / -1",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "2rem",
              }}
              className="mobile-stack"
            >
              <FadeIn delay={0.1}>
                <blockquote className="bs09 pull-quote" style={{ margin: 0 }}>
                  &ldquo;Most agencies sell retainers. I sell outcomes: the lead
                  captured, the follow-up sent, the ops task that never lands on
                  your desk.&rdquo;
                </blockquote>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="bs09 f-body drop-cap">
                  Seven years of independent practice across 9 countries produce
                  a very specific lens: systems don&apos;t fail at strategy,
                  they fail at the handoff. The moment a lead falls between
                  tools. The email that nobody sent. The report that lives in a
                  spreadsheet nobody opens. SkynetLabs closes those gaps with
                  precision-engineered automation &mdash; not demos, not decks,
                  not promises.
                </p>
                <p
                  className="bs09 f-body"
                  style={{ color: "var(--muted)", marginTop: "1rem" }}
                >
                  The stack changes. The philosophy doesn&apos;t: build once,
                  run always, measure everything.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div
                  className="bs09 f-byline"
                  style={{
                    borderTop: "1px solid var(--rule)",
                    paddingTop: "1rem",
                  }}
                >
                  Waseem Nasir &mdash; Founder, SkynetLabs &mdash;
                  waseembali2k26@gmail.com
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 6 — FIELD DISPATCHES (work photos)
        ══════════════════════════════════════════════════════════════════════ */}
        <section aria-label="Field dispatches" style={{ padding: "3rem 2rem" }}>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <span className="bs09 section-num">§ 04</span>
            <hr className="bs09 rule-h" style={{ flex: 1 }} />
            <WipeTitle
              as="h2"
              className="bs09 f-head"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              Field dispatches.
            </WipeTitle>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "1px",
              background: "var(--rule)",
              border: "1px solid var(--rule)",
            }}
          >
            {/* Large feature image */}
            <FadeIn>
              <div
                style={{
                  background: "var(--surface)",
                  position: "relative",
                  overflow: "hidden",
                  height: "clamp(280px, 35vw, 480px)",
                }}
              >
                <img
                  src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                  alt="Waseem Nasir at Nusa Penida cliff, arms spread"
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
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(transparent, rgba(22,20,15,0.75))",
                    padding: "1.5rem 1rem 1rem",
                  }}
                >
                  <span
                    className="bs09 f-byline"
                    style={{ color: "rgba(243,239,230,0.85)" }}
                  >
                    Nusa Penida, Bali &mdash; 2025
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Stack right */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {[
                {
                  f: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
                  alt: "Client meeting, thumbs up",
                  cap: "Client session, 2025",
                },
                {
                  f: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                  alt: "Bali coworking group meetup",
                  cap: "Coworking meetup, Bali",
                },
              ].map(({ f, alt, cap }) => (
                <div
                  key={f}
                  style={{
                    flex: 1,
                    background: "var(--surface)",
                    overflow: "hidden",
                    position: "relative",
                    minHeight: "140px",
                  }}
                >
                  <img
                    src={`/img/pro/${f}`}
                    alt={alt}
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
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "rgba(22,20,15,0.55)",
                      padding: "0.5rem 0.75rem",
                    }}
                  >
                    <span
                      className="bs09 f-caption"
                      style={{ color: "rgba(243,239,230,0.85)" }}
                    >
                      {cap}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stack far right */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {[
                {
                  f: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                  alt: "Hilltop city vista with backpack",
                  cap: "Mountain dispatch, 2026",
                },
                {
                  f: "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
                  alt: "Waseem Nasir by neon limit sign",
                  cap: "Bali, May 2026",
                },
              ].map(({ f, alt, cap }) => (
                <div
                  key={f}
                  style={{
                    flex: 1,
                    background: "var(--surface)",
                    overflow: "hidden",
                    position: "relative",
                    minHeight: "140px",
                  }}
                >
                  <img
                    src={`/img/pro/${f}`}
                    alt={alt}
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
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "rgba(22,20,15,0.55)",
                      padding: "0.5rem 0.75rem",
                    }}
                  >
                    <span
                      className="bs09 f-caption"
                      style={{ color: "rgba(243,239,230,0.85)" }}
                    >
                      {cap}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 7 — ABOUT (long-form newspaper column)
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          aria-label="About"
          style={{ padding: "3rem 2rem", borderTop: "3px solid var(--text)" }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginBottom: "2.5rem",
            }}
          >
            <span className="bs09 section-num">§ 05</span>
            <hr className="bs09 rule-h" style={{ flex: 1 }} />
          </div>

          <div className="bs09 grid12" style={{ rowGap: "2rem" }}>
            {/* Headline col */}
            <div style={{ gridColumn: "1 / 6" }} className="mobile-stack">
              <WipeTitle
                as="h2"
                className="bs09 f-masthead"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                  lineHeight: 0.92,
                  color: "var(--text)",
                }}
              >
                Who&apos;s behind the machine.
              </WipeTitle>
            </div>

            {/* Body col 1 */}
            <div
              style={{
                gridColumn: "6 / 9",
                borderLeft: "1px solid var(--rule)",
                paddingLeft: "1.25rem",
              }}
              className="mobile-stack"
            >
              <FadeIn delay={0.1}>
                <p
                  className="bs09 f-body"
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--muted)",
                    lineHeight: 1.75,
                    marginTop: 0,
                  }}
                >
                  Waseem Nasir started SkynetLabs in 2019 with a single
                  conviction: small and mid-size businesses deserve
                  enterprise-grade operations without enterprise-grade overhead.
                  No team. No bloat. Clean systems that run.
                </p>
                <p
                  className="bs09 f-body"
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--muted)",
                    lineHeight: 1.75,
                    marginTop: "1rem",
                  }}
                >
                  Working remotely from Bali and Lahore, he has shipped more
                  than 180 automation builds &mdash; voice bots, WhatsApp
                  agents, n8n pipelines, AEO content systems, and Next.js web
                  apps &mdash; for 40+ clients across 9 countries.
                </p>
              </FadeIn>
            </div>

            {/* Body col 2 */}
            <div
              style={{
                gridColumn: "9 / -1",
                borderLeft: "1px solid var(--rule)",
                paddingLeft: "1.25rem",
              }}
              className="mobile-stack"
            >
              <FadeIn delay={0.2}>
                <p
                  className="bs09 f-body"
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--muted)",
                    lineHeight: 1.75,
                    marginTop: 0,
                  }}
                >
                  The common denominator across every engagement: the client
                  stopped doing something manually. Either a lead stopped
                  slipping, a follow-up started firing, or a report generated
                  itself. Outcome-first, not feature-first.
                </p>
                <p
                  className="bs09 f-body"
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--muted)",
                    lineHeight: 1.75,
                    marginTop: "1rem",
                  }}
                >
                  When he&apos;s not building, he&apos;s in the field &mdash;
                  mountain cafes, beach co-working spaces, client offices
                  &mdash; keeping the practice lean, mobile, and focused.
                </p>
              </FadeIn>
            </div>
          </div>

          {/* Second row: 2 more photos */}
          <div
            style={{
              marginTop: "2.5rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1px",
              background: "var(--rule)",
              border: "1px solid var(--rule)",
            }}
          >
            {[
              {
                f: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                alt: "Waseem Nasir, rooftop cafe, laptop and smoothie",
                cap: "Building in Bali, June 2026",
              },
              {
                f: "PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg",
                alt: "Waseem Nasir in beige tracksuit, glass building",
                cap: "On location, 2026",
              },
              {
                f: "TRAVEL-google-office-sign-cream-outfit.jpg",
                alt: "Waseem Nasir at Google office sign",
                cap: "Google Campus visit",
              },
            ].map(({ f, alt, cap }) => (
              <FadeIn key={f}>
                <div
                  style={{
                    background: "var(--surface)",
                    overflow: "hidden",
                    position: "relative",
                    height: "clamp(200px, 24vw, 320px)",
                  }}
                >
                  <img
                    src={`/img/pro/${f}`}
                    alt={alt}
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
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "rgba(22,20,15,0.6)",
                      padding: "0.5rem 0.75rem",
                    }}
                  >
                    <span
                      className="bs09 f-caption"
                      style={{ color: "rgba(243,239,230,0.9)" }}
                    >
                      {cap}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 8 — CTA
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Contact"
          style={{
            background: "var(--text)",
            color: "var(--bg)",
            padding: "4rem 2rem",
            borderTop: "3px solid var(--accent)",
          }}
        >
          <div className="bs09 grid12" style={{ rowGap: "2rem" }}>
            <div style={{ gridColumn: "1 / 7" }} className="mobile-stack">
              <WipeTitle
                as="h2"
                className="bs09 f-masthead"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  color: "var(--bg)",
                  lineHeight: 0.92,
                }}
              >
                Run leaner.
                <br />
                <span style={{ color: "var(--accent)" }}>Ship faster.</span>
              </WipeTitle>
            </div>

            <div
              style={{
                gridColumn: "7 / -1",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "1.5rem",
              }}
              className="mobile-stack"
            >
              <FadeIn delay={0.15}>
                <p
                  className="bs09 f-deck"
                  style={{
                    color: "rgba(243,239,230,0.75)",
                    fontSize: "1.1rem",
                    margin: 0,
                  }}
                >
                  One 30-minute call to diagnose your biggest operational
                  bottleneck and sketch the system that solves it. No pitch
                  deck. No retainer pressure.
                </p>
                <div
                  style={{
                    marginTop: "1.5rem",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    className="bs09 cta-btn"
                    rel="noopener noreferrer"
                    target="_blank"
                    style={{
                      background: "var(--accent)",
                      borderColor: "var(--accent)",
                      color: "#fff",
                    }}
                  >
                    Book discovery call &rarr;
                  </a>
                  <a
                    href="https://github.com/waseemnasir2k26"
                    className="bs09 ghost-btn"
                    rel="noopener noreferrer"
                    target="_blank"
                    style={{
                      borderColor: "rgba(243,239,230,0.4)",
                      color: "var(--bg)",
                    }}
                  >
                    GitHub
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════════════════ */}
        <footer
          role="contentinfo"
          style={{
            borderTop: "3px solid var(--text)",
            background: "var(--bg)",
          }}
        >
          <div className="bs09 footer-grid">
            <div className="bs09 footer-cell">
              <p
                className="bs09 f-head"
                style={{
                  fontSize: "1.1rem",
                  margin: "0 0 0.5rem",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 700,
                }}
              >
                SkynetLabs
              </p>
              <p className="bs09 f-caption">
                AI &amp; automation for founders
                <br />
                who ship, not just plan.
              </p>
            </div>
            <div className="bs09 footer-cell">
              <p
                className="bs09 f-byline"
                style={{ marginBottom: "0.5rem", color: "var(--text)" }}
              >
                Links
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                {[
                  ["skynetjoe.com", "https://skynetjoe.com"],
                  ["Discovery call", "https://skynetjoe.com/discovery-call"],
                  ["GitHub", "https://github.com/waseemnasir2k26"],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bs09 f-caption"
                    style={{
                      color: "var(--text)",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div className="bs09 footer-cell">
              <p
                className="bs09 f-byline"
                style={{ marginBottom: "0.5rem", color: "var(--text)" }}
              >
                Contact
              </p>
              <p className="bs09 f-caption">
                waseembali2k26@gmail.com
                <br />
                Bali / Lahore / Remote
                <br />
                Est. 2019
              </p>
            </div>
          </div>

          {/* Bottom rule */}
          <div
            style={{
              padding: "0.75rem 2rem",
              borderTop: "1px solid var(--rule)",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <span className="bs09 f-caption">
              &copy; 2026 SkynetLabs / Waseem Nasir. All rights reserved.
            </span>
            <span className="bs09 f-caption">
              Design 09 / 50 &mdash; Broadsheet
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
