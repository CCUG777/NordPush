import type { Metadata } from "next";
import { getCanonicalRecord } from "@/lib/canonical-catalog";
import { getMetadataRecord } from "@/lib/metadata-catalog";
import { SITE_URL, normalizePath, toAbsoluteUrl } from "@/lib/url-normalization";

function resolveTitle(path: string, fallbackTitle: string): string {
  const record = getMetadataRecord(path);
  return record?.title?.trim() || fallbackTitle;
}

function resolveCanonicalPath(path: string): string {
  const normalized = normalizePath(path);
  const canonicalRecord = getCanonicalRecord(normalized);
  return canonicalRecord?.canonicalPath ?? normalized;
}

type BuildPageMetadataOptions = {
  /** When true, `fallbackTitle` / `fallbackDescription` win over the legacy
   *  WordPress metadata snapshot. Used for pages whose scope has changed
   *  post-relaunch (e.g. /preise/ now also covers Website-Projekte). */
  forceOverride?: boolean;
};

export function buildPageMetadata(
  canonicalPath: string,
  fallbackTitle: string,
  fallbackDescription?: string,
  options?: BuildPageMetadataOptions,
): Metadata {
  const resolvedCanonicalPath = resolveCanonicalPath(canonicalPath);
  const record = getMetadataRecord(resolvedCanonicalPath);
  const override = options?.forceOverride === true;
  const title = override ? fallbackTitle : resolveTitle(resolvedCanonicalPath, fallbackTitle);
  const ogImage = record?.ogImage;
  const description = override
    ? (fallbackDescription ?? "Migration scaffold page for phased parity implementation.")
    : record?.metaDescription ??
      fallbackDescription ??
      "Migration scaffold page for phased parity implementation.";
  const ogDescription = override ? description : record?.ogDescription ?? description;
  const ogTitle = override ? title : record?.ogTitle ?? title;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: resolvedCanonicalPath,
    },
    openGraph: {
      type: "website",
      url: toAbsoluteUrl(resolvedCanonicalPath),
      title: ogTitle,
      description: ogDescription,
      // When undefined, Next.js falls back to the generated
      // `src/app/opengraph-image.tsx` (and per-route overrides), so we always
      // ship a 1200x630 image even if no record.ogImage is set.
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      // Always large card: either a Snapshot-ogImage or the auto-generated
      // `twitter-image.tsx` delivers the 1200x630 asset.
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
