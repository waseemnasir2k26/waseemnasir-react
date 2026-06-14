"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Reveal from "./Reveal";
import { GITHUB, AGENCY } from "./site";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax: image drifts -6% → +6% as section scrolls through viewport.
  // Gate to 0 when user prefers reduced motion.
  const rawY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const imageY = prefersReduced ? "0%" : rawY;

  return (
    <section id="about" ref={sectionRef} className="py-28 md:py-40">
      <div className="shell grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        {/* ── Image column ── */}
        <Reveal className="order-2 lg:order-1">
          {/* Outer clip: hides overscroll edges from parallax */}
          <div className="relative overflow-hidden rounded-[1.75rem] border border-line">
            {/* Inner wrapper moves; outer keeps shape */}
            <motion.div
              style={{ y: imageY }}
              className="relative"
              /* Scale slightly so -6%/+6% travel never exposes edge gaps */
              initial={{ scale: 1.13 }}
              animate={{ scale: 1.13 }}
            >
              <Image
                src="/img/about.jpg"
                alt="Waseem Nasir working"
                width={680}
                height={820}
                sizes="(max-width: 1024px) 90vw, 45vw"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
          </div>
        </Reveal>

        {/* ── Copy column ── */}
        <Reveal delay={0.08} className="order-1 lg:order-2">
          <p className="eyebrow">About</p>

          <h2 className="text-h2-fluid text-balance mt-4 font-semibold text-chalk">
            From Pakistan to Bali,
            <br />
            <span className="font-serif font-light italic text-accent2">
              building since 2019.
            </span>
          </h2>

          <div className="mt-6 space-y-4 text-mute">
            <p className="text-lead">
              I started SkynetLabs to do one thing well: take the boring,
              breaking, money-leaking parts of a business and engineer them out
              of existence with software.
            </p>
            <p className="text-lead">
              I&apos;m a builder before I&apos;m a seller. I&apos;d rather show
              you a working system than a slide deck — which is why I keep my
              plate to a few projects a month and stay hands-on with every one
              of them.
            </p>
            <p className="text-lead text-chalk/80">
              One rule runs through everything I ship: no invented numbers, no
              smoke. If I can&apos;t prove it, I won&apos;t claim it.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <a
              href={AGENCY}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex min-h-[44px] items-center py-1.5 -my-1.5 text-chalk transition-colors hover:text-accent2"
            >
              SkynetLabs ↗
            </a>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex min-h-[44px] items-center py-1.5 -my-1.5 text-chalk transition-colors hover:text-accent2"
            >
              GitHub ↗
            </a>
            <span className="text-mute">Bali, Indonesia · works worldwide</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
