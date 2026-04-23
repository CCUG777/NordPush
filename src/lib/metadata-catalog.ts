import metadataSnapshotJson from "../../artifacts/latest/metadata_snapshot.json";
import contentAssetManifestJson from "../../artifacts/latest/content_asset_manifest.json";
import { normalizePath } from "@/lib/url-normalization";

type PageType =
  | "homepage"
  | "service"
  | "local_seo"
  | "blog_or_other"
  | "blog_category"
  | "info_legal_or_conversion"
  | "about_or_author";

type MetadataSnapshotRecord = {
  recordId: string;
  canonicalUrl: string;
  canonicalPath: string;
  sourceUrl: string;
  pageType: PageType;
  title?: string | null;
  metaDescription?: string | null;
  h1?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  hasFaqSchema: boolean;
  hasBreadcrumbSchema: boolean;
  fetched: boolean;
};

type MetadataSnapshot = {
  records: MetadataSnapshotRecord[];
};

type ContentAssetRecord = {
  canonicalPath: string;
  assets: {
    assetUrl: string;
    assetType: string;
  }[];
};

type ContentAssetManifest = {
  pages: ContentAssetRecord[];
};

export type MetadataRecord = MetadataSnapshotRecord & {
  ogImage?: string;
};

const metadataSnapshot = metadataSnapshotJson as MetadataSnapshot;
const contentAssetManifest = contentAssetManifestJson as ContentAssetManifest;

const sharedBrandOgImage = "https://nordpush.de/wp-content/uploads/2025/04/image-5-1024x956.png";

// Approved in NOR-14 so migration parity can proceed without page-unique creatives.
const ogImageOverridesByPath = new Map<string, string>([
  ["/agentur/", sharedBrandOgImage],
  ["/suchmaschinenoptimierung/", sharedBrandOgImage],
]);

const ogImageByPath = new Map<string, string>();
for (const page of contentAssetManifest.pages) {
  const firstImage = page.assets.find((asset) => asset.assetType === "image")?.assetUrl;
  if (firstImage) {
    ogImageByPath.set(normalizePath(page.canonicalPath), firstImage);
  }
}

const metadataByPath = new Map<string, MetadataRecord>(
  metadataSnapshot.records.map((record) => {
    const canonicalPath = normalizePath(record.canonicalPath);
    const ogImage = ogImageOverridesByPath.get(canonicalPath) ?? ogImageByPath.get(canonicalPath);
    return [
      canonicalPath,
      {
        ...record,
        canonicalPath,
        ogImage,
      },
    ];
  }),
);

export function getMetadataRecord(canonicalPath: string): MetadataRecord | undefined {
  return metadataByPath.get(normalizePath(canonicalPath));
}

export function toCanonicalPath(slug: string): string {
  return normalizePath(slug);
}
