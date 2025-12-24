"use client";

import React, { useMemo } from "react";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useLocale, useTranslations } from "next-intl";
import SearchAndFilters from "@/src/components/common/searchAndFilters/SearchAndFilters";
const sortOptions = ["HIGHEST_NAME", "LOWEST_NAME", "NEWEST", "OLDEST"];

const SearchFilters = ({ searchTerms, onChange, isLoading }) => {
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

  const handleFieldChange = (key, value) => {
    onChange({ ...searchTerms, [key]: value });
  };

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
        label: t(`profile.schools_overview.searchFilters.sort_options.${sort}`),
        value: sort,
      })),
    [t]
  );

  const search = {
    label: t("profile.schools_overview.searchFilters.searchPlaceholder"),
    value: searchTerms.name,
    onChange: (value) => handleFieldChange("name", value),
    key: "name",
  };

  const filters = [
    {
      label: t("profile.schools_overview.searchFilters.city"),
      key: "city",
      options: formattedCities,
      value: searchTerms.city,
      onChange: (value) => handleFieldChange("city", value),
    },
    {
      label: t("profile.schools_overview.searchFilters.track"),
      key: "track",
      options: formattedTracks,
      value: searchTerms.track,
      onChange: (value) => handleFieldChange("track", value),
    },
    {
      label: t("profile.schools_overview.searchFilters.sortingBy"),
      key: "sort",
      options: formattedSortOptions,
      value: searchTerms.sort,
      onChange: (value) => handleFieldChange("sort", value),
    },
  ];
  return (
    <SearchAndFilters
      search={search}
      isLoading={isLoading || staticsLoading}
      filters={filters}
    />
  );
};

export default SearchFilters;
