"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
// Components
import Pagination from "@components/ui/Pagination";
import SchoolOverviewCard from "@components/features/profile/schoolManagementTeam/schoolsOverview/SchoolOverviewCard";
import SchoolOverviewCardSkeleton from "@components/features/profile/schoolManagementTeam/schoolsOverview/SchoolOverviewCardSkeleton";
import SchoolOverviewSearchFilters from "@components/features/profile/schoolManagementTeam/schoolsOverview/SchoolOverviewSearchFilters";
import InfoCardsListing from "@components/features/profile/trips/infoCards/InfoCardsListing";
import InfoCardsSkeleton from "@components/features/profile/trips/infoCards/InfoCardsSkeleton";
import ErrorComponent from "@feedback/error/ErrorComponent";

// Hooks
import { useFetchData } from "@hooks/data/useFetchData";
import { usePermissions } from "@hooks/utils/usePermissions";
import { useLocale, useTranslations } from "next-intl";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";

// Constants
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";

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
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_SCHOOLS_PAGE}
    >
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
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <SchoolOverviewCardSkeleton key={index} />
            ))}
          </div>
        ) : schools.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {schools.map((organization) => (
              <SchoolOverviewCard key={organization._id} item={organization} />
            ))}
          </div>
        ) : (
          <Box className="w-full py-10 flex justify-center items-center flex-col gap-4">
            <Typography className="text-gray-600 font-medium text-center !font-somar !text-lg">
              {t("profile.schools_overview.no_schools_found")}
            </Typography>
          </Box>
        )}

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
    </ProtectedProfilePage>
  );
};

export default SchoolsOverViewPage;
