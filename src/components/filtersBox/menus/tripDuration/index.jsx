"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";
import { toggleTripDuration } from "@store/searchFilter/searchFilterSlice";

import { CONSTANT_VALUES } from "@constants/constantValues";
import CheckboxListing from "../checkboxListing";

const TripDuration = () => {
  const selectedTripDurations = useSelector(
    (state) => state.searchFilter.tripDuration
  );

  const t = useTranslations();

  const tripDurationsList = [
    {
      _id: CONSTANT_VALUES.PACKAGE,
      name: t("common.multiDaysTrip"),
    },
    {
      _id: CONSTANT_VALUES.ACTIVITY,
      name: t("common.oneDayTrip"),
    },
    {
      _id: CONSTANT_VALUES.HALF_DAY,
      name: t("common.halfDayTrip"),
    },
  ];

  return (
    <CheckboxListing
      list={tripDurationsList}
      state={selectedTripDurations}
      action={toggleTripDuration}
    />
  );
};

export default TripDuration;
