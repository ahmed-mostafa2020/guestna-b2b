"use client";

import { useSelector } from "react-redux";

import PriceDetailsSection from "./priceDetailsSection";
import TripLastDetailsSection from "./tripLastDetailsSection";
import BookWithConfidenceSection from "@components/common/trips/BookWithConfidenceSection";

const SmallSizeGrid = () => {
  const finalTripDetails = useSelector(
    (state) => state.finalTripDetailsData?.data
  );

  return (
    <>
      <PriceDetailsSection finalTripDetails={finalTripDetails} />

      <TripLastDetailsSection finalTripDetails={finalTripDetails} />

      <BookWithConfidenceSection />
    </>
  );
};

export default SmallSizeGrid;
