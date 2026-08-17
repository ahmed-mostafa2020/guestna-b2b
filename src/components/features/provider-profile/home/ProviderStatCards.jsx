"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";
import {
  AccessTime,
  Today,
  CalendarMonth,
  PauseCircleOutline,
} from "@mui/icons-material";

/* ─── Skeleton ─── */
const StatCardSkeleton = () => (
  <div className="flex items-center gap-4 p-5 bg-white border border-border rounded-xl animate-pulse">
    <Skeleton
      variant="circular"
      width={48}
      height={48}
      className="shrink-0"
    />
    <div className="flex flex-col gap-2 w-full">
      <Skeleton variant="text" width="60%" height={16} />
      <Skeleton variant="text" width="40%" height={32} />
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

/* ─── Card Item ─── */
const CARD_STYLES = [
  {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    Icon: AccessTime,
  },
  {
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    Icon: Today,
  },
  {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    Icon: CalendarMonth,
  },
  {
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    Icon: PauseCircleOutline,
  },
];

const StatCardItem = ({ icon: IconComp, iconBg, iconColor, title, value }) => (
  <div className="flex items-center gap-4 p-5 bg-white border border-border rounded-xl hover:shadow-card transition-shadow">
    <div
      className={`flex items-center justify-center w-12 h-12 rounded-full ${iconBg} ${iconColor} shrink-0`}
    >
      <IconComp className="!w-6 !h-6" />
    </div>
    <div className="flex flex-col min-w-0 w-full">
      <span className="text-xs sm:text-sm font-normal text-gray-500 truncate">
        {title}
      </span>
      <span className="text-xl sm:text-2xl font-bold text-titleColor truncate">
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
        value: data?.pendingAskTripsCount ?? 0,
        ...CARD_STYLES[0],
      },
      {
        id: "today",
        title: t("providerProfile.home.cards.todayTrips"),
        value: data?.currentDayTripsCount ?? 0,
        ...CARD_STYLES[1],
      },
      {
        id: "nearest",
        title: t("providerProfile.home.cards.nearestTrip"),
        value: formattedDate,
        ...CARD_STYLES[2],
      },
      {
        id: "onHold",
        title: t("providerProfile.home.cards.onHoldRequests"),
        value: data?.onHoldAskTripsCount ?? 0,
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
