import Image from "next/image";
import Link from "next/link";
import { FAQAccordion } from "@/components/faq-accordion";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import { buildPageMetadata } from "@/lib/seo";
import { buildPageSchemas } from "@/lib/structured-data";

type PathOption = {
  title: string;
  body: string;
  href: string;
  icon: string;
  cta: string;
};

type Pillar = {
  title: string;
  subtitle: string;
  items: readonly string[];
  price: string;
  priceLabel: string;
  href: string;
  cta: string;
};

type WorkItem = {
  id: string;
  title: string;
  badge: string;
  tag: string;
  body: string;
  liveUrl: string;
  domain: string;
  previewSrc?: string;
  previewAlt?: string;
};

export const metadata = buildPageMetadata(
  "/",
  "NordPush | Website- & SEO-Agentur aus Neumünster",
  "Website und SEO aus einer Hand | Wir bauen deine Seite und machen sie bei Google & KI sichtbar | Aus Neumünster",
  { forceOverride: true },
);

const heroSignals = [
  {
    value: "Beides",
    label: "aus einer Hand",
    note: "Website und Sichtbarkeit laufen im selben Team zusammen — ohne Übergaben.",
  },
  {
    value: "1 Team",
    label: "klare Verantwortung",
    note: "Design, Technik, Content und SEO greifen sauber ineinander.",
  },
  {
    value: "Klar",
    label: "Reporting",
    note: "Mit Prioritäten, Risiken und den nächsten echten Schritten.",
  },
] as const;

const pathOptions: readonly PathOption[] = [
  {
    title: "eine neue Website",
    body: "Eine Website, die nicht nur gut aussieht, sondern Anfragen, Anrufe und Termine abholt.",
    href: "/websites/",
    icon: "/icons/website-loop.svg",
    cta: "Websites ansehen",
  },
  {
    title: "mehr Sichtbarkeit",
    body: "Eine bestehende Seite, die in Google endlich gefunden wird — strategisch, technisch, inhaltlich.",
    href: "/preise/",
    icon: "/icons/sichtbarkeit-loop.svg",
    cta: "SEO-Betreuung ansehen",
  },
  {
    title: "beides aus einer Hand",
    body: "Neue Website und Sichtbarkeit von Anfang an zusammen denken — ein Team, ein Plan.",
    href: "/kontakt/",
    icon: "/icons/beides-loop.svg",
    cta: "Projekt besprechen",
  },
] as const;

const servicePillars: readonly Pillar[] = [
  {
    title: "Websites",
    subtitle: "Design & Umsetzung, die verkaufen",
    items: [
      "Konzept, Design und Entwicklung aus einer Hand",
      "Klare Conversion-Pfade statt digitaler Visitenkarte",
      "Technisch sauber gebaut — schnell, wartbar, SEO-bereit",
      "Redaktionell pflegbare Übergabe für dein Team",
    ],
    price: "ab 3.900 €",
    priceLabel: "Websites",
    href: "/websites/",
    cta: "Websites & Preise ansehen",
  },
  {
    title: "SEO",
    subtitle: "Strategie, Technik & Content",
    items: [
      "Audit, Roadmap und Priorisierung nach Geschäftswirkung",
      "Technische Bremsen bei Crawling, Indexierung und Speed beheben",
      "Content- und Themenstruktur entlang echter Suchintention",
      "Laufendes Reporting mit klaren nächsten Schritten",
    ],
    price: "ab 1.200 €/Monat",
    priceLabel: "SEO-Betreuung",
    href: "/preise/",
    cta: "SEO-Betreuung & Preise ansehen",
  },
] as const;

