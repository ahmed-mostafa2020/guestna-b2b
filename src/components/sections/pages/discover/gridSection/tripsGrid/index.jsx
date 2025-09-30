"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";
import { setCurrentPage } from "@store/discover/discoverSlice";

import { useMemo, useRef } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import ErrorComponent from "@feedback/error/ErrorComponent";
import TripsCard from "@components/common/trips/TripsCard";
import Sorting from "./sorting";
import Pagination from "@components/common/Pagination";

import InfoIcon from "@mui/icons-material/Info";

const TripsGrid = () => {
  const { trips, currentPage, lastPage, totalItems } = useSelector(
    (state) => state.discoverData
  );

  const t = useTranslations();

  const targetRef = useRef(null);

  const scrollingToTop = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const renderedTrips = useMemo(() => {
    return trips?.nodes?.map((trip) => (
      <div key={trip._id} className="flex-1">
        <TripsCard
          activityCard={trip}
          imageWidth={420}
          newDesign={true}
          oneSize={true}
        />
      </div>
    ));
  }, [trips]);

  return (
    <div ref={targetRef} className="flex flex-col gap-4 lg:gap-8">
      <Sorting />

      <div className="relative">
        {trips.isConvergentData && (
          <div className="absolute flex items-center gap-1 z-[2] -top-8 text-error start-0">
            <InfoIcon />
            <h4 className="text-sm font-light">
              {t("discover.similarResult")}
            </h4>
          </div>
        )}

        {trips.noResult && (
          <div className="mb-3">
            <ErrorComponent
              statusCode=""
              errorMessage={t("validations.noTrip")}
              notFoundPage={false}
              isResetButton={true}
              padding={false}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-2 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
          {renderedTrips}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        itemsPerPage={CONSTANT_VALUES.PER_PAGE}
        totalItems={totalItems}
        setCurrentPage={setCurrentPage}
        scrollingToTop={scrollingToTop}
      />
    </div>
  );
};

export default TripsGrid;
