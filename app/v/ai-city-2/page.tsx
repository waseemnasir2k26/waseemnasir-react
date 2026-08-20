import type { Metadata } from "next";
import AltitudeClient from "./AltitudeClient";

/**
 * /v/ai-city-2 — internal 3D design-variant preview ("Altitude Zero").
 * Not the live homepage; kept out of the index (see app/robots.ts
 * disallow: "/v/") and doubly marked noindex here so a
 * disallowed-but-linked URL can't get indexed URL-only alongside the
 * real homepage. Metadata shape cloned verbatim from app/v/skyline/page.tsx.
 */
export const metadata: Metadata = {
  title: "Waseem Nasir — Altitude Zero preview",
  description:
    "Internal 3D design-variant preview. The live site is waseemnasir.com.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.waseemnasir.com" },
};

export default function AiCity2Page() {
  return <AltitudeClient />;
}
