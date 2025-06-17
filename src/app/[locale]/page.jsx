"use client";

import { useLocale, useTranslations } from "next-intl";
// import { useReportWebVitals } from "next/web-vitals";

import { useEffect } from "react";

import { END_POINTS } from "@constants/APIs";

import {
  setHomeData,
  setHomeDataLoading,
  setHomeDataError,
} from "@store/home/homeDataSlice";

import { useFetchData } from "@hooks/useFetchData";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";

import HeroSection from "@components/sections/pages/home/heroSection";
import Plans from "@components/sections/pages/home/plans";
import MainCategoriesSection from "@components/sections/pages/home/mainCategories";
import MessagesSection from "@components/sections/pages/home/messages";
import Features from "@components/sections/pages/home/features";

import HighestActivitiesSection from "@components/sections/highestActivities/HighestActivitiesSection";
import BestSellingSection from "@components/sections/bestSelling/BestSellingSection";
import ActivitiesSection from "@components/sections/womenOnly/ActivitiesSection";
import PackagesSection from "@components/sections/womenOnly/PackagesSection";
import ExclusiveOffersSection from "@components/sections/exclusiveOffers/ExclusiveOffersSection";
import PaymentSection from "@components/sections/paymentSection/PaymentSection";
import CategoriesSection from "@components/sections/categories/CategoriesSection";
import MostBeautifulPlaces from "@components/sections/mostBeautifulPlaces/MostBeautifulPlaces";
import ResponsiveSeparator from "@components/common/separators/ResponsiveSeparator";
import LargeSeparator from "@components/common/separators/LargeSeparator";
import SmallSeparator from "@components/common/separators/SmallSeparator";

export default function Home() {
  // useReportWebVitals((metric) => {
  //   console.log(metric);
  // });

  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t("pagesHead.title.home")}`;
  }, [t]);

  const { data, error, isLoading } = useFetchData(
    `${END_POINTS.TRIPS}${END_POINTS.HOME}`,
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

        <MessagesSection />
        <ResponsiveSeparator />

        <Features />
        <ResponsiveSeparator />

        <HighestActivitiesSection />
        <SmallSeparator />

        <BestSellingSection />
        <SmallSeparator />

        {data?.womenOnly.length >= 1 && (
          <>
            <ActivitiesSection />
            <ResponsiveSeparator />
          </>
        )}

        {data?.packagesWomenOnly.length >= 1 && (
          <>
            <PackagesSection />
            <ResponsiveSeparator />
          </>
        )}

        <ExclusiveOffersSection />
        <ResponsiveSeparator />

        <PaymentSection />
        <LargeSeparator />

        {/* <BlogsSection /> */}
        <CategoriesSection />
        <ResponsiveSeparator />

        <MostBeautifulPlaces />
      </main>
    </>
  );
}
