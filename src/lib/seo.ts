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

  // Next.js merges file-based OG images (opengraph-image.tsx) into metadata
  // ONLY when `openGraph.images` is absent. If we set `images: undefined`
  // explicitly, Next.js treats that as an intentional override and omits the
  // og:image tag entirely. So we build openGraph / twitter objects without
  // the `images` key when we have no snapshot URL, letting the file-based
  // fallback kick in.
  const openGraph: Metadata["openGraph"] = {
    type: "website",
    url: toAbsoluteUrl(resolvedCanonicalPath),
    title: ogTitle,
    description: ogDescription,
  };
  const twitter: Metadata["twitter"] = {
    card: "summary_large_image",
    title: ogTitle,
    description: ogDescription,
  };
  if (ogImage) {
    openGraph.images = [{ url: ogImage }];
    twitter.images = [ogImage];
  }

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: resolvedCanonicalPath,
    },
    openGraph,
    twitter,
    robots: {
      index: true,
      follow: true,
    },
  };
}
