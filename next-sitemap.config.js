const SITE_URL = process.env.SITE_URL || "https://guestna-b2b.vercel.app/";
const locales = ["ar", "en"];
const defaultLocale = "ar";
const hreflangByLocale = {
  ar: "ar-SA",
  en: "en-US",
};

const stripLocalePrefix = (path) => path.replace(/^\/(ar|en)/, "") || "/";


export default {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  autoLastmod: true,
  sitemapSize: 5000,
  priority: 0.7,
  changefreq: "weekly",
  exclude: ["/api/*", "/server-sitemap-index.xml"],
  transform: async (config, path) => {
    const cleanPath = stripLocalePrefix(path);
    const alternateRefs = locales.map((locale) => ({
      href: `${SITE_URL}/${locale}${cleanPath === "/" ? "" : cleanPath}`,
      hreflang: hreflangByLocale[locale],
    }));

    alternateRefs.push({
      href: `${SITE_URL}/${defaultLocale}${cleanPath === "/" ? "" : cleanPath}`,
      hreflang: "x-default",
    });

    return {
      loc: `${SITE_URL}${path}`,
      changefreq: config.changefreq,
      priority: /^(\/(ar|en)\/?)$/.test(path) ? 1 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs,
    };
  },
  robotsTxtOptions: {
    additionalSitemaps: [`${SITE_URL}/sitemap.xml`],
    includeAdditionalSitemaps: true,

    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/api", "/checkout", "/profile", "/confirming-data"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
    ],
  
  },
};
