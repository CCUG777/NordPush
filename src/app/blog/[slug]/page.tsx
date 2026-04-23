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
        profileHref="/ueber-uns/"
        note="Primärer redaktioneller Ansprechpartner für diese Themenseite."
      />
    </>
  );
}
