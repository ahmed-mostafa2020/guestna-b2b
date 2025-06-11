"use client";

import { useTranslations } from "next-intl";

import { useEffect } from "react";

import ErrorComponent from "@feedback/error/ErrorComponent";

const NotFound = () => {
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.error"
    )}`;
  }, [t]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ErrorComponent
        statusCode="404"
        errorMessage={t("common.errorHappens")}
      />
    </div>
  );
};

export default NotFound;

// "use client";
// import { useRouter } from "next/navigation";

// import { useEffect } from "react";

// export default function Custom404() {
//   const router = useRouter();

//   useEffect(() => {
//     // Redirect to default locale if accessing root
//     if (window.location.pathname === "/") {
//       router.replace("/ar");
//     }
//   }, [router]);

//   return null; // or your custom 404 content
// }
