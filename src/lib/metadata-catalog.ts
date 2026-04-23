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

// OG-Image-Override historisch über `sharedBrandOgImage` (wp-content-URL) war
// ein Migrationsartefakt. Seit dem Relaunch werden die OG-Images dynamisch
// von Next.js 15 generiert (siehe `src/app/opengraph-image.tsx` + pro-Route-
// Overrides). Wir filtern deshalb veraltete wp-content-URLs aus dem Legacy-
// Snapshot raus — das Next.js-generierte Bild wird stattdessen automatisch
// verwendet, wenn `record.ogImage` undefined ist.
function isUsableOgImage(url: string | undefined): url is string {
  if (!url) return false;
  if (url.includes("/wp-content/")) return false; // altes WordPress-Upload-Verzeichnis
  return true;
}

const ogImageByPath = new Map<string, string>();
for (const page of contentAssetManifest.pages) {
  const firstImage = page.assets.find((asset) => asset.assetType === "image")?.assetUrl;
  if (isUsableOgImage(firstImage)) {
    ogImageByPath.set(normalizePath(page.canonicalPath), firstImage);
  }
}

const metadataByPath = new Map<string, MetadataRecord>(
  metadataSnapshot.records.map((record) => {
    const canonicalPath = normalizePath(record.canonicalPath);
    const snapshotOgImage = ogImageByPath.get(canonicalPath);
    // Snapshot-ogImage aus record ebenfalls nur übernehmen, wenn sie usable ist.
    const ogImage = isUsableOgImage(snapshotOgImage) ? snapshotOgImage : undefined;
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
