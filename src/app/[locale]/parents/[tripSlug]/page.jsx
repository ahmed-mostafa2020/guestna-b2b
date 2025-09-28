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
  setFirstAvailableDate,
  setTripName,
  setTripCustomization,
} from "@store/checkout/checkoutSlice";
import { setUser } from "@store/users/usersSlice";

import { useEffect } from "react";

import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";

import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import { TRIP_STATUS } from "@constants/tripStatus";
import GallerySection from "@components/sections/pages/tripDetails/gallerySection";
import CustomizedBreadcrumbs from "@components/common/breadcrumbs/CustomizedBreadcrumbs";
import SmallSeparator from "@components/common/separators/SmallSeparator";
import GridSection from "@components/sections/pages/tripDetails/gridSection";

import ReviewsSection from "@components/sections/pages/tripDetails/reviewsSection";
import RegisterStudentForm from "@components/forms/registerStudent";

const TripDetails = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();

  const firstAvailableDate = useSelector((state) => {
    const bookingDays = state.tripDetailsData.data?.trip?.bookingDay;
    if (bookingDays && bookingDays.length > 0) {
      return bookingDays[0]?.bookingDay;
    }
    return null;
  });

  const dispatch = useDispatch();

  const { data, error, isLoading } = useFetchData(
    `${B2B_END_POINTS.PARENT_TRIPDETAILS}/${params.tripSlug}`,
    {},
    {
      lang: locale,

      onSuccess: setTripDetailsData,
      onError: setTripDetailsDataError,
      onLoading: setTripDetailsDataLoading,
    }
  );

  const tripData = data?.trip;
  const availableSeats = tripData?.availableSeats;
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

  // useEffect(() => {
  //   dispatch(setUser(USERS.B2B_PARENT));
  // }, [dispatch]);

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
      name: tripData?.categories?.name,
      link: `discover?categories=${tripData?.categories?._id}`,
    },
    { id: 3, type: "text", name: tripData?.name },
  ];

  const endDate = new Date(tripData?.endAvailableBookingDay);
  const currentDate = new Date();

  const isBookingAvailable = endDate > currentDate;

  return (
    <main
      className={`py-5 overflow-hidden ${
        data?.tripsType === CONSTANT_VALUES.PACKAGE
          ? "bg-packageDetailsBg"
          : "bg-activityDetailsBg"
      }  lg:py-10`}
    >
      <CustomizedBreadcrumbs breadcrumbsList={breadcrumbsList} />

      <GallerySection />
      <SmallSeparator />

      <GridSection />

      {data.trip?.reviews?.length >= 1 && (
        <>
          <SmallSeparator />

          <ReviewsSection reviewsData={data.trip?.reviews} />
        </>
      )}

      {tripData?.availableSeats > 0 &&
        tripData?.status === TRIP_STATUS.PENDING &&
        isBookingAvailable && (
          <RegisterStudentForm
            tripMainCategory={tripData?.categories?.formsType}
            availableSeats={availableSeats}
          />
        )}
    </main>
  );
};
export default TripDetails;
