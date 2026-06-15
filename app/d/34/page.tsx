"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";

/* ─── DUST PARTICLE ─────────────────────────────────────────── */
interface DustParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
}

function useDustParticles(count: number): DustParticle[] {
  const [particles, setParticles] = useState<DustParticle[]>([]);
  useEffect(() => {
    const p: DustParticle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      dur: 8 + Math.random() * 14,
      delay: Math.random() * -20,
      drift: (Math.random() - 0.5) * 40,
    }));
    setParticles(p);
  }, [count]);
  return particles;
}

/* ─── EMBER HEADLINE ─────────────────────────────────────────── */
function EmberHeadline({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className={`ember-wrap ${className}`} aria-label={children}>
      {children.split("").map((char, i) => (
        <motion.span
          key={i}
          className="ember-char"
          initial={
            reduced ? {} : { color: "#6B6358", clipPath: "inset(0 100% 0 0)" }
          }
          animate={
            isInView && !reduced
              ? {
                  color: ["#6B6358", "#FF4D1C", "#E7E2DA"],
                  clipPath: "inset(0 0% 0 0)",
                }
              : {}
          }
          transition={{
            duration: 0.9,
            delay: i * 0.025,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-hidden="true"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </div>
  );
}

/* ─── HAIRLINE ───────────────────────────────────────────────── */
function Hairline({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={`hairline ${className}`}
      initial={reduced ? {} : { scaleX: 0, transformOrigin: "left" }}
      animate={isInView && !reduced ? { scaleX: 1 } : {}}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/* ─── COUNT-UP ───────────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isInView || reduced) {
      setVal(to);
      return;
    }
    let start = 0;
    const step = to / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setVal(to);
        clearInterval(timer);
      } else setVal(Math.floor(start));
    }, 28);
    return () => clearInterval(timer);
  }, [isInView, to, reduced]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ─── SLAB IMAGE ─────────────────────────────────────────────── */
function SlabImage({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className="slab-img-wrap"
      initial={reduced ? {} : { opacity: 0, y: 40 }}
      animate={isInView && !reduced ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <img src={src} alt={alt} className="slab-img" />
      <div className="img-grain" />
    </motion.div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function AshenDust() {
  const reduced = useReducedMotion();
  const dust = useDustParticles(reduced ? 0 : 55);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const grainOpacity = useTransform(scrollYProgress, [0, 1], [0.18, 0.28]);

  const services = [
    {
      num: "01",
      title: "AI AUTOMATION",
      body: "n8n pipelines. Dead tasks buried. Revenue loops sealed.",
    },
    {
      num: "02",
      title: "WHATSAPP / VOICE BOTS",
      body: "Missed leads cost money. Bots answer 24/7. You sleep.",
    },
    {
      num: "03",
      title: "AEO + NEXT.JS BUILDS",
      body: "Sites that rank in AI answers. Code that ships product.",
    },
    {
      num: "04",
      title: "SYSTEM ARCHITECTURE",
      body: "No bloat. No theatre. End-to-end ops rebuilt from scratch.",
    },
  ];

  const workItems = [
    {
      label: "AI RECEPTIONIST",
      tag: "Voice + WhatsApp",
      img: "/img/pro/WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    },
    {
      label: "FREIGHT OPS SKIN",
      tag: "Meta Ads + Automation",
      img: "/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    },
    {
      label: "AEO ENGINE v0.7",
      tag: "Next.js + Citation Layer",
      img: "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    },
    {
      label: "INSPIRE HEALTH PT",
      tag: "$27 Funnel + WP Build",
      img: "/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
    },
    {
      label: "TAKYCORP OUTREACH",
      tag: "Email Automation",
      img: "/img/pro/CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    },
    {
      label: "GIGSIGNAL CHROME EXT",
      tag: "Scraper + Public Deploy",
      img: "/img/pro/WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');

        .root-34 {
          background: #121110;
          color: #E7E2DA;
          font-family: 'Space Grotesk', sans-serif;
          min-height: 100vh;
          position: relative;
          z-index: 2;
          overflow-x: hidden;
        }

        /* GRAIN OVERLAY */
        .root-34 .grain-layer {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 100;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
          mix-blend-mode: multiply;
        }

        /* DUST PARTICLES */
        .root-34 .dust-canvas {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 3;
          overflow: hidden;
        }
        .root-34 .dust-particle {
          position: absolute;
          border-radius: 50%;
          background: #8C8275;
          opacity: 0;
          animation: dustDrift var(--dur) var(--delay) infinite linear;
        }
        @keyframes dustDrift {
          0%   { opacity: 0;    transform: translate(0, 0) scale(0.6); }
          15%  { opacity: 0.35; }
          85%  { opacity: 0.18; }
          100% { opacity: 0;    transform: translate(var(--drift), -60px) scale(1.2); }
        }

        /* TYPOGRAPHY */
        .root-34 .display-anton {
          font-family: 'Anton', sans-serif;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 0.92;
        }
        .root-34 .mono {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* EMBER HEADLINE */
        .root-34 .ember-wrap { display: block; }
        .root-34 .ember-char {
          display: inline;
          will-change: color, clip-path;
        }

        /* HAIRLINE */
        .root-34 .hairline {
          width: 100%;
          height: 1px;
          background: #6B6358;
          margin: 0;
        }

        /* NAV */
        .root-34 .nav-34 {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          border-bottom: 1px solid #1E1B19;
          background: rgba(18,17,16,0.92);
          backdrop-filter: blur(8px);
        }
        .root-34 .nav-logo {
          font-family: 'Anton', sans-serif;
          font-size: 1.1rem;
          letter-spacing: 0.08em;
          color: #E7E2DA;
          text-decoration: none;
        }
        .root-34 .nav-logo span { color: #FF4D1C; }
        .root-34 .nav-cta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #121110;
          background: #FF4D1C;
          padding: 0.55rem 1.1rem;
          text-decoration: none;
          transition: background 0.2s;
        }
        .root-34 .nav-cta:hover { background: #E7E2DA; }
        .root-34 .nav-cta:focus-visible { outline: 2px solid #FF4D1C; outline-offset: 3px; }

        /* HERO */
        .root-34 .hero-34 {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 2rem 4rem;
          padding-top: 6rem;
          position: relative;
          background: #121110;
        }
        .root-34 .hero-bg-img {
          position: absolute;
          inset: 0;
          object-fit: cover;
          width: 100%;
          height: 100%;
          opacity: 0.18;
          mix-blend-mode: luminosity;
        }
        .root-34 .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #121110 38%, transparent 100%);
        }
        .root-34 .hero-content { position: relative; z-index: 2; max-width: 1400px; }
        .root-34 .hero-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FF4D1C;
          margin-bottom: 1.5rem;
        }
        .root-34 .hero-h1 {
          font-family: 'Anton', sans-serif;
          font-size: clamp(3.5rem, 9vw, 10rem);
          text-transform: uppercase;
          line-height: 0.90;
          letter-spacing: -0.01em;
          margin-bottom: 2rem;
        }
        .root-34 .hero-subhead {
          font-size: clamp(0.85rem, 1.4vw, 1.05rem);
          color: #8C8275;
          max-width: 520px;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }
        .root-34 .hero-cta {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #121110;
          background: #FF4D1C;
          padding: 1rem 2.2rem;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .root-34 .hero-cta:hover { background: #E7E2DA; }
        .root-34 .hero-cta:focus-visible { outline: 2px solid #FF4D1C; outline-offset: 3px; }

        /* NUMBERS */
        .root-34 .numbers-section {
          background: #1E1B19;
          padding: 5rem 2rem;
        }
        .root-34 .numbers-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .root-34 .num-block {
          padding: 2rem;
          border-right: 1px solid #6B6358;
        }
        .root-34 .num-block:last-child { border-right: none; }
        .root-34 .num-val {
          font-family: 'Anton', sans-serif;
          font-size: clamp(2.8rem, 5vw, 5.5rem);
          color: #FF4D1C;
          line-height: 1;
          display: block;
          margin-bottom: 0.4rem;
        }
        .root-34 .num-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6B6358;
        }

        /* MANIFESTO SLAB */
        .root-34 .manifesto-slab {
          padding: 6rem 2rem;
          background: #121110;
          max-width: 1000px;
          margin: 0 auto;
        }
        .root-34 .manifesto-line {
          font-family: 'Anton', sans-serif;
          font-size: clamp(2rem, 5vw, 5rem);
          text-transform: uppercase;
          line-height: 1.0;
          color: #E7E2DA;
          display: block;
          margin-bottom: 0.15em;
        }
        .root-34 .manifesto-line.ember { color: #FF4D1C; }
        .root-34 .manifesto-line.muted { color: #6B6358; }

        /* FULL-BLEED PHOTO */
        .root-34 .full-bleed {
          width: 100%;
          height: 55vh;
          min-height: 320px;
          object-fit: cover;
          display: block;
          filter: grayscale(40%) contrast(1.1);
        }
        .root-34 .full-bleed-wrap {
          position: relative;
          overflow: hidden;
        }
        .root-34 .full-bleed-caption {
          position: absolute;
          bottom: 1.5rem;
          right: 1.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #E7E2DA;
          opacity: 0.5;
        }

        /* SERVICES */
        .root-34 .services-section {
          background: #121110;
          padding: 6rem 2rem;
        }
        .root-34 .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FF4D1C;
          margin-bottom: 3rem;
        }
        .root-34 .service-row {
          display: grid;
          grid-template-columns: 80px 1fr 1fr;
          gap: 1.5rem 2rem;
          align-items: start;
          padding: 2.2rem 0;
          max-width: 1200px;
          margin: 0 auto;
          cursor: default;
        }
        .root-34 .service-row:hover .svc-num { color: #FF4D1C; }
        .root-34 .svc-num {
          font-family: 'Anton', sans-serif;
          font-size: 1.1rem;
          color: #6B6358;
          transition: color 0.25s;
          padding-top: 0.2rem;
        }
        .root-34 .svc-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(1.4rem, 2.5vw, 2.2rem);
          text-transform: uppercase;
          line-height: 1.0;
          letter-spacing: 0.01em;
        }
        .root-34 .svc-body {
          font-size: 0.88rem;
          color: #8C8275;
          line-height: 1.65;
        }

        /* WORK GRID */
        .root-34 .work-section {
          background: #1E1B19;
          padding: 6rem 2rem;
        }
        .root-34 .work-grid {
          max-width: 1400px;
          margin: 3rem auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #6B6358;
        }
        .root-34 .work-card {
          background: #121110;
          position: relative;
          overflow: hidden;
          aspect-ratio: 4/3;
        }
        .root-34 .slab-img-wrap {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .root-34 .slab-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(60%) contrast(1.1);
          transition: filter 0.4s, transform 0.5s;
          display: block;
        }
        .root-34 .work-card:hover .slab-img {
          filter: grayscale(0%) contrast(1.05);
          transform: scale(1.03);
        }
        .root-34 .img-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E");
          mix-blend-mode: multiply;
          pointer-events: none;
        }
        .root-34 .work-card-label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(18,17,16,0.95) 50%, transparent);
          padding: 2.5rem 1.2rem 1.2rem;
          z-index: 2;
        }
        .root-34 .wc-title {
          font-family: 'Anton', sans-serif;
          font-size: 1.05rem;
          text-transform: uppercase;
          color: #E7E2DA;
          letter-spacing: 0.02em;
          margin-bottom: 0.2rem;
        }
        .root-34 .wc-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #FF4D1C;
        }

        /* ABOUT */
        .root-34 .about-section {
          background: #121110;
          padding: 6rem 2rem;
        }
        .root-34 .about-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .root-34 .about-img-wrap {
          position: relative;
          overflow: hidden;
        }
        .root-34 .about-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          filter: grayscale(30%) contrast(1.1);
          display: block;
        }
        .root-34 .about-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,77,28,0.12) 0%, transparent 60%);
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .root-34 .about-h2 {
          font-family: 'Anton', sans-serif;
          font-size: clamp(2rem, 4vw, 4rem);
          text-transform: uppercase;
          line-height: 0.95;
          margin-bottom: 2rem;
        }
        .root-34 .about-text {
          font-size: 0.92rem;
          color: #8C8275;
          line-height: 1.75;
          margin-bottom: 1.4rem;
        }
        .root-34 .about-text strong { color: #E7E2DA; font-weight: 500; }
        .root-34 .about-links {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }
        .root-34 .about-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #FF4D1C;
          text-decoration: none;
          border-bottom: 1px solid #FF4D1C;
          padding-bottom: 0.15rem;
          transition: color 0.2s, border-color 0.2s;
        }
        .root-34 .about-link:hover { color: #E7E2DA; border-color: #E7E2DA; }
        .root-34 .about-link:focus-visible { outline: 2px solid #FF4D1C; outline-offset: 3px; }

        /* PHOTO STRIP */
        .root-34 .photo-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: #6B6358;
        }
        .root-34 .strip-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          display: block;
          filter: grayscale(50%) contrast(1.1);
          transition: filter 0.3s;
        }
        .root-34 .strip-img:hover { filter: grayscale(0%) contrast(1.05); }

        /* CTA BLOCK */
        .root-34 .cta-section {
          background: #1E1B19;
          padding: 8rem 2rem;
          text-align: center;
        }
        .root-34 .cta-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6B6358;
          margin-bottom: 2rem;
        }
        .root-34 .cta-h2 {
          font-family: 'Anton', sans-serif;
          font-size: clamp(2.5rem, 7vw, 8rem);
          text-transform: uppercase;
          line-height: 0.92;
          letter-spacing: -0.01em;
          margin-bottom: 3rem;
          color: #E7E2DA;
        }
        .root-34 .cta-h2 span { color: #FF4D1C; }
        .root-34 .cta-btn {
          display: inline-block;
          font-family: 'Anton', sans-serif;
          font-size: 1.1rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #121110;
          background: #FF4D1C;
          padding: 1.2rem 3.5rem;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .root-34 .cta-btn:hover { background: #E7E2DA; }
        .root-34 .cta-btn:focus-visible { outline: 2px solid #E7E2DA; outline-offset: 4px; }
        .root-34 .cta-sub {
          margin-top: 1.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6B6358;
        }

        /* FOOTER */
        .root-34 .footer-34 {
          background: #121110;
          border-top: 1px solid #1E1B19;
          padding: 2.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .root-34 .footer-logo {
          font-family: 'Anton', sans-serif;
          font-size: 0.95rem;
          letter-spacing: 0.08em;
          color: #6B6358;
        }
        .root-34 .footer-logo span { color: #FF4D1C; }
        .root-34 .footer-copy {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6B6358;
        }
        .root-34 .footer-gh {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6B6358;
          text-decoration: none;
          transition: color 0.2s;
        }
        .root-34 .footer-gh:hover { color: #FF4D1C; }
        .root-34 .footer-gh:focus-visible { outline: 2px solid #FF4D1C; outline-offset: 3px; }

        /* SKIP LINK */
        .root-34 .skip-link {
          position: absolute;
          top: -100px;
          left: 1rem;
          background: #FF4D1C;
          color: #121110;
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
          text-decoration: none;
          z-index: 200;
          transition: top 0.1s;
        }
        .root-34 .skip-link:focus { top: 1rem; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .root-34 .numbers-grid { grid-template-columns: repeat(2, 1fr); }
          .root-34 .num-block:nth-child(2) { border-right: none; }
          .root-34 .num-block { border-bottom: 1px solid #6B6358; }
          .root-34 .num-block:nth-child(3), .root-34 .num-block:nth-child(4) { border-bottom: none; }
          .root-34 .service-row { grid-template-columns: 50px 1fr; }
          .root-34 .svc-body { grid-column: 2 / -1; }
          .root-34 .work-grid { grid-template-columns: repeat(2, 1fr); }
          .root-34 .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .root-34 .photo-strip { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .root-34 .work-grid { grid-template-columns: 1fr; }
          .root-34 .photo-strip { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="root-34" ref={containerRef}>
        {/* SKIP LINK */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        {/* GRAIN */}
        <motion.div
          className="grain-layer"
          style={{ opacity: grainOpacity }}
          aria-hidden="true"
        />

        {/* DUST PARTICLES */}
        <div className="dust-canvas" aria-hidden="true">
          {dust.map((p) => (
            <div
              key={p.id}
              className="dust-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                ["--dur" as string]: `${p.dur}s`,
                ["--delay" as string]: `${p.delay}s`,
                ["--drift" as string]: `${p.drift}px`,
              }}
            />
          ))}
        </div>

        {/* NAV */}
        <nav className="nav-34" aria-label="Primary navigation">
          <a href="/" className="nav-logo">
            WASEEM<span>.</span>
          </a>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="nav-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a Call
          </a>
        </nav>

        {/* HERO */}
        <main id="main-content">
          <section className="hero-34" aria-labelledby="hero-heading">
            <img
              src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
              alt=""
              className="hero-bg-img"
              aria-hidden="true"
            />
            <div className="hero-overlay" aria-hidden="true" />
            <div className="hero-content">
              <p className="hero-label">
                Waseem Nasir / SkynetLabs / Since 2019
              </p>
              <h1 id="hero-heading" className="hero-h1">
                <EmberHeadline>Most automation</EmberHeadline>
                <EmberHeadline>is theatre.</EmberHeadline>
                <motion.span
                  style={{
                    display: "block",
                    color: "#FF4D1C",
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "inherit",
                    lineHeight: "inherit",
                    textTransform: "uppercase",
                  }}
                  initial={reduced ? {} : { opacity: 0, x: -30 }}
                  animate={reduced ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 1.4 }}
                >
                  Mine ships revenue.
                </motion.span>
              </h1>
              <p className="hero-subhead">
                180+ builds. 40+ clients. 9 countries. Burning since 2019.
              </p>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="hero-cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book 30 min &rarr;
              </a>
            </div>
          </section>

          <Hairline />

          {/* NUMBERS */}
          <section className="numbers-section" aria-label="Proof of work">
            <div className="numbers-grid">
              {[
                { val: 180, suffix: "+", label: "Builds Shipped" },
                { val: 40, suffix: "+", label: "Clients Served" },
                { val: 9, suffix: "", label: "Countries Worked" },
                { val: 2019, suffix: "", label: "Operating Since" },
              ].map(({ val, suffix, label }) => (
                <div className="num-block" key={label}>
                  <span className="num-val">
                    <CountUp to={val} suffix={suffix} />
                  </span>
                  <span className="num-label">{label}</span>
                </div>
              ))}
            </div>
          </section>

          <Hairline />

          {/* MANIFESTO SLAB */}
          <section className="manifesto-slab" aria-label="Manifesto">
            <motion.div
              initial={reduced ? {} : { opacity: 0, y: 30 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="manifesto-line muted">
                Leads don&apos;t wait.
              </span>
              <span className="manifesto-line">
                Your pipeline shouldn&apos;t either.
              </span>
              <span className="manifesto-line ember">Kill the busywork.</span>
              <span className="manifesto-line muted">Ship the machine.</span>
            </motion.div>
          </section>

          {/* FULL-BLEED PHOTO 1 */}
          <div className="full-bleed-wrap">
            <img
              src="/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg"
              alt="Waseem working on a rooftop cafe with mountain view"
              className="full-bleed"
            />
            <span className="full-bleed-caption">Bali / Lahore / Wherever</span>
          </div>

          <Hairline />

          {/* SERVICES */}
          <section
            className="services-section"
            aria-labelledby="services-heading"
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <p className="section-label" id="services-heading">
                What I Build
              </p>
            </div>
            {services.map((s, i) => (
              <motion.div
                key={s.num}
                className="service-row"
                initial={reduced ? {} : { opacity: 0, x: -20 }}
                whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <span className="svc-num">{s.num}</span>
                <h3 className="svc-title">{s.title}</h3>
                <p className="svc-body">{s.body}</p>
                {i < services.length - 1 && (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      height: "1px",
                      background: "#1E1B19",
                      marginTop: "0.5rem",
                    }}
                  />
                )}
              </motion.div>
            ))}
          </section>

          {/* FULL-BLEED PHOTO 2 */}
          <div className="full-bleed-wrap">
            <img
              src="/img/pro/WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg"
              alt="Waseem with clients giving thumbs up at cafe"
              className="full-bleed"
            />
          </div>

          <Hairline />

          {/* SELECTED WORK */}
          <section className="work-section" aria-labelledby="work-heading">
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
              <p className="section-label" id="work-heading">
                Selected Builds
              </p>
            </div>
            <div className="work-grid">
              {workItems.map((w, i) => (
                <div className="work-card" key={w.label}>
                  <SlabImage src={w.img} alt={w.label} index={i} />
                  <div className="work-card-label">
                    <div className="wc-title">{w.label}</div>
                    <div className="wc-tag">{w.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PHOTO STRIP */}
          <div className="photo-strip" role="presentation">
            <img
              src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
              alt="Waseem at balcony in black coat"
              className="strip-img"
            />
            <img
              src="/img/pro/TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg"
              alt="Waseem at hilltop with city view"
              className="strip-img"
            />
            <img
              src="/img/pro/CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg"
              alt="Waseem working at blue hour with coconut"
              className="strip-img"
            />
            <img
              src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
              alt="Waseem arms crossed confident pose"
              className="strip-img"
            />
          </div>

          <Hairline />

          {/* ABOUT */}
          <section className="about-section" aria-labelledby="about-heading">
            <div className="about-grid">
              <div className="about-img-wrap">
                <img
                  src="/img/pro/PORTRAIT-2026-05-18-black-kurta-soft-smile-wood-interior.jpg"
                  alt="Waseem Nasir — founder of SkynetLabs"
                  className="about-img"
                />
                <div className="about-img-overlay" aria-hidden="true" />
              </div>
              <div>
                <h2 className="about-h2" id="about-heading">
                  <EmberHeadline>Built from</EmberHeadline>
                  <EmberHeadline>ash. Runs</EmberHeadline>
                  <EmberHeadline>on output.</EmberHeadline>
                </h2>
                <p className="about-text">
                  I&apos;m <strong>Waseem Nasir</strong>, independent founder of{" "}
                  <strong>SkynetLabs</strong>. I build AI and automation systems
                  that kill busywork — missed leads, dead follow-ups, manual ops
                  nobody should be doing in 2026.
                </p>
                <p className="about-text">
                  Tools of choice:{" "}
                  <strong>n8n, Next.js, WhatsApp / voice bots, AEO</strong>. I
                  work alone, move fast, and ship real systems — not decks, not
                  prototypes.
                </p>
                <p className="about-text">
                  Remote from <strong>Bali and Lahore</strong>. Available for
                  the right brief.
                </p>
                <div className="about-links">
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    className="about-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book a call
                  </a>
                  <a
                    href="https://github.com/waseemnasir2k26"
                    className="about-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://skynetjoe.com"
                    className="about-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SkynetLabs
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* FULL-BLEED PHOTO 3 */}
          <div className="full-bleed-wrap">
            <img
              src="/img/pro/EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg"
              alt="Waseem at Bali coworking group meetup"
              className="full-bleed"
            />
            <span className="full-bleed-caption">
              Bali Coworking Meetup — 2026
            </span>
          </div>

          <Hairline />

          {/* CTA */}
          <section className="cta-section" aria-labelledby="cta-heading">
            <p className="cta-eyebrow">Ready to stop bleeding ops time?</p>
            <h2 className="cta-h2" id="cta-heading">
              <EmberHeadline>Let&apos;s burn</EmberHeadline>
              <EmberHeadline>the bloat.</EmberHeadline>
              <span
                style={{
                  color: "#FF4D1C",
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "inherit",
                  display: "block",
                  lineHeight: "inherit",
                  textTransform: "uppercase",
                }}
              >
                <EmberHeadline>Build the machine.</EmberHeadline>
              </span>
            </h2>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="cta-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book a 30-minute discovery call with Waseem Nasir"
            >
              Book 30 min &rarr;
            </a>
            <p className="cta-sub">
              Free 30-min call. No pitch decks. Just what gets built.
            </p>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="footer-34" aria-label="Footer">
          <span className="footer-logo">
            WASEEM<span>.</span>
          </span>
          <span className="footer-copy">
            SkynetLabs &copy; {new Date().getFullYear()} &mdash; Remote
          </span>
          <a
            href="https://github.com/waseemnasir2k26"
            className="footer-gh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Waseem Nasir on GitHub"
          >
            github.com/waseemnasir2k26
          </a>
        </footer>
      </div>
    </>
  );
}
