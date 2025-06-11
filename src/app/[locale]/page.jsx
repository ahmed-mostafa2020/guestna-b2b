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

import HeroSection from "@components/sections/heroSection/HeroSection";
import StatusTripsSection from "@components/sections/statusTripsSection/StatusTripsSection";
import HighestActivitiesSection from "@components/sections/highestActivities/HighestActivitiesSection";
import BestSellingSection from "@components/sections/bestSelling/BestSellingSection";
import ActivitiesSection from "@components/sections/womenOnly/ActivitiesSection";
import PackagesSection from "@components/sections/womenOnly/PackagesSection";
import TrendingNowSection from "@components/sections/trendingNow/TrendingNowSection";
import ExclusiveOffersSection from "@components/sections/exclusiveOffers/ExclusiveOffersSection";
import PaymentSection from "@components/sections/paymentSection/PaymentSection";
// import BlogsSection from "@components/sections/blogs/BlogsSection";
import CategoriesSection from "@components/sections/categories/CategoriesSection";
import MostBeautifulPlaces from "@components/sections/mostBeautifulPlaces/MostBeautifulPlaces";
import SmallSeparator from "@components/common/separators/SmallSeparator";
import LargeSeparator from "@components/common/separators/LargeSeparator";

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
      <main className="overflow-hidden bg-homeBg">
        <HeroSection />

        <StatusTripsSection />
        <LargeSeparator />

        <HighestActivitiesSection />
        <SmallSeparator />

        <BestSellingSection />
        <SmallSeparator />

        {data?.womenOnly.length >= 1 && (
          <>
            <ActivitiesSection />
            <LargeSeparator />
          </>
        )}

        {data?.packagesWomenOnly.length >= 1 && (
          <>
            <PackagesSection />
            <LargeSeparator />
          </>
        )}

        <TrendingNowSection />
        <LargeSeparator />

        <ExclusiveOffersSection />
        <LargeSeparator />

        <PaymentSection />
        <LargeSeparator />

        {/* <BlogsSection /> */}
        <CategoriesSection />
        <LargeSeparator />

        <MostBeautifulPlaces />
      </main>
    </>
  );
}
