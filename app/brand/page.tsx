import type { Metadata } from "next";
import BrandClient from "./BrandClient";

/** /brand — internal brand guidelines (logo system, color, type, voice).
 * Not a public marketing page: excluded from the index and given its own
 * title/description so it never surfaces the homepage's metadata. */
export const metadata: Metadata = {
  title: "Brand Guidelines — Internal | Waseem Nasir",
  description:
    "Internal brand system reference: logo lockups, color tokens, type scale, and voice guidelines for the Waseem Nasir founder identity.",
  robots: { index: false, follow: false },
};

export default function BrandPage() {
  return <BrandClient />;
}
