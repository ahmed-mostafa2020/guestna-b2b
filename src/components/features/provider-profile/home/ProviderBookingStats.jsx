"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";
import {
  Business as B2BIcon,
  Person as B2CIcon,
  Assessment as TotalIcon,
  EventAvailable as ScheduledIcon,
} from "@mui/icons-material";

/* ─── Skeleton ─── */
const MiniStatSkeleton = () => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
    <Skeleton variant="circular" width={36} height={36} />
    <div className="flex flex-col gap-1 w-full">
      <Skeleton variant="text" width="60%" height={14} />
      <Skeleton variant="text" width="35%" height={22} />
    </div>
  </div>
);

export const ProviderBookingStatsSkeleton = () => (
  <div className="bg-white border border-border rounded-xl p-5">
    <Skeleton variant="text" width="50%" height={24} className="mb-4" />
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <MiniStatSkeleton key={i} />
      ))}
    </div>
  </div>
);

/* ─── Mini Stat Card ─── */
const STAT_CONFIGS = [
  { iconBg: "bg-teal-100", iconColor: "text-teal-600", Icon: B2BIcon },
  { iconBg: "bg-amber-100", iconColor: "text-amber-600", Icon: B2CIcon },
  { iconBg: "bg-blue-100", iconColor: "text-blue-600", Icon: TotalIcon },
  {
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    Icon: ScheduledIcon,
  },
];

const MiniStatCard = ({ Icon, iconBg, iconColor, title, value }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div
      className={`flex items-center justify-center w-9 h-9 rounded-full ${iconBg} ${iconColor} shrink-0`}
    >
      <Icon className="!w-5 !h-5" />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-xs text-gray-500 truncate">{title}</span>
      <span className="text-base font-bold text-titleColor">{value ?? 0}</span>
    </div>
  </div>
);

/* ─── Main Component ─── */
const ProviderBookingStats = ({ data, loading }) => {
  const t = useTranslations();

  const stats = useMemo(
    () => [
      {
        id: "b2b",
        title: t("providerProfile.home.analytics.b2bTrips"),
        value: data?.b2bCount ?? 0,
        ...STAT_CONFIGS[0],
      },
      {
        id: "b2c",
        title: t("providerProfile.home.analytics.b2cTrips"),
        value: data?.b2cCount ?? 0,
        ...STAT_CONFIGS[1],
      },
      {
        id: "total",
        title: t("providerProfile.home.analytics.totalTrips"),
        value: data?.total ?? 0,
        ...STAT_CONFIGS[2],
      },
      {
        id: "scheduled",
        title: t("providerProfile.home.analytics.scheduledTrips"),
        value: data?.scheduledCount ?? 0,
        ...STAT_CONFIGS[3],
      },
    ],
    [t, data]
  );

  if (loading) return <ProviderBookingStatsSkeleton />;

  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <h3 className="text-base font-semibold text-mainColor mb-4">
        {t("providerProfile.home.analytics.bookingStats")}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <MiniStatCard
            key={stat.id}
            Icon={stat.Icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ProviderBookingStats);
