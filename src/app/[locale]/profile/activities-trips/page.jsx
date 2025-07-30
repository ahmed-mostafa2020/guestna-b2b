"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyTrips from "@components/sections/pages/profile/trips/EmptyTrips";
import ActivitiesTable from "@components/sections/pages/profile/trips/ActivitiesTable";

const ActivitiesTripsPage = () => {
  const t = useTranslations();

  return (
    <ProfilePageTemplate
      title={t("profile.aside.activities")}
      endpoint={`${B2B_END_POINTS.MAIN}${B2B_END_POINTS.PROFILE.TRIPS.ACTIVITIES}`}
      method="POST"
      emptyStateComponent={<EmptyTrips />}
      contentComponent={(data) => <ActivitiesTable data={data} />}
      // filterButtons={filterButtons}
      // additionalParams={{ lang: locale }}
    />
  );
};

export default ActivitiesTripsPage;
