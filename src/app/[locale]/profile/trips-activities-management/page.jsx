"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import TripsManagementTable from "@components/sections/pages/profile/trips/TripsManagementTable";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";
import ManagementFilters from "@components/forms/management/ManagementFilters";

const TripsPage = () => {
  const t = useTranslations();
  const [filter, setFilter] = useState({});

  // Prepare the request body with filters
  const requestBody = useMemo(() => {
    const body = { filter: {} };

    // Add organization filter
    if (filter.organization) {
      body.filter.organizations = [filter.organization];
    }

    // Add track filter
    if (filter.track) {
      body.filter.tracks = [filter.track];
    }

    // Add academicStage filter
    if (filter.academicStage) {
      body.filter.academicStages = [filter.academicStage];
    }

    // Add date filter
    if (filter.day) {
      body.filter.day = filter.day;
    }

    return Object.keys(body.filter).length > 0 ? body : {};
  }, [filter]);

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_TRIPS_MANAGEMENT_PAGE}
    >
      <div className="flex flex-col gap-4 lg:gap-6">
        {/* Filters Section */}
        <ManagementFilters filter={filter} setFilter={setFilter} />

        <ProfilePageTemplate
          title={t("profile.aside.tripsManagement.title")}
          endpoint={`${B2B_END_POINTS.PROFILE.ALL_TRIPS.MANAGEMENT}`}
          method="POST"
          bodyParameters={requestBody}
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
          key={JSON.stringify(filter)}
        />
      </div>
    </ProtectedProfilePage>
  );
};

export default TripsPage;
