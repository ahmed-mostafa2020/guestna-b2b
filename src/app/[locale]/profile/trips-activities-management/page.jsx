"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import PackagesTable from "@components/sections/pages/profile/trips/PackagesTable";
import ActivitiesTable from "@components/sections/pages/profile/trips/ActivitiesTable";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";

const TripsPage = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 lg:gap:8">
      <ProfilePageTemplate
        title={t("profile.aside.tripsManagement.title")}
        endpoint={`${B2B_END_POINTS.PROFILE.ALL_TRIPS.ACTIVITIES}`}
        method="POST"
        emptyStateComponent={<EmptyBookings />}
        contentComponent={(
          data,
          currentPage,
          setCurrentPage,
          enablePagination
        ) => (
          <ActivitiesTable
            tableTitle={t("common.activities")}
            data={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            enablePagination={enablePagination}
          />
        )}
        enablePagination={true}
      />

      <ProfilePageTemplate
        title={t("profile.aside.tripsManagement.title")}
        endpoint={`${B2B_END_POINTS.PROFILE.ALL_TRIPS.PACKAGES}`}
        method="POST"
        emptyStateComponent={<EmptyBookings />}
        contentComponent={(
          data,
          currentPage,
          setCurrentPage,
          enablePagination
        ) => (
          <PackagesTable
            tableTitle={t("common.packages")}
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
