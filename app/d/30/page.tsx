"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";

/* ─────────────────────────────────────────────
   DESIGN 30 — 16mm Light Leak
   Analog film / Super-16 warmth
   Palette: #11100D bg | #1C1A15 surface | #F2EDE3 text | #7A7264 muted | #E8743B accent | #3C6E6A accent2
───────────────────────────────────────────── */

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;800&family=Inter:wght@400;500&family=Space+Mono:wght@400&display=swap";

const IMAGES = {
  hero: "/img/pro/TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
  reel01a:
    "/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
  reel01b:
    "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  reel01c:
    "/img/pro/CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  reel02a: "/img/pro/WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
  reel02b: "/img/pro/WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
  reel02c:
    "/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
  portrait:
    "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
  bali: "/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  meetup: "/img/pro/EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
  street:
    "/img/pro/TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
  guitar: "/img/pro/LIFESTYLE-2026-06-09-acoustic-guitar-smile-white-cafe.jpg",
  closeup:
    "/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
  rooftop:
    "/img/pro/CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg",
};

/* ── Grain canvas overlay ── */
function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      // every 3rd frame for perf
      if (frame % 3 === 0) {
        for (let i = 0; i < data.length; i += 4) {
          const g = (Math.random() * 60) | 0;
          data[i] = g;
          data[i + 1] = g;
          data[i + 2] = g;
          data[i + 3] = 28;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      frame++;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [shouldReduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        mixBlendMode: "multiply",
        zIndex: 9,
        opacity: 0.55,
      }}
    />
  );
}

/* ── Light Leak that responds to scroll velocity ── */
function LightLeak({ scrollVelocity }: { scrollVelocity: number }) {
  const shouldReduce = useReducedMotion();
  const intensity = Math.min(Math.abs(scrollVelocity) / 600, 1);

  if (shouldReduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      animate={{ opacity: 0.08 + intensity * 0.55 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 8,
        background: `
          radial-gradient(ellipse 60% 80% at ${25 + intensity * 30}% 10%, #E8743B 0%, transparent 65%),
          radial-gradient(ellipse 40% 60% at 90% ${60 - intensity * 30}%, #F2C27B 0%, transparent 70%),
          radial-gradient(ellipse 30% 40% at 5% 85%, #3C6E6A 0%, transparent 60%)
        `,
        mixBlendMode: "screen",
      }}
    />
  );
}

/* ── Gate-weave jitter on portrait ── */
function GateWeave({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      animate={
        shouldReduce
          ? {}
          : {
              x: [0, -1.2, 0.8, -0.5, 0],
              y: [0, 0.6, -0.4, 0.3, 0],
            }
      }
      transition={{
        duration: 0.18,
        repeat: Infinity,
        repeatDelay: 4.5,
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Letterbox bars ── */
function LetterboxBars() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "clamp(28px, 4.5vw, 52px)",
          background: "#11100D",
          zIndex: 4,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "clamp(28px, 4.5vw, 52px)",
          background: "#11100D",
          zIndex: 4,
        }}
      />
    </>
  );
}

/* ── Reel label ── */
function ReelLabel({ n, label }: { n: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "40px",
      }}
    >
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          color: "#E8743B",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        ◼ REEL {n}
      </span>
      <div
        style={{ flex: 1, height: "1px", background: "#7A7264", opacity: 0.3 }}
      />
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "10px",
          color: "#7A7264",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Sprocket holes decoration ── */
function Sprockets({ count = 6 }: { count?: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "0 6px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "8px",
            height: "12px",
            border: "1.5px solid #7A7264",
            borderRadius: "2px",
            opacity: 0.35,
          }}
        />
      ))}
    </div>
  );
}

