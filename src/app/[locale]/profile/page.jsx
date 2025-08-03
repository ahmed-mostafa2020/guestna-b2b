"use client";

import { useTranslations } from "next-intl";

import { useEffect } from "react";

import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import MyBookingsTrips from "@components/sections/pages/profile/myBookings";

const Profile = () => {
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.profile"
    )}`;
  }, [t]);

  return (
    <>
      <ProfilePageTemplate
        title={t("profile.aside.bookings")}
        tableTitle={t("profile.aside.bookings")}
        endpoint={`${B2B_END_POINTS.MAIN}${B2B_END_POINTS.PROFILE.BOOKINGS}`}
        method="POST"
        emptyStateComponent={<EmptyBookings />}
        contentComponent={(data) => <MyBookingsTrips data={data} />}
      />
    </>
  );
};

export default Profile;
