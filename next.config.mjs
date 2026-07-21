import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin("./i18n.config.js");

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  workboxOptions: {
    // Avoids workbox-build's separate-chunk path, which sets a Rollup
    // `manualChunks` input option that Rollup 4 (pinned via the
    // package.json `overrides`/`resolutions` for security) rejects with
    // "Unknown input options: manualChunks".
    inlineWorkboxRuntime: true,
  },
});

// Sentry routing per environment:
// - "Production" is ONLY the real production domains (guestna-edu.com,
//   shop.guestna-edu.com). The build pipeline for those domains must set
//   SENTRY_ENV=production. Errors go to the "guestna" org / "guestna-edu"
//   project and source maps upload with SENTRY_PRODUCTION_AUTH_TOKEN.
// - Everything else — Vercel (preview AND production deploys), Netlify
//   (all contexts), local dev, local builds — is treated as test. Errors
//   go to the "any-2y" org / "httpsshopguestna-educom" project and source
//   maps upload with SENTRY_AUTH_TOKEN.
//
// DSNs read from env vars with hardcoded fallbacks so local/preview builds
// still work without env config. A Sentry DSN is a public client key
// (embedded in the browser bundle by design) — moving it to env is repo
// hygiene, not a security boundary.
const TEST_SENTRY = {
  dsn:
    process.env.SENTRY_TEST_DSN ||
    "https://47dd633ac91bb97e9ceefca2a80344c0@o4505710840709120.ingest.us.sentry.io/4510176638599168",
  org: process.env.SENTRY_TEST_ORG || "any-2y",
  project: process.env.SENTRY_TEST_PROJECT || "httpsshopguestna-educom",
};

const PRODUCTION_SENTRY = {
  dsn:
    process.env.SENTRY_PRODUCTION_DSN ||
    "https://be251a860c8f04870429cf1952005354@o4511376548495360.ingest.de.sentry.io/4511376656236624",
  org: process.env.SENTRY_PRODUCTION_ORG || "guestna",
  project: process.env.SENTRY_PRODUCTION_PROJECT || "guestna-edu",
};

const isProductionDeploy = process.env.SENTRY_ENV === "production";

const sentryTarget = isProductionDeploy ? PRODUCTION_SENTRY : TEST_SENTRY;
const sentryAuthToken = isProductionDeploy
  ? process.env.SENTRY_PRODUCTION_AUTH_TOKEN
  : process.env.SENTRY_AUTH_TOKEN;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hide Next.js version from response headers (prevents server fingerprinting)
  poweredByHeader: false,

  // Expose the resolved Sentry DSN + environment label to client + server
  // bundles so the Sentry.init() calls in sentry.*.config.js /
  // instrumentation-client.js can pick them up at runtime.
  env: {
    NEXT_PUBLIC_SENTRY_DSN: sentryTarget.dsn,
    NEXT_PUBLIC_SENTRY_ENVIRONMENT: isProductionDeploy ? "production" : "test",
  },

  redirects: async () => {
    if (process.env.REDIRECT_DOMAIN) {
      return [
        {
          source: "/:path*",
          destination: `${process.env.REDIRECT_DOMAIN}/:path*`,
          permanent: false,
          basePath: false,
        },
      ];
    }
    return [];
  },

  rewrites: async () => {
    return [
      {
        source: "/:path((?!api|_next|.*\\..*)(?!en|ar).*)",
        destination: "/ar/:path*",
        locale: false,
      },
      // Apple Pay domain verification rewrites
      {
        source: "/.well-known/apple-developer-merchantid-domain-association",
        destination: "/apple-developer-merchantid-domain-association",
      },
      {
        source:
          "/.well-known/apple-developer-merchantid-domain-association.txt",
        destination: "/apple-developer-merchantid-domain-association.txt",
      },
    ];
  },

  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    domains: [
      "res.cloudinary.com",
      "ik.imagekit.io",
      "storage.googleapis.com",
      "drive.google.com",
      "cultural-enrika-guestna-43d7043d.koyeb.app",
      "guestna-revamp-dashboard.vercel.app",
      "localhost",
      "34.166.65.116",
    ],
  },
  async headers() {
    const isDevelopment = process.env.NODE_ENV === "development";
    const isProduction = process.env.VERCEL_ENV === "production";

    // No cache in development to prevent stale styles during development
    const staticAssetsCacheHeaders = [
      {
        key: "Cache-Control",
        value: isDevelopment
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=86400, stale-while-revalidate=604800",
      },
    ];

    // Immutable cache only for Next.js build assets (they have content hashes)
    const immutableCacheHeaders = [
      {
        key: "Cache-Control",
        value: isDevelopment
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=31536000, immutable",
      },
    ];

    const securityHeaders = [
      // Prevent MIME type sniffing attacks
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      // Prevent clickjacking attacks
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      // Control referrer information sent with requests
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      // Restrict access to browser features
      {
        key: "Permissions-Policy",
        value: "camera=(self), microphone=(self), geolocation=(self)",
      },
      // Force HTTPS for 2 years, include subdomains, allow preload list submission
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      // Basic XSS protection for older browsers
      {
        key: "X-XSS-Protection",
        value: "1; mode=block",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: [
          // NOTE: Content-Security-Policy is set dynamically in middleware.js
          // with a per-request nonce — do not add a static CSP here or it
          // will override the nonce-based one and break inline scripts.
          ...securityHeaders,
          // Block indexing on all non-production deployments (preview, branch, local)
          ...(!isProduction
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
            : []),
          // Only expose semantic Link relations in headers — preconnect / dns-prefetch
          // hints are emitted as inline <link> tags in [locale]/layout.jsx so the
          // third-party host list does not leak via response headers.
          {
            key: "Link",
            value:
              '</sitemap.xml>; rel="sitemap", ' +
              '</llms.txt>; rel="describedby"',
          },
        ],
      },
      // SEO files cache (1 hour)
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/llms.txt",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      // Next.js build files have content hashes, safe to cache immutably
      {
        source: "/_next/static/:path*",
        headers: immutableCacheHeaders,
      },
      // Images and fonts - shorter cache
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf|eot)",
        headers: staticAssetsCacheHeaders,
      },
      // CSS and JS files - shorter cache to prevent stale styles
      {
        source: "/:all*(css|js)",
        headers: staticAssetsCacheHeaders,
      },
    ];
  },
};

export default withSentryConfig(
  withPWA(withNextIntl(nextConfig)),
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: sentryTarget.org,

    project: sentryTarget.project,

    authToken: sentryAuthToken,

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Hides source files from uploaded source maps (increases privacy)
    hideSourceMaps: true,

    // Tunnel Sentry requests through our own domain so the DSN host does not
    // appear in browser network panels or 3rd-party blocklists. Sentry rewrites
    // /monitoring/* to its ingest endpoint at build time.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
  {
    // Additional webpack plugin options
    // Upload source maps during production builds
    sourcemaps: {
      disable: process.env.NODE_ENV !== "production",
    },
  }
);
