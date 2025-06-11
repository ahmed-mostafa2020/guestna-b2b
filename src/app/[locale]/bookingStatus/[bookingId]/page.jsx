"use client";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import { END_POINTS } from "@constants/APIs";
import { useFetchData } from "@hooks/useFetchData";

import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ResponsiveGridLayout from "@components/common/responsiveGridLayout";

import FeedbackText from "@components/sections/pages/bookingStatus/FeedbackText";
import SuccessImage from "@components/sections/pages/bookingStatus/SuccessImage";

const BookingStatus = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();

  const { data, error, isLoading } = useFetchData(
    `${END_POINTS.PAYMENTS}${END_POINTS.CHECK_BOOKING}/${params.bookingId}`,
    {},
    {
      method: "GET",

      lang: locale,
    }
  );

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.bookingStatus"
    )}`;
  }, [t]);

  if (isLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );

  if (error)
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode}
        errorMessage={error?.response?.data?.message}
      />
    );

  return (
    <>
      {data.isBooking && (
        <div className="py-20">
          <ResponsiveGridLayout
            LargeSizeGrid={() => <FeedbackText orderId={data.orderId} />}
            SmallSizeGrid={SuccessImage}
            largeGridPercent={6}
            smallGridPercent={6}
          />
        </div>
      )}
    </>
  );
};

export default BookingStatus;
