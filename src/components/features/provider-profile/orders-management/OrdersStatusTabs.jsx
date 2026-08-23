"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";

import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";

/* ─── Tab Keys (status values that map to API filter) ─── */
const TAB_KEYS = [
  "all",
  PROVIDER_ORDER_STATUS.PENDING,
  PROVIDER_ORDER_STATUS.ON_HOLD,
  PROVIDER_ORDER_STATUS.SCHEDULED,
  PROVIDER_ORDER_STATUS.DONE,
];

/* ─── Single Tab Button ─── */
const TabButton = ({ tab, isActive, onClick, className = "" }) => (
  <button
    role="tab"
    type="button"
    onClick={onClick}
    aria-selected={isActive}
    className={`flex items-center justify-center gap-1.5 rounded-xl font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-white text-mainColor shadow-sm"
        : "text-white hover:bg-white/15"
    } ${className}`}
  >
    <span>{tab.label}</span>
    <span
      className={`text-xs lg:text-sm font-bold ${
        isActive ? "text-mainColor" : "text-white/90"
      }`}
    >
      ({tab.count})
    </span>
  </button>
);

/* ─── Skeleton ─── */
export const OrdersStatusTabsSkeleton = () => (
  <div className="w-full rounded-2xl bg-mainColor/20 p-2 sm:p-2.5 animate-pulse">
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={46}
          className="rounded-xl"
        />
      ))}
    </div>
  </div>
);

/* ─── Main Component ─── */
const OrdersStatusTabs = ({
  activeTab = "all",
  onTabChange,
  counts = {},
  loading = false,
}) => {
  const t = useTranslations();

  const tabs = useMemo(
    () =>
      TAB_KEYS.map((key) => ({
        key,
        label: t(`providerProfile.ordersManagement.tabs.${key}`),
        count: key === "all" ? counts.all ?? 0 : counts[key] ?? 0,
      })),
    [t, counts]
  );

  if (loading) return <OrdersStatusTabsSkeleton />;

  return (
    <div className="w-full">
      {/* Tabs bar */}
      <div
        role="tablist"
        aria-label={t("providerProfile.ordersManagement.tableTitle")}
        className="w-full rounded-2xl bg-mainColor p-2 sm:p-2.5 shadow-md"
      >
        {/* Desktop / Tablet: Grid layout taking full width */}
        <div className="hidden sm:grid grid-cols-5 gap-2 items-center w-full">
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              tab={tab}
              isActive={activeTab === tab.key}
              onClick={() => onTabChange?.(tab.key)}
              className="py-2.5 px-3 lg:px-6 text-sm lg:text-base"
            />
          ))}
        </div>

        {/* Mobile: Smooth scrollable flex */}
        <div className="flex sm:hidden items-center gap-2 overflow-x-auto scrollbar-hide py-0.5 px-0.5">
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              tab={tab}
              isActive={activeTab === tab.key}
              onClick={() => onTabChange?.(tab.key)}
              className="px-4 py-2 text-xs shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(OrdersStatusTabs);

