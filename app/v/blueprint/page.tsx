import type { Metadata } from "next";
import BlueprintClient from "./BlueprintClient";

/**
 * /v/blueprint — this IS the homepage content (root `/` re-exports this
 * component). Served here too for the internal design-variant gallery.
 * Byte-near-identical to `/`, already canonicalized there — kept out of
 * the index explicitly so a disallowed-but-linked URL can't get indexed
 * URL-only alongside the real homepage.
 */
export const metadata: Metadata = {
  title: "Blueprint — Design Variant | Waseem Nasir",
  description:
    "Internal design-variant preview. The live site is waseemnasir.com.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.waseemnasir.com" },
};

export default function BlueprintPage() {
  return <BlueprintClient />;
}
