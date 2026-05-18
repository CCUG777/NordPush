import Link from "next/link";
import { notFound } from "next/navigation";
import { AgbContent } from "@/components/agb-content";
import { ContactForm } from "@/components/contact-form";
import { ContentPage } from "@/components/content-page";
import { FAQAccordion } from "@/components/faq-accordion";
import { ImpressumContent } from "@/components/impressum-content";
import { JsonLd } from "@/components/json-ld";
import { PaketFinder } from "@/components/paket-finder";
import { RichContentPage } from "@/components/rich-content-page";
import { SeoPricingSection } from "@/components/seo-pricing-section";
import { SiteShell } from "@/components/site-shell";
import { WebsitePricingTeaser } from "@/components/website-pricing-teaser";
import {
  allLegalLikeSlugs,
  isLegalLikeSlug,
  legalSlugs,
} from "@/config/route-catalog";
import { getExtractedPage } from "@/data/extracted-pages";
import { getHeadingFor, getPageContent } from "@/lib/page-content";
import { buildPageMetadata } from "@/lib/seo";
import { buildPageSchemas } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return allLegalLikeSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  if (!isLegalLikeSlug(slug)) {
    return {};
  }

  // /preise/ now covers both SEO pricing and Website-project pricing. The
  // legacy WordPress snapshot only mentions SEO, so we force the new
  // Sistrix-optimized meta values that reflect the expanded scope.
  if (slug === "preise") {
    return buildPageMetadata(
      "/preise/",
      "SEO- & Website-Preise transparent | NordPush",
      "SEO-Retainer ab 1.200 €, Websites ab 4.900 €, Audit ab 299 €. Transparent, kein Baukasten — Substanz statt Show.",
      { forceOverride: true },
    );
  }

  // /agb/ is a post-relaunch route — no snapshot record exists, so we pass
  // the Sistrix-tuned meta explicitly.
  if (slug === "agb") {
    return buildPageMetadata(
      "/agb/",
      "AGB — Allgemeine Geschäftsbedingungen | NordPush",
      "Allgemeine Geschäftsbedingungen der Common Consulting UG (NordPush). Für B2B-Kunden. Inklusive Klauseln zu Website-Abo, SEO-Retainer und Bundle-Laufzeiten.",
      { forceOverride: true },
    );
  }

  return buildPageMetadata(`/${slug}/`, `Info: ${slug}`);
}

