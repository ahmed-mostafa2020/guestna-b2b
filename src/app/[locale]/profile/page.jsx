"use client";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import { useFetchData } from "@hooks/useFetchData";
import { usePermissions } from "@hooks/usePermissions";
import ErrorComponent from "@feedback/error/ErrorComponent";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";

import InfoCardsListing from "@components/sections/pages/profile/trips/infoCards/InfoCardsListing";
import InfoCardsSkeleton from "@components/sections/pages/profile/trips/infoCards/InfoCardsSkeleton";
import RevenueLineChart from "@components/sections/pages/profile/trips/charts/RevenueLineChart";
import DonutChart from "@components/sections/pages/profile/trips/charts/DonutChart";
import ChartsSkeleton from "@components/sections/pages/profile/trips/charts/ChartsSkeleton";

import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";
import MyBookingsTrips from "@components/sections/pages/profile/myBookings";

const Profile = () => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.profile"
    )}`;
  }, [t]);

  const {
    data: infoData,
    error,
    isLoading,
  } = useFetchData(
    `${B2B_END_POINTS.PROFILE.INFO}`,
    {},
    {
      lang: locale,
      enabled: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CARDS ||
          PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CHARTS
      ),
    }
  );

  // Removed full-screen loader - using skeleton loaders instead

  if (error)
    return (
      <ProtectedProfilePage
        requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE}
      >
        <ErrorComponent
          statusCode={error.response?.data?.statusCode}
          errorMessage={error.response?.data?.message}
        />
      </ProtectedProfilePage>
    );

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE}
    >
      <main className="flex flex-col gap-6">
        {/* Info Cards Section */}
        {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CARDS) &&
          (isLoading ? (
            <InfoCardsSkeleton />
          ) : (
            <InfoCardsListing infoData={infoData} />
          ))}

        {/* Charts Section */}
        {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CHARTS) &&
          (isLoading ? (
            <ChartsSkeleton />
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <RevenueLineChart infoData={infoData} />
              </div>
              <div className="lg:col-span-4">
                <DonutChart infoData={infoData} />
              </div>
            </div>
          ))}

        {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_TRIPS_TABLE) && (
          <ProfilePageTemplate
            title={t("pagesHead.title.profile")}
            endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS}`}
            method="POST"
            enablePagination={true}
            emptyStateComponent={<EmptyBookings />}
            contentComponent={(
              data,
              currentPage,
              setCurrentPage,
              enablePagination
            ) => (
              <MyBookingsTrips
                tableTitle={t("profile.tables.bookings.title")}
                data={data}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                enablePagination={enablePagination}
              />
            )}
          />
        )}
      </main>
    </ProtectedProfilePage>
  );
};

export default Profile;
