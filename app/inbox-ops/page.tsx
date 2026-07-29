import type { Metadata } from "next";
import InboxOpsClient from "./InboxOpsClient";

const SITE = "https://www.waseemnasir.com";

export const metadata: Metadata = {
  title: "Inbox Ops Autopilot — the 9-step map | Waseem Nasir",
  description:
    "The exact 9-step map for getting a small business out of its own mailbox: census, taxonomy, kill list, routing, AI classifier, draft layer, escalation, digest, drift review. $2,750 setup, $395/mo run.",
  alternates: { canonical: `${SITE}/inbox-ops` },
  openGraph: {
    title: "Inbox Ops Autopilot — the 9-step map",
    description:
      "Your mailbox, sorted, drafted, and waiting for one decision. Drafts-only, human on the send button. $2,750 setup, $395/mo.",
    url: `${SITE}/inbox-ops`,
    siteName: "Waseem Nasir",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Inbox Ops Autopilot — the 9-step map",
      },
    ],
  },
};

export default function InboxOpsPage() {
  return <InboxOpsClient />;
}
