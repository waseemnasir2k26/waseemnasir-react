import { FEATURED_REVIEWS, RATINGS } from "@/lib/reviews";

/* Server component: 3 verbatim Fiverr reviews. No review JSON-LD by design. */
export default function ClientReviews() {
  return (
    <section
      id="client-reviews"
      aria-labelledby="client-reviews-h"
      style={{ background: "#FBFCFD" }}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-6 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <h2
            id="client-reviews-h"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(1.75rem,3.6vw,2.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.024em",
              color: "#0E1B1A",
            }}
          >
            What clients say
          </h2>
          <a
            href={RATINGS.fiverr.url}
            target="_blank"
            rel="noopener"
            className="bp-link"
            style={{ color: "#117E73", fontSize: "0.95rem" }}
          >
            Read all {RATINGS.fiverr.count} reviews on Fiverr →
          </a>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {FEATURED_REVIEWS.map((r) => (
            <li key={r.date + r.country}>
              <figure
                className="flex h-full flex-col"
                style={{
                  border: "1px solid #E2EAE8",
                  borderRadius: 18,
                  padding: "1.5rem",
                  background: "#FFFFFF",
                  boxShadow:
                    "0 1px 2px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
                }}
              >
                <div
                  role="img"
                  aria-label={`${r.stars} out of 5 stars`}
                  style={{ color: "#117E73", letterSpacing: "0.12em" }}
                >
                  {"★".repeat(r.stars)}
                </div>
                <blockquote
                  className="mt-3 flex-1"
                  style={{ color: "#2B3836", fontSize: "0.98rem", lineHeight: 1.6 }}
                >
                  <p>{`“${r.text}”`}</p>
                </blockquote>
                <figcaption
                  className="mt-4 font-mono"
                  style={{ color: "#5B6764", fontSize: "0.72rem", letterSpacing: "0.04em" }}
                >
                  Fiverr client · {r.country} · {r.date}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
