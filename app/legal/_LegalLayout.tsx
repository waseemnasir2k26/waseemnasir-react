import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared shell for the legal pages (/privacy, /terms).
 *
 * Palette is lifted from app/v/blueprint/BlueprintClient.tsx so these pages sit
 * inside the same design system as the site root rather than looking bolted on.
 *
 * NOTE: <style> content is passed via dangerouslySetInnerHTML on purpose. JSX
 * text children inside a <style> tag get HTML-escaped by React's SSR serializer
 * but are NOT entity-decoded by the browser, which produces a hydration
 * mismatch on any quote in the CSS. See commit "root-cause the hydration
 * failure" — do not convert this back to a template-literal child.
 */

const C = {
  canvas: "#FBFCFD",
  card: "#FFFFFF",
  ink: "#0E1B1A",
  body: "#3C4744",
  mute: "#5B6764",
  hairline: "#E2EAE8",
  accent: "#117E73",
  accentDeep: "#0A3D38",
};

export const LEGAL_CONTACT = "waseem@skynetjoe.com";

export default function LegalLayout({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html, body { background: ${C.canvas} !important; color-scheme: light !important; }
        .lg-wrap { max-width: 760px; margin: 0 auto; padding: 72px 22px 120px; }
        .lg-body h2 { font-size: 20px; font-weight: 700; letter-spacing: -0.01em;
          color: ${C.ink}; margin: 44px 0 12px; }
        .lg-body h3 { font-size: 16px; font-weight: 650; color: ${C.ink}; margin: 26px 0 8px; }
        .lg-body p, .lg-body li { font-size: 15.5px; line-height: 1.68; color: ${C.body}; }
        .lg-body p { margin-bottom: 14px; }
        .lg-body ul { margin: 0 0 16px; padding-left: 22px; }
        .lg-body li { margin-bottom: 8px; }
        .lg-body a { color: ${C.accent}; text-decoration: underline; text-underline-offset: 2px; }
        .lg-body strong { color: ${C.ink}; font-weight: 650; }
        .lg-note { background: #FFF8E6; border: 1px solid #F0DFA8; border-radius: 10px;
          padding: 14px 16px; margin: 18px 0; font-size: 14.5px; line-height: 1.6; color: #5A4A1E; }
        .lg-note code { background: #F6EDD2; padding: 1px 5px; border-radius: 4px;
          font-family: ui-monospace, monospace; font-size: 13px; }
        @media (max-width: 520px) { .lg-wrap { padding: 48px 18px 90px; } }
      `,
        }}
      />
      <main id="main-content" className="lg-wrap">
        <Link
          href="/"
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 11.5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.accent,
            textDecoration: "none",
          }}
        >
          ← Waseem Nasir
        </Link>

        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 40px)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 1.12,
            color: C.ink,
            margin: "22px 0 10px",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 11.5,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: C.mute,
            marginBottom: 20,
          }}
        >
          Last updated {updated}
        </p>

        <p
          style={{
            fontSize: 17,
            lineHeight: 1.62,
            color: C.body,
            paddingBottom: 22,
            borderBottom: `1px solid ${C.hairline}`,
          }}
        >
          {intro}
        </p>

        <div className="lg-body">{children}</div>

        <div
          style={{
            marginTop: 52,
            padding: "20px 22px",
            background: C.card,
            border: `1px solid ${C.hairline}`,
            borderRadius: 12,
          }}
        >
          <p
            style={{ fontSize: 15, lineHeight: 1.6, color: C.body, margin: 0 }}
          >
            Questions about this page? Email{" "}
            <a
              href={`mailto:${LEGAL_CONTACT}`}
              style={{ color: C.accentDeep, fontWeight: 650 }}
            >
              {LEGAL_CONTACT}
            </a>
            .
          </p>
        </div>
      </main>
    </>
  );
}
