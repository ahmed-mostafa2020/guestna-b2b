"use client";

import { memo } from "react";
import ProviderOrderDetailsHeader from "./ProviderOrderDetailsHeader";
import ProviderOrderStatsCards from "./ProviderOrderStatsCards";
import ProviderOrderGroupCard from "./ProviderOrderGroupCard";
import ProviderOrderFinancialCard from "./ProviderOrderFinancialCard";
import ProviderOrderScheduleCard from "./ProviderOrderScheduleCard";
import ProviderOrderServicesCard from "./ProviderOrderServicesCard";
import ProviderOrderStatusCardRenderer from "./status-cards/ProviderOrderStatusCardRenderer";
import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";

const ProviderOrderDetailsContent = ({ orderData }) => {
  const status = orderData?.status;
  const isCancelledOrRejected =
    status === PROVIDER_ORDER_STATUS.CANCELLED ||
    status === PROVIDER_ORDER_STATUS.REJECTED;

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full pb-10 font-somar">
      {/* 1. Header (Breadcrumbs, Title, Status Badge, Actions) */}
      <ProviderOrderDetailsHeader orderData={orderData} />

      {/* 2. Top Summary Stat Cards (Rendered for DONE and other active statuses) */}
      {!isCancelledOrRejected && (
        <ProviderOrderStatsCards orderData={orderData} />
      )}

      {/* 3. Main Content Grid: Main Column (Right in RTL) + Side Column (Left in RTL) */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Main Column (8 cols) -> Right Side in RTL */}
        <section className="lg:col-span-8 flex flex-col gap-5">
          {/* Status Specific Card */}
          <ProviderOrderStatusCardRenderer orderData={orderData} />

          {/* Schedule / Timeline Card */}
          <ProviderOrderScheduleCard orderData={orderData} />

          {/* Booked Services Card */}
          <ProviderOrderServicesCard orderData={orderData} />
        </section>

        {/* Side Column (4 cols) -> Left Side in RTL */}
        <aside className="lg:col-span-4 flex flex-col gap-5">
          <ProviderOrderGroupCard orderData={orderData} />
          <ProviderOrderFinancialCard orderData={orderData} />
        </aside>
      </main>
    </div>
  );
};

export default memo(ProviderOrderDetailsContent);
