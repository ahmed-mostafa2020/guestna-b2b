"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import ProfilePageTemplate from "@components/features/profile/ProfilePageTemplate";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import MyBookingsTrips from "@components/features/profile/myBookings";

const BookingsPage = () => {
  const t = useTranslations();

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_BOOKINGS_PAGE}
    >
      <ProfilePageTemplate
        title={t("profile.aside.bookings")}
        endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS}`}
        method="POST"
        emptyStateComponent={<EmptyBookings />}
        contentComponent={(data) => <MyBookingsTrips data={data} />}
      />
    </ProtectedProfilePage>
  );
};

export default BookingsPage;
