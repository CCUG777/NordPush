"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { seoRetainerTiers } from "@/data/seo-pricing";
import {
  bundleTiers,
  starterBonus,
  websiteAboTiers,
  websitePricingTiers,
} from "@/data/website-pricing";

/**
 * Paket-Finder — interactive package configurator on /preise/.
 *
 * Pulls all numeric prices from the existing pricing data files
 * (website-pricing.ts, seo-pricing.ts) by parsing the human-readable
 * rate strings. When the data files change, the Rechner picks the
 * change up automatically on the next build. Single source of truth.
 *
 * Starter-Bonus is applied as a 30 % discount on the headline price
 * (matches starterBonus.body: '30 % Rabatt auf das Cash-Volumen oder
 * auf die ersten 12 Monatsraten'). The strike-through always shows
 * the gross price so the discount remains visible.
 */

type Need = "website" | "seo" | "both";
type WebsiteTier = "landingpage" | "starter" | "wordpress" | "nextjs" | "shop" | "custom";
type WebsiteBilling = "abo" | "cash";
type SeoTier = "starter" | "wachstum" | "skalierung" | "enterprise";
type SeoBilling = "monthly" | "annual";

type State = {
  need: Need;
  websiteTier: WebsiteTier;
  websiteBilling: WebsiteBilling;
  seoTier: SeoTier;
  seoBilling: SeoBilling;
};

const DEFAULT_STATE: State = {
  need: "website",
  websiteTier: "landingpage",
  websiteBilling: "abo",
  seoTier: "starter",
  seoBilling: "monthly",
};

const BONUS = 0.3;
const applyBonus = (n: number) => Math.round(n * (1 - BONUS));
const fmt = (n: number) => n.toLocaleString("de-DE");

