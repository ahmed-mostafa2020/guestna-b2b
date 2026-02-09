"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import TripsManagementTable from "@components/sections/pages/profile/trips/TripsManagementTable";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";

const TripsPage = () => {
  const t = useTranslations();

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_TRIPS_MANAGEMENT_PAGE}
    >
      <ProfilePageTemplate
        title={t("profile.aside.tripsManagement.title")}
        endpoint={`${B2B_END_POINTS.PROFILE.ALL_TRIPS.MANAGEMENT}`}
        method="POST"
        emptyStateComponent={<EmptyBookings />}
        contentComponent={(
          data,
          currentPage,
          setCurrentPage,
          enablePagination
        ) => (
          <TripsManagementTable
            tableTitle={t("profile.tables.management.title")}
            data={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            enablePagination={enablePagination}
          />
        )}
        enablePagination={true}
      />
    </ProtectedProfilePage>
  );
};

export default TripsPage;
