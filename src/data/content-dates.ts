/**
 * Explicit lastModified dates per canonical path for non-blog content.
 *
 * Sitemap finding M8 (claude-seo, 2026-04-23): all 35 legacy sitemap
 * URLs shared the same generatedAt timestamp from the canonical
 * inventory. Google has been publicly deprecating lastmod as a signal
 * for sites that game it with build-time artefacts; real per-page
 * edit dates restore the signal's value.
 *
 * Why hand-curated rather than git-log or mtime based: Vercel's
 * shallow-clone default (depth 1) makes git-log timestamps collapse
 * to the HEAD commit for every file. Explicit dates are both more
 * honest and more reliable — each entry below reflects an actual
 * content edit that a reasonable editor would call out.
 *
 * Blog / Article URLs are intentionally omitted — those are served
 * from `src/data/blog-dates.ts` which is also the source of Article
 * schema `datePublished` / `dateModified`. The sitemap resolver in
 * `src/app/sitemap.ts` looks up blog-dates first, content-dates
 * second, and falls back to the canonical inventory timestamp for
 * any path that's not explicitly listed.
 *
 * Date format: ISO-8601 date or datetime string. Time zones optional.
 *
 * When editing this file: update the matching path's date to the day
 * of the content change. Metadata-only tweaks (title/description
 * polish) typically don't warrant a bump; substantive copy, structure
 * or pricing changes do.
 */

const contentDatesByPath: Record<string, string> = {
  // -------------------------------------------------------------------
  // Deep content rewrites on 2026-04-23 (audit-sweep session)
  // -------------------------------------------------------------------
  "/": "2026-04-23",                          // M2: sourced stats on homepage
  "/seo-audit/": "2026-04-23",                // H1 scope-split + M2 stats
  "/technisches-seo-audit/": "2026-04-23",    // C1 WP-content rewrite + H1 + M2
  "/geo-optimierung/": "2026-04-23",          // H7 definition + M10 FAQs
  "/datenschutz/": "2026-04-23",              // #15 descriptive link texts
  "/kontakt/": "2026-04-23",                  // phone removal + email harmonise
  "/ueber-uns/": "2026-04-23",                // 2014→2021 correction + CSS layout
  "/category/wissen/": "2026-04-23",          // aria-label + card layout

  // -------------------------------------------------------------------
  // Surface edits on 2026-04-22: description-overrides (#12), "100+
  // zufriedene Kunden" → "Vertraut von B2B-Unternehmen in ganz DACH"
  // (M2 Phase 2), and the "Betreeung"/"dauerthaft" typo fix. All of
  // these change rendered HTML, so a bump is warranted.
  // -------------------------------------------------------------------
  "/b2b-seo-agentur/": "2026-04-22",
  "/backlinks/": "2026-04-22",
  "/content-marketing/": "2026-04-22",
  "/content-templates/": "2026-04-22",
  "/e-commerce-seo/": "2026-04-22",
  "/google-unternehmensprofil/": "2026-04-22",
  "/internationales-seo/": "2026-04-22",
  "/keyword-recherche/": "2026-04-22",
  "/link-risk-management/": "2026-04-22",
  "/pagespeed-optimierung/": "2026-04-22",
  "/seo-beratung/": "2026-04-22",
  "/seo-betreuung/": "2026-04-22",
  "/seo-fuer-lokale-unternehmen/": "2026-04-22",
  "/seo-konkurrenzanalyse/": "2026-04-22",
  "/seo-monitoring/": "2026-04-22",
  "/seo-relaunch/": "2026-04-22",
  "/seo-strategie/": "2026-04-22",
  "/seo-texte-schreiben/": "2026-04-22",
  "/wordpress-seo/": "2026-04-22",

  // -------------------------------------------------------------------
  // Earlier writes (pre-audit-sweep). Not touched by the audit but had
  // real content work in the same week.
  // -------------------------------------------------------------------
  "/preise/": "2026-04-15",                   // structural work + SeoPricingSection
  "/websites/": "2026-04-15",                 // case-study copy + starter bonus
  "/impressum/": "2026-04-15",                // hand-authored fresh
  "/agb/": "2026-04-15",                      // hand-authored fresh (B2B clauses)
};

export function getContentDate(canonicalPath: string): string | undefined {
  return contentDatesByPath[canonicalPath];
}
