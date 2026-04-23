import Link from "next/link";
import { FAQAccordion } from "@/components/faq-accordion";
import { Hero } from "@/components/hero";
import type { PageContent } from "@/lib/page-content";

type ContentPageProps = {
  heading: string;
  canonicalPath: string;
  content: PageContent;
  headingLevel?: "h1" | "h2";
};

export function ContentPage({ heading, canonicalPath, content, headingLevel = "h1" }: ContentPageProps) {
  return (
    <article className="content-page" data-route-path={canonicalPath}>
      <Hero
        eyebrow={content.eyebrow}
        title={heading}
        description={content.heroDescription}
        primaryAction={{ href: "/kontakt/", label: "Kostenlose SEO-Analyse" }}
        secondaryAction={{ href: "/preise/", label: "Preise ansehen" }}
        proofBadge={content.proofBadge}
        stats={content.heroStats}
        headingLevel={headingLevel}
      />

      {content.problem ? (
        <section className="card problem-block" data-block="problem">
          <h2>{content.problem.heading}</h2>
          <ul className="problem-points">
            {content.problem.points.map((point) => (
              <li key={point}>
                <span aria-hidden="true" className="problem-bullet">
                  ✕
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="card deliverables-block" data-block="deliverables">
        <header className="deliverables-header">
          <p className="eyebrow">Deliverables</p>
          <h2>{content.deliverables.heading}</h2>
          {content.deliverables.intro ? <p>{content.deliverables.intro}</p> : null}
        </header>
        <div className="deliverables-grid">
          {content.deliverables.bullets.map((bullet) => (
            <article className="deliverable" key={bullet.title}>
              <h3>{bullet.title}</h3>
              <p>{bullet.body}</p>
            </article>
          ))}
        </div>
      </section>

      {content.process ? (
        <section className="card process-block" data-block="process">
          <header className="process-header">
            <p className="eyebrow">Prozess</p>
            <h2>{content.process.heading}</h2>
          </header>
          <ol className="process-steps">
            {content.process.steps.map((step, index) => (
              <li key={step.title}>
                <span className="process-step-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="process-step-label">{step.label}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {content.faqs.length > 0 ? <FAQAccordion heading="Häufige Fragen" items={content.faqs} /> : null}

      <section className="card final-cta" data-block="final-cta">
        <div>
          <p className="eyebrow">Nächster Schritt</p>
          <h2>{content.ctaHeading ?? "Bereit, mit uns zu starten?"}</h2>
          <p>{content.ctaBody ?? "Sprich direkt mit Marc Friedrich. 30 Minuten, kostenlos, ohne Verkaufsshow."}</p>
        </div>
        <div className="final-cta-actions">
          <Link href="/kontakt/" className="button primary">
            Kostenlose SEO-Analyse
          </Link>
        </div>
      </section>
    </article>
  );
}
