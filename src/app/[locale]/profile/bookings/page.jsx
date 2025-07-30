"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";
import MyBookingsTrips from "@components/sections/pages/profile/myBookings";

const BookingsPage = () => {
  const t = useTranslations();

  return (
    <ProfilePageTemplate
      title={t("profile.aside.bookings")}
      endpoint={`${B2B_END_POINTS.MAIN}${B2B_END_POINTS.PROFILE.BOOKINGS}`}
      method="POST"
      emptyStateComponent={<EmptyBookings />}
      contentComponent={(data) => <MyBookingsTrips data={data} />}
    />
  );
};

export default BookingsPage;
