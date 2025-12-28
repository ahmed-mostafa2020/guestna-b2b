"use client";

import { useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { setDiscoverFilters } from "@store/discover/discoverSlice";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { memo, useCallback, useEffect, useMemo, useState } from "react";

// import { agesIdsList } from "@constants/targetAudiencesIds";
// import getSelectedTargetAudiences from "@utils/getSelectedTargetAudiences";

import SearchAndFilters from "@/src/components/common/searchAndFilters/SearchAndFilters";
import { Box } from "@material-ui/core";

const SortingDropdown = () => {
  // get as a prop searchTerm from the parent component

  const dispatch = useDispatch();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Apply filters
  const { sideFilters, loading } = useSelector(
    (state) => state.discoverSideFilters
  );

  const { filter } = useSelector((state) => state.discoverData);

  // Target audience
  // const selectedTargetAudiences = getSelectedTargetAudiences(
  //   guests,
  //   agesIdsList
  // );

  // Available Seats
  // const availableSeats = Object.values(guests).reduce(
  //   (sum, count) => sum + count,
  //   0
  // );

  // const filter = useMemo(() => {
  //   return buildFilter({
  //     tripsType,
  //     allTripsTypes,
  //     // searchTerm,
  //     checkInDate,
  //     checkOutDate,
  //     activityDayDate,
  //     cities: selectedCities,
  //     budgetRange,
  //     categories: selectedCategories,
  //     languages: selectedLanguages,
  //     // targetAudiences: selectedTargetAudiences,
  //     availableSeats,
  //     rate,
  //     tripType,
  //     tripDuration,
  //     academicStage,
  //   });
  // }, [
  //   tripsType,
  //   allTripsTypes,
  //   // searchTerm,
  //   checkInDate,
  //   checkOutDate,
  //   activityDayDate,
  //   selectedCities,
  //   selectedCategories,
  //   // selectedTargetAudiences,
  //   selectedLanguages,
  //   budgetRange,
  //   availableSeats,
  //   rate,
  //   tripType,
  //   tripDuration,
  //   academicStage,
  // ]);

  // const getNameByValue = (value) => {
  //   const option = sortingList.find((opt) => opt.value === value);
  //   return option ? option.name : "";
  // };

  // const handleSubmit = (chosenSortValue) => {
  //   setIsOpen(false);

  //   dispatch(setSortBy(chosenSortValue));
  //   dispatch(setCurrentPage(1));

  //   // Update the query parameter
  //   updateQueryParams({ sorting: chosenSortValue });

  //   dispatch(
  //     actGetDiscoverTrips({ sortType: chosenSortValue, filter, locale })
  //   );
  // };

  useEffect(() => {
    if (!searchParams) return;

    const urlFilters = {};

    searchParams.forEach((value, key) => {
      urlFilters[key] = value.split(",");
    });

    if (Object.keys(urlFilters).length) {
      dispatch(setDiscoverFilters(urlFilters));
    }
  }, [dispatch, searchParams]);

  const mapOptions = (items, labelKey = "name", valueKey = "_id") =>
    items.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  const handleChange = useCallback(
    (key) => (value) => {
      const values = Array.isArray(value) ? value : [value];

      // Redux update
      dispatch(setDiscoverFilters({ [key]: values }));

      // URL update
      const params = new URLSearchParams(searchParams.toString());

      if (values.length) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [dispatch, router, pathname, searchParams]
  );
  console.log(filter);
  const filters = useMemo(() => {
    const {
      cities = [],
      categories = [],
      stages = [],
      tripsTypes = [],
    } = sideFilters || {};

    return [
      {
        label: t("discover.sideFilters.destinations"),
        key: "cities",
        options: mapOptions(cities),
        value: filter?.cities ?? [],

        onChange: handleChange("cities"),
      },
      {
        label: t("discover.sideFilters.typeOfExperience"),
        key: "categories",
        options: mapOptions(categories),
        value: filter?.categories ?? [],
        multiple: true,
        onChange: handleChange("categories"),
      },
      {
        label: t("discover.sideFilters.academicStages"),
        key: "academicStages",
        options: mapOptions(stages),
        value: filter?.academicStages ?? [],
        multiple: true,
        onChange: handleChange("academicStages"),
      },
      {
        label: t("discover.sideFilters.typeOfTrips"),
        key: "tripsTypes",
        options: mapOptions(tripsTypes, "label", "value"),
        value: filter?.tripsTypes ?? [],
        multiple: true,
        onChange: handleChange("tripsTypes"),
      },
    ];
  }, [sideFilters, filter, t, handleChange]);

  return (
    <Box className="bg-white rounded-xl p-4">
      <SearchAndFilters filters={filters} isLoading={loading === "loading"} />
    </Box>
  );
};

export default memo(SortingDropdown);
