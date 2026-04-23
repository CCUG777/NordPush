import Image from "next/image";
import Link from "next/link";
import { FAQAccordion } from "@/components/faq-accordion";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import {
  bundleTiers,
  starterBonus,
  websiteAboTiers,
  websitePricingTiers,
} from "@/data/website-pricing";
import { buildPageMetadata } from "@/lib/seo";
import { buildPageSchemas } from "@/lib/structured-data";

/**
 * Websites hub — the single info page that covers everything we build:
 * WordPress sites, landing pages, online shops, multilingual sites, maintenance.
 *
 * Intent separation vs. existing SEO pages (no cannibalization):
 *   /wordpress-seo/     — ranking existing WP sites       →  here: building new ones
 *   /e-commerce-seo/    — ranking existing shops          →  here: building shops
 *   /internationales-seo/ — multilingual ranking strategy →  here: multilingual builds
 *   /seo-relaunch/      — preserving rankings in migration→  here: new-from-scratch builds
 *
 * Each section below cross-links to the corresponding SEO page so users with
 * ranking-intent are redirected before the "build" content confuses them.
 */

type CaseStudy = {
  id: string;
  title: string;
  branchChip: string;
  scope: string;
  challenge: string;
  solution: string;
  outcome: string;
  liveUrl: string;
  liveLabel: string;
  previewSrc: string;
  previewAlt: string;
  domain: string;
};

const caseStudies: readonly CaseStudy[] = [
  {
    id: "kfz-andresen",
    title: "KFZ Andresen — Werkstatt-Website, die Termine abholt",
    branchChip: "Automotive · Schleswig-Holstein",
    scope: "Konzept · Design · Entwicklung · Conversion · Local SEO",
    challenge:
      "Ein Meisterbetrieb mit drei Werkstatt-Standorten (Borgstedt, Büdelsdorf, Rendsburg) brauchte eine Website, die regional gefunden wird, Vertrauen aufbaut und direkt Termine abholt — statt nur als digitale Visitenkarte zu dienen.",
    solution:
      "Mehrstandort-Architektur mit sauberer Service-Hierarchie (Technik, Tuning, Inspektion), eingebetteter Online-Terminbuchung, WhatsApp-Direktkontakt und Google-Reviews als Social-Proof. Mobile-First mit sichtbaren Call- und Book-Buttons auf jeder Seite.",
    outcome:
      "Eine Werkstatt-Website, die als Vertriebskanal arbeitet: Termine, Anrufe und WhatsApp-Anfragen kommen direkt aus der Seite. Premium-Positionierung und regionale Auffindbarkeit in einem Setup vereint.",
    liveUrl: "https://www.kfz-andresen.de",
    liveLabel: "kfz-andresen.de live ansehen",
    previewSrc: "/cases/kfz-andresen.jpg",
    previewAlt: "Startseite von kfz-andresen.de — Werkstatt-Website mit Online-Buchung und Mehrstandort-Navigation",
    domain: "kfz-andresen.de",
  },
  {
    id: "aktuelle-kw",
    title: "aktuellekw.de — Utility-Seite mit Evergreen-Traffic",
    branchChip: "Utility & Content",
    scope: "Konzept · Design · Entwicklung · SEO-Struktur",
    challenge:
      "Eine Nischen-Utility rund um die aktuelle Kalenderwoche sollte die wichtigste Frage in Sekundenbruchteilen beantworten — und gleichzeitig tief genug sein, um jede Folgefrage zu klären, ohne schnelle Nutzer zu ermüden.",
    solution:
      "Hybrid aus Real-Time-Anzeige der aktuellen KW und einem strukturierten Wissensteil mit Rechner, FAQ, ISO-8601-Kontext und Excel-Formeln. Progressive Disclosure: die Hauptantwort ist sofort sichtbar, Details erschließen sich schrittweise nach unten.",
    outcome:
      "Ein Evergreen-Tool, das täglich neu gesucht wird — stabile organische Sichtbarkeit ohne Content-Dauerbaustelle, strukturiert für Featured Snippets und AI-Overviews.",
    liveUrl: "https://aktuellekw.de",
    liveLabel: "aktuellekw.de live ansehen",
    previewSrc: "/cases/aktuelle-kw.jpg",
    previewAlt: "Startseite von aktuellekw.de — Utility-Seite mit großer Kalenderwochen-Anzeige und Wochenrechner",
    domain: "aktuellekw.de",
  },
];

