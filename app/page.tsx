/**
 * Root route — renders the Blueprint design (Modern-SaaS founder site).
 * Source of truth: components/home/BlueprintClient.tsx
 * (/v/blueprint and /variants were taken down 2026-10-07 and redirect here.)
 */
import BlueprintClient from "@/components/home/BlueprintClient";

export default function HomePage() {
  return <BlueprintClient />;
}
