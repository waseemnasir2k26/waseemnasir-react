import type { Metadata } from "next";
import LegalLayout, { LEGAL_CONTACT } from "../legal/_LegalLayout";

const SITE = "https://www.waseemnasir.com";

export const metadata: Metadata = {
  title: "Terms | Waseem Nasir",
  description:
    "The terms that apply to the 1:1 Claude Code mentorship and to using waseemnasir.com — what is delivered, scheduling, payment, cancellation, and who owns what.",
  alternates: { canonical: `${SITE}/terms` },
  // noindex until the [NEEDS WASEEM] fields are answered -- see the note in
  // app/privacy/page.tsx. Flip both to index once the gaps are filled.
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms"
      updated="25 July 2026"
      intro="These terms cover the 1:1 mentorship sold on this site and general use of the site itself. Plain language on purpose — if something here is unclear, ask before you buy."
    >
      <div className="lg-note">
        <strong>Draft pending review.</strong> Items marked{" "}
        <code>[NEEDS WASEEM]</code> need a real decision before this is relied
        on, and these terms have not been reviewed by a solicitor.
        Consumer-contract rules differ by country and can override what a seller
        writes.
      </div>

      <h2>Who you are contracting with</h2>
      <p>
        Waseem Nasir, trading as SkynetLabs. Contact:{" "}
        <a href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a>.{" "}
        <strong>[NEEDS WASEEM]</strong> Trading entity, registration number if
        applicable, and address — the same gap flagged in the privacy notice.
      </p>

      <h2>What the mentorship is</h2>
      <p>
        Live one-to-one teaching in building software with Claude Code. The
        packages listed on the mentorship page are, at the time of writing: a
        single session at <strong>$199</strong>, a four-week sprint at{" "}
        <strong>$800</strong> including four weekly live sessions of 60&ndash;90
        minutes, and a three-month track at <strong>$2,000</strong> including
        twelve weekly live sessions. The mentorship page is the authoritative
        description of what each package includes; if it differs from this page,
        the mentorship page wins.
      </p>
      <p>
        It is teaching, not a delivery contract. You are buying time, guidance
        and review — not a finished application, and not a promise that any
        particular project will work, ship, earn money or attract users. Your
        results depend on the hours you put in.
      </p>

      <h2>Scheduling</h2>
      <p>
        Sessions are booked through the calendar link provided after purchase.{" "}
        <strong>[NEEDS WASEEM]</strong> Your rescheduling and no-show rules —
        for example how much notice is required, and whether a missed session is
        forfeited or rebooked. State something you will actually enforce.
      </p>
      <p>
        Between live sessions you can message with questions. That is
        best-effort support during normal working hours, not a guaranteed
        response time.
      </p>

      <h2>Payment</h2>
      <p>
        Prices are in US dollars and shown on the mentorship page. Payment is
        due before sessions begin unless agreed otherwise in writing.{" "}
        <strong>[NEEDS WASEEM]</strong> Payment provider, whether instalments
        are offered on the three-month track, and whether any local sales tax or
        VAT is added.
      </p>

      <h2>Cancellation and refunds</h2>
      <p>
        <strong>[NEEDS WASEEM]</strong> This is the single most important gap on
        this page and it needs your decision, not a guess. Two things to settle:
      </p>
      <ul>
        <li>
          Your own refund policy — for instance, a full refund before the first
          session, and a pro-rata refund for unused sessions after that.
        </li>
        <li>
          How you handle the statutory cancellation right that UK and EU
          consumers normally have for a period after buying a service online,
          including whether a customer who asks to start immediately is asked to
          acknowledge that beginning early affects that right.
        </li>
      </ul>
      <p>
        Where local consumer law gives you stronger rights than this page does,
        that law applies.
      </p>

      <h2>Who owns what</h2>
      <p>
        <strong>You own what you build.</strong> Any code, product or business
        you create during or after the mentorship is entirely yours, including
        anything written together during a session.
      </p>
      <p>
        Teaching materials, templates, worksheets and recordings supplied to you
        remain owned by Waseem Nasir and are licensed to you for your own
        personal use. Please do not resell them, publish them, or run them as
        your own course.
      </p>

      <h2>Confidentiality</h2>
      <p>
        Anything you share about your business or your project is treated as
        confidential and is not disclosed to anyone else or used as a public
        example without your explicit permission.
      </p>

      <h2>Conduct, and ending early</h2>
      <p>
        Either of us may end the arrangement if the other behaves abusively or
        makes the work impossible. If the mentorship is ended for that reason,
        unused sessions are refunded on whatever basis the cancellation section
        above ends up stating.
      </p>

      <h2>Limits</h2>
      <p>
        Nothing here limits liability for death, personal injury, or fraud, or
        for anything else that cannot lawfully be limited. Beyond that, and to
        the extent the law allows, liability arising from the mentorship is
        limited to the amount you paid for it, and does not extend to lost
        profits, lost data or lost business opportunity.
      </p>
      <p>
        This site&rsquo;s content is published in good faith for general
        information. It is not professional, legal, financial or tax advice.
      </p>

      <h2>Governing law</h2>
      <p>
        <strong>[NEEDS WASEEM]</strong> Which country&rsquo;s law governs these
        terms and where disputes are heard. This depends on where the trading
        entity is established, so it is answered by the same question at the top
        of this page. Consumers generally keep the protection of their home
        country&rsquo;s law regardless of what is chosen here.
      </p>

      <h2>Changes</h2>
      <p>
        These terms may be updated; the version in force is the one published
        when you buy. The &ldquo;last updated&rdquo; date at the top changes
        with any revision.
      </p>
    </LegalLayout>
  );
}
