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
 *
 * Pre-cleans the body to drop WordPress hero-duplication artifacts that leak
 * into auto-extraction: leading <h4>/<p>/<a>/<h5> blocks that mirror the hero
 * itself, plus emoji-prefixed CTA links (✅/➡) and the "Vertraut von B2B-…"
 * proof-pill text. Without this pre-clean, the TL;DR rendered things like
 * "✅ Jetzt meine kostenlose SEO-Analyse anfragen Vertraut von B2B-Unternehmen
 * in ganz DACH Was ist SEO…" as a single bullet (visible in the rendered box
 * but stripped from the body via rich-body's enhance()).
 */
function autoTldr(lede: string, bodyHtml: string): string[] {
  const pts: string[] = [];
  const ledeClean = lede.trim();
  if (ledeClean) {
    const short = ledeClean.length > 140 ? ledeClean.slice(0, 137).replace(/\s+\S*$/, "") + "…" : ledeClean;
    pts.push(short);
  }

  // Strip the duplicated hero block (mirrors the rich-body enhance() rule).
  // This is the same regex used to remove it from the rendered body — we run
  // it here too so the TL;DR is generated from the same content the user
  // actually sees, not from leaked WordPress hero leftovers.
  const cleaned = bodyHtml.replace(
    /(<article>\s*(?:<header><\/header>)?\s*<div>)\s*<div>\s*<(?:h4|h5|p)>[\s\S]*?<a[^>]*>[\s\S]*?<\/a>\s*<h5>[^<]*<\/h5>\s*<\/div>/,
    "$1",
  );

  // Strip HTML tags, grab first few sentences from body
  const text = cleaned
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const ledeSig = ledeClean.slice(0, 30).toLowerCase();
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
  for (const s of sentences) {
    const t = s.trim();
    if (t.length < 30 || t.length > 180) continue;
    // Drop sentences that start with the same prefix as the lede — they're
    // duplicates of content already shown one box above.
    if (t.slice(0, 30).toLowerCase() === ledeSig) continue;
    // Drop sentences containing CTA-emoji or proof-pill leakage.
    if (/[✅➡🚀⭐👉]/u.test(t)) continue;
    if (/Vertraut von B2B-Unternehmen/i.test(t)) continue;
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
        primaryAction={{ href: "/kontakt/", label: "Kostenlose Ersteinschätzung" }}
        secondaryAction={
          canonicalPath === "/preise/"
            ? undefined
            : { href: "/preise/", label: "Leistungen & Preise ansehen" }
        }
        primaryMicrocopy="Antwort innerhalb 24 h · kein Vertrag · kein Sales-Druck"
        ctaScope="hero-rich"
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
              Jetzt kostenlose Ersteinschätzung anfragen — <em className="headline-italic">unverbindlich</em>.
            </h2>
            <p>
              30 Minuten, kein Sales-Skript — nur eine ehrliche Einschätzung deiner aktuellen Lage
              und konkrete nächste Schritte. Du entscheidest, ob es weitergeht.
            </p>
          </div>
          <div className="final-cta-actions">
            <Link href="/kontakt/" className="button primary" data-cta="rich-footer">
              <span>Kostenlose Ersteinschätzung anfragen</span>
            </Link>
            <p className="rich-final-microcopy">
              Antwort innerhalb 24 h · kein Vertrag · kein Sales-Druck
            </p>
          </div>
          <WaypointDivider className="rich-final-waypoint" variant="inverse" label="True North" />
        </section>
      ) : null}
    </article>
  );
}