/* ── Stat card ── */
function StatCard({
  number,
  label,
  note,
}: {
  number: string;
  label: string;
  note?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        padding: "28px 24px",
        background: "#1C1A15",
        borderTop: "1px solid #E8743B",
        borderLeft: "1px solid rgba(232,116,59,0.2)",
      }}
    >
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(36px, 5vw, 52px)",
          fontWeight: 800,
          color: "#F2EDE3",
          lineHeight: 1,
          marginBottom: "8px",
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          fontWeight: 500,
          color: "#F2EDE3",
          marginBottom: note ? "4px" : 0,
        }}
      >
        {label}
      </div>
      {note && (
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            color: "#7A7264",
            letterSpacing: "0.08em",
          }}
        >
          {note}
        </div>
      )}
    </motion.div>
  );
}

/* ── Service row ── */
function ServiceRow({
  index,
  title,
  description,
  tag,
}: {
  index: string;
  title: string;
  description: string;
  tag: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr auto",
        gap: "24px",
        alignItems: "start",
        padding: "32px 0",
        borderBottom: "1px solid rgba(122,114,100,0.2)",
      }}
    >
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          color: "#E8743B",
          paddingTop: "4px",
        }}
      >
        {index}
      </span>
      <div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(18px, 2.5vw, 24px)",
            fontWeight: 500,
            color: "#F2EDE3",
            marginBottom: "8px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            color: "#7A7264",
            lineHeight: 1.6,
            maxWidth: "480px",
          }}
        >
          {description}
        </div>
      </div>
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "10px",
          color: "#3C6E6A",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          paddingTop: "4px",
          whiteSpace: "nowrap",
        }}
      >
        {tag}
      </span>
    </motion.div>
  );
}

