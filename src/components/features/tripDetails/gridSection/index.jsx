import ResponsiveGridLayout from "@components/ui/responsiveGridLayout";
import LargeSizeGrid from "./largeSizeGrid";
import SmallSizeGrid from "./smallSizeGrid";

const GridSection = () => {
  return (
    <ResponsiveGridLayout
      LargeSizeGrid={LargeSizeGrid}
      SmallSizeGrid={SmallSizeGrid}
    />
  );
};

export default GridSection;
