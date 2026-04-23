#!/usr/bin/env node
/**
 * IndexNow batch ping — submits all URLs from sitemap.xml to the IndexNow
 * endpoint (Bing, Yandex, Naver, Seznam, DuckDuckGo via Bing, Ecosia, Qwant).
 *
 * When to run:
 * - Once, right after nordpush.de goes live (manual bootstrap)
 * - After substantial content launches (new service pages, blog batches)
 *
 * NOT needed:
 * - On every deploy — IndexNow rate-limits; Stufe 1 policy is manual
 *   batching only. For automation, upgrade to Stufe 2 (Vercel deploy hook).
 *
 * Usage:
 *   node scripts/indexnow-ping.mjs
 *
 * Env overrides:
 *   INDEXNOW_KEY      override the hardcoded key (defaults to the one below)
 *   INDEXNOW_HOST     override the host (defaults to nordpush.de)
 *   SITEMAP_URL       override where the sitemap is fetched from
 *
 * IndexNow spec: https://www.indexnow.org/documentation
 */

const KEY = process.env.INDEXNOW_KEY ?? "1daf93baabfbaa223b26dd81e7c363ea";
const HOST = process.env.INDEXNOW_HOST ?? "nordpush.de";
const SITEMAP_URL =
  process.env.SITEMAP_URL ?? `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function fetchSitemapUrls(sitemapUrl) {
  const res = await fetch(sitemapUrl, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`Sitemap fetch failed: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  // Minimal XML parsing — matches <loc>URL</loc>. Good enough for our
  // Next.js-generated sitemap.
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1].trim());
}

async function submitBatch(urls) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  // IndexNow responses:
  //   200 — URLs accepted for processing
  //   202 — URLs received but need validation (first request from a new host)
  //   400 — Bad request (malformed JSON / invalid URL format)
  //   403 — Forbidden (key file not found or key mismatch)
  //   422 — Unprocessable (URL not under host)
  //   429 — Too Many Requests
  const txt = await res.text().catch(() => "");
  return { status: res.status, body: txt };
}

async function main() {
  console.log(`IndexNow host:        ${HOST}`);
  console.log(`IndexNow key file:    https://${HOST}/${KEY}.txt`);
  console.log(`Fetching sitemap:     ${SITEMAP_URL}`);

  const urls = await fetchSitemapUrls(SITEMAP_URL);
  console.log(`Found ${urls.length} URLs in sitemap.\n`);

  if (urls.length === 0) {
    console.error("No URLs to submit. Aborting.");
    process.exit(1);
  }

  // IndexNow accepts up to 10,000 URLs per request, so one batch is enough
  // for the entire NordPush site (< 50 URLs).
  const { status, body } = await submitBatch(urls);
  console.log(`IndexNow response:    HTTP ${status}`);
  if (body) console.log(`Body:                 ${body}`);

  if (status === 200 || status === 202) {
    console.log(`\n✓ ${urls.length} URLs submitted successfully.`);
  } else {
    console.error(`\n✗ Submission failed. Check the key file is reachable at`);
    console.error(`  https://${HOST}/${KEY}.txt`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