type BuildType = {
  id: string;
  title: string;
  body: string;
  items: readonly string[];
  crossLink: { href: string; label: string };
};

const buildTypes: readonly BuildType[] = [
  {
    id: "wordpress",
    title: "WordPress-Webseiten",
    body: "Stabile, ausbaubare WordPress-Projekte mit sauberem Template-Code, vernünftiger Plugin-Hygiene und einer Struktur, die später nicht gegen SEO arbeitet.",
    items: [
      "Individuelle Themes statt Drag-and-Drop-Baukästen",
      "Redaktionell pflegbare Seitentypen und Blöcke",
      "Performance-Budget eingebaut, kein Nachrüsten",
      "Saubere Übergabe für deine Redaktion",
    ],
    crossLink: { href: "/wordpress-seo/", label: "Seite existiert schon? → WordPress SEO" },
  },
  {
    id: "landingpages",
    title: "Landingpages",
    body: "Fokussierte Einzel-Seiten für Kampagnen, Produkt-Launches oder Ads-Budgets. Eine klare Botschaft, ein klares Ziel, nachweisbare Conversion-Pfade.",
    items: [
      "Messbare Conversion-Struktur statt dekorativer Sektionen",
      "Integration in Analytics und Tag-Management",
      "A/B-testbare Varianten bei Bedarf",
      "Schneller Launch, geringes Abhängigkeitsrisiko",
    ],
    crossLink: { href: "/seo-strategie/", label: "Langfristig ranken statt Kampagne? → SEO-Strategie" },
  },
  {
    id: "shops",
    title: "Online-Shops",
    body: "E-Commerce-Projekte auf WooCommerce oder Shopify, die nicht nur verkaufen, sondern auch in der Google-Suche arbeitsfähig sind.",
    items: [
      "Saubere Kategorie- und Produkttemplate-Struktur",
      "Schneller Checkout, geringe Abbruchrate",
      "Attributfilter, die Google korrekt versteht",
      "Solides Fundament für E-Commerce-SEO",
    ],
    crossLink: { href: "/e-commerce-seo/", label: "Shop existiert, braucht Rankings? → E-Commerce SEO" },
  },
  {
    id: "mehrsprachig",
    title: "Mehrsprachige Webseiten",
    body: "Sites in zwei, drei oder mehr Sprachen — technisch sauber mit hreflang, redaktionell tragfähig und ohne Übersetzungs-Schnellschuss.",
    items: [
      "Korrekte hreflang-Struktur von Anfang an",
      "Redaktionelle Prozesse für mehrere Sprachen",
      "Länder- oder Sprachweichen ohne SEO-Fallen",
      "Vorbereitet für internationale Rankings",
    ],
    crossLink: { href: "/internationales-seo/", label: "Rankings international wachsen? → Internationales SEO" },
  },
  {
    id: "wartung",
    title: "Website-Wartung",
    body: "Bestehende Websites zuverlässig pflegen: Updates, Sicherheit, Performance-Checks und kleine Weiterentwicklungen, ohne dass jemand intern zuständig sein muss.",
    items: [
      "Regelmäßige Core- und Plugin-Updates mit Staging",
      "Security-Monitoring und Backup-Strategie",
      "Performance-Checks quartalsweise",
      "Fester Ansprechpartner für Änderungen",
    ],
    crossLink: { href: "/seo-betreuung/", label: "Inklusive laufender Sichtbarkeit? → SEO-Betreuung" },
  },
];

const processSteps = [
  {
    step: "01",
    title: "Kickoff & Ziel-Klärung",
    body: "Wir klären, was die Site leisten soll, wer sie pflegen wird und welche Rolle SEO und Conversion in der Priorisierung spielen.",
  },
  {
    step: "02",
    title: "Konzept & Struktur",
    body: "Seitenarchitektur, Template-Logik, Content-Blöcke und Redaktionsprozesse werden vor einer einzigen gestalterischen Entscheidung festgelegt.",
  },
  {
    step: "03",
    title: "Design & Build",
    body: "Wir gestalten in Iterationen und setzen parallel technisch um. Jede Seite bekommt saubere Semantik, Performance-Budget und Analytics-Anbindung.",
  },
  {
    step: "04",
    title: "Launch & Übergabe",
    body: "Mit Checkliste, Redirect-Plan und dokumentierter Redaktionshilfe — kein Launch, der intern dann irgendwie doch nicht richtig funktioniert.",
  },
  {
    step: "05",
    title: "Pflege & Weiterentwicklung",
    body: "Auf Wunsch bleiben wir als Wartungspartner an Bord. Updates, Security und kleinere Verbesserungen laufen ohne interne Dauerbaustelle.",
  },
] as const;

