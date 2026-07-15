"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
} from "next/font/google";

/* ============================================================
   VARIANT: blueprint
   "Deployment Console" — light Vercel-paper founder site.
   Near-white canvas · smoky jade-teal accent · ink-jade depth band.
   Bricolage Grotesque (display) + Hanken Grotesk (body) + Geist Mono (labels).

   SELF-CONTAINED — touches zero shared files, zero other variants.
   Winner of the 38-agent design research fan-out (avg 83). Real SkynetLabs
   proof rendered as a LIVE/DELIVERED status board. Bespoke signature =
   isometric blueprint node-ribbon threading the section indices.
   ============================================================ */

/* ─── Fonts (self-hosted at build via next/font/google) ─── */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800"],
});
const body = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

/* ─── Tokens ─── */
const C = {
  canvas: "#FBFCFD",
  surface: "#F4F8F7",
  card: "#FFFFFF",
  ink: "#0E1B1A",
  body: "#3C4744",
  mute: "#5B6764",
  hairline: "#E2EAE8",
  accent: "#117E73",
  accentDeep: "#0A3D38",
  accentTint: "#E2F1EE",
  pillInk: "#0C5F57",
  live: "#15A06B",
  onDeep: "#EAF4F1",
};
const SHADOW = {
  sm: "0 1px 2px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
  md: "0 8px 24px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
  lg: "0 24px 48px rgba(8,40,38,0.10), 0 0 0 1px rgba(8,40,38,0.05)",
};
const IMG = (f: string) => `/img/pro/${f}`;
const CTA = "https://skynetjoe.com/discovery-call";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Section index registry (drives the node-ribbon) ─── */
const NODES = [
  { id: "hero", n: "01", label: "INTRO" },
  { id: "trust", n: "02", label: "LIVE" },
  { id: "how", n: "03", label: "BUILD" },
  { id: "stack", n: "04", label: "STACK" },
  { id: "proof", n: "05", label: "PROOF" },
  { id: "about", n: "06", label: "FOUNDER" },
  { id: "gallery", n: "07", label: "GALLERY" },
];

/* ─── Reusable bits ─── */
function Mono({
  children,
  color = C.mute,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`font-mono uppercase ${className}`}
      style={{
        color,
        fontSize: "0.72rem",
        fontWeight: 500,
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </span>
  );
}

function StatusPill({ kind }: { kind: "LIVE" | "DELIVERED" | "SHIPPED" }) {
  const dot = kind === "LIVE" ? C.live : C.accent;
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1"
      style={{ background: C.accentTint }}
    >
      <span
        className={kind === "LIVE" ? "bp-pulse" : ""}
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: dot,
          display: "inline-block",
        }}
        aria-hidden
      />
      <span
        className="font-mono uppercase"
        style={{
          color: C.pillInk,
          fontSize: "0.66rem",
          fontWeight: 500,
          letterSpacing: "0.1em",
        }}
      >
        {kind}
      </span>
    </span>
  );
}

