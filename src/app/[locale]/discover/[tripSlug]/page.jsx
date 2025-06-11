"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  setTripDetailsData,
  setTripDetailsDataError,
  setTripDetailsDataLoading,
} from "@store/trips/tripDetailsSlice";
import {
  setTripId,
  setTripSlug,
  clearTripGuests,
  setFirstAvailableDate,
  setTripName,
  setTripCustomization,
} from "@store/checkout/checkoutSlice";

import { useEffect } from "react";

import { END_POINTS } from "@constants/APIs";

import { useFetchData } from "@hooks/useFetchData";
import { CONSTANT_VALUES } from "@constants/constantValues";
import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import GallerySection from "@components/sections/pages/tripDetails/gallerySection";
import CustomizedBreadcrumbs from "@components/common/breadcrumbs/CustomizedBreadcrumbs";
import SmallSeparator from "@components/common/separators/SmallSeparator";
import GridSection from "@components/sections/pages/tripDetails/gridSection";

import AvailableBookingDatesCardSection from "@components/sections/pages/tripDetails/availableBookingDatesSection";
import ReviewsSection from "@components/sections/pages/tripDetails/reviewsSection";
import SimilarExperiencesSection from "@components/sections/pages/tripDetails/similarExperiencesSection";
import BestSellingSection from "@components/sections/pages/tripDetails/bestSellingSection";

const TripDetails = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();

  // const defaultTripDate = useSelector((state) => state.checkoutData.tripDate);
  const tripSlug = useSelector((state) => state.checkoutData.tripSlug);

  const firstAvailableDate = useSelector((state) => {
    const bookingDays = state.tripDetailsData.data?.trip?.bookingDay;
    if (bookingDays && bookingDays.length > 0) {
      return bookingDays[0]?.bookingDay;
    }
    return null;
  });

  const dispatch = useDispatch();

  const { data, error, isLoading } = useFetchData(
    `${END_POINTS.TRIPS}${END_POINTS.TRIPDETAILS}/${params.tripSlug}`,
    {},
    {
      lang: locale,

      onSuccess: setTripDetailsData,
      onError: setTripDetailsDataError,
      onLoading: setTripDetailsDataLoading,
    }
  );

  const tripData = data?.trip;

  // Dispatch clearTripGuests only when tripSlug changes
  useEffect(() => {
    if (params.tripSlug !== tripSlug) {
      dispatch(clearTripGuests());
    }
  }, [dispatch, tripSlug, params.tripSlug]);

  // Save tripId and tripSlug
  useEffect(() => {
    dispatch(setTripId(tripData?._id));
    dispatch(setTripSlug(params.tripSlug));
  }, [dispatch, params.tripSlug, tripData]);

  // Save tripDate , tripName and trip customization
  useEffect(() => {
    // if (defaultTripDate === null || params.tripSlug) {
    //   dispatch(setTripDate(firstAvailableDate));
    // }

    dispatch(setFirstAvailableDate(firstAvailableDate));
    dispatch(setTripName(tripData?.name));

    dispatch(setTripCustomization(false));
  }, [dispatch, tripData, firstAvailableDate]);

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | 
    ${tripData?.name || t("pagesHead.title.tripDetails")}
    `;
  }, [t, tripData]);

  if (isLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );

  if (error)
    return (
      <ErrorComponent
        statusCode={error.response?.data?.statusCode}
        errorMessage={error.response?.data?.message}
      />
    );

  // const pageTitle = useMemo(() => {
  //   const tripName = data?.trip?.name;
  //   return `${t("pagesHead.appName")} | ${
  //     tripName
  //       ? t("pagesHead.title.tripDetails", { tripName })
  //       : t("pagesHead.title.tripDetails")
  //   }`;
  // }, [t, data]);

  // useEffect(() => {
  //   document.title = pageTitle;
  // }, [pageTitle]);

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
    { id: 3, type: "text", name: data?.trip?.name },
  ];

  return (
    <main
      className={`py-5 overflow-hidden ${
        data?.trip?.guestnaTripsType === CONSTANT_VALUES.PACKAGE
          ? "bg-packageDetailsBg"
          : "bg-activityDetailsBg"
      }  lg:py-10`}
    >
      <CustomizedBreadcrumbs breadcrumbsList={breadcrumbsList} />

      <GallerySection />
      <SmallSeparator />

      <GridSection />

      {data?.trip?.bookingDay.length >= 1 && (
        <>
          <SmallSeparator />
          <AvailableBookingDatesCardSection />
        </>
      )}

      {data?.reviews?.length >= 1 && (
        <>
          <SmallSeparator />

          <ReviewsSection reviewsData={data.reviews} />
        </>
      )}

      <SmallSeparator />
      <SimilarExperiencesSection />
      <SmallSeparator />
      <BestSellingSection />
    </main>
  );
};
export default TripDetails;
