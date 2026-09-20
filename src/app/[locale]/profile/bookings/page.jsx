"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import { SORTING_TYPE } from "@constants/sorting";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import ProfilePageTemplate from "@components/features/profile/ProfilePageTemplate";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import MyBookingsTrips from "@components/features/profile/myBookings";
import BookingsTableSkeleton from "@components/features/profile/myBookings/BookingsTableSkeleton";

const BookingsPage = () => {
  const t = useTranslations();

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_BOOKINGS_PAGE}
    >
      <ProfilePageTemplate
        title={t("profile.aside.bookings")}
        endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS}`}
        method="POST"
        initialSort={SORTING_TYPE.NEWEST_DAY}
        skeletonComponent={
          <BookingsTableSkeleton tableTitle={t("profile.aside.bookings")} />
        }
        emptyStateComponent={<EmptyBookings />}
        contentComponent={(
          data,
          currentPage,
          setCurrentPage,
          enablePagination,
          searchTerm,
          setSearchTerm,
          handleRefetch,
          sort,
          setSort,
          isLoading
        ) => (
          <MyBookingsTrips
            data={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            enablePagination={enablePagination}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sort={sort}
            setSort={setSort}
            loading={isLoading}
          />
        )}
      />
    </ProtectedProfilePage>
  );
};

export default BookingsPage;
