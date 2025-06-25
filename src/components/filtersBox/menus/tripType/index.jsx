"use client";

import { useSelector } from "react-redux";
import { toggleTripType } from "@store/searchFilter/searchFilterSlice";

import { memo } from "react";

import CheckboxListing from "../checkboxListing";

const TripTypeButtonMenu = ({ subCategoriesList }) => {
  const tripType = useSelector((state) => state.searchFilter.tripType);

  return (
    <CheckboxListing
      list={subCategoriesList}
      state={tripType}
      action={toggleTripType}
    />
  );
};

export default memo(TripTypeButtonMenu);
