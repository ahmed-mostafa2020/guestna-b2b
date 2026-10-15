"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import ProfilePageTemplate from "@components/features/profile/ProfilePageTemplate";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import DataTableSkeleton from "@components/ui/DataTable/DataTableSkeleton";
import BookingsTable from "@components/features/profile/bookings-management/bookings/BookingsTable";
import FiltringTripsByStatus from "@components/features/profile/bookings-management/bookings/FiltringTripsByStatus";
import BookingsFilters from "@components/forms/bookings/BookingsFilters";
import CustomEventBooking from "@components/features/profile/bookings-management/bookings/CustomEventBooking";
import GraduationEventBooking from "@components/features/profile/bookings-management/bookings/GraduationEventBooking";

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
          skeletonComponent={
            <DataTableSkeleton
              title={t("profile.tables.bookings.title")}
              columns={[
                {
                  label: t("profile.tables.bookings.header.orderId"),
                  width: 90,
                },
                {
                  label: t("profile.tables.bookings.header.organization"),
                  width: 140,
                },
                {
                  label: t("profile.tables.bookings.header.tripName"),
                  width: 130,
                },
                {
                  label: t("profile.tables.bookings.header.targetTrack"),
                  width: 110,
                },
                { label: t("profile.tables.bookings.header.date"), width: 95 },
                { label: t("profile.infoCards.totalStudents"), width: 30 },
                {
                  label: t("profile.tables.bookings.header.budget"),
                  width: 70,
                },
              ]}
              actionsLabel={t("profile.tables.bookings.header.actions")}
              actionsPermissions={[
                PERMISSIONS.ELEMENT.B2B_PROFILE_BOOKINGS_SHOWTRIPDETAILS_BUTTON,
              ]}
            />
          }
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

      <hr className="my-6 border-gray-200" />

      <GraduationEventBooking />

      <hr className="my-6 border-gray-200" />

      <CustomEventBooking />
    </ProtectedProfilePage>
  );
};

export default BookingsPage;
