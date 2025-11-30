const SITE_URL = (
  process.env.NEXT_PUBLIC_B2B_VERCEL || "https://guestna-b2b.vercel.app"
).replace(/\/$/, "");

// Disallowed paths
const disallowedPaths = [
  "/api",
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
  // Additional recommended:
  "/_next", // Block internal Next.js files
  "/static", // Block static build files
];

export default function robots() {
  return {
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
    // Reduced crawl delay for faster indexing (1 second is reasonable)
    crawlDelay: 1,

    rules: [
      // Main rule for all crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },

      // AI Crawlers — allow access for training and indexing
      {
        userAgent: "GPTBot", // OpenAI
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "ChatGPT-User", // OpenAI ChatGPT
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Google-Extended", // Google Bard/Gemini
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "anthropic-ai", // Anthropic Claude (legacy)
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "ClaudeBot", // Anthropic Claude (new)
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Claude-Web", // Anthropic Claude web
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Applebot", // Apple Intelligence
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Applebot-Extended", // Apple AI training
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "PerplexityBot", // Perplexity AI
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "YouBot", // You.com AI
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Bytespider", // TikTok/ByteDance
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Meta-ExternalAgent", // Meta AI
        allow: "/",
        disallow: disallowedPaths,
      },

      // Block ad/scraper bots (saves crawl budget)
      {
        userAgent: "AdsBot-Google",
        disallow: "/",
      },
      {
        userAgent: "Amazonbot", // Amazon scraper
        disallow: "/",
      },
      {
        userAgent: "SemrushBot", // SEO tool
        disallow: "/",
      },
      {
        userAgent: "AhrefsBot", // SEO tool
        disallow: "/",
      },
      {
        userAgent: "DotBot", // Moz/OpenSiteExplorer
        disallow: "/",
      },
    ],
  };
}