const techStack = [
  {
    value: "WordPress",
    title: "Pragmatisch und ausbaubar",
    body: "Für Unternehmen, die Content regelmäßig selbst pflegen wollen, ohne in einer Baukasten-Sackgasse zu landen.",
  },
  {
    value: "Next.js",
    title: "Performance-First",
    body: "Für Projekte mit hohen Anforderungen an Geschwindigkeit, Developer-Experience oder Integrationen in bestehende Stacks.",
  },
  {
    value: "Headless",
    title: "Entkoppelt, wenn sinnvoll",
    body: "Headless-CMS-Setups mit klarem redaktionellem Workflow, wenn Frontend-Flexibilität wichtiger ist als Out-of-the-Box.",
  },
  {
    value: "Performance",
    title: "Core Web Vitals eingebaut",
    body: "Performance ist kein Nachgedanke — sondern Kriterium in jeder Template- und Asset-Entscheidung ab Tag eins.",
  },
] as const;

// Pricing data is now shared from src/data/website-pricing.ts so /preise/
// and /websites/ stay in sync. Change prices in that file — both surfaces update.
const pricingTeasers = websitePricingTiers;

const websitesFaqs = [
  {
    question: "Wie lange dauert ein Website-Projekt?",
    answer:
      "Landingpages in 3–5 Wochen, klassische Unternehmenswebsites in 8–12 Wochen, Shops und mehrsprachige Projekte je nach Umfang 10–16 Wochen. Wir geben im Kickoff eine belastbare Timeline, kein Wunschdenken.",
  },
  {
    question: "Wem gehört der Code und die Website nach dem Launch?",
    answer:
      "Dir. Vollständig. Du bekommst alle Zugänge, den Quellcode und die Dokumentation. Keine Vendor-Lock-Ins, keine versteckten Lizenzmodelle.",
  },
  {
    question: "WordPress oder Next.js – wie entscheidet ihr?",
    answer:
      "Anhand deiner Redaktion, deines Tech-Stacks und deiner Anforderungen an Performance und Integrationen. Wir empfehlen keine Technologie, nur weil sie gerade modern ist.",
  },
  {
    question: "Übernehmt ihr Hosting und Domain?",
    answer:
      "Auf Wunsch ja. Oder wir richten alles bei deinem bestehenden Hoster ein. Wir sind an keine Hosting-Provision gebunden und beraten herstellerneutral.",
  },
  {
    question: "Kommt SEO gleich mit oder ist das ein separates Projekt?",
    answer:
      "Technische SEO-Grundlagen (Semantik, Performance, saubere Struktur) sind Teil jedes Projekts. Strategisches SEO mit Keyword-Mapping, Content-Aufbau und laufender Betreuung ist ein eigenes Mandat, das nahtlos andocken kann.",
  },
  {
    question: "Was passiert nach dem Launch?",
    answer:
      "Wir übergeben dokumentiert und bieten optional einen Wartungsvertrag an — mit festem Stundenkontingent, Updates, Security und Performance-Checks. Oder du übernimmst intern. Beides ist möglich.",
  },
];

const schemas = buildPageSchemas({
  canonicalPath: "/websites/",
  fallbackName: "Websites",
  kind: "service",
  faqs: websitesFaqs,
});

export const metadata = buildPageMetadata(
  "/websites/",
  "Websites & SEO aus einer Hand | NordPush",
  "Websites, Landingpages und Shops mit Design, Technik und SEO aus einem Team — klar, pflegbar, substanziell.",
);

