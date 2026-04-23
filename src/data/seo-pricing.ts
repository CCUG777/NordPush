/**
 * Single source of truth for SEO retainer pricing.
 *
 * Rendered on /preise/ via the SeoPricingSection React component.
 *
 * Annual price = monthly × 12 × 0.9 (10 % discount for upfront commitment).
 * When you change a monthly price here, update the annual price too.
 */

export type SeoRetainerTier = {
  id: string;
  title: string;
  monthlyRate: string;       // e.g. "1.200 €"
  annualRate: string;        // e.g. "12.960 €"  (= monthly × 12 × 0.9)
  annualSavings: string;     // e.g. "1.440 € Ersparnis"
  audience: string;          // e.g. "Kleinbetriebe, …"
  body: string;
  includes: readonly string[];
  recommended?: boolean;
};

export const seoRetainerTiers: readonly SeoRetainerTier[] = [
  {
    id: "starter",
    title: "Starter",
    monthlyRate: "1.200 €",
    annualRate: "12.960 €",
    annualSavings: "1.440 € Ersparnis",
    audience: "Kleinbetriebe, die erste strukturierte SEO-Schritte gehen wollen.",
    body:
      "Strukturierter Einstieg mit monatlichem Fortschritt, ohne dass du intern SEO-Kapazität aufbauen musst.",
    includes: [
      "SEO-Beratung (1 h Zeitkontingent)",
      "OnSite- & OnPage-Monitoring",
      "Technik & UX",
      "Content Marketing (2 SEO-Texte)",
      "Backlinks & Digital PR (als Add-on)",
    ],
  },
  {
    id: "wachstum",
    title: "Wachstum",
    monthlyRate: "2.200 €",
    annualRate: "23.760 €",
    annualSavings: "2.640 € Ersparnis",
    audience: "Etabliertes KMU, das SEO ernsthaft skalieren will.",
    body:
      "Sichtbares monatliches Content- und Link-Volumen kombiniert mit laufender Technik- und Conversion-Optimierung.",
    includes: [
      "SEO-Beratung (2 h Zeitkontingent)",
      "OnSite- & OnPage-Monitoring",
      "Technik & UX",
      "Content Marketing (4 SEO-Texte)",
      "Digital PR (1 Linkable Asset; 2 Backlinks)",
    ],
    recommended: true,
  },
  {
    id: "skalierung",
    title: "Skalierung",
    monthlyRate: "3.800 €",
    annualRate: "41.040 €",
    annualSavings: "4.560 € Ersparnis",
    audience: "Unternehmen in Wachstumsphase mit aggressiven Sichtbarkeits-Zielen.",
    body:
      "Hohes Content- und Link-Volumen plus Strategie-Workshops, damit SEO tatsächlich Wachstums-Motor wird.",
    includes: [
      "SEO-Beratung (4 h + Strategie-Workshop)",
      "OnSite- & OnPage-Monitoring",
      "Technik & UX",
      "Content Marketing (6 SEO-Texte)",
      "Digital PR (2 Linkable Assets; 4 Backlinks)",
    ],
  },
  {
    id: "enterprise",
    title: "Enterprise",
    monthlyRate: "ab 6.900 €",
    annualRate: "ab 74.520 €",
    annualSavings: "ab 8.280 € Ersparnis",
    audience: "Multi-Brand, internationale Konzerne, komplexe Setups.",
    body:
      "Dediziertes Team, internationale Strategie und Management-Reporting — individuell kalkuliert.",
    includes: [
      "Dediziertes Team & Account-Lead",
      "Strategie-Sprints & Roadmap-Planung",
      "Mehrsprachige Inhalte & hreflang-Setup",
      "Internationale Link-Strategie",
      "Monatliches Reporting auf Management-Ebene",
    ],
  },
];
