"use client";
import { useForgeCapabilities } from "@/components/forge/useForgeCapabilities";
import { display, body, mono } from "@/components/forge/fonts";
import PinnedForgeRunway from "@/components/forge/PinnedForgeRunway";
import StaticForge from "@/components/forge/StaticForge";
import WorkPanels from "@/components/forge/WorkPanels";
import FinalCTA from "@/components/forge/FinalCTA";
import Footer from "@/components/forge/Footer";
import { C } from "@/components/forge/tokens";

/* ============================================================
   VARIANT: forge
   Scroll-stop pinned-beats 3D preview. Hero → pinned "Build" scrub →
   pinned "Proof" pull-back-and-multiply, then a plain-scroll Work grid
   and a Final CTA. Desktop + fine pointer + motion-on + WebGL gets the
   three.js runway; everyone else (touch, reduced-motion, no WebGL) gets
   StaticForge — same copy, same locked numbers, no 3D.

   SELF-CONTAINED to app/v/forge/** + components/forge/**.
   ============================================================ */
export default function ForgeClient() {
  const { ready, use3D, reduce } = useForgeCapabilities();

  return (
    <main
      id="main-content"
      className={`relative ${display.variable} ${body.variable} ${mono.variable}`}
      style={{
        background: C.canvas,
        fontFamily: "var(--font-body)",
        fontWeight: 400,
        overflowX: "clip",
      }}
    >
      {/* Before the client checks resolve, render the static path — it's
          the SSR-safe default and avoids any layout jump when `use3D`
          flips true a tick after mount. */}
      {!ready || !use3D ? (
        <StaticForge reduce={reduce} />
      ) : (
        <PinnedForgeRunway />
      )}
      <WorkPanels />
      <FinalCTA />
      <Footer />
    </main>
  );
}
