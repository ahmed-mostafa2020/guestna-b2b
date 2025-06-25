"use client";

import { useSelector } from "react-redux";
import { toggleTripDuration } from "@store/searchFilter/searchFilterSlice";

import { memo } from "react";

import CheckboxListing from "../checkboxListing";

const TripDuration = ({ tripDurationsList }) => {
  const selectedTripDurations = useSelector(
    (state) => state.searchFilter.tripDuration
  );

  return (
    <CheckboxListing
      list={tripDurationsList}
      state={selectedTripDurations}
      action={toggleTripDuration}
    />
  );
};

export default memo(TripDuration);
