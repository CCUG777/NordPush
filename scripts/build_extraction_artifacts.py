#!/usr/bin/env python3
"""Build normalized extraction artifacts for migration implementation."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlsplit, urlunsplit


def now_utc_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def is_file_like_path(path: str) -> bool:
    segment = path.rsplit("/", 1)[-1]
    return "." in segment and segment not in {"", ".", ".."}


def normalize_path(path: str, enforce_trailing_slash: bool = True) -> str:
    normalized = (path or "").strip() or "/"
    if not normalized.startswith("/"):
        normalized = f"/{normalized}"
    while "//" in normalized:
        normalized = normalized.replace("//", "/")
    if enforce_trailing_slash and normalized != "/" and not normalized.endswith("/") and not is_file_like_path(normalized):
        normalized = f"{normalized}/"
    return normalized


def normalize_url(raw_url: str, enforce_trailing_slash: bool = True) -> str:
    value = (raw_url or "").strip()
    if not value:
        return ""
    if value.startswith("//"):
        value = f"https:{value}"

    parts = urlsplit(value)
    scheme = (parts.scheme or "https").lower()
    host = parts.netloc.lower()
    path = normalize_path(parts.path, enforce_trailing_slash=enforce_trailing_slash)
    return urlunsplit((scheme, host, path, "", ""))


def to_bool(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"true", "1", "yes"}
    if value is None:
        return False
    return bool(value)


def short_hash(value: str) -> str:
    return hashlib.sha1(value.encode("utf-8")).hexdigest()[:12]


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_csv(path: Path, rows: list[dict[str, Any]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def build_artifacts(source_records: list[dict[str, Any]], source_file: Path) -> dict[str, dict[str, Any]]:
    generated_at = now_utc_iso()
    url_records: list[dict[str, Any]] = []
    metadata_records: list[dict[str, Any]] = []
    media_pages: list[dict[str, Any]] = []
    media_asset_index: dict[str, dict[str, Any]] = {}

    missing_canonical: list[dict[str, Any]] = []
    missing_meta_description: list[dict[str, Any]] = []
    missing_h1: list[dict[str, Any]] = []
    missing_og_image: list[dict[str, Any]] = []
    fetch_errors: list[dict[str, Any]] = []
    invalid_source_rows: list[dict[str, Any]] = []

    canonical_to_sources: dict[str, list[str]] = defaultdict(list)

    for index, row in enumerate(source_records):
        source_url = normalize_url(str(row.get("url", "")))
        if not source_url:
            invalid_source_rows.append(
                {
                    "rowIndex": index,
                    "reason": "missing_or_invalid_source_url",
                }
            )
            continue

        source_path = urlsplit(source_url).path or "/"
        canonical_raw = str(row.get("canonical", "") or "").strip()
        used_canonical_fallback = not canonical_raw
        canonical_input = canonical_raw if canonical_raw else source_url
        canonical_url = normalize_url(canonical_input)
        canonical_path = urlsplit(canonical_url).path or "/"

        notes: list[str] = []
        if used_canonical_fallback:
            notes.append("missing_canonical_fallback_to_source_url")
            missing_canonical.append(
                {
                    "sourceUrl": source_url,
                    "sourcePath": source_path,
                    "pageType": row.get("pageType"),
                }
            )

        if source_url != canonical_url:
            notes.append("canonical_differs_from_source_url")

        error_text = str(row.get("error", "") or "").strip()
        if error_text:
            notes.append("source_fetch_error")
            fetch_errors.append(
                {
                    "sourceUrl": source_url,
                    "error": error_text,
                }
            )

        title = str(row.get("title", "") or "").strip()
        meta_description = str(row.get("metaDescription", "") or "").strip()
        og_title = str(row.get("ogTitle", "") or "").strip()
        og_description = str(row.get("ogDescription", "") or "").strip()
        h1 = str(row.get("h1", "") or "").strip()
        page_type = str(row.get("pageType", "") or "").strip()
        source_type = str(row.get("source", "") or "").strip()

        has_faq_schema = to_bool(row.get("hasFaqSchema"))
        has_breadcrumb_schema = to_bool(row.get("hasBreadcrumbSchema"))

        if not meta_description:
            missing_meta_description.append(
                {"canonicalUrl": canonical_url, "sourceUrl": source_url, "pageType": page_type}
            )

        if not h1:
            missing_h1.append({"canonicalUrl": canonical_url, "sourceUrl": source_url, "pageType": page_type})

        canonical_to_sources[canonical_url].append(source_url)

        url_records.append(
            {
                "recordId": short_hash(canonical_url),
                "sourceUrl": source_url,
                "sourcePath": source_path,
                "canonicalUrl": canonical_url,
                "canonicalPath": canonical_path,
                "pageType": page_type,
                "source": source_type,
                "needsRedirect": source_url != canonical_url,
                "trailingSlashExpected": canonical_path.endswith("/"),
                "notes": notes,
            }
        )

        metadata_records.append(
            {
                "recordId": short_hash(canonical_url),
                "canonicalUrl": canonical_url,
                "canonicalPath": canonical_path,
                "sourceUrl": source_url,
                "pageType": page_type,
                "title": title,
                "metaDescription": meta_description,
                "h1": h1,
                "ogTitle": og_title,
                "ogDescription": og_description,
                "hasFaqSchema": has_faq_schema,
                "hasBreadcrumbSchema": has_breadcrumb_schema,
                "fetched": to_bool(row.get("fetched")),
            }
        )

        assets: list[dict[str, Any]] = []
        og_image = str(row.get("ogImage", "") or "").strip()
        if og_image:
            resolved = urljoin(canonical_url, og_image)
            asset_url = normalize_url(resolved, enforce_trailing_slash=False)
            asset_entry = {
                "assetUrl": asset_url,
                "assetType": "image",
                "discoverySource": "og:image",
            }
            assets.append(asset_entry)
            if asset_url not in media_asset_index:
                media_asset_index[asset_url] = {
                    "assetUrl": asset_url,
                    "assetType": "image",
                    "discoverySources": ["og:image"],
                    "referencedBy": [canonical_url],
                }
            else:
                if canonical_url not in media_asset_index[asset_url]["referencedBy"]:
                    media_asset_index[asset_url]["referencedBy"].append(canonical_url)
        else:
            missing_og_image.append(
                {"canonicalUrl": canonical_url, "sourceUrl": source_url, "pageType": page_type}
            )

        media_pages.append(
            {
                "recordId": short_hash(canonical_url),
                "canonicalUrl": canonical_url,
                "canonicalPath": canonical_path,
                "pageType": page_type,
                "assets": assets,
            }
        )

    duplicate_canonical_groups = [
        {"canonicalUrl": canonical_url, "sourceUrls": sorted(sources)}
        for canonical_url, sources in canonical_to_sources.items()
        if len(set(sources)) > 1
    ]

    canonical_manifest = {
        "generatedAt": generated_at,
        "sourceFile": str(source_file),
        "recordCount": len(url_records),
        "policy": {
            "canonicalFallback": "use_source_url_when_canonical_missing",
            "trailingSlash": "enforced_for_non_file_paths",
            "queryAndFragment": "discarded_during_normalization",
        },
        "records": sorted(url_records, key=lambda item: item["canonicalPath"]),
    }

    metadata_snapshot = {
        "generatedAt": generated_at,
        "sourceFile": str(source_file),
        "recordCount": len(metadata_records),
        "records": sorted(metadata_records, key=lambda item: item["canonicalPath"]),
    }

    media_manifest = {
        "generatedAt": generated_at,
        "sourceFile": str(source_file),
        "pageCount": len(media_pages),
        "uniqueAssetCount": len(media_asset_index),
        "pages": sorted(media_pages, key=lambda item: item["canonicalPath"]),
        "assets": sorted(media_asset_index.values(), key=lambda item: item["assetUrl"]),
    }

    blockers: list[dict[str, Any]] = []
    if missing_canonical:
        blockers.append(
            {
                "code": "missing_canonical_values",
                "owner": "CMO",
                "summary": "One or more pages do not expose canonical tags and need source-of-truth confirmation.",
                "count": len(missing_canonical),
                "affectedPages": missing_canonical,
                "fallbackApplied": "source URL used as canonical placeholder",
            }
        )

    if fetch_errors:
        blockers.append(
            {
                "code": "source_fetch_errors",
                "owner": "CTO",
                "summary": "Source inventory reported fetch errors that may invalidate metadata snapshots.",
                "count": len(fetch_errors),
                "affectedPages": fetch_errors,
            }
        )

    warnings: list[dict[str, Any]] = []
    if missing_og_image:
        warnings.append(
            {
                "code": "missing_og_image_values",
                "summary": "Pages without og:image are still exported but media manifest coverage is partial.",
                "count": len(missing_og_image),
                "affectedPages": missing_og_image,
            }
        )

    if missing_meta_description:
        warnings.append(
            {
                "code": "missing_meta_descriptions",
                "summary": "Pages without meta descriptions need content QA before launch.",
                "count": len(missing_meta_description),
                "affectedPages": missing_meta_description,
            }
        )

    if missing_h1:
        warnings.append(
            {
                "code": "missing_h1_values",
                "summary": "Pages without H1 values need content QA before launch.",
                "count": len(missing_h1),
                "affectedPages": missing_h1,
            }
        )

    if duplicate_canonical_groups:
        warnings.append(
            {
                "code": "duplicate_canonical_targets",
                "summary": "Multiple source URLs map to the same canonical URL.",
                "count": len(duplicate_canonical_groups),
                "groups": duplicate_canonical_groups,
            }
        )

    if invalid_source_rows:
        warnings.append(
            {
                "code": "invalid_source_rows_skipped",
                "summary": "Rows were skipped due to missing/invalid source URLs.",
                "count": len(invalid_source_rows),
                "rows": invalid_source_rows,
            }
        )

    gaps_report = {
        "generatedAt": generated_at,
        "sourceFile": str(source_file),
        "summary": {
            "recordsProcessed": len(url_records),
            "blockerCount": len(blockers),
            "warningCount": len(warnings),
            "missingCanonicalCount": len(missing_canonical),
            "missingOgImageCount": len(missing_og_image),
            "missingMetaDescriptionCount": len(missing_meta_description),
            "missingH1Count": len(missing_h1),
            "duplicateCanonicalGroupCount": len(duplicate_canonical_groups),
        },
        "blockers": blockers,
        "warnings": warnings,
    }

    canonical_csv_rows = [
        {
            "sourceUrl": item["sourceUrl"],
            "canonicalUrl": item["canonicalUrl"],
            "sourcePath": item["sourcePath"],
            "canonicalPath": item["canonicalPath"],
            "pageType": item["pageType"],
            "needsRedirect": item["needsRedirect"],
            "trailingSlashExpected": item["trailingSlashExpected"],
        }
        for item in canonical_manifest["records"]
    ]

    return {
        "canonical_url_inventory.json": canonical_manifest,
        "metadata_snapshot.json": metadata_snapshot,
        "content_asset_manifest.json": media_manifest,
        "extraction_gaps.json": gaps_report,
        "canonical_url_inventory.csv": {
            "rows": canonical_csv_rows,
            "fieldnames": [
                "sourceUrl",
                "canonicalUrl",
                "sourcePath",
                "canonicalPath",
                "pageType",
                "needsRedirect",
                "trailingSlashExpected",
            ],
        },
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build normalized extraction artifacts for migration.")
    parser.add_argument(
        "--input",
        default="seo_migration_inventory.json",
        help="Input inventory JSON file (default: seo_migration_inventory.json).",
    )
    parser.add_argument(
        "--output-dir",
        default="artifacts/latest",
        help="Output directory for generated artifacts (default: artifacts/latest).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    source_file = Path(args.input).resolve()
    output_dir = Path(args.output_dir).resolve()

    if not source_file.exists():
        raise SystemExit(f"Input file not found: {source_file}")

    source_payload = json.loads(source_file.read_text(encoding="utf-8-sig"))
    if not isinstance(source_payload, list):
        raise SystemExit("Input file must contain a JSON array of inventory records.")

    artifacts = build_artifacts(source_payload, source_file)

    for filename, payload in artifacts.items():
        target = output_dir / filename
        if filename.endswith(".csv"):
            write_csv(target, payload["rows"], payload["fieldnames"])
        else:
            write_json(target, payload)

    print(f"Generated {len(artifacts)} artifacts in {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
