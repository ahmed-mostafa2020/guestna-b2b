"use client";

import { useLocale, useTranslations } from "next-intl";

import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";
import { useEffect } from "react";
import TripsInfoCardsListing from "@/src/components/sections/pages/profile/createTripLink/TripsInfoCardsListing";

const CreateTripLinkPage = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();
  const tripSlug = params.tripSlug;

  const { data, error, isLoading } = useFetchData(
    `${B2B_END_POINTS.PROFILE.CREATE_TRIP_LINK}/${tripSlug}`,
    {},
    {
      lang: locale,
    }
  );

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | 
      ${
        t("pagesHead.title.createTripLink") + " " + data?.tripData?.name ||
        t("pagesHead.title.createTripLink")
      }
      `;
  }, [t, data]);

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

  return (
    <main className="flex flex-col gap-6">
      <TripsInfoCardsListing data={data} />

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1"> {tripSlug}</div>
        <div className="flex-1"> {tripSlug}</div>
      </div>
    </main>
  );
};

export default CreateTripLinkPage;
