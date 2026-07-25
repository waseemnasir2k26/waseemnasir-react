"use client";

import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { brand } from "@/lib/brand";
import {
  LogoLockup,
  LogoLockupStack,
  Wordmark,
  WordmarkA,
  WordmarkB,
  Monogram,
  Mark,
} from "@/components/brand/Logo";

/* ============================================================
   /brand — Live brand guidelines for the Waseem Nasir founder
   identity (Aurora Luxe). Logo system + color + type + voice.
   Self-contained; loads its own heavy fonts. Touches no shared file.
   ============================================================ */

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const jbmono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const C = brand.color;
const MONO = "var(--font-jetbrains), monospace";
const SERIF = "var(--font-fraunces), Georgia, serif";
const SANS = "var(--font-hanken), system-ui, sans-serif";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-3 text-xs uppercase"
      style={{ fontFamily: MONO, letterSpacing: "0.25em", color: C.accent }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-8"
      style={{
        fontFamily: SERIF,
        fontWeight: 800,
        fontSize: "clamp(1.9rem,4vw,2.8rem)",
        letterSpacing: "-0.01em",
        color: C.text,
      }}
    >
      {children}
    </h2>
  );
}

const SWATCHES: { name: string; hex: string; note: string; dark?: boolean }[] =
  [
    { name: "Forest Ink", hex: C.bg, note: "Page base", dark: true },
    { name: "Emerald", hex: C.primary, note: "Primary brand" },
    { name: "Teal", hex: C.teal, note: "Gradient mid / labels" },
    { name: "Gold", hex: C.accent, note: "Accent / CTA" },
    { name: "Gold Light", hex: C.accentLight, note: "Chips on dark" },
    { name: "Text", hex: C.text, note: "Primary text" },
    { name: "Muted", hex: C.muted, note: "Secondary text · 10.6:1 AAA" },
  ];

const TYPE_SAMPLES: {
  level: string;
  spec: string;
  size: string;
  weight: number;
  fam: string;
  sample: string;
}[] = [
  {
    level: "Display",
    spec: "Fraunces · 900",
    size: "clamp(3.1rem,7vw,5rem)",
    weight: 900,
    fam: SERIF,
    sample: "Busywork, gone.",
  },
  {
    level: "H1",
    spec: "Fraunces · 800",
    size: "3.25rem",
    weight: 800,
    fam: SERIF,
    sample: "Find the leak.",
  },
  {
    level: "H2",
    spec: "Fraunces · 800",
    size: "2.25rem",
    weight: 800,
    fam: SERIF,
    sample: "Engineer it shut.",
  },
  {
    level: "H3",
    spec: "Fraunces · 700",
    size: "1.6rem",
    weight: 700,
    fam: SERIF,
    sample: "Real systems, quietly running.",
  },
  {
    level: "Body",
    spec: "Hanken Grotesk · 400",
    size: "1.0625rem",
    weight: 400,
    fam: SANS,
    sample:
      "Quiet AI and automation systems that run behind a business so the owner stops doing robot work.",
  },
  {
    level: "Label",
    spec: "JetBrains Mono · 500",
    size: "0.75rem",
    weight: 500,
    fam: MONO,
    sample: "INDEPENDENT FOUNDER · SINCE 2019",
  },
];

const TAGLINES = [
  "I make your busywork disappear.",
  "Find the leak. Engineer it shut.",
  "Quiet systems that run your business while you don't.",
];

