"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import ErrorComponent from "@feedback/error/ErrorComponent";

import EventsFilters from "@components/forms/events/EventsFilters";
import EventsTable from "@components/features/profile/events/EventsTable";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import { SORTING_TYPE } from "@constants/sorting";

const EventsPage = () => {
  const locale = useLocale();
  const t = useTranslations();

  // State for filters
  const [filter, setFilter] = useState({
    searchTerm: "",
    sort: SORTING_TYPE.NEWEST,
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Set page title
  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t("profile.events.title")}`;
  }, [t]);

  // Reset to page 1 when search or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter.searchTerm, filter.sort]);

  // Prepare request body with pagination and filters
  const requestBody = useMemo(() => {
    const body = {
      page: currentPage,
      perPage: 10,
      sort: filter.sort || SORTING_TYPE.NEWEST,
      filter: {},
    };

    if (filter.searchTerm) {
      body.filter.searchTerm = filter.searchTerm.trim();
    }

    return body;
  }, [filter, currentPage]);

  // Fetch Event Trips
  const { data, error, isLoading } = useFetchData(
    B2B_END_POINTS.PROFILE.EVENTS,
    requestBody,
    {
      method: "GET",
      lang: locale,
      // Include page and filter values in query key to auto-refetch
      queryKeySuffix: `events-page-${currentPage}-sort-${filter.sort}-search-${filter.searchTerm || "none"}`,
      enabled: true,
    }
  );

  if (error) {
    return (
      <ProtectedProfilePage
        requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE}
      >
        <ErrorComponent
          statusCode={error?.response?.data?.statusCode}
          errorMessage={error?.response?.data?.message}
        />
      </ProtectedProfilePage>
    );
  }

  // Handle when data is completely empty (after loading finishes)
  const isEmpty =
    !isLoading && (!data || !data.nodes || data.nodes.length === 0);

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE}
    >
      <div className="flex flex-col gap-4 lg:gap-6">
        {/* Filters */}
        <EventsFilters filter={filter} setFilter={setFilter} />

        {/* List / Table Section */}
        {isEmpty ? (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <EmptyBookings
              title={t("profile.events.noEvents")}
              subTitle=""
              hasLink={false}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <EventsTable
              data={data}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              enablePagination={true}
              loading={isLoading}
            />
          </div>
        )}
      </div>
    </ProtectedProfilePage>
  );
};

export default EventsPage;
