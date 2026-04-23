import { getBlogDates } from "@/data/blog-dates";
import { getMetadataRecord } from "@/lib/metadata-catalog";
import { SITE_URL, normalizePath, toAbsoluteUrl } from "@/lib/url-normalization";

type SchemaKind = "homepage" | "service" | "local" | "blog" | "blog_category" | "legal" | "author";

export type JsonLdSchema = Record<string, unknown>;

type BuildPageSchemasOptions = {
  canonicalPath: string;
  fallbackName: string;
  kind: SchemaKind;
  faqs?: readonly FaqEntry[];
};

type FaqEntry = {
  question: string;
  answer: string;
};

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

// Keep this catalog explicit to avoid publishing guessed FAQ content.
const faqEntriesByPath: Record<string, readonly FaqEntry[]> = {};

const nordpushTeam = [
  {
    slug: "marc-friedrich",
    name: "Marc Friedrich",
    jobTitle: "Key-Account Manager",
  },
  {
    slug: "lukas-ehrk",
    name: "Lukas Ehrk",
    jobTitle: "Technisches SEO & UX",
  },
  {
    slug: "julian-dreier",
    name: "Julian Dreier",
    jobTitle: "Content & OnPage-Spezialist",
  },
] as const;

function buildOrganizationSchema(): JsonLdSchema {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: "NordPush",
    url: SITE_URL,
    email: "info@nordpush.de",
    telephone: "+49-171-3117971",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Biberweg 6",
      postalCode: "24539",
      addressLocality: "Neumünster",
      addressCountry: "DE",
    },
  };
}

