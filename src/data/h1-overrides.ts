/**
 * H1 overrides for pages whose legacy WordPress snapshot title is
 * inconsistent with the site's typographic conventions.
 *
 * Visual-review finding #9: the WordPress snapshot rendered some
 * compound nouns without a hyphen ("SEO Strategie" / "SEO Betreuung")
 * while the URLs and the rest of the site use the hyphenated form
 * ("seo-strategie", "SEO-Audit", "SEO-Konkurrenzanalyse" in nav).
 * German Duden orthography also calls for the hyphen when an
 * acronym is followed by a noun.
 *
 * Location-based local-SEO H1s ("SEO Bamberg", "SEO Neumünster",
 * "SEO Sachsen") are intentionally NOT overridden here: those follow
 * the standard German marketing convention of treating the location
 * as a non-compound qualifier ("SEO" + place), not a compound noun.
 *
 * When the catalog returns no override, getHeadingFor falls back to
 * the snapshot's h1 → title → fallback chain as before.
 */

const h1Overrides: Record<string, string> = {
  "/seo-strategie/":
    "Die richtige SEO-Strategie ist dein Wegweiser zu mehr Sichtbarkeit",
  "/seo-betreuung/":
    "SEO-Betreuung: Dein Weg zu nachhaltiger Sichtbarkeit bei Google",
};

export function getH1Override(canonicalPath: string): string | undefined {
  return h1Overrides[canonicalPath];
}
