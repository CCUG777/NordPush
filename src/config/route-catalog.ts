export const serviceSlugs = [
  "b2b-seo-agentur",
  "backlinks",
  "content-marketing",
  "content-templates",
  "e-commerce-seo",
  "geo-optimierung",
  "google-unternehmensprofil",
  "internationales-seo",
  "keyword-recherche",
  "link-risk-management",
  "pagespeed-optimierung",
  "seo-audit",
  "seo-beratung",
  "seo-betreuung",
  "seo-fuer-lokale-unternehmen",
  "seo-konkurrenzanalyse",
  "seo-monitoring",
  "seo-relaunch",
  "seo-strategie",
  "seo-texte-schreiben",
  "technisches-seo-audit",
  "wordpress-seo",
] as const;

export const localSeoSlugs = [] as const;
export const blogSlugs = ["agentur", "etsy-seo", "seo-bamberg", "seo-neumuenster", "seo-sachsen", "suchmaschinenoptimierung"] as const;
export const blogCategoryPath = "/category/wissen/" as const;
export const legalSlugs = ["agb", "datenschutz", "impressum"] as const;
export const conversionSlugs = ["kontakt", "preise"] as const;
export const authorSlugs = ["ueber-uns"] as const;
// Websites hub lives at /websites/ as a standalone info page.
// Deeper case-study URLs (/cases/[slug]/) come later, once real client content exists.
export const websitesHubPath = "/websites/" as const;

export type ServiceSlug = (typeof serviceSlugs)[number];
export type LocalSeoSlug = (typeof localSeoSlugs)[number];
export type BlogSlug = (typeof blogSlugs)[number];
export type LegalSlug = (typeof legalSlugs)[number];
export type ConversionSlug = (typeof conversionSlugs)[number];
export type AuthorSlug = (typeof authorSlugs)[number];

export const allServiceLikeSlugs = [...serviceSlugs, ...localSeoSlugs] as const;
export const allLegalLikeSlugs = [...legalSlugs, ...conversionSlugs] as const;

export function isServiceLikeSlug(slug: string): slug is (typeof allServiceLikeSlugs)[number] {
  return (allServiceLikeSlugs as readonly string[]).includes(slug);
}

export function isLocalSeoSlug(slug: string): slug is LocalSeoSlug {
  return (localSeoSlugs as readonly string[]).includes(slug);
}

export function isBlogSlug(slug: string): slug is BlogSlug {
  return (blogSlugs as readonly string[]).includes(slug);
}

export function isLegalLikeSlug(slug: string): slug is (typeof allLegalLikeSlugs)[number] {
  return (allLegalLikeSlugs as readonly string[]).includes(slug);
}

export function isAuthorSlug(slug: string): slug is AuthorSlug {
  return (authorSlugs as readonly string[]).includes(slug);
}