const workItems: readonly WorkItem[] = [
  {
    id: "kfz-andresen",
    title: "KFZ Technik & Tuning Andresen",
    badge: "★ Platz 1 Google",
    tag: "Kfz-Werkstatt · Borgstedt",
    body: "Website mit Online-Terminbuchung und Local SEO — heute die organische Nr. 1 für „kfz werkstatt borgstedt“.",
    liveUrl: "https://www.kfz-andresen.de",
    domain: "kfz-andresen.de",
    previewSrc: "/cases/kfz-andresen.jpg",
    previewAlt: "Startseite von kfz-andresen.de — Werkstatt-Website mit Online-Terminbuchung",
  },
  {
    id: "vom-elbwind",
    title: "Havaneser vom Elbwind",
    badge: "Neu 2026",
    tag: "Hundezucht · Hamburg",
    body: "Ruhige, vertrauensbildende Website für eine Hundezucht — als Design- und Konzeptreferenz.",
    liveUrl: "https://vom-elbwind.de",
    domain: "vom-elbwind.de",
    previewSrc: "/cases/vom-elbwind.jpg",
    previewAlt: "Startseite von vom-elbwind.de — Website einer Havaneser-Hundezucht in Hamburg",
  },
  {
    id: "aktuellekw",
    title: "aktuellekw.de",
    badge: "Neu 2026",
    tag: "Web-Tool",
    body: "Schnelle Utility-Seite rund um die aktuelle Kalenderwoche — als Design- und Konzeptreferenz.",
    liveUrl: "https://aktuellekw.de",
    domain: "aktuellekw.de",
    previewSrc: "/cases/aktuelle-kw.jpg",
    previewAlt: "Startseite von aktuellekw.de — Utility-Seite mit Kalenderwochen-Anzeige",
  },
] as const;

const comboPoints = [
  {
    title: "Ein Ansprechpartner",
    body: "Für Website und Sichtbarkeit sprichst du mit demselben Team — keine Übergaben, keine Verständnislücken zwischen Agenturen.",
  },
  {
    title: "Keine Reibungsverluste",
    body: "Design, Technik und SEO werden von Anfang an zusammen geplant, statt hinterher mühsam zusammengeflickt.",
  },
  {
    title: "Sichtbarkeit von Anfang an",
    body: "Neue Seiten starten mit sauberer Struktur und Technik — bereit, gefunden zu werden, statt erst Monate später nachgebessert.",
  },
] as const;

const processSteps = [
  {
    step: "01",
    title: "Audit & Diagnose",
    body: "Wir schauen auf Technik, Design, Inhalte und Suchintention — mit Fokus auf die Seiten, die für dein Geschäft zählen.",
  },
  {
    step: "02",
    title: "Roadmap & Scope",
    body: "Klare Priorisierung nach Wirkung und Aufwand statt langer Wunschliste. Du weißt, was zuerst passiert und warum.",
  },
  {
    step: "03",
    title: "Umsetzung in Sprints",
    body: "Wir setzen um, stimmen mit deinem Team ab und halten Entscheidungen nachvollziehbar fest.",
  },
  {
    step: "04",
    title: "Reporting & Ausbau",
    body: "Fortschritt und nächste Schritte werden regelmäßig geprüft und an die Realität angepasst.",
  },
] as const;

const reportMetrics = [
  {
    title: "Sichtbarkeit",
    body: "Wir verfolgen die Cluster und Seiten, die für dein Geschäft zählen — nicht jedes Keyword einzeln.",
    footnote: "Cluster, Rankings, Gewinner und Verlierer",
  },
  {
    title: "Qualifizierter Traffic",
    body: "Nicht jeder Besuch ist gut. Wir schauen auf Nachfrage, Einstiegsseiten und echte Relevanz.",
    footnote: "Landingpages, Suchintention, Qualität",
  },
  {
    title: "Anfragen & Conversion",
    body: "Sichtbarkeit zählt erst, wenn daraus Anfragen, Anrufe oder Verkäufe werden.",
    footnote: "Anfragen, Conversion-Pfade, Umsatzbezug",
  },
  {
    title: "Technische Gesundheit",
    body: "Wenn Indexierung, interne Links oder Ladezeiten kippen, sehen wir es zuerst — und kümmern uns darum.",
    footnote: "Crawling, Core Web Vitals, Risiken",
  },
] as const;

