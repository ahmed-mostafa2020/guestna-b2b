"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";
import BookingsTable from "@components/sections/pages/profile/boookings-management/bookings/BookingsTable";

const BookingsPage = () => {
  const t = useTranslations();

  return (
    <ProfilePageTemplate
      title={t("profile.aside.bookings")}
      tableTitle={t("profile.tables.reports.title")}
      subTitle={t("profile.tables.reports.subTitle")}
      endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.BOOKINGS}`}
      method="POST"
      emptyStateComponent={<EmptyBookings />}
      contentComponent={(data) => <BookingsTable data={data} />}
    />
  );
};

export default BookingsPage;
