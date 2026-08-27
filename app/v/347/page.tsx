import type { Metadata } from "next";
import NightCityClient from "./NightCityClient";

/**
 * /v/347 — internal flagship preview ("3:47 AM — The City That Works
 * While You Sleep"). Not the live homepage; kept out of the index (see
 * app/robots.ts disallow: "/v/") and doubly marked noindex here.
 * Metadata shape cloned from app/v/ai-city-2/page.tsx.
 */
export const metadata: Metadata = {
  title: "Waseem Nasir — 3:47 AM",
  description: "Internal flagship preview. The live site is waseemnasir.com.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.waseemnasir.com" },
};

export default function Page347() {
  return <NightCityClient />;
}
