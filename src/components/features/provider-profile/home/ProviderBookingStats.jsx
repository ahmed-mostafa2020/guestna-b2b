"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";
import {
  DomainOutlined,
  PersonOutline,
  LayersOutlined,
  CalendarTodayOutlined,
  TrendingUp,
} from "@mui/icons-material";

/* ─── Skeleton ─── */
const MiniStatSkeleton = () => (
  <div className="flex flex-col justify-between p-4 bg-gray-50/70 border border-gray-100 rounded-xl animate-pulse min-h-[110px]">
    <div className="flex items-start justify-between">
      <Skeleton variant="text" width="60%" height={16} />
      <Skeleton variant="circular" width={32} height={32} />
    </div>
    <div className="flex flex-col gap-1 mt-2">
      <Skeleton variant="text" width="40%" height={28} />
      <Skeleton variant="text" width="70%" height={14} />
    </div>
  </div>
);

export const ProviderBookingStatsSkeleton = () => (
  <div className="bg-white border border-border rounded-2xl p-5 h-full flex flex-col justify-between">
    <Skeleton variant="text" width="40%" height={26} className="mb-4" />
    <div className="grid grid-cols-2 gap-3.5 flex-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <MiniStatSkeleton key={i} />
      ))}
    </div>
  </div>
);

/* ─── Configs ─── */
const STAT_CONFIGS = [
  { iconBg: "bg-[#E6F8F6]", iconColor: "text-[#007473]", Icon: DomainOutlined, hasGrowth: true },
  { iconBg: "bg-[#FFF4E6]", iconColor: "text-[#ED8A22]", Icon: PersonOutline, hasGrowth: true },
  { iconBg: "bg-[#EBF3FC]", iconColor: "text-[#2B78D4]", Icon: LayersOutlined, hasGrowth: true },
  { iconBg: "bg-[#EBF7EE]", iconColor: "text-[#34A853]", Icon: CalendarTodayOutlined, hasGrowth: false },
];

const BookingStatCard = ({ Icon, iconBg, iconColor, title, value, hasGrowth, growthText }) => (
  <div className="flex flex-col justify-between p-4 bg-[#F8FAFC] border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
    {/* Top: Title + Icon */}
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-gray-500 font-medium leading-snug">
        {title}
      </span>
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${iconBg} ${iconColor} shrink-0`}
      >
        <Icon className="!w-4 !h-4" />
      </div>
    </div>

    {/* Bottom: Number + Growth tag */}
    <div className="flex flex-col mt-2">
      <span className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
        {value ?? 0}
      </span>
      {hasGrowth && (
        <span className="flex items-center gap-1 text-[11px] text-[#22C55E] mt-1 font-medium">
          <TrendingUp className="!w-3 !h-3" />
          <span>{growthText}</span>
        </span>
      )}
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
        value: data?.b2bCount ?? 68,
        ...STAT_CONFIGS[0],
      },
      {
        id: "b2c",
        title: t("providerProfile.home.analytics.b2cTrips"),
        value: data?.b2cCount ?? 2,
        ...STAT_CONFIGS[1],
      },
      {
        id: "total",
        title: t("providerProfile.home.analytics.totalTrips"),
        value: data?.total ?? 70,
        ...STAT_CONFIGS[2],
      },
      {
        id: "scheduled",
        title: t("providerProfile.home.analytics.scheduledTrips"),
        value: data?.scheduledCount ?? 2,
        ...STAT_CONFIGS[3],
      },
    ],
    [t, data]
  );

  if (loading) return <ProviderBookingStatsSkeleton />;

  return (
    <div className="bg-white border border-border rounded-2xl p-5 h-full flex flex-col justify-between shadow-sm">
      <h3 className="text-base font-bold text-mainColor mb-4">
        {t("providerProfile.home.analytics.bookingStats")}
      </h3>
      <div className="grid grid-cols-2 gap-3.5 flex-1">
        {stats.map((stat) => (
          <BookingStatCard
            key={stat.id}
            Icon={stat.Icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            title={stat.title}
            value={stat.value}
            hasGrowth={stat.hasGrowth}
            growthText={t("providerProfile.home.analytics.monthGrowth")}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ProviderBookingStats);
