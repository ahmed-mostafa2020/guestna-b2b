"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";

/* ─── Tab Keys (status values that map to API filter) ─── */
const TAB_KEYS = ["all", "PENDING", "ON_HOLD", "SCHEDULED", "DONE"];

/* ─── Skeleton ─── */
export const OrdersStatusTabsSkeleton = () => (
  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton
        key={i}
        variant="rounded"
        width={i === 0 ? 100 : 160}
        height={44}
        className="rounded-full shrink-0"
      />
    ))}
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
    <div className="bg-[#e6fafe] rounded-full p-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange?.(tab.key)}
            className={`flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
              isActive
                ? "bg-white text-mainColor shadow-sm border border-mainColor/20"
                : "text-mainColor/70 hover:text-mainColor hover:bg-white/50"
            }`}
            aria-pressed={isActive}
          >
            <span>{tab.label}</span>
            <span
              className={`text-xs font-semibold ${
                isActive ? "text-mainColor" : "text-mainColor/50"
              }`}
            >
              ({tab.count})
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default memo(OrdersStatusTabs);
