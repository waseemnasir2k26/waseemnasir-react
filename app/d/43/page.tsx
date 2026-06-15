"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";

/* ─── Kinfolk Quiet — Design 43 ─────────────────────────────────────────────
   Slow-living editorial. Asymmetric 12-col. Huge margins. Single dominant photo
   per section. Near-still motion (scale 1.04→1, text rises 12px). Restraint.
────────────────────────────────────────────────────────────────────────────── */

const P = {
  bg: "#EDE8DF",
  surface: "#F7F4EF",
  text: "#2B2B28",
  muted: "#9A9286",
  accent: "#7C6A52",
  accent2: "#3E4A3D",
} as const;

/* ─── Hooks ─────────────────────────────────────────────────────────────── */
function useEnter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  return { ref, inView };
}

/* ─── CountUp — defined outside render to prevent remount ───────────────── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useEnter();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) {
      setVal(target);
      return;
    }
    let start = 0;
    const step = target / 52;
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(id);
      } else {
        setVal(Math.floor(start));
      }
    }, 18);
    return () => clearInterval(id);
  }, [inView, target, reduced]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ─── Motion wrappers ───────────────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { ref, inView } = useEnter();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? {} : { opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.3, ease: [0.22, 0.1, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function ScaleIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { ref, inView } = useEnter();
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ overflow: "hidden", width: "100%", height: "100%" }}
      initial={reduced ? {} : { opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.3, ease: [0.22, 0.1, 0.2, 1], delay }}
    >
      <motion.div
        style={{ width: "100%", height: "100%" }}
        initial={reduced ? {} : { scale: 1.05 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.22, 0.1, 0.2, 1], delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─── Line divider ──────────────────────────────────────────────────────── */
function Rule({ opacity = 0.2 }: { opacity?: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "1px",
        background: P.muted,
        opacity,
      }}
    />
  );
}

/* ─── Caption ───────────────────────────────────────────────────────────── */
function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "10px",
        letterSpacing: "0.07em",
        color: P.muted,
        textAlign: "right",
        marginTop: "12px",
        fontStyle: "italic",
        lineHeight: 1.6,
      }}
    >
      {children}
    </p>
  );
}

