"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* ============================================================
   /variants — Chooser index for all six founder site variants.
   Lives under the global dark RootLayout — dark-themed by design.
   Self-contained. Touches no shared files.
   ============================================================ */

interface Variant {
  slug: string;
  label: string;
  scroll: "VERTICAL" | "HORIZONTAL";
  descriptor: string;
  palette: string; // short readable description
  accentHex: string; // the one key accent colour
  photo: string; // representative image from /img/pro/
}

const VARIANTS: Variant[] = [
  {
    slug: "light-editorial",
    label: "Light Editorial",
    scroll: "VERTICAL",
    descriptor: "Warm cream canvas, electric coral accent, magazine rhythm.",
    palette: "Cream / Near-black / Coral #FF4D2E",
    accentHex: "#FF4D2E",
    photo: "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
  },
  {
    slug: "warm-cinematic",
    label: "Warm Cinematic",
    scroll: "HORIZONTAL",
    descriptor:
      "Moody dark charcoal, full-bleed photo panels, amber-gold hairlines.",
    palette: "Deep Charcoal / Cream / Amber #E8B14C",
    accentHex: "#E8B14C",
    photo: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  },
  {
    slug: "brutalist",
    label: "Brutalist / Swiss",
    scroll: "VERTICAL",
    descriptor: "Oversized grotesk, hard grid, signal red on paper white.",
    palette: "Paper #FAFAF7 / Ink / Red #E2231A",
    accentHex: "#E2231A",
    photo:
      "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
  },
  {
    slug: "gradient-glass",
    label: "Gradient Glass",
    scroll: "HORIZONTAL",
    descriptor: "Vivid pink→violet→blue gradient blooms, glassmorphism cards.",
    palette: "Near-black #0B0B12 / Pink #FF5DA2 → Violet #7C5CFF",
    accentHex: "#7C5CFF",
    photo:
      "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  },
  {
    slug: "editorial-emerald",
    label: "Editorial Emerald",
    scroll: "VERTICAL",
    descriptor:
      "Quiet luxury — soft off-white, emerald accent, masonry photo wall.",
    palette: "Off-white #F4F3EE / Emerald #0F5132 / Gold #C9A24B",
    accentHex: "#0F5132",
    photo: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
  },
  {
    slug: "dark-luxe",
    label: "Dark Luxe",
    scroll: "HORIZONTAL",
    descriptor:
      "True black canvas, champagne-bronze hairlines, museum rail gallery.",
    palette: "True Black #070707 / Champagne #CBA968 / Cream",
    accentHex: "#CBA968",
    photo: "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
      delay: i * 0.07,
    },
  }),
};

export default function VariantsIndex() {
  return (
    <main className="min-h-screen" style={{ background: "#0A0A0F" }}>
      {/* ---- header ---- */}
      <header className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <p
          className="font-mono text-xs tracking-widest uppercase mb-4"
          style={{ color: "#5a5a72" }}
        >
          waseemnasir.com / internal
        </p>
        <h1
          className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-4"
          style={{ color: "#F2F0EB" }}
        >
          Site Variant Chooser
        </h1>
        <p
          className="font-sans text-base max-w-xl"
          style={{ color: "#7a7a92" }}
        >
          Six distinct design directions for the same founder story. Compare,
          pick, or ship any of them. The live homepage at{" "}
          <Link
            href="/"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: "#9a9ab8" }}
          >
            /
          </Link>{" "}
          remains unchanged.
        </p>
      </header>

      {/* ---- scroll badge guide ---- */}
      <div className="max-w-6xl mx-auto px-6 pb-8 flex gap-4 flex-wrap">
        <span
          className="font-mono text-xs px-3 py-1 rounded-full border"
          style={{ color: "#5a5a72", borderColor: "#1e1e2a" }}
        >
          VERTICAL = standard scroll
        </span>
        <span
          className="font-mono text-xs px-3 py-1 rounded-full border"
          style={{ color: "#5a5a72", borderColor: "#1e1e2a" }}
        >
          HORIZONTAL = pinned wheel-driven x-pan (mobile falls back to vertical)
        </span>
      </div>

      {/* ---- grid ---- */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VARIANTS.map((v, i) => (
            <motion.div
              key={v.slug}
              custom={i}
              initial="hidden"
              animate="show"
              variants={cardVariants}
            >
              <Link
                href={`/v/${v.slug}`}
                className="group block rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  background: "#111118",
                  borderColor: "#1e1e2a",
                }}
              >
                {/* photo */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src={`/img/pro/${v.photo}`}
                    alt={v.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: "center top" }}
                  />
                  {/* accent overlay strip at bottom */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ background: v.accentHex }}
                  />
                  {/* scroll badge */}
                  <div
                    className="absolute top-3 right-3 font-mono text-[10px] tracking-widest px-2 py-1 rounded"
                    style={{
                      background: "rgba(10,10,15,0.82)",
                      color: v.accentHex,
                    }}
                  >
                    {v.scroll}
                  </div>
                </div>

                {/* info */}
                <div className="p-5">
                  <h2
                    className="font-serif text-lg font-semibold mb-1"
                    style={{ color: "#F2F0EB" }}
                  >
                    {v.label}
                  </h2>
                  <p
                    className="font-sans text-sm leading-relaxed mb-3"
                    style={{ color: "#7a7a92" }}
                  >
                    {v.descriptor}
                  </p>
                  <p
                    className="font-mono text-[10px] tracking-wide"
                    style={{ color: "#40404e" }}
                  >
                    {v.palette}
                  </p>

                  <div
                    className="mt-4 inline-flex items-center gap-2 font-sans text-xs font-semibold tracking-wide transition-opacity group-hover:opacity-100 opacity-70"
                    style={{ color: v.accentHex }}
                  >
                    View variant
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- footer note ---- */}
      <footer
        className="max-w-6xl mx-auto px-6 pb-16 border-t pt-8"
        style={{ borderColor: "#1e1e2a" }}
      >
        <p className="font-mono text-xs" style={{ color: "#40404e" }}>
          Routes: /variants (this page) · /v/light-editorial · /v/warm-cinematic
          · /v/brutalist · /v/gradient-glass · /v/editorial-emerald ·
          /v/dark-luxe
        </p>
        <p className="font-mono text-xs mt-1" style={{ color: "#2e2e3a" }}>
          Live site: / — untouched. All variants are isolated under
          app/v/&lt;slug&gt;/.
        </p>
      </footer>
    </main>
  );
}
