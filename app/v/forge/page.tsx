import type { Metadata } from "next";
import ForgeClient from "./ForgeClient";

/**
 * /v/forge — internal design-variant preview, not linked from the live
 * homepage. Scroll-stop pinned-beats 3D experiment (three.js + framer-motion
 * scroll pinning). noindex — this is a preview, not a page to rank.
 */
export const metadata: Metadata = {
  title: "Waseem Nasir — Forge preview",
  description:
    "Internal design-variant preview. The live site is waseemnasir.com.",
  robots: { index: false, follow: false },
};

export default function ForgePage() {
  return <ForgeClient />;
}
