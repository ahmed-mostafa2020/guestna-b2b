"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyTrips from "@components/sections/pages/profile/trips/EmptyTrips";
import PackagesTable from "@components/sections/pages/profile/trips/PackagesTable";

const PackagesTripsPage = () => {
  const t = useTranslations();

  return (
    <ProfilePageTemplate
      title={t("profile.aside.packages")}
      endpoint={`${B2B_END_POINTS.MAIN}${B2B_END_POINTS.PROFILE.TRIPS.PACKAGES}`}
      method="POST"
      emptyStateComponent={<EmptyTrips />}
      contentComponent={(data) => <PackagesTable data={data} />}
      // filterButtons={filterButtons}
      // additionalParams={{ lang: locale }}
    />
  );
};

export default PackagesTripsPage;
