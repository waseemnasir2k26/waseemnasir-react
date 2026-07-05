/* ============================================================
   BLOG · shared chrome + prose primitives
   Matches the LIVE "blueprint" design system 1:1 (see
   app/v/blueprint/page.tsx): light paper canvas, smoky jade-teal
   accent, ink-jade depth, Bricolage Grotesque + Hanken Grotesk +
   JetBrains Mono, node/blueprint motifs.

   Server component (no hooks) — fully static, SSR, print-safe.
   Hover affordances are CSS-only via the scoped <style> block.
   ============================================================ */

import Link from "next/link";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
} from "next/font/google";

/* ─── Fonts (self-hosted at build via next/font/google) ─── */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800"],
});
const body = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

/* ─── Tokens (identical to blueprint C / SHADOW) ─── */
export const C = {
  canvas: "#FBFCFD",
  surface: "#F4F8F7",
  card: "#FFFFFF",
  ink: "#0E1B1A",
  body: "#3C4744",
  mute: "#5B6764",
  hairline: "#E2EAE8",
  accent: "#117E73",
  accentDeep: "#0A3D38",
  accentTint: "#E2F1EE",
  pillInk: "#0C5F57",
  live: "#15A06B",
  onDeep: "#EAF4F1",
};
export const SHADOW = {
  sm: "0 1px 2px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
  md: "0 8px 24px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
  lg: "0 24px 48px rgba(8,40,38,0.10), 0 0 0 1px rgba(8,40,38,0.05)",
};
export const CTA = "https://skynetjoe.com/discovery-call";
export const IMG = (f: string) => `/img/pro/${f}`;

/* ─── Mono label ─── */
export function Mono({
  children,
  color = C.mute,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`font-mono uppercase ${className}`}
      style={{
        color,
        fontSize: "0.72rem",
        fontWeight: 500,
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </span>
  );
}

/* ─── Tag pill (kind badge) ─── */
export function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono uppercase"
      style={{
        background: C.accentTint,
        border: "1px solid rgba(17,126,115,0.25)",
        borderRadius: 999,
        padding: "0.3rem 0.75rem",
        fontSize: "0.66rem",
        fontWeight: 500,
        letterSpacing: "0.1em",
        color: C.pillInk,
      }}
    >
      {children}
    </span>
  );
}

/* ============================================================
   SCOPED STYLE — light canvas override (global body is dark for
   the other variants) + CSS-only hover affordances.
   ============================================================ */
function ScopeStyle() {
  return (
    <style>{`
      html, body { background: ${C.canvas} !important; color-scheme: light !important; }
      .blog-root { font-synthesis: none; }
      .bp-link { position: relative; }
      .bp-link::after { content:""; position:absolute; left:0; bottom:-3px; height:1px; width:100%;
        background:${C.accent}; transform:scaleX(0); transform-origin:left; transition:transform .16s ease; }
      .bp-link:hover::after { transform:scaleX(1); }
      .bp-cta:active { transform: scale(0.97); }
      @media (hover:hover) and (pointer:fine){
        .bp-postcard { transition: transform .22s ease-out, box-shadow .22s ease-out, border-color .22s ease-out; }
        .bp-postcard:hover { transform: translateY(-4px); box-shadow:${SHADOW.md}; border-color: rgba(17,126,115,0.28); }
        .bp-postcard:hover .bp-postcard-arrow { transform: translateX(3px); }
        .bp-postcard-arrow { transition: transform .18s ease-out; display:inline-block; }
      }
      :focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; border-radius: 4px; }
    `}</style>
  );
}

/* ============================================================
   NAV — static blueprint header (no scroll hook; always hairline)
   ============================================================ */
function Nav() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40"
      style={{
        height: 64,
        background: "rgba(251,252,253,0.82)",
        backdropFilter: "blur(16px) saturate(170%)",
        WebkitBackdropFilter: "blur(16px) saturate(170%)",
        borderBottom: `1px solid ${C.hairline}`,
      }}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-5 sm:px-6">
        <Link href="/" className="flex flex-col leading-none">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1rem",
              color: C.ink,
              letterSpacing: "-0.01em",
            }}
          >
            Waseem Nasir
          </span>
          <span
            className="font-mono"
            style={{
              color: C.mute,
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              marginTop: 3,
            }}
          >
            FOUNDER · SKYNETLABS
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {(
            [
              ["/#how", "Work"],
              ["/#proof", "Proof"],
              ["/blog", "Blog"],
              ["/#about", "About"],
            ] as [string, string][]
          ).map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="bp-link font-medium"
              style={{ color: C.body, fontSize: "0.92rem" }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href={CTA}
          target="_blank"
          rel="noopener noreferrer"
          className="bp-cta inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
          style={{
            background: C.accent,
            color: "#fff",
            fontSize: "0.85rem",
            padding: "0.5rem 1.1rem",
            boxShadow: SHADOW.sm,
          }}
        >
          Book a call
        </Link>
      </div>
    </header>
  );
}

/* ============================================================
   FOOTER — blueprint dot-matrix; Blog added to Explore
   ============================================================ */
