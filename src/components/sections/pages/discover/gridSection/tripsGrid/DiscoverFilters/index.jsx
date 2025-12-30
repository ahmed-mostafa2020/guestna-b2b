"use client";

import { useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";

import { SORTING_TYPE } from "@constants/sorting";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import SortingDropdown from "./DiscoverFiltersSection";
import { CONSTANT_VALUES } from "@/src/constants/constantValues";
import {
  setDiscoverSideFiltersData,
  setDiscoverSideFiltersDataError,
  setDiscoverSideFiltersDataLoading,
} from "@/src/store/searchFilter/discoverSideFiltersSlice";
import { B2B_END_POINTS } from "@/src/constants/b2bAPIs";
import { useFetchData } from "@/src/hooks/useFetchData";
import DiscoverFiltersSection from "./DiscoverFiltersSection";

const DiscoverFilters = () => {
  const dispatch = useDispatch();
  const { loading, searchTerm } = useSelector((state) => state.discoverData);
  const locale = useLocale();
  const t = useTranslations();

  console.log({loading ,searchTerm})
  const tripsTypeList = useMemo(
    () => [
      {
        label: t("common.multiDaysTrip"),
        value: CONSTANT_VALUES.PACKAGE,
      },
      {
        label: t("common.oneDayTrip"),
        value: CONSTANT_VALUES.ACTIVITY,
      },
      {
        label: t("common.halfDayTrip"),
        value: CONSTANT_VALUES.HALF_DAY,
      },
    ],
    [t]
  );

  const { data: sideFiltersData } = useFetchData(
    B2B_END_POINTS.DISCOVER_SIDE_FILTERS,
    {},
    {
      method: "GET",
      lang: locale,
      cacheTime: 0,
      staleTime: 0,
      onSuccess: (data) =>
        dispatch(
          setDiscoverSideFiltersData({ ...data, tripsTypes: tripsTypeList })
        ),
      onError: (error) => dispatch(setDiscoverSideFiltersDataError(error)),
      onLoading: (isLoading) =>
        dispatch(setDiscoverSideFiltersDataLoading(isLoading)),
    }
  );

  const sortingList = useMemo(
    () => [
      {
        name: t("discover.sorting.mostPopular"),
        value: SORTING_TYPE.HIGHEST_SELLING,
      },
      { name: t("discover.sorting.newest"), value: SORTING_TYPE.NEWEST },
      { name: t("discover.sorting.oldest"), value: SORTING_TYPE.OLDEST },
      {
        name: t("discover.sorting.highestLover"),
        value: SORTING_TYPE.HIGHEST_LOVER,
      },
      {
        name: t("discover.sorting.highestRate"),
        value: SORTING_TYPE.HIGHEST_RATE,
      },
    ],
    [t]
  );

  return (
    <>
      <div className="w-full">
        <DiscoverFiltersSection />
      </div>
    </>
  );
};

export default DiscoverFilters;
