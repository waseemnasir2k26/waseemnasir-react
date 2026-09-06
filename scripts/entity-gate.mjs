#!/usr/bin/env node
/**
 * Entity consistency gate — waseemnasir.com
 *
 * Two artefacts repeating one fact DRIFT. The 2026-09-05 audit found FOUR
 * contradictory YouTube strings across the JSON-LD, the homepage footer and the
 * blog footer (one of them pointing at the wrong channel entirely). This gate
 * asserts the invariant CLASS — "exactly one string per platform" — rather than
 * any single literal, so it keeps working when a handle changes.
 *
 * Usage:
 *   node scripts/entity-gate.mjs                # scan the repo source
 *   node scripts/entity-gate.mjs --live         # also scan served HTML on prod
 *
 * Exit 0 = one canonical string per platform everywhere. Exit 1 = drift.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

/** The canonical string per platform. One per row. Change here, nowhere else. */
const CANONICAL = {
  linkedin: "https://www.linkedin.com/in/waseemnasir2k26",
  github: "https://github.com/waseemnasir2k26",
  youtube: "https://www.youtube.com/@vibecodewithwaseemnasir",
  // RULED 2026-09-06 (Waseem, R11 option A): @Skynetjoe1 is canonical on every
  // surface. GitHub profile + skynetjoe.com repointed to match the same day.
  x: "https://x.com/Skynetjoe1",
  facebook: "https://www.facebook.com/Waseemskynetjoe",
  instagram: "https://www.instagram.com/waseemnasir2k27",
};

/** Any URL matching one of these belongs to that platform. */
const MATCHERS = {
  linkedin: /https?:\/\/[^\s"'`)\\]*linkedin\.com\/in\/[^\s"'`)\\]+/gi,
  github: /https?:\/\/(?:www\.)?github\.com\/[A-Za-z0-9_-]+(?![^\s"'`)]*\/)/gi,
  youtube: /https?:\/\/[^\s"'`)\\]*youtube\.com\/@[^\s"'`)\\]+/gi,
  x: /https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[A-Za-z0-9_]+/gi,
  facebook: /https?:\/\/[^\s"'`)]*facebook\.com\/[A-Za-z0-9_.-]+/gi,
  instagram: /https?:\/\/[^\s"'`)]*instagram\.com\/[A-Za-z0-9_.-]+/gi,
};

/* The /v/* design variants are robots-disallowed dead stock from the 2026-06
   variant bake-off and are NOT part of the entity graph. Excluded on purpose. */
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".critic",
  "public",
  "v",
]);
const EXTS = new Set([".ts", ".tsx", ".md", ".json", ".txt"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXTS.has(extname(name))) out.push(p);
  }
  return out;
}

const findings = {};
for (const key of Object.keys(MATCHERS)) findings[key] = new Map();

function scan(label, text) {
  for (const [key, re] of Object.entries(MATCHERS)) {
    for (const hit of text.match(re) ?? []) {
      const clean = hit.replace(/[.,)]+$/, "");
      if (!findings[key].has(clean)) findings[key].set(clean, new Set());
      findings[key].get(clean).add(label);
    }
  }
}

for (const file of walk(ROOT)) {
  scan(file.slice(ROOT.length), readFileSync(file, "utf8"));
}

if (process.argv.includes("--live")) {
  const SITE = "https://www.waseemnasir.com";
  const urls = [
    "/",
    "/about",
    "/blog",
    "/mentorship",
    "/inbox-ops",
    "/book",
    "/llms.txt",
    "/blog/a-real-day-running-an-automation-agency-from-bali",
    "/blog/edited-10-travel-vlogs-in-one-night-with-claude-code",
  ];
  for (const u of urls) {
    const res = await fetch(SITE + u);
    scan(`LIVE ${u} (${res.status})`, await res.text());
  }
}

let failed = false;
for (const [key, canonical] of Object.entries(CANONICAL)) {
  const found = findings[key];
  const wrong = [...found.keys()].filter((s) => s !== canonical);
  if (found.size === 0) {
    console.log(`○ ${key.padEnd(10)} not referenced anywhere`);
    continue;
  }
  if (wrong.length === 0) {
    console.log(`✓ ${key.padEnd(10)} one string: ${canonical}`);
    continue;
  }
  failed = true;
  console.log(`✗ ${key.padEnd(10)} DRIFT — expected ${canonical}`);
  for (const w of wrong) {
    console.log(`    ${w}`);
    for (const where of found.get(w)) console.log(`      ← ${where}`);
  }
}

if (failed) {
  console.error("\nENTITY GATE FAILED: more than one string per platform.");
  process.exit(1);
}
console.log("\nENTITY GATE PASSED: one string per platform.");
