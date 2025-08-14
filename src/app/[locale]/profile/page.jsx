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
      // onSuccess: setProfile,
      // onError: setProfileError,
      // onLoading: setProfileLoading,
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
        <RevenueLineChart infoData={infoData} />

        <DonutChart infoData={infoData} />
      </div>

      <ProfilePageTemplate
        title={t("profile.aside.bookings")}
        tableTitle={t("profile.aside.bookings")}
        endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS}`}
        method="POST"
        emptyStateComponent={<EmptyBookings />}
        contentComponent={(data) => <MyBookingsTrips data={data} />}
      />
    </main>
  );
};

export default Profile;
