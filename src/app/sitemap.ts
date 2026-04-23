import type { MetadataRoute } from "next";
import { getCanonicalInventoryGeneratedAt, listCanonicalRecords } from "@/lib/canonical-catalog";
import { toAbsoluteUrl } from "@/lib/url-normalization";

const changeFrequencyByPageType: Record<string, MetadataRoute.Sitemap[number]["changeFrequency"]> = {
  homepage: "weekly",
  service: "weekly",
  local_seo: "weekly",
  blog_or_other: "monthly",
  blog_category: "weekly",
  info_legal_or_conversion: "monthly",
  about_or_author: "monthly",
};

const priorityByPageType: Record<string, number> = {
  homepage: 1,
  service: 0.9,
  local_seo: 0.85,
  blog_or_other: 0.7,
  blog_category: 0.7,
  info_legal_or_conversion: 0.6,
  about_or_author: 0.65,
};

// Additional paths for routes created post-relaunch that are not part of the
// legacy canonical inventory. Each entry must exist as a real Next.js route.
const postRelaunchPaths: ReadonlyArray<{
  canonicalPath: string;
  pageType: keyof typeof changeFrequencyByPageType;
}> = [
  { canonicalPath: "/websites/", pageType: "service" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const generatedAt = getCanonicalInventoryGeneratedAt();
  const now = new Date();

  const legacy = listCanonicalRecords().map((record) => ({
    url: toAbsoluteUrl(record.canonicalPath),
    lastModified: generatedAt,
    changeFrequency: changeFrequencyByPageType[record.pageType] ?? "monthly",
    priority: priorityByPageType[record.pageType] ?? 0.5,
  }));

  const additional = postRelaunchPaths.map((entry) => ({
    url: toAbsoluteUrl(entry.canonicalPath),
    lastModified: now,
    changeFrequency: changeFrequencyByPageType[entry.pageType] ?? "monthly",
    priority: priorityByPageType[entry.pageType] ?? 0.5,
  }));

  return [...legacy, ...additional];
}
