const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://guestna.app";
const LOGO_URL = `${SITE_URL}/logo.png`;

const getLocalizedBasePath = (locale = "ar") =>
  locale === "ar" ? `${SITE_URL}/ar` : `${SITE_URL}/${locale}`;

const businessAddress = {
  "@type": "PostalAddress",
  streetAddress: "King Abdullah Financial District",
  addressLocality: "Riyadh",
  addressRegion: "Riyadh",
  postalCode: "12222",
  addressCountry: "SA",
};

const geoCoordinates = {
  "@type": "GeoCoordinates",
  latitude: 24.7136,
  longitude: 46.6753,
};

const sameAsLinks = [
  "https://www.linkedin.com/company/guestna",
  "https://www.instagram.com/guestna.app",
  "https://x.com/GuestnaApp",
];

const faqByLocale = {
  ar: [
    {
      question: "كيف تضمن جستنا سلامة الرحلات التعليمية؟",
      answer:
        "نراجع مزودي الخدمات المعتمدين، ونوفر خطط سلامة موقعة، مع تأمين فوري وتنبيهات حالة الرحلة للمدارس.",
    },
    {
      question: "ما طرق الدفع المتاحة للمدارس؟",
      answer:
        "ندعم التحويل البنكي، والدفع الإلكتروني عبر مدى، وتجزئة الفواتير المعتمدة من وزارة التعليم.",
    },
  ],
  en: [
    {
      question: "How does Guestna vet trip providers?",
      answer:
        "We onboard only licensed providers, verify insurance, and share live compliance reports with admins.",
    },
    {
      question: "What payment flows are supported?",
      answer:
        "Schools can pay via bank transfers, Mada, or staged invoices synced with Ministry of Education approvals.",
    },
  ],
};

export const getStructuredData = (locale = "ar") => {
  const baseUrl = getLocalizedBasePath(locale);
  const localizedName = locale === "ar" ? "منصة جستنا" : "Guestna Platform";
  const phone = "+966547534666";
  const inLanguage = locale === "ar" ? "ar-SA" : "en-US";

  const organization = {
    "@type": "Organization",
    name: localizedName,
    alternateName: "Guestna",
    url: baseUrl,
    logo: LOGO_URL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: phone,
        email: "support@guestna.app",
        areaServed: "SA",
        availableLanguage: ["Arabic", "English"],
      },
    ],
    sameAs: sameAsLinks,
  };

  const localBusiness = {
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}#local-business`,
    name: localizedName,
    image: LOGO_URL,
    url: baseUrl,
    telephone: phone,
    email: "support@guestna.app",
    priceRange: "SAR",
    address: businessAddress,
    geo: geoCoordinates,
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: sameAsLinks,
  };

  const webSite = {
    "@type": "WebSite",
    url: baseUrl,
    name: localizedName,
    inLanguage,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const service = {
    "@type": "Service",
    name:
      locale === "ar"
        ? "حلول تنظيم الرحلات التعليمية"
        : "Educational Trip Orchestration",
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    provider: {
      "@type": "Organization",
      name: "Guestna",
      url: SITE_URL,
    },
    url: baseUrl,
    availableLanguage: ["Arabic", "English"],
  };

  const faq = {
    "@type": "FAQPage",
    mainEntity: (faqByLocale[locale] || faqByLocale.ar).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, localBusiness, webSite, service, faq],
  };
};

export const getStructuredDataScript = (locale = "ar") =>
  JSON.stringify(getStructuredData(locale));
