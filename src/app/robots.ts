import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/url-normalization";

/**
 * robots.txt — strategic AI-crawler policy (claude-seo finding H5).
 *
 * NordPush sells GEO (Generative Engine Optimization) as a service, so the
 * robots.txt itself must demonstrate a deliberate AI-crawler stance rather
 * than the default `User-agent: *` / Allow: / wildcard. This file
 * distinguishes three bot categories:
 *
 * 1. Retrieval bots (live AI answers) — explicitly allowed.
 *    These fetch pages on-demand when users ask questions in ChatGPT,
 *    Perplexity, Google AI Overviews, Bing Copilot etc. Blocking them
 *    removes NordPush from AI-generated responses — directly against
 *    our own GEO offering. Examples: OAI-SearchBot, ChatGPT-User,
 *    PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended,
 *    Claude-SearchBot, DuckAssistBot, Meta-ExternalAgent.
 *
 * 2. Training bots with transparent policies — explicitly allowed.
 *    These crawl for model-training corpora but come from operators with
 *    public opt-out mechanisms and identifiable user-agents (GPTBot,
 *    ClaudeBot, anthropic-ai). Brand-recognition benefit outweighs IP
 *    concerns for a service agency.
 *
 * 3. Aggressive / opaque training bots — explicitly disallowed.
 *    CCBot (Common Crawl) and Bytespider (ByteDance/TikTok) are known
 *    for aggressive crawl rates and unclear downstream usage. Blocking
 *    them signals quality expectations on the training corpora
 *    NordPush ends up in, without sacrificing retrieval-layer visibility.
 *
 * The trailing `User-agent: *` / Allow: / remains as default for every
 * other crawler (Googlebot, Bingbot, generic tools, etc.).
 *
 * Order matters in robots.txt: more-specific user-agent blocks are
 * evaluated before the wildcard. Next.js' MetadataRoute.Robots emits
 * rules in array order.
 */

// Bots we explicitly welcome — retrieval + transparent training
const ALLOWED_AI_AGENTS = [
  // --- Retrieval: live AI-answer fetching ---
  "OAI-SearchBot", // OpenAI SearchGPT / ChatGPT Search
  "ChatGPT-User", // ChatGPT on-demand browse
  "PerplexityBot", // Perplexity indexing
  "Perplexity-User", // Perplexity on-demand fetch
  "Claude-SearchBot", // Anthropic retrieval (Claude with web access)
  "Google-Extended", // Google AI Overviews / Gemini
  "Applebot-Extended", // Apple Intelligence retrieval
  "DuckAssistBot", // DuckDuckGo AI
  "Meta-ExternalAgent", // Meta AI fetcher
  "Amazonbot", // Amazon Alexa / Rufus
  // --- Training: operators with transparent opt-out ---
  "GPTBot", // OpenAI model-training corpus
  "ClaudeBot", // Anthropic model-training corpus
  "anthropic-ai", // legacy Anthropic agent
];

// Bots explicitly disallowed — aggressive or opaque training crawlers
const DISALLOWED_AI_AGENTS = [
  "CCBot", // Common Crawl — aggressive, downstream usage opaque
  "Bytespider", // ByteDance/TikTok — aggressive crawl patterns
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1. Explicit allowlist — each bot gets its own block so tools that
      //    audit robots.txt can list the stance per agent cleanly.
      ...ALLOWED_AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
      // 2. Explicit denylist.
      ...DISALLOWED_AI_AGENTS.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
      // 3. Default — everyone else (Googlebot, Bingbot, generic tools) is welcome.
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
