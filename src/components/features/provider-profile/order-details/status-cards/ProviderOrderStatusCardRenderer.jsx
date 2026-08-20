"use client";

import { memo } from "react";
import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";
import ProviderOrderDoneStatusCard from "./ProviderOrderDoneStatusCard";
import ProviderOrderRejectedStatusCard from "./ProviderOrderRejectedStatusCard";

const ProviderOrderStatusCardRenderer = ({ orderData }) => {
  const status = orderData?.status;

  switch (status) {
    case PROVIDER_ORDER_STATUS.DONE:
      return <ProviderOrderDoneStatusCard orderData={orderData} />;

    case PROVIDER_ORDER_STATUS.REJECTED:
    case PROVIDER_ORDER_STATUS.CANCELLED:
      return <ProviderOrderRejectedStatusCard orderData={orderData} />;

    default:
      // Fallback / default status card (e.g. for PENDING, SCHEDULED, ON_HOLD until custom designs are provided)
      return <ProviderOrderDoneStatusCard orderData={orderData} />;
  }
};

export default memo(ProviderOrderStatusCardRenderer);
