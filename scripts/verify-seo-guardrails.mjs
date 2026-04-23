#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function readJson(relativePath) {
  const filePath = path.join(process.cwd(), relativePath);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function normalizePath(value) {
  if (!value || value === "/") {
    return "/";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  const compact = withLeadingSlash.replace(/\/{2,}/g, "/");
  return compact.endsWith("/") ? compact : `${compact}/`;
}

function pathFromIssueReference(reference) {
  if (reference?.sourcePath) {
    return normalizePath(reference.sourcePath);
  }

  if (reference?.canonicalPath) {
    return normalizePath(reference.canonicalPath);
  }

  if (reference?.sourceUrl) {
    try {
      return normalizePath(new URL(reference.sourceUrl).pathname);
    } catch {
      return null;
    }
  }

  if (reference?.canonicalUrl) {
    try {
      return normalizePath(new URL(reference.canonicalUrl).pathname);
    } catch {
      return null;
    }
  }

  return null;
}

const canonicalInventory = readJson("artifacts/latest/canonical_url_inventory.json");
const metadataSnapshot = readJson("artifacts/latest/metadata_snapshot.json");
const extractionGaps = readJson("artifacts/latest/extraction_gaps.json");

const approvedCanonicalFallbackPaths = new Set(["/seo-bamberg/"]);
const approvedSharedOgImageFallbackPaths = new Set(["/agentur/", "/suchmaschinenoptimierung/"]);

const errors = [];
const warnings = [];
const notes = [];

const canonicalRecords = canonicalInventory.records ?? [];
const metadataRecords = metadataSnapshot.records ?? [];

if (canonicalRecords.length === 0) {
  errors.push("canonical_url_inventory.json has no records.");
}

if (metadataRecords.length === 0) {
  errors.push("metadata_snapshot.json has no records.");
}

const canonicalPaths = canonicalRecords.map((record) => normalizePath(record.canonicalPath));
const metadataPaths = metadataRecords.map((record) => normalizePath(record.canonicalPath));

const duplicateCanonicalPaths = canonicalPaths.filter((pathValue, index) => canonicalPaths.indexOf(pathValue) !== index);
if (duplicateCanonicalPaths.length > 0) {
  errors.push(`Duplicate canonical paths found: ${Array.from(new Set(duplicateCanonicalPaths)).join(", ")}`);
}

for (const record of canonicalRecords) {
  const normalizedPath = normalizePath(record.canonicalPath);
  if (record.canonicalPath !== normalizedPath) {
    errors.push(`Canonical path is not normalized: ${record.canonicalPath}`);
  }

  if (record.trailingSlashExpected && normalizedPath !== "/" && !normalizedPath.endsWith("/")) {
    errors.push(`Trailing slash expected but missing: ${normalizedPath}`);
  }
}

const metadataPathSet = new Set(metadataPaths);
for (const pathValue of canonicalPaths) {
  if (!metadataPathSet.has(pathValue)) {
    errors.push(`Missing metadata snapshot entry for canonical path: ${pathValue}`);
  }
}

const canonicalPathSet = new Set(canonicalPaths);
for (const pathValue of metadataPaths) {
  if (!canonicalPathSet.has(pathValue)) {
    errors.push(`Metadata path is missing from canonical inventory: ${pathValue}`);
  }
}

const requiredPageTypes = [
  "homepage",
  "service",
  "local_seo",
  "blog_or_other",
  "blog_category",
  "info_legal_or_conversion",
  "about_or_author",
];

const pageTypes = new Set(canonicalRecords.map((record) => record.pageType));
for (const requiredType of requiredPageTypes) {
  if (!pageTypes.has(requiredType)) {
    errors.push(`Missing required page type in canonical inventory: ${requiredType}`);
  }
}

for (const blocker of extractionGaps.blockers ?? []) {
  if (blocker.code === "missing_canonical_values") {
    const unresolved = (blocker.affectedPages ?? [])
      .map((entry) => pathFromIssueReference(entry))
      .filter((value) => value && !approvedCanonicalFallbackPaths.has(value));

    if (unresolved.length > 0) {
      errors.push(`Unapproved canonical fallback paths remain: ${Array.from(new Set(unresolved)).join(", ")}`);
    } else {
      notes.push("Canonical fallback exceptions are covered by approved overrides.");
    }
    continue;
  }

  errors.push(`Unresolved blocker in extraction_gaps.json: ${blocker.code}`);
}

for (const warning of extractionGaps.warnings ?? []) {
  if (warning.code === "missing_og_image_values") {
    const unresolved = (warning.affectedPages ?? [])
      .map((entry) => pathFromIssueReference(entry))
      .filter((value) => value && !approvedSharedOgImageFallbackPaths.has(value));

    if (unresolved.length > 0) {
      warnings.push(`OG image missing on unapproved paths: ${Array.from(new Set(unresolved)).join(", ")}`);
    } else {
      notes.push("OG-image exceptions are covered by approved shared-brand fallback paths.");
    }
    continue;
  }

  warnings.push(`Non-blocking warning in extraction_gaps.json: ${warning.code}`);
}

if (errors.length > 0) {
  console.error("[FAIL] SEO guardrails check failed.");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  for (const warning of warnings) {
    console.error(`- [WARN] ${warning}`);
  }
  process.exit(1);
}

console.log("[PASS] SEO guardrails check passed.");
for (const note of notes) {
  console.log(`- ${note}`);
}
for (const warning of warnings) {
  console.log(`- [WARN] ${warning}`);
}
