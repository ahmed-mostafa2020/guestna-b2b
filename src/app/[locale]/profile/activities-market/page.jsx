"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import banner from "@assets/sectionBackground/discover.webp";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setDiscoverDataLoading,
} from "@store/discover/discoverSlice";
import { setDiscoverData } from "@store/discover/discoverSlice";

import { useEffect, useRef } from "react";

import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";
import { PERMISSIONS } from "@constants/permissions";
import TripsGrid from "@components/sections/pages/discover/gridSection/tripsGrid";
import { usePaginatedTrips } from "@hooks/usePaginatedTrips";

const ActivitiesMarketPage = () => {
  const { currentPage, filter } = useSelector((state) => state.discoverData);
  const searchParams = useSearchParams();
  const router = useRouter();
  const isInitialMount = useRef(true);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();
  const isFirstLoad = useRef(true);

  // Get page from URL or default to 1
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;

  // Use cached pagination hook
  const { data, isLoading, error, isFetching } = usePaginatedTrips({
    page: currentPage,
    locale,
    filter: { ...filter },
  });

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "profile.aside.activitiesMarket"
    )}`;
  }, [t]);

  // Initialize current page from URL on mount
  useEffect(() => {
    if (isInitialMount.current) {
      dispatch(setCurrentPage(pageFromUrl));
      isInitialMount.current = false;
    }
  }, [dispatch, pageFromUrl]);
  useEffect(() => {
    if (isLoading || isFetching) {
      dispatch(setDiscoverDataLoading("loading"));
    }
  }, [isLoading, isFetching]);

  // Update URL when currentPage changes (skip on initial mount)
  useEffect(() => {
    // Skip if this is the initial mount
    if (isInitialMount.current) {
      return;
    }

    // Skip if URL already matches current page
    if (currentPage === pageFromUrl) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (currentPage === 1) {
      params.delete("page");
    } else {
      params.set("page", currentPage.toString());
    }
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.push(`/${locale}/profile/activities-market${newUrl}`, {
      scroll: false,
    });
  }, [currentPage, pageFromUrl, router, searchParams, locale]);

  useEffect(() => {
    if (data && isFirstLoad.current) {
      isFirstLoad.current = false;
    }
  }, [data]);
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

  if (isLoading && isFirstLoad.current) {
    return <FullScreenLoading status="pending" />;
  }

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_ACTIVITIES_MARKET_PAGE}
    >
      <section
        style={{
          backgroundImage: `url(${banner.src})`,
        }}
        className="  bg-cover bg-center mb-4 lg:mb-8"
      >
        <div className=" pt-8 pb-6 bg-activities-market-gradient centered gap-4 flex-col text-center  bg-cover text-white font-ibm ">
          <h1 className="text-xl lg:text-6xl font-medium mb-4 text-foreground">
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

      <TripsGrid showFilters />
    </ProtectedProfilePage>
  );
};

export default ActivitiesMarketPage;
