import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/author-box";
import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { RichContentPage } from "@/components/rich-content-page";
import { authorSlugs, isAuthorSlug } from "@/config/route-catalog";
import { getExtractedPage } from "@/data/extracted-pages";
import { getHeadingFor, getPageContent } from "@/lib/page-content";
import { buildPageMetadata } from "@/lib/seo";
import { buildPageSchemas } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return authorSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  if (!isAuthorSlug(slug)) {
    return {};
  }

  return buildPageMetadata(`/${slug}/`, `Author: ${slug}`);
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isAuthorSlug(slug)) {
    notFound();
  }
  const canonicalPath = `/${slug}/`;
  const heading = getHeadingFor(canonicalPath, "Über uns");
  const extracted = getExtractedPage(canonicalPath);
  const useRich = Boolean(extracted && extracted.bodyTextLen > 150);

  const schemas = buildPageSchemas({
    canonicalPath,
    fallbackName: `Author: ${slug}`,
    kind: "author",
    faqs: useRich && extracted ? extracted.faqs : [],
  });

  return (
    <>
      <JsonLd schemas={schemas} />
      {useRich && extracted ? (
        <RichContentPage
          canonicalPath={canonicalPath}
          heading={heading}
          heroLede={extracted.heroLede}
          bodyHtml={extracted.bodyHtml}
          faqs={extracted.faqs}
          showFinalCta={false}
        />
      ) : (
        <ContentPage canonicalPath={canonicalPath} heading={heading} content={getPageContent(canonicalPath)} />
      )}
      <section className="team-section card" data-block="team">
        <header>
          <p className="eyebrow">Team</p>
          <h2>Das steckt hinter NordPush</h2>
        </header>
        <div className="team-grid">
          <AuthorBox
            name="Marc Friedrich"
            role="Gründer · Key-Account Manager"
            expertise={["Account Strategy", "Kundenbetreuung", "SEO-Projektsteuerung"]}
            note="Dein erster Ansprechpartner für Strategie, Scope und Zusammenarbeit."
          />
          <AuthorBox
            name="Lukas Ehrk"
            role="Technisches SEO & UX"
            expertise={["Technisches SEO", "Core Web Vitals", "Conversion-orientierte IA"]}
            note="Verantwortet Technik-Audits, Rendering und Relaunch-Begleitung."
          />
          <AuthorBox
            name="Julian Dreier"
            role="Content & OnPage-Spezialist"
            expertise={["Content-Qualität", "OnPage SEO", "SERP-Optimierung"]}
            note="Entwickelt Redaktionspläne und führt OnPage-Reviews."
          />
        </div>
      </section>
    </>
  );
}
