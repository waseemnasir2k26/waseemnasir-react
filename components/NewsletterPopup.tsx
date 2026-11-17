"use client";

/**
 * NewsletterPopup — one friendly email-capture card per visitor.
 *
 * Ruling 2026-10-07 (Waseem): interrupting popups were switched off 2026-05-29;
 * this ONE comes back, newsletter-only, on every site. Rules:
 *   - Fires once per browser (localStorage), after 45 s on the page OR 55 %
 *     scroll, whichever first. Never on /contact, /thank-you, /lp/*, legal
 *     pages, or while another popup already fired this session
 *     (shared "skynet-popup-fired" key kept for the retired popups).
 *   - "Not right now" snoozes for 14 days; a successful subscribe never shows
 *     it again. ?popup=off disables it for QA.
  *   - skynetjoe: posts to /api/lead-capture (source "newsletter-skynetjoe";
 *     GHL → Resend → disk sink, then an HQ mirror after a confirmed write).
 *     waseemnasir: posts to /api/subscribe (HQ only, honest 502 otherwise).
 *     Success only after the server confirms a write.
 *   - Zero third-party requests. Keyboard: Esc closes, focus trapped inside.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const DONE_KEY = "sj_newsletter"; // "subscribed" | ISO snooze-until
const SHARED_POPUP_KEY = "skynet-popup-fired";
const SNOOZE_DAYS = 14;
const DELAY_MS = 45_000;
const SCROLL_PCT = 0.55;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BLOCKED = [
  /^\/contact/,
  /^\/thank-you/,
  /^\/lp\//,
  /^\/privacy/,
  /^\/terms/,
  /^\/book/,
];

function readDone(): "subscribed" | "snoozed" | null {
  try {
    const v = window.localStorage.getItem(DONE_KEY);
    if (!v) return null;
    if (v === "subscribed") return "subscribed";
    return Date.parse(v) > Date.now() ? "snoozed" : null;
  } catch {
    return null;
  }
}

export default function NewsletterPopup({
  site,
}: {
  /** "skynetjoe" | "waseemnasir" — sent as part of `source`. */
  site: string;
}) {
  const pathname = usePathname() || "/";
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<string>("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
  const shownAtRef = useRef<number>(0);

  // ── trigger ──
  useEffect(() => {
    if (BLOCKED.some((re) => re.test(pathname))) return;
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("popup") === "off")
      return;
    if (readDone()) return;
    try {
      if (window.sessionStorage.getItem(SHARED_POPUP_KEY) === "1") return;
    } catch {
      /* ignore */
    }
        let fired = false;
    let retry: number | undefined;
        const fire = () => {
      if (fired) return;
      if (BLOCKED.some((re) => re.test(window.location.pathname))) return;
      if (readDone()) return;
      // Never on top of another dialog or an undecided consent bar: Esc or a
      // backdrop click meant for them would otherwise snooze this for 14 days.
            if (document.querySelector('[role="dialog"], [data-consent-bar]') !== null) {
        retry = window.setTimeout(fire, 8000);
        return;
      }
      fired = true;
      try {
        window.sessionStorage.setItem(SHARED_POPUP_KEY, "1");
      } catch {
        /* ignore */
      }
            shownAtRef.current = Date.now();
      setShow(true);
    };
    const t = window.setTimeout(fire, DELAY_MS);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_PCT) fire();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
      window.clearTimeout(t);
      if (retry) window.clearTimeout(retry);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  // ── keyboard + focus ──
  useEffect(() => {
    if (!show) return;
    const first = cardRef.current?.querySelector<HTMLElement>("input,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
        if (Date.now() - shownAtRef.current < 1500) return; // grace after open
        snooze();
      }
      if (e.key === "Tab" && cardRef.current) {
        const f = cardRef.current.querySelectorAll<HTMLElement>(
          'input,button,select,[href],[tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const a = f[0];
        const z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

    const snooze = () => {
    // Closing the success card must not downgrade "subscribed" to a snooze.
    if (status === "success") {
      setShow(false);
      return;
    }
    try {
      if (window.localStorage.getItem(DONE_KEY) === "subscribed") {
        setShow(false);
        return;
      }
      const until = new Date(Date.now() + SNOOZE_DAYS * 864e5).toISOString();
      window.localStorage.setItem(DONE_KEY, until);
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    const em = email.trim();
    if (!EMAIL_RE.test(em) || em.length > 254) {
      setError("That email doesn't look right.");
      return;
    }
    setError(null);
    setStatus("submitting");
    try {
      const res = await fetch(site === "waseemnasir" ? "/api/subscribe" : "/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: em,
          source: `newsletter-${site}`,
          capturedAt: new Date().toISOString(),
          _honeypot: hp,
          newsletter: {
            firstName: firstName.trim().slice(0, 80) || undefined,
            interest: interest || undefined,
            page: pathname,
          },
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setStatus("error");
        setError(
          res.status === 400 && body?.error
            ? body.error
            : "Couldn't save that. Email waseem@skynetjoe.com and I'll add you by hand.",
        );
        return;
      }
      try {
        window.localStorage.setItem(DONE_KEY, "subscribed");
      } catch {
        /* ignore */
      }
      setStatus("success");
      window.setTimeout(() => setShow(false), 2600);
    } catch {
      setStatus("error");
      setError("Network hiccup. Try again in a moment.");
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="nlp-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={snooze}
        >
          <motion.div
            ref={cardRef}
            className="nlp-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nlp-title"
            initial={reduce ? false : { y: 28, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={reduce ? undefined : { y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="nlp-x"
              onClick={snooze}
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>

            <div className="nlp-art" aria-hidden="true">
              <span className="nlp-orb nlp-orb-a" />
              <span className="nlp-orb nlp-orb-b" />
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z" /></svg>
            </div>

            {status === "success" ? (
              <div className="nlp-body">
                <p className="nlp-eyebrow">You&apos;re on the list</p>
                <h2 id="nlp-title" className="nlp-title">
                  Thanks{firstName.trim() ? `, ${firstName.trim()}` : ""}. Check your inbox for a welcome email.
                </h2>
                <p className="nlp-lede">
                  Builds, workflows, the tools that actually paid off. Reply to any email and it reaches me. Unsubscribe in one click from any email.
                </p>
              </div>
            ) : (
              <form className="nlp-body" onSubmit={submit} noValidate>
                <p className="nlp-eyebrow">Free email list</p>
                <h2 id="nlp-title" className="nlp-title">
                  We ship a lot. Get the best of it in one email.
                </h2>
                <p className="nlp-lede">
                  New AI videos, free n8n workflows, site teardowns and the services we add. You get a welcome email now and a short welcome series. No spam; every email has a one-click unsubscribe.
                </p>

                <div className="nlp-row">
                  <label className="nlp-field">
                    <span>First name</span>
                    <input
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Waseem"
                      maxLength={80}
                    />
                  </label>
                  <label className="nlp-field nlp-field-grow">
                    <span>Email</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@business.com"
                      aria-invalid={error ? "true" : undefined}
                    />
                  </label>
                </div>

                <fieldset className="nlp-chips">
                  <legend>What are you here for?</legend>
                  {[
                    ["ai-video", "AI video"],
                    ["automation", "Automation"],
                    ["websites", "Websites"],
                    ["everything", "All of it"],
                  ].map(([v, l]) => (
                    <label
                      key={v}
                      className={`nlp-chip${interest === v ? " is-on" : ""}`}
                    >
                      <input
                        type="radio"
                        name="interest"
                        value={v}
                        checked={interest === v}
                        onChange={() => setInterest(v)}
                      />
                      {l}
                    </label>
                  ))}
                </fieldset>

                {/* honeypot */}
                <div className="nlp-hp" aria-hidden="true">
                  <label>
                    Website
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={hp}
                      onChange={(e) => setHp(e.target.value)}
                    />
                  </label>
                </div>

                {error && (
                  <p className="nlp-error" role="alert">
                    {error}
                  </p>
                )}

                <div className="nlp-actions">
                  <button
                    type="submit"
                    className="nlp-btn"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting"
                      ? "Saving…"
                      : "Subscribe, it's free"}
                  </button>
                  <button type="button" className="nlp-later" onClick={snooze}>
                    Not right now
                  </button>
                </div>
                <p className="nlp-fine">
                  From Waseem at SkynetLabs, sent via Brevo, which tracks opens and clicks. A welcome email plus 3 more over 2 weeks, then occasional. Leave anytime.{" "}
                  <a href={site === "waseemnasir" ? "/privacy" : "/privacy-policy"}>Privacy</a>
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
