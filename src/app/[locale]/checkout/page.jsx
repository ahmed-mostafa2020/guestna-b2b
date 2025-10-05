"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import ErrorComponent from "@feedback/error/ErrorComponent";

import GridSection from "@components/sections/pages/checkout/gridSection";

import { Container } from "@mui/material";

const Checkout = () => {
  const t = useTranslations();

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
