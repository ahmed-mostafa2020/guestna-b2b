"use client";

import { memo } from "react";
import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";
import ProviderOrderDoneStatusCard from "./ProviderOrderDoneStatusCard";
import ProviderOrderRejectedStatusCard from "./ProviderOrderRejectedStatusCard";
import ProviderOrderPendingStatusCard from "./ProviderOrderPendingStatusCard";

const ProviderOrderStatusCardRenderer = ({ orderData, onExpire }) => {
  const status = orderData?.status;

  switch (status) {
    case PROVIDER_ORDER_STATUS.DONE:
      return <ProviderOrderDoneStatusCard orderData={orderData} />;

    case PROVIDER_ORDER_STATUS.REJECTED:
    case PROVIDER_ORDER_STATUS.CANCELLED:
      return <ProviderOrderRejectedStatusCard orderData={orderData} />;

    case PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL:
    case PROVIDER_ORDER_STATUS.PENDING:
    case PROVIDER_ORDER_STATUS.PENDING_COMPANY_APPROVAL:
    case PROVIDER_ORDER_STATUS.SCHEDULED:
    case PROVIDER_ORDER_STATUS.ON_HOLD:
    default:
      return (
        <ProviderOrderPendingStatusCard
          orderData={orderData}
          onExpire={onExpire}
        />
      );
  }
};

export default memo(ProviderOrderStatusCardRenderer);

