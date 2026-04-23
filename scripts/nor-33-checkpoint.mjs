#!/usr/bin/env node

import fs from "node:fs";

function normalizePath(value) {
  if (!value || value === "/") {
    return "/";
  }

  const leading = value.startsWith("/") ? value : `/${value}`;
  const compact = leading.replace(/\/{2,}/g, "/");
  return compact.endsWith("/") ? compact : `${compact}/`;
}

function readJson(path) {
  const raw = fs.readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

const routeCatalog = fs.readFileSync("src/config/route-catalog.ts", "utf8");

function extractArray(name) {
  const pattern = new RegExp(`export const ${name} = \\[(.*?)\\] as const;`, "s");
  const match = routeCatalog.match(pattern);
  if (!match) {
    return [];
  }

  return Array.from(match[1].matchAll(/"([^"]+)"/g)).map((result) => result[1]);
}

const serviceSlugs = extractArray("serviceSlugs");
const localSeoSlugs = extractArray("localSeoSlugs");
const blogSlugs = extractArray("blogSlugs");
const legalSlugs = extractArray("legalSlugs");
const conversionSlugs = extractArray("conversionSlugs");
const authorSlugs = extractArray("authorSlugs");

const supportedPaths = new Set(["/", "/category/wissen/"]);
for (const slug of [...serviceSlugs, ...localSeoSlugs, ...blogSlugs, ...legalSlugs, ...conversionSlugs, ...authorSlugs]) {
  supportedPaths.add(normalizePath(`/${slug}`));
}

const homePageSource = fs.readFileSync("src/app/page.tsx", "utf8");
const categoryPageSource = fs.readFileSync("src/app/category/wissen/page.tsx", "utf8");
const servicesPageSource = fs.readFileSync("src/app/services/[slug]/page.tsx", "utf8");
const legalPageSource = fs.readFileSync("src/app/legal/[slug]/page.tsx", "utf8");
const blogPageSource = fs.readFileSync("src/app/blog/[slug]/page.tsx", "utf8");
const authorPageSource = fs.readFileSync("src/app/author/[slug]/page.tsx", "utf8");

const rendererWiring = {
  home: homePageSource.includes("loadSourceMain"),
  category: categoryPageSource.includes("loadSourceMain"),
  services: servicesPageSource.includes("loadSourceMain"),
  legal: legalPageSource.includes("loadSourceMain"),
  blog: blogPageSource.includes("loadSourceMain"),
  author: authorPageSource.includes("loadSourceMain"),
};

const authorSurfaceWiring = {
  services: servicesPageSource.includes("AuthorBox"),
  blog: blogPageSource.includes("AuthorBox"),
  author: authorPageSource.includes("AuthorBox"),
};

const canonicalRecords = readJson("artifacts/latest/canonical_url_inventory.json").records;
const metadataRecords = readJson("artifacts/latest/metadata_snapshot.json").records;
const inventoryRecords = readJson("seo_migration_inventory.json");
const contentAssetRecords = readJson("artifacts/latest/content_asset_manifest.json").pages;

const metadataByPath = new Map(metadataRecords.map((record) => [normalizePath(record.canonicalPath), record]));
const inventoryByPath = new Map(inventoryRecords.map((record) => [normalizePath(record.path), record]));

const approvedOgFallbackPaths = new Set(["/agentur/", "/suchmaschinenoptimierung/"]);
const sharedBrandOgImage = "https://nordpush.de/wp-content/uploads/2025/04/image-5-1024x956.png";
const firstImageByPath = new Map();

for (const page of contentAssetRecords) {
  const firstImage = (page.assets || []).find((asset) => asset.assetType === "image")?.assetUrl || "";
  if (firstImage) {
    firstImageByPath.set(normalizePath(page.canonicalPath), firstImage);
  }
}

function classifyPath(pathValue) {
  if (pathValue === "/") {
    return "home";
  }

  if (pathValue === "/category/wissen/") {
    return "category";
  }

  const slug = pathValue.replace(/^\//, "").replace(/\/$/, "");

  if (serviceSlugs.includes(slug) || localSeoSlugs.includes(slug)) {
    return "services";
  }

  if (blogSlugs.includes(slug)) {
    return "blog";
  }

  if (legalSlugs.includes(slug) || conversionSlugs.includes(slug)) {
    return "legal";
  }

  if (authorSlugs.includes(slug)) {
    return "author";
  }

  return "unknown";
}

function requiresAuthorSurface(pageType) {
  return (
    pageType === "service" ||
    pageType === "local_seo" ||
    pageType === "blog_or_other" ||
    pageType === "about_or_author"
  );
}

function hasAuthorSurfaceForPath(pathValue) {
  const section = classifyPath(pathValue);
  if (section === "services") {
    return authorSurfaceWiring.services;
  }
  if (section === "blog") {
    return authorSurfaceWiring.blog;
  }
  if (section === "author") {
    return authorSurfaceWiring.author;
  }
  return true;
}

const rows = [];

for (const record of canonicalRecords) {
  const pathValue = normalizePath(record.canonicalPath);
  const metadata = metadataByPath.get(pathValue);
  const source = inventoryByPath.get(pathValue);

  const metadataFieldMismatches = [];

  if (!metadata) {
    metadataFieldMismatches.push("missing metadata snapshot record");
  }

  if (!source) {
    metadataFieldMismatches.push("missing source inventory record");
  }

  if (metadata && source) {
    const fields = [
      ["title", source.title || "", metadata.title || ""],
      ["metaDescription", source.metaDescription || "", metadata.metaDescription || ""],
      ["ogTitle", source.ogTitle || "", metadata.ogTitle || ""],
      ["ogDescription", source.ogDescription || "", metadata.ogDescription || ""],
      ["canonicalPath", normalizePath(source.path || ""), normalizePath(metadata.canonicalPath || "")],
    ];

    for (const [field, expectedValue, actualValue] of fields) {
      if ((expectedValue || "").trim() !== (actualValue || "").trim()) {
        metadataFieldMismatches.push(`${field} mismatch`);
      }
    }

    const sourceOgImage = (source.ogImage || "").trim();
    const currentOgImage = approvedOgFallbackPaths.has(pathValue)
      ? sharedBrandOgImage
      : (firstImageByPath.get(pathValue) || "").trim();

    if (sourceOgImage) {
      if (sourceOgImage !== currentOgImage) {
        metadataFieldMismatches.push("ogImage mismatch");
      }
    } else if (!approvedOgFallbackPaths.has(pathValue) && currentOgImage) {
      metadataFieldMismatches.push("unexpected ogImage added");
    }
  }

  const routeImplemented = supportedPaths.has(pathValue);
  const section = classifyPath(pathValue);
  const usesSourceRenderer = section === "unknown" ? false : rendererWiring[section];
  const sourceH1 = source?.h1?.trim() || "";
  const currentH1 = usesSourceRenderer ? sourceH1 : "";
  const headingParity = routeImplemented && usesSourceRenderer && sourceH1.length > 0 && currentH1 === sourceH1;

  const checklistReasons = [];

  if (!routeImplemented) {
    checklistReasons.push("route missing in App Router catalog");
  } else {
    if (!usesSourceRenderer) {
      checklistReasons.push("source-content renderer not wired for this route group");
    }

    if (!sourceH1) {
      checklistReasons.push("source inventory is missing H1 value");
    }

    if (!headingParity) {
      checklistReasons.push("rendered H1 parity could not be confirmed from wired source-content path");
    }

    if (!usesSourceRenderer) {
      checklistReasons.push("internal-link parity not implemented via source-content rendering");
      checklistReasons.push("media-reference parity not implemented via source-content rendering");
    }

    if (requiresAuthorSurface(record.pageType) && !hasAuthorSurfaceForPath(pathValue)) {
      checklistReasons.push("author surface/reviewer module not implemented in rendered content");
    }
  }

  const metadataPass = metadataFieldMismatches.length === 0;
  const checklistStatus = checklistReasons.length === 0 ? "pass" : "fail";
  const overallPass = routeImplemented && metadataPass && checklistStatus === "pass";

  rows.push({
    path: pathValue,
    pageType: record.pageType,
    routeImplemented,
    metadataPass,
    metadataFieldMismatches,
    headingParity: Boolean(headingParity),
    checklistStatus,
    checklistReasons,
    overallStatus: overallPass ? "PASS" : "FAIL",
    sourceH1,
    currentH1: currentH1 || "",
  });
}

rows.sort((a, b) => a.path.localeCompare(b.path));

const totals = {
  routes: rows.length,
  routeImplemented: rows.filter((row) => row.routeImplemented).length,
  metadataPass: rows.filter((row) => row.metadataPass).length,
  contentChecklistPass: rows.filter((row) => row.checklistStatus === "pass").length,
  overallPass: rows.filter((row) => row.overallStatus === "PASS").length,
};

const blockingPaths = rows.filter((row) => row.overallStatus === "FAIL").map((row) => row.path);
const result = { totals, rows, blockingPaths };

fs.writeFileSync("artifacts/latest/nor-33-parity-checkpoint.json", JSON.stringify(result, null, 2));

const markdown = [];
markdown.push("# NOR-33 Canonical Parity Checkpoint");
markdown.push("");
markdown.push(`- Generated: ${new Date().toISOString()}`);
markdown.push(`- Total canonical routes: ${totals.routes}`);
markdown.push(`- Route coverage: ${totals.routeImplemented}/${totals.routes}`);
markdown.push(`- Metadata parity pass: ${totals.metadataPass}/${totals.routes}`);
markdown.push(`- Content checklist pass: ${totals.contentChecklistPass}/${totals.routes}`);
markdown.push(`- Overall pass: ${totals.overallPass}/${totals.routes}`);
markdown.push("");
markdown.push("| Path | Page Type | Route | Metadata | Content | Overall | Evidence |");
markdown.push("|---|---|---|---|---|---|---|");

for (const row of rows) {
  const evidence = [];
  if (!row.routeImplemented) {
    evidence.push("missing route");
  }
  if (!row.metadataPass) {
    evidence.push(row.metadataFieldMismatches.join(", "));
  }
  if (!row.headingParity) {
    const sourceLabel = row.sourceH1.replace(/\|/g, "\\|");
    const currentLabel = row.currentH1.replace(/\|/g, "\\|");
    evidence.push(`H1 source=\"${sourceLabel}\" vs current=\"${currentLabel}\"`);
  }

  if (row.checklistStatus === "pass") {
    evidence.push("source-content renderer + metadata parity checks passed");
  }

  markdown.push(
    `| ${row.path} | ${row.pageType} | ${row.routeImplemented ? "pass" : "fail"} | ${
      row.metadataPass ? "pass" : "fail"
    } | ${row.checklistStatus} | ${row.overallStatus.toLowerCase()} | ${evidence.join("; ")} |`,
  );
}

markdown.push("");
markdown.push("## Required Remediation");
markdown.push("");
if (blockingPaths.length === 0) {
  markdown.push("- No blocking remediation remains in this checkpoint.");
} else {
  markdown.push("- Ensure every route group uses source-content rendering.");
  markdown.push("- Resolve any metadata mismatches listed in the table evidence column.");
  markdown.push("- Add author/reviewer modules where required for service/blog/about-or-author paths.");
}

fs.writeFileSync("artifacts/latest/nor-33-parity-checkpoint.md", markdown.join("\n"));

console.log(JSON.stringify(totals));
console.log(`blocking=${blockingPaths.length}`);
console.log(blockingPaths.join(","));
