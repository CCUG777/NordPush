import type { MetadataRoute } from "next";
import { getCanonicalInventoryGeneratedAt, listCanonicalRecords } from "@/lib/canonical-catalog";
import { getBlogDates } from "@/data/blog-dates";
import { getContentDate } from "@/data/content-dates";
import { toAbsoluteUrl } from "@/lib/url-normalization";

// Additional paths for routes created post-relaunch that are not part of the
// legacy canonical inventory. Each entry must exist as a real Next.js route.
const postRelaunchPaths: ReadonlyArray<{ canonicalPath: string }> = [
  { canonicalPath: "/websites/" },
  { canonicalPath: "/agb/" },
];

/**
 * Resolve the most accurate lastModified timestamp for a canonical path.
 *
 * Lookup order (claude-seo finding M8):
 *   1. blog-dates.ts dateModified — authoritative for the six blog/article
 *      slugs and kept in sync with the Article JSON-LD dateModified.
 *   2. content-dates.ts — hand-curated per-URL edit dates for every other
 *      path we've touched.
 *   3. Canonical inventory generatedAt — last-resort fallback only for
 *      paths not explicitly dated above. Any path that still hits this
 *      branch should be moved into content-dates next time it's edited.
 *
 * Previously all 35 legacy URLs shared the same generatedAt timestamp,
 * which is why Google had started to discount lastmod from this sitemap
 * entirely. Now each URL reflects a real edit date.
 */
function resolveLastModified(canonicalPath: string, fallback: Date): Date {
  const blog = getBlogDates(canonicalPath)?.dateModified;
  if (blog) return new Date(blog);

  const explicit = getContentDate(canonicalPath);
  if (explicit) return new Date(explicit);

  return fallback;
}

/**
 * Sitemap emitter. Note the fields we deliberately do NOT include
 * (claude-seo finding M9):
 *
 * - `priority`: Google ignored this since 2017; Bing deprecated in 2021.
 *   Leaving it in inflates file size and can look like sitemap-gaming
 *   to audit tools.
 * - `changeFrequency`: same story — Google's John Mueller on record
 *   multiple times since 2015 that it's ignored. We instead rely on
 *   real `lastModified` signals and let crawlers decide recrawl cadence.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const generatedAt = getCanonicalInventoryGeneratedAt();

  const legacy = listCanonicalRecords().map((record) => ({
    url: toAbsoluteUrl(record.canonicalPath),
    lastModified: resolveLastModified(record.canonicalPath, generatedAt),
  }));

  const additional = postRelaunchPaths.map((entry) => ({
    url: toAbsoluteUrl(entry.canonicalPath),
    lastModified: resolveLastModified(entry.canonicalPath, generatedAt),
  }));

  return [...legacy, ...additional];
}
