"use client";

import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "@store/discover/discoverSlice";

import { useMemo, useRef, useCallback } from "react";

import ErrorComponent from "@feedback/error/ErrorComponent";
import TripsCard from "@components/common/trips/TripsCard";

import Pagination from "@components/common/Pagination";
import TripsCardSkeleton from "@components/common/trips/TripsCardSkeleton";

import InfoIcon from "@mui/icons-material/Info";
import DiscoverFilters from "./DiscoverFilters";

const SKELETON_COUNT = 6;

const TripsGrid = ({ showFilters = false }) => {
  const dispatch = useDispatch();
  const t = useTranslations();

  const { trips, currentPage, loading } = useSelector(
    (state) => state.discoverData
  );

  const targetRef = useRef(null);

  // ----------------------------- UI STATES -----------------------------
  const isLoading = loading === "loading";
  const hasNoResult = Boolean(trips?.noResult);
  const hasNoNodes = trips?.nodes?.length === 0;
  const showConvergentHint = Boolean(trips?.isConvergentData);
  const hasTrips = Boolean(trips?.nodes?.length);

  // ---------------------------- SCROLL LOGIC ----------------------------
  const scrollToTop = useCallback(() => {
    targetRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // --------------------------- PAGINATION ---------------------------
  const handlePageChange = useCallback(
    (page) => {
      dispatch(setCurrentPage(page));
      scrollToTop();
    },
    [dispatch, scrollToTop]
  );

  // ----------------------------- RENDERERS -----------------------------
  const renderedTrips = useMemo(
    () =>
      trips?.nodes?.map((trip) => (
        <TripsCard
          key={trip._id}
          activityCard={trip}
          imageWidth={420}
          newDesign
          oneSize
        />
      )),
    [trips?.nodes]
  );

  const renderedSkeletons = useMemo(
    () =>
      Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <TripsCardSkeleton imageWidth={500} key={index} />
      )),
    []
  );

  // ----------------------------- RENDER LOGIC -----------------------------
  const showNoResults = !isLoading && (hasNoResult || hasNoNodes);
  return (
    <div ref={targetRef} className="flex flex-col gap-4 lg:gap-8">
      {showFilters && <DiscoverFilters />}

      <div className="relative">
        {/* Similar results hint */}
        {showConvergentHint && !isLoading && (
          <div className="absolute -top-8 start-0 z-[2] flex items-center gap-1 text-error">
            <InfoIcon fontSize="small" />
            <span className="text-sm font-light">
              {t("discover.similarResult")}
            </span>
          </div>
        )}

        {/* No results */}
        {showNoResults ? (
          <div className="mb-3">
            <ErrorComponent
              statusCode=""
              errorMessage={t("validations.noTrip")}
              notFoundPage={false}
              padding={false}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-2 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? renderedSkeletons : renderedTrips}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && hasTrips && (
        <Pagination
          pageInfo={trips?.pageInfo}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TripsGrid;
