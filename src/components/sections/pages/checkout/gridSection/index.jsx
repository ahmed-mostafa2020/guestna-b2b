"use client";

import ResponsiveGridLayout from "@components/common/responsiveGridLayout";
import LargeSizeGrid from "./largeSizeGrid";
import SmallSizeGrid from "./smallSizeGrid";

const GridSection = () => {
  return (
    <ResponsiveGridLayout
      LargeSizeGrid={LargeSizeGrid}
      SmallSizeGrid={SmallSizeGrid}
      largeGridPercent={7.25}
      smallGridPercent={4.75}
    />
  );
};

export default GridSection;
