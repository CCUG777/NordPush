import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/author-box";
import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { RichContentPage } from "@/components/rich-content-page";
import { blogSlugs, isBlogSlug } from "@/config/route-catalog";
import { getExtractedPage } from "@/data/extracted-pages";
import { getHeadingFor, getPageContent } from "@/lib/page-content";
import { buildPageMetadata } from "@/lib/seo";
import { buildPageSchemas } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return blogSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  if (!isBlogSlug(slug)) {
    return {};
  }

  // Fix truncated titles from the WordPress metadata snapshot — both of
  // these pages were imported with " -" trailing where the WP brand suffix
  // was lost. Force override with Sistrix-optimized values (<475 px).
  if (slug === "agentur") {
    return buildPageMetadata(
      "/agentur/",
      "SEO-Agentur aus Neumünster & DACH | NordPush",
      "NordPush ist die SEO-Agentur für Unternehmen mit Anspruch an Substanz. Strategie, Technik und Content aus einer Hand — aus Neumünster, für DACH.",
      { forceOverride: true },
    );
  }

  if (slug === "suchmaschinenoptimierung") {
    return buildPageMetadata(
      "/suchmaschinenoptimierung/",
      "Suchmaschinenoptimierung erklärt | NordPush",
      "SEO-Grundlagen verständlich erklärt: Wie Suchmaschinenoptimierung wirklich funktioniert, was sie kostet und wo der Einstieg gelingt. Von NordPush.",
      { forceOverride: true },
    );
  }

  return buildPageMetadata(`/${slug}/`, `Blog: ${slug}`);
}

export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isBlogSlug(slug)) {
    notFound();
  }
  const canonicalPath = `/${slug}/`;
  const heading = getHeadingFor(canonicalPath, `Blog ${slug}`);
  const extracted = getExtractedPage(canonicalPath);
  const useRich = Boolean(extracted && extracted.bodyTextLen > 150);

  const schemas = buildPageSchemas({
    canonicalPath,
    fallbackName: `Blog: ${slug}`,
    kind: "blog",
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
        />
      ) : (
        <ContentPage canonicalPath={canonicalPath} heading={heading} content={getPageContent(canonicalPath)} />
      )}
      <AuthorBox
        name="Julian Dreier"
        role="Content & OnPage-Spezialist"
        expertise={["Content-Qualität", "OnPage SEO", "SERP-Optimierung"]}
        note="Primärer redaktioneller Ansprechpartner für diese Themenseite."
      />
    </>
  );
}
