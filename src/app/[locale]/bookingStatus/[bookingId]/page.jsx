"use client";

import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useFetchData } from "@hooks/useFetchData";

import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";

import SuccessBooking from "@components/sections/pages/bookingStatus/SuccessBooking";
import FailedBooking from "@components/sections/pages/bookingStatus/FailedBooking";

import ringTop from "@assets/sectionBackground/ringTop.png";
import ringBottom from "@assets/sectionBackground/ringBottom.png";
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
      <div className="relative py-5 lg:py-16">
        {data.isBooking ? (
          <>
            <Image
              src={ringTop}
              alt="ring"
              width={400}
              height={400}
              priority={true}
              className="absolute -start-24 top-10 opacity-60 w-[400px] h-[400px] object-contain"
            />

            <SuccessBooking data={data} />
            <Image
              src={ringBottom}
              alt="ring"
              width={300}
              height={300}
              priority={true}
              className="absolute end-0 -bottom-10 opacity-60 w-[300px] h-[300px] object-contain"
            />
          </>
        ) : (
          <FailedBooking />
        )}
      </div>
    </>
  );
};

export default BookingStatus;
