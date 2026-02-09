"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch } from "react-redux";

import { CONSTANT_VALUES } from "@constants/constantValues";
import {
  setDiscoverSideFiltersData,
  setDiscoverSideFiltersDataError,
  setDiscoverSideFiltersDataLoading,
} from "@store/searchFilter/discoverSideFiltersSlice";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useFetchData } from "@hooks/useFetchData";
import DiscoverFiltersSection from "./DiscoverFiltersSection";

const DiscoverFilters = ({ showFilters, showSearch }) => {
  const dispatch = useDispatch();
  const locale = useLocale();
  const t = useTranslations();

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

  const {  } = useFetchData(
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
  if(!showFilters && !showSearch) return null

  return (
    <>
      <div className="w-full">
        <DiscoverFiltersSection />
      </div>
    </>
  );
};

export default DiscoverFilters;
