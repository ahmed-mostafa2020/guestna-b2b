"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@mui/material";

import { useFetchData } from "@hooks/data/useFetchData";
import { useSchoolRegisterAccess } from "@hooks/schoolRegister/useSchoolRegisterAccess";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

import PageHeader from "@components/features/schoolRegister/PageHeader";
import SchoolRegisterAccessDenied from "@components/features/schoolRegister/SchoolRegisterAccessDenied";
import SchoolTripBookingForm, {
  AuthSchoolTripBookingForm,
} from "@components/forms/schoolTripBookingForm";
import SchoolTripBookingSkeleton from "@components/forms/schoolTripBookingForm/SchoolTripBookingSkeleton";

const SchoolTripBookingPage = ({ params }) => {
  const routeParams = useParams();
  const locale = useLocale();
  const t = useTranslations();
  const tripId =
    params?.slug ||
    params?.tripSlug ||
    params?.id ||
    routeParams?.slug ||
    routeParams?.tripSlug ||
    routeParams?.id;

  const access = useSchoolRegisterAccess();

  // Set once a visitor registers: they get logged in right away, so keep the
  // visitor form mounted until the redirect to the success page completes
  const [isRegistered, setIsRegistered] = useState(false);
  const isAuth = access.isAuth && !isRegistered;
  const isBlocked = access.isBlocked && !isRegistered;
  const { isProvider } = access;

  // 1. Fetch select data directly for the market trip: /organizations/market-trip/select/${tripId}
  const {
    data: selectResponse,
    isLoading: isLoadingSelect,
    error: selectError,
  } = useFetchData(
    tripId && !isBlocked
      ? `${B2B_END_POINTS.ORGANIZATIONS_MARKET_TRIP.SELECT}/${tripId}`
      : null,
    {},
    {
      method: "GET",
      lang: locale,
      enabled: Boolean(tripId) && !isBlocked,
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

  // { min, max } bounds for the students count
  const availableSeats = selectData?.availableSeats;

  const selectDays = useMemo(() => {
    const raw =
      selectData?.bookingDay ||
      selectResponse?.bookingDay ||
      selectData?.trip?.bookingDay ||
      selectResponse?.trip?.bookingDay ||
      selectResponse?.data?.bookingDay ||
      selectResponse?.data?.trip?.bookingDay ||
      selectData?.availableDays ||
      selectResponse?.availableDays ||
      selectData?.days ||
      selectResponse?.days ||
      [];
    return Array.isArray(raw) ? raw : [];
  }, [selectData, selectResponse]);

  const tripData = useMemo(() => {
    const base =
      selectData?.trip ||
      selectResponse?.trip ||
      (selectData?._id ? selectData : null);
    return {
      ...(base || {}),
      bookingDay: selectDays.length ? selectDays : base?.bookingDay,
    };
  }, [selectData, selectResponse, selectDays]);

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
        {isBlocked ? (
          <SchoolRegisterAccessDenied isProvider={isProvider} />
        ) : isLoading ? (
          <SchoolTripBookingSkeleton />
        ) : isAuth ? (
          <AuthSchoolTripBookingForm
            tripId={tripId}
            tripSlug={tripId}
            trip={tripData}
            cities={cities}
            selectDays={selectDays}
            availableSeats={availableSeats}
          />
        ) : (
          <SchoolTripBookingForm
            tripId={tripId}
            tripSlug={tripId}
            trip={tripData}
            educationSystems={educationSystems}
            stages={stages}
            selectDays={selectDays}
            availableSeats={availableSeats}
            onRegistered={() => setIsRegistered(true)}
          />
        )}
      </Container>
    </main>
  );
};

export default SchoolTripBookingPage;
