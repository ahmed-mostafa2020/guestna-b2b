import axios from "axios";
import { B2B_END_POINTS } from "../constants/b2bAPIs";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://guestna-b2b.vercel.app"
).replace(/\/$/, "");

const locales = ["ar", "en"];
const defaultLocale = "ar";

// Public static routes
const publicRoutes = [
  "/", // Homepage
  "/faq",
  "/contact-us",
  "/privacy-policy",
  "/terms-and-conditions",
  "/return-policy",
  "/discover",
  "/packageInfo",
  "/school-register",
  "/about-us", // Add if exists
];

// Excluded (private) routes
const excludedRoutes = [
  "/api",
  "/checkout",
  "/profile",
  "/confirming-data",
  "/bookingStatus",
  "/customization",
  "/parents",
  "/login",
  "/signup",
  "/forget-password",
  "/reset-password",
  "/confirm-account",
  "/loginAs",
  "/appleCallback",
  "/googleCallback",
];

// Check if route is excluded
const isExcluded = (path) =>
  excludedRoutes.some((excluded) => path.startsWith(excluded));

// Build hreflang
const buildAlternates = (cleanPath) => {
  const alternates = {};

  locales.forEach((locale) => {
    const hreflang = locale === "ar" ? "ar-SA" : "en-US";
    alternates[hreflang] = `${SITE_URL}/${locale}${
      cleanPath === "/" ? "" : cleanPath
    }`;
  });

  alternates["x-default"] = `${SITE_URL}/${defaultLocale}${
    cleanPath === "/" ? "" : cleanPath
  }`;

  return alternates;
};

export default async function sitemap() {
  const now = new Date().toISOString();
  const sitemapEntries = [];

  // --------------------------
  // 1️⃣ Static public routes
  // --------------------------

  publicRoutes.forEach((route) => {
    const cleanPath = route === "/" ? "/" : route;

    if (isExcluded(cleanPath)) return;

    locales.forEach((locale) => {
      const fullPath = `/${locale}${cleanPath === "/" ? "" : cleanPath}`;
      const isHomepage = cleanPath === "/";

      sitemapEntries.push({
        url: `${SITE_URL}${fullPath}`,
        lastModified: now,
        changeFrequency: isHomepage ? "daily" : "weekly",
        priority: isHomepage ? 1.0 : 0.8,
        alternates: { languages: buildAlternates(cleanPath) },
      });
    });
  });

  // --------------------------
  // 2️⃣ Dynamic: Trips / Discover Slugs
  // --------------------------

  try {
    const response = await axios.get(
      `${SITE_URL}/api/proxy?path=${B2B_END_POINTS.ALL_MARKET_PLACE_SLUGS}`,
      { timeout: 10000 } // Increased timeout
    );

    const trips = response.data || [];

    if (Array.isArray(trips) && trips.length > 0) {
      trips.forEach((trip) => {
        if (trip.slug) {
          locales.forEach((locale) => {
            sitemapEntries.push({
              url: `${SITE_URL}/${locale}/discover/${trip.slug}`,
              lastModified: trip.updatedAt || now,
              changeFrequency: "weekly",
              priority: 0.7,
              alternates: {
                languages: buildAlternates(`/discover/${trip.slug}`),
              },
            });
          });
        }
      });
      console.log(`✅ Added ${trips.length} trips to sitemap`);
    } else {
      console.warn("⚠️ No trips found for sitemap");
    }
  } catch (err) {
    console.error("❌ Failed to fetch trip slugs for sitemap:", err.message);
    // Sitemap continues without dynamic trips - not critical
  }

  // Remove duplicates
  const uniqueEntries = [
    ...new Map(sitemapEntries.map((item) => [item.url, item])).values(),
  ];

  return uniqueEntries;
}
