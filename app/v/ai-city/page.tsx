import type { Metadata } from "next";
import MeridianClient from "./MeridianClient";

/**
 * /v/ai-city — internal 3D design-variant preview ("MERIDIAN"). Not the
 * live homepage; kept out of the index (see app/robots.ts disallow: "/v/")
 * and doubly marked noindex here so a disallowed-but-linked URL can't get
 * indexed URL-only alongside the real homepage.
 */
export const metadata: Metadata = {
  title: "Waseem Nasir — Meridian preview",
  description:
    "Internal 3D design-variant preview. The live site is waseemnasir.com.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.waseemnasir.com" },
};

export default function AiCityPage() {
  return <MeridianClient />;
}
