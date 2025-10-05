"use client";

import { useSelector } from "react-redux";

import PaymentForm from "@components/forms/checkout/paymentForm";
import FreeBookingButton from "@components/common/FreeBookingButton";

const LargeSizeGrid = () => {
  // Get trip data from Redux store with safe access
  const finalTripData = useSelector((state) => state.finalTripDetailsData?.data);
  
  // Check if trip is free
  const isFreeTrip = 
    (finalTripData?.discountedTotalPriceWithVat === 0) || 
    (finalTripData?.basePriceTotalWithVat === 0);

  // Show FreeBookingButton if trip is free, otherwise show PaymentForm
  if (isFreeTrip) {
    return <FreeBookingButton />;
  }

  return <PaymentForm />;
};

export default LargeSizeGrid;
