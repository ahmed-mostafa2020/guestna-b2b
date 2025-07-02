"use client";

import { useLocale, useTranslations } from "next-intl";
// import { useReportWebVitals } from "next/web-vitals";

import { useEffect } from "react";

import {
  setHomeData,
  setHomeDataLoading,
  setHomeDataError,
} from "@store/home/homeDataSlice";

import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";

import HeroSection from "@components/sections/pages/home/heroSection";
import Plans from "@components/sections/pages/home/plans";
import MainCategoriesSection from "@components/sections/pages/home/mainCategories";
import MarketingSection from "@components/sections/pages/home/marketing";
import Benefits from "@components/sections/pages/home/benefits";
import Trips from "@components/sections/pages/home/trips/Trips";
import SmallSeparator from "@components/common/separators/SmallSeparator";
import FeatureTrips from "@components/sections/pages/home/featureTrips";

import ParentTrip from "@components/sections/pages/home/ParentTrip";

export default function Home() {
  // useReportWebVitals((metric) => {
  //   console.log(metric);
  // });

  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t("pagesHead.title.home")}`;
  }, [t]);

  const { error, isLoading } = useFetchData(
    `${B2B_END_POINTS.MAIN}${B2B_END_POINTS.HOME}`,
    {}, // no additional params
    {
      lang: locale,
      cacheTime: 0,
      staleTime: 0,

      onSuccess: setHomeData,
      onError: setHomeDataLoading,
      onLoading: setHomeDataError,
    }
  );

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
    <>
      <main className="overflow-hidden bg-activityDetailsBg">
        <HeroSection />

        <Plans />

        <MainCategoriesSection />
        <SmallSeparator />

        <MarketingSection />
        <SmallSeparator />

        <FeatureTrips />
        <SmallSeparator />

        <Benefits />
        <SmallSeparator />

        <Trips />
        <SmallSeparator />

        <ParentTrip />
      </main>
    </>
  );
}
