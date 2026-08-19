"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";

/* ─── Status Card Config ─── */
const STATUS_CARD_KEYS = [
  "PENDING_PROVIDER_APPROVAL",
  "PENDING",
  "SCHEDULED",
  "ON_HOLD",
  "DONE",
  "REJECTED",
];

/* ─── Single Card ─── */
const StatusCardItem = ({ label, count, loading }) => (
  <div className="flex flex-col items-center justify-center gap-1.5 p-4 bg-white border border-border rounded-xl hover:shadow-card hover:border-mainColor/30 transition-all min-w-[140px] text-center">
    <span className="text-xs sm:text-sm font-medium text-textLight leading-tight">
      {label}
    </span>
    {loading ? (
      <Skeleton variant="text" width={40} height={32} className="rounded" />
    ) : (
      <span className="text-lg sm:text-xl font-bold text-titleColor">
        {count ?? 0}
      </span>
    )}
  </div>
);

/* ─── Skeleton ─── */
export const OrdersStatusCardsSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-border rounded-xl animate-pulse"
      >
        <Skeleton variant="text" width={100} height={18} />
        <Skeleton variant="text" width={40} height={28} />
      </div>
    ))}
  </div>
);

/* ─── Main Component ─── */
const OrdersStatusCards = ({ counts = {}, loading = false }) => {
  const t = useTranslations();

  const cards = useMemo(
    () =>
      STATUS_CARD_KEYS.map((key) => ({
        key,
        label: t(`providerProfile.ordersManagement.statusCards.${key}`),
        count: counts[key] ?? 0,
      })),
    [t, counts]
  );

  if (loading) return <OrdersStatusCardsSkeleton />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <StatusCardItem
          key={card.key}
          label={card.label}
          count={card.count}
          loading={false}
        />
      ))}
    </div>
  );
};

export default memo(OrdersStatusCards);
