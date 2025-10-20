"use client";

import { useSelector } from "react-redux";

import PaymentForm from "@components/forms/checkout/paymentForm";
import FreeBookingButton from "@components/common/FreeBookingButton";

const LargeSizeGrid = () => {
  const promoCodeData = useSelector(
    (state) => state.promoCode?.promoCodeData?.trip
  );

  const isFreeTrip =
    promoCodeData?.discountedTotalPriceWithVat === 0 ||
    promoCodeData?.basePriceTotalWithVat === 0;
  if (isFreeTrip) {
    return <FreeBookingButton />;
  }

  return <PaymentForm />;
};

export default LargeSizeGrid;
