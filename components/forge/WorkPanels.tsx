"use client";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/components/useMediaQuery";
import { C, EASE, PROJECTS } from "./tokens";

function statusColor(status: (typeof PROJECTS)[number]["status"]) {
  if (status === "LIVE") return C.live;
  if (status === "DEMO") return C.mute;
  return C.accent;
}

/* Transform-only 3D tilt — desktop + fine pointer only, off under
   reduced-motion. rotateX/Y computed from pointer position relative to the
   card center; reset on leave. No layout reads on move (rect cached on
   enter), matching the Magnetic component's INP-safe pattern. */
function TiltCard({
  children,
  canTilt,
}: {
  children: React.ReactNode;
  canTilt: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  if (!canTilt) {
    return <div ref={ref}>{children}</div>;
  }

  const onEnter = () => {
    rectRef.current = ref.current?.getBoundingClientRect() ?? null;
  };
  const onMove = (e: React.MouseEvent) => {
    const r = rectRef.current;
    const el = ref.current;
    if (!r || !el) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    rectRef.current = null;
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform .18s ease-out", willChange: "transform" }}
    >
      {children}
    </div>
  );
}

export default function WorkPanels() {
  const reduce = !!useReducedMotion();
  const isFine = useMediaQuery("(hover: hover) and (pointer: fine)", false);
  const canTilt = !reduce && isFine;

  return (
    <section id="forge-work" style={{ background: C.canvas }}>
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-6 sm:py-28">
        <motion.div
          initial={{ opacity: 1, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-12"
        >
          <p
            className="font-mono uppercase"
            style={{
              color: C.accent,
              fontSize: "0.72rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
            }}
          >
            Forged so far
          </p>
          <h2
            className="mt-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(1.9rem,4vw,2.9rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.024em",
              color: C.ink,
              maxWidth: "22ch",
            }}
          >
            Real systems, in production — not a mockup.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 1, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: EASE, delay: (i % 3) * 0.06 }}
            >
              <TiltCard canTilt={canTilt}>
                <div
                  className="flex h-full flex-col gap-3 p-7"
                  style={{
                    borderRadius: 18,
                    border: `1px solid ${C.hairline}`,
                    background: C.card,
                    boxShadow:
                      "0 8px 24px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        fontSize: "1.05rem",
                        color: C.ink,
                        lineHeight: 1.15,
                      }}
                    >
                      {p.name}
                    </span>
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1"
                      style={{ background: C.accentTint }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 999,
                          background: statusColor(p.status),
                          display: "inline-block",
                        }}
                        aria-hidden
                      />
                      <span
                        className="font-mono uppercase"
                        style={{
                          color: C.pillInk,
                          fontSize: "0.62rem",
                          fontWeight: 500,
                          letterSpacing: "0.08em",
                        }}
                      >
                        {p.status}
                      </span>
                    </span>
                  </div>
                  <p
                    className="font-mono uppercase"
                    style={{
                      color: C.mute,
                      fontSize: "0.68rem",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {p.sub}
                  </p>
                  <p
                    className="mt-1 font-mono"
                    style={{
                      color: C.pillInk,
                      fontSize: "0.72rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {p.mech}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
