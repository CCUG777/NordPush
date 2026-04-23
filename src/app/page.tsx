import Image from "next/image";
import Link from "next/link";
import { ClientLogos } from "@/components/client-logos";
import { FAQAccordion } from "@/components/faq-accordion";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import { buildPageMetadata } from "@/lib/seo";
import { buildPageSchemas } from "@/lib/structured-data";

const clientLogos = [
  { name: "Aurora Labs", src: "/logos/aurora-labs.svg" },
  { name: "Basalt Commerce", src: "/logos/basalt-commerce.svg" },
  { name: "Feldwerk", src: "/logos/feldwerk.svg" },
  { name: "Helix Manufacturing", src: "/logos/helix-manufacturing.svg" },
  { name: "Kranz Finance", src: "/logos/kranz-finance.svg" },
  { name: "Nordstack", src: "/logos/nordstack.svg" },
  { name: "Ostsee Medical", src: "/logos/ostsee-medical.svg" },
  { name: "Pulse SaaS", src: "/logos/pulse-saas.svg" },
];

type ServiceItem = {
  label: string;
  href?: string;
};

type ServicePillar = {
  title: string;
  body: string;
  items: readonly ServiceItem[];
  href: string;
  cta: string;
};

export const metadata = buildPageMetadata(
  "/",
  "NordPush – SEO-Agentur für planbare Sichtbarkeit und qualifizierte Anfragen",
);

const heroSignals = [
  {
    value: "100+",
    label: "SEO-Projekte",
    note: "Erfahrung aus B2B, E-Commerce und lokalen Märkten.",
  },
  {
    value: "1 Team",
    label: "klare Verantwortung",
    note: "Strategie, Technik und Content greifen sauber ineinander.",
  },
  {
    value: "Klar",
    label: "Reporting",
    note: "Mit Prioritäten, Risiken und den nächsten echten Hebeln.",
  },
] as const;

const proofHighlights = [
  {
    value: "Substanz",
    title: "Kein SEO-Theater",
    body: "Wir priorisieren nach Geschäftswirkung, nicht nach Lautstärke im Meeting.",
  },
  {
    value: "Hands-on",
    title: "Umsetzung statt PDF-Stapel",
    body: "Empfehlungen werden in Aufgaben, Templates und Entscheidungen übersetzt.",
  },
  {
    value: "Direkt",
    title: "Kurze Wege im Projekt",
    body: "Feste Ansprechpartner, klare Zuständigkeiten und ein Tempo, das mitzieht.",
  },
] as const;

const principles = [
  {
    title: "Wir starten bei den Seiten, die Umsatzpotenzial haben.",
    body: "Money Pages, Angebotsseiten und wichtige Kategoriestrukturen bekommen zuerst die Aufmerksamkeit, die sie verdienen.",
  },
  {
    title: "Technik, Content und UX werden nicht getrennt behandelt.",
    body: "Indexierung, interne Verlinkung, Suchintention und Conversion-Pfade hängen zusammen. Genau so bearbeiten wir sie auch.",
  },
  {
    title: "Jeder Report beantwortet die Frage: Was machen wir als Nächstes?",
    body: "Wir reduzieren Komplexität auf klare Prioritäten, offene Risiken und konkrete Entscheidungen.",
  },
] as const;

const servicePillars: readonly ServicePillar[] = [
  {
    title: "Strategie & Nachfrage",
    body: "Wir finden die Themenfelder, Keywords und Seitentypen, mit denen Sichtbarkeit tatsächlich Geschäft erzeugt.",
    items: [
      { label: "Keyword- und Opportunity-Mapping", href: "/keyword-recherche/" },
      { label: "SERP- und Konkurrenzanalyse", href: "/seo-konkurrenzanalyse/" },
      { label: "Informationsarchitektur und Seitenlogik" },
      { label: "Priorisierung nach Funnel und Potenzial" },
    ],
    href: "/seo-strategie/",
    cta: "Strategie ansehen",
  },
  {
    title: "Technik & UX",
    body: "Wir beheben die Bremsen, die Rankings, Crawling und Nutzerführung unsichtbar schwächen.",
    items: [
      { label: "Crawling, Indexierung und interne Links", href: "/technisches-seo-audit/" },
      { label: "Core Web Vitals und Seitengeschwindigkeit", href: "/pagespeed-optimierung/" },
      { label: "Template-Qualität und Seitenstruktur" },
      { label: "Saubere Übergaben für Dev-Teams" },
    ],
    href: "/technisches-seo-audit/",
    cta: "Technisches SEO prüfen",
  },
  {
    title: "Content & Ausbau",
    body: "Wir bauen Inhalte, Cluster und Autorität so auf, dass Rankings und Conversion gemeinsam wachsen können.",
    items: [
      { label: "Content-Planung entlang echter Suchintention", href: "/content-marketing/" },
      { label: "OnPage-Briefings und Template-Vorgaben" },
      { label: "Digital PR und OffPage-Ausbau", href: "/backlinks/" },
      { label: "Laufendes Monitoring und Nachschärfung", href: "/seo-monitoring/" },
    ],
    href: "/content-marketing/",
    cta: "Content-System aufbauen",
  },
] as const;

