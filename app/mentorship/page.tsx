import type { Metadata } from "next";
import MentorshipClient from "./MentorshipClient";

const SITE = "https://www.waseemnasir.com";

export const metadata: Metadata = {
  title:
    "1:1 Claude Code Mentorship — Learn to Vibe-Code Real Software | Waseem Nasir",
  description:
    "Private 1-on-1 mentorship for beginners. Learn to build and ship real apps by vibe-coding with Claude Code — live, hands-on, no CS degree needed. 1-month sprint or 3-month mastery track.",
  alternates: { canonical: `${SITE}/mentorship` },
  openGraph: {
    title: "1:1 Claude Code Mentorship — Vibe-Code Real Software",
    description:
      "Go from zero to shipping real apps with Claude Code. Private, live, beginner-friendly mentorship with a founder who builds in it daily.",
    url: `${SITE}/mentorship`,
    siteName: "Waseem Nasir",
    type: "website",
    images: [
      {
        url: "/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
        width: 1700,
        height: 956,
        alt: "Waseem Nasir building software with Claude Code",
      },
    ],
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "1:1 Claude Code & AI Vibe-Coding Mentorship",
  description:
    "Private 1-on-1 mentorship teaching beginners to build and ship real software by vibe-coding with Claude Code.",
  provider: {
    "@type": "Person",
    name: "Waseem Nasir",
    url: SITE,
  },
  hasCourseInstance: [
    {
      "@type": "CourseInstance",
      name: "1-Month Sprint",
      courseMode: "online",
      courseWorkload: "P1M",
    },
    {
      "@type": "CourseInstance",
      name: "3-Month Mastery",
      courseMode: "online",
      courseWorkload: "P3M",
    },
  ],
};

export default function MentorshipPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <MentorshipClient />
    </>
  );
}
