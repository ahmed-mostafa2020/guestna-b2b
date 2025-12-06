"use client";

import { useSelector } from "react-redux";

import PaymentForm from "@components/forms/checkout/paymentForm";
import FreeBookingButton from "@components/common/FreeBookingButton";

const LargeSizeGrid = () => {
  const tripBasePrice = useSelector(
    (state) => state.finalTripDetailsData?.data?.basePriceTotalWithVat
  );

  const promoCodeData = useSelector(
    (state) => state.promoCode?.promoCodeData?.trip
  );

  console.log("tripBasePrice", tripBasePrice);

  const isFreeTrip =
    tripBasePrice === 0 ||
    promoCodeData?.discountedTotalPriceWithVat === 0 ||
    promoCodeData?.basePriceTotalWithVat === 0;
  if (isFreeTrip) {
    return <FreeBookingButton />;
  }

  return <PaymentForm />;
};

export default LargeSizeGrid;
