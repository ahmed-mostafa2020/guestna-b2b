"use client";

import { useTranslations } from "next-intl";

import { END_POINTS } from "@constants/APIs";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";
import MyBookingsTrips from "@components/sections/pages/profile/myBookings";

const BookingsPage = () => {
  const t = useTranslations();

  const getAllBookings = () => {
    console.log("getAllBookings");
  };

  const getPackagesBookings = () => {
    console.log("getPackagesBookings");
  };

  const getActivitiesBookings = () => {
    console.log("getActivitiesBookings");
  };

  const filterButtons = [
    { name: t("common.all"), handleClick: getAllBookings },
    { name: t("common.packages"), handleClick: getPackagesBookings },
    { name: t("common.activities"), handleClick: getActivitiesBookings },
  ];

  return (
    <ProfilePageTemplate
      title={t("profile.aside.favorites")}
      endpoint={`${END_POINTS.PAYMENTS}${END_POINTS.PROFILE.MY_BOOKINGS}`}
      emptyStateComponent={<EmptyBookings />}
      contentComponent={<MyBookingsTrips />}
      filterButtons={filterButtons}
      // additionalParams={{ lang: locale }}
    />
  );
};

export default BookingsPage;
