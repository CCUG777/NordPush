import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/author-box";
import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { RichContentPage } from "@/components/rich-content-page";
import { allServiceLikeSlugs, isLocalSeoSlug, isServiceLikeSlug } from "@/config/route-catalog";
import { getExtractedPage } from "@/data/extracted-pages";
import { getHeadingFor, getPageContent } from "@/lib/page-content";
import { buildPageMetadata } from "@/lib/seo";
import { buildPageSchemas } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return allServiceLikeSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  if (!isServiceLikeSlug(slug)) {
    return {};
  }

  return buildPageMetadata(`/${slug}/`, `Service: ${slug}`);
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;

  if (!isServiceLikeSlug(slug)) {
    notFound();
  }

  const canonicalPath = `/${slug}/`;
  const heading = getHeadingFor(canonicalPath, `SEO ${slug}`);
  const extracted = getExtractedPage(canonicalPath);
  const useRich = Boolean(extracted && extracted.bodyTextLen > 150);

  const faqs = useRich && extracted ? extracted.faqs : [];
  const schemas = buildPageSchemas({
    canonicalPath,
    fallbackName: isLocalSeoSlug(slug) ? `Local SEO: ${slug}` : `Service: ${slug}`,
    kind: isLocalSeoSlug(slug) ? "local" : "service",
    faqs,
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
        name="Lukas Ehrk"
        role="Technisches SEO & UX"
        expertise={["Technisches SEO", "Content-Migration", "Conversion-Orientierung"]}
        profileHref="/ueber-uns/"
        note="Qualitätssicherung und fachliche Freigabe für diese Service-Seite."
      />
    </>
  );
}
