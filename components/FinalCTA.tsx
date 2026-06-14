"use client";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import Magnetic from "./Magnetic";
import TextReveal from "./TextReveal";
import CountUp from "./CountUp";
import { SPRING_SOFT } from "./motion";
import { BOOKING, EMAIL, PROOF } from "./site";

export default function FinalCTA() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef as React.RefObject<Element>, {
    once: true,
    margin: "-80px",
  });

  // Scroll-reactive radial bloom: fades up and scales slightly as card enters view
  const bloomAnimate = reduce
    ? { opacity: 0.22, scale: 1 }
    : isInView
      ? { opacity: 0.4, scale: 1.08 }
      : { opacity: 0.22, scale: 1 };

  return (
    <section id="contact" className="relative py-28 md:py-40">
      <div className="shell">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={SPRING_SOFT}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-line px-7 py-16 text-center md:px-14 md:py-24">
            {/* Scroll-reactive radial bloom — warm re-light moment before the ask */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              animate={bloomAnimate}
              transition={SPRING_SOFT}
              style={{
                background:
                  "radial-gradient(44rem 28rem at 50% 0%, rgba(109,94,246,0.28), transparent 70%)",
                willChange: "transform, opacity",
              }}
            />

            {/* Secondary warm accent — amber blush, very subtle */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              animate={
                reduce
                  ? { opacity: 0.08, scale: 1 }
                  : isInView
                    ? { opacity: 0.13, scale: 1.05 }
                    : { opacity: 0.08, scale: 1 }
              }
              transition={{ ...SPRING_SOFT, delay: 0.1 }}
              style={{
                background:
                  "radial-gradient(28rem 16rem at 65% 100%, rgba(245,181,68,0.35), transparent 70%)",
                willChange: "transform, opacity",
              }}
            />

            {/* Proof strip — real numbers, single mono row */}
            <motion.div
              className="mx-auto mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ...SPRING_SOFT, delay: 0.05 }}
            >
              {PROOF.map(({ value, suffix, label, ...rest }) => (
                <div
                  key={label}
                  className="flex items-baseline gap-1.5"
                  aria-label={`${value}${suffix} ${label}`}
                >
                  <span className="font-mono text-base font-semibold tracking-tight text-chalk sm:text-lg">
                    <CountUp
                      to={value}
                      suffix={suffix}
                      roll={"roll" in rest ? rest.roll !== false : true}
                      durationMs={1200}
                    />
                  </span>
                  <span className="eyebrow !text-xs !text-mute/80">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Headline — per-word spring reveal via TextReveal */}
            <p className="eyebrow mb-5">Have a problem worth solving?</p>

            <TextReveal
              as="h2"
              mode="inview"
              delayChildren={0.08}
              className="mx-auto max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-chalk sm:text-5xl lg:text-[3.5rem]"
            >
              {"Tell me what’s "}
              <span className="font-serif font-light italic text-accent2">
                slowing you down.
              </span>
            </TextReveal>

            {/* Sub-copy */}
            <motion.p
              className="mx-auto mt-6 max-w-xl text-base text-mute"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...SPRING_SOFT, delay: 0.28 }}
            >
              Thirty minutes, free, no pitch. You leave knowing exactly what
              it&apos;d take to fix — whether you hire me or not.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...SPRING_SOFT, delay: 0.38 }}
            >
              <Magnetic>
                <a
                  href={BOOKING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base"
                >
                  Book a 30-min call
                  <span aria-hidden>→</span>
                </a>
              </Magnetic>
              <a href={`mailto:${EMAIL}`} className="btn-ghost">
                Or email me
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
