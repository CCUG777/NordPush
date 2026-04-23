import Link from "next/link";
import { starterBonus, websitePricingTiers } from "@/data/website-pricing";

/**
 * Compact website-pricing block for /preise/ — surfaces the same prices that
 * live on /websites/ so visitors who click "Preise" get the full catalog
 * without leaving the page. Details (cases, process, FAQ) stay on /websites/
 * to avoid content duplication and drift.
 */
export function WebsitePricingTeaser() {
  return (
    <section className="pricing-teaser-websites" aria-labelledby="pricing-teaser-websites-heading">
      <div className="pricing-teaser-head">
        <p className="eyebrow">Website-Projekte</p>
        <h2 id="pricing-teaser-websites-heading">
          Websites, Shops &amp; Landingpages aus einer Hand
        </h2>
        <p>
          Richtwerte für unsere gängigsten Projekttypen. Scope, Prozess und Referenzen findest du
          in der ausführlichen{" "}
          <Link href="/websites/" className="text-link">
            Website-Übersicht
          </Link>
          .
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

      <div className="pricing-teaser-grid">
        {websitePricingTiers.map((tier) => (
          <article key={tier.title} className="pricing-teaser-card">
            <p className="pricing-teaser-value">{tier.value}</p>
            <h3>{tier.title}</h3>
            <p>{tier.body}</p>
          </article>
        ))}
      </div>

      <p className="pricing-teaser-abo-hint">
        Auch als monatliches Abo verfügbar — Landingpage ab <strong>229 €/Monat</strong>,
        Website ab <strong>479 €/Monat</strong>, Shop ab <strong>699 €/Monat</strong>. Hosting
        und Wartung inklusive. Oder als{" "}
        <Link href="/websites/#preise-bundle" className="text-link">
          Website + SEO Bundle
        </Link>
        {" "}ab 1.199 €/Monat.
      </p>

      <p className="pricing-teaser-footer">
        <Link href="/websites/#preise" className="text-link">
          Alle Modelle (Cash / Abo / Bundle) je Projekttyp ansehen →
        </Link>
      </p>
    </section>
  );
}
