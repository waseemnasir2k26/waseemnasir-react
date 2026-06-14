"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SPRING_SOFT, SPRING_SNAP, SPRING_ITEM } from "./motion";
import { BOOKING } from "./site";

const STEPS = [
  {
    n: "01",
    t: "We talk for 30 minutes",
    d: "You tell me where the time and money leak. I tell you — straight — whether I can fix it and roughly what it takes. No pitch theatre.",
  },
  {
    n: "02",
    t: "I build the one system",
    d: "Not a pile of features. The specific thing that closes the leak, built end-to-end by me, with you in the loop the whole way.",
  },
  {
    n: "03",
    t: "It runs without you",
    d: "You get something that works while you sleep — plus me on call after ship, because a system that breaks silently is worse than none.",
  },
];

// Connector bar: draws in via scaleX (desktop) or scaleY (mobile)
function Connector({ reduced }: { reduced: boolean }) {
  return (
    <>
      {/* Desktop: horizontal line between cards, drawn left→right */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-[5.5rem] hidden h-px md:block"
        style={{ zIndex: 1 }}
      >
        <motion.div
          className="h-full w-full origin-left bg-gradient-to-r from-accent/60 via-accent2/40 to-transparent"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={reduced ? undefined : { ...SPRING_SOFT, delay: 0.2 }}
        />
      </div>

      {/* Mobile: vertical line, drawn top→bottom */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-8 top-0 w-px md:hidden"
        style={{ zIndex: 1 }}
      >
        <motion.div
          className="h-full w-full origin-top bg-gradient-to-b from-accent/60 via-accent2/40 to-transparent"
          initial={reduced ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={reduced ? undefined : { ...SPRING_SOFT, delay: 0.15 }}
        />
      </div>
    </>
  );
}

export default function Process() {
  const reduced = useReducedMotion() ?? false;

  // When reduced-motion, swap container/item variants to instant renders
  const containerVariants = reduced
    ? { hidden: {}, show: {} }
    : {
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
          },
        },
      };

  const itemVariants = reduced ? { hidden: {}, show: {} } : SPRING_ITEM;

  return (
    <section className="relative py-24 md:py-36">
      <div className="shell">
        {/* Section header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={reduced ? undefined : { ...SPRING_SOFT, delay: 0 }}
        >
          <p className="eyebrow">How working together works</p>
          <h2 className="mt-4 max-w-2xl text-h2-fluid font-semibold text-chalk text-balance">
            Simple, because{" "}
            <span className="font-serif font-light italic text-accent2">
              it&apos;s just me.
            </span>
          </h2>
        </motion.div>

        {/* Step grid with connector overlay */}
        <div className="relative mt-14">
          <Connector reduced={reduced} />

          <motion.div
            className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {STEPS.map((s) => (
              <motion.div
                key={s.n}
                variants={itemVariants}
                className="group relative h-full bg-ink p-8 transition-colors duration-300 hover:bg-white/[0.03] md:p-10"
              >
                {/* Subtle card spotlight on hover (GPU-safe, transform only via CSS var) */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(320px circle at 50% 0%, rgba(109,94,246,0.07), transparent 70%)",
                  }}
                />

                {/* Step number — spring-scales in, warms to indigo on group hover */}
                <motion.div
                  className="step-num font-serif text-6xl font-light tabular-nums text-white/10 transition-colors duration-300 group-hover:text-accent/50 md:text-7xl"
                  initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={
                    reduced
                      ? undefined
                      : {
                          ...SPRING_SNAP,
                          delay: 0.05 + parseInt(s.n, 10) * 0.12,
                        }
                  }
                >
                  {s.n}
                </motion.div>

                <h3 className="mt-6 text-xl font-semibold tracking-[-0.015em] text-chalk">
                  {s.t}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{s.d}</p>

                {/* Step 03 gets a subtle 'runs' badge */}
                {s.n === "03" && (
                  <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium text-accent2">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent2"
                    />
                    Runs 24 / 7
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mid-funnel soft CTA — quieter than Hero/FinalCTA to preserve climax */}
        <motion.div
          className="mt-10 flex items-center justify-center md:justify-start"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={reduced ? undefined : { ...SPRING_SOFT, delay: 0.45 }}
        >
          <a
            href={BOOKING}
            className="btn-ghost group inline-flex items-center gap-2 text-sm text-mute transition-colors duration-200 hover:text-chalk"
            target="_blank"
            rel="noopener noreferrer"
          >
            Start with a 30-min call
            <span
              aria-hidden
              className="inline-block translate-x-0 transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
