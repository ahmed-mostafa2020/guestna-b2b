const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://guestna-b2b.vercel.app"
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
  "/*?*", // Prevent query-parameter duplicates
];

export default function robots() {
  return {
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
    crawlDelay: 5,

    rules: [
      // Main rule for all crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },

      // AI Crawlers — same restrictions as main rule
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: disallowedPaths,
      },

      // Optional: block ad bots (saves crawl budget)
      {
        userAgent: "AdsBot-Google",
        disallow: "/",
      },

    
    ],
  };
}
