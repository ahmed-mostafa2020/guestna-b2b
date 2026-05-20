const PRODUCTION_URL = "https://guestna-edu.com";
const isProduction = process.env.VERCEL_ENV === "production";
const SITE_URL = isProduction
  ? PRODUCTION_URL
  : (process.env.NEXT_PUBLIC_B2B_VERCEL || "https://guestna-b2b.vercel.app").replace(/\/$/, "");

const disallowedPaths = [
  "/api",
  "/git-dashboard",
  "/*/checkout",
  "/*/profile",
  "/*/confirming-data",
  "/*/bookingStatus",
  "/*/customization",
  "/*/parents",
  "/*/login",
  "/*/signup",
  "/*/forget-password",
  "/*/reset-password",
  "/*/confirm-account",
  "/*/loginAs",
  "/*/appleCallback",
  "/*/googleCallback",
  "/_next",
  "/static",
];

const AI_CRAWLERS = [
  "GPTBot",         // OpenAI
  "ChatGPT-User",   // OpenAI ChatGPT
  "Google-Extended",// Google Bard/Gemini
  "anthropic-ai",   // Anthropic Claude (legacy)
  "ClaudeBot",      // Anthropic Claude (new)
  "Claude-Web",     // Anthropic Claude web
  "Applebot",       // Apple Intelligence
  "Applebot-Extended", // Apple AI training
  "PerplexityBot",  // Perplexity AI
  "YouBot",         // You.com AI
  "Bytespider",     // TikTok/ByteDance
  "Meta-ExternalAgent", // Meta AI
];

const BLOCKED_BOTS = [
  "AdsBot-Google",
  "Amazonbot",
  "SemrushBot",
  "AhrefsBot",
  "DotBot",
];

function buildRobotsTxt() {
  if (!isProduction) {
    return "User-agent: *\nDisallow: /\n";
  }

  const disallow = disallowedPaths.map((p) => `Disallow: ${p}`).join("\n");

  const mainBlock = `User-agent: *\nAllow: /\n${disallow}`;

  const aiBlocks = AI_CRAWLERS.map(
    (bot) => `\nUser-agent: ${bot}\nAllow: /\n${disallow}`
  ).join("\n");

  const blockedBlocks = BLOCKED_BOTS.map(
    (bot) => `\nUser-agent: ${bot}\nDisallow: /`
  ).join("\n");

  return [
    `Host: ${SITE_URL}`,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Crawl-delay: 1`,
    ``,
    `# Content Signals (https://contentsignals.org/)`,
    `Content-Signal: ai-train=yes, search=yes, ai-input=yes`,
    ``,
    mainBlock,
    aiBlocks,
    ``,
    `# Block ad/scraper bots (saves crawl budget)`,
    blockedBlocks,
    ``,
  ].join("\n");
}

export async function GET() {
  return new Response(buildRobotsTxt(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
