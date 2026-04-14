"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import ProfilePageTemplate from "@components/features/profile/ProfilePageTemplate";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import BookingsTable from "@components/features/profile/bookings-management/bookings/BookingsTable";
import FiltringTripsByStatus from "@components/features/profile/bookings-management/bookings/FiltringTripsByStatus";
import BookingsFilters from "@components/forms/bookings/BookingsFilters";
import CustomEventBooking from "@components/features/profile/bookings-management/bookings/CustomEventBooking";

const BookingsPage = () => {
  const t = useTranslations();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filter, setFilter] = useState({});
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  // Prepare the request body with status and other filters
  const requestBody = useMemo(() => {
    const body = { filter: {} };

    // Add status filter
    if (selectedStatus) {
      body.filter.status = selectedStatus;
    }

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

    // Add search term
    if (filter.searchTerm) {
      body.filter.searchTerm = filter.searchTerm;
    }

    return Object.keys(body.filter).length > 0 ? body : {};
  }, [selectedStatus, filter]);

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_BOOKINGS_PAGE}
    >
      <div className="flex flex-col gap-4 lg:gap-6">
        <FiltringTripsByStatus
          onStatusChange={handleStatusChange}
          activeStatus={selectedStatus || "ALL"}
        />

        {/* Filters Section */}
        <BookingsFilters filter={filter} setFilter={setFilter} />

        <ProfilePageTemplate
          title={t("profile.aside.bookingsManagement.bookings.title")}
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
          key={`${selectedStatus}-${JSON.stringify(filter)}`} // Force re-render when status or filters change
        />
      </div>
      <CustomEventBooking />
    </ProtectedProfilePage>
  );
};

export default BookingsPage;
