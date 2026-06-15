"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";

/* ─── palette ─── */
const P = {
  bg: "#EFE7E1",
  surface: "#F7F2ED",
  text: "#2B2521",
  muted: "#A99C92",
  accent: "#9A6A55",
  accent2: "#CBB8A6",
};

/* ─── image pool ─── */
const PORTRAIT_HERO =
  "/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg";
const PORTRAIT_ABOUT =
  "/img/pro/PORTRAIT-2026-02-15-balcony-gray-adidas-soft-smile.jpg";
const IMG_CAFE_1 =
  "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg";
const IMG_CAFE_2 =
  "/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg";
const IMG_CAFE_3 =
  "/img/pro/CAFE-WORK-2025-08-15-couch-laptop-brick-wall-cafe-candid.jpg";
const IMG_TRAVEL_1 =
  "/img/pro/TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg";
const IMG_TRAVEL_2 =
  "/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg";
const IMG_LIFESTYLE_1 =
  "/img/pro/LIFESTYLE-2026-03-29-night-cafe-armchair-relaxed-gaze.jpg";
const IMG_LIFESTYLE_2 =
  "/img/pro/LIFESTYLE-2026-05-18-black-bandhgala-sunglasses-phone-cafe-table.jpg";
const IMG_PORTRAIT_2 =
  "/img/pro/PORTRAIT-travertine-wall-sky-headshot-flowers.jpg";
const IMG_WORK_1 =
  "/img/pro/WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg";
const IMG_PORTRAIT_3 =
  "/img/pro/PORTRAIT-2025-05-08-cafe-table-arms-crossed-pensive.jpg";

/* ─── dissolve crossfade gallery ─── */
const GALLERY = [IMG_CAFE_1, IMG_TRAVEL_1, IMG_LIFESTYLE_1, IMG_PORTRAIT_3];

function CrossfadeGallery() {
  const [idx, setIdx] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % GALLERY.length), 4200);
    return () => clearInterval(t);
  }, [prefersReduced]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <AnimatePresence mode="sync">
        <motion.img
          key={idx}
          src={GALLERY[idx]}
          alt="Waseem at work — rotating gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 1.6, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
      </AnimatePresence>
    </div>
  );
}

/* ─── silk-drape portrait with pointer parallax ─── */
function SilkPortrait({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rawX.set(((e.clientX - cx) / rect.width) * 10);
      rawY.set(((e.clientY - cy) / rect.height) * 7);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReduced, rawX, rawY]);

  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          x: prefersReduced ? 0 : springX,
          y: prefersReduced ? 0 : springY,
          scale: 1.06,
        }}
      />
    </div>
  );
}

/* ─── blur-to-sharp text reveal ─── */
const blurReveal = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 14 },
  visible: (d: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.85, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── count-up ─── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReduced) {
      setVal(target);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        let start = 0;
        const step = target / 60;
        const id = setInterval(() => {
          start += step;
          if (start >= target) {
            setVal(target);
            clearInterval(id);
          } else setVal(Math.floor(start));
        }, 24);
      },
      { threshold: 0.4 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, prefersReduced]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ─── main component ─── */
