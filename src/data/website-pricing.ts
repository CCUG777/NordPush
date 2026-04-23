/**
 * Single source of truth for website-project pricing.
 *
 * Three pricing models live here:
 *   1. `websitePricingTiers`  — one-time cash purchases (existing)
 *   2. `websiteAboTiers`      — monthly subscription with hosting + maintenance
 *   3. `bundleTiers`          — monthly Website + SEO combo
 *
 * Rendered on:
 *   - /websites/  — full narrative + all three pricing models
 *   - /preise/    — compact teaser above the legacy WordPress body
 *
 * When you change a price here, both surfaces update automatically.
 */

// ---------------------------------------------------------------------------
// 1) Cash tiers — one-time purchases
// ---------------------------------------------------------------------------

export type WebsitePricingTier = {
  value: string;
  title: string;
  body: string;
};

export const websitePricingTiers: readonly WebsitePricingTier[] = [
  {
    value: "ab 4.900 €",
    title: "Landingpage",
    body: "Einzel-Seite mit Konzept, Design, Entwicklung und Analytics-Anbindung.",
  },
  {
    value: "ab 9.900 €",
    title: "WordPress-Website",
    body: "Mehrseitige Unternehmens-Website mit individuellem Theme und redaktionellem System.",
  },
  {
    value: "ab 14.900 €",
    title: "Online-Shop",
    body: "E-Commerce-Projekt auf WooCommerce oder Shopify, bereit für SEO und Conversion.",
  },
  {
    value: "auf Anfrage",
    title: "Individuelle Projekte",
    body: "Headless-Setups, Marktplätze, Mehrsprachigkeit oder komplexe Integrationen — Umfang und Preis klären wir im Scope-Gespräch.",
  },
];

// ---------------------------------------------------------------------------
// 2) Abo tiers — monthly subscription with NordPush hosting + maintenance
// ---------------------------------------------------------------------------

export type WebsiteAboTier = {
  id: string;
  title: string;
  rate: string;           // e.g. "229 €"
  suffix: string;         // e.g. "/ Monat"
  term: string;           // e.g. "24 Monate Mindestlaufzeit"
  equivalent: string;     // e.g. "≈ 5.496 € auf 24 Monate"
  body: string;
  includes: readonly string[];
  recommended?: boolean;  // show "Beliebt"-Badge
};

export const websiteAboTiers: readonly WebsiteAboTier[] = [
  {
    id: "landingpage-abo",
    title: "Landingpage-Abo",
    rate: "229 €",
    suffix: "/ Monat",
    term: "24 Monate Mindestlaufzeit",
    equivalent: "≈ 5.496 € auf 24 Monate",
    body:
      "Fokussierte Einzel-Seite mit Konzept, Design, Entwicklung — plus Hosting und Wartung im Monatspaket.",
    includes: [
      "Landingpage mit Konzept, Design, Entwicklung",
      "Hosting auf NordPush-Infrastruktur",
      "Wartung, Updates, Backups, SSL",
      "1 h Änderungen pro Monat inklusive",
      "Nach 24 Monaten monatlich kündbar",
    ],
  },
  {
    id: "website-abo",
    title: "Website-Abo",
    rate: "479 €",
    suffix: "/ Monat",
    term: "24 Monate Mindestlaufzeit",
    equivalent: "≈ 11.496 € auf 24 Monate",
    body:
      "Mehrseitige Unternehmens-Website mit individuellem Theme und redaktionellem System — gehostet und gepflegt von uns.",
    includes: [
      "WordPress-Website mit eigenem Theme",
      "Hosting auf NordPush-Infrastruktur",
      "Wartung, Updates, Backups, SSL",
      "1 h Änderungen pro Monat inklusive",
      "Nach 24 Monaten monatlich kündbar",
    ],
    recommended: true,
  },
  {
    id: "shop-abo",
    title: "Online-Shop-Abo",
    rate: "699 €",
    suffix: "/ Monat",
    term: "24 Monate Mindestlaufzeit",
    equivalent: "≈ 16.776 € auf 24 Monate",
    body:
      "E-Commerce-Projekt auf WooCommerce oder Shopify, bereit für SEO und Conversion — mit laufender Pflege.",
    includes: [
      "Online-Shop mit Produkten und Checkout",
      "Hosting auf NordPush-Infrastruktur",
      "Wartung, Updates, Backups, SSL",
      "2 h Änderungen pro Monat inklusive",
      "Nach 24 Monaten monatlich kündbar",
    ],
  },
];

