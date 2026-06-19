"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SPRING_SOFT } from "./motion";

/* ============================================================
   VariantLinks — live preview index of every design direction,
   surfaced on the homepage so each variant is one click away.
   Ranked by the 2026-06-19 critic-loop score (10 independent
   adversarial critics, founder-site rubric). PASS = bright +
   ship-ready; FAIL = killed on the "too dark" axis.
   Self-contained; links to the live /v/<slug>/ routes.
   ============================================================ */

interface V {
  slug: string;
  label: string;
  score: number;
  pass: boolean;
  accent: string;
  note: string;
}

// NEW — "founder-glass" series: gradient-glass mechanic, bespoke jewel/metallic
// palettes (no AI-SaaS neon), characterful editorial fonts (no Inter).
const NEW_VARIANTS: Omit<V, "score" | "pass">[] = [
  {
    slug: "aurora-luxe",
    label: "Aurora Luxe",
    accent: "#C9A24B",
    note: "Emerald · teal · gold jewel tones on forest-ink. Fraunces serif.",
  },
  {
    slug: "obsidian-aurum",
    label: "Obsidian Aurum",
    accent: "#CBA968",
    note: "Obsidian + champagne–bronze metallic. Cormorant display.",
  },
  {
    slug: "bordeaux-glass",
    label: "Bordeaux Glass",
    accent: "#C9A24B",
    note: "Wine + bone-gold, wine-cellar luxe. Fraunces serif.",
  },
  {
    slug: "ink-atelier",
    label: "Ink Atelier",
    accent: "#B08D4F",
    note: "Steel-blue + brass, architectural. Spectral serif.",
  },
  {
    slug: "warm-glass-dusk",
    label: "Warm Glass Dusk",
    accent: "#E0A050",
    note: "Terracotta + amber sunset glass. Newsreader serif.",
  },
];

// Ordered by critic score, highest first.
const VARIANTS: V[] = [
  {
    slug: "light-editorial",
    label: "Light Editorial",
    score: 89,
    pass: true,
    accent: "#FF4D2E",
    note: "Cream + coral. Brightest, cleanest conversion.",
  },
  {
    slug: "editorial-emerald",
    label: "Editorial Emerald",
    score: 86,
    pass: true,
    accent: "#0F5132",
    note: "Off-white + emerald. Quiet luxury.",
  },
  {
    slug: "brutalist",
    label: "Brutalist / Swiss",
    score: 86,
    pass: true,
    accent: "#E2231A",
    note: "Paper white, hard grid, signal red. Bold.",
  },
  {
    slug: "dark-luxe",
    label: "Dark Luxe",
    score: 82,
    pass: true,
    accent: "#CBA968",
    note: "Suit hero, champagne accent. Founder authority.",
  },
  {
    slug: "editorial-warm",
    label: "Editorial Warm",
    score: 81,
    pass: true,
    accent: "#5A1A1A",
    note: "Cream serif masthead, oxblood accent.",
  },
  {
    slug: "gallery-exhibition",
    label: "Gallery Exhibition",
    score: 68,
    pass: false,
    accent: "#8A7968",
    note: "Photo-first museum wall. Dark hero.",
  },
  {
    slug: "warm-cinematic",
    label: "Warm Cinematic",
    score: 68,
    pass: false,
    accent: "#E8B14C",
    note: "Moody full-bleed panels. Too dark.",
  },
  {
    slug: "bento-glass",
    label: "Bento Glass",
    score: 62,
    pass: false,
    accent: "#5B6CFF",
    note: "Asymmetric bento grid. Near-black.",
  },
  {
    slug: "cinema-horizontal",
    label: "Cinema Horizontal",
    score: 58,
    pass: false,
    accent: "#FF8A3D",
    note: "Pinned horizontal film-track. Too dark.",
  },
  {
    slug: "gradient-glass",
    label: "Gradient Glass",
    score: 55,
    pass: false,
    accent: "#7C5CFF",
    note: "Pink→violet glass. Dark + generic SaaS.",
  },
];

export default function VariantLinks() {
  return (
    <section
      id="variants-preview"
      className="surface-2 section-y-lg relative"
      aria-label="Design direction live previews"
    >
      <div className="shell">
        <p className="eyebrow mb-4">Design directions · live preview</p>
        <h2 className="serif-display max-w-2xl text-balance text-3xl font-normal leading-[1.05] tracking-[-0.03em] text-chalk sm:text-4xl">
          Pick a direction.{" "}
          <span className="serif-italic text-gold">See it live.</span>
        </h2>
        <p className="mt-4 max-w-xl text-base text-mute">
          Directions for the same founder story, each a full live page. The{" "}
          <span className="text-gold">new founder-glass series</span> keeps the
          glass + gradient feel but with bespoke jewel/metallic palettes and
          editorial type — no AI-SaaS colors, no Inter. Below them: the earlier
          ten, ranked by an independent critic-loop pass.
        </p>

        {/* NEW founder-glass series */}
        <p className="eyebrow mb-4 mt-12 text-gold">
          New · founder-glass series
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {NEW_VARIANTS.map((v, i) => (
            <motion.div
              key={v.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...SPRING_SOFT, delay: Math.min(i * 0.04, 0.3) }}
            >
              <Link
                href={`/v/${v.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-line px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:border-gold/40"
              >
                <span
                  aria-hidden
                  className="h-9 w-1.5 shrink-0 rounded-full"
                  style={{ background: v.accent }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-medium text-chalk">
                      {v.label}
                    </span>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide"
                      style={{
                        background: "rgba(244,192,98,0.14)",
                        color: "#F4C062",
                      }}
                    >
                      NEW
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-mute">
                    {v.note}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-mute transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gold"
                >
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Earlier ten — critic-ranked */}
        <p className="eyebrow mb-4 mt-12 text-mute">
          Earlier ten · critic-ranked
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {VARIANTS.map((v, i) => (
            <motion.div
              key={v.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...SPRING_SOFT, delay: Math.min(i * 0.04, 0.3) }}
            >
              <Link
                href={`/v/${v.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-line px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:border-gold/40"
              >
                <span
                  aria-hidden
                  className="h-9 w-1.5 shrink-0 rounded-full"
                  style={{ background: v.accent }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-medium text-chalk">
                      {v.label}
                    </span>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide"
                      style={
                        v.pass
                          ? {
                              background: "rgba(244,192,98,0.14)",
                              color: "#F4C062",
                            }
                          : {
                              background: "rgba(255,255,255,0.06)",
                              color: "#7a7a8a",
                            }
                      }
                    >
                      {v.pass ? "PASS" : "FAIL"} · {v.score}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-mute">
                    {v.note}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-mute transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gold"
                >
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 font-mono text-xs text-mute/70">
          Full chooser with screenshots:{" "}
          <Link
            href="/variants"
            className="text-gold underline underline-offset-2"
          >
            /variants
          </Link>
        </p>
      </div>
    </section>
  );
}
