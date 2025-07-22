"use client";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useFetchData } from "@hooks/useFetchData";

import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";

import SuccessBooking from "@components/sections/pages/bookingStatus/SuccessBooking";
import FailedBooking from "@components/sections/pages/bookingStatus/FailedBooking";

const BookingStatus = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();

  const { data, error, isLoading } = useFetchData(
    `${B2B_END_POINTS.MAIN}${B2B_END_POINTS.CHECK_BOOKING}/${params.bookingId}`,
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
      <div className="py-10 lg:py-20">
        {data.isBooking ? <SuccessBooking data={data} /> : <FailedBooking />}
      </div>
    </>
  );
};

export default BookingStatus;