// ---------------------------------------------------------------------------
// 3) Bundle tiers — Website + SEO in a single monthly package
// ---------------------------------------------------------------------------

export type BundleTier = {
  id: string;
  title: string;
  rate: string;
  suffix: string;
  term: string;
  savings: string;        // e.g. "~15 % günstiger als einzeln gebucht"
  savingsBadge: string;   // short badge, e.g. "–16 %"
  body: string;
  websiteComponent: string;
  seoComponent: string;
  recommended?: boolean;
};

export const bundleTiers: readonly BundleTier[] = [
  {
    id: "start-bundle",
    title: "Start-Bundle",
    rate: "1.199 €",
    suffix: "/ Monat",
    term: "12 Monate Mindestlaufzeit",
    savings: "~16 % günstiger als einzeln gebucht",
    savingsBadge: "–16 %",
    body:
      "Einstieg für Unternehmen, die Website-Launch und erste SEO-Schritte zusammen angehen wollen.",
    websiteComponent: "Landingpage-Abo (Hosting + Wartung inklusive)",
    seoComponent: "SEO-Starter-Retainer (1 h Beratung, Monitoring, 2 Texte/Monat)",
  },
  {
    id: "wachstum-bundle",
    title: "Wachstum-Bundle",
    rate: "2.299 €",
    suffix: "/ Monat",
    term: "12 Monate Mindestlaufzeit",
    savings: "~14 % günstiger als einzeln gebucht",
    savingsBadge: "–14 %",
    body:
      "Für etablierte KMU, die eine neue Unternehmens-Website und laufende SEO-Skalierung brauchen.",
    websiteComponent: "Website-Abo (Hosting + Wartung + 1 h Änderungen/Monat)",
    seoComponent: "SEO-Wachstum-Retainer (2 h Beratung, 4 Texte, 2 Backlinks/Monat)",
    recommended: true,
  },
  {
    id: "skalierung-bundle",
    title: "Skalierung-Bundle",
    rate: "3.799 €",
    suffix: "/ Monat",
    term: "12 Monate Mindestlaufzeit",
    savings: "~15 % günstiger als einzeln gebucht",
    savingsBadge: "–15 %",
    body:
      "Für Wachstumsphasen: neuer Online-Shop plus aggressive SEO-Skalierung in einem Paket.",
    websiteComponent: "Shop-Abo (Hosting + Wartung + 2 h Änderungen/Monat)",
    seoComponent: "SEO-Skalierung-Retainer (4 h Strategie, 6 Texte, 4 Backlinks/Monat)",
  },
];

// ---------------------------------------------------------------------------
// Starter-Bonus — intro pricing for early reference projects
// ---------------------------------------------------------------------------

export type StarterBonus = {
  eyebrow: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

/**
 * Applies to Cash projects (30 % off project volume) AND to Abo/Bundle
 * (30 % off the first 12 monthly rates). Remove this export and its usages
 * once the 5 reference slots are filled — no "campaign ended" messaging.
 */
export const starterBonus: StarterBonus = {
  eyebrow: "Starter-Bonus für unsere ersten Referenz-Kunden",
  body: "Wir wählen in den kommenden Monaten 5 Projekte aus, die wir als öffentliche Case Study zeigen dürfen — und geben dafür 30 % Rabatt auf das Cash-Volumen oder auf die ersten 12 Monatsraten. Aktuell sind noch 3 von 5 Plätzen verfügbar.",
  ctaLabel: "Platz sichern",
  ctaHref: "/kontakt/",
};
