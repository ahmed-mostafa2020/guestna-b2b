"use client";

import ResponsiveGridLayout from "@components/ui/responsiveGridLayout";
import LargeSizeGrid from "./largeSizeGrid";
import SmallSizeGrid from "./smallSizeGrid";

const GridSection = () => {
  return (
    <ResponsiveGridLayout
      LargeSizeGrid={SmallSizeGrid}
      SmallSizeGrid={LargeSizeGrid}
      largeGridPercent={4.75}
      smallGridPercent={7.25}
    />
  );
};

export default GridSection;
