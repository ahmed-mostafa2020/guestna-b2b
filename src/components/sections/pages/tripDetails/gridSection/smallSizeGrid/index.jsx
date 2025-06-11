"use client";

import { useSelector } from "react-redux";

import PreBookingSection from "@components/common/trips/PreBookingSection";
import BookWithConfidenceSection from "@components/common/trips/BookWithConfidenceSection";

const SmallSizeGrid = () => {
  const data = useSelector((state) => state.tripDetailsData.data);
  const tripData = data?.trip;

  return (
    <>
      <PreBookingSection tripData={tripData} />

      <BookWithConfidenceSection />
    </>
  );
};

export default SmallSizeGrid;