/* Count-up layered on the real final value (static/print/reduced-motion safe) */
function CountUp({
  to,
  suffix = "",
  reduce,
}: {
  to: number;
  suffix?: string;
  reduce: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  // default to the real final value so static/print shows the true number, never 0
  const [val, setVal] = useState(to);
  useEffect(() => {
    if (reduce || !inView) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 800;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* Fade-up wrapper — content always present at rest */
function Reveal({
  children,
  delay = 0,
  y = 20,
  reduce,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  reduce: boolean;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      /* opacity stays 1 at rest so static/print/PDF/screenshot NEVER shows a
         blank band if IntersectionObserver hasn't fired — only position animates.
         (Matches the proven editorial-warm house pattern; the #1 hard rule.) */
      initial={reduce ? false : { opacity: 1, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      className={className}
    >
      {children}
    </M>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function Blueprint() {
  const reduce = !!useReducedMotion();
  return (
    <>
      {/* Scope the document to the light canvas (global body is dark for other variants) */}
      <style>{`
        html, body { background: ${C.canvas} !important; color-scheme: light !important; }
        .bp-root { font-synthesis: none; }
        @keyframes bpPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .bp-pulse { animation: bpPulse 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ .bp-pulse{ animation:none } }
        .bp-link { position: relative; }
        .bp-link::after { content:""; position:absolute; left:0; bottom:-3px; height:1px; width:100%;
          background:${C.accent}; transform:scaleX(0); transform-origin:left; transition:transform .16s ${"ease"}; }
        .bp-link:hover::after { transform:scaleX(1); }
        .bp-tile { transition: transform .22s ease-out, box-shadow .22s ease-out; }
        @media (hover:hover) and (pointer:fine){
          .bp-tile:hover { transform: translateY(-4px) scale(1.015); box-shadow:${SHADOW.md}; }
        }
        .bp-tile:active { transform: scale(0.985); }
        .bp-cta:active { transform: scale(0.97); }
        /* Trust cards: accent left-border + detail reveal on hover */
        @media (hover:hover) and (pointer:fine){
          .bp-trust-card { transition: transform .22s ease-out, box-shadow .22s ease-out, border-left-color .22s ease-out; border-left: 3px solid transparent; }
          .bp-trust-card:hover { transform: translateY(-3px); box-shadow:${SHADOW.md}; border-left-color: ${C.accent}; }
          .bp-trust-mech { opacity: 0; transform: translateY(4px); transition: opacity .2s ease-out, transform .2s ease-out; }
          .bp-trust-card:hover .bp-trust-mech { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce){
          .bp-trust-card { border-left: 3px solid transparent; }
          .bp-trust-mech { opacity: 1; transform: none; }
        }
        /* Proof cards: accent ring glow on metric + view arrow fade */
        @media (hover:hover) and (pointer:fine){
          .bp-proof-card { transition: transform .22s ease-out, box-shadow .22s ease-out; }
          .bp-proof-card:hover { transform: translateY(-4px) scale(1.015); box-shadow:${SHADOW.md}; }
          .bp-proof-metric { transition: text-shadow .22s ease-out; }
          .bp-proof-card:hover .bp-proof-metric { text-shadow: 0 0 28px rgba(17,126,115,0.22); }
          .bp-proof-view { opacity: 0; transform: translateX(-4px); transition: opacity .18s ease-out, transform .18s ease-out; }
          .bp-proof-card:hover .bp-proof-view { opacity: 1; transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce){
          .bp-proof-view { opacity: 1; transform: none; }
        }
        /* Stack tile: n-index accent on hover */
        @media (hover:hover) and (pointer:fine){
          .bp-stack-n { transition: color .18s ease-out; }
          .bp-tile:hover .bp-stack-n { color: ${C.accent} !important; }
        }
        /* About process steps: bp-tile + accent left border */
        @media (hover:hover) and (pointer:fine){
          .bp-process-step { transition: transform .22s ease-out, box-shadow .22s ease-out, border-left-color .2s ease-out; border-left: 3px solid transparent; }
          .bp-process-step:hover { transform: translateY(-3px); box-shadow:${SHADOW.md}; border-left-color: ${C.accent}; }
        }
        @media (prefers-reduced-motion: reduce){
          .bp-process-step { border-left: 3px solid transparent; }
        }
        /* Gallery: scrim + caption reveal on hover */
        @media (hover:hover) and (pointer:fine){
          .bp-gallery-scrim { opacity: 0; transition: opacity .2s ease-out; background: linear-gradient(to top, rgba(14,27,26,0.72) 0%, transparent 55%); position:absolute; inset:0; display:flex; align-items:flex-end; padding:12px; pointer-events:none; }
          .bp-tile:hover .bp-gallery-scrim { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce){
          .bp-gallery-scrim { display: none; }
        }
        /* Node pulse animation for NodeGraph hover */
        @keyframes bpNodePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.18)} }
        @media (prefers-reduced-motion: reduce){ .bp-node-pulse { animation:none !important; } }
        .bp-nav-fb { display: none; }
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .bp-nav-fb { display: block; }
        }
        :focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; border-radius: 4px; }
        /* FAQ chevron: + rotates to × when open */
        .bp-faq-chev { transition: transform .18s ease-out; display:inline-block; }
        .bp-faq[open] .bp-faq-chev { transform: rotate(45deg); }
        @media (prefers-reduced-motion: reduce){ .bp-faq-chev { transition:none; } }
      `}</style>

      <main
        id="main-content"
        className={`bp-root relative ${display.variable} ${body.variable} ${mono.variable}`}
        style={{
          background: C.canvas,
          color: C.body,
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          overflowX: "clip",
        }}
      >
        <NodeRibbon reduce={reduce} />
        <Nav />
        <Hero reduce={reduce} />
        <Trust reduce={reduce} />
        <How reduce={reduce} />
        <Stack reduce={reduce} />
        {/* Proof: pinned scrollytelling deck on desktop w/ motion; classic grid on
            mobile + reduced-motion. id lives on the wrapper so #proof anchors work
            in every mode without duplicate ids. */}
        <div id="proof">
          {reduce ? (
            <Proof reduce={reduce} />
          ) : (
            <>
              <div className="hidden lg:block">
                <ProofPinned reduce={reduce} />
              </div>
              <div className="lg:hidden">
                <Proof reduce={reduce} />
              </div>
            </>
          )}
        </div>
        <NowBuilding reduce={reduce} />
        <About reduce={reduce} />
        <Gallery reduce={reduce} />
        <Faq reduce={reduce} />
        <Convert reduce={reduce} />
        <SiteFooter reduce={reduce} />
        <MobileCTABar />
      </main>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   NODE RIBBON — bespoke signature. Fixed left rail ≥1280px.
   Threads the section indices into one continuous deployment diagram.
   Pure decorative; aria-hidden; static under reduced-motion.
   ────────────────────────────────────────────────────────────── */
function NodeRibbon({ reduce }: { reduce: boolean }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = NODES.map((n) => document.getElementById(n.id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = NODES.findIndex((n) => n.id === e.target.id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 hidden h-screen xl:flex"
      style={{ width: 56 }}
    >
      <div
        className="relative mx-auto flex h-full flex-col items-center justify-center"
        style={{ width: 56 }}
      >
        {/* spine — jade-tinted so the ribbon actually reads */}
        <div
          className="absolute"
          style={{
            top: "11%",
            bottom: "11%",
            width: 2,
            background: `linear-gradient(${C.accentTint}, ${C.hairline})`,
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: 2,
          }}
        />
        <div
          className="relative flex flex-col items-center justify-between"
          style={{ height: "78%" }}
        >
          {NODES.map((node, i) => {
            const on = i <= active;
            const isActive = i === active;
            const isProof = node.id === "proof";
            const filled = isProof ? C.accentDeep : on ? C.accent : "#FFFFFF";
            return (
              <div
                key={node.id}
                className="relative flex items-center justify-center"
              >
                {/* index + (active) label, right-aligned off the rail */}
                <span
                  className="font-mono"
                  style={{
                    /* anchored to the RIGHT of the node so index + active label
                       grow into the page gutter, never clip off the left edge */
                    position: "absolute",
                    left: 22,
                    textAlign: "left",
                    fontSize: "0.62rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    color: on ? C.accent : C.mute,
                    opacity: on ? 1 : 0.45,
                    transition: reduce ? undefined : "color .3s, opacity .3s",
                    whiteSpace: "nowrap",
                    lineHeight: 1.1,
                  }}
                >
                  {node.n}
                  {isActive && (
                    <span style={{ color: C.pillInk, marginLeft: 6 }}>
                      {node.label}
                    </span>
                  )}
                </span>
                <span
                  style={{
                    width: isProof ? 15 : isActive ? 13 : 9,
                    height: isProof ? 15 : isActive ? 13 : 9,
                    borderRadius: 999,
                    background: filled,
                    border: `1.5px solid ${on || isProof ? C.accent : C.hairline}`,
                    boxShadow: isActive ? `0 0 0 5px ${C.accentTint}` : "none",
                    transition: reduce ? undefined : "all .35s ease",
                    transform: "rotate(45deg)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   NAV — only glass surface; opaque fallback; CTA always present
   ────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className="fixed inset-x-0 top-0 z-40"
      style={{
        height: 64,
        background: "rgba(251,252,253,0.72)",
        backdropFilter: "blur(16px) saturate(170%)",
        WebkitBackdropFilter: "blur(16px) saturate(170%)",
        borderBottom: `1px solid ${scrolled ? C.hairline : "transparent"}`,
        boxShadow: scrolled ? SHADOW.sm : "none",
        transition: "border-color .25s, box-shadow .25s",
      }}
    >
      {/* opaque fallback — shown ONLY where backdrop-filter is unsupported (see bp-nav-fb CSS) */}
      <div
        aria-hidden
        className="bp-nav-fb absolute inset-0 -z-10"
        style={{ background: C.canvas }}
      />
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-5 sm:px-6">
        <a href="#hero" className="flex flex-col leading-none">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1rem",
              color: C.ink,
              letterSpacing: "-0.01em",
            }}
          >
            Waseem Nasir
          </span>
          <span
            className="font-mono"
            style={{
              color: C.mute,
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              marginTop: 3,
            }}
          >
            FOUNDER · SKYNETLABS
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {(
            [
              ["#how", "Work"],
              ["#proof", "Proof"],
              ["/blog", "Blog"],
              ["#about", "About"],
            ] as [string, string][]
          ).map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="bp-link font-medium"
              style={{ color: C.body, fontSize: "0.92rem" }}
            >
              {label}
            </a>
          ))}
        </nav>
        <Link
          href={CTA}
          target="_blank"
          rel="noopener noreferrer"
          className="bp-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
          style={{
            background: C.accent,
            color: "#fff",
            fontSize: "0.85rem",
            padding: "0.5rem 1.1rem",
            boxShadow: SHADOW.sm,
          }}
        >
          Book a call
        </Link>
      </div>
    </header>
  );
}

/* ──────────────────────────────────────────────────────────────
   HERO — asymmetric 7/5; flat near-white (no AI mesh); founder-at-work photo
   ────────────────────────────────────────────────────────────── */
function Hero({ reduce }: { reduce: boolean }) {
  const stagger = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, ease: EASE, delay: 0.08 * i },
        };
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ paddingTop: 64 }}
    >
      {/* single, restrained light wash confined to upper-right — not a neon gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "60%",
          background:
            "radial-gradient(60% 80% at 78% 8%, rgba(17,126,115,0.07), transparent 60%), radial-gradient(40% 60% at 20% 0%, rgba(226,241,238,0.6), transparent 65%)",
        }}
      />
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-10">
        {/* copy */}
        <div className="lg:col-span-7">
          <motion.div {...stagger(0)} className="mb-5">
            <Mono color={C.accent}>
              AI automation that pays for itself · for service businesses &amp;
              stores
            </Mono>
          </motion.div>
          <motion.h1
            {...stagger(1)}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.75rem, 6vw, 4.75rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.028em",
              color: C.ink,
              maxWidth: "16ch",
            }}
          >
            Every hour your team works by hand, your business leaks money.
          </motion.h1>
          <motion.p
            {...stagger(2)}
            className="mt-6"
            style={{
              fontSize: "clamp(1.0625rem,1.4vw,1.1875rem)",
              lineHeight: 1.62,
              color: C.body,
              maxWidth: "54ch",
            }}
          >
            Leads ghost. Follow-ups slip. Your team drowns in repetitive ops.
            I&apos;m Waseem Nasir, founder of SkynetLabs — I find exactly where
            your business bleeds time and money, then build the systems that
            stop it. Already running for Takycorp, idea-viaggi, Christelle, and
            a Lahore dental practice.
          </motion.p>
          <motion.div
            {...stagger(3)}
            className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
          >
            <Link
              href={CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="bp-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
              style={{
                background: C.accent,
                color: "#fff",
                fontSize: "0.95rem",
                padding: "0.8rem 1.6rem",
                boxShadow: SHADOW.md,
              }}
            >
              Book a free audit
            </Link>
            <a
              href="#proof"
              className="bp-link font-semibold"
              style={{ color: C.accent, fontSize: "0.95rem" }}
            >
              See the work ↓
            </a>
          </motion.div>
          <motion.div
            {...stagger(4)}
            className="mt-10 flex flex-wrap items-center gap-2.5"
          >
            {[
              "Shipped in ~14 days",
              "Pays for itself",
              "4 systems in production",
              "Top Rated on Fiverr",
            ].map((c) => (
              <span
                key={c}
                className="font-mono uppercase"
                style={{
                  color: C.mute,
                  background: C.card,
                  border: `1px solid ${C.hairline}`,
                  fontSize: "0.66rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  padding: "0.4rem 0.7rem",
                  borderRadius: 999,
                }}
              >
                {c}
              </span>
            ))}
          </motion.div>
          {/* Stat strip — approved numbers only (brand-messaging §7) */}
          <motion.div
            {...stagger(5)}
            className="mt-5 flex flex-wrap items-center gap-1.5"
            aria-label="By the numbers"
          >
            <span
              className="font-mono"
              style={{
                color: C.pillInk,
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
              }}
            >
              180+ workflows · 40+ sites · 9 countries · since 2019
            </span>
          </motion.div>
        </div>

        {/* photo card */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <figure
            className="relative overflow-hidden"
            style={{
              borderRadius: 20,
              border: `1px solid ${C.hairline}`,
              boxShadow: SHADOW.lg,
              background: C.card,
            }}
          >
            <div className="relative" style={{ aspectRatio: "4/5" }}>
              <Image
                src={IMG(
                  "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
                )}
                alt="Waseem Nasir — confident founder portrait, arms crossed in sunglasses"
                fill
                priority
                sizes="(max-width:1024px) 90vw, 40vw"
                className="object-cover"
                style={{ filter: "saturate(0.94) contrast(1.02)" }}
              />
            </div>
            <figcaption
              className="flex items-center gap-2 border-t px-4 py-3"
              style={{ borderColor: C.hairline, background: C.card }}
            >
              <span
                className="bp-pulse"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: C.live,
                }}
                aria-hidden
              />
              <Mono color={C.pillInk}>
                In production · live for real clients
              </Mono>
            </figcaption>
          </figure>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   TRUST — honest scale anchor; 4 real clients as a status row
   ────────────────────────────────────────────────────────────── */
const CLIENTS = [
  {
    name: "Takycorp",
    sub: "Inbox, auto-handled",
    mech: "n8n · Gmail triage · auto-reply",
    status: "LIVE" as const,
  },
  {
    name: "idea-viaggi / KODIASIMMO",
    sub: "Per-customer access",
    mech: "WordPress · per-user trip gate",
    status: "DELIVERED" as const,
  },
  {
    name: "Christelle",
    sub: "Care intake, automated",
    mech: "WhatsApp · intake flow · 24/7",
    status: "LIVE" as const,
  },
  {
    name: "Lahore dental practice",
    sub: "Front desk, automated",
    mech: "Booking · reminders · auto-reply",
    status: "SHIPPED" as const,
  },
];
function Trust({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="trust"
      style={{
        background: C.surface,
        borderTop: `1px solid ${C.hairline}`,
        borderBottom: `1px solid ${C.hairline}`,
      }}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-20">
        <Reveal
          reduce={reduce}
          className="mb-10 flex flex-wrap items-center justify-between gap-4"
        >
          <Mono color={C.mute}>
            Shipped &amp; live in production — travel · dental · care
          </Mono>
          {/* Top Rated Seller credential — owner-confirmed, SkynetJoe LLC agency */}
          <a
            href="https://www.fiverr.com/agencies/skynetjoellc"
            target="_blank"
            rel="noopener noreferrer"
            className="bp-link inline-flex items-center gap-2"
            style={{ color: C.accent, fontSize: "0.78rem", fontWeight: 600 }}
          >
            <span
              style={{
                background: C.accentTint,
                border: `1px solid rgba(17,126,115,0.25)`,
                borderRadius: 999,
                padding: "0.3rem 0.75rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: C.pillInk,
                textTransform: "uppercase",
              }}
            >
              Top Rated Seller · Fiverr
            </span>
          </a>
        </Reveal>
        <div
          className="grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4"
          style={{
            background: C.hairline,
            borderRadius: 14,
            border: `1px solid ${C.hairline}`,
          }}
        >
          {CLIENTS.map((c, i) => (
            <Reveal as="div" reduce={reduce} delay={i * 0.06} key={c.name}>
              <div
                className="bp-trust-card flex h-full flex-col gap-3 px-6 py-7"
                style={{ background: C.surface }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "1.05rem",
                      color: C.ink,
                      lineHeight: 1.15,
                    }}
                  >
                    {c.name}
                  </span>
                </div>
                <Mono color={C.mute} className="!tracking-[0.06em]">
                  {c.sub}
                </Mono>
                {/* mech detail — revealed on hover (always visible at reduced-motion) */}
                <Mono
                  color={C.pillInk}
                  className="bp-trust-mech !tracking-[0.05em]"
                >
                  {c.mech}
                </Mono>
                <div className="mt-1">
                  <StatusPill kind={c.status} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   HOW — 2 alternating feature rows w/ honest node-graph diagrams
   (diagrammatic, NOT a fake screenshot — real shots drop in later)
   ────────────────────────────────────────────────────────────── */
function NodeGraph({
  nodes,
  kind,
  reduce,
}: {
  nodes: string[];
  kind: "flow" | "gate";
  reduce: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [pulseIdx, setPulseIdx] = useState(-1);
  useEffect(() => {
    if (!hovered || reduce) {
      setPulseIdx(-1);
      return;
    }
    let idx = 0;
    setPulseIdx(0);
    const iv = setInterval(() => {
      idx = (idx + 1) % nodes.length;
      setPulseIdx(idx);
    }, 280);
    return () => clearInterval(iv);
  }, [hovered, reduce, nodes.length]);

  return (
    <div
      className="relative overflow-hidden p-6 sm:p-8"
      style={{
        borderRadius: 20,
        border: `1px solid ${C.hairline}`,
        background: C.card,
        boxShadow: SHADOW.md,
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPulseIdx(-1);
      }}
    >
      <div className="mb-5 flex items-center justify-between">
        <Mono color={C.pillInk}>
          {kind === "flow" ? "Inbound · auto-handled" : "Access · per customer"}
        </Mono>
        <span
          className="bp-pulse"
          style={{ width: 7, height: 7, borderRadius: 999, background: C.live }}
          aria-hidden
        />
      </div>
      <div className="flex flex-col gap-3">
        {nodes.map((label, i) => {
          const isLast = i === nodes.length - 1;
          const isPulsing = pulseIdx === i;
          return (
            <div key={label} className="flex items-center gap-3">
              <span
                className="font-mono"
                style={{
                  color: isPulsing ? C.accent : C.mute,
                  fontSize: "0.6rem",
                  width: 22,
                  fontWeight: 500,
                  transition: reduce ? undefined : "color .18s ease-out",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                className="flex flex-1 items-center justify-between rounded-xl px-4 py-3"
                style={{
                  background: isPulsing
                    ? C.accentTint
                    : isLast
                      ? C.accentTint
                      : C.surface,
                  border: `1px solid ${isPulsing || isLast ? "rgba(17,126,115,0.25)" : C.hairline}`,
                  transition: reduce
                    ? undefined
                    : "background .18s ease-out, border-color .18s ease-out",
                }}
              >
                <span
                  style={{ color: C.ink, fontWeight: 500, fontSize: "0.92rem" }}
                >
                  {label}
                </span>
                <span
                  className={isPulsing && !reduce ? "bp-node-pulse" : ""}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: isPulsing || isLast ? C.accent : C.hairline,
                    transition: reduce ? undefined : "background .18s ease-out",
                    animation:
                      isPulsing && !reduce
                        ? "bpNodePulse .56s ease-in-out"
                        : undefined,
                  }}
                  aria-hidden
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const ROWS = [
  {
    h: "Every lead answered before it goes cold.",
    p: "Inbound emails and messages get read, sorted, and replied to the moment they land — so nothing waits on a human. Running live for Takycorp's inbox and Christelle's care intake.",
    nodes: [
      "New email / message",
      "Read + classify",
      "Route by intent",
      "Auto-reply / escalate",
    ],
    kind: "flow" as const,
  },
  {
    h: "Customers only ever see what's theirs.",
    p: "For idea-viaggi / KODIASIMMO, ~20 trip pages each locked to the right customer — so everyone sees only the trips they booked, nobody else's. Delivered, in production, handed off with video docs.",
    nodes: [
      "Customer logs in",
      "Per-customer gate",
      "Allowed trips resolved",
      "Trip page renders",
    ],
    kind: "gate" as const,
  },
];
function How({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="how"
      className="mx-auto max-w-[1200px] px-5 py-24 sm:px-6 sm:py-28"
    >
      <Reveal reduce={reduce} className="mb-16 flex items-center gap-3">
        <Mono color={C.accent}>03 — How I fix it</Mono>
        <div
          style={{ height: 1, flex: 1, background: C.hairline }}
          aria-hidden
        />
      </Reveal>
      <div className="flex flex-col gap-20 sm:gap-28">
        {ROWS.map((row, i) => {
          const flip = i % 2 === 1;
          return (
            <div
              key={row.h}
              className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <Reveal reduce={reduce} className={flip ? "lg:order-2" : ""}>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "clamp(1.9rem,3.5vw,2.75rem)",
                    lineHeight: 1.08,
                    letterSpacing: "-0.024em",
                    color: C.ink,
                  }}
                >
                  {row.h}
                </h2>
                <p
                  className="mt-5"
                  style={{
                    fontSize: "1.0625rem",
                    lineHeight: 1.62,
                    color: C.body,
                    maxWidth: "42ch",
                  }}
                >
                  {row.p}
                </p>
              </Reveal>
              <Reveal
                reduce={reduce}
                delay={0.08}
                className={flip ? "lg:order-1" : ""}
              >
                <NodeGraph nodes={row.nodes} kind={row.kind} reduce={reduce} />
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   STACK — bento grid; AI AGENTS hero tile
   ────────────────────────────────────────────────────────────── */
const TILES = [
  {
    n: "01",
    t: "Leads go cold",
    d: "Most buyers pick whoever replies first. I make your follow-up answer in seconds — day, night, weekend.",
    hero: true,
  },
  {
    n: "02",
    t: "Your week disappears",
    d: "The repetitive admin nobody wants to touch — handled automatically, around the clock.",
  },
  {
    n: "03",
    t: "Deals slip through",
    d: "Every lead tracked from first touch to close. Nothing forgotten, nothing dropped.",
  },
  {
    n: "04",
    t: "Carts get abandoned",
    d: "Fewer leaks between visit and checkout, so more browsers actually buy.",
  },
  {
    n: "05",
    t: "Customers wait too long",
    d: "Instant, on-brand replies right where they already message you.",
  },
  {
    n: "06",
    t: "Work lives in your head",
    d: "Information moves between your tools by itself — no copy-paste, no bottleneck on you.",
  },
  {
    n: "07",
    t: "Content never ships",
    d: "Even your videos get cut and published on autopilot, so your feed never goes quiet.",
  },
];
function Stack({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="stack"
      style={{ background: C.surface, borderTop: `1px solid ${C.hairline}` }}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-6 sm:py-28">
        <Reveal reduce={reduce} className="mb-12">
          <Mono color={C.accent}>04 — Where it leaks</Mono>
          <h2
            className="mt-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(1.9rem,4vw,3rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.026em",
              color: C.ink,
              maxWidth: "20ch",
            }}
          >
            Where your business is leaking right now.
          </h2>
          <p
            className="mt-4"
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.6,
              color: C.body,
              maxWidth: "52ch",
            }}
          >
            You feel these every week. I turn each one into a system that
            quietly handles itself.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((tile, i) => (
            <Reveal
              as="div"
              reduce={reduce}
              delay={(i % 3) * 0.05}
              key={tile.n}
              className={
                tile.hero ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""
              }
            >
              <div
                className="bp-tile flex h-full flex-col"
                style={{
                  borderRadius: 14,
                  border: `1px solid ${tile.hero ? "rgba(17,126,115,0.22)" : C.hairline}`,
                  background: tile.hero ? C.accentTint : C.card,
                  boxShadow: SHADOW.sm,
                  padding: 28,
                }}
              >
                <Mono
                  color={tile.hero ? C.pillInk : C.mute}
                  className="bp-stack-n"
                >
                  {tile.n}
                </Mono>
                <h3
                  className="mt-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: tile.hero ? 600 : 500,
                    fontSize: tile.hero ? "clamp(1.5rem,3vw,2rem)" : "1.25rem",
                    color: C.ink,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {tile.t}
                </h3>
                <p
                  className="mt-3"
                  style={{
                    fontSize: "0.97rem",
                    lineHeight: 1.55,
                    color: C.body,
                  }}
                >
                  {tile.d}
                </p>
                {tile.hero && (
                  <div className="mt-auto pt-6">
                    <a
                      href="#proof"
                      className="bp-link font-semibold"
                      style={{ color: C.accent, fontSize: "0.9rem" }}
                    >
                      See it in production ↓
                    </a>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   PROOF — the centerpiece: deployment status board
   ────────────────────────────────────────────────────────────── */
/* All metrics defensible: a counted number OR an honest static label.
   No invented percentages; "24/7" renders static (it's a description, not a count). */
type Case = {
  client: string;
  outcome: string;
  metricTo?: number;
  metricPrefix?: string;
  metricSuffix?: string;
  staticMetric?: string;
  metricNote: string;
  mech: string;
  since: string;
  status: "LIVE" | "DELIVERED" | "SHIPPED";
};
/* ⛔ TESTIMONIALS — DO NOT INVENT (house rule: no-fake-claims).
   Section ships ONLY when real, client-approved quotes land here.
   Waseem to collect from: Takycorp (Nkento), Christelle, idea-viaggi/KODIASIMMO,
   Lahore dental. Shape:
   const TESTIMONIALS: { quote: string; name: string; role: string }[] = [];
   When non-empty → render a "07.5 — In their words" strip between Proof and
   NowBuilding (card row, same Reveal idiom). Until then: nothing renders. */

const CASES: Case[] = [
  {
    client: "idea-viaggi / KODIASIMMO",
    outcome: "Per-user trip authorization, delivered.",
    metricTo: 20,
    metricPrefix: "~",
    metricSuffix: " trips",
    metricNote: "each gated so a customer sees only what they booked.",
    mech: "Per-customer trip access",
    since: "Delivered · handed off with video docs",
    status: "DELIVERED",
  },
  {
    client: "Takycorp",
    outcome: "Inbound email, handled for them.",
    metricTo: 2,
    metricSuffix: " bots",
    metricNote: "triage + auto-reply so no message waits.",
    mech: "Inbox triage + auto-reply",
    since: "Live · in production",
    status: "LIVE",
  },
  {
    client: "Christelle",
    outcome: "Care intake, handled for them.",
    staticMetric: "24/7",
    metricNote: "first-response handled around the clock.",
    mech: "Care intake, automated",
    since: "Live · care intake",
    status: "LIVE",
  },
];
function DentalTile() {
  return (
    <div
      className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"
      style={{
        borderRadius: 20,
        border: `1px solid ${C.hairline}`,
        background: C.card,
        boxShadow: SHADOW.sm,
        padding: 28,
      }}
    >
      <div className="flex items-center gap-4">
        <StatusPill kind="SHIPPED" />
        <div>
          <p style={{ color: C.ink, fontWeight: 600, fontSize: "1.05rem" }}>
            Lahore dental practice — front desk that runs itself, shipped.
          </p>
          <Mono color={C.mute} className="!tracking-[0.06em]">
            Front desk, automated
          </Mono>
        </div>
      </div>
      <Link
        href={CTA}
        target="_blank"
        rel="noopener noreferrer"
        className="bp-link shrink-0 font-semibold"
        style={{ color: C.accent, fontSize: "0.92rem" }}
      >
        Want one like this? →
      </Link>
    </div>
  );
}

/* Pinned scrollytelling deck — the ONE "wow" motion moment (REVAMP-PLAN §4/§5).
   Desktop + motion-on only; mobile and reduced-motion get the classic grid.
   HARD SEO rule: every case's text is always in the DOM — only opacity/transform animate. */
function PinnedCase({
  c,
  i,
  total,
  progress,
  active,
  reduce,
}: {
  c: Case;
  i: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  active: boolean;
  reduce: boolean;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = (i + 1) * seg;
  const fade = Math.min(0.08, seg / 3);
  const opacity = useTransform(
    progress,
    i === 0
      ? [0, end - fade, end]
      : i === total - 1
        ? [start, start + fade, 1]
        : [start, start + fade, end - fade, end],
    i === 0 ? [1, 1, 0] : i === total - 1 ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [start, end],
    i === 0 ? [0, -28] : [36, -28],
  );
  return (
    <motion.div
      className="absolute inset-0 flex items-center"
      style={{
        opacity,
        y,
        pointerEvents: active ? "auto" : "none",
      }}
      aria-hidden={!active}
    >
      <div className="mx-auto w-full max-w-[460px]">
        <CaseCard c={c} reduce={reduce} />
      </div>
    </motion.div>
  );
}

function ProofPinned({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const total = CASES.length;
  const [idx, setIdx] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIdx(Math.min(total - 1, Math.max(0, Math.floor(v * total))));
  });
  return (
    <section
      style={{ background: C.surface, borderTop: `1px solid ${C.hairline}` }}
    >
      {/* tall scroll runway drives the deck */}
      <div ref={ref} style={{ height: `${total * 100 + 60}vh` }}>
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-[1200px] grid-cols-12 items-center gap-10 px-6">
            {/* left — pinned heading + live index */}
            <div className="col-span-5">
              <Mono color={C.accent}>05 — Proof</Mono>
              <h2
                className="mt-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "clamp(1.9rem,4vw,3rem)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.026em",
                  color: C.ink,
                }}
              >
                Real systems, in production.
              </h2>
              <p className="mt-4">
                <Mono color={C.mute}>Named clients · specific outcomes</Mono>
              </p>
              <div
                className="mt-10 font-mono"
                style={{
                  color: C.accentDeep,
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                }}
                aria-live="polite"
              >
                0{idx + 1} <span style={{ color: C.mute }}>/ 0{total}</span>
              </div>
              {/* progress ticks */}
              <div className="mt-3 flex gap-2" aria-hidden>
                {CASES.map((c, i) => (
                  <div
                    key={c.client}
                    style={{
                      height: 3,
                      width: 34,
                      borderRadius: 999,
                      background: i <= idx ? C.accent : C.hairline,
                      transition: "background .25s ease-out",
                    }}
                  />
                ))}
              </div>
            </div>
            {/* right — crossfading case deck */}
            <div className="relative col-span-7" style={{ height: 480 }}>
              {CASES.map((c, i) => (
                <PinnedCase
                  key={c.client}
                  c={c}
                  i={i}
                  total={total}
                  progress={scrollYProgress}
                  active={i === idx}
                  reduce={reduce}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* wide 4th tile lands after the deck */}
      <div className="mx-auto max-w-[1200px] px-6 pb-24">
        <Reveal reduce={reduce}>
          <DentalTile />
        </Reveal>
      </div>
    </section>
  );
}

function CaseCard({ c, reduce }: { c: Case; reduce: boolean }) {
  return (
    <div
      className="bp-proof-card flex h-full flex-col"
      style={{
        borderRadius: 20,
        border: `1px solid ${C.hairline}`,
        background: C.card,
        boxShadow: SHADOW.md,
        padding: 28,
      }}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <Mono color={C.mute} className="!tracking-[0.06em]">
          {c.client}
        </Mono>
        <StatusPill kind={c.status} />
      </div>
      <div
        className="bp-proof-metric"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "clamp(2.5rem,5vw,3.5rem)",
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: C.accentDeep,
        }}
      >
        {c.staticMetric ?? (
          <>
            {c.metricPrefix ?? ""}
            <CountUp
              to={c.metricTo ?? 0}
              suffix={c.metricSuffix ?? ""}
              reduce={reduce}
            />
          </>
        )}
      </div>
      <p className="mt-2" style={{ color: C.body, fontSize: "0.95rem" }}>
        {c.metricNote}
      </p>
      <p
        className="mt-4"
        style={{
          color: C.ink,
          fontWeight: 600,
          fontSize: "1.02rem",
          lineHeight: 1.3,
        }}
      >
        {c.outcome}
      </p>
      <div className="mt-auto pt-6">
        <Mono color={C.pillInk} className="!tracking-[0.06em]">
          {c.mech}
        </Mono>
        <div className="mt-2">
          <Mono color={C.mute} className="!text-[0.62rem]">
            {c.since}
          </Mono>
        </div>
        {/* "View →" affordance — fades in on hover */}
        <div className="bp-proof-view mt-3">
          <a
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono uppercase"
            style={{
              color: C.accent,
              fontSize: "0.66rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
            }}
          >
            Want one like this? →
          </a>
        </div>
      </div>
    </div>
  );
}
function Proof({ reduce }: { reduce: boolean }) {
  return (
    <section
      style={{ background: C.surface, borderTop: `1px solid ${C.hairline}` }}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-6 sm:py-28">
        <Reveal
          reduce={reduce}
          className="mb-14 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <Mono color={C.accent}>05 — Proof</Mono>
            <h2
              className="mt-4"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.9rem,4vw,3rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.026em",
                color: C.ink,
              }}
            >
              Real systems, in production.
            </h2>
          </div>
          <Mono color={C.mute}>Named clients · specific outcomes</Mono>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal
              as="article"
              reduce={reduce}
              delay={i * 0.06}
              key={c.client}
            >
              <CaseCard c={c} reduce={reduce} />
            </Reveal>
          ))}
        </div>

        {/* wide 4th tile */}
        <Reveal reduce={reduce} delay={0.1} className="mt-4">
          <DentalTile />
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   NOW BUILDING — featured highlight: the video-editing-with-Claude-Code skill
   ────────────────────────────────────────────────────────────── */
const VIDEO_LINK = "/blog/edited-10-travel-vlogs-in-one-night-with-claude-code";
function NowBuilding({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="now"
      className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-20"
    >
      <Reveal reduce={reduce}>
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: 20,
            border: `1px solid ${C.hairline}`,
            background: C.accentDeep,
            boxShadow: SHADOW.lg,
          }}
        >
          {/* blueprint dot-matrix texture on the deep band */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(rgba(234,244,241,0.10) 1px, transparent 1px)`,
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative flex flex-col items-start gap-7 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[58ch]">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1"
                style={{ background: "rgba(234,244,241,0.12)" }}
              >
                <span
                  className="bp-pulse"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: C.live,
                  }}
                  aria-hidden
                />
                <span
                  className="font-mono uppercase"
                  style={{
                    color: C.onDeep,
                    fontSize: "0.66rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                  }}
                >
                  Now building
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "clamp(1.9rem,3.5vw,2.75rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.024em",
                  color: "#FFFFFF",
                }}
              >
                Editing whole videos with Claude Code.
              </h2>
              <p
                className="mt-4"
                style={{
                  fontSize: "1.0625rem",
                  lineHeight: 1.6,
                  color: C.onDeep,
                  maxWidth: "52ch",
                }}
              >
                My newest system: scripting, cutting, captioning, and publishing
                short-form video straight from the terminal — the same
                automation-first way I ship everything else. I recently cut and
                rendered ten Ubud travel vlogs in a single overnight batch.
              </p>
            </div>
            <Link
              href={VIDEO_LINK}
              className="bp-cta inline-flex shrink-0 items-center rounded-full font-semibold transition-opacity hover:opacity-90"
              style={{
                background: C.accentTint,
                color: C.accentDeep,
                fontSize: "0.95rem",
                padding: "0.85rem 1.6rem",
                boxShadow: SHADOW.md,
              }}
            >
              Read how I did it →
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   ABOUT — operator who shipped these; portrait demoted to support card
   ────────────────────────────────────────────────────────────── */
function About({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1200px] px-5 py-24 sm:px-6 sm:py-28"
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal reduce={reduce} className="lg:col-span-5">
          <figure
            className="relative overflow-hidden"
            style={{
              borderRadius: 20,
              border: `1px solid ${C.hairline}`,
              boxShadow: SHADOW.md,
              background: C.card,
            }}
          >
            <div className="relative" style={{ aspectRatio: "4/5" }}>
              <Image
                src={IMG(
                  "CAFE-WORK-2025-08-15-couch-laptop-brick-wall-cafe-candid.jpg",
                )}
                alt="Waseem Nasir working on a laptop on a cafe couch against an exposed-brick wall"
                fill
                sizes="(max-width:1024px) 90vw, 40vw"
                loading="eager"
                className="object-cover"
                style={{ filter: "saturate(0.94)" }}
              />
            </div>
            <figcaption
              className="border-t px-4 py-3"
              style={{ borderColor: C.hairline }}
            >
              <Mono color={C.pillInk} className="!tracking-[0.06em]">
                Waseem Nasir · Founder, SkynetLabs · 2000+ projects shipped
              </Mono>
            </figcaption>
          </figure>
        </Reveal>
        <Reveal reduce={reduce} delay={0.08} className="lg:col-span-7">
          <Mono color={C.accent}>06 — The founder</Mono>
          <h2
            className="mt-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(1.9rem,3.5vw,2.75rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.024em",
              color: C.ink,
            }}
          >
            One founder. Systems that actually run.
          </h2>
          <p
            className="mt-5"
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.62,
              color: C.body,
              maxWidth: "50ch",
            }}
          >
            I run SkynetLabs solo — I scope it, build it, and stay on the hook
            once it&apos;s live. No account managers, no handoff black holes.
            Mostly from a laptop between Lahore and Bali.
          </p>
          <div className="mt-9 grid grid-cols-3 gap-3">
            {[
              ["Scope", "We map the manual process."],
              ["Build", "I ship the system."],
              ["Ship & support", "It runs; I stay on the hook."],
            ].map(([t, d]) => (
              <div
                key={t}
                className="bp-process-step"
                style={{
                  borderRadius: 14,
                  border: `1px solid ${C.hairline}`,
                  background: C.card,
                  padding: 18,
                  boxShadow: SHADOW.sm,
                }}
              >
                <Mono color={C.pillInk}>{t}</Mono>
                <p
                  className="mt-2"
                  style={{
                    color: C.body,
                    fontSize: "0.85rem",
                    lineHeight: 1.45,
                  }}
                >
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   GALLERY — life, work & travel (masonry); + the GitHub build-proof
   ────────────────────────────────────────────────────────────── */
const GITHUB = "https://github.com/waseemnasir2k26";
const GALLERY: { src: string; alt: string }[] = [
  {
    src: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    alt: "Waseem focused at a coworking desk, phone in hand",
  },
  {
    src: "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
    alt: "Working on a laptop over coffee at a cafe in an olive track jacket",
  },
  {
    src: "EVENT-expo-booth-navy-polo-chandelier-hall.jpg",
    alt: "At an expo booth in a chandelier hall — networking proof",
  },
  {
    src: "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
    alt: "Working from a rice terrace, phone and power bank — nomad operator",
  },
  {
    src: "TRAVEL-2025-05-31-cliff-bucket-hat-crossbody-ocean.jpg",
    alt: "On an ocean cliff in a bucket hat with a crossbody bag",
  },
  {
    src: "PORTRAIT-restaurant-closeup-glasses-beige-shirt.jpg",
    alt: "Close-up portrait in glasses and a beige shirt at a restaurant",
  },
  {
    src: "CAFE-WORK-2026-06-01-rooftop-laptop-orange-juice-foreground.jpg",
    alt: "Rooftop laptop session with fresh orange juice in the foreground",
  },
  {
    src: "TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
    alt: "Mountain-ridge portrait in a tan knit sweater",
  },
  {
    src: "LIFESTYLE-2025-08-05-coffee-cup-raise-bamboo-cafe.jpg",
    alt: "Raising a coffee cup at a bamboo cafe",
  },
  {
    src: "PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg",
    alt: "Smiling in a rice field framed by palms and mountains",
  },
  {
    src: "PORTRAIT-stool-portrait-navy-polo-framed-art.jpg",
    alt: "Seated portrait in a navy polo beside framed art",
  },
  {
    src: "CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg",
    alt: "Night rooftop cafe, phone in hand with city lights behind",
  },
  {
    src: "TRAVEL-2026-05-24-jungle-rail-lean-sunglasses-candid.jpg",
    alt: "Leaning on a jungle rail in sunglasses, candid",
  },
  {
    src: "LIFESTYLE-cafe-counter-espresso-machine-facing-camera.jpg",
    alt: "Behind a cafe counter by the espresso machine, facing camera",
  },
  {
    src: "TRAVEL-2025-05-17-beach-standing-smile-moody-sky.jpg",
    alt: "Standing on a beach under a moody sky, smiling",
  },
  {
    src: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-phone-focus.jpg",
    alt: "Focused on a phone at a garden cafe in a blue polo",
  },
  {
    src: "BALI-2026-05-06-cafe-arch-working-side.jpg",
    alt: "Working on a laptop under a stone arch cafe, side profile",
  },
  {
    src: "PORTRAIT-2026-06-09-guitar-closeup-strumming-glasses.jpg",
    alt: "Strumming a guitar, close-up in glasses — off the clock",
  },
  {
    src: "TRAVEL-kuala-lumpur-street-crossbody-bag-portrait.jpg",
    alt: "Street portrait in Kuala Lumpur with a crossbody bag",
  },
  {
    src: "LIFESTYLE-2026-06-01-neon-gaming-cafe-headphones-candid.jpg",
    alt: "Candid in headphones at a neon-lit gaming cafe",
  },
  {
    src: "TRAVEL-2026-05-05-airport-lounge-armchair-phone-paintings.jpg",
    alt: "Airport lounge armchair between flights, phone in hand",
  },
  {
    src: "PORTRAIT-2026-05-24-river-gaze-profile-contemplative.jpg",
    alt: "Contemplative river-side profile portrait",
  },
  {
    src: "LIFESTYLE-2026-05-07-bali-cafe-thumbs-up-iced-latte.jpg",
    alt: "Thumbs up over an iced latte at a Bali cafe",
  },
  {
    src: "TRAVEL-thailand-straw-hat-pier-selfie.jpg",
    alt: "Pier selfie in a straw hat in Thailand",
  },
  {
    src: "LIFESTYLE-2026-03-29-photographing-valley-phone-knit-sweater.jpg",
    alt: "Photographing a valley view, knit sweater",
  },
  {
    src: "TRAVEL-night-valley-lights-balcony-selfie.jpg",
    alt: "Balcony selfie over night valley lights",
  },
  {
    src: "BALI-2026-05-07-veranda-phone-thinking.jpg",
    alt: "Thinking through a build on a veranda, phone in hand",
  },
  {
    src: "TRAVEL-castle-dusk-plaza-distant-stand.jpg",
    alt: "Standing in a castle plaza at dusk",
  },
];
function Gallery({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="gallery"
      style={{ background: C.surface, borderTop: `1px solid ${C.hairline}` }}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-6 sm:py-28">
        <Reveal
          reduce={reduce}
          className="mb-12 flex flex-wrap items-end justify-between gap-5"
        >
          <div>
            <Mono color={C.accent}>07 — On the ground</Mono>
            <h2
              className="mt-4"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.9rem,4vw,3rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.026em",
                color: C.ink,
              }}
            >
              Built from cafes, rooftops &amp; rice fields.
            </h2>
            <p
              className="mt-3"
              style={{ color: C.body, fontSize: "1.0625rem", maxWidth: "46ch" }}
            >
              Shipping production systems from wherever the work happens —
              between Lahore and Bali.
            </p>
          </div>
          <Link
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="bp-cta inline-flex shrink-0 items-center rounded-full font-semibold transition-opacity hover:opacity-90"
            style={{
              background: C.card,
              color: C.accent,
              border: `1px solid ${C.hairline}`,
              fontSize: "0.92rem",
              padding: "0.7rem 1.3rem",
              boxShadow: SHADOW.sm,
            }}
          >
            115 repos on GitHub →
          </Link>
        </Reveal>

        {/* masonry via CSS columns */}
        <div
          style={{ columnGap: 16 }}
          className="columns-2 sm:columns-3 lg:columns-4"
        >
          {GALLERY.map((g, i) => (
            <Reveal as="div" reduce={reduce} delay={(i % 4) * 0.04} key={g.src}>
              <figure
                className="bp-tile group relative mb-4 overflow-hidden"
                style={{
                  breakInside: "avoid",
                  borderRadius: 14,
                  border: `1px solid ${C.hairline}`,
                  background: C.card,
                  boxShadow: SHADOW.sm,
                }}
              >
                <Image
                  src={IMG(g.src)}
                  alt={g.alt}
                  width={600}
                  height={750}
                  sizes="(max-width:640px) 45vw, (max-width:1024px) 30vw, 22vw"
                  loading="lazy"
                  className="h-auto w-full"
                  style={{ display: "block", filter: "saturate(0.96)" }}
                />
                {/* hover scrim with caption — CSS-only, no JS */}
                <div className="bp-gallery-scrim" aria-hidden>
                  <span
                    className="font-mono"
                    style={{
                      color: "rgba(234,244,241,0.92)",
                      fontSize: "0.62rem",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      lineHeight: 1.4,
                    }}
                  >
                    {g.alt}
                  </span>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   CONVERT — the single ink-jade depth band
   ────────────────────────────────────────────────────────────── */
/* ──────────────────────────────────────────────────────────────
   FAQ — question-shaped headings, answers in DOM (AEO), native
   <details> for zero-JS a11y. FAQPage JSON-LD mirrors visible text
   EXACTLY (REVAMP-PLAN §6.6 — schema must match what users see).
   ────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "How much does a build like this cost?",
    a: "Every system is scoped as a fixed-price project after the free audit — you know the exact number before any work starts, and the audit itself costs nothing. No retainers required, no hourly surprises.",
  },
  {
    q: "How fast will it be live?",
    a: "Most systems ship in about 14 days. Bigger builds are split into stages, so something useful is running for you inside the first two weeks.",
  },
  {
    q: "Do I need to understand AI or code?",
    a: "No. You get a working system plus plain-language video documentation — the same handoff idea-viaggi's team uses to run their trip portal without me.",
  },
  {
    q: "What tools do you build on?",
    a: "n8n for workflows, GoHighLevel for CRM and follow-up, WordPress and Next.js for sites, and Claude or GPT where language understanding is needed. All standard tools, all owned by you — no proprietary black box.",
  },
  {
    q: "What actually happens on the free audit call?",
    a: "Thirty minutes. You bring your messiest manual process; I map where it leaks time and money. You leave with a one-page automation map whether we work together or not.",
  },
  {
    q: "What happens after handoff if something breaks?",
    a: "Every build ships with documentation and a video walkthrough, and ongoing support is available if you want it. The systems for Takycorp and Christelle have been running in production since they shipped.",
  },
];
function Faq({ reduce }: { reduce: boolean }) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section
      id="faq"
      className="mx-auto max-w-[1200px] px-5 py-24 sm:px-6 sm:py-28"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Reveal reduce={reduce} className="mb-12 flex items-center gap-3">
        <Mono color={C.accent}>08 — Questions</Mono>
        <div
          style={{ height: 1, flex: 1, background: C.hairline }}
          aria-hidden
        />
      </Reveal>
      <div className="mx-auto grid max-w-[820px] grid-cols-1 gap-3">
        {FAQS.map((f, i) => (
          <Reveal as="div" reduce={reduce} delay={i * 0.04} key={f.q}>
            <details
              className="bp-faq group"
              style={{
                borderRadius: 16,
                border: `1px solid ${C.hairline}`,
                background: C.card,
                boxShadow: SHADOW.sm,
              }}
            >
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden"
                style={{
                  color: C.ink,
                  fontWeight: 600,
                  fontSize: "1.02rem",
                  lineHeight: 1.35,
                }}
              >
                <h3 style={{ fontSize: "inherit", fontWeight: "inherit" }}>
                  {f.q}
                </h3>
                <span
                  className="bp-faq-chev shrink-0 font-mono"
                  style={{ color: C.accent, fontSize: "0.9rem" }}
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p
                className="px-6 pb-6"
                style={{
                  color: C.body,
                  fontSize: "0.98rem",
                  lineHeight: 1.62,
                  maxWidth: "62ch",
                }}
              >
                {f.a}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Convert({ reduce }: { reduce: boolean }) {
  return (
    <section id="convert" style={{ background: C.accentDeep }}>
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-[720px] text-center">
          <Reveal reduce={reduce}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(2rem,4.5vw,3.25rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.026em",
                color: "#FFFFFF",
              }}
            >
              Let&apos;s find where your business is leaking.
            </h2>
            <p
              className="mt-5"
              style={{ fontSize: "1.1rem", lineHeight: 1.6, color: C.onDeep }}
            >
              A free 30-minute audit — bring your messiest manual process and
              I&apos;ll show you exactly what to automate first.
            </p>
          </Reveal>
          <Reveal
            reduce={reduce}
            delay={0.08}
            className="mt-9 flex justify-center"
          >
            <Link
              href={CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="bp-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
              style={{
                background: C.accentTint,
                color: C.accentDeep,
                fontSize: "1rem",
                padding: "0.9rem 1.9rem",
                boxShadow: SHADOW.lg,
              }}
            >
              Book a free audit →
            </Link>
          </Reveal>
          {/* what-happens-next strip — kills call anxiety (REVAMP-PLAN §4.6) */}
          <Reveal reduce={reduce} delay={0.12} className="mt-10">
            <ol className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-0">
              {[
                "30-min audit call",
                "1-page map + fixed quote",
                "Live in ~14 days",
              ].map((step, i) => (
                <li key={step} className="flex items-center">
                  <span
                    className="font-mono uppercase"
                    style={{
                      color: C.onDeep,
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      border: "1px solid rgba(234,244,241,0.28)",
                      borderRadius: 999,
                      padding: "0.45rem 0.9rem",
                    }}
                  >
                    <span style={{ color: "rgba(234,244,241,0.6)" }}>
                      {i + 1}.{" "}
                    </span>
                    {step}
                  </span>
                  {i < 2 && (
                    <span
                      className="mx-2 hidden sm:inline"
                      style={{ color: "rgba(234,244,241,0.45)" }}
                      aria-hidden
                    >
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal reduce={reduce} delay={0.14} className="mt-8">
            <span
              className="font-mono uppercase"
              style={{
                color: "rgba(234,244,241,0.66)",
                fontSize: "0.66rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                lineHeight: 1.8,
              }}
            >
              No pitch. Leave with a 1-page automation map. If I can&apos;t
              help, I&apos;ll tell you.
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   FOOTER — blueprint dot-matrix; never prints empty
   ────────────────────────────────────────────────────────────── */
function SiteFooter({ reduce }: { reduce: boolean }) {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: C.surface, borderTop: `2px solid ${C.accentDeep}` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${C.hairline} 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
          opacity: 0.55,
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-5 py-20 sm:px-6">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <Reveal reduce={reduce} y={12}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "1.15rem",
                color: C.ink,
              }}
            >
              Waseem Nasir · SkynetLabs
            </span>
            <p
              className="mt-3"
              style={{ color: C.body, fontSize: "0.95rem", maxWidth: "32ch" }}
            >
              AI automation for service businesses &amp; stores.
            </p>
            <div className="mt-5 flex flex-col gap-1">
              <Mono color={C.mute} className="!tracking-[0.06em]">
                Lahore · Bali
              </Mono>
              <a
                href="mailto:waseem@skynetjoe.com"
                className="bp-link"
                style={{
                  color: C.accent,
                  fontSize: "0.9rem",
                  width: "fit-content",
                }}
              >
                waseem@skynetjoe.com
              </a>
            </div>
          </Reveal>
          <Reveal reduce={reduce} y={12} delay={0.06}>
            <nav
              className="flex flex-wrap gap-x-12 gap-y-6"
              aria-label="Footer"
            >
              {[
                [
                  "Explore",
                  [
                    ["#how", "Work"],
                    ["#proof", "Proof"],
                    ["/blog", "Blog"],
                    ["#about", "About"],
                  ],
                ],
                [
                  "Connect",
                  [
                    [CTA, "Book a free audit"],
                    ["https://www.linkedin.com/in/waseemnasir2k26", "LinkedIn"],
                    ["https://x.com/skynetlabs", "X (Twitter)"],
                    ["https://youtube.com/@skynetlabs", "YouTube"],
                    ["https://github.com/waseemnasir2k26", "GitHub"],
                    ["https://skynetjoe.com", "skynetjoe.com"],
                  ],
                ],
              ].map(([title, links]) => (
                <div key={title as string}>
                  <Mono color={C.mute}>{title as string}</Mono>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {(links as [string, string][]).map(([href, label]) => (
                      <li key={href}>
                        <a
                          href={href}
                          target={
                            href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="bp-link"
                          style={{ color: C.body, fontSize: "0.92rem" }}
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </Reveal>
        </div>
        <div
          className="mt-16 flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center"
          style={{ borderColor: C.hairline }}
        >
          <Mono color={C.pillInk}>
            Built by the person who answers your call
          </Mono>
          <Mono color={C.mute} className="!tracking-[0.06em]">
            © 2026 Waseem Nasir
          </Mono>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────────────────────
   MOBILE STICKY CTA — ≤768px; hidden when convert band in view
   ────────────────────────────────────────────────────────────── */
function MobileCTABar() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = document.getElementById("convert");
    if (!el) return;
    const io = new IntersectionObserver((e) => setHidden(e[0].isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{
        transform: hidden ? "translateY(120%)" : "translateY(0)",
        transition: "transform .3s ease",
        padding: "10px 14px calc(10px + env(safe-area-inset-bottom))",
        background: "rgba(251,252,253,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: `1px solid ${C.hairline}`,
        boxShadow: SHADOW.md,
      }}
    >
      <Link
        href={CTA}
        target="_blank"
        rel="noopener noreferrer"
        className="bp-cta flex w-full items-center justify-center rounded-full font-semibold"
        style={{
          background: C.accent,
          color: "#fff",
          fontSize: "0.95rem",
          minHeight: 46,
        }}
      >
        Book a free audit
      </Link>
    </div>
  );
}
