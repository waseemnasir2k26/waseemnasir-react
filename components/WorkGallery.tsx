"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useMotionValue,
  MotionValue,
} from "framer-motion";
import { SPRING_SOFT } from "./motion";
import { BOOKING } from "./site";

export interface WorkItem {
  title: string;
  problem: string;
  outcome: string;
  tags: string[];
  href?: string;
}

interface WorkGalleryProps {
  items: WorkItem[];
}

const CARD_W = 480; // px
const CARD_GAP = 32; // px
const SIDE_PEEK = 120; // px

/**
 * Pinned horizontal-scroll Work gallery.
 * Outer track is tall (items.length * 80vh); inner sticky h-screen drives x.
 * useScroll → useTransform → useSpring — Lenis-safe, no nested overflow-scroll.
 * Each card: focusable with role=group aria-label="Project i of n".
 * Final panel is a CTA card.
 */
export default function WorkGallery({ items }: WorkGalleryProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const counterVal = useMotionValue(1);
  const totalCards = items.length + 1;

  // Measure viewport so the final card lands centered (no half-parked card /
  // empty right gutter on common laptop widths). SSR default reconciles on mount.
  const [vw, setVw] = useState(1440);
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const xStart = SIDE_PEEK;
  const lastCardLeft = (totalCards - 1) * (CARD_W + CARD_GAP);
  const xEnd = vw / 2 - CARD_W / 2 - lastCardLeft;

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const xRaw = useTransform(scrollYProgress, [0, 1], [xStart, xEnd]);
  const x = useSpring(xRaw, { ...SPRING_SOFT, mass: 0.6 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.round(v * (totalCards - 1)) + 1;
    counterVal.set(Math.min(idx, totalCards));
  });

  // Format "01 / 05" — pad both sides
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      ref={outerRef}
      style={{ height: `${totalCards * 64}vh` }}
      aria-label="Work gallery"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Counter — one component per slot avoids hooks-in-loop */}
        <div className="absolute top-8 right-8 z-10 font-mono text-xs text-mute select-none pointer-events-none">
          {Array.from({ length: totalCards }, (_, i) => i + 1).map((n) => (
            <CounterSlot
              key={n}
              n={n}
              total={totalCards}
              counterVal={counterVal}
              pad={pad}
            />
          ))}
        </div>

        {/* Progress rail */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-line rounded-full overflow-hidden"
          aria-hidden
        >
          <motion.div
            className="h-full bg-accent rounded-full origin-left"
            style={{ scaleX: scrollYProgress }}
          />
        </div>

        {/* Horizontal strip */}
        <motion.div
          className="flex gap-8 edge-fade-x will-change-transform"
          style={{ x }}
        >
          {items.map((item, i) => (
            <ProjectCard
              key={item.title}
              item={item}
              index={i}
              total={totalCards}
            />
          ))}

          {/* CTA card */}
          <article
            role="group"
            aria-label={`Project ${items.length + 1} of ${totalCards} — Book a call`}
            className="card card-hover flex-shrink-0 flex flex-col justify-between p-8 md:p-10"
            style={{ width: CARD_W, minHeight: 420 }}
          >
            <div>
              <p className="eyebrow mb-6">Ready to start?</p>
              <p className="text-h2-fluid font-serif font-light text-chalk text-balance leading-tight">
                Want a system like these?
              </p>
            </div>
            <div className="mt-10">
              <a
                href={BOOKING}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Book a 30-min call
                <span aria-hidden>→</span>
              </a>
            </div>
          </article>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * One slot in the "01 / 05" counter.
 * Extracted as its own component so useTransform is called at component
 * top-level — never inside a .map() callback (hooks-in-loop violation).
 */
function CounterSlot({
  n,
  total,
  counterVal,
  pad,
}: {
  n: number;
  total: number;
  counterVal: MotionValue<number>;
  pad: (n: number) => string;
}) {
  // Hook at top level — safe because this is a proper component
  const opacity = useTransform(counterVal, [n - 0.5, n, n + 0.5], [0, 1, 0]);

  return (
    <motion.span
      style={{ opacity, position: "absolute", whiteSpace: "nowrap" }}
    >
      {pad(n)} / {pad(total)}
    </motion.span>
  );
}

function ProjectCard({
  item,
  index,
  total,
}: {
  item: WorkItem;
  index: number;
  total: number;
}) {
  const Tag = item.href ? "a" : "article";
  const extraProps = item.href
    ? {
        href: item.href,
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <Tag
      {...extraProps}
      role="group"
      aria-label={`Project ${index + 1} of ${total}: ${item.title}`}
      className="card card-hover card-spotlight flex-shrink-0 flex flex-col justify-between p-8 md:p-10 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      style={{ width: CARD_W, minHeight: 420 }}
      tabIndex={item.href ? 0 : undefined}
    >
      <div>
        <p className="eyebrow mb-5">
          0{index + 1} — {item.tags[0]}
        </p>
        <h3 className="text-xl font-semibold text-chalk mb-4 text-balance">
          {item.title}
        </h3>
        <p
          className="text-mute text-sm leading-relaxed"
          style={{ textIndent: "-0.42em", paddingLeft: "0.42em" }}
        >
          &ldquo;{item.problem}&rdquo;
        </p>
      </div>

      <div className="mt-8">
        <p className="text-sm text-chalk/80 mb-5 leading-relaxed">
          {item.outcome}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="chip text-xs font-mono px-2.5 py-1 rounded-full border border-line text-mute transition-colors duration-200 group-hover:border-accent/40 group-hover:text-accent2"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Tag>
  );
}