export default function SoiePage() {
  const prefersReduced = useReducedMotion();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&family=Mulish:wght@400;500&family=Space+Mono:wght@400&display=swap');

        .soie-root {
          font-family: 'Mulish', sans-serif;
          color: #2B2521;
          background: #EFE7E1;
        }
        .soie-root h1, .soie-root h2, .soie-root h3, .soie-root .soie-display {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
        }
        .soie-root .soie-mono {
          font-family: 'Space Mono', monospace;
        }
        .soie-root a:focus-visible {
          outline: 2px solid #9A6A55;
          outline-offset: 3px;
        }
        .soie-divider {
          border: none;
          border-top: 1px solid #CBB8A6;
          margin: 0;
          opacity: 0.5;
        }
        @media (prefers-reduced-motion: reduce) {
          .soie-root * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div
        className="soie-root"
        style={{
          minHeight: "100vh",
          background: P.bg,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ── NAV ── */}
        <nav
          role="navigation"
          aria-label="Primary"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: "1.25rem 2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(239,231,225,0.88)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderBottom: `1px solid ${P.accent2}44`,
          }}
        >
          <span
            className="soie-display"
            style={{
              fontSize: "1.15rem",
              letterSpacing: "0.04em",
              color: P.accent,
            }}
          >
            Waseem Nasir
          </span>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {["Work", "About", "Contact"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="soie-mono"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: P.muted,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = P.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = P.muted)}
              >
                {l}
              </a>
            ))}
            <a
              href="https://skynetjoe.com/discovery-call"
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.5rem 1.2rem",
                background: P.accent,
                color: P.surface,
                textDecoration: "none",
                borderRadius: "2px",
                fontFamily: "'Mulish', sans-serif",
                fontWeight: 500,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#7a5443")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = P.accent)
              }
            >
              Book a call
            </a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <main id="main-content">
          <a
            href="#main-content"
            style={{
              position: "absolute",
              left: "-9999px",
              top: "1rem",
              background: P.accent,
              color: P.surface,
              padding: "0.5rem 1rem",
              zIndex: 9999,
              textDecoration: "none",
              fontSize: "0.8rem",
            }}
            onFocus={(e) => (e.currentTarget.style.left = "1rem")}
            onBlur={(e) => (e.currentTarget.style.left = "-9999px")}
          >
            Skip to content
          </a>

          <section
            aria-label="Hero"
            style={{
              minHeight: "100vh",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              paddingTop: "80px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* left — text column */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "6rem 4rem 6rem 5rem",
                position: "relative",
                zIndex: 2,
              }}
            >
              <motion.p
                className="soie-mono"
                custom={0}
                initial="hidden"
                animate="visible"
                variants={prefersReduced ? {} : blurReveal}
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: P.muted,
                  marginBottom: "2.5rem",
                }}
              >
                SkynetLabs · Since 2019
              </motion.p>

              <motion.h1
                custom={0.15}
                initial="hidden"
                animate="visible"
                variants={prefersReduced ? {} : blurReveal}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(2.8rem, 5vw, 5rem)",
                  lineHeight: 1.08,
                  color: P.text,
                  margin: "0 0 2rem",
                  letterSpacing: "-0.01em",
                }}
              >
                The calm behind
                <br />
                a company
                <br />
                <em style={{ fontStyle: "italic", color: P.accent }}>
                  that runs itself.
                </em>
              </motion.h1>

              <motion.p
                custom={0.3}
                initial="hidden"
                animate="visible"
                variants={prefersReduced ? {} : blurReveal}
                style={{
                  fontFamily: "'Mulish', sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  color: P.muted,
                  maxWidth: "380px",
                  marginBottom: "3.5rem",
                }}
              >
                Quietly building since 2019 — 180+ systems, 40+ clients, 9
                countries. AI and automation that removes the friction between
                you and your best work.
              </motion.p>

              <motion.div
                custom={0.45}
                initial="hidden"
                animate="visible"
                variants={prefersReduced ? {} : blurReveal}
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <a
                  href="https://skynetjoe.com/discovery-call"
                  style={{
                    display: "inline-block",
                    padding: "0.85rem 2.2rem",
                    background: P.accent,
                    color: P.surface,
                    textDecoration: "none",
                    fontFamily: "'Mulish', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: "2px",
                    transition: "background 0.25s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#7a5443")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = P.accent)
                  }
                >
                  Reserve 30 minutes
                </a>
                <a
                  href="https://github.com/waseemnasir2k26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="soie-mono"
                  style={{
                    fontSize: "0.65rem",
                    color: P.muted,
                    textDecoration: "none",
                    letterSpacing: "0.08em",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = P.text)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = P.muted)}
                >
                  github ↗
                </a>
              </motion.div>
            </div>

            {/* right — silk portrait */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: "100vh",
              }}
            >
              <SilkPortrait
                src={PORTRAIT_HERO}
                alt="Waseem Nasir — founder of SkynetLabs, smiling in a warm wood-interior"
              />
              {/* soft vignette left edge */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to right, ${P.bg} 0%, transparent 18%)`,
                  pointerEvents: "none",
                }}
              />
              {/* floating label */}
              <div
                style={{
                  position: "absolute",
                  bottom: "2.5rem",
                  left: "2rem",
                  padding: "0.6rem 1rem",
                  background: `${P.surface}cc`,
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              >
                <p
                  className="soie-mono"
                  style={{
                    fontSize: "0.58rem",
                    color: P.muted,
                    letterSpacing: "0.12em",
                    margin: 0,
                  }}
                >
                  BALI / LAHORE · REMOTE-FIRST
                </p>
              </div>
            </motion.div>
          </section>

          {/* ── NUMBERS ── */}
          <section
            id="proof"
            aria-label="Proof of work"
            style={{
              background: P.surface,
              padding: "6rem 5rem",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "2rem",
              position: "relative",
            }}
          >
            {[
              { n: 180, suf: "+", label: "Systems shipped" },
              { n: 40, suf: "+", label: "Clients served" },
              { n: 9, suf: "", label: "Countries worked from" },
              { n: 2019, suf: "", label: "Year founded" },
            ].map(({ n, suf, label }) => (
              <motion.div
                key={label}
                initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: "left" }}
              >
                <p
                  className="soie-display"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize: "clamp(2.8rem, 4vw, 4.5rem)",
                    color: P.accent,
                    margin: "0 0 0.4rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  <CountUp target={n} suffix={suf} />
                </p>
                <p
                  className="soie-mono"
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: P.muted,
                    margin: 0,
                  }}
                >
                  {label}
                </p>
              </motion.div>
            ))}
          </section>

          <hr className="soie-divider" />

          {/* ── SERVICES ── */}
          <section
            id="work"
            aria-label="Services"
            style={{
              padding: "8rem 5rem",
              display: "grid",
              gridTemplateColumns: "2fr 3fr",
              gap: "5rem",
              alignItems: "start",
            }}
          >
            {/* sticky label */}
            <div style={{ position: "sticky", top: "120px" }}>
              <motion.h2
                initial={
                  prefersReduced ? {} : { opacity: 0, filter: "blur(8px)" }
                }
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                  lineHeight: 1.2,
                  color: P.text,
                  margin: "0 0 1.5rem",
                }}
              >
                What I build
                <br />
                <em style={{ color: P.accent }}>for you</em>
              </motion.h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.8,
                  color: P.muted,
                  maxWidth: "280px",
                }}
              >
                Every system is woven from scratch around your exact operation —
                nothing off-the-shelf.
              </p>

              {/* collage inset */}
              <div
                style={{
                  marginTop: "3rem",
                  position: "relative",
                  height: "320px",
                  width: "260px",
                }}
              >
                <img
                  src={IMG_CAFE_2}
                  alt="Waseem working on a Bali rooftop with a laptop"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "200px",
                    height: "240px",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
                <img
                  src={IMG_TRAVEL_2}
                  alt="Waseem at Nusa Penida cliffs, arms spread"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "140px",
                    height: "170px",
                    objectFit: "cover",
                    objectPosition: "center top",
                    border: `4px solid ${P.bg}`,
                  }}
                />
              </div>
            </div>

            {/* service list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                {
                  num: "01",
                  title: "AI Voice & Chat Bots",
                  body: "WhatsApp, SMS, and voice agents that handle inbound leads, answer questions, and book calls — without you lifting a finger.",
                },
                {
                  num: "02",
                  title: "Automation Workflows",
                  body: "n8n pipelines that connect your tools, follow up with prospects, and kill the manual tasks eating your hours every week.",
                },
                {
                  num: "03",
                  title: "Next.js Web Systems",
                  body: "Fast, clean digital products — landing pages, dashboards, client portals — built to convert and built to last.",
                },
                {
                  num: "04",
                  title: "AEO & AI Discovery",
                  body: "Answer-Engine Optimization so your business surfaces in ChatGPT, Perplexity, and the next wave of AI-native search.",
                },
                {
                  num: "05",
                  title: "Lead & Revenue Ops",
                  body: "Missed-lead recovery, pipeline automation, follow-up sequences — the revenue you're already earning, fully captured.",
                },
              ].map(({ num, title, body }, i) => (
                <motion.div
                  key={num}
                  initial={prefersReduced ? {} : { opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    padding: "2.2rem 0",
                    borderBottom: `1px solid ${P.accent2}55`,
                    display: "grid",
                    gridTemplateColumns: "2.5rem 1fr",
                    gap: "1.5rem",
                    alignItems: "start",
                  }}
                >
                  <span
                    className="soie-mono"
                    style={{
                      fontSize: "0.6rem",
                      color: P.accent2,
                      paddingTop: "0.4rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {num}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 500,
                        fontSize: "1.35rem",
                        color: P.text,
                        margin: "0 0 0.6rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Mulish', sans-serif",
                        fontSize: "0.85rem",
                        lineHeight: 1.75,
                        color: P.muted,
                        margin: 0,
                      }}
                    >
                      {body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <hr className="soie-divider" />

          {/* ── CROSSFADE GALLERY STRIP ── */}
          <section
            aria-label="Selected moments"
            style={{
              padding: "0",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              height: "520px",
            }}
          >
            <div style={{ height: "520px", overflow: "hidden" }}>
              <CrossfadeGallery />
            </div>
            <div
              style={{
                background: P.surface,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "4rem 3.5rem",
              }}
            >
              <p
                className="soie-mono"
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: P.muted,
                  marginBottom: "1.5rem",
                }}
              >
                Selected voice
              </p>
              <blockquote
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
                  lineHeight: 1.35,
                  color: P.text,
                  margin: "0 0 1.5rem",
                }}
              >
                "I don't automate companies. I hand them back their time."
              </blockquote>
              <p style={{ fontSize: "0.8rem", color: P.muted, margin: 0 }}>
                — Waseem Nasir, SkynetLabs
              </p>
            </div>
            <div style={{ height: "520px", overflow: "hidden" }}>
              <img
                src={IMG_LIFESTYLE_2}
                alt="Waseem in a black bandhgala with sunglasses at a café table"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
            </div>
          </section>

          <hr className="soie-divider" />

          {/* ── ABOUT ── */}
          <section
            id="about"
            aria-label="About Waseem"
            style={{
              padding: "8rem 5rem",
              display: "grid",
              gridTemplateColumns: "3fr 2fr",
              gap: "6rem",
              alignItems: "center",
            }}
          >
            <div>
              <p
                className="soie-mono"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: P.muted,
                  marginBottom: "2rem",
                }}
              >
                The human behind the systems
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(2rem, 3.5vw, 3.4rem)",
                  lineHeight: 1.15,
                  color: P.text,
                  margin: "0 0 2rem",
                }}
              >
                Built quietly.
                <br />
                <em style={{ color: P.accent }}>Delivered reliably.</em>
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                  maxWidth: "520px",
                }}
              >
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.8,
                    color: P.text,
                    margin: 0,
                  }}
                >
                  I'm Waseem — an independent builder who has spent six years
                  threading together AI, automation, and web infrastructure for
                  founders and operators across 9 countries.
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.8,
                    color: P.muted,
                    margin: 0,
                  }}
                >
                  I work from Bali and Lahore, remotely and asynchronously. No
                  account managers, no project handoff chains. You work with me
                  directly — and you feel it in the speed and precision of every
                  delivery.
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.8,
                    color: P.muted,
                    margin: 0,
                  }}
                >
                  The tools change. The approach stays the same: understand
                  what's costing you, eliminate it, and build something that
                  keeps running without you.
                </p>
              </div>

              <div
                style={{
                  marginTop: "3rem",
                  display: "flex",
                  gap: "2rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {["n8n", "Next.js", "OpenAI", "WhatsApp API", "AEO"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="soie-mono"
                      style={{
                        fontSize: "0.6rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: P.accent,
                        borderBottom: `1px solid ${P.accent2}`,
                        paddingBottom: "2px",
                      }}
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* about portrait with overlapping accent image */}
            <div style={{ position: "relative" }}>
              <motion.div
                initial={prefersReduced ? {} : { opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  overflow: "hidden",
                }}
              >
                <SilkPortrait
                  src={PORTRAIT_ABOUT}
                  alt="Waseem Nasir on a balcony in a gray Adidas hoodie, soft smile"
                />
              </motion.div>
              <motion.div
                initial={prefersReduced ? {} : { opacity: 0, x: 20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: "absolute",
                  bottom: "-2rem",
                  left: "-2.5rem",
                  width: "130px",
                  height: "165px",
                  overflow: "hidden",
                  border: `5px solid ${P.bg}`,
                }}
              >
                <img
                  src={IMG_WORK_1}
                  alt="Waseem at a coworking desk, focused on phone"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
              </motion.div>
            </div>
          </section>

          <hr className="soie-divider" />

          {/* ── COLLAGE ROW ── */}
          <section
            aria-label="Photo collage"
            style={{
              padding: "4rem 5rem",
              display: "grid",
              gridTemplateColumns: "1.3fr 1fr 1fr 1.3fr",
              gap: "1rem",
              height: "380px",
            }}
          >
            {[
              {
                src: IMG_PORTRAIT_2,
                alt: "Waseem near a travertine wall against blue sky with flowers",
                pos: "center top",
              },
              {
                src: IMG_CAFE_3,
                alt: "Waseem on a couch with laptop at a brick-wall café",
                pos: "center top",
              },
              {
                src: IMG_PORTRAIT_3,
                alt: "Waseem at a café table, arms crossed, pensive look",
                pos: "center top",
              },
              {
                src: IMG_TRAVEL_1,
                alt: "Waseem in a tan knit sweater on a mountain ridge",
                pos: "center top",
              },
            ].map(({ src, alt, pos }, i) => (
              <motion.div
                key={src}
                initial={
                  prefersReduced
                    ? {}
                    : { opacity: 0, y: i % 2 === 0 ? 24 : -24 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ overflow: "hidden", height: "100%" }}
              >
                <img
                  src={src}
                  alt={alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: pos,
                    transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.transform =
                      "scale(1.04)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.transform =
                      "scale(1)")
                  }
                />
              </motion.div>
            ))}
          </section>

          <hr className="soie-divider" />

          {/* ── CTA ── */}
          <section
            id="contact"
            aria-label="Contact and booking"
            style={{
              background: P.surface,
              padding: "8rem 5rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <div>
              <motion.h2
                initial={
                  prefersReduced
                    ? {}
                    : { opacity: 0, filter: "blur(10px)", y: 12 }
                }
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(2.2rem, 4vw, 4rem)",
                  lineHeight: 1.1,
                  color: P.text,
                  margin: "0 0 1.5rem",
                }}
              >
                One conversation.
                <br />
                <em style={{ color: P.accent }}>Clarity on what to build.</em>
              </motion.h2>
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                  color: P.muted,
                  maxWidth: "420px",
                  marginBottom: "2.5rem",
                }}
              >
                Bring your messiest operational problem. In 30 minutes, I'll map
                what's costing you, and whether I'm the right person to fix it.
              </p>
              <a
                href="https://skynetjoe.com/discovery-call"
                style={{
                  display: "inline-block",
                  padding: "1rem 2.8rem",
                  background: P.accent,
                  color: P.surface,
                  textDecoration: "none",
                  fontFamily: "'Mulish', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  transition: "background 0.25s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#7a5443";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = P.accent;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Book a 30-min call
              </a>
            </div>

            {/* accent portrait */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              style={{
                aspectRatio: "4/5",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <SilkPortrait
                src={IMG_PORTRAIT_2}
                alt="Waseem Nasir near a travertine wall with flowers and blue sky behind him"
              />
            </motion.div>
          </section>

          {/* ── FOOTER ── */}
          <footer
            role="contentinfo"
            style={{
              background: P.text,
              color: P.surface,
              padding: "3rem 5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <p
                className="soie-display"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "1.3rem",
                  color: P.accent2,
                  margin: "0 0 0.3rem",
                }}
              >
                Waseem Nasir
              </p>
              <p
                className="soie-mono"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.14em",
                  color: `${P.accent2}99`,
                  margin: 0,
                }}
              >
                SKYNETLABS · BALI / LAHORE · EST 2019
              </p>
            </div>
            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <a
                href="https://github.com/waseemnasir2k26"
                target="_blank"
                rel="noopener noreferrer"
                className="soie-mono"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: `${P.accent2}99`,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = P.accent2)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = `${P.accent2}99`)
                }
              >
                GitHub
              </a>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="soie-mono"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: P.accent2,
                  textDecoration: "none",
                  border: `1px solid ${P.accent2}55`,
                  padding: "0.5rem 1rem",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = P.accent2)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = `${P.accent2}55`)
                }
              >
                Book a call
              </a>
            </div>
            <p
              className="soie-mono"
              style={{
                fontSize: "0.55rem",
                color: `${P.accent2}66`,
                letterSpacing: "0.1em",
                margin: 0,
              }}
            >
              © 2019–2026 SkynetLabs. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
