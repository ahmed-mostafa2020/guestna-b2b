"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

import { usePermissions } from "@hooks/usePermissions";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";
import BookingsTable from "@components/sections/pages/profile/boookings-management/bookings/BookingsTable";
import FiltringTripsByStatus from "@components/sections/pages/profile/boookings-management/bookings/FiltringTripsByStatus";

const BookingsPage = () => {
  const { hasElement } = usePermissions();
  const t = useTranslations();
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  // Prepare the request body with status filter
  const requestBody = selectedStatus
    ? {
        filter: {
          status: selectedStatus,
        },
      }
    : {};

  return (
    <ProtectedProfilePage requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_BOOKINGS_PAGE}>
      <div className="flex flex-col gap-4 lg:gap-6">
      {hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_BOOKINGS_TRIPS_STATUS_TABS
      ) && (
        <FiltringTripsByStatus
          onStatusChange={handleStatusChange}
          activeStatus={selectedStatus || "ALL"}
        />
      )}

      <ProfilePageTemplate
        title={t("profile.aside.bookings")}
        endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.BOOKINGS}`}
        method="POST"
        bodyParameters={requestBody}
        emptyStateComponent={<EmptyBookings />}
        contentComponent={(
          data,
          currentPage,
          setCurrentPage,
          enablePagination
        ) => (
          <BookingsTable
            tableTitle={t("profile.tables.bookings.title")}
            data={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            enablePagination={enablePagination}
          />
        )}
        enablePagination={true}
        key={selectedStatus} // Force re-render when status changes
      />
      </div>
    </ProtectedProfilePage>
  );
};

export default BookingsPage;