export default function WebsitesPage() {
  return (
    <SiteShell>
      <JsonLd schemas={schemas} />

      <section className="home-refresh-hero" data-ux-slot="Hero">
        <div className="home-refresh-copy">
          <div className="home-refresh-kicker">
            <span className="home-refresh-chip">
              <span className="home-refresh-chip-dot" aria-hidden="true" />
              Website-Agentur aus Neumünster
            </span>
            <p className="eyebrow eyebrow--plain">WordPress, Next.js und alles dazwischen</p>
          </div>

          <div className="home-refresh-heading">
            <h1>
              Websites mit
              <span className="accent-text"> Substanz </span>
              — Design, Technik und SEO aus einer Hand.
            </h1>
            <p className="home-refresh-lede">
              Wir bauen Webseiten, Landingpages und Online-Shops für Unternehmen, die Gestaltung, Geschwindigkeit
              und Auffindbarkeit nicht länger in drei unterschiedlichen Projekten erledigen wollen. Klar
              priorisiert, redaktionell pflegbar und technisch tragfähig.
            </p>
          </div>

          <div className="home-refresh-actions">
            <Link href="/kontakt/" className="button primary">
              Projekt anfragen
            </Link>
            <Link href="#arbeiten" className="button">
              Unsere Arbeiten
            </Link>
          </div>

          <ul className="home-refresh-points">
            <li>WordPress, Next.js oder Headless — passend zu deiner Redaktion und deinem Stack.</li>
            <li>Performance, Semantik und Analytics sind eingebaut, nicht nachgerüstet.</li>
            <li>Auf Wunsch bleiben wir als Wartungspartner an Bord.</li>
          </ul>
        </div>

        <aside className="home-refresh-panel" aria-label="Website-Projektmodell">
          <div className="home-refresh-panel-shell">
            <div className="home-refresh-panel-head">
              <p className="eyebrow eyebrow--plain">Unser Website-Setup</p>
              <span className="home-status-pill">Klar. Schnell. Pflegbar.</span>
            </div>

            <div className="home-panel-block">
              <p className="home-panel-label">Was du bekommst</p>
              <ul className="home-panel-list">
                <li>Konzept, Design und Entwicklung aus einem Team</li>
                <li>Dokumentierte Redaktionshilfe und saubere Übergabe</li>
                <li>Performance-Budget und Core Web Vitals ab Tag eins</li>
                <li>Optionale Wartung ohne Monatspauschale für Nichts</li>
              </ul>
            </div>

            <div className="home-panel-foot">
              <p>
                Kein Theme-Flickenteppich, keine versteckten Lizenzkosten. Code, Content und Zugänge gehören
                dir — ab dem ersten Tag nach Launch.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="home-section" id="was-wir-bauen">
        <div className="section-heading">
          <p className="eyebrow">Was wir bauen</p>
          <h2>Fünf Projekttypen, klar voneinander abgegrenzt.</h2>
          <p>
            Nicht jede Website ist ein Relaunch und nicht jede Landingpage ist ein Shop. Hier siehst du,
            welches Format zu welcher Herausforderung passt — und wohin du gehen solltest, wenn du
            stattdessen SEO für eine bestehende Seite brauchst.
          </p>
        </div>

        <div className="home-service-grid">
          {buildTypes.map((type) => (
            <article key={type.id} id={type.id} className="home-service-card">
              <div className="home-service-head">
                <p className="eyebrow eyebrow--plain">Projekttyp</p>
                <h3>{type.title}</h3>
              </div>
              <p>{type.body}</p>
              <ul className="home-service-list">
                {type.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href={type.crossLink.href} className="text-link home-service-link">
                {type.crossLink.label}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-operations" id="prozess">
        <div className="section-heading">
          <p className="eyebrow">Prozess</p>
          <h2>Fünf Phasen, eine klare Verantwortung.</h2>
          <p>
            Wir führen Website-Projekte so, dass intern niemand rätseln muss, was gerade passiert, warum
            es wichtig ist und wer den nächsten Schritt verantwortet.
          </p>
        </div>

        <div className="home-principles-grid">
          {processSteps.map((step) => (
            <article key={step.step} className="home-principle-card">
              <span className="home-principle-index">{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" id="arbeiten">
        <div className="section-heading">
          <p className="eyebrow">Aus unseren Kundenprojekten</p>
          <h2>Websites, die im Alltag ihrer Unternehmen arbeiten.</h2>
          <p>
            Zwei Projekte, die zeigen, wie wir Webseiten bauen: eine Werkstatt-Website als
            Vertriebskanal und eine Utility-Seite mit planbarem Evergreen-Traffic — beide live,
            beide mit klarer Aufgabe.
          </p>
        </div>

        <div className="websites-case-grid">
          {caseStudies.map((study) => (
            <article key={study.id} id={study.id} className="websites-case-card">
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="websites-case-preview"
                aria-label={`${study.domain} in neuem Tab öffnen`}
              >
                <div className="websites-case-preview-bar" aria-hidden="true">
                  <span className="websites-case-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="websites-case-url">{study.domain}</span>
                </div>
                <div className="websites-case-preview-frame">
                  <Image
                    src={study.previewSrc}
                    alt={study.previewAlt}
                    width={1600}
                    height={1000}
                    sizes="(max-width: 900px) 100vw, 560px"
                    className="websites-case-preview-img"
                  />
                </div>
              </a>

              <span className="websites-case-chip">
                <span className="websites-case-chip-dot" aria-hidden="true" />
                {study.branchChip}
              </span>
              <h3>{study.title}</h3>
              <p className="websites-case-scope">{study.scope}</p>

              <div className="websites-case-block">
                <strong>Ausgangslage</strong>
                <p>{study.challenge}</p>
              </div>
              <div className="websites-case-block">
                <strong>Unsere Lösung</strong>
                <p>{study.solution}</p>
              </div>
              <div className="websites-case-block">
                <strong>Wirkung</strong>
                <p>{study.outcome}</p>
              </div>

              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="websites-case-link"
              >
                {study.liveLabel}
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" id="tech-stack">
        <div className="section-heading">
          <p className="eyebrow">Technologie</p>
          <h2>Wir wählen den Stack, der zu deinem Projekt passt.</h2>
          <p>
            Keine Technologie-Dogmen. Wir arbeiten mit den Werkzeugen, die deine Redaktion bedienen
            kann und die zu deinen Performance- und Integrations-Anforderungen passen.
          </p>
        </div>

        <div className="home-proof-grid">
          {techStack.map((tech) => (
            <article key={tech.value} className="home-proof-card">
              <p className="home-proof-value">{tech.value}</p>
              <h3>{tech.title}</h3>
              <p>{tech.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" id="preise">
        <div className="section-heading">
          <p className="eyebrow">Preisorientierung</p>
          <h2>Drei Wege, mit uns zu arbeiten.</h2>
          <p>
            Cash-Kauf für Teams mit Budget, monatliches Abo für Unternehmen, die lieber planbar
            abrechnen, oder ein Bundle aus Website und SEO — wir haben alle drei Modelle bewusst
            gleich strukturiert, damit du vergleichen kannst.
          </p>
        </div>

        <aside className="websites-starter-bonus" aria-label={starterBonus.eyebrow}>
          <span className="websites-starter-bonus-dot" aria-hidden="true" />
          <div className="websites-starter-bonus-copy">
            <p className="websites-starter-bonus-eyebrow">{starterBonus.eyebrow}</p>
            <p className="websites-starter-bonus-body">{starterBonus.body}</p>
          </div>
          <Link href={starterBonus.ctaHref} className="websites-starter-bonus-link">
            {starterBonus.ctaLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </aside>

        {/* Cash tiers */}
        <div className="websites-pricing-subsection" id="preise-cash">
          <div className="websites-pricing-subhead">
            <p className="eyebrow eyebrow--plain">Modell 1 · Cash</p>
            <h3>Einmalige Zahlung, Code und Zugänge gehören dir</h3>
          </div>
          <div className="home-proof-grid">
            {pricingTeasers.map((pt) => (
              <article key={pt.title} className="home-proof-card">
                <p className="home-proof-value">{pt.value}</p>
                <h3>{pt.title}</h3>
                <p>{pt.body}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Abo tiers */}
        <div className="websites-pricing-subsection" id="preise-abo">
          <div className="websites-pricing-subhead">
            <p className="eyebrow eyebrow--plain">Modell 2 · Abo</p>
            <h3>Monatlich abrechnen, Hosting und Wartung inklusive</h3>
            <p>
              Wir bauen und hosten deine Website auf unserer Infrastruktur. Du zahlst monatlich,
              bekommst laufende Pflege und kannst nach der Mindestlaufzeit jederzeit auf ein reines
              Wartungs-Abo wechseln oder die Website mit Ablöse übernehmen.
            </p>
          </div>
          <div className="websites-abo-grid">
            {websiteAboTiers.map((tier) => (
              <article
                key={tier.id}
                id={tier.id}
                className={`websites-abo-card${tier.recommended ? " is-recommended" : ""}`}
              >
                {tier.recommended ? (
                  <span className="websites-abo-badge" aria-label="Beliebtestes Paket">
                    Beliebt
                  </span>
                ) : null}
                <div className="websites-abo-card-head">
                  <h4>{tier.title}</h4>
                  <p className="websites-abo-rate">
                    <span className="websites-abo-rate-prefix">ab</span>
                    <span className="websites-abo-rate-value">{tier.rate}</span>
                    <span className="websites-abo-rate-suffix">{tier.suffix}</span>
                  </p>
                  <p className="websites-abo-term-pill">
                    <span className="websites-abo-term-dot" aria-hidden="true" />
                    {tier.term}
                  </p>
                  <p className="websites-abo-equivalent">{tier.equivalent}</p>
                </div>
                <p className="websites-abo-body">{tier.body}</p>
                <ul className="websites-abo-includes">
                  {tier.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        {/* Bundle tiers — premium dark treatment */}
        <div className="websites-pricing-subsection" id="preise-bundle">
          <div className="websites-pricing-subhead">
            <p className="eyebrow eyebrow--plain">Modell 3 · Bundle</p>
            <h3>Website + SEO in einem monatlichen Paket</h3>
            <p>
              Wenn du Launch und laufende SEO-Skalierung gleich zusammen angehen willst, sparst du
              im Bundle rund 15 % gegenüber der Einzelbuchung — und hast einen Ansprechpartner für
              beides.
            </p>
          </div>
          <div className="websites-bundle-grid">
            {bundleTiers.map((bundle) => (
              <article
                key={bundle.id}
                id={bundle.id}
                className={`websites-bundle-card${bundle.recommended ? " is-recommended" : ""}`}
              >
                <span className="websites-bundle-savings-badge" aria-label={bundle.savings}>
                  {bundle.savingsBadge}
                </span>
                {bundle.recommended ? (
                  <span className="websites-bundle-badge" aria-label="Beliebtestes Bundle">
                    Beliebt
                  </span>
                ) : null}

                <div className="websites-bundle-head">
                  <h4>{bundle.title}</h4>
                  <p className="websites-bundle-rate">
                    <span className="websites-bundle-rate-prefix">ab</span>
                    <span className="websites-bundle-rate-value">{bundle.rate}</span>
                    <span className="websites-bundle-rate-suffix">{bundle.suffix}</span>
                  </p>
                  <p className="websites-bundle-term">{bundle.term}</p>
                </div>

                <p className="websites-bundle-body">{bundle.body}</p>

                <div className="websites-bundle-components">
                  <div className="websites-bundle-component">
                    <p className="websites-bundle-component-label">Website</p>
                    <p className="websites-bundle-component-text">{bundle.websiteComponent}</p>
                  </div>
                  <div className="websites-bundle-component">
                    <p className="websites-bundle-component-label">SEO</p>
                    <p className="websites-bundle-component-text">{bundle.seoComponent}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <p style={{ marginTop: "var(--space-8)", textAlign: "center" }}>
          <Link href="/preise/" className="text-link">
            Alle Preise und Pakete ansehen →
          </Link>
        </p>
      </section>

      <FAQAccordion heading="Häufige Fragen zu Website-Projekten" items={websitesFaqs} />

      <section className="home-section">
        <div className="section-heading section-heading--compact">
          <p className="eyebrow">Nächster Schritt</p>
          <h2>Website-Projekt im Kopf? Erzähl uns davon.</h2>
          <p>
            Buche ein kostenloses Erstgespräch. 30 Minuten, kein Pitch — nur eine ehrliche Einschätzung,
            welche Lösung für dein Vorhaben sinnvoll ist und was sie realistisch kostet.
          </p>
        </div>
        <div className="home-refresh-actions" style={{ justifyContent: "center" }}>
          <Link href="/kontakt/" className="button primary">
            Kostenlose Ersteinschätzung
          </Link>
          <Link href="/preise/" className="button">
            Preise ansehen
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