function buildWebsiteSchema(): JsonLdSchema {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: SITE_URL,
    name: "NordPush",
    publisher: {
      "@id": organizationId,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?s={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function buildBreadcrumbSchema(canonicalPath: string, pageName: string): JsonLdSchema | null {
  const normalized = normalizePath(canonicalPath);
  if (normalized === "/") {
    return null;
  }

  return {
    "@type": "BreadcrumbList",
    "@id": `${toAbsoluteUrl(normalized)}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Start",
        item: toAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: toAbsoluteUrl(normalized),
      },
    ],
  };
}

function buildFaqSchema(canonicalPath: string, runtimeFaqs?: readonly FaqEntry[]): JsonLdSchema | null {
  const normalized = normalizePath(canonicalPath);
  const catalogEntries = faqEntriesByPath[normalized];
  const entries = runtimeFaqs && runtimeFaqs.length > 0 ? runtimeFaqs : catalogEntries;

  if (!entries || entries.length === 0) {
    return null;
  }

  return {
    "@type": "FAQPage",
    "@id": `${toAbsoluteUrl(normalized)}#faq`,
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

function resolvePageName(canonicalPath: string, fallbackName: string): string {
  const record = getMetadataRecord(canonicalPath);
  return record?.h1?.trim() || record?.title?.trim() || fallbackName;
}

function resolveDescription(canonicalPath: string): string | undefined {
  const record = getMetadataRecord(canonicalPath);
  return record?.metaDescription?.trim() || undefined;
}

function buildServiceSchema(canonicalPath: string, fallbackName: string): JsonLdSchema {
  const pageName = resolvePageName(canonicalPath, fallbackName);
  return {
    "@type": "Service",
    "@id": `${toAbsoluteUrl(canonicalPath)}#service`,
    name: pageName,
    serviceType: "Search Engine Optimization",
    url: toAbsoluteUrl(canonicalPath),
    description: resolveDescription(canonicalPath),
    provider: {
      "@id": organizationId,
    },
    areaServed: "DE",
  };
}

function buildLocalBusinessSchema(canonicalPath: string, fallbackName: string): JsonLdSchema {
  const pageName = resolvePageName(canonicalPath, fallbackName);
  return {
    "@type": "LocalBusiness",
    "@id": `${toAbsoluteUrl(canonicalPath)}#local-business`,
    name: pageName,
    url: toAbsoluteUrl(canonicalPath),
    description: resolveDescription(canonicalPath),
    telephone: "+49-171-3117971",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Biberweg 6",
      postalCode: "24539",
      addressLocality: "Neumünster",
      addressCountry: "DE",
    },
  };
}

function buildArticleSchema(canonicalPath: string, fallbackName: string): JsonLdSchema {
  const pageName = resolvePageName(canonicalPath, fallbackName);
  const dates = getBlogDates(canonicalPath);
  const schema: JsonLdSchema = {
    "@type": "Article",
    "@id": `${toAbsoluteUrl(canonicalPath)}#article`,
    headline: pageName,
    description: resolveDescription(canonicalPath),
    mainEntityOfPage: toAbsoluteUrl(canonicalPath),
    author: {
      "@id": organizationId,
    },
    publisher: {
      "@id": organizationId,
    },
  };
  // datePublished is required by Google for Article rich results.
  // dateModified + image are recommended fields (CLI audit finding #11).
  if (dates) {
    schema.datePublished = dates.datePublished;
    schema.dateModified = dates.dateModified;
    if (dates.image) {
      schema.image = dates.image;
    }
  }
  return schema;
}

function buildCollectionPageSchema(canonicalPath: string, fallbackName: string): JsonLdSchema {
  const pageName = resolvePageName(canonicalPath, fallbackName);
  return {
    "@type": "CollectionPage",
    "@id": `${toAbsoluteUrl(canonicalPath)}#collection`,
    name: pageName,
    description: resolveDescription(canonicalPath),
    url: toAbsoluteUrl(canonicalPath),
  };
}

function buildLegalPageSchema(canonicalPath: string, fallbackName: string): JsonLdSchema {
  const pageName = resolvePageName(canonicalPath, fallbackName);
  return {
    "@type": "WebPage",
    "@id": `${toAbsoluteUrl(canonicalPath)}#webpage`,
    name: pageName,
    description: resolveDescription(canonicalPath),
    url: toAbsoluteUrl(canonicalPath),
    isPartOf: {
      "@id": websiteId,
    },
  };
}

function buildOfferSchema(canonicalPath: string): JsonLdSchema {
  return {
    "@type": "Offer",
    "@id": `${toAbsoluteUrl(canonicalPath)}#offer`,
    url: toAbsoluteUrl(canonicalPath),
    offeredBy: {
      "@id": organizationId,
    },
  };
}

function buildAuthorSchemas(canonicalPath: string, fallbackName: string): JsonLdSchema[] {
  if (normalizePath(canonicalPath) === "/ueber-uns/") {
    return [
      buildOrganizationSchema(),
      ...nordpushTeam.map((member) => ({
        "@type": "Person",
        "@id": `${SITE_URL}/ueber-uns/${member.slug}/#person`,
        name: member.name,
        jobTitle: member.jobTitle,
        worksFor: {
          "@id": organizationId,
        },
      })),
    ];
  }

  return [
    {
      "@type": "ProfilePage",
      "@id": `${toAbsoluteUrl(canonicalPath)}#profile`,
      name: resolvePageName(canonicalPath, fallbackName),
      description: resolveDescription(canonicalPath),
      isPartOf: {
        "@id": websiteId,
      },
    },
  ];
}

export function buildPageSchemas({ canonicalPath, fallbackName, kind, faqs }: BuildPageSchemasOptions): JsonLdSchema[] {
  const normalizedPath = normalizePath(canonicalPath);
  const schemas: JsonLdSchema[] = [];

  if (kind === "homepage") {
    schemas.push(buildOrganizationSchema(), buildWebsiteSchema());
    const faqSchema = buildFaqSchema(normalizedPath, faqs);
    if (faqSchema) {
      schemas.push(faqSchema);
    }
    return schemas;
  }

  const pageName = resolvePageName(normalizedPath, fallbackName);
  const breadcrumbSchema = buildBreadcrumbSchema(normalizedPath, pageName);
  if (breadcrumbSchema) {
    schemas.push(breadcrumbSchema);
  }

  switch (kind) {
    case "service":
      schemas.push(buildServiceSchema(normalizedPath, fallbackName));
      break;
    case "local":
      schemas.push(buildServiceSchema(normalizedPath, fallbackName));
      schemas.push(buildLocalBusinessSchema(normalizedPath, fallbackName));
      break;
    case "blog":
      schemas.push(buildArticleSchema(normalizedPath, fallbackName));
      break;
    case "blog_category":
      schemas.push(buildCollectionPageSchema(normalizedPath, fallbackName));
      break;
    case "legal":
      schemas.push(buildLegalPageSchema(normalizedPath, fallbackName));
      if (normalizedPath === "/preise/") {
        schemas.push(buildOfferSchema(normalizedPath));
      }
      break;
    case "author":
      schemas.push(...buildAuthorSchemas(normalizedPath, fallbackName));
      break;
    default:
      break;
  }

  const faqSchema = buildFaqSchema(normalizedPath, faqs);
  if (faqSchema) {
    schemas.push(faqSchema);
  }

  return schemas;
}
