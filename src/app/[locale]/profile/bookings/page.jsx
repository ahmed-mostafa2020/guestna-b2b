"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProfilePageTemplate from "@components/features/profile/ProfilePageTemplate";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import MyBookingsTrips from "@components/features/profile/myBookings";

const BookingsPage = () => {
  const t = useTranslations();

  return (
    <ProfilePageTemplate
      title={t("profile.aside.bookings")}
      endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS}`}
      method="POST"
      emptyStateComponent={<EmptyBookings />}
      contentComponent={(data) => <MyBookingsTrips data={data} />}
    />
  );
};

export default BookingsPage;
