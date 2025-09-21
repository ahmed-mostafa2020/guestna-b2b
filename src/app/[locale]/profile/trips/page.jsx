"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyTrips from "@components/sections/pages/profile/trips/EmptyTrips";
import PackagesTable from "@components/sections/pages/profile/trips/PackagesTable";
import ActivitiesTable from "@components/sections/pages/profile/trips/ActivitiesTable";

const TripsPage = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 lg:gap:8">
      <ProfilePageTemplate
        title={t("profile.aside.programs.trips")}
        tableTitle={t("common.activities")}
        endpoint={`${B2B_END_POINTS.PROFILE.ALL_TRIPS.ACTIVITIES}`}
        method="POST"
        emptyStateComponent={<EmptyTrips />}
        contentComponent={(
          data,
          currentPage,
          setCurrentPage,
          enablePagination
        ) => (
          <ActivitiesTable
            data={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            enablePagination={enablePagination}
          />
        )}
        enablePagination={true}
      />

      <ProfilePageTemplate
        title={t("profile.aside.programs.trips")}
        tableTitle={t("common.packages")}
        endpoint={`${B2B_END_POINTS.PROFILE.ALL_TRIPS.PACKAGES}`}
        method="POST"
        emptyStateComponent={<EmptyTrips />}
        contentComponent={(
          data,
          currentPage,
          setCurrentPage,
          enablePagination
        ) => (
          <PackagesTable
            data={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            enablePagination={enablePagination}
          />
        )}
        enablePagination={true}
      />
    </div>
  );
};

export default TripsPage;
