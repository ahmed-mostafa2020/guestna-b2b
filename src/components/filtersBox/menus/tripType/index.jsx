"use client";

import { useSelector } from "react-redux";
import { toggleTripType } from "@store/searchFilter/searchFilterSlice";

import CheckboxListing from "../checkboxListing";

const TripType = () => {
  const subCategories = useSelector(
    (state) => state.homeData.items.subCategories
  );

  const tripType = useSelector((state) => state.searchFilter.tripType);

  return (
    <CheckboxListing
      list={subCategories}
      state={tripType}
      action={toggleTripType}
    />
  );
};

export default TripType;
