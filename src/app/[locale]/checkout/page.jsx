"use client";

import { useEffect, useRef } from "react";

import { useTranslations } from "next-intl";

import { useSelector, useDispatch } from "react-redux";
import { clearFinalTripDetailsData } from "@store/checkout/finalTripDetailsSlice";

import ErrorComponent from "@feedback/error/ErrorComponent";

import GridSection from "@components/sections/pages/checkout/gridSection";

import { Container } from "@mui/material";

const Checkout = () => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const timeoutRef = useRef(null);

  const tripSlug = useSelector((state) => state.finalTripDetailsData?.data?.slug);
  const finalTripData = useSelector((state) => state.finalTripDetailsData?.data);
  
  // Check if trip is free
  const isFreeTrip = 
    (finalTripData?.discountedTotalPriceWithVat === 0) || 
    (finalTripData?.basePriceTotalWithVat === 0);

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.checkout"
    )}`;
  }, [t]);

  // Clear finalTripDetailsData after 15 minutes on checkout page
  useEffect(() => {
    // Set timeout for 15 minutes (900000 ms)
    timeoutRef.current = setTimeout(() => {
      console.log("15 minutes elapsed - Clearing checkout data");
      dispatch(clearFinalTripDetailsData());
    }, 15 * 60 * 1000);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dispatch]);

  // Conditional rendering based on tripSlug
  if (!tripSlug) {
    return (
      <ErrorComponent
        statusCode="404"
        errorMessage={t("forms.validation.registerChild")}
      />
    );
  }

  return (
    <main className="py-5 lg:py-10 bg-activityDetailsBg">
      <Container maxWidth="lg">
        <h2 className="text-lg font-semibold lg:text-[28px] lg:pb-12 pb-6">
          {isFreeTrip ? t("forms.freeBooking.title") : t("forms.paymentMethodsForm.title")}
        </h2>
      </Container>

      <GridSection />
    </main>
  );
};

export default Checkout;
