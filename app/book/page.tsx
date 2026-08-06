import type { Metadata } from "next";
import BookClient from "./BookClient";

const SITE = "https://www.waseemnasir.com";

export const metadata: Metadata = {
  title: "Book a Free Automation Audit | Waseem Nasir",
  description:
    "Book a free 30-minute audit call. We'll walk through where your business leaks time and money, and whether AI automation is worth building for you.",
  alternates: { canonical: `${SITE}/book` },
  openGraph: {
    title: "Book a Free Automation Audit",
    description:
      "A free 30-minute call to find where your business leaks time and money, and what an automation build would actually look like.",
    url: `${SITE}/book`,
    siteName: "Waseem Nasir",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Book a free automation audit with Waseem Nasir",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Free Automation Audit",
    description:
      "A free 30-minute call to find where your business leaks time and money.",
    images: ["/og.jpg"],
  },
};

export default function BookPage() {
  return <BookClient />;
}
