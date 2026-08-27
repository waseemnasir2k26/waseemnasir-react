"use client";
import Link from "next/link";
import {
  BEATS,
  C,
  CTA_LABEL,
  CTA_URL,
  CREDENTIAL_LINE,
  PORTRAIT_SRC,
} from "./tokens";

/* ============================================================
   Static fallback — prefers-reduced-motion, no-WebGL, or coarse
   pointer. No canvas, no pin/scrub: a simple layered SVG skyline
   header, then the same seven beats stacked in normal document
   flow. Same copy as the 3D route, same CTA. Deterministic SVG
   (no Math.random) so SSR/hydration match.
   ============================================================ */
export default function StaticFallback() {
  return (
    <main
      id="main-content"
      style={{ background: "#050810", color: C.ink, minHeight: "100vh" }}
    >
      <StaticSkyline />
      <div className="mx-auto max-w-[720px] px-6 py-16 sm:px-8">
        <p
          className="font-mono"
          style={{
            color: C.amber,
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
          }}
        >
          03:47 → 06:58
        </p>
        {BEATS.map((b) => (
          <section
            key={b.id}
            className="mt-12 border-t pt-8"
            style={{ borderColor: C.hairline }}
          >
            <p
              className="font-mono"
              style={{
                color: C.amber,
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
              }}
            >
              {b.clock} {b.eyebrow ? `— ${b.eyebrow}` : ""}
            </p>
            <h2
              className="mt-3"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(1.5rem,4vw,2.2rem)",
                lineHeight: 1.15,
                color: C.ink,
              }}
            >
              {b.line}
            </h2>
            {b.sub && (
              <p className="mt-2" style={{ color: C.body, fontSize: "1rem" }}>
                {b.sub}
              </p>
            )}
            {b.counters && (
              <p
                className="mt-4 font-mono"
                style={{ color: C.mute, fontSize: "0.78rem" }}
              >
                {b.counters}
              </p>
            )}
          </section>
        ))}

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PORTRAIT_SRC}
            alt="Waseem Nasir"
            width={96}
            height={96}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              width: 96,
              height: 96,
            }}
          />
          <p style={{ fontWeight: 600, color: C.ink }}>Waseem Nasir</p>
          <p style={{ color: C.mute, fontSize: "0.85rem" }}>
            {CREDENTIAL_LINE}
          </p>
          <Link
            href={CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center rounded-full font-semibold"
            style={{
              background: C.amber,
              color: "#1a1206",
              padding: "0.85rem 1.8rem",
              fontSize: "1rem",
            }}
          >
            {CTA_LABEL}
          </Link>
        </div>
      </div>
      <StaticFooter />
    </main>
  );
}

function StaticSkyline() {
  const heights = [30, 55, 22, 70, 40, 85, 28, 60, 36, 48, 26, 64, 34, 52, 20];
  const lit = [1, 4, 7, 10, 13, 5, 9];
  return (
    <svg
      viewBox="0 0 400 160"
      aria-hidden
      role="presentation"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <linearGradient id="sky347" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050810" />
          <stop offset="60%" stopColor="#0b0f28" />
          <stop offset="100%" stopColor="#241d3a" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="160" fill="url(#sky347)" />
      {heights.map((h, i) => {
        const w = 400 / heights.length;
        const x = i * w;
        const y = 150 - h;
        return (
          <rect
            key={i}
            x={x + 1}
            y={y}
            width={w - 2}
            height={h}
            fill="#11141e"
            opacity={lit.includes(i) ? 1 : 0.9}
          >
            {lit.includes(i) && <title>lit window</title>}
          </rect>
        );
      })}
      {lit.map((i) => {
        const w = 400 / heights.length;
        return (
          <rect
            key={`w-${i}`}
            x={i * w + w / 2 - 3}
            y={150 - heights[i] + 8}
            width={6}
            height={5}
            fill="#FFB35C"
          />
        );
      })}
      <rect
        x="0"
        y="148"
        width="400"
        height="2"
        fill="#FFB35C"
        opacity="0.35"
      />
    </svg>
  );
}

function StaticFooter() {
  return (
    <footer
      className="border-t px-6 py-8 text-center"
      style={{ borderColor: C.hairline }}
    >
      <span
        className="font-mono"
        style={{ color: C.mute, fontSize: "0.72rem" }}
      >
        Built by{" "}
        <a href="https://www.waseemnasir.com" style={{ color: C.amber }}>
          SkynetLabs · waseemnasir.com
        </a>
      </span>
    </footer>
  );
}
