/**
 * Meta-description overrides for pages whose legacy WordPress snapshot
 * descriptions exceed Sistrix's good-zone pixel width (≤ 791 px).
 *
 * Audit finding #12 (SEOmator CLI, 2026-04-23): 17 descriptions flagged
 * as >920 px by the tool. Widening the safety margin to Sistrix's strict
 * good-zone (≤ 791 px), we identified 24 descriptions that need
 * rewriting for pixel-safe SERP rendering without truncation.
 *
 * All values below were measured with an Arial-13px width model and
 * verified ≤ 740 px — comfortably inside the good zone with headroom
 * for future word-additions.
 *
 * When adding new descriptions, run the px-width check in
 * /tmp/build-cli-audit-xlsx.py (or verify locally) and stay ≤ 780 px.
 */

const descriptionOverrides: Record<string, string> = {
  "/":
    "Strategische SEO für mehr Sichtbarkeit und messbare Ergebnisse. NordPush — Agentur für Websites und SEO aus Neumünster.",
  "/wordpress-seo/":
    "WordPress-SEO für bessere Rankings: Core Web Vitals, Schema, OnPage-Fixes und laufende Betreuung von NordPush.",
  "/technisches-seo-audit/":
    "Technisches SEO-Audit: Crawling, Indexierung, Core Web Vitals. Priorisierter Maßnahmenplan von NordPush — ab 1.499 €.",
  "/content-marketing/":
    "Content-Marketing mit SEO-Substanz: Texte, Strukturen und Themencluster, die ranken und Leads bringen. Von NordPush.",
  "/e-commerce-seo/":
    "E-Commerce-SEO für Online-Shops: mehr organische Sichtbarkeit, qualifizierter Traffic und bessere Conversion. Von NordPush.",
  "/google-unternehmensprofil/":
    "Google-Unternehmensprofil professionell optimieren: lokale Top-Rankings, mehr Anfragen und Vertrauen. Von NordPush.",
  "/seo-betreuung/":
    "Laufende SEO-Betreuung für KMU: Rankings verbessern, qualifizierten Traffic gewinnen, Umsatz steigern. Von NordPush.",
  "/seo-konkurrenzanalyse/":
    "SEO-Konkurrenzanalyse: Stärken, Lücken und Chancen deiner Mitbewerber — mit konkretem Aktionsplan. Ab 1.199 €.",
  "/pagespeed-optimierung/":
    "PageSpeed-Optimierung für Rankings und Conversions: Core Web Vitals, bessere UX, messbare Ergebnisse. Von NordPush.",
  "/seo-strategie/":
    "Maßgeschneiderte SEO-Strategien für KMU: mehr Sichtbarkeit, qualifizierte Leads und messbarer ROI. Von NordPush.",
  "/seo-relaunch/":
    "Website-Relaunch ohne SEO-Verluste: Planung, Weiterleitungen, Monitoring bis zum Go-live. Von NordPush.",
  "/geo-optimierung/":
    "Generative Engine Optimization: Inhalte, die ChatGPT und Perplexity zitieren. GEO-Strategie von NordPush.",
  "/seo-texte-schreiben/":
    "SEO-Texte, die ranken und überzeugen: keyword-optimierte Inhalte mit Conversion-Fokus. Von NordPush.",
  "/seo-beratung/":
    "SEO-Beratung von NordPush: individuelle Strategien für bessere Rankings und nachhaltiges Wachstum.",
  "/internationales-seo/":
    "Internationales SEO: mehr Traffic und Umsatz in neuen Märkten — hreflang, Content, Technik. Von NordPush.",
  "/backlinks/":
    "Nachhaltiger Backlink-Aufbau: mehr Autorität, Traffic und Kunden durch hochwertige Links. Von NordPush.",
  "/etsy-seo/":
    "Etsy-SEO richtig gemacht: Keywords, Listings, Sichtbarkeit. Praxis-Tipps für mehr Shop-Umsatz — von NordPush.",
  "/content-templates/":
    "SEO-Content-Templates: strukturierte, suchmaschinenoptimierte Texte — effizient und skalierbar. Von NordPush.",
  "/seo-monitoring/":
    "SEO-Monitoring mit klarem Reporting: Rankings, Sichtbarkeit, Wettbewerb und Quick Wins. Von NordPush.",
  "/seo-neumuenster/":
    "SEO-Agentur in Neumünster: individuelle Strategien, Coaching und zuverlässige Betreuung für mehr Traffic.",
  "/ueber-uns/":
    "Das ist NordPush: Wir sehen SEO nicht als Dienstleistung, sondern als Partnerschaft. Agentur aus Neumünster.",
  "/link-risk-management/":
    "Link Risk Management: toxische Backlinks erkennen, analysieren und disavowen. Rankings schützen — von NordPush.",
  "/keyword-recherche/":
    "Keyword-Recherche mit Profi-Tools: Suchvolumen, Intent, Mapping zu Seitentypen. Ab 1.199 €. Von NordPush.",
  "/seo-audit/":
    "Technisches und inhaltliches SEO-Audit: Prioritäten, Quick Wins, umsetzbare Maßnahmen. Ab 1.499 €. Von NordPush.",
};

export function getDescriptionOverride(canonicalPath: string): string | undefined {
  return descriptionOverrides[canonicalPath];
}
