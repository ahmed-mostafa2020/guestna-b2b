import localFont from "next/font/local";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Suspense } from "react";
import { headers } from "next/headers";

import { NextIntlClientProvider } from "next-intl";

import "../globals.css";

import { ProgressBar } from "@feedback/loading/ProgressBar";

import ReduxProvider from "@components/libraries/ReduxProvider";
import QueryProvider from "@components/libraries/QueryProvider";
import GoogleTagManager from "@components/libraries/GoogleTagManager";
import ThemeProvider from "@components/providers/ThemeProvider";

import Header from "@components/layout/header/Header";
import Footer from "@components/layout/footer/Footer";
import { getStructuredDataScript } from "@utils/tracking/structuredData";

// Canonical URL always points to the production domain for SEO
const PRODUCTION_URL = "https://guestna-edu.com";
const isProduction = process.env.VERCEL_ENV === "production";
const SITE_URL = isProduction
  ? PRODUCTION_URL
  : (
      process.env.NEXT_PUBLIC_B2B_VERCEL || "https://guestna-b2b.vercel.app"
    ).replace(/\/$/, "");
const defaultLocale = "ar";
const locales = ["en", "ar"];

const metadataByLocale = {
  ar: {
    title: "منصة جستنا - رحلات تعليمية موثوقة في السعودية",
    description:
      "جستنا تربط المدارس والجهات التعليمية بأفضل مزودي الرحلات والفعاليات في مختلف مدن المملكة مع حلول دفع موثوقة وتقارير فورية.",
    keywords: [
      "رحلات مدرسية",
      "رحلات تعليمية",
      "منصة جستنا",
      "سياحة تعليمية",
      "رحلات طلابية السعودية",
    ],
  },
  en: {
    title: "Guestna Platform – Trusted Educational Trips Across KSA",
    description:
      "Guestna connects schools and organizations with verified trip providers, digital payments, and live tracking for safer educational journeys.",
    keywords: [
      "Guestna",
      "educational trips Saudi",
      "school trips platform",
      "student travel KSA",
      "experiential learning",
    ],
  },
};

const somarSans = localFont({
  src: "../fonts/SomarSans-Medium.woff2",
  variable: "--font-somar-sans",
  weight: "400",
});

export async function generateMetadata({ params: { locale } }) {
  const normalizedLocale = locales.includes(locale) ? locale : defaultLocale;
  const localized = metadataByLocale[normalizedLocale] || metadataByLocale.ar;
  const localeSegment =
    normalizedLocale === defaultLocale ? "ar" : normalizedLocale;
  // Canonical always resolves to production domain regardless of deployment URL
  const canonicalBase = PRODUCTION_URL;
  const localeUrl =
    localeSegment === "ar"
      ? `${canonicalBase}/ar`
      : `${canonicalBase}/${localeSegment}`;

  return {
    metadataBase: new URL(PRODUCTION_URL),
    title: localized.title,
    description: localized.description,
    // Note: keywords meta tag is deprecated and ignored by Google
    category: "travel",
    applicationName: "Guestna",
    authors: [{ name: "Guestna Team", url: SITE_URL }],
    creator: "Guestna",
    publisher: "Guestna",
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    alternates: {
      canonical: localeUrl,
      languages: {
        "ar-SA": `${canonicalBase}/ar`,
        "en-US": `${canonicalBase}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: normalizedLocale === "ar" ? "ar_SA" : "en_US",
      siteName: "Guestna",
      title: localized.title,
      description: localized.description,
      url: localeUrl,
      countryName: "Saudi Arabia",
      images: [
        {
          url: `${SITE_URL}/logo.png`,
          width: 512,
          height: 512,
          alt: "Guestna logo",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@GuestnaApp",
      creator: "@GuestnaApp",
      title: localized.title,
      description: localized.description,
      images: [`${SITE_URL}/logo.png`],
    },
    robots: isProduction
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        }
      : {
          index: false,
          follow: false,
        },
    verification: {
      google: "Dy0yQBQm8XuB6racQHLnnd7zVz2jFPaIMVKzUWq9gwE",
      // Add other verifications as needed:
      // yandex: "your-yandex-verification-code",
      // bing: "your-bing-verification-code",
    },
    manifest: "/manifest.json",
    other: {
      "geo.region": "SA",
      "geo.placename": "Riyadh",
      "geo.position": "24.7136;46.6753",
      ICBM: "24.7136, 46.6753",
      google: "notranslate",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params: { locale } }) {
  if (!locales.includes(locale)) notFound();

  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  // Read the per-request nonce injected by middleware — required for CSP
  const nonce = headers().get("x-nonce") ?? "";

  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const GTM_ID = process.env.NEXT_PUBLIC_GA_TAG_MANAGER_ID;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        {/* GA4 — direct gtag.js in <head> ensures data fires on every page load */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              nonce={nonce}
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              nonce={nonce}
              id="google-analytics"
              strategy="afterInteractive"
            >
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;500;600;700&display=swap&family=Mulish:ital,wght@0,200..1000;1,200..1000&family=Nunito+Sans:wght@700&display=swap"
          rel="stylesheet"
        />

        {/* Apple pay */}
        <link
          rel="stylesheet"
          href="https://cdn.moyasar.com/mpf/1.13.0/moyasar.css"
        />
        <Script
          nonce={nonce}
          src="https://cdn.moyasar.com/mpf/1.13.0/moyasar.js"
          defer
        ></Script>

        <Script
          src="https://polyfill.io/v3/polyfill.min.js?features=fetch"
          async
        ></Script>

        {/* PWA - iOS support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Guestna" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="384x384"
          href="/icons/icon-384x384.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />

        <meta
          name="google-site-verification"
          content="Dy0yQBQm8XuB6racQHLnnd7zVz2jFPaIMVKzUWq9gwE"
        />
        {/* JSON-LD is data, not executable JS — exempt from script-src CSP */}
        <Script
          id={`structured-data-${locale}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: getStructuredDataScript(locale),
          }}
        />
      </head>

      <body
        className={` ${somarSans.variable} text-textDark notranslate`}
        translate="no"
      >
        {/* Tamara pay */}
        <Script
          nonce={nonce}
          strategy="beforeInteractive"
          src="https://cdn.tamara.co/widget-v1/tamara-widget.js"
        />

        <GoogleTagManager gtmId={GTM_ID} />

        <Suspense fallback={<div className="centered">Loading...</div>}>
          <ReduxProvider locale={locale}>
            <QueryProvider>
              <NextIntlClientProvider locale={locale} messages={messages}>
                <ThemeProvider />
                <ProgressBar />
                <Header />
                {children}
                <Footer />
              </NextIntlClientProvider>
            </QueryProvider>
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  );
}
