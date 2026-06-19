import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import MotionProvider from "@/components/MotionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE = "https://waseemnasir.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Waseem Nasir — I make your busywork disappear",
  description:
    "Independent founder building AI + automation systems that quietly solve real business problems. Missed leads, dead follow-ups, manual ops — handled. Book a 30-minute call.",
  keywords: [
    "Waseem Nasir",
    "AI automation",
    "n8n",
    "workflow automation",
    "Next.js developer",
    "AEO",
    "founder",
  ],
  openGraph: {
    title: "Waseem Nasir — I make your busywork disappear",
    description:
      "Independent founder building AI + automation systems that solve real business problems. Book a 30-minute call.",
    url: SITE,
    siteName: "Waseem Nasir",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waseem Nasir — I make your busywork disappear",
    description:
      "AI + automation that solves real problems. Book a 30-minute call.",
  },
  alternates: { canonical: SITE },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Waseem Nasir",
  jobTitle: "Founder & Automation Engineer",
  url: SITE,
  email: "mailto:waseembali2k26@gmail.com",
  sameAs: ["https://github.com/waseemnasir2k26", "https://skynetjoe.com"],
  knowsAbout: [
    "AI automation",
    "n8n",
    "Next.js",
    "Answer Engine Optimization",
    "Workflow design",
  ],
  worksFor: {
    "@type": "Organization",
    name: "SkynetLabs",
    url: "https://skynetjoe.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}
    >
      <body className="grain font-sans antialiased">
        {/* Skip to content — first focusable element */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        <div className="aurora" aria-hidden />
        <SmoothScroll />

        <MotionProvider>
          {/* ScrollProgress mounts inside MotionProvider so it inherits reducedMotion */}
          <ScrollProgress />
          {children}
        </MotionProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
