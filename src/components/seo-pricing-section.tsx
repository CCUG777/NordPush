"use client";

import Link from "next/link";
import { useState } from "react";
import { seoRetainerTiers } from "@/data/seo-pricing";
import { starterBonus } from "@/data/website-pricing";

type Billing = "monthly" | "annual";

/**
 * Rendered on /preise/ via the `afterHero` slot. Mirrors the 3-Modell
 * structure from /websites/ for consistent buyer cognition:
 *
 *   Modell 1 · SEO-Einzelleistungen  → lives in the legacy WP body below
 *   Modell 2 · SEO-Abo               → THIS component (Retainer + Jahres-Toggle)
 *   Modell 3 · Bundle                → cross-link to /websites/#preise-bundle
 *
 * The billing toggle lets visitors compare monthly vs. annual pricing
 * without a page reload. Annual = 10 % off (cash-flow-positive for NordPush,
 * commitment-signal from the customer).
 */
export function SeoPricingSection() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section className="seo-pricing-section" aria-labelledby="seo-pricing-heading">
      <div className="seo-pricing-head">
        <p className="eyebrow">Modell 2 · SEO-Abo</p>
        <h2 id="seo-pricing-heading">
          Monatlich oder jährlich — mit 10 % Rabatt bei Jahresvorauszahlung.
        </h2>
        <p>
          Unsere SEO-Abos laufen als monatliches Retainer-Modell. Wer länger plant und Liquidität
          frei hat, bekommt 10 % Rabatt auf die Jahresvorauszahlung — das ist der häufigste Weg, wie
          etablierte Kunden mit uns arbeiten.
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

      <div className="billing-toggle" role="radiogroup" aria-label="Abrechnungsmodell wählen">
        <button
          type="button"
          role="radio"
          aria-checked={billing === "monthly"}
          className={`billing-toggle-option${billing === "monthly" ? " is-active" : ""}`}
          onClick={() => setBilling("monthly")}
        >
          Monatlich
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={billing === "annual"}
          className={`billing-toggle-option${billing === "annual" ? " is-active" : ""}`}
          onClick={() => setBilling("annual")}
        >
          Jährlich <span className="billing-toggle-badge">−10 %</span>
        </button>
      </div>

      <div className="websites-abo-grid">
        {seoRetainerTiers.map((tier) => (
          <article
            key={tier.id}
            id={`seo-abo-${tier.id}`}
            className={`websites-abo-card${tier.recommended ? " is-recommended" : ""}`}
          >
            {tier.recommended ? (
              <span className="websites-abo-badge" aria-label="Beliebtestes Paket">
                Beliebt
              </span>
            ) : null}

            <div className="websites-abo-card-head">
              <h3>{tier.title}</h3>
              <p className="websites-abo-rate">
                {/* The Enterprise tier already includes "ab" in its price string,
                    so we skip the prefix there to avoid "ab ab 6.900 €". */}
                {tier.monthlyRate.startsWith("ab ") ? null : (
                  <span className="websites-abo-rate-prefix">ab</span>
                )}
                <span className="websites-abo-rate-value">
                  {billing === "monthly" ? tier.monthlyRate : tier.annualRate}
                </span>
                <span className="websites-abo-rate-suffix">
                  {billing === "monthly" ? "/ Monat" : "/ Jahr"}
                </span>
              </p>
              <p className="websites-abo-term-pill">
                <span className="websites-abo-term-dot" aria-hidden="true" />
                {billing === "monthly" ? "6 Monate Mindestlaufzeit" : tier.annualSavings}
              </p>
              <p className="websites-abo-equivalent">{tier.audience}</p>
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

      <div className="seo-pricing-bundle-cta">
        <p className="eyebrow">Modell 3 · Bundle</p>
        <p>
          <strong>SEO + Website in einem monatlichen Paket.</strong> Wenn Launch und laufende
          SEO-Skalierung zusammen angegangen werden sollen, sparst du im Bundle rund 15 % und hast
          einen Ansprechpartner für beides.
        </p>
        <Link href="/websites/#preise-bundle" className="text-link">
          Bundle-Optionen auf /websites/ ansehen →
        </Link>
      </div>
    </section>
  );
}
