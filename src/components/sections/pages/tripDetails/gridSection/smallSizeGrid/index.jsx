"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import PreBookingSection from "@components/common/trips/PreBookingSection";
import BookWithConfidenceSection from "@components/common/trips/BookWithConfidenceSection";
import Map from "../largeSizeGrid/accordionsGroupSection/accordionsDetails/Map";

const SmallSizeGrid = () => {
  const data = useSelector((state) => state.tripDetailsData.data);

  const t = useTranslations();

  return (
    <>
      <PreBookingSection tripData={data} />

      <BookWithConfidenceSection />

      {data?.location && (
        <div className="flex flex-col gap-3 lg:gap-5">
          <h4 className="text-lg font-semibold text-mainColor lg:text-2xl">
            {t("bookWithConfidence.activityLocation")}
          </h4>

          <Map
            lat={data?.location?.lat || 0}
            lng={data?.location?.lng || 0}
            locationLink={false}
            height="h-48"
          />
        </div>
      )}
    </>
  );
};

export default SmallSizeGrid;
