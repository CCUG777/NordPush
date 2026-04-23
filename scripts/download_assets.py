"""
Download all nordpush.de images referenced by our pages to /public/images/.

Sources:
  1. artifacts/latest/content_asset_manifest.json (og:image per page)
  2. artifacts/latest/raw_html/*.html (all <img src> with /wp-content/uploads/)

Writes:
  public/images/<basename>.<ext>
  public/images/manifest.json  ({ filename: {width, height} })
"""

from __future__ import annotations

import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ARTIFACTS = ROOT / "artifacts" / "latest"
RAW_DIR = ARTIFACTS / "raw_html"
MANIFEST = ARTIFACTS / "content_asset_manifest.json"
OUT_DIR = ROOT / "public" / "images"
OUT_MANIFEST = OUT_DIR / "manifest.json"

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
HEADERS = {"User-Agent": UA}

SIZE_SUFFIX = re.compile(r"-\d+x\d+(?=\.(?:png|jpe?g|webp|gif|svg)$)", re.IGNORECASE)


def canonical_basename(url: str) -> str | None:
    try:
        p = urlparse(url)
    except Exception:
        return None
    if "/wp-content/uploads/" not in p.path:
        return None
    basename = p.path.rsplit("/", 1)[-1]
    basename = SIZE_SUFFIX.sub("", basename)
    return basename


def collect_urls() -> dict[str, str]:
    """Map basename → source url (prefer largest/non-sized)."""
    urls: dict[str, str] = {}

    # From og:image manifest
    if MANIFEST.exists():
        m = json.loads(MANIFEST.read_text(encoding="utf-8"))
        for page in m.get("pages", []):
            for asset in page.get("assets", []):
                src = asset.get("assetUrl", "")
                name = canonical_basename(src)
                if name and name not in urls:
                    urls[name] = src

    # From raw HTML (sweep every saved page for <img src>)
    if RAW_DIR.exists():
        for html_file in RAW_DIR.glob("*.html"):
            soup = BeautifulSoup(html_file.read_text(encoding="utf-8"), "html.parser")
            for img in soup.find_all("img"):
                src = img.get("src") or img.get("data-src") or ""
                name = canonical_basename(src)
                if name and name not in urls:
                    # Prefer the unsized/full URL for higher quality
                    full_src = re.sub(r"-\d+x\d+(?=\.)", "", src)
                    urls[name] = full_src

    return urls


def download(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 500:
        return True
    try:
        time.sleep(0.25)
        r = requests.get(url, headers=HEADERS, timeout=30)
        r.raise_for_status()
        dest.write_bytes(r.content)
        return True
    except Exception as e:
        print(f"  FAIL {url}: {e}", file=sys.stderr)
        return False


def main_cli() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    urls = collect_urls()
    print(f"Discovered {len(urls)} unique images")

    manifest: dict[str, dict] = {}
    for i, (basename, url) in enumerate(sorted(urls.items()), 1):
        dest = OUT_DIR / basename
        ok = download(url, dest)
        if not ok:
            continue
        try:
            with Image.open(dest) as im:
                w, h = im.size
            manifest[basename] = {"width": w, "height": h, "sourceUrl": url}
            print(f"[{i:02d}/{len(urls)}] {basename} {w}x{h}")
        except Exception as e:
            print(f"[{i:02d}/{len(urls)}] {basename} — dim read failed: {e}")
            manifest[basename] = {"width": 0, "height": 0, "sourceUrl": url}

    OUT_MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {OUT_MANIFEST}")
    print(f"Files in {OUT_DIR}: {len(list(OUT_DIR.glob('*')))}")
    return 0


if __name__ == "__main__":
    sys.exit(main_cli())
