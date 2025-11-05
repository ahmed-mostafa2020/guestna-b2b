"use client";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import pageResponse from "@constants/response";
import { useFetchData } from "@hooks/useFetchData";

import PageHeader from "@components/sections/pages/schoolRegister/PageHeader";
import SchoolRegisterForm from "@components/forms/schoolRegisterForm";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";

const SchoolRegisterPage = () => {
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.schoolRegister"
    )}`;
  }, [t]);

  // Fetch page data (cities, roles, educationSystems) using useFetchData
  const { data, isLoading, error } = useFetchData(
    B2B_END_POINTS.SCHOOL_REGISTER.PAGE,
    {},
    {
      method: "GET",
      lang: locale,
    }
  );

  // Use fetched data or fallback to static data
  const pageData = data?.data || pageResponse;

  // Log error but continue with fallback data
  if (error) {
    console.error("Error fetching page data:", error);
  }

  return (
    <>
      <PageHeader />

      {isLoading ? (
        <FullScreenLoading status="pending" />
      ) : (
        <SchoolRegisterForm
          cities={pageData?.cities || []}
          roles={pageData?.roles || []}
          educationSystems={pageData?.educationSystems || []}
        />
      )}
    </>
  );
};

export default SchoolRegisterPage;
