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

// -----------------------------------------------------------------------------
// Security headers — SEO-Audit Befund #5.
//
// HSTS is set by Vercel by default (max-age=63072000; includeSubDomains; preload),
// so we do not override it here.
//
// CSP is ENFORCING (claude-seo re-audit M6 Option C). The known weakness
// is `'unsafe-inline'` in script-src, which leaves an inline-script XSS
// hole open — deliberately kept for now because:
//
//   1. The primary inline-script attack path (WordPress HTML via
//      dangerouslySetInnerHTML) is mitigated by DOMPurify build-time
//      sanitization in RichBody (commit 7ac40cd, finding T4).
//   2. The alternative paths — nonce-based or hash-based CSP — either
//      disable SSG (nonces are per-request, make every page dynamic) or
//      require ongoing hash-list maintenance. For a static B2B
//      marketing site without logins/PII/payment flows, the SSG
//      tradeoff is not worth it.
//
// Non-script protections DO bite with this enforcement:
//   - frame-ancestors 'none'           → clickjacking blocked
//   - form-action 'self'                → form hijacking blocked
//   - upgrade-insecure-requests         → mixed-content auto-upgraded
//   - object-src 'none'                 → Flash/plugin vectors blocked
//   - base-uri 'self'                   → base-tag hijacking blocked
//
// `vercel.live` is only used on Preview deployments for the comment/collab
// UI — harmless in production, required to avoid CSP noise on previews.
// `va.vercel-scripts.com` + `vitals.vercel-insights.com` cover Vercel
// Analytics / Speed Insights (even if currently not enabled — pre-allowing
// means adding them later doesn't require CSP changes).
//
// `vercel.live` is only used on Preview deployments for the comment/collab
// UI — harmless in production, required to avoid CSP noise on previews.
// `va.vercel-scripts.com` + `vitals.vercel-insights.com` cover Vercel
// Analytics / Speed Insights (even if currently not enabled — pre-allowing
// means adding them later doesn't require CSP changes).
// -----------------------------------------------------------------------------

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Prevents MIME-type sniffing; caught at zero cost.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Modern replacement for X-Frame-Options. Still adding both for legacy bots.
  { key: "X-Frame-Options", value: "DENY" },
  // Referer leakage control — sends origin only to cross-origin HTTPS peers.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable camera/microphone/geolocation/FLoC — none of them are used.
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  },
  // Cross-Origin-Isolation header trio (claude-seo M7).
  //
  // Previously only COOP was set — which is security theatre without its
  // companions: cross-origin isolation only activates when all three
  // (COOP + COEP + CORP) align, and the modern JS APIs that depend on it
  // (SharedArrayBuffer, high-resolution performance.now, WASM threads)
  // require `crossOriginIsolated === true`.
  //
  // COEP uses `credentialless` rather than `require-corp` deliberately:
  //   - `require-corp` blocks any third-party resource that doesn't
  //     advertise Cross-Origin-Resource-Policy on its response. That
  //     breaks analytics, calendar embeds, social pixels on the day
  //     they get added.
  //   - `credentialless` keeps isolation active while still allowing
  //     third-party resources without CORP headers — the request just
  //     goes out without cookies/auth. Perfect for GA4, GTM, LinkedIn
  //     Pixel, Calendly, etc., which never need credentials on their
  //     script loads.
  //   - Browser support: Chrome 96+, Firefox 110+, Safari 16.4+ — all
  //     shipped 2+ years ago, broadly safe in 2026.
  //
  // CORP `same-site` means our own assets (images, generated OG images,
  // the Satoshi font bundle) can be embedded across nordpush.de and any
  // subdomain, but not hotlinked by unrelated domains.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  // CSP enforcing (see comment block above for the 'unsafe-inline'
  // trade-off and why nonce/hash modes were not chosen).
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // Image optimization output formats. Next.js picks the first entry the
  // requesting browser supports via the `Accept` header. AVIF is ~30%
  // smaller than WebP at equivalent quality; browser support is Chrome
  // 85+, Firefox 93+, Safari 16.4+ (~95% of traffic in 2026). WebP stays
  // as the universal fallback. Originals (JPG/PNG) remain untouched on
  // disk — transformation happens at the edge via Vercel's image
  // optimizer. claude-seo re-audit P1-variant fix.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return {
      beforeFiles: rewriteToSection,
    };
  },
  async headers() {
    return [
      {
        // Apply to every route, including static assets served from /public/.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
