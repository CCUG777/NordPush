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

  // Three service pages inherited overly-long titles from the WordPress
  // snapshot that get truncated by Google's SERP pixel limit (~475 px).
  // We force-override with Sistrix-optimized variants.
  const pixelSafeTitleOverrides: Record<string, { title: string; description: string }> = {
    "seo-audit": {
      title: "SEO-Audit: Sichtbarkeit & Leads | NordPush",
      description:
        "Technisches und inhaltliches SEO-Audit deiner Website. Prioritäten, Quick Wins und umsetzbare Maßnahmen — ab 1.499 €. Von NordPush.",
    },
    "keyword-recherche": {
      title: "Keyword-Recherche für SEO | NordPush",
      description:
        "Professionelle Keyword-Recherche mit Profi-Tools: Suchvolumen, Intent, Konkurrenzdichte und Mapping zu deinen Seitentypen. Ab 1.199 €.",
    },
    "seo-monitoring": {
      title: "SEO-Monitoring für KMU | NordPush",
      description:
        "SEO-Monitoring mit klarem Reporting: Rankings, Sichtbarkeit, Wettbewerb und Quick Wins. Transparent, regelmäßig, entscheidungsreif.",
    },
  };

  const override = pixelSafeTitleOverrides[slug];
  if (override) {
    return buildPageMetadata(`/${slug}/`, override.title, override.description, {
      forceOverride: true,
    });
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

  // FAQ-Schema muss auch dann gebaut werden, wenn die Seite über den
  // ContentPage-Fallback gerendert wird (keine WordPress-Extraktion, dafür
  // Hand-Content aus page-content.ts). Sonst fehlt auf diesen Seiten das
  // FAQPage-Schema — SEO-Audit #10 (z.B. /wordpress-seo/).
  const contentPageFaqs = useRich ? [] : (getPageContent(canonicalPath).faqs ?? []);
  const faqs = useRich && extracted ? extracted.faqs : contentPageFaqs;
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
