const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://guestna-b2b.vercel.app"
).replace(/\/$/, "");

const locales = ["ar", "en"];
const defaultLocale = "ar";

// Public routes that should be in sitemap (excluding auth, profile, checkout, etc.)
const publicRoutes = [
  "", // Homepage
  "/faq",
  "/contact-us",
  "/privacy-policy",
  "/terms-and-conditions",
  "/return-policy",
  "/discover",
  "/packageInfo",
  "/school-register",
];

// Routes that should be excluded from sitemap
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

// Helper to check if route should be excluded
const isExcluded = (path) => {
  return excludedRoutes.some((excluded) => path.startsWith(excluded));
};

// Helper to build alternate language URLs
const buildAlternates = (cleanPath) => {
  const alternates = {};
  locales.forEach((locale) => {
    const hreflang = locale === "ar" ? "ar-SA" : "en-US";
    alternates[hreflang] = `${SITE_URL}/${locale}${
      cleanPath === "/" ? "" : cleanPath
    }`;
  });
  // Add x-default
  alternates["x-default"] = `${SITE_URL}/${defaultLocale}${
    cleanPath === "/" ? "" : cleanPath
  }`;
  return alternates;
};

// Strip locale prefix from path
const stripLocalePrefix = (path) => {
  const cleaned = path.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";
  return cleaned;
};

export default async function sitemap() {
  const baseUrl = SITE_URL;
  const now = new Date().toISOString();

  // Build sitemap entries for all public routes across all locales
  const sitemapEntries = [];

  // Process each public route
  for (const route of publicRoutes) {
    const cleanPath = route === "" ? "/" : route;

    // Skip if excluded
    if (isExcluded(cleanPath)) continue;

    // For each locale, create an entry
    locales.forEach((locale) => {
      const fullPath = `/${locale}${cleanPath === "/" ? "" : cleanPath}`;
      const isHomepage = cleanPath === "/";

      sitemapEntries.push({
        url: `${baseUrl}${fullPath}`,
        lastModified: now,
        changeFrequency: isHomepage ? "daily" : "weekly",
        priority: isHomepage ? 1.0 : 0.8,
        alternates: {
          languages: buildAlternates(cleanPath),
        },
      });
    });
  }

  // If you have dynamic routes (e.g., trips, packages), fetch them here
  // Example:
  // try {
  //   const trips = await fetch(`${baseUrl}/api/trips`).then((res) => res.json());
  //   trips.forEach((trip) => {
  //     locales.forEach((locale) => {
  //       sitemapEntries.push({
  //         url: `${baseUrl}/${locale}/discover/${trip.slug}`,
  //         lastModified: trip.updatedAt || now,
  //         changeFrequency: "weekly",
  //         priority: 0.7,
  //         alternates: {
  //           languages: buildAlternates(`/discover/${trip.slug}`),
  //         },
  //       });
  //     });
  //   });
  // } catch (error) {
  //   console.error("Failed to fetch dynamic routes:", error);
  // }

  return sitemapEntries;
}
