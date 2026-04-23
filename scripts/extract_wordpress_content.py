"""
Extract verbatim body content from nordpush.de pages.

Reads:  artifacts/latest/canonical_url_inventory.json
Writes: artifacts/latest/raw_html/<recordId>.html  (cache)
        artifacts/latest/extracted_content.json    (structured + rich)
        artifacts/latest/extraction_report.md      (human review)

Runs politely (0.5s delay, single connection, real UA).
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
ARTIFACTS = ROOT / "artifacts" / "latest"
RAW_DIR = ARTIFACTS / "raw_html"
INVENTORY = ARTIFACTS / "canonical_url_inventory.json"
OUT_JSON = ARTIFACTS / "extracted_content.json"
OUT_REPORT = ARTIFACTS / "extraction_report.md"

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)
HEADERS = {"User-Agent": UA, "Accept-Language": "de-DE,de;q=0.9,en;q=0.8"}

SIZE_SUFFIX = re.compile(r"-\d+x\d+(?=\.(?:png|jpe?g|webp|gif|svg)$)", re.IGNORECASE)
WS = re.compile(r"\s+")

DROP_SELECTORS = [
    "script", "style", "noscript", "iframe",
    "form", "button",
    ".cky-consent-bar", ".cky-modal", "[id^='cky-']",
    ".wp-block-search", ".wp-block-navigation",
    "header.site-header", "footer.site-footer",
    ".site-header", ".site-footer",
    ".skip-link", ".screen-reader-text",
    ".cmplz-cookiebanner", ".cookie-notice",
    "[aria-label='Breadcrumb']",
    # FAQs are re-rendered via our own FAQAccordion component
    ".wp-block-kadence-accordion",
]

DROP_ATTRS_PREFIXES = ("on", "data-", "aria-", "style", "class", "id", "role", "tabindex")
KEEP_ATTRS = {"href", "src", "alt", "title", "width", "height", "loading", "target", "rel"}


# ---------- fetching ----------

def fetch_page(url: str, cache_path: Path) -> str:
    if cache_path.exists() and cache_path.stat().st_size > 1000:
        return cache_path.read_text(encoding="utf-8")
    time.sleep(0.5)
    r = requests.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    cache_path.write_text(r.text, encoding="utf-8")
    return r.text


# ---------- sanitization ----------

def local_image_path(src: str) -> str | None:
    """Rewrite WP upload URLs → /images/<basename>. Return None if not a WP image."""
    try:
        p = urlparse(src)
    except Exception:
        return None
    if "nordpush.de" not in p.netloc and p.netloc != "":
        return None
    if "/wp-content/uploads/" not in p.path:
        return None
    basename = p.path.rsplit("/", 1)[-1]
    basename = SIZE_SUFFIX.sub("", basename)
    return f"/images/{basename}"


def clean_attrs(tag: Tag) -> None:
    for attr in list(tag.attrs.keys()):
        if attr in KEEP_ATTRS:
            continue
        # drop everything else (class/id/style/data-*/aria-* etc.)
        del tag.attrs[attr]


def sanitize(node: Tag) -> None:
    # Remove unwanted elements
    for sel in DROP_SELECTORS:
        for el in node.select(sel):
            el.decompose()

    # Remove empty wrappers iteratively
    for el in node.find_all(True):
        if el.name in ("img", "br", "hr"):
            continue
        if not el.get_text(strip=True) and not el.find("img"):
            el.decompose()

    # Rewrite image srcs and strip srcset/sizes
    for img in node.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        local = local_image_path(src)
        if local:
            img["src"] = local
        # strip srcset; keep width/height/alt/loading
        if "srcset" in img.attrs:
            del img["srcset"]
        if "sizes" in img.attrs:
            del img["sizes"]
        img["loading"] = img.get("loading") or "lazy"
        clean_attrs(img)
        # Ensure alt exists to avoid validation warnings
        if "alt" not in img.attrs:
            img["alt"] = ""

    # Rewrite internal links to canonical public paths
    for a in node.find_all("a"):
        href = a.get("href", "")
        if not href:
            clean_attrs(a)
            continue
        # Strip nordpush.de origin → relative
        if href.startswith("https://nordpush.de"):
            href = href[len("https://nordpush.de"):] or "/"
        a["href"] = href
        clean_attrs(a)

    # Strip all other attributes on remaining elements
    for el in node.find_all(True):
        if el.name in ("img", "a"):
            continue
        clean_attrs(el)

    # Unwrap empty divs/spans/sections that only wrap one child
    for _ in range(5):  # iterate a few times for nested wrappers
        changed = False
        for el in list(node.find_all(["div", "span", "section"])):
            if not el.parent:
                continue
            children = [c for c in el.children if not (isinstance(c, NavigableString) and not c.strip())]
            if len(children) <= 1 and not el.get_text(strip=True):
                el.decompose()
                changed = True
            elif len(children) == 1 and isinstance(children[0], Tag):
                el.unwrap()
                changed = True
        if not changed:
            break


def serialize_body(node: Tag) -> str:
    """Serialize cleaned body to a compact HTML string."""
    html = node.decode_contents()
    # Collapse excessive whitespace between block tags
    html = re.sub(r"\n{2,}", "\n", html)
    html = re.sub(r">\s+<", "><", html)
    return html.strip()


# ---------- structured classification ----------

@dataclass
class Faq:
    question: str
    answer: str


def extract_faqs(main: Tag) -> list[Faq]:
    faqs: list[Faq] = []
    # Pattern 1: Kadence accordion (what nordpush.de actually uses)
    for pane in main.select(".wp-block-kadence-pane"):
        title_el = pane.select_one(".kt-blocks-accordion-title")
        panel_el = pane.select_one(".kt-accordion-panel-inner")
        if title_el and panel_el:
            q = WS.sub(" ", title_el.get_text(" ", strip=True))
            a = WS.sub(" ", panel_el.get_text(" ", strip=True))
            if q and a:
                faqs.append(Faq(q, a))
    # Pattern 2: <details><summary>Q</summary>...</details>
    for det in main.find_all("details"):
        summ = det.find("summary")
        if summ:
            q = WS.sub(" ", summ.get_text(" ", strip=True))
            det_copy = BeautifulSoup(str(det), "html.parser")
            summ2 = det_copy.find("summary")
            if summ2:
                summ2.decompose()
            a = WS.sub(" ", det_copy.get_text(" ", strip=True))
            if q and a:
                faqs.append(Faq(q, a))
    # Pattern 3: H3/H4 ending in "?" followed by a paragraph
    if not faqs:
        for h in main.find_all(["h3", "h4"]):
            qt = h.get_text(" ", strip=True)
            if not qt.endswith("?"):
                continue
            nxt = h.find_next_sibling()
            if nxt and nxt.name in ("p", "div"):
                a = WS.sub(" ", nxt.get_text(" ", strip=True))
                if a:
                    faqs.append(Faq(WS.sub(" ", qt), a))
    # Dedupe by question
    seen: set[str] = set()
    unique: list[Faq] = []
    for f in faqs:
        if f.question in seen:
            continue
        seen.add(f.question)
        unique.append(f)
    return unique


def extract_hero_lede(main: Tag) -> str:
    """First meaningful paragraph after H1 — typically the hero subheading."""
    h1 = main.find("h1")
    if not h1:
        return ""
    for sib in h1.find_all_next(limit=20):
        if not isinstance(sib, Tag):
            continue
        if sib.name == "p":
            text = WS.sub(" ", sib.get_text(" ", strip=True))
            if len(text) > 30:
                return text
        if sib.name in ("h2", "h3"):
            break
    return ""


# ---------- driver ----------

def extract_page(record: dict[str, Any]) -> dict[str, Any]:
    record_id = record["recordId"]
    source_url = record["canonicalUrl"]
    canonical_path = record["canonicalPath"]
    cache = RAW_DIR / f"{record_id}.html"

    html = fetch_page(source_url, cache)
    soup = BeautifulSoup(html, "html.parser")
    main = soup.find("main", class_="site-main") or soup.find("main") or soup.find(class_="entry-content")
    if not main:
        return {
            "recordId": record_id,
            "canonicalPath": canonical_path,
            "error": "no-main-container",
            "bodyHtml": "",
            "heroLede": "",
            "faqs": [],
            "images": [],
        }

    # Clone before sanitizing to allow structured extraction on clean DOM
    # Actually: do structured extraction on raw, then sanitize for bodyHtml.
    raw = BeautifulSoup(str(main), "html.parser").find("main") or BeautifulSoup(str(main), "html.parser")
    hero = extract_hero_lede(main)
    faqs = extract_faqs(main)

    # Sanitize the actual main for serialization
    sanitize(main)

    # Remove leading H1 from bodyHtml (we render it separately via hero component)
    h1 = main.find("h1")
    if h1:
        h1.decompose()

    body_html = serialize_body(main)

    # Collect image filenames referenced
    images: list[str] = []
    for img in main.find_all("img"):
        src = img.get("src", "")
        if src.startswith("/images/"):
            images.append(src)

    return {
        "recordId": record_id,
        "canonicalPath": canonical_path,
        "pageType": record.get("pageType", ""),
        "heroLede": hero,
        "bodyHtml": body_html,
        "bodyTextLen": len(BeautifulSoup(body_html, "html.parser").get_text(" ", strip=True)),
        "faqs": [asdict(f) for f in faqs],
        "images": sorted(set(images)),
        "error": "",
    }


def main_cli() -> int:
    if not INVENTORY.exists():
        print(f"Missing inventory: {INVENTORY}", file=sys.stderr)
        return 2
    data = json.loads(INVENTORY.read_text(encoding="utf-8"))
    records = data.get("records") if isinstance(data, dict) else data
    if records is None:
        # try other shapes
        if isinstance(data, list):
            records = data
        else:
            print("Unknown inventory shape", file=sys.stderr)
            return 2

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    results: list[dict[str, Any]] = []
    report_lines: list[str] = ["# Extraction report", ""]

    for i, rec in enumerate(records, 1):
        url = rec.get("canonicalUrl") or rec.get("sourceUrl") or rec.get("url")
        path = rec.get("canonicalPath") or rec.get("path")
        if not url or not path:
            continue
        if "recordId" not in rec:
            # derive a stable id from path
            import hashlib
            rec = {**rec, "recordId": hashlib.md5(path.encode()).hexdigest()[:12]}
        try:
            out = extract_page(rec)
            ok = "OK" if out["bodyTextLen"] >= 100 else "LOW"
            print(f"[{i:02d}/{len(records)}] {ok} {path} text={out['bodyTextLen']} faqs={len(out['faqs'])} imgs={len(out['images'])}")
            report_lines.append(
                f"- `{path}` — text={out['bodyTextLen']}, faqs={len(out['faqs'])}, images={len(out['images'])}, pageType={out['pageType']}"
            )
            results.append(out)
        except Exception as e:
            print(f"[{i:02d}] FAIL {path}: {e}", file=sys.stderr)
            report_lines.append(f"- `{path}` — FAILED: {e}")
            results.append({
                "recordId": rec.get("recordId", ""),
                "canonicalPath": path,
                "pageType": rec.get("pageType", ""),
                "error": str(e),
                "heroLede": "",
                "bodyHtml": "",
                "bodyTextLen": 0,
                "faqs": [],
                "images": [],
            })

    OUT_JSON.write_text(json.dumps({"generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "pages": results}, ensure_ascii=False, indent=2), encoding="utf-8")
    OUT_REPORT.write_text("\n".join(report_lines) + "\n", encoding="utf-8")
    print(f"\nWrote {OUT_JSON}")
    print(f"Wrote {OUT_REPORT}")
    return 0


if __name__ == "__main__":
    sys.exit(main_cli())
