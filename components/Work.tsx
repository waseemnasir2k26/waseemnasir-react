"use client";
import { useReducedMotion } from "framer-motion";
import { useMediaQuery } from "./useMediaQuery";
import Reveal from "./Reveal";
import WorkGallery, { WorkItem } from "./WorkGallery";
import Magnetic from "./Magnetic";
import { BOOKING } from "./site";

// ─── Data ─────────────────────────────────────────────────────────────────────
// Mapped to WorkItem shape expected by WorkGallery.
// "problem" = the client's voiced pain. "outcome" = what was built + the result.
// No invented numbers — only verifiable facts.
const WORK: WorkItem[] = [
  {
    title: "Physical Therapy Clinic — Miami",
    problem:
      "Booking and payments lived in three disconnected tools. Staff spent two hours a day copy-pasting.",
    outcome:
      "Built the site, embedded the booking flow, and added one-click Stripe checkout that unlocks a paid resource the moment payment clears. Staff admin time eliminated.",
    tags: ["Next.js", "Stripe", "Booking"],
  },
  {
    title: "Inbox Automation Engine — Europe",
    problem:
      "A founder drowning in repetitive email triage across five inboxes.",
    outcome:
      "A 47-step n8n system that reads, labels, and drafts replies with AI — plus a self-healing watchdog that restarts before it ever goes silent.",
    tags: ["n8n", "GPT-4o", "Self-healing"],
  },
  {
    title: "Freight Lead System — US",
    problem: "Ad spend with no idea which clicks became real leads.",
    outcome:
      "Meta ads wired to the Conversions API with a consent-compliant instant lead form — every dollar tracked to an actual enquiry, no guessing.",
    tags: ["Meta CAPI", "Lead forms", "Tracking"],
  },
  {
    title: "Family Trip Portal — Italy",
    problem: "Parents wanted to follow their kids' study-trips, privately.",
    outcome:
      "A custom WordPress portal with gated, GDPR-safe galleries built without paid plugins — so it stays cheap to run and simple to maintain.",
    tags: ["WordPress", "Custom plugin", "GDPR"],
  },
];

// ─── Mobile / reduced-motion card ─────────────────────────────────────────────
function MobileCard({ item, index }: { item: WorkItem; index: number }) {
  const n = String(index + 1).padStart(2, "0");

  return (
    <Reveal delay={index * 0.07} variant="rise">
      <article
        role="group"
        aria-label={`Project ${index + 1} of ${WORK.length}: ${item.title}`}
        className="card card-hover card-spotlight group flex h-full flex-col p-7 sm:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        tabIndex={0}
      >
        {/* Eyebrow counter + first tag */}
        <p className="eyebrow mb-4 flex items-center gap-2">
          <span className="font-mono tabular-nums">{n}</span>
          <span aria-hidden className="text-line">
            —
          </span>
          <span>{item.tags[0]}</span>
        </p>

        {/* Title */}
        <h3 className="text-xl font-semibold text-chalk text-balance leading-snug">
          {item.title}
        </h3>

        {/* Problem quote — hang-quote treatment */}
        <p
          className="mt-4 text-sm italic leading-relaxed text-mute"
          style={{ textIndent: "-0.42em", paddingLeft: "0.42em" }}
        >
          &ldquo;{item.problem}&rdquo;
        </p>

        {/* What was built */}
        <p className="mt-3 text-[0.95rem] leading-relaxed text-chalk/80">
          {item.outcome}
        </p>

        {/* Stack chips */}
        <div className="mt-6 flex flex-wrap gap-2 pt-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="chip rounded-full border border-line px-3 py-1 text-xs font-mono text-mute transition-colors duration-200 group-hover:border-accent/40 group-hover:text-accent2"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Work() {
  // Gallery cards are fixed-width (~480px) — only run the pinned horizontal
  // pan where there's genuine room (≥1024px). Tablets fall back to the grid.
  const isDesktop = useMediaQuery("(min-width: 1024px)", false);
  const reduce = useReducedMotion();
  const animated = isDesktop && !reduce;

  return (
    /*
     * Section height is CONDITIONAL:
     *   animated  → h-auto (WorkGallery owns its own tall-track height)
     *   !animated → h-auto (normal vertical flow, no spacer)
     * No empty 320vh spacer is ever injected on mobile.
     */
    <section id="work" className={animated ? "" : "section-y"}>
      {/* ── Section header — always in normal flow ── */}
      <div className={animated ? "shell section-y !pb-16" : "shell"}>
        <Reveal variant="blur">
          <p className="eyebrow">Selected work</p>
          <h2 className="serif-display mt-4 max-w-2xl text-h2-fluid font-normal text-chalk text-balance">
            Real systems, quietly running{" "}
            <span className="serif-italic text-accent2">right now.</span>
          </h2>
        </Reveal>
      </div>

      {/* ── Desktop: pinned horizontal gallery ── */}
      {animated && <WorkGallery items={WORK} />}

      {/* ── Mobile / reduced-motion: vertical grid ── */}
      {!animated && (
        <div className="shell mt-14">
          <div className="grid gap-4 sm:grid-cols-2">
            {WORK.map((w, i) => (
              <MobileCard key={w.title} item={w} index={i} />
            ))}
          </div>

          {/* CTA — mobile inline, matches desktop gallery's final card intent */}
          <Reveal delay={0.18} variant="rise">
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-line bg-white/[0.025] p-7 sm:p-8">
              <p className="text-lg font-medium text-chalk text-balance leading-snug">
                Want a system like these?{" "}
                <span className="text-mute font-normal">
                  Let&apos;s talk through what you need.
                </span>
              </p>
              <Magnetic strength={0.25}>
                <a
                  href={BOOKING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary whitespace-nowrap"
                >
                  Book a 30-min call
                  <span aria-hidden>→</span>
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-8 text-sm text-mute">
              Client names kept private by default — happy to walk you through
              any of these live on a call.
            </p>
          </Reveal>
        </div>
      )}

      {/* Discrete-motion note below gallery (desktop only, outside the sticky) */}
      {animated && (
        <Reveal delay={0.05}>
          <div className="shell pb-16">
            <p className="text-sm text-mute">
              Client names kept private by default — happy to walk you through
              any of these live on a call.
            </p>
          </div>
        </Reveal>
      )}
    </section>
  );
}
