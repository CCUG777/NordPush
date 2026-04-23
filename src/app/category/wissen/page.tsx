import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import { blogSlugs } from "@/config/route-catalog";
import { getMetadataRecord } from "@/lib/metadata-catalog";
import { buildPageMetadata } from "@/lib/seo";
import { buildPageSchemas } from "@/lib/structured-data";

export const metadata = buildPageMetadata("/category/wissen/", "Wissen & Insights – SEO Tipps von NordPush");

type BlogCardData = {
  slug: string;
  href: string;
  title: string;
  description: string;
};

const titleFallback: Record<string, string> = {
  agentur: "Agentur-Insights",
  "etsy-seo": "Etsy SEO",
  "seo-bamberg": "SEO Bamberg",
  "seo-neumuenster": "SEO Neumünster",
  "seo-sachsen": "SEO Sachsen",
  suchmaschinenoptimierung: "Suchmaschinenoptimierung: Grundlagen",
};

const descriptionFallback: Record<string, string> = {
  agentur:
    "Wie arbeitet eine moderne SEO-Agentur? Prozesse, Tools und Skills – auf den Punkt gebracht.",
  "etsy-seo":
    "Wie funktioniert Etsy SEO? Keywords, Listings, Tags und Sichtbarkeit – der Praxis-Guide für Shop-Betreiber.",
  "seo-bamberg":
    "Lokale SEO für Bamberg, Forchheim und Erlangen: Bamberg-first-Ansatz für mehr qualifizierte Anfragen aus Oberfranken.",
  "seo-neumuenster":
    "Lokale SEO-Strategie für Unternehmen in Neumünster und Schleswig-Holstein – von NordPush aus der Region.",
  "seo-sachsen":
    "Lokale SEO in Leipzig, Dresden und Chemnitz: Strategien, Städte-Cluster und B2B-Fokus für Sachsen.",
  suchmaschinenoptimierung:
    "Was ist SEO heute? Starter-Guide zu OnPage, OffPage, Technik, E-E-A-T und Generative Search.",
};

function collectBlogCards(): BlogCardData[] {
  return blogSlugs.map((slug) => {
    const canonicalPath = `/${slug}/`;
    const record = getMetadataRecord(canonicalPath);
    const rawTitle = record?.title?.trim() ?? "";
    // Strip trailing site-brand suffix (" | NordPush" / " - NordPush") and bare dangling separators.
    const cleanTitle = rawTitle
      .split(/ [|–-] /u)[0]
      .replace(/\s+[|–-]\s*$/u, "")
      .trim();
    const title = cleanTitle || titleFallback[slug] || slug;
    const description =
      record?.metaDescription?.trim() || descriptionFallback[slug] || "";
    return {
      slug,
      href: canonicalPath,
      title,
      description,
    };
  });
}

export default function WissenCategoryPage() {
  const canonicalPath = "/category/wissen/";
  const schemas = buildPageSchemas({
    canonicalPath,
    fallbackName: "Wissen",
    kind: "blog_category",
  });
  const cards = collectBlogCards();

  return (
    <SiteShell sectionLabel="Blog" breadcrumbs={[{ href: "/category/wissen/", label: "Wissen" }]}>
      <JsonLd schemas={schemas} />
      <article className="content-page" data-route-path={canonicalPath}>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Wissen</p>
            <h1>Wissen & Insights</h1>
            <p>
              Entdecke praxisnahe SEO-Strategien, aktuelle Trends und wertvolles Know-how für deinen nachhaltigen
              Online-Erfolg mit NordPush.
            </p>
          </div>
        </section>

        <section className="service-cards" data-block="blog-listing" aria-label="Blog-Artikel">
          {cards.map((card) => (
            <article className="service-card" key={card.slug}>
              <div className="service-card-body">
                <h3>{card.title}</h3>
                {card.description ? <p>{card.description}</p> : null}
                <div className="service-card-actions">
                  {/* aria-label makes each link's accessible name unique
                      — fixes CLI-Audit #15 (a11y-link-text: 6× identical
                      "Artikel lesen →" was flagged as duplicate link text). */}
                  <Link href={card.href} className="text-link" aria-label={`Artikel lesen: ${card.title}`}>
                    Artikel lesen →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </article>
    </SiteShell>
  );
}
