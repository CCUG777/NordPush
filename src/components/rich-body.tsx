import type { CSSProperties } from "react";

type RichBodyProps = {
  html: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Transforms extracted WordPress HTML to tag layout-relevant blocks with classes
 * so the stylesheet can render pricing grids, step blocks, team quote grids, etc.
 */
function mergeConsecutiveH2s(html: string): string {
  // Match 2+ consecutive <h2> tags separated by only whitespace.
  // Uses a non-backtracking h2 pattern (negative lookahead prevents crossing
  // </h2> boundaries) so the match only covers truly adjacent headings.
  const h2Tag = "<h2>(?:(?!<\\/h2>)[\\s\\S])*<\\/h2>";
  const pattern = new RegExp(`(${h2Tag})(\\s*${h2Tag})+`, "g");

  return html.replace(pattern, (match) => {
    // Only merge styled splits (contain <span> inside h2 tags)
    if (!/<h2>[^<]*<span/.test(match)) return match;

    const texts = [...match.matchAll(/<h2>((?:(?!<\/h2>)[\s\S])*)<\/h2>/g)]
      .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
      .filter(Boolean);

    return `<h2>${texts.join(" ")}</h2>`;
  });
}

function enhance(html: string): string {
  let out = html;

  // Normalize stale WordPress anchors:
  //   #contact → /kontakt/  (dedicated Kontakt page in the new info architecture)
  out = out.replace(/href="#contact"/g, 'href="/kontakt/"');

  // Strip WordPress tab TOC items — `<a href="#tab-…"><span>…</span></a>` pointed
  // into tab panels that don't exist in the new layout (the panel content itself
  // is still present inline below, so the list is redundant navigation).
  out = out.replace(
    /<li><a href="#tab-[^"]+"><span>[^<]*<\/span><\/a><\/li>/g,
    "",
  );
  // Collapse emptied wrappers left behind by the tab-list strip.
  out = out.replace(/<ul>\s*<\/ul>/g, "");
  out = out.replace(/<div>\s*<\/div>/g, "");

  // Merge consecutive <h2> tags that were split for visual styling
  out = mergeConsecutiveH2s(out);

  // Strip inline FAQ blocks — rendered separately via FAQAccordion
  out = out.replace(
    /<div>\s*<h4>[^<]*(?:Häufig|FAQ)[^<]*<\/h4>\s*<h2>[^<]*<\/h2>[\s\S]*?<\/div>/gi,
    "",
  );
  out = out.replace(
    /<div>\s*<h2>[^<]*(?:Häufige Fragen|FAQs?)[^<]*<\/h2>[\s\S]*?<\/div>(?=\s*<div>|\s*<\/article>|\s*<\/div>\s*<\/article>)/gi,
    "",
  );

  // Strip final-CTA block — rendered as dedicated final CTA section
  out = out.replace(
    /<div>\s*<h2>[^<]*(?:Bereit|Starte jetzt|Lass uns)[^<]*<\/h2>[\s\S]*?<\/div>(?=\s*<\/article>|\s*<\/div>\s*<\/article>|\s*$)/gi,
    "",
  );

  // Strip team quote intro labels ("Team-Einblicke") that duplicate
  // with our own dedicated sections — keep the quote cards.

  // Strip the hero-like first block that duplicates the Hero component's title/lede
  // Pattern: <article><div><div><h4>…</h4><p>…</p><a …>CTA</a><h5>proof</h5></div>
  out = out.replace(
    /(<article>\s*(?:<header><\/header>)?\s*<div>)\s*<div>\s*<(?:h4|h5|p)>[\s\S]*?<a[^>]*>[\s\S]*?<\/a>\s*<h5>[^<]*<\/h5>\s*<\/div>/,
    "$1",
  );

  // Pricing CTA: the extracted WordPress pricing blocks render "Jetzt anfragen"
  // as a plain <span>. Upgrade it to a real link so visitors can actually request
  // a quote, styled as the universal pill button.
  out = out.replace(
    /<span>Jetzt anfragen<\/span>/g,
    '<a href="/kontakt/" class="button primary rb-price-cta">Jetzt anfragen</a>',
  );

  // Pricing card: <div><h3>Name (may contain <strong>, <a>, or both)</h3>…
  //   <strong>…€…</strong>…<ul>…</ul>(optional trailing footnote div)</div>
  // The h3 heading can be plain text, bold, or a link — all pricing variants
  // in the extracted content use one of these three patterns.
  out = out.replace(
    /<div>(\s*<h3>[\s\S]*?<\/h3>[\s\S]*?<strong>[^<]*€[^<]*<\/strong>[\s\S]*?<ul>[\s\S]*?<\/ul>(?:\s*<div>[\s\S]*?<\/div>)?\s*)<\/div>/g,
    (_m, inner) => `<div class="rb-price-card">${inner}</div>`,
  );

  // Pricing grid: a parent div that contains 2+ rb-price-card children
  out = out.replace(
    /<div>((?:\s*<div class="rb-price-card">[\s\S]*?<\/div>\s*){2,})<\/div>/g,
    (_m, inner) => `<div class="rb-pricing-grid">${inner}</div>`,
  );

  // Process step: <div><mark>Schritt X</mark><div>…</div></div>
  out = out.replace(
    /<div>(\s*<mark>[^<]*<\/mark>[\s\S]*?)<\/div>(?=\s*<div>\s*<mark>|\s*<\/div>)/g,
    (_m, inner) => `<div class="rb-step">${inner}</div>`,
  );

  // Process group: multiple consecutive rb-step blocks inside a parent div
  out = out.replace(
    /<div>((?:\s*<div class="rb-step">[\s\S]*?<\/div>\s*){2,})<\/div>/g,
    (_m, inner) => `<div class="rb-step-grid">${inner}</div>`,
  );

  // Team quote card: <div><em>…</em><div><mark>XX</mark><div>…</div></div></div>
  out = out.replace(
    /<div>(\s*<em>[\s\S]*?<\/em>\s*<div>\s*<mark>[A-ZÄÖÜ]{1,4}<\/mark>[\s\S]*?<\/div>\s*)<\/div>/g,
    (_m, inner) => `<div class="rb-quote-card">${inner}</div>`,
  );

  // Team quote grid: multiple consecutive rb-quote-card blocks
  out = out.replace(
    /<div>((?:\s*<div class="rb-quote-card">[\s\S]*?<\/div>\s*){2,})<\/div>/g,
    (_m, inner) => `<div class="rb-quote-grid">${inner}</div>`,
  );

  // Benefit card: <div><h3>…</h3><p>…</p></div> inside a wrapper with multiple
  out = out.replace(
    /<div>(\s*<h4>[^<]*<\/h4>\s*<p>[\s\S]*?<\/p>\s*)<\/div>/g,
    (_m, inner) => `<div class="rb-feature-card">${inner}</div>`,
  );

  // Feature grid: multiple rb-feature-card siblings
  out = out.replace(
    /<div>((?:\s*<div class="rb-feature-card">[\s\S]*?<\/div>\s*){2,})<\/div>/g,
    (_m, inner) => `<div class="rb-feature-grid">${inner}</div>`,
  );

  // H5-based feature card (common pattern in link-risk-management etc.)
  out = out.replace(
    /<div>(\s*<h5>[^<]*<\/h5>\s*<p>[\s\S]*?<\/p>\s*)<\/div>/g,
    (_m, inner) => `<div class="rb-feature-card">${inner}</div>`,
  );

  // Numbered step cards (① ② ③ patterns)
  out = out.replace(
    /<div>(\s*<h3>[①②③④⑤\u2460-\u2469][^<]*<\/h3>\s*<p>[\s\S]*?<\/p>\s*)<\/div>/g,
    (_m, inner) => `<div class="rb-numbered-card">${inner}</div>`,
  );

  out = out.replace(
    /<div>((?:\s*<div class="rb-numbered-card">[\s\S]*?<\/div>\s*){2,})<\/div>/g,
    (_m, inner) => `<div class="rb-numbered-grid">${inner}</div>`,
  );

  return out;
}

export function RichBody({ html, className, style }: RichBodyProps) {
  const enhanced = enhance(html);

  return (
    <div
      className={["rich-prose", className].filter(Boolean).join(" ")}
      style={style}
      data-block="rich-body"
      dangerouslySetInnerHTML={{ __html: enhanced }}
    />
  );
}
