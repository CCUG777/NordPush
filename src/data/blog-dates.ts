/**
 * Publication + modification dates for blog / knowledge articles.
 *
 * Sourced from the WordPress snapshot (`article:published_time` /
 * `article:modified_time` OG tags). Required for valid Article JSON-LD —
 * Google rejects Article rich results without `datePublished`.
 *
 * Audit finding #11 (CLI SEOmator, 2026-04-23): 6 Article schemas on
 * /agentur/, /etsy-seo/, /seo-bamberg/, /seo-neumuenster/, /seo-sachsen/,
 * /suchmaschinenoptimierung/ were missing `datePublished`.
 *
 * Keep dates in ISO-8601 with timezone offset. When you substantively
 * rewrite a post, bump `dateModified` to the edit date.
 */

export type BlogDates = {
  datePublished: string;
  dateModified: string;
  /** OG/hero image URL (absolute). Optional — omit if none is migrated yet. */
  image?: string;
};

const blogDatesByPath: Record<string, BlogDates> = {
  "/agentur/": {
    datePublished: "2025-04-09T10:16:49+00:00",
    dateModified: "2026-04-22T00:00:00+00:00",
  },
  "/etsy-seo/": {
    datePublished: "2025-06-26T19:26:15+00:00",
    dateModified: "2026-04-22T00:00:00+00:00",
  },
  "/seo-bamberg/": {
    datePublished: "2025-07-02T07:54:41+00:00",
    // Case-study section rewritten (M3) + heading hierarchy fixed (#13) +
    // description-override (#12) + 100+-badge softened (M2) on 2026-04-23.
    dateModified: "2026-04-23T00:00:00+00:00",
  },
  "/seo-neumuenster/": {
    datePublished: "2025-06-20T13:43:15+00:00",
    dateModified: "2026-04-22T00:00:00+00:00",
  },
  "/seo-sachsen/": {
    datePublished: "2025-06-29T15:48:45+00:00",
    dateModified: "2026-04-22T00:00:00+00:00",
  },
  "/suchmaschinenoptimierung/": {
    datePublished: "2025-04-09T10:16:49+00:00",
    dateModified: "2026-04-22T00:00:00+00:00",
  },
};

export function getBlogDates(canonicalPath: string): BlogDates | undefined {
  return blogDatesByPath[canonicalPath];
}
