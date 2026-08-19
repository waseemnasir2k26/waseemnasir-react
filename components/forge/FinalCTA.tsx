"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import ForgeMagnetic from "./ForgeMagnetic";
import { C, CTA, CTA_LABEL, EASE } from "./tokens";

/* The core "lands" beside the CTA — a CSS/framer glow orb, not a second
   WebGL context. A brand-new three.js canvas just for one decorative beat
   costs a real init + dispose cycle for very little payoff once the pinned
   runway above has already spent that budget; this keeps the same visual
   language (jade glow, same core silhouette) at zero extra GPU cost.

   `initial`/`whileInView` are unconditional (no useReducedMotion() branch)
   so server and client always compute the identical first-paint markup —
   the root MotionProvider's `reducedMotion="user"` (components/MotionProvider.tsx)
   is the single source of truth that disables the transition itself for
   reduced-motion users; branching here too would just reintroduce an
   SSR/CSR structural mismatch for no benefit. */
export default function FinalCTA() {
  return (
    <section
      id="forge-cta"
      className="relative overflow-hidden"
      style={{ background: C.accentDeep }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(234,244,241,0.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center gap-8 px-6 py-24 text-center sm:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          aria-hidden
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #1AA398, #0A3D38 70%)",
            boxShadow: "0 0 60px rgba(17,126,115,0.55)",
          }}
        />
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(1.9rem,4.5vw,3rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.026em",
            color: C.onDeep,
            maxWidth: "20ch",
          }}
        >
          Your business is leaking time and money. Let's build the fix.
        </h2>
        <p
          style={{
            fontSize: "1.0625rem",
            lineHeight: 1.6,
            color: "rgba(234,244,241,0.78)",
            maxWidth: "48ch",
          }}
        >
          A free audit, no pitch deck — just where you're bleeding and what a
          fix would look like.
        </p>
        <ForgeMagnetic>
          <Link
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
            style={{
              background: C.accent,
              color: "#fff",
              fontSize: "1rem",
              padding: "0.95rem 2rem",
              boxShadow: "0 0 44px rgba(17,126,115,0.5)",
            }}
          >
            {CTA_LABEL}
          </Link>
        </ForgeMagnetic>
      </div>
    </section>
  );
}
