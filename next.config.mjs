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
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://api.moyasar.com",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
