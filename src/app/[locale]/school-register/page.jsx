"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";

import { useEffect } from "react";

import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";

import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import PageHeader from "@components/sections/pages/schoolRegister/PageHeader";
import SchoolRegisterForm from "@components/forms/schoolRegisterForm";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";

const SchoolRegisterPage = () => {
  const userType = useSelector((state) => state.loginForm.loginData?.userType);

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

  // Log error but continue with fallback data
  if (error) {
    console.error("Error fetching page data:", error);
  }

  return (
    <ProtectedProfilePage
      requiredPermission={
        PERMISSIONS.PAGE.B2B_INVITE_SCHOOL_PAGE && userType === "SALES"
      }
    >
      <>
        <PageHeader />

        {isLoading ? (
          <FullScreenLoading status="pending" />
        ) : (
          <SchoolRegisterForm
            cities={data?.cities || []}
            roles={data?.roles || []}
            educationSystems={data?.educationSystems || []}
            stages={data?.stages || []}
          />
        )}
      </>
    </ProtectedProfilePage>
  );
};

export default SchoolRegisterPage;
