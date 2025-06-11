"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  setCustomizationData,
  setCustomizationDataError,
  setCustomizationDataLoading,
  setUserId,
} from "@store/customization/customizationSlice";
import {
  setServices,
  setServicesError,
  setServicesLoading,
} from "@store/services/servicesSlice";

import { useEffect } from "react";

import { useFetchData } from "@hooks/useFetchData";
import { END_POINTS } from "@constants/APIs";
import { CUSTOMIZATION_ACTIONS } from "@constants/customizationActions";
import { ensureUserId } from "@utils/userIdManager";
import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import CustomizedBreadcrumbs from "@components/common/breadcrumbs/CustomizedBreadcrumbs";
import GridSection from "@components/sections/pages/customization/gridSection";

import { Container } from "@mui/material";

const TripCustomization = ({ params }) => {
  const firstAvailableDate = useSelector(
    (state) => state.checkoutData.firstAvailableDate
  );
  const firstDayDate = useSelector((state) => state.checkoutData?.firstDayDate);

  const userId = useSelector((state) => state.customizationData.userId);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  // Check and create user ID if needed
  useEffect(() => {
    const currentUserId = ensureUserId();
    dispatch(setUserId(currentUserId));
  }, [dispatch, userId]);

  const { data, error, isLoading } = useFetchData(
    userId
      ? `${END_POINTS.MAIN}${END_POINTS.CUSTOMIZATION_WITH_USERID}/${params.tripSlug}`
      : null,
    {},
    {
      method: "POST",
      body: {
        customTripReqType: CUSTOMIZATION_ACTIONS.INITIATE,
        bookingDay: firstDayDate || firstAvailableDate,
      },

      lang: locale,
      devicespecificid: userId,
      // cacheTime: 0, // Disable caching
      // staleTime: 0, // Treat data as stale immediately
      // refetchOnMount: true, // Always refetch when component mounts

      onSuccess: setCustomizationData,
      onError: setCustomizationDataLoading,
      onLoading: setCustomizationDataError,
    }
  );
  // queryKeySuffix: Date.now(), // Add a unique key (changes on every render)

  const {
    // data: _servicesData,
    error: servicesError,
    isLoading: servicesIsLoading,
  } = useFetchData(
    `${END_POINTS.MAIN}${END_POINTS.SERVICES}`,
    {},
    {
      method: "GET",

      lang: locale,

      onSuccess: setServices,
      onError: setServicesLoading,
      onLoading: setServicesError,
    }
  );

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "customization.breadcrumb"
    )}`;
  }, [t]);

  if (isLoading || servicesIsLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );

  if (error || servicesError)
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode || "404"}
        errorMessage={error?.response?.data?.message}
      />
    );

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
      name: data?.trip?.name,
      link: `discover/${params.tripSlug}`,
    },
    { id: 4, type: "text", name: t("customization.breadcrumb") },
  ];

  return (
    <main className="py-5 lg:py-10 bg-activityDetailsBg">
      <CustomizedBreadcrumbs breadcrumbsList={breadcrumbsList} />
      <Container>
        <h1 className="pb-5 lg:pb-10 text-2xl lg:text-5xl font-semibold lg:leading-[58px]">
          {t("customization.title")}
        </h1>
      </Container>

      <GridSection />
    </main>
  );
};

export default TripCustomization;
