"use client";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import { useFetchData } from "@hooks/useFetchData";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";
import { PERMISSIONS } from "@constants/permissions";
import InfoCardsSkeleton from "@components/sections/pages/profile/trips/infoCards/InfoCardsSkeleton";
import InfoCardsListing from "@components/sections/pages/profile/trips/infoCards/InfoCardsListing";
import { usePermissions } from "@hooks/usePermissions";

const page = () => {
  const { hasElement } = usePermissions();

  const locale = useLocale();
  const t = useTranslations();

  const { data, error, isLoading } = useFetchData(
    `${B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.STUDENTS.ALL_STUDENTS}`,
    {},
    {
      method: "GET",
      lang: locale,
    }
  );

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.students"
    )}`;
  }, [t]);

  if (isLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );

  if (error)
    return (
      <ErrorComponent
        statusCode={error.response?.data?.statusCode}
        errorMessage={error.response?.data?.message}
      />
    );

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE}
    >
      <main className="flex flex-col gap-6 min-h-screen">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium text-titleColor">
            {t("profile.aside.schoolTeamManagement.studentsOverview.title")}
          </h1>
          <p className="text-textLight">
            {t(
              "profile.aside.schoolTeamManagement.studentsOverview.description"
            )}
          </p>
        </section>
        {/* Info Cards Section */}
        {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CARDS) &&
          (isLoading ? (
            <InfoCardsSkeleton showIcon={false} textAlign="center" />
          ) : (
            <InfoCardsListing
              infoData={data?.summary}
              showIcon={false}
              textAlign="center"
            />
          ))}
      </main>
    </ProtectedProfilePage>
  );
};

export default page;
