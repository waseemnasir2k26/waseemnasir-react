"use client";
import {
  motion,
  useReducedMotion,
  useInView,
  useAnimation,
} from "framer-motion";
import { ReactNode, useRef, useEffect, Children, isValidElement } from "react";
import { SPRING_SOFT } from "./motion";

interface TextRevealProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  delayChildren?: number;
  /** inview = trigger when enters viewport; mount = trigger immediately on mount */
  mode?: "inview" | "mount";
}

/**
 * Per-word clip-mask spring headline reveal.
 * Plain strings → split on spaces → each word masked.
 * React elements (e.g. <span> serif accents) → each treated as a single masked token.
 * CLS-safe: line-height reserved via pb-[0.15em] on outer span.
 */
export default function TextReveal({
  children,
  as: Tag = "h1",
  className = "",
  delayChildren = 0,
  mode = "inview",
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: "-60px",
  });

  useEffect(() => {
    if (reduce) return;
    if (mode === "mount" || isInView) {
      controls.start("show");
    }
  }, [isInView, mode, controls, reduce]);

  // Reduced-motion: render plain
  if (reduce) {
    const MotionTag = motion[Tag as keyof typeof motion] as React.ElementType;
    return (
      <MotionTag ref={ref} className={className}>
        {children}
      </MotionTag>
    );
  }

  // Tokenise children: strings → words, elements → single token
  const tokens: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (typeof child === "string") {
      const words = child.split(" ");
      words.forEach((word, i) => {
        tokens.push(word);
        // Add space token between words (not after last)
        if (i < words.length - 1) tokens.push(" ");
      });
    } else {
      tokens.push(child);
    }
  });

  const wordVariants = {
    // Transform-only (no opacity:0) so the LCP headline node is painted, not
    // hidden — words are clipped by the overflow-hidden mask, then slide in.
    hidden: { y: "110%" },
    show: (i: number) => ({
      y: "0%",
      opacity: 1,
      transition: {
        ...SPRING_SOFT,
        delay: delayChildren + i * 0.055,
      },
    }),
  };

  const MotionTag = motion[Tag as keyof typeof motion] as React.ElementType;

  let wordIndex = 0;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
    >
      {tokens.map((token, i) => {
        // Render spaces as plain (non-animated) spaces
        if (token === " ") {
          return (
            <span key={i} aria-hidden style={{ display: "inline-block" }}>
              &nbsp;
            </span>
          );
        }

        const index = wordIndex++;

        return (
          // Outer: clips the word (overflow-hidden). pb guards descenders.
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: "0.15em",
              lineHeight: "inherit",
              verticalAlign: "bottom",
            }}
          >
            <motion.span
              custom={index}
              variants={wordVariants}
              style={{ display: "inline-block" }}
            >
              {token}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}