function SiteFooter() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: C.surface, borderTop: `2px solid ${C.accentDeep}` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${C.hairline} 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
          opacity: 0.55,
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-5 py-20 sm:px-6">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "1.15rem",
                color: C.ink,
              }}
            >
              Waseem Nasir · SkynetLabs
            </span>
            <p
              className="mt-3"
              style={{ color: C.body, fontSize: "0.95rem", maxWidth: "32ch" }}
            >
              AI automation for service businesses &amp; stores.
            </p>
            <div className="mt-5 flex flex-col gap-1">
              <Mono color={C.mute} className="!tracking-[0.06em]">
                Lahore · Bali
              </Mono>
              <a
                href="mailto:waseem@skynetjoe.com"
                className="bp-link"
                style={{
                  color: C.accent,
                  fontSize: "0.9rem",
                  width: "fit-content",
                }}
              >
                waseem@skynetjoe.com
              </a>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-12 gap-y-6" aria-label="Footer">
            {[
              [
                "Explore",
                [
                  ["/#how", "Work"],
                  ["/#proof", "Proof"],
                  ["/blog", "Blog"],
                  ["/#about", "About"],
                ],
              ],
              [
                "Connect",
                [
                  [CTA, "Book a free audit"],
                  ["https://www.linkedin.com/in/waseemnasir2k26", "LinkedIn"],
                  ["https://x.com/skynetlabs", "X (Twitter)"],
                  ["https://youtube.com/@skynetlabs", "YouTube"],
                  ["https://github.com/waseemnasir2k26", "GitHub"],
                  ["https://skynetjoe.com", "skynetjoe.com"],
                ],
              ],
            ].map(([title, links]) => (
              <div key={title as string}>
                <Mono color={C.mute}>{title as string}</Mono>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {(links as [string, string][]).map(([href, label]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="bp-link"
                        style={{ color: C.body, fontSize: "0.92rem" }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div
          className="mt-16 flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center"
          style={{ borderColor: C.hairline }}
        >
          <Mono color={C.pillInk}>
            Built by the person who answers your call
          </Mono>
          <Mono color={C.mute} className="!tracking-[0.06em]">
            © 2026 Waseem Nasir
          </Mono>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   SHELL — wraps every blog page (index + posts)
   ============================================================ */
export function BlogShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScopeStyle />
      <main
        id="main-content"
        className={`blog-root relative ${display.variable} ${body.variable} ${mono.variable}`}
        style={{
          background: C.canvas,
          color: C.body,
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          overflowX: "clip",
          paddingTop: 64,
        }}
      >
        <Nav />
        {children}
        <SiteFooter />
      </main>
    </>
  );
}

/* ============================================================
   PROSE PRIMITIVES — blueprint-tuned long-form typography
   ============================================================ */
export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 400,
        fontSize: "clamp(1.25rem,2.2vw,1.5rem)",
        lineHeight: 1.5,
        letterSpacing: "-0.01em",
        color: C.ink,
      }}
    >
      {children}
    </p>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "1.0625rem",
        lineHeight: 1.72,
        color: C.body,
      }}
    >
      {children}
    </p>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: "clamp(1.5rem,3vw,2rem)",
        lineHeight: 1.12,
        letterSpacing: "-0.022em",
        color: C.ink,
      }}
    >
      {children}
    </h2>
  );
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: C.ink, fontWeight: 600 }}>{children}</strong>;
}

export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      style={{
        borderLeft: `3px solid ${C.accent}`,
        background: C.surface,
        borderRadius: 12,
        padding: "1.25rem 1.5rem",
        margin: 0,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(1.15rem,2vw,1.35rem)",
          lineHeight: 1.4,
          letterSpacing: "-0.015em",
          color: C.ink,
        }}
      >
        {children}
      </p>
    </blockquote>
  );
}

/* Ordered/step list styled as blueprint node rows */
export function StepList({
  steps,
}: {
  steps: { h: string; d: React.ReactNode }[];
}) {
  return (
    <ol
      className="flex flex-col gap-3"
      style={{ listStyle: "none", padding: 0, margin: 0 }}
    >
      {steps.map((s, i) => (
        <li
          key={s.h}
          className="flex items-start gap-4 rounded-xl px-5 py-4"
          style={{
            background: C.card,
            border: `1px solid ${C.hairline}`,
            boxShadow: SHADOW.sm,
          }}
        >
          <span
            className="font-mono"
            style={{
              color: C.accent,
              fontSize: "0.72rem",
              fontWeight: 500,
              marginTop: 3,
              flexShrink: 0,
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <span
              style={{ color: C.ink, fontWeight: 600, fontSize: "1.02rem" }}
            >
              {s.h}
            </span>
            <p
              className="mt-1"
              style={{ color: C.body, fontSize: "0.97rem", lineHeight: 1.6 }}
            >
              {s.d}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* Soft closing CTA — the single link out to the discovery call / skill */
export function SoftCTA({
  href,
  label,
  note,
}: {
  href: string;
  label: string;
  note?: string;
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 20,
        border: `1px solid ${C.hairline}`,
        background: C.accentDeep,
        boxShadow: SHADOW.lg,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(234,244,241,0.10) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative flex flex-col items-start gap-5 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(1.15rem,2vw,1.5rem)",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            maxWidth: "34ch",
          }}
        >
          {note}
        </p>
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="bp-cta inline-flex shrink-0 items-center rounded-full font-semibold transition-opacity hover:opacity-90"
          style={{
            background: C.accentTint,
            color: C.accentDeep,
            fontSize: "0.95rem",
            padding: "0.85rem 1.6rem",
            boxShadow: SHADOW.md,
          }}
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
