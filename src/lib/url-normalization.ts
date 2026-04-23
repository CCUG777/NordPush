export const SITE_URL = "https://nordpush.de";

function isFileLikePath(path: string): boolean {
  const segment = path.split("/").filter(Boolean).at(-1) ?? "";
  return segment.includes(".");
}

export function normalizePath(path: string, enforceTrailingSlash = true): string {
  if (!path || path === "/") {
    return "/";
  }

  const [rawPath] = path.split(/[?#]/, 1);
  const withLeadingSlash = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const compacted = withLeadingSlash.replace(/\/{2,}/g, "/");

  if (!enforceTrailingSlash || compacted === "/" || isFileLikePath(compacted)) {
    return compacted;
  }

  return compacted.endsWith("/") ? compacted : `${compacted}/`;
}

export function toAbsoluteUrl(pathOrUrl: string, enforceTrailingSlash = true): string {
  if (!pathOrUrl) {
    return SITE_URL;
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  if (pathOrUrl.startsWith("//")) {
    return `https:${pathOrUrl}`;
  }

  return new URL(normalizePath(pathOrUrl, enforceTrailingSlash), SITE_URL).toString();
}
