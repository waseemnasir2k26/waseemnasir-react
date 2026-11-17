/**
 * Root route — renders the Blueprint design (Modern-SaaS founder site).
 * Source of truth: components/home/BlueprintClient.tsx
 * (/v/blueprint and /variants were taken down 2026-10-07 and redirect here.)
 */
import BlueprintClient from "@/components/home/BlueprintClient";
import ClientReviews from "@/components/home/ClientReviews";
import LatestArticles from "@/components/home/LatestArticles";

export default function HomePage() {
  return <BlueprintClient latest={<LatestArticles />} reviews={<ClientReviews />} />;
}
