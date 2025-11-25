const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://guestna-b2b.vercel.app"
).replace(/\/$/, "");

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
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
        ],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

