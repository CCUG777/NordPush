import { getMetadataRecord } from "@/lib/metadata-catalog";
import { normalizePath } from "@/lib/url-normalization";

export type ValueBullet = {
  title: string;
  body: string;
};

export type ProcessStep = {
  label: string;
  title: string;
  body: string;
};

export type FaqEntry = {
  question: string;
  answer: string;
};

export type PageContent = {
  eyebrow: string;
  heroDescription: string;
  proofBadge?: string;
  heroStats?: { value: string; label: string }[];
  problem?: {
    heading: string;
    points: string[];
  };
  deliverables: {
    heading: string;
    intro?: string;
    bullets: ValueBullet[];
  };
  process?: {
    heading: string;
    steps: ProcessStep[];
  };
  faqs: FaqEntry[];
  ctaHeading?: string;
  ctaBody?: string;
};

const defaultProcess: ProcessStep[] = [
  {
    label: "Schritt 1",
    title: "Discovery-Workshop",
    body:
      "Wir analysieren deine Zielgruppe, deinen Wettbewerb und deine aktuelle Sichtbarkeit. Du bekommst eine klare Bestandsaufnahme inklusive Quick-Wins.",
  },
  {
    label: "Schritt 2",
    title: "Strategie & Roadmap",
    body:
      "Auf Basis der Analyse entwickeln wir eine SEO-Roadmap mit klaren Prioritäten, KPIs und Verantwortlichkeiten für die nächsten 90 Tage.",
  },
  {
    label: "Schritt 3",
    title: "Umsetzung",
    body:
      "Unser Team setzt Technik, Content und Off-Page gemeinsam mit dir um – immer messbar, immer mit direkter Abstimmung im Shared Slack-Channel.",
  },
  {
    label: "Schritt 4",
    title: "Monitoring & Skalierung",
    body:
      "Wöchentliche Reports, monatliche Strategiecalls und quartalsweise Tiefenaudits sichern nachhaltiges Wachstum und schützen deine Rankings.",
  },
];

const baseFaqs: FaqEntry[] = [
  {
    question: "Wie schnell sehe ich erste Ergebnisse?",
    answer:
      "Technische Quick-Wins greifen meist innerhalb der ersten 6 Wochen. Nachhaltige Ranking-Verbesserungen entwickeln sich typischerweise zwischen Monat 3 und 6 – abhängig von Domain, Wettbewerb und Umsetzungstempo.",
  },
  {
    question: "Arbeitet ihr auch mit kleinen Unternehmen?",
    answer:
      "Ja. Wir betreuen sowohl Konzerne als auch inhabergeführte Mittelständler. Unser Preisangebot ist modular, sodass du Umfang und Tempo an dein Budget anpassen kannst.",
  },
  {
    question: "Wie transparent ist die Zusammenarbeit?",
    answer:
      "Du erhältst einen eigenen Slack-Channel, ein geteiltes Projekt-Dashboard und monatliche Strategie-Calls. Alle Maßnahmen, Zeiten und Ergebnisse sind jederzeit einsehbar.",
  },
];

function service({
  eyebrow,
  heroDescription,
  proofBadge,
  heroStats,
  problem,
  deliverables,
  process,
  faqs,
  ctaHeading,
  ctaBody,
}: PageContent): PageContent {
  return {
    eyebrow,
    heroDescription,
    proofBadge,
    heroStats: heroStats ?? [
      { value: "90+", label: "Teams in DACH begleitet" },
      { value: "4.9/5", label: "Kundenbewertung (ProvenExpert)" },
      { value: "2021", label: "Gegründet in Neumünster" },
    ],
    problem,
    deliverables,
    process: process ?? { heading: "So arbeiten wir", steps: defaultProcess },
    faqs,
    ctaHeading: ctaHeading ?? "Bereit für mehr Sichtbarkeit?",
    ctaBody:
      ctaBody ??
      "Buche dir ein kostenloses SEO-Gespräch. 30 Minuten, kein Pitch – nur eine ehrliche Einschätzung deiner aktuellen Lage und klare nächste Schritte.",
  };
}

