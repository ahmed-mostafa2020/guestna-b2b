"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "@store/discover/discoverSlice";
import { setDiscoverData } from "@store/discover/discoverSlice";

import { useEffect } from "react";

import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import TripsGrid from "@components/sections/pages/discover/gridSection/tripsGrid";
import { usePaginatedTrips } from "@hooks/usePaginatedTrips";

const ActivitiesMarketPage = () => {
  const { currentPage } = useSelector((state) => state.discoverData);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  // Use cached pagination hook
  const { data, isLoading, error, isFetching } = usePaginatedTrips({
    page: currentPage,
    // sortType: null, // No sorting for activities market
    // filter: null, // No filters for activities market
    locale,
  });

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "profile.aside.activitiesMarket"
    )}`;
  }, [t]);

  // Initialize current page on mount
  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [dispatch]);

  // Update Redux store when data changes (for TripsGrid component)
  useEffect(() => {
    if (data) {
      dispatch(setDiscoverData(data));
    }
  }, [data, dispatch]);

  if (error) {
    return (
      <ErrorComponent
        statusCode={error?.response?.status || "404"}
        errorMessage={
          error?.response?.data?.message ||
          error?.message ||
          t("validations.tryAgain")
        }
      />
    );
  }

  if (isLoading) {
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

          {/* Show fetching indicator when loading new page */}
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 text-sm text-mainColor">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mainColor"></div>
              <span>
                {t("profile.myWallet.transactionsPage.table.loading.message")}
              </span>
            </div>
          )}
        </div>
      </section>

      <TripsGrid />
    </>
  );
};

export default ActivitiesMarketPage;
