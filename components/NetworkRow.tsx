import type { CSSProperties } from "react";

// "SkynetLabs network" cross-link row, shared by every site footer.
// Plain links on purpose: same-entity properties, no _blank, no nofollow.
const NETWORK_LINKS = [
  { href: "https://skynetlabs.si/", label: "SkynetLabs — AI growth consultancy" },
  { href: "https://skynetjoe.com/", label: "SkynetLabs Agency" },
  {
    href: "https://skynetlabsai.com/",
    label: "SkynetLabs AI for home services",
  },
  {
    href: "https://www.waseemnasir.com/",
    label: "Waseem Nasir, founder",
    current: true,
  },
] as const;

export default function NetworkRow({
  color,
  className = "",
  style,
}: {
  color: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${className}`}
      style={{ color, fontSize: 12, ...style }}
    >
      <span>SkynetLabs network:</span>
      {NETWORK_LINKS.map((l) => (
        <a
          key={l.href}
          href={l.href}
          {...("current" in l ? { "aria-current": "page" as const } : {})}
          className="hover:underline"
          style={{ color: "inherit" }}
        >
          {l.label}
        </a>
      ))}
    </p>
  );
}