const content: Record<string, PageContent> = {
  "/b2b-seo-agentur/": service({
    eyebrow: "B2B SEO Agentur",
    heroDescription:
      "Wir entwickeln und betreuen individuelle B2B SEO-Strategien, die Fachzielgruppen erreichen, qualifizierte Leads generieren und planbare Pipeline liefern – nicht bloß Rankings.",
    proofBadge: "Fokus: Tech, SaaS, Industrie",
    problem: {
      heading: "Warum B2B-SEO anders ist",
      points: [
        "Lange, rationale Entscheidungsprozesse mit 5–10 Buying-Committee-Personas",
        "Extrem spitze Keywords mit 30–200 Suchen im Monat statt Volumen-Hits",
        "Content muss Fachlichkeit zeigen ohne in Jargon zu versinken",
        "Technische Hürden (Portale, Produktlogik, Intranet-Tracking) im Gepäck",
      ],
    },
    deliverables: {
      heading: "Was du bekommst",
      bullets: [
        {
          title: "Buying-Committee-Keyword-Map",
          body: "Keyword-Cluster pro Persona und Entscheidungsphase – vom Trigger bis zur Vendor-Evaluation.",
        },
        {
          title: "Pillar- & Cluster-Content-System",
          body: "Evergreen-Hubs mit Fachtiefe, unterstützt durch gezielte Supporting-Artikel, Glossare und Use-Cases.",
        },
        {
          title: "Lead-fokussiertes Tracking",
          body: "GA4, CRM-Integration und Lead-Scoring – damit SEO im Funnel sichtbar wird, nicht nur in Rankings.",
        },
        {
          title: "Technisches SEO für komplexe Stacks",
          body: "Headless, Multi-Language, Gated-Content und Produktkonfiguratoren – sauber indexierbar aufbereitet.",
        },
      ],
    },
    faqs: [
      {
        question: "Welche Branchen betreut NordPush im B2B-Umfeld?",
        answer:
          "Schwerpunkt sind SaaS, Cybersecurity, Industrie 4.0, Maschinenbau und spezialisierte Dienstleister. Unsere Prozesse und Templates sind aber branchenübergreifend einsetzbar.",
      },
      ...baseFaqs,
    ],
  }),
  "/backlinks/": service({
    eyebrow: "Backlink-Aufbau",
    heroDescription:
      "Wir entwickeln nachhaltige Backlink-Strategien, die die Autorität deiner Domain erhöhen und dein Google-Ranking langfristig verbessern – ohne Spam und ohne PBN-Risiken.",
    proofBadge: "Nur White-Hat & manuell",
    problem: {
      heading: "Warum viele Backlink-Kampagnen scheitern",
      points: [
        "PBN- oder Linkfarmen-Angebote wirken kurzfristig und werden von Google abgestraft",
        "Themenirrelevante Links bringen weder Rankings noch Traffic",
        "Fehlende Anchor-Text-Diversität führt zu Pattern-Erkennung",
        "Ohne Content-Baseline bleibt jede Linkkampagne ein Fass ohne Boden",
      ],
    },
    deliverables: {
      heading: "Unsere Backlink-Leistungen",
      bullets: [
        {
          title: "Digital-PR & Gastbeiträge",
          body: "Platzierungen auf themenrelevanten Fachmedien – redaktionell, nicht gesponsert.",
        },
        {
          title: "Link-Gap-Analyse",
          body: "Wir identifizieren, wo deine Wettbewerber stärker verlinkt sind und welche Quellen realistisch erreichbar sind.",
        },
        {
          title: "Broken-Link-Building",
          body: "Wir finden defekte Links auf Premium-Seiten und ersetzen sie durch deinen Content.",
        },
        {
          title: "Link-Risk-Monitoring",
          body: "Monatliche Prüfung auf toxische Links plus proaktives Disavow-Management.",
        },
      ],
    },
    faqs: [
      {
        question: "Wie viele Backlinks baut ihr pro Monat?",
        answer:
          "Unsere Pakete reichen von 3 hochwertigen Platzierungen bis zu 15+ Links pro Monat. Qualität steht vor Quantität – 5 starke Links schlagen 50 schwache.",
      },
      {
        question: "Was kostet ein guter Backlink?",
        answer:
          "Redaktionelle Platzierungen auf DR60+ Domains kosten typischerweise 300–1.500 € pro Link inkl. Outreach, Pitch und Content. Wir legen Kosten pro Platzierung offen.",
      },
      ...baseFaqs,
    ],
  }),
  "/content-marketing/": service({
    eyebrow: "Content Marketing",
    heroDescription:
      "Wir entwickeln Content-Systeme, die Suchintention treffen, Vertrauen aufbauen und Leser zu Kunden machen. Redaktionsplan, Produktion, Distribution – aus einer Hand.",
    deliverables: {
      heading: "Content, das konvertiert",
      bullets: [
        {
          title: "Redaktionsplan mit Search-Intent-Mapping",
          body: "Jedes Thema wird auf Suchintention, Funnel-Stufe und Business-Impact geprüft.",
        },
        {
          title: "Content-Produktion mit Fachautoren",
          body: "Deutsche Muttersprachler mit Branchenerfahrung – keine KI-Massenware.",
        },
        {
          title: "Interne Verlinkung & Topical Authority",
          body: "Hub-and-Spoke-Strukturen, die Themen dominieren statt nur anzureißen.",
        },
        {
          title: "Performance-Tracking",
          body: "Wir messen Rankings, Traffic, Engagement und Leads pro Artikel – und refreshen regelmäßig.",
        },
      ],
    },
    faqs: baseFaqs,
  }),
  "/content-templates/": service({
    eyebrow: "Content Templates",
    heroDescription:
      "Produktionsreife Content-Templates, mit denen dein Team eigenständig SEO-starke Inhalte schreibt. Von Ratgebern über Glossare bis zu Product-Landingpages.",
    deliverables: {
      heading: "Was enthalten ist",
      bullets: [
        { title: "12 Template-Typen", body: "Ratgeber, Vergleich, How-to, Landing-Page, Case Study, Glossar und mehr." },
        { title: "Briefing-Checkliste", body: "Damit freie Autoren in 15 Minuten ein vollständiges Briefing erhalten." },
        { title: "Internal-Linking-Matrix", body: "Zeigt, wie neue Artikel in bestehende Cluster eingehängt werden." },
        { title: "QA-Checkliste", body: "Search Intent, E-E-A-T, CTA-Platzierung und technische Checks auf einen Blick." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/e-commerce-seo/": service({
    eyebrow: "E-Commerce SEO",
    heroDescription:
      "Mehr organische Umsätze für deinen Shop – durch saubere Produktdaten, starke Kategorietexte, schnelle Seiten und ein skalierbares Content-System.",
    problem: {
      heading: "Typische E-Commerce Bottlenecks",
      points: [
        "Duplicate Content durch Filterparameter und Variantenlogik",
        "Schwache Kategorietexte ohne Search-Intent-Fit",
        "Langsame PDPs mit zu großen Bildern und blockierendem JS",
        "Keine Long-Tail-Abdeckung jenseits der Top-Produkte",
      ],
    },
    deliverables: {
      heading: "Was wir im Shop verändern",
      bullets: [
        { title: "Kategorie-Hubs", body: "SEO-optimierte Kategorieseiten mit Guide-Blöcken, FAQ und interner Verlinkung." },
        { title: "Produktdaten-Architektur", body: "Schema.org Product, Offer, Review – sauber, vollständig, validiert." },
        { title: "Facetten-SEO", body: "Indexierbare Filterseiten, wo es Suchvolumen gibt. Geblockt, wo es keines gibt." },
        { title: "Core Web Vitals", body: "LCP < 2.5s, INP < 200ms, CLS < 0.1 – konsequent umgesetzt." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/geo-optimierung/": service({
    eyebrow: "GEO – Generative Engine Optimization",
    heroDescription:
      "Sichtbarkeit in ChatGPT, Perplexity, Google AI Overviews und Gemini. Wir bereiten deine Inhalte so auf, dass sie von generativen Suchsystemen zitiert werden.",
    proofBadge: "Neu: LLM-first Optimierung",
    deliverables: {
      heading: "Was GEO konkret umfasst",
      bullets: [
        { title: "Entity- und Fact-Anreicherung", body: "Strukturierte Daten, klare Definitionen und Quellenangaben, die LLMs zitieren." },
        { title: "Answer-ready Content", body: "Passagen, die als direkte Antwort funktionieren – inklusive TL;DR-Blöcke." },
        { title: "llms.txt und Crawler-Zugriffe", body: "Saubere Konfiguration für GPTBot, PerplexityBot, ClaudeBot und Co." },
        { title: "Citation Monitoring", body: "Wir tracken, wo deine Marke in AI-Antworten erscheint – und wo noch nicht." },
      ],
    },
    faqs: [
      {
        question: "Ersetzt GEO klassisches SEO?",
        answer:
          "Nein. GEO ergänzt SEO. Die Grundlagen (saubere Technik, gute Inhalte, Autorität) bleiben gleich. GEO setzt on top: strukturierte Fakten, klare Definitionen und maschinenlesbare Zitate.",
      },
      ...baseFaqs,
    ],
  }),
  "/google-unternehmensprofil/": service({
    eyebrow: "Google Unternehmensprofil",
    heroDescription:
      "Dein Google-Profil ist oft der erste Touchpoint. Wir optimieren Einträge, NAP-Konsistenz, Rezensionen und Posts – für maximale lokale Sichtbarkeit.",
    deliverables: {
      heading: "Was optimiert wird",
      bullets: [
        { title: "Profil-Setup & Kategorien", body: "Haupt- und Nebenkategorien, Attribute, Öffnungszeiten, Services – vollständig und korrekt." },
        { title: "Review-Management", body: "Bewertungs-Aufbau, Antworten und Eskalationspfade für negative Reviews." },
        { title: "GMB-Posts & Q&A", body: "Regelmäßige Posts, proaktive Q&A-Pflege und Aktions-Slots." },
        { title: "Local Citations", body: "Konsistente Einträge auf den wichtigsten 30+ lokalen Portalen." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/internationales-seo/": service({
    eyebrow: "Internationales SEO",
    heroDescription:
      "hreflang, Domain-Strategie, Lokalisierung. Wir entwickeln und betreuen internationale SEO-Setups, die in mehreren Märkten gleichzeitig ranken.",
    deliverables: {
      heading: "Leistungen",
      bullets: [
        { title: "hreflang-Architektur", body: "Fehlerfrei, auditierbar, über XML-Sitemap und Header gleichermaßen gepflegt." },
        { title: "Domain- & URL-Strategie", body: "ccTLD vs. Subdomain vs. Subfolder – begründete Entscheidung statt Dogma." },
        { title: "Lokalisierung", body: "Muttersprachliche Content-Anpassung inkl. lokaler Suchintention, nicht nur Übersetzung." },
        { title: "Market-Prioritization", body: "Welche Märkte liefern den besten ROI? Datengestützte Roadmap." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/keyword-recherche/": service({
    eyebrow: "Keyword-Recherche",
    heroDescription:
      "Die Basis jeder SEO-Strategie. Wir finden Keywords, die Traffic, Leads und Umsatz liefern – statt vielversprechend klingende Vanity-Begriffe.",
    deliverables: {
      heading: "Was du erhältst",
      bullets: [
        { title: "Keyword-Universum", body: "Vollständige Keyword-Landkarte mit 500–5.000 Begriffen je nach Nische." },
        { title: "Search-Intent-Klassifikation", body: "Informational, Commercial, Transactional, Navigational – mit klarer Content-Empfehlung." },
        { title: "Priorisierung", body: "Impact-Score aus Suchvolumen, Wettbewerb, CTR-Potenzial und Business Value." },
        { title: "Cluster- & Content-Plan", body: "Fertig für dein Redaktionsteam – jedes Keyword hat einen Platz." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/link-risk-management/": service({
    eyebrow: "Link-Risk-Management",
    heroDescription:
      "Proaktiver Schutz deines Linkprofils. Wir identifizieren toxische Links, managen Disavows und schützen dich vor Negative SEO.",
    deliverables: {
      heading: "Das Paket",
      bullets: [
        { title: "Monatliches Backlink-Audit", body: "Fresh-Link-Prüfung auf Spam-Signale, unnatürliche Muster und Penalty-Indikatoren." },
        { title: "Disavow-Management", body: "Gepflegte Disavow-Datei, versioniert und in Google Search Console eingereicht." },
        { title: "Negative-SEO-Alerts", body: "Automatisierte Benachrichtigungen bei verdächtigen Linkwellen." },
        { title: "Recovery-Unterstützung", body: "Falls es bereits einen Ranking-Drop gab – wir analysieren und setzen den Reconsideration-Prozess auf." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/pagespeed-optimierung/": service({
    eyebrow: "PageSpeed & Core Web Vitals",
    heroDescription:
      "Schnelle Websites ranken besser und konvertieren besser. Wir bringen deine Core Web Vitals ins Grüne – mit messbarem Impact auf Umsatz.",
    heroStats: [
      { value: "< 2.5s", label: "LCP-Zielwert" },
      { value: "< 200ms", label: "INP-Zielwert" },
      { value: "< 0.1", label: "CLS-Zielwert" },
    ],
    deliverables: {
      heading: "Was wir anfassen",
      bullets: [
        { title: "Critical Rendering Path", body: "Render-blocking CSS/JS, Font-Loading, Preloads und Priority Hints." },
        { title: "Bild- & Video-Optimierung", body: "AVIF, WebP, Lazy-Loading, adaptive Breakpoints und CDN-Regeln." },
        { title: "Third-Party-Management", body: "Tag-Manager-Budget, Consent-Mode und selektives Laden." },
        { title: "Hosting- & Caching-Review", body: "Edge-Caching, HTTP/3, Brotli und TTFB unter 200 ms." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/seo-audit/": service({
    eyebrow: "SEO Audit",
    heroDescription:
      "Eine Tiefenanalyse deiner Website: Technik, Content, Backlinks, UX. Du bekommst einen priorisierten Maßnahmenplan – umsetzbar ab Tag eins.",
    deliverables: {
      heading: "Audit-Tiefe",
      bullets: [
        { title: "Technik-Audit", body: "Crawling, Indexierung, Rendering, Core Web Vitals, strukturierte Daten." },
        { title: "Content-Audit", body: "Topical Coverage, Kannibalisierung, Content-Qualität und Search-Intent-Fit." },
        { title: "Backlink-Audit", body: "Profil-Stärke, Anchor-Verteilung, Toxizität und Wettbewerbs-Gap." },
        { title: "UX & Conversion", body: "CTA-Placement, Mobile-Usability, Trust-Signale, Analytics-Setup." },
      ],
    },
    process: {
      heading: "So läuft das Audit ab",
      steps: [
        { label: "Woche 1", title: "Datensammlung", body: "Vollständiger Crawl, Analytics- und Search-Console-Zugriff, Backlink-Export." },
        { label: "Woche 2", title: "Analyse", body: "Priorisierte Issue-Liste mit Impact- und Effort-Bewertung." },
        { label: "Woche 3", title: "Präsentation", body: "Workshop mit deinem Team, Roadmap und Sprint-Plan." },
        { label: "Ab Woche 4", title: "Umsetzungsbegleitung optional", body: "Wir setzen mit um oder übergeben an dein internes Team." },
      ],
    },
    faqs: [
      {
        question: "Wie lange dauert ein SEO-Audit?",
        answer: "Ein vollständiges Audit dauert typischerweise 2–3 Wochen. Für kleinere Websites unter 500 URLs reichen oft 10 Arbeitstage.",
      },
      ...baseFaqs,
    ],
  }),
  "/seo-beratung/": service({
    eyebrow: "SEO Beratung",
    heroDescription:
      "Strategische SEO-Beratung auf Executive-Niveau. Wir geben dir einen klaren Fahrplan, priorisierte Prioritäten und echte Entscheidungsgrundlagen.",
    proofBadge: "Ab 1.490 € / Monat",
    deliverables: {
      heading: "Typische Beratungsmandate",
      bullets: [
        { title: "SEO-Due-Diligence vor M&A", body: "Sichtbarkeits-, Traffic- und Risiko-Analyse für Deals ab 1 Mio. € Volumen." },
        { title: "Relaunch-Begleitung", body: "Von der Architektur-Definition bis zum Go-Live-Monitoring." },
        { title: "Interimsleitung SEO", body: "Wir übernehmen die SEO-Führung auf Zeit, bis intern besetzt ist." },
        { title: "Sparring für interne Teams", body: "Wöchentliche Calls, Code-Reviews und Strategie-Feedback für bestehende In-House-Teams." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/seo-betreuung/": service({
    eyebrow: "SEO Betreuung",
    heroDescription:
      "Kontinuierliche SEO-Betreuung mit klarer Roadmap, messbaren KPIs und festem Ansprechpartner. Du kennst jederzeit den Status und die nächsten Schritte.",
    deliverables: {
      heading: "Dein monatliches Paket",
      bullets: [
        { title: "Laufende Optimierung", body: "Technik, Content und Off-Page – gemäß priorisiertem Backlog." },
        { title: "Reporting & Monitoring", body: "Monatliche Reports, wöchentliche Ranking-Alerts, Quartalsreviews." },
        { title: "Content-Produktion", body: "2–8 SEO-optimierte Inhalte pro Monat, je nach Paket." },
        { title: "Fester Account-Manager", body: "Eine Person, die dein Business und deine KPIs kennt – kein Ticket-Roulette." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/seo-fuer-lokale-unternehmen/": service({
    eyebrow: "Lokales SEO",
    heroDescription:
      "Mehr Sichtbarkeit in deiner Region. Wir optimieren Google Unternehmensprofil, Local Citations und lokale Landingpages – für mehr Anfragen aus deiner Stadt.",
    deliverables: {
      heading: "Lokales SEO im Detail",
      bullets: [
        { title: "Google Unternehmensprofil", body: "Kategorien, Attribute, Posts, Q&A und Review-Management." },
        { title: "Lokale Landingpages", body: "Pro Stadt/Standort eine eigene, einzigartige Seite mit lokalem Content." },
        { title: "Local Citations", body: "30+ lokale Verzeichnisse, konsistente NAP-Daten." },
        { title: "Lokale Backlinks", body: "Links von lokalen Portalen, Medien und Branchenpartnern." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/seo-konkurrenzanalyse/": service({
    eyebrow: "SEO Konkurrenzanalyse",
    heroDescription:
      "Was machen deine Wettbewerber besser? Wir analysieren Keywords, Content, Backlinks und Technik – und zeigen dir den schnellsten Weg, sie zu überholen.",
    deliverables: {
      heading: "Unsere Analyse",
      bullets: [
        { title: "Share of Voice", body: "Sichtbarkeitsindex pro Wettbewerber über die letzten 24 Monate." },
        { title: "Keyword-Gap-Analyse", body: "Keywords, bei denen Wettbewerber ranken und du nicht – priorisiert nach ROI." },
        { title: "Content-Gap-Analyse", body: "Themen und Formate, die dir fehlen – mit Briefing-Vorschlägen." },
        { title: "Backlink-Gap-Analyse", body: "Domains, die auf Wettbewerber verlinken, für dich erreichbar sind." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/seo-monitoring/": service({
    eyebrow: "SEO Monitoring",
    heroDescription:
      "Kontinuierliches Monitoring aller relevanten SEO-Signale. Du erfährst sofort, wenn etwas kaputt geht – nicht erst beim nächsten Monatsreport.",
    deliverables: {
      heading: "Was wir überwachen",
      bullets: [
        { title: "Ranking-Monitoring", body: "Tägliche Ranking-Checks für bis zu 5.000 Keywords je nach Paket." },
        { title: "Technik-Alerts", body: "Uptime, Indexierung, robots.txt, hreflang, sitemap – mit Slack-Benachrichtigung." },
        { title: "Backlink-Monitoring", body: "Neue und verlorene Links, toxische Link-Alerts." },
        { title: "Core-Update-Analyse", body: "Nach jedem Google-Update ein kompaktes Impact-Briefing." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/seo-relaunch/": service({
    eyebrow: "SEO Relaunch",
    heroDescription:
      "Ein Relaunch ohne SEO-Plan kostet oft 30–80 % Sichtbarkeit. Wir sichern deinen Relaunch ab – von der Strategie bis zum Go-Live-Monitoring.",
    deliverables: {
      heading: "Relaunch-Phasen",
      bullets: [
        { title: "Pre-Relaunch-Audit", body: "Bestandsaufnahme aller rankenden URLs, Traffic-Quellen und Backlinks." },
        { title: "URL-Mapping & Redirects", body: "1:1 301-Weiterleitungen, keine Ketten, keine Endlosschleifen." },
        { title: "Content- & Tech-Migration", body: "Metadaten, strukturierte Daten und Assets sauber mitnehmen." },
        { title: "Go-Live-Monitoring", body: "Tägliche Checks in den ersten 4 Wochen, sofortiger Fix bei Problemen." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/seo-strategie/": service({
    eyebrow: "SEO Strategie",
    heroDescription:
      "Eine SEO-Strategie ist mehr als eine Keywordliste. Wir verbinden Business-Ziele, Markt, Zielgruppe und Technik – zu einer Roadmap, die wirklich liefert.",
    deliverables: {
      heading: "Deine Strategie enthält",
      bullets: [
        { title: "Zielbild & KPIs", body: "Klare, messbare Ziele – von Sichtbarkeit bis Umsatz." },
        { title: "Persona & Buyer Journey", body: "Keyword-Mapping entlang der echten Entscheidungsreise." },
        { title: "Content- & Channel-Architektur", body: "Hubs, Cluster, Linkpfade, Conversion-Punkte." },
        { title: "12-Monats-Roadmap", body: "Priorisiert, mit Aufwänden, Abhängigkeiten und Verantwortlichkeiten." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/seo-texte-schreiben/": service({
    eyebrow: "SEO-Texte",
    heroDescription:
      "Texte, die Menschen lesen und Google liebt. Unsere Fachautoren schreiben verständlich, fundiert und konversionsstark – auf deutsch, in deiner Tonalität.",
    deliverables: {
      heading: "Textformate",
      bullets: [
        { title: "Ratgeber & How-tos", body: "1.200–3.000 Wörter, mit klarer Struktur, Bildern und TL;DR." },
        { title: "Landingpages", body: "Conversion-fokussierte Texte mit klaren Nutzen- und Beweisblöcken." },
        { title: "Kategorie- & Produkttexte", body: "Einzigartige, SEO-optimierte Texte für E-Commerce." },
        { title: "Glossare & Lexika", body: "Topical-Authority-Booster in Form von Fachdefinitionen." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/technisches-seo-audit/": service({
    eyebrow: "Technisches SEO Audit",
    heroDescription:
      "Crawling, Indexierung, Rendering, strukturierte Daten, Core Web Vitals – wir decken alle technischen Hebel auf, die dein Ranking bremsen.",
    deliverables: {
      heading: "Was geprüft wird",
      bullets: [
        { title: "Crawling & Indexierung", body: "robots.txt, Sitemap, Canonical, noindex, Pagination." },
        { title: "Rendering & JS-SEO", body: "Client-Side vs. SSR, Hydration, prerender.io, Edge-SSR." },
        { title: "Strukturierte Daten", body: "Schema.org-Coverage, Validierung, Rich-Results-Erfolg." },
        { title: "Internationales Setup", body: "hreflang, Domain-Strategie, Language-Targeting." },
      ],
    },
    faqs: baseFaqs,
  }),
  "/wordpress-seo/": service({
    eyebrow: "WordPress SEO",
    heroDescription:
      "WordPress SEO auf Agenturniveau. Saubere Themes, schnelle Ladezeiten, optimierte Plugins und eine Content-Architektur, die für Wachstum gemacht ist.",
    deliverables: {
      heading: "Unser WordPress-Stack",
      bullets: [
        { title: "Theme- & Builder-Audit", body: "Elementor, Gutenberg, Oxygen – wir bewerten, was bleibt und was fliegt." },
        { title: "Plugin-Hygiene", body: "Jedes unnötige Plugin raus. Jedes notwendige korrekt konfiguriert." },
        { title: "Hosting & Caching", body: "Empfehlungen für Hoster, Page-Caching, Object-Caching und CDN." },
        { title: "Yoast/Rank Math Setup", body: "Schemata, Social-Templates, Breadcrumbs, XML-Sitemap." },
      ],
    },
    faqs: baseFaqs,
  }),
};

const blogContent: Record<string, PageContent> = {
  "/agentur/": {
    eyebrow: "Agentur-Insights",
    heroDescription:
      "Wie arbeitet eine moderne SEO-Agentur? Welche Prozesse, Tools und Skills braucht es heute? Unsere Sammlung zu Agenturthemen.",
    deliverables: {
      heading: "Was du hier findest",
      bullets: [
        { title: "Agentur-Auswahl", body: "Wie du die richtige SEO-Agentur erkennst – ohne auf Sales-Theater hereinzufallen." },
        { title: "Inhouse vs. Agentur", body: "Wann Inhouse sinnvoll ist, wann eine Agentur den Ton angibt – und wie Hybrid-Modelle gelingen." },
        { title: "Agentur-Prozesse", body: "Von Onboarding über Sprint-Planung bis Reporting – unsere eigene Playbook-Bibliothek." },
        { title: "Agentur-Mythen", body: "„SEO dauert Jahre“, „Du brauchst 100 Backlinks“ – was stimmt, was ist Unsinn." },
      ],
    },
    faqs: baseFaqs,
    ctaHeading: "Lust auf ein Gespräch mit einer ehrlichen Agentur?",
    ctaBody: "Kein Pitch, kein Vertrieb – nur eine klare Einschätzung deiner aktuellen SEO-Lage.",
  },
  "/suchmaschinenoptimierung/": {
    eyebrow: "SEO-Grundlagen",
    heroDescription:
      "Was ist SEO eigentlich? Wie funktioniert es heute, 2026, in einer Welt mit generativen Suchen und Core Updates? Unser Starter-Guide.",
    deliverables: {
      heading: "Themen in diesem Hub",
      bullets: [
        { title: "Was ist SEO?", body: "Definition, Geschichte und was sich 2024–2026 grundlegend verändert hat." },
        { title: "OnPage, OffPage, Technik", body: "Die drei Säulen – mit konkreten Beispielen aus realen Projekten." },
        { title: "E-E-A-T", body: "Experience, Expertise, Authoritativeness, Trust – warum das heute wichtiger ist als Keywords." },
        { title: "Generative Search", body: "Wie ChatGPT & Co. die SEO-Welt verändern und wie du dich vorbereitest." },
      ],
    },
    faqs: baseFaqs,
  },
};

const aboutContent: PageContent = {
  eyebrow: "Über uns",
  heroDescription:
    "NordPush ist eine inhabergeführte SEO-Agentur aus Neumünster, gegründet 2021. Unser Team ist seit 2014 in der SEO-Branche tätig – mit Substanz statt Sales-Theater.",
  proofBadge: "Branchenexpertise seit 2014",
  heroStats: [
    { value: "90+", label: "Kundenprojekte DACH" },
    { value: "seit 2014", label: "SEO-Erfahrung im Team" },
    { value: "2021", label: "NordPush gegründet" },
  ],
  deliverables: {
    heading: "Was uns ausmacht",
    intro: "Drei Dinge sind uns wichtiger als alles andere.",
    bullets: [
      { title: "Ehrliche Einschätzung", body: "Wir nehmen Projekte nur an, wenn wir einen echten Unterschied machen können. Wenn nicht, sagen wir es dir." },
      { title: "Messbare Arbeit", body: "Jede Maßnahme hat eine Kennzahl. Und jede Kennzahl einen Verantwortlichen." },
      { title: "Kontinuität", body: "Unsere durchschnittliche Kundenbeziehung dauert über 3 Jahre. Weil wir uns keinen Kundenwechsel alle 6 Monate leisten wollen." },
    ],
  },
  faqs: baseFaqs,
  ctaHeading: "Lust auf eine Zusammenarbeit?",
  ctaBody: "Ein erstes Gespräch ist kostenlos – und unverbindlich. Wir hören zu, stellen ehrliche Fragen, geben ehrliche Antworten.",
};

const contactContent: PageContent = {
  eyebrow: "Kontakt",
  heroDescription:
    "Kein Pitch. Wir hören zu, stellen die richtigen Fragen, und sagen dir am Ende ehrlich, ob wir helfen können oder nicht.",
  proofBadge: "Antwort innerhalb von 24h",
  deliverables: {
    heading: "So erreichst du uns",
    bullets: [
      { title: "Telefon", body: "+49 171 3117971 – Mo–Fr, 9:00–17:00 Uhr. Unter der Mobilnummer bist du direkt bei Marc." },
      { title: "E-Mail", body: "support@nordpush.de – Antwort innerhalb eines Werktags garantiert." },
      { title: "Slack-Connect", body: "Bei laufenden Mandaten richten wir einen dedizierten Slack-Channel ein." },
      { title: "Vor Ort", body: "Biberweg 6, 24539 Neumünster. Termine bitte vorher abstimmen." },
    ],
  },
  faqs: [
    {
      question: "Wie läuft das Erstgespräch ab?",
      answer:
        "Kurzes Gespräch via Google Meet. Du erzählst, woran du arbeitest und wo es hakt. Wir stellen Fragen, geben erste Impulse und halten fest, ob ein Mandat sinnvoll wäre.",
    },
    {
      question: "Muss ich schon vorab Unterlagen schicken?",
      answer:
        "Nicht zwingend. Hilfreich: URL der Website, Analytics-Screenshot der letzten 12 Monate, ggf. Search Console. Wir lernen dich aber auch ohne Vorbereitung kennen.",
    },
    ...baseFaqs.slice(0, 2),
  ],
  ctaHeading: "Termin direkt buchen",
  ctaBody: "Oder schreib uns einfach eine kurze Mail – wir melden uns meistens noch am gleichen Tag zurück.",
};

const pricingContent: PageContent = {
  eyebrow: "Preise",
  heroDescription:
    "Faire, transparente Preise – kein Vertragsschmerz, keine 24-Monats-Knebel. Monatliche Kündigung nach den ersten 3 Monaten ist Standard.",
  deliverables: {
    heading: "Unsere Paketstruktur",
    intro: "Drei Ausgangspunkte – individuell anpassbar.",
    bullets: [
      { title: "Starter · ab 1.490 € / Monat", body: "Für kleinere Websites und Teams, die schnell eine klare Richtung brauchen. Beratung, Technik-Fixes, 2 Inhalte/Monat." },
      { title: "Growth · ab 3.490 € / Monat", body: "Das meistgebuchte Paket. Dedizierter Account-Manager, Content-System, Backlink-Aufbau, monatliches Reporting." },
      { title: "Scale · ab 6.990 € / Monat", body: "Für Unternehmen mit komplexem Setup – internationales SEO, E-Commerce-Kataloge, Multi-Location. Individueller Scope." },
    ],
  },
  faqs: [
    {
      question: "Muss ich mich langfristig binden?",
      answer: "Erste Laufzeit 3 Monate. Danach monatlich kündbar. Projektmandate (z. B. Audit, Relaunch) haben feste Laufzeiten.",
    },
    {
      question: "Sind die Preise netto oder brutto?",
      answer: "Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer.",
    },
    ...baseFaqs,
  ],
  ctaHeading: "Welches Paket passt zu dir?",
  ctaBody: "Nutze unser kostenloses Erstgespräch. Wir empfehlen dir das Paket, das wirklich zu deiner Situation passt – nicht das teuerste.",
};

const legalContentByPath: Record<string, PageContent> = {
  "/impressum/": {
    eyebrow: "Impressum",
    heroDescription:
      "Angaben gemäß § 5 TMG. NordPush ist eine inhabergeführte SEO-Agentur mit Sitz in Neumünster, Schleswig-Holstein.",
    deliverables: {
      heading: "Anbieterkennzeichnung",
      bullets: [
        { title: "NordPush", body: "Biberweg 6, 24539 Neumünster, Deutschland" },
        { title: "Kontakt", body: "Telefon: +49 171 3117971 · E-Mail: support@nordpush.de" },
        { title: "Verantwortlich i. S. d. § 55 Abs. 2 RStV", body: "Marc Friedrich, Biberweg 6, 24539 Neumünster" },
        { title: "EU-Streitschlichtung", body: "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: https://ec.europa.eu/consumers/odr/" },
      ],
    },
    faqs: [],
    ctaHeading: "Fragen zu diesen Angaben?",
    ctaBody: "Schreib uns kurz per E-Mail – wir ergänzen gerne, wenn etwas fehlt.",
  },
  "/datenschutz/": {
    eyebrow: "Datenschutz",
    heroDescription:
      "Wir nehmen den Schutz deiner Daten ernst. Hier erfährst du, welche Daten wir verarbeiten, zu welchem Zweck und welche Rechte du hast.",
    deliverables: {
      heading: "Überblick",
      bullets: [
        { title: "Verantwortlicher", body: "NordPush, Biberweg 6, 24539 Neumünster" },
        { title: "Verarbeitete Daten", body: "IP-Adressen (gekürzt), Analytics-Daten (aggregiert), Kontaktdaten aus Formularen und E-Mails." },
        { title: "Deine Rechte", body: "Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit – jederzeit per E-Mail an support@nordpush.de." },
        { title: "Cookies & Tools", body: "Wir setzen nur essenzielle Cookies ohne Einwilligung. Analytics und Marketing-Tools werden erst nach Einwilligung im Consent-Banner geladen." },
      ],
    },
    faqs: [
      {
        question: "Wie lange werden meine Daten gespeichert?",
        answer: "Anfragen: bis zu 24 Monate nach letztem Kontakt. Vertragsdaten: 10 Jahre gemäß gesetzlicher Aufbewahrungspflichten. Analytics: 14 Monate, anonymisiert.",
      },
      {
        question: "An wen wende ich mich bei Datenschutzfragen?",
        answer: "Direkt an support@nordpush.de. Wir melden uns innerhalb von 72 Stunden zurück.",
      },
    ],
    ctaHeading: "Fragen zum Datenschutz?",
    ctaBody: "Wir beantworten sie in Klartext – keine juristische Nebelkerze.",
  },
  "/kontakt/": contactContent,
  "/preise/": pricingContent,
};

const wissenContent: PageContent = {
  eyebrow: "Wissen & Insights",
  heroDescription:
    "Praxisnahe SEO-Strategien, aktuelle Trends und wertvolles Know-how für nachhaltigen Online-Erfolg. Frisch aus dem Alltag einer arbeitenden Agentur.",
  deliverables: {
    heading: "Themenbereiche",
    bullets: [
      { title: "Technisches SEO", body: "Core Web Vitals, Indexierung, Rendering und strukturierte Daten." },
      { title: "Content-Strategie", body: "Search Intent, Topical Authority und redaktionelle Systeme." },
      { title: "Off-Page SEO", body: "Digital PR, Linkbuilding und Reputation Management." },
      { title: "Generative Search", body: "ChatGPT, Perplexity und die neue Sichtbarkeitslandschaft." },
    ],
  },
  faqs: baseFaqs.slice(0, 2),
  ctaHeading: "Du willst nichts verpassen?",
  ctaBody: "Unser monatlicher Newsletter fasst die wichtigsten SEO-Updates in 5 Minuten zusammen – handverlesen, werbefrei.",
};

const fallbackContent: PageContent = {
  eyebrow: "NordPush",
  heroDescription:
    "Strategische SEO für mehr Sichtbarkeit, bessere Rankings und nachhaltige Ergebnisse. NordPush ist deine Agentur für effektives Online-Marketing.",
  deliverables: {
    heading: "Unsere Kernleistungen",
    bullets: [
      { title: "Technisches SEO", body: "Saubere Indexierung, schnelle Ladezeiten, validierte strukturierte Daten." },
      { title: "Content Marketing", body: "Inhalte, die Suchintention treffen und Besucher zu Kunden machen." },
      { title: "Off-Page SEO", body: "Digital PR und Linkbuilding ohne Schattenseiten." },
      { title: "Monitoring & Reporting", body: "Du weißt jederzeit, wo du stehst und was als Nächstes kommt." },
    ],
  },
  faqs: baseFaqs,
};

export function getPageContent(canonicalPath: string): PageContent {
  const normalized = normalizePath(canonicalPath);

  if (content[normalized]) {
    return content[normalized];
  }
  if (blogContent[normalized]) {
    return blogContent[normalized];
  }
  if (legalContentByPath[normalized]) {
    return legalContentByPath[normalized];
  }
  if (normalized === "/ueber-uns/") {
    return aboutContent;
  }
  if (normalized === "/category/wissen/") {
    return wissenContent;
  }

  return fallbackContent;
}

export function getHeadingFor(canonicalPath: string, fallbackHeading: string): string {
  const normalized = normalizePath(canonicalPath);
  const record = getMetadataRecord(normalized);
  return record?.h1?.trim() || record?.title?.trim() || fallbackHeading;
}

export function getDescriptionFor(canonicalPath: string): string | undefined {
  const record = getMetadataRecord(canonicalPath);
  return record?.metaDescription?.trim();
}
