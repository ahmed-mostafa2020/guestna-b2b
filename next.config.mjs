import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.config.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    domains: [
      "res.cloudinary.com",
      "ik.imagekit.io",
      "storage.googleapis.com",
      "drive.google.com",
      "cultural-enrika-guestna-43d7043d.koyeb.app",
      "localhost",
    ],
  },
  async headers() {
    const immutableCacheHeaders = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ];

    const securityHeaders = [
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(self)",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://api.moyasar.com",
          },
          ...securityHeaders,
          // Preconnect to external domains for faster loading
          {
            key: "Link",
            value:
              "<https://fonts.googleapis.com>; rel=preconnect, " +
              "<https://fonts.gstatic.com>; rel=preconnect; crossorigin, " +
              "<https://www.googletagmanager.com>; rel=preconnect, " +
              "<https://cdn.moyasar.com>; rel=preconnect, " +
              "<https://cdn.tamara.co>; rel=preconnect, " +
              "<https://res.cloudinary.com>; rel=dns-prefetch, " +
              "<https://ik.imagekit.io>; rel=dns-prefetch",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: immutableCacheHeaders,
      },
      {
        source:
          "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|css|js|woff|woff2|ttf|eot)",
        headers: immutableCacheHeaders,
      },
    ];
  },
};

export default withSentryConfig(
  withNextIntl(nextConfig),
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "any-2y",

    project: "httpsshopguestna-educom",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Hides source files from uploaded source maps (increases privacy)
    hideSourceMaps: true,

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
