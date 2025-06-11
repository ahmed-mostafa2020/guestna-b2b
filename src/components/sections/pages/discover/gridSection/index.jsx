"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import ErrorComponent from "@feedback/error/ErrorComponent";
import ResponsiveGridLayout from "@components/common/responsiveGridLayout";
import TripsGrid from "./tripsGrid";
import FilterGrid from "./filterGrid";

const GridSection = () => {
  const { trips } = useSelector((state) => state.discoverData);

  const t = useTranslations();

  return trips.nodes?.length <= 0 ? (
    <ErrorComponent
      statusCode=""
      errorMessage={t("validations.noTrip")}
      notFoundPage={false}
      isResetButton={true}
    />
  ) : (
    <ResponsiveGridLayout
      LargeSizeGrid={FilterGrid}
      SmallSizeGrid={TripsGrid}
      largeGridPercent={3.3}
      smallGridPercent={8.7}
      reverseInMobile={true}
    />
  );
};

export default GridSection;
