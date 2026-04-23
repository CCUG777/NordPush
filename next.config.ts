import type { NextConfig } from "next";

const serviceSlugs = [
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
];

const localSeoSlugs: string[] = [];
const legalSlugs = ["agb", "datenschutz", "impressum"];
const conversionSlugs = ["kontakt", "preise"];
const authorSlugs = ["ueber-uns"];
const blogSlugs = ["agentur", "etsy-seo", "seo-bamberg", "seo-neumuenster", "seo-sachsen", "suchmaschinenoptimierung"];

const rewriteToSection = [
  ...serviceSlugs.map((slug) => ({ source: `/${slug}/`, destination: `/services/${slug}/` })),
  ...localSeoSlugs.map((slug) => ({ source: `/${slug}/`, destination: `/services/${slug}/` })),
  ...legalSlugs.map((slug) => ({ source: `/${slug}/`, destination: `/legal/${slug}/` })),
  ...conversionSlugs.map((slug) => ({ source: `/${slug}/`, destination: `/legal/${slug}/` })),
  ...authorSlugs.map((slug) => ({ source: `/${slug}/`, destination: `/author/${slug}/` })),
  ...blogSlugs.map((slug) => ({ source: `/${slug}/`, destination: `/blog/${slug}/` })),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  async rewrites() {
    return {
      beforeFiles: rewriteToSection,
    };
  },
};

export default nextConfig;
