"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useRef, useEffect } from "react";
import Magnetic from "./Magnetic";
import TextReveal from "./TextReveal";
import CountUp from "./CountUp";
import {
  STAGGER_CONTAINER,
  SPRING_ITEM,
  SPRING_SNAP,
  SPRING_SOFT,
} from "./motion";
import { BOOKING, PROOF } from "./site";

// ─── Presence dot: spring-breathing pulse ────────────────────────────────────
function PresenceDot() {
  const reduce = useReducedMotion();
  return (
    <span className="relative flex h-2 w-2">
      {!reduce && (
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
          animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
          transition={{
            duration: 2.4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      )}
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
    </span>
  );
}

// ─── Vivid bloom gradient behind headline ────────────────────────────────────
function HeadlineBloom({ scrollY }: { scrollY: MotionValue<number> }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      style={reduce ? {} : { y: scrollY }}
      className="pointer-events-none absolute -left-24 -top-16 hidden h-[480px] w-[680px] md:block"
    >
      <div
        className="h-full w-full rounded-full opacity-[0.42]"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 40% 50%, #7B6CFF 0%, #B7AAFF 38%, rgba(244,192,98,0.08) 75%, transparent 100%)",
          filter: "blur(72px)",
        }}
      />
    </motion.div>
  );
}

// ─── Portrait with pointer tilt + scroll parallax ────────────────────────────
function Portrait({ parallaxY }: { parallaxY: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, SPRING_SNAP);
  const springRY = useSpring(rotateY, SPRING_SNAP);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - (rect.left + rect.width / 2);
      const cy = e.clientY - (rect.top + rect.height / 2);
      rotateY.set((cx / (rect.width / 2)) * 6);
      rotateX.set(-(cy / (rect.height / 2)) * 6);
    };

    const onLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce, rotateX, rotateY]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...SPRING_SOFT, delay: 0.3 }}
      style={reduce ? {} : { y: parallaxY }}
      className="relative mx-auto w-full max-w-sm lg:max-w-none"
    >
      {/* Tilt wrapper — only responds to pointer:fine */}
      <motion.div
        ref={ref}
        style={
          reduce
            ? {}
            : {
                rotateX: springRX,
                rotateY: springRY,
                transformPerspective: 1000,
              }
        }
        className="rule-gold relative overflow-hidden rounded-[1.75rem] border border-line"
      >
        {/* Over-scale the image so parallax never reveals an edge */}
        <div className="relative scale-[1.06]">
          <Image
            src="/img/hero-portrait.jpg"
            alt="Waseem Nasir — founder, SkynetLabs"
            width={720}
            height={900}
            priority
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-line bg-ink/60 px-4 py-3 backdrop-blur-md">
          <div>
            <div className="text-sm font-medium text-chalk">Waseem Nasir</div>
            <div className="text-xs text-mute">Founder · SkynetLabs</div>
          </div>
          <div className="font-mono text-[0.65rem] uppercase tracking-widest text-gold">
            Bali · remote
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll progress for this section only
  const { scrollYProgress: heroProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Text column fades out as hero scrolls away
  const textOpacity = useTransform(heroProgress, [0, 0.75], [1, 0]);
  const textY = useTransform(heroProgress, [0, 1], [0, 40]);

  // Portrait scrolls slower = depth parallax
  const portraitY = useTransform(heroProgress, [0, 1], [0, 60]);

  // Bloom lags even more
  const bloomY = useTransform(heroProgress, [0, 1], [0, 90]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 md:pt-44 md:pb-28"
    >
      {/* ── Vivid bloom ── */}
      <HeadlineBloom scrollY={bloomY} />

      <div className="shell grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ── Text column ── */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="show"
          style={reduce ? {} : { opacity: textOpacity, y: textY }}
        >
          {/* Availability badge */}
          <motion.div
            variants={SPRING_ITEM}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1.5"
          >
            <PresenceDot />
            <span className="eyebrow !text-chalk/70">
              Independent · a few builds a month
            </span>
          </motion.div>

          {/* Headline — per-word clip-mask spring reveal */}
          <motion.div variants={SPRING_ITEM} className="relative mt-7">
            <TextReveal
              as="h1"
              mode="mount"
              delayChildren={0.1}
              className="serif-display text-mega font-normal text-chalk text-balance"
            >
              {"I make your busywork "}
              <span className="serif-italic text-gold">disappear.</span>
            </TextReveal>
          </motion.div>

          {/* Body */}
          <motion.p
            variants={SPRING_ITEM}
            className="mt-7 max-w-xl text-lead leading-relaxed text-mute"
          >
            I&apos;m Waseem — a founder who builds the quiet AI systems that run
            behind a business, so the owner stops doing robot work. Missed
            leads, dead follow-ups, manual ops that eat your week. I find the
            leak and engineer it shut.
          </motion.p>

          {/* CTA row */}
          <motion.div
            variants={SPRING_ITEM}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href={BOOKING}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Book a 30-min call
                <span aria-hidden>→</span>
              </a>
            </Magnetic>
            <a href="#work" className="btn-ghost">
              See what I&apos;ve built
            </a>
          </motion.div>

          {/* Trust caption */}
          <motion.p
            variants={SPRING_ITEM}
            className="mt-3 text-xs text-mute/60 tracking-wide"
          >
            Free · 30 min · no pitch
          </motion.p>

          {/* Stats with CountUp — rendered from PROOF (single source of truth) */}
          <motion.div
            variants={SPRING_ITEM}
            className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4"
          >
            {PROOF.map((p) => (
              <div key={p.label}>
                <div className="serif-num text-3xl text-gold">
                  <CountUp
                    to={p.value}
                    suffix={p.suffix}
                    roll={"roll" in p ? p.roll : true}
                  />
                </div>
                <div className="mt-1 text-xs leading-snug text-mute">
                  {p.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Portrait column ── */}
        <Portrait parallaxY={portraitY} />
      </div>
    </section>
  );
}
