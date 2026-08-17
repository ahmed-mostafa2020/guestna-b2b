"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";
import {
  AccessTime,
  Today,
  CalendarMonth,
  ErrorOutline,
} from "@mui/icons-material";

/* ─── Skeleton ─── */
const StatCardSkeleton = () => (
  <div className="flex items-center gap-4 p-5 bg-white border border-border rounded-2xl animate-pulse">
    <Skeleton
      variant="circular"
      width={52}
      height={52}
      className="shrink-0"
    />
    <div className="flex flex-col gap-2 w-full">
      <Skeleton variant="text" width="60%" height={20} />
      <Skeleton variant="text" width="40%" height={36} />
    </div>
  </div>
);

export const ProviderStatCardsSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <StatCardSkeleton key={i} />
    ))}
  </div>
);

/* ─── Card Configs ─── */
const CARD_STYLES = [
  {
    iconBg: "bg-status-warning-bg",
    iconColor: "text-status-warning-fg",
    Icon: AccessTime,
  },
  {
    iconBg: "bg-status-info-bg",
    iconColor: "text-mainColor",
    Icon: Today,
  },
  {
    iconBg: "bg-status-info-bg",
    iconColor: "text-status-info-fg",
    Icon: CalendarMonth,
  },
  {
    iconBg: "bg-status-danger-bg",
    iconColor: "text-status-danger-fg",
    Icon: ErrorOutline,
  },
];

const StatCardItem = ({ icon: IconComp, iconBg, iconColor, title, value }) => (
  <div className="flex items-center gap-4 p-5 bg-white border border-border rounded-2xl hover:shadow-card transition-all duration-200">
    <div
      className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full ${iconBg} ${iconColor} shrink-0`}
    >
      <IconComp className="!w-6 !h-6 sm:!w-7 sm:!h-7" />
    </div>
    <div className="flex flex-col min-w-0 w-full">
      <span className="text-sm sm:text-base font-medium text-textLight truncate">
        {title}
      </span>
      <span className="text-2xl sm:text-3xl font-bold text-textDark truncate mt-0.5">
        {value ?? 0}
      </span>
    </div>
  </div>
);

/* ─── Main Component ─── */
const ProviderStatCards = ({ data, loading }) => {
  const t = useTranslations();

  const cards = useMemo(() => {
    const isDate = data?.earliestNextTripDay;
    const formattedDate = isDate
      ? new Date(isDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "-";

    return [
      {
        id: "pending",
        title: t("providerProfile.home.cards.pendingRequests"),
        value: data?.pendingAskTripsCount ?? 12,
        ...CARD_STYLES[0],
      },
      {
        id: "today",
        title: t("providerProfile.home.cards.todayTrips"),
        value: data?.currentDayTripsCount ?? 24,
        ...CARD_STYLES[1],
      },
      {
        id: "nearest",
        title: t("providerProfile.home.cards.nearestTrip"),
        value: formattedDate !== "-" ? formattedDate : "08",
        ...CARD_STYLES[2],
      },
      {
        id: "onHold",
        title: t("providerProfile.home.cards.onHoldRequests"),
        value: data?.onHoldAskTripsCount ?? 3,
        ...CARD_STYLES[3],
      },
    ];
  }, [t, data]);

  if (loading) return <ProviderStatCardsSkeleton />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCardItem
          key={card.id}
          icon={card.Icon}
          iconBg={card.iconBg}
          iconColor={card.iconColor}
          title={card.title}
          value={card.value}
        />
      ))}
    </div>
  );
};

export default memo(ProviderStatCards);
