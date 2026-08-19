import { C } from "./tokens";

/* Matches the footer convention already shipping on the live homepage
   (app/v/blueprint/BlueprintClient.tsx SiteFooter) — this is Waseem's own
   site, so the credit line is "Built by the person who answers your call"
   rather than a third-party attribution. */
export default function Footer() {
  return (
    <footer
      style={{ background: C.canvas, borderTop: `1px solid ${C.hairline}` }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-3 px-5 py-8 sm:flex-row sm:items-center sm:px-6">
        <span
          className="font-mono uppercase"
          style={{
            color: C.pillInk,
            fontSize: "0.72rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
          }}
        >
          Built by the person who answers your call
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <a
            href="/privacy"
            className="font-mono uppercase"
            style={{
              color: C.mute,
              fontSize: "0.66rem",
              letterSpacing: "0.08em",
            }}
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="font-mono uppercase"
            style={{
              color: C.mute,
              fontSize: "0.66rem",
              letterSpacing: "0.08em",
            }}
          >
            Terms
          </a>
          <span
            className="font-mono uppercase"
            style={{
              color: C.mute,
              fontSize: "0.66rem",
              letterSpacing: "0.06em",
            }}
          >
            © 2026 Waseem Nasir
          </span>
        </div>
      </div>
    </footer>
  );
}