// Schema `name`/`headline` must match a visible element on the page — otherwise
// SEOmator / Google flag it as "schema drift" (CLI-Audit #16). Pages like /agb/,
// /kontakt/ and /preise/ have no WordPress metadata snapshot, so without this
// map the generic `Info: ${slug}` fallback leaked into the JSON-LD and didn't
// match any visible H1. We map slug → a short topic label that's guaranteed
// to appear in the visible content (H1, breadcrumb, or eyebrow).
const schemaNameBySlug: Record<string, string> = {
  agb: "Allgemeine Geschäftsbedingungen",
  impressum: "Impressum",
  datenschutz: "Datenschutzerklärung",
  // Must match the visible H1 exactly (line ~128 below) — otherwise
  // SEOmator flags name/headline drift against the visible content.
  kontakt: "Lass uns über dein SEO sprechen.",
  preise: "Preise",
};

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isLegalLikeSlug(slug)) {
    notFound();
  }
  const canonicalPath = `/${slug}/`;
  const heading = getHeadingFor(canonicalPath, `Info ${slug}`);
  const extracted = getExtractedPage(canonicalPath);
  const useRich = Boolean(extracted && extracted.bodyTextLen > 150);

  const schemas = buildPageSchemas({
    canonicalPath,
    fallbackName: schemaNameBySlug[slug] ?? `Info: ${slug}`,
    kind: "legal",
    faqs: useRich && extracted ? extracted.faqs : [],
  });

  // Hide the "Bereit für mehr Sichtbarkeit?" CTA on pure legal pages to keep them clean
  const hideFinalCta =
    canonicalPath === "/impressum/" || canonicalPath === "/datenschutz/" || canonicalPath === "/agb/";
  const isContact = canonicalPath === "/kontakt/";
  const isPreise = canonicalPath === "/preise/";
  const isAgb = canonicalPath === "/agb/";
  const isImpressum = canonicalPath === "/impressum/";
  const isLegalPage = (legalSlugs as readonly string[]).includes(slug);

  // Legal pages live under the "Legal" section with a breadcrumb back to Impressum.
  // Conversion pages (/kontakt/, /preise/) are top-level entry points — no section
  // label, no breadcrumbs (they shouldn't read as Legal sub-pages).
  const shellProps = isLegalPage
    ? { sectionLabel: "Legal", breadcrumbs: [{ href: "/impressum/", label: "Legal" }] }
    : {};

  if (isContact) {
    const contactFaqs = [
      { question: "Wie läuft das Erstgespräch ab?", answer: "Kurzes Gespräch via Google Meet. Du erzählst, woran du arbeitest und wo es hakt. Wir stellen Fragen, geben erste Impulse und halten fest, ob ein Mandat sinnvoll wäre." },
      { question: "Muss ich schon vorab Unterlagen schicken?", answer: "Nicht zwingend. Hilfreich: URL der Website, Analytics-Screenshot der letzten 12 Monate, ggf. Search Console. Wir lernen dich aber auch ohne Vorbereitung kennen." },
      { question: "Was kostet das Erstgespräch?", answer: "Nichts. Die ersten 30 Minuten sind komplett kostenlos und unverbindlich. Danach entscheidest du, ob es weitergeht." },
      { question: "Wie schnell bekomme ich eine Antwort?", answer: "Innerhalb von 24 Stunden an Werktagen — meistens deutlich schneller. Bei dringenden Anliegen schreib gerne direkt an info@nordpush.de." },
    ];

    return (
      <SiteShell {...shellProps}>
        <JsonLd schemas={schemas} />

        {/* Form-first hero — above the fold, zero scrolling to convert */}
        <section className="contact-hero" data-ux-slot="ContactHero">
          <div className="contact-grid">
            <div className="contact-info">
              <h1>Lass uns über dein SEO sprechen.</h1>
              <p className="contact-lede">
                Kein Pitch. Wir hören zu, stellen die richtigen Fragen und sagen dir ehrlich, ob
                und wie wir helfen können.
              </p>

              {/* Trust signals as plain microcopy, mirroring the CTA microcopy
                  pattern used across hero/footer CTAs. Previously two filled
                  purple pills that looked tappable but weren't — visual-review
                  finding #6. */}
              <p className="contact-proof-microcopy">
                Antwort innerhalb 24&#160;h · kostenlos &amp; unverbindlich · kein Sales-Druck
              </p>

              <div className="contact-channels">
                <div className="contact-channel">
                  <span className="contact-channel-label">E-Mail</span>
                  <a href="mailto:info@nordpush.de">info@nordpush.de</a>
                </div>
                <div className="contact-channel">
                  <span className="contact-channel-label">Standort</span>
                  <span>Biberweg 6, 24539 Neumünster</span>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </section>

        {/* Demarcation: free initial conversation vs. paid Quick-Audit deliverable.
            Pre-empts the "is the free analysis the same as the 299 € audit?"
            confusion that the homepage CTA copy can otherwise trigger. */}
        <section className="contact-tiers" aria-labelledby="contact-tiers-heading">
          <div className="section-heading section-heading--compact">
            <p className="eyebrow">Was du bekommst</p>
            <h2 id="contact-tiers-heading">Kostenlos sprechen oder mit Dokument loslegen.</h2>
            <p>
              Damit klar ist, was im Erstgespräch passiert und wo ein bezahltes Audit beginnt —
              ohne Erwartung-Mismatch.
            </p>
          </div>
          <div className="contact-tiers-grid">
            <article className="contact-tier-card contact-tier-card--free">
              <p className="contact-tier-eyebrow">Kostenlos · 30 Min</p>
              <h3>Erstgespräch &amp; erste Einschätzung</h3>
              <ul>
                <li>Gemeinsamer Blick auf deine wichtigsten URLs, Rankings und die größten Bremsen</li>
                <li>Ehrliche Einschätzung, ob &amp; wo SEO sinnvoll wäre — keine Verkaufspräsentation</li>
                <li>Konkrete erste Impulse, die du auch ohne Mandat umsetzen kannst</li>
              </ul>
              <p className="contact-tier-note">Kein schriftliches Dokument · keine Vertragsbindung</p>
            </article>
            <article className="contact-tier-card contact-tier-card--paid">
              <p className="contact-tier-eyebrow">Ab 299 € · einmalig</p>
              <h3>SEO-Quick-Audit (schriftliches Dokument)</h3>
              <ul>
                <li>Strukturierte technische und inhaltliche Sichtung mit priorisierten Maßnahmen</li>
                <li>Dokumentierte Empfehlungen, intern an Dev oder Marketing weiterleitbar</li>
                <li>Bei Retainer-Buchung innerhalb 4 Wochen wird der Audit voll angerechnet</li>
              </ul>
              <p className="contact-tier-note">
                <Link href="/preise/" className="text-link">
                  Details auf der Preisseite <span aria-hidden="true">→</span>
                </Link>
              </p>
            </article>
          </div>
        </section>

        {/* Compact FAQ below fold — for hesitant visitors who need more info */}
        <FAQAccordion
          heading="Häufige Fragen vor dem Erstgespräch"
          items={contactFaqs}
          aside={
            <>
              <p>
                Noch unsicher? Schreib uns einfach — kein Vertrieb, nur eine ehrliche
                Einschätzung. Antwort in der Regel innerhalb von 24 Stunden.
              </p>
              <a href="mailto:info@nordpush.de" className="button">
                info@nordpush.de
              </a>
            </>
          }
        />
      </SiteShell>
    );
  }

  if (isAgb) {
    return (
      <SiteShell {...shellProps}>
        <JsonLd schemas={schemas} />
        <AgbContent />
      </SiteShell>
    );
  }

  if (isImpressum) {
    return (
      <SiteShell {...shellProps}>
        <JsonLd schemas={schemas} />
        <ImpressumContent />
      </SiteShell>
    );
  }

  return (
    <SiteShell {...shellProps}>
      <JsonLd schemas={schemas} />
      {useRich && extracted ? (
        <RichContentPage
          canonicalPath={canonicalPath}
          heading={heading}
          heroLede={extracted.heroLede}
          bodyHtml={extracted.bodyHtml}
          faqs={extracted.faqs}
          showFinalCta={!hideFinalCta}
          afterHero={
            isPreise ? (
              <>
                <PaketFinder />
                <WebsitePricingTeaser />
                <SeoPricingSection />
              </>
            ) : null
          }
        />
      ) : (
        <ContentPage canonicalPath={canonicalPath} heading={heading} content={getPageContent(canonicalPath)} />
      )}
    </SiteShell>
  );
}
