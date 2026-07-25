import type { Metadata } from "next";
import VariantsClient from "./VariantsClient";

/** /variants — internal chooser index for design-variant previews. Not a
 * public marketing page: excluded from the index and given its own
 * title/description so it never surfaces the homepage's metadata. */
export const metadata: Metadata = {
  title: "Site Variant Chooser — Internal | Waseem Nasir",
  description:
    "Internal gallery of founder-site design variants used during build. Not a public page.",
  robots: { index: false, follow: false },
};

export default function VariantsPage() {
  return <VariantsClient />;
}
