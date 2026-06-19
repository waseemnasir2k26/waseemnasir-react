"use client";

import { useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import { STAGGER_CONTAINER, SPRING_ITEM } from "./motion";

// ─── Card data ────────────────────────────────────────────────────────────────

const CARDS = [
  {
    k: "01",
    tag: "Leads slipping",
    title: "Enquiries that never get answered",
    body: "A missed call at 9pm is a lost customer by morning. I wire up systems that catch every lead and reply in seconds — not the next business day.",
    span: "md:col-span-6",
    feature: true,
  },
  {
    k: "02",
    tag: "Manual ops",
    title: "Work a robot should be doing",
    body: "Sorting inbox, chasing follow-ups, copy-pasting between tools. I build n8n automations that run it quietly in the background, 24/7.",
    span: "md:col-span-3",
    feature: false,
  },
  {
    k: "03",
    tag: "Invisible online",
    title: "Customers can't find you",
    body: "When people ask ChatGPT or Google for someone like you and your name never comes up. I fix the site and the structured data underneath it, so your name surfaces when people ask.",
    span: "md:col-span-3",
    feature: false,
  },
  {
    k: "04",
    tag: "Half-built systems",
    title: "Tools that don't talk to each other",
    body: "Your site, CRM, payments and inbox living on separate islands. I connect them into one system you can actually run.",
    span: "md:col-span-3",
    feature: false,
  },
  {
    k: "05",
    tag: "One person",
    title: "You, accountable — start to ship",
    body: "No account managers, no handoffs. You talk to the person building it. That's the whole point.",
    span: "md:col-span-3",
    feature: false,
  },
] as const;

// ─── Spotlight card ───────────────────────────────────────────────────────────
// Uses a shared rAF ref to throttle --mx/--my updates to one write per frame.

function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    if (rafId.current !== null) return; // already queued

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      ref.current.style.setProperty("--mx", `${x}%`);
      ref.current.style.setProperty("--my", `${y}%`);
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Solve() {
  const prefersReduced = useReducedMotion();

  // When reduced-motion is preferred we skip the stagger container entirely
  // and fall back to the static layout — cards still visible, just no motion.
  const gridContent = (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-6">
      {CARDS.map((c) => (
        <motion.div
          key={c.k}
          variants={prefersReduced ? undefined : SPRING_ITEM}
          className={c.span}
        >
          <SpotlightCard className="group h-full">
            <div
              className={[
                "card card-hover card-spotlight h-full",
                c.feature ? "card--feature p-8 md:p-10" : "p-7",
              ].join(" ")}
            >
              {/* Header row: tag + ghost number */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  {c.tag}
                </span>
                {/* Ghost number shifts from white/15 → gold on group hover */}
                <span
                  className={[
                    "step-num serif-num transition-colors duration-300",
                    c.feature ? "text-4xl" : "text-2xl",
                    "text-white/15 group-hover:text-gold/60",
                  ].join(" ")}
                >
                  {c.k}
                </span>
              </div>

              <h3
                className={[
                  "font-medium text-chalk",
                  c.feature ? "mt-6 text-h3-fluid md:max-w-md" : "mt-5 text-xl",
                ].join(" ")}
              >
                {c.title}
              </h3>
              <p
                className={[
                  "mt-3 leading-relaxed text-mute",
                  c.feature ? "text-[0.95rem] md:max-w-lg" : "text-sm",
                ].join(" ")}
              >
                {c.body}
              </p>
            </div>
          </SpotlightCard>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section id="solve" className="surface-1 section-y">
      <div className="shell">
        {/* Section header */}
        <Reveal>
          <p className="eyebrow">What I solve</p>
          <h2 className="serif-display text-h2-fluid text-balance mt-4 max-w-2xl font-normal text-chalk">
            Most businesses aren&apos;t missing effort.
            <br />
            They&apos;re{" "}
            <span className="serif-italic text-accent2">leaking it.</span>
          </h2>
          <p className="mt-5 max-w-xl text-mute">
            I don&apos;t sell a stack of services. I find the specific place
            your business loses time or money — and build the one system that
            closes it.
          </p>
        </Reveal>

        {/* Card grid — stagger container or plain div depending on motion pref */}
        {prefersReduced ? (
          gridContent
        ) : (
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15%" }}
          >
            {gridContent}
          </motion.div>
        )}
      </div>
    </section>
  );
}
