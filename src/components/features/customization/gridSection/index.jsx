"use client";

import { useParams } from "next/navigation";

import { useSelector } from "react-redux";

import ResponsiveGridLayout from "@components/ui/responsiveGridLayout";
import LargeSizeGrid from "./largeSizeGrid";
import SmallSizeGrid from "./smallSizeGrid";

const GridSection = () => {
  const activitiesList = useSelector(
    (state) => state.customizationData.info?.custom?.activities
  );

  const packageDays = activitiesList?.map((item) => ({
    dayNumber: item.day,
    dayDate: item.dayDate,
  }));

  const params = useParams();
  return (
    <ResponsiveGridLayout
      LargeSizeGrid={() => (
        <LargeSizeGrid tripSlug={params.tripSlug} packageDays={packageDays} />
      )}
      SmallSizeGrid={() => <SmallSizeGrid packageDays={packageDays} />}
      largeGridPercent={7.5}
      smallGridPercent={4.5}
      reverseInMobile={true}
    />
  );
};

export default GridSection;
