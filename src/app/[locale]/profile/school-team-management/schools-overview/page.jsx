"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

// Components
import Pagination from "@components/common/Pagination";
import SchoolOverviewCard from "@components/sections/pages/profile/schoolManagementTeam/schoolsOverview/SchoolOverviewCard";
import SchoolOverviewCardSkeleton from "@components/sections/pages/profile/schoolManagementTeam/schoolsOverview/SchoolOverviewCardSkeleton";
import SchoolOverviewSearchFilters from "@components/sections/pages/profile/schoolManagementTeam/schoolsOverview/SchoolOverviewSearchFilters";
import InfoCardsListing from "@components/sections/pages/profile/trips/infoCards/InfoCardsListing";
import InfoCardsSkeleton from "@components/sections/pages/profile/trips/infoCards/InfoCardsSkeleton";
import ErrorComponent from "@feedback/error/ErrorComponent";

// Hooks
import { useFetchData } from "@hooks/useFetchData";
import { usePermissions } from "@hooks/usePermissions";
import { useLocale, useTranslations } from "next-intl";

// Constants
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import { Grid } from "@material-ui/core";

const SchoolsOverViewPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const { hasElement } = usePermissions();

  const [page, setPage] = useState(1);

  // SEARCH / FILTER STATE

  const [searchTerms, setSearchTerms] = useState({});

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

  const {
    data,
    error,
    isLoading,
    refetch: refetchOrganizations,
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
          searchTerm: searchTerms.name || undefined,
        },
        sort: searchTerms.sort,
      },
      lang: locale,
    }
  );

  // Refetch when filters change
  useEffect(() => {
    refetchOrganizations();
    console.log(searchTerms);
  }, [searchTerms, page]);

  // Page Title
  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.schoolsOverView"
    )}`;
  }, [t]);

  // Error Handling
  if (error || staticsError) {
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode}
        errorMessage={error?.response?.data?.message}
      />
    );
  }

  const schools = data?.nodes ?? [];

  return (
    <main className="flex flex-col gap-6 min-h-screen">
      {/* Summary Info Cards */}
      {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_MAIN_CARDS) && (
        <>
          {staticsLoading ? (
            <InfoCardsSkeleton />
          ) : (
            <InfoCardsListing infoData={staticsData} />
          )}
        </>
      )}

      {/* Search and Filters */}
      <Box className="bg-white p-4 rounded-md shadow-md">
        <SchoolOverviewSearchFilters
          
          searchTerms={searchTerms}
          setSearchTerms={setSearchTerms}
        />
      </Box>

      {/* Listing Section */}
      <Grid container spacing={2}>
        {/* Loading Skeletons */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <SchoolOverviewCardSkeleton />
            </Grid>
          ))}

        {/* School Cards */}
        {!isLoading &&
          schools.length > 0 &&
          schools.map((organization) => (
            <Grid item xs={12} sm={6} md={4} key={organization._id}>
              <SchoolOverviewCard item={organization} />
            </Grid>
          ))}

        {/* Empty State */}
        {!isLoading && schools.length === 0 && (
          <Box className="w-full py-10 flex justify-center items-center flex-col gap-4">
            <Typography className="text-gray-600 font-medium text-center !font-somar !text-lg">
              {t("profile.schools_overview.no_schools_found")}
            </Typography>
          </Box>
        )}
      </Grid>

      {/* Pagination */}
      {!isLoading && schools.length > 0 && (
        <Pagination
          totalPages={data?.totalPages}
          currentPage={page}
          onPageChange={(newPage) => setPage(newPage)}
          pageInfo={data?.pageInfo}
        />
      )}
    </main>
  );
};

export default SchoolsOverViewPage;
