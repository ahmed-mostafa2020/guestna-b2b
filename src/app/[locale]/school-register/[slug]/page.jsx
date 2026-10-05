"use client";

import { useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@mui/material";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

import PageHeader from "@components/features/schoolRegister/PageHeader";
import SchoolTripBookingForm from "@components/forms/schoolTripBookingForm";
import SchoolTripBookingSkeleton from "@components/forms/schoolTripBookingForm/SchoolTripBookingSkeleton";

const SchoolTripBookingPage = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();
  const tripId = params?.slug || params?.tripSlug || params?.id;

  // 1. Fetch select data directly for the market trip: /organizations/market-trip/select/${tripId}
  const {
    data: selectResponse,
    isLoading: isLoadingSelect,
    error: selectError,
  } = useFetchData(
    tripId
      ? `${B2B_END_POINTS.ORGANIZATIONS_MARKET_TRIP.SELECT}/${tripId}`
      : null,
    {},
    {
      method: "GET",
      lang: locale,
      enabled: Boolean(tripId),
      retry: 1,
    }
  );

  // Fallback to school register lookups only if select endpoint returns an error or is unavailable
  const { data: fallbackLookups, isLoading: isLoadingFallback } = useFetchData(
    B2B_END_POINTS.SCHOOL_REGISTER.PAGE,
    {},
    {
      method: "GET",
      lang: locale,
      enabled: Boolean(selectError),
      retry: 0,
    }
  );

  const selectData = selectResponse?.data || selectResponse;

  const isLoading =
    (isLoadingSelect && !selectData && !selectError) ||
    (Boolean(selectError) && isLoadingFallback);

  const cities = useMemo(
    () =>
      selectData?.cities || (selectError ? fallbackLookups?.cities : []) || [],
    [selectData, selectError, fallbackLookups]
  );

  const roles = useMemo(
    () =>
      selectData?.roles || (selectError ? fallbackLookups?.roles : []) || [],
    [selectData, selectError, fallbackLookups]
  );

  const educationSystems = useMemo(
    () =>
      selectData?.educationSystems ||
      (selectError ? fallbackLookups?.educationSystems : []) ||
      [],
    [selectData, selectError, fallbackLookups]
  );

  const stages = useMemo(
    () =>
      selectData?.stages ||
      selectData?.academicStages ||
      (selectError ? fallbackLookups?.stages : []) ||
      [],
    [selectData, selectError, fallbackLookups]
  );

  const grades = useMemo(() => selectData?.grades || [], [selectData]);

  const selectDays = useMemo(
    () =>
      selectData?.bookingDay ||
      selectData?.availableDays ||
      selectData?.days ||
      [],
    [selectData]
  );

  // Set document title for SEO and browser tab
  useEffect(() => {
    const baseTitle = t("pagesHead.title.schoolTripBooking");
    document.title = `${t("pagesHead.appName")} | ${baseTitle}`;
  }, [t]);

  return (
    <main className="min-h-screen pb-16 bg-packageDetailsBg">
      <PageHeader
        title={t("schoolTripBooking.pageHeader.title")}
        subTitle={t("schoolTripBooking.pageHeader.subTitle")}
      />

      <Container maxWidth="lg" className="mt-8">
        {isLoading ? (
          <SchoolTripBookingSkeleton />
        ) : (
          <SchoolTripBookingForm
            tripId={tripId}
            tripSlug={tripId}
            cities={cities}
            roles={roles}
            educationSystems={educationSystems}
            stages={stages}
            grades={grades}
            selectDays={selectDays}
          />
        )}
      </Container>
    </main>
  );
};

export default SchoolTripBookingPage;
