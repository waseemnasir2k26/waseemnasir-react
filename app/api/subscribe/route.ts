import { NextResponse } from "next/server";

/**
 * POST /api/subscribe — waseemnasir.com newsletter popup.
 *
 *   { email, source, capturedAt, _honeypot?, newsletter?: { firstName?, interest?, page? } }
 *
 * Honeypot filled → fake 200, nothing stored. Otherwise the row is written to
 * HQ (hq.skynetjoe.com /api/ingest/subscriber) with HQ_SUBSCRIBER_SECRET.
 * Success is returned ONLY when HQ confirmed (201/200); if HQ is unreachable
 * the visitor gets a 502 with a plain "email me" fallback rather than a lie.
 * Same-origin plus the SkynetLabs static sites (CORS allow-list below), JSON
 * only, 8 KB cap, 30/min per first X-Forwarded-For hop. `site` is derived
 * from the Origin server-side; a client-sent site is never trusted.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = 8 * 1024;
const PER_MIN = 30;
const hits = new Map<string, { n: number; t: number }>();
// Logs never carry a full address: j***@example.com is enough to follow up.
const mask = (e: string) => e.replace(/^(.).*?(@.*)$/, "$1***$2");

// Cross-origin callers: exact origins only, mapped to the HQ site slug.
const CORS_SITES: Record<string, string> = {
  "https://skynetlabs.si": "skynetlabs-si",
  "https://www.skynetlabs.si": "skynetlabs-si",
  "https://skynetlabsai.com": "skynetlabsai",
  "https://www.skynetlabsai.com": "skynetlabsai",
};

function corsHeaders(origin: string | null): Record<string, string> {
  const h: Record<string, string> = { Vary: "Origin" };
  if (origin && Object.prototype.hasOwnProperty.call(CORS_SITES, origin))
    h["Access-Control-Allow-Origin"] = origin;
  return h;
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  const h = corsHeaders(origin);
  if (!h["Access-Control-Allow-Origin"])
    return new NextResponse(null, { status: 403, headers: h });
  h["Access-Control-Allow-Methods"] = "POST";
  h["Access-Control-Allow-Headers"] = "Content-Type";
  h["Access-Control-Max-Age"] = "600";
  return new NextResponse(null, { status: 204, headers: h });
}

function limited(key: string): boolean {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.t > 60_000) {
    hits.set(key, { n: 1, t: now });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  h.n += 1;
  return h.n > PER_MIN;
}

async function handle(req: Request, cors: Record<string, string>) {
  const json = (data: unknown, init?: ResponseInit) =>
    NextResponse.json(data, { ...init, headers: cors });
  const ct = (req.headers.get("content-type") || "").toLowerCase();
  if (!/^application\/json\s*(;|$)/.test(ct))
    return json({ error: "JSON only" }, { status: 415 });
  const origin = req.headers.get("origin");
  if (origin && origin !== "null") {
    let oh = "";
    try {
      oh = new URL(origin).host.toLowerCase();
    } catch {
      /* refused below */
    }
    const host = (req.headers.get("host") || "").toLowerCase();
    const ok =
      oh === host ||
      oh === "www.waseemnasir.com" ||
      oh === "waseemnasir.com" ||
      cors["Access-Control-Allow-Origin"] === origin;
    if (!ok) return json({ error: "Forbidden" }, { status: 403 });
  }
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (limited(ip))
    return json({ error: "Too many requests" }, { status: 429 });

  const text = await req.text();
  if (new TextEncoder().encode(text).length > MAX)
    return json({ error: "Too large" }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body))
    return json({ error: "Invalid JSON" }, { status: 400 });
  const b = body as Record<string, unknown>;

  if (typeof b._honeypot === "string" && b._honeypot.trim()) {
    console.warn("[subscribe] honeypot tripped");
    return json({ ok: true }); // fake success, nothing stored
  }
  const email = typeof b.email === "string" ? b.email.trim() : "";
  if (!EMAIL_RE.test(email) || email.length > 254)
    return json(
      { error: "That email doesn't look right." },
      { status: 400 },
    );
  const str = (v: unknown, n: number) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null;
  const n =
    typeof b.newsletter === "object" && b.newsletter !== null && !Array.isArray(b.newsletter)
      ? (b.newsletter as Record<string, unknown>)
      : {};
  const firstName = str(n.firstName, 80);
  const interestRaw = str(n.interest, 32);
  const interest = interestRaw && /^[a-z0-9-]{1,32}$/.test(interestRaw) ? interestRaw : null;
  const page = str(n.page, 200);

  const site =
    (origin && Object.prototype.hasOwnProperty.call(CORS_SITES, origin)
      ? CORS_SITES[origin]
      : null) ?? "waseemnasir";

  const url = process.env.HQ_SUBSCRIBER_URL?.trim();
  const secret = process.env.HQ_SUBSCRIBER_SECRET?.trim();
  if (!url || !secret) {
    console.error("[subscribe] HQ lane not configured; lead:", mask(email));
    return json(
      {
        error:
          "Couldn't save that right now. Email waseem@skynetjoe.com and I'll add you.",
      },
      { status: 502 },
    );
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hq-ingest-secret": secret,
      },
      body: JSON.stringify({
        email,
        site,
        source: "popup",
        first_name: firstName,
        interest,
        page,
      }),
      signal: ctrl.signal,
      cache: "no-store",
    });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HQ ${res.status}`);
    return json({ ok: true });
  } catch (e) {
    console.error("[subscribe] HQ write failed; lead:", mask(email), e);
    return json(
      {
        error:
          "Couldn't save that right now. Email waseem@skynetjoe.com and I'll add you.",
      },
      { status: 502 },
    );
  }
}

export async function POST(req: Request) {
  return handle(req, corsHeaders(req.headers.get("origin")));
}
