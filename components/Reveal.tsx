"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { SPRING_SOFT } from "./motion";

type RevealVariant = "rise" | "blur" | "clip";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  variant?: RevealVariant;
  className?: string;
}

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  variant = "rise",
  className = "",
}: RevealProps) {
  const reduce = useReducedMotion();

  // Reduced-motion: render immediately, no animation wrapper
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const initial: Record<string, number | string> = { opacity: 0, y };
  const animate: Record<string, number | string> = { opacity: 1, y: 0 };

  if (variant === "blur") {
    // Filter blur — restrict to headlines only (GPU-expensive on grids)
    initial.filter = "blur(8px)";
    animate.filter = "blur(0px)";
  }

  if (variant === "clip") {
    // Clip-mask style: rise with a slight scale
    initial.scale = 0.97;
    animate.scale = 1;
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...SPRING_SOFT, delay }}
    >
      {children}
    </motion.div>
  );
}
