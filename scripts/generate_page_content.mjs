/**
 * Reads artifacts/latest/extracted_content.json and emits
 * src/data/extracted-pages.ts — a typed map of canonicalPath → RichPageContent.
 *
 * Run after scripts/extract_wordpress_content.py.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const inPath = resolve(root, "artifacts/latest/extracted_content.json");
const imgManifestPath = resolve(root, "public/images/manifest.json");
const outPath = resolve(root, "src/data/extracted-pages.ts");

if (!existsSync(inPath)) {
  console.error(`Missing: ${inPath}`);
  process.exit(2);
}

const data = JSON.parse(readFileSync(inPath, "utf8"));
const imageManifest = existsSync(imgManifestPath)
  ? JSON.parse(readFileSync(imgManifestPath, "utf8"))
  : {};

/**
 * @param {string} s
 */
function tsString(s) {
  // emit as a JSON string (handles quotes, unicode, control chars)
  return JSON.stringify(s);
}

const header = `// AUTO-GENERATED from artifacts/latest/extracted_content.json
// via scripts/generate_page_content.mjs — do not edit by hand.
// Regenerate: python scripts/extract_wordpress_content.py && node scripts/generate_page_content.mjs

export type ExtractedFaq = { question: string; answer: string };

export type ExtractedPage = {
  canonicalPath: string;
  pageType: string;
  heroLede: string;
  bodyHtml: string;
  bodyTextLen: number;
  faqs: ExtractedFaq[];
  images: string[];
};

export type ImageMeta = { width: number; height: number; sourceUrl?: string };

export const imageManifest: Record<string, ImageMeta> = ${JSON.stringify(imageManifest, null, 2)};

`;

const entries = (data.pages ?? [])
  .filter((p) => p && p.canonicalPath)
  .sort((a, b) => a.canonicalPath.localeCompare(b.canonicalPath));

let body = "export const extractedPages: Record<string, ExtractedPage> = {\n";
for (const p of entries) {
  body += `  ${tsString(p.canonicalPath)}: {\n`;
  body += `    canonicalPath: ${tsString(p.canonicalPath)},\n`;
  body += `    pageType: ${tsString(p.pageType ?? "")},\n`;
  body += `    heroLede: ${tsString(p.heroLede ?? "")},\n`;
  body += `    bodyHtml: ${tsString(p.bodyHtml ?? "")},\n`;
  body += `    bodyTextLen: ${p.bodyTextLen ?? 0},\n`;
  if ((p.faqs ?? []).length === 0) {
    body += `    faqs: [],\n`;
  } else {
    body += `    faqs: [\n`;
    for (const f of p.faqs) {
      body += `      { question: ${tsString(f.question)}, answer: ${tsString(f.answer)} },\n`;
    }
    body += `    ],\n`;
  }
  body += `    images: ${JSON.stringify(p.images ?? [])},\n`;
  body += `  },\n`;
}
body += "};\n\n";

body += `export function getExtractedPage(path: string): ExtractedPage | undefined {
  return extractedPages[path];
}
`;

writeFileSync(outPath, header + body, "utf8");
console.log(`Wrote ${outPath}`);
console.log(`Pages: ${entries.length}`);
