import { memo } from "react";

import ResponsiveGridLayout from "@components/common/responsiveGridLayout";
import FeedbackText from "./FeedbackText";
import SuccessImage from "./SuccessImage";

const SuccessBooking = ({ orderId }) => {
  return (
    <ResponsiveGridLayout
      LargeSizeGrid={() => <FeedbackText orderId={orderId} />}
      SmallSizeGrid={SuccessImage}
      largeGridPercent={6}
      smallGridPercent={6}
    />
  );
};

export default memo(SuccessBooking);