/* ─── SectionLabel ──────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "10px",
        letterSpacing: "0.13em",
        color: P.muted,
        textTransform: "uppercase",
        marginBottom: "28px",
      }}
    >
      {children}
    </p>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function KinfolkQuiet() {
  const reduced = useReducedMotion();

  /* hero parallax — applied to the portrait image */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroImgY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 30]);

  return (
    <>
      {/* ── Scoped fonts + reset ─────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@400;500&family=Space+Mono:wght@400&display=swap');

        .k43-root {
          background: #EDE8DF;
          color: #2B2B28;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
        }
        .k43-root *, .k43-root *::before, .k43-root *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .k43-root a {
          color: inherit;
          text-decoration: none;
        }
        .k43-root a:focus-visible {
          outline: 2px solid #7C6A52;
          outline-offset: 3px;
          border-radius: 1px;
        }
        .k43-root img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* 12-column grid */
        .k43-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          column-gap: clamp(16px, 2vw, 28px);
        }

        /* container */
        .k43-wrap {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(24px, 5vw, 96px);
        }

        /* Fraunces display */
        .k43-display {
          font-family: 'Fraunces', Georgia, serif;
          font-optical-sizing: auto;
        }
        .k43-mono {
          font-family: 'Space Mono', monospace;
        }

        /* section spacing */
        .k43-section {
          padding-top: clamp(96px, 11vw, 160px);
          padding-bottom: clamp(96px, 11vw, 160px);
        }

        /* Hover tint on CTA */
        .k43-cta-btn {
          display: inline-block;
          padding: 15px 40px;
          border: 1px solid #7C6A52;
          color: #7C6A52;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: background 0.5s ease, color 0.5s ease;
        }
        .k43-cta-btn:hover {
          background: #7C6A52;
          color: #EDE8DF;
        }

        /* gallery grid */
        .k43-gallery {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* services list */
        .k43-service-item {
          display: grid;
          grid-template-columns: 52px 1fr;
          gap: 24px;
          padding: 44px 0;
          align-items: start;
        }

        /* skip link */
        .k43-skip {
          position: absolute;
          left: -9999px;
          top: 8px;
          background: #7C6A52;
          color: #EDE8DF;
          padding: 8px 16px;
          font-size: 13px;
          z-index: 999;
        }
        .k43-skip:focus { left: 8px; }

        /* number stat */
        .k43-stat-num {
          font-family: 'Fraunces', Georgia, serif;
          font-optical-sizing: auto;
          font-size: clamp(52px, 7vw, 96px);
          font-weight: 300;
          line-height: 1;
          color: #2B2B28;
          letter-spacing: -0.02em;
        }
        .k43-stat-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: #9A9286;
          text-transform: uppercase;
          margin-top: 10px;
        }

        /* work entry */
        .k43-work-entry + .k43-work-entry {
          margin-top: clamp(72px, 9vw, 120px);
          padding-top: clamp(72px, 9vw, 120px);
          border-top: 1px solid rgba(154,146,134,0.18);
        }

        /* footer link */
        .k43-footer-link {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.09em;
          color: rgba(237,232,223,0.55);
          text-transform: uppercase;
          transition: color 0.35s ease;
        }
        .k43-footer-link:hover { color: rgba(237,232,223,0.9); }

        /* mosaic grid */
        .k43-mosaic {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 14px;
        }
        .k43-mosaic-tall {
          grid-row: 1 / 3;
        }

        /* responsive */
        @media (max-width: 900px) {
          .k43-grid { grid-template-columns: 1fr; }
          .k43-grid > * { grid-column: 1 / -1 !important; }
          .k43-service-item { grid-template-columns: 40px 1fr; gap: 16px; }
          .k43-mosaic { grid-template-columns: 1fr 1fr; }
          .k43-mosaic-tall { grid-row: auto; }
        }
        @media (max-width: 600px) {
          .k43-gallery { grid-template-columns: 1fr; }
          .k43-mosaic { grid-template-columns: 1fr; }
          .k43-mosaic-tall { grid-row: auto; }
        }
      `}</style>

      {/* ── Root wrapper ─────────────────────────────────────────────────── */}
      <div
        className="k43-root"
        style={{
          minHeight: "100vh",
          position: "relative",
          zIndex: 2,
          background: P.bg,
        }}
      >
        {/* skip nav */}
        <a href="#main-content" className="k43-skip k43-mono">
          Skip to content
        </a>

        {/* ════════════════════════════════════════════════════════════════
            NAV
        ═══════════════════════════════════════════════════════════════════ */}
        <header
          role="banner"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            padding: "22px clamp(24px, 5vw, 96px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(237,232,223,0.88)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(154,146,134,0.12)",
          }}
        >
          <span
            className="k43-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              color: P.text,
              textTransform: "uppercase",
            }}
          >
            Waseem Nasir
          </span>
          <nav aria-label="Primary">
            <a
              href="https://skynetjoe.com/discovery-call"
              className="k43-cta-btn"
              aria-label="Book a 30-minute discovery call"
            >
              Book a call
            </a>
          </nav>
        </header>

        {/* ════════════════════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════════════════════ */}
        <main id="main-content">
          <section
            ref={heroRef}
            aria-label="Hero"
            style={{
              minHeight: "100vh",
              paddingTop: "clamp(110px, 14vw, 190px)",
              paddingBottom: "clamp(72px, 9vw, 130px)",
            }}
          >
            <div className="k43-wrap">
              <div
                className="k43-grid"
                style={{ alignItems: "end", rowGap: "clamp(48px, 7vw, 88px)" }}
              >
                {/* col 1–6: headline */}
                <div style={{ gridColumn: "1 / 7" }}>
                  <FadeUp delay={0.08}>
                    <SectionLabel>
                      SkynetLabs — independent founder
                    </SectionLabel>
                    <h1
                      className="k43-display"
                      style={{
                        fontSize: "clamp(36px, 5.5vw, 76px)",
                        fontWeight: 300,
                        lineHeight: 1.07,
                        letterSpacing: "-0.028em",
                        color: P.text,
                      }}
                    >
                      I build the quiet
                      <br />
                      systems that run
                      <br />
                      while you sleep.
                    </h1>
                  </FadeUp>
                  <FadeUp delay={0.28}>
                    <p
                      style={{
                        marginTop: "44px",
                        fontSize: "clamp(15px, 1.4vw, 17px)",
                        color: P.muted,
                        lineHeight: 1.78,
                        maxWidth: "420px",
                      }}
                    >
                      AI + automation that absorbs the repetition — missed
                      leads, stalled follow-ups, manual ops. You stay in the
                      work that matters.
                    </p>
                  </FadeUp>
                  <FadeUp delay={0.48}>
                    <div style={{ marginTop: "52px" }}>
                      <a
                        href="https://skynetjoe.com/discovery-call"
                        className="k43-cta-btn"
                        aria-label="Book a 30-minute discovery call"
                      >
                        30-minute call &rarr;
                      </a>
                    </div>
                  </FadeUp>
                </div>

                {/* col 7–12: hero portrait — dominant, parallax */}
                <div style={{ gridColumn: "7 / 13" }}>
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <motion.div
                      style={{ y: heroImgY }}
                      initial={reduced ? {} : { opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 1.6,
                        ease: [0.22, 0.1, 0.2, 1],
                        delay: 0.1,
                      }}
                    >
                      <div style={{ aspectRatio: "4/5" }}>
                        <img
                          src="/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg"
                          alt="Waseem Nasir — quiet focus in a warm interior"
                          loading="eager"
                        />
                      </div>
                    </motion.div>
                  </div>
                  <Caption>
                    Lahore, 2026 — still morning, before the world asks anything
                  </Caption>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              PROOF — numbers
          ═════════════════════════════════════════════════════════════════ */}
          <section
            aria-label="Numbers"
            className="k43-section"
            style={{ background: P.surface }}
          >
            <div className="k43-wrap">
              <Rule />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "clamp(48px, 7vw, 96px)",
                  marginTop: "clamp(56px, 7vw, 96px)",
                }}
              >
                {[
                  { n: 180, suffix: "+", label: "Builds shipped" },
                  { n: 40, suffix: "+", label: "Clients served" },
                  { n: 9, suffix: "", label: "Countries worked from" },
                  { n: 2019, suffix: "", label: "Year I started" },
                ].map(({ n, suffix, label }) => (
                  <FadeUp key={label}>
                    <div>
                      <div className="k43-stat-num">
                        <CountUp target={n} suffix={suffix} />
                      </div>
                      <div className="k43-stat-label">{label}</div>
                    </div>
                  </FadeUp>
                ))}
              </div>
              <div style={{ marginTop: "clamp(64px, 8vw, 112px)" }}>
                <Rule />
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              WHAT I DO — services
          ═════════════════════════════════════════════════════════════════ */}
          <section aria-label="Services" className="k43-section">
            <div className="k43-wrap">
              <div className="k43-grid" style={{ rowGap: "48px" }}>
                {/* left: section heading + ambient portrait */}
                <div style={{ gridColumn: "1 / 5" }}>
                  <FadeUp>
                    <SectionLabel>What I do</SectionLabel>
                    <h2
                      className="k43-display"
                      style={{
                        fontSize: "clamp(28px, 3.2vw, 42px)",
                        fontWeight: 300,
                        lineHeight: 1.14,
                        color: P.text,
                      }}
                    >
                      Systems that run
                      <br />
                      without noise.
                    </h2>
                  </FadeUp>

                  <FadeUp delay={0.18}>
                    <div
                      style={{
                        marginTop: "52px",
                        position: "relative",
                        overflow: "hidden",
                        aspectRatio: "3/4",
                      }}
                    >
                      <ScaleIn>
                        <img
                          src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                          alt="Waseem working on a Bali terrace, sunlit latte beside keyboard"
                          loading="lazy"
                        />
                      </ScaleIn>
                    </div>
                    <Caption>
                      Canggu, 2026 — Framer motion config, 07:30, before anyone
                      else arrives
                    </Caption>
                  </FadeUp>
                </div>

                {/* right: services list */}
                <div style={{ gridColumn: "6 / 13", paddingTop: "2px" }}>
                  {[
                    {
                      num: "01",
                      title: "AI automation",
                      body: "n8n workflows that catch every lead, route every message, and hand off to humans only when it counts. Set once. Runs quietly.",
                    },
                    {
                      num: "02",
                      title: "WhatsApp & voice agents",
                      body: "Conversational bots that handle intake, qualification and appointment booking — on WhatsApp or phone — while you're asleep or on a call.",
                    },
                    {
                      num: "03",
                      title: "Next.js product builds",
                      body: "Fast, focused web applications: dashboards, funnels, client portals. Built to last, not to impress at sprint review.",
                    },
                    {
                      num: "04",
                      title: "AEO + search presence",
                      body: "Structured so AI systems cite you accurately. Answer-engine optimisation for the era where ChatGPT is the new search bar.",
                    },
                  ].map(({ num, title, body }, i) => (
                    <FadeUp key={num} delay={i * 0.08}>
                      <div className="k43-service-item">
                        <div style={{ paddingTop: "3px" }}>
                          <span
                            className="k43-mono"
                            style={{
                              fontSize: "10px",
                              color: P.muted,
                              letterSpacing: "0.09em",
                            }}
                          >
                            {num}
                          </span>
                        </div>
                        <div>
                          <h3
                            className="k43-display"
                            style={{
                              fontSize: "clamp(17px, 1.6vw, 21px)",
                              fontWeight: 500,
                              color: P.text,
                              marginBottom: "14px",
                            }}
                          >
                            {title}
                          </h3>
                          <p
                            style={{
                              fontSize: "14px",
                              color: P.muted,
                              lineHeight: 1.8,
                            }}
                          >
                            {body}
                          </p>
                        </div>
                      </div>
                      <Rule opacity={0.18} />
                    </FadeUp>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              SELECTED WORK — editorial photo pairs
          ═════════════════════════════════════════════════════════════════ */}
          <section
            aria-label="Selected work"
            className="k43-section"
            style={{ background: P.surface }}
          >
            <div className="k43-wrap">
              <FadeUp>
                <SectionLabel>Selected work</SectionLabel>
              </FadeUp>

              {/* Work entry 1 */}
              <div
                className="k43-work-entry"
                style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}
              >
                <div
                  className="k43-grid"
                  style={{ alignItems: "start", rowGap: "40px" }}
                >
                  <div style={{ gridColumn: "1 / 7" }}>
                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        aspectRatio: "4/3",
                      }}
                    >
                      <ScaleIn>
                        <img
                          src="/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg"
                          alt="Dual-screen analytics dashboard setup over morning coffee"
                          loading="lazy"
                        />
                      </ScaleIn>
                    </div>
                    <Caption>Remote build, Bali — 2025</Caption>
                  </div>
                  <div
                    style={{
                      gridColumn: "8 / 13",
                      paddingTop: "clamp(16px, 3.5vw, 56px)",
                    }}
                  >
                    <FadeUp delay={0.12}>
                      <SectionLabel>Automation studio</SectionLabel>
                      <h3
                        className="k43-display"
                        style={{
                          fontSize: "clamp(22px, 2.4vw, 32px)",
                          fontWeight: 300,
                          lineHeight: 1.2,
                          color: P.text,
                          marginBottom: "22px",
                        }}
                      >
                        CRM intake rebuilt for a US logistics firm
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          color: P.muted,
                          lineHeight: 1.8,
                        }}
                      >
                        Dispatch calls arriving at midnight were falling through
                        the cracks. n8n captured every form submission, ran a
                        freight-type classifier, and woke the right coordinator
                        — not everyone — by WhatsApp. Response time: 41 minutes
                        to under 4.
                      </p>
                    </FadeUp>
                  </div>
                </div>
              </div>

              {/* Work entry 2 — mirrored layout */}
              <div className="k43-work-entry">
                <div
                  className="k43-grid"
                  style={{ alignItems: "start", rowGap: "40px" }}
                >
                  <div
                    style={{
                      gridColumn: "1 / 6",
                      paddingTop: "clamp(16px, 3.5vw, 56px)",
                    }}
                  >
                    <FadeUp delay={0.08}>
                      <SectionLabel>Full-stack product</SectionLabel>
                      <h3
                        className="k43-display"
                        style={{
                          fontSize: "clamp(22px, 2.4vw, 32px)",
                          fontWeight: 300,
                          lineHeight: 1.2,
                          color: P.text,
                          marginBottom: "22px",
                        }}
                      >
                        Appointment funnel for a Singapore clinic
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          color: P.muted,
                          lineHeight: 1.8,
                        }}
                      >
                        Receptionist hours were a bottleneck. WhatsApp bot
                        handles intake, insurance questions and slot booking.
                        Staff opens Monday morning to a booked diary — not a
                        voicemail backlog.
                      </p>
                    </FadeUp>
                  </div>
                  <div style={{ gridColumn: "7 / 13" }}>
                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        aspectRatio: "4/3",
                      }}
                    >
                      <ScaleIn>
                        <img
                          src="/img/pro/WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg"
                          alt="Candid focus shot — phone and laptop at a coworking desk"
                          loading="lazy"
                        />
                      </ScaleIn>
                    </div>
                    <Caption>Lahore co-work, 2025</Caption>
                  </div>
                </div>
              </div>

              {/* Work entry 3 */}
              <div className="k43-work-entry">
                <div
                  className="k43-grid"
                  style={{ alignItems: "start", rowGap: "40px" }}
                >
                  <div style={{ gridColumn: "1 / 7" }}>
                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        aspectRatio: "16/10",
                      }}
                    >
                      <ScaleIn>
                        <img
                          src="/img/pro/CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg"
                          alt="Night beach cafe — deep focus, phone and laptop lit by ambient light"
                          loading="lazy"
                        />
                      </ScaleIn>
                    </div>
                    <Caption>Night session, Bali coast — 2026</Caption>
                  </div>
                  <div
                    style={{
                      gridColumn: "8 / 13",
                      paddingTop: "clamp(16px, 3.5vw, 56px)",
                    }}
                  >
                    <FadeUp delay={0.12}>
                      <SectionLabel>AEO / search presence</SectionLabel>
                      <h3
                        className="k43-display"
                        style={{
                          fontSize: "clamp(22px, 2.4vw, 32px)",
                          fontWeight: 300,
                          lineHeight: 1.2,
                          color: P.text,
                          marginBottom: "22px",
                        }}
                      >
                        Cited in ChatGPT answers — not just ranked in Google
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          color: P.muted,
                          lineHeight: 1.8,
                        }}
                      >
                        Structured schema, entity disambiguation, and
                        first-party proof that AI systems can verify. The site
                        gets referenced in model responses — the new referral
                        source no one is competing for yet.
                      </p>
                    </FadeUp>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              ABOUT — large single photo + personal note
          ═════════════════════════════════════════════════════════════════ */}
          <section aria-label="About" className="k43-section">
            <div className="k43-wrap">
              <div
                className="k43-grid"
                style={{ alignItems: "start", rowGap: "56px" }}
              >
                {/* dominant photo — 7 cols wide */}
                <div style={{ gridColumn: "1 / 8" }}>
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      aspectRatio: "3/4",
                    }}
                  >
                    <ScaleIn>
                      <img
                        src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                        alt="Waseem on Nusa Penida cliffs, arms open to the Indian Ocean"
                        loading="lazy"
                      />
                    </ScaleIn>
                  </div>
                  <Caption>
                    Nusa Penida, Indonesia — 2025. Between two builds.
                  </Caption>
                </div>

                {/* text — right 5 cols, vertically centered */}
                <div
                  style={{
                    gridColumn: "9 / 13",
                    paddingTop: "clamp(0px, 5vw, 72px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <FadeUp>
                    <SectionLabel>About</SectionLabel>
                    <h2
                      className="k43-display"
                      style={{
                        fontSize: "clamp(24px, 2.6vw, 34px)",
                        fontWeight: 300,
                        lineHeight: 1.18,
                        color: P.text,
                        marginBottom: "28px",
                      }}
                    >
                      Waseem Nasir
                    </h2>
                    <p
                      style={{
                        fontSize: "14px",
                        color: P.muted,
                        lineHeight: 1.88,
                        marginBottom: "22px",
                      }}
                    >
                      I'm an independent founder. Since 2019 I've shipped over
                      180 automation and AI builds — n8n, Next.js, voice bots,
                      WhatsApp agents — for clients across 9 countries.
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: P.muted,
                        lineHeight: 1.88,
                        marginBottom: "22px",
                      }}
                    >
                      I work from Bali and Lahore, usually from a quiet café at
                      an hour when the internet feels spacious. The quality of
                      the work depends on that quiet — I protect it
                      deliberately.
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: P.muted,
                        lineHeight: 1.88,
                      }}
                    >
                      I take a small number of projects. If yours is one of
                      them, you get my full attention — not a team managing a
                      ticket queue.
                    </p>
                  </FadeUp>
                </div>
              </div>

              {/* second photo row */}
              <div style={{ marginTop: "clamp(48px, 6vw, 88px)" }}>
                <div className="k43-gallery">
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      aspectRatio: "4/3",
                    }}
                  >
                    <ScaleIn delay={0.05}>
                      <img
                        src="/img/pro/LIFESTYLE-2026-05-18-black-bandhgala-sunglasses-phone-cafe-table.jpg"
                        alt="Waseem in black bandhgala at a café table, phone in hand"
                        loading="lazy"
                      />
                    </ScaleIn>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      aspectRatio: "4/3",
                    }}
                  >
                    <ScaleIn delay={0.14}>
                      <img
                        src="/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg"
                        alt="Rooftop café, mountain clouds in the background, laptop open"
                        loading="lazy"
                      />
                    </ScaleIn>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <Caption>Between projects, Bali — 2026</Caption>
                  <Caption>Lahore rooftop — 2026</Caption>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              MORE IMAGES — editorial mosaic (credibility / life texture)
          ═════════════════════════════════════════════════════════════════ */}
          <section
            aria-label="Life in work"
            className="k43-section"
            style={{ background: P.surface }}
          >
            <div className="k43-wrap">
              <FadeUp>
                <SectionLabel>Lately</SectionLabel>
              </FadeUp>

              {/* 3-column mosaic — tall left card spans 2 rows */}
              <div className="k43-mosaic">
                {/* tall left — spans 2 rows via CSS class on the grid item wrapper */}
                <div
                  className="k43-mosaic-tall"
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  <ScaleIn>
                    <div style={{ height: "100%", minHeight: "360px" }}>
                      <img
                        src="/img/pro/PORTRAIT-2026-02-15-balcony-gray-adidas-soft-smile.jpg"
                        alt="Soft portrait — gray Adidas hoodie on a balcony"
                        loading="lazy"
                        style={{ height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  </ScaleIn>
                </div>

                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "1/1",
                  }}
                >
                  <ScaleIn delay={0.07}>
                    <img
                      src="/img/pro/CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg"
                      alt="Blue hour — peace sign, laptop and coconut"
                      loading="lazy"
                    />
                  </ScaleIn>
                </div>

                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "1/1",
                  }}
                >
                  <ScaleIn delay={0.13}>
                    <img
                      src="/img/pro/TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg"
                      alt="Hilltop city vista — backpack, sunglasses"
                      loading="lazy"
                    />
                  </ScaleIn>
                </div>

                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "1/1",
                  }}
                >
                  <ScaleIn delay={0.09}>
                    <img
                      src="/img/pro/CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg"
                      alt="Garden café — blue polo, smiling at laptop"
                      loading="lazy"
                    />
                  </ScaleIn>
                </div>

                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "1/1",
                  }}
                >
                  <ScaleIn delay={0.17}>
                    <img
                      src="/img/pro/LIFESTYLE-2026-03-29-night-cafe-armchair-relaxed-gaze.jpg"
                      alt="Night café armchair — relaxed gaze"
                      loading="lazy"
                    />
                  </ScaleIn>
                </div>
              </div>

              <Caption>
                Remote from Bali, Lahore, and wherever the work is good —
                2025–2026
              </Caption>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              CONTACT / CTA
          ═════════════════════════════════════════════════════════════════ */}
          <section aria-label="Contact" className="k43-section">
            <div className="k43-wrap">
              <div className="k43-grid" style={{ rowGap: "56px" }}>
                {/* wide heading */}
                <div style={{ gridColumn: "1 / 8" }}>
                  <FadeUp>
                    <SectionLabel>Start here</SectionLabel>
                    <h2
                      className="k43-display"
                      style={{
                        fontSize: "clamp(30px, 4.5vw, 60px)",
                        fontWeight: 300,
                        lineHeight: 1.07,
                        color: P.text,
                        letterSpacing: "-0.022em",
                      }}
                    >
                      Tell me what you're
                      <br />
                      trying to stop
                      <br />
                      doing manually.
                    </h2>
                  </FadeUp>
                </div>

                {/* right: contact text + CTA */}
                <div
                  style={{
                    gridColumn: "9 / 13",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    paddingBottom: "8px",
                  }}
                >
                  <FadeUp delay={0.18}>
                    <p
                      style={{
                        fontSize: "14px",
                        color: P.muted,
                        lineHeight: 1.88,
                        marginBottom: "36px",
                      }}
                    >
                      A 30-minute call. No pitch deck. I listen, ask one or two
                      questions, and tell you honestly whether I can help.
                    </p>
                    <a
                      href="https://skynetjoe.com/discovery-call"
                      className="k43-cta-btn"
                      aria-label="Book a 30-minute discovery call with Waseem Nasir"
                    >
                      Book a 30-min call &rarr;
                    </a>
                    <p
                      className="k43-mono"
                      style={{
                        fontSize: "10px",
                        color: P.muted,
                        marginTop: "22px",
                        letterSpacing: "0.07em",
                      }}
                    >
                      No commitment. No sales team.
                    </p>
                  </FadeUp>
                </div>
              </div>

              {/* ambient CTA image — full width, cinematic ratio */}
              <FadeUp delay={0.08}>
                <div
                  style={{
                    marginTop: "clamp(56px, 7vw, 96px)",
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "21/8",
                  }}
                >
                  <ScaleIn>
                    <img
                      src="/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg"
                      alt="Rooftop café — dragonfruit smoothie, laptop, genuine smile"
                      loading="lazy"
                    />
                  </ScaleIn>
                </div>
                <Caption>The kind of morning a build ships cleanly</Caption>
              </FadeUp>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              FOOTER
          ═════════════════════════════════════════════════════════════════ */}
          <footer
            role="contentinfo"
            style={{
              background: P.accent2,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "clamp(48px, 6vw, 72px) clamp(24px, 5vw, 96px)",
            }}
          >
            <div
              style={{
                maxWidth: "1400px",
                margin: "0 auto",
              }}
            >
              <Rule opacity={0.1} />
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "28px",
                  marginTop: "40px",
                }}
              >
                <div>
                  <p
                    className="k43-mono"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.12em",
                      color: "rgba(237,232,223,0.85)",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    Waseem Nasir / SkynetLabs
                  </p>
                  <p
                    className="k43-mono"
                    style={{
                      fontSize: "10px",
                      color: "rgba(237,232,223,0.38)",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Bali · Lahore · Wherever the work is good
                  </p>
                </div>

                <nav
                  aria-label="Footer links"
                  style={{ display: "flex", gap: "36px", flexWrap: "wrap" }}
                >
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    className="k43-footer-link"
                  >
                    Discovery call
                  </a>
                  <a
                    href="https://github.com/waseemnasir2k26"
                    className="k43-footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                  <a href="https://skynetjoe.com" className="k43-footer-link">
                    SkynetLabs
                  </a>
                </nav>

                <p
                  className="k43-mono"
                  style={{
                    fontSize: "10px",
                    color: "rgba(237,232,223,0.3)",
                    letterSpacing: "0.07em",
                  }}
                >
                  Since 2019 — 180+ builds across 9 countries
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
