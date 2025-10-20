"use client";

import { useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import { useSelector, useDispatch } from "react-redux";
import { clearFinalTripDetailsData } from "@store/checkout/finalTripDetailsSlice";
import { resetPromoCode } from "@store/forms/promoCode/promoCodeSlice";

import ErrorComponent from "@feedback/error/ErrorComponent";

import GridSection from "@components/sections/pages/checkout/gridSection";

import { Container, CircularProgress } from "@mui/material";

const Checkout = () => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const timeoutRef = useRef(null);
  const [isDataReady, setIsDataReady] = useState(false);

  const tripSlug = useSelector(
    (state) => state.finalTripDetailsData?.data?.slug
  );
  const finalTripData = useSelector(
    (state) => state.finalTripDetailsData?.data
  );

  const promoCodeData = useSelector(
    (state) => state.promoCode?.promoCodeData?.trip
  );

  // Check if trip is free
  const isFreeTrip =
    promoCodeData?.discountedTotalPriceWithVat === 0 ||
    promoCodeData?.basePriceTotalWithVat === 0;

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.checkout"
    )}`;
  }, [t]);

  // Wait for data to be ready before rendering
  useEffect(() => {
    if (tripSlug && finalTripData) {
      // Add small delay to ensure all data is populated
      const timer = setTimeout(() => {
        setIsDataReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [tripSlug, finalTripData]);

  // Clear finalTripDetailsData after 30 minutes on checkout page
  useEffect(() => {
    // Set timeout for 30 minutes (1800000 ms)
    timeoutRef.current = setTimeout(() => {
      console.log("30 minutes elapsed - Clearing checkout data");
      dispatch(clearFinalTripDetailsData());
    }, 30 * 60 * 1000);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dispatch]);

  // Clear promo code data when navigating away from checkout page
  useEffect(() => {
    return () => {
      // Cleanup promo code data on unmount (when user navigates away)
      dispatch(resetPromoCode());
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

  // Show loading state while data is being prepared
  if (!isDataReady) {
    return (
      <main className="py-5 lg:py-10 bg-activityDetailsBg">
        <Container maxWidth="lg">
          <div className="flex items-center justify-center min-h-[400px]">
            <CircularProgress size={60} sx={{ color: "#ED8A22" }} />
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-5 lg:py-10 bg-activityDetailsBg">
      <Container maxWidth="lg">
        <h2 className="text-lg font-semibold lg:text-[28px] lg:pb-12 pb-6">
          {isFreeTrip
            ? t("forms.freeBooking.title")
            : t("forms.paymentMethodsForm.title")}
        </h2>
      </Container>

      <GridSection />
    </main>
  );
};

export default Checkout;