/** Parse '1.200 €' / 'ab 6.900 €' / 'ab 199 €' → 1200, 6900, 199. */
function parseEuro(s: string): number {
  const m = s.replace(/\./g, "").match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

// ---------------------------------------------------------------
// Price tables — parsed from the live data so the Rechner stays
// in sync with the cards rendered directly below it.
// ---------------------------------------------------------------

const websiteCashByTier: Record<WebsiteTier, { label: string; cash: number | null }> = {
  landingpage: { label: lookupCashLabel("Landingpage"), cash: parseCashByTitle("Landingpage") },
  starter:     { label: lookupCashLabel("Starter Website"), cash: parseCashByTitle("Starter Website") },
  wordpress:   { label: lookupCashLabel("WordPress-Website"), cash: parseCashByTitle("WordPress-Website") },
  nextjs:      { label: lookupCashLabel("Next.js Premium"), cash: parseCashByTitle("Next.js Premium") },
  shop:        { label: lookupCashLabel("Online-Shop"), cash: parseCashByTitle("Online-Shop") },
  custom:      { label: "Individuelles Projekt", cash: null },
};

const websiteAboByTier: Record<Exclude<WebsiteTier, "custom">, number> = {
  landingpage: parseAboByTitle("Landingpage-Abo"),
  starter:     parseAboByTitle("Starter-Abo"),
  wordpress:   parseAboByTitle("Website-Abo"),
  nextjs:      parseAboByTitle("Next.js-Premium-Abo"),
  shop:        parseAboByTitle("Online-Shop-Abo"),
};

const seoByTier: Record<SeoTier, { label: string; monthly: number; annual: number | null }> = {
  starter:    parseSeoTier("starter"),
  wachstum:   parseSeoTier("wachstum"),
  skalierung: parseSeoTier("skalierung"),
  enterprise: parseSeoTier("enterprise"),
};

// Bundle map: only website-abo + monthly SEO with matching tier combos
const bundleMap: Partial<Record<string, { name: string; price: number; savings: number }>> = {
  "landingpage|starter":  parseBundleByTitle("Start-Bundle"),
  "wordpress|wachstum":   parseBundleByTitle("Wachstum-Bundle"),
  "shop|skalierung":      parseBundleByTitle("Skalierung-Bundle"),
};

function lookupCashLabel(title: string): string {
  return websitePricingTiers.find((t) => t.title === title)?.title ?? title;
}
function parseCashByTitle(title: string): number {
  const t = websitePricingTiers.find((x) => x.title === title);
  return t ? parseEuro(t.value) : 0;
}
function parseAboByTitle(title: string): number {
  const t = websiteAboTiers.find((x) => x.title === title);
  return t ? parseEuro(t.rate) : 0;
}
function parseSeoTier(id: SeoTier) {
  const t = seoRetainerTiers.find((x) => x.id === id);
  if (!t) return { label: id, monthly: 0, annual: null };
  return {
    label: "SEO-" + t.title,
    monthly: parseEuro(t.monthlyRate),
    annual: t.annualRate.toLowerCase().includes("ab") ? null : parseEuro(t.annualRate),
  };
}
function parseBundleByTitle(title: string) {
  const b = bundleTiers.find((x) => x.title === title);
  if (!b) return undefined;
  return {
    name: b.title,
    price: parseEuro(b.rate),
    savings: parseEuro(b.savingsBadge.replace("–", "").replace("-", "").replace("%", "")),
  };
}

// ---------------------------------------------------------------
// Component
// ---------------------------------------------------------------

export function PaketFinder() {
  const [state, setState] = useState<State>(DEFAULT_STATE);

  const showWebsite = state.need === "website" || state.need === "both";
  const showSeo = state.need === "seo" || state.need === "both";
  const isCustom = showWebsite && state.websiteTier === "custom";
  const isEnterprise = showSeo && state.seoTier === "enterprise";

  // Renumber visible step labels dynamically
  const stepNums = useMemo(() => {
    const steps: Record<string, number> = {};
    let n = 1;
    steps.need = n++;
    if (showWebsite) {
      steps.websiteSize = n++;
      if (!isCustom) steps.websiteBilling = n++;
    }
    if (showSeo) {
      steps.seoSize = n++;
      steps.seoBilling = n++;
    }
    return steps;
  }, [showWebsite, showSeo, isCustom]);

  const computed = useMemo(() => compute(state), [state]);

  const ctaHref = buildCtaHref(state);

  return (
    <section className="paket-finder" aria-labelledby="rechner-heading">
      <div className="paket-finder-inner">
        {/* HERO */}
        <div className="paket-finder-hero">
          <p className="eyebrow">Paket-Finder · 30 Sekunden</p>
          <h2 id="rechner-heading">Dein Setup in 30 Sekunden — ehrlich kalkuliert.</h2>
          <p className="paket-finder-lede">
            Wähle, was du brauchst — du bekommst sofort eine realistische Größenordnung.
            Verbindliches Angebot folgt nach einem 30-Min-Erstgespräch.
          </p>
          <ul className="paket-finder-trust">
            <li><span className="tick" aria-hidden="true">✓</span> Erstgespräch kostenfrei</li>
            <li><span className="tick" aria-hidden="true">✓</span> Antwort &lt; 24 h</li>
            <li><span className="tick" aria-hidden="true">✓</span> Im ersten Jahr monatlich kündbar</li>
          </ul>
        </div>

        {/* Starter-Bonus Banner */}
        <aside className="paket-finder-bonus" aria-label="Starter-Bonus für Referenzkunden">
          <span className="badge">−30 % Starter-Bonus</span>
          <p className="text">
            <strong>Wir wählen die nächsten Referenz-Projekte aus.</strong>{" "}
            {starterBonus.body.replace(/Wir wählen in den kommenden Monaten 5 Projekte aus, die wir als öffentliche Case Study zeigen dürfen — und geben dafür 30 % Rabatt auf das Cash-Volumen oder auf die ersten 12 Monatsraten\.\s*/, "")}
          </p>
          <span className="slots">
            <span className="dot" aria-hidden="true" /> 3 / 5 Plätze frei
          </span>
        </aside>

        {/* STEP 1 — Need */}
        <Step num={stepNums.need} topic="" title="Was brauchst du gerade?">
          <Segments
            group="need"
            value={state.need}
            onChange={(v) => setState((s) => ({ ...s, need: v as Need }))}
            options={[
              { value: "website", label: "Neue Website", sub: "Launch oder Relaunch — ohne SEO" },
              { value: "seo",     label: "Nur SEO",       sub: "Website existiert — Sichtbarkeit fehlt" },
              { value: "both",    label: "Beides",        sub: "Website + laufendes SEO", pill: "Bundle" },
            ]}
          />
        </Step>

        {/* STEP 2 — Website tier */}
        {showWebsite && (
          <Step num={stepNums.websiteSize} topic="Website" title="Welcher Website-Umfang passt?">
            <Segments
              group="website-tier"
              grid
              value={state.websiteTier}
              onChange={(v) => setState((s) => ({ ...s, websiteTier: v as WebsiteTier }))}
              options={[
                { value: "landingpage", label: "Landingpage",       sub: "1 Seite, 1 Ziel — z. B. Kampagnen-Launch" },
                { value: "starter",     label: "Starter-Website",   sub: "3–5 Seiten — die klassische Visitenkarte" },
                { value: "wordpress",   label: "WordPress-Website", sub: "Bis ~15 Seiten, eigenes Theme, Blog", pill: "Beliebt" },
                { value: "nextjs",      label: "Next.js Premium",   sub: "Performance-Fokus, kopfloses CMS" },
                { value: "shop",        label: "Online-Shop",       sub: "WooCommerce oder Shopify, SEO-bereit" },
                { value: "custom",      label: "Individuelles Projekt", sub: "Marktplatz, mehrsprachig, komplexe Integrationen" },
              ]}
            />
          </Step>
        )}

        {/* STEP 3 — Website billing */}
        {showWebsite && !isCustom && (
          <Step num={stepNums.websiteBilling} topic="Bezahl-Modell" title="Wie willst du deine Website abrechnen?">
            <Toggle
              group="website-billing"
              value={state.websiteBilling}
              onChange={(v) => setState((s) => ({ ...s, websiteBilling: v as WebsiteBilling }))}
              options={[
                { value: "abo", label: "Im Monats-Abo" },
                { value: "cash", label: "Einmalig kaufen" },
              ]}
            />
            <p className="paket-finder-step-note">
              <strong>Du wählst ein Modell — nicht beides.</strong> Im Abo läuft Hosting, Wartung,
              Updates &amp; SSL mit. Einmal-Kauf bedeutet: dir gehört der Code, Hosting buchst du separat.
            </p>
          </Step>
        )}

        {/* STEP 4 — SEO tier */}
        {showSeo && (
          <Step num={stepNums.seoSize} topic="SEO" title="Welche SEO-Größenordnung?">
            <Segments
              group="seo-tier"
              grid
              value={state.seoTier}
              onChange={(v) => setState((s) => ({ ...s, seoTier: v as SeoTier }))}
              options={[
                { value: "starter",    label: "SEO-Starter",    sub: "Kleinbetriebe — strukturierter Einstieg" },
                { value: "wachstum",   label: "SEO-Wachstum",   sub: "Etabliertes KMU — sichtbares Monats-Volumen", pill: "Beliebt" },
                { value: "skalierung", label: "SEO-Skalierung", sub: "Wachstumsphase — Content & Links breit aufstellen" },
                { value: "enterprise", label: "SEO-Enterprise", sub: "Multi-Brand, internationale Konzerne — auf Anfrage" },
              ]}
            />
          </Step>
        )}

        {/* STEP 5 — SEO billing (nicht bei Enterprise — der ist immer „auf Anfrage") */}
        {showSeo && !isEnterprise && (
          <Step num={stepNums.seoBilling} topic="SEO-Abrechnung" title="Monatlich oder jährlich?">
            <Toggle
              group="seo-billing"
              value={state.seoBilling}
              onChange={(v) => setState((s) => ({ ...s, seoBilling: v as SeoBilling }))}
              options={[
                { value: "monthly", label: "Monatlich" },
                { value: "annual",  label: "Jährlich", suffix: "−10 %" },
              ]}
            />
            <p className="paket-finder-step-note">
              Jahres-Voraus zahlt sich aus, wenn du dir sicher bist — minimal flexibler bist du monatlich.
            </p>
          </Step>
        )}

        {/* RESULT */}
        <div
          className={
            "paket-finder-result" +
            (computed.hasBundle ? " has-bundle" : "") +
            (isCustom || isEnterprise ? " is-custom" : "")
          }
          aria-live="polite"
        >
          <div className="paket-finder-result-head">
            <p className="eyebrow">Deine Schätzung</p>
            {!isCustom && !isEnterprise && (
              <span className="bonus-applied">
                <span className="bonus-dot" aria-hidden="true">✓</span> Starter-Bonus angewendet
              </span>
            )}
          </div>

          {(isCustom || isEnterprise) && (
            <div className="paket-finder-custom-banner">
              <p className="label">{isEnterprise ? "Enterprise" : "Individuelles Projekt"}</p>
              <h3 className="headline">Klingt nach einem Scope-Gespräch.</h3>
              <p>
                {isEnterprise
                  ? "Multi-Brand, mehrsprachige Inhalte und internationale Strategie kalkulieren wir individuell — abhängig von Markt-Anzahl, Brand-Setup und dediziertem Team-Bedarf."
                  : "Marktplätze, Mehrsprachigkeit oder komplexe Integrationen klären wir am liebsten direkt am Whiteboard — Umfang und Preis ergeben sich aus deinen konkreten Anforderungen."}{" "}
                Der Erstgespräch-Termin ist trotzdem kostenfrei.
              </p>
            </div>
          )}

          {!isCustom && !isEnterprise && (
            <>
              <div className="paket-finder-hero-price">
                <span className="prefix">ab</span>
                <span className="amount">{fmt(computed.heroNet)}</span>
                <span className="suffix">{computed.heroSuffix}</span>
                <span className="strike">{computed.strike}</span>
              </div>

              <p
                className="paket-finder-summary"
                dangerouslySetInnerHTML={{ __html: computed.summary }}
              />

              {computed.secondary && (
                <div className="paket-finder-secondary">
                  <p className="secondary-label">Einmalige Investition</p>
                  <span className="amount2">{computed.secondary.amount}</span>
                  <span className="strike2">{computed.secondary.strike}</span>
                  <span className="label2">{computed.secondary.label}</span>
                </div>
              )}

              {computed.breakdown.length > 0 && (
                <div className="paket-finder-breakdown">
                  {computed.breakdown.map((row, i) => (
                    <div className="row" key={i}>
                      <span dangerouslySetInnerHTML={{ __html: row.left }} />
                      <span dangerouslySetInnerHTML={{ __html: row.right }} />
                    </div>
                  ))}
                </div>
              )}

              {computed.bundleHint && (
                <div className="paket-finder-bundle-hint">
                  <span className="icon" aria-hidden="true">→</span>
                  <div dangerouslySetInnerHTML={{ __html: computed.bundleHint }} />
                </div>
              )}
            </>
          )}

          <p className="paket-finder-micro">
            Grobe Schätzung auf Basis der „ab"-Preise. Finaler Umfang &amp; Festpreis kommen nach deinem
            30-Min-Erstgespräch — kein Sales-Druck, kein Vertrag erforderlich.
          </p>

          <div className="paket-finder-actions">
            <Link href={ctaHref} className="button primary" data-cta="rechner-cta">
              Kostenfreies Erstgespräch sichern <span aria-hidden="true">→</span>
            </Link>
            <div className="paket-finder-actions-trust">
              <span><span className="tick" aria-hidden="true">✓</span> Antwort &lt; 24 h</span>
              <span><span className="tick" aria-hidden="true">✓</span> Kein Vertrag</span>
              <span><span className="tick" aria-hidden="true">✓</span> Kein Sales-Druck</span>
            </div>
          </div>

          <div className="paket-finder-reset-row">
            <button
              type="button"
              className="paket-finder-reset-link"
              onClick={() => setState(DEFAULT_STATE)}
            >
              Auswahl zurücksetzen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------

function Step({
  num,
  topic,
  title,
  children,
}: {
  num: number;
  topic: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="paket-finder-step">
      <p className="step-label">
        <span className="step-num">Schritt {num}</span>
        {topic ? <span> · {topic}</span> : null}
      </p>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

type SegmentOption = { value: string; label: string; sub: string; pill?: string };

function Segments({
  group,
  value,
  onChange,
  options,
  grid = false,
}: {
  group: string;
  value: string;
  onChange: (v: string) => void;
  options: SegmentOption[];
  grid?: boolean;
}) {
  return (
    <div
      className={"paket-finder-segments" + (grid ? " grid-options" : "")}
      data-group={group}
      role="radiogroup"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          className="paket-finder-segment"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          data-value={opt.value}
        >
          {opt.label}
          <small>{opt.sub}</small>
          {opt.pill ? <span className="pill-tag">{opt.pill}</span> : null}
        </button>
      ))}
    </div>
  );
}

type ToggleOption = { value: string; label: string; suffix?: string };

function Toggle({
  group,
  value,
  onChange,
  options,
}: {
  group: string;
  value: string;
  onChange: (v: string) => void;
  options: ToggleOption[];
}) {
  return (
    <div className="paket-finder-toggle" data-group={group} role="radiogroup">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
          {opt.suffix ? <small>{opt.suffix}</small> : null}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------
// Pricing logic
// ---------------------------------------------------------------

type Computed = {
  heroNet: number;
  heroSuffix: string;
  strike: string;
  summary: string;
  secondary: { amount: string; strike: string; label: string } | null;
  breakdown: { left: string; right: string }[];
  bundleHint: string | null;
  hasBundle: boolean;
};

function compute(s: State): Computed {
  const showWebsite = s.need === "website" || s.need === "both";
  const showSeo = s.need === "seo" || s.need === "both";
  const isCustom = showWebsite && s.websiteTier === "custom";
  const isEnterprise = showSeo && s.seoTier === "enterprise";

  const empty: Computed = {
    heroNet: 0,
    heroSuffix: "",
    strike: "",
    summary: "",
    secondary: null,
    breakdown: [],
    bundleHint: null,
    hasBundle: false,
  };
  if (isCustom || isEnterprise) return empty;

  // CASE 1: Nur Website
  if (showWebsite && !showSeo) {
    const tier = s.websiteTier as Exclude<WebsiteTier, "custom">;
    const meta = websiteCashByTier[tier];
    if (s.websiteBilling === "cash") {
      const cash = meta.cash ?? 0;
      const net = applyBonus(cash);
      return {
        heroNet: net,
        heroSuffix: "€ einmalig",
        strike: `statt ${fmt(cash)} € · 30 % Starter-Bonus`,
        summary: `<strong>${meta.label}</strong> als Festpreis-Projekt. Der Bonus gilt einmalig auf den Projektpreis. Hosting buchst du frei extern.`,
        secondary: null,
        breakdown: [],
        bundleHint: null,
        hasBundle: false,
      };
    }
    const abo = websiteAboByTier[tier];
    const net = applyBonus(abo);
    return {
      heroNet: net,
      heroSuffix: "€ / Monat",
      strike: `statt ${fmt(abo)} € / Mon · −30 % erste 12 Monate`,
      summary: `<strong>${meta.label}-Abo</strong> — Hosting, Wartung, Updates &amp; SSL laufen mit. 24 Mon Mindestlaufzeit, danach monatlich kündbar.`,
      secondary: null,
      breakdown: [],
      bundleHint: null,
      hasBundle: false,
    };
  }

  // CASE 2: Nur SEO
  if (showSeo && !showWebsite) {
    const meta = seoByTier[s.seoTier];
    const isAnnual = s.seoBilling === "annual" && meta.annual !== null;
    const monthly = isAnnual ? Math.round((meta.annual as number) / 12) : meta.monthly;
    const net = applyBonus(monthly);
    return {
      heroNet: net,
      heroSuffix: "€ / Monat",
      strike: `statt ${fmt(monthly)} € / Mon · −30 % erste 12 Monate`,
      summary: `<strong>${meta.label}-Retainer.</strong> ${
        isAnnual
          ? `Jahres-Voraus mit 10 % Rabatt (≈ ${fmt(monthly)} € / Mon). `
          : "Monatlich abgerechnet. "
      }3 Monate Mindestlaufzeit, danach monatlich kündbar.`,
      secondary: null,
      breakdown: [],
      bundleHint: null,
      hasBundle: false,
    };
  }

  // CASE 3: Beides
  if (showWebsite && showSeo) {
    const wt = s.websiteTier as Exclude<WebsiteTier, "custom">;
    const seoMeta = seoByTier[s.seoTier];
    const isAnnualSeo = s.seoBilling === "annual" && seoMeta.annual !== null;
    const seoMonthly = isAnnualSeo
      ? Math.round((seoMeta.annual as number) / 12)
      : seoMeta.monthly;

    const key = `${wt}|${s.seoTier}`;
    const bundle = bundleMap[key];
    const bundleEligible =
      bundle !== undefined && s.websiteBilling === "abo" && s.seoBilling === "monthly";

    if (bundleEligible && bundle) {
      const aboPrice = websiteAboByTier[wt];
      const bundleNet = applyBonus(bundle.price);
      const single = aboPrice + seoMonthly;
      return {
        heroNet: bundleNet,
        heroSuffix: "€ / Monat",
        strike: `statt ${fmt(bundle.price)} € / Mon · −30 % erste 12 Monate`,
        summary: `<strong>${bundle.name}</strong> — Website-Abo + SEO-Retainer in einem Paket. Du sparst ${bundle.savings} % gegenüber Einzelbuchung, dazu kommt der Starter-Bonus.`,
        secondary: null,
        breakdown: [
          { left: `${websiteCashByTier[wt].label}-Abo (einzeln)`, right: `${fmt(aboPrice)} € / Mon` },
          { left: `${seoMeta.label} (einzeln)`, right: `${fmt(seoMonthly)} € / Mon` },
          { left: `<strong>Bundle-Vorteil (${bundle.savings} %)</strong>`, right: `−${fmt(single - bundle.price)} € / Mon` },
          { left: `<strong>Starter-Bonus (30 %, erste 12 Mon)</strong>`, right: `−${fmt(bundle.price - bundleNet)} € / Mon` },
          { left: `<strong>Effektiv im ersten Jahr</strong>`, right: `<strong>${fmt(bundleNet)} € / Mon</strong>` },
        ],
        bundleHint: null,
        hasBundle: true,
      };
    }

    if (s.websiteBilling === "abo") {
      const aboPrice = websiteAboByTier[wt];
      const combinedGross = aboPrice + seoMonthly;
      const combinedNet = applyBonus(combinedGross);
      let bundleHint: string | null = null;
      if (bundle && s.seoBilling === "annual") {
        bundleHint =
          `<p><strong>Spar-Tipp:</strong> Für genau diese Kombi gibt es das <strong>${bundle.name} ab ${fmt(bundle.price)} € / Mon</strong> — Bundles laufen monatlich.</p>` +
          `<p>Wechsle SEO-Abrechnung auf „Monatlich", um das Bundle freizuschalten (etwa ${bundle.savings} % unter Einzelbuchung).</p>`;
      } else if (!bundle) {
        bundleHint =
          `<p><strong>Hinweis:</strong> Für diese Tier-Kombi gibt es kein Standard-Bundle.</p>` +
          `<p>Im Erstgespräch klären wir, ob wir eine individuelle Paketierung schnüren — wir bündeln Website + SEO auch außerhalb der Standard-Bundles, wenn die Größenordnung passt.</p>`;
      }
      return {
        heroNet: combinedNet,
        heroSuffix: "€ / Monat",
        strike: `statt ${fmt(combinedGross)} € / Mon · −30 % erste 12 Monate`,
        summary: `<strong>${websiteCashByTier[wt].label}-Abo + ${seoMeta.label}.</strong> Eine monatliche Rechnung, beide Leistungen drin. Bonus läuft 12 Monate.`,
        secondary: null,
        breakdown: [
          { left: `${websiteCashByTier[wt].label}-Abo`, right: `${fmt(aboPrice)} € / Mon` },
          { left: `${seoMeta.label}${isAnnualSeo ? " (jährl., ≈)" : ""}`, right: `${fmt(seoMonthly)} € / Mon` },
          { left: `<strong>Starter-Bonus (30 %, erste 12 Mon)</strong>`, right: `−${fmt(combinedGross - combinedNet)} € / Mon` },
          { left: `<strong>Effektiv im ersten Jahr</strong>`, right: `<strong>${fmt(combinedNet)} € / Mon</strong>` },
        ],
        bundleHint,
        hasBundle: bundleHint !== null,
      };
    }

    // Beides, Website CASH + SEO laufend
    const cash = websiteCashByTier[wt].cash ?? 0;
    const cashNet = applyBonus(cash);
    const seoNet = applyBonus(seoMonthly);
    let bundleHint: string | null = null;
    if (bundle) {
      bundleHint =
        `<p><strong>Tipp:</strong> Wenn du flexibel bei Hosting/Wartung bist, packt das <strong>${bundle.name} ab ${fmt(bundle.price)} € / Mon</strong> Website + SEO in eine Monatsrechnung — ohne große Einmal-Summe.</p>` +
        `<p>Wechsle das Bezahl-Modell auf „Im Monats-Abo", um diese Variante zu sehen.</p>`;
    }
    return {
      heroNet: seoNet,
      heroSuffix: "€ / Monat",
      strike: `statt ${fmt(seoMonthly)} € / Mon · −30 % erste 12 Monate`,
      summary: `<strong>${seoMeta.label}-Retainer</strong> als laufender Posten. Die Website kommt einmalig oben drauf — siehe unten.`,
      secondary: {
        amount: `ab ${fmt(cashNet)} €`,
        strike: `(statt ${fmt(cash)} €)`,
        label: `— einmalige Investition in deine ${websiteCashByTier[wt].label}. Bonus angewendet.`,
      },
      breakdown: [
        { left: `${websiteCashByTier[wt].label} (einmalig, vor Bonus)`, right: `${fmt(cash)} €` },
        { left: `<strong>Starter-Bonus 30 % auf Projektpreis</strong>`, right: `<strong>−${fmt(cash - cashNet)} €</strong>` },
        { left: `${seoMeta.label}${isAnnualSeo ? " (jährl., ≈/Mon)" : " (monatl.)"}`, right: `${fmt(seoMonthly)} € / Mon` },
        { left: `<strong>Starter-Bonus 30 % auf erste 12 Mon-Raten</strong>`, right: `<strong>−${fmt(seoMonthly - seoNet)} € / Mon</strong>` },
      ],
      bundleHint,
      hasBundle: bundleHint !== null,
    };
  }

  return empty;
}

function buildCtaHref(s: State): string {
  const showWebsite = s.need === "website" || s.need === "both";
  const showSeo = s.need === "seo" || s.need === "both";
  const parts: string[] = [`need=${s.need}`];
  if (showWebsite) parts.push(`web=${s.websiteTier}/${s.websiteBilling}`);
  if (showSeo) parts.push(`seo=${s.seoTier}/${s.seoBilling}`);
  parts.push("bonus=starter30");
  return `/kontakt/?config=${encodeURIComponent(parts.join("&"))}`;
}
