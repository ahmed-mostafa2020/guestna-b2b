"use client";

import { useLocale, useTranslations } from "next-intl";

import { useEffect, useState } from "react";

import { useFetchData } from "@hooks/data/useFetchData";
import { usePermissions } from "@hooks/utils/usePermissions";
import ErrorComponent from "@feedback/error/ErrorComponent";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";

import InfoCardsListing from "@components/features/profile/trips/infoCards/InfoCardsListing";
import InfoCardsSkeleton from "@components/features/profile/trips/infoCards/InfoCardsSkeleton";
import RevenueLineChart from "@components/features/profile/trips/charts/RevenueLineChart";
import DonutChart from "@components/features/profile/trips/charts/DonutChart";
import MostActiveOrganizations from "@components/features/profile/trips/charts/MostActiveOrganizations";
import ChartsSkeleton from "@components/features/profile/trips/charts/ChartsSkeleton";

import ProfilePageTemplate from "@components/features/profile/ProfilePageTemplate";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import MyBookingsTrips from "@components/features/profile/myBookings";
import OrganizationsSection from "@components/features/profile/myBookings/OrganizationsSection";

const Profile = () => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();
  const [organizationsSearchTerm, setOrganizationsSearchTerm] = useState("");

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.profile"
    )}`;
  }, [t]);

  const {
    data: infoData,
    isLoading,
    error,
  } = useFetchData(
    `${B2B_END_POINTS.PROFILE.INFO}`,
    {},
    {
      lang: locale,
      enabled:
        hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CARDS) ||
        hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CHARTS),
    }
  );

  const {
    data: mostActiveOrganizationsData,
    isLoading: mostActiveOrganizationsLoading,
    error: mostActiveOrganizationsError,
  } = useFetchData(
    `${B2B_END_POINTS.PROFILE.MOST_ACTIVE_ORGANIZATIONS}`,
    {},
    {
      lang: locale,
      enabled: true, // Explicitly enable this request
      // enabled: hasElement(
      //   PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CHARTS
      // ),
    }
  );

  const {
    data: organizationsData,
    isLoading: organizationsLoading,
    error: organizationsError,
  } = useFetchData(
    `${B2B_END_POINTS.PROFILE.ALL_ORGANIZATIONS}${
      organizationsSearchTerm ? `?searchTerm=${organizationsSearchTerm}` : ""
    }`,
    {},
    {
      lang: locale,
      enabled: true, // Explicitly enable this request
      // enabled: hasElement(
      //   PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CHARTS
      // ),
    },
    [organizationsSearchTerm]
  );

  if (error || mostActiveOrganizationsError || organizationsError)
    return (
      <ProtectedProfilePage
        requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE}
      >
        <ErrorComponent
          statusCode={error?.response?.data?.statusCode}
          errorMessage={error?.response?.data?.message}
        />
      </ProtectedProfilePage>
    );

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE}
    >
      <main className="flex flex-col gap-6 min-h-screen">
        {/* Info Cards Section */}
        {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CARDS) &&
          (isLoading ? (
            <InfoCardsSkeleton />
          ) : (
            <InfoCardsListing infoData={infoData} />
          ))}

        {/* Charts Section */}
        {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CHARTS) &&
          (isLoading || mostActiveOrganizationsLoading ? (
            <ChartsSkeleton />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <RevenueLineChart infoData={infoData} />
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <MostActiveOrganizations
                  mostActiveOrganizationsData={mostActiveOrganizationsData}
                />
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
            enableSearch={true}
            emptyStateComponent={(data, searchTerm, setSearchTerm) => (
              <>
                <MyBookingsTrips
                  tableTitle={t("profile.tables.bookings.title")}
                  data={data}
                  currentPage={1}
                  setCurrentPage={() => {}}
                  enablePagination={false}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <EmptyBookings />
              </>
            )}
            contentComponent={(
              data,
              currentPage,
              setCurrentPage,
              enablePagination,
              searchTerm,
              setSearchTerm
            ) => (
              <MyBookingsTrips
                tableTitle={t("profile.tables.bookings.title")}
                data={data}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                enablePagination={enablePagination}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}
          />
        )}

        <OrganizationsSection
          organizationsData={organizationsData}
          organizationsLoading={organizationsLoading}
          searchTerm={organizationsSearchTerm}
          setSearchTerm={setOrganizationsSearchTerm}
        />
      </main>
    </ProtectedProfilePage>
  );
};

export default Profile;
