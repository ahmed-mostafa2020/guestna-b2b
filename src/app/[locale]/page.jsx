"use client";

import { useLocale, useTranslations } from "next-intl";
// import { useReportWebVitals } from "next/web-vitals";

import { useEffect } from "react";

import {
  setHomeData,
  setHomeDataLoading,
  setHomeDataError,
} from "@store/home/homeDataSlice";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";

import HeroSection from "@components/features/home/heroSection";
import Plans from "@components/features/home/plans";
import MainCategoriesSection from "@components/features/home/mainCategories";
import MarketingSection from "@components/features/home/marketing";
import Benefits from "@components/features/home/benefits";
import Trips from "@components/features/home/trips/Trips";
import SmallSeparator from "@components/ui/separators/SmallSeparator";
import ResponsiveSeparator from "@components/ui/separators/ResponsiveSeparator";
import FeatureTrips from "@components/features/home/featureTrips";

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
    `${B2B_END_POINTS.HOME}`,
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
        statusCode={error?.response?.data?.statusCode}
        errorMessage={error.response?.data?.message}
      />
    );

  return (
    <>
      <main className="overflow-hidden bg-activityDetailsBg">
        <HeroSection />
        <SmallSeparator />

        <Plans />

        <MainCategoriesSection />
        <SmallSeparator />

        <MarketingSection />
        <SmallSeparator />

        <FeatureTrips />
        <ResponsiveSeparator />

        <Benefits />
        <ResponsiveSeparator />

        <Trips />
        <SmallSeparator />
      </main>
    </>
  );
}
