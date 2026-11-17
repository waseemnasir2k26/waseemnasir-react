import Link from "next/link";
import { latestPosts } from "@/app/blog/posts";

/* Server component: 3 newest posts, rendered before the footer CTA. */
export default function LatestArticles() {
  const posts = latestPosts(3);
  return (
    <section
      id="latest-articles"
      aria-labelledby="latest-articles-h"
      style={{ background: "#FBFCFD" }}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="latest-articles-h"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(1.75rem,3.6vw,2.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.024em",
              color: "#0E1B1A",
            }}
          >
            Latest articles
          </h2>
          <Link
            href="/blog"
            className="bp-link"
            style={{ color: "#117E73", fontSize: "0.95rem" }}
          >
            All articles →
          </Link>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="block h-full"
                style={{
                  border: "1px solid #E2EAE8",
                  borderRadius: 18,
                  padding: "1.5rem",
                  background: "#FFFFFF",
                  boxShadow:
                    "0 1px 2px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
                }}
              >
                <time
                  dateTime={p.date}
                  style={{ color: "#5B6764", fontSize: "0.8rem" }}
                >
                  {p.dateLabel} · {p.readingTime}
                </time>
                <h3
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                    lineHeight: 1.25,
                    color: "#0E1B1A",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="mt-3"
                  style={{ color: "#3C4744", fontSize: "0.95rem", lineHeight: 1.6 }}
                >
                  {p.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
