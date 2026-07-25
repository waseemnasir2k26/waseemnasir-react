import type { Metadata } from "next";
import LegalLayout, { LEGAL_CONTACT } from "../legal/_LegalLayout";

const SITE = "https://www.waseemnasir.com";

/*
 * OWNER TODO (kept out of the customer-visible copy on purpose -- these used to
 * render as "[NEEDS WASEEM]" in the page body, which put notes addressed to
 * Waseem in front of buyers). Answer these, then flip robots to index:
 *   1. Registered trading entity + company number + country + postal address
 *   2. Payment provider for the mentorship
 *   3. Data retention period + applicable tax jurisdiction
 */
export const metadata: Metadata = {
  title: "Privacy Notice | Waseem Nasir",
  description:
    "What data waseemnasir.com collects, why, how long it is kept, who processes it, and how to ask for a copy or deletion.",
  alternates: { canonical: `${SITE}/privacy` },
  // noindex until the [NEEDS WASEEM] fields are answered. The page is linked
  // and reachable for anyone who wants it, but a half-finished legal notice
  // should not be the thing a search engine surfaces about this business.
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy notice"
      updated="25 July 2026"
      intro="This page explains what happens to your information when you use this site, book a call, or buy mentorship. It is written to be read, not to be survived."
    >
      <div className="lg-note">
        <strong>This notice is not final.</strong> Some details below are marked{" "}
        <em>not yet specified</em>, and it has not been reviewed by a solicitor. It
        describes
        actual current practice on the site rather than claiming compliance with
        any particular regime.
      </div>

      <h2>Who is responsible</h2>
      <p>
        Waseem Nasir, trading as SkynetLabs, is responsible for the information
        described here (the &ldquo;data controller&rdquo; in UK/EU terms).
        Contact: <a href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a>.
      </p>
      <p>
        <em>Not yet specified:</em> the registered trading entity (sole trader or
        limited company), company number if applicable, the country
        of establishment, and a postal or registered address. A privacy notice
        is normally expected to state these. Rather than invent them they are left open — ask by email and they will be confirmed to you directly.
      </p>

      <h2>What is collected, and when</h2>
      <h3>Booking a call</h3>
      <p>
        Calls are booked through <strong>Calendly</strong>, which is embedded on
        the booking page hosted at skynetjoe.com. When you book, Calendly
        collects your name, email address, time zone and any answers you type
        into the booking questions, and passes them on so the meeting can
        happen. Calendly operates as a separate service under its own privacy
        terms.
      </p>
      <h3>Buying mentorship</h3>
      <p>
        If you buy a mentorship package, the information needed to deliver and
        bill for it is processed — typically your name, email address and
        payment confirmation. <em>Not yet specified:</em> which payment
        provider handles the transaction. Card details are handled by that
        provider and are never stored on this site.
      </p>
      <h3>Just browsing</h3>
      <p>
        This site does not run Google Analytics, the Meta Pixel, or any other
        advertising or analytics tracker at the time of writing. There is no
        cookie banner because there are no non-essential cookies to consent to.
        Standard server logs are produced by the host as a normal part of
        serving a web page.
      </p>

      <h2>Why, and on what basis</h2>
      <ul>
        <li>
          <strong>
            To hold a call you asked for, and to deliver mentorship you bought
          </strong>{" "}
          — necessary to perform what we have agreed.
        </li>
        <li>
          <strong>To reply to you</strong> — a legitimate interest in answering
          people who get in touch.
        </li>
        <li>
          <strong>To keep records for tax and accounting</strong> — a legal
          obligation.
        </li>
      </ul>
      <p>
        Your information is not sold, and it is not used to build advertising
        profiles. There is no automated decision-making or profiling.
      </p>

      <h2>Who else touches it</h2>
      <ul>
        <li>
          <strong>Vercel</strong> — hosts this website and serves its pages.
        </li>
        <li>
          <strong>Calendly</strong> — runs the call booking.
        </li>
        <li>
          <strong>Email and CRM</strong> — enquiries and client records are held
          in a mailbox and, for client work, a customer-relationship tool.
        </li>
        <li>
          <em>Not yet specified:</em> the payment provider.
        </li>
      </ul>
      <p>
        Some of these providers operate outside the UK and EU, which means your
        information may be transferred internationally and protected by the
        transfer safeguards those providers publish.
      </p>

      <h2>How long it is kept</h2>
      <p>
        Enquiries that do not turn into work are kept while there is a live
        conversation and then cleared. Client and mentorship records are kept
        for as long as needed to deliver the work and then for the period tax
        rules require. <em>Not yet specified:</em> the exact retention
        period and the applicable tax jurisdiction.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask for a copy of what is held about you, ask for it to be
        corrected, ask for it to be deleted, ask that it be sent to you in a
        portable format, or object to a particular use. Email{" "}
        <a href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a> and say what you
        want — you do not need to use any special wording, and there is no
        charge.
      </p>
      <p>
        If you are in the UK or EU and you are not satisfied with the response,
        you can complain to your national data protection authority. In the UK
        that is the Information Commissioner&rsquo;s Office.
      </p>

      <h2>If analytics is switched on later</h2>
      <p>
        If measurement tools are added in future, non-essential cookies will not
        be set before you have agreed to them, a cookie notice will appear, and
        this page will be updated to name the tools and what they collect. That
        has not happened yet.
      </p>

      <h2>Changes</h2>
      <p>
        If this notice changes, the &ldquo;last updated&rdquo; date at the top
        changes with it.
      </p>
    </LegalLayout>
  );
}
