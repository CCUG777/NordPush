import Link from "next/link";
import type { ReactNode } from "react";
import { AuroraField } from "@/components/aurora-field";
import { FAQAccordion } from "@/components/faq-accordion";
import { Hero } from "@/components/hero";
import { RichBody } from "@/components/rich-body";
import { TLDRBox } from "@/components/tldr-box";
import { WaypointDivider } from "@/components/waypoint-divider";
import type { ExtractedFaq } from "@/data/extracted-pages";

type RichContentPageProps = {
  canonicalPath: string;
  heading: string;
  eyebrow?: string;
  heroLede: string;
  bodyHtml: string;
  faqs?: ExtractedFaq[];
  headingLevel?: "h1" | "h2";
  showFinalCta?: boolean;
  /** Optional content rendered between the hero and the rich body — used e.g.
   *  on /preise/ to surface the Website pricing teaser without breaking the
   *  H1-before-H2 heading order of the page. */
  afterHero?: ReactNode;
};

/**
 * Auto-generate a 3-point TL;DR from the hero lede + first two sentences of body.
 * Falls back gracefully when content is sparse.
 */
function autoTldr(lede: string, bodyHtml: string): string[] {
  const pts: string[] = [];
  const ledeClean = lede.trim();
  if (ledeClean) {
    const short = ledeClean.length > 140 ? ledeClean.slice(0, 137).replace(/\s+\S*$/, "") + "…" : ledeClean;
    pts.push(short);
  }

  // Strip HTML tags, grab first few sentences from body
  const text = bodyHtml
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
  for (const s of sentences) {
    const t = s.trim();
    if (t.length < 30 || t.length > 180) continue;
    if (pts.length >= 3) break;
    if (pts.some((p) => p.slice(0, 20) === t.slice(0, 20))) continue;
    pts.push(t);
  }

  return pts.slice(0, 3);
}

function estimateReadingTime(bodyHtml: string): string {
  const text = bodyHtml.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} Min. Lesezeit`;
}

export function RichContentPage({
  canonicalPath,
  heading,
  eyebrow,
  heroLede,
  bodyHtml,
  faqs = [],
  headingLevel = "h1",
  showFinalCta = true,
  afterHero,
}: RichContentPageProps) {
  const tldrPoints = autoTldr(heroLede, bodyHtml);
  const readingTime = estimateReadingTime(bodyHtml);

  return (
    <article className="content-page rich-page" data-route-path={canonicalPath}>
      <Hero
        eyebrow={eyebrow ?? "NordPush"}
        title={heading}
        description={heroLede}
        primaryAction={{ href: "/kontakt/", label: "Kostenlose SEO-Analyse" }}
        secondaryAction={{ href: "/preise/", label: "Preise ansehen" }}
        headingLevel={headingLevel}
      />

      {afterHero}

      {bodyHtml ? (
        <section className="card rich-section" data-block="rich-content">
          {tldrPoints.length > 0 ? <TLDRBox points={tldrPoints} readingTime={readingTime} /> : null}
          <RichBody html={bodyHtml} />
        </section>
      ) : null}

      {faqs.length > 0 ? <FAQAccordion heading="Häufige Fragen" items={faqs} /> : null}

      {showFinalCta ? (
        <section className="card final-cta rich-final-cta" data-block="final-cta">
          <AuroraField className="cta-aurora" variant="dark" />
          <div>
            <p className="eyebrow">Nächster Schritt</p>
            <h2>
              Bereit für <em className="headline-italic">mehr Sichtbarkeit</em>?
            </h2>
            <p>
              Buche dir ein kostenloses SEO-Gespräch. 30 Minuten, kein Pitch – nur eine ehrliche Einschätzung
              deiner aktuellen Lage und klare nächste Schritte.
            </p>
          </div>
          <div className="final-cta-actions">
            <Link href="/kontakt/" className="button primary">
              <span>Kostenlose SEO-Analyse</span>
            </Link>
          </div>
          <WaypointDivider className="rich-final-waypoint" variant="inverse" label="True North" />
        </section>
      ) : null}
    </article>
  );
}
