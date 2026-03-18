"use client";

import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useFetchData } from "@hooks/data/useFetchData";

import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";

import SuccessBooking from "@components/features/bookingStatus/SuccessBooking";
import FailedBooking from "@components/features/bookingStatus/FailedBooking";

import ringTop from "@assets/sectionBackground/ringTop.png";
import ringBottom from "@assets/sectionBackground/ringBottom.png";
const BookingStatus = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();

  const { data, error, isLoading } = useFetchData(
    `${B2B_END_POINTS.CHECK_BOOKING}/${params.bookingId}`,
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
      <div className="relative py-5 overflow-hidden lg:py-16">
        {data.isBooking ? (
          <>
            <Image
              src={ringTop}
              alt="ring"
              width={400}
              height={400}
              priority={true}
              className={`-z-[1] absolute -start-24 top-10 opacity-50 w-[400px] h-[400px] object-contain ${
                locale === "ar" ? "" : "rotate-180"
              }`}
            />

            <SuccessBooking data={data} />
            <Image
              src={ringBottom}
              alt="ring"
              width={300}
              height={300}
              priority={true}
              className={`-z-[1] absolute opacity-50 w-[300px] h-[300px] object-contain ${
                locale === "ar"
                  ? "end-0 -bottom-10"
                  : "rotate-[270deg] bottom-0 -end-10"
              }`}
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
