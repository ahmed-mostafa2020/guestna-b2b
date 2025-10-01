"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { actGetDiscoverTrips } from "@store/discover/act/actGetDiscoverTrips";

import { useEffect } from "react";

import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import TripsGrid from "@components/sections/pages/discover/gridSection/tripsGrid";

const ActivitiesMarketPage = () => {
  const { trips, loading, error } = useSelector((state) => state.discoverData);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "profile.aside.activitiesMarket"
    )}`;
  }, [t]);

  useEffect(() => {
    dispatch(actGetDiscoverTrips({ locale }));
  }, []);

  if (error) {
    return (
      <ErrorComponent
        statusCode={error?.statusCode || "404"}
        errorMessage={error?.message || t("validations.tryAgain")}
      />
    );
  }

  if (loading === "loading") {
    return <FullScreenLoading status="pending" />;
  }

  return (
    <>
      <section className="pt-8 pb-6 bg-gradient-to-br from-gray-100 to-gray-200 mb-4 lg:mb-8">
        <div className="centered gap-4 flex-col text-center ">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-foreground">
            {t("profile.aside.activitiesMarketTitle")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("profile.aside.activitiesMarketDescription")}
          </p>
        </div>
      </section>

      <TripsGrid />
    </>
  );
};

export default ActivitiesMarketPage;
