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
    <div className={className} style={{ color, fontSize: 12, ...style }}>
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
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
    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
      <span>
        WhatsApp:{" "}
        <a href="https://wa.me/6281316077185" className="hover:underline" style={{ color: "inherit" }}>
          +62 813 1607 7185
        </a>{" "}
        (Indonesia) ·{" "}
        <a href="https://wa.me/923001001957" className="hover:underline" style={{ color: "inherit" }}>
          +92 300 1001957
        </a>{" "}
        (Pakistan)
      </span>
      <span>Registered in Pakistan as SkynetJoe LLP and in Indonesia.</span>
    </p>
    </div>
  );
}
