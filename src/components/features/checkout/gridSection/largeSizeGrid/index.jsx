"use client";

import { useSelector } from "react-redux";

import PaymentForm from "@components/forms/checkout/paymentForm";
import FreeBookingButton from "@components/ui/FreeBookingButton";

const LargeSizeGrid = () => {
  const total = useSelector(
    (state) => state.finalTripDetailsData?.data?.total
  );

  const promoCodeData = useSelector(
    (state) => state.promoCode?.promoCodeData?.trip
  );

  const isFreeTrip =
    total === 0 ||
    promoCodeData?.total === 0;
  if (isFreeTrip) {
    return <FreeBookingButton />;
  }

  return <PaymentForm />;
};

export default LargeSizeGrid;