const homeFaqs = [
  {
    question: "Baut ihr nur Websites oder übernehmt ihr auch SEO?",
    answer:
      "Beides — und das bewusst aus einer Hand. Wir entwickeln Websites, die von Anfang an sauber für die Suche aufgestellt sind, und betreuen Sichtbarkeit auch langfristig weiter, wenn das gewünscht ist.",
  },
  {
    question: "Für welche Unternehmen ist NordPush der richtige Partner?",
    answer:
      "Vor allem für lokale Dienstleister, Handwerksbetriebe und kleinere Unternehmen, die eine Website wollen, die wirklich etwas bringt — und die Sichtbarkeit dazu nicht dem Zufall überlassen möchten.",
  },
  {
    question: "Wie schnell kann ein Projekt starten?",
    answer:
      "In der Regel kurzfristig. Im Erstgespräch klären wir Ziel, Umfang und den sinnvollen Startpunkt — für eine neue Website, SEO-Betreuung oder beides zusammen.",
  },
  {
    question: "Wie transparent ist die Zusammenarbeit?",
    answer:
      "Sehr. Du bekommst keine Black Box, sondern klare Prioritäten, nachvollziehbare Entscheidungen und regelmäßige Updates zu Fortschritt und nächsten Schritten.",
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
              Website- &amp; SEO-Agentur aus Neumünster
            </span>
            <p className="eyebrow eyebrow--plain">Websites und Sichtbarkeit aus einer Hand</p>
          </div>

          <div className="home-refresh-heading">
            <h1>
              Websites, die <span className="accent-text">gefunden werden</span> — und{" "}überzeugen.
            </h1>
            <p className="home-refresh-lede">
              NordPush baut Websites, die verkaufen, und sorgt dafür, dass sie in Google auch
              gefunden werden. Design, Technik und Sichtbarkeit denken wir von Anfang an zusammen —
              ein Team, ein Plan, keine Reibungsverluste.
            </p>
          </div>

          <div className="home-refresh-actions">
            <Link href="/kontakt/" className="button primary" data-cta="hero-primary">
              Kostenlose Ersteinschätzung <span aria-hidden="true">→</span>
            </Link>
            <Link href="#unsere-arbeit" className="home-refresh-secondary-link" data-cta="hero-secondary">
              Arbeiten ansehen <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="home-refresh-microcopy">
            Antwort innerhalb 24 h · kein Vertrag · kein Sales-Druck
          </p>
        </div>

        <aside className="home-refresh-panel" aria-label="NordPush Projektmodell">
          <div className="home-refresh-panel-shell">
            <div className="home-refresh-panel-head">
              <p className="eyebrow eyebrow--plain">Website- &amp; SEO-Setup</p>
              <span className="home-status-pill">Gebaut. Gefunden. Überzeugend.</span>
            </div>

            <div className="home-panel-block">
              <p className="home-panel-label">In den ersten 30 Tagen</p>
              <ul className="home-panel-list">
                <li>Klarheit über Ziel, Zielgruppe und sinnvollen Seitenaufbau</li>
                <li>Erste Entwürfe oder technisches Audit — je nach Startpunkt</li>
                <li>Keyword- und Themenlandschaft für die wichtigsten Seiten</li>
                <li>Setup für Reporting, Verantwortlichkeiten und nächste Schritte</li>
              </ul>
            </div>

            <div className="home-panel-foot">
              <p>
                Wöchentliche Abstimmung, klare Owner und ein Reporting, das Entscheidungen
                vorbereitet statt nur Zustand zu beschreiben.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="home-section" aria-labelledby="path-heading">
        <div className="section-heading section-heading--compact">
          <p className="eyebrow">Ich brauche …</p>
          <h2 id="path-heading">Wo stehst du gerade?</h2>
        </div>

        <div className="home-path-grid">
          {pathOptions.map((option) => (
            <Link
              key={option.title}
              href={option.href}
              className="home-path-card"
              data-cta={`path-${option.title.split(" ")[0].toLowerCase()}`}
            >
              <span className="home-path-icon">
                <img src={option.icon} alt="" aria-hidden="true" width={30} height={30} loading="lazy" />
              </span>
              <h3>{option.title}</h3>
              <p>{option.body}</p>
              <span className="home-path-cta">
                {option.cta} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-trust-strip" aria-label="Vertrauensindikatoren">
        {heroSignals.map((signal) => (
          <article key={signal.label} className="home-trust-strip-item">
            <p className="home-trust-strip-value">{signal.value}</p>
            <p className="home-trust-strip-label">{signal.label}</p>
            <p className="home-trust-strip-note">{signal.note}</p>
          </article>
        ))}
      </section>

      <section className="home-section" id="leistungen">
        <div className="section-heading">
          <p className="eyebrow">Leistungen</p>
          <h2>Websites und SEO — gleich wichtig, gleich ernst genommen.</h2>
          <p>
            Ob neue Website, laufende SEO-Betreuung oder beides zusammen: Du bekommst ein System,
            das auf Sichtbarkeit und echte Anfragen einzahlt.
          </p>
        </div>

        <div className="home-service-grid home-pillar-grid">
          {servicePillars.map((pillar) => (
            <article key={pillar.title} className="home-service-card">
              <div className="home-service-head">
                <p className="eyebrow eyebrow--plain">{pillar.subtitle}</p>
                <h3>{pillar.title}</h3>
              </div>
              <ul className="home-service-list">
                {pillar.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="home-pillar-price">
                {pillar.price} <span>{pillar.priceLabel}</span>
              </p>
              <Link
                href={pillar.href}
                className="text-link home-service-link"
                data-cta={`card-${pillar.title.toLowerCase()}`}
              >
                {pillar.cta} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" id="unsere-arbeit">
        <div className="section-heading">
          <p className="eyebrow">Unsere Arbeit</p>
          <h2>Drei Projekte, drei Branchen — gebaut, um zu wirken.</h2>
          <p>
            Statt Logos fremder Marken zeigen wir lieber, was wir wirklich gebaut haben: Websites
            für eine Werkstatt, eine Hundezucht und ein Web-Tool — jede mit eigenem Ziel.
          </p>
        </div>

        <div className="home-work-grid">
          {workItems.map((item) => (
            <article key={item.id} className="home-work-card">
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="websites-case-preview"
                aria-label={`${item.domain} in neuem Tab öffnen`}
              >
                <div className="websites-case-preview-bar" aria-hidden="true">
                  <span className="websites-case-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="websites-case-url">{item.domain}</span>
                </div>
                <div className="home-work-preview-frame">
                  {item.previewSrc ? (
                    <Image
                      src={item.previewSrc}
                      alt={item.previewAlt ?? ""}
                      width={1600}
                      height={1000}
                      sizes="(max-width: 980px) 100vw, 360px"
                      className="home-work-preview-img"
                    />
                  ) : (
                    <span className="home-work-preview-placeholder" aria-hidden="true">
                      Vorschau folgt
                    </span>
                  )}
                </div>
              </a>

              <div className="home-work-body">
                <span className="home-work-badge">{item.badge}</span>
                <h3>{item.title}</h3>
                <p className="home-work-tag">{item.tag}</p>
                <p className="home-work-text">{item.body}</p>
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-work-link"
                >
                  Live ansehen <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-result">
          <p className="home-result-metric">#1</p>
          <div className="home-result-copy">
            <p className="eyebrow">Ergebnis</p>
            <h2>Gebaut — und gefunden.</h2>
            <p>
              KFZ Technik &amp; Tuning Andresen rankt heute organisch auf Platz 1 bei Google für
              „kfz werkstatt borgstedt“ — ohne Anzeigen, mit sauberer Website-Struktur und
              gezielter lokaler Sichtbarkeit.
            </p>
            <span>Stand: organische Google-Suche, Juni 2026 — Screenshot auf Anfrage.</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="eyebrow">Aus einer Hand</p>
          <h2>Warum beides zusammen besser ist.</h2>
          <p>
            Eine neue Website ohne Sichtbarkeitsplan verpufft. SEO ohne überzeugende Website
            verschwendet die Klicks, die es gewinnt. Wir denken beides von Anfang an zusammen.
          </p>
        </div>

        <div className="home-principles-grid">
          {comboPoints.map((point, index) => (
            <article key={point.title} className="home-principle-card">
              <span className="home-principle-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-operations">
        <div className="section-heading">
          <p className="eyebrow">Projektmodell</p>
          <h2>Klare Phasen, klare Verantwortlichkeiten.</h2>
          <p>
            Du musst nicht raten, was gerade passiert. Jede Phase hat ein Ziel, einen Owner und ein
            nachvollziehbares Ergebnis.
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
            <h3>Kein Dokument ohne Anschlussfähigkeit.</h3>
            <ul className="home-deliverables-list">
              <li>Priorisierte Maßnahmenliste mit Wirkungs- und Aufwandslogik</li>
              <li>Konkrete Vorgaben für Design, Templates und interne Verlinkung</li>
              <li>Keyword- und Content-Struktur für die wichtigsten Seiten</li>
              <li>Reporting-Setup für Sichtbarkeit, Traffic und Anfragen</li>
            </ul>
            <div className="home-deliverables-note">
              <strong>Passend für:</strong> Unternehmen, die eine Website und Sichtbarkeit wollen,
              die wirklich zusammenspielen — ohne mehrere Dienstleister koordinieren zu müssen.
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-reporting">
        <div className="section-heading">
          <p className="eyebrow">Reporting</p>
          <h2>Wir reporten auf Zahlen, die Entscheidungen auslösen.</h2>
          <p>
            Statt zehn Dashboard-Seiten bekommst du einen klaren Blick auf Fortschritt, Risiken und
            die nächsten Schritte.
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
            &bdquo;Gute Arbeit fühlt sich im Alltag nicht nach Aktionismus an. Sie fühlt sich nach
            Klarheit an: Was wirkt, was blockiert — und was wir als Nächstes sauber umsetzen.&ldquo;
          </p>
          <footer>
            <Image
              src="/logos/nordpush-logo.svg"
              alt=""
              width={110}
              height={20}
              className="brand-logo brand-logo--invert"
            />
            <span>Marc Friedrich, NordPush</span>
          </footer>
        </blockquote>
      </section>

      <FAQAccordion
        heading="Noch Fragen? Wir schauen kurz gemeinsam drauf."
        items={homeFaqs}
        aside={
          <>
            <p>
              Lieber direkt sprechen statt scrollen? 30 Minuten, ohne Sales-Skript — wir hören zu,
              du entscheidest.
            </p>
            <Link href="/kontakt/" className="button primary" data-cta="faq">
              Erstgespräch anfragen
            </Link>
          </>
        }
      />

      <section className="home-refresh-cta home-refresh-cta--accent">
        <div className="home-refresh-cta-copy">
          <p className="eyebrow">Nächster Schritt</p>
          <h2>Jetzt kostenlose Ersteinschätzung anfragen — unverbindlich.</h2>
          <p>
            Egal ob neue Website, mehr Sichtbarkeit oder beides: Du bekommst eine ehrliche
            Einschätzung zu deiner Ausgangslage und den sinnvollsten nächsten Schritten — keine
            Verkaufspräsentation, kein Vertrag.
          </p>
        </div>

        <div className="home-refresh-cta-actions">
          <Link href="/kontakt/" className="button primary" data-cta="footer">
            Kostenlose Ersteinschätzung anfragen
          </Link>
          <p className="home-refresh-cta-microcopy">
            Antwort innerhalb 24 h · kein Vertrag · kein Sales-Druck
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