export default function BrandPage() {
  return (
    <>
      <div
        className="fixed inset-0 z-0"
        style={{ background: C.bg }}
        aria-hidden
      />
      <div
        className={`relative z-10 ${fraunces.variable} ${hanken.variable} ${jbmono.variable}`}
        style={{ color: C.text, fontFamily: SANS }}
      >
        <main id="main-content" className="mx-auto max-w-5xl px-6 py-20">
          {/* Header */}
          <header className="mb-20">
            <Eyebrow>Brand System · Aurora Luxe</Eyebrow>
            <h1
              style={{
                fontFamily: SERIF,
                fontWeight: 900,
                fontSize: "clamp(2.8rem,7vw,5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              Waseem Nasir
            </h1>
            <p
              className="mt-5 max-w-xl text-lg leading-relaxed"
              style={{ color: C.muted }}
            >
              The founder identity behind SkynetLabs. One palette, one type
              system, one voice — built premium, no AI-template tells.
            </p>
          </header>

          {/* LOGO */}
          <section className="mb-24">
            <Eyebrow>01 · Logo</Eyebrow>
            <SectionTitle>The mark</SectionTitle>

            {/* primary lockup on dark */}
            <div
              className="mb-5 flex items-center justify-center rounded-2xl px-8 py-16"
              style={brand.glass.card}
            >
              <LogoLockup size={300} />
            </div>

            {/* lockup on light */}
            <div className="mb-5 grid gap-5 sm:grid-cols-2">
              <div
                className="flex items-center justify-center rounded-2xl px-6 py-12"
                style={{ background: "#F4EFE6" }}
              >
                <LogoLockup size={230} mono="light" />
              </div>
              <div
                className="flex items-center justify-center rounded-2xl px-6 py-12"
                style={brand.glass.card}
              >
                <LogoLockupStack size={150} />
              </div>
            </div>

            {/* wordmark options */}
            <p className="mb-3 mt-8 text-sm" style={{ color: C.muted }}>
              Wordmark options
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { c: <Wordmark size={200} />, l: "A · Title-case (default)" },
                { c: <WordmarkA size={200} />, l: "B · All-caps" },
                { c: <WordmarkB size={150} />, l: "C · Stacked display" },
              ].map((w, i) => (
                <div key={i}>
                  <div
                    className="flex h-32 items-center justify-center rounded-xl px-4"
                    style={brand.glass.card}
                  >
                    {w.c}
                  </div>
                  <p
                    className="mt-2 text-xs"
                    style={{ fontFamily: MONO, color: C.muted }}
                  >
                    {w.l}
                  </p>
                </div>
              ))}
            </div>

            {/* monogram + mark */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div
                className="flex items-center justify-center gap-8 rounded-xl py-10"
                style={brand.glass.card}
              >
                <Monogram size={72} />
                <Mark size={48} />
              </div>
              <div
                className="flex items-center justify-center gap-6 rounded-xl py-10"
                style={{ background: "#F4EFE6" }}
              >
                <Monogram size={72} mono="light" />
                <Mark size={48} mono="light" />
              </div>
            </div>
          </section>

          {/* COLOR */}
          <section className="mb-24">
            <Eyebrow>02 · Color</Eyebrow>
            <SectionTitle>Aurora palette</SectionTitle>

            <div
              className="mb-6 h-28 w-full rounded-2xl"
              style={{ background: brand.gradient.aurora }}
              aria-label="Aurora gradient: emerald to teal to gold"
            />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {SWATCHES.map((s) => (
                <div
                  key={s.name}
                  className="overflow-hidden rounded-xl"
                  style={{ border: `1px solid ${C.line}` }}
                >
                  <div
                    className="h-20 w-full"
                    style={{
                      background: s.hex,
                      borderBottom: s.dark ? `1px solid ${C.line}` : "none",
                    }}
                  />
                  <div className="p-3">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: C.text }}
                    >
                      {s.name}
                    </p>
                    <p
                      className="mt-0.5 text-xs uppercase"
                      style={{ fontFamily: MONO, color: C.muted }}
                    >
                      {s.hex}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: C.muted }}>
                      {s.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TYPE */}
          <section className="mb-24">
            <Eyebrow>03 · Typography</Eyebrow>
            <SectionTitle>Fraunces + Hanken + JetBrains Mono</SectionTitle>
            <p className="mb-8 max-w-xl text-sm" style={{ color: C.muted }}>
              Display in Fraunces, set heavy (700–900) — the boldness is the
              brand. Body in Hanken Grotesk. Labels in JetBrains Mono. Never
              Inter, Poppins or Montserrat.
            </p>

            <div className="space-y-7">
              {TYPE_SAMPLES.map((t) => (
                <div
                  key={t.level}
                  className="border-b pb-7"
                  style={{ borderColor: C.line }}
                >
                  <p
                    className="mb-2 text-xs uppercase"
                    style={{
                      fontFamily: MONO,
                      letterSpacing: "0.2em",
                      color: C.accent,
                    }}
                  >
                    {t.level} · {t.spec}
                  </p>
                  <p
                    style={{
                      fontFamily: t.fam,
                      fontWeight: t.weight,
                      fontSize: t.size,
                      lineHeight: 1.15,
                      color: C.text,
                    }}
                  >
                    {t.sample}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* VOICE */}
          <section className="mb-24">
            <Eyebrow>04 · Voice</Eyebrow>
            <SectionTitle>How the brand talks</SectionTitle>

            <p className="mb-3 text-sm" style={{ color: C.muted }}>
              Taglines
            </p>
            <div className="space-y-3">
              {TAGLINES.map((tg, i) => (
                <div
                  key={tg}
                  className="rounded-xl px-6 py-5"
                  style={brand.glass.card}
                >
                  <span
                    className="mr-3 text-sm"
                    style={{ fontFamily: MONO, color: C.accent }}
                  >
                    0{i + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 700,
                      fontSize: "1.4rem",
                      color: C.text,
                    }}
                  >
                    {tg}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="mt-8 rounded-2xl px-7 py-8"
              style={{
                ...brand.glass.card,
                borderLeft: `3px solid ${C.accent}`,
              }}
            >
              <p className="text-lg leading-relaxed" style={{ color: C.text }}>
                The one rule that overrides everything:{" "}
                <span
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    color: C.accentLight,
                  }}
                >
                  if I can&apos;t prove it, I won&apos;t claim it.
                </span>
              </p>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: C.muted }}
              >
                Premium not loud · direct · contrarian but credible · proof-led
                · plain words over machine words · a little human. Avoid:
                revolutionary, cutting-edge, seamless, leverage, unlock,
                game-changer, fake urgency, invented metrics.
              </p>
            </div>
          </section>

          <footer
            className="border-t pt-8 text-sm"
            style={{ borderColor: C.line, color: C.muted }}
          >
            <p style={{ fontFamily: MONO }}>
              Waseem Nasir · SkynetLabs · Aurora Luxe brand system · full docs
              in /content/brand-*.md + /lib/brand.ts
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
