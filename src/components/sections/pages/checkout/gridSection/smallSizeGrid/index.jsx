"use client";

import { useSelector } from "react-redux";

import PriceDetailsSection from "./priceDetailsSection";
import TripLastDetailsSection from "./tripLastDetailsSection";
import BookWithConfidenceSection from "@components/common/trips/BookWithConfidenceSection";
import FreeBookingButton from "@components/common/FreeBookingButton";

const SmallSizeGrid = () => {
  const finalTripDetails = useSelector(
    (state) => state.finalTripDetailsData?.data
  );

  // Check if trip is free
  const isFreeTrip = 
    (finalTripDetails?.discountedTotalPriceWithVat === 0) || 
    (finalTripDetails?.basePriceTotalWithVat === 0);

  // For free trips, show a simplified layout with the free booking button
  if (isFreeTrip) {
    return (
      <>
        <TripLastDetailsSection finalTripDetails={finalTripDetails} />
        
        <div className="mb-6">
          <FreeBookingButton />
        </div>

        <BookWithConfidenceSection />
      </>
    );
  }

  return (
    <>
      <PriceDetailsSection finalTripDetails={finalTripDetails} />

      <TripLastDetailsSection finalTripDetails={finalTripDetails} />

      <BookWithConfidenceSection />
    </>
  );
};

export default SmallSizeGrid;
