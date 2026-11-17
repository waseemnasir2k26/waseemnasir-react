/* ============================================================
   UI SYSTEM primitives — server-safe (no hooks).
   Built only from lib/design.ts tokens so every page shares one rhythm.
   ============================================================ */
import Link from "next/link";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { C, SHADOW, SHELL, SECTION_Y, TYPE } from "@/lib/design";

/** Full-bleed band + centered shell. `tone` alternates canvas / surface / deep. */
export function Section({
  id,
  tone = "canvas",
  children,
  className = "",
  innerClassName = "",
}: {
  id?: string;
  tone?: "canvas" | "surface" | "deep";
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  const bg =
    tone === "surface" ? C.surface : tone === "deep" ? C.accentDeep : C.canvas;
  return (
    <section
      id={id}
      className={className}
      style={{ background: bg, scrollMarginTop: 72 }}
    >
      <div className={`${SHELL} ${SECTION_Y} ${innerClassName}`}>{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  color = C.accent,
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span
      className="font-mono uppercase"
      style={{
        color,
        fontSize: "0.72rem",
        fontWeight: 500,
        letterSpacing: "0.12em",
      }}
    >
      {children}
    </span>
  );
}

export function H1({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return <h1 style={{ ...TYPE.h1, ...style }}>{children}</h1>;
}
export function H2({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return <h2 style={{ ...TYPE.h2, ...style }}>{children}</h2>;
}
export function H3({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return <h3 style={{ ...TYPE.h3, ...style }}>{children}</h3>;
}

const ARROW = (
  <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path
      d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Pill button. solid = accent, outline = hairline, onDeep = tint on dark band. */
export function Button({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "onDeep";
  external?: boolean;
  className?: string;
}) {
  const v: Record<string, CSSProperties> = {
    solid: { background: C.accent, color: "#FFFFFF" },
    outline: {
      background: "transparent",
      color: C.accent,
      border: `1px solid ${C.accent}`,
    },
    onDeep: { background: C.accentTint, color: C.accentDeep },
  };
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`bp-cta inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-opacity hover:opacity-90 ${className}`}
      style={{
        ...v[variant],
        fontSize: "0.95rem",
        padding: "0.85rem 1.6rem",
        minHeight: 48,
      }}
    >
      {children}
      {ARROW}
    </Link>
  );
}

/** Photo frame: one soft radius, fixed aspect ratio, next/image fill. */
export function Photo({
  src,
  alt,
  ratio = "4 / 5",
  sizes,
  priority = false,
  position = "center 30%",
  className = "",
  shadow = true,
}: {
  src: string;
  alt: string;
  ratio?: string;
  sizes: string;
  priority?: boolean;
  position?: string;
  className?: string;
  shadow?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: ratio,
        borderRadius: 24,
        background: C.surface,
        boxShadow: shadow ? SHADOW.md : "none",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
