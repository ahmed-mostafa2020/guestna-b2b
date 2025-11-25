import localFont from "next/font/local";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Suspense } from "react";

import { NextIntlClientProvider } from "next-intl";

import "../globals.css";

import { ProgressBar } from "@feedback/loading/ProgressBar";

import ReduxProvider from "@components/libraries/ReduxProvider";
import QueryProvider from "@components/libraries/QueryProvider";
import GoogleTagManager from "@components/libraries/GoogleTagManager";
import GoogleAnalytics from "@components/libraries/GoogleAnalytics";
import ThemeProvider from "@components/providers/ThemeProvider";

import Header from "@components/layout/header/Header";
import Footer from "@components/layout/footer/Footer";
import { getStructuredDataScript } from "@utils/structuredData";


const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://guestna-b2b.vercel.app/"
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
  const localeUrl =
    localeSegment === "ar" ? `${SITE_URL}/ar` : `${SITE_URL}/${localeSegment}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: localized.title,
    description: localized.description,
    keywords: localized.keywords,
    category: "travel",
    applicationName: "Guestna",
    alternates: {
      canonical: localeUrl,
      languages: {
        "ar-SA": `${SITE_URL}/ar`,
        "en-US": `${SITE_URL}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: normalizedLocale === "ar" ? "ar_SA" : "en_US",
      siteName: "Guestna",
      title: localized.title,
      description: localized.description,
      url: localeUrl,
      images: [
        {
          url: `${SITE_URL}/logo.png`,
          width: 512,
          height: 512,
          alt: "Guestna logo",
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
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "geo.region": "SA",
      "geo.placename": "Riyadh",
      "geo.position": "24.7136;46.6753",
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
    console.log(error);

    notFound();
  }

  // const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  // const GTM_ID = process.env.NEXT_PUBLIC_GA_TAG_MANAGER_ID;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        {/* GA4 */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-ZNZYTE1FF4`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZNZYTE1FF4');
          `}
        </Script>

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;500;600;700&display=swap&family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />

        {/* Apple pay */}
        <link
          rel="stylesheet"
          href="https://cdn.moyasar.com/mpf/1.13.0/moyasar.css"
        />
        <Script
          src="https://cdn.moyasar.com/mpf/1.13.0/moyasar.js"
          defer
        ></Script>

        <Script
          src="https://polyfill.io/v3/polyfill.min.js?features=fetch"
          async
        ></Script>

        {/* Initialize dataLayer */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
            `,
          }}
        /> */}
        <meta
          name="google-site-verification"
          content="Dy0yQBQm8XuB6racQHLnnd7zVz2jFPaIMVKzUWq9gwE"
        />
        <Script
          id={`structured-data-${locale}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: getStructuredDataScript(locale),
          }}
        />
      </head>

      <body className={` ${somarSans.variable} text-textDark`}>
        {/* Tamara pay */}
        <Script
          strategy="beforeInteractive"
          src="https://cdn.tamara.co/widget-v1/tamara-widget.js"
        />

        <GoogleTagManager
          //  gtmId={GTM_ID}
          gtmId="GTM-PLN2P4N6"
        />

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

        <GoogleAnalytics
          // measurementId={GA_MEASUREMENT_ID}
          measurementId="G-ZNZYTE1FF4"
        />
      </body>
    </html>
  );
}
