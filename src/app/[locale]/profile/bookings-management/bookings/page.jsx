"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";
import BookingsTable from "@components/sections/pages/profile/boookings-management/bookings/BookingsTable";
import FiltringTripsByStatus from "@components/sections/pages/profile/boookings-management/bookings/FiltringTripsByStatus";

const BookingsPage = () => {
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
    <div className="flex flex-col gap-4 lg:gap-6">
      <FiltringTripsByStatus
        onStatusChange={handleStatusChange}
        activeStatus={selectedStatus || "ALL"}
      />

      <ProfilePageTemplate
        title={t("profile.aside.bookings")}
        tableTitle={t("profile.tables.bookings.title")}
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
  );
};

export default BookingsPage;
