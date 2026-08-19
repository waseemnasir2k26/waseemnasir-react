import type { Metadata } from "next";
import OrbitClient from "./OrbitClient";

/**
 * /v/orbit — internal 3D design-variant preview. Not the live homepage;
 * kept out of the index (see app/robots.ts disallow: "/v/") and doubly
 * marked noindex here so a disallowed-but-linked URL can't get indexed
 * URL-only alongside the real homepage.
 */
export const metadata: Metadata = {
  title: "Waseem Nasir — Orbit preview",
  description:
    "Internal 3D design-variant preview. The live site is waseemnasir.com.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.waseemnasir.com" },
};

export default function OrbitPage() {
  return <OrbitClient />;
}
