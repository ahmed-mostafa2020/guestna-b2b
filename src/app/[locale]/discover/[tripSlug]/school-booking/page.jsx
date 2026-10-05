"use client";

import { useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@mui/material";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";
import PageHeader from "@components/features/schoolRegister/PageHeader";
import SchoolTripBookingForm from "@components/forms/schoolTripBookingForm";
import CustomizedBreadcrumbs from "@components/ui/breadcrumbs/CustomizedBreadcrumbs";

const SchoolTripBookingPage = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();
  const tripSlug = params?.tripSlug;

  // 1. Fetch trip details for available booking days, trip name, etc.
  const {
    data: tripResponse,
    isLoading: isLoadingTrip,
    error: tripError,
  } = useFetchData(
    `${B2B_END_POINTS.TRIPDETAILS}/${tripSlug}`,
    {},
    { lang: locale, enabled: Boolean(tripSlug) }
  );

  const trip = tripResponse?.trip || tripResponse?.data?.trip || null;

  // 2. Fetch school registration lookups (cities, roles, educationSystems, stages)
  const {
    data: lookupsData,
    isLoading: isLoadingLookups,
    error: lookupsError,
  } = useFetchData(
    B2B_END_POINTS.SCHOOL_REGISTER.PAGE,
    {},
    { method: "GET", lang: locale }
  );

  if (lookupsError) {
    console.error("Error fetching school registration lookups:", lookupsError);
  }

  // 3. Fetch services (placeholder endpoint; falls back gracefully to empty array)
  const { data: servicesData } = useFetchData(
    B2B_END_POINTS.MARKET_TEMPLATE.SERVICES,
    {},
    { method: "GET", lang: locale, retry: 0 }
  );

  const services = useMemo(() => {
    const list =
      servicesData?.services ||
      servicesData?.data ||
      trip?.services ||
      trip?.includedServices ||
      [];
    return Array.isArray(list) ? list : [];
  }, [servicesData, trip]);

  // Set document title for SEO and browser tab
  useEffect(() => {
    const tripName = trip?.name || "";
    const baseTitle = t("pagesHead.title.schoolTripBooking");
    document.title = tripName
      ? `${t("pagesHead.appName")} | ${tripName} - ${baseTitle}`
      : `${t("pagesHead.appName")} | ${baseTitle}`;
  }, [t, trip]);

  if (isLoadingTrip || isLoadingLookups) {
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );
  }

  if (tripError) {
    return (
      <ErrorComponent
        statusCode={tripError?.response?.data?.statusCode || 404}
        errorMessage={tripError.response?.data?.message}
      />
    );
  }

  const breadcrumbsList = [
    {
      id: 1,
      type: "link",
      name: t("pagesHead.title.home"),
      link: "",
    },
    {
      id: 2,
      type: "link",
      name: t("pagesHead.title.discover"),
      link: "discover",
    },
    {
      id: 3,
      type: "link",
      name: trip?.name || tripSlug,
      link: `discover/${tripSlug}`,
    },
    {
      id: 4,
      type: "text",
      name: t("pagesHead.title.schoolTripBooking"),
    },
  ];

  return (
    <main className="min-h-screen pb-16 bg-packageDetailsBg">
      <div className="pt-4 px-4 max-w-7xl mx-auto">
        <CustomizedBreadcrumbs breadcrumbsList={breadcrumbsList} />
      </div>

      <PageHeader
        title={t("schoolTripBooking.pageHeader.title")}
        subTitle={t("schoolTripBooking.pageHeader.subTitle")}
      />

      <Container maxWidth="lg" className="mt-8">
        <SchoolTripBookingForm
          trip={trip}
          tripSlug={tripSlug}
          cities={lookupsData?.cities || []}
          roles={lookupsData?.roles || []}
          educationSystems={lookupsData?.educationSystems || []}
          stages={lookupsData?.stages || []}
          services={services}
        />
      </Container>
    </main>
  );
};

export default SchoolTripBookingPage;
