"use client";

import Reveal from "./Reveal";
import { EMAIL, GITHUB, AGENCY, BOOKING } from "./site";

const NAV_LINKS = [
  { label: "Book a call", href: BOOKING, external: true },
  { label: "Email", href: `mailto:${EMAIL}`, external: false },
  { label: "GitHub", href: GITHUB, external: true },
  { label: "SkynetLabs", href: AGENCY, external: true },
] as const;

export default function Footer() {
  return (
    <footer className="hairline border-t border-line py-12">
      <Reveal delay={0.05} y={16}>
        <div className="shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Brand block */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 font-mono text-sm font-bold text-accent ring-1 ring-accent/30">
                WN
              </span>
              <span className="text-sm font-medium text-chalk">
                Waseem Nasir
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-mute">
              Independent founder building AI &amp; automation that solves real
              problems. Bali · worldwide.
            </p>
          </div>

          {/* Link row — link-underline polish + min 44px tap targets */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
              {NAV_LINKS.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="link-underline inline-block py-1.5 -my-1.5 text-mute transition-colors duration-200 hover:text-chalk focus-visible:outline-none focus-visible:text-chalk"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <div className="shell mt-10 flex flex-col gap-1 text-xs text-mute/70">
          <span>
            © {new Date().getFullYear()} Waseem Nasir. Built from scratch — no
            template.
          </span>
        </div>
      </Reveal>
    </footer>
  );
}
