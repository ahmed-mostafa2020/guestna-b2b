"use client";

import Pagination from "@/src/components/common/Pagination";
import SchoolOverviewCard from "@/src/components/sections/pages/profile/schoolManagementTeam/schoolsOverview/SchoolOverviewCard";
import SearchFilters from "@/src/components/sections/pages/profile/schoolManagementTeam/schoolsOverview/SearchFilters";
import InfoCardsListing from "@/src/components/sections/pages/profile/trips/infoCards/InfoCardsListing";
import InfoCardsSkeleton from "@/src/components/sections/pages/profile/trips/infoCards/InfoCardsSkeleton";
import { B2B_END_POINTS } from "@/src/constants/b2bAPIs";
import { PERMISSIONS } from "@/src/constants/permissions";
import ErrorComponent from "@/src/feedback/error/ErrorComponent";
import FullScreenLoading from "@/src/feedback/loading/FullScreenLoading";
import { useFetchData } from "@/src/hooks/useFetchData";
import { usePermissions } from "@/src/hooks/usePermissions";
import { Box, Grid } from "@material-ui/core";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

const SchoolsOverViewPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const { hasElement } = usePermissions();

  const [page, setPage] = useState(1);
  const sortOptions = ["HIGHEST_NAME", "LOWEST_NAME", "NEWEST", "OLDEST"];

  // ----------------------------------------------------
  // 🔥 UNIFIED SEARCH / FILTER STATE
  // ----------------------------------------------------
  const [searchTerms, setSearchTerms] = useState({
    name: "",
    city: null,
    track: "",
    sort: "NEWEST",
  });

  // ----------------------------------------------------
  // MOCK OPTIONS (Replace with API options later)
  // ----------------------------------------------------

  // ----------------------------------------------------
  // SUMMARY CARDS API
  // ----------------------------------------------------
  const {
    data: staticsData,
    error: staticsError,
    isLoading: staticsLoading,
  } = useFetchData(
    `${B2B_END_POINTS.PROFILE.INFO}`,
    {},
    {
      lang: locale,
      enabled: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CARDS ||
          PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CHARTS
      ),
    }
  );

  // ----------------------------------------------------
  // TABLE DATA API (With Search Terms)
  // ----------------------------------------------------
  const {
    data,
    error,
    isLoading,
    refetch: refetchTable,
  } = useFetchData(
    `${B2B_END_POINTS.PROFILE.ORGANIZATIONS.ALL}`,
    {},
    {
      method: "POST",
      body: {
        page,
        perPage: 10,

        filter: {
          city: searchTerms.city || undefined,
          track: searchTerms.track || undefined,
        },

        sort: searchTerms.sort,
      },
      lang: locale,
    }
  );

  // Refetch whenever ANY search term changes
  useEffect(() => {
    refetchTable();
  }, [searchTerms, page]);

  // -------------------------
  // Title
  // -------------------------
  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.schoolsOverView"
    )}`;
  }, [t]);

  if (isLoading || staticsLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );

  if (error || staticsError)
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode}
        errorMessage={error?.response?.data?.message}
      />
    );

  return (
    <main className="flex flex-col gap-6 min-h-screen">
      {/* Info Cards */}
      {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CARDS) &&
        (staticsLoading ? (
          <InfoCardsSkeleton />
        ) : (
          <InfoCardsListing infoData={staticsData} />
        ))}

      {/* Search and Filters */}
      <Box className="bg-white p-4 rounded-md shadow-md">
        <SearchFilters
          searchTerms={searchTerms}
          onChange={(updated) => {
            setSearchTerms(updated);
            setPage(1); // reset pagination when searching
          }}
          // cities={data}
          // tracks={data}
          sortOptions={sortOptions}
        />
      </Box>

      {/* Listing Section */}
      <Grid container size={{ xs: 12, sm: 6, md: 4, lg: 3 }} spacing={2}>
        {data?.nodes?.map((organization) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={organization.id}>
            <SchoolOverviewCard item={organization} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Pagination
        totalPages={data?.totalPages}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
        pageInfo={data?.pageInfo}
      />
    </main>
  );
};

export default SchoolsOverViewPage;
