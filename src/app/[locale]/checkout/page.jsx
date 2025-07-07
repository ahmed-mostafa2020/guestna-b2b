"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  setFinalTripDetailsData,
  setFinalTripDetailsDataError,
  setFinalTripDetailsDataLoading,
} from "@store/checkout/finalTripDetailsSlice";
import { updateFormData } from "@store/forms/checkoutForm/checkoutFormSlice";

import { useEffect } from "react";

import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";

import { useFetchData } from "@hooks/useFetchData";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";
import { agesIdsList } from "@constants/targetAudiencesIds";

import StepperSection from "@components/sections/pages/checkout/stepperSection";
import SmallSeparator from "@components/common/separators/SmallSeparator";
import GridSection from "@components/sections/pages/checkout/gridSection";

import Cookies from "js-cookie";

const Checkout = () => {
  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const {
    tripSlug,
    tripDate,
    firstDayDate,
    isCustomizable,
    firstAvailableDate,
  } = useSelector((state) => state.checkoutData);
  // const tripSlug = useSelector((state) => state.checkoutData.tripSlug);
  // const tripDate = useSelector((state) => state.checkoutData.tripDate);
  // const firstAvailableDate = useSelector(
  //   (state) => state.checkoutData.firstAvailableDate
  // );

  const today = new Date().toISOString().split("T")[0]; // Set time to the start of the day for accurate comparison

  // Check if tripDate is before today or not provided
  const bookingDate =
    tripDate && tripDate >= today
      ? tripDate
      : firstDayDate || firstAvailableDate;

  const tripGuests = useSelector((state) => state.checkoutData.tripGuests);

  const targetAudiences = Object.entries(tripGuests)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => {
      // Find the ID corresponding to the key in agesIdsList
      const id = Object.keys(agesIdsList).find((id) => agesIdsList[id] === key);
      return { targetAudience: id, quantity: value };
    });

  const userId = Cookies.get(CONSTANT_VALUES.USER_ID);

  // Use fetch data, but handle the case where tripSlug is null
  // const { data, error, isLoading } = useFetchData(
  //   tripSlug ? `${END_POINTS.TRIPS}${END_POINTS.CHECKOUT}/${tripSlug}` : null,
  //   {},
  //   {
  //     method: "POST",
  //     body: {
  //       bookingDay: bookingDate,
  //       targetAudiences,
  //       isCustom: isCustomizable,
  //     },

  //     lang: locale,

  //     devicespecificid: userId,

  //     onSuccess: setFinalTripDetailsData,
  //     onError: setFinalTripDetailsDataError,
  //     onLoading: setFinalTripDetailsDataLoading,
  //   }
  // );

  // Get user data
  // const {
  //   data: userData,
  //   error: userDataError,
  //   isLoading: userDataIsLoading,
  // } = useFetchData(
  //   `${END_POINTS.MAIN}${END_POINTS.AUTH.USER_DATA}`,
  //   {},
  //   {
  //     method: "GET",
  //     lang: locale,
  //   }
  // );

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.checkout"
    )}`;
  }, [t]);

  // Conditional rendering based on tripSlug
  if (tripSlug === null) {
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode || "404"}
        errorMessage={
          error?.response?.data?.message || "Please Select A Trip First"
        }
      />
    );
  }

  // if (isLoading || userDataIsLoading)
  //   return (
  //     <div className="w-full min-h-screen centered">
  //       <FullScreenLoading status="pending" />
  //     </div>
  //   );

  // if (error || userDataError)
  //   return (
  //     <ErrorComponent
  //       statusCode={error?.response?.data?.statusCode || "404"}
  //       errorMessage={
  //         error?.response?.data?.message ||
  //         "Please Select Another Date For This Trip"
  //       }
  //     />
  //   );

  // if (userData) {
  //   dispatch(
  //     updateFormData({
  //       name: userData?.name || "",
  //       email: userData?.email || "",
  //       mobile: userData?.phone || "",
  //     })
  //   );
  // }

  return (
    <main className="py-5 lg:py-10 bg-activityDetailsBg">
      {/* <StepperSection tripType={data?.guestnaTripsType} tripSlug={tripSlug} /> */}

      <SmallSeparator />

      <GridSection />
    </main>
  );
};

export default Checkout;