const processSteps = [
  {
    step: "01",
    title: "Audit & Diagnose",
    body: "Wir prüfen Technik, Suchintention, Seitenarchitektur und Conversion-Hürden mit Fokus auf die relevanten URLs.",
  },
  {
    step: "02",
    title: "Roadmap & Scope",
    body: "Du bekommst eine klare Priorisierung nach Impact, Aufwand und Abhängigkeiten statt einer langen Wunschliste.",
  },
  {
    step: "03",
    title: "Umsetzung in Sprints",
    body: "Wir arbeiten Aufgaben sauber durch, stimmen mit deinem Team ab und halten Entscheidungen dokumentiert fest.",
  },
  {
    step: "04",
    title: "Reporting & Ausbau",
    body: "Fortschritt, Risiken und nächste Hebel werden regelmäßig überprüft und an die Realität angepasst.",
  },
] as const;

const reportMetrics = [
  {
    title: "Sichtbarkeit",
    body: "Wir verfolgen relevante Cluster und Seitentypen statt nur einzelne Keywords ohne Geschäftsbezug.",
    footnote: "Cluster, SERP-Wirkung, Gewinner und Verlierer",
  },
  {
    title: "Qualifizierter Traffic",
    body: "Nicht jeder Besuch ist gut. Wir schauen auf Nachfrage, Einstiegsseiten und echte Relevanz.",
    footnote: "Landingpages, Suchintention, Segmentqualität",
  },
  {
    title: "Leads & Conversion",
    body: "SEO endet nicht beim Ranking. Wir betrachten, wie Sichtbarkeit zu Anfragen und Umsatz beiträgt.",
    footnote: "Anfragen, Micro-Conversions, Conversion-Pfade",
  },
  {
    title: "Technische Gesundheit",
    body: "Wenn Indexierung, interne Links oder Templates kippen, wird das sichtbar und priorisiert behandelt.",
    footnote: "Crawling, Core Web Vitals, Template-Risiken",
  },
] as const;

const homeFaqs = [
  {
    question: "Für welche Unternehmen ist NordPush der richtige Partner?",
    answer:
      "Vor allem für Unternehmen, die SEO als Wachstumssystem aufbauen wollen: B2B-Teams, lokale Dienstleister, E-Commerce-Shops und Marken mit erklärungsbedürftigen Leistungen.",
  },
  {
    question: "Übernehmt ihr nur Beratung oder auch die Umsetzung?",
    answer:
      "Beides. Wir können strategisch führen, dein internes Team enablen oder die operative Umsetzung in Technik, Content und Priorisierung direkt begleiten.",
  },
  {
    question: "Wie schnell kann ein Projekt starten?",
    answer:
      "In der Regel kurzfristig. Nach dem Erstgespräch klären wir Scope, beteiligte Teams, verfügbare Daten und den sinnvollen Startpunkt für Audit und Roadmap.",
  },
  {
    question: "Wie transparent ist die Zusammenarbeit?",
    answer:
      "Sehr transparent. Du bekommst keine Black Box, sondern klare Prioritäten, dokumentierte Entscheidungen und regelmäßige Updates zu Fortschritt, Risiken und nächsten Maßnahmen.",
  },
] as const;

const schemas = buildPageSchemas({
  canonicalPath: "/",
  fallbackName: "NordPush",
  kind: "homepage",
  faqs: homeFaqs,
});

