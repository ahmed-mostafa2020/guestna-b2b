"use client";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import { useFetchData } from "@hooks/useFetchData";
import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

import InfoCardsListing from "@components/sections/pages/profile/trips/infoCards/InfoCardsListing";
import RevenueLineChart from "@components/sections/pages/profile/trips/charts/RevenueLineChart";
import DonutChart from "@components/sections/pages/profile/trips/charts/DonutChart";

import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";
import MyBookingsTrips from "@components/sections/pages/profile/myBookings";

const Profile = () => {
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
    }
  );

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
    <main className="flex flex-col gap-6">
      <InfoCardsListing infoData={infoData} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <RevenueLineChart infoData={infoData} />
        </div>
        <div className="lg:col-span-4">
          <DonutChart infoData={infoData} />
        </div>
      </div>

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
    </main>
  );
};

export default Profile;