/* ── Full-bleed still with letterbox ── */
function FilmStill({
  src,
  alt,
  caption,
  height = "60vh",
  objectPosition = "center",
}: {
  src: string;
  alt: string;
  caption?: string;
  height?: string;
  objectPosition?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
      }}
    >
      <LetterboxBars />
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          display: "block",
          filter: "sepia(0.18) contrast(1.04) saturate(0.9)",
        }}
      />
      {caption && (
        <div
          style={{
            position: "absolute",
            bottom: "clamp(30px, 5vw, 56px)",
            left: "32px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            color: "#F2EDE3",
            letterSpacing: "0.12em",
            opacity: 0.7,
            zIndex: 5,
          }}
        >
          {caption}
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function Design30() {
  const shouldReduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [velocity, setVelocity] = useState(0);
  const lastY = useRef(0);
  const lastT = useRef(Date.now());

  // Measure scroll velocity manually for light-leak intensity
  useMotionValueEvent(scrollY, "change", (v) => {
    const now = Date.now();
    const dt = now - lastT.current;
    if (dt > 0) {
      setVelocity(((v - lastY.current) / dt) * 100);
    }
    lastY.current = v;
    lastT.current = now;
  });

  // Hero parallax
  const heroY = useTransform(scrollY, [0, 600], [0, shouldReduce ? 0 : 80]);

  return (
    <>
      {/* ── Scoped fonts ── */}
      <style>{`
        @import url('${FONTS_URL}');
        .root-30 {
          font-family: 'Inter', sans-serif;
          color: #F2EDE3;
          background: #11100D;
        }
        .root-30 *,
        .root-30 *::before,
        .root-30 *::after {
          box-sizing: border-box;
        }
        .root-30 a:focus-visible {
          outline: 2px solid #E8743B;
          outline-offset: 3px;
          border-radius: 2px;
        }
        .root-30 .cta-btn {
          display: inline-block;
          padding: 14px 36px;
          background: #E8743B;
          color: #11100D;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
          border: none;
          cursor: pointer;
        }
        .root-30 .cta-btn:hover {
          background: #F2EDE3;
          color: #11100D;
        }
        .root-30 .cta-btn-ghost {
          display: inline-block;
          padding: 13px 35px;
          background: transparent;
          color: #F2EDE3;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(242,237,227,0.35);
          transition: border-color 0.2s, color 0.2s;
        }
        .root-30 .cta-btn-ghost:hover {
          border-color: #E8743B;
          color: #E8743B;
        }
        @media (max-width: 768px) {
          .root-30 .service-grid-inner {
            grid-template-columns: 1fr !important;
          }
          .root-30 .stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .root-30 .about-grid {
            grid-template-columns: 1fr !important;
          }
          .root-30 .reel-strip {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div
        className="root-30"
        style={{
          position: "relative",
          minHeight: "100vh",
          zIndex: 2,
          background: "#11100D",
        }}
      >
        {/* ── Skip link ── */}
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
            e.currentTarget.style.cssText =
              "position:fixed;top:8px;left:8px;z-index:9999;padding:8px 16px;background:#E8743B;color:#11100D;font-family:monospace;font-size:12px;";
          }}
          onBlur={(e) => {
            e.currentTarget.style.cssText =
              "position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;";
          }}
        >
          Skip to main content
        </a>

        {/* ── Persistent overlays ── */}
        <GrainOverlay />
        <LightLeak scrollVelocity={velocity} />

        {/* ════════════════════════════════════
            HERO — REEL 00
        ════════════════════════════════════ */}
        <header
          style={{ position: "relative", height: "100vh", overflow: "hidden" }}
          role="banner"
        >
          {/* Parallax image */}
          <motion.div
            style={{
              y: heroY,
              position: "absolute",
              inset: "-10% 0",
              zIndex: 0,
            }}
          >
            <img
              src={IMAGES.hero}
              alt="Waseem Nasir on a mountain ridge, tan knit sweater, mid-build perspective"
              style={{
                width: "100%",
                height: "110%",
                objectFit: "cover",
                objectPosition: "center top",
                filter:
                  "sepia(0.22) contrast(1.06) saturate(0.85) brightness(0.62)",
                display: "block",
              }}
            />
          </motion.div>

          {/* Cinematic vignette */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(17,16,13,0.85) 100%)",
              zIndex: 1,
            }}
          />

          {/* Bottom gradient fade */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40%",
              background: "linear-gradient(to bottom, transparent, #11100D)",
              zIndex: 2,
            }}
          />

          <LetterboxBars />

          {/* Frame counter – top left */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "clamp(36px, 6vw, 64px)",
              left: "clamp(20px, 4vw, 48px)",
              zIndex: 5,
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: "#E8743B",
              letterSpacing: "0.18em",
              opacity: 0.8,
            }}
          >
            16mm / SUPER-16 &nbsp;◼&nbsp; WASEEM NASIR &nbsp;◼&nbsp; 2019—
          </div>

          {/* Frame edge numbers – top right */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "clamp(36px, 6vw, 64px)",
              right: "clamp(20px, 4vw, 48px)",
              zIndex: 5,
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: "#7A7264",
              letterSpacing: "0.14em",
              opacity: 0.6,
            }}
          >
            0001 ▸ 0180+
          </div>

          {/* Hero text */}
          <div
            style={{
              position: "absolute",
              bottom: "clamp(60px, 8vw, 100px)",
              left: "clamp(20px, 6vw, 80px)",
              right: "clamp(20px, 6vw, 80px)",
              zIndex: 5,
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                color: "#E8743B",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              ◼ REEL 00 — ORIGIN
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 6.5vw, 80px)",
                fontWeight: 800,
                color: "#F2EDE3",
                lineHeight: 1.1,
                maxWidth: "820px",
                marginBottom: "24px",
                letterSpacing: "-0.01em",
              }}
            >
              Nine years.
              <br />
              Forty teams.
              <br />
              <em style={{ color: "#E8743B", fontStyle: "italic" }}>
                One obsession.
              </em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 18px)",
                color: "#B8B0A4",
                maxWidth: "520px",
                lineHeight: 1.65,
                marginBottom: "36px",
              }}
            >
              Making software do the boring part — 180+ builds shipped across 9
              countries since 2019.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
            >
              <a
                href="https://skynetjoe.com/discovery-call"
                className="cta-btn"
                aria-label="Book a 30-minute discovery call with Waseem"
              >
                Book a 30-min call
              </a>
              <a
                href="https://github.com/waseemnasir2k26"
                className="cta-btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View GitHub profile (opens in new tab)"
              >
                GitHub
              </a>
            </motion.div>
          </div>
        </header>

        {/* ════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════ */}
        <main id="main-content">
          {/* ── STATS STRIP ── */}
          <section
            aria-label="Key numbers"
            style={{
              padding: "80px clamp(20px, 6vw, 80px) 80px",
            }}
          >
            <div
              className="stats-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "2px",
                maxWidth: "1100px",
              }}
            >
              <StatCard
                number="180+"
                label="Builds shipped"
                note="since 2019"
              />
              <StatCard
                number="40+"
                label="Client teams"
                note="across industries"
              />
              <StatCard number="9" label="Countries" note="worked from" />
              <StatCard number="6yr" label="Running solo" note="SkynetLabs" />
            </div>
          </section>

          {/* ── FULL-BLEED STILL — interstitial ── */}
          <FilmStill
            src={IMAGES.reel01a}
            alt="Waseem working on a rooftop cafe with mountain clouds in the background"
            caption="LAHORE → BALI → WHEREVER THE WORK IS"
            height="55vh"
            objectPosition="center 35%"
          />

          {/* ─────────────────────────────────
              REEL 01 — THE BUILD
          ───────────────────────────────── */}
          <section
            aria-label="Reel 01 - The Build"
            style={{
              padding: "80px clamp(20px, 6vw, 80px)",
            }}
          >
            <ReelLabel n="01" label="The Build" />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "60px",
                alignItems: "start",
                maxWidth: "1100px",
              }}
            >
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(28px, 4vw, 44px)",
                    fontWeight: 800,
                    color: "#F2EDE3",
                    lineHeight: 1.2,
                    marginBottom: "24px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  I build systems
                  <br />
                  that disappear
                  <br />
                  <em style={{ color: "#E8743B", fontStyle: "italic" }}>
                    into the work.
                  </em>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(14px, 1.5vw, 16px)",
                    color: "#7A7264",
                    lineHeight: 1.75,
                    marginBottom: "20px",
                  }}
                >
                  Every engagement starts the same way: a founder buried under
                  manual ops, chasing leads they'll never close, re-answering
                  the same questions at 2am. My job is to remove that weight —
                  permanently.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(14px, 1.5vw, 16px)",
                    color: "#7A7264",
                    lineHeight: 1.75,
                  }}
                >
                  n8n workflows. Next.js apps. WhatsApp and voice bots that
                  qualify and book. AEO structures that make search engines cite
                  you first. The tools shift; the obsession stays the same.
                </motion.p>
              </div>

              {/* Film strip of three stacked stills */}
              <div style={{ display: "flex", gap: "2px" }}>
                <Sprockets count={8} />
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  {[
                    {
                      src: IMAGES.reel01b,
                      alt: "Bali terrace with laptop and latte, palm fronds overhead",
                    },
                    {
                      src: IMAGES.reel01c,
                      alt: "Night cafe, backlit keyboard glow, deep focus",
                    },
                    {
                      src: IMAGES.rooftop,
                      alt: "Night rooftop cafe, city lights, phone in hand",
                    },
                  ].map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.97 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: i * 0.12, duration: 0.6 }}
                      style={{ overflow: "hidden", aspectRatio: "16/9" }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "sepia(0.2) contrast(1.05) saturate(0.88)",
                          display: "block",
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
                <Sprockets count={8} />
              </div>
            </div>
          </section>

          {/* ── SERVICES ── */}
          <section
            aria-label="Services"
            style={{
              padding: "0 clamp(20px, 6vw, 80px) 80px",
            }}
          >
            <div style={{ maxWidth: "1100px" }}>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px",
                  color: "#7A7264",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                What I build
              </div>
              <div
                style={{ borderBottom: "1px solid rgba(122,114,100,0.2)" }}
              />

              <ServiceRow
                index="01"
                title="AI Automation Workflows"
                description="n8n pipelines that replace repetitive ops: lead capture, follow-up sequences, CRM sync, invoice handling — without hiring another VA."
                tag="n8n / automation"
              />
              <ServiceRow
                index="02"
                title="WhatsApp & Voice Bots"
                description="24/7 qualification bots that ask the right questions, book the call, and hand off to your CRM before you've had your coffee."
                tag="bots / messaging"
              />
              <ServiceRow
                index="03"
                title="AEO Content Architecture"
                description="Structured content that earns citations in AI search. When someone asks your niche question, your answer appears — not a competitor's."
                tag="AEO / search"
              />
              <ServiceRow
                index="04"
                title="Next.js Builds"
                description="Fast, SEO-ready web apps: landing pages, client portals, internal dashboards. Shipped to production, not staging."
                tag="next.js / web"
              />
              <ServiceRow
                index="05"
                title="System Audits"
                description="I map your current stack, find what's costing you hours each week, and deliver a prioritised kill-list with implementation notes."
                tag="consulting"
              />
            </div>
          </section>

          {/* ── FULL-BLEED STILL ── */}
          <FilmStill
            src={IMAGES.bali}
            alt="Waseem arms spread wide on Nusa Penida cliffs, Bali — freedom after shipping"
            caption="NUSA PENIDA, BALI — POST-SHIP FRIDAY"
            height="65vh"
            objectPosition="center 40%"
          />

          {/* ─────────────────────────────────
              REEL 02 — THE FIELD
          ───────────────────────────────── */}
          <section
            aria-label="Reel 02 - The Field"
            style={{
              padding: "80px clamp(20px, 6vw, 80px)",
            }}
          >
            <ReelLabel n="02" label="The Field" />

            <div
              className="reel-strip"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "2px",
                marginBottom: "60px",
              }}
            >
              {[
                {
                  src: IMAGES.reel02a,
                  alt: "Night coworking team with laptops, selfie mode",
                  label: "BUILDS HAPPEN IN COMMUNITY",
                },
                {
                  src: IMAGES.reel02b,
                  alt: "Bali rice terrace, phone and powerbank — remote work at altitude",
                  label: "RICE TERRACE → SLACK",
                },
                {
                  src: IMAGES.reel02c,
                  alt: "Rooftop cafe, dragonfruit smoothie and laptop, smiling",
                  label: "THIS IS THE OFFICE",
                },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1, duration: 0.65 }}
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{
                      width: "100%",
                      aspectRatio: "4/5",
                      objectFit: "cover",
                      display: "block",
                      filter: "sepia(0.18) contrast(1.06) saturate(0.85)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "32px 12px 12px",
                      background:
                        "linear-gradient(to top, rgba(17,16,13,0.82), transparent)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "9px",
                        color: "#F2EDE3",
                        letterSpacing: "0.14em",
                        opacity: 0.75,
                      }}
                    >
                      {img.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Voice section */}
            <div
              style={{
                maxWidth: "720px",
                margin: "0 auto",
                textAlign: "center",
                padding: "20px 0 40px",
              }}
            >
              <motion.blockquote
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(22px, 3.5vw, 36px)",
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: "#F2EDE3",
                  lineHeight: 1.45,
                  marginBottom: "24px",
                  borderLeft: "none",
                  paddingLeft: 0,
                }}
              >
                "The best automation is the one the client doesn't have to think
                about after Monday."
              </motion.blockquote>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  color: "#E8743B",
                  letterSpacing: "0.16em",
                }}
              >
                — W. NASIR, SKYNETLABS
              </motion.p>
            </div>
          </section>

          {/* ── ABOUT SECTION ── */}
          <section
            aria-label="About Waseem Nasir"
            style={{
              padding: "0 clamp(20px, 6vw, 80px) 80px",
            }}
          >
            <div
              className="about-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "60px",
                alignItems: "start",
                maxWidth: "1100px",
              }}
            >
              {/* Portrait with gate-weave */}
              <div
                style={{ width: "clamp(200px, 26vw, 340px)", flexShrink: 0 }}
              >
                <GateWeave>
                  <div style={{ position: "relative" }}>
                    {/* Film sprocket strip */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 8px",
                        background: "#1C1A15",
                        marginBottom: "2px",
                      }}
                    >
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: "12px",
                            height: "8px",
                            border: "1.5px solid #7A7264",
                            borderRadius: "2px",
                            opacity: 0.4,
                          }}
                        />
                      ))}
                    </div>
                    <img
                      src={IMAGES.portrait}
                      alt="Waseem Nasir in black prince coat, balcony rail, sunglasses — SkynetLabs founder"
                      style={{
                        width: "100%",
                        aspectRatio: "9/16",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                        filter: "sepia(0.25) contrast(1.08) saturate(0.82)",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 8px",
                        background: "#1C1A15",
                        marginTop: "2px",
                      }}
                    >
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: "12px",
                            height: "8px",
                            border: "1.5px solid #7A7264",
                            borderRadius: "2px",
                            opacity: 0.4,
                          }}
                        />
                      ))}
                    </div>
                    {/* Light-leak overlay on portrait */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(135deg, rgba(232,116,59,0.18) 0%, transparent 50%)",
                        mixBlendMode: "screen",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </GateWeave>
              </div>

              {/* Bio copy */}
              <div style={{ paddingTop: "8px" }}>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "10px",
                    color: "#E8743B",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: "20px",
                  }}
                >
                  ◼ REEL 03 — THE PERSON
                </div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(26px, 3.5vw, 40px)",
                    fontWeight: 800,
                    color: "#F2EDE3",
                    lineHeight: 1.2,
                    marginBottom: "24px",
                  }}
                >
                  Waseem Nasir
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(14px, 1.5vw, 16px)",
                    color: "#7A7264",
                    lineHeight: 1.75,
                    marginBottom: "20px",
                  }}
                >
                  Independent founder of SkynetLabs. I started building web
                  systems in 2019 and never stopped — not for a startup, not for
                  a salary, not because someone told me to. The obsession was
                  always the thing itself: making software actually work for
                  people who have real problems to solve.
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(14px, 1.5vw, 16px)",
                    color: "#7A7264",
                    lineHeight: 1.75,
                    marginBottom: "32px",
                  }}
                >
                  Currently based between Bali and Lahore. Available for remote
                  engagements globally. I work in short, honest sprints — no
                  bloated retainers, no phantom deliverables.
                </p>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  {[
                    ["n8n", "automation"],
                    ["Next.js", "web"],
                    ["AEO", "search"],
                    ["WhatsApp bots", "conversational"],
                    ["Voice AI", "voice"],
                  ].map(([tool, cat]) => (
                    <div
                      key={tool}
                      style={{
                        padding: "6px 14px",
                        border: "1px solid rgba(122,114,100,0.3)",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "10px",
                        color: "#7A7264",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {tool}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── PHOTO MONTAGE — gear spread ── */}
          <section
            aria-label="Work in progress photos"
            style={{ padding: "0 clamp(20px, 6vw, 80px) 80px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: "2px",
                maxWidth: "1100px",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7 }}
                style={{ overflow: "hidden", gridRow: "span 2" }}
              >
                <img
                  src={IMAGES.meetup}
                  alt="Bali cafe coworking group meetup — builders in the wild"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "sepia(0.18) contrast(1.04) saturate(0.88)",
                    display: "block",
                  }}
                />
              </motion.div>
              {[
                {
                  src: IMAGES.street,
                  alt: "Hilltop view with backpack and sunglasses — city vista",
                },
                {
                  src: IMAGES.guitar,
                  alt: "Acoustic guitar at white cafe — creative pause",
                },
                {
                  src: IMAGES.closeup,
                  alt: "Waseem in black kurta, warm wood interior, soft smile",
                },
                {
                  src: IMAGES.reel02b,
                  alt: "Rice terrace with phone and powerbank, focused",
                },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  style={{ overflow: "hidden", aspectRatio: "1/1" }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "sepia(0.2) contrast(1.05) saturate(0.85)",
                      display: "block",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── CTA SECTION ── */}
          <section
            aria-label="Book a call"
            style={{
              padding: "0 clamp(20px, 6vw, 80px) 0",
            }}
          >
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src={IMAGES.reel02a}
                alt="Night coworking energy — the kind of focus that ships products"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter:
                    "sepia(0.25) contrast(1.1) saturate(0.7) brightness(0.35)",
                  display: "block",
                }}
              />
              {/* Warm leak over CTA */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 70% 100% at 0% 50%, rgba(232,116,59,0.25) 0%, transparent 70%)",
                  mixBlendMode: "screen",
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  padding: "100px clamp(20px, 8vw, 100px)",
                  textAlign: "center",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "10px",
                      color: "#E8743B",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      marginBottom: "24px",
                    }}
                  >
                    ◼ REEL 04 — THE CALL
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(30px, 5vw, 60px)",
                      fontWeight: 800,
                      color: "#F2EDE3",
                      lineHeight: 1.15,
                      marginBottom: "20px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Thirty minutes.
                    <br />
                    <em style={{ color: "#E8743B", fontStyle: "italic" }}>
                      Permanent results.
                    </em>
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(14px, 1.5vw, 17px)",
                      color: "#B8B0A4",
                      maxWidth: "480px",
                      margin: "0 auto 40px",
                      lineHeight: 1.65,
                    }}
                  >
                    We'll map your biggest manual bottleneck and I'll tell you
                    exactly what to automate first. No pitch deck. No upsell
                    theatre.
                  </p>
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    className="cta-btn"
                    style={{ fontSize: "13px", padding: "16px 48px" }}
                    aria-label="Book a free 30-minute discovery call"
                  >
                    Book your 30-min call
                  </a>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        {/* ════════════════════════════════════
            FOOTER
        ════════════════════════════════════ */}
        <footer
          role="contentinfo"
          style={{
            padding: "60px clamp(20px, 6vw, 80px) 40px",
            borderTop: "1px solid rgba(122,114,100,0.2)",
            marginTop: "80px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "32px",
              maxWidth: "1100px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#F2EDE3",
                  marginBottom: "8px",
                }}
              >
                Waseem Nasir
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px",
                  color: "#7A7264",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                SkynetLabs — AI + Automation — Since 2019
              </div>
            </div>

            <nav
              aria-label="Footer navigation"
              style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}
            >
              {[
                {
                  label: "Discovery Call",
                  href: "https://skynetjoe.com/discovery-call",
                },
                { label: "SkynetLabs", href: "https://skynetjoe.com" },
                { label: "GitHub", href: "https://github.com/waseemnasir2k26" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "10px",
                    color: "#7A7264",
                    textDecoration: "none",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#E8743B";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#7A7264";
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Film strip decoration */}
              <div aria-hidden="true" style={{ display: "flex", gap: "3px" }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "10px",
                      height: "7px",
                      border: "1px solid #7A7264",
                      borderRadius: "1px",
                      opacity: 0.25,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px",
                  color: "#7A7264",
                  letterSpacing: "0.1em",
                  opacity: 0.5,
                }}
              >
                16mm / 2019—
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