export default function HomePage() {
  return (
    <SiteShell>
      <JsonLd schemas={schemas} />

      <section className="home-refresh-hero" data-ux-slot="Hero">
        <div className="home-refresh-copy">
          <div className="home-refresh-kicker">
            <span className="home-refresh-chip">
              <span className="home-refresh-chip-dot" aria-hidden="true" />
              SEO-Agentur aus Neumünster
            </span>
            <p className="eyebrow eyebrow--plain">Strategie, Technik &amp; Content aus einer Hand</p>
          </div>

          <div className="home-refresh-heading">
            <h1>
              SEO, das aus Sichtbarkeit
              <span className="accent-text"> planbare Anfragen </span>
              macht.
            </h1>
            <p className="home-refresh-lede">
              NordPush entwickelt Suchmaschinenstrategien für Unternehmen, die Rankings, Nutzerführung
              und Vertrieb nicht getrennt denken wollen. Keine lauten Versprechen, sondern saubere
              Priorisierung und nachvollziehbare Umsetzung.
            </p>
          </div>

          <div className="home-refresh-actions">
            <Link href="/kontakt/" className="button primary">
              Kostenlose Ersteinschätzung
            </Link>
            <Link href="/preise/" className="button">
              Leistungen &amp; Preise
            </Link>
          </div>

          <ul className="home-refresh-points">
            <li>Audit, Roadmap und schnelle Priorisierung statt Maßnahmenfriedhof.</li>
            <li>Direkte Ansprechpartner für Technik, Content und strategische Entscheidungen.</li>
            <li>Auf Wunsch komplett umgesetzt oder eng mit deinem Team verzahnt.</li>
          </ul>
        </div>

        <aside className="home-refresh-panel" aria-label="NordPush Projektmodell">
          <div className="home-refresh-panel-shell">
            <div className="home-refresh-panel-head">
              <p className="eyebrow eyebrow--plain">SEO Operating System</p>
              <span className="home-status-pill">Strategisch. Sauber. Direkt.</span>
            </div>

            <div className="home-signal-grid">
              {heroSignals.map((signal) => (
                <article key={signal.label} className="home-signal-card">
                  <p className="home-signal-value">{signal.value}</p>
                  <p className="home-signal-label">{signal.label}</p>
                  <p className="home-signal-note">{signal.note}</p>
                </article>
              ))}
            </div>

            <div className="home-panel-block">
              <p className="home-panel-label">In den ersten 30 Tagen</p>
              <ul className="home-panel-list">
                <li>Technisches Audit mit Prioritäten nach Impact und Aufwand</li>
                <li>Keyword- und Themenlandschaft für die wichtigsten Seiten</li>
                <li>Quick Wins für Angebotsseiten, interne Links und Conversion-Pfade</li>
                <li>Setup für Reporting, Verantwortlichkeiten und nächste Sprints</li>
              </ul>
            </div>

            <div className="home-panel-foot">
              <p>
                Wöchentliche Abstimmung, klare Owner und ein Reporting, das Entscheidungen vorbereitet
                statt nur Zustand zu beschreiben.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="home-section home-trust">
        <div className="section-heading section-heading--compact">
          <p className="eyebrow">Vertrauen &amp; Fokus</p>
          <h2>SEO für Teams, die Substanz vor Show wählen.</h2>
          <p>
            Wir arbeiten mit Unternehmen zusammen, die Sichtbarkeit nicht als isolierten Kanal sehen,
            sondern als Wachstumshebel zwischen Nachfrage, Marke und Vertrieb.
          </p>
        </div>

        <div className="home-proof-grid">
          {proofHighlights.map((item) => (
            <article key={item.title} className="home-proof-card">
              <p className="home-proof-value">{item.value}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <div className="home-logo-wrap">
          <ClientLogos
            label="Vertrauen von Unternehmen in ganz DACH"
            logos={clientLogos}
            variant="grid"
          />
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="eyebrow">Wie wir arbeiten</p>
          <h2>Wir räumen zuerst die echten Bremsen aus dem Weg.</h2>
          <p>
            Viele SEO-Projekte verlieren Monate mit Nebenkriegsschauplätzen. Wir sortieren technische
            Risiken, Suchintention, Informationsarchitektur und Conversion-Pfade so, dass die wichtigsten
            Seiten zuerst profitieren.
          </p>
        </div>

        <div className="home-principles-grid">
          {principles.map((principle, index) => (
            <article key={principle.title} className="home-principle-card">
              <span className="home-principle-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="eyebrow">Leistungen</p>
          <h2>Ein Setup, das Strategie, Technik und Content wirklich verbindet.</h2>
          <p>
            Ob punktuelles Audit oder laufende Betreuung: Wir bauen ein System, das auf stabile Rankings
            und qualifizierte Anfragen einzahlt.
          </p>
        </div>

        <div className="home-service-grid">
          {servicePillars.map((pillar) => (
            <article key={pillar.title} className="home-service-card">
              <div className="home-service-head">
                <p className="eyebrow eyebrow--plain">Leistungsfeld</p>
                <h3>{pillar.title}</h3>
              </div>
              <p>{pillar.body}</p>
              <ul className="home-service-list">
                {pillar.items.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <Link href={item.href} className="text-link">
                        {item.label}
                      </Link>
                    ) : (
                      item.label
                    )}
                  </li>
                ))}
              </ul>
              <Link href={pillar.href} className="text-link home-service-link">
                {pillar.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-operations">
        <div className="section-heading">
          <p className="eyebrow">Projektmodell</p>
          <h2>Klare Phasen, klare Verantwortlichkeiten, kein Black-Box-Gefühl.</h2>
          <p>
            Wir führen Projekte so, dass intern niemand rätseln muss, was gerade passiert, warum es
            wichtig ist und wer den nächsten Schritt verantwortet.
          </p>
        </div>

        <div className="home-operations-grid">
          <ol className="home-process-list">
            {processSteps.map((step) => (
              <li key={step.step} className="home-process-step">
                <span className="home-process-marker">{step.step}</span>
                <div className="home-process-copy">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="home-deliverables-card">
            <p className="eyebrow">Was du bekommst</p>
            <h3>Kein hübsches Dokument ohne Anschlussfähigkeit.</h3>
            <ul className="home-deliverables-list">
              <li>Priorisierte Maßnahmenliste mit Impact-, Aufwand- und Owner-Logik</li>
              <li>Konkrete Empfehlungen für Templates, interne Verlinkung und Seitentypen</li>
              <li>Keyword- und Content-Struktur für die wichtigsten Cluster</li>
              <li>Reporting-Setup für Sichtbarkeit, Traffic, Conversion und Technik</li>
              <li>Saubere Abstimmung mit internen Stakeholdern oder externen Entwicklern</li>
            </ul>
            <div className="home-deliverables-note">
              <strong>Passend für:</strong> Unternehmen, die SEO ernsthaft aufbauen wollen, ohne intern
              mehrere Disziplinen einzeln koordinieren zu müssen.
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-reporting">
        <div className="section-heading">
          <p className="eyebrow">Reporting</p>
          <h2>Wir reporten auf die Metriken, die Entscheidungen auslösen.</h2>
          <p>
            Statt zehn Dashboard-Seiten mit Vanity Metrics bekommst du einen klaren Blick auf Fortschritt,
            Risiken und die nächsten Hebel.
          </p>
        </div>

        <div className="home-report-grid">
          {reportMetrics.map((metric) => (
            <article key={metric.title} className="home-report-card">
              <h3>{metric.title}</h3>
              <p>{metric.body}</p>
              <span>{metric.footnote}</span>
            </article>
          ))}
        </div>

        <blockquote className="home-operator-note">
          <p>
            &bdquo;Gutes SEO fühlt sich im Alltag nicht nach Aktionismus an. Es fühlt sich nach Klarheit
            an: Was blockiert, was wirkt und was wir als Nächstes sauber umsetzen.&ldquo;
          </p>
          <footer>
            <Image
              src="/logos/nordpush-logo.svg"
              alt=""
              width={110}
              height={20}
              className="brand-logo brand-logo--invert"
            />
            <span>Operating Principle</span>
          </footer>
        </blockquote>
      </section>

      <FAQAccordion
        heading="Häufige Fragen vor dem Projektstart"
        items={homeFaqs}
        aside={
          <>
            <p>
              Wenn du möchtest, schauen wir vorab auf deine wichtigsten URLs, Rankings und technischen
              Risiken. Ohne Sales-Skript, mit einer ehrlichen ersten Einschätzung.
            </p>
            <Link href="/kontakt/" className="button">
              Projekt besprechen
            </Link>
          </>
        }
      />

      <section className="home-refresh-cta">
        <div className="home-refresh-cta-copy">
          <p className="eyebrow">Nächster Schritt</p>
          <h2>Wenn Sichtbarkeit endlich als Wachstumshebel funktionieren soll, lass uns starten.</h2>
          <p>
            Wir schauen gemeinsam auf die Seiten, Themen und technischen Bremsen, die heute den größten
            Unterschied machen würden.
          </p>
        </div>

        <div className="home-refresh-cta-actions">
          <Link href="/kontakt/" className="button primary">
            Kostenlose Analyse anfragen
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
