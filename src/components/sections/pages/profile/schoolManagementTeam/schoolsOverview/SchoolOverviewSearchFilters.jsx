"use client";

import React, { useCallback, useMemo } from "react";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useLocale, useTranslations } from "next-intl";
import SearchAndFilters from "@/src/components/common/searchAndFilters/SearchAndFilters";
const sortOptions = ["HIGHEST_NAME", "LOWEST_NAME", "NEWEST", "OLDEST"];

const SchoolOverviewSearchFilters = ({ searchTerms, setSearchTerms }) => {
  const locale = useLocale();
  const t = useTranslations();

  const {
    data,
    isLoading: staticsLoading,
    error,
  } = useFetchData(
    `${B2B_END_POINTS.PROFILE.ORGANIZATIONS.CITIES_TRACKS}`,
    {},
    { lang: locale }
  );

  const cities = data?.cities || [];
  const tracks = data?.tracks || [];

  const handleFieldChange = useCallback(
    (key) => (value) => {
      setSearchTerms((prev) => {
        const updated = { ...prev, [key]: value };
        if (value === null || value === undefined || value === "") {
          delete updated[key];
        }
        return updated;
      });
    },
    [setSearchTerms]
  );

  // Convert objects → autocomplete format

  const formattedCities = useMemo(
    () =>
      cities.map((city) => ({
        label: city.name,
        value: city._id,
      })),
    [cities]
  );

  const formattedTracks = useMemo(
    () =>
      (tracks ?? []).map((track) => ({
        label: `${track.educationSystem} - ${t(
          `schoolRegister.form.gender.options.${
            track.gender === "MALE"
              ? "boys"
              : track.gender === "FEMALE"
              ? "girls"
              : "both"
          }`
        )} - (${track.academicStages.map((x) => x.name).join(", ")})`,
        value: track._id,
      })),
    [tracks, t]
  );

  const formattedSortOptions = useMemo(
    () =>
      sortOptions.map((sort) => ({
        label: t(
          `profile.schools_overview.SchoolOverviewSearchFilters.sort_options.${sort}`
        ),
        value: sort,
      })),
    [t]
  );

  const search = {
    label: t("profile.schools_overview.SchoolOverviewSearchFilters.searchPlaceholder"),
    value: searchTerms.name,
    onChange: handleFieldChange("name"),
    key: "name",
  };
  console.log(searchTerms);
  const filters = [
    {
      label: t("profile.schools_overview.SchoolOverviewSearchFilters.city"),
      key: "city",
      options: formattedCities,
      value: searchTerms.city,
      onChange: handleFieldChange("city"),
    },
    {
      label: t("profile.schools_overview.SchoolOverviewSearchFilters.track"),
      key: "track",
      options: formattedTracks,
      value: searchTerms.track,
      onChange: handleFieldChange("track"),
    },
    {
      label: t("profile.schools_overview.SchoolOverviewSearchFilters.sortingBy"),
      key: "sort",
      options: formattedSortOptions,
      value: searchTerms.sort,
      onChange: handleFieldChange("sort"),
    },
  ];
  return (
    <SearchAndFilters
      showTitle
      search={search}
      isLoading={staticsLoading}
      filters={filters}
    />
  );
};

export default SchoolOverviewSearchFilters;
